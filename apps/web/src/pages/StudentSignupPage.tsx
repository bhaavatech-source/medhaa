import { useSignupForm } from './hooks/useSignupForm';
import '../styles/student-login.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

import { useState } from 'react';

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete="new-password"
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

export default function StudentSignupPage() {
  const { name, setName, email, setEmail, password, setPassword, extraData, setExtraData, error, message, loading, handleSubmit } = useSignupForm('student', '/login/student');

  return (
    <div className="student-login-wrap">
      <div className="student-login-card">
        <div className="student-login-brand">
          <div className="student-login-logo">
            <img src={medhaaIcon} alt="Medhā" />
          </div>
          <h1>Medhā Sign Up</h1>
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
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
            />

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