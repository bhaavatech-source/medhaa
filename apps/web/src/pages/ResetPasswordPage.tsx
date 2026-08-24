import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import medhaaLogo from '../assets/logo/M_2.png';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(
    () => searchParams.get('token') || '',
    [searchParams]
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const passwordValid = password.length >= 8;
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    if (!token) {
      setError(
        'This password reset link is invalid or incomplete. Please request a new reset link.'
      );
      return;
    }

    if (!passwordValid) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!passwordsMatch) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            'Unable to reset your password. Please request a new reset link.'
        );
      }

      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reset your password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
        background:
          'radial-gradient(circle at 18% 22%, rgba(58, 119, 239, 0.28), transparent 32%), linear-gradient(135deg, #142c38 0%, #0f2631 48%, #17465a 100%)',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      }}
    >
      <section
        aria-labelledby="reset-password-title"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '42px 40px 38px',
          boxSizing: 'border-box',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.22)',
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '26px',
          }}
        >
          <img
  src={medhaaLogo}
  alt="Medhā"
  style={{
    width: '76px',
    height: '76px',
    objectFit: 'contain',
    display: 'block',
    marginBottom: '8px',
  }}
/>

          <div
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#087f83',
              letterSpacing: '-0.03em',
            }}
          >
          </div>
        </div>

        {!success ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1
                id="reset-password-title"
                style={{
                  margin: 0,
                  color: '#087f83',
                  fontSize: '28px',
                  lineHeight: 1.2,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                Create a new password
              </h1>

              <p
                style={{
                  margin: '12px auto 0',
                  maxWidth: '350px',
                  color: '#607174',
                  fontSize: '15px',
                  lineHeight: 1.6,
                }}
              >
                Choose a new password for your Medhā account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  marginBottom: '20px',
                  padding: '14px 15px',
                  borderRadius: '12px',
                  background: '#fff1f1',
                  border: '1px solid #f1b7b7',
                  color: '#a33a3a',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* New password */}
              <label
                htmlFor="new-password"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#24383c',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                New password
              </label>

              <div
                style={{
                  position: 'relative',
                  marginBottom: '8px',
                }}
              >
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  disabled={loading}
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
                    background: loading ? '#f5f7f7' : '#ffffff',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
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
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div
                style={{
                  marginBottom: '20px',
                  fontSize: '12px',
                  color: password.length === 0
                    ? '#708083'
                    : passwordValid
                      ? '#39835d'
                      : '#b05a5a',
                }}
              >
                {password.length === 0
                  ? 'Use at least 8 characters.'
                  : passwordValid
                    ? '✓ Password length is valid.'
                    : 'Password must contain at least 8 characters.'}
              </div>

              {/* Confirm password */}
              <label
                htmlFor="confirm-password"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#24383c',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                Confirm password
              </label>

              <div
                style={{
                  position: 'relative',
                  marginBottom: '8px',
                }}
              >
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  disabled={loading}
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
                    background: loading ? '#f5f7f7' : '#ffffff',
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
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
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div
                style={{
                  minHeight: '18px',
                  marginBottom: '22px',
                  fontSize: '12px',
                  color:
                    confirmPassword.length === 0
                      ? '#708083'
                      : passwordsMatch
                        ? '#39835d'
                        : '#b05a5a',
                }}
              >
                {confirmPassword.length === 0
                  ? 'Enter the same password again.'
                  : passwordsMatch
                    ? '✓ Passwords match.'
                    : 'Passwords do not match.'}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !passwordValid ||
                  !passwordsMatch
                }
                style={{
                  width: '100%',
                  height: '48px',
                  border: 0,
                  borderRadius: '10px',
                  background:
                    loading ||
                    !passwordValid ||
                    !passwordsMatch
                      ? '#aabfc1'
                      : 'linear-gradient(90deg, #2869eb, #0db2ca)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor:
                    loading ||
                    !passwordValid ||
                    !passwordsMatch
                      ? 'not-allowed'
                      : 'pointer',
                  boxShadow:
                    loading ||
                    !passwordValid ||
                    !passwordsMatch
                      ? 'none'
                      : '0 8px 20px rgba(22, 125, 180, 0.22)',
                }}
              >
                {loading ? 'Resetting password...' : 'Reset Password'}
              </button>
            </form>

            <div
              style={{
                textAlign: 'center',
                marginTop: '24px',
              }}
            >
              <Link
                to="/login"
                style={{
                  color: '#2869eb',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                ← Back to login
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div
              aria-hidden="true"
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#e8f8ef',
                color: '#258052',
                fontSize: '30px',
                fontWeight: 800,
              }}
            >
              ✓
            </div>

            <h1
              style={{
                margin: 0,
                color: '#087f83',
                fontSize: '27px',
                lineHeight: 1.25,
                fontWeight: 800,
              }}
            >
              Password reset successfully
            </h1>

            <p
              style={{
                margin: '14px auto 26px',
                color: '#607174',
                fontSize: '15px',
                lineHeight: 1.6,
                maxWidth: '340px',
              }}
            >
              Your Medhā password has been changed. You can now sign in
              using your new password.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                height: '48px',
                border: 0,
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #2869eb, #0db2ca)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Go to Login
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
