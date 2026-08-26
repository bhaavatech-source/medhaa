import { Router, Response } from 'express';
import { PrismaClient, SubscriptionStatus, SubscriptionPlan } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

const PLAN_CATALOG = {
  MONTHLY_1: {
    name: 'Monthly — 1 Child',
    amountPaise: 14900,
    durationDays: 30,
    maxChildren: 1,
    description: 'Unlimited games, full progress reports, and IQ/EQ/SQ tracking for 1 child, for 30 days.',
  },
  MONTHLY_2: {
    name: 'Monthly — 2 Children',
    amountPaise: 22900,
    durationDays: 30,
    maxChildren: 2,
    description: 'Unlimited games, full progress reports, and IQ/EQ/SQ tracking for up to 2 children, for 30 days.',
  },
  YEARLY_1: {
    name: 'Yearly — 1 Child',
    amountPaise: 69900,
    durationDays: 365,
    maxChildren: 1,
    description: 'Unlimited games, full progress reports, and IQ/EQ/SQ tracking for 1 child, for a full year. Best value.',
  },
  YEARLY_2: {
    name: 'Yearly — 2 Children (Limited Offer)',
    amountPaise: 99900,
    durationDays: 365,
    maxChildren: 2,
    description: 'Unlimited games, full progress reports, and IQ/EQ/SQ tracking for up to 2 children, for a full year. Limited-time price.',
    limitedOffer: true,
  },
} as const;

type PlanId = keyof typeof PLAN_CATALOG;

const BENEFITS = [
  'Unlimited access to every game, no daily play limit',
  'Full IQ, EQ & SQ progress reports after every session',
  'Weekly brain-score tracking and trend charts',
  'Priority access to new games as they launch',
  'Downloadable report cards for school submission',
];

router.get('/plans', (_req, res: Response) => {
  const plans = Object.entries(PLAN_CATALOG).map(([id, details]) => ({ id, ...details }));
  res.json({ plans, benefits: BENEFITS, upiId: 'yespay.smessi10194393@yesbankltd' });
});

router.post('/initiate', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const role = String(req.user?.role || '').toUpperCase();

  if (role !== 'STUDENT' && role !== 'PARENT') {
    res.status(403).json({
      error:
        'Individual subscriptions are available for Student and Parent accounts. Teacher and School accounts require an institutional plan.',
      code: 'INSTITUTIONAL_PLAN_REQUIRED',
    });
    return;
  }

  const { planId } = req.body as { planId: string };
  const plan = planId as PlanId;

  if (!PLAN_CATALOG[plan]) {
    res.status(400).json({ error: 'Invalid plan selected' });
    return;
  }

  const details = PLAN_CATALOG[plan];

  const subscription = await prisma.subscription.upsert({
    where: { userId: req.user!.id },
    update: {
      plan: plan as SubscriptionPlan,
      status: SubscriptionStatus.PENDING,
      amount: details.amountPaise,
      paymentMethod: 'upi-manual',
    },
    create: {
      userId: req.user!.id,
      plan: plan as SubscriptionPlan,
      status: SubscriptionStatus.PENDING,
      amount: details.amountPaise,
      paymentMethod: 'upi-manual',
    },
  });

  res.json({
    subscriptionId: subscription.id,
    amount: details.amountPaise / 100,
    plan: details.name,
    upiId: 'yespay.smessi10194393@yesbankltd',
    upiLink: `upi://pay?pa=yespay.smessi10194393@yesbankltd&pn=Bhava%20Tech&am=${(details.amountPaise / 100).toFixed(2)}&cu=INR&tn=${encodeURIComponent(details.name)}`,
  });
});

router.post('/:id/submit-reference', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { transactionRef, notes } = req.body as { transactionRef: string; notes?: string };

  if (!transactionRef || transactionRef.trim().length < 4) {
    res.status(400).json({ error: 'Please enter a valid transaction reference ID' });
    return;
  }

  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription || subscription.userId !== req.user!.id) {
    res.status(404).json({ error: 'Subscription not found' });
    return;
  }

  const updated = await prisma.subscription.update({
    where: { id },
    data: {
      transactionRef: transactionRef.trim(),
      notes: notes?.trim() || null,
      status: SubscriptionStatus.PENDING,
    },
  });

  res.json({
    message: 'Reference submitted! Your subscription will be activated within a few hours after verification.',
    subscription: updated,
  });
});

router.post('/:id/confirm', authenticate, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { transactionRef } = req.body as { transactionRef?: string };

  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) {
    res.status(404).json({ error: 'Subscription not found' });
    return;
  }

  const details = PLAN_CATALOG[subscription.plan as PlanId];
  const currentPeriodEnd = details?.durationDays
    ? new Date(Date.now() + details.durationDays * 24 * 60 * 60 * 1000)
    : null;

  const updated = await prisma.subscription.update({
    where: { id },
    data: {
      status: SubscriptionStatus.ACTIVE,
      transactionRef,
      currentPeriodEnd,
    },
  });

  res.json({ subscription: updated });
});

router.post('/:id/reject', authenticate, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;

  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) {
    res.status(404).json({ error: 'Subscription not found' });
    return;
  }

  await prisma.subscription.delete({ where: { id } });

  res.json({ message: 'Subscription request rejected and removed.' });
});

router.post('/:id/disable', authenticate, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;

  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) {
    res.status(404).json({ error: 'Subscription not found' });
    return;
  }

  const updated = await prisma.subscription.update({
    where: { id },
    data: { currentPeriodEnd: new Date() },
  });

  res.json({ message: 'Subscription disabled.', subscription: updated });
});

router.get('/', authenticate, requireRole(['admin']), async (_req: AuthenticatedRequest, res: Response) => {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  res.json({ subscriptions });
});

router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user!.id },
  });
  res.json({ subscription: subscription ?? null });
});

export default router;
