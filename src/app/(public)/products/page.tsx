"use server";
import React from "react";
import { publicApi } from "@/lib/api/publicApi";
import { makeStore } from "@/lib/store";
import type { Product } from "@/types/product";
import ClientWrapper from "./ClientWrapper"; // import the client wrapper

type SearchParams = {
  search?: string;
  sort?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const {
    search = "",
    sort,
    brand,
    minPrice,
    maxPrice,
    condition,
  } = await searchParams ?? {};

  const store = makeStore();
  const allProducts: Product[] = [];

  // Only fetch first page with smaller limit for initial load
  const res = await store.dispatch(
    publicApi.endpoints.getProducts.initiate({
      page: 1,
      limit: 500,
      ...(search && { search }),
      ...(sort && { sort }),
      ...(brand && { brand }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(condition && { condition }),
    })
  );

  const products: Product[] = res.data ?? [];
  allProducts.push(...products);

  const initialProducts = JSON.parse(JSON.stringify(allProducts));

  // Fetch filter options on server to prevent hydration mismatch
  const filterOptionsRes = await store.dispatch(
    publicApi.endpoints.getFilterOptions.initiate({
      isCategories: true,
      isPriceRange: true,
      isVariantsValues: true,
      isConditions: true,
      isTags: true,
    })
  );

  const initialFilterOptions = filterOptionsRes.data;

  // Render client wrapper
  return (
    <ClientWrapper
      initialProducts={initialProducts}
      minPrice={minPrice ? Number(minPrice) : undefined}
      maxPrice={maxPrice ? Number(maxPrice) : undefined}
      initialFilterOptions={initialFilterOptions}
    />
  );
}
