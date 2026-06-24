// Reusable fragments
const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    cost {
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                title
                images(first: 1) { edges { node { url altText } } }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          availableForSale
          productType
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 3) {
            edges { node { url altText } }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;

export const GET_CART = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFragment }
  }
`;
