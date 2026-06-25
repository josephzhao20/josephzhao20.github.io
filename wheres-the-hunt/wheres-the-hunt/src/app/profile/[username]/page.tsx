import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUserByUsername, getUserStats } from '@/lib/data/users';
import { getUserAdventures, getUserHeatmap } from '@/lib/data/adventures';
import { getCurrentProfile } from '@/lib/auth/roles';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { HeatmapOnlyMap } from '@/components/map/HeatmapOnlyMap';
import { LinkButton } from '@/components/ui/Button';

interface Params {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Params) {
  const { username } = await params;

  const [user, currentProfile] = await Promise.all([
    getUserByUsername(username),
    getCurrentProfile(),
  ]);

  if (!user) notFound();

  const isOwner = currentProfile?.id === user.id;

  const [adventures, stats, heatmap] = await Promise.all([
    getUserAdventures(user.id),
    getUserStats(user.id),
    getUserHeatmap(user.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">

      {/* Profile header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Avatar */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-forest font-display text-2xl font-bold text-cream shadow-card-lg ring-4 ring-forest/20">
          {user.username.slice(0, 2).toUpperCase()}
        </div>

        {/* Name + bio */}
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            @{user.username}
          </h1>

          {user.bio ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{user.bio}</p>
          ) : isOwner ? (
            <p className="mt-2 text-sm text-stone italic">
              No bio yet.{' '}
              <span className="text-forest not-italic font-semibold">
                Add one in your account settings.
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-stone italic">No bio yet.</p>
          )}

          {isOwner && (
            <div className="mt-4 flex flex-wrap gap-3">
              <LinkButton href="/upload" size="sm" variant="secondary">
                + Share a story
              </LinkButton>
              <LinkButton href="/map" size="sm" variant="ghost">
                Explore
              </LinkButton>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <ProfileStats stats={stats} />
      </div>

      {/* Stories grid */}
      <div className="mt-10">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Stories</h2>

        {adventures.length === 0 ? (
          <div className="flex flex-col items-center rounded-card border border-stone/30 bg-white py-16 text-center shadow-card">
            <span className="mb-4 text-5xl">🏕️</span>
            <p className="font-display text-lg font-bold text-ink">
              {isOwner ? 'Your story starts here.' : 'No stories shared yet.'}
            </p>
            <p className="mt-2 max-w-sm text-sm font-semibold text-ink-soft">
              {isOwner
                ? 'Pin your first hunt, catch, or outdoor memory to the map.'
                : 'Check back later — adventures are on the way.'}
            </p>
            {isOwner && (
              <div className="mt-6">
                <LinkButton href="/upload" size="md" variant="secondary">
                  Share your first story
                </LinkButton>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {adventures.map((a) => (
              <AdventureCard key={a.id} adventure={a} />
            ))}
          </div>
        )}
      </div>

      {/* Heatmap — only show if they have stories */}
      {adventures.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-3 font-display text-base font-bold text-ink-soft">
            Where {isOwner ? "you've" : "they've"} been
          </h2>
          <div className="h-56 w-full overflow-hidden rounded-card shadow-card">
            <HeatmapOnlyMap counts={heatmap} baseColor="#9B72CF" />
          </div>
        </div>
      )}
    </div>
  );
}
