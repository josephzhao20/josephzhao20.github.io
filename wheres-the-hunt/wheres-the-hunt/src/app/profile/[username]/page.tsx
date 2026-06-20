import { notFound } from 'next/navigation';
import { getUserByUsername, getUserStats } from '@/lib/data/users';
import { getUserAdventures, getUserHeatmap } from '@/lib/data/adventures';
import { AdventureCard } from '@/components/adventure/AdventureCard';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { HeatmapOnlyMap } from '@/components/map/HeatmapOnlyMap';

interface Params {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Params) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const [adventures, stats, heatmap] = await Promise.all([
    getUserAdventures(user.id),
    getUserStats(user.id),
    getUserHeatmap(user.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-forest font-display text-xl font-bold text-cream">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">@{user.username}</h1>
          {user.bio && <p className="text-sm font-semibold text-ink-soft">{user.bio}</p>}
        </div>
      </div>

      <div className="mt-8">
        <ProfileStats stats={stats} />
      </div>

      {/* Stories grid — leads */}
      <div className="mt-10">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Stories</h2>
        {adventures.length === 0 ? (
          <p className="font-semibold text-ink-soft">No stories shared yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {adventures.map((a) => (
              <AdventureCard key={a.id} adventure={a} />
            ))}
          </div>
        )}
      </div>

      {/* Heatmap — demoted below the grid */}
      <div className="mt-12">
        <h2 className="mb-3 font-display text-base font-bold text-ink-soft">Where they&rsquo;ve been</h2>
        <div className="h-56 w-full overflow-hidden rounded-trail border-2 border-ink shadow-trail">
          <HeatmapOnlyMap counts={heatmap} baseColor="#9B72CF" />
        </div>
      </div>
    </div>
  );
}
