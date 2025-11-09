"use client";

import {
  WishlistItem,
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistOpen,
  openWishlist,
  closeWishlist,
  addItem,
  removeItem,
  clearWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import { addItem as addCartItem } from "@/lib/features/cart/cartSlice";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

/**
 * Hook that exposes wishlist API + handles “moveToCart” locally
 */
export const useWishlist = () => {
  const dispatch = useAppDispatch();

  /* state */
  const items = useAppSelector(selectWishlistItems);
  const itemCount = useAppSelector(selectWishlistCount);
  const isOpen = useAppSelector(selectWishlistOpen);

  /* actions */
  const open = () => dispatch(openWishlist());
  const close = () => dispatch(closeWishlist());

  const add = (item: WishlistItem) => dispatch(addItem(item));
  const remove = (itemId: string) => dispatch(removeItem(itemId));
  const clear = () => dispatch(clearWishlist());

  /** Move an item to cart without thunk - ensures proper merging */
  const moveToCart = (id: string) => {
    const item = items.find((i) => i._id === id);
    if (!item) {
      console.log("❌ MOVE TO CART FAILED - ITEM NOT FOUND:", {
        requestedId: id,
      });
      return;
    }

    // console.log("🚀 MOVE TO CART STARTED:", {
    //   wishlistItemId: item._id,
    //   wishlistVariantId: item.variantId,
    //   wishlistProductId: item.productId,
    //   name: item.name,
    //   variantValues: item.variantValues,
    //   action: "moveToCart_initiated",
    // });

    // Remove from wishlist first
    dispatch(removeItem(item._id));

    // FIX: Always use variant-level matching for consistency
    // EVEN if the wishlist item was added without specific variant selection,
    // we need to use the variant ID for consistent merging
    const hasVariant =
      item.variantId !== undefined && item.variantId !== item.productId;

    // Core logic: For products with variants, always use variantId as the main ID
    // This ensures that same variant always merge, regardless of how they were added
    const cartId = hasVariant ? item.variantId : item._id; // Use variantId for variants, productId for non-variants
    const cartVariantId = hasVariant ? item.variantId : undefined; // Keep variantId consistent

    // If wishlist item has a variantId but no specific variant, use productId for matching
    const finalCartId = cartId || item.productId; // Fallback to productId if variantId is not valid

    // Add to cart with ALL the properties cart expects - must match exact values for merging
    const cartItem = {
      _id: finalCartId, // Always use the variant's ID when available for proper merging
      variantId: cartVariantId,
      variantLabel:
        item.variantValues.length > 0
          ? item.variantValues.join(" / ")
          : undefined, // Set if variantValues exist
      name: item.name,
      price: item.price,
      sellingPrice: item.sellingPrice || item.price, // Preserve selling price for line-through
      currency: item.currency,
      image: item.image,
      quantity: 1, // Add 1 quantity (will merge if exact same _id + variantId exists)
      maxStock: 9999, // High stock for wishlist->cart moves
      variantValues: item.variantValues || [],
      variantGroups: item.variantGroups,
      isWithinOffer: item.isWithinOffer || false, // Preserve offer status
    };

    // console.log("📦 CART ITEM PREPARED FOR MOVING:", {
    //   cartItemId: cartItem._id,
    //   variantId: cartItem.variantId,
    //   originalWishlistId: item._id,
    //   originalVariantId: item.variantId,
    //   finalCartId: finalCartId,
    //   hasVariant: hasVariant,
    //   variantLabel: cartItem.variantLabel,
    //   name: cartItem.name,
    //   price: cartItem.price,
    //   quantity: cartItem.quantity,
    //   variantValues: cartItem.variantValues,
    //   action: "cart_item_prepared",
    // });

    // Add to cart - cart merging logic will handle duplicate detection
    dispatch(addCartItem(cartItem));
  };

  return {
    /* state */
    items,
    itemCount,
    isOpen,
    /* actions */
    openWishlist: open,
    closeWishlist: close,
    addItem: add,
    removeItem: remove,
    clearWishlist: clear,
    moveToCart,
  };
};
