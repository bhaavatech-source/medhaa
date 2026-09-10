import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SharingPermissions() {
  const navigate = useNavigate();
  const [teacherSharing, setTeacherSharing] = useState(false);
  const [schoolSharing, setSchoolSharing] = useState(false);
  const [activityOnly, setActivityOnly] = useState(true);

  const savePreferences = () => {
    localStorage.setItem(
      'medhaa-sharing-preferences',
      JSON.stringify({ teacherSharing, schoolSharing, activityOnly }),
    );

    navigate('/parent/progress');
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <img
          src="/images/logo/medhaa-icon.svg"
          alt="Medhā"
          style={styles.logo}
        />

        <span style={styles.kicker}>PARENT CONTROLS</span>
        <h1 style={styles.heading}>Choose what to share</h1>

        <p style={styles.copy}>
          You control whether authorised teachers or schools can view your
          child’s learning information. You can change these preferences later.
        </p>

        <label style={styles.option}>
          <input
            type="checkbox"
            checked={teacherSharing}
            onChange={(event) => setTeacherSharing(event.target.checked)}
          />
          <span>
            <strong>Share with assigned teacher</strong>
            <small>Allow the teacher to view learning-relevant progress updates.</small>
          </span>
        </label>

        <label style={styles.option}>
          <input
            type="checkbox"
            checked={schoolSharing}
            onChange={(event) => setSchoolSharing(event.target.checked)}
          />
          <span>
            <strong>Share with authorised school staff</strong>
            <small>Allow approved staff to view the information you permit.</small>
          </span>
        </label>

        <label style={styles.option}>
          <input
            type="checkbox"
            checked={activityOnly}
            onChange={(event) => setActivityOnly(event.target.checked)}
          />
          <span>
            <strong>Share activity summaries only</strong>
            <small>Share completed activities without detailed learning insights.</small>
          </span>
        </label>

        <button type="button" style={styles.primaryButton} onClick={savePreferences}>
          Save Sharing Preferences
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
    width: 'min(100%, 650px)',
    padding: 40,
    borderRadius: 28,
    background: '#ffffff',
    boxShadow: '0 20px 60px rgba(8, 127, 131, 0.12)',
  },
  logo: { width: 58, height: 58, objectFit: 'contain' as const },
  kicker: {
    display: 'block',
    marginTop: 18,
    color: '#087f83',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.1em',
  },
  heading: { margin: '10px 0', color: '#183333', fontSize: 34 },
  copy: { margin: 0, color: '#607070', lineHeight: 1.65 },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 13,
    marginTop: 18,
    padding: 18,
    border: '1px solid #dcebea',
    borderRadius: 16,
    color: '#355151',
    cursor: 'pointer',
  },
  primaryButton: {
    width: '100%',
    marginTop: 24,
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
