import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, AuthError } from '@/lib/auth/roles';
import { createAdminClient } from '@/lib/supabase/server';

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  category: z.enum(['book', 'shirt', 'hoodie', 'hat', 'tumbler']).optional(),
  price: z.number().min(0).nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  buy_url: z.string().url().nullable().optional(),
  in_stock: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

interface Params { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = updateSchema.parse(await request.json());
    const supabase = createAdminClient();
    const { error } = await supabase.from('merch_items').update(body).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0]?.message }, { status: 422 });
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from('merch_items').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
