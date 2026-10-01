// apps/api/src/routes/auth.ts
// Handles registration, login, token refresh, and password reset requests.

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { sendPasswordResetEmail } from '../utils/mail';

const prisma = new PrismaClient();
const router = Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client();
const TRIAL_DAYS = 15;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1),
  role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']),
});

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

  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role.toLowerCase() }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '30d' });

  res.status(201).json({ accessToken, refreshToken, trialEndsAt });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  // Optional: which portal the user is logging in through (student/parent/
  // teacher/school/admin). When present, the account's actual role must
  // match — a student account can't sign in through the parent portal, etc.
  role: z.string().optional(),
});

// The "school" portal isn't a real Role enum value — school accounts are
// ADMIN users with an Admin.schoolId, so it maps to ADMIN for this check.
const PORTAL_TO_ROLE: Record<string, string> = {
  student: 'STUDENT',
  parent: 'PARENT',
  teacher: 'TEACHER',
  admin: 'ADMIN',
  school: 'ADMIN',
};

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

  if (!user.isActive) {
    res.status(403).json({ error: 'This account has been disabled. Contact support for help.' });
    return;
  }

  // Designated permanent super-admin account — always ensured ADMIN on login, on any device.
  const SUPER_ADMIN_EMAIL = 'bhaavatech@gmail.com';
  let role = user.role;
  if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL && role !== 'ADMIN') {
    const promoted = await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
    role = promoted.role;
  }

  if (parsed.data.role) {
    const expectedRole = PORTAL_TO_ROLE[parsed.data.role.toLowerCase()];
    if (expectedRole && role !== expectedRole) {
      res.status(403).json({
        error: `This account is registered as a ${role.toLowerCase()}. Please use the ${role.toLowerCase()} login instead.`,
        actualRole: role.toLowerCase(),
      });
      return;
    }
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const accessToken = jwt.sign({ id: user.id, email: user.email, role: role.toLowerCase() }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '30d' });

  res.json({ accessToken, refreshToken });
});

const googleLoginSchema = z.object({
  credential: z.string().min(1),
  role: z.enum(['student', 'parent']),
});

router.post('/google', async (req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID) {
    res.status(503).json({ error: 'Google sign-in is not configured.' });
    return;
  }
  const parsed = googleLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid Google sign-in request.' });
    return;
  }

  try {
    const ticket = await googleClient.verifyIdToken({ idToken: parsed.data.credential, audience: GOOGLE_CLIENT_ID });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || profile.email_verified !== true) {
      res.status(401).json({ error: 'Google could not verify this email address.' });
      return;
    }

    const email = profile.email.toLowerCase().trim();
    const role = parsed.data.role.toUpperCase() as 'STUDENT' | 'PARENT';
    let user = await prisma.user.findUnique({ where: { googleId: profile.sub } })
        ?? await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    if (user) {
      if (!user.isActive) {
        res.status(403).json({ error: 'This account has been disabled. Contact support for help.' });
        return;
      }
      if (user.role !== role) {
        res.status(403).json({ error: `This account is registered as a ${user.role.toLowerCase()}. Please use the ${user.role.toLowerCase()} login instead.` });
        return;
      }
      if (user.googleId && user.googleId !== profile.sub) {
        res.status(409).json({ error: 'This account is linked to a different Google account.' });
        return;
      }
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId: profile.sub, lastLoginAt: new Date() } });
    } else {
      const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
      const fullName = profile.name?.trim() || email.split('@')[0];
      user = await prisma.user.create({
        data: {
          email, googleId: profile.sub, role, passwordHash: null,
          subscription: { create: { plan: 'PREMIUM', status: 'TRIALING', trialEndsAt } },
          ...(role === 'STUDENT' ? { student: { create: { fullName } } } : { parent: { create: { fullName } } }),
        },
      });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role.toLowerCase() }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '30d' });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('[AUTH] Google sign-in failed:', error);
    res.status(401).json({ error: 'Google sign-in failed. Please try again.' });
  }
});

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
    if (!user.isActive) {
      res.status(403).json({ error: 'This account has been disabled.' });
      return;
    }
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role.toLowerCase() }, ACCESS_SECRET, {
      expiresIn: '15m',
    });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  const email = z.string().email().safeParse(req.body?.email);
  const genericMessage =
    'If an account exists for this email, password reset instructions have been sent.';

  if (!email.success) {
    console.log('[FORGOT] Invalid email format submitted.');
    res.json({ message: genericMessage });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.data.toLowerCase().trim() },
    });

    if (!user) {
      console.log('[FORGOT] No account found for this email.');
      res.json({ message: genericMessage });
      return;
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const crypto = await import('crypto');
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const webBaseUrl = process.env.WEB_APP_URL || 'http://localhost:5173';
    const resetUrl = `${webBaseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    const result = await sendPasswordResetEmail({ to: user.email, resetUrl });

    if (!result.success) {
      console.error('[FORGOT] Email send FAILED for user:', user.email, '| Reason:', result.error);
    } else {
      console.log('[FORGOT] Email send SUCCESS for user:', user.email);
    }

    res.json({ message: genericMessage });
  } catch (error: any) {
    console.error('[FORGOT] Unexpected error:', error.message);
    res.json({ message: genericMessage });
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  const resetSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    console.log('[RESET] Invalid request body.');
    res.status(400).json({ error: 'Invalid reset request' });
    return;
  }

  const { token, password } = parsed.data;

  try {
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!resetToken) {
      console.log('[RESET] Token not found.');
      res.status(400).json({ error: 'This password reset link is invalid or has expired.' });
      return;
    }
    if (resetToken.usedAt) {
      console.log('[RESET] Token already used.');
      res.status(400).json({ error: 'This password reset link is invalid or has expired.' });
      return;
    }
    if (resetToken.expiresAt.getTime() <= Date.now()) {
      console.log('[RESET] Token expired.');
      res.status(400).json({ error: 'This password reset link is invalid or has expired.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId, usedAt: null, id: { not: resetToken.id } },
    });

    console.log('[RESET] Password reset SUCCESS for user:', resetToken.userId);
    res.json({ message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('[RESET] Unexpected error:', error.message);
    res.status(500).json({ error: 'Unable to reset password. Please try again.' });
  }
});

router.post('/bootstrap-admin', async (req: Request, res: Response) => {
  const { email, secret } = req.body as { email?: string; secret?: string };
  const expected = process.env.ADMIN_BOOTSTRAP_SECRET;

  if (!expected) {
    res.status(503).json({ error: 'Bootstrap not configured on this server.' });
    return;
  }
  if (!secret || secret !== expected) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  if (!email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    res.status(404).json({ error: 'No account found for this email' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });

  res.json({ message: 'Account promoted to ADMIN.', email: updated.email });
});

export default router;
