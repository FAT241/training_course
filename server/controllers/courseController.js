const pool = require('../db');

const getAll = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM course ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};
const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const courseResult = await pool.query('SELECT * FROM course WHERE id = $1', [id]);
        if (courseResult.rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
        //Lay cac chuong cua khoa hoc
        const course = courseResult.rows[0];
        const chaptersResult = await pool.query('SELECT * FROM chapter WHERE course_id = $1 ORDER BY order_index', [id]);

        //Lay bai hoc cua tung chuong
        const chapters = await Promise.all(
            chaptersResult.rows.map(async chapter => {
                const lessonsResult = await pool.query('SELECT * FROM lesson WHERE chapter_id = $1 ORDER BY id', [chapter.id]);
                return {
                    ...chapter,
                    lessons: lessonsResult.rows
                }
            })
        );
        res.json({
            ...course,
            chapters: chapters
        })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
}

const create = async (req, res) => {
    const { course_name, description, course_type } = req.body;
    const created_by = req.user.id;
    try {
        const result = await pool.query(
            `INSERT INTO course (course_name, description, course_type, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [course_name, description, course_type, created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { course_name, description, course_type } = req.body;
    try {
        const result = await pool.query(
            `UPDATE course SET course_name=$1, description=$2, course_type=$3
       WHERE id=$4 RETURNING *`,
            [course_name, description, course_type, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM course WHERE id = $1', [id]);
        res.json({ message: 'Xóa khóa học thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const addChapter = async (req, res) => {
    const { courseId } = req.params;
    const { chapter_name, order_index } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO chapter (course_id, chapter_name, order_index)
       VALUES ($1, $2, $3) RETURNING *`,
            [courseId, chapter_name, order_index]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const removeChapter = async (req, res) => {
    const { chapterId } = req.params;
    try {
        await pool.query('DELETE FROM chapter WHERE id = $1', [chapterId]);
        res.json({ message: 'Xóa chương thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const updateChapter = async (req, res) => {
    const { chapterId } = req.params;
    const { chapter_name, order_index } = req.body;
    try {
        const result = await pool.query(
            'UPDATE chapter SET chapter_name=$1, order_index=$2 WHERE id=$3 RETURNING *',
            [chapter_name, order_index, chapterId]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy chương' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const addLesson = async (req, res) => {
    const { chapterId } = req.params;
    const { lesson_name, content_type, file_path } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO lesson (chapter_id, lesson_name, content_type, file_path)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [chapterId, lesson_name, content_type, file_path]
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

const updateLesson = async (req, res) => {
    const { lessonId } = req.params;
    const { lesson_name, content_type, file_path } = req.body;
    try {
        const result = await pool.query(
            'UPDATE lesson SET lesson_name=$1, content_type=$2, file_path=$3 WHERE id=$4 RETURNING *',
            [lesson_name, content_type, file_path, lessonId]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy bài học' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const addPermission = async (req, res) => {
    const { id } = req.params;
    const { department_id, access_level } = req.body;
    try {
        const result = await
            pool.query(
                `INSERT INTO course_permission (course_id, department_id, access_level)
            VALUES($1,$2,$3)
            RETURNING *`,
                [id, department_id, access_level || 'RESTRICTED']);
        res.status(201).json({
            message: 'Phân quyền thành công',
            permission: result.rows[0]
        });

    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                message: 'Phòng ban này đã được phân quyền cho khóa học'
            });
        }
        res.status(500).json({
            message: 'Lỗi server',
            error: err.message
        });
    }
}
const removePermission = async (req, res) => {
    const { id, departmentId } = req.params;
    try {
        await pool.query(
            'DELETE FROM course_permission WHERE course_id = $1 AND department_id = $2',
            [id, departmentId]
        );
        res.json({ message: 'Xóa phân quyền thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove, addChapter, removeChapter, updateChapter, addLesson, removeLesson, updateLesson, addPermission, removePermission };
