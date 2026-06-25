'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LinkButton } from '@/components/ui/Button';

export function Hero() {
  const [coverVisible, setCoverVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCoverVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 57px)' }}
    >

      {/* ── Desktop: YouTube cinematic background loop ── */}
      <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/WnYnZBp2IX0?autoplay=1&mute=1&loop=1&playlist=WnYnZBp2IX0&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=5&disablekb=1"
          title="More 2 The Hunt - Introduction"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-125"
          style={{ border: 0 }}
        />
      </div>

      {/* ── Desktop: startup cover — fades out after video begins ── */}
      <div
        className="hidden md:block absolute inset-0 z-10 bg-forest-dark transition-opacity duration-700 pointer-events-none"
        style={{ opacity: coverVisible ? 1 : 0 }}
      />

      {/* ── Mobile: static image fallback ── */}
      <div className="block md:hidden absolute inset-0">
        <Image
          src="/Static_background.png"
          alt="Outdoor landscape"
          fill
          sizes="100vw"
          className="object-cover object-right"
          priority
        />
      </div>

      {/* ── Contrast overlay — desktop ── */}
      <div className="hidden md:block absolute inset-0 z-10 bg-black/50 mix-blend-multiply pointer-events-none" />

      {/* ── Contrast overlay — mobile (slightly stronger) ── */}
      <div className="block md:hidden absolute inset-0 z-10 bg-black/60 pointer-events-none" />

      {/* ── Foreground text content ── */}
      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col justify-center px-4 text-center md:px-5 md:text-left">
        <div className="mx-auto max-w-2xl md:mx-0">
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

          <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-start md:gap-4">
            <LinkButton
              href="/signup"
              size="lg"
              variant="secondary"
              className="w-full justify-center transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md md:w-auto"
            >
              Share your story
            </LinkButton>
            <Link
              href="/map"
              className="inline-flex w-full items-center justify-center rounded-card border-2 border-cream/60 px-7 py-3 text-base font-semibold text-cream transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-cream hover:bg-cream/10 hover:shadow-md md:w-auto"
            >
              Read other stories
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
