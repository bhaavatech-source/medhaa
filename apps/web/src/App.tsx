import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ParentDemo from './pages/ParentDemo';
import StudentPublic from './pages/StudentPublic';
import ProtectedRoute from './components/ProtectedRoute';
import { GamesGrid } from './components/GamesGrid';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherLoginPage from './pages/TeacherLoginPage';
import { GamesDiscovery } from './components/GamesDiscovery';
import SchoolReport from './pages/SchoolReport';
import SchoolLoginPage from './pages/SchoolLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import ParentLoginPage from './pages/ParentLoginPage';
import StudentSignupPage from './pages/StudentSignupPage';
import ParentSignupPage from './pages/ParentSignupPage';
import TeacherSignupPage from './pages/TeacherSignupPage';
import SchoolSignupPage from './pages/SchoolSignupPage';





const API_URL = 'http://localhost:4000/api';


function StudentDashboard() {
  return <GamesDiscovery apiUrl={API_URL} />;
}
function ParentDashboard() {
  return <div style={{ padding: 40 }}>Parent Dashboard (coming soon)</div>;
}


function AdminDashboard() {
  return <div style={{ padding: 40 }}>Admin Dashboard (coming soon)</div>;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/parent-demo" element={<ParentDemo />} />
          <Route path="/teacher-demo" element={<TeacherDashboard />} />
          <Route path="/school-report" element={<SchoolReport />} />
          <Route path="/login/parent" element={<ParentLoginPage />} />
          <Route path="/login/teacher" element={<TeacherLoginPage />} />
          <Route path="/login/school" element={<SchoolLoginPage />} />
          <Route path="/login/student" element={<StudentLoginPage />} />
          <Route path="/signup/student" element={<StudentSignupPage />} />
          <Route path="/signup/parent" element={<ParentSignupPage />} />
          <Route path="/signup/teacher" element={<TeacherSignupPage />} />
          <Route path="/signup/school" element={<SchoolSignupPage />} />
          <Route path="/signup/student" element={<StudentSignupPage />} />
          <Route path="/signup/parent" element={<ParentSignupPage />} />
          <Route path="/signup/teacher" element={<TeacherSignupPage />} />
          <Route path="/signup/school" element={<SchoolSignupPage />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent"
            element={
              <ProtectedRoute role="parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;