import Image from 'next/image';
import Link from 'next/link';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { LinkButton } from '@/components/ui/Button';
import { getSpotlightStory, getRecentStories } from '@/lib/data/adventures';
import { locationLabel } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import type { AdventureWithStats } from '@/lib/types/database.types';

export const metadata = { title: "Stories — Winning With The Hunt" };

function SpotlightCard({ story }: { story: AdventureWithStats }) {
  return (
    <Link
      href={`/adventures/${story.id}`}
      className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card-lg transition-all duration-300 hover:shadow-card-hover sm:flex-row"
    >
      <div className="relative h-64 w-full overflow-hidden bg-stone/30 sm:h-auto sm:w-2/5">
        {story.cover_image_url ? (
          <Image
            src={story.cover_image_url}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-stone">⛰</div>
        )}
        {story.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-rust px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-stone">
            {story.date_visited ? formatDate(story.date_visited) : formatDate(story.created_at)}
            {' · '}
            {locationLabel(story)}
          </p>
          <h2 className="font-display text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-forest sm:text-3xl">
            {story.title}
          </h2>
          {story.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">
              {story.description}
            </p>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-cream-dark pt-4">
          <span className="text-xs font-bold text-earth">@{story.username}</span>
          <span className="text-xs font-semibold text-stone">♥ {story.like_count}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function StoriesPage() {
  const [spotlight, recent] = await Promise.all([
    getSpotlightStory(),
    getRecentStories(9),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-stone">Community</p>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Stories</h1>
        <p className="mt-3 text-base text-ink/60">
          Real hunts, catches, and outdoor memories from the community.
        </p>
      </div>

      {spotlight && (
        <section className="mb-14">
          <h2 className="mb-5 font-display text-xl font-bold text-ink">Story Spotlight</h2>
          <SpotlightCard story={spotlight} />
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Recent Stories</h2>
            <LinkButton href="/map" variant="outline" size="sm">See on map</LinkButton>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((a) => <AdventureCard key={a.id} adventure={a} />)}
          </div>
        </section>
      )}

      {recent.length === 0 && !spotlight && (
        <div className="py-20 text-center">
          <p className="font-display text-xl font-bold text-ink">No stories yet.</p>
          <p className="mt-2 text-sm text-ink/50">Be the first to share one.</p>
          <div className="mt-6">
            <LinkButton href="/upload">Share your story</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
