import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { normalizeEmail } from '@/lib/admin-auth-email';

import { LOCK_MINUTES, MAX_FAILED_LOGINS } from '@/lib/admin-auth-constants';

export { LOCK_MINUTES, MAX_FAILED_LOGINS };

export type AdminIdentity = { id: string; email: string; name: string; role: string };
export type AuthResult = { ok: true; user: AdminIdentity } | { ok: false; reason: 'invalid' | 'locked' };

export { normalizeEmail };

// Hash dummy supaya waktu respons untuk email yang tidak ada mirip dengan email yang ada.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword('dummy-password-for-timing'));

/** Cek email + password admin, dengan penguncian sementara setelah beberapa kali gagal. */
export async function authenticateAdmin(
  email: string,
  password: string,
  now: Date = new Date()
): Promise<AuthResult> {
  const user = await prisma.adminUser.findUnique({ where: { email: normalizeEmail(email) } });

  if (!user || !user.active) {
    await verifyPassword(password, await getDummyHash());
    return { ok: false, reason: 'invalid' };
  }
  if (user.lockedUntil && user.lockedUntil > now) {
    return { ok: false, reason: 'locked' };
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    const failures = user.failedLoginCount + 1;
    if (failures >= MAX_FAILED_LOGINS) {
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { failedLoginCount: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) },
      });
      return { ok: false, reason: 'locked' };
    }
    await prisma.adminUser.update({ where: { id: user.id }, data: { failedLoginCount: failures } });
    return { ok: false, reason: 'invalid' };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: now },
  });
  return { ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

type SessionToken = { sub?: string; role?: string; name?: string | null; [key: string]: unknown };

/**
 * Dipanggil di setiap request yang membawa sesi: akun yang dinonaktifkan/dihapus langsung keluar.
 * Bila database sedang tidak terjangkau, sesi dibiarkan (halaman admin tetap butuh DB untuk bekerja).
 */
export async function refreshAdminToken<T extends SessionToken>(token: T): Promise<T | null> {
  if (!token.sub) return null;
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: token.sub },
      select: { active: true, role: true, name: true },
    });
    if (!user || !user.active) return null;
    return { ...token, role: user.role, name: user.name };
  } catch {
    return token;
  }
}
