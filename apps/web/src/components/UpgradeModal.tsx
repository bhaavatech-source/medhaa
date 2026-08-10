import { useEffect, useState } from 'react';
import '../styles/upgrade-modal.css';

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

type Step = 'choose-plan' | 'payment' | 'confirming' | 'success';

export function UpgradeModal({ apiUrl, gameTitle, onClose }: UpgradeModalProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [step, setStep] = useState<Step>('choose-plan');
  const [paymentLinks, setPaymentLinks] = useState<{ upiLink: string; whatsappLink: string; subscriptionId: string } | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/subscriptions/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans));
  }, [apiUrl]);

  async function handleSelectPlan(plan: Plan) {
    setSelectedPlan(plan);
    const token = localStorage.getItem('access-token');
    const res = await fetch(`${apiUrl}/subscriptions/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ planId: plan.id }),
    });
    const data = await res.json();
    setPaymentLinks(data);
    setStep('payment');
  }

  async function handleIveePaid() {
    if (!paymentLinks) return;
    setStep('confirming');
    const token = localStorage.getItem('access-token');
    await fetch(`${apiUrl}/subscriptions/${paymentLinks.subscriptionId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ transactionRef: 'pending-manual-verification' }),
    });
    setStep('success');
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

        {step === 'payment' && paymentLinks && selectedPlan && (
          <>
            <h2 className="upgrade-title">Pay ₹{(selectedPlan.amountPaise / 100).toLocaleString('en-IN')}</h2>
            <p className="upgrade-sub">Complete payment via UPI or WhatsApp, then tap &ldquo;I&apos;ve Paid&rdquo;.</p>
            <div className="payment-options">
              <a href={paymentLinks.upiLink} className="pay-btn pay-upi">Pay via UPI / GPay / PhonePe</a>
              <a href={paymentLinks.whatsappLink} target="_blank" rel="noopener noreferrer" className="pay-btn pay-whatsapp">
                Confirm via WhatsApp
              </a>
            </div>
            <button className="ive-paid-btn" onClick={handleIveePaid}>I&apos;ve Paid</button>
          </>
        )}

        {step === 'confirming' && (
          <div className="upgrade-loading">
            <div className="spinner" />
            <p>Confirming your payment…</p>
          </div>
        )}

        {step === 'success' && (
          <div className="upgrade-success">
            <div className="success-icon">🎉</div>
            <h2 className="upgrade-title">You&apos;re all set!</h2>
            <p className="upgrade-sub">Your subscription is active. Refresh to start playing.</p>
            <button className="ive-paid-btn" onClick={() => window.location.reload()}>Refresh Now</button>
          </div>
        )}
      </div>
    </div>
  );
}