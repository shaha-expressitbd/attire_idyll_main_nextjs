"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { useBusiness } from "@/hooks/useBusiness";
import { Category } from "@/types/business";
import ShopDesktopHeader from "./desktop-header";
import ShopProductsGrid from "./products-grid";
import { useGetProductsQuery, useGetFilterOptionsQuery } from "@/lib/api/publicApi";

// Import করো শুধু এই কম্পোনেন্টগুলো
// Desktop only
import MobileFilterButton from "./MobileFilterButton"; // Mobile button
import Filters from "./filters";
import MobileFilterModal from "./mobile-filter-modal";


// Filter Options Type
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

  // Fetch filter options
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
  const productsContainerRef = useRef<HTMLDivElement>(null);
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

  // Mobile Filter Modal State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sort
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "newest">("newest");

  // Filter States
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string[] }>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  useEffect(() => {
    if (paginatedProducts && currentPage > 1) {
      setAllProducts((prev) => [...prev, ...paginatedProducts]);
      setHasMorePages(paginatedProducts.length === 20);
      setIsLoadingMore(false);
    }
  }, [paginatedProducts, currentPage]);

  // Intersection Observer effect for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMorePages || isLoadingMore) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMorePages && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger when sentinel is 200px from viewport
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMorePages, isLoadingMore, loadMoreProducts]);

  // Reset on initial data change
  useEffect(() => {
    setAllProducts(initialProducts);
    setCurrentPage(1);
    setHasMorePages(true);
  }, [initialProducts, initialFilterOptions]);

  // Sidebar width
  useEffect(() => {
    const updateWidth = () => {
      if (sidebarRef.current) setSidebarWidth(sidebarRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Price Range Calculation
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
        const isOffer = offer < sell && now >= new Date(v.discount_start_date || 0).getTime() && now <= new Date(v.discount_end_date || 0).getTime();
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

  // Filter & Sort Logic
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
          const isOffer = offer < sell && now >= new Date(v.discount_start_date || 0).getTime() && now <= new Date(v.discount_end_date || 0).getTime();
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
          ].join(" ").trim();
          if (!searchIn.includes(query)) return false;
        }

        // Categories - check if product belongs to selected categories or their descendants
        if (selectedCats.length > 0) {
          const productCategoryIds = product.category_group?.map((cg) => cg._id) || [];
          const hasMatchingCategory = selectedCats.some(selectedCatId =>
            productCategoryIds.includes(selectedCatId) ||
            product.category_group?.some(cg => cg.children?.some(child => child._id === selectedCatId))
          );
          if (!hasMatchingCategory) return false;
        }

        // Sizes
        if (selectedSizes.length > 0) {
          const prodSizes = product.variantsId?.flatMap((v) => v.variants_values || []).map(sz => sz.trim().toLowerCase()) ?? [];
          const selected = selectedSizes.map(sz => sz.trim().toLowerCase());
          if (!prodSizes.some((sz) => selected.includes(sz))) return false;
        }

        // Conditions
        if (selectedConditions.length > 0) {
          const prodConditions = product.variantsId?.map((v) => v.condition?.trim().toLowerCase()).filter(Boolean) || [];
          const selected = selectedConditions.map(c => c.trim().toLowerCase());
          if (!prodConditions.some((c) => selected.includes(c))) return false;
        }

        // Tags
        if (selectedTags.length > 0) {
          const prodTags = product.tags?.map(t => t.trim().toLowerCase()) || [];
          const selected = selectedTags.map(t => t.trim().toLowerCase());
          if (!prodTags.some((t) => selected.includes(t))) return false;
        }

        // Variants
        if (Object.keys(selectedVariants).length > 0) {
          for (const [name, values] of Object.entries(selectedVariants)) {
            if (values.length > 0) {
              const prodValues = product.variantsId?.flatMap((v) => v.variants_values || []).map(v => v.trim().toLowerCase()) ?? [];
              const selected = values.map(v => v.trim().toLowerCase());
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
          const isOffer = offer < sell && now >= new Date(v.discount_start_date || 0).getTime() && now <= new Date(v.discount_end_date || 0).getTime();
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

  // Clear All Filters
  const clearAllFilters = useCallback(() => {
    setSelectedCats([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSelectedTags([]);
    setSelectedVariants({});
    setPriceRange([calcMin, calcMax]);
    setSearch("");
  }, [calcMin, calcMax, setSearch]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-[1800px] px-2 md:px-4 lg:px-6 py-2 md:py-6 h-full">
        <div className="h-full grid grid-cols-1 md:grid-cols-[320px_1fr] gap-x-3">
          {/* Desktop Sidebar */}
          <div className="h-full md:pb-8 pb-0" ref={sidebarRef}>
            <div className="sticky top-20">
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

          {/* Main Content */}
          <main className="h-full flex-1">
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
                productsContainerRef={productsContainerRef}
                clearAllFilters={clearAllFilters}
                containerWidth={typeof window !== "undefined" ? window.innerWidth - sidebarWidth : undefined}
                isLoadingMore={isLoadingMore}
              />

              {/* Sentinel element for infinite scroll */}
              {hasMorePages && filteredAndSorted.length > 0 && (
                <div ref={sentinelRef} className="h-10" />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filter Button */}
      {isMobile && <MobileFilterButton onClick={() => setIsMobileFiltersOpen(true)} />}

      {/* Mobile Filter Modal */}
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