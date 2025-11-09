"use client";

import { useMemo } from "react";
import type { Product, Variant } from "@/types/product";

interface ProductPricingHook {
  variant: Variant | null;
  defaultVariant: Variant;
  sellingPrice: number;
  offerPrice: number;
  finalPrice: number;
  discountPercent: number;
  discountAmount: string;
  isDiscountActive: boolean;
  discountStartDate?: Date;
  discountEndDate?: Date;
  stock: number;
  isPreOrder: boolean;
}

export function useProductPricing(
  product: Product,
  selectedVariant: Variant | null
): ProductPricingHook {
  const defaultVariant = useMemo(
    () =>
      product.variantsId.find((v) => v.variants_stock > 0) ||
      product.variantsId[0],
    [product.variantsId]
  );

  const currentVariant = selectedVariant || defaultVariant;

  // Extract values safely
  const variantSellingPrice = Number(
    currentVariant?.selling_price ?? product.selling_price ?? 0
  );

  const isDiscountActive = currentVariant?.isDiscountActive || false;

  const variantOfferPrice = Number(
    isDiscountActive ? currentVariant.finalPrice : currentVariant?.selling_price
  );
  // Final Price Logic: Use finalPrice if discount active, else offerPrice or sellingPrice
  const finalPrice = useMemo(() => {
    if (isDiscountActive && currentVariant?.finalPrice) {
      return Number(currentVariant.finalPrice);
    }
    return variantOfferPrice < variantSellingPrice
      ? variantOfferPrice
      : variantSellingPrice;
  }, [
    isDiscountActive,
    currentVariant?.finalPrice,
    variantOfferPrice,
    variantSellingPrice,
  ]);

  const discountStartDate = useMemo(() => {
    return currentVariant?.discount_start_date
      ? new Date(currentVariant.discount_start_date)
      : undefined;
  }, [currentVariant]);

  const discountEndDate = useMemo(() => {
    return currentVariant?.discount_end_date
      ? new Date(currentVariant.discount_end_date)
      : undefined;
  }, [currentVariant]);

  const isWithinOffer = useMemo(() => {
    if (isDiscountActive) return true; // Trust backend

    const now = Date.now();
    const offerStart = discountStartDate?.getTime() ?? 0;
    const offerEnd = discountEndDate?.getTime() ?? Infinity;
    return (
      finalPrice < variantSellingPrice && now >= offerStart && now <= offerEnd
    );
  }, [
    isDiscountActive,
    finalPrice,
    variantSellingPrice,
    discountStartDate,
    discountEndDate,
  ]);

  const discountPercent = useMemo(() => {
    if (finalPrice >= variantSellingPrice) return 0;
    return Math.round(
      ((variantSellingPrice - finalPrice) / variantSellingPrice) * 100
    );
  }, [finalPrice, variantSellingPrice]);

  const discountAmount = useMemo(() => {
    return finalPrice < variantSellingPrice
      ? (variantSellingPrice - finalPrice).toFixed(0)
      : "0";
  }, [finalPrice, variantSellingPrice]);

  const stock = useMemo(() => {
    return selectedVariant
      ? selectedVariant.variants_stock
      : product.total_stock;
  }, [selectedVariant, product.total_stock]);

  const isPreOrder = useMemo(() => {
    return (
      product.isPreOrder ||
      (product.hasVariants
        ? currentVariant?.isPreOrder ?? false
        : product.variantsId?.[0]?.isPreOrder ?? false)
    );
  }, [currentVariant, product]);

  return {
    variant: selectedVariant,
    defaultVariant,
    sellingPrice: variantSellingPrice,
    offerPrice: variantOfferPrice,
    finalPrice, // <-- Use this in UI
    discountPercent,
    discountAmount,
    isDiscountActive,
    discountStartDate,
    discountEndDate,
    stock,
    isPreOrder,
  };
}
