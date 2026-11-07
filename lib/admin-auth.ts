import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { MAX_PASSWORD_LENGTH } from '@/lib/password-rules';
import { normalizeEmail } from '@/lib/admin-auth-email';
import { LOCK_MINUTES, MAX_FAILED_LOGINS, SESSION_MAX_AGE_SECONDS } from '@/lib/admin-auth-constants';

export { LOCK_MINUTES, MAX_FAILED_LOGINS, normalizeEmail };

export type AdminIdentity = { id: string; email: string; name: string; role: string; sessionVersion: number };
export type AuthResult = { ok: true; user: AdminIdentity } | { ok: false; reason: 'invalid' | 'locked' };

// Hash dummy supaya waktu respons untuk email yang tidak ada mirip dengan email yang ada.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword('dummy-password-for-timing'));

/** Cek email + password admin, dengan penguncian sementara setelah beberapa kali gagal. */
export async function authenticateAdmin(
  email: string,
  password: string,
  now: Date = new Date()
): Promise<AuthResult> {
  if (password.length > MAX_PASSWORD_LENGTH) return { ok: false, reason: 'invalid' };

  const user = await prisma.adminUser.findUnique({ where: { email: normalizeEmail(email) } });
  if (!user || !user.active) {
    await verifyPassword(password, await getDummyHash());
    return { ok: false, reason: 'invalid' };
  }

  // Klaim percobaan secara atomik (naikkan + baca dalam satu statement) SEBELUM cek password.
  // Request paralel mendapat nomor urut berbeda; nomor di atas batas tidak pernah dicek passwordnya.
  let attempt: number;
  try {
    const claimed = await prisma.adminUser.update({
      where: { id: user.id, OR: [{ lockedUntil: null }, { lockedUntil: { lte: now } }] },
      data: { failedLoginCount: { increment: 1 } },
      select: { failedLoginCount: true },
    });
    attempt = claimed.failedLoginCount;
  } catch (e) {
    // P2025 = tidak ada baris yang cocok → akun sedang terkunci.
    if ((e as { code?: string }).code === 'P2025') return { ok: false, reason: 'locked' };
    throw e;
  }
  if (attempt > MAX_FAILED_LOGINS) return { ok: false, reason: 'locked' };

  if (await verifyPassword(password, user.passwordHash)) {
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: now },
    });
    return {
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, sessionVersion: user.sessionVersion },
    };
  }

  if (attempt >= MAX_FAILED_LOGINS) {
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) },
    });
    return { ok: false, reason: 'locked' };
  }
  return { ok: false, reason: 'invalid' };
}

type SessionToken = {
  sub?: string;
  role?: string;
  name?: string | null;
  /** sessionVersion akun saat login */
  sv?: number;
  /** waktu login (detik epoch) */
  loginAt?: number;
  [key: string]: unknown;
};

/**
 * Dipanggil di setiap request yang membawa sesi. Sesi berakhir bila: akun dinonaktifkan/dihapus,
 * password diganti/direset (sessionVersion berubah), atau sudah lewat umur maksimal sejak login.
 * Bila database sedang tidak terjangkau, sesi dibiarkan (halaman admin tetap butuh DB untuk bekerja).
 */
export async function refreshAdminToken<T extends SessionToken>(token: T, now: Date = new Date()): Promise<T | null> {
  if (!token.sub || typeof token.sv !== 'number' || typeof token.loginAt !== 'number') return null;
  if (Math.floor(now.getTime() / 1000) - token.loginAt > SESSION_MAX_AGE_SECONDS) return null;
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: token.sub },
      select: { active: true, role: true, name: true, sessionVersion: true },
    });
    if (!user || !user.active || user.sessionVersion !== token.sv) return null;
    return { ...token, role: user.role, name: user.name };
  } catch {
    return token;
  }
}
