import { useNavigate } from 'react-router-dom';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

const observations = [
  {
    title: 'What your child is showing',
    text: 'They are engaging steadily with pattern, memory, and observation activities.',
  },
  {
    title: 'Current learning focus',
    text: 'Practising planning before acting and trying a second strategy after a mistake.',
  },
  {
    title: 'Try this at home',
    text: 'Ask: “What is your plan before you begin?” Then notice the strategy they use, not only the final answer.',
  },
];

export default function ParentProgressReport() {
  const navigate = useNavigate();

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.topRow}>
          <img
            src={medhaaIcon}
            alt="Medhaa"
            style={styles.logo}
          />
          <span style={styles.badge}>PARENT VIEW</span>
        </div>

        <h1 style={styles.heading}>Your child’s learning journey</h1>
        <p style={styles.copy}>
          These insights are based on your child’s completed activities across
          different skill areas. They describe learning patterns, not fixed
          labels.
        </p>

        <div style={styles.grid}>
          {observations.map((item) => (
            <article key={item.title} style={styles.insightCard}>
              <h2 style={styles.insightTitle}>{item.title}</h2>
              <p style={styles.insightText}>{item.text}</p>
            </article>
          ))}
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate('/parent/activities')}
          >
            View Suggested Activities
          </button>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate('/parent/sharing')}
          >
            Manage Sharing
          </button>
        </div>

        <p style={styles.note}>
          Progress becomes clearer as your child completes more varied
          activities over time.
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: 24,
    background: '#f4faf9',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  card: {
    width: 'min(100%, 900px)',
    margin: '0 auto',
    padding: 40,
    borderRadius: 28,
    background: '#ffffff',
    boxShadow: '0 20px 60px rgba(8, 127, 131, 0.12)',
  },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { width: 54, height: 54, objectFit: 'contain' as const },
  badge: {
    padding: '7px 10px',
    borderRadius: 999,
    background: '#e8f5f3',
    color: '#087f83',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.08em',
  },
  heading: { margin: '20px 0 10px', color: '#183333', fontSize: 36 },
  copy: { maxWidth: 680, margin: 0, color: '#607070', lineHeight: 1.65 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginTop: 28,
  },
  insightCard: {
    padding: 22,
    border: '1px solid #dcebea',
    borderRadius: 18,
    background: '#fbfefd',
  },
  insightTitle: { margin: 0, color: '#1b4141', fontSize: 17 },
  insightText: { margin: '10px 0 0', color: '#607070', lineHeight: 1.6 },
  actions: { display: 'flex', flexWrap: 'wrap' as const, gap: 12, marginTop: 28 },
  primaryButton: {
    padding: '14px 18px',
    border: 0,
    borderRadius: 12,
    background: '#087f83',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 800,
  },
  secondaryButton: {
    padding: '14px 18px',
    border: '1px solid #b8d8d5',
    borderRadius: 12,
    background: '#ffffff',
    color: '#087f83',
    cursor: 'pointer',
    fontWeight: 800,
  },
  note: { marginTop: 20, color: '#748484', fontSize: 13 },
};
