import { Hero } from '@/components/layout/Hero';
import { MissionStatement } from '@/components/layout/MissionStatement';
import { WorldMap } from '@/components/map/WorldMap';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { LinkButton } from '@/components/ui/Button';
import { getMapPins, getFeaturedAdventures, getGlobalHeatmap } from '@/lib/data/adventures';

export default async function HomePage() {
  const [pins, featured, heatmap] = await Promise.all([
    getMapPins(),
    getFeaturedAdventures(),
    getGlobalHeatmap(),
  ]);

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

          <div className="h-[520px] w-full overflow-hidden rounded-trail border-2 border-ink shadow-trail-lg">
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
