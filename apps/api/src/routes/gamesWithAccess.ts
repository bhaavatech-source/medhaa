import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { checkGameAccess } from '../services/gameEntitlement';


const prisma = new PrismaClient();
const router = Router();


function mapGameWithAccess(
  game: any,
  accountCreatedAt: Date,
  isSubscribed: boolean,
  overrideAllAccess: boolean = false
) {
  try {
    const access = checkGameAccess({ gameSlug: game.slug, accountCreatedAt, isSubscribed });
    return {
      slug: game.slug,
      title: game.title,
      domain: game.domain,
      ageLabel: game.ageLabel,
      skills: game.skills,
      kind: game.kind,
      tier: access.tier,
      access: overrideAllAccess
        ? { allowed: true, reason: 'admin_override', daysSinceSignup: access.daysSinceSignup }
        : {
            allowed: access.allowed,
            reason: access.reason,
            daysSinceSignup: access.daysSinceSignup,
          },
    };
  } catch (err) {
    console.warn(`Skipping game "${game.slug}" — not registered in gameEntitlement.ts`);
    return null;
  }
}


router.get('/public', async (req, res) => {
  const games = await prisma.game.findMany();
  const publicGames = games
    .map((game) => mapGameWithAccess(game, new Date(), false))
    .filter((g) => g !== null);


  res.json({ games: publicGames, lastCheckInAt: null });
});


router.get('/with-access', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const student = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      student: {
        include: { school: true },
      },
    },
  });


  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }


  const games = await prisma.game.findMany();
  const subscription = await prisma.subscription.findFirst({
    where: { userId: student.id, status: { in: ['ACTIVE', 'TRIALING'] } },
  });


  const gamesWithAccess = games
    .map((game) => mapGameWithAccess(game, student.createdAt, !!subscription, !!student.canAccessAllGames))
    .filter((g) => g !== null);


  const lastCheckIn = await prisma.cognitiveCheckIn.findFirst({
    where: { studentId: student.id },
    orderBy: { completedAt: 'desc' },
  });


  res.json({
    games: gamesWithAccess,
    studentName: student.student?.fullName ?? null,
    gradeLevel: student.student?.gradeLevel ?? null,
    schoolName: student.student?.school?.name ?? null,
    lastCheckInAt: lastCheckIn?.completedAt ?? null,
    subscription: subscription
      ? { status: subscription.status, plan: subscription.plan, trialEndsAt: subscription.trialEndsAt }
      : null,
  });
});


export default router;
