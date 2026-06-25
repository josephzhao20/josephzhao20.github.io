import type { UserStatsRow } from '@/lib/types/database.types';

export function ProfileStats({ stats }: { stats: UserStatsRow | null }) {
  const items = [
    { label: 'Countries', value: stats?.countries_visited ?? 0, emoji: '🌍' },
    { label: 'Stories', value: stats?.total_adventures ?? 0, emoji: '📖' },
    { label: 'Photos', value: stats?.total_photos ?? 0, emoji: '📷' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center rounded-card bg-white p-4 text-center shadow-card"
        >
          <span className="mb-1 text-xl">{item.emoji}</span>
          <p className="font-display text-2xl font-bold text-forest sm:text-3xl">{item.value}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-stone">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
