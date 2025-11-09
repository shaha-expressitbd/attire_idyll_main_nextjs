/* -------------------------------------------------------------------------- */
/*  Recently Viewed Slice                                                    */
/* -------------------------------------------------------------------------- */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ————————————————————— Types —————————————————————— */
import type { Product } from "../../types/product";

export interface RecentlyViewedState {
  items: Product[];
}

/* —————————————————— Initial State ————————————————— */
const initialState: RecentlyViewedState = {
  items: [],
};

/* ——————————————————— Slice ———————————————————— */
const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      const newProduct = action.payload;

      // Remove if already exists to avoid duplicates
      state.items = state.items.filter((p) => p._id !== newProduct._id);

      // Add to beginning
      state.items.unshift(newProduct);

      // Limit to 10 items
      if (state.items.length > 10) {
        state.items = state.items.slice(0, 10);
      }
    },
    clearRecentlyViewed(state) {
      state.items = [];
    },
  },
});

export const { addProduct, clearRecentlyViewed } = recentlyViewedSlice.actions;

export const recentlyViewedReducer = recentlyViewedSlice.reducer;

/* Selectors */
export const selectRecentlyViewedItems = (s: {
  recentlyViewed: RecentlyViewedState;
}) => s.recentlyViewed.items;

export const selectRecentlyViewedCount = (s: {
  recentlyViewed: RecentlyViewedState;
}) => s.recentlyViewed.items.length;
