import Link from 'next/link';
import { TopoLines } from '@/components/ui/TopoLines';
import { LinkButton } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-cream">
      <TopoLines className="pointer-events-none absolute -right-32 -top-32 h-[640px] w-[640px] text-forest sm:-right-10" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <p className="mb-4 inline-block -rotate-1 rounded-full border-2 border-ink bg-sunset/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-sunset-dark">
          A map, not a feed
        </p>

        <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] text-ink sm:text-7xl">
          Where&rsquo;s{' '}
          <span className="italic text-forest">The Hunt?</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-ink-soft">
          Every pin tells a story.
        </p>

        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
          Explore a community-built map of real trips — national parks, fishing
          holes, family road trips, and hidden gems — pinned exactly where they
          happened (or somewhere close, if the storyteller would rather keep
          that part secret).
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <LinkButton href="/map" size="lg">
            Explore the map
          </LinkButton>
          <LinkButton href="/signup" variant="ghost" size="lg">
            Share an adventure
          </LinkButton>
        </div>

        <p className="mt-6 text-sm font-semibold text-ink-soft">
          Already part of the hunt?{' '}
          <Link href="/login" className="font-bold text-forest underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
