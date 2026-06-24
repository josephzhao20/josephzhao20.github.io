'use client';

import { useEffect, useState } from 'react';
import { useCart } from './CartContext';

export function CartButton() {
  const { openCart, itemCount } = useCart();
  const [pulse, setPulse] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);

  // Pulse animation whenever item count increases
  useEffect(() => {
    if (itemCount > prevCount) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  return (
    <>
      {/* Fixed floating cart button — always visible while scrolling */}
      <button
        onClick={openCart}
        aria-label={`Open cart (${itemCount} item${itemCount !== 1 ? 's' : ''})`}
        className={`fixed bottom-6 right-6 z-[199] flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 ${
          pulse ? 'scale-125' : 'scale-100'
        } ${itemCount > 0 ? 'bg-[#d4891a]' : 'bg-[#8b4c12]'}`}
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 3px #6b3d1a' }}
      >
        <span className="text-2xl">🛒</span>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f5ede0] text-xs font-bold text-[#8b4c12] shadow">
            {itemCount}
          </span>
        )}
      </button>

      {/* Inline cart button in the header */}
      <button
        onClick={openCart}
        aria-label="Open cart"
        className="relative flex items-center gap-2 rounded border border-[#6b3d1a]/50 bg-[#3d1f08]/40 px-4 py-2 text-sm font-bold text-[#f5ede0] transition-colors hover:bg-[#3d1f08]/70"
      >
        🛒 Cart
        {itemCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d4891a] text-[10px] font-bold text-white">
            {itemCount}
          </span>
        )}
      </button>
    </>
  );
}
