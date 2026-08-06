import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Courses from './pages/admin/Courses';
import CourseDetail from './pages/admin/CourseDetail';
import QuizDetail from './pages/admin/QuizDetail';
import Employees from './pages/admin/Employees';
import Departments from './pages/admin/Departments';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Khu vực Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="chapters/:chapterId/quiz" element={<QuizDetail />} />
          <Route path="employees" element={<Employees />} />
          <Route path="departments" element={<Departments />} />
        </Route>

        {/* Chuyển hướng mặc định */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
