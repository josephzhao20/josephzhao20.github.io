import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireUploader, AuthError } from '@/lib/auth/roles';
import { resolveDisplayCoordinates } from '@/lib/geo/randomize';

const photoSchema = z.object({
  imageUrl: z.string().url(),
  exifLatitude: z.number().nullable().optional(),
  exifLongitude: z.number().nullable().optional(),
});

const createAdventureSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().nullable(),
  privacyMode: z.enum(['exact', 'region', 'country', 'hidden']),
  realLatitude: z.number().min(-90).max(90),
  realLongitude: z.number().min(-180).max(180),
  country: z.string().max(120).nullable().optional(),
  countryCode: z.string().max(4).nullable().optional(),
  region: z.string().max(120).nullable().optional(),
  dateVisited: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  photos: z.array(photoSchema).min(1, 'At least one photo is required.').max(30),
});

export async function POST(request: Request) {
  try {
    const profile = await requireUploader();
    const body = createAdventureSchema.parse(await request.json());

    const display = resolveDisplayCoordinates(
      body.privacyMode,
      body.realLatitude,
      body.realLongitude,
      body.countryCode ?? null
    );

    const supabase = await createClient();

    const { data: adventure, error: adventureError } = await supabase
      .from('adventures')
      .insert({
        user_id: profile.id,
        title: body.title,
        description: body.description ?? null,
        cover_image_url: body.photos[0].imageUrl,
        privacy_mode: body.privacyMode,
        real_latitude: body.realLatitude,
        real_longitude: body.realLongitude,
        display_latitude: display?.latitude ?? null,
        display_longitude: display?.longitude ?? null,
        country: body.country ?? null,
        country_code: body.countryCode?.toUpperCase() ?? null,
        region: body.region ?? null,
        date_visited: body.dateVisited ?? null,
      })
      .select('*')
      .single();

    if (adventureError || !adventure) {
      return NextResponse.json(
        { error: adventureError?.message ?? 'Could not create the adventure.' },
        { status: 400 }
      );
    }

    const { error: photosError } = await supabase.from('adventure_photos').insert(
      body.photos.map((p, i) => ({
        adventure_id: adventure.id,
        image_url: p.imageUrl,
        sort_order: i,
        exif_latitude: p.exifLatitude ?? null,
        exif_longitude: p.exifLongitude ?? null,
      }))
    );

    if (photosError) {
      // Roll back the adventure so we don't leave an orphaned, photo-less row.
      await supabase.from('adventures').delete().eq('id', adventure.id);
      return NextResponse.json({ error: photosError.message }, { status: 400 });
    }

    return NextResponse.json({ id: adventure.id }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? 'Invalid input.' }, { status: 422 });
    }
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
