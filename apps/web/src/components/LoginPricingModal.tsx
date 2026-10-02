import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../pages/hooks/useLoginForm';
import { API_URL } from '../utils/apiConfig';
import { ConsentCheckbox } from './ConsentCheckbox';
import '../styles/login-pricing-modal.css';

interface SubscriptionPlanPrice {
  id: string;
  amountPaise: number;
}


interface LoginPricingModalProps {
  onClose: () => void;
}


export default function LoginPricingModal({ onClose }: LoginPricingModalProps) {
 const navigate = useNavigate();
 const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginForm('', '/student/preview');
 const [consentChecked, setConsentChecked] = useState(false);
 const [plans, setPlans] = useState<SubscriptionPlanPrice[]>([]);
 const [pricesLoaded, setPricesLoaded] = useState(false);

 useEffect(() => {
   let active = true;
   fetch(`${API_URL}/subscriptions/plans`)
     .then((response) => {
       if (!response.ok) throw new Error('Could not load subscription prices');
       return response.json();
     })
     .then((data: { plans?: SubscriptionPlanPrice[] }) => {
       if (active) setPlans(data.plans ?? []);
     })
     .catch(() => {
       if (active) setPlans([]);
     })
     .finally(() => {
       if (active) setPricesLoaded(true);
     });
   return () => { active = false; };
 }, []);

 const monthlyPlan = plans.find((plan) => plan.id === 'MONTHLY_1');
 const yearlyPlan = plans.find((plan) => plan.id === 'YEARLY_1');
 const yearlySavings = monthlyPlan && yearlyPlan
   ? Math.round((1 - yearlyPlan.amountPaise / (monthlyPlan.amountPaise * 12)) * 100)
   : null;
 const formatPrice = (plan?: SubscriptionPlanPrice) => plan
   ? `₹${(plan.amountPaise / 100).toLocaleString('en-IN')}`
   : pricesLoaded ? 'Price unavailable' : 'Loading price…';

 const goSubscribe = (duration: 'monthly' | 'yearly') => {
   onClose();
   navigate('/subscribe', { state: { duration } });
 };
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
                <input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input type="password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
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
                <div className="lpm-plan-price">{formatPrice(monthlyPlan)}{monthlyPlan && <small>/month</small>}</div>
                <button type="button" className="lpm-plan-btn" disabled={!consentChecked} onClick={() => goSubscribe('monthly')}>Choose Monthly</button>
              </div>


              <div className="lpm-plan lpm-plan-highlight">
                {yearlySavings !== null && <span className="lpm-plan-badge">Save {yearlySavings}%</span>}
                <span className="lpm-plan-label">Yearly</span>
                <div className="lpm-plan-price">{formatPrice(yearlyPlan)}{yearlyPlan && <small>/year</small>}</div>
                <button type="button" className="lpm-plan-btn lpm-plan-btn-highlight" disabled={!consentChecked} onClick={() => goSubscribe('yearly')}>Choose Yearly</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
