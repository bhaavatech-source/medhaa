import { Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import '../styles/parent-login.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

export function ParentLoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLoginForm('parent', '/parent-dashboard');

  return (
    <div className="parent-login-page">
      <div className="parent-login-card">
        <div className="parent-login-brand">
          <div className="parent-login-logo">
            <img src={medhaaIcon} alt="Medhā" />
          </div>

          <div className="parent-login-role">👨‍👩‍👧</div>

          <h1>Parent Portal</h1>
          <p>Track your child's progress and growth</p>
        </div>

        <form onSubmit={handleSubmit} className="parent-login-form">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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

          {error && <div className="parent-login-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="parent-login-submit"
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

        <a href="/" className="parent-login-back">
          ← Back to home
        </a>
      </div>
    </div>
  );
}

export default ParentLoginPage;