const pool = require('../db');

const getStatistics = async (req, res) => {
    try {
        // 1. Lấy tổng số lượng
        const coursesCount = await pool.query('SELECT COUNT(*) FROM course');
        const employeesCount = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['EMPLOYEE']);
        const departmentsCount = await pool.query('SELECT COUNT(*) FROM department');

        // 2. Lấy dữ liệu học tập (tiến độ)
        const progressResult = await pool.query(`
            SELECT 
                lp.id, lp.completion_percentage, lp.status, lp.updated_at,
                c.course_name,
                u.full_name as employee_name,
                d.department_name
            FROM learning_progress lp
            JOIN course c ON lp.course_id = c.id
            JOIN employee e ON lp.employee_id = e.user_id
            JOIN users u ON e.user_id = u.id
            JOIN department d ON e.department_id = d.id
            ORDER BY lp.updated_at DESC
            LIMIT 10
        `);

        // 3. (Mock data để vẽ biểu đồ nếu hệ thống chưa có dữ liệu thật)
        const deptDistribution = await pool.query(`
            SELECT d.department_name as name, COUNT(e.user_id) as value
            FROM department d
            JOIN employee e ON d.id = e.department_id
            GROUP BY d.department_name
            HAVING COUNT(e.user_id) > 0
        `);

        res.json({
            overview: {
                courses: parseInt(coursesCount.rows[0].count),
                employees: parseInt(employeesCount.rows[0].count),
                departments: parseInt(departmentsCount.rows[0].count)
            },
            recent_progress: progressResult.rows,
            department_distribution: deptDistribution.rows.map(row => ({
                name: row.name,
                value: parseInt(row.value)
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getStatistics
};
