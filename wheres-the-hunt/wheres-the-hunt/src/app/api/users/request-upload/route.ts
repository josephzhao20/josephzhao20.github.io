import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser, AuthError } from '@/lib/auth/roles';

export async function POST() {
  try {
    const profile = await requireUser();
    const supabase = await createClient();

    const { error } = await supabase
      .from('users')
      .update({ upload_requested: true })
      .eq('id', profile.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
