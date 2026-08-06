const pool = require('../db');

const getAll = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM department ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const result = await pool.query('INSERT INTO department (department_name) VALUES ($1) RETURNING *', [req.body.department_name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        await pool.query('UPDATE department SET department_name = $1 WHERE id = $2', [req.body.department_name, req.params.id]);
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await pool.query('DELETE FROM department WHERE id = $1', [req.params.id]);
        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        // Có thể dính lỗi foreign key nếu phòng ban đang có nhân viên
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Không thể xóa phòng ban đang có nhân viên hoặc khóa học!' });
        }
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { getAll, create, update, remove };
