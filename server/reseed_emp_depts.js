require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const pool = require('./db/index');

async function reseed() {
  try {
    const deptsResult = await pool.query('SELECT id FROM department ORDER BY id ASC');
    const departments = deptsResult.rows;
    if (departments.length === 0) {
      console.log('Không có phòng ban nào!');
      process.exit(1);
    }

    const empsResult = await pool.query('SELECT user_id FROM employee ORDER BY user_id ASC');
    const employees = empsResult.rows;

    let successCount = 0;
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      const deptId = departments[i % departments.length].id;
      await pool.query('UPDATE employee SET department_id = $1 WHERE user_id = $2', [deptId, emp.user_id]);
      successCount++;
    }

    console.log(`✅ Đã phân bố lại ${successCount} nhân viên đều cho ${departments.length} phòng ban.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  }
}

reseed();
