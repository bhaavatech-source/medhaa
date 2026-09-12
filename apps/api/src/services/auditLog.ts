// Shared helper for recording admin/user actions into the AuditLog table.
// Failures here must never break the calling request, so we swallow and log.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logAudit(userId: string, action: string, metadata?: Record<string, any>) {
  try {
    const data: { userId: string; action: string; metadata?: Record<string, any> } = { userId, action };
    if (metadata) data.metadata = metadata;
    await prisma.auditLog.create({ data });
  } catch (err) {
    console.error('[audit] failed to record log entry', action, err);
  }
}
