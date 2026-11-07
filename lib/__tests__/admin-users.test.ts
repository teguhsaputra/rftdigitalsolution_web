import { describe, it, expect } from 'vitest';
import { createAdminSchema, updateAdminSchema, deactivationProblem } from '@/lib/admin-users';

describe('createAdminSchema', () => {
  it('accepts a valid new member and normalizes the email', () => {
    expect(createAdminSchema.parse({ name: ' Sinta ', email: ' Sinta@RFT.id ', password: 'password-awal-1' })).toEqual({
      name: 'Sinta',
      email: 'sinta@rft.id',
      password: 'password-awal-1',
    });
  });

  it('rejects short passwords and bad emails with Indonesian messages', () => {
    const r = createAdminSchema.safeParse({ name: 'A', email: 'bukan-email', password: 'pendek' });
    expect(r.success).toBe(false);
    const messages = r.error!.issues.map((i) => i.message);
    expect(messages).toContain('Email tidak valid');
    expect(messages).toContain('Password minimal 10 karakter');
  });
});

describe('updateAdminSchema', () => {
  it('allows toggling active or setting a new password', () => {
    expect(updateAdminSchema.parse({ active: false })).toEqual({ active: false });
    expect(updateAdminSchema.safeParse({ password: 'pendek' }).success).toBe(false);
  });
});

describe('deactivationProblem', () => {
  it('blocks deactivating yourself', () => {
    expect(deactivationProblem({ targetId: 'a', actorId: 'a', activeAdmins: 3 })).toBe(
      'Anda tidak bisa menonaktifkan akun sendiri'
    );
  });
  it('blocks deactivating the last active admin', () => {
    expect(deactivationProblem({ targetId: 'b', actorId: 'a', activeAdmins: 1 })).toBe(
      'Minimal harus ada satu admin aktif'
    );
  });
  it('allows deactivating another admin when others remain', () => {
    expect(deactivationProblem({ targetId: 'b', actorId: 'a', activeAdmins: 2 })).toBeNull();
  });
});
