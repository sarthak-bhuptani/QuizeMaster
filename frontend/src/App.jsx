import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateQuiz from './pages/teacher/CreateQuiz';
import AddQuestion from './pages/teacher/AddQuestion';
import StudentDashboard from './pages/student/StudentDashboard';
import TakeQuiz from './pages/student/TakeQuiz';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExamAnalysis from './pages/student/ExamAnalysis';
import Profile from './pages/Profile';

// Layout component to handle conditional Navbar visibility and auto-logout on back/forward
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clearFlagTimeout = useRef(null);

  // Hide Navbar on TakeQuiz page
  const hideNavbar = location.pathname.includes('/student/take-quiz');

  useEffect(() => {
    const LOGOUT_FLAG_KEY = 'quizmaster_back_nav_flag';

    const isLoggedIn = () => {
      return Boolean(sessionStorage.getItem('user') || sessionStorage.getItem('admin'));
    };

    const logout = () => {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('admin');
      navigate('/student/login');
    };

    const clearFlag = () => {
      sessionStorage.removeItem(LOGOUT_FLAG_KEY);
      if (clearFlagTimeout.current) {
        window.clearTimeout(clearFlagTimeout.current);
        clearFlagTimeout.current = null;
      }
    };

    const handlePopState = () => {
      // If the user is not logged in, ignore
      if (!isLoggedIn()) return;

      const wasBack = sessionStorage.getItem(LOGOUT_FLAG_KEY) === 'true';
      if (wasBack) {
        // The user navigated back before; now they are going forward.
        clearFlag();
        logout();
        return;
      }

      // First popstate event (likely a back navigation). Set a short-lived flag.
      sessionStorage.setItem(LOGOUT_FLAG_KEY, 'true');
      clearFlagTimeout.current = window.setTimeout(clearFlag, 1500);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearFlag();
    };
  }, [navigate]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/student/login" element={<Login userType="student" />} />
        <Route path="/teacher/login" element={<Login userType="teacher" />} />
        <Route path="/student/signup" element={<Signup userType="student" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Teacher signup is removed as they are created by admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
        <Route path="/teacher/add-question/:courseId" element={<AddQuestion />} />

        {/* Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/take-quiz/:courseId" element={<TakeQuiz />} />
        <Route path="/student/analysis/:resultId" element={<ExamAnalysis />} />

        {/* Common Routes */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
