/* -------------------------------------------------------------------------- */
/*  Wishlist Slice                                                            */
/* -------------------------------------------------------------------------- */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ————————————————————— Types —————————————————————— */
import { VariantGroup } from "../../../types/product";

export interface WishlistItem {
  _id: string; // variantId for variants, productId for non-variants (main identifier)
  productId: string; // NEW: Always the main product ID for cart consistency
  variantId?: string; // exists only for variants (for easy differentiation)
  name: string;
  price: number;
  sellingPrice: number;
  currency?: string;
  image: string;
  variantValues: string[];
  variantGroups?: VariantGroup[];
  isDiscountActive: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

/* —————————————————— Initial State ————————————————— */
const initialState: WishlistState = {
  items:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wishlist") || "[]")
      : [],
  isOpen: false,
};

/* ——————————————————— Slice ———————————————————— */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    openWishlist(state) {
      state.isOpen = true;
    },
    closeWishlist(state) {
      state.isOpen = false;
    },
    addItem(state, action: PayloadAction<WishlistItem>) {
      const newItem = action.payload;

      // console.log("❤️ WISHLIST ADD ITEM:", {
      //   _id: newItem._id,
      //   productId: newItem.productId, // NEW log
      //   variantId: newItem.variantId,
      //   name: newItem.name,
      //   price: newItem.price,
      //   currency: newItem.currency,
      //   image: newItem.image,
      //   variantValues: newItem.variantValues,
      //   action: "addItem",
      // });

      // Check for uniqueness by _id (variantId for variants, productId for non-variants)
      const exists = state.items.some((i) => i._id === newItem._id);

      if (!exists) {
        state.items.push({
          ...action.payload,
          variantGroups: action.payload.variantGroups,
        });
        localStorage.setItem("wishlist", JSON.stringify(state.items));
        // console.log("➕ WISHLIST ITEM ADDED:", {
        //   _id: newItem._id,
        //   productId: newItem.productId, // NEW log
        //   variantId: newItem.variantId,
        //   name: newItem.name,
        //   totalItems: state.items.length,
        //   action: "item_added",
        // });
        // } else {
        //   console.log("⚠️ WISHLIST ITEM EXISTS - SKIPPED:", {
        //     _id: newItem._id,
        //     productId: newItem.productId, // NEW log
        //     variantId: newItem.variantId,
        //     name: newItem.name,
        //     action: "duplicate_skipped",
        //   });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      // Remove by _id (variantId for variants, productId for non-variants)
      const itemId = action.payload;
      const itemToRemove = state.items.find((i) => i._id === itemId);

      // console.log("🗑️ WISHLIST REMOVE ITEM:", {
      //   itemId: itemId,
      //   itemFound: !!itemToRemove,
      //   itemName: itemToRemove?.name,
      //   itemProductId: itemToRemove?.productId, // NEW log
      //   itemVariantId: itemToRemove?.variantId,
      //   action: "removeItem",
      // });

      state.items = state.items.filter((i) => i._id !== itemId);
      localStorage.setItem("wishlist", JSON.stringify(state.items));

      // console.log("✅ WISHLIST ITEM REMOVED:", {
      //   removedItemId: itemId,
      //   newTotalItems: state.items.length,
      //   action: "item_removed",
      // });
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const {
  openWishlist,
  closeWishlist,
  addItem,
  removeItem,
  clearWishlist,
} = wishlistSlice.actions;

export const wishlistReducer = wishlistSlice.reducer;

/* Selectors */
export const selectWishlistItems = (s: { wishlist: WishlistState }) =>
  s.wishlist.items;

export const selectWishlistCount = (s: { wishlist: WishlistState }) =>
  s.wishlist.items.length;

export const selectWishlistOpen = (s: { wishlist: WishlistState }) =>
  s.wishlist.isOpen;
