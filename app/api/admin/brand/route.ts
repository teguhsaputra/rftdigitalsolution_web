import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getBrandFormValues, upsertBrandSettings } from '@/lib/brand-settings-db';
import { brandSettingsUpdateSchema } from '@/lib/brand-settings-schema';
import { z } from 'zod';

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
  return NextResponse.json(await getBrandFormValues());
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  try {
    const data = brandSettingsUpdateSchema.parse(await req.json());
    await upsertBrandSettings(data);
    // Logo & WA dipakai di layout publik dan halaman utama.
    revalidatePath('/', 'layout');
    return NextResponse.json(await getBrandFormValues());
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message ?? 'Invalid data', details: e.issues },
        { status: 400 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
