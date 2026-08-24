// apps/web/src/components/GameContainer.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface GameContainerProps {
  entryPath: string;
  title: string;
  entitled: boolean;
}

const GAMES_BASE_URL = import.meta.env.VITE_GAMES_BASE_URL ?? '/games-static';

export const GameContainer: React.FC<GameContainerProps> = ({ entryPath, title, entitled }) => {
  const { user } = useAuth();

  if (!entitled) {
    return (
      <div className="medhaa-game-locked" role="alert">
        This game requires Premium. Upgrade to unlock it.
      </div>
    );
  }

  if (!user) {
    return <div className="medhaa-game-error" role="alert">Please log in to play.</div>;
  }

  const src = `${GAMES_BASE_URL}/${entryPath}`;

  return (
    <iframe
      src={src}
      title={title}
      className="medhaa-game-container"
      allow="fullscreen"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
};
