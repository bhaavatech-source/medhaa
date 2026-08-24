// SiteHeader.tsx
// Shared top bar for authenticated and public game pages, so /student and
// /student/preview look like one consistent product.

import { useNavigate } from 'react-router-dom';

export function SiteHeader({ mode }: { mode: 'authed' | 'public' }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#1e293b' }}>
        🧠 Medhaa
      </a>
      <div style={{ display: 'flex', gap: 8 }}>
        {mode === 'public' ? (
          <>
            <button onClick={() => navigate('/signup/student')} style={btnStyle('#01696f', '#fff')}>
              Sign Up
            </button>
            <button onClick={() => navigate('/login/student')} style={btnStyle('#fff', '#01696f')}>
              Login
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/logout-action')} style={btnStyle('#fff', '#1e293b')}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    background: bg,
    color,
    cursor: 'pointer',
  };
}
