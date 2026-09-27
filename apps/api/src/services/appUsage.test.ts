import { describe, expect, it } from 'vitest';
import {
  appUsageEventSchema,
  endLiveAppSession,
  getLiveAppSessionCount,
  touchLiveAppSession,
  utcDayStart,
} from './appUsage';

describe('anonymous app usage events', () => {
  it('accepts aggregate events and temporary foreground-session heartbeats', () => {
    expect(appUsageEventSchema.safeParse({ type: 'first_open' }).success).toBe(true);
    expect(appUsageEventSchema.safeParse({ type: 'foreground_start', liveSessionId: '9b2e9fb0-2c68-4edf-a388-49d940ca4554' }).success).toBe(true);
    expect(appUsageEventSchema.safeParse({
      type: 'foreground_heartbeat',
      liveSessionId: '9b2e9fb0-2c68-4edf-a388-49d940ca4554',
      seconds: 30,
    }).success).toBe(true);
  });

  it('rejects identity fields and unreasonable session durations', () => {
    expect(appUsageEventSchema.safeParse({ type: 'first_open', email: 'child@example.com' }).success).toBe(false);
    expect(appUsageEventSchema.safeParse({ type: 'first_open', deviceId: 'stable-id' }).success).toBe(false);
    expect(appUsageEventSchema.safeParse({
      type: 'foreground_heartbeat',
      liveSessionId: '9b2e9fb0-2c68-4edf-a388-49d940ca4554',
      seconds: 31,
    }).success).toBe(false);
    expect(appUsageEventSchema.safeParse({
      type: 'foreground_start',
      liveSessionId: '9b2e9fb0-2c68-4edf-a388-49d940ca4554',
      email: 'child@example.com',
    }).success).toBe(false);
  });

  it('keeps active sessions only in memory and expires them quickly', () => {
    const sessionId = '9b2e9fb0-2c68-4edf-a388-49d940ca4554';
    touchLiveAppSession(sessionId, 1_000);
    expect(getLiveAppSessionCount(90_000)).toBe(1);
    expect(getLiveAppSessionCount(91_001)).toBe(0);

    touchLiveAppSession(sessionId, 1_000);
    endLiveAppSession(sessionId);
    expect(getLiveAppSessionCount(1_001)).toBe(0);
  });

  it('uses a UTC calendar day for aggregate buckets', () => {
    expect(utcDayStart(new Date('2026-09-27T23:59:00.000Z')).toISOString()).toBe('2026-09-27T00:00:00.000Z');
  });
});