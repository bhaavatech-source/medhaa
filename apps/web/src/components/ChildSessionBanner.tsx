// apps/web/src/components/ChildSessionBanner.tsx
// Shown while a parent is browsing "as" a linked child (see AuthContext's
// enterAsChild/exitChildSession). Lets them return to their own account
// without logging out entirely.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/child-session-banner.css';

export function ChildSessionBanner() {
  const { parentReturnSession, exitChildSession } = useAuth();
  const navigate = useNavigate();

  if (!parentReturnSession) return null;

  return (
    <div className="medhaa-child-session-banner" role="status">
      <span>Playing as <strong>{parentReturnSession.childName}</strong></span>
      <button
        type="button"
        onClick={() => {
          exitChildSession();
          navigate('/parent-dashboard');
        }}
      >
        Back to my account
      </button>
    </div>
  );
}

export default ChildSessionBanner;
