import { useEffect, useState, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import AdminSubscriptionsPage from './AdminSubscriptionsPage';
import '../styles/admin-console.css';
import AdminAssessmentPaymentsPanel from './AdminAssessmentPaymentsPanel';

const API_URL = import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

type Tab = 'overview' | 'users' | 'schools' | 'subscriptions' | 'coupons' | 'games' | 'assessments' | 'audit';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '◧' },
  { id: 'users', label: 'Users', icon: '◍' },
  { id: 'schools', label: 'Schools', icon: '⌂' },
  { id: 'subscriptions', label: 'Subscriptions', icon: '✧' },
  { id: 'coupons', label: 'Coupons', icon: '◈' },
  { id: 'games', label: 'Games', icon: '▣' },
  { id: 'assessments', label: 'Assessments', icon: '✎' },
  { id: 'audit', label: 'Audit Logs', icon: '≡' },
];

async function jsonFetch(path: string, options: RequestInit = {}) {
  const res = await authFetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

function OverviewTab() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    jsonFetch('/overview').then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="admin-error">{error}</div>;
  if (!data) return <div className="admin-loading">Loading overview…</div>;

  const t = data.totals;
  const r = data.realUsage;
  const cards = [
    { label: 'Total users', value: t.totalUsers },
    { label: 'Students', value: t.students },
    { label: 'Parents', value: t.parents },
    { label: 'Teachers', value: t.teachers },
    { label: 'Admins', value: t.admins },
    { label: 'Schools', value: t.schools },
    { label: 'Games', value: t.games },
    { label: 'Active subscriptions', value: t.activeSubs },
    { label: 'Trialing', value: t.trialingSubs },
    { label: 'Pending payments', value: t.pendingSubs },
  ];

  const realCards = [
    { label: 'Real users (excl. demo accounts)', value: r.realUsers },
    { label: 'Demo/seed accounts', value: r.demoUsers },
    { label: 'New signups (7 days)', value: r.newSignups7d },
    { label: 'New signups (30 days)', value: r.newSignups30d },
    { label: 'Logged in (7 days)', value: r.activeUsers7d },
    { label: 'Logged in (30 days)', value: r.activeUsers30d },
  ];

  return (
    <div>
      <h2 className="admin-section-title">Real usage (excludes demo/seed accounts)</h2>
      <div className="admin-stat-grid">
        {realCards.map((c) => (
          <div className="admin-stat-card" key={c.label}>
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      <h2 className="admin-section-title">All accounts</h2>
      <div className="admin-stat-grid">
        {cards.map((c) => (
          <div className="admin-stat-card" key={c.label}>
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      <h2 className="admin-section-title">Recent activity</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>When</th><th>Admin</th><th>Action</th><th>Details</th></tr>
          </thead>
          <tbody>
            {data.recentAuditLogs.length === 0 && (
              <tr><td colSpan={4} className="admin-empty-row">No admin actions recorded yet.</td></tr>
            )}
            {data.recentAuditLogs.map((log: any) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.user?.email}</td>
                <td><span className="admin-badge">{log.action}</span></td>
                <td className="admin-meta-cell">{log.metadata ? JSON.stringify(log.metadata) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

function RoleChangeForm({ userRow, schools, onDone }: { userRow: any; schools: any[]; onDone: () => void }) {
  const [role, setRole] = useState(userRow.role);
  const [schoolId, setSchoolId] = useState('');
  const [fullName, setFullName] = useState(userRow.fullName || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const needsSchool = role === 'TEACHER' || role === 'ADMIN';

  async function submit() {
    setBusy(true);
    setError('');
    try {
      await jsonFetch(`/users/${userRow.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role, schoolId: needsSchool ? schoolId : undefined, fullName }),
      });
      onDone();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-inline-form">
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="STUDENT">Student</option>
        <option value="PARENT">Parent</option>
        <option value="TEACHER">Teacher</option>
        <option value="ADMIN">Admin</option>
      </select>
      <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      {needsSchool && (
        <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
          <option value="">Select school…</option>
          {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}
      <button type="button" disabled={busy || (needsSchool && !schoolId)} onClick={submit}>Save</button>
      {error && <span className="admin-inline-error">{error}</span>}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const pageSize = 20;

  const load = useCallback(async () => {
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search.trim()) params.set('search', search.trim());
      if (role) params.set('role', role);
      if (status) params.set('status', status);
      const data = await jsonFetch(`/users?${params.toString()}`);
      setUsers(data.users);
      setTotal(data.total);
    } catch (e: any) {
      setError(e.message);
    }
  }, [page, search, role, status]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { jsonFetch('/schools').then((d) => setSchools(d.schools)).catch(() => {}); }, []);

  async function toggleStatus(u: any) {
    try {
      await jsonFetch(`/users/${u.id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive: !u.isActive }) });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="admin-toolbar">
        <input placeholder="Search by email…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        <select value={role} onChange={(e) => { setPage(1); setRole(e.target.value); }}>
          <option value="">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="PARENT">Parent</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Email</th><th>Role</th><th>Name</th><th>School</th><th>Subscription</th><th>Status</th><th>Last active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <Fragment key={u.id}>
                <tr key={u.id}>
                  <td>{u.email}{u.isDemo && <span className="admin-badge admin-badge-demo">DEMO</span>}</td>
                  <td><span className="admin-badge">{u.role}</span></td>
                  <td>{u.fullName || '—'}</td>
                  <td>{u.schoolName || '—'}</td>
                  <td>{u.subscriptionStatus || '—'}</td>
                  <td>
                    <span className={`admin-status-dot ${u.isActive ? 'is-active' : 'is-disabled'}`} />
                    {u.isActive ? 'Active' : 'Disabled'}
                  </td>
                  <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}</td>
                  <td className="admin-row-actions">
                    <button type="button" onClick={() => setEditingId(editingId === u.id ? null : u.id)}>
                      {editingId === u.id ? 'Cancel' : 'Change role'}
                    </button>
                    <button type="button" className={u.isActive ? 'admin-danger-btn' : ''} onClick={() => toggleStatus(u)}>
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
                {editingId === u.id && (
                  <tr>
                    <td colSpan={8}>
                      <RoleChangeForm userRow={u} schools={schools} onDone={() => { setEditingId(null); load(); }} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {users.length === 0 && <tr><td colSpan={8} className="admin-empty-row">No users match these filters.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
        <span>Page {page} of {totalPages} · {total} users</span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Schools
// ---------------------------------------------------------------------------

function SchoolsTab() {
  const [schools, setSchools] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [editing, setEditing] = useState<{ id: string; name: string; address: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await jsonFetch('/schools');
      setSchools(data.schools);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createSchool() {
    if (!name.trim()) return;
    try {
      await jsonFetch('/schools', { method: 'POST', body: JSON.stringify({ name, address }) });
      setName('');
      setAddress('');
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      await jsonFetch(`/schools/${editing.id}`, { method: 'PATCH', body: JSON.stringify({ name: editing.name, address: editing.address }) });
      setEditing(null);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function removeSchool(id: string) {
    try {
      await jsonFetch(`/schools/${id}`, { method: 'DELETE' });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div className="admin-form-panel">
        <h3>Add a school</h3>
        <div className="admin-inline-form">
          <input placeholder="School name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} />
          <button type="button" onClick={createSchool} disabled={!name.trim()}>Add school</button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Address</th><th>Students</th><th>Teachers</th><th>Admins</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {schools.map((s) => (
              <Fragment key={s.id}>
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.address || '—'}</td>
                  <td>{s._count.students}</td>
                  <td>{s._count.teachers}</td>
                  <td>{s._count.admins}</td>
                  <td className="admin-row-actions">
                    <button type="button" onClick={() => setEditing(editing?.id === s.id ? null : { id: s.id, name: s.name, address: s.address || '' })}>
                      {editing?.id === s.id ? 'Cancel' : 'Edit'}
                    </button>
                    <button type="button" className="admin-danger-btn" onClick={() => removeSchool(s.id)}>Delete</button>
                  </td>
                </tr>
                {editing?.id === s.id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-inline-form">
                        <input value={editing!.name} onChange={(e) => setEditing({ ...editing!, name: e.target.value })} />
                        <input value={editing!.address} onChange={(e) => setEditing({ ...editing!, address: e.target.value })} />
                        <button type="button" onClick={saveEdit}>Save</button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {schools.length === 0 && <tr><td colSpan={6} className="admin-empty-row">No schools yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

function CouponsTab() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ code: '', type: 'referral', rewardType: 'coins', rewardValue: '', maxRedemptions: '', expiresAt: '' });

  const load = useCallback(async () => {
    try {
      const data = await jsonFetch('/coupons');
      setCoupons(data.coupons);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createCoupon() {
    try {
      await jsonFetch('/coupons', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      });
      setForm({ code: '', type: 'referral', rewardType: 'coins', rewardValue: '', maxRedemptions: '', expiresAt: '' });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function removeCoupon(id: string) {
    try {
      await jsonFetch(`/coupons/${id}`, { method: 'DELETE' });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div className="admin-form-panel">
        <h3>Create a coupon</h3>
        <div className="admin-inline-form admin-inline-form--wrap">
          <input placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="school">School</option>
            <option value="festival">Festival</option>
            <option value="referral">Referral</option>
            <option value="teacher">Teacher</option>
            <option value="event">Event</option>
            <option value="birthday">Birthday</option>
          </select>
          <select value={form.rewardType} onChange={(e) => setForm({ ...form, rewardType: e.target.value })}>
            <option value="coins">Coins</option>
            <option value="premium_days">Premium days</option>
            <option value="discount_percent">Discount %</option>
            <option value="game_pack">Game pack</option>
          </select>
          <input placeholder="Reward value" value={form.rewardValue} onChange={(e) => setForm({ ...form, rewardValue: e.target.value })} />
          <input placeholder="Max redemptions (optional)" type="number" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })} />
          <input placeholder="Expires (optional)" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <button type="button" onClick={createCoupon} disabled={!form.code.trim() || !form.rewardValue.trim()}>Create</button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Code</th><th>Type</th><th>Reward</th><th>Redeemed</th><th>Expires</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.code}</strong></td>
                <td>{c.type}</td>
                <td>{c.rewardType}: {c.rewardValue}</td>
                <td>{c.redeemedCount}{c.maxRedemptions ? ` / ${c.maxRedemptions}` : ''}</td>
                <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                <td className="admin-row-actions">
                  <button type="button" className="admin-danger-btn" onClick={() => removeCoupon(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan={6} className="admin-empty-row">No coupons yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Games
// ---------------------------------------------------------------------------

const GAME_TIERS = ['assessment', 'permanent-free', 'rotating-free', 'premium-only'];

function GameEditForm({ game, onDone }: { game: any; onDone: () => void }) {
  const [form, setForm] = useState({
    title: game.title,
    domain: game.domain,
    entryPath: game.entryPath,
    ageLabel: game.ageLabel || '',
    skills: (game.skills || []).join(', '),
    kind: game.kind,
    tier: game.tier || 'premium-only',
    isFreeTier: game.isFreeTier,
    isActive: game.isActive,
  });
  const [error, setError] = useState('');

  async function save() {
    try {
      await jsonFetch(`/games/${game.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...form, skills: form.skills.split(',').map((s: string) => s.trim()).filter(Boolean) }),
      });
      onDone();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="admin-inline-form admin-inline-form--wrap">
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
      <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="Domain" />
      <input value={form.entryPath} onChange={(e) => setForm({ ...form, entryPath: e.target.value })} placeholder="Entry path" />
      <input value={form.ageLabel} onChange={(e) => setForm({ ...form, ageLabel: e.target.value })} placeholder="Age label" />
      <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated)" />
      <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
        {GAME_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <label className="admin-checkbox"><input type="checkbox" checked={form.isFreeTier} onChange={(e) => setForm({ ...form, isFreeTier: e.target.checked })} /> Free tier</label>
      <label className="admin-checkbox"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
      <button type="button" onClick={save}>Save</button>
      {error && <span className="admin-inline-error">{error}</span>}
    </div>
  );
}

function GamesTab() {
  const [games, setGames] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ slug: '', title: '', domain: '', entryPath: '', ageLabel: '', skills: '', kind: 'game', tier: 'premium-only' });

  const load = useCallback(async () => {
    try {
      const data = await jsonFetch('/games');
      setGames(data.games);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createGame() {
    try {
      await jsonFetch('/games', {
        method: 'POST',
        body: JSON.stringify({ ...form, skills: form.skills.split(',').map((s: string) => s.trim()).filter(Boolean) }),
      });
      setForm({ slug: '', title: '', domain: '', entryPath: '', ageLabel: '', skills: '', kind: 'game', tier: 'premium-only' });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function removeGame(id: string) {
    try {
      await jsonFetch(`/games/${id}`, { method: 'DELETE' });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function quickToggle(g: any, field: 'isActive' | 'isFreeTier') {
    try {
      await jsonFetch(`/games/${g.id}`, { method: 'PATCH', body: JSON.stringify({ [field]: !g[field] }) });
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div className="admin-form-panel">
        <h3>Add a game</h3>
        <div className="admin-inline-form admin-inline-form--wrap">
          <input placeholder="Slug (unique)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
          <input placeholder="Entry path e.g. /games-static/foo.html" value={form.entryPath} onChange={(e) => setForm({ ...form, entryPath: e.target.value })} />
          <input placeholder="Age label (optional)" value={form.ageLabel} onChange={(e) => setForm({ ...form, ageLabel: e.target.value })} />
          <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
            {GAME_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button type="button" onClick={createGame} disabled={!form.slug.trim() || !form.title.trim() || !form.domain.trim() || !form.entryPath.trim()}>Add game</button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Slug</th><th>Domain</th><th>Tier</th><th>Free</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <Fragment key={g.id}>
                <tr key={g.id}>
                  <td>{g.title}</td>
                  <td className="admin-mono">{g.slug}</td>
                  <td>{g.domain}</td>
                  <td><span className="admin-badge">{g.tier || 'unset'}</span></td>
                  <td>
                    <button type="button" className="admin-toggle" onClick={() => quickToggle(g, 'isFreeTier')}>{g.isFreeTier ? 'Yes' : 'No'}</button>
                  </td>
                  <td>
                    <span className={`admin-status-dot ${g.isActive ? 'is-active' : 'is-disabled'}`} />
                    <button type="button" className="admin-toggle" onClick={() => quickToggle(g, 'isActive')}>{g.isActive ? 'Enabled' : 'Disabled'}</button>
                  </td>
                  <td className="admin-row-actions">
                    <button type="button" onClick={() => setEditingId(editingId === g.id ? null : g.id)}>
                      {editingId === g.id ? 'Cancel' : 'Edit'}
                    </button>
                    <button type="button" className="admin-danger-btn" onClick={() => removeGame(g.id)}>Delete</button>
                  </td>
                </tr>
                {editingId === g.id && (
                  <tr>
                    <td colSpan={7}>
                      <GameEditForm game={g} onDone={() => { setEditingId(null); load(); }} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {games.length === 0 && <tr><td colSpan={7} className="admin-empty-row">No games in the catalog yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------

function AssessmentsTab() {
   return <AdminAssessmentPaymentsPanel />;
}

function AuditLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const pageSize = 25;

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (action.trim()) params.set('action', action.trim());
      const data = await jsonFetch(`/audit-logs?${params.toString()}`);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (e: any) {
      setError(e.message);
    }
  }, [page, action]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="admin-toolbar">
        <input placeholder="Filter by action (e.g. user.disable)" value={action} onChange={(e) => { setPage(1); setAction(e.target.value); }} />
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>When</th><th>Admin</th><th>Action</th><th>Details</th></tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.user?.email}</td>
                <td><span className="admin-badge">{log.action}</span></td>
                <td className="admin-meta-cell">{log.metadata ? JSON.stringify(log.metadata) : '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={4} className="admin-empty-row">No matching log entries.</td></tr>}
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

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export default function AdminConsole() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="admin-console">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">⚙</span>
          <span>Medhā Admin</span>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <Link className="admin-nav-item admin-nav-item--home" to="/">← Home</Link>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-nav-item ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="admin-nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <h1 className="admin-page-title">{TABS.find((t) => t.id === tab)?.label}</h1>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'schools' && <SchoolsTab />}
        {tab === 'subscriptions' && <AdminSubscriptionsPage />}
        {tab === 'coupons' && <CouponsTab />}
        {tab === 'games' && <GamesTab />}
        {tab === 'assessments' && <AssessmentsTab />}
        {tab === 'audit' && <AuditLogsTab />}
      </main>
    </div>
  );
}
