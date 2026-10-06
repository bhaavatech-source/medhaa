import { describe, expect, it } from 'vitest';
import { isGameVisible } from './gameVisibility';

describe('isGameVisible', () => {
  it('hides rotating-free games until access is allowed', () => {
    expect(isGameVisible({ tier: 'rotating-free', access: { allowed: false } })).toBe(false);
    expect(isGameVisible({ tier: 'rotating-free', access: { allowed: true } })).toBe(true);
  });

  it('does not hide non-rotating games based on their access state', () => {
    expect(isGameVisible({ tier: 'permanent-free', access: { allowed: true } })).toBe(true);
    expect(isGameVisible({ tier: 'premium-only', access: { allowed: false } })).toBe(true);
  });
});