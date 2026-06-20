import Link from 'next/link';
import { TopoLines } from '@/components/ui/TopoLines';
import { LinkButton } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest">
      <TopoLines className="pointer-events-none absolute -right-20 -top-20 h-[600px] w-[600px] text-cream/10 sm:right-0" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-32">
        <p className="mb-5 text-xs font-bold uppercase tracking-[3px] text-rust-light">
          Brought to you by More 2 the Hunt
        </p>

        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] text-cream sm:text-6xl lg:text-7xl">
          <span className="italic text-rust-light">Winning</span>{' '}
          With The Hunt
        </h1>

        <p className="mt-5 text-base font-semibold text-cream/60 sm:text-lg">
          Every adventure tells a story.
        </p>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/50 sm:text-base">
          A place to keep the stories worth telling — the hunts, the catches,
          the trips that meant something. Where it happened comes along for
          the ride, exactly or loosely, your call.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <LinkButton href="/map" size="lg" variant="secondary" className="w-full justify-center sm:w-auto">
            Read the stories
          </LinkButton>
          <LinkButton href="/signup" size="lg" className="w-full justify-center border border-cream/20 bg-cream/10 text-cream hover:bg-cream/20 sm:w-auto">
            Share your story
          </LinkButton>
        </div>

        <p className="mt-6 text-sm text-cream/40">
          Already part of the hunt?{' '}
          <Link href="/login" className="font-semibold text-cream/70 underline hover:text-cream transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
