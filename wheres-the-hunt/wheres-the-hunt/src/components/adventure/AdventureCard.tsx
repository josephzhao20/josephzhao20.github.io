import Image from 'next/image';
import Link from 'next/link';
import type { AdventureWithStats } from '@/lib/types/database.types';
import { locationLabel } from '@/lib/types';

export function AdventureCard({ adventure }: { adventure: AdventureWithStats }) {
  return (
    <Link
      href={`/adventures/${adventure.id}`}
      className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="relative h-48 w-full overflow-hidden bg-stone/30">
        {adventure.cover_image_url ? (
          <Image
            src={adventure.cover_image_url}
            alt={adventure.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-4xl text-stone">
            ⛰
          </div>
        )}
        {adventure.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-rust px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cream">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-bold leading-snug text-ink group-hover:text-forest transition-colors">
          {adventure.title}
        </h3>
        <p className="text-xs font-semibold text-stone">{locationLabel(adventure)}</p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-cream-dark">
          <span className="text-xs font-bold text-earth">@{adventure.username}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone">
            ♥ {adventure.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
