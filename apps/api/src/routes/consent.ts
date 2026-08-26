import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// POST /api/consent - records a parent's consent for processing their child's data
// TODO: this currently trusts parentId from the request body, or falls back to
// req.user?.id if your auth middleware attaches the authenticated user there.
// Confirm this matches your actual middleware/auth.ts implementation and adjust if needed.
router.post("/", async (req, res) => {
  try {
    const parentId = req.body?.parentId || (req as any).user?.id;
    const { policyVersion } = req.body;

    if (!parentId || !policyVersion) {
      return res.status(400).json({ success: false, error: "parentId and policyVersion are required" });
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

// GET /api/consent/:parentId - checks whether a parent has an active consent record
router.get("/:parentId", async (req, res) => {
  try {
    const { parentId } = req.params;
    const record = await prisma.parentConsent.findFirst({
      where: { parentId },
      orderBy: { consentedAt: "desc" },
    });

    res.json({ success: true, hasConsent: !!record, consent: record || null });
  } catch (err) {
    console.error("Failed to check parent consent:", err);
    res.status(500).json({ success: false, error: "Failed to check consent" });
  }
});

export default router;
