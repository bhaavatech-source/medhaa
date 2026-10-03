import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';

const pageStyle = {
  minHeight: '100vh',
  padding: '32px 16px',
  background: '#f7fbfb',
  color: '#172b2b',
} as const;

const panelStyle = {
  width: 'min(640px, 100%)',
  margin: '0 auto',
  padding: 'clamp(20px, 5vw, 32px)',
  border: '1px solid #e2e8e8',
  borderRadius: 16,
  background: '#fff',
  boxShadow: '0 12px 32px rgba(20, 55, 55, .08)',
} as const;

export function DeleteAccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleted, setDeleted] = useState(false);

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirmation !== 'DELETE' || isDeleting) return;

    setIsDeleting(true);
    setError('');
    try {
      const response = await authFetch(`${API_URL}/account/me`, { method: 'DELETE' });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'We could not delete this account. Please contact support.');
      }
      logout();
      setDeleted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not delete this account. Please contact support.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main style={pageStyle}>
      <section style={panelStyle} aria-labelledby="delete-account-title">
        {deleted ? (
          <>
            <h1 id="delete-account-title" style={{ margin: '0 0 12px', fontSize: 28 }}>Account deleted</h1>
            <p>Your Medhā account and its linked data have been permanently deleted.</p>
            <button type="button" onClick={() => navigate('/', { replace: true })} style={primaryButtonStyle}>
              Return to Medhā
            </button>
          </>
        ) : user ? (
          <>
            <Link to="/settings" style={backLinkStyle}>← Back to Settings</Link>
            <p style={eyebrowStyle}>Permanent account removal</p>
            <h1 id="delete-account-title" style={headingStyle}>Delete your account?</h1>
            <p style={bodyStyle}>This permanently deletes the account for <strong>{user.email}</strong>, including:</p>
            <ul style={listStyle}>
              <li>Your profile, subscription details and saved game activity.</li>
              <li>Your scores, achievements and coin history.</li>
              {user.role === 'parent' && <li>Child profiles created from this parent account and their saved activity.</li>}
            </ul>
            {user.role === 'parent' && (
              <p style={noteStyle}>Independently registered child accounts will be unlinked from your account, not deleted.</p>
            )}
            <p style={noteStyle}>
              Public Medhā Cognitive Assessment submissions are stored separately and are not linked to this account. To request their deletion, email <a href="mailto:support@medhaa.net">support@medhaa.net</a>.
            </p>
            <p style={noteStyle}>This action cannot be undone. Type <strong>DELETE</strong> below to confirm.</p>
            <form onSubmit={handleDelete}>
              <label htmlFor="delete-account-confirmation" style={labelStyle}>Confirmation</label>
              <input
                id="delete-account-confirmation"
                autoComplete="off"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                style={inputStyle}
              />
              {error && <p role="alert" style={errorStyle}>{error}</p>}
              <button type="submit" disabled={confirmation !== 'DELETE' || isDeleting} style={deleteButtonStyle}>
                {isDeleting ? 'Deleting account…' : 'Permanently delete account'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p style={eyebrowStyle}>Account help</p>
            <h1 id="delete-account-title" style={headingStyle}>Delete a Medhā account</h1>
            <p style={bodyStyle}>To delete your account and its saved data, sign in, open Settings and choose Delete account.</p>
            <p style={bodyStyle}>If you cannot sign in, email us from the address registered to the account and request deletion.</p>
            <a href="mailto:support@medhaa.net?subject=Medh%C4%81%20account%20deletion%20request" style={primaryButtonStyle}>
              Request deletion by email
            </a>
            <p style={noteStyle}>Standalone public assessment submissions are stored separately. Include that request in your email if you also want those records deleted.</p>
            <Link to="/login/student" style={backLinkStyle}>Sign in to Medhā</Link>
          </>
        )}
      </section>
    </main>
  );
}

const headingStyle = { margin: '8px 0 12px', fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: 1.2 } as const;
const bodyStyle = { color: '#475569', lineHeight: 1.6 } as const;
const eyebrowStyle = { margin: '20px 0 4px', color: '#9f1239', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' as const };
const listStyle = { paddingLeft: 22, color: '#475569', lineHeight: 1.65 } as const;
const noteStyle = { color: '#64748b', fontSize: 14, lineHeight: 1.55 } as const;
const labelStyle = { display: 'block', margin: '18px 0 6px', fontWeight: 750 } as const;
const inputStyle = { width: '100%', minHeight: 48, padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16, boxSizing: 'border-box' as const };
const deleteButtonStyle = { width: '100%', minHeight: 48, marginTop: 12, padding: '10px 14px', border: 0, borderRadius: 8, background: '#be123c', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer' };
const primaryButtonStyle = { display: 'inline-flex', justifyContent: 'center', alignItems: 'center', minHeight: 48, marginTop: 14, padding: '10px 16px', border: 0, borderRadius: 8, background: '#087f83', color: '#fff', fontWeight: 800, textDecoration: 'none', cursor: 'pointer' };
const backLinkStyle = { display: 'inline-block', marginTop: 16, color: '#17645e', fontWeight: 750, textUnderlineOffset: 3 } as const;
const errorStyle = { margin: '8px 0', color: '#be123c', fontSize: 14 } as const;