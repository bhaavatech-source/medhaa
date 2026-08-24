import { Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import '../styles/teacher-login.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

export function TeacherLoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLoginForm('teacher', '/teacher-dashboard');

  return (
    <div className="teacher-login-page">
      <div className="teacher-login-orbs">
        <span className="tl-orb tl-orb-1" />
        <span className="tl-orb tl-orb-2" />
      </div>

      <div className="teacher-login-card">
        <div className="teacher-login-brand">
          <div className="teacher-login-logo">
            <img src={medhaaIcon} alt="Medhā" />
          </div>

          <h1>Teacher Portal</h1>
          <p>Track your class & student growth</p>
        </div>

        <form onSubmit={handleSubmit} className="teacher-login-form">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="teacher-login-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="teacher-login-submit"
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '14px',
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: '#2869eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Forgot password?
          </Link>
        </div>

        <a href="/" className="teacher-login-back">
          ← Back to home
        </a>
      </div>
    </div>
  );
}

export default TeacherLoginPage;
