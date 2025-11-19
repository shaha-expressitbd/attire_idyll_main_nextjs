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
        toast.error("Please select a variant");
        return false;
      }

      const imageUrl =
        variantToUse.image?.alterImage?.secure_url ??
        product.images[0]?.alterImage?.secure_url ??
        "/assets/fallback.jpg";

      // ---------- PRE-ORDER LOGIC ----------
      if (isPreOrder || variantToUse.isPreOrder) {
        // Case: Pre-order already exists
        if (preorderItem) {
          toast.error("You already have a pre-order in checkout.", {
            duration: 10000,
            action: {
              label: "Go to Checkout",
              onClick: () => router.push("/checkout"),
            },
          });
          return false;
        }

        // Case: Regular cart has items → offer to clear & add
        if (cartItems.length > 0) {
          toast.error("Regular cart has items. Clear to continue with pre-order?", {
            duration: 15000,
            action: {
              label: "Clear & Add to Pre-order",
              onClick: () => {
                clearRegularCart();
                toast.success("Cart cleared!");

                const preorderCartItem: TPreorderCartItem = {
                  _id: variantToUse._id,
                  name: product.name,
                  price,
                  image: imageUrl,
                  quantity: modalQty,
                  maxStock: variantToUse.variants_stock ?? product.total_stock,
                  variantValues: variantToUse.variants_values ?? [],
                  variantGroups: product.variantsGroup ?? [],
                  variantId: variantToUse._id,
                  isPreOrder: true,
                  currency: product.currency || "BDT",
                };

                addPreorderItem(preorderCartItem);
                toast.success("Added to pre-order!");
                router.push("/checkout");
              },
            },
            cancel: { label: "Cancel", onClick: () => {} },
          });
          return false;
        }

        // No conflict → direct add to pre-order
        const preorderCartItem: TPreorderCartItem = {
          _id: variantToUse._id,
          name: product.name,
          price,
          image: imageUrl,
          quantity: modalQty,
          maxStock: variantToUse.variants_stock ?? product.total_stock,
          variantValues: variantToUse.variants_values ?? [],
          variantGroups: product.variantsGroup ?? [],
          variantId: variantToUse._id,
          isPreOrder: true,
          currency: product.currency || "BDT",
        };

        addPreorderItem(preorderCartItem);
        toast.success("Added to pre-order!");
        router.push("/checkout");
        return true;
      }

      // ---------- REGULAR CART LOGIC ----------
      // Case: Pre-order exists → offer to clear & add
      if (preorderItem) {
        toast.error("Pre-order item exists. Clear to add to regular cart?", {
          duration: 15000,
          action: {
            label: "Clear & Add to Cart",
            onClick: () => {
              clearPreorderCart();
              toast.success("Pre-order cleared!");

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
                image: imageUrl,
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
              toast.success("Added to cart!");
            },
          },
          cancel: { label: "Cancel", onClick: () => {} },
        });
        return false;
      }

      // No conflict → direct add to regular cart
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
        image: imageUrl,
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
      toast.success("Added to cart!");
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

  // Wishlist Toggle (unchanged)
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
      toast.success("Removed from wishlist");
      return;
    }

    if (hasVariants && !selectedVariant && product.variantsId.length > 1) {
      toast.error("Please select a variant");
      return;
    }

    const variantToUse = selectedVariant || defaultVariant;
    if (variantToUse?.variants_stock <= 0) {
      toast.error("This variant is out of stock");
      return;
    }

    const imageUrl =
      variantToUse.image?.alterImage?.secure_url ||
      product.images[0]?.alterImage?.secure_url ||
      "/assets/fallback.jpg";

    const wishlistItem = {
      _id: currentVariantId,
      productId: product._id,
      variantId: hasVariants ? variantToUse._id : undefined,
      name: product.name,
      price: finalPrice,
      sellingPrice,
      image: imageUrl,
      variantValues: variantToUse.variants_values ?? [],
      variantGroups: product.variantsGroup,
      isDiscountActive,
      currency: product.currency || "BDT",
    };

    addWishlistItem(wishlistItem);
    toast.success("Added to wishlist");
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
    isPreOrder,
  ]);

  return {
    addToCartOrPreOrder,
    handleWishlistToggle,
    isWishlisted: isWishlisted(),
  };
}