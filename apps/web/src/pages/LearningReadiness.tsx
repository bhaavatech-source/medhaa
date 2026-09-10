import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type LearningReadinessProps = {
  activeHours?: number;
  completedDomains?: number;
};

export default function LearningReadiness({
  activeHours = 0,
  completedDomains = 0,
}: LearningReadinessProps) {
  const navigate = useNavigate();

  const hoursTarget = 10;
  const domainsTarget = 4;

  const hoursPercent = Math.min(100, (activeHours / hoursTarget) * 100);
  const domainsPercent = Math.min(100, (completedDomains / domainsTarget) * 100);
  const ready = activeHours >= hoursTarget && completedDomains >= domainsTarget;

  const message = useMemo(() => {
    if (ready) {
      return 'There is enough activity to make your progress picture more useful.';
    }

    return 'Keep exploring different kinds of Medhā activities so your progress picture can become richer over time.';
  }, [ready]);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <img
          src="/images/logo/medhaa-icon.svg"
          alt="Medhā"
          style={styles.logo}
        />

        <span style={styles.kicker}>YOUR LEARNING JOURNEY</span>
        <h1 style={styles.heading}>
          {ready ? 'Your activity picture is growing' : 'Building your activity picture'}
        </h1>

        <p style={styles.copy}>{message}</p>

        <div style={styles.metric}>
          <div style={styles.metricRow}>
            <strong>Active play time</strong>
            <span>{activeHours.toFixed(1)} of {hoursTarget} hours</span>
          </div>
          <div style={styles.track}>
            <div style={{ ...styles.fill, width: `${hoursPercent}%` }} />
          </div>
        </div>

        <div style={styles.metric}>
          <div style={styles.metricRow}>
            <strong>Skill areas explored</strong>
            <span>{completedDomains} of {domainsTarget}</span>
          </div>
          <div style={styles.track}>
            <div style={{ ...styles.fill, width: `${domainsPercent}%` }} />
          </div>
        </div>

        <p style={styles.note}>
          Medhā uses completed activity, varied skill areas, engagement, and active play time to make progress guidance more useful over time. This is an evidence-readiness indicator, not a final capability assessment.
        </p>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={() => navigate('/student')}
        >
          {ready ? 'Return to My Medhā' : 'Keep Exploring Medhā'}
        </button>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 24,
    background: '#f4faf9',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  card: {
    width: 'min(100%, 620px)',
    padding: 40,
    borderRadius: 28,
    background: '#ffffff',
    boxShadow: '0 20px 60px rgba(8, 127, 131, 0.12)',
  },
  logo: { width: 58, height: 58, objectFit: 'contain' as const },
  kicker: { color: '#087f83', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em' },
  heading: { margin: '12px 0', color: '#183333', fontSize: 34 },
  copy: { color: '#607070', lineHeight: 1.65 },
  metric: { marginTop: 24 },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    color: '#375252',
    fontSize: 14,
  },
  track: {
    height: 11,
    marginTop: 9,
    overflow: 'hidden' as const,
    borderRadius: 999,
    background: '#e3f1ef',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #0b9290, #55c8ae)',
    transition: 'width 300ms ease',
  },
  note: { marginTop: 24, color: '#748484', fontSize: 13, lineHeight: 1.55 },
  primaryButton: {
    width: '100%',
    marginTop: 16,
    padding: 15,
    border: 0,
    borderRadius: 12,
    background: '#087f83',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 800,
  },
};
