import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/consent - records the authenticated user's consent for processing their child's data
router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const parentId = req.user!.id;
    const { policyVersion } = req.body;

    if (!policyVersion) {
      return res.status(400).json({ success: false, error: "policyVersion is required" });
    }

    const record = await prisma.parentConsent.create({
      data: {
        parentId,
        policyVersion,
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, consentId: record.id });
  } catch (err) {
    console.error("Failed to record parent consent:", err);
    res.status(500).json({ success: false, error: "Failed to record consent" });
  }
});

// GET /api/consent/me - checks whether the authenticated user has an active consent record
router.get("/me", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const record = await prisma.parentConsent.findFirst({
      where: { parentId: req.user!.id },
      orderBy: { consentedAt: "desc" },
    });

    res.json({ success: true, hasConsent: !!record, consent: record || null });
  } catch (err) {
    console.error("Failed to check parent consent:", err);
    res.status(500).json({ success: false, error: "Failed to check consent" });
  }
});

export default router;

