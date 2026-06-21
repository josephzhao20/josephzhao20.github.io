import Image from 'next/image';
import { getMerchItems } from '@/lib/data/merch';
import type { MerchItem, MerchCategory } from '@/lib/types/database.types';

export const metadata = { title: "The Lodge — Winning With The Hunt" };

const APPAREL: MerchCategory[] = ['shirt', 'hoodie', 'hat'];

function MerchCard({ item }: { item: MerchItem }) {
  return (
    <div className="lodge-card flex flex-col overflow-hidden rounded-lg transition-all duration-150">
      <div className="relative h-52 w-full overflow-hidden border-b-2 border-[#6b3d1a] bg-[#2a1408]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-60">
            {item.category === 'book' ? '📖' : item.category === 'shirt' ? '👕' : item.category === 'hoodie' ? '🧥' : item.category === 'hat' ? '🧢' : '🥤'}
          </div>
        )}
        {!item.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-[#3d1f08] px-3 py-1 text-xs font-bold text-[#f5ede0]">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-bold leading-tight text-[#2a1408]">{item.name}</h3>
        {item.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#6b4423]">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {item.price != null ? (
            <span className="font-display text-lg font-bold text-[#8b4c12]">${item.price.toFixed(2)}</span>
          ) : (
            <span className="text-sm font-semibold text-[#8b6040]">Price varies</span>
          )}
          {item.buy_url && item.in_stock ? (
            <a
              href={item.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="lodge-buy-btn inline-flex items-center gap-1 rounded px-3 py-1.5 text-sm font-bold"
            >
              Buy ↗
            </a>
          ) : item.buy_url ? (
            <span className="text-sm font-semibold text-[#8b6040]">Sold out</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[#4a2510]" />
        <h2 className="lodge-section-title font-display text-2xl font-bold tracking-wide">{children}</h2>
        <div className="h-px flex-1 bg-[#4a2510]" />
      </div>
      {sub && <p className="mt-2 text-center text-sm font-semibold text-[#a07040]">{sub}</p>}
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
    <div className="lodge-bg min-h-screen">
      <div className="lodge-content">

        {/* Header */}
        <div className="lodge-header-bg px-5 py-14 text-center">
          <p className="mb-2 font-display text-sm font-bold uppercase tracking-[4px] text-[#d4891a]">
            Welcome to
          </p>
          <h1 className="font-display text-5xl font-bold text-[#f5ede0] drop-shadow-lg sm:text-6xl">
            The More 2 The Hunt Lodge
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-relaxed text-[#c4a070]">
            Hunting-themed gear and the book that started it all. Made for people who live for the outdoors.
          </p>
          <div className="mx-auto mt-6 h-px max-w-xs bg-gradient-to-r from-transparent via-[#6b3d1a] to-transparent" />
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-5 py-14">
          {items.length === 0 ? (
            <p className="py-20 text-center font-semibold text-[#c4a070]">No items yet — check back soon.</p>
          ) : (
            <div className="space-y-20">

              {/* Featured */}
              {featured.length > 0 && (
                <section>
                  <SectionTitle>Featured</SectionTitle>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {featured.map(item => <MerchCard key={item.id} item={item} />)}
                  </div>
                </section>
              )}

              {/* Apparel */}
              {apparel.length > 0 && (
                <section>
                  <SectionTitle>Apparel</SectionTitle>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                    {apparel.map(item => <MerchCard key={item.id} item={item} />)}
                  </div>
                </section>
              )}

              {/* Base Camp */}
              {basecamp.length > 0 && (
                <section>
                  <SectionTitle sub="Gear for the field and the campsite.">Base Camp</SectionTitle>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                    {basecamp.map(item => <MerchCard key={item.id} item={item} />)}
                  </div>
                </section>
              )}

            </div>
          )}

          {/* Footer note */}
          <div className="mt-20 border-t border-[#4a2510] pt-8 text-center">
            <p className="text-sm font-semibold text-[#a07040]">
              Questions about an order?{' '}
              <span className="font-bold text-[#d4891a]">Reach out to More 2 The Hunt directly.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
