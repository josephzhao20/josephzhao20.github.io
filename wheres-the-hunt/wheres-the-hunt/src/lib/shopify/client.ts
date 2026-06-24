import { SHOPIFY_ENDPOINT, SHOPIFY_TOKEN } from './config';

export async function shopifyFetch<T = unknown>({
  query,
  variables,
  cache,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<T> {
  const res = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
    cache,
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json() as { data: T; errors?: { message: string }[] };

  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join(', '));
  }

  return json.data;
}
