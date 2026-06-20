import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAdventureWithStats } from '@/lib/data/adventures';
import { getCurrentProfile } from '@/lib/auth/roles';
import { hasLiked } from '@/lib/data/users';
import { locationLabel, toMapPin } from '@/lib/types';
import { PhotoGallery } from '@/components/adventure/PhotoGallery';
import { LikeButton } from '@/components/adventure/LikeButton';
import { Tag } from '@/components/ui/Tag';
import { WorldMap } from '@/components/map/WorldMap';
import { formatDate } from '@/lib/utils';
import type { AdventurePhotoRow } from '@/lib/types/database.types';

interface Params {
  params: Promise<{ id: string }>;
}

export default async function AdventureDetailPage({ params }: Params) {
  const { id } = await params;
  const [adventure, profile] = await Promise.all([getAdventureWithStats(id), getCurrentProfile()]);

  if (!adventure) notFound();

  const supabase = await createClient();
  const { data: photos } = await supabase
    .from('adventure_photos')
    .select('*')
    .eq('adventure_id', id)
    .order('sort_order', { ascending: true });

  const liked = profile ? await hasLiked(profile.id, id) : false;
  const pin = toMapPin(adventure);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/map" className="text-sm font-bold text-ink-soft hover:text-ink">
        ← Back to the map
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-4xl">{adventure.title}</h1>
          <p className="mt-2 text-sm font-bold text-ink-soft">
            {locationLabel(adventure)} · {formatDate(adventure.created_at)}
          </p>
        </div>
        <LikeButton
          adventureId={adventure.id}
          initialLikeCount={adventure.like_count}
          initiallyLiked={liked}
          isSignedIn={!!profile}
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Tag tone="forest">
          <Link href={`/profile/${adventure.username}`}>@{adventure.username}</Link>
        </Tag>
        {adventure.is_featured && <Tag tone="sunset">Featured</Tag>}
      </div>

      {adventure.description && (
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink">
          {adventure.description}
        </p>
      )}

      <div className="mt-8">
        <PhotoGallery photos={(photos as AdventurePhotoRow[] | null) ?? []} title={adventure.title} />
      </div>

      {pin && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">Location</h2>
          <div className="h-64 w-full overflow-hidden rounded-trail border-2 border-ink">
            <WorldMap pins={[pin]} initialCenter={[pin.latitude, pin.longitude]} initialZoom={9} />
          </div>
        </div>
      )}
    </div>
  );
}
