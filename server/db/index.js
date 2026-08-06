const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test kết nối khi khởi động
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Kết nối PostgreSQL thất bại:', err.message);
  } else {
    console.log('✅ Kết nối PostgreSQL thành công!');
    release();
  }
});

module.exports = pool;
