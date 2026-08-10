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

// GET /games — returns full catalog, flagging which games this student
// can currently play based on trial/subscription/free-tier status.
router.get('/', authenticate, requireRole(['student']), async (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.id;

  const [games, subscription] = await Promise.all([
    prisma.game.findMany({ orderBy: { domain: 'asc' } }),
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
// coins deterministically based on completion + score improvement.
router.post(
  '/:slug/attempts',
  authenticate,
  requireRole(['student']),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = attemptSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const game = await prisma.game.findUnique({ where: { slug: req.params.slug } });
    if (!game) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    const studentId = req.user!.id;
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
      if (previousBest && data.score > previousBest.score) {
        await awardCoins(studentId, 'score_improvement');
      }
    }

    res.status(201).json({ attempt });
  }
);

export default router;
