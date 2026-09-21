import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';
import { API_URL } from '../utils/apiConfig';

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 44px 13px 14px',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  outline: 'none',
  fontSize: '0.95rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '7px',
  color: '#334155',
  fontSize: '0.9rem',
  fontWeight: 600,
};

function PasswordField({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={inputStyle}
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
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('This password reset link is invalid or missing a token.');
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to reset password.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background:
      'radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.35), transparent 30%), linear-gradient(135deg, #101322, #183d46)',
    boxSizing: 'border-box',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '380px',
    background: '#ffffff',
    borderRadius: '20px',
    padding: '36px 34px',
    boxSizing: 'border-box',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.20)',
  };

  if (success) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <img src={medhaaIcon} alt="Medhā" style={{ width: '58px', height: '58px', objectFit: 'contain', margin: '0 auto 12px' }} />
          <h1 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 800, color: '#087f83' }}>Password reset successfully</h1>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Your Medhā password has been changed. You can now sign in using your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '10px',
              padding: '13px 16px',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go to Login
          </button>
          <Link to="/" style={{ display: 'block', marginTop: '16px', color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src={medhaaIcon} alt="Medhā" style={{ width: '58px', height: '58px', objectFit: 'contain', margin: '0 auto 12px' }} />
          <h1 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 800, color: '#087f83' }}>Create a new password</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Choose a new password for your Medhā account.
          </p>
        </div>

        {error && (
          <div
            style={{
              color: '#b91c1c',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '0.88rem',
              lineHeight: 1.45,
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>New password</label>
          <div style={{ marginBottom: '14px' }}>
            <PasswordField value={password} onChange={setPassword} placeholder="Enter new password" autoFocus />
          </div>

          <label style={labelStyle}>Confirm password</label>
          <div style={{ marginBottom: '18px' }}>
            <PasswordField value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter new password" />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '10px',
              padding: '13px 16px',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading || !token ? 'not-allowed' : 'pointer',
              opacity: loading || !token ? 0.7 : 1,
            }}
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
            Back to Login
          </Link>
          {' · '}
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
