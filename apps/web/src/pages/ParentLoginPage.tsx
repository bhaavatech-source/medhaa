import { useLoginForm } from './hooks/useLoginForm';
import '../styles/parent-login.css';

export function ParentLoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginForm('parent', '/parent-dashboard');

  return (
    <div className="parent-login-page">
      <div className="parent-login-card">
        <div className="parent-login-brand">
          <div className="parent-login-logo">👨‍👩‍👧</div>
          <h1>Parent Portal</h1>
          <p>Track your child's progress and growth</p>
        </div>

        <form onSubmit={handleSubmit} className="parent-login-form">
          <label>
            Email
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>

          {error && <div className="parent-login-error">{error}</div>}

          <button type="submit" disabled={loading} className="parent-login-submit">
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <a href="/" className="parent-login-back">← Back to home</a>
      </div>
    </div>
  );
}

export default ParentLoginPage;