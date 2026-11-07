import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { adminPublicSelect, deactivationProblem, updateAdminSchema } from '@/lib/admin-users';
import { requireAdminSession, zodErrorResponse } from '@/lib/require-admin';

type RouteProps = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  const { session, response } = await requireAdminSession();
  if (response) return response;
  const { id } = await params;
  try {
    const data = updateAdminSchema.parse(await req.json());
    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });

    if (data.active === false && target.active) {
      const activeAdmins = await prisma.adminUser.count({ where: { active: true } });
      const problem = deactivationProblem({ targetId: id, actorId: session.user.id, activeAdmins });
      if (problem) return NextResponse.json({ error: problem }, { status: 400 });
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.active !== undefined && { active: data.active }),
        // Reset password sekaligus membuka kunci akun.
        ...(data.password !== undefined && {
          passwordHash: await hashPassword(data.password),
          failedLoginCount: 0,
          lockedUntil: null,
          // Keluarkan semua sesi lama akun ini.
          sessionVersion: { increment: 1 },
        }),
      },
      select: adminPublicSelect,
    });
    return NextResponse.json(user);
  } catch (e) {
    if (e instanceof z.ZodError) return zodErrorResponse(e.issues);
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
