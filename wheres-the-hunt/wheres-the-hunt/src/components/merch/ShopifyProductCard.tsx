'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from './CartContext';
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types';

function formatMoney(amount: string, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));
}

export function ShopifyProductCard({ product }: { product: ShopifyProduct }) {
  const { addToCart, loading } = useCart();
  const [adding, setAdding] = useState(false);

  const variants = product.variants.edges.map(e => e.node);
  const hasMultipleVariants = variants.length > 1;
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>(variants[0]);

  const image = product.images.edges[0]?.node;
  const inStock = selectedVariant?.availableForSale ?? false;

  async function handleAddToCart() {
    if (!selectedVariant || !inStock) return;
    setAdding(true);
    try {
      await addToCart(selectedVariant.id, 1);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="lodge-card flex flex-col overflow-hidden rounded-lg transition-all duration-150">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden border-b-2 border-[#6b3d1a] bg-[#2a1408]">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-60">🏕️</div>
        )}
        {!product.availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-[#3d1f08] px-3 py-1 text-xs font-bold text-[#f5ede0]">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-bold leading-tight text-[#2a1408]">
          {product.title}
        </h3>
        {product.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#6b4423]">
            {product.description}
          </p>
        )}

        {/* Variant selector */}
        {hasMultipleVariants && (
          <select
            value={selectedVariant?.id}
            onChange={e => {
              const v = variants.find(v => v.id === e.target.value);
              if (v) setSelectedVariant(v);
            }}
            aria-label="Select variant"
            className="mt-1 w-full rounded border border-[#6b3d1a]/40 bg-[#f5ede0] px-2 py-1.5 text-sm text-[#2a1408] focus:outline-none focus:ring-1 focus:ring-[#8b4c12]"
          >
            {variants.map(v => (
              <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                {v.title}{!v.availableForSale ? ' — Sold out' : ''}
              </option>
            ))}
          </select>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-bold text-[#8b4c12]">
            {formatMoney(
              selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount,
              selectedVariant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode
            )}
          </span>

          {inStock ? (
            <button
              onClick={handleAddToCart}
              disabled={adding || loading}
              className="lodge-buy-btn inline-flex items-center gap-1 rounded px-3 py-1.5 text-sm font-bold disabled:opacity-60"
              aria-label={`Add ${product.title} to cart`}
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
          ) : (
            <span className="text-sm font-semibold text-[#8b6040]">Sold out</span>
          )}
        </div>
      </div>
    </div>
  );
}
