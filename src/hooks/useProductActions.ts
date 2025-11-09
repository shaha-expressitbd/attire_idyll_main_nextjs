"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import type { Product, Variant } from "@/types/product";
import type { TCartItem } from "@/lib/features/cart/cartSlice";
import { useCart } from "@/hooks/useCart";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductActionsHook {
  addToCartOrPreOrder: (
    variant: Variant | null,
    modalQty?: number,
    finalPrice?: number
  ) => boolean;
  handleWishlistToggle: () => void;
  isWishlisted: boolean;
}

export function useProductActions(
  product: Product,
  selectedVariant: Variant | null,
  defaultVariant: Variant,
  quantity: number,
  isDiscountActive: boolean,
  finalPrice: number,
  sellingPrice: number
): ProductActionsHook {
  const {
    addItem,
    openCart,
    items: cartItems,
    clearCart: clearRegularCart,
  } = useCart();
  const {
    addItem: addPreorderItem,
    item: preorderItem,
    clearCart: clearPreorderCart,
  } = usePreorderCart();
  const {
    items: wishlistItems,
    addItem: addWishlistItem,
    removeItem: removeWishlistItem,
    openWishlist,
  } = useWishlist();

  const hasVariants = product.hasVariants;
  const variants = product.variantsId;

  const isWishlisted = useCallback(() => {
    const currentVariantId = hasVariants
      ? selectedVariant?._id || defaultVariant?._id
      : product.variantsId[0]._id;
    return wishlistItems.some((i) => i._id === currentVariantId);
  }, [
    wishlistItems,
    hasVariants,
    selectedVariant,
    defaultVariant,
    product.variantsId,
  ]);

  const addToCartOrPreOrder = useCallback(
    (
      variant: Variant | null,
      modalQty?: number,
      overrideFinalPrice?: number
    ) => {
      const price = overrideFinalPrice ?? finalPrice;

      if (product.isPreOrder || (hasVariants && variant?.isPreOrder)) {
        if (preorderItem) {
          toast.error("আপনার চেকআউটে ইতিমধ্যে একটা প্রি-অর্ডার প্রোডাক্ট আছে।");
          return false;
        }

        // Check if regular cart has items
        if (cartItems.length > 0) {
          toast.error(
            "আপনার রেগুলার কার্টে প্রোডাক্ট আছে। প্রি-অর্ডার করতে হলে রেগুলার কার্ট ক্লিয়ার করুন।"
          );
          return false;
        }

        const now = Date.now();
        const offerStart = variant?.discount_start_date
          ? new Date(variant.discount_start_date).getTime()
          : 0;
        const offerEnd = variant?.discount_end_date
          ? new Date(variant.discount_end_date).getTime()
          : 0;
        const variantSellingPrice = variant
          ? Number(variant.selling_price)
          : Number(product.selling_price ?? 0);
        const variantOfferPrice = variant
          ? Number(variant.offer_price)
          : Number(product.selling_price ?? 0);
        const isWithinOfferPre =
          variantOfferPrice < variantSellingPrice &&
          now >= offerStart &&
          now <= offerEnd;

        const finalPrice = isWithinOfferPre
          ? variantOfferPrice
          : variantSellingPrice;

        const preorderCartItem = {
          _id: variant?._id ?? product.variantsId[0]._id,
          name: product.name,
          price: price,
          image:
            variant?.image?.alterImage?.secure_url ??
            product.images[0]?.alterImage?.secure_url,
          quantity: modalQty ?? quantity,
          maxStock: variant?.variants_stock ?? product.total_stock,
          variantValues: variant?.variants_values ?? [],
          variantId: variant?._id,
          isPreOrder: true,
          currency: product.currency || "BDT",
        };
        addPreorderItem(preorderCartItem);
        toast.success("প্রি-অর্ডার কার্টে যোগ করা হয়েছে");
        return true;
      } else {
        const cartId =
          hasVariants && variant ? variant._id : product.variantsId[0]._id;
        const cartVariantId = hasVariants && variant ? variant._id : undefined;

        const cartItem: TCartItem = {
          _id: cartId,
          variantId: cartVariantId,
          name: product.name,
          price,
          sellingPrice: variant?.selling_price
            ? Number(variant.selling_price)
            : sellingPrice,
          image:
            variant?.image?.alterImage?.secure_url ||
            product.images[0]?.alterImage?.secure_url ||
            "/assets/fallback.jpg",
          quantity: modalQty ?? quantity,
          maxStock: variant?.variants_stock ?? product.total_stock,
          variantValues: variant?.variants_values ?? [],
          variantGroups: product.variantsGroup,
          currency: product.currency || "BDT",
          isDiscountActive: variant?.isDiscountActive ?? isDiscountActive,
        };
        addItem(cartItem);
        openCart();
        toast.success("পণ্য কার্টে যোগ করা হয়েছে");
        return true;
      }
    },
    [
      addItem,
      openCart,
      product,
      hasVariants,
      finalPrice,
      sellingPrice,
      quantity,
      preorderItem,
      addPreorderItem,
      cartItems.length,
    ]
  );

  const handleWishlistToggle = useCallback(() => {
    if (product.isPreOrder || (hasVariants && selectedVariant?.isPreOrder)) {
      toast.error("Pre-order items cannot be added to wishlist");
      return;
    }

    const currentVariantId = hasVariants
      ? selectedVariant?._id || defaultVariant?._id
      : product.variantsId[0]._id;
    if (isWishlisted()) {
      const itemToRemove = wishlistItems.find(
        (item) => item._id === currentVariantId
      );
      if (itemToRemove) {
        removeWishlistItem(itemToRemove._id);
        toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
      }
      return;
    }

    if (hasVariants && variants.length > 1 && !selectedVariant) {
      toast.error("দয়া করে একটি ভ্যারিয়েন্ট নির্বাচন করুন");
      return;
    }

    const variantToUse = hasVariants ? selectedVariant || defaultVariant : null;
    if (variantToUse && variantToUse.variants_stock <= 0) {
      toast.error("এই ভ্যারিয়েন্ট স্টকে নেই, অন্যটি বাছাই করুন");
      return;
    }

    const price = finalPrice;
    const wishlistId =
      hasVariants && variantToUse
        ? variantToUse._id
        : product.variantsId[0]._id;
    const wishlistVariantId =
      hasVariants && variantToUse ? variantToUse._id : undefined;

    const itemToAdd = {
      _id: wishlistId,
      productId: product._id,
      variantId: wishlistVariantId,
      name: product.name,
      price,
      sellingPrice,
      image:
        variantToUse?.image?.alterImage?.secure_url ||
        selectedVariant?.image?.alterImage?.secure_url ||
        product.images[0]?.alterImage?.secure_url ||
        "/assets/fallback.jpg",
      variantValues:
        variantToUse?.variants_values || selectedVariant?.variants_values || [],
      variantGroups: product.variantsGroup,
      isDiscountActive,
    };

    addWishlistItem(itemToAdd);
    toast.success("পণ্য উইশলিস্টে যোগ করা হয়েছে");
    openWishlist();
  }, [
    hasVariants,
    selectedVariant,
    defaultVariant,
    isWishlisted,
    wishlistItems,
    removeWishlistItem,
    addWishlistItem,
    openWishlist,
    product,
    isDiscountActive,
    finalPrice,
    sellingPrice,
    variants.length,
  ]);

  return {
    addToCartOrPreOrder,
    handleWishlistToggle,
    isWishlisted: isWishlisted(),
  };
}
