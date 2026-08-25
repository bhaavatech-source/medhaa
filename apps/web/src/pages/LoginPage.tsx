import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login-page.css';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

const API_URL = 'https://medhaa-tni1.onrender.com/api';

const roleConfig: Record<string, { title: string; subtitle: string; icon: string; gradient: string }> = {
  admin: { title: 'Admin Portal', subtitle: 'Manage schools, teachers & data', icon: '🛠️', gradient: 'linear-gradient(135deg, #dc2626, #ea580c)' },
  teacher: { title: 'Teacher Portal', subtitle: 'Track your class & student growth', icon: '🎓', gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)' },
  parent: { title: 'Parent Login', subtitle: "See your child's real progress", icon: '👨‍👩‍👧', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  student: { title: 'Student Login', subtitle: 'Continue your learning journey', icon: '🎮', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
};

function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
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

export function LoginPage({ role: roleProp }: { role?: string }) {
  const { role: roleParam } = useParams();
  const role = roleProp || roleParam || 'teacher';
  const config = roleConfig[role] ?? roleConfig.teacher;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
      login({ id: payload.id, email, role: payload.role }, data.accessToken);
      navigate(`/${payload.role}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-orbs">
        <span className="login-orb login-orb-1" style={{ background: config.gradient }} />
        <span className="login-orb login-orb-2" style={{ background: config.gradient }} />
      </div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            <img src={medhaaIcon} alt="Medhā" />
          </div>
          <h1 style={{ background: config.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            {config.title}
          </h1>
          <p>{config.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#2563eb',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading} className="login-submit" style={{ background: config.gradient }}>
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <a href="/" className="login-back">← Back to home</a>
      </div>
    </div>
  );
}

export default LoginPage;