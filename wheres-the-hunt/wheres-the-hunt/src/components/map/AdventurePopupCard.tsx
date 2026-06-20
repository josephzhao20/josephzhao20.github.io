import Link from 'next/link';
import type { MapPin } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function AdventurePopupCard({ pin }: { pin: MapPin }) {
  return (
    <Link href={`/adventures/${pin.id}`} className="block">
      <div className="relative h-28 w-full overflow-hidden bg-stone/30">
        {pin.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pin.coverImageUrl} alt={pin.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-stone">⛰</div>
        )}
        {pin.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full bg-rust px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-cream">
            Featured
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-display text-sm font-bold leading-tight text-ink">{pin.title}</p>
        {pin.dateVisited && (
          <p className="mt-0.5 text-[11px] font-semibold text-stone">{formatDate(pin.dateVisited)}</p>
        )}
        <p className="mt-0.5 truncate text-[11px] font-semibold text-stone">{pin.locationLabel}</p>
        <div className="mt-2 flex items-center justify-between border-t border-cream-dark pt-2">
          <span className="text-[11px] font-bold text-earth">@{pin.username}</span>
          <span className="text-[11px] font-semibold text-stone">♥ {pin.likeCount}</span>
        </div>
      </div>
    </Link>
  );
}
