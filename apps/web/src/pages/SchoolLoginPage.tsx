import { Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import '../styles/school-login.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

export function SchoolLoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLoginForm('school', '/school-report');

  return (
    <div className="school-login-page">
      <div className="school-orbs">
        <span className="s-orb s-orb-1" />
        <span className="s-orb s-orb-2" />
      </div>

      <div className="school-login-card">
        <div className="school-brand">
          <div className="school-logo">
            <img src={medhaaIcon} alt="Medhā" />
          </div>

          <div className="school-role">🏫</div>

          <h1>School Sign In</h1>
          <p>Check your children's scores and manage your school</p>
        </div>

        <form onSubmit={handleSubmit} className="school-login-form">
          <label>
            School Admin Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourschool.edu"
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

          {error && <div className="school-login-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="school-login-submit"
          >
            {loading ? 'Signing in…' : 'Sign In'}
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

        <a href="/school-report" className="school-login-back">
          Back
        </a>
      </div>
    </div>
  );
}

export default SchoolLoginPage;