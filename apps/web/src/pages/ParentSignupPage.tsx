import { useNavigate, Link } from 'react-router-dom';
import { useSignupForm } from './hooks/useSignupForm';
import '../styles/parent-login.css';
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
        autoComplete="new-password"
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

export default function ParentSignupPage() {
  const navigate = useNavigate();
  const { name, setName, email, setEmail, password, setPassword, extraData, setExtraData, error, message, loading, handleSubmit } = useSignupForm('parent', '/login/parent');

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="parent-login-page">
      <button
        type="button"
        onClick={goBack}
        aria-label="Go back"
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid #ccd8da',
          borderRadius: '999px',
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: 700,
          color: '#20383b',
          cursor: 'pointer',
          zIndex: 5,
        }}
      >
        &#8592; Back
      </button>

      <div className="parent-login-card">
        <div className="parent-login-brand">
          <Link to="/" aria-label="Go to home" className="parent-login-logo" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <img src={medhaaIcon} alt="Medhā" />
          </Link>

          <div className="parent-login-role">👨‍👩‍👧</div>

          <h1>Parent Portal</h1>
          <p>Track your child's progress and growth</p>
        </div>

        {message ? (
          <p className="parent-login-help">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="parent-login-form">
            <label>
              Full Name
              <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
            </label>
            <label>
              Email
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="At least 8 characters"
              />
            </label>
            <label>
              Child's Name or Email (optional)
              <input type="text" value={extraData.childIdentifier || ''} onChange={(e) => setExtraData({ ...extraData, childIdentifier: e.target.value })} placeholder="Helps us link your child's account" />
            </label>
            <label>
              Relationship (optional)
              <select value={extraData.relationship || ''} onChange={(e) => setExtraData({ ...extraData, relationship: e.target.value })}>
                <option value="">Select</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Phone (optional)
              <input type="tel" value={extraData.phone || ''} onChange={(e) => setExtraData({ ...extraData, phone: e.target.value })} placeholder="9876543210" />
            </label>

            {error && <div className="parent-login-error">{error}</div>}

            <button type="submit" disabled={loading} className="parent-login-submit">
              {loading ? 'Signing up…' : 'Sign Up'}
            </button>
          </form>
        )}

        <p className="parent-login-help" style={{ textAlign: 'center', marginTop: '14px' }}>
          Already have an account? <Link to="/login/parent">Log in</Link>
        </p>
      </div>
    </div>
  );
}
