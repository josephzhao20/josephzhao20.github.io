import { shopifyFetch } from './client';
import { GET_PRODUCTS } from './queries';
import type { ShopifyProduct } from './types';

interface ProductsResponse {
  products: { edges: { node: ShopifyProduct }[] };
}

export async function getShopifyProducts(limit = 50): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ProductsResponse>({
    query: GET_PRODUCTS,
    variables: { first: limit },
  });
  return data.products.edges.map(e => e.node);
}
