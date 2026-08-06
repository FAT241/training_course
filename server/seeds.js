require('dotenv').config({
  path:
    require('path').resolve(__dirname, '../.env')
});
const pool = require('./db');
const bcrypt = require('bcrypt');

async function seed() {
  const hashedPassword = await
    bcrypt.hash('Admin@123', 10);

  await pool.query(`
        INSERT INTO department
        (department_name) VALUES
        ('Ban Giám Đốc'),
        ('Phòng Kỹ Thuật'),
    ('Phòng Nhân Sự')
    ON CONFLICT DO NOTHING;
  `);
  // Thêm tài khoản Admin
  await pool.query(`
    INSERT INTO users (email, password, full_name, role)
    VALUES ('admin@fpt.com', $1, 'Quản Trị Viên', 'ADMIN')
    ON CONFLICT (email) DO NOTHING;
  `, [hashedPassword]);
  // Thêm tài khoản Employee
  const empHash = await bcrypt.hash('Emp@123', 10);
  const empResult = await pool.query(`
    INSERT INTO users (email, password, full_name, role)
    VALUES ('employee1@fpt.com', $1, 'Nguyễn Văn A', 'EMPLOYEE')
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `, [empHash]);
  if (empResult.rows.length > 0) {
    await pool.query(`
      INSERT INTO employee (user_id, department_id, rank)
      VALUES ($1, 2, 'Junior')
      ON CONFLICT DO NOTHING;
    `, [empResult.rows[0].id]);
  }

  // ---------------------------------------------------------
  // 1. Tạo Khóa học Demo
  // ---------------------------------------------------------
  const courseResult = await pool.query(`
        INSERT INTO course (course_name, description, course_type, created_by)
        VALUES ('[Demo] Nhập môn ReactJS', 'Khóa học cơ bản dành cho Frontend Developer', 'MANDATORY', 1)
        RETURNING id;
    `);
  const courseId = courseResult.rows[0].id;

  // 2. Phân quyền cho Phòng Kỹ Thuật (department_id = 2)
  await pool.query(`
        INSERT INTO course_permission (course_id, department_id, access_level)
        VALUES ($1, 2, 'RESTRICTED') ON CONFLICT DO NOTHING;
    `, [courseId]);

  // 3. Tạo Chương 1
  const chapterResult = await pool.query(`
        INSERT INTO chapter (course_id, chapter_name, order_index)
        VALUES ($1, 'Chương 1: Các khái niệm cơ bản', 1)
        RETURNING id;
    `, [courseId]);
  const chapterId = chapterResult.rows[0].id;

  // 4. Tạo Bài học
  await pool.query(`
        INSERT INTO lesson (chapter_id, lesson_name, content_type, file_path)
        VALUES ($1, 'Component là gì?', 'VIDEO', '/uploads/demo-video.mp4');
    `, [chapterId]);

  // 5. Tạo Bài kiểm tra (Quiz) cho Chương 1
  const quizResult = await pool.query(`
        INSERT INTO quiz (chapter_id, passing_score)
        VALUES ($1, 5) RETURNING id;
    `, [chapterId]);
  const quizId = quizResult.rows[0].id;

  // 6. Tạo Câu hỏi và Đáp án
  const questionResult = await pool.query(`
        INSERT INTO question (quiz_id, question_content)
        VALUES ($1, 'ReactJS là thư viện hay framework?') RETURNING id;
    `, [quizId]);
  const questionId = questionResult.rows[0].id;

  await pool.query(`
        INSERT INTO answer (question_id, answer_content, is_correct) VALUES 
        ($1, 'Framework', false),
        ($1, 'Thư viện', true),
        ($1, 'Ngôn ngữ lập trình', false);
    `, [questionId]);

  console.log('✅ Seed dữ liệu thành công!');
  process.exit(0);
}
seed().catch(err => {
  console.error('❌ Lỗi seed:', err.message);
  process.exit(1);
});