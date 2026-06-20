import Image from 'next/image';
import { getMerchItems } from '@/lib/data/merch';
import { LinkButton } from '@/components/ui/Button';
import type { MerchItem, MerchCategory } from '@/lib/types/database.types';

export const metadata = { title: "More 2 The Hunt — Winning With The Hunt" };

const CATEGORY_LABEL: Record<MerchCategory, string> = {
  book: 'Book', shirt: 'Shirt', hoodie: 'Hoodie', hat: 'Hat', tumbler: 'Tumbler',
};

const CATEGORY_EMOJI: Record<MerchCategory, string> = {
  book: '📖', shirt: '👕', hoodie: '🧥', hat: '🧢', tumbler: '🥤',
};

function MerchCard({ item }: { item: MerchItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-trail border-2 border-ink bg-white shadow-trail">
      <div className="relative h-56 w-full overflow-hidden border-b-2 border-ink bg-ridge">
        {item.image_url ? (
          <Image src={item.image_url} alt={item.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {CATEGORY_EMOJI[item.category]}
          </div>
        )}
        {!item.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <span className="rounded-full bg-ink px-3 py-1 text-sm font-bold text-cream">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight text-ink">{item.name}</h3>
          <span className="mt-0.5 shrink-0 rounded-full border border-ink/20 bg-cream px-2 py-0.5 text-xs font-bold text-ink-soft">
            {CATEGORY_EMOJI[item.category]} {CATEGORY_LABEL[item.category]}
          </span>
        </div>

        {item.description && (
          <p className="text-sm font-semibold leading-relaxed text-ink-soft">{item.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          {item.price != null ? (
            <span className="font-display text-xl font-bold text-ink">${item.price.toFixed(2)}</span>
          ) : (
            <span className="text-sm font-semibold text-ink-soft">Price varies</span>
          )}
          {item.buy_url && item.in_stock ? (
            <a
              href={item.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-trail border-2 border-ink bg-forest px-4 py-2 text-sm font-bold text-cream shadow-trail transition-transform hover:-translate-y-0.5"
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

  const categories = ['book', 'shirt', 'hoodie', 'hat', 'tumbler'] as MerchCategory[];
  const grouped = Object.fromEntries(
    categories.map(cat => [cat, items.filter(i => i.category === cat)])
  ) as Record<MerchCategory, MerchItem[]>;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* Header */}
      <div className="mb-10 border-b-2 border-ink pb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-ink-soft">Presented by Where&rsquo;s The Hunt?</p>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">More 2 The Hunt</h1>
        <p className="mt-3 max-w-xl text-base font-semibold leading-relaxed text-ink-soft">
          Hunting-themed gear and the book that started it all. Everything here is made for people who live for the outdoors.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="py-20 text-center font-semibold text-ink-soft">No items yet — check back soon.</p>
      ) : (
        <div className="space-y-14">
          {categories.map(cat => {
            const catItems = grouped[cat];
            if (catItems.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="mb-5 flex items-center gap-3 font-display text-2xl font-bold text-ink">
                  <span>{CATEGORY_EMOJI[cat]}</span>
                  {CATEGORY_LABEL[cat]}{catItems.length > 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {catItems.map(item => <MerchCard key={item.id} item={item} />)}
                </div>
              </section>
            );
          })}
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
