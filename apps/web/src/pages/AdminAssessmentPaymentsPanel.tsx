import { useEffect, useState, useCallback } from 'react';
import { authFetch } from '../utils/authFetch';

const API_URL = import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

async function adminJsonFetch(path: string, options: RequestInit = {}) {
  const res = await authFetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function paymentDetails(paymentReference: any) {
  if (!paymentReference || typeof paymentReference !== 'object' || Array.isArray(paymentReference)) return null;
  return paymentReference;
}

export default function AdminAssessmentPaymentsPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pageSize = 25;

  const load = useCallback(async () => {
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      const data = await adminJsonFetch(`/admin/assessments?${params.toString()}`);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setError(e.message || 'Unable to load assessments');
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function verify(id: string) {
    setBusyId(id);
    setError('');
    try {
      await adminJsonFetch(`/admin-assessment/cognitive/${id}/verify-payment`, { method: 'PATCH', body: JSON.stringify({}) });
      await load();
    } catch (e: any) {
      setError(e.message || 'Unable to verify payment');
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: string) {
    const reason = window.prompt('Reason for rejecting this payment (optional):', 'Payment could not be verified');
    if (reason === null) return;
    setBusyId(id);
    setError('');
    try {
      await adminJsonFetch(`/admin-assessment/cognitive/${id}/reject-payment`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
      await load();
    } catch (e: any) {
      setError(e.message || 'Unable to reject payment');
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div>
          <h2 className="admin-section-title" style={{ marginBottom: 4 }}>Cognitive Assessment payments</h2>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Verify UPI payment references before the participant's detailed profile is unlocked.</div>
        </div>
        <button type="button" onClick={load} disabled={!!busyId}>Refresh</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>When</th><th>Participant</th><th>Age</th><th>Mode</th><th>Contact</th><th>Score</th><th>Payment</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((a) => {
              const p = paymentDetails(a.paymentReference);
              const status = String(p?.status || (a.resultLevel === 'full' ? 'VERIFIED' : 'PENDING')).toUpperCase();
              const reference = p?.reference ?? p?.utr ?? p?.UTR ?? '—';
              const expanded = expandedId === a.id;
              return (
                <tr key={a.id}>
                  <td>{new Date(a.createdAt).toLocaleString()}</td>
                  <td>{a.participantName || '—'}{a.parentName ? <div style={{ fontSize: 11, color: '#6b7280' }}>Guardian: {a.parentName}</div> : null}</td>
                  <td>{a.participantAge ?? '—'}</td>
                  <td>{a.mode || a.assessmentMode || '—'}</td>
                  <td>{a.participantEmail || a.participantPhone || '—'}</td>
                  <td>{a.overallScore ?? '—'}</td>
                  <td>
                    <span className="admin-badge">{status}</span>
                    <div style={{ fontSize: 11, marginTop: 4 }} className="admin-mono">{reference}</div>
                    {expanded && p && (
                      <div style={{ fontSize: 11, marginTop: 7, lineHeight: 1.45 }}>
                        {p.amount != null && <div>Amount: ₹{p.amount}</div>}
                        {p.submittedAt && <div>Submitted: {new Date(p.submittedAt).toLocaleString()}</div>}
                        {p.verifiedAt && <div>Verified: {new Date(p.verifiedAt).toLocaleString()}</div>}
                        {p.rejectedAt && <div>Rejected: {new Date(p.rejectedAt).toLocaleString()}</div>}
                        {p.rejectionReason && <div>Reason: {p.rejectionReason}</div>}
                      </div>
                    )}
                    <button type="button" className="admin-toggle" onClick={() => setExpandedId(expanded ? null : a.id)}>
                      {expanded ? 'Hide details' : 'Details'}
                    </button>
                  </td>
                  <td className="admin-row-actions">
                    <button type="button" disabled={busyId === a.id || status === 'VERIFIED'} onClick={() => verify(a.id)}>
                      {busyId === a.id ? 'Saving…' : 'Verify'}
                    </button>
                    <button type="button" className="admin-danger-btn" disabled={busyId === a.id || status === 'VERIFIED'} onClick={() => reject(a.id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && <tr><td colSpan={8} className="admin-empty-row">No assessment submissions yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
        <span>Page {page} of {totalPages} · {total} entries</span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
      </div>
    </div>
  );
}
