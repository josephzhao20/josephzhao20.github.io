import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin, AuthError } from '@/lib/auth/roles';

const schema = z.object({ adventureId: z.string().uuid() });

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { adventureId } = schema.parse(await request.json());
    const admin = createAdminClient();

    // Best-effort cleanup of the storage objects before the row (and its
    // adventure_photos, via ON DELETE CASCADE) disappear.
    const { data: photos } = await admin
      .from('adventure_photos')
      .select('image_url')
      .eq('adventure_id', adventureId);

    if (photos && photos.length > 0) {
      const paths = photos
        .map((p) => extractStoragePath(p.image_url))
        .filter((p): p is string => !!p);
      if (paths.length > 0) {
        await admin.storage.from('adventure-photos').remove(paths);
      }
    }

    const { error } = await admin.from('adventures').delete().eq('id', adventureId);
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

/** Pulls the "{userId}/{adventureId}/{filename}" path back out of a public storage URL. */
function extractStoragePath(publicUrl: string): string | null {
  const marker = '/adventure-photos/';
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
