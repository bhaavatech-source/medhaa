import express from 'express';
import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  process.env.GOOGLE_CLIENT_ID = 'test-google-client';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  return {
    verifyIdToken: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };
});

vi.mock('google-auth-library', () => ({
  OAuth2Client: class { verifyIdToken = mocks.verifyIdToken; },
}));
vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    user = { findUnique: mocks.findUnique, findFirst: mocks.findFirst, create: mocks.create, update: mocks.update };
  },
}));
vi.mock('../utils/mail', () => ({ sendPasswordResetEmail: vi.fn() }));

import router from './auth';

describe('POST /google', () => {
  let server: Server;

  beforeEach(async () => {
    vi.clearAllMocks();
    mocks.verifyIdToken.mockResolvedValue({ getPayload: () => ({
      sub: 'google-subject', email: 'student@example.com', email_verified: true, name: 'Student Name',
    }) });
    mocks.findUnique.mockResolvedValue(null);
      mocks.findFirst.mockResolvedValue(null);
    mocks.create.mockImplementation(async ({ data }) => ({
      id: 'new-student', email: data.email, role: data.role, isActive: true, googleId: data.googleId,
    }));
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

  async function signIn(role = 'student', credential = 'google-id-token') {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing test server port');
    const response = await fetch(`http://127.0.0.1:${address.port}/google`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, credential }),
    });
    return { status: response.status, body: await response.json() };
  }

  it('verifies the audience and provisions a student with the usual session', async () => {
    const result = await signIn();
    expect(result.status).toBe(200);
    expect(mocks.verifyIdToken).toHaveBeenCalledWith({ idToken: 'google-id-token', audience: 'test-google-client' });
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      email: 'student@example.com', googleId: 'google-subject', role: 'STUDENT', passwordHash: null,
      student: { create: { fullName: 'Student Name' } },
      subscription: { create: expect.objectContaining({ plan: 'PREMIUM', status: 'TRIALING' }) },
    }) });
    expect(jwt.verify(result.body.accessToken, 'test-access-secret')).toMatchObject({ role: 'student', id: 'new-student' });
    expect(result.body.refreshToken).toBeTruthy();
  });

  it('provisions a parent only through the parent portal', async () => {
    const result = await signIn('parent');
    expect(result.status).toBe(200);
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      role: 'PARENT', parent: { create: { fullName: 'Student Name' } },
    }) });
  });

  it('links a verified existing email without creating a new account', async () => {
    const existing = { id: 'existing-student', email: 'Student@Example.com', role: 'STUDENT', isActive: true, googleId: null };
    mocks.findFirst.mockResolvedValueOnce(existing);
    mocks.update.mockResolvedValue({ ...existing, googleId: 'google-subject' });
    const result = await signIn();
    expect(result.status).toBe(200);
    expect(mocks.findFirst).toHaveBeenCalledWith({ where: { email: { equals: 'student@example.com', mode: 'insensitive' } } });
    expect(mocks.update).toHaveBeenCalledWith({ where: { id: 'existing-student' }, data: expect.objectContaining({ googleId: 'google-subject' }) });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('rejects an unverified email and a forged token', async () => {
    mocks.verifyIdToken.mockResolvedValueOnce({ getPayload: () => ({ sub: 'google-subject', email: 'student@example.com', email_verified: false }) });
    expect((await signIn()).status).toBe(401);
    mocks.verifyIdToken.mockRejectedValueOnce(new Error('Invalid signature'));
    expect((await signIn()).status).toBe(401);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('rejects disabled accounts, role mismatches and a different linked Google ID', async () => {
    const existing = { id: 'existing-student', email: 'student@example.com', role: 'STUDENT', isActive: false, googleId: null };
    mocks.findFirst.mockResolvedValueOnce(existing);
    expect((await signIn()).status).toBe(403);
    mocks.findFirst.mockResolvedValueOnce({ ...existing, isActive: true, role: 'PARENT' });
    expect((await signIn()).status).toBe(403);
    mocks.findFirst.mockResolvedValueOnce({ ...existing, isActive: true, googleId: 'other-google-id' });
    expect((await signIn()).status).toBe(409);
    expect(mocks.update).not.toHaveBeenCalled();
  });
});