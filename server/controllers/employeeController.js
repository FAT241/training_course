const pool = require('../db');
const bcrypt = require('bcrypt');
const getAll = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT u.id, u.email, u.full_name, u.role, u.created_at,
             e.department_id, e.rank, d.department_name
      FROM users u
      LEFT JOIN employee e ON u.id = e.user_id
      LEFT JOIN department d ON e.department_id = d.id
      WHERE u.role = 'EMPLOYEE'
      ORDER BY u.id
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const create = async (req, res) => {
    const { email, password, full_name, department_id, rank } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);

        // Thêm vào bảng users
        const userResult = await pool.query(
            `INSERT INTO users (email, password, full_name, role)
       VALUES ($1, $2, $3, 'EMPLOYEE') RETURNING id`,
            [email, hashed, full_name]
        );
        const userId = userResult.rows[0].id;

        // Thêm vào bảng employee
        await pool.query(
            `INSERT INTO employee (user_id, department_id, rank)
       VALUES ($1, $2, $3)`,
            [userId, department_id, rank]
        );

        res.status(201).json({ message: 'Tạo nhân viên thành công', id: userId });
    } catch (err) {
        if (err.code === '23505') { // lỗi trùng email
            return res.status(409).json({ message: 'Email đã tồn tại' });
        }
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { full_name, department_id, rank, password } = req.body;
    try {
        if (password) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                `UPDATE users SET full_name = $1, password = $2 WHERE id = $3`,
                [full_name, hashedPassword, id]
            );
        } else {
            await pool.query(
                `UPDATE users SET full_name = $1 WHERE id = $2`,
                [full_name, id]
            );
        }
        await pool.query(
            `UPDATE employee SET department_id = $1, rank = $2 WHERE user_id = $3`,
            [department_id, rank, id]
        );
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        // Xóa users là tự động cascade xóa employee (do ON DELETE CASCADE trong schema)
        await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [id, 'EMPLOYEE']);
        res.json({ message: 'Xóa nhân viên thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const addChapter = async (req, res) => {
    const { courseId } = req.params;
    const { title, order_index } = req.body;
    try {
        const result = await pool.query(`
        INSERT INTO chapter (course_id, title, order_index)
        VALUES ($1,$2,$3)
        RETURNING *`,
            [courseId, title, order_index]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
}

const removeChapter = async (req, res) => {
    const { chapterId } = req.params;
    try {
        await pool.query('DELETE FROM chapter WHERE id = $1', [chapterId]);
        res.json({ message: 'Xóa chương thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const addLesson = async (req, res) => {
    const { chapterId } = req.params;
    const { title, content_type, content_url, order_index } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO lesson (chapter_id, title, content_type, content_url, order_index)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [chapterId, title, content_type, content_url, order_index]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const removeLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
        await pool.query('DELETE FROM lesson WHERE id = $1', [lessonId]);
        res.json({ message: 'Xóa bài học thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { getAll, create, update, remove };
