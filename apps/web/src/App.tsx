import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import ParentDemo from './pages/ParentDemo';
import StudentPublic from './pages/StudentPublic';
import ProtectedRoute from './components/ProtectedRoute';
import { GamesGrid } from './components/GamesGrid';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherLoginPage from './pages/TeacherLoginPage';
import SchoolReport from './pages/SchoolReport';
import SchoolLoginPage from './pages/SchoolLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import ParentLoginPage from './pages/ParentLoginPage';
import StudentSignupPage from './pages/StudentSignupPage';
import ParentSignupPage from './pages/ParentSignupPage';
import TeacherSignupPage from './pages/TeacherSignupPage';
import SchoolSignupPage from './pages/SchoolSignupPage';
import { StudentGamesPage } from './components/StudentGamesPage';
import { SubscribePage } from './pages/SubscribePage';
import { SubscribePayPage } from './pages/SubscribePayPage';
import { AchievementsPage } from './pages/AchievementsPage';

import StudentEnrollment from './pages/StudentEnrollment';
import BCSLiteIntro from './pages/BCSLiteIntro';
import LearningReadiness from './pages/LearningReadiness';
import ParentProgressReport from './pages/ParentProgressReport';
import ParentDashboard from './pages/ParentDashboard';
import SharingPermissions from './pages/SharingPermissions';
import OurApproach from './components/OurApproach';
import TeacherWorkspace from './pages/TeacherWorkspace';
import SchoolWorkspace from './pages/SchoolWorkspace';
import AdminConsole from './pages/AdminConsole';
// 1. Import the new component at the top
import { SettingsPage } from './pages/SettingsPage';
import { GlobalMusic } from './components/GlobalMusic';
import { ChildSessionBanner } from './components/ChildSessionBanner';





const API_URL =
  import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';


function StudentDashboard() {
  return <StudentGamesPage apiUrl={API_URL} />;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalMusic />
        <ChildSessionBanner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/parent/preview" element={<ParentDemo />} />
          <Route path="/teacher/preview" element={<TeacherDashboard />} />
          <Route path="/school-report" element={<SchoolReport />} />
          <Route path="/login/parent" element={<ParentLoginPage />} />
          <Route path="/login/teacher" element={<TeacherLoginPage />} />
          <Route path="/login/student" element={<StudentLoginPage />} />
          <Route path="/login/school" element={<SchoolLoginPage />} />
          <Route path="/login/admin" element={<LoginPage role="admin" />} />

          <Route path="/signup/student" element={<StudentSignupPage />} />
          <Route path="/signup/parent" element={<ParentSignupPage />} />
          <Route path="/signup/teacher" element={<TeacherSignupPage />} />
          <Route path="/signup/school" element={<SchoolSignupPage />} />

          <Route path="/subscribe" element={<SubscribePage apiUrl={API_URL} />} />
          <Route path="/subscribe/pay" element={<SubscribePayPage apiUrl={API_URL} />} />

          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/preview" element={<StudentDashboard />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/parent/enrol-student" element={<ProtectedRoute role="parent"><StudentEnrollment /></ProtectedRoute>} />
          <Route path="/student/bcs-lite" element={<BCSLiteIntro />} />
          <Route path="/student/readiness" element={<LearningReadiness />} />
          <Route path="/parent/progress" element={<ParentProgressReport />} />
          <Route path="/parent/sharing" element={<SharingPermissions />} />
          <Route path="/parent-dashboard" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
          
          
          <Route path="/our-approach" element={<OurApproach />} />
		<Route path="/teacher-workspace" element={<ProtectedRoute role="teacher"><TeacherWorkspace /></ProtectedRoute>} />
		<Route path="/school-workspace" element={<ProtectedRoute role="admin"><SchoolWorkspace /></ProtectedRoute>} />
		<Route path="/admin" element={<ProtectedRoute role="admin"><AdminConsole /></ProtectedRoute>} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
