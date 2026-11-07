import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { adminPublicSelect, createAdminSchema } from '@/lib/admin-users';
import { requireAdminSession, zodErrorResponse } from '@/lib/require-admin';

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;
  const users = await prisma.adminUser.findMany({
    select: adminPublicSelect,
    orderBy: [{ active: 'desc' }, { name: 'asc' }],
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;
  try {
    const data = createAdminSchema.parse(await req.json());
    const existing = await prisma.adminUser.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    const user = await prisma.adminUser.create({
      data: { name: data.name, email: data.email, passwordHash: await hashPassword(data.password) },
      select: adminPublicSelect,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return zodErrorResponse(e.issues);
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
