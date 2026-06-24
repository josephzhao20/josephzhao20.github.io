import { getShopifyProducts } from '@/lib/shopify/products';
import { CartProvider } from '@/components/merch/CartContext';
import { CartDrawer } from '@/components/merch/CartDrawer';
import { CartButton } from '@/components/merch/CartButton';
import { ShopifyProductCard } from '@/components/merch/ShopifyProductCard';
import type { ShopifyProduct } from '@/lib/shopify/types';

export const metadata = {
  title: "The Lodge Shop — Winning With The Hunt",
  description: "Shop More 2 the Hunt gear — the book, apparel, and field essentials. Hunting-themed merchandise made for people who live for the outdoors.",
};

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

// Categorise products by Shopify product type or tags
function categorise(products: ShopifyProduct[]) {
  const APPAREL_TYPES = ['shirt', 'hoodie', 'hat', 'apparel', 't-shirt', 'sweatshirt', 'cap'];
  const BOOK_TYPES    = ['book', 'books'];

  const isApparel = (p: ShopifyProduct) =>
    APPAREL_TYPES.some(t =>
      p.productType.toLowerCase().includes(t) ||
      p.tags.some(tag => tag.toLowerCase().includes(t)) ||
      p.title.toLowerCase().match(/shirt|hoodie|hat|cap|tee|sweatshirt/)
    );

  const isBook = (p: ShopifyProduct) =>
    BOOK_TYPES.some(t =>
      p.productType.toLowerCase().includes(t) ||
      p.tags.some(tag => tag.toLowerCase().includes(t)) ||
      p.title.toLowerCase().includes('book') ||
      p.title.toLowerCase().includes('wildlife') ||
      p.title.toLowerCase().includes('winning with')
    );

  const book    = products.find(isBook);
  const apparel = products.filter(p => isApparel(p));
  const basecamp = products.filter(p => !isBook(p) && !isApparel(p));
  const featured = [
    ...(book ? [book] : []),
    ...products.filter(p => p.tags.includes('featured') && !isBook(p)),
  ].slice(0, 3);

  return { book, apparel, basecamp, featured };
}

export default async function MerchPage() {
  let products: ShopifyProduct[] = [];
  let fetchError = false;

  try {
    products = await getShopifyProducts(50);
    console.log('[Lodge] Loaded', products.length, 'products');
  } catch (err) {
    fetchError = true;
    console.error('[Lodge] Fetch failed:', String(err));
  }

  const { featured, apparel, basecamp } = categorise(products);

  return (
    <CartProvider>
      <CartDrawer />

      <div className="lodge-bg min-h-screen">
        <div className="lodge-content">

          {/* Header */}
          <div className="lodge-header-bg px-5 py-14 text-center">
            <p className="mb-2 font-display text-sm font-bold uppercase tracking-[4px] text-[#FF9900]">
              Welcome to
            </p>
            <h1 className="font-display text-5xl font-bold text-[#f5ede0] drop-shadow-lg sm:text-6xl">
              The Lodge Shop
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-relaxed text-[#c4a070]">
              Hunting-themed gear and the book that started it all. Made for people who live for the outdoors.
            </p>
            <div className="mx-auto mt-6 h-px max-w-xs bg-gradient-to-r from-transparent via-[#6b3d1a] to-transparent" />
            <div className="mt-6 flex justify-center">
              <CartButton />
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-6xl px-5 py-14">
            {fetchError ? (
              <p className="py-20 text-center font-semibold text-[#c4a070]">
                Unable to load products right now — please try again shortly.
              </p>
            ) : products.length === 0 ? (
              <p className="py-20 text-center font-semibold text-[#c4a070]">
                No items yet — check back soon.
              </p>
            ) : (
              <div className="space-y-20">

                {featured.length > 0 && (
                  <section>
                    <SectionTitle>Featured</SectionTitle>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      {featured.map(p => <ShopifyProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}

                {apparel.length > 0 && (
                  <section>
                    <SectionTitle>Apparel</SectionTitle>
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                      {apparel.map(p => <ShopifyProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}

                {basecamp.length > 0 && (
                  <section>
                    <SectionTitle sub="Gear for the field and the campsite.">Base Camp</SectionTitle>
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                      {basecamp.map(p => <ShopifyProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}

                {/* Fallback: show everything if categorisation produces nothing */}
                {featured.length === 0 && apparel.length === 0 && basecamp.length === 0 && (
                  <section>
                    <SectionTitle>All Products</SectionTitle>
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                      {products.map(p => <ShopifyProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}

              </div>
            )}

            <div className="mt-20 border-t border-[#4a2510] pt-8 text-center">
              <p className="text-sm font-semibold text-[#a07040]">
                Questions about an order?{' '}
                <a href="mailto:winningwiththehunt@gmail.com" className="font-bold text-[#FF9900] hover:underline">
                  Reach out to More 2 The Hunt directly.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CartProvider>
  );
}
