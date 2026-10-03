import { describe, expect, it, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { AccountDeletionError, deleteAccountData } from './accountDeletion';

function makePrismaMock(user: { id: string; email: string; passwordHash: string | null }, children = []) {
  const tx = {
    user: {
      findUnique: vi.fn().mockResolvedValue(user),
      deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    parent: {
      findUnique: vi.fn().mockResolvedValue({ id: 'parent-profile' }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    student: {
      findMany: vi.fn()
        .mockResolvedValueOnce(children)
        .mockResolvedValueOnce([{ id: 'owner-student' }, { id: 'managed-student' }]),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    gameAttempt: { deleteMany: vi.fn().mockResolvedValue({ count: 3 }) },
    studentAchievement: { deleteMany: vi.fn().mockResolvedValue({ count: 1 }) },
    coinTransaction: { deleteMany: vi.fn().mockResolvedValue({ count: 1 }) },
    cognitiveCheckIn: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
    auditLog: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
    passwordResetToken: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
    subscription: { deleteMany: vi.fn().mockResolvedValue({ count: 1 }) },
    parentConsent: { deleteMany: vi.fn().mockResolvedValue({ count: 1 }) },
    teacher: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
    admin: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
  };
  const prisma = {
    $transaction: vi.fn(async (work: (client: unknown) => Promise<unknown>) => work(tx)),
  };
  return { prisma: prisma as unknown as PrismaClient, tx };
}

describe('deleteAccountData', () => {
  it('deletes parent-created child accounts but only unlinks independently registered children', async () => {
    const childProfiles = [
      {
        id: 'managed-student',
        userId: 'managed-child',
        user: { email: 'child-123@children.medhaa.internal', passwordHash: null },
      },
      {
        id: 'independent-student',
        userId: 'independent-child',
        user: { email: 'child@example.com', passwordHash: 'hashed-password' },
      },
    ];
    const { prisma, tx } = makePrismaMock({
      id: 'parent-user',
      email: 'parent@example.com',
      passwordHash: 'hashed-password',
    }, childProfiles);

    const result = await deleteAccountData(prisma, 'parent-user');

    expect(result.deletedManagedChildProfiles).toBe(1);
    expect(tx.student.updateMany).toHaveBeenCalledWith({
      where: { parentId: 'parent-profile', userId: { notIn: ['managed-child'] } },
      data: { parentId: null },
    });
    expect(tx.gameAttempt.deleteMany).toHaveBeenCalledWith({
      where: { studentId: { in: ['owner-student', 'managed-student'] } },
    });
    expect(tx.user.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['parent-user', 'managed-child'] } },
    });
  });

  it('prevents a supervised child account from deleting itself', async () => {
    const { prisma, tx } = makePrismaMock({
      id: 'managed-child',
      email: 'child-123@children.medhaa.internal',
      passwordHash: null,
    });

    await expect(deleteAccountData(prisma, 'managed-child')).rejects.toMatchObject<AccountDeletionError>({
      code: 'MANAGED_CHILD_ACCOUNT',
    });
    expect(tx.user.deleteMany).not.toHaveBeenCalled();
  });
});