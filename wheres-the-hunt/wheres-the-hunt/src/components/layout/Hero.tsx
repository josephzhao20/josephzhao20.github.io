'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LinkButton } from '@/components/ui/Button';

export function Hero() {
  const [coverVisible, setCoverVisible] = useState(true);

  // Hide the cover after the video has had time to start playing
  useEffect(() => {
    const t = setTimeout(() => setCoverVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>

      {/* ── Video background layer ── */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.youtube.com/embed/WnYnZBp2IX0?autoplay=1&mute=1&loop=1&playlist=WnYnZBp2IX0&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=5&disablekb=1"
          title="More 2 The Hunt - Introduction"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 h-full w-full scale-125 pointer-events-none"
          style={{ border: 0 }}
        />
      </div>

      {/* ── Startup cover — hides YouTube's initial UI flash, fades out ── */}
      <div
        className="absolute inset-0 z-10 bg-forest transition-opacity duration-700"
        style={{ opacity: coverVisible ? 1 : 0, pointerEvents: 'none' }}
      />

      {/* ── Contrast overlay ── */}
      <div className="absolute inset-0 z-10 bg-black/50 mix-blend-multiply pointer-events-none" />

      {/* ── Foreground text content ── */}
      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 py-24 sm:py-36">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-[1.08] text-cream sm:text-5xl lg:text-6xl">
            <span className="text-rust-light">Winning</span>{' '}
            With The Hunt
          </h1>

          <p className="mt-4 text-base font-semibold text-cream/90 sm:text-lg">
            Every adventure tells a story.
          </p>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/70 sm:text-base">
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
      </div>

    </section>
  );
}
