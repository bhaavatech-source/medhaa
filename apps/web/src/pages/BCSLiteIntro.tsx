import { useNavigate } from 'react-router-dom';

export default function BCSLiteIntro() {
  const navigate = useNavigate();

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <img
          src="/images/logo/medhaa-icon.svg"
          alt="Medhaa"
          style={styles.logo}
        />

        <span style={styles.kicker}>WELCOME TO MEDHAA</span>
        <h1 style={styles.heading}>Start with BCS Lite</h1>

        <p style={styles.copy}>
          BCS Lite is a short, play-based cognitive screen. It helps Medhaa
          create a starting snapshot and suggest suitable games for your
          learning journey.
        </p>

        <div style={styles.points}>
          <p><strong>What to expect:</strong> friendly game-like tasks</p>
          <p><strong>Take breaks:</strong> pause whenever needed</p>
          <p><strong>What happens next:</strong> receive starter game suggestions</p>
        </div>

        <p style={styles.note}>
          Your recommendations become more personalised as Medhaa learns from
          varied activity over time.
        </p>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={() => navigate('/bcs-lite/start')}
        >
          Begin BCS Lite
        </button>

        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => navigate('/student/dashboard')}
        >
          Explore games first
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
    background: 'linear-gradient(145deg, #e9f8f5, #fff8ed)',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  card: {
    width: 'min(100%, 620px)',
    padding: 40,
    borderRadius: 28,
    background: '#ffffff',
    textAlign: 'center' as const,
    boxShadow: '0 20px 60px rgba(8, 127, 131, 0.14)',
  },
  logo: { width: 72, height: 72, objectFit: 'contain' as const },
  kicker: { color: '#087f83', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em' },
  heading: { margin: '12px 0', color: '#183333', fontSize: 38 },
  copy: { maxWidth: 510, margin: '0 auto', color: '#5d7171', lineHeight: 1.7 },
  points: {
    display: 'grid',
    gap: 10,
    margin: '26px 0',
    padding: 20,
    borderRadius: 16,
    background: '#f1faf8',
    color: '#385353',
    textAlign: 'left' as const,
  },
  note: { color: '#687c7c', lineHeight: 1.55 },
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
  secondaryButton: {
    width: '100%',
    marginTop: 12,
    padding: 13,
    border: '1px solid #b8d8d5',
    borderRadius: 12,
    background: '#ffffff',
    color: '#087f83',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 800,
  },
};