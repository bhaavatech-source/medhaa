// apps/api/src/routes/parent.ts
// Lets a logged-in parent add a child profile directly, with no separate
// student email/password signup — most 5-10 year olds don't have an email.
// The child gets a Student profile + an internal-only User row (no password,
// so it can never be used to log in on its own). The parent can then start
// a short supervised session for that child via POST /children/:id/enter.

import { Router, Response } from 'express';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const TRIAL_DAYS = 15;

router.use(authenticate, requireRole(['parent']));

async function getParentRecord(userId: string) {
  return prisma.parent.findUnique({ where: { userId } });
}

router.get('/children', async (req: AuthenticatedRequest, res: Response) => {
  const parent = await getParentRecord(req.user!.id);
  if (!parent) {
    res.json({ children: [] });
    return;
  }

  const children = await prisma.student.findMany({
    where: { parentId: parent.id },
    include: { school: { select: { name: true } } },
    orderBy: { fullName: 'asc' },
  });

  res.json({
    children: children.map((c) => ({
      id: c.id,
      fullName: c.fullName,
      age: c.age,
      gradeLabel: c.gradeLabel,
      coins: c.coins,
      xp: c.xp,
      level: c.level,
      schoolName: c.school?.name ?? null,
    })),
  });
});

const addChildSchema = z.object({
  fullName: z.string().min(1, 'Child\'s name is required'),
  age: z.number().int().min(3).max(18).optional(),
  gradeLabel: z.string().max(60).optional(),
});

router.post('/children', async (req: AuthenticatedRequest, res: Response) => {
  const parsed = addChildSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { fullName, age, gradeLabel } = parsed.data;

  let parent = await getParentRecord(req.user!.id);
  if (!parent) {
    // A parent account created before the Parent profile existed — back-fill it.
    parent = await prisma.parent.create({
      data: { userId: req.user!.id, fullName: 'Parent' },
    });
  }

  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const childEmail = `child-${randomUUID()}@children.medhaa.internal`;

  const childUser = await prisma.user.create({
    data: {
      email: childEmail,
      passwordHash: null,
      role: 'STUDENT',
      subscription: { create: { plan: 'PREMIUM', status: 'TRIALING', trialEndsAt } },
      student: {
        create: { fullName, age, gradeLabel, parentId: parent.id },
      },
    },
    include: { student: true },
  });

  res.status(201).json({
    child: {
      id: childUser.student!.id,
      fullName: childUser.student!.fullName,
      age: childUser.student!.age,
      gradeLabel: childUser.student!.gradeLabel,
    },
  });
});

router.post('/children/:id/enter', async (req: AuthenticatedRequest, res: Response) => {
  const parent = await getParentRecord(req.user!.id);
  if (!parent) {
    res.status(404).json({ error: 'Parent profile not found' });
    return;
  }

  const child = await prisma.student.findUnique({
    where: { id: req.params.id as string },
    include: { user: true },
  });

  if (!child || child.parentId !== parent.id) {
    res.status(404).json({ error: 'Child profile not found' });
    return;
  }
  if (!child.user.isActive) {
    res.status(403).json({ error: 'This child profile has been disabled.' });
    return;
  }

  // Short supervised session only — no refresh token, so it naturally expires
  // and never becomes an independent long-lived login for the child.
  const accessToken = jwt.sign({ id: child.user.id, role: 'student' }, ACCESS_SECRET, {
    expiresIn: '2h',
  });

  res.json({ accessToken, child: { id: child.id, fullName: child.fullName } });
});

export default router;
