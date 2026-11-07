import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { changeOwnPasswordSchema } from '@/lib/admin-users';
import { requireAdminSession, zodErrorResponse } from '@/lib/require-admin';

export async function POST(req: NextRequest) {
  const { session, response } = await requireAdminSession();
  if (response) return response;
  try {
    const data = changeOwnPasswordSchema.parse(await req.json());
    const me = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
    if (!me || !(await verifyPassword(data.currentPassword, me.passwordHash))) {
      return NextResponse.json({ error: 'Password lama salah' }, { status: 400 });
    }
    await prisma.adminUser.update({
      where: { id: me.id },
      // sessionVersion naik → semua sesi (termasuk sesi ini) harus login ulang dengan password baru.
      data: { passwordHash: await hashPassword(data.newPassword), sessionVersion: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return zodErrorResponse(e.issues);
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
