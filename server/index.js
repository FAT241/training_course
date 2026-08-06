require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');

const departmentRoutes = require('./routes/departments');
const employeeRoutes = require('./routes/employees');
const courseRoutes = require('./routes/courses');
const chapterRoutes = require('./routes/chapters');
const statisticsRoutes = require('./routes/statistics');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/statistics', statisticsRoutes);


app.get('/', (req, res) => {
  res.send('Server đang chạy OK!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
