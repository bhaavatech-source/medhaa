import { describe, it, expect } from 'vitest';
import { getGameTier, checkGameAccess, ASSESSMENT_TOOLS, PERMANENT_FREE_GAMES, PREMIUM_ONLY_GAMES } from './gameEntitlement';

describe('getGameTier', () => {
  it('classifies an assessment tool', () => {
    expect(getGameTier(ASSESSMENT_TOOLS[0])).toBe('assessment');
  });

  it('classifies a permanent free game', () => {
    expect(getGameTier(PERMANENT_FREE_GAMES[0])).toBe('permanent-free');
  });

  it('classifies a premium-only game', () => {
    expect(getGameTier(PREMIUM_ONLY_GAMES[0])).toBe('premium-only');
  });

  it('throws for an unknown slug so new games can\'t silently fall through', () => {
    expect(() => getGameTier('not-a-real-game')).toThrow(/Unknown game slug/);
  });
});

describe('checkGameAccess', () => {
  const dayMs = 1000 * 60 * 60 * 24;

  it('always allows access to assessment tools', () => {
    const result = checkGameAccess({
      gameSlug: ASSESSMENT_TOOLS[0],
      accountCreatedAt: new Date(),
      isSubscribed: false,
    });
    expect(result.allowed).toBe(true);
    expect(result.tier).toBe('assessment');
  });

  it('always allows access to permanent free games regardless of subscription', () => {
    const result = checkGameAccess({
      gameSlug: PERMANENT_FREE_GAMES[0],
      accountCreatedAt: new Date(),
      isSubscribed: false,
    });
    expect(result.allowed).toBe(true);
  });

  it('blocks a disabled game even for a subscriber', () => {
    const result = checkGameAccess({
      gameSlug: PREMIUM_ONLY_GAMES[0],
      accountCreatedAt: new Date(),
      isSubscribed: true,
      isActive: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('disabled by admin');
  });

  it('allows a premium-only game for an active subscriber', () => {
    const result = checkGameAccess({
      gameSlug: PREMIUM_ONLY_GAMES[0],
      accountCreatedAt: new Date(Date.now() - 100 * dayMs),
      isSubscribed: true,
    });
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe('premium subscriber');
  });

  it('allows a premium-only game during the trial window for a non-subscriber', () => {
    const result = checkGameAccess({
      gameSlug: PREMIUM_ONLY_GAMES[0],
      accountCreatedAt: new Date(),
      isSubscribed: false,
    });
    expect(result.allowed).toBe(true);
    expect(result.reason).toMatch(/trial/);
  });

  it('blocks a premium-only game once the trial has expired for a non-subscriber', () => {
    const result = checkGameAccess({
      gameSlug: PREMIUM_ONLY_GAMES[0],
      accountCreatedAt: new Date(Date.now() - 30 * dayMs),
      isSubscribed: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('premium subscription required');
  });

  it('lets an admin-set DB tier override the hardcoded tier lists', () => {
    const result = checkGameAccess({
      gameSlug: PREMIUM_ONLY_GAMES[0],
      accountCreatedAt: new Date(),
      isSubscribed: false,
      dbTier: 'permanent-free',
    });
    expect(result.tier).toBe('permanent-free');
    expect(result.allowed).toBe(true);
  });
});
