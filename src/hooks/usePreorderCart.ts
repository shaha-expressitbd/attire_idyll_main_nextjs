import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { useAppSelector } from "./useAppSelector";
import {
  setPreorderItem,
  clearPreorderCart,
  openPreorderCart,
  closePreorderCart,
  togglePreorderCart,
  setDiscountAmount,
  updatePreorderQuantity,
  TPreorderCartItem,
  selectPreorderItem,
  selectPreorderItemCount,
  selectPreorderSubtotal,
  selectPreorderDiscount,
  selectPreorderGrandTotal,
  selectIsPreorderCartOpen,
} from "@/lib/features/preOrderCartSlice/preOrderCartSlice";
import { selectCartItems } from "@/lib/features/cart/cartSlice";
import { trackAddToCart, trackUpdateItemQuantity } from "@/utils/gtm";

export const usePreorderCart = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  /* ───────── selectors ───────── */
  const rawItem = useAppSelector(selectPreorderItem);
  const rawItemCount = useAppSelector(selectPreorderItemCount);
  const rawSubtotal = useAppSelector(selectPreorderSubtotal);
  const rawDiscount = useAppSelector(selectPreorderDiscount);
  const rawGrandTotal = useAppSelector(selectPreorderGrandTotal);
  const rawIsOpen = useAppSelector(selectIsPreorderCartOpen);
  const cartItems = useAppSelector(selectCartItems); // Check regular cart items

  // Debugging: Log to verify persisted state (only in development)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Remove excessive logging - uncomment only when needed for debugging
    // console.log("PreorderCart State:", {
    //   rawItem,
    //   rawItemCount,
    //   rawSubtotal,
    //   rawDiscount,
    //   rawGrandTotal,
    //   rawIsOpen,
    // });
  }

  /* ───────── memoised state ───────── */
  const { item, itemCount, subtotal, discount, grandTotal, isOpen } = useMemo(
    () => ({
      item: rawItem,
      itemCount: rawItemCount,
      subtotal: rawSubtotal,
      discount: rawDiscount,
      grandTotal: rawGrandTotal,
      isOpen: rawIsOpen,
    }),
    [rawItem, rawItemCount, rawSubtotal, rawDiscount, rawGrandTotal, rawIsOpen]
  );

  /* ───────── actions ───────── */
  const addToPreorderCart = useCallback(
    (preorderItem: TPreorderCartItem) => {
      dispatch(setPreorderItem(preorderItem));
      // Note: Preorder items go directly to checkout, not through regular cart analytics
      router.push("/checkout");
    },
    [dispatch, router]
  );

  const clearPreorderCartItems = useCallback(() => {
    console.log("🛒 Calling clearPreorderCart from hook");
    dispatch(clearPreorderCart());
  }, [dispatch]);

  const updatePreorderItemQty = useCallback(
    (quantity: number) => {
      if (item) {
        dispatch(updatePreorderQuantity(quantity));
        trackUpdateItemQuantity(item, quantity);
      }
    },
    [dispatch, item]
  );

  const openPreorderCartDrawer = useCallback(() => {
    dispatch(openPreorderCart());
  }, [dispatch]);

  const closePreorderCartDrawer = useCallback(() => {
    dispatch(closePreorderCart());
  }, [dispatch]);

  const togglePreorderCartDrawer = useCallback(() => {
    dispatch(togglePreorderCart());
  }, [dispatch]);

  const applyPreorderDiscount = useCallback(
    (amount: number) => {
      dispatch(setDiscountAmount(amount));
    },
    [dispatch]
  );

  /* ───────── helpers ───────── */
  const itemExists = useCallback(() => !!item, [item]);
  const getItemQuantity = useCallback(() => item?.quantity ?? 0, [item]);

  return {
    /* state */
    item,
    itemCount,
    isOpen,
    subtotal,
    discount,
    grandTotal,

    /* actions */
    addItem: addToPreorderCart,
    clearCart: clearPreorderCartItems,
    updateItemQuantity: updatePreorderItemQty,
    openCart: openPreorderCartDrawer,
    closeCart: closePreorderCartDrawer,
    toggleCart: togglePreorderCartDrawer,
    applyDiscount: applyPreorderDiscount,

    /* utils */
    itemExists,
    getItemQuantity,

    /* helpers */
    getVariantLabel: (
      values: string[],
      groups: { variantName: string }[] = []
    ) => {
      if (!values?.length || !groups?.length) return values?.join(", ") ?? "";
      return values
        .map((val, idx) => {
          const groupName = groups[idx]?.variantName || "";
          return groupName ? `${groupName}: ${val}` : val;
        })
        .join(", ");
    },
  };
};
