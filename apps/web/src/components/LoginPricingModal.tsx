import { useState } from 'react';
import { useLoginForm } from '../pages/hooks/useLoginForm';
import { ConsentCheckbox } from './ConsentCheckbox';
import '../styles/login-pricing-modal.css';


interface LoginPricingModalProps {
  onClose: () => void;
}


export default function LoginPricingModal({ onClose }: LoginPricingModalProps) {
 const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginForm('student', '/student-demo');
 const [consentChecked, setConsentChecked] = useState(false);
  return (
    <div className="lpm-overlay">
      <div className="lpm-card">
        <button className="lpm-close" onClick={onClose} aria-label="Close">✕</button>


        <div className="lpm-grid">
          <div className="lpm-login-panel">
            <div className="lpm-logo">🎮</div>
            <h2>You've played 3 free games!</h2>
            <p className="lpm-sub">Log in to keep playing and unlock full reports.</p>


            <form onSubmit={handleSubmit} className="lpm-form">
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </label>


              {error && <div className="lpm-error">{error}</div>}


              <button type="submit" disabled={loading} className="lpm-submit">
                {loading ? 'Signing in…' : 'Log In'}
              </button>
            </form>
          </div>


          <div className="lpm-pricing-panel">
            <h2>Or subscribe for unlimited access</h2>
            <p className="lpm-sub">Unlimited games, all reports, latest updates.</p>


            <ConsentCheckbox checked={consentChecked} onChange={setConsentChecked} />


            <div className="lpm-plans">
              <div className="lpm-plan">
                <span className="lpm-plan-label">Monthly</span>
                <div className="lpm-plan-price">₹99<small>/month</small></div>
                <button className="lpm-plan-btn" disabled={!consentChecked}>Choose Monthly</button>
              </div>


              <div className="lpm-plan lpm-plan-highlight">
                <span className="lpm-plan-badge">Save ~40%</span>
                <span className="lpm-plan-label">Yearly</span>
                <div className="lpm-plan-price">₹699<small>/year</small></div>
                <button className="lpm-plan-btn lpm-plan-btn-highlight" disabled={!consentChecked}>Choose Yearly</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
