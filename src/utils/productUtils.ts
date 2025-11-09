// src/utils/productUtils.ts

import type { Product, Variant } from "@/types/product";
import { generateSlug } from "@/utils/slug";

export interface PricingResult {
  sellingPrice: number;
  offerPrice: number;
  finalPrice: number;
  discountPercent: number;
  discountAmount: string;
  discountStartDate?: Date;
  discountEndDate?: Date;
  isDiscountActive: boolean;
}

/**
 * Calculate pricing with support for `finalPrice` and `isDiscountActive`
 */
export function calculateProductPricing(
  variant: Variant | null,
  product: Product
): PricingResult {
  const currentVariant =
    variant ||
    product.variantsId.find((v) => v.variants_stock > 0) ||
    product.variantsId[0];

  // Base prices
  const sellingPrice = Number(
    currentVariant?.selling_price ?? product.selling_price ?? 0
  );
  const offerPrice = Number(
    currentVariant?.offer_price ??
      currentVariant?.selling_price ??
      product.selling_price ??
      0
  );

  // Discount dates
  const discountStartDate = currentVariant?.discount_start_date
    ? new Date(currentVariant.discount_start_date)
    : undefined;
  const discountEndDate = currentVariant?.discount_end_date
    ? new Date(currentVariant.discount_end_date)
    : undefined;

  const now = Date.now();
  const offerStart = discountStartDate?.getTime() ?? 0;
  const offerEnd = discountEndDate?.getTime() ?? Infinity;

  // Check backend `isDiscountActive`
  const isDiscountActive = currentVariant?.isDiscountActive === true;
  const finalPriceFromBackend = isDiscountActive
    ? Number(currentVariant?.finalPrice ?? offerPrice)
    : 0;

  // Final Price Logic
  let finalPrice = sellingPrice;
  let isWithinOffer = false;

  if (isDiscountActive && finalPriceFromBackend > 0) {
    // Trust backend: use finalPrice directly
    finalPrice = finalPriceFromBackend;
    isWithinOffer = true;
  } else if (
    offerPrice < sellingPrice &&
    now >= offerStart &&
    now <= offerEnd
  ) {
    // Fallback: use offerPrice + date logic
    finalPrice = offerPrice;
    isWithinOffer = true;
  }

  const discountPercent = isWithinOffer
    ? Math.round(((sellingPrice - finalPrice) / sellingPrice) * 100)
    : 0;

  const discountAmount = isWithinOffer
    ? (sellingPrice - finalPrice).toFixed(0)
    : "0";

  return {
    sellingPrice,
    offerPrice,
    finalPrice,
    discountPercent,
    discountAmount,
    discountStartDate,
    discountEndDate,
    isDiscountActive,
  };
}

// Rest of the functions (unchanged)
export function getProductStock(
  variant: Variant | null,
  product: Product
): number {
  return variant ? variant.variants_stock : product.total_stock;
}

export function isProductPreOrder(
  variant: Variant | null,
  product: Product
): boolean {
  return (
    product.isPreOrder ||
    (product.hasVariants
      ? variant?.isPreOrder ?? false
      : product.variantsId?.[0]?.isPreOrder ?? false)
  );
}

export function generateProductLink(product: Product): string {
  const slug = generateSlug(product.name, product._id);
  return `/product/${slug}`;
}

export function getProductMainImage(product: Product): string {
  return (
    product.images?.[0]?.alterImage?.secure_url ||
    product.images?.[0]?.image?.secure_url ||
    "/assets/fallback.jpg"
  );
}
