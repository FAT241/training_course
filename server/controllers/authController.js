const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Email hoặc Mật khẩu không đúng!" });
  }
  const user = result.rows[0];
  //Check Pass
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: 'Email hoặc mật khẩu không đúng'
    });
  }

  // Create JSWebToken
  const token = jwt.sign(
    {
      id: user.id, email: user.email, role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  let position = null;
  if (user.role === 'EMPLOYEE') {
    const empResult = await pool.query('SELECT rank FROM employee WHERE user_id = $1', [user.id]);
    if (empResult.rows.length > 0) {
      position = empResult.rows[0].rank;
    }
  }

  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      position: position
    }
  });

};
module.exports = { login };
