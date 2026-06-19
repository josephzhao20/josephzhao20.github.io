import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin, AuthError } from '@/lib/auth/roles';

const schema = z.object({ userId: z.string().uuid() });

export async function POST(request: NextRequest) {
  try {
    const admin_ = await requireAdmin();
    const { userId } = schema.parse(await request.json());
    const lift = request.nextUrl.searchParams.get('lift') === '1';

    if (userId === admin_.id && !lift) {
      return NextResponse.json({ error: "You can't suspend yourself." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin.from('users').update({ suspended: !lift }).eq('id', userId);

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
