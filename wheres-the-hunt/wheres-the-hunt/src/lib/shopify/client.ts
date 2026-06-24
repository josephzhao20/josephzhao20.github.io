// Values are read at request time so env var updates take effect without rebuilding
function getDomain() { return process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ''; }
function getToken()  { return process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? ''; }

export async function shopifyFetch<T = unknown>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const domain = getDomain();
  const token = getToken();
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // cache product data for 60s server-side
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
