import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAdventureWithStats } from '@/lib/data/adventures';
import { getCurrentProfile } from '@/lib/auth/roles';
import { hasLiked } from '@/lib/data/users';
import { locationLabel, toMapPin } from '@/lib/types';
import { PhotoGallery } from '@/components/adventure/PhotoGallery';
import { LikeButton } from '@/components/adventure/LikeButton';
import { AdventureActions } from '@/components/adventure/AdventureActions';
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
  const photoList = (photos as AdventurePhotoRow[] | null) ?? [];

  return (
    <article className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/map" className="text-sm font-bold text-ink-soft hover:text-ink">
        ← Back to stories
      </Link>

      {/* Hero photo — full width, dominant */}
      {photoList.length > 0 && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-trail border-2 border-ink bg-stone">
          <Image
            src={photoList[0].image_url}
            alt={adventure.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          {adventure.is_featured && (
            <span className="absolute left-4 top-4 rounded-full border-2 border-ink bg-rust px-3 py-1 text-xs font-bold uppercase tracking-wide text-cream">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Title + date */}
      <div className="mt-6">
        <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {adventure.title}
        </h1>
        <p className="mt-2 text-sm font-bold text-ink-soft">
          {adventure.date_visited ? formatDate(adventure.date_visited) : formatDate(adventure.created_at)}
        </p>
      </div>

      {/* Author row + like button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Tag tone="forest">
            <Link href={`/profile/${adventure.username}`}>@{adventure.username}</Link>
          </Tag>
          {adventure.is_featured && !photoList.length && <Tag tone="rust">Featured</Tag>}
        </div>
        <LikeButton
          adventureId={adventure.id}
          initialLikeCount={adventure.like_count}
          initiallyLiked={liked}
          isSignedIn={!!profile}
        />
      </div>

      {/* Edit/delete for owner/admin */}
      {(profile?.id === adventure.user_id || profile?.is_admin) && (
        <AdventureActions adventure={adventure} />
      )}

      {/* The story — dominant content block */}
      {adventure.description && (
        <div className="mt-8 border-t-2 border-ink/10 pt-8">
          <p className="whitespace-pre-line text-lg leading-[1.85] text-ink">
            {adventure.description}
          </p>
        </div>
      )}

      {/* Photo strip — all photos after the hero */}
      {photoList.length > 1 && (
        <div className="mt-10">
          <PhotoGallery photos={photoList} title={adventure.title} />
        </div>
      )}

      {/* Location — small, last */}
      {pin && (
        <div className="mt-10 border-t-2 border-ink/10 pt-8">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-soft">
            <span>📍</span>
            <span>{locationLabel(adventure)}</span>
          </div>
          <div className="mt-3 h-48 w-full overflow-hidden rounded-trail border-2 border-ink">
            <WorldMap pins={[pin]} initialCenter={[pin.latitude, pin.longitude]} initialZoom={9} />
          </div>
        </div>
      )}
    </article>
  );
}
