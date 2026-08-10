// packages/game-sdk/src/reportSession.ts
// Called by the GameContainer host (not by individual games directly)
// to persist attempt data via the API once a game reports session end.

import { GameSessionEnd } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function reportGameSession(
  accessToken: string,
  payload: GameSessionEnd
): Promise<void> {
  const response = await fetch(`${API_BASE}/games/${payload.gameSlug}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Non-fatal: queue for retry so a network blip never loses a
    // student's completed session data.
    const queued = JSON.parse(localStorage.getItem('medhaa-pending-sessions') || '[]');
    queued.push(payload);
    localStorage.setItem('medhaa-pending-sessions', JSON.stringify(queued));
  }
}

// Called on app startup / regained connectivity to flush any sessions
// that failed to report earlier (e.g. offline PWA usage).
export async function flushPendingSessions(accessToken: string): Promise<void> {
  const queued: GameSessionEnd[] = JSON.parse(
    localStorage.getItem('medhaa-pending-sessions') || '[]'
  );
  if (queued.length === 0) return;

  const remaining: GameSessionEnd[] = [];
  for (const payload of queued) {
    try {
      await reportGameSession(accessToken, payload);
    } catch {
      remaining.push(payload);
    }
  }
  localStorage.setItem('medhaa-pending-sessions', JSON.stringify(remaining));
}
