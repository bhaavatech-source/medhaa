import React from 'react';

interface GameProps {
  onComplete?: (payload: { score: number; durationSeconds: number }) => void;
}

export default function MathBlitz({ onComplete }: GameProps) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Math Blitz</h2>
      <p>This game is coming soon. Check back later!</p>
      <button onClick={() => onComplete?.({ score: 0, durationSeconds: 0 })}>
        Back to Games
      </button>
    </div>
  );
}