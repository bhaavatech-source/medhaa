import { useSignupForm } from './hooks/useSignupForm';
import '../styles/school-login.css';
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

export default function SchoolSignupPage() {
  const { name, setName, email, setEmail, password, setPassword, extraData, setExtraData, error, message, loading, handleSubmit } = useSignupForm('school', '/login/school');

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

        {message ? (
          <p className="school-login-back">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="school-login-form">
            <label>
              Contact Person Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Principal / Admin name" required />
            </label>
            <label>
              School Admin Email
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourschool.edu" required />
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
              School Name (optional)
              <input type="text" value={extraData.schoolName || ''} onChange={(e) => setExtraData({ ...extraData, schoolName: e.target.value })} />
            </label>
            <label>
              Phone (optional)
              <input type="tel" value={extraData.phone || ''} onChange={(e) => setExtraData({ ...extraData, phone: e.target.value })} />
            </label>
            <label>
              City (optional)
              <input type="text" value={extraData.city || ''} onChange={(e) => setExtraData({ ...extraData, city: e.target.value })} placeholder="e.g. Vizag" />
            </label>
            <label>
              Approx. Student Count (optional)
              <input type="number" value={extraData.studentCountApprox || ''} onChange={(e) => setExtraData({ ...extraData, studentCountApprox: e.target.value })} />
            </label>
            <label>
              Board (optional)
              <select value={extraData.board || ''} onChange={(e) => setExtraData({ ...extraData, board: e.target.value })}>
                <option value="">Select</option>
                <option value="State">State Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
              </select>
            </label>

            {error && <div className="school-login-error">{error}</div>}

            <button type="submit" disabled={loading} className="school-login-submit">
              {loading ? 'Submitting…' : 'Sign Up'}
            </button>
          </form>
        )}

        <a href="/login/school" className="school-login-back">Already have an account? Log in</a>
        <a href="/" className="school-login-back">← Back to home</a>
      </div>
    </div>
  );
}