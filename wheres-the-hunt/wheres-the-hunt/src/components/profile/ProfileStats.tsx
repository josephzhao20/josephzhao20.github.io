import type { UserStatsRow } from '@/lib/types/database.types';

export function ProfileStats({ stats }: { stats: UserStatsRow | null }) {
  const items = [
    { label: 'Countries visited', value: stats?.countries_visited ?? 0 },
    { label: 'Adventures', value: stats?.total_adventures ?? 0 },
    { label: 'Photos', value: stats?.total_photos ?? 0 },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-trail border-2 border-ink bg-white p-4 text-center shadow-trail"
        >
          <p className="font-mono text-3xl font-bold text-forest">{item.value}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
