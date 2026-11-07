import { z } from 'zod';
import { MIN_PASSWORD_LENGTH } from '@/lib/password';

const password = z.string().min(MIN_PASSWORD_LENGTH, `Password minimal ${MIN_PASSWORD_LENGTH} karakter`);

/** Body POST /api/admin/users */
export const createAdminSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi').max(100),
  email: z.string().trim().toLowerCase().email('Email tidak valid'),
  password,
});

/** Body PATCH /api/admin/users/[id] */
export const updateAdminSchema = z
  .object({
    name: z.string().trim().min(1, 'Nama wajib diisi').max(100).optional(),
    active: z.boolean().optional(),
    password: password.optional(),
  })
  .strict();

/** Body POST /api/admin/account/password */
export const changeOwnPasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama wajib diisi'),
  newPassword: password,
});

/** Alasan admin tidak boleh dinonaktifkan, atau null bila boleh. */
export function deactivationProblem(opts: {
  targetId: string;
  actorId: string;
  activeAdmins: number;
}): string | null {
  if (opts.targetId === opts.actorId) return 'Anda tidak bisa menonaktifkan akun sendiri';
  if (opts.activeAdmins <= 1) return 'Minimal harus ada satu admin aktif';
  return null;
}

/** Field yang aman dikirim ke browser (tanpa hash password). */
export const adminPublicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  lastLoginAt: true,
  lockedUntil: true,
  createdAt: true,
} as const;
