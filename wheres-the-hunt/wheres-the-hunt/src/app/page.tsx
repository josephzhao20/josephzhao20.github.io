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

function Section({ children, tonal = false }: { children: React.ReactNode; tonal?: boolean }) {
  return (
    <section className={`py-16 ${tonal ? 'bg-cream-dark/40' : 'bg-cream'}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      {action}
    </div>
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
        <section className="bg-forest py-16">
          <div className="mx-auto max-w-6xl px-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-cream/40">Welcome back</p>
            <h1 className="font-display text-4xl font-bold text-cream sm:text-5xl">
              Hey, <span className="italic text-rust-light">@{profile.username}</span>
            </h1>
            <p className="mt-3 text-sm font-semibold text-cream/50">
              {myAdventures.length === 0
                ? "You haven't shared any stories yet. Ready to tell your first?"
                : `You've shared ${myAdventures.length} stor${myAdventures.length === 1 ? 'y' : 'ies'} so far. Keep going.`}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/upload" size="lg" variant="secondary" className="w-full justify-center sm:w-auto">Share your story</LinkButton>
              <LinkButton href="/map" size="lg" className="w-full justify-center border border-cream/20 bg-cream/10 text-cream hover:bg-cream/20 sm:w-auto">Read the stories</LinkButton>
              <LinkButton href={`/profile/${profile.username}`} size="lg" className="w-full justify-center border border-cream/20 bg-cream/10 text-cream hover:bg-cream/20 sm:w-auto">
                My profile
              </LinkButton>
            </div>
          </div>
        </section>

        {spotlight && (
          <Section>
            <SectionHeader title="Story spotlight" />
            <SpotlightCard story={spotlight} />
          </Section>
        )}

        {myAdventures.length > 0 && (
          <Section tonal>
            <SectionHeader
              title="My stories"
              action={<Link href={`/profile/${profile.username}`} className="text-sm font-semibold text-forest hover:underline">View all</Link>}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myAdventures.slice(0, 6).map((a) => <AdventureCard key={a.id} adventure={a} />)}
            </div>
          </Section>
        )}

        {recent.length > 0 && (
          <Section>
            <SectionHeader title="Recent stories" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((a) => <AdventureCard key={a.id} adventure={a} />)}
            </div>
          </Section>
        )}

        <Section tonal>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">See where these stories happened</h2>
              <p className="mt-1 text-sm text-stone">{pins.length.toLocaleString()} stories on the map</p>
            </div>
            <LinkButton href="/map" variant="outline" size="sm" className="hidden sm:inline-flex">Open full map</LinkButton>
          </div>
          <div className="h-[260px] w-full overflow-hidden rounded-card shadow-card-lg">
            <WorldMap pins={pins} heatmapCounts={heatmap} />
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Hero />

      {spotlight && (
        <Section>
          <SectionHeader title="Story spotlight" />
          <SpotlightCard story={spotlight} />
        </Section>
      )}

      {recent.length > 0 && (
        <Section tonal>
          <SectionHeader
            title="Recent stories"
            action={<LinkButton href="/map" variant="outline" size="sm">Read all stories</LinkButton>}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((a) => <AdventureCard key={a.id} adventure={a} />)}
          </div>
        </Section>
      )}

      <Section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">See where these stories happened</h2>
            <p className="mt-1 text-sm text-stone">{pins.length.toLocaleString()} stories on the map</p>
          </div>
          <LinkButton href="/map" variant="outline" size="sm" className="hidden sm:inline-flex">Open full map</LinkButton>
        </div>
        <div className="h-[260px] w-full overflow-hidden rounded-card shadow-card-lg">
          <WorldMap pins={pins} heatmapCounts={heatmap} />
        </div>
      </Section>

      <MissionStatement />
    </>
  );
}
