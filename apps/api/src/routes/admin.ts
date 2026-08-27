// apps/api/src/routes/admin.ts
import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate, requireRole(['admin']));

async function logAction(adminUserId: string, action: string, metadata?: Record<string, unknown>) {
  await prisma.auditLog.create({
    data: { userId: adminUserId, action, metadata: metadata ?? undefined },
  });
}

router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search = '', role, isBlocked, page = '1', pageSize = '20' } = req.query as Record<string, string>;
    const take = Math.min(parseInt(pageSize, 10) || 20, 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

    const where: any = {
      AND: [
        search ? { email: { contains: search, mode: 'insensitive' } } : {},
        role ? { role } : {},
        isBlocked !== undefined ? { isBlocked: isBlocked === 'true' } : {},
      ],
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { subscription: true, student: true, parent: true, teacher: true, admin: true },
      }),
    ]);

    res.json({ total, page: Number(page), pageSize: take, users });
  } catch (err) {
    console.error('GET /admin/users failed', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.post('/users/:id/block', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reason } = (req.body ?? {}) as { reason?: string };
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked: true, blockedAt: new Date(), blockedReason: reason ?? null },
    });
    await logAction(req.user!.id, 'BLOCK_USER', { targetUserId: user.id, reason });
    res.json(user);
  } catch (err) {
    console.error('block user failed', err);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

router.post('/users/:id/unblock', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked: false, blockedAt: null, blockedReason: null },
    });
    await logAction(req.user!.id, 'UNBLOCK_USER', { targetUserId: user.id });
    res.json(user);
  } catch (err) {
    console.error('unblock user failed', err);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

router.post('/users/:id/restrict', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { features } = (req.body ?? {}) as { features?: string[] };
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { restrictedFeatures: features ?? [] },
    });
    await logAction(req.user!.id, 'SET_RESTRICTED_FEATURES', { targetUserId: user.id, features });
    res.json(user);
  } catch (err) {
    console.error('restrict user failed', err);
    res.status(500).json({ error: 'Failed to update restrictions' });
  }
});

router.post('/users/:id/game-access', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { enabled } = (req.body ?? {}) as { enabled?: boolean };
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { canAccessAllGames: Boolean(enabled) },
    });
    await logAction(req.user!.id, 'SET_GAME_ACCESS', { targetUserId: user.id, enabled: Boolean(enabled) });
    res.json(user);
  } catch (err) {
    console.error('game access update failed', err);
    res.status(500).json({ error: 'Failed to update game access' });
  }
});

router.post('/users/:id/gift-subscription', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan, days, note } = (req.body ?? {}) as { plan?: string; days?: number; note?: string };
    if (!plan) return res.status(400).json({ error: 'plan is required' });

    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + (days ?? 30));

    const subscription = await prisma.subscription.upsert({
      where: { userId: req.params.id },
      update: {
        plan: plan as any,
        status: 'ACTIVE',
        amount: 0,
        isGift: true,
        giftedByUserId: req.user!.id,
        giftNote: note ?? null,
        currentPeriodEnd: periodEnd,
      },
      create: {
        userId: req.params.id,
        plan: plan as any,
        status: 'ACTIVE',
        amount: 0,
        isGift: true,
        giftedByUserId: req.user!.id,
        giftNote: note ?? null,
        currentPeriodEnd: periodEnd,
      },
    });

    await logAction(req.user!.id, 'GIFT_SUBSCRIPTION', { targetUserId: req.params.id, plan, days, note });
    res.json(subscription);
  } catch (err) {
    console.error('gift subscription failed', err);
    res.status(500).json({ error: 'Failed to gift subscription' });
  }
});

router.get('/subscriptions', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search = '', status, plan, page = '1', pageSize = '20' } = req.query as Record<string, string>;
    const take = Math.min(parseInt(pageSize, 10) || 20, 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

    const where: any = {
      AND: [
        status ? { status } : {},
        plan ? { plan } : {},
        search ? { user: { email: { contains: search, mode: 'insensitive' } } } : {},
      ],
    };

    const [total, subscriptions] = await Promise.all([
      prisma.subscription.count({ where }),
      prisma.subscription.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, role: true, isBlocked: true } }, giftedBy: { select: { email: true } } },
      }),
    ]);

    res.json({ total, page: Number(page), pageSize: take, subscriptions });
  } catch (err) {
    console.error('GET /admin/subscriptions failed', err);
    res.status(500).json({ error: 'Failed to load subscriptions' });
  }
});

router.post('/subscriptions/bulk', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids, action } = (req.body ?? {}) as { ids?: string[]; action?: 'approve' | 'reject' };
    if (!ids?.length || !action) return res.status(400).json({ error: 'ids and action are required' });

    const status = action === 'approve' ? 'ACTIVE' : 'CANCELLED';
    const result = await prisma.subscription.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });

    await logAction(req.user!.id, 'BULK_SUBSCRIPTION_ACTION', { ids, action });
    res.json({ updated: result.count });
  } catch (err) {
    console.error('bulk subscription action failed', err);
    res.status(500).json({ error: 'Failed to apply bulk action' });
  }
});

router.get('/revenue-summary', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const paid = await prisma.subscription.findMany({
      where: { isGift: false, status: 'ACTIVE', amount: { not: null } },
      select: { plan: true, amount: true, createdAt: true },
    });

    const totalRevenue = paid.reduce((sum, s) => sum + (s.amount ?? 0), 0);
    const byPlan: Record<string, { count: number; revenue: number }> = {};
    for (const s of paid) {
      const key = s.plan as string;
      byPlan[key] = byPlan[key] ?? { count: 0, revenue: 0 };
      byPlan[key].count += 1;
      byPlan[key].revenue += s.amount ?? 0;
    }

    const giftedCount = await prisma.subscription.count({ where: { isGift: true } });

    res.json({ totalRevenue, activePaidCount: paid.length, giftedCount, byPlan });
  } catch (err) {
    console.error('revenue summary failed', err);
    res.status(500).json({ error: 'Failed to compute revenue summary' });
  }
});

router.get('/audit-log', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', pageSize = '30', action } = req.query as Record<string, string>;
    const take = Math.min(parseInt(pageSize, 10) || 30, 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

    const where: any = action ? { action } : {};
    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, role: true } } },
      }),
    ]);

    res.json({ total, page: Number(page), pageSize: take, logs });
  } catch (err) {
    console.error('audit log fetch failed', err);
    res.status(500).json({ error: 'Failed to load audit log' });
  }
});

router.get('/export/subscriptions.csv', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subs = await prisma.subscription.findMany({
      include: { user: { select: { email: true, role: true } }, giftedBy: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const header = ['Email', 'Role', 'Plan', 'Status', 'Amount', 'IsGift', 'GiftedBy', 'TransactionRef', 'PeriodEnd', 'CreatedAt'];
    const rows = subs.map((s) => [
      s.user.email,
      s.user.role,
      s.plan,
      s.status,
      s.amount ?? '',
      s.isGift ? 'YES' : 'NO',
      s.giftedBy?.email ?? '',
      s.transactionRef ?? '',
      s.currentPeriodEnd?.toISOString() ?? '',
      s.createdAt.toISOString(),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    await logAction(req.user!.id, 'EXPORT_SUBSCRIPTIONS_CSV', { count: subs.length });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscriptions.csv"');
    res.send(csv);
  } catch (err) {
    console.error('csv export failed', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

router.post('/games', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { slug, title, domain, isFreeTier, entryPath, ageLabel, skills, kind } = req.body ?? {};
    if (!slug || !title || !domain || !entryPath) {
      return res.status(400).json({ error: 'slug, title, domain, entryPath are required' });
    }
    const game = await prisma.game.create({
      data: { slug, title, domain, isFreeTier: Boolean(isFreeTier), entryPath, ageLabel, skills: skills ?? [], kind: kind ?? 'game' },
    });
    await logAction(req.user!.id, 'CREATE_GAME', { gameId: game.id, slug });
    res.status(201).json(game);
  } catch (err) {
    console.error('create game failed', err);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

router.delete('/games/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const attemptCount = await prisma.gameAttempt.count({ where: { gameId: req.params.id } });
    if (attemptCount > 0) {
      const game = await prisma.game.update({ where: { id: req.params.id }, data: { isActive: false } });
      await logAction(req.user!.id, 'SOFT_DELETE_GAME', { gameId: game.id, reason: 'has_attempt_history' });
      return res.json({ softDeleted: true, game });
    }
    await prisma.game.delete({ where: { id: req.params.id } });
    await logAction(req.user!.id, 'DELETE_GAME', { gameId: req.params.id });
    res.json({ deleted: true });
  } catch (err) {
    console.error('delete game failed', err);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

export default router;
