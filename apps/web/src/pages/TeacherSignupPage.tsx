import { useSignupForm } from './hooks/useSignupForm';
import '../styles/teacher-login.css';

export default function TeacherSignupPage() {
  const { name, setName, email, setEmail, password, setPassword, extraData, setExtraData, error, message, loading, handleSubmit } = useSignupForm('teacher', '/login/teacher');

  return (
    <div className="teacher-login-page">
      <div className="teacher-login-orbs">
        <span className="tl-orb tl-orb-1" />
        <span className="tl-orb tl-orb-2" />
      </div>

      <div className="teacher-login-card">
        <div className="teacher-login-brand">
          <div className="teacher-login-logo">🎓</div>
          <h1>Teacher Sign Up</h1>
          <p>Track your class & student growth</p>
        </div>

        {message ? (
          <p className="teacher-login-back">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="teacher-login-form">
            <label>
              Full Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
            </label>
            <label>
              Email
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" required />
            </label>
            <label>
              Password
              <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
            </label>
            <label>
              School Name (optional)
              <input type="text" value={extraData.schoolName || ''} onChange={(e) => setExtraData({ ...extraData, schoolName: e.target.value })} />
            </label>
            <label>
              Subject Taught (optional)
              <input type="text" value={extraData.subject || ''} onChange={(e) => setExtraData({ ...extraData, subject: e.target.value })} placeholder="e.g. Mathematics" />
            </label>
            <label>
              Grade Levels (optional)
              <input type="text" value={extraData.gradeLevels || ''} onChange={(e) => setExtraData({ ...extraData, gradeLevels: e.target.value })} placeholder="e.g. 6-8" />
            </label>
            <label>
              Phone (optional)
              <input type="tel" value={extraData.phone || ''} onChange={(e) => setExtraData({ ...extraData, phone: e.target.value })} />
            </label>

            {error && <div className="teacher-login-error">{error}</div>}

            <button type="submit" disabled={loading} className="teacher-login-submit">
              {loading ? 'Submitting…' : 'Sign Up'}
            </button>
          </form>
        )}

        <a href="/login/teacher" className="teacher-login-back">Already have an account? Log in</a>
      </div>
    </div>
  );
}
