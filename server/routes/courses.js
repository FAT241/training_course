const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

//Khóa hoc
router.get('/', verifyToken, courseController.getAll);
router.get('/:id', verifyToken, courseController.getById);
router.post('/', verifyToken, requireAdmin, courseController.create);
router.put('/:id', verifyToken, requireAdmin, courseController.update);
router.delete('/:id', verifyToken, requireAdmin, courseController.remove);

//Chương
router.post('/:courseId/chapters', verifyToken, requireAdmin, courseController.addChapter);
router.put('/:courseId/chapters/:chapterId', verifyToken, requireAdmin, courseController.updateChapter);
router.delete('/:courseId/chapters/:chapterId', verifyToken, requireAdmin, courseController.removeChapter);

//Bài học
router.post('/:courseId/chapters/:chapterId/lessons', verifyToken, requireAdmin, courseController.addLesson);
router.put('/:courseId/chapters/:chapterId/lessons/:lessonId', verifyToken, requireAdmin, courseController.updateLesson);
router.delete('/:courseId/chapters/:chapterId/lessons/:lessonId', verifyToken, requireAdmin, courseController.removeLesson);

//Phân quyền khóa học
router.post('/:id/permissions', verifyToken, requireAdmin, courseController.addPermission);
router.delete('/:id/permissions/:departmentId', verifyToken, requireAdmin, courseController.removePermission);
module.exports = router;