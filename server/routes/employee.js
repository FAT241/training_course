const express = require('express');
const router = express.Router();
const employeeCourseController = require('../controllers/employeeCourseController');
const { verifyToken } = require('../middleware/auth');

// Chỉ cần đăng nhập (verifyToken) là được gọi (Employee nào cũng gọi được)
router.get('/courses', verifyToken, employeeCourseController.getCourses);
router.get('/courses/:id', verifyToken, employeeCourseController.getCourseDetails);
router.get('/quizzes/:id', verifyToken, employeeCourseController.getQuiz);
router.post('/quizzes/:id/submit', verifyToken, employeeCourseController.submitQuiz);
router.get('/certificates', verifyToken, employeeCourseController.getCertificates);

module.exports = router;
