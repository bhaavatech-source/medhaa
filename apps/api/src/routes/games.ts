// apps/api/src/routes/games.ts
// Exposes the game catalog with per-student entitlement resolution and
// records attempt lifecycle events (start/end) for any of the ~40 games.

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { awardCoins } from '../services/coinService';

const prisma = new PrismaClient();
const router = Router();

const FREE_TIER_GAME_LIMIT = 10;

// Returns this user's own Student profile row (the one GameAttempt/coin
// records are actually keyed on), creating a lightweight one on first use
// if this account has never had one (e.g. an admin/parent/teacher playing
// a game directly rather than through the normal student sign-up flow).
async function getOrCreateOwnStudentProfile(userId: string) {
  const existing = await prisma.student.findUnique({ where: { userId } });
  if (existing) return existing;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return prisma.student.create({
    data: { userId, fullName: user?.email?.split('@')[0] || 'Player' },
  });
}

// GET /games — returns full catalog, flagging which games this student
// can currently play based on trial/subscription/free-tier status.
router.get('/', authenticate, requireRole(['student']), async (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.id;

  const [games, subscription] = await Promise.all([
    prisma.game.findMany({ where: { isActive: true }, orderBy: { domain: 'asc' } }),
    prisma.subscription.findUnique({ where: { userId: studentId } }),
  ]);

  const now = new Date();
  const trialActive =
    subscription?.status === 'TRIALING' &&
    subscription.trialEndsAt &&
    subscription.trialEndsAt > now;
  const premiumActive = subscription?.status === 'ACTIVE';
  const hasFullAccess = trialActive || premiumActive;

  const catalog = games.map((game) => ({
    ...game,
    entitled: hasFullAccess || game.isFreeTier,
  }));

  res.json({ games: catalog, hasFullAccess });
});

const attemptSchema = z.object({
  endTime: z.string(),
  durationMs: z.number().int().positive(),
  score: z.number(),
  accuracy: z.number().min(0).max(1),
  hintsUsed: z.number().int().min(0),
  completionStatus: z.enum(['completed', 'abandoned', 'failed']),
});

// POST /games/:slug/attempts — records a completed session and awards
// coins deterministically based on completion + score improvement. Any
// logged-in role can play and track their own results, not just students
// (e.g. an admin or parent testing a game directly).
router.post(
  '/:slug/attempts',
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = attemptSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

const game = await prisma.game.findUnique({ where: { slug: req.params.slug as string } });
    if (!game) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    const student = await getOrCreateOwnStudentProfile(req.user!.id);
    const studentId = student.id;
    const data = parsed.data;

    const previousBest = await prisma.gameAttempt.findFirst({
      where: { studentId, gameId: game.id, completionStatus: 'completed' },
      orderBy: { score: 'desc' },
    });

    const attempt = await prisma.gameAttempt.create({
      data: {
        studentId,
        gameId: game.id,
        startTime: new Date(new Date(data.endTime).getTime() - data.durationMs),
        endTime: new Date(data.endTime),
        durationMs: data.durationMs,
        score: data.score,
        accuracy: data.accuracy,
        hintsUsed: data.hintsUsed,
        completionStatus: data.completionStatus,
      },
    });

    if (data.completionStatus === 'completed') {
      await awardCoins(studentId, 'game_completion');
if (previousBest && previousBest.score !== null && data.score > previousBest.score) {
        await awardCoins(studentId, 'score_improvement');
      }
    }

    res.status(201).json({ attempt });
  }
);

// GET /games/history — recent attempts + a simple real-data summary for the
// in-game "My Report" panel (bhava-session.js), replacing the old
// bhava-cloud IQ/EQ/SQ mock with actual GameAttempt data from this student.
// Any logged-in role sees only their OWN results here, never anyone else's.
router.get('/history', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const student = await getOrCreateOwnStudentProfile(req.user!.id);
  const studentId = student.id;
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 5));

  const [attempts, aggregate] = await Promise.all([
    prisma.gameAttempt.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { game: { select: { title: true, domain: true } } },
    }),
    prisma.gameAttempt.aggregate({
      where: { studentId, completionStatus: 'completed' },
      _count: { _all: true },
      _avg: { score: true },
      _max: { score: true },
    }),
  ]);

  res.json({
    summary: {
      gamesCompleted: aggregate._count._all,
      averageScore: aggregate._avg.score != null ? Math.round(aggregate._avg.score) : null,
      bestScore: aggregate._max.score != null ? Math.round(aggregate._max.score) : null,
    },
    sessions: attempts.map((a) => ({
      gameName: a.game.title,
      domain: a.game.domain,
      score: a.score,
      completed: a.completionStatus === 'completed',
      startedAt: a.startTime,
    })),
  });
});

export default router;
