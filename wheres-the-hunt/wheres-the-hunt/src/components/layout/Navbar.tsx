'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { UserRow } from '@/lib/types/database.types';
import { SignOutButton } from './AuthMenu';

export function Navbar({ profile }: { profile: UserRow | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-ink bg-sunset" />
          Winning With The Hunt
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 sm:flex">
          <Link href="/map" className="text-sm font-bold text-ink-soft hover:text-ink">Map</Link>
          <Link href="/merch" className="text-sm font-bold text-ink-soft hover:text-ink">Merch</Link>
          {profile && profile.upload_approved && (
            <Link href="/upload" className="text-sm font-bold text-ink-soft hover:text-ink">Upload</Link>
          )}
          {profile?.is_admin && (
            <Link href="/admin" className="text-sm font-bold text-ink-soft hover:text-ink">Admin</Link>
          )}
          {profile ? (
            <div className="flex items-center gap-4">
              <Link href={`/profile/${profile.username}`} className="text-sm font-bold text-ink hover:text-forest">
                @{profile.username}
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-bold text-ink-soft hover:text-ink">Log in</Link>
              <Link href="/signup" className="rounded-trail border-2 border-ink bg-forest px-4 py-1.5 text-sm font-bold text-cream shadow-trail transition-transform hover:-translate-y-0.5">
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
          <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="border-t-2 border-ink bg-cream px-5 py-4 sm:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/map" className="text-base font-bold text-ink" onClick={() => setOpen(false)}>Map</Link>
            <Link href="/merch" className="text-base font-bold text-ink" onClick={() => setOpen(false)}>Merch</Link>
            {profile && profile.upload_approved && (
              <Link href="/upload" className="text-base font-bold text-ink" onClick={() => setOpen(false)}>Upload</Link>
            )}
            {profile?.is_admin && (
              <Link href="/admin" className="text-base font-bold text-ink" onClick={() => setOpen(false)}>Admin</Link>
            )}
            {profile ? (
              <>
                <Link href={`/profile/${profile.username}`} className="text-base font-bold text-ink" onClick={() => setOpen(false)}>
                  @{profile.username}
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-base font-bold text-ink" onClick={() => setOpen(false)}>Log in</Link>
                <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-trail border-2 border-ink bg-forest py-2.5 text-base font-bold text-cream shadow-trail" onClick={() => setOpen(false)}>
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
