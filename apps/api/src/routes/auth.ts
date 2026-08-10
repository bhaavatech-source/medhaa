// apps/api/src/routes/auth.ts
// Handles registration, login, token refresh, and password reset requests.

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const TRIAL_DAYS = 15;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1),
  role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']),
});

// POST /auth/register — creates a new user, role profile, and starts the
// 15-day premium trial automatically.
router.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password, fullName, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      subscription: {
        create: { plan: 'PREMIUM', status: 'TRIALING', trialEndsAt },
      },
      ...(role === 'STUDENT' && { student: { create: { fullName } } }),
      ...(role === 'PARENT' && { parent: { create: { fullName } } }),
    },
  });

  const accessToken = jwt.sign({ id: user.id, role: user.role.toLowerCase() }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '30d' });

  res.status(201).json({ accessToken, refreshToken, trialEndsAt });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /auth/login — validates credentials and issues token pair.
router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const accessToken = jwt.sign({ id: user.id, role: user.role.toLowerCase() }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '30d' });

  res.json({ accessToken, refreshToken });
});

// POST /auth/refresh — exchanges a valid refresh token for a new access token.
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: 'refreshToken is required' });
    return;
  }
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ error: 'User no longer exists' });
      return;
    }
    const accessToken = jwt.sign({ id: user.id, role: user.role.toLowerCase() }, ACCESS_SECRET, {
      expiresIn: '15m',
    });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;
