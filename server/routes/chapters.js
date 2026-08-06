const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Ai cũng xem được đề bài
router.get('/:chapterId/quiz', verifyToken, quizController.getQuizByChapter);

// Chỉ Admin mới được tạo đề, thêm câu hỏi, đáp án
router.post('/:chapterId/quiz', verifyToken, requireAdmin, quizController.createQuiz);
router.post('/quiz/:quizId/questions', verifyToken, requireAdmin, quizController.addQuestion);
router.post('/questions/:questionId/answers', verifyToken, requireAdmin, quizController.addAnswer);

module.exports = router;
