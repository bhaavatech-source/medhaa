import { useSignupForm } from './hooks/useSignupForm';
import '../styles/student-login.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

export default function StudentSignupPage() {
  const { name, setName, email, setEmail, password, setPassword, extraData, setExtraData, error, message, loading, handleSubmit } = useSignupForm('student', '/login/student');

  return (
    <div className="student-login-wrap">
      <div className="student-login-card">
        <div className="student-login-brand">
          <div className="student-login-logo">
  <img src={medhaaIcon} alt="Medhā" />
</div>
          <h1>Medhaa Sign Up</h1>
        </div>

        {message ? (
          <div className="student-login-gate-msg"><p>{message}</p></div>
        ) : (
          <form onSubmit={handleSubmit} className="student-login-form">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />

            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />

            <label htmlFor="rollNumber">Roll Number (optional)</label>
            <input id="rollNumber" type="text" value={extraData.rollNumber || ''} onChange={(e) => setExtraData({ ...extraData, rollNumber: e.target.value })} />

            <label htmlFor="class">Class (optional)</label>
            <input id="class" type="text" value={extraData.class || ''} onChange={(e) => setExtraData({ ...extraData, class: e.target.value })} />

            {error && <div className="student-login-error">{error}</div>}

            <button type="submit" disabled={loading} className="student-login-btn-primary">
              {loading ? 'Submitting…' : 'Sign Up'}
            </button>
          </form>
        )}

        <p className="student-login-help">Already have an account? <a href="/login/student">Log in</a></p>
      </div>
    </div>
  );
}
