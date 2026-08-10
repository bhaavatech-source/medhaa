import { Router, Response } from 'express';
import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

const PLAN_CATALOG: Record<
  Exclude<SubscriptionPlan, 'FREE'>,
  { name: string; amountPaise: number; durationDays: number | null; description: string }
> = {
  PLUS: { name: 'Plus', amountPaise: 29900, durationDays: 30, description: 'Access to Plus-tier premium games' },
  PREMIUM: { name: 'Premium', amountPaise: 49900, durationDays: 30, description: 'Access to all 21 premium games' },
  FAMILY: { name: 'Family', amountPaise: 89900, durationDays: 30, description: 'Up to 4 student profiles, full premium access' },
  SCHOOL: { name: 'School', amountPaise: 0, durationDays: 365, description: 'Bulk licensing for schools — contact sales' },
  INSTITUTION: { name: 'Institution', amountPaise: 0, durationDays: 365, description: 'Custom institutional licensing — contact sales' },
  LIFETIME: { name: 'Lifetime', amountPaise: 499900, durationDays: null, description: 'One-time payment, lifetime premium access' },
};

router.get('/plans', (_req, res: Response) => {
  const plans = Object.entries(PLAN_CATALOG).map(([id, details]) => ({ id, ...details }));
  res.json({ plans });
});

router.post('/initiate', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { planId } = req.body as { planId: string };
  const plan = planId as keyof typeof PLAN_CATALOG;

  if (!PLAN_CATALOG[plan]) {
    res.status(400).json({ error: 'Invalid plan selected' });
    return;
  }

  const details = PLAN_CATALOG[plan];

  const subscription = await prisma.subscription.upsert({
    where: { userId: req.user!.id },
    update: {
      plan: plan as SubscriptionPlan,
      status: SubscriptionStatus.TRIALING,
      amount: details.amountPaise,
      paymentMethod: 'upi',
    },
    create: {
      userId: req.user!.id,
      plan: plan as SubscriptionPlan,
      status: SubscriptionStatus.TRIALING,
      amount: details.amountPaise,
      paymentMethod: 'upi',
    },
  });

  const upiId = process.env.MEDHAA_UPI_ID || 'medhaa@upi';
  const upiLink = `upi://pay?pa=${upiId}&pn=MEDHAA&am=${(details.amountPaise / 100).toFixed(2)}&tn=${encodeURIComponent(
    `MEDHAA ${details.name} - ${subscription.id}`
  )}&cu=INR`;

  const whatsappNumber = process.env.MEDHAA_WHATSAPP_NUMBER || '919999999999';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I'd like to subscribe to the ${details.name} plan on MEDHAA. My subscription ID is ${subscription.id}.`
  )}`;

  res.json({
    subscriptionId: subscription.id,
    upiLink,
    whatsappLink,
    amount: details.amountPaise / 100,
    plan: details.name,
  });
});

router.post('/:id/confirm', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { transactionRef } = req.body as { transactionRef?: string };

  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription || subscription.userId !== req.user!.id) {
    res.status(404).json({ error: 'Subscription not found' });
    return;
  }

  const details = PLAN_CATALOG[subscription.plan as keyof typeof PLAN_CATALOG];
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

router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user!.id },
  });
  res.json({ subscription: subscription ?? null });
});

export default router;