require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('./db');

async function fixPdf() {
    try {
        await pool.query(`
            UPDATE lesson 
            SET file_path = 'https://pdfobject.com/pdf/sample.pdf' 
            WHERE file_path LIKE '%w3.org%'
        `);
        console.log('✅ Đã sửa link PDF thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

fixPdf();
