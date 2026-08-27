// apps/api/src/routes/students.ts
// Parent-managed, no-login child profiles.
//
// SECURITY INVARIANT: a Parent's own id is ALWAYS derived server-side from
// their verified JWT (req.user!.id -> Parent.userId lookup). It is never
// accepted from the client. Every lookup below filters by that derived
// parent.id, and any student not owned by the caller returns the exact same
// 404 as a nonexistent student -- so there is no way to distinguish "does not
// exist" from "belongs to someone else" by probing IDs.

import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate, requireRole(['parent']));

function parseGradeLevel(grade: string): number | null {
  const match = grade.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

async function getOwnParentRecord(userId: string) {
  return prisma.parent.findUnique({ where: { userId } });
}

// POST /api/students/enroll -- create a no-login child profile under the
// authenticated parent. No email/password is ever created for the child.
router.post('/enroll', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { childName, age, grade } = (req.body ?? {}) as {
      childName?: string;
      age?: number | string;
      grade?: string;
    };

    if (!childName?.trim() || !grade?.trim()) {
      res.status(400).json({ error: 'childName and grade are required' });
      return;
    }

    const parent = await getOwnParentRecord(req.user!.id);
    if (!parent) {
      res.status(404).json({ error: 'Parent profile not found for this account' });
      return;
    }

    const student = await prisma.student.create({
      data: {
        fullName: childName.trim(),
        age: age ? Number(age) : null,
        gradeLevel: parseGradeLevel(grade),
        parentId: parent.id, // derived server-side above -- never from req.body
      },
    });

    res.status(201).json({ student });
  } catch (err) {
    console.error('student enroll failed', err);
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

// GET /api/students -- list only the authenticated parent's own children.
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parent = await getOwnParentRecord(req.user!.id);
    if (!parent) {
      res.json({ students: [] });
      return;
    }

    const students = await prisma.student.findMany({
      where: { parentId: parent.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ students });
  } catch (err) {
    console.error('list students failed', err);
    res.status(500).json({ error: 'Failed to load students' });
  }
});

// GET /api/students/:id -- fetch one child profile, only if it belongs to
// the authenticated parent. Returns 404 (not 403) on mismatch, deliberately,
// so an attacker probing IDs cannot tell "not yours" from "does not exist".
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parent = await getOwnParentRecord(req.user!.id);
    if (!parent) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student || student.parentId !== parent.id) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    res.json({ student });
  } catch (err) {
    console.error('get student failed', err);
    res.status(500).json({ error: 'Failed to load student' });
  }
});

export default router;
