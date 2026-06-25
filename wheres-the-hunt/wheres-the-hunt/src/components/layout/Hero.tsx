import Link from 'next/link';
import Image from 'next/image';
import { LinkButton } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest">

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:py-24">

        {/* Mobile: logo centered at top */}
        <div className="mb-6 flex justify-center sm:hidden">
          <div className="relative h-36 w-36 overflow-hidden rounded-full opacity-95">
            <Image src="/logo.png" alt="Winning With The Hunt" fill sizes="144px" className="object-cover" priority />
          </div>
        </div>

        {/* Desktop: two-column layout */}
        <div className="flex items-center justify-between gap-10">
          {/* Left — text content */}
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold leading-[1.08] text-cream sm:text-5xl lg:text-6xl">
              <span className="italic text-rust-light">Winning</span>{' '}
              With The Hunt
            </h1>

            <p className="mt-4 text-sm font-semibold text-cream/80 sm:text-base">
              Every adventure tells a story.
            </p>

            {/* Body copy hidden on mobile to keep both CTAs above the fold */}
            <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-cream/65 sm:block sm:text-base">
              A place to keep the stories worth telling — the hunts, the catches,
              the trips that mean something.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
              {/* Primary action: sign up / share */}
              <LinkButton href="/signup" size="lg" variant="secondary" className="w-full justify-center sm:w-auto">
                Share your story
              </LinkButton>
              {/* Secondary action: browse */}
              <Link
                href="/map"
                className="inline-flex w-full items-center justify-center rounded-card border-2 border-cream/60 px-7 py-3 text-base font-semibold text-cream transition-all hover:border-cream hover:bg-cream/10 sm:w-auto"
              >
                Read other stories
              </Link>
            </div>

            <p className="mt-5 text-sm text-cream/50">
              Already part of the hunt?{' '}
              <Link href="/login" className="font-semibold text-cream/80 underline hover:text-cream transition-colors">
                Log in
              </Link>
            </p>
          </div>

          {/* Right — logo, desktop only */}
          <div className="hidden flex-shrink-0 sm:block">
            <div className="relative h-96 w-96 overflow-hidden rounded-full opacity-95 drop-shadow-xl lg:h-[420px] lg:w-[420px]">
              <Image src="/logo.png" alt="Winning With The Hunt" fill sizes="(max-width: 1024px) 384px, 420px" className="object-cover" priority />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
