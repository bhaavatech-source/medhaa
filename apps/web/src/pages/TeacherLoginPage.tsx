import { Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import '../styles/teacher-login.css';
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
        required
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

export function TeacherLoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginForm('teacher', '/teacher-dashboard');

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
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" required />
          </label>

          <label>
            Password
            <PasswordInput value={password} onChange={setPassword} placeholder="••••••••" />
          </label>

          {error && <div className="teacher-login-error">{error}</div>}

          <button type="submit" disabled={loading} className="teacher-login-submit">
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <Link to="/forgot-password" style={{ color: '#2869eb', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>

        <a href="/" className="teacher-login-back">← Back to home</a>
      </div>
    </div>
  );
}

export default TeacherLoginPage;