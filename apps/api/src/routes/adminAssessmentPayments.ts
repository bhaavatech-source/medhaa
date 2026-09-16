// Protected admin actions for manual cognitive-assessment payment verification.

import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../services/auditLog';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate, requireRole(['admin']));

// PATCH /admin-assessment/cognitive/:id/verify-payment
router.patch('/cognitive/:id/verify-payment', async (req: AuthenticatedRequest, res: Response) => {
  const id = String(req.params.id);

  try {
    const record = await prisma.cognitiveAssessmentResult.findUnique({ where: { id } });
    if (!record) {
      res.status(404).json({ error: 'Assessment record not found' });
      return;
    }

    const current = record.paymentReference && typeof record.paymentReference === 'object' && !Array.isArray(record.paymentReference)
      ? record.paymentReference as Record<string, unknown>
      : {};

    const updatedPaymentReference = {
      ...current,
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString(),
      verifiedBy: req.user!.id,
    };

    const updated = await prisma.cognitiveAssessmentResult.update({
      where: { id },
      data: {
        paymentReference: updatedPaymentReference,
        resultLevel: 'full',
      },
    });

    await logAudit(req.user!.id, 'cognitive_assessment.payment_verified', {
      assessmentId: id,
      participantName: record.participantName,
      paymentReference: current.reference ?? current.utr ?? current.UTR ?? null,
    });

    res.json({
      id: updated.id,
      paymentStatus: 'VERIFIED',
      resultLevel: 'full',
    });
  } catch {
    res.status(500).json({ error: 'Unable to verify payment' });
  }
});

// PATCH /admin-assessment/cognitive/:id/reject-payment
router.patch('/cognitive/:id/reject-payment', async (req: AuthenticatedRequest, res: Response) => {
  const id = String(req.params.id);
  const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';

  try {
    const record = await prisma.cognitiveAssessmentResult.findUnique({ where: { id } });
    if (!record) {
      res.status(404).json({ error: 'Assessment record not found' });
      return;
    }

    const current = record.paymentReference && typeof record.paymentReference === 'object' && !Array.isArray(record.paymentReference)
      ? record.paymentReference as Record<string, unknown>
      : {};

    const updatedPaymentReference = {
      ...current,
      status: 'REJECTED',
      rejectedAt: new Date().toISOString(),
      rejectedBy: req.user!.id,
      ...(reason ? { rejectionReason: reason } : {}),
    };

    const updated = await prisma.cognitiveAssessmentResult.update({
      where: { id },
      data: {
        paymentReference: updatedPaymentReference,
        resultLevel: 'pending',
      },
    });

    await logAudit(req.user!.id, 'cognitive_assessment.payment_rejected', {
      assessmentId: id,
      participantName: record.participantName,
      paymentReference: current.reference ?? current.utr ?? current.UTR ?? null,
      reason: reason || null,
    });

    res.json({
      id: updated.id,
      paymentStatus: 'REJECTED',
      resultLevel: 'pending',
    });
  } catch {
    res.status(500).json({ error: 'Unable to reject payment' });
  }
});

export default router;
