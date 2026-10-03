import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { AccountDeletionError, deleteAccountData } from '../services/accountDeletion';

const prisma = new PrismaClient();
const router = Router();

router.delete('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await deleteAccountData(prisma, req.user!.id);
    res.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AccountDeletionError) {
      const status = error.code === 'ACCOUNT_NOT_FOUND' ? 404 : 403;
      res.status(status).json({ error: error.message });
      return;
    }

    console.error('Account deletion failed:', error);
    res.status(500).json({ error: 'We could not delete your account. Please contact support.' });
  }
});

export default router;