require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('./db');
async function test() {
    const r = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='employee'");
    console.log(r.rows);
    pool.end();
}
test();
