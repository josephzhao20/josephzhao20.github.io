import Link from 'next/link';
import type { UserRow } from '@/lib/types/database.types';
import { SignOutButton } from './AuthMenu';

export function Navbar({ profile }: { profile: UserRow | null }) {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-ink bg-sunset" />
          Where&rsquo;s The Hunt?
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/map" className="hidden text-sm font-bold text-ink-soft hover:text-ink sm:inline">
            Map
          </Link>

          {profile?.upload_approved && (
            <Link href="/upload" className="hidden text-sm font-bold text-ink-soft hover:text-ink sm:inline">
              Upload
            </Link>
          )}

          {profile?.is_admin && (
            <Link href="/admin" className="hidden text-sm font-bold text-ink-soft hover:text-ink sm:inline">
              Admin
            </Link>
          )}

          {profile ? (
            <div className="flex items-center gap-4">
              <Link
                href={`/profile/${profile.username}`}
                className="text-sm font-bold text-ink hover:text-forest"
              >
                @{profile.username}
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-bold text-ink-soft hover:text-ink">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-trail border-2 border-ink bg-forest px-4 py-1.5 text-sm font-bold text-cream shadow-trail transition-transform hover:-translate-y-0.5"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
