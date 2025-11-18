"use client";

import React, { useState } from "react";
import ShopAllProducts from "./_components/ShopAllProducts";
import { Product } from "@/types/product";
import ErrorBoundary from "@/components/ui/skeleton/ErrorBoundary";

interface FilterOptions {
  tags: string[];
  conditions: string[];
  priceRange: {
    min: string;
    max: string;
  };
  variantsValues: Array<{
    name: string;
    values: string[];
  }>;
  categories: Array<{
    _id: string;
    name: string;
    products: number;
    children: any[];
  }>;
}

interface ClientWrapperProps {
  initialProducts: Product[];
  minPrice?: number;
  maxPrice?: number;
  initialFilterOptions?: FilterOptions;
}

export default function ClientWrapper({
  initialProducts = [],
  minPrice,
  maxPrice,
  initialFilterOptions,
}: ClientWrapperProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <ErrorBoundary>
      <ShopAllProducts
        initialProducts={initialProducts}
        minPrice={minPrice}
        maxPrice={maxPrice}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        search={search}
        setSearch={setSearch}
        initialFilterOptions={initialFilterOptions}
      />
    </ErrorBoundary>
  );
}
