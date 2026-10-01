import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/apiConfig';
import '../styles/google-signin.css';

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
      renderButton: (element: HTMLElement, options: { theme: string; size: string; type: string; text: string; width: number }) => void;
    };
  };
}

type GoogleWindow = Window & { google?: GoogleIdentity };

export function GoogleSignIn({ role, redirectTo }: { role: 'student' | 'parent'; redirectTo: string }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const container = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    const scriptId = 'medhaa-google-identity-script';

    async function signIn(credential: string) {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential, role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Google sign-in failed.');
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        localStorage.setItem('refreshToken', data.refreshToken);
        login({ id: payload.id, email: payload.email, role: payload.role }, data.accessToken);
        navigate(redirectTo);
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : 'Google sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    function mountButton() {
      if (cancelled || !container.current) return;
      const google = (window as GoogleWindow).google;
      if (!google) {
        setUnavailable(true);
        return;
      }
      container.current.replaceChildren();
      google.accounts.id.initialize({
        client_id: clientId!,
        callback: ({ credential }) => { if (credential) void signIn(credential); },
      });
      google.accounts.id.renderButton(container.current, {
        theme: 'outline', size: 'large', type: 'standard', text: 'continue_with',
        width: Math.min(container.current.clientWidth, 320),
      });
    }

    const script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if ((window as GoogleWindow).google) {
      mountButton();
      return () => { cancelled = true; };
    }
    const googleScript = script || document.createElement('script');
    const onError = () => {
      googleScript.remove();
      if (!cancelled) setUnavailable(true);
    };
    googleScript.addEventListener('load', mountButton);
    googleScript.addEventListener('error', onError);
    if (!script) {
      googleScript.id = scriptId;
      googleScript.src = 'https://accounts.google.com/gsi/client';
      googleScript.async = true;
      document.head.appendChild(googleScript);
    }
    return () => {
      cancelled = true;
      googleScript.removeEventListener('load', mountButton);
      googleScript.removeEventListener('error', onError);
    };
  }, [clientId, role, redirectTo, login, navigate]);

  return (
    <div className="google-signin">
      {clientId && !unavailable && <div ref={container} className="google-signin__button" />}
      {(!clientId || unavailable) && (
        <button type="button" className="google-signin__unavailable" disabled title="Google sign-in is not configured yet">
          Continue with Google
        </button>
      )}
      {loading && <span className="google-signin__status" role="status">Signing in…</span>}
      {error && <span className="google-signin__error" role="alert">{error}</span>}
    </div>
  );
}