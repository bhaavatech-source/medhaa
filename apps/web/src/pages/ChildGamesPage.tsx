// apps/web/src/pages/ChildGamesPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

type GameWithAccess = {
  slug: string;
  title: string;
  domain: string;
  ageLabel?: string;
  skills: string[];
  kind: string;
  tier: string;
  access: { allowed: boolean; reason: string; daysSinceSignup?: number };
};

type ChildGamesResponse = {
  games: GameWithAccess[];
  studentName: string | null;
  gradeLevel: number | null;
  schoolName: string | null;
};

export default function ChildGamesPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const [data, setData] = useState<ChildGamesResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/games-with-access/child/${studentId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load games for this profile.');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [studentId]);

  if (error) {
    return <div style={{ padding: 40, color: '#c23b3b' }}>{error}</div>;
  }

  if (!data) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1>{data.studentName ? `${data.studentName}'s Games` : 'Games'}</h1>
      {data.gradeLevel && <p style={{ color: '#667', marginTop: -8 }}>Grade {data.gradeLevel}</p>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
          marginTop: 20,
        }}
      >
        {data.games.map((game) => (
          <div
            key={game.slug}
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e0e0e0',
              opacity: game.access.allowed ? 1 : 0.5,
            }}
          >
            <h3 style={{ margin: '0 0 8px' }}>{game.title}</h3>
            <p style={{ margin: '0 0 8px', color: '#667', fontSize: 13 }}>
              {game.domain} {game.ageLabel ? `· ${game.ageLabel}` : ''}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 700,
                color: game.access.allowed ? '#0a7a55' : '#c23b3b',
              }}
            >
              {game.access.allowed ? 'Play now' : game.access.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
