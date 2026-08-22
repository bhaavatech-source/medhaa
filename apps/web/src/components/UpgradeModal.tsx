import { useEffect, useState } from 'react';
import qrImage from '../assets/BT_QR.jpeg';
import '../styles/upgrade-modal.css';
import { authFetch } from '../utils/authFetch';

interface Plan {
  id: string;
  name: string;
  amountPaise: number;
  durationDays: number | null;
  description: string;
}

interface UpgradeModalProps {
  apiUrl: string;
  gameTitle: string;
  onClose: () => void;
}

type Step = 'choose-plan' | 'payment' | 'submitting' | 'submitted';

export function UpgradeModal({ apiUrl, gameTitle, onClose }: UpgradeModalProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [step, setStep] = useState<Step>('choose-plan');
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [refId, setRefId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}/subscriptions/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans));
  }, [apiUrl]);

  async function handleSelectPlan(plan: Plan) {
  setSelectedPlan(plan);

  const res = await authFetch(`${apiUrl}/subscriptions/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId: plan.id }),
  });

  const data = await res.json();
  setSubscriptionId(data.subscriptionId);
  setStep('payment');
}

  async function handleSubmitReference() {
  if (!subscriptionId) return;

  if (!refId.trim() || refId.trim().length < 4) {
    setError('Please enter a valid transaction reference ID');
    return;
  }

  setError('');
  setStep('submitting');

  const res = await authFetch(
    `${apiUrl}/subscriptions/${subscriptionId}/submit-reference`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionRef: refId.trim() }),
    }
  );

  if (!res.ok) {
    setError('Could not submit the reference. Please try again.');
    setStep('payment');
    return;
  }

  setStep('submitted');
}
  return (
    <div className="upgrade-backdrop" onClick={onClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="upgrade-close" onClick={onClose} aria-label="Close">×</button>

        {step === 'choose-plan' && (
          <>
            <h2 className="upgrade-title">Unlock &ldquo;{gameTitle}&rdquo;</h2>
            <p className="upgrade-sub">Choose a plan to unlock this and all premium games.</p>
            <div className="plan-list">
              {plans.map((plan) => (
                <button key={plan.id} className="plan-card" onClick={() => handleSelectPlan(plan)}>
                  <span className="plan-name">{plan.name}</span>
                  <span className="plan-price">₹{(plan.amountPaise / 100).toLocaleString('en-IN')}</span>
                  <span className="plan-duration">{plan.durationDays ? `${plan.durationDays} days` : 'Lifetime'}</span>
                  <span className="plan-desc">{plan.description}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'payment' && selectedPlan && (
          <>
            <h2 className="upgrade-title">Pay ₹{(selectedPlan.amountPaise / 100).toLocaleString('en-IN')}</h2>
            <p className="upgrade-sub">Scan the QR code below using any UPI app, then enter your transaction reference ID.</p>

            <img src={qrImage} alt="BhavaTech UPI QR Code" className="upgrade-qr" />
            <p className="upgrade-upi-id">UPI ID: yespay.smessi10194393@yesbankltd</p>

            <label className="upgrade-ref-label">
              Transaction Reference ID
              <input
                type="text"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                placeholder="e.g. 123456789012"
                className="upgrade-ref-input"
              />
            </label>

            {error && <div className="upgrade-error">{error}</div>}

            <button className="ive-paid-btn" onClick={handleSubmitReference}>Submit Reference ID</button>
          </>
        )}

        {step === 'submitting' && (
          <div className="upgrade-loading">
            <div className="spinner" />
            <p>Submitting your reference…</p>
          </div>
        )}

        {step === 'submitted' && (
          <div className="upgrade-success">
            <div className="success-icon">✅</div>
            <h2 className="upgrade-title">Reference submitted!</h2>
            <p className="upgrade-sub">
              We'll verify your payment and activate your subscription shortly. This usually takes a few hours.
            </p>
            <button className="ive-paid-btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}