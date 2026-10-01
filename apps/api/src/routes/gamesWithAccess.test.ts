import express from 'express';
import type { Server } from 'node:http';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  findUser: vi.fn(),
  findGames: vi.fn(),
  findSubscriptions: vi.fn(),
  findCheckIn: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    user = { findUnique: db.findUser };
    game = { findMany: db.findGames };
    subscription = { findMany: db.findSubscriptions };
    cognitiveCheckIn = { findFirst: db.findCheckIn };
  },
}));
vi.mock('../middleware/auth', () => ({
  authenticate: (req: { user?: { id: string } }, _res: unknown, next: () => void) => {
    req.user = { id: 'child-user' };
    next();
  },
}));

import router from './gamesWithAccess';

describe('GET /with-access for a child account', () => {
  let server: Server;

  beforeEach(async () => {
    vi.clearAllMocks();
    db.findUser.mockResolvedValue({
      id: 'child-user',
      createdAt: new Date(Date.now() - 30 * 86400000),
      student: { fullName: 'Student', gradeLevel: null, school: null, parent: { userId: 'parent-user' } },
    });
    db.findGames.mockResolvedValue([{
      slug: 'ready-for-the-world', title: 'Ready for the World', domain: 'life-skills',
      ageLabel: '11-17', skills: [], kind: 'game', tier: 'premium-only', isActive: true,
    }]);
    db.findCheckIn.mockResolvedValue(null);
    const app = express();
    app.use(router);
    server = await new Promise((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  async function getGames() {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing test server port');
    const response = await fetch(`http://127.0.0.1:${address.port}/with-access`);
    expect(response.status).toBe(200);
    return response.json();
  }

  it('unlocks premium games when the linked parent has an active subscription', async () => {
    db.findSubscriptions.mockResolvedValue([
      { userId: 'child-user', status: 'TRIALING', trialEndsAt: new Date(Date.now() - 86400000) },
      { userId: 'parent-user', status: 'ACTIVE', plan: 'PREMIUM', trialEndsAt: null },
    ]);
    const result = await getGames();
    expect(db.findSubscriptions).toHaveBeenCalledWith({ where: { userId: { in: ['child-user', 'parent-user'] } } });
    expect(result.games[0].access.allowed).toBe(true);
    expect(result.subscription.status).toBe('ACTIVE');
  });

  it('still unlocks premium games for a student subscribed directly', async () => {
    db.findSubscriptions.mockResolvedValue([
      { userId: 'child-user', status: 'ACTIVE', plan: 'PREMIUM', trialEndsAt: null },
    ]);
    const result = await getGames();
    expect(result.games[0].access.allowed).toBe(true);
    expect(result.subscription.status).toBe('ACTIVE');
  });

  it('sends the actual trial end date with premium game access', async () => {
    const trialEndsAt = new Date(Date.now() + 3 * 86400000);
    db.findSubscriptions.mockResolvedValue([
      { userId: 'child-user', status: 'TRIALING', plan: 'PREMIUM', trialEndsAt },
    ]);
    const result = await getGames();
    expect(result.games[0].access.allowed).toBe(true);
    expect(result.games[0].access.trialEndsAt).toBe(trialEndsAt.toISOString());
  });

  it('does not count an expired trial as premium access', async () => {
    db.findUser.mockResolvedValue({
      id: 'child-user', createdAt: new Date(Date.now() - 12 * 86400000),
      student: { fullName: 'Student', gradeLevel: null, school: null, parent: null },
    });
    db.findSubscriptions.mockResolvedValue([
      { userId: 'child-user', status: 'TRIALING', trialEndsAt: new Date(Date.now() - 86400000) },
    ]);
    const result = await getGames();
    expect(result.games[0].access.allowed).toBe(false);
    expect(result.subscription).toBeNull();
  });

  it('does not use a subscription from a parent unlinked to the child', async () => {
    db.findUser.mockResolvedValue({
      id: 'child-user', createdAt: new Date(Date.now() - 30 * 86400000),
      student: { fullName: 'Student', gradeLevel: null, school: null, parent: null },
    });
    db.findSubscriptions.mockImplementation(async ({ where }: { where: { userId: { in: string[] } } }) =>
      [{ userId: 'unrelated-parent', status: 'ACTIVE', plan: 'PREMIUM' }]
        .filter((entry) => where.userId.in.includes(entry.userId)));
    const result = await getGames();
    expect(db.findSubscriptions).toHaveBeenCalledWith({ where: { userId: { in: ['child-user'] } } });
    expect(result.games[0].access.allowed).toBe(false);
  });
});