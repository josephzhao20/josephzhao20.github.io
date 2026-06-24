'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ShopifyCart } from '@/lib/shopify/types';
import { CART_CREATE, CART_LINES_ADD, CART_LINES_REMOVE, CART_LINES_UPDATE, GET_CART } from '@/lib/shopify/queries';
import { SHOPIFY_ENDPOINT, SHOPIFY_TOKEN } from '@/lib/shopify/config';

const CART_ID_KEY = 'wwth_shopify_cart_id';

async function storefrontFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json() as { data: T };
  return json.data;
}

interface CartContextValue {
  cart: ShopifyCart | null;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  itemCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Rehydrate cart from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem(CART_ID_KEY);
    if (!savedId) return;
    storefrontFetch<{ cart: ShopifyCart | null }>(GET_CART, { cartId: savedId })
      .then(data => { if (data.cart) setCart(data.cart); })
      .catch(() => localStorage.removeItem(CART_ID_KEY));
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      const existingCartId = cart?.id ?? localStorage.getItem(CART_ID_KEY);
      let newCart: ShopifyCart;

      if (existingCartId) {
        const data = await storefrontFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(
          CART_LINES_ADD,
          { cartId: existingCartId, lines: [{ merchandiseId: variantId, quantity }] }
        );
        newCart = data.cartLinesAdd.cart;
      } else {
        const data = await storefrontFetch<{ cartCreate: { cart: ShopifyCart } }>(
          CART_CREATE,
          { lines: [{ merchandiseId: variantId, quantity }] }
        );
        newCart = data.cartCreate.cart;
        localStorage.setItem(CART_ID_KEY, newCart.id);
      }

      setCart(newCart);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeFromCart = useCallback(async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      const data = await storefrontFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(
        CART_LINES_REMOVE,
        { cartId: cart.id, lineIds: [lineId] }
      );
      setCart(data.cartLinesRemove.cart);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    if (quantity <= 0) { await removeFromCart(lineId); return; }
    setLoading(true);
    try {
      const data = await storefrontFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(
        CART_LINES_UPDATE,
        { cartId: cart.id, lines: [{ id: lineId, quantity }] }
      );
      setCart(data.cartLinesUpdate.cart);
    } finally {
      setLoading(false);
    }
  }, [cart, removeFromCart]);

  const itemCount = cart?.lines.edges.reduce((sum, e) => sum + e.node.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{
      cart, cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      addToCart, removeFromCart, updateQuantity,
      itemCount, loading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
