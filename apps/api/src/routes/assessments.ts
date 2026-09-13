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
// session. Best-effort from the page's point of view (fire-and-forget).
router.post('/cognitive', rateLimiter, async (req: Request, res: Response) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;

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
      paymentReference: data.resultUnlock ?? undefined,
      ipAddress: req.ip,
    },
  });

  res.status(201).json({ id: record.id });
});

const patchSchema = z.object({
  paymentReference: z.any().optional(),
  resultLevel: z.string().optional(),
});

// PATCH /assessments/cognitive/:id — attaches the payment/result-unlock
// reference submitted after the participant has already seen their score.
router.patch('/cognitive/:id', rateLimiter, async (req: Request, res: Response) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const record = await prisma.cognitiveAssessmentResult.update({
      where: { id: req.params.id as string },
      data: {
        paymentReference: parsed.data.paymentReference ?? undefined,
        resultLevel: parsed.data.resultLevel ?? undefined,
      },
    });
    res.json({ id: record.id });
  } catch {
    res.status(404).json({ error: 'Assessment record not found' });
  }
});

export default router;
