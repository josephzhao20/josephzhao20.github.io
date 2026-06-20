import Link from 'next/link';
import type { MapPin } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function AdventurePopupCard({ pin }: { pin: MapPin }) {
  return (
    <Link href={`/adventures/${pin.id}`} className="block">
      <div className="relative h-28 w-full overflow-hidden border-b-2 border-ink bg-stone">
        {pin.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Leaflet popups render outside React's portal tree
          <img src={pin.coverImageUrl} alt={pin.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl">⛰</div>
        )}
        {pin.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full border border-ink bg-rust px-2 py-0.5 text-[10px] font-bold uppercase text-cream">
            Featured
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate font-display text-sm font-bold text-ink">{pin.title}</p>
        {pin.dateVisited && (
          <p className="text-xs font-semibold text-ink-soft">{formatDate(pin.dateVisited)}</p>
        )}
        <p className="truncate text-xs font-semibold text-ink-soft">{pin.locationLabel}</p>
        <div className="mt-1.5 flex items-center justify-between text-xs font-bold text-ink-soft">
          <span>@{pin.username}</span>
          <span>♥ {pin.likeCount}</span>
        </div>
      </div>
    </Link>
  );
}
