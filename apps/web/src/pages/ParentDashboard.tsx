import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BarChart3, BookOpen, CheckCircle2, ChevronRight,
  Crown, Gamepad2, Heart, Home, LogOut, Plus, RefreshCw,
  ShieldCheck, Sparkles, Users, Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../utils/authFetch';
import '../styles/parent-dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

type Subscription = {
  status: string;
  plan: string;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
};

type Child = {
  id: string;
  fullName: string;
  age: number | null;
  gradeLabel: string | null;
  coins: number;
  xp: number;
  level: number;
  schoolName: string | null;
};

type Section = 'overview' | 'children' | 'progress' | 'guidance' | 'sharing' | 'subscription';

const dateText = (value?: string | null) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const statusText = (value?: string) =>
  value ? value.charAt(0) + value.slice(1).toLowerCase() : 'Not available';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user, logout, enterAsChild } = useAuth();
  const [section, setSection] = useState<Section>('overview');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(true);
  const [childrenError, setChildrenError] = useState('');
  const [enteringId, setEnteringId] = useState<string | null>(null);

  async function loadSubscription() {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(`${API_URL}/subscriptions/me`);
      if (!res.ok) throw new Error('Subscription request failed');
      const data = await res.json();
      setSubscription(data.subscription ?? null);
    } catch (err) {
      console.error(err);
      setError('Subscription details could not be loaded.');
    } finally {
      setLoading(false);
    }
  }

  async function loadChildren() {
    setChildrenLoading(true);
    setChildrenError('');
    try {
      const res = await authFetch(`${API_URL}/parent/children`);
      if (!res.ok) throw new Error('Could not load children');
      const data = await res.json();
      setChildren(data.children ?? []);
    } catch (err) {
      console.error(err);
      setChildrenError('Your children could not be loaded.');
    } finally {
      setChildrenLoading(false);
    }
  }

  useEffect(() => { loadSubscription(); loadChildren(); }, []);

  async function playAsChild(child: Child) {
    setEnteringId(child.id);
    try {
      const res = await authFetch(`${API_URL}/parent/children/${child.id}/enter`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not start this session');
      enterAsChild({ id: child.id, email: '', role: 'student' }, data.accessToken, child.fullName);
      navigate('/student/preview');
    } catch (err: any) {
      setChildrenError(err.message || 'Could not start this session');
    } finally {
      setEnteringId(null);
    }
  }

  const goSection = (next: Section) => {
    setSection(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <main className="parent-dashboard-shell pd-auth-state">
        <section className="pd-message">
          <div className="pd-message-icon"><ShieldCheck size={30} /></div>
          <h1>Parent sign-in required</h1>
          <p>Please sign in to open your family dashboard.</p>
          <button className="pd-primary" onClick={() => navigate('/login/parent')}>
            Parent Sign In <ArrowRight size={17} />
          </button>
        </section>
      </main>
    );
  }

  const navItems: [Section, string, typeof Users][] = [
    ['overview', 'Overview', BarChart3],
    ['children', 'Children', Users],
    ['progress', 'Progress', BookOpen],
    ['guidance', 'Parent Guidance', Heart],
    ['sharing', 'Sharing & Privacy', ShieldCheck],
    ['subscription', 'Subscription', Crown],
  ];

  return (
    <main className="parent-dashboard-shell">
      <header className="pd-topbar">
        <button className="pd-brand" onClick={() => navigate('/')} aria-label="Medhā home">
          <span className="pd-brand-mark"><Sparkles size={18} /></span>
          <span><strong>Medhā</strong><small>Parent Space</small></span>
        </button>

        <nav className="pd-top-actions" aria-label="Parent navigation">
          <button onClick={() => navigate('/')}><Home size={16} /> Home</button>
          <button onClick={() => navigate('/student/preview')}><Gamepad2 size={16} /> Games</button>
          <button onClick={() => navigate('/subscribe')}><Crown size={16} /> Plans</button>
          <button onClick={() => { logout(); navigate('/'); }}><LogOut size={16} /> Logout</button>
          <button onClick={() => navigate('/settings')}><Settings size={16} /> Settings</button>
        </nav>
      </header>

      <section className="pd-hero">
        <div className="pd-hero-copy">
          <span className="pd-eyebrow"><Heart size={14} /> MEDHĀ FOR FAMILIES</span>
          <h1>Your child's Medhā journey, in one place.</h1>
          <p>
            Understand activity, explore progress, and choose the next useful
            step without turning learning into pressure.
          </p>
          <div className="pd-hero-actions">
            <button className="pd-primary" onClick={() => navigate('/parent/enrol-student')}>
              <Plus size={17} /> Add / Connect Child
            </button>
            <button className="pd-secondary" onClick={() => goSection('progress')}>
              View Progress <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="pd-orbit-wrap" aria-hidden="true">
          <div className="pd-orbit pd-o1" />
          <div className="pd-orbit pd-o2" />
          <div className="pd-orbit pd-o3" />
          <div className="pd-core"><Sparkles size={31} /><strong>Medhā</strong><span>Family view</span></div>
          <span className="pd-float pd-f1">Progress</span>
          <span className="pd-float pd-f2">Play</span>
          <span className="pd-float pd-f3">Grow</span>
        </div>
      </section>

      <section className="pd-layout">
        <aside className="pd-sidebar">
          <div className="pd-side-title">Family space</div>
          {navItems.map(([key, label, Icon]) => (
            <button
              key={key}
              className={`pd-side-item ${section === key ? 'active' : ''}`}
              onClick={() => goSection(key)}
            >
              <Icon size={18} /><span>{label}</span><ChevronRight size={15} />
            </button>
          ))}
          <div className="pd-sidebar-note">
            <Sparkles size={17} />
            <strong>Keep it meaningful</strong>
            <span>Short, purposeful activity is more useful than simply doing more.</span>
          </div>
        </aside>

        <div className="pd-main">
          {section === 'overview' && (
            <>
              <div className="pd-heading">
                <div>
                  <span className="pd-kicker">OVERVIEW</span>
                  <h2>Welcome to your family space.</h2>
                  <p>This is the control centre for your child's Medhā experience.</p>
                </div>
                <button className="pd-refresh" onClick={loadSubscription} disabled={loading}>
                  <RefreshCw size={16} className={loading ? 'pd-spin' : ''} /> Refresh
                </button>
              </div>

              <div className="pd-stat-grid">
                <article className="pd-stat pd-child">
                  <span><Users size={20} /></span>
                  <strong>{childrenLoading ? 'Checking…' : children.length}</strong>
                  <small>{children.length === 1 ? 'Child connected' : 'Children connected'}</small>
                  <button onClick={() => navigate('/parent/enrol-student')}>Add a child <ArrowRight size={14} /></button>
                </article>
                <article className="pd-stat pd-progress">
                  <span><BarChart3 size={20} /></span><strong>Ready</strong>
                  <small>Progress space</small>
                  <button onClick={() => goSection('progress')}>Open progress <ArrowRight size={14} /></button>
                </article>
                <article className="pd-stat pd-plan">
                  <span><Crown size={20} /></span>
                  <strong>{loading ? 'Checking…' : statusText(subscription?.status)}</strong>
                  <small>{subscription?.plan || 'Subscription'}</small>
                  <button onClick={() => goSection('subscription')}>View plan <ArrowRight size={14} /></button>
                </article>
              </div>

              <div className="pd-two">
                <article className="pd-panel">
                  <div className="pd-panel-head"><div><span>CHILD PROFILE</span><h3>Your child's space</h3></div><Users size={22} /></div>
                  {childrenLoading ? (
                    <p>Loading your children…</p>
                  ) : children.length === 0 ? (
                    <div className="pd-empty">
                      <div className="pd-empty-icon"><Plus size={23} /></div>
                      <h4>No child added yet</h4>
                      <p>
                        Add your child's profile directly — no separate email
                        or sign-up needed for them.
                      </p>
                      <button className="pd-primary pd-small" onClick={() => navigate('/parent/enrol-student')}>
                        Add my child
                      </button>
                    </div>
                  ) : (
                    <div className="pd-child-list">
                      {children.map((child) => (
                        <div className="pd-child-row" key={child.id}>
                          <div>
                            <strong>{child.fullName}</strong>
                            <small>{[child.age ? `${child.age} yrs` : null, child.gradeLabel].filter(Boolean).join(' · ') || 'No details yet'}</small>
                          </div>
                          <button className="pd-secondary pd-small" disabled={enteringId === child.id} onClick={() => playAsChild(child)}>
                            {enteringId === child.id ? 'Opening…' : 'Play as ' + child.fullName.split(' ')[0]}
                          </button>
                        </div>
                      ))}
                      <button className="pd-secondary pd-full" onClick={() => navigate('/parent/enrol-student')}>Add another child</button>
                    </div>
                  )}
                  {childrenError && <div className="pd-error">{childrenError}</div>}
                </article>

                <article className="pd-panel">
                  <div className="pd-panel-head"><div><span>YOUR PLAN</span><h3>Subscription</h3></div><Crown size={22} /></div>
                  {subscription ? (
                    <div className="pd-sub-summary">
                      <strong>{subscription.plan}</strong>
                      <div className="pd-status"><CheckCircle2 size={16} /> {statusText(subscription.status)}</div>
                      {subscription.trialEndsAt && <p>Trial ends <b>{dateText(subscription.trialEndsAt)}</b></p>}
                      {subscription.currentPeriodEnd && <p>Period ends <b>{dateText(subscription.currentPeriodEnd)}</b></p>}
                      <button className="pd-secondary pd-full" onClick={() => goSection('subscription')}>Manage subscription</button>
                    </div>
                  ) : (
                    <div className="pd-empty pd-small-empty">
                      <p>No subscription record is available yet.</p>
                      <button className="pd-secondary" onClick={() => navigate('/subscribe')}>Explore plans</button>
                    </div>
                  )}
                  {error && <div className="pd-error">{error}</div>}
                </article>
              </div>

              <section className="pd-quick">
                <div className="pd-heading compact"><div><span className="pd-kicker">QUICK ACCESS</span><h2>What would you like to do?</h2></div></div>
                <div className="pd-actions">
                  <button onClick={() => navigate('/parent/enrol-student')}><Users size={21}/><strong>Connect a child</strong><span>Add or link your child's Medhā profile.</span><ArrowRight size={16}/></button>
                  <button onClick={() => navigate('/parent/progress')}><BarChart3 size={21}/><strong>View progress</strong><span>Open the existing parent progress view.</span><ArrowRight size={16}/></button>
                  <button onClick={() => navigate('/student/preview')}><Gamepad2 size={21}/><strong>Explore games</strong><span>See the experiences your child can explore.</span><ArrowRight size={16}/></button>
                  <button onClick={() => navigate('/parent/sharing')}><ShieldCheck size={21}/><strong>Sharing & privacy</strong><span>Review the existing sharing controls.</span><ArrowRight size={16}/></button>
                </div>
              </section>
            </>
          )}

          {section === 'children' && (
            <section className="pd-page">
              <div className="pd-heading"><div><span className="pd-kicker">CHILDREN</span><h2>Manage your child's Medhā connection.</h2><p>Add a child directly — they don't need their own email or password.</p></div></div>
              {childrenLoading ? (
                <p>Loading your children…</p>
              ) : children.length === 0 ? (
                <div className="pd-large-empty">
                  <Users size={34}/><h3>No child profile is connected to this parent account.</h3>
                  <p>Add your child's name, age and grade — Medhā creates their profile right away, ready to play.</p>
                  <button className="pd-primary" onClick={() => navigate('/parent/enrol-student')}>Add my child <ArrowRight size={17}/></button>
                </div>
              ) : (
                <div className="pd-child-list">
                  {children.map((child) => (
                    <div className="pd-child-row" key={child.id}>
                      <div>
                        <strong>{child.fullName}</strong>
                        <small>{[child.age ? `${child.age} yrs` : null, child.gradeLabel, child.schoolName].filter(Boolean).join(' · ') || 'No details yet'}</small>
                      </div>
                      <button className="pd-primary pd-small" disabled={enteringId === child.id} onClick={() => playAsChild(child)}>
                        {enteringId === child.id ? 'Opening…' : 'Play as ' + child.fullName.split(' ')[0]}
                      </button>
                    </div>
                  ))}
                  <button className="pd-secondary" onClick={() => navigate('/parent/enrol-student')}>Add another child <ArrowRight size={16}/></button>
                </div>
              )}
              {childrenError && <div className="pd-error">{childrenError}</div>}
            </section>
          )}

          {section === 'progress' && (
            <section className="pd-page">
              <div className="pd-heading"><div><span className="pd-kicker">PROGRESS</span><h2>Understand progress, not just scores.</h2><p>Open the existing Medhā parent progress report.</p></div></div>
              <div className="pd-callout"><BarChart3 size={30}/><div><h3>Parent Progress Report</h3><p>We reuse the existing report instead of creating a second reporting system.</p><button className="pd-primary pd-small" onClick={() => navigate('/parent/progress')}>Open Progress Report <ArrowRight size={16}/></button></div></div>
            </section>
          )}

          {section === 'guidance' && (
            <section className="pd-page">
              <div className="pd-heading"><div><span className="pd-kicker">PARENT GUIDANCE</span><h2>Support learning without adding pressure.</h2><p>Practical ideas to use alongside your child's activity.</p></div></div>
              <div className="pd-guidance">
                <article><Heart size={22}/><h3>Notice before correcting</h3><p>Look at patterns before deciding what the child should do next.</p></article>
                <article><BookOpen size={22}/><h3>Use short conversations</h3><p>Ask what felt easy, difficult or interesting instead of turning every activity into a test.</p></article>
                <article><Gamepad2 size={22}/><h3>Keep play purposeful</h3><p>Encourage exploration while leaving space for the child to choose and reflect.</p></article>
                <article><Sparkles size={22}/><h3>Look for growth over time</h3><p>One session should not define a broad capability; patterns become more useful as evidence accumulates.</p></article>
              </div>
            </section>
          )}

          {section === 'sharing' && (
            <section className="pd-page">
              <div className="pd-heading"><div><span className="pd-kicker">SHARING & PRIVACY</span><h2>Keep control of who sees your child's information.</h2><p>Use the existing sharing-permissions experience.</p></div></div>
              <div className="pd-callout"><ShieldCheck size={30}/><div><h3>Sharing Permissions</h3><p>Review and manage the existing permission settings.</p><button className="pd-primary pd-small" onClick={() => navigate('/parent/sharing')}>Open Sharing Settings <ArrowRight size={16}/></button></div></div>
            </section>
          )}

          {section === 'subscription' && (
            <section className="pd-page">
              <div className="pd-heading"><div><span className="pd-kicker">SUBSCRIPTION</span><h2>Your Medhā family plan.</h2><p>Details are read from the existing subscription service.</p></div></div>
              <div className="pd-sub-page">
                <div className="pd-sub-icon"><Crown size={28}/></div>
                {loading ? <p>Loading subscription details…</p> : subscription ? (
                  <>
                    <span className="pd-panel-kicker">CURRENT PLAN</span>
                    <h3>{subscription.plan}</h3>
                    <div className="pd-status"><CheckCircle2 size={16}/> {statusText(subscription.status)}</div>
                    <div className="pd-details">
                      {subscription.trialEndsAt && <div><span>Trial ends</span><b>{dateText(subscription.trialEndsAt)}</b></div>}
                      {subscription.currentPeriodEnd && <div><span>Period ends</span><b>{dateText(subscription.currentPeriodEnd)}</b></div>}
                    </div>
                  </>
                ) : <><span className="pd-panel-kicker">NO ACTIVE RECORD</span><h3>Choose a Medhā family plan</h3><p>Explore the current individual plans for Student and Parent accounts.</p></>}
                <div className="pd-sub-actions">
                  <button className="pd-primary" onClick={() => navigate('/subscribe')}>View Plans <ArrowRight size={17}/></button>
                  <button className="pd-secondary" onClick={loadSubscription}><RefreshCw size={16}/> Refresh</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      <footer className="pd-footer">
        <div><strong>Medhā</strong><span>Play → Understand → Grow</span></div>
        <span>© 2026 Medhā · A Medhā product</span>
      </footer>
    </main>
  );
}
