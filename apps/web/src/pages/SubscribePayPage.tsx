// SubscribePayPage.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';

export function SubscribePayPage({ apiUrl }: { apiUrl: string }) {
  const { state } = useLocation() as { state: { subscriptionId: string; amount: number; plan: string; upiId: string } };
  const [ref, setRef] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submitRef() {
  if (ref.trim().length < 4) { setError('Please enter a valid transaction reference.'); return; }
  setStatus('submitting');
  const res = await authFetch(`${apiUrl}/subscriptions/${state.subscriptionId}/submit-reference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ transactionRef: ref.trim() }),
  });
  if (res.ok) setStatus('done');
  else { setError('Something went wrong. Please try again.'); setStatus('idle'); }
}

  if (status === 'done') {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Reference Submitted!</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Your subscription will be activated within a few hours after we verify the payment.
        </p>
        <button onClick={() => navigate('/student')} style={{ padding: '10px 24px', borderRadius: 999, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center', padding: 24 }}>
      <h2 style={{ fontWeight: 800, marginBottom: 4 }}>{state.plan}</h2>
      <p style={{ fontSize: 32, fontWeight: 800, color: '#6366f1', marginBottom: 20 }}>₹{state.amount}</p>

      <img src="/BT_QR.jpg" alt="Payment QR Code" style={{ width: 220, margin: '0 auto 16px', borderRadius: 12 }} />

      <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Or pay via UPI ID</p>
      <p style={{ fontWeight: 700, marginBottom: 24 }}>{state.upiId}</p>

      <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
          After payment, paste your transaction reference / UTR number below:
        </p>
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="e.g. 402812345678"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #ddd', marginBottom: 8, boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 8 }}>{error}</p>}
        <button
          onClick={submitRef}
          disabled={status === 'submitting'}
          style={{ width: '100%', padding: 12, borderRadius: 999, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit Reference'}
        </button>
      </div>
    </div>
  );
}