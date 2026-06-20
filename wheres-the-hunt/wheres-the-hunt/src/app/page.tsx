import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/layout/Hero';
import { MissionStatement } from '@/components/layout/MissionStatement';
import { WorldMap } from '@/components/map/WorldMap';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { LinkButton } from '@/components/ui/Button';
import { getMapPins, getGlobalHeatmap, getUserAdventures, getSpotlightStory, getRecentStories } from '@/lib/data/adventures';
import { getCurrentProfile } from '@/lib/auth/roles';
import { locationLabel } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import type { AdventureWithStats } from '@/lib/types/database.types';

function SpotlightCard({ story }: { story: AdventureWithStats }) {
  return (
    <Link
      href={`/adventures/${story.id}`}
      className="group flex flex-col overflow-hidden rounded-trail border-2 border-ink bg-white shadow-trail transition-transform hover:-translate-y-1 sm:flex-row"
    >
      <div className="relative h-64 w-full overflow-hidden border-b-2 border-ink bg-stone sm:h-auto sm:w-2/5 sm:border-b-0 sm:border-r-2">
        {story.cover_image_url ? (
          <Image
            src={story.cover_image_url}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">⛰</div>
        )}
        {story.is_featured && (
          <span className="absolute left-3 top-3 rounded-full border-2 border-ink bg-rust px-3 py-1 text-xs font-bold uppercase tracking-wide text-cream">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink-soft">
            {story.date_visited ? formatDate(story.date_visited) : formatDate(story.created_at)}
            {' · '}
            {locationLabel(story)}
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {story.title}
          </h2>
          {story.description && (
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-ink-soft">
              {story.description}
            </p>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-bold text-forest">@{story.username}</span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-ink-soft">
            ♥ {story.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const profile = await getCurrentProfile();

  const [pins, heatmap, spotlight, recent, myAdventures] = await Promise.all([
    getMapPins(),
    getGlobalHeatmap(),
    getSpotlightStory(),
    getRecentStories(6),
    profile ? getUserAdventures(profile.id) : Promise.resolve([]),
  ]);

  if (profile) {
    return (
      <>
        {/* Welcome back hero */}
        <section className="border-b-2 border-ink bg-cream py-14">
          <div className="mx-auto max-w-6xl px-5">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-ink-soft">
              Welcome back
            </p>
            <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
              Hey, <span className="italic text-forest">@{profile.username}</span> 👋
            </h1>
            <p className="mt-3 text-base font-semibold text-ink-soft">
              {myAdventures.length === 0
                ? "You haven't shared any stories yet. Ready to tell your first?"
                : `You've shared ${myAdventures.length} stor${myAdventures.length === 1 ? 'y' : 'ies'} so far. Keep exploring.`}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/upload" size="lg" className="w-full justify-center sm:w-auto">Share your story</LinkButton>
              <LinkButton href="/map" variant="ghost" size="lg" className="w-full justify-center sm:w-auto">Read the stories</LinkButton>
              <LinkButton href={`/profile/${profile.username}`} variant="ghost" size="lg" className="w-full justify-center sm:w-auto">
                My profile
              </LinkButton>
            </div>
          </div>
        </section>

        {/* Spotlight */}
        {spotlight && (
          <section className="border-b-2 border-ink bg-cream py-14">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="mb-6 font-display text-2xl font-bold text-ink sm:text-3xl">Story spotlight</h2>
              <SpotlightCard story={spotlight} />
            </div>
          </section>
        )}

        {/* My recent stories */}
        {myAdventures.length > 0 && (
          <section className="border-b-2 border-ink bg-cream py-14">
            <div className="mx-auto max-w-6xl px-5">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">My stories</h2>
                <Link href={`/profile/${profile.username}`} className="text-sm font-bold text-forest underline">View all</Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {myAdventures.slice(0, 6).map((a) => <AdventureCard key={a.id} adventure={a} />)}
              </div>
            </div>
          </section>
        )}

        {/* Recent community stories */}
        {recent.length > 0 && (
          <section className="border-b-2 border-ink bg-cream py-14">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="mb-6 font-display text-2xl font-bold text-ink sm:text-3xl">Recent stories</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((a) => <AdventureCard key={a.id} adventure={a} />)}
              </div>
            </div>
          </section>
        )}

        {/* Small map module */}
        <section className="border-b-2 border-ink bg-cream py-14">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-ink">See where these stories happened</h2>
                <p className="mt-1 text-sm font-semibold text-ink-soft">{pins.length.toLocaleString()} stories on the map</p>
              </div>
              <LinkButton href="/map" variant="ghost" size="sm" className="hidden sm:inline-flex">Open full map</LinkButton>
            </div>
            <div className="h-[280px] w-full overflow-hidden rounded-trail border-2 border-ink shadow-trail-lg">
              <WorldMap pins={pins} heatmapCounts={heatmap} />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Hero />

      {/* Featured story spotlight */}
      {spotlight && (
        <section className="border-b-2 border-ink bg-cream py-14">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-6 font-display text-2xl font-bold text-ink sm:text-3xl">Story spotlight</h2>
            <SpotlightCard story={spotlight} />
          </div>
        </section>
      )}

      {/* Recent community stories */}
      {recent.length > 0 && (
        <section className="border-b-2 border-ink bg-cream py-14">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Recent stories</h2>
              <LinkButton href="/map" variant="ghost" size="sm" className="hidden sm:inline-flex">Read all stories</LinkButton>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((a) => <AdventureCard key={a.id} adventure={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* Small map module */}
      <section className="border-b-2 border-ink bg-cream py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">See where these stories happened</h2>
              <p className="mt-1 text-sm font-semibold text-ink-soft">{pins.length.toLocaleString()} stories on the map</p>
            </div>
            <LinkButton href="/map" variant="ghost" size="sm" className="hidden sm:inline-flex">Open full map</LinkButton>
          </div>
          <div className="h-[280px] w-full overflow-hidden rounded-trail border-2 border-ink shadow-trail-lg">
            <WorldMap pins={pins} heatmapCounts={heatmap} />
          </div>
        </div>
      </section>

      <MissionStatement />
    </>
  );
}
