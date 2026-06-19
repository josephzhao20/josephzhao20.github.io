import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin, AuthError } from '@/lib/auth/roles';

const schema = z.object({ userId: z.string().uuid() });

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { userId } = schema.parse(await request.json());
    const revoke = request.nextUrl.searchParams.get('revoke') === '1';

    const admin = createAdminClient();
    const { error } = await admin
      .from('users')
      .update({ upload_approved: !revoke, upload_requested: false })
      .eq('id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 422 });
    }
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
