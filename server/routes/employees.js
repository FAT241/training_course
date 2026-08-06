const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET    /api/employees     — Danh sách nhân viên (Admin only)
// POST   /api/employees     — Thêm nhân viên (Admin only)
// PUT    /api/employees/:id — Sửa nhân viên (Admin only)
// DELETE /api/employees/:id — Xóa nhân viên (Admin only)
router.get('/', verifyToken, requireAdmin, employeeController.getAll);
router.post('/', verifyToken, requireAdmin, employeeController.create);
router.put('/:id', verifyToken, requireAdmin, employeeController.update);
router.delete('/:id', verifyToken, requireAdmin, employeeController.remove);

module.exports = router;
