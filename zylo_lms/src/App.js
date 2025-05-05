import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './components/ProductedRoutes';
import StudentDashboard from './dashboard/StudentDashboard';
import InstructorDashboard from './dashboard/InstructorDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import InstructorCourses from './pages/InstructorCourse';

function App() {
  return (
    <Router>
      <Routes>
  {/* Auth routes */}
  <Route path="/signup" element={<Signup />} />
  <Route path="/" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />

  {/* Role-based dashboards */}
  <Route path="/student-dashboard" element={
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  } />
  <Route path="/instructor-dashboard" element={
    <ProtectedRoute role="instructor">
      <InstructorDashboard />
    </ProtectedRoute>
  } />
  <Route path="/admin-dashboard" element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />
  <Route path="/create-course" element={
  <ProtectedRoute role="instructor">
    <CreateCourse />
  </ProtectedRoute>
   } />
   <Route path="/instructor-courses" element={
  <ProtectedRoute role="instructor">
    <InstructorCourses />
  </ProtectedRoute>
} />
</Routes>

    </Router>
  );
}

export default App;


