const pool = require('../db');
exports.getCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const empResult = await
            pool.query('SELECT department_id FROM employee WHERE user_id = $1',
                [userId]);
        if (empResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Tài khoản không phải là nhân viên. '
            });
        }
        const departmentId = empResult.rows[0].department_id;
        const query = `
        SELECT c.id, c.course_name,
        c.description, c.course_type,
        COALESCE(lp.completion_percentage, 0) as progress,
        (
            SELECT json_agg(json_build_object(
                'chapter_name', max_qr.chapter_name, 
                'score', max_qr.score, 
                'passing_score', max_qr.passing_score
            ))
            FROM (
                SELECT ch.chapter_name, q.passing_score, ch.course_id, MAX(qr.score) as score
                FROM quiz_result qr
                JOIN quiz q ON qr.quiz_id = q.id
                JOIN chapter ch ON q.chapter_id = ch.id
                WHERE qr.employee_id = $1
                GROUP BY q.id, ch.chapter_name, q.passing_score, ch.course_id
            ) max_qr
            WHERE max_qr.course_id = c.id
        ) as quiz_results
      FROM course c
      LEFT JOIN course_permission cp ON c.id = cp.course_id
      LEFT JOIN learning_progress lp ON c.id = lp.course_id AND lp.employee_id = $1
      WHERE c.course_type = 'PUBLIC' 
         OR (cp.department_id = $2)
      GROUP BY c.id, c.course_name, c.description, c.course_type, lp.completion_percentage
      ORDER BY c.id DESC;
    `;
        const result = await pool.query(query, [userId, departmentId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi lấy khóa học Employee:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const empResult = await pool.query('SELECT department_id FROM employee WHERE user_id = $1', [userId]);
    if (empResult.rows.length === 0) return res.status(403).json({ message: 'Không có quyền' });
    const departmentId = empResult.rows[0].department_id;

    const accessCheck = await pool.query(`
      SELECT c.id FROM course c
      LEFT JOIN course_permission cp ON c.id = cp.course_id
      WHERE c.id = $1 AND (c.course_type = 'PUBLIC' OR cp.department_id = $2)
    `, [courseId, departmentId]);

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập khóa học này.' });
    }

    const courseRes = await pool.query('SELECT * FROM course WHERE id = $1', [courseId]);
    const course = courseRes.rows[0];

    const chaptersRes = await pool.query('SELECT * FROM chapter WHERE course_id = $1 ORDER BY order_index', [courseId]);
    const chapters = chaptersRes.rows;

    for (let chapter of chapters) {
        const lessonsRes = await pool.query('SELECT id, lesson_name, content_type, file_path FROM lesson WHERE chapter_id = $1', [chapter.id]);
        chapter.lessons = lessonsRes.rows;
        
        const quizRes = await pool.query('SELECT id, passing_score FROM quiz WHERE chapter_id = $1', [chapter.id]);
        chapter.quiz = quizRes.rows.length > 0 ? quizRes.rows[0] : null;
    }

    res.json({ ...course, chapters });
  } catch (error) {
    console.error('Lỗi lấy chi tiết khóa học:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quizRes = await pool.query('SELECT * FROM quiz WHERE id = $1', [quizId]);
    if (quizRes.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy quiz' });
    const quiz = quizRes.rows[0];

    const questionsRes = await pool.query('SELECT id, question_content FROM question WHERE quiz_id = $1', [quizId]);
    const questions = questionsRes.rows;

    for (let q of questions) {
      const answersRes = await pool.query('SELECT id, answer_content FROM answer WHERE question_id = $1', [q.id]);
      q.answers = answersRes.rows;
    }
    res.json({ ...quiz, questions });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const quizId = req.params.id;
    const { answers } = req.body; 

    const empRes = await pool.query('SELECT user_id FROM employee WHERE user_id = $1', [userId]);
    if (empRes.rows.length === 0) return res.status(403).json({ message: 'Không có quyền' });
    const employeeId = userId; // foreign key trỏ về users.id

    let rawScore = 0;
    for (let item of answers) {
      const checkRes = await pool.query('SELECT is_correct FROM answer WHERE id = $1 AND question_id = $2', [item.answerId, item.questionId]);
      if (checkRes.rows.length > 0 && checkRes.rows[0].is_correct) rawScore++;
    }

    const totalQuestionsRes = await pool.query('SELECT count(*) as total FROM question WHERE quiz_id = $1', [quizId]);
    const totalQuestions = parseInt(totalQuestionsRes.rows[0].total) || 1;

    // Tính điểm phần trăm (thang điểm 100)
    const score = Math.round((rawScore / totalQuestions) * 100);

    const quizRes = await pool.query('SELECT passing_score, chapter_id FROM quiz WHERE id = $1', [quizId]);
    const passingScore = quizRes.rows[0].passing_score;
    const chapterId = quizRes.rows[0].chapter_id;
    const isPassed = score >= passingScore;

    const chapterRes = await pool.query('SELECT course_id FROM chapter WHERE id = $1', [chapterId]);
    const courseId = chapterRes.rows[0].course_id;

    await pool.query(
      'INSERT INTO quiz_result (score, time_taken, employee_id, quiz_id) VALUES ($1, 0, $2, $3)',
      [score, employeeId, quizId]
    );

    const totalQuizRes = await pool.query('SELECT count(*) as total FROM quiz q JOIN chapter c ON q.chapter_id = c.id WHERE c.course_id = $1', [courseId]);
    const totalQuizzes = parseInt(totalQuizRes.rows[0].total);

    const passedQuizRes = await pool.query('SELECT count(DISTINCT qr.quiz_id) as passed FROM quiz_result qr JOIN quiz q ON qr.quiz_id = q.id JOIN chapter c ON q.chapter_id = c.id WHERE qr.employee_id = $1 AND c.course_id = $2 AND qr.score >= q.passing_score', [employeeId, courseId]);
    const passedQuizzes = parseInt(passedQuizRes.rows[0].passed);

    const completionPercentage = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;

    await pool.query(`
      INSERT INTO learning_progress (completion_percentage, status, employee_id, course_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (employee_id, course_id) 
      DO UPDATE SET completion_percentage = $1, status = $2
    `, [completionPercentage, completionPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS', employeeId, courseId]);

    let newlyCertified = false;
    if (completionPercentage >= 100) {
      const checkCert = await pool.query('SELECT id FROM certificate WHERE employee_id = $1 AND course_id = $2', [employeeId, courseId]);
      if (checkCert.rows.length === 0) {
        const certCode = 'CERT-' + Date.now();
        await pool.query('INSERT INTO certificate (certificate_code, employee_id, course_id) VALUES ($1, $2, $3)', [certCode, employeeId, courseId]);
        newlyCertified = true;
      }
    }

    res.json({ score, passingScore, isPassed, completionPercentage, newlyCertified });
  } catch (error) {
    console.error('Lỗi nộp bài quiz:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const empRes = await pool.query('SELECT user_id FROM employee WHERE user_id = $1', [userId]);
    if (empRes.rows.length === 0) return res.status(403).json({ message: 'Không có quyền' });
    const employeeId = userId;

    const query = `
      SELECT cert.id, cert.certificate_code, cert.issue_date, c.course_name, u.full_name
      FROM certificate cert
      JOIN course c ON cert.course_id = c.id
      JOIN users u ON cert.employee_id = u.id
      WHERE cert.employee_id = $1
      ORDER BY cert.issue_date DESC
    `;
    const result = await pool.query(query, [employeeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Lỗi lấy chứng chỉ:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};