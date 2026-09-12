// apps/api/src/routes/admin.ts
// Full admin console API: users, schools, coupons, audit logs and the game
// catalog. Every route here requires an authenticated ADMIN.

import { Router, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditLog';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate, requireRole(['admin']));

// Accounts created by prisma/seed.ts for local/demo testing — never real customers.
// Used to separate "real" signups/activity from seeded demo data in the metrics below.
const SEED_EMAILS = ['admin@medhaa.net', 'teacher@medhaa.test', 'parent@medhaa.test', 'student@medhaa.test', 'admin@medhaa.test'];
const isDemoEmail = (email: string) => SEED_EMAILS.includes(email.toLowerCase());

function paginate(req: AuthenticatedRequest) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 25));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

router.get('/overview', async (_req: AuthenticatedRequest, res: Response) => {
  const now = new Date();
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const demoWhere = { email: { notIn: SEED_EMAILS } };

  const [
    totalUsers,
    students,
    parents,
    teachers,
    admins,
    schools,
    games,
    activeSubs,
    trialingSubs,
    pendingSubs,
    recentAuditLogs,
    realUsers,
    newRealUsers7d,
    newRealUsers30d,
    activeRealUsers7d,
    activeRealUsers30d,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'PARENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.school.count(),
    prisma.game.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { status: 'TRIALING' } }),
    prisma.subscription.count({ where: { status: 'PENDING' } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { email: true, role: true } } },
    }),
    prisma.user.count({ where: demoWhere }),
    prisma.user.count({ where: { ...demoWhere, createdAt: { gte: since7d } } }),
    prisma.user.count({ where: { ...demoWhere, createdAt: { gte: since30d } } }),
    prisma.user.count({ where: { ...demoWhere, lastLoginAt: { gte: since7d } } }),
    prisma.user.count({ where: { ...demoWhere, lastLoginAt: { gte: since30d } } }),
  ]);

  res.json({
    totals: { totalUsers, students, parents, teachers, admins, schools, games, activeSubs, trialingSubs, pendingSubs },
    realUsage: {
      realUsers,
      demoUsers: totalUsers - realUsers,
      newSignups7d: newRealUsers7d,
      newSignups30d: newRealUsers30d,
      activeUsers7d: activeRealUsers7d,
      activeUsers30d: activeRealUsers30d,
    },
    recentAuditLogs,
  });
});

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  const { page, pageSize, skip, take } = paginate(req);
  const search = String(req.query.search || '').trim();
  const role = String(req.query.role || '').trim().toUpperCase();
  const status = String(req.query.status || '').trim();

  const where: any = {};
  if (search) where.email = { contains: search, mode: 'insensitive' };
  if (role && ['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'].includes(role)) where.role = role;
  if (status === 'active') where.isActive = true;
  if (status === 'disabled') where.isActive = false;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { fullName: true, school: { select: { name: true } } } },
        parent: { select: { fullName: true } },
        teacher: { select: { fullName: true, school: { select: { name: true } } } },
        admin: { select: { fullName: true, school: { select: { name: true } } } },
        subscription: { select: { status: true, plan: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const mapped = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    isDemo: isDemoEmail(u.email),
    fullName: u.student?.fullName ?? u.parent?.fullName ?? u.teacher?.fullName ?? u.admin?.fullName ?? null,
    schoolName: u.student?.school?.name ?? u.teacher?.school?.name ?? u.admin?.school?.name ?? null,
    subscriptionStatus: u.subscription?.status ?? null,
    subscriptionPlan: u.subscription?.plan ?? null,
  }));

  res.json({ users: mapped, total, page, pageSize });
});

router.patch('/users/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { isActive } = req.body as { isActive: boolean };

  if (typeof isActive !== 'boolean') {
    res.status(400).json({ error: 'isActive must be a boolean' });
    return;
  }
  if (id === req.user!.id && !isActive) {
    res.status(400).json({ error: 'You cannot disable your own account.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updated = await prisma.user.update({ where: { id }, data: { isActive } });
  await logAudit(req.user!.id, isActive ? 'user.enable' : 'user.disable', { targetUserId: id, targetEmail: user.email });

  res.json({ user: { id: updated.id, isActive: updated.isActive } });
});

router.patch('/users/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { role, schoolId, fullName } = req.body as { role: Role; schoolId?: string; fullName?: string };

  if (!['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'].includes(role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if ((role === 'TEACHER' || role === 'ADMIN') && !schoolId) {
    res.status(400).json({ error: 'schoolId is required when assigning the Teacher or Admin role' });
    return;
  }
  if (schoolId) {
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      res.status(400).json({ error: 'School not found' });
      return;
    }
  }

  const name = fullName?.trim() || user.email.split('@')[0];

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id }, data: { role } });

    if (role === 'STUDENT') {
      await tx.student.upsert({
        where: { userId: id },
        update: {},
        create: { userId: id, fullName: name },
      });
    } else if (role === 'PARENT') {
      await tx.parent.upsert({
        where: { userId: id },
        update: {},
        create: { userId: id, fullName: name },
      });
    } else if (role === 'TEACHER') {
      await tx.teacher.upsert({
        where: { userId: id },
        update: { schoolId: schoolId! },
        create: { userId: id, fullName: name, schoolId: schoolId! },
      });
    } else if (role === 'ADMIN') {
      await tx.admin.upsert({
        where: { userId: id },
        update: { schoolId: schoolId! },
        create: { userId: id, fullName: name, schoolId: schoolId! },
      });
    }
  });

  await logAudit(req.user!.id, 'user.role_change', { targetUserId: id, targetEmail: user.email, newRole: role });

  res.json({ message: `${user.email} is now ${role}.` });
});

// ---------------------------------------------------------------------------
// Schools
// ---------------------------------------------------------------------------

router.get('/schools', async (_req: AuthenticatedRequest, res: Response) => {
  const schools = await prisma.school.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { students: true, teachers: true, admins: true } } },
  });
  res.json({ schools });
});

router.post('/schools', async (req: AuthenticatedRequest, res: Response) => {
  const { name, address } = req.body as { name: string; address?: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: 'School name is required' });
    return;
  }

  const school = await prisma.school.create({ data: { name: name.trim(), address: address?.trim() || null } });
  await logAudit(req.user!.id, 'school.create', { schoolId: school.id, name: school.name });

  res.status(201).json({ school });
});

router.patch('/schools/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, address } = req.body as { name?: string; address?: string };

  const existing = await prisma.school.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'School not found' });
    return;
  }

  const school = await prisma.school.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(address !== undefined ? { address: address.trim() || null } : {}),
    },
  });
  await logAudit(req.user!.id, 'school.update', { schoolId: id });

  res.json({ school });
});

router.delete('/schools/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const school = await prisma.school.findUnique({
    where: { id },
    include: { _count: { select: { students: true, teachers: true, admins: true } } },
  });
  if (!school) {
    res.status(404).json({ error: 'School not found' });
    return;
  }
  const linked = school._count.students + school._count.teachers + school._count.admins;
  if (linked > 0) {
    res.status(409).json({ error: 'This school still has students, teachers or admins linked to it. Reassign them first.' });
    return;
  }

  await prisma.school.delete({ where: { id } });
  await logAudit(req.user!.id, 'school.delete', { schoolId: id, name: school.name });

  res.json({ message: 'School deleted.' });
});

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

router.get('/coupons', async (_req: AuthenticatedRequest, res: Response) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ coupons });
});

router.post('/coupons', async (req: AuthenticatedRequest, res: Response) => {
  const { code, type, rewardType, rewardValue, maxRedemptions, expiresAt } = req.body as {
    code: string;
    type: string;
    rewardType: string;
    rewardValue: string;
    maxRedemptions?: number;
    expiresAt?: string;
  };

  if (!code?.trim() || !type?.trim() || !rewardType?.trim() || !rewardValue?.trim()) {
    res.status(400).json({ error: 'code, type, rewardType and rewardValue are required' });
    return;
  }

  const existing = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (existing) {
    res.status(409).json({ error: 'A coupon with this code already exists' });
    return;
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: code.trim().toUpperCase(),
      type: type.trim(),
      rewardType: rewardType.trim(),
      rewardValue: rewardValue.trim(),
      maxRedemptions: maxRedemptions ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  await logAudit(req.user!.id, 'coupon.create', { couponId: coupon.id, code: coupon.code });

  res.status(201).json({ coupon });
});

router.patch('/coupons/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { type, rewardType, rewardValue, maxRedemptions, expiresAt } = req.body as {
    type?: string;
    rewardType?: string;
    rewardValue?: string;
    maxRedemptions?: number | null;
    expiresAt?: string | null;
  };

  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      ...(type !== undefined ? { type } : {}),
      ...(rewardType !== undefined ? { rewardType } : {}),
      ...(rewardValue !== undefined ? { rewardValue } : {}),
      ...(maxRedemptions !== undefined ? { maxRedemptions } : {}),
      ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}),
    },
  });
  await logAudit(req.user!.id, 'coupon.update', { couponId: id });

  res.json({ coupon });
});

router.delete('/coupons/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }

  await prisma.coupon.delete({ where: { id } });
  await logAudit(req.user!.id, 'coupon.delete', { couponId: id, code: existing.code });

  res.json({ message: 'Coupon deleted.' });
});

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------

router.get('/audit-logs', async (req: AuthenticatedRequest, res: Response) => {
  const { page, pageSize, skip, take } = paginate(req);
  const userId = String(req.query.userId || '').trim();
  const action = String(req.query.action || '').trim();

  const where: any = {};
  if (userId) where.userId = userId;
  if (action) where.action = { contains: action, mode: 'insensitive' };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, role: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  res.json({ logs, total, page, pageSize });
});

// ---------------------------------------------------------------------------
// Games catalog
// ---------------------------------------------------------------------------

const VALID_GAME_TIERS = ['assessment', 'permanent-free', 'rotating-free', 'premium-only'];

router.get('/games', async (_req: AuthenticatedRequest, res: Response) => {
  const games = await prisma.game.findMany({ orderBy: [{ domain: 'asc' }, { title: 'asc' }] });
  res.json({ games });
});

router.post('/games', async (req: AuthenticatedRequest, res: Response) => {
  const { slug, title, domain, entryPath, ageLabel, skills, kind, tier, isFreeTier } = req.body as {
    slug: string;
    title: string;
    domain: string;
    entryPath: string;
    ageLabel?: string;
    skills?: string[];
    kind?: string;
    tier: string;
    isFreeTier?: boolean;
  };

  if (!slug?.trim() || !title?.trim() || !domain?.trim() || !entryPath?.trim()) {
    res.status(400).json({ error: 'slug, title, domain and entryPath are required' });
    return;
  }
  if (!VALID_GAME_TIERS.includes(tier)) {
    res.status(400).json({ error: `tier must be one of: ${VALID_GAME_TIERS.join(', ')}` });
    return;
  }

  const existing = await prisma.game.findUnique({ where: { slug: slug.trim() } });
  if (existing) {
    res.status(409).json({ error: 'A game with this slug already exists' });
    return;
  }

  const game = await prisma.game.create({
    data: {
      slug: slug.trim(),
      title: title.trim(),
      domain: domain.trim(),
      entryPath: entryPath.trim(),
      ageLabel: ageLabel?.trim() || null,
      skills: skills ?? [],
      kind: kind?.trim() || 'game',
      tier,
      isFreeTier: isFreeTier ?? (tier === 'permanent-free' || tier === 'assessment'),
      isActive: true,
    },
  });
  await logAudit(req.user!.id, 'game.create', { gameId: game.id, slug: game.slug });

  res.status(201).json({ game });
});

router.patch('/games/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, domain, entryPath, ageLabel, skills, kind, tier, isFreeTier, isActive } = req.body as {
    title?: string;
    domain?: string;
    entryPath?: string;
    ageLabel?: string | null;
    skills?: string[];
    kind?: string;
    tier?: string;
    isFreeTier?: boolean;
    isActive?: boolean;
  };

  const existing = await prisma.game.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  if (tier !== undefined && !VALID_GAME_TIERS.includes(tier)) {
    res.status(400).json({ error: `tier must be one of: ${VALID_GAME_TIERS.join(', ')}` });
    return;
  }

  const game = await prisma.game.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(domain !== undefined ? { domain } : {}),
      ...(entryPath !== undefined ? { entryPath } : {}),
      ...(ageLabel !== undefined ? { ageLabel } : {}),
      ...(skills !== undefined ? { skills } : {}),
      ...(kind !== undefined ? { kind } : {}),
      ...(tier !== undefined ? { tier } : {}),
      ...(isFreeTier !== undefined ? { isFreeTier } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  });
  await logAudit(req.user!.id, 'game.update', { gameId: id, slug: existing.slug, changes: req.body });

  res.json({ game });
});

router.delete('/games/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const existing = await prisma.game.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }

  try {
    await prisma.game.delete({ where: { id } });
    await logAudit(req.user!.id, 'game.delete', { gameId: id, slug: existing.slug });
    res.json({ message: 'Game deleted.' });
  } catch (err) {
    // Foreign key constraint — students have recorded attempts for this game.
    res.status(409).json({
      error: 'This game has recorded play history and cannot be deleted. Disable it instead to hide it from everyone.',
    });
  }
});

export default router;
