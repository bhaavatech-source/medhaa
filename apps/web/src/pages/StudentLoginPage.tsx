import { useSearchParams, Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import '../styles/student-login.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';
import { useState } from 'react';
import { GoogleSignIn } from '../components/GoogleSignIn';

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        id="password"
        type={visible ? 'text' : 'password'}
        name="password"
        autoComplete="current-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '48px',
          boxSizing: 'border-box',
          border: '1px solid #ccd8da',
          borderRadius: '10px',
          padding: '0 48px 0 14px',
          fontSize: '15px',
          color: '#20383b',
          outline: 'none',
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          border: 0,
          background: 'transparent',
          color: '#087f83',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 700,
        }}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

export default function StudentLoginPage() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const gated = searchParams.get('gate') === '1';

  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginForm('', '/student/preview');

  return (
    <div className="student-login-wrap">
      <div className="student-login-card">
        <div className="student-login-brand">
          <div className="student-login-logo">
            <img src={medhaaIcon} alt="Medhā" />
          </div>
          <h1>Medhā</h1>
        </div>

        {gated ? (
          <div className="student-login-gate-msg">
            <p><strong>You've played 3 games as a guest.</strong></p>
            <p>Log in to keep playing, save your progress, and track your growth.</p>
          </div>
        ) : (
          <p className="student-login-sub">Sign in to continue.</p>
        )}

        <form onSubmit={(event) => {
          if (!showPassword) {
            event.preventDefault();
            setShowPassword(true);
          } else {
            void handleSubmit(event);
          }
        }} className="student-login-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

          {showPassword && (
            <>
              <label htmlFor="password">Password</label>
              <PasswordInput value={password} onChange={setPassword} placeholder="Password" />
            </>
          )}

          {error && <div className="student-login-error">{error}</div>}

          <button type="submit" disabled={loading} className="student-login-btn-primary">
            {loading ? 'Signing in…' : showPassword ? 'Sign in' : 'Continue with email'}
          </button>
        </form>

        <div className="student-login-forgot">
          <Link to="/forgot-password" style={{ color: '#2869eb', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>

        <div className="student-login-divider"><span>or</span></div>
        <GoogleSignIn role="student" redirectTo="/student/preview" />

        <p className="student-login-help">
          Don't have an account? <a href="/signup/student">Sign up</a>
        </p>
        <p className="student-login-help">
          <a href="/">← Back to home</a>
        </p>
      </div>
    </div>
  );
}