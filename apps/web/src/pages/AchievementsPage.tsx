// AchievementsPage.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AchievementCard } from "../ui/AchievementCard";
import { ProgressBar } from "../ui/ProgressBar";
import { ACHIEVEMENTS, getSeenUnlocks, markUnlockSeen } from '../data/achievements';

function emojiIconUrl(emoji: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text x="50%" y="55%" font-size="30" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function AchievementsPage() {
  const navigate = useNavigate();
  const [seenUnlocks, setSeenUnlocks] = useState<string[]>(getSeenUnlocks());

  const results = useMemo(
    () => ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check() })),
    []
  );

  const unlockedCount = results.filter((r) => r.unlocked).length;
  const progressPct = Math.round((unlockedCount / results.length) * 100);

  function handleCelebrationEnd(id: string) {
    markUnlockSeen(id);
    setSeenUnlocks((prev) => [...prev, id]);
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 60px' }}>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate('/student/preview')}
          style={{ padding: '8px 18px', borderRadius: 999, border: '1.5px solid #6366f1', background: '#fff', color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}
        >
          ← Home
        </button>
      </div>

      <h1 style={{ fontWeight: 800, textAlign: 'center', marginBottom: 6, fontSize: 30, background: 'linear-gradient(90deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Your Achievements
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 24 }}>
        {unlockedCount} of {results.length} unlocked — keep playing to earn more!
      </p>

      <div style={{ marginBottom: 32 }}>
        <ProgressBar value={progressPct} label="Overall Progress" color="#6366f1" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {results.map((a) => {
          const justUnlocked = a.unlocked && !seenUnlocks.includes(a.id);
          return (
            <AchievementCard
              key={a.id}
              title={a.title}
              description={a.description}
              iconUrl={emojiIconUrl(a.emoji)}
              unlocked={a.unlocked}
              justUnlocked={justUnlocked}
              onCelebrationEnd={() => handleCelebrationEnd(a.id)}
            />
          );
        })}
      </div>
    </div>
  );
}