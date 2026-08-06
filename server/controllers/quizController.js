const pool = require('../db');

const createQuiz = async (req, res) => {
    const { chapterId } = req.params;
    const { passing_score } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO quiz (chapter_id, passing_score)
             VALUES ($1, $2) RETURNING *`,
            [chapterId, passing_score]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const getQuizByChapter = async (req, res) => {
    const { chapterId } = req.params;
    try {
        const quizResult = await pool.query('SELECT * FROM quiz WHERE chapter_id = $1', [chapterId]);
        if (quizResult.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra cho chương này' });

        const quiz = quizResult.rows[0];

        // Lấy câu hỏi
        const questionsResult = await pool.query('SELECT * FROM question WHERE quiz_id = $1', [quiz.id]);

        // Lấy đáp án cho từng câu hỏi
        const questions = await Promise.all(
            questionsResult.rows.map(async (q) => {
                const answersResult = await pool.query('SELECT * FROM answer WHERE question_id = $1', [q.id]);
                // Ẩn is_correct nếu là EMPLOYEE để chống gian lận
                const answers = answersResult.rows.map(a => {
                    if (req.user.role === 'EMPLOYEE') {
                        return { id: a.id, answer_content: a.answer_content };
                    }
                    return a;
                });
                return { ...q, answers };
            })
        );

        res.json({ ...quiz, questions });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const addQuestion = async (req, res) => {
    const { quizId } = req.params;
    const { question_content } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO question (quiz_id, question_content)
             VALUES ($1, $2) RETURNING *`,
            [quizId, question_content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const addAnswer = async (req, res) => {
    const { questionId } = req.params;
    const { answer_content, is_correct } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO answer (question_id, answer_content, is_correct)
             VALUES ($1, $2, $3) RETURNING *`,
            [questionId, answer_content, is_correct]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { createQuiz, getQuizByChapter, addQuestion, addAnswer };
