import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';
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


// GET /api/games-with-access/child/:studentId
// For parent-managed, no-login child profiles (see routes/students.ts).
// SECURITY: the parent's own id is derived server-side from req.user!.id and
// compared against student.parentId. Any mismatch or nonexistent student
// returns the identical 404, so ownership cannot be probed by ID guessing.
router.get(
  '/child/:studentId',
  authenticate,
  requireRole(['parent']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parent = await prisma.parent.findUnique({ where: { userId: req.user!.id } });
      if (!parent) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }

      const child = await prisma.student.findUnique({
        where: { id: req.params.studentId },
        include: { school: true },
      });

      if (!child || child.parentId !== parent.id) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }

      const games = await prisma.game.findMany();
      const parentSubscription = await prisma.subscription.findFirst({
        where: { userId: req.user!.id, status: { in: ['ACTIVE', 'TRIALING'] } },
      });
      const parentUser = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { canAccessAllGames: true },
      });

      const gamesWithAccess = games
        .map((game) =>
          mapGameWithAccess(game, child.createdAt, !!parentSubscription, !!parentUser?.canAccessAllGames)
        )
        .filter((g) => g !== null);

      res.json({
        games: gamesWithAccess,
        studentName: child.fullName,
        gradeLevel: child.gradeLevel,
        schoolName: child.school?.name ?? null,
        lastCheckInAt: null,
        subscription: parentSubscription
          ? {
              status: parentSubscription.status,
              plan: parentSubscription.plan,
              trialEndsAt: parentSubscription.trialEndsAt,
            }
          : null,
      });
    } catch (err) {
      console.error('child games-with-access failed', err);
      res.status(500).json({ error: 'Failed to load games for this profile' });
    }
  }
);


export default router;
