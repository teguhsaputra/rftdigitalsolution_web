import { describe, it, expect, vi, beforeEach } from 'vitest';

const db = vi.hoisted(() => ({ findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { adminUser: db } }));

import { authenticateAdmin, refreshAdminToken, MAX_FAILED_LOGINS, LOCK_MINUTES } from '@/lib/admin-auth';
import { SESSION_MAX_AGE_SECONDS } from '@/lib/admin-auth-constants';
import { hashPassword } from '@/lib/password';

const now = new Date('2026-11-07T10:00:00Z');
const nowSec = Math.floor(now.getTime() / 1000);
const goodHash = hashPassword('password-benar-123');

async function user(overrides: Record<string, unknown> = {}) {
  return {
    id: 'u1',
    email: 'tim@rft.id',
    name: 'Tim RFT',
    role: 'admin',
    active: true,
    sessionVersion: 3,
    failedLoginCount: 0,
    lockedUntil: null,
    passwordHash: await goodHash,
    ...overrides,
  };
}

beforeEach(() => {
  db.findUnique.mockReset();
  db.update.mockReset().mockResolvedValue({});
  db.updateMany.mockReset().mockResolvedValue({ count: 1 });
});

describe('authenticateAdmin', () => {
  const claimWhere = { id: 'u1', OR: [{ lockedUntil: null }, { lockedUntil: { lte: now } }] };

  it('logs in with the right password (case-insensitive email) and resets the counter', async () => {
    db.findUnique.mockResolvedValueOnce(await user());
    db.update.mockResolvedValueOnce({ failedLoginCount: 1 }).mockResolvedValueOnce({});
    const r = await authenticateAdmin(' TIM@rft.id ', 'password-benar-123', now);
    expect(r).toEqual({
      ok: true,
      user: { id: 'u1', email: 'tim@rft.id', name: 'Tim RFT', role: 'admin', sessionVersion: 3 },
    });
    expect(db.findUnique).toHaveBeenCalledWith({ where: { email: 'tim@rft.id' } });
    expect(db.update).toHaveBeenLastCalledWith({
      where: { id: 'u1' },
      data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: now },
    });
  });

  it('claims each attempt atomically (increment + read in one statement) before checking the password', async () => {
    db.findUnique.mockResolvedValueOnce(await user());
    db.update.mockResolvedValueOnce({ failedLoginCount: 2 });
    expect(await authenticateAdmin('tim@rft.id', 'salah', now)).toEqual({ ok: false, reason: 'invalid' });
    expect(db.update).toHaveBeenCalledWith({
      where: claimWhere,
      data: { failedLoginCount: { increment: 1 } },
      select: { failedLoginCount: true },
    });
  });

  it(`locks for ${LOCK_MINUTES} minutes when the ${MAX_FAILED_LOGINS}th attempt fails`, async () => {
    db.findUnique.mockResolvedValueOnce(await user());
    db.update.mockResolvedValueOnce({ failedLoginCount: MAX_FAILED_LOGINS }).mockResolvedValueOnce({});
    expect(await authenticateAdmin('tim@rft.id', 'salah', now)).toEqual({ ok: false, reason: 'locked' });
    expect(db.update).toHaveBeenLastCalledWith({
      where: { id: 'u1' },
      data: { failedLoginCount: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) },
    });
  });

  it('never checks the password for attempts beyond the limit (parallel burst)', async () => {
    db.findUnique.mockResolvedValueOnce(await user());
    db.update.mockResolvedValueOnce({ failedLoginCount: MAX_FAILED_LOGINS + 3 });
    expect(await authenticateAdmin('tim@rft.id', 'password-benar-123', now)).toEqual({ ok: false, reason: 'locked' });
    expect(db.update).toHaveBeenCalledTimes(1);
  });

  it('refuses a locked account even with the right password (claim finds no row)', async () => {
    db.findUnique.mockResolvedValueOnce(await user({ lockedUntil: new Date(now.getTime() + 60_000) }));
    db.update.mockRejectedValueOnce(Object.assign(new Error('not found'), { code: 'P2025' }));
    expect(await authenticateAdmin('tim@rft.id', 'password-benar-123', now)).toEqual({ ok: false, reason: 'locked' });
    expect(db.update).toHaveBeenCalledTimes(1);
  });

  it('refuses unknown and deactivated accounts with the same generic answer', async () => {
    db.findUnique.mockResolvedValueOnce(null);
    expect(await authenticateAdmin('siapa@rft.id', 'x', now)).toEqual({ ok: false, reason: 'invalid' });
    db.findUnique.mockResolvedValueOnce(await user({ active: false }));
    expect(await authenticateAdmin('tim@rft.id', 'password-benar-123', now)).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects oversized passwords without touching the database', async () => {
    expect(await authenticateAdmin('tim@rft.id', 'x'.repeat(257), now)).toEqual({ ok: false, reason: 'invalid' });
    expect(db.findUnique).not.toHaveBeenCalled();
  });
});

describe('refreshAdminToken (every request with an existing session)', () => {
  const token = { sub: 'u1', role: 'admin', name: 'Lama', sv: 3, loginAt: nowSec - 60 };

  it('ends the session when the account was deactivated or deleted', async () => {
    db.findUnique.mockResolvedValueOnce({ active: false, role: 'admin', name: 'X', sessionVersion: 3 });
    expect(await refreshAdminToken(token, now)).toBeNull();
    db.findUnique.mockResolvedValueOnce(null);
    expect(await refreshAdminToken(token, now)).toBeNull();
  });

  it('ends the session after a password change/reset (session version moved on)', async () => {
    db.findUnique.mockResolvedValueOnce({ active: true, role: 'admin', name: 'X', sessionVersion: 4 });
    expect(await refreshAdminToken(token, now)).toBeNull();
  });

  it('ends the session after the absolute maximum age, even if used continuously', async () => {
    expect(await refreshAdminToken({ ...token, loginAt: nowSec - SESSION_MAX_AGE_SECONDS - 1 }, now)).toBeNull();
    expect(await refreshAdminToken({ ...token, loginAt: undefined }, now)).toBeNull();
  });

  it('keeps a valid session and picks up a renamed account', async () => {
    db.findUnique.mockResolvedValueOnce({ active: true, role: 'admin', name: 'Nama Baru', sessionVersion: 3 });
    expect(await refreshAdminToken(token, now)).toEqual({ ...token, name: 'Nama Baru' });
  });

  it('keeps the session if the database is briefly unreachable', async () => {
    db.findUnique.mockRejectedValueOnce(new Error('db down'));
    expect(await refreshAdminToken(token, now)).toEqual(token);
  });
});
