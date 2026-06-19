import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser, AuthError } from '@/lib/auth/roles';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const profile = await requireUser();
    const supabase = await createClient();

    const { error } = await supabase
      .from('likes')
      .insert({ user_id: profile.id, adventure_id: id });

    // Unique constraint violation just means it's already liked — treat as success.
    if (error && error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ liked: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const profile = await requireUser();
    const supabase = await createClient();

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', profile.id)
      .eq('adventure_id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ liked: false });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
