import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/apiConfig';
import {
  APP_USAGE_CONSENT_CHANGE_EVENT,
  APP_USAGE_CONSENT_REVIEW_EVENT,
  APP_USAGE_FIRST_OPEN_KEY,
  getAppUsageConsent,
  isNativeAndroidApp,
  setAppUsageConsent,
} from '../utils/appUsageConsent';
import '../styles/app-usage-consent.css';

type UsageEvent =
  | { type: 'first_open' }
  | { type: 'foreground_start'; liveSessionId: string }
  | { type: 'foreground_heartbeat'; liveSessionId: string; seconds: number }
  | { type: 'foreground_end'; liveSessionId: string; seconds: number };

function postUsageEvent(event: UsageEvent): Promise<boolean> {
  return fetch(`${API_URL}/app-usage/aggregate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  }).then((response) => response.ok).catch(() => false);
}

function sendSessionEnd(event: UsageEvent): void {
  const body = new Blob([JSON.stringify(event)], { type: 'application/json' });
  if (navigator.sendBeacon?.(`${API_URL}/app-usage/aggregate`, body)) return;
  void postUsageEvent(event);
}

function startAggregateTracking(): () => void {
  if (localStorage.getItem(APP_USAGE_FIRST_OPEN_KEY) !== '1') {
    void postUsageEvent({ type: 'first_open' }).then((sent) => {
      if (sent) localStorage.setItem(APP_USAGE_FIRST_OPEN_KEY, '1');
    });
  }

  let liveSessionId: string | null = null;
  let segmentStartedAt: number | null = null;
  const startForegroundSession = () => {
    if (liveSessionId || document.visibilityState !== 'visible') return;
    liveSessionId = crypto.randomUUID();
    segmentStartedAt = Date.now();
    void postUsageEvent({ type: 'foreground_start', liveSessionId });
  };
  const reportForegroundTime = () => {
    if (!liveSessionId || segmentStartedAt === null) return;
    const seconds = Math.min(Math.floor((Date.now() - segmentStartedAt) / 1000), 30);
    if (seconds < 1) return;
    segmentStartedAt = Date.now();
    void postUsageEvent({ type: 'foreground_heartbeat', liveSessionId, seconds });
  };
  const finishForegroundSession = () => {
    if (!liveSessionId) return;
    const seconds = segmentStartedAt === null
      ? 0
      : Math.min(Math.floor((Date.now() - segmentStartedAt) / 1000), 30);
    const sessionId = liveSessionId;
    liveSessionId = null;
    segmentStartedAt = null;
    sendSessionEnd({ type: 'foreground_end', liveSessionId: sessionId, seconds });
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      startForegroundSession();
    } else {
      finishForegroundSession();
    }
  };

  startForegroundSession();
  const heartbeatTimer = window.setInterval(reportForegroundTime, 30_000);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', finishForegroundSession);
  return () => {
    finishForegroundSession();
    window.clearInterval(heartbeatTimer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', finishForegroundSession);
  };
}

export function AppUsageTelemetry() {
  const { user } = useAuth();
  const [nativeAndroid, setNativeAndroid] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [guardianConfirmed, setGuardianConfirmed] = useState(false);

  useEffect(() => {
    if (!isNativeAndroidApp()) return;
    setNativeAndroid(true);
    setShowConsent(getAppUsageConsent() === null && user?.role === 'parent');

    let stopTracking: (() => void) | null = null;
    const syncTracking = () => {
      stopTracking?.();
      stopTracking = getAppUsageConsent() === true ? startAggregateTracking() : null;
      setShowConsent(getAppUsageConsent() === null);
    };
    const reviewConsent = () => {
      if (user?.role !== 'parent') return;
      setGuardianConfirmed(false);
      setShowConsent(true);
    };

    if (getAppUsageConsent() === true) stopTracking = startAggregateTracking();
    window.addEventListener(APP_USAGE_CONSENT_CHANGE_EVENT, syncTracking);
    window.addEventListener(APP_USAGE_CONSENT_REVIEW_EVENT, reviewConsent);
    return () => {
      stopTracking?.();
      window.removeEventListener(APP_USAGE_CONSENT_CHANGE_EVENT, syncTracking);
      window.removeEventListener(APP_USAGE_CONSENT_REVIEW_EVENT, reviewConsent);
    };
  }, [user?.role]);

  if (!nativeAndroid || !showConsent) return null;

  return (
    <div className="app-usage-consent-backdrop">
      <section className="app-usage-consent" role="dialog" aria-modal="true" aria-labelledby="app-usage-consent-title">
        <h2 id="app-usage-consent-title">Anonymous app statistics</h2>
        <p>
          With a parent or guardian&apos;s permission, Medhā can count approximate first opens and total time the app is in the foreground.
          Only daily totals are kept. A temporary random session token is held in memory while the app is open and expires shortly after it closes.
          This does not include email, account details, a device ID, or an individual usage history.
        </p>
        <p className="app-usage-consent-note">
          First opens are estimates; reinstalling the app or clearing its data may count it again. This does not measure unique devices or uninstalls.
        </p>
        <label className="app-usage-guardian-check">
          <input
            type="checkbox"
            checked={guardianConfirmed}
            onChange={(event) => setGuardianConfirmed(event.target.checked)}
          />
          <span>I am the parent or legal guardian and approve these anonymous statistics.</span>
        </label>
        <div className="app-usage-consent-actions">
          <button type="button" className="app-usage-decline" onClick={() => {
            setAppUsageConsent(false);
            setShowConsent(false);
          }}>Not now</button>
          <button type="button" className="app-usage-accept" disabled={!guardianConfirmed} onClick={() => {
            setAppUsageConsent(true);
            setShowConsent(false);
          }}>Allow statistics</button>
        </div>
        <Link to="/usage-policy" className="app-usage-policy-link">Read the Usage &amp; Data Policy</Link>
      </section>
    </div>
  );
}