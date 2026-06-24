export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
  };
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyProductVariant }[] };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoneyV2;
    product: {
      title: string;
      images: { edges: { node: ShopifyImage }[] };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: ShopifyCartLine }[] };
  cost: {
    totalAmount: ShopifyMoneyV2;
  };
}
