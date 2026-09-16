// apps/api/src/routes/assessments.ts
// Public endpoints for medhaa-cognitive-assessment.html — this tool collects
// its own participant details on the page itself and is taken without a
// Medhā login, so submissions are NOT tied to a User/Student row.

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { rateLimiter } from '../middleware/rateLimiter';

const prisma = new PrismaClient();
const router = Router();

const submitSchema = z.object({
  appVersion: z.string().optional(),
  status: z.string(),
  participant: z.object({
    name: z.string().trim().min(1),
    age: z.number().optional(),
    email: z.string().optional(),
    school: z.string().optional(),
    purpose: z.string().optional(),
    parent: z.string().optional(),
    relationship: z.string().optional(),
  }),
  overallScore: z.number().optional(),
  consentRecord: z.any().optional(),
  domainScores: z.any().optional(),
  rawModuleData: z.any().optional(),
  integrity: z.any().optional(),
  resultUnlock: z.any().optional(),
});

// POST /assessments/cognitive — records one completed/aborted assessment
// session. Payment access always starts as pending; the participant cannot
// unlock the detailed result by supplying a resultLevel in the request.
router.post('/cognitive', rateLimiter, async (req: Request, res: Response) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;

  const submittedPayment = data.resultUnlock && typeof data.resultUnlock === 'object'
    ? data.resultUnlock as Record<string, unknown>
    : {};

  const record = await prisma.cognitiveAssessmentResult.create({
    data: {
      appVersion: data.appVersion,
      status: data.status,
      participantName: data.participant.name,
      participantAge: data.participant.age,
      participantEmail: data.participant.email || null,
      participantSchool: data.participant.school || null,
      purpose: data.participant.purpose || null,
      parentName: data.participant.parent || null,
      relationship: data.participant.relationship || null,
      overallScore: data.overallScore,
      consentRecord: data.consentRecord ?? undefined,
      domainScores: data.domainScores ?? undefined,
      rawModuleData: data.rawModuleData ?? undefined,
      integrityEvents: data.integrity ?? undefined,
      paymentReference: Object.keys(submittedPayment).length > 0
        ? { ...submittedPayment, status: 'PENDING', submittedAt: new Date().toISOString() }
        : undefined,
      resultLevel: 'pending',
      ipAddress: req.ip,
    },
  });

  res.status(201).json({ id: record.id });
});

const patchSchema = z.object({
  paymentReference: z.any().optional(),
});

// PATCH /assessments/cognitive/:id — records the participant's payment
// reference. This endpoint deliberately cannot unlock the result. Unlocking
// is performed only by the protected admin verification endpoint.
router.patch('/cognitive/:id', rateLimiter, async (req: Request, res: Response) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const paymentReference = parsed.data.paymentReference;
    const normalizedReference = paymentReference && typeof paymentReference === 'object'
      ? { ...(paymentReference as Record<string, unknown>), status: 'PENDING', submittedAt: new Date().toISOString() }
      : paymentReference;

    const record = await prisma.cognitiveAssessmentResult.update({
      where: { id: req.params.id as string },
      data: {
        paymentReference: normalizedReference ?? undefined,
        resultLevel: 'pending',
      },
    });
    res.json({ id: record.id, paymentStatus: 'PENDING', resultLevel: 'pending' });
  } catch {
    res.status(404).json({ error: 'Assessment record not found' });
  }
});

// GET /assessments/cognitive/:id/access — intentionally returns only the
// payment/access state, not participant data or detailed cognitive results.
router.get('/cognitive/:id/access', rateLimiter, async (req: Request, res: Response) => {
  try {
    const record = await prisma.cognitiveAssessmentResult.findUnique({
      where: { id: req.params.id as string },
      select: { resultLevel: true, paymentReference: true },
    });
    if (!record) {
      res.status(404).json({ error: 'Assessment record not found' });
      return;
    }

    const payment = record.paymentReference && typeof record.paymentReference === 'object' && !Array.isArray(record.paymentReference)
      ? record.paymentReference as Record<string, unknown>
      : {};
    const status = typeof payment.status === 'string' ? payment.status : null;
    const verified = status === 'VERIFIED' || record.resultLevel === 'full';
    const rejected = status === 'REJECTED';

    res.json({
      paymentStatus: verified ? 'VERIFIED' : rejected ? 'REJECTED' : 'PENDING',
      resultLevel: verified ? 'full' : 'pending',
    });
  } catch {
    res.status(404).json({ error: 'Assessment record not found' });
  }
});

export default router;
