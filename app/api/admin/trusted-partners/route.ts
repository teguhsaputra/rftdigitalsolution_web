import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requiredImageRefSchema } from '@/lib/image-ref';

const createSchema = z.object({
  name: z.string().min(1),
  imageUrl: requiredImageRefSchema,
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
  const items = await prisma.trustedPartner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  try {
    const data = createSchema.parse(await req.json());
    const row = await prisma.trustedPartner.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
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
