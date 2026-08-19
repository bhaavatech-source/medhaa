import { useSignupForm } from './hooks/useSignupForm';
import '../styles/parent-login.css';

export default function ParentSignupPage() {
  const { name, setName, email, setEmail, password, setPassword, extraData, setExtraData, error, message, loading, handleSubmit } = useSignupForm('parent', '/login/parent');

  return (
    <div className="parent-login-page">
      <div className="parent-login-orbs">
        <span className="pl-orb pl-orb-1" />
        <span className="pl-orb pl-orb-2" />
      </div>

      <div className="parent-login-card">
        <div className="parent-login-brand">
          <div className="parent-login-logo">👨‍👩‍👧</div>
          <h1>Parent Sign Up</h1>
          <p>Track your child's progress and growth</p>
        </div>

        {message ? (
          <p className="parent-login-help">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="parent-login-form">
            <label>
              Full Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
            </label>
            <label>
              Email
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
            </label>
            <label>
              Child's Name or Email (optional)
              <input type="text" value={extraData.childRef || ''} onChange={(e) => setExtraData({ ...extraData, childRef: e.target.value })} placeholder="Helps us link your child's account" />
            </label>
            <label>
              Relationship (optional)
              <select value={extraData.relationship || ''} onChange={(e) => setExtraData({ ...extraData, relationship: e.target.value })}>
                <option value="">Select</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Guardian">Guardian</option>
              </select>
            </label>
            <label>
              Phone (optional)
              <input type="tel" value={extraData.phone || ''} onChange={(e) => setExtraData({ ...extraData, phone: e.target.value })} placeholder="9876543210" />
            </label>

            {error && <div className="parent-login-error">{error}</div>}

            <button type="submit" disabled={loading} className="parent-login-submit">
              {loading ? 'Submitting…' : 'Sign Up'}
            </button>
          </form>
        )}

        <a href="/login/parent" className="parent-login-back">Already have an account? Log in</a>
      </div>
    </div>
  );
}