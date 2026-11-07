import { describe, it, expect, vi } from 'vitest';

const db = vi.hoisted(() => ({ findUnique: vi.fn(), update: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { adminUser: db } }));

import { authenticateAdmin, MAX_FAILED_LOGINS, LOCK_MINUTES } from '@/lib/admin-auth';
import { hashPassword } from '@/lib/password';

const now = new Date('2026-11-07T10:00:00Z');

async function user(overrides: Record<string, unknown> = {}) {
  return {
    id: 'u1',
    email: 'tim@rft.id',
    name: 'Tim RFT',
    role: 'admin',
    active: true,
    failedLoginCount: 0,
    lockedUntil: null,
    passwordHash: await hashPassword('password-benar-123'),
    ...overrides,
  };
}

describe('authenticateAdmin', () => {
  it('logs in with the right password, case-insensitive email, and resets the failure counter', async () => {
    db.findUnique.mockResolvedValueOnce(await user({ failedLoginCount: 2 }));
    db.update.mockResolvedValueOnce({});
    const r = await authenticateAdmin(' TIM@rft.id ', 'password-benar-123', now);
    expect(r).toEqual({ ok: true, user: { id: 'u1', email: 'tim@rft.id', name: 'Tim RFT', role: 'admin' } });
    expect(db.findUnique).toHaveBeenCalledWith({ where: { email: 'tim@rft.id' } });
    expect(db.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: now },
    });
  });

  it('rejects a wrong password and counts the failure', async () => {
    db.findUnique.mockResolvedValueOnce(await user({ failedLoginCount: 1 }));
    db.update.mockResolvedValueOnce({});
    expect(await authenticateAdmin('tim@rft.id', 'salah', now)).toEqual({ ok: false, reason: 'invalid' });
    expect(db.update).toHaveBeenCalledWith({ where: { id: 'u1' }, data: { failedLoginCount: 2 } });
  });

  it(`locks the account for ${LOCK_MINUTES} minutes after ${MAX_FAILED_LOGINS} failures`, async () => {
    db.findUnique.mockResolvedValueOnce(await user({ failedLoginCount: MAX_FAILED_LOGINS - 1 }));
    db.update.mockResolvedValueOnce({});
    expect(await authenticateAdmin('tim@rft.id', 'salah', now)).toEqual({ ok: false, reason: 'locked' });
    expect(db.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { failedLoginCount: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) },
    });
  });

  it('refuses a locked account even with the right password', async () => {
    db.findUnique.mockResolvedValueOnce(await user({ lockedUntil: new Date(now.getTime() + 60_000) }));
    expect(await authenticateAdmin('tim@rft.id', 'password-benar-123', now)).toEqual({ ok: false, reason: 'locked' });
  });

  it('refuses unknown and deactivated accounts with the same generic answer', async () => {
    db.findUnique.mockResolvedValueOnce(null);
    expect(await authenticateAdmin('siapa@rft.id', 'x', now)).toEqual({ ok: false, reason: 'invalid' });
    db.findUnique.mockResolvedValueOnce(await user({ active: false }));
    expect(await authenticateAdmin('tim@rft.id', 'password-benar-123', now)).toEqual({ ok: false, reason: 'invalid' });
  });
});

import { refreshAdminToken } from '@/lib/admin-auth';

describe('refreshAdminToken (every request with an existing session)', () => {
  it('ends the session when the account was deactivated or deleted', async () => {
    db.findUnique.mockResolvedValueOnce({ active: false, role: 'admin', name: 'X' });
    expect(await refreshAdminToken({ sub: 'u1', role: 'admin' })).toBeNull();
    db.findUnique.mockResolvedValueOnce(null);
    expect(await refreshAdminToken({ sub: 'u1', role: 'admin' })).toBeNull();
  });

  it('keeps the session and picks up a renamed account', async () => {
    db.findUnique.mockResolvedValueOnce({ active: true, role: 'admin', name: 'Nama Baru' });
    expect(await refreshAdminToken({ sub: 'u1', role: 'admin', name: 'Lama' })).toEqual({
      sub: 'u1',
      role: 'admin',
      name: 'Nama Baru',
    });
  });

  it('keeps the session if the database is briefly unreachable', async () => {
    db.findUnique.mockRejectedValueOnce(new Error('db down'));
    expect(await refreshAdminToken({ sub: 'u1', role: 'admin' })).toEqual({ sub: 'u1', role: 'admin' });
  });
});
