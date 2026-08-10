// apps/api/src/services/coinService.ts
// Handles all coin awards and spends as append-only ledger entries.
// Never issues randomized rewards — every award maps to a deterministic rule.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fixed, transparent reward table — no randomness, no gambling mechanics.
export const COIN_RULES = {
  daily_login: 10,
  game_completion: 15,
  score_improvement: 20,
  weekly_goal: 50,
  mission_completion: 30,
  article_read: 5,
  teacher_assignment_completion: 25,
  school_competition: 100,
} as const;

export type CoinReason = keyof typeof COIN_RULES;

// Awards coins to a student for a recognized, rule-based reason and
// records the transaction in the audit-friendly ledger.
export async function awardCoins(studentId: string, reason: CoinReason): Promise<number> {
  const amount = COIN_RULES[reason];

  const [, updatedStudent] = await prisma.$transaction([
    prisma.coinTransaction.create({
      data: { studentId, amount, reason },
    }),
    prisma.student.update({
      where: { id: studentId },
      data: { coins: { increment: amount } },
    }),
  ]);

  return updatedStudent.coins;
}

// Spends coins on an unlockable (theme, avatar, bonus content). Fails
// safely if the student does not have enough balance.
export async function spendCoins(
  studentId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.coins < amount) {
    return { success: false, error: 'Insufficient coin balance' };
  }

  const [, updatedStudent] = await prisma.$transaction([
    prisma.coinTransaction.create({
      data: { studentId, amount: -amount, reason },
    }),
    prisma.student.update({
      where: { id: studentId },
      data: { coins: { decrement: amount } },
    }),
  ]);

  return { success: true, newBalance: updatedStudent.coins };
}
