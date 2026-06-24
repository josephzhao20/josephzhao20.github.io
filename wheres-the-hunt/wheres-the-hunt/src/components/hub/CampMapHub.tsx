'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND_NAME, HUB_SIGNAGE } from '@/lib/constants';
import {
  SignpostIllustration,
  TelescopeIllustration,
  MapStandIllustration,
  LodgeIllustration,
} from '@/components/hub/StationIllustrations';
import type { UserRow } from '@/lib/types/database.types';

const STATIONS = [
  { id: 'mission',  label: 'Mission',        sectionId: 'section-mission',  Illustration: SignpostIllustration,   description: 'Our values & story' },
  { id: 'stories',  label: 'Explore Stories', sectionId: 'section-stories',  Illustration: TelescopeIllustration,  description: 'Community adventures' },
  { id: 'map',      label: 'The Map',         sectionId: 'section-map',      Illustration: MapStandIllustration,   description: 'All stories on the map' },
  { id: 'lodge',    label: 'The Lodge',       sectionId: 'section-lodge',    Illustration: LodgeIllustration,      description: 'Gear & the book' },
];

interface CampMapHubProps {
  profile: UserRow | null;
}

function scrollTo(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function GroundConnector() {
  return (
    <svg viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden="true"
      className="absolute bottom-14 left-0 h-10 text-ink/20" style={{ width: `${STATIONS.length * 100}vw` }}>
      <path d="M0 40 C 60 28,120 52,200 38 S340 24,420 38 S560 52,640 36 S780 20,860 36 S1000 52,1080 36 S1220 18,1300 36 S1440 52,1520 38 S1580 30,1600 36"
        stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M0 48 C80 36,160 58,240 44 S380 30,460 44 S600 58,680 42 S820 26,900 42 S1040 58,1120 42 S1260 24,1340 42 S1480 58,1560 44 S1590 38,1600 44"
        stroke="currentColor" strokeWidth="1.5" fill="none" strokeOpacity="0.5" />
    </svg>
  );
}

function SceneBackground() {
  return (
    <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      className="absolute inset-0 w-full h-full text-ink/5 pointer-events-none">
      <path d="M-100,480 C200,360 400,300 800,320 C1200,340 1400,380 1700,480" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M-100,440 C200,320 400,260 800,280 C1200,300 1400,340 1700,440" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M-100,400 C200,280 450,220 800,240 C1150,260 1400,300 1700,400" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function CampMapHub({ profile }: CampMapHubProps) {
  const [active, setActive] = useState(1);

  const prev = useCallback(() => setActive((a) => Math.max(0, a - 1)), []);
  const next = useCallback(() => setActive((a) => Math.min(STATIONS.length - 1, a + 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  function handleStationClick(index: number, sectionId: string) {
    if (active !== index) {
      setActive(index);
      // Short delay so pan animation starts before scrolling
      setTimeout(() => scrollTo(sectionId), 200);
    } else {
      scrollTo(sectionId);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-cream">

      {/* Overlay header */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-sm font-bold tracking-wide text-ink hover:text-forest transition-colors">
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
            <Image src="/logo.png" alt={BRAND_NAME} fill className="object-cover" />
          </div>
          {BRAND_NAME}
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold">
          {profile ? (
            <Link href={`/profile/${profile.username}`} className="text-ink/70 hover:text-ink transition-colors">
              @{profile.username}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-ink/70 hover:text-ink transition-colors">Log in</Link>
              <Link href="/signup" className="rounded-card bg-forest px-4 py-1.5 text-cream hover:bg-forest-dark transition-colors text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Accessibility nav */}
      <nav aria-label="Camp map navigation" className="sr-only">
        <ul>
          {STATIONS.map((s) => (
            <li key={s.id}>
              <button onClick={() => scrollTo(s.sectionId)}>{s.label}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Central signage overlay */}
      <div className="absolute inset-x-0 top-[16%] z-20 flex flex-col items-center pointer-events-none sm:top-[20%]">
        <div className="mx-auto w-px h-5 bg-ink/30" />
        <div className="border-2 border-ink/40 bg-cream/90 px-8 py-3 shadow-sm backdrop-blur-sm">
          <p className="font-display text-2xl font-bold tracking-[4px] text-ink sm:text-3xl">{HUB_SIGNAGE}</p>
        </div>
        <div className="mt-4 pointer-events-auto">
          <button
            onClick={() => scrollTo('section-stories')}
            className="inline-flex items-center gap-2 rounded-card border-2 border-ink bg-forest px-6 py-2.5 font-display text-sm font-bold tracking-wide text-cream shadow-card transition-all hover:bg-forest-dark"
          >
            {profile ? 'Explore Stories ↓' : 'Start Exploring ↓'}
          </button>
        </div>
      </div>

      {/* ── DESKTOP: Panoramic scene ── */}
      <div className="hidden sm:block absolute inset-0">
        <SceneBackground />

        <div
          className="absolute bottom-0 left-0 h-full"
          style={{
            width: `${STATIONS.length * 100}vw`,
            transform: `translateX(calc(-${active} * 100vw))`,
            transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="absolute bottom-0 left-0" style={{ width: `${STATIONS.length * 100}vw` }}>
            <GroundConnector />
          </div>

          {STATIONS.map((station, i) => {
            const { Illustration } = station;
            const isActive = active === i;
            return (
              <div
                key={station.id}
                className="absolute top-0 bottom-0 flex flex-col items-center justify-end pb-20"
                style={{ left: `${i * 100}vw`, width: '100vw' }}
              >
                <button
                  onClick={() => handleStationClick(i, station.sectionId)}
                  aria-label={`${isActive ? 'Scroll to' : 'Pan to'} ${station.label}`}
                  className={`group flex flex-col items-center gap-3 transition-all duration-300 ${
                    isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40 hover:opacity-65'
                  }`}
                >
                  <div className="relative w-44 h-56 text-ink drop-shadow-sm">
                    <Illustration />
                  </div>
                  <div className={`border bg-cream/95 px-5 py-2 transition-all ${
                    isActive ? 'border-ink/60 shadow-card' : 'border-ink/20'
                  }`}>
                    <p className="font-display text-sm font-bold tracking-[2px] text-ink uppercase">{station.label}</p>
                    {isActive && (
                      <p className="text-center text-[10px] tracking-wide text-ink/50 mt-0.5">{station.description}</p>
                    )}
                  </div>
                  {isActive && (
                    <p className="text-xs font-semibold text-ink/40 tracking-wider">scroll down ↓</p>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Arrow controls */}
        <button onClick={prev} disabled={active === 0} aria-label="Previous station"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-cream/80 text-ink/60 backdrop-blur-sm transition-all hover:border-ink/40 hover:text-ink disabled:opacity-0">
          ←
        </button>
        <button onClick={next} disabled={active === STATIONS.length - 1} aria-label="Next station"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-cream/80 text-ink/60 backdrop-blur-sm transition-all hover:border-ink/40 hover:text-ink disabled:opacity-0">
          →
        </button>

        {/* Station dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {STATIONS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Station ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${active === i ? 'w-6 bg-ink' : 'w-1.5 bg-ink/30 hover:bg-ink/50'}`} />
          ))}
        </div>
      </div>

      {/* ── MOBILE: Station cards ── */}
      <div className="sm:hidden absolute inset-x-0 bottom-0 top-28 overflow-y-auto px-4 pb-6">
        <div className="mb-4 text-center">
          <p className="font-display text-lg font-bold tracking-[3px] text-ink">{HUB_SIGNAGE}</p>
          <div className="mx-auto mt-2 h-px w-24 bg-ink/20" />
        </div>
        <div className="flex flex-col gap-3">
          {STATIONS.map((station) => {
            const { Illustration } = station;
            return (
              <button
                key={station.id}
                onClick={() => scrollTo(station.sectionId)}
                className="flex items-center gap-4 rounded-card border border-ink/20 bg-white/80 px-4 py-4 shadow-card text-left transition-all hover:shadow-card-hover hover:border-ink/40 active:scale-[0.98]"
              >
                <div className="w-16 h-20 flex-shrink-0 text-ink">
                  <Illustration />
                </div>
                <div>
                  <p className="font-display text-base font-bold text-ink">{station.label}</p>
                  <p className="text-xs font-semibold text-ink/50 mt-0.5">{station.description}</p>
                </div>
                <span className="ml-auto text-ink/30 text-lg">↓</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
