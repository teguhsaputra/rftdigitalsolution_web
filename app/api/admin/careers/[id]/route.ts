import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  responsibilities: z.array(z.string()).optional(),
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
  const row = await prisma.careerOpening.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  try {
    const existing = await prisma.careerOpening.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = updateSchema.parse(await req.json());

    if (data.slug && data.slug !== existing.slug) {
      const clash = await prisma.careerOpening.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (clash) return NextResponse.json({ error: 'Slug sudah dipakai' }, { status: 400 });
    }

    const row = await prisma.careerOpening.update({
      where: { id },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.responsibilities !== undefined && { responsibilities: data.responsibilities }),
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
    await prisma.careerOpening.delete({ where: { id } });
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
