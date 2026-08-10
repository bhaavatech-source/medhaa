import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { checkGameAccess } from '../services/gameEntitlement';

const prisma = new PrismaClient();
const router = Router();

router.get('/public', async (req, res) => {
  const games = await prisma.game.findMany();

  const publicGames = games.map((game) => {
    const access = checkGameAccess({
      gameSlug: game.slug,
      accountCreatedAt: new Date(),
      isSubscribed: false,
    });
    return {
      slug: game.slug,
      title: game.title,
      domain: game.domain,
      ageLabel: game.ageLabel,
      skills: game.skills,
      tier: access.tier,
      access: {
        allowed: access.allowed,
        reason: access.reason,
        daysSinceSignup: access.daysSinceSignup,
      },
    };
  });

  res.json({ games: publicGames, lastCheckInAt: null });
});

router.get('/with-access', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const student = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  const games = await prisma.game.findMany();
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: student.id,
      status: { in: ['ACTIVE', 'TRIALING'] },
    },
  });

  const gamesWithAccess = games.map((game) => {
    const access = checkGameAccess({
      gameSlug: game.slug,
      accountCreatedAt: student.createdAt,
      isSubscribed: !!subscription,
    });
    return {
      slug: game.slug,
      title: game.title,
      domain: game.domain,
      ageLabel: game.ageLabel,
      skills: game.skills,
      tier: access.tier,
      access: {
        allowed: access.allowed,
        reason: access.reason,
        daysSinceSignup: access.daysSinceSignup,
      },
    };
  });

  const lastCheckIn = await prisma.cognitiveCheckIn.findFirst({
    where: { studentId: student.id },
    orderBy: { completedAt: 'desc' },
  });

  res.json({
    games: gamesWithAccess,
    lastCheckInAt: lastCheckIn?.completedAt ?? null,
  });
});

export default router;