import { z } from 'zod';

export const appUsageEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('first_open') }).strict(),
  z.object({ type: z.literal('foreground_start'), liveSessionId: z.string().uuid() }).strict(),
  z.object({
    type: z.literal('foreground_heartbeat'),
    liveSessionId: z.string().uuid(),
    seconds: z.number().int().min(1).max(30),
  }).strict(),
  z.object({
    type: z.literal('foreground_end'),
    liveSessionId: z.string().uuid(),
    seconds: z.number().int().min(0).max(30),
  }).strict(),
]);

const LIVE_SESSION_TTL_MS = 90_000;
const liveSessions = new Map<string, number>();

export function utcDayStart(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function touchLiveAppSession(sessionId: string, now = Date.now()): void {
  liveSessions.set(sessionId, now);
}

export function endLiveAppSession(sessionId: string): void {
  liveSessions.delete(sessionId);
}

export function getLiveAppSessionCount(now = Date.now()): number {
  for (const [sessionId, lastSeen] of liveSessions) {
    if (now - lastSeen > LIVE_SESSION_TTL_MS) liveSessions.delete(sessionId);
  }
  return liveSessions.size;
}