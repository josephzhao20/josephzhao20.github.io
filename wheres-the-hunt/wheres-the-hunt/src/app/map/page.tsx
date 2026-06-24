import Link from 'next/link';
import Image from 'next/image';
import { WorldMap } from '@/components/map/WorldMap';
import { StorySearchInput } from '@/components/adventure/StorySearchInput';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { getMapPins, getGlobalHeatmap, getTopStoriesLast3Months, getRecentStories, searchStories, getAllStories } from '@/lib/data/adventures';
import { locationLabel } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import type { AdventureWithStats } from '@/lib/types/database.types';

export const metadata = {
  title: "Explore — Winning With The Hunt",
  description: "Discover hunts, catches, and outdoor memories from the community. Browse the interactive map or search stories by keyword.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

function HorizontalStoryCard({ adventure }: { adventure: AdventureWithStats }) {
  return (
    <Link
      href={`/adventures/${adventure.id}`}
      className="group flex w-64 flex-shrink-0 flex-col overflow-hidden rounded-trail border-2 border-ink bg-white shadow-trail transition-transform hover:-translate-y-1"
    >
      <div className="relative h-40 w-full overflow-hidden border-b-2 border-ink bg-stone">
        {adventure.cover_image_url ? (
          <Image
            src={adventure.cover_image_url}
            alt={adventure.title}
            fill
            sizes="256px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl">⛰</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="font-display text-sm font-bold leading-tight text-ink line-clamp-2">{adventure.title}</h3>
        <p className="text-xs font-semibold text-ink-soft">{locationLabel(adventure)}</p>
        {adventure.date_visited && (
          <p className="text-xs text-ink-soft">{formatDate(adventure.date_visited)}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-forest">@{adventure.username}</span>
          <span className="text-xs font-bold text-ink-soft">♥ {adventure.like_count}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const searchQuery = q?.trim() ?? '';

  const [pins, heatmap, topStories, recentStories, results, allForCount] = await Promise.all([
    getMapPins(),
    getGlobalHeatmap(),
    getTopStoriesLast3Months(5),
    getRecentStories(5),
    searchQuery ? searchStories(searchQuery) : getAllStories(50),
    getAllStories(11), // just enough to check if > 10
  ]);

  const totalStories = allForCount.length;
  const showCuratedSections = totalStories > 10;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Explore Other Stories</h1>
      <p className="mt-2 font-semibold text-ink-soft">
        Discover hunts, catches, and outdoor memories from the community.
      </p>

      {/* Interactive map — compact */}
      <div className="mt-8 h-64 w-full overflow-hidden rounded-card shadow-card-lg sm:h-80">
        <WorldMap pins={pins} heatmapCounts={heatmap} />
      </div>

      {/* Curated sections — only when > 10 stories exist */}
      {showCuratedSections && topStories.length > 0 && (() => {
        const hasLikes = topStories.some(a => a.like_count > 0);
        return (
          <section className="mt-12">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-xl font-bold text-ink">
                {hasLikes ? 'Top Stories' : 'Community Stories'}
              </h2>
              {hasLikes && <span className="text-xs font-bold text-ink-soft">Most liked · last 3 months</span>}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3">
              {topStories.map(a => <HorizontalStoryCard key={a.id} adventure={a} />)}
            </div>
          </section>
        );
      })()}

      {showCuratedSections && recentStories.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Recently Shared</h2>
            <span className="text-xs font-bold text-ink-soft">Latest from the community</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3">
            {recentStories.map(a => <HorizontalStoryCard key={a.id} adventure={a} />)}
          </div>
        </section>
      )}

      {/* Search + all stories */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">
          {searchQuery ? `Results for "${searchQuery}"` : (showCuratedSections ? 'All Stories' : 'Stories from the community')}
        </h2>
        <div className="mb-6">
          <StorySearchInput defaultValue={searchQuery} />
        </div>

        {results.length === 0 ? (
          <p className="py-10 text-center font-semibold text-ink-soft">
            {searchQuery ? `No stories found for "${searchQuery}".` : 'No stories yet — be the first to share one.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(a => <AdventureCard key={a.id} adventure={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
