import Link from 'next/link';
import Image from 'next/image';
import { LinkButton } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest">

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:py-24">

        {/* Mobile: logo centered at top */}
        <div className="mb-6 flex justify-center sm:hidden">
          <Image
            src="/logo.png"
            alt="Winning With The Hunt"
            width={140}
            height={140}
            className="rounded-full opacity-95"
            priority
          />
        </div>

        {/* Desktop: two-column layout */}
        <div className="flex items-center justify-between gap-10">
          {/* Left — text content */}
          <div className="flex-1">
            <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-rust-light">
              Brought to you by More 2 the Hunt
            </p>

            <h1 className="font-display text-3xl font-bold leading-[1.08] text-cream sm:text-5xl lg:text-6xl">
              <span className="italic text-rust-light">Winning</span>{' '}
              With The Hunt
            </h1>

            <p className="mt-4 text-sm font-semibold text-cream/80 sm:text-base">
              Every adventure tells a story.
            </p>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/65 sm:text-base">
              A place to keep the stories worth telling — the hunts, the catches,
              the trips that meant something.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <LinkButton href="/map" size="lg" variant="secondary" className="w-full justify-center sm:w-auto">
                Read the stories
              </LinkButton>
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-card bg-cream px-7 py-3 text-base font-semibold text-forest transition-all hover:bg-cream-dark sm:w-auto"
              >
                Share your story
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
            <Image
              src="/logo.png"
              alt="Winning With The Hunt"
              width={300}
              height={300}
              className="rounded-full opacity-95 drop-shadow-xl"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
