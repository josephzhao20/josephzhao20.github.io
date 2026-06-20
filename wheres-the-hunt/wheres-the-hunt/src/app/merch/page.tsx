import Image from 'next/image';
import { getMerchItems } from '@/lib/data/merch';
import type { MerchItem, MerchCategory } from '@/lib/types/database.types';

export const metadata = { title: "More 2 The Hunt — Winning With The Hunt" };

const APPAREL: MerchCategory[] = ['shirt', 'hoodie', 'hat'];

function MerchCard({ item, horizontal = false }: { item: MerchItem; horizontal?: boolean }) {
  return (
    <div className={`flex overflow-hidden rounded-trail border-2 border-ink bg-white shadow-trail ${horizontal ? 'flex-row' : 'flex-col'}`}>
      <div className={`relative overflow-hidden border-ink bg-ridge ${horizontal ? 'h-full w-36 shrink-0 border-r-2' : 'h-52 w-full border-b-2'}`}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {item.category === 'book' ? '📖' : item.category === 'shirt' ? '👕' : item.category === 'hoodie' ? '🧥' : item.category === 'hat' ? '🧢' : '🥤'}
          </div>
        )}
        {!item.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-bold leading-tight text-ink">{item.name}</h3>
        {item.description && (
          <p className="text-sm font-semibold leading-relaxed text-ink-soft line-clamp-2">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          {item.price != null ? (
            <span className="font-display text-lg font-bold text-ink">${item.price.toFixed(2)}</span>
          ) : (
            <span className="text-sm font-semibold text-ink-soft">Price varies</span>
          )}
          {item.buy_url && item.in_stock ? (
            <a
              href={item.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-trail border-2 border-ink bg-forest px-3 py-1.5 text-sm font-bold text-cream shadow-trail transition-transform hover:-translate-y-0.5"
            >
              Buy ↗
            </a>
          ) : item.buy_url ? (
            <span className="text-sm font-semibold text-ink-soft">Sold out</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default async function MerchPage() {
  const items = await getMerchItems();

  const book = items.find(i => i.category === 'book');
  const otherFeatured = items.filter(i => i.is_featured && i.category !== 'book');
  const featured = [...(book ? [book] : []), ...otherFeatured].slice(0, 3);
  const apparel = items.filter(i => APPAREL.includes(i.category));
  const basecamp = items.filter(i => !APPAREL.includes(i.category) && i.category !== 'book');

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">

      {/* Header */}
      <div className="mb-12 border-b-2 border-ink pb-8">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">More 2 The Hunt</h1>
        <p className="mt-3 max-w-xl text-base font-semibold leading-relaxed text-ink-soft">
          Hunting-themed gear and the book that started it all. Everything here is made for people who live for the outdoors.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="py-20 text-center font-semibold text-ink-soft">No items yet — check back soon.</p>
      ) : (
        <div className="space-y-16">

          {/* Featured */}
          {featured.length > 0 && (
            <section>
              <h2 className="mb-5 font-display text-2xl font-bold text-ink">Featured</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {featured.map(item => <MerchCard key={item.id} item={item} />)}
              </div>
            </section>
          )}

          {/* Apparel */}
          {apparel.length > 0 && (
            <section>
              <h2 className="mb-5 font-display text-2xl font-bold text-ink">Apparel</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {apparel.map(item => <MerchCard key={item.id} item={item} />)}
              </div>
            </section>
          )}

          {/* Base Camp */}
          {basecamp.length > 0 && (
            <section>
              <h2 className="mb-1 font-display text-2xl font-bold text-ink">Base Camp</h2>
              <p className="mb-5 text-sm font-semibold text-ink-soft">Gear for the field and the campsite.</p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {basecamp.map(item => <MerchCard key={item.id} item={item} />)}
              </div>
            </section>
          )}

        </div>
      )}

      <div className="mt-16 border-t-2 border-ink pt-8 text-center">
        <p className="font-semibold text-ink-soft">
          Questions about an order?{' '}
          <span className="font-bold text-ink">Reach out to More 2 The Hunt directly.</span>
        </p>
      </div>
    </div>
  );
}
