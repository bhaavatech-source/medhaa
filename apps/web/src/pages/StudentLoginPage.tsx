import { useSearchParams } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm';
import '../styles/student-login.css';

export default function StudentLoginPage() {
  const [searchParams] = useSearchParams();
  const gated = searchParams.get('gate') === '1';
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginForm('student', '/student');

  return (
    <div className="student-login-wrap">
      <div className="student-login-card">
        <div className="student-login-brand">
          <div className="student-login-logo">🧠</div>
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
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

          {error && <div className="student-login-error">{error}</div>}

          <button type="submit" disabled={loading} className="student-login-btn-primary">
            {loading ? 'Checking…' : 'Login & Play'}
          </button>
        </form>

        <p className="student-login-help">Don't have an account? <a href="/signup/student">Sign up</a></p>
      </div>
    </div>
  );
}