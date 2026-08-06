require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('./db');

async function checkTables() {
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        console.log("Danh sách các bảng trong DB:");
        res.rows.forEach(row => console.log("- " + row.table_name));
    } catch (err) {
        console.error("Lỗi:", err.message);
    } finally {
        pool.end();
    }
}

checkTables();
