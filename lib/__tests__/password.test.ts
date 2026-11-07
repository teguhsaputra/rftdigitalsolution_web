import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, passwordProblem } from '@/lib/password';

describe('password hashing', () => {
  it('verifies the right password and rejects a wrong one', async () => {
    const stored = await hashPassword('rahasia-yang-panjang');
    expect(stored).toMatch(/^scrypt\$/);
    expect(stored).not.toContain('rahasia-yang-panjang');
    expect(await verifyPassword('rahasia-yang-panjang', stored)).toBe(true);
    expect(await verifyPassword('rahasia-yang-salah', stored)).toBe(false);
  });

  it('uses a random salt (same password → different hashes)', async () => {
    expect(await hashPassword('sama-sama-panjang')).not.toBe(await hashPassword('sama-sama-panjang'));
  });

  it('treats malformed stored hashes as a non-match instead of throwing', async () => {
    expect(await verifyPassword('apa saja', 'bukan-hash')).toBe(false);
    expect(await verifyPassword('apa saja', '')).toBe(false);
  });
});

describe('passwordProblem', () => {
  it('requires at least 10 characters', () => {
    expect(passwordProblem('pendek')).toBe('Password minimal 10 karakter');
    expect(passwordProblem('cukup-panjang-1')).toBeNull();
  });
});
