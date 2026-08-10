import { useSignupForm } from './hooks/useSignupForm';
import '../styles/school-login.css';

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
          <div className="school-logo">🏫</div>
          <h1>School Sign Up</h1>
          <p>Register your school and manage student growth</p>
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
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourschool.edu" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
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
              <input type="text" value={extraData.city || ''} onChange={(e) => setExtraData({ ...extraData, city: e.target.value })} placeholder="e.g. Guntur" />
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
      </div>
    </div>
  );
}