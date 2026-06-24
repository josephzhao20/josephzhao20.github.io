'use client';

import { useCart } from './CartContext';

export function CartButton() {
  const { openCart, itemCount } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart (${itemCount} items)`}
      className="relative flex items-center gap-2 rounded border border-[#6b3d1a]/50 bg-[#3d1f08]/30 px-3 py-2 text-sm font-bold text-[#f5ede0] hover:bg-[#3d1f08]/50 transition-colors"
    >
      🛒 Cart
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4891a] text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
