'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { UserRow } from '@/lib/types/database.types';
import { SignOutButton } from './AuthMenu';

export function Navbar({ profile }: { profile: UserRow | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-forest-dark shadow-nav">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full">
            <Image src="/logo.png" alt="Winning With The Hunt" fill className="object-cover" />
          </div>
          <span className="font-display text-base font-bold tracking-wide text-cream">Winning With The Hunt</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">Home</Link>
          <Link href="/upload" className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">Share Your Story</Link>
          <Link href="/map" className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">Explore</Link>
          <Link href="/merch" className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">The Lodge Shop</Link>
          <Link href="/about" className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">Our Mission</Link>
          {profile?.is_admin && (
            <Link href="/admin" className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">Admin</Link>
          )}
          {profile ? (
            <div className="flex items-center gap-4 border-l border-cream/20 pl-6">
              <Link href={`/profile/${profile.username}`} className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">
                View Profile
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-cream/20 pl-6">
              <Link href="/login" className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors">Log in</Link>
              <Link href="/signup" className="rounded-card bg-rust px-4 py-1.5 text-sm font-bold text-cream transition-all hover:bg-rust-dark">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col items-center justify-center gap-1.5 sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`block h-0.5 w-6 bg-cream transition-all duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-cream transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-cream transition-all duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-cream/10 bg-forest-dark px-5 py-5 sm:hidden">
          <div className="flex flex-col gap-5">
            <Link href="/" className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/upload" className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>Share Your Story</Link>
            <Link href="/map" className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>Explore</Link>
            <Link href="/merch" className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>The Lodge Shop</Link>
            <Link href="/about" className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>Our Mission</Link>
            {profile?.is_admin && (
              <Link href="/admin" className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>Admin</Link>
            )}
            {profile ? (
              <>
                <Link href={`/profile/${profile.username}`} className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>
                  View Profile
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-base font-semibold text-cream/80 hover:text-cream" onClick={() => setOpen(false)}>Log in</Link>
                <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-card bg-rust py-2.5 text-base font-bold text-cream" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
