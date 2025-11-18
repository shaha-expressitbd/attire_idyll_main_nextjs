"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { useBusiness } from "@/hooks/useBusiness";
import { Category } from "@/types/business";
import ShopDesktopHeader from "./desktop-header";
import ShopProductsGrid from "./products-grid";
import { useGetProductsQuery, useGetFilterOptionsQuery } from "@/lib/api/publicApi";

import MobileFilterButton from "./MobileFilterButton";
import Filters from "./filters";
import MobileFilterModal from "./mobile-filter-modal";

interface FilterOptions {
  tags: string[];
  conditions: string[];
  priceRange: { min: string; max: string };
  variantsValues: { name: string; values: string[] }[];
  categories: { _id: string; name: string; products: number; children: any[] }[];
}

interface ShopAllProductsProps {
  initialProducts?: Product[];
  minPrice?: number;
  maxPrice?: number;
  initialFilterOptions?: FilterOptions;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function ShopAllProducts({
  initialProducts = [],
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  initialFilterOptions,
  showSearch,
  setShowSearch,
  search,
  setSearch,
}: ShopAllProductsProps) {
  const { businessData } = useBusiness();
  const categories: Category[] = businessData?.categories || [];

  const { data: filterOptions } = useGetFilterOptionsQuery(
    {
      isCategories: true,
      isPriceRange: true,
      isVariantsValues: true,
      isConditions: true,
      isTags: true,
    },
    { skip: !!initialFilterOptions }
  );

  const finalFilterOptions = filterOptions || initialFilterOptions;

  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(320);

  // Mobile Detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sort & Filters
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "newest">("newest");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string[] }>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [seenProductIds, setSeenProductIds] = useState<Set<string>>(
    new Set(initialProducts.map((p) => p._id))
  );

  // Intersection Observer
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch Products
  const { data: paginatedProducts, isFetching: isFetchingProducts } = useGetProductsQuery(
    { page: currentPage, limit: 20 },
    { skip: currentPage === 1 && initialProducts.length > 0 }
  );

  // Load More
  const loadMoreProducts = useCallback(() => {
    if (!isLoadingMore && hasMorePages && !isFetchingProducts) {
      setIsLoadingMore(true);
      setCurrentPage((p) => p + 1);
    }
  }, [isLoadingMore, hasMorePages, isFetchingProducts]);

  // Handle New Products (Critical Fix)
  useEffect(() => {
    if (paginatedProducts && currentPage > 1) {
      const newProducts = paginatedProducts.filter((p) => !seenProductIds.has(p._id));

      if (newProducts.length > 0) {
        setAllProducts((prev) => [...prev, ...newProducts]);
        setSeenProductIds((prev) => new Set([...prev, ...newProducts.map((p) => p._id)]));
      }

      // Stop loading if:
      // 1. Less than 20 products returned OR
      // 2. No new products found (duplicate page)
      const receivedFullPage = paginatedProducts.length === 20;
      const hasNewProducts = newProducts.length > 0;

      if (!receivedFullPage || !hasNewProducts) {
        setHasMorePages(false); // Stop forever
      }

      setIsLoadingMore(false);
    }
  }, [paginatedProducts, currentPage, seenProductIds]);

  // Reset on initial data
  useEffect(() => {
    setAllProducts(initialProducts);
    setSeenProductIds(new Set(initialProducts.map((p) => p._id)));
    setCurrentPage(1);
    setHasMorePages(initialProducts.length >= 20);
  }, [initialProducts]);

  // Sidebar Width
  useEffect(() => {
    const update = () => {
      if (sidebarRef.current) setSidebarWidth(sidebarRef.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Price Range
  const { minPrice: calcMin, maxPrice: calcMax } = useMemo(() => {
    if (finalFilterOptions?.priceRange) {
      return {
        minPrice: Number(finalFilterOptions.priceRange.min),
        maxPrice: Number(finalFilterOptions.priceRange.max),
      };
    }
    if (initialMinPrice !== undefined && initialMaxPrice !== undefined) {
      return { minPrice: initialMinPrice, maxPrice: initialMaxPrice };
    }
    const prices = allProducts
      .map((p) => {
        const v = p.variantsId?.find((x) => Number(x.variants_stock) > 0) ?? p.variantsId?.[0];
        if (!v) return 0;
        const sell = Number(v.selling_price || 0);
        const offer = Number(v.offer_price || sell);
        const now = Date.now();
        const isOffer =
          offer < sell &&
          now >= new Date(v.discount_start_date || 0).getTime() &&
          now <= new Date(v.discount_end_date || 0).getTime();
        return isOffer ? offer : sell;
      })
      .filter((n) => !isNaN(n));
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 10000,
    };
  }, [allProducts, finalFilterOptions, initialMinPrice, initialMaxPrice]);

  useEffect(() => {
    setPriceRange([calcMin, calcMax]);
  }, [calcMin, calcMax]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    return allProducts
      .filter((product) => {
        // Price
        const price = (() => {
          const v = product.variantsId?.find((x) => Number(x.variants_stock) > 0) ?? product.variantsId?.[0];
          if (!v) return 0;
          const sell = Number(v.selling_price || 0);
          const offer = Number(v.offer_price || sell);
          const now = Date.now();
          const isOffer =
            offer < sell &&
            now >= new Date(v.discount_start_date || 0).getTime() &&
            now <= new Date(v.discount_end_date || 0).getTime();
          return isOffer ? offer : sell;
        })();
        if (price < priceRange[0] || price > priceRange[1]) return false;

        // Search
        if (search.trim()) {
          const query = search.toLowerCase().trim();
          const searchIn = [
            product.name?.toLowerCase().trim() || "",
            ...(product.sub_category?.map((c) => c.name?.toLowerCase().trim()) || []),
            ...(product.variantsId?.map((v) => v.condition?.toLowerCase().trim()) || []),
          ].join(" ");
          if (!searchIn.includes(query)) return false;
        }

        // Categories
        if (selectedCats.length > 0) {
          const productCategoryIds = product.category_group?.map((cg) => cg._id) || [];
          const hasMatch = selectedCats.some(
            (id) =>
              productCategoryIds.includes(id) ||
              product.category_group?.some((cg) =>
                cg.children?.some((child) => child._id === id)
              )
          );
          if (!hasMatch) return false;
        }

        // Sizes
        if (selectedSizes.length > 0) {
          const prodSizes = product.variantsId?.flatMap((v) => v.variants_values || []).map((s) => s.trim().toLowerCase()) ?? [];
          const selected = selectedSizes.map((s) => s.trim().toLowerCase());
          if (!prodSizes.some((s) => selected.includes(s))) return false;
        }

        // Conditions
        if (selectedConditions.length > 0) {
          const prodConditions = product.variantsId?.map((v) => v.condition?.trim().toLowerCase()).filter(Boolean) || [];
          const selected = selectedConditions.map((c) => c.trim().toLowerCase());
          if (!prodConditions.some((c) => selected.includes(c))) return false;
        }

        // Tags
        if (selectedTags.length > 0) {
          const prodTags = product.tags?.map((t) => t.trim().toLowerCase()) || [];
          const selected = selectedTags.map((t) => t.trim().toLowerCase());
          if (!prodTags.some((t) => selected.includes(t))) return false;
        }

        // Variants
        if (Object.keys(selectedVariants).length > 0) {
          for (const [name, values] of Object.entries(selectedVariants)) {
            if (values.length > 0) {
              const prodValues = product.variantsId?.flatMap((v) => v.variants_values || []).map((v) => v.trim().toLowerCase()) ?? [];
              const selected = values.map((v) => v.trim().toLowerCase());
              if (!prodValues.some((v) => selected.includes(v))) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        const getPrice = (p: Product) => {
          const v = p.variantsId?.find((x) => Number(x.variants_stock) > 0) ?? p.variantsId?.[0];
          if (!v) return 0;
          const sell = Number(v.selling_price || 0);
          const offer = Number(v.offer_price || sell);
          const now = Date.now();
          const isOffer =
            offer < sell &&
            now >= new Date(v.discount_start_date || 0).getTime() &&
            now <= new Date(v.discount_end_date || 0).getTime();
          return isOffer ? offer : sell;
        };

        switch (sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "price-low":
            return getPrice(a) - getPrice(b);
          case "price-high":
            return getPrice(b) - getPrice(a);
          case "newest":
          default:
            return (b._id || "").localeCompare(a._id || "");
        }
      });
  }, [
    allProducts,
    search,
    selectedCats,
    selectedSizes,
    selectedConditions,
    selectedTags,
    selectedVariants,
    priceRange,
    sortBy,
  ]);

  // Clear Filters
  const clearAllFilters = useCallback(() => {
    setSelectedCats([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSelectedTags([]);
    setSelectedVariants({});
    setPriceRange([calcMin, calcMax]);
    setSearch("");
  }, [calcMin, calcMax, setSearch]);

  // Intersection Observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMorePages || isLoadingMore) {
      observerRef.current?.disconnect();
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreProducts();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );

    observerRef.current.observe(sentinel);

    return () => observerRef.current?.disconnect();
  }, [hasMorePages, isLoadingMore, loadMoreProducts]);

  return (
    <div className="min-h-screen bg-white dark:bg-secondary">
      <div className="mx-auto max-w-[1800px] px-2 md:px-4 lg:px-6 py-2 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-x-3">
          {/* Sidebar */}
          <div className="h-full md:pb-8" ref={sidebarRef}>
            <div className="sticky top-20 md:block hidden">
              <Filters
                categories={finalFilterOptions?.categories || categories}
                selectedCats={selectedCats}
                setSelectedCats={setSelectedCats}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minPrice={calcMin}
                maxPrice={calcMax}
                initialProducts={initialProducts}
                filterOptions={finalFilterOptions}
                selectedConditions={selectedConditions}
                setSelectedConditions={setSelectedConditions}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                selectedVariants={selectedVariants}
                setSelectedVariants={setSelectedVariants}
                apiMinPrice={calcMin}
                apiMaxPrice={calcMax}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </div>

          {/* Main */}
          <main className="flex-1">
            <div className="overflow-y-auto scrollbar-hide h-full">
              <ShopDesktopHeader
                filteredAndSorted={filteredAndSorted}
                initialProducts={allProducts}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isMobile={isMobile}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                search={search}
                setSearch={setSearch}
              />

              <ShopProductsGrid
                filteredAndSorted={filteredAndSorted}
                clearAllFilters={clearAllFilters}
                containerWidth={typeof window !== "undefined" ? window.innerWidth - sidebarWidth : undefined}
                isLoadingMore={isLoadingMore}
              />

              {/* Loading More */}
              {hasMorePages && !isLoadingMore && (
                <div ref={sentinelRef} className="py-6 flex justify-center">
                  <div className="text-sm text-gray-500 animate-pulse">Loading more products...</div>
                </div>
              )}

              {/* End of Results */}
              {!hasMorePages && filteredAndSorted.length > 0 && (
                <div className="py-8 text-center text-sm text-gray-500">
                  You've reached the end!
                </div>
              )}

              {/* No Products */}
              {filteredAndSorted.length === 0 && (
                <div className="py-16 text-center text-gray-500">
                  No products found.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile */}
      {isMobile && <MobileFilterButton onClick={() => setIsMobileFiltersOpen(true)} />}

      <MobileFilterModal
        categories={categories}
        selectedCats={selectedCats}
        setSelectedCats={setSelectedCats}
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        minPrice={calcMin}
        maxPrice={calcMax}
        initialProducts={initialProducts}
        filterOptions={finalFilterOptions}
        selectedConditions={selectedConditions}
        setSelectedConditions={setSelectedConditions}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedVariants={selectedVariants}
        setSelectedVariants={setSelectedVariants}
        isOpen={isMobileFiltersOpen}
        setIsOpen={setIsMobileFiltersOpen}
        clearAllFilters={clearAllFilters}
      />
    </div>
  );
}