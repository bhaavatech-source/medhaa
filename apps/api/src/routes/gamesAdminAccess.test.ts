import express from 'express';
import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => {
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  return { findGames: vi.fn(), findSubscription: vi.fn() };
});
vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    game = { findMany: db.findGames };
    subscription = { findUnique: db.findSubscription };
  },
}));
vi.mock('../services/coinService', () => ({ awardCoins: vi.fn() }));

import router from './games';

describe('Legacy game catalog admin access', () => {
  let server: Server;
  beforeEach(async () => {
    vi.clearAllMocks();
    db.findGames.mockResolvedValue([{ slug: 'ready-for-the-world', isFreeTier: false }]);
    db.findSubscription.mockResolvedValue(null);
    const app = express();
    app.use(router);
    server = await new Promise((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
  });
  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  async function catalog(role: string) {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing test server port');
    const response = await fetch(`http://127.0.0.1:${address.port}/`, {
      headers: { Authorization: `Bearer ${jwt.sign({ id: 'user', role }, 'test-access-secret')}` },
    });
    return { status: response.status, body: await response.json() };
  }
  it('allows an admin every active game without a subscription', async () => {
    const result = await catalog('admin');
    expect(result.status).toBe(200);
    expect(result.body.hasFullAccess).toBe(true);
    expect(result.body.games[0].entitled).toBe(true);
    expect(db.findGames).toHaveBeenCalledWith({ where: { isActive: true }, orderBy: { domain: 'asc' } });
  });
  it('does not grant premium access to a student without a subscription', async () => {
    const result = await catalog('student');
    expect(result.status).toBe(200);
    expect(result.body.hasFullAccess).toBe(false);
    expect(result.body.games[0].entitled).toBe(false);
  });
  it.each(['teacher', 'parent'])('preserves the existing role restriction for %s', async (role) => {
    expect((await catalog(role)).status).toBe(403);
    expect(db.findGames).not.toHaveBeenCalled();
  });
});
