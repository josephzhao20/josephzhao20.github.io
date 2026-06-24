'use client';

import Image from 'next/image';
import { useCart } from './CartContext';

function formatMoney(amount: string, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));
}

export function CartDrawer() {
  const { cart, cartOpen, closeCart, removeFromCart, updateQuantity, loading } = useCart();
  const lines = cart?.lines.edges.map(e => e.node) ?? [];

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/50"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[201] flex h-full w-full max-w-sm flex-col bg-[#f5ede0] shadow-2xl transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#6b3d1a]/30 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-[#2a1408]">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded p-1 text-[#6b4423] hover:text-[#2a1408]"
          >
            ✕
          </button>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="mt-8 text-center text-sm font-semibold text-[#8b6040]">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map(line => {
                const image = line.merchandise.product.images.edges[0]?.node;
                return (
                  <li key={line.id} className="flex gap-3">
                    {image && (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-[#6b3d1a]/30">
                        <Image src={image.url} alt={image.altText ?? line.merchandise.product.title} fill className="object-cover" sizes="64px" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="text-sm font-bold text-[#2a1408] leading-tight">{line.merchandise.product.title}</p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-xs text-[#8b6040]">{line.merchandise.title}</p>
                      )}
                      <p className="text-sm font-bold text-[#8b4c12]">
                        {formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-[#6b3d1a]/40 text-[#6b4423] hover:bg-[#6b3d1a]/10"
                          aria-label="Decrease quantity"
                        >−</button>
                        <span className="min-w-[20px] text-center text-sm font-semibold text-[#2a1408]">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-[#6b3d1a]/40 text-[#6b4423] hover:bg-[#6b3d1a]/10"
                          aria-label="Increase quantity"
                        >+</button>
                        <button
                          onClick={() => removeFromCart(line.id)}
                          className="ml-auto text-xs text-[#8b6040] hover:text-red-700"
                          aria-label="Remove item"
                        >Remove</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && cart && (
          <div className="border-t border-[#6b3d1a]/30 px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-[#6b4423]">Total</span>
              <span className="font-display text-lg font-bold text-[#8b4c12]">
                {formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className={`block w-full rounded py-3 text-center font-bold text-[#f5ede0] transition-opacity ${
                loading ? 'bg-[#8b4c12]/60 pointer-events-none' : 'bg-[#8b4c12] hover:bg-[#a05a1a]'
              }`}
            >
              {loading ? 'Updating…' : 'Checkout →'}
            </a>
            <p className="mt-2 text-center text-xs text-[#8b6040]">
              Secure checkout powered by Shopify
            </p>
          </div>
        )}
      </div>
    </>
  );
}
