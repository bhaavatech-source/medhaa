// apps/api/src/routes/auth.ts
// Handles registration, login, token refresh, and password reset requests.

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { sendPasswordResetEmail } from '../utils/mail';

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

// POST /auth/forgot-password — creates a short-lived password reset token.
router.post('/forgot-password', async (req: Request, res: Response) => {
  const email = z.string().email().safeParse(req.body?.email);

  // Always return the same response so we do not reveal
  // whether an email address is registered.
  const genericMessage =
    'If an account exists for this email, password reset instructions have been sent.';

  if (!email.success) {
    res.json({ message: genericMessage });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.data.toLowerCase().trim() },
    });

    // Do not reveal whether the account exists.
    if (!user) {
      res.json({ message: genericMessage });
      return;
    }

    // Remove previous unused reset tokens for this user.
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    // Generate a cryptographically secure random token.
    const crypto = await import('crypto');

    const rawToken = crypto.randomBytes(32).toString('hex');

const tokenHash = crypto
  .createHash('sha256')
  .update(rawToken)
  .digest('hex');

console.log('RESET DEBUG: CREATED TOKEN');
console.log('Token length:', rawToken.length);
console.log('Token hash prefix:', tokenHash.substring(0, 12));

    // Token expires after 30 minutes.
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const webBaseUrl =
      process.env.WEB_APP_URL || 'http://localhost:5173';

    const resetUrl =
      `${webBaseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    // DEVELOPMENT ONLY:
    // We will replace this with ZeptoMail after the reset flow
    // has been tested successfully.
    await sendPasswordResetEmail({
  to: user.email,
  resetUrl,
});

console.log('Password reset email successfully sent.');
console.log('Recipient:', user.email);
console.log('Expires:', expiresAt.toISOString());

res.json({ message: genericMessage });
  } catch (error) {
    console.error('Forgot password error:', error);

    // Do not expose internal errors to the user.
    res.json({ message: genericMessage });
  }
});

// POST /auth/reset-password — validates a reset token and changes the password.
router.post('/reset-password', async (req: Request, res: Response) => {
  const resetSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  const parsed = resetSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid reset request',
    });
    return;
  }

  const { token, password } = parsed.data;

  try {
    const crypto = await import('crypto');

    const tokenHash = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');

console.log('RESET DEBUG: RECEIVED TOKEN');
console.log('Token length:', token.length);
console.log('Token hash prefix:', tokenHash.substring(0, 12));

const resetToken = await prisma.passwordResetToken.findUnique({
  where: { tokenHash },
});

    if (!resetToken) {
  console.log('RESET DEBUG: TOKEN NOT FOUND IN DATABASE');

  res.status(400).json({
    error: 'This password reset link is invalid or has expired.',
  });
  return;
}

if (resetToken.usedAt) {
  console.log('RESET DEBUG: TOKEN ALREADY USED');
  console.log('Used at:', resetToken.usedAt.toISOString());

  res.status(400).json({
    error: 'This password reset link is invalid or has expired.',
  });
  return;
}

if (resetToken.expiresAt.getTime() <= Date.now()) {
  console.log('RESET DEBUG: TOKEN EXPIRED');
  console.log('Expires:', resetToken.expiresAt.toISOString());
  console.log('Current:', new Date().toISOString());

  res.status(400).json({
    error: 'This password reset link is invalid or has expired.',
  });
  return;
}

console.log('RESET DEBUG: TOKEN VALID');
console.log('Expires:', resetToken.expiresAt.toISOString());

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),

      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Remove any other unused reset tokens belonging to this user.
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: resetToken.userId,
        usedAt: null,
        id: {
          not: resetToken.id,
        },
      },
    });

    res.json({
      message: 'Password has been reset successfully.',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    res.status(500).json({
      error: 'Unable to reset password. Please try again.',
    });
  }
});

export default router;
