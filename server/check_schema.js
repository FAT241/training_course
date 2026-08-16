require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('./db');

async function check() {
    const res = await pool.query(`
        SELECT
            kcu.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND kcu.table_name IN ('quiz_result', 'learning_progress', 'certificate');
    `);
    console.log(res.rows);
    process.exit(0);
}
check();
