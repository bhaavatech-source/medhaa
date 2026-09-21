import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import { GlobalMusic } from './components/GlobalMusic';
import { ChildSessionBanner } from './components/ChildSessionBanner';
import { API_URL } from './utils/apiConfig';

// Everything below is loaded on demand (route-based code splitting) so the
// initial bundle only ships Home + Login instead of the whole app at once.
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ParentDemo = lazy(() => import('./pages/ParentDemo'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const TeacherLoginPage = lazy(() => import('./pages/TeacherLoginPage'));
const SchoolReport = lazy(() => import('./pages/SchoolReport'));
const SchoolLoginPage = lazy(() => import('./pages/SchoolLoginPage'));
const StudentLoginPage = lazy(() => import('./pages/StudentLoginPage'));
const ParentLoginPage = lazy(() => import('./pages/ParentLoginPage'));
const StudentSignupPage = lazy(() => import('./pages/StudentSignupPage'));
const ParentSignupPage = lazy(() => import('./pages/ParentSignupPage'));
const TeacherSignupPage = lazy(() => import('./pages/TeacherSignupPage'));
const SchoolSignupPage = lazy(() => import('./pages/SchoolSignupPage'));
const StudentGamesPage = lazy(() => import('./components/StudentGamesPage').then((m) => ({ default: m.StudentGamesPage })));
const SubscribePage = lazy(() => import('./pages/SubscribePage').then((m) => ({ default: m.SubscribePage })));
const SubscribePayPage = lazy(() => import('./pages/SubscribePayPage').then((m) => ({ default: m.SubscribePayPage })));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })));
const StudentEnrollment = lazy(() => import('./pages/StudentEnrollment'));
const BCSLiteIntro = lazy(() => import('./pages/BCSLiteIntro'));
const LearningReadiness = lazy(() => import('./pages/LearningReadiness'));
const ParentProgressReport = lazy(() => import('./pages/ParentProgressReport'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const SharingPermissions = lazy(() => import('./pages/SharingPermissions'));
const OurApproach = lazy(() => import('./components/OurApproach'));
const TeacherWorkspace = lazy(() => import('./pages/TeacherWorkspace'));
const SchoolWorkspace = lazy(() => import('./pages/SchoolWorkspace'));
const AdminConsole = lazy(() => import('./pages/AdminConsole'));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));





function StudentDashboard() {
  return <StudentGamesPage apiUrl={API_URL} />;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalMusic />
        <ChildSessionBanner />
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading…</div>}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
