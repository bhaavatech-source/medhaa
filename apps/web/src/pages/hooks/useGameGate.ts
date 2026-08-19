import { useState, useEffect, useCallback } from 'react';

const PLAYS_KEY = 'bhava_web_plays';
const USER_KEY = 'bhava_web_user';
const FREE_PLAY_LIMIT = 3;

function getPlayedGames(): string[] {
  try {
    const raw = localStorage.getItem(PLAYS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function isUserUnlocked(): boolean {
  try {
    return !!localStorage.getItem('accessToken');
  } catch {
    return false;
  }
}

export function useGameGate() {
  const [showGate, setShowGate] = useState(false);
  const [playsUsed, setPlaysUsed] = useState<number>(getPlayedGames().length);
  const [unlocked, setUnlocked] = useState<boolean>(isUserUnlocked());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('gate') === '1') {
      setShowGate(true);
    }
  }, []);

  const canPlay = useCallback(
    (gameName: string): boolean => {
      if (unlocked) return true;
      const played = getPlayedGames();
      if (played.includes(gameName)) return true;
      return played.length < FREE_PLAY_LIMIT;
    },
    [unlocked]
  );

  const recordPlay = useCallback((gameName: string) => {
    const played = getPlayedGames();
    if (!played.includes(gameName)) {
      played.push(gameName);
      try {
        localStorage.setItem(PLAYS_KEY, JSON.stringify(played));
      } catch {
        // localStorage unavailable, ignore
      }
      setPlaysUsed(played.length);
    }
  }, []);

  const tryPlay = useCallback(
    (gameName: string): boolean => {
      if (canPlay(gameName)) {
        recordPlay(gameName);
        return true;
      }
      setShowGate(true);
      return false;
    },
    [canPlay, recordPlay]
  );

  return { showGate, setShowGate, playsUsed, unlocked, canPlay, tryPlay, FREE_PLAY_LIMIT };
}