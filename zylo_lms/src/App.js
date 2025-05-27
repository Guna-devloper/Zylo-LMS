  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Signup from './pages/auth/Signup';
  import Login from './pages/auth/Login';
  import ForgotPassword from './pages/auth/ForgotPassword';
  import ProtectedRoute from './components/ProductedRoutes';
  import StudentDashboard from './dashboard/StudentDashboard';
  import InstructorDashboard from './dashboard/InstructorDashboard';
  import AdminDashboard from './dashboard/AdminDashboard';
  import CreateCourse from './pages/admin/CreateCourse';
  import InstructorCourses from './pages/Instructor/InstructorCourse';
  import CourseUpload from './pages/admin/CourseUpload';
import InstructorDashboardWrapper from './dashboard/InstructorDashboardWrapper';

  function App() {
    return (
      <Router>
        <Routes>
    {/* Auth routes */}
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/admin/upload-course" element={<CourseUpload />} />

    {/* Role-based dashboards */}
    <Route
    path="/admin-dashboard"
    element={
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/student-dashboard"
    element={
      <ProtectedRoute role="student">
        <StudentDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/InstructorDashboard"
    element={
      <ProtectedRoute role="instructor">
<InstructorDashboardWrapper />
      </ProtectedRoute>
    }
  />
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


