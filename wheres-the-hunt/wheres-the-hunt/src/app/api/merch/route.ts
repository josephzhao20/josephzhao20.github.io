import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, AuthError } from '@/lib/auth/roles';
import { createAdminClient } from '@/lib/supabase/server';

const merchSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).nullable().optional(),
  category: z.enum(['book', 'shirt', 'hoodie', 'hat', 'tumbler']),
  price: z.number().min(0).nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  buy_url: z.string().url().nullable().optional(),
  in_stock: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = merchSchema.parse(await request.json());
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('merch_items').insert(body).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0]?.message }, { status: 422 });
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
