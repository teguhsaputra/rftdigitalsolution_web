import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requiredImageRefSchema } from '@/lib/image-ref';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  imageUrl: requiredImageRefSchema.optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

type RouteProps = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

export async function GET(_req: NextRequest, { params }: RouteProps) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const row = await prisma.trustedPartner.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  try {
    const existing = await prisma.trustedPartner.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = updateSchema.parse(await req.json());

    const row = await prisma.trustedPartner.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });
    revalidatePath('/');
    return NextResponse.json(row);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: e.issues }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteProps) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  try {
    await prisma.trustedPartner.delete({ where: { id } });
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
