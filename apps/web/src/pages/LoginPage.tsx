import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login-page.css';

const API_URL = 'http://localhost:4000/api';

const roleConfig: Record<string, { title: string; subtitle: string; icon: string; gradient: string }> = {
  admin: { title: 'Admin Portal', subtitle: 'Manage schools, teachers & data', icon: '🛠️', gradient: 'linear-gradient(135deg, #dc2626, #ea580c)' },
  teacher: { title: 'Teacher Portal', subtitle: 'Track your class & student growth', icon: '🎓', gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)' },
  parent: { title: 'Parent Login', subtitle: "See your child's real progress", icon: '👨‍👩‍👧', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  student: { title: 'Student Login', subtitle: 'Continue your learning journey', icon: '🎮', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
};

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
          <div className="login-logo">{config.icon}</div>
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
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>

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