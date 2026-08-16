const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads/pdfs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Fix UTF-8 encoding issue for filenames by making it URL encoded
        const cleanName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, Date.now() + '-' + cleanName.replace(/\s+/g, '_'));
    }
});
const upload = multer({ storage: storage });

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
router.post('/:courseId/chapters/:chapterId/lessons', verifyToken, requireAdmin, upload.single('file'), courseController.addLesson);
router.put('/:courseId/chapters/:chapterId/lessons/:lessonId', verifyToken, requireAdmin, upload.single('file'), courseController.updateLesson);
router.delete('/:courseId/chapters/:chapterId/lessons/:lessonId', verifyToken, requireAdmin, courseController.removeLesson);

//Phân quyền khóa học
router.post('/:id/permissions', verifyToken, requireAdmin, courseController.addPermission);
router.delete('/:id/permissions/:departmentId', verifyToken, requireAdmin, courseController.removePermission);
module.exports = router;