import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { priceFromSchema } from '@/lib/format';

const updateSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  titleEn: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  details: z.array(z.string()).optional(),
  priceFrom: priceFromSchema.optional(),
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
  const row = await prisma.service.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  try {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = updateSchema.parse(await req.json());

    if (data.slug && data.slug !== existing.slug) {
      const clash = await prisma.service.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (clash) return NextResponse.json({ error: 'Slug sudah dipakai' }, { status: 400 });
    }

    const row = await prisma.service.update({
      where: { id },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.details !== undefined && { details: data.details }),
        ...(data.priceFrom !== undefined && { priceFrom: data.priceFrom }),
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
    await prisma.service.delete({ where: { id } });
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
