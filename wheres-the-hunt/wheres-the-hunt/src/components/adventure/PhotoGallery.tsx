'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { AdventurePhotoRow } from '@/lib/types/database.types';

export function PhotoGallery({ photos, title }: { photos: AdventurePhotoRow[]; title: string }) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-trail border-2 border-ink bg-stone sm:aspect-[16/9]">
        <Image
          src={photos[active].image_url}
          alt={`${title} — photo ${active + 1} of ${photos.length}`}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                i === active ? 'border-rust' : 'border-ink/30'
              }`}
            >
              <Image src={photo.image_url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
