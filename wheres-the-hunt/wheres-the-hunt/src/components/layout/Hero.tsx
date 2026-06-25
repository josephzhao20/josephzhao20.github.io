import Link from 'next/link';
import { LinkButton } from '@/components/ui/Button';
import { HeroVideo } from './HeroVideo';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest">
      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-20">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:gap-12">

          {/* Left — text content */}
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold leading-[1.08] text-cream sm:text-5xl lg:text-6xl">
              <span className="text-rust-light">Winning</span>{' '}
              With The Hunt
            </h1>

            <p className="mt-4 text-sm font-semibold text-cream/80 sm:text-base">
              Every adventure tells a story.
            </p>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/65 sm:text-base">
              A place to keep the stories worth telling — the hunts, the catches,
              the trips that mean something.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <LinkButton
                href="/signup"
                size="lg"
                variant="secondary"
                className="w-full justify-center transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
              >
                Share your story
              </LinkButton>
              <Link
                href="/map"
                className="inline-flex w-full items-center justify-center rounded-card border-2 border-cream/60 px-7 py-3 text-base font-semibold text-cream transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-cream hover:bg-cream/10 hover:shadow-md sm:w-auto"
              >
                Read other stories
              </Link>
            </div>
          </div>

          {/* Right — video card, desktop only */}
          <div className="hidden w-full max-w-md flex-shrink-0 sm:block lg:max-w-lg">
            <HeroVideo />
          </div>

        </div>
      </div>
    </section>
  );
}
