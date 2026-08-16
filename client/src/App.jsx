import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Courses from './pages/admin/Courses';
import CourseDetail from './pages/admin/CourseDetail';
import QuizDetail from './pages/admin/QuizDetail';
import Employees from './pages/admin/Employees';
import Departments from './pages/admin/Departments';
import EmployeeLayout from './layouts/EmployeeLayout';
import EmployeeDashboard from './pages/employee/Dashboard';
import CourseStudy from './pages/employee/CourseStudy';
import QuizAttempt from './pages/employee/QuizAttempt';
import Certificates from './pages/employee/Certificates';
import './index.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
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

        {/* Khu vực Employee */}
        <Route path="/dashboard" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="courses/:id" element={<CourseStudy />} />
          <Route path="quizzes/:id" element={<QuizAttempt />} />
          <Route path="certificates" element={<Certificates />} />
        </Route>

        {/* Chuyển hướng mặc định */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
