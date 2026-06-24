import Image from 'next/image';
import Link from 'next/link';
import { CampMapHub } from '@/components/hub/CampMapHub';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { WorldMap } from '@/components/map/WorldMap';
import { LinkButton } from '@/components/ui/Button';
import { getCurrentProfile } from '@/lib/auth/roles';
import { getSpotlightStory, getRecentStories, getMapPins, getGlobalHeatmap } from '@/lib/data/adventures';
import { getMerchItems } from '@/lib/data/merch';
import { locationLabel } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import type { AdventureWithStats } from '@/lib/types/database.types';

function SpotlightCard({ story }: { story: AdventureWithStats }) {
  return (
    <Link
      href={`/adventures/${story.id}`}
      className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card-lg transition-all duration-300 hover:shadow-card-hover sm:flex-row"
    >
      <div className="relative h-56 w-full overflow-hidden bg-stone/30 sm:h-auto sm:w-2/5">
        {story.cover_image_url ? (
          <Image src={story.cover_image_url} alt={story.title} fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-stone">⛰</div>
        )}
        {story.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-rust px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">Featured</span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-stone">
            {story.date_visited ? formatDate(story.date_visited) : formatDate(story.created_at)}
            {' · '}{locationLabel(story)}
          </p>
          <h2 className="font-display text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-forest sm:text-3xl">
            {story.title}
          </h2>
          {story.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">{story.description}</p>
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

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="h-px flex-1 bg-ink/10" />
      <span className="font-display text-xs font-bold uppercase tracking-[3px] text-ink/40">{label}</span>
      <div className="h-px flex-1 bg-ink/10" />
    </div>
  );
}

export default async function HomePage() {
  const [profile, spotlight, recent, pins, heatmap, merch] = await Promise.all([
    getCurrentProfile(),
    getSpotlightStory(),
    getRecentStories(6),
    getMapPins(),
    getGlobalHeatmap(),
    getMerchItems(),
  ]);

  const featuredMerch = merch.filter(i => i.is_featured).slice(0, 3);

  return (
    <>
      {/* ── Hub illustration (station 1) ── */}
      <CampMapHub profile={profile} />

      {/* ── Section 1: Mission ── */}
      <section id="section-mission" className="scroll-mt-0 bg-forest py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <SectionDivider label="Our Mission" />
          <h2 className="font-display text-3xl font-bold text-cream sm:text-4xl">
            Where stories worth telling get told.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Winning With The Hunt is where hunters, anglers, and outdoor families
            keep the stories worth remembering. Not just where it happened — what
            it meant. Every adventure tells a story. This is where it gets told.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/about" variant="secondary" size="lg">Read our full mission</LinkButton>
            {!profile && (
              <Link href="/signup"
                className="inline-flex items-center justify-center rounded-card border-2 border-cream/40 px-7 py-3 text-base font-semibold text-cream transition-all hover:border-cream hover:bg-cream/10">
                Join the Hunt
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Section 2: Stories ── */}
      <section id="section-stories" className="scroll-mt-0 bg-cream py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionDivider label="Stories" />

          {spotlight && (
            <div className="mb-12">
              <h2 className="mb-5 font-display text-2xl font-bold text-ink">Story Spotlight</h2>
              <SpotlightCard story={spotlight} />
            </div>
          )}

          {recent.length > 0 && (
            <div>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold text-ink">Recent Stories</h2>
                <LinkButton href="/stories" variant="outline" size="sm">View all</LinkButton>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((a) => <AdventureCard key={a.id} adventure={a} />)}
              </div>
            </div>
          )}

          {recent.length === 0 && !spotlight && (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-bold text-ink">No stories yet.</p>
              <p className="mt-2 text-sm text-ink/50">Be the first to share one.</p>
              <div className="mt-6"><LinkButton href="/upload">Share your story</LinkButton></div>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 3: The Map ── */}
      <section id="section-map" className="scroll-mt-0 bg-cream-dark/30 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionDivider label="The Map" />
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">All Stories on the Map</h2>
              <p className="mt-1 text-sm text-stone">{pins.length.toLocaleString()} stories pinned</p>
            </div>
            <LinkButton href="/map" variant="outline" size="sm" className="hidden sm:inline-flex">
              Open full map
            </LinkButton>
          </div>
          <div className="h-[400px] w-full overflow-hidden rounded-card shadow-card-lg sm:h-[520px]">
            <WorldMap pins={pins} heatmapCounts={heatmap} />
          </div>
          <div className="mt-4 sm:hidden">
            <LinkButton href="/map" variant="outline" size="sm" className="w-full justify-center">Open full map</LinkButton>
          </div>
        </div>
      </section>

      {/* ── Section 4: The Lodge ── */}
      <section id="section-lodge" className="scroll-mt-0 bg-cream py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionDivider label="The Lodge" />
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">The Lodge Shop</h2>
              <p className="mt-1 text-sm text-stone">Gear, the book, and more</p>
            </div>
            <LinkButton href="/merch" variant="outline" size="sm" className="hidden sm:inline-flex">
              Browse all
            </LinkButton>
          </div>

          {featuredMerch.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {featuredMerch.map((item) => (
                <div key={item.id} className="flex flex-col overflow-hidden rounded-card bg-white shadow-card transition-all hover:shadow-card-hover">
                  <div className="relative h-48 w-full overflow-hidden bg-stone/20">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        {item.category === 'book' ? '📖' : item.category === 'shirt' ? '👕' : item.category === 'hoodie' ? '🧥' : item.category === 'hat' ? '🧢' : '🥤'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <h3 className="font-display text-base font-bold text-ink">{item.name}</h3>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      {item.price != null && (
                        <span className="font-display text-lg font-bold text-earth">${item.price.toFixed(2)}</span>
                      )}
                      {item.buy_url && item.in_stock && (
                        <a href={item.buy_url} target="_blank" rel="noopener noreferrer"
                          className="rounded-card bg-forest px-3 py-1.5 text-sm font-bold text-cream transition-all hover:bg-forest-dark">
                          Buy ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-ink/10 bg-white/60 py-12 text-center">
              <p className="font-display text-xl font-bold text-ink">Coming soon</p>
              <p className="mt-2 text-sm text-ink/50">Check back for gear and the book.</p>
            </div>
          )}

          <div className="mt-6 sm:hidden">
            <LinkButton href="/merch" variant="outline" size="sm" className="w-full justify-center">Browse all</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
