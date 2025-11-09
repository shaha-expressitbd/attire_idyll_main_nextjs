// src/lib/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { VariantGroup } from "../../../types/product";

/* ───── item টাইপে আগেই variantId ছিল ───── */
export interface TCartItem {
  _id: string; // productId
  variantId?: string;
  variantLabel?: string;
  name: string;
  price: number; // Effective price (offer if active)
  sellingPrice: number; // Original price
  isDiscountActive: boolean; // Flag for active discount
  image: string;
  quantity: number;
  maxStock: number;
  currency?: string;
  variantValues: string[];
  variantGroups?: VariantGroup[];
}

interface CartState {
  items: TCartItem[];
  isOpen: boolean;
  discountAmount: number;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  discountAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ───────── addItem ───────── */
    addItem: (state, action: PayloadAction<TCartItem>) => {
      const incoming = action.payload;

      // console.log("🛒 CART ADD ITEM:", {
      //   _id: incoming._id,
      //   variantId: incoming.variantId,
      //   variantLabel: incoming.variantLabel,
      //   name: incoming.name,
      //   price: incoming.price,
      //   sellingPrice: incoming.sellingPrice,
      //   offerPrice: incoming.offerPrice,
      //   isWithinOffer: incoming.isWithinOffer,
      //   currency: incoming.currency,
      //   image: incoming.image,
      //   incomingQuantity: incoming.quantity,
      //   maxStock: incoming.maxStock,
      //   variantValues: incoming.variantValues,
      //   action: "addItem",
      // });

      // 🔸 productId + variantId দুটো মিলিয়ে খুঁজছি
      const existing = state.items.find(
        (item) =>
          item._id === incoming._id && item.variantId === incoming.variantId
      );

      if (existing) {
        const previousQuantity = existing.quantity;
        existing.quantity = Math.min(
          existing.quantity + incoming.quantity,
          existing.maxStock
        );
        // Preserve offer information when merging
        if (incoming.sellingPrice !== undefined)
          existing.sellingPrice = incoming.sellingPrice;
        if (incoming.isDiscountActive !== undefined)
          existing.isDiscountActive = incoming.isDiscountActive;
        if (incoming.price !== undefined) existing.price = incoming.price; // Update price if different
      } else {
        const newItem = {
          ...incoming,
          quantity: Math.min(incoming.quantity, incoming.maxStock),
          variantValues: incoming.variantValues,
        };
        state.items.push({
          ...newItem,
          variantGroups: incoming.variantGroups,
        });
        // console.log("➕ CART ITEM ADDED NEW:", {
        //   _id: newItem._id,
        //   variantId: newItem.variantId,
        //   name: newItem.name,
        //   quantity: newItem.quantity,
        //   variantValues: newItem.variantValues,
        //   action: "add_new",
        // });
      }

      // console.log("📊 CART STATE UPDATED:", {
      //   totalItems: state.items.length,
      //   totalQuantity: state.items.reduce(
      //     (sum, item) => sum + item.quantity,
      //     0
      //   ),
      //   lastItem: {
      //     _id: incoming._id,
      //     variantId: incoming.variantId,
      //     name: incoming.name,
      //     finalQuantity: state.items.find(
      //       (item) =>
      //         item._id === incoming._id && item.variantId === incoming.variantId
      //     )?.quantity,
      //   },
      // });
    },

    /* ───────── removeItem ───────── */
    // 🔸 এখন object payload (productId + variantId)
    removeItem: (
      state,
      action: PayloadAction<{ id: string; variantId: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item._id === action.payload.id &&
            item.variantId === action.payload.variantId
          )
      );
    },

    /* ───────── updateQuantity ───────── */
    // 🔸 idem
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        variantId: string;
        quantity: number;
      }>
    ) => {
      const { id, variantId, quantity } = action.payload;
      const item = state.items.find(
        (i) => i._id === id && i.variantId === variantId
      );
      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter(
          (i) => !(i._id === id && i.variantId === variantId)
        );
      } else {
        item.quantity = Math.min(quantity, item.maxStock);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setDiscountAmount: (state, action: PayloadAction<number>) => {
      state.discountAmount = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
  setDiscountAmount,
} = cartSlice.actions;

/* ───── Selectors অপরিবর্তিত ───── */
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((sum: number, i: TCartItem) => sum + i.quantity, 0);
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum: number, i: TCartItem) => sum + i.price * i.quantity,
    0
  );
export const selectCartDiscount = (state: RootState) =>
  state.cart.discountAmount;
export const selectCartGrandTotal = (state: RootState) =>
  selectCartSubtotal(state) - state.cart.discountAmount;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

export default cartSlice.reducer;
