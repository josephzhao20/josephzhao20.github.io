import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireUser, AuthError } from '@/lib/auth/roles';
import { resolveDisplayCoordinates } from '@/lib/geo/randomize';
import type { AdventureRow } from '@/lib/types/database.types';

const updateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  privacyMode: z.enum(['exact', 'region', 'country', 'hidden']).optional(),
  realLatitude: z.number().min(-90).max(90).optional(),
  realLongitude: z.number().min(-180).max(180).optional(),
  country: z.string().max(120).nullable().optional(),
  countryCode: z.string().max(4).nullable().optional(),
  region: z.string().max(120).nullable().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const profile = await requireUser();
    const body = updateSchema.parse(await request.json());

    const supabase = await createClient();
    const { data: existing, error: fetchError } = await supabase
      .from('adventures')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Adventure not found.' }, { status: 404 });
    }
    if (existing.user_id !== profile.id && !profile.is_admin) {
      return NextResponse.json({ error: 'Not your adventure.' }, { status: 403 });
    }

    const update: Partial<AdventureRow> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.description !== undefined) update.description = body.description;
    if (body.country !== undefined) update.country = body.country;
    if (body.countryCode !== undefined) update.country_code = body.countryCode?.toUpperCase() ?? null;
    if (body.region !== undefined) update.region = body.region;

    if (body.realLatitude !== undefined) update.real_latitude = body.realLatitude;
    if (body.realLongitude !== undefined) update.real_longitude = body.realLongitude;

    const privacyMode = body.privacyMode ?? existing.privacy_mode;
    const lat = body.realLatitude ?? existing.real_latitude;
    const lng = body.realLongitude ?? existing.real_longitude;
    const countryCode = body.countryCode ?? existing.country_code;

    if (body.privacyMode || body.realLatitude !== undefined || body.realLongitude !== undefined) {
      const display = resolveDisplayCoordinates(privacyMode, lat, lng, countryCode);
      update.privacy_mode = privacyMode;
      update.display_latitude = display?.latitude ?? null;
      update.display_longitude = display?.longitude ?? null;
    }

    const { error: updateError } = await supabase.from('adventures').update(update).eq('id', id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? 'Invalid input.' }, { status: 422 });
    }
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const profile = await requireUser();

    const supabase = await createClient();
    const { data: existing } = await supabase.from('adventures').select('user_id').eq('id', id).single();

    if (!existing) return NextResponse.json({ error: 'Adventure not found.' }, { status: 404 });
    if (existing.user_id !== profile.id && !profile.is_admin) {
      return NextResponse.json({ error: 'Not your adventure.' }, { status: 403 });
    }

    const { error } = await supabase.from('adventures').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
