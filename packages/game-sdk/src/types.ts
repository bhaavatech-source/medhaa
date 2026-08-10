// packages/game-sdk/src/types.ts
// Shared contract every Bhava Tech game must implement to run inside
// MEDHAA. Games remain self-contained bundles; MEDHAA only needs them
// to emit these lifecycle events so sessions, coins, and reports work
// identically across all ~40 titles.

export interface GameSessionStart {
  gameSlug: string;
  studentId: string;
  startTime: string; // ISO timestamp
}

export interface GameSessionEnd {
  gameSlug: string;
  studentId: string;
  endTime: string;
  durationMs: number;
  score: number;
  accuracy: number; // 0-1
  hintsUsed: number;
  completionStatus: 'completed' | 'abandoned' | 'failed';
}

// Every game bundle exports an object implementing this interface.
// MEDHAA's GameContainer mounts it and listens for lifecycle callbacks.
export interface MedhaaGame {
  slug: string;
  mount: (container: HTMLElement, context: GameLaunchContext) => void;
  unmount: () => void;
}

export interface GameLaunchContext {
  studentId: string;
  gradeLevel?: number;
  onSessionStart: (payload: GameSessionStart) => void;
  onSessionEnd: (payload: GameSessionEnd) => void;
  onHintUsed: () => void;
}
