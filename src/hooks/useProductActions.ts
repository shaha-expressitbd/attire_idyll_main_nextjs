// hooks/useProductActions.ts
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product, Variant } from "@/types/product";
import type { TCartItem } from "@/lib/features/cart/cartSlice";
import type { TPreorderCartItem } from "@/lib/features/preOrderCartSlice/preOrderCartSlice";
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
  const router = useRouter();
  const {
    addItem: addCartItem,
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

  const hasVariants = product.hasVariants && product.variantsId.length > 0;
  const isPreOrder =
    product.isPreOrder || (selectedVariant?.isPreOrder ?? false);

  // Wishlist status
  const isWishlisted = useCallback(() => {
    const currentVariantId = hasVariants
      ? selectedVariant?._id || defaultVariant?._id
      : product.variantsId[0]?._id;
    return wishlistItems.some((i) => i._id === currentVariantId);
  }, [
    wishlistItems,
    hasVariants,
    selectedVariant,
    defaultVariant,
    product.variantsId,
  ]);

  // Main Add to Cart / Pre-order
  const addToCartOrPreOrder = useCallback(
    (
      variant: Variant | null,
      modalQty: number = quantity,
      overrideFinalPrice?: number
    ) => {
      const price = overrideFinalPrice ?? finalPrice;
      const variantToUse = variant || selectedVariant || defaultVariant;

      if (!variantToUse) {
        toast.error("ভ্যারিয়েন্ট নির্বাচন করুন");
        return false;
      }

      // Pre-order Logic
      if (isPreOrder || variantToUse.isPreOrder) {
        // Conflict: Preorder already exists
        if (preorderItem) {
          toast.error(
            "আপনার চেকআউটে ইতিমধ্যে একটা প্রি-অর্ডার প্রোডাক্ট আছে।",
            {
              duration: 10000,
              action: {
                label: "চেকআউটে যান",
                onClick: () => router.push("/checkout"),
              },
            }
          );
          return false;
        }

        // Conflict: Regular cart has items
        if (cartItems.length > 0) {
          toast.error(
            "রেগুলার কার্টে প্রোডাক্ট আছে। প্রি-অর্ডার করতে কার্ট ক্লিয়ার করুন।",
            {
              duration: 10000,
              action: {
                label: "কার্ট ক্লিয়ার করুন",
                onClick: () => {
                  clearRegularCart();
                  toast.success("রেগুলার কার্ট ক্লিয়ার হয়েছে!");
                  // Re-call after clear
                  setTimeout(
                    () =>
                      addToCartOrPreOrder(
                        variant,
                        modalQty,
                        overrideFinalPrice
                      ),
                    300
                  );
                },
              },
            }
          );
          return false;
        }

        const preorderCartItem: TPreorderCartItem = {
          _id: variantToUse._id,
          name: product.name,
          price,
          image:
            variantToUse.image?.alterImage?.secure_url ??
            product.images[0]?.alterImage?.secure_url ??
            "/assets/fallback.jpg",
          quantity: modalQty,
          maxStock: variantToUse.variants_stock ?? product.total_stock,
          variantValues: variantToUse.variants_values ?? [],
          variantGroups: product.variantsGroup ?? [],
          variantId: variantToUse._id,
          isPreOrder: true,
          currency: product.currency || "BDT",
        };

        addPreorderItem(preorderCartItem);
        toast.success("প্রি-অর্ডার লিস্টে যোগ করা হয়েছে!");
        router.push("/checkout"); // এটাই মূল পার্থক্য
        return true;
      }

      // Regular Cart Logic
      if (preorderItem) {
        toast.error(
          "প্রি-অর্ডার আইটেম আছে। রেগুলার কার্টে যোগ করতে প্রি-অর্ডার ক্লিয়ার করুন।",
          {
            duration: 10000,
            action: {
              label: "প্রি-অর্ডার ক্লিয়ার করুন",
              onClick: () => {
                clearPreorderCart();
                toast.success("প্রি-অর্ডার ক্লিয়ার হয়েছে!");
                setTimeout(
                  () =>
                    addToCartOrPreOrder(variant, modalQty, overrideFinalPrice),
                  300
                );
              },
            },
          }
        );
        return false;
      }

      const cartId = hasVariants ? variantToUse._id : product.variantsId[0]._id;
      const cartVariantId = hasVariants ? variantToUse._id : undefined;

      const cartItem: TCartItem = {
        _id: cartId,
        variantId: cartVariantId,
        name: product.name,
        price,
        sellingPrice: variantToUse.selling_price
          ? Number(variantToUse.selling_price)
          : sellingPrice,
        image:
          variantToUse.image?.alterImage?.secure_url ||
          product.images[0]?.alterImage?.secure_url ||
          "/assets/fallback.jpg",
        quantity: modalQty,
        maxStock: variantToUse.variants_stock ?? product.total_stock,
        variantValues: variantToUse.variants_values ?? [],
        variantGroups: product.variantsGroup,
        currency: product.currency || "BDT",
        isDiscountActive: variantToUse.isDiscountActive ?? isDiscountActive,
        isPreOrder: variantToUse.isPreOrder,
        ...(variantToUse.variants_values &&
          variantToUse.variants_values.length > 0 && {
            variantLabel: variantToUse.variants_values.join(" / "),
          }),
      };

      addCartItem(cartItem);
      openCart();
      toast.success("কার্টে যোগ করা হয়েছে!");
      return true;
    },
    [
      product,
      selectedVariant,
      defaultVariant,
      quantity,
      finalPrice,
      sellingPrice,
      isDiscountActive,
      isPreOrder,
      hasVariants,
      cartItems,
      preorderItem,
      addCartItem,
      openCart,
      addPreorderItem,
      clearRegularCart,
      clearPreorderCart,
      router,
    ]
  );

  // Wishlist Toggle
  const handleWishlistToggle = useCallback(() => {
    if (isPreOrder || selectedVariant?.isPreOrder) {
      toast.error("Pre-order items cannot be added to wishlist");
      return;
    }

    const currentVariantId = hasVariants
      ? selectedVariant?._id || defaultVariant?._id
      : product.variantsId[0]?._id;

    if (isWishlisted()) {
      removeWishlistItem(currentVariantId);
      toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
      return;
    }

    if (hasVariants && !selectedVariant && product.variantsId.length > 1) {
      toast.error("দয়া করে একটি ভ্যারিয়েন্ট নির্বাচন করুন");
      return;
    }

    const variantToUse = selectedVariant || defaultVariant;
    if (variantToUse?.variants_stock <= 0) {
      toast.error("এই ভ্যারিয়েন্ট স্টকে নেই");
      return;
    }

    const wishlistItem = {
      _id: currentVariantId,
      productId: product._id,
      variantId: hasVariants ? variantToUse._id : undefined,
      name: product.name,
      price: finalPrice,
      sellingPrice,
      image:
        variantToUse.image?.alterImage?.secure_url ||
        product.images[0]?.alterImage?.secure_url ||
        "/assets/fallback.jpg",
      variantValues: variantToUse.variants_values ?? [],
      variantGroups: product.variantsGroup,
      isDiscountActive,
      currency: product.currency || "BDT",
    };

    addWishlistItem(wishlistItem);
    toast.success("উইশলিস্টে যোগ করা হয়েছে");
    openWishlist();
  }, [
    product,
    selectedVariant,
    defaultVariant,
    finalPrice,
    sellingPrice,
    isDiscountActive,
    hasVariants,
    isWishlisted,
    wishlistItems,
    addWishlistItem,
    removeWishlistItem,
    openWishlist,
  ]);

  return {
    addToCartOrPreOrder,
    handleWishlistToggle,
    isWishlisted: isWishlisted(),
  };
}
