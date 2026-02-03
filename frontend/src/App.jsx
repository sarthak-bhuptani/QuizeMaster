import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateQuiz from './pages/teacher/CreateQuiz';
import AddQuestion from './pages/teacher/AddQuestion';
import StudentDashboard from './pages/student/StudentDashboard';
import TakeQuiz from './pages/student/TakeQuiz';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExamAnalysis from './pages/student/ExamAnalysis';

// Layout component to handle conditional Navbar visibility
const Layout = () => {
  const location = useLocation();
  // Hide Navbar on TakeQuiz page
  const hideNavbar = location.pathname.includes('/student/take-quiz');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/student/login" element={<Login userType="student" />} />
        <Route path="/teacher/login" element={<Login userType="teacher" />} />
        <Route path="/student/signup" element={<Signup userType="student" />} />
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
