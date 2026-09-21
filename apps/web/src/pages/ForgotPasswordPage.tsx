import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';
import { API_URL } from '../utils/apiConfig';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);



  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Unable to process your request.'
        );
      }

      setMessage(
        data.message ||
          'If an account exists for this email, password reset instructions have been sent.'
      );
    } catch (err: any) {
      setError(
        err.message ||
          'Unable to process your request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.35), transparent 30%), linear-gradient(135deg, #101322, #183d46)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '36px 34px',
          boxSizing: 'border-box',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.20)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={medhaaIcon}
              alt="Medhā"
              style={{
                width: '58px',
                height: '58px',
                objectFit: 'contain',
              }}
            />
          </div>

          <h1
            style={{
              margin: '0 0 8px',
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#087f83',
            }}
          >
            Forgot your password?
          </h1>

          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '0.94rem',
              lineHeight: 1.55,
            }}
          >
            Enter your email address and we'll help you reset your
            password.
          </p>
        </div>

        {message ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#166534',
              fontSize: '0.92rem',
              lineHeight: 1.5,
              marginBottom: '20px',
            }}
          >
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                color: '#334155',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              Email address
            </label>

            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                outline: 'none',
                fontSize: '0.95rem',
                marginBottom: '12px',
              }}
            />

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
                  marginBottom: '12px',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: '10px',
                padding: '13px 16px',
                background:
                  'linear-gradient(135deg, #2563eb, #06b6d4)',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate('/login/student')}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '20px',
            padding: '8px',
            border: 'none',
            background: 'transparent',
            color: '#2563eb',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          ← Back to login
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '4px',
            padding: '8px',
            border: 'none',
            background: 'transparent',
            color: '#64748b',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
