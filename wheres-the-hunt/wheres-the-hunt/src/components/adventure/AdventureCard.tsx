import Image from 'next/image';
import Link from 'next/link';
import type { AdventureWithStats } from '@/lib/types/database.types';
import { locationLabel } from '@/lib/types';
import { Tag } from '@/components/ui/Tag';

export function AdventureCard({ adventure }: { adventure: AdventureWithStats }) {
  return (
    <Link
      href={`/adventures/${adventure.id}`}
      className="group flex flex-col overflow-hidden rounded-trail border-2 border-ink bg-white shadow-trail transition-transform hover:-translate-y-1"
    >
      <div className="relative h-44 w-full overflow-hidden border-b-2 border-ink bg-stone">
        {adventure.cover_image_url ? (
          <Image
            src={adventure.cover_image_url}
            alt={adventure.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-ink-soft">
            ⛰
          </div>
        )}
        {adventure.is_featured && (
          <span className="absolute left-3 top-3 rounded-full border-2 border-ink bg-rust px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-cream">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-bold leading-tight text-ink">{adventure.title}</h3>
        <p className="text-sm font-semibold text-ink-soft">{locationLabel(adventure)}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <Tag tone="forest">@{adventure.username}</Tag>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-ink-soft">
            ♥ {adventure.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
