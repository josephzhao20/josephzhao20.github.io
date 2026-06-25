'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const VIDEO_ID = 'WnYnZBp2IX0';
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;
const EMBED_SRC = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;

export function HeroVideo() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modalOpen, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <>
      {/* Thumbnail card — fast-loading, no iframe cost */}
      <button
        onClick={openModal}
        className="group relative aspect-video w-full overflow-hidden rounded-xl border border-stone-800 shadow-2xl transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
        aria-label="Play: More 2 The Hunt – Introduction"
      >
        {/* Thumbnail */}
        <Image
          src={THUMBNAIL}
          alt="More 2 The Hunt video thumbnail"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 448px, 512px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white sm:h-20 sm:w-20">
            {/* Triangle play icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7 translate-x-0.5 text-forest sm:h-9 sm:w-9"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Channel label */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded bg-black/60 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            More 2 the Hunt
          </span>
        </div>
      </button>

      {/* Modal overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
              aria-label="Close video"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>

            {/* Iframe */}
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-stone-800 shadow-2xl">
              <iframe
                src={EMBED_SRC}
                title="More 2 The Hunt - Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
