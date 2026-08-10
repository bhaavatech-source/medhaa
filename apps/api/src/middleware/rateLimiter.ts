// apps/api/src/middleware/rateLimiter.ts
// Basic sliding-window rate limiter backed by an in-memory store for
// single-node deployments. Swap the store for Redis when scaling out.

import { Request, Response, NextFunction } from 'express';

interface WindowEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowEntry>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 100; // per window per key

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    next();
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests, please slow down' });
    return;
  }

  entry.count += 1;
  next();
};
