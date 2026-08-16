require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const pool = require('./db/index');

async function fixDepts() {
  const newNames = [
    'Ban Giám Đốc',
    'Phòng Kỹ Thuật',
    'Phòng Nhân Sự',
    'Phòng Kế Toán',
    'Phòng Kinh Doanh',
    'Phòng Marketing',
    'Phòng Đảm Bảo Chất Lượng',
    'Phòng CSKH',
    'Phòng R&D',
    'Phòng Hành Chính',
    'Phòng Pháp Chế',
    'Phòng Thiết Kế UI/UX'
  ];

  for (let i = 0; i < 12; i++) {
    const id = i + 1;
    await pool.query('UPDATE department SET department_name = $1 WHERE id = $2', [newNames[i], id]);
  }

  console.log('✅ Đã sửa tên 12 phòng ban thành công!');
  process.exit(0);
}

fixDepts();
