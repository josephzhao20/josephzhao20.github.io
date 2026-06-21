import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
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
import type { AdventurePhotoRow, AdventureWithStats } from '@/lib/types/database.types';

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const adventure = await getAdventureWithStats(id);
  if (!adventure) return { title: "Story not found — Winning With The Hunt" };

  const title = `${adventure.title} — Winning With The Hunt`;
  const description = adventure.description
    ? adventure.description.slice(0, 160)
    : `A story by @${adventure.username} on Winning With The Hunt.`;
  const image = adventure.cover_image_url ?? undefined;

  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : [] },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : [] },
  };
}

async function getAdjacentStories(createdAt: string) {
  const supabase = await createClient();
  const [{ data: prev }, { data: next }] = await Promise.all([
    supabase
      .from('adventures_with_stats')
      .select('id, title')
      .neq('privacy_mode', 'hidden')
      .lt('created_at', createdAt)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('adventures_with_stats')
      .select('id, title')
      .neq('privacy_mode', 'hidden')
      .gt('created_at', createdAt)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prev as Pick<AdventureWithStats, 'id' | 'title'> | null,
    next: next as Pick<AdventureWithStats, 'id' | 'title'> | null,
  };
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

  const [liked, adjacent] = await Promise.all([
    profile ? hasLiked(profile.id, id) : Promise.resolve(false),
    getAdjacentStories(adventure.created_at),
  ]);

  const pin = toMapPin(adventure);
  const photoList = (photos as AdventurePhotoRow[] | null) ?? [];

  return (
    <article className="mx-auto max-w-4xl px-5 py-12">
      <Link href="/map" className="text-sm font-bold text-ink-soft hover:text-ink">
        ← Back to stories
      </Link>

      {/* Title + date */}
      <div className="mt-6">
        <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {adventure.title}
        </h1>
        {adventure.date_visited && (
          <p className="mt-2 text-sm font-bold text-ink-soft">{formatDate(adventure.date_visited)}</p>
        )}
      </div>

      {/* Author row + like button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Tag tone="forest">
            <Link href={`/profile/${adventure.username}`}>@{adventure.username}</Link>
          </Tag>
          {adventure.is_featured && <Tag tone="rust">Featured</Tag>}
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

      {/* All photos in gallery */}
      {photoList.length > 0 && (
        <div className="mt-8">
          <PhotoGallery photos={photoList} title={adventure.title} />
        </div>
      )}

      {/* The story */}
      {adventure.description && (
        <div className="mt-8 border-t border-ink/10 pt-8">
          <p className="whitespace-pre-line text-lg leading-[1.85] text-ink">
            {adventure.description}
          </p>
        </div>
      )}

      {/* Location — small, last */}
      {pin && (
        <div className="mt-10 border-t border-ink/10 pt-8">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-soft">
            <span>📍</span>
            <span>{locationLabel(adventure)}</span>
          </div>
          <div className="mt-3 h-48 w-full overflow-hidden rounded-card shadow-card">
            <WorldMap pins={[pin]} initialCenter={[pin.latitude, pin.longitude]} initialZoom={9} />
          </div>
        </div>
      )}

      {/* Prev / Next navigation */}
      {(adjacent.prev || adjacent.next) && (
        <div className="mt-12 flex items-center justify-between border-t border-ink/10 pt-8 text-sm font-semibold">
          {adjacent.prev ? (
            <Link
              href={`/adventures/${adjacent.prev.id}`}
              className="group flex items-center gap-2 text-ink-soft hover:text-ink"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              <span className="line-clamp-1 max-w-[180px] sm:max-w-xs">{adjacent.prev.title}</span>
            </Link>
          ) : <span />}
          {adjacent.next ? (
            <Link
              href={`/adventures/${adjacent.next.id}`}
              className="group flex items-center gap-2 text-right text-ink-soft hover:text-ink"
            >
              <span className="line-clamp-1 max-w-[180px] sm:max-w-xs">{adjacent.next.title}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ) : <span />}
        </div>
      )}
    </article>
  );
}
