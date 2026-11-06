import express from 'express';
import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => {
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  return { findUser: vi.fn(), upsert: vi.fn(), audit: vi.fn() };
});

vi.mock('@prisma/client', async (importOriginal) => ({
  ...await importOriginal<typeof import('@prisma/client')>(),
  PrismaClient: class {
    user = { findFirst: db.findUser };
    subscription = { upsert: db.upsert };
  },
}));
vi.mock('../services/auditLog', () => ({ logAudit: db.audit }));

import router from './subscriptions';

describe('Free lifetime subscription grants', () => {
  let server: Server;

  beforeEach(async () => {
    vi.clearAllMocks();
    db.findUser.mockResolvedValue({ id: 'recipient', email: 'recipient@example.com', isActive: true });
    db.upsert.mockImplementation(async ({ create }) => ({ id: 'subscription', ...create }));
    const app = express();
    app.use(express.json());
    app.use(router);
    server = await new Promise((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  async function grant(email: string, role: string | null = 'admin') {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing test server port');
    const token = jwt.sign({ id: 'granting-admin', role }, 'test-access-secret');
    const response = await fetch(`http://127.0.0.1:${address.port}/grant-free`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(role && { Authorization: `Bearer ${token}` }) },
      body: JSON.stringify({ email }),
    });
    return { status: response.status, body: await response.json() };
  }

  it('creates or replaces a subscription with zero-cost lifetime access and audits the grant', async () => {
    const result = await grant(' Recipient@Example.com ');
    expect(result.status).toBe(200);
    expect(db.findUser).toHaveBeenCalledWith({ where: { email: { equals: 'Recipient@Example.com', mode: 'insensitive' } } });
    const expected = {
      plan: 'LIFETIME', status: 'ACTIVE', amount: 0, paymentMethod: 'admin-free',
      trialEndsAt: null, currentPeriodEnd: null, transactionRef: null,
      notes: 'Free lifetime subscription granted by an admin.',
    };
    expect(db.upsert).toHaveBeenCalledWith({
      where: { userId: 'recipient' }, update: expected, create: { userId: 'recipient', ...expected },
    });
    expect(result.body.subscription).toMatchObject(expected);
    expect(db.audit).toHaveBeenCalledWith('granting-admin', 'subscription.grant_free', {
      targetUserId: 'recipient', subscriptionId: 'subscription', plan: 'LIFETIME',
    });
  });

  it.each(['student', 'parent', 'teacher'])('denies grants by a %s', async (role) => {
    expect((await grant('recipient@example.com', role)).status).toBe(403);
    expect(db.findUser).not.toHaveBeenCalled();
    expect(db.upsert).not.toHaveBeenCalled();
  });

  it('requires authentication before granting a subscription', async () => {
    expect((await grant('recipient@example.com', null)).status).toBe(401);
    expect(db.upsert).not.toHaveBeenCalled();
  });

  it('rejects invalid, missing and disabled recipients without changing a subscription', async () => {
    expect((await grant('invalid')).status).toBe(400);
    db.findUser.mockResolvedValueOnce(null);
    expect((await grant('missing@example.com')).status).toBe(404);
    db.findUser.mockResolvedValueOnce({ id: 'recipient', email: 'recipient@example.com', isActive: false });
    expect((await grant('recipient@example.com')).status).toBe(403);
    expect(db.upsert).not.toHaveBeenCalled();
  });
});
