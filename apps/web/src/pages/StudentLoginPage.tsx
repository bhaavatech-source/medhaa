import { useSearchParams, Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import '../styles/student-login.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';
import { useState } from 'react';

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
        type={visible ? 'text' : 'password'}
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
  const gated = searchParams.get('gate') === '1';

  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginForm('student', '/student');

  return (
    <div className="student-login-wrap">
      <div className="student-login-card">
        <div className="student-login-brand">
          <div className="student-login-logo">
            <img src={medhaaIcon} alt="Medhā" />
          </div>
          <h1>Medhaa</h1>
        </div>

        {gated ? (
          <div className="student-login-gate-msg">
            <p><strong>You've played 3 games as a guest.</strong></p>
            <p>Log in to keep playing, save your progress, and track your growth.</p>
          </div>
        ) : (
          <p className="student-login-sub">Log in to save your progress and see your reports.</p>
        )}

        <form onSubmit={handleSubmit} className="student-login-form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

          <label htmlFor="password">Password</label>
          <PasswordInput value={password} onChange={setPassword} placeholder="••••••••" />

          {error && <div className="student-login-error">{error}</div>}

          <button type="submit" disabled={loading} className="student-login-btn-primary">
            {loading ? 'Checking…' : 'Login & Play'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <Link to="/forgot-password" style={{ color: '#2869eb', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>

        <p className="student-login-help">
          Don't have an account? <a href="/signup/student">Sign up</a>
        </p>
      </div>
    </div>
  );
}