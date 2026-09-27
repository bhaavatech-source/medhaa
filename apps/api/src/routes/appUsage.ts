import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import {
  appUsageEventSchema,
  endLiveAppSession,
  touchLiveAppSession,
  utcDayStart,
} from '../services/appUsage';

const prisma = new PrismaClient();
const router = Router();

const reportLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/aggregate', reportLimit, async (req: Request, res: Response) => {
  const parsed = appUsageEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid anonymous usage event' });
    return;
  }

  const event = parsed.data;
  const day = utcDayStart();
  const firstOpens = event.type === 'first_open' ? 1 : 0;
  const foregroundSessions = event.type === 'foreground_start' ? 1 : 0;
  const foregroundSeconds =
    event.type === 'foreground_heartbeat' || event.type === 'foreground_end' ? event.seconds : 0;

  if (event.type === 'foreground_start' || event.type === 'foreground_heartbeat') {
    touchLiveAppSession(event.liveSessionId);
  } else if (event.type === 'foreground_end') {
    endLiveAppSession(event.liveSessionId);
  }

  await prisma.appUsageDaily.upsert({
    where: { day },
    create: { day, firstOpens, foregroundSessions, foregroundSeconds },
    update: {
      firstOpens: { increment: firstOpens },
      foregroundSessions: { increment: foregroundSessions },
      foregroundSeconds: { increment: foregroundSeconds },
    },
  });

  res.status(204).end();
});

export default router;