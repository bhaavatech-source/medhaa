import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import { API_URL } from '../utils/apiConfig';

type SubUser = { id: string; email: string; role: string };

type Subscription = {
  id: string;
  userId: string;
  plan: string;
  status: 'TRIALING' | 'PENDING' | 'ACTIVE' | string;
  amount: number | null;
  paymentMethod: string | null;
  transactionRef: string | null;
  notes: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  user: SubUser;
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  TRIALING: { bg: '#eef2ff', color: '#4338ca' },
  PENDING: { bg: '#fff7ed', color: '#c2410c' },
  ACTIVE: { bg: '#ecfdf5', color: '#047857' },
};

function StatusBadge({ status, currentPeriodEnd }: { status: string; currentPeriodEnd: string | null }) {
  const expired =
    status === 'ACTIVE' && currentPeriodEnd && new Date(currentPeriodEnd).getTime() < Date.now();
  const display = expired ? 'EXPIRED' : status;
  const palette = expired
    ? { bg: '#fef2f2', color: '#b91c1c' }
    : STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: palette.bg,
        color: palette.color,
        whiteSpace: 'nowrap',
      }}
    >
      {display}
    </span>
  );
}

export default function AdminSubscriptionsPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'TRIALING'>('ALL');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await authFetch(`${API_URL}/subscriptions`, { method: 'GET' });
      if (res.status === 403 || res.status === 401) {
        setAccessDenied(true);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load subscriptions.');
      }
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while loading subscriptions.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: 'confirm' | 'reject' | 'disable') {
    setBusyId(id);
    try {
      const res = await authFetch(`${API_URL}/subscriptions/${id}/${action}`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Action failed. Please try again.');
      }
      await load();
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setBusyId(null);
    }
  }

  if (accessDenied) {
    return (
      <div style={{ maxWidth: 480, margin: '100px auto', textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Admins only</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            border: 'none',
            background: '#6366f1',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const filtered = (subscriptions || [])
    .filter((s) => (filter === 'ALL' ? true : s.status === filter))
    .filter((s) => (search.trim() ? s.user?.email?.toLowerCase().includes(search.trim().toLowerCase()) : true));

  const counts = {
    ALL: subscriptions?.length || 0,
    PENDING: subscriptions?.filter((s) => s.status === 'PENDING').length || 0,
    ACTIVE: subscriptions?.filter((s) => s.status === 'ACTIVE').length || 0,
    TRIALING: subscriptions?.filter((s) => s.status === 'TRIALING').length || 0,
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 20px 60px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#111827' }}>Subscriptions</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0' }}>
            Review, approve, and manage every Medhā subscription in one place.
          </p>
        </div>
        <button
          onClick={load}
          style={{
            padding: '8px 16px',
            borderRadius: 10,
            border: '1px solid #d1d5db',
            background: '#fff',
            color: '#374151',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ⟲ Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {(['ALL', 'PENDING', 'ACTIVE', 'TRIALING'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: filter === f ? '1.5px solid #6366f1' : '1.5px solid #e5e7eb',
              background: filter === f ? '#eef2ff' : '#fff',
              color: filter === f ? '#4338ca' : '#374151',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()} ({counts[f]})
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email…"
          style={{
            marginLeft: 'auto',
            minWidth: 220,
            padding: '8px 14px',
            borderRadius: 10,
            border: '1.5px solid #e5e7eb',
          }}
        />
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: '#fef2f2', color: '#b91c1c', fontSize: 14 }}>
          {error}
        </div>
      )}

      {subscriptions === null && !error ? (
        <p style={{ color: '#6b7280' }}>Loading subscriptions…</p>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', border: '1.5px dashed #e5e7eb', borderRadius: 16 }}>
          No subscriptions match this filter.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 16, background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Plan</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Transaction Ref</th>
                <th style={thStyle}>Notes</th>
                <th style={thStyle}>Period Ends</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{s.user?.email || '—'}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{s.user?.role}</div>
                  </td>
                  <td style={tdStyle}>{s.plan}</td>
                  <td style={tdStyle}>
                    <StatusBadge status={s.status} currentPeriodEnd={s.currentPeriodEnd} />
                  </td>
                  <td style={tdStyle}>{s.amount ? `₹${(s.amount / 100).toFixed(0)}` : '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.transactionRef || '—'}</span>
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 220 }}>
                    <span style={{ fontSize: 12, color: '#4b5563' }} title={s.notes || ''}>
                      {s.notes ? (s.notes.length > 60 ? `${s.notes.slice(0, 60)}…` : s.notes) : '—'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {s.currentPeriodEnd
                      ? new Date(s.currentPeriodEnd).toLocaleDateString()
                      : s.trialEndsAt
                      ? `Trial: ${new Date(s.trialEndsAt).toLocaleDateString()}`
                      : '—'}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {s.status === 'PENDING' && (
                        <>
                          <button
                            disabled={busyId === s.id}
                            onClick={() => act(s.id, 'confirm')}
                            style={actionBtn('#059669')}
                          >
                            Approve
                          </button>
                          <button
                            disabled={busyId === s.id}
                            onClick={() => act(s.id, 'reject')}
                            style={actionBtn('#dc2626')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {s.status === 'ACTIVE' && (
                        <button
                          disabled={busyId === s.id}
                          onClick={() => act(s.id, 'disable')}
                          style={actionBtn('#dc2626')}
                        >
                          Disable
                        </button>
                      )}
                      {s.status === 'TRIALING' && (
                        <span style={{ color: '#9ca3af', fontSize: 12 }}>No action needed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 12,
  fontWeight: 700,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 14px',
  verticalAlign: 'top',
};

function actionBtn(color: string): React.CSSProperties {
  return {
    padding: '6px 12px',
    borderRadius: 8,
    border: 'none',
    background: color,
    color: '#fff',
    fontWeight: 700,
    fontSize: 12,
    cursor: 'pointer',
  };
}
