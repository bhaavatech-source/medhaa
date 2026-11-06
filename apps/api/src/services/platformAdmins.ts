import type { Role } from '@prisma/client';

export const PLATFORM_ADMIN_EMAILS = [
  'bhaavatech@gmail.com',
  'rajeswar342@gmail.com',
  'rajeswarbhandaru@gmail.com',
] as const;

export function isPlatformAdminEmail(email: string): boolean {
  return PLATFORM_ADMIN_EMAILS.some((address) => address === email.trim().toLowerCase());
}

export function resolveAccountRole(email: string, role: Role): Role {
  return isPlatformAdminEmail(email) ? 'ADMIN' : role;
}
