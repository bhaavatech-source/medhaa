import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../utils/authFetch';
import { API_URL } from '../utils/apiConfig';
import {
  APP_USAGE_CONSENT_CHANGE_EVENT,
  getAppUsageConsent,
  isNativeAndroidApp,
  requestAppUsageConsentReview,
  setAppUsageConsent,
} from '../utils/appUsageConsent';

type AccountSubscription = {
  plan: string;
  status: string;
  amount: number | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  transactionRef: string | null;
};

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
  name: '', 
  phone: '',
});

  // State for preferences
  const [preferences, setPreferences] = useState({
    soundEnabled: true,
    emailAlerts: true,
  });

  // State for subscription data (fetched from API)
  const [subscription, setSubscription] = useState<AccountSubscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState('');
  const [subscriptionReload, setSubscriptionReload] = useState(0);
  const [nativeAndroid, setNativeAndroid] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(getAppUsageConsent() === true);

  useEffect(() => {
    let cancelled = false;
    setSubscriptionLoading(true);
    setSubscriptionError('');
    setSubscription(null);
    if (!user) {
      setSubscriptionLoading(false);
      return;
    }
    authFetch(`${API_URL}/subscriptions/me`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load subscription details.');
        return response.json();
      })
      .then((data) => { if (!cancelled) setSubscription(data.subscription ?? null); })
      .catch(() => { if (!cancelled) setSubscriptionError('Could not load subscription details. Please retry.'); })
      .finally(() => { if (!cancelled) setSubscriptionLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, subscriptionReload]);

  useEffect(() => {
    setNativeAndroid(isNativeAndroidApp());
    const syncConsent = () => setAnalyticsConsent(getAppUsageConsent() === true);
    window.addEventListener(APP_USAGE_CONSENT_CHANGE_EVENT, syncConsent);
    return () => window.removeEventListener(APP_USAGE_CONSENT_CHANGE_EVENT, syncConsent);
  }, []);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const saveProfile = async () => {
    // Add your API PUT request here to save profileData
    setIsEditing(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    // Add API call to save user preferences globally
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f7fbff', color: '#172033', padding: '24px 16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid #c7d2fe',
              background: '#fff',
              color: '#4f46e5',
              fontWeight: 800,
              cursor: 'pointer',
              minHeight: 48,
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 900 }}>Account Settings</h1>
        </header>

        {/* Profile Card with Edit State */}
        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={sectionTitleStyle}>Profile Details</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} style={textButtonStyle}>Edit</button>
            )}
          </div>
          
          <div style={gridStyle}>
            <DataField label="Role" value={user?.role?.toUpperCase() || 'N/A'} />
            <DataField label="Registered Email" value={user?.email || 'email@example.com'} />
            
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={labelStyle}>PHONE NUMBER</label>
                <input 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+91 00000 00000"
                  style={inputStyle}
                />
              </div>
            ) : (
              <DataField label="Phone Number" value={profileData.phone || 'Not provided'} />
            )}
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={saveProfile} style={primaryButtonStyle}>Save Changes</button>
              <button onClick={() => setIsEditing(false)} style={secondaryButtonStyle}>Cancel</button>
            </div>
          )}
        </section>

        {/* Admin Console link */}
        {user?.role === 'admin' && (
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Admin Console</h2>
            <p style={paragraphStyle}>
              Manage users, schools, subscriptions, coupons, the game catalog and audit logs.
            </p>
            <button onClick={() => navigate('/admin')} style={primaryButtonStyle}>Open Admin Console</button>
          </section>
        )}

        {/* Linked Accounts (Parents & Teachers) */}
        {(user?.role === 'parent' || user?.role === 'teacher') && (
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Linked Profiles</h2>
            <p style={paragraphStyle}>
              Manage {user.role === 'parent' ? 'your children\'s' : 'your students\''} accounts and enrollment details.
            </p>
            <button 
              onClick={() => navigate('/parent/enrol-student')} 
              style={secondaryButtonStyle}
            >
              Manage Enrollment
            </button>
          </section>
        )}

        {/* Billing & Plans */}
        {user && (
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Billing & Plans</h2>
            {subscriptionLoading ? <p role="status">Loading subscription details…</p> : subscriptionError ? (
              <div role="alert">
                <p>{subscriptionError}</p>
                <button type="button" onClick={() => setSubscriptionReload(value => value + 1)} style={secondaryButtonStyle}>Retry</button>
              </div>
            ) : subscription ? (
              <div style={gridStyle}>
                <DataField label="Plan" value={subscription.plan.replace(/_/g, ' ')} />
                <DataField label="Status" value={subscription.status} />
                <DataField label="Amount" value={subscription.amount == null ? 'Not applicable' : `₹${(subscription.amount / 100).toLocaleString('en-IN')}`} />
                <DataField label={subscription.status === 'TRIALING' ? 'Trial Ends' : 'Valid Until'} value={(subscription.status === 'TRIALING' ? subscription.trialEndsAt : subscription.currentPeriodEnd) ? new Date((subscription.status === 'TRIALING' ? subscription.trialEndsAt : subscription.currentPeriodEnd)!).toLocaleDateString('en-IN') : 'Not set'} />
                <DataField label="Payment Reference" value={subscription.transactionRef || 'Not provided'} />
              </div>
            ) : <p style={paragraphStyle}>No subscription recorded for this account.</p>}
            <button onClick={() => navigate('/subscribe')} style={primaryButtonStyle}>
              Upgrade or Manage Subscription
            </button>
          </section>
        )}

        {/* Global Preferences */}
        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Preferences & Privacy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {nativeAndroid && user?.role === 'parent' && (
              <div>
                <label style={toggleContainerStyle}>
                  <span style={{ fontWeight: 700 }}>Anonymous app statistics</span>
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(event) => {
                      if (event.target.checked) requestAppUsageConsentReview();
                      else setAppUsageConsent(false);
                    }}
                    style={{ width: 20, height: 20 }}
                  />
                </label>
                <p style={paragraphStyle}>
                  Daily totals only. No account email, device ID, or individual usage history is sent.
                </p>
              </div>
            )}
            <label style={toggleContainerStyle}>
              <span style={{ fontWeight: 700 }}>Enable Game Audio</span>
              <input 
                type="checkbox" 
                checked={preferences.soundEnabled}
                onChange={() => togglePreference('soundEnabled')}
                style={{ width: 20, height: 20 }}
              />
            </label>
            <label style={toggleContainerStyle}>
              <span style={{ fontWeight: 700 }}>Receive Weekly Progress Emails</span>
              <input 
                type="checkbox" 
                checked={preferences.emailAlerts}
                onChange={() => togglePreference('emailAlerts')}
                style={{ width: 20, height: 20 }}
              />
            </label>
            <button 
              onClick={() => navigate('/parent/sharing')} 
              style={{ ...secondaryButtonStyle, marginTop: 8 }}
            >
              Data Sharing Permissions
            </button>
          </div>
        </section>

        {/* Security Card */}
        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Security</h2>
          <p style={paragraphStyle}>
            Update your password to keep your account secure. You will be redirected to the secure reset flow.
          </p>
          <button onClick={() => navigate('/reset-password')} style={secondaryButtonStyle}>
            Change Password
          </button>
        </section>

        {user && (
          <section style={{ ...cardStyle, border: '1px solid #fecdd3', background: '#fff7f7' }}>
            <h2 style={{ ...sectionTitleStyle, color: '#be123c' }}>Delete account</h2>
            <p style={{ ...paragraphStyle, color: '#7f1d1d' }}>
              Permanently remove your account and its saved data. This cannot be undone.
            </p>
            <button type="button" onClick={() => navigate('/delete-account')} style={dangerButtonStyle}>
              Review account deletion
            </button>
          </section>
        )}
        {/* Danger Zone */}
        <section style={{ ...cardStyle, border: '1px solid #fecdd3', background: '#fff1f2' }}>
          <h2 style={{ ...sectionTitleStyle, color: '#be123c', margin: 0 }}>Danger Zone</h2>
          <p style={{ ...paragraphStyle, color: '#be123c' }}>
            Log out of this device. You will need your email and password to log back in.
          </p>
          <button onClick={handleLogout} style={dangerButtonStyle}>
            Log Out
          </button>
        </section>
      </div>
    </main>
  );
}

// Reusable micro-component
function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={labelStyle}>{label.toUpperCase()}</span>
      <strong style={{ display: 'block', fontSize: 15, color: '#172033' }}>{value}</strong>
    </div>
  );
}

// Shared Inline Styles
const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 8px 24px rgba(15,23,42,.04)', border: '1px solid #e6eaf2' };
const sectionTitleStyle: React.CSSProperties = { margin: 0, fontSize: 18, fontWeight: 900 };
const paragraphStyle: React.CSSProperties = { margin: '8px 0 16px', color: '#64748b', fontSize: 14, lineHeight: 1.5 };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #ccd8da', fontSize: 15, outline: 'none', boxSizing: 'border-box' };
const textButtonStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#4f46e5', fontWeight: 800, cursor: 'pointer', fontSize: 15, padding: 0 };
const toggleContainerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' };

const primaryButtonStyle: React.CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(90deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' };
const secondaryButtonStyle: React.CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4338ca', fontWeight: 800, fontSize: 15, cursor: 'pointer' };
const dangerButtonStyle: React.CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: 'none', background: '#e11d48', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' };