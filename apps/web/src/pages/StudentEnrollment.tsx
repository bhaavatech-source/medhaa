import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

const API_URL = import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

export default function StudentEnrollment() {
  const navigate = useNavigate();
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!childName.trim() || !age || !grade.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/students/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ childName: childName.trim(), age: Number(age), grade: grade.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Could not add your child. Please try again.');
      }

      const { student } = await res.json();
      navigate(`/student/play/${student.id}`);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <img src={medhaaIcon} alt="Medhaa" style={styles.logo} />
        <span style={styles.kicker}>ADD A CHILD</span>
        <h1 style={styles.heading}>Add your child to Medhaa</h1>
        <p style={styles.copy}>
          Your child plays directly under your account — no separate sign-up or password needed for them.
        </p>
        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>
            Child&apos;s first name
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
            <select value={age} onChange={(event) => setAge(event.target.value)} required style={styles.input}>
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
              placeholder="For example, Grade 4"
              required
              style={styles.input}
            />
          </label>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={submitting} style={styles.primaryButton}>
            {submitting ? 'Adding...' : 'Start Playing'}
          </button>
        </form>
        <p style={styles.note}>You can control whether progress is shared with teachers or schools after setup.</p>
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f4faf9', fontFamily: 'Inter, Arial, sans-serif' },
  card: { width: 'min(100%, 560px)', padding: 36, borderRadius: 24, background: '#ffffff', boxShadow: '0 20px 60px rgba(8,127,131,0.12)' },
  logo: { width: 58, height: 58, objectFit: 'contain' as const },
  kicker: { display: 'block', marginTop: 22, color: '#087f83', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em' },
  heading: { margin: '10px 0 12px', color: '#183333', fontSize: 34 },
  copy: { margin: 0, color: '#607070', lineHeight: 1.65 },
  form: { display: 'grid', gap: 16, marginTop: 28 },
  label: { display: 'grid', gap: 7, color: '#294747', fontWeight: 700 },
  input: { width: '100%', boxSizing: 'border-box' as const, padding: 13, border: '1px solid #cfe4e2', borderRadius: 12, fontSize: 15 },
  primaryButton: { marginTop: 8, padding: 14, border: 0, borderRadius: 12, background: '#087f83', color: '#ffffff', cursor: 'pointer', fontSize: 15, fontWeight: 800 },
  error: { margin: 0, color: '#c23b3b', fontSize: 14, fontWeight: 600 },
  note: { margin: '18px 0 0', color: '#748484', fontSize: 13, lineHeight: 1.5 },
};
