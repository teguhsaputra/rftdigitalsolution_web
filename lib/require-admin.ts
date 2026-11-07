import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { auth } from '@/auth';

/** Untuk route API admin: sesi admin yang valid, atau response 401/403 untuk dikembalikan. */
export async function requireAdminSession(): Promise<
  { session: Session; response?: never } | { session?: never; response: NextResponse }
> {
  const session = await auth();
  if (!session) return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (session.user.role !== 'admin') {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session };
}

/** Pesan error pertama dari ZodError dalam format JSON yang dipakai form admin. */
export function zodErrorResponse(issues: { message: string }[]) {
  return NextResponse.json({ error: issues[0]?.message ?? 'Data tidak valid', details: issues }, { status: 400 });
}
