import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { imageRefSchema } from '@/lib/image-ref';

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  clientType: z.string().min(1),
  focus: z.string().min(1),
  description: z.string().min(1),
  image: z.union([imageRefSchema, z.null()]).optional(),
  services: z.array(z.string()),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const items = await prisma.portfolioProject.findMany({
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  try {
    const data = createSchema.parse(await req.json());
    const existing = await prisma.portfolioProject.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah dipakai' }, { status: 400 });
    }
    const row = await prisma.portfolioProject.create({
      data: {
        slug: data.slug,
        title: data.title,
        clientType: data.clientType,
        focus: data.focus,
        description: data.description,
        image: data.image && data.image !== '' ? data.image : null,
        services: data.services,
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
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
