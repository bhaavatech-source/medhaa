import { PrismaClient } from '@prisma/client';

export class AccountDeletionError extends Error {
  constructor(public readonly code: 'ACCOUNT_NOT_FOUND' | 'MANAGED_CHILD_ACCOUNT') {
    super(code);
  }
}

export async function deleteAccountData(prisma: PrismaClient, userId: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!user) throw new AccountDeletionError('ACCOUNT_NOT_FOUND');
    if (user.email.endsWith('@children.medhaa.internal') && !user.passwordHash) {
      throw new AccountDeletionError('MANAGED_CHILD_ACCOUNT');
    }

    const parent = await tx.parent.findUnique({ where: { userId }, select: { id: true } });
    const linkedChildren = parent
      ? await tx.student.findMany({
          where: { parentId: parent.id },
          select: {
            id: true,
            userId: true,
            user: { select: { email: true, passwordHash: true } },
          },
        })
      : [];
    const managedChildren = linkedChildren.filter(
      (child) => child.user.email.endsWith('@children.medhaa.internal') && !child.user.passwordHash,
    );
    const managedChildUserIds = managedChildren.map((child) => child.userId);
    const userIds = [userId, ...managedChildUserIds];

    if (parent) {
      await tx.student.updateMany({
        where: { parentId: parent.id, userId: { notIn: managedChildUserIds } },
        data: { parentId: null },
      });
    }

    const ownedStudents = await tx.student.findMany({
      where: { userId: { in: userIds } },
      select: { id: true },
    });
    const studentIds = [...new Set([
      ...ownedStudents.map((student) => student.id),
      ...managedChildren.map((child) => child.id),
    ])];

    if (studentIds.length) {
      await tx.gameAttempt.deleteMany({ where: { studentId: { in: studentIds } } });
      await tx.studentAchievement.deleteMany({ where: { studentId: { in: studentIds } } });
      await tx.coinTransaction.deleteMany({ where: { studentId: { in: studentIds } } });
      await tx.student.deleteMany({ where: { id: { in: studentIds } } });
    }

    await tx.cognitiveCheckIn.deleteMany({ where: { studentId: { in: userIds } } });
    await tx.auditLog.deleteMany({ where: { userId: { in: userIds } } });
    await tx.passwordResetToken.deleteMany({ where: { userId: { in: userIds } } });
    await tx.subscription.deleteMany({ where: { userId: { in: userIds } } });

    if (parent) {
      await tx.parentConsent.deleteMany({ where: { parentId: parent.id } });
    }

    await tx.parent.deleteMany({ where: { userId: { in: userIds } } });
    await tx.teacher.deleteMany({ where: { userId: { in: userIds } } });
    await tx.admin.deleteMany({ where: { userId: { in: userIds } } });
    await tx.user.deleteMany({ where: { id: { in: userIds } } });

    return { deletedManagedChildProfiles: managedChildren.length };
  });
}