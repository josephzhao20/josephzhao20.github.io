import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin, AuthError } from '@/lib/auth/roles';

const schema = z.object({ adventureId: z.string().uuid(), feature: z.boolean() });

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { adventureId, feature } = schema.parse(await request.json());

    const admin = createAdminClient();
    const { error } = await admin
      .from('adventures')
      .update({ is_featured: feature, featured_at: feature ? new Date().toISOString() : null })
      .eq('id', adventureId);

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
