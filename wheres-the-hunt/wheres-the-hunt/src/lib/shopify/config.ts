// Storefront API credentials — intentionally public (same as Buy Button embed code)
export const SHOPIFY_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'bn1q6k-zq.myshopify.com';
export const SHOPIFY_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || 'eca4da324d51186104512b11301581dc';
export const SHOPIFY_ENDPOINT =
  `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;
