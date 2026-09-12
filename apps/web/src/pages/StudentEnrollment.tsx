import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';

const API_URL = import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

export default function StudentEnrollment() {
  const navigate = useNavigate();
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!childName.trim() || !age || !grade.trim()) return;

    setBusy(true);
    setError('');
    try {
      const res = await authFetch(`${API_URL}/parent/children`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: childName.trim(),
          age: Number(age),
          gradeLabel: grade.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not add your child. Please try again.');
      navigate('/parent-dashboard');
    } catch (err: any) {
      setError(err.message || 'Could not add your child. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <img
          src="/images/logo/medhaa-icon.svg"
          alt="Medhā"
          style={styles.logo}
        />

        <h1 style={styles.heading}>Add your child to Medhā</h1>

        <p style={styles.copy}>
          Your child doesn't need their own email or password — their
          profile is created under your account right away, and you can
          open their games and progress from your Parent Dashboard.
        </p>

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>
            Child's first name
            <input
              value={childName}
              onChange={(event) => setChildName(event.target.value)}
              placeholder="Enter first name"
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Age
            <select
              value={age}
              onChange={(event) => setAge(event.target.value)}
              required
              style={styles.input}
            >
              <option value="">Select age</option>
              {Array.from({ length: 13 }, (_, index) => index + 4).map((item) => (
                <option key={item} value={item}>
                  {item} years
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Grade or class
            <input
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
              placeholder="For example: Grade 4"
              required
              style={styles.input}
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.primaryButton} disabled={busy}>
            {busy ? 'Adding your child…' : 'Add my child'}
          </button>
        </form>

        <p style={styles.note}>
          You can control whether progress is shared with teachers or schools
          after setup.
        </p>
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
    width: 'min(100%, 560px)',
    padding: 36,
    borderRadius: 24,
    background: '#ffffff',
    boxShadow: '0 20px 60px rgba(8, 127, 131, 0.12)',
  },
  logo: { width: 58, height: 58, objectFit: 'contain' as const },
  heading: { margin: '22px 0 12px', color: '#183333', fontSize: 34 },
  copy: { margin: 0, color: '#607070', lineHeight: 1.65 },
  form: { display: 'grid', gap: 16, marginTop: 28 },
  label: { display: 'grid', gap: 7, color: '#294747', fontWeight: 700 },
  input: {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: 13,
    border: '1px solid #cfe4e2',
    borderRadius: 12,
    fontSize: 15,
  },
  error: { margin: 0, color: '#b91c1c', fontSize: 13, fontWeight: 700 },
  primaryButton: {
    marginTop: 8,
    padding: 14,
    border: 0,
    borderRadius: 12,
    background: '#087f83',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 800,
  },
  note: { margin: '18px 0 0', color: '#748484', fontSize: 13, lineHeight: 1.5 },
};
