// achievements.ts — defines all achievements and how to check if they're unlocked
// based on existing localStorage data (medhaa-played-games, medhaa-seen-games, per-game saves).

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: () => boolean;
}

function getPlayedGames(): string[] {
  try {
    return JSON.parse(localStorage.getItem('medhaa-played-games') || '[]');
  } catch {
    return [];
  }
}

function getSeenGames(): string[] {
  try {
    return JSON.parse(localStorage.getItem('medhaa-seen-games') || '[]');
  } catch {
    return [];
  }
}

function countCompletedLevelsAcrossGames(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.endsWith('_v1')) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      if (Array.isArray(data.completedLevels)) total += data.completedLevels.length;
      if (Array.isArray(data.lessonsCompleted)) total += data.lessonsCompleted.length;
    } catch {
      /* ignore malformed entries */
    }
  }
  return total;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-game',
    title: 'First Step',
    description: 'Played your very first game',
    emoji: '🎮',
    check: () => getPlayedGames().length >= 1,
  },
  {
    id: 'explorer-3',
    title: 'Curious Explorer',
    description: 'Played 3 different games',
    emoji: '🧭',
    check: () => getPlayedGames().length >= 3,
  },
  {
    id: 'explorer-5',
    title: 'Game Hopper',
    description: 'Played 5 different games',
    emoji: '🚀',
    check: () => getPlayedGames().length >= 5,
  },
  {
    id: 'browser-10',
    title: 'Big Browser',
    description: 'Looked at 10 different games',
    emoji: '🔎',
    check: () => getSeenGames().length >= 10,
  },
  {
    id: 'level-master-5',
    title: 'Level Master',
    description: 'Completed 5 levels or lessons in total',
    emoji: '🏆',
    check: () => countCompletedLevelsAcrossGames() >= 5,
  },
  {
    id: 'level-master-20',
    title: 'Champion Learner',
    description: 'Completed 20 levels or lessons in total',
    emoji: '👑',
    check: () => countCompletedLevelsAcrossGames() >= 20,
  },
];

const SEEN_UNLOCKS_KEY = 'medhaa-seen-achievement-unlocks';

export function getSeenUnlocks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEEN_UNLOCKS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function markUnlockSeen(id: string) {
  const seen = getSeenUnlocks();
  if (!seen.includes(id)) {
    localStorage.setItem(SEEN_UNLOCKS_KEY, JSON.stringify([...seen, id]));
  }
}