// apps/web/src/pages/AdminControlPanelPage.tsx
import { useEffect, useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'https://medhaa-tni1.onrender.com';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(opts.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.headers.get('content-type')?.includes('csv') ? res.blob() : res.json();
}

type UserRow = {
  id: string;
  email: string;
  role: string;
  isBlocked: boolean;
  canAccessAllGames: boolean;
  restrictedFeatures: string[];
  subscription?: { plan: string; status: string } | null;
};

type SubRow = {
  id: string;
  plan: string;
  status: string;
  amount: number | null;
  isGift: boolean;
  user: { email: string; role: string };
};

export default function AdminControlPanelPage() {
  const [tab, setTab] = useState<'users' | 'subscriptions' | 'revenue' | 'audit' | 'games'>('users');

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Admin Control Panel</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {(['users', 'subscriptions', 'revenue', 'audit', 'games'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ fontWeight: tab === t ? 700 : 400 }}>
            {t.toUpperCase()}
          </button>
        ))}
      </nav>
      {tab === 'users' && <UsersTab />}
      {tab === 'subscriptions' && <SubscriptionsTab />}
      {tab === 'revenue' && <RevenueTab />}
      {tab === 'audit' && <AuditTab />}
      {tab === 'games' && <GamesTab />}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ search, page: String(page), pageSize: '20' });
    if (role) params.set('role', role);
    const data = await api(`/users?${params.toString()}`);
    setUsers(data.users);
    setTotal(data.total);
  }, [search, role, page]);

  useEffect(() => { load(); }, [load]);

  const block = async (id: string) => {
    const reason = window.prompt('Reason for blocking?') ?? '';
    await api(`/users/${id}/block`, { method: 'POST', body: JSON.stringify({ reason }) });
    load();
  };
  const unblock = async (id: string) => { await api(`/users/${id}/unblock`, { method: 'POST' }); load(); };
  const toggleGameAccess = async (id: string, enabled: boolean) => {
    await api(`/users/${id}/game-access`, { method: 'POST', body: JSON.stringify({ enabled: !enabled }) });
    load();
  };
  const restrict = async (id: string) => {
    const raw = window.prompt('Comma-separated feature keys to restrict (e.g. play_games,leaderboard,chat):') ?? '';
    const features = raw.split(',').map((f) => f.trim()).filter(Boolean);
    await api(`/users/${id}/restrict`, { method: 'POST', body: JSON.stringify({ features }) });
    load();
  };
  const gift = async (id: string) => {
    const plan = window.prompt('Plan to gift (e.g. MONTHLY_1, YEARLY_1, PREMIUM):') ?? '';
    if (!plan) return;
    const days = Number(window.prompt('Number of days?', '30') ?? '30');
    const note = window.prompt('Note (optional):') ?? '';
    await api(`/users/${id}/gift-subscription`, { method: 'POST', body: JSON.stringify({ plan, days, note }) });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Search by email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="PARENT">Parent</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <table width="100%" cellPadding={6}>
        <thead>
          <tr><th>Email</th><th>Role</th><th>Plan</th><th>Blocked</th><th>All-Games Access</th><th>Restrictions</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.subscription?.plan ?? '-'} / {u.subscription?.status ?? '-'}</td>
              <td>{u.isBlocked ? 'BLOCKED' : '-'}</td>
              <td>{u.canAccessAllGames ? 'YES' : 'NO'}</td>
              <td>{u.restrictedFeatures?.join(', ') || '-'}</td>
              <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {u.isBlocked ? <button onClick={() => unblock(u.id)}>Unblock</button> : <button onClick={() => block(u.id)}>Block</button>}
                <button onClick={() => toggleGameAccess(u.id, u.canAccessAllGames)}>
                  {u.canAccessAllGames ? 'Revoke All-Games' : 'Grant All-Games'}
                </button>
                <button onClick={() => restrict(u.id)}>Set Restrictions</button>
                <button onClick={() => gift(u.id)}>Gift Subscription</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page} of {Math.max(1, Math.ceil(total / 20))}</span>
        <button disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

function SubscriptionsTab() {
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: '20' });
    if (status) params.set('status', status);
    const data = await api(`/subscriptions?${params.toString()}`);
    setSubs(data.subscriptions);
    setTotal(data.total);
  }, [status, page]);

  useEffect(() => { load(); }, [load]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const bulk = async (action: 'approve' | 'reject') => {
    if (!selected.length) return;
    await api('/subscriptions/bulk', { method: 'POST', body: JSON.stringify({ ids: selected, action }) });
    setSelected([]);
    load();
  };

  const exportCsv = async () => {
    const blob = (await api('/export/subscriptions.csv')) as Blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscriptions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIALING">Trialing</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button onClick={() => bulk('approve')} disabled={!selected.length}>Bulk Approve ({selected.length})</button>
        <button onClick={() => bulk('reject')} disabled={!selected.length}>Bulk Reject ({selected.length})</button>
        <button onClick={exportCsv}>Export CSV</button>
      </div>
      <table width="100%" cellPadding={6}>
        <thead><tr><th></th><th>Email</th><th>Plan</th><th>Status</th><th>Amount</th><th>Gift</th></tr></thead>
        <tbody>
          {subs.map((s) => (
            <tr key={s.id}>
              <td><input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} /></td>
              <td>{s.user.email}</td>
              <td>{s.plan}</td>
              <td>{s.status}</td>
              <td>{s.amount ?? '-'}</td>
              <td>{s.isGift ? 'YES' : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page} of {Math.max(1, Math.ceil(total / 20))}</span>
        <button disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

function RevenueTab() {
  const [summary, setSummary] = useState<any>(null);
  useEffect(() => { api('/revenue-summary').then(setSummary); }, []);
  if (!summary) return <p>Loading...</p>;
  return (
    <div>
      <h2>Total Revenue: ₹{summary.totalRevenue}</h2>
      <p>Active paid subscriptions: {summary.activePaidCount} | Gifted subscriptions: {summary.giftedCount}</p>
      <table width="100%" cellPadding={6}>
        <thead><tr><th>Plan</th><th>Count</th><th>Revenue</th></tr></thead>
        <tbody>
          {Object.entries(summary.byPlan).map(([plan, v]: any) => (
            <tr key={plan}><td>{plan}</td><td>{v.count}</td><td>₹{v.revenue}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  useEffect(() => { api(`/audit-log?page=${page}&pageSize=30`).then((d) => setLogs(d.logs)); }, [page]);
  return (
    <div>
      <table width="100%" cellPadding={6}>
        <thead><tr><th>Admin</th><th>Action</th><th>Details</th><th>When</th></tr></thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td>{l.user?.email}</td>
              <td>{l.action}</td>
              <td>{JSON.stringify(l.metadata)}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
      <button onClick={() => setPage((p) => p + 1)} style={{ marginLeft: 8 }}>Next</button>
    </div>
  );
}

function GamesTab() {
  const [form, setForm] = useState({ slug: '', title: '', domain: '', entryPath: '', isFreeTier: false });

  const createGame = async () => {
    await api('/games', { method: 'POST', body: JSON.stringify(form) });
    alert('Game created');
    setForm({ slug: '', title: '', domain: '', entryPath: '', isFreeTier: false });
  };

  return (
    <div>
      <h2>Add New Game</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
        <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
        <input placeholder="entryPath (e.g. /games/memory-match)" value={form.entryPath} onChange={(e) => setForm({ ...form, entryPath: e.target.value })} />
        <label><input type="checkbox" checked={form.isFreeTier} onChange={(e) => setForm({ ...form, isFreeTier: e.target.checked })} /> Free tier</label>
        <button onClick={createGame}>Create Game</button>
      </div>
      <p style={{ marginTop: 16, color: '#666' }}>
        To delete/disable a game, call <code>DELETE /api/admin/games/:id</code> from the existing games list UI
        (auto soft-deletes if attempt history exists, hard-deletes otherwise).
      </p>
    </div>
  );
}
