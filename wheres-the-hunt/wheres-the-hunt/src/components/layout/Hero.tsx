import Link from 'next/link';
import { TopoLines } from '@/components/ui/TopoLines';
import { LinkButton } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-cream">
      <TopoLines className="pointer-events-none absolute -right-32 -top-32 h-[640px] w-[640px] text-forest sm:-right-10" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:py-28">
        <p className="mb-4 inline-block -rotate-1 rounded-full border-2 border-ink bg-rust/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-rust-dark">
          Brought to you by More 2 the Hunt
        </p>

        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] text-ink sm:text-7xl">
          <span className="italic text-forest">Winning</span>{' '}
          With The Hunt
        </h1>

        <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-ink-soft">
          Every adventure tells a story.
        </p>

        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
          A place to keep the stories worth telling — the hunts, the catches,
          the trips that meant something. Where it happened comes along for
          the ride, exactly or loosely, your call.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <LinkButton href="/map" size="lg" className="w-full justify-center sm:w-auto">
            Read the stories
          </LinkButton>
          <LinkButton href="/signup" variant="ghost" size="lg" className="w-full justify-center sm:w-auto">
            Share your story
          </LinkButton>
        </div>

        <p className="mt-5 text-sm font-semibold text-ink-soft">
          Already part of the hunt?{' '}
          <Link href="/login" className="font-bold text-forest underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
