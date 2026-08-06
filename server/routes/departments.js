const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET /api/departments - Danh sách phòng ban
router.get('/', verifyToken, departmentController.getAll);
router.post('/', verifyToken, requireAdmin, departmentController.create);
router.put('/:id', verifyToken, requireAdmin, departmentController.update);
router.delete('/:id', verifyToken, requireAdmin, departmentController.remove);

module.exports = router;