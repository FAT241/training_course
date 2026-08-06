require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('./db');

async function debug() {
    try {
        const query = `
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_name IN ('learning_progress', 'quiz_result', 'course_permission') 
            ORDER BY table_name, ordinal_position
        `;
        const result = await pool.query(query);
        console.log(result.rows);
    } catch (e) {
        console.error(e.message);
    } finally {
        pool.end();
    }
}
debug();
