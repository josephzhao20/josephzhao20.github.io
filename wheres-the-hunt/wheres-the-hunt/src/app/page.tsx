import { Hero } from '@/components/layout/Hero';
import { MissionStatement } from '@/components/layout/MissionStatement';
import { WorldMap } from '@/components/map/WorldMap';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { LinkButton } from '@/components/ui/Button';
import { getMapPins, getFeaturedAdventures, getGlobalHeatmap, getUserAdventures } from '@/lib/data/adventures';
import { getCurrentProfile } from '@/lib/auth/roles';
import Link from 'next/link';

export default async function HomePage() {
  const profile = await getCurrentProfile();

  const [pins, featured, heatmap, myAdventures] = await Promise.all([
    getMapPins(),
    getFeaturedAdventures(),
    getGlobalHeatmap(),
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
                ? "You haven't pinned any adventures yet. Ready to share your first?"
                : `You've pinned ${myAdventures.length} adventure${myAdventures.length === 1 ? '' : 's'} so far. Keep exploring.`}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/upload" size="lg" className="w-full justify-center sm:w-auto">Share an adventure</LinkButton>
              <LinkButton href="/map" variant="ghost" size="lg" className="w-full justify-center sm:w-auto">Explore the map</LinkButton>
              <LinkButton href={`/profile/${profile.username}`} variant="ghost" size="lg" className="w-full justify-center sm:w-auto">
                My profile
              </LinkButton>
            </div>
          </div>
        </section>

        {/* My recent adventures */}
        {myAdventures.length > 0 && (
          <section className="border-b-2 border-ink bg-cream py-14">
            <div className="mx-auto max-w-6xl px-5">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  My adventures
                </h2>
                <Link
                  href={`/profile/${profile.username}`}
                  className="text-sm font-bold text-forest underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {myAdventures.slice(0, 6).map((adventure) => (
                  <AdventureCard key={adventure.id} adventure={adventure} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Community map */}
        <section className="border-b-2 border-ink bg-cream py-14">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  The hunt so far
                </h2>
                <p className="mt-1 text-sm font-semibold text-ink-soft">
                  {pins.length.toLocaleString()} adventures pinned by the community
                </p>
              </div>
              <LinkButton href="/map" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Open full map
              </LinkButton>
            </div>
            <div className="h-[340px] w-full overflow-hidden rounded-trail border-2 border-ink shadow-trail-lg sm:h-[520px]">
              <WorldMap pins={pins} heatmapCounts={heatmap} />
            </div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="border-b-2 border-ink bg-cream py-14">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="mb-6 font-display text-2xl font-bold text-ink sm:text-3xl">
                Featured adventures
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((adventure) => (
                  <AdventureCard key={adventure.id} adventure={adventure} />
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  return (
    <>
      <Hero />

      <section className="border-b-2 border-ink bg-cream py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                The hunt so far
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-soft">
                {pins.length.toLocaleString()} adventures pinned by the community
              </p>
            </div>
            <LinkButton href="/map" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Open full map
            </LinkButton>
          </div>

          <div className="h-[340px] w-full overflow-hidden rounded-trail border-2 border-ink shadow-trail-lg sm:h-[520px]">
            <WorldMap pins={pins} heatmapCounts={heatmap} />
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-b-2 border-ink bg-cream py-14">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-6 font-display text-2xl font-bold text-ink sm:text-3xl">
              Featured adventures
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((adventure) => (
                <AdventureCard key={adventure.id} adventure={adventure} />
              ))}
            </div>
          </div>
        </section>
      )}

      <MissionStatement />
    </>
  );
}
