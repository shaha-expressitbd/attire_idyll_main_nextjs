"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { useBusiness } from "@/hooks/useBusiness";
import { Category } from "@/types/business";
import Filters from "./filters";
import ShopDesktopHeader from "./desktop-header";
import ShopProductsGrid from "./products-grid";
import { useGetProductsQuery, useGetFilterOptionsQuery } from "@/lib/api/publicApi";

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

interface ShopAllProductsProps {
  initialProducts?: Product[];
  minPrice?: number;
  maxPrice?: number;
  initialFilterOptions?: FilterOptions;

  // Client-controlled search state (from parent)
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

  // Use initial filter options if available, otherwise fetch from API
  const { data: filterOptions } = useGetFilterOptionsQuery(
    {
      isCategories: true,
      isPriceRange: true,
      isVariantsValues: true,
      isConditions: true,
      isTags: true,
    },
    {
      skip: !!initialFilterOptions, // Skip query if we have initial data
    }
  );

  const finalFilterOptions = filterOptions || initialFilterOptions;

  const sidebarRef = useRef<HTMLDivElement>(null);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(320);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [sortBy, setSortBy] = useState<
    "name" | "price-low" | "price-high" | "newest"
  >("newest");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string[] }>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // RTK Query for pagination
  const {
    data: paginatedProducts,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    error: productsError
  } = useGetProductsQuery(
    {
      page: currentPage,
      limit: 20,
      // Add search/filter params here when implemented
    },
    {
      skip: currentPage === 1 && initialProducts.length > 0, // Skip first page if we have initial data
    }
  );

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle paginated products loading
  useEffect(() => {
    if (paginatedProducts && currentPage > 1) {
      setAllProducts(prev => [...prev, ...paginatedProducts]);
      setHasMorePages(paginatedProducts.length === 20); // Assuming 20 is the page size
      setIsLoadingMore(false);
    }
  }, [paginatedProducts, currentPage]);

  // Reset products when filters change
  useEffect(() => {
    setAllProducts(initialProducts);
    setCurrentPage(1);
    setHasMorePages(true);
  }, [initialProducts, initialFilterOptions]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (!isLoadingMore && hasMorePages && !isFetchingProducts) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMorePages, isFetchingProducts]);

  // Sidebar width
  useEffect(() => {
    const updateWidth = () => {
      if (sidebarRef.current) setSidebarWidth(sidebarRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Price calculation - use API price range if available, fallback to calculated
  const { minPrice: calculatedMinPrice, maxPrice: calculatedMaxPrice } = useMemo(() => {
    if (finalFilterOptions?.priceRange) {
      const apiMin = Number(finalFilterOptions.priceRange.min);
      const apiMax = Number(finalFilterOptions.priceRange.max);
      console.log('ShopAllProducts - Using API price range:', apiMin, apiMax);
      return {
        minPrice: apiMin,
        maxPrice: apiMax
      };
    }
    if (initialMinPrice !== undefined && initialMaxPrice !== undefined)
      return { minPrice: initialMinPrice, maxPrice: initialMaxPrice };
    if (allProducts.length === 0) return { minPrice: 0, maxPrice: 10000 };
    const prices = allProducts
      .map((p) => {
        const v =
          p.variantsId?.find((x) => Number(x.variants_stock) > 0) ??
          p.variantsId?.[0];
        if (!v) return 0;
        const sell = Number(v.selling_price || 0);
        const offer = Number(v.offer_price || sell);
        const start = v.discount_start_date
          ? new Date(v.discount_start_date).getTime()
          : 0;
        const end = v.discount_end_date
          ? new Date(v.discount_end_date).getTime()
          : 0;
        const now = Date.now();
        const isOffer = offer < sell && now >= start && now <= end;
        return isOffer ? offer : sell;
      })
      .filter((n) => !Number.isNaN(n));
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 10000,
    };
  }, [initialProducts, initialMinPrice, initialMaxPrice, finalFilterOptions?.priceRange, initialFilterOptions]);

  console.log('ShopAllProducts - finalFilterOptions:', finalFilterOptions);
  console.log('ShopAllProducts - calculatedMinPrice:', calculatedMinPrice, 'calculatedMaxPrice:', calculatedMaxPrice);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    calculatedMinPrice,
    calculatedMaxPrice,
  ]);

  // Update priceRange when minPrice/maxPrice change
  useEffect(() => {
    setPriceRange([calculatedMinPrice, calculatedMaxPrice]);
  }, [calculatedMinPrice, calculatedMaxPrice]);

  console.log('ShopAllProducts - priceRange:', priceRange);

  // Remove duplicate useEffect

  const filteredAndSorted = useMemo(() => {
    return allProducts
      .filter((product) => {
        const price = (() => {
          const v =
            product.variantsId?.find((x) => Number(x.variants_stock) > 0) ??
            product.variantsId?.[0];
          if (!v) return 0;
          const sell = Number(v.selling_price || 0);
          const offer = Number(v.offer_price || sell);
          const start = v.discount_start_date
            ? new Date(v.discount_start_date).getTime()
            : 0;
          const end = v.discount_end_date
            ? new Date(v.discount_end_date).getTime()
            : 0;
          const now = Date.now();
          const isOffer = offer < sell && now >= start && now <= end;
          return isOffer ? offer : sell;
        })();
        if (price < priceRange[0] || price > priceRange[1]) return false;

        // 🔎 Use shared search state
        if (search.trim()) {
          const query = search.toLowerCase();
          const searchIn = [
            product.name?.toLowerCase() || "",
            ...(product.sub_category?.map((cat) => cat.name?.toLowerCase()) ||
              []),
            ...(product.variantsId?.map((v) => v.condition?.toLowerCase()) ||
              []),
          ].join(" ");
          if (!searchIn.includes(query)) return false;
        }

        if (selectedCats.length > 0) {
          const prodCatIds = (product.sub_category || []).map((cat) => cat._id);
          if (!prodCatIds.some((id) => selectedCats.includes(id))) return false;
        }

        if (selectedSizes.length > 0) {
          const prodSizes =
            product.variantsId?.flatMap((v) => v.variants_values || []) ?? [];
          if (!prodSizes.some((sz) => selectedSizes.includes(sz))) return false;
        }

        // Filter by conditions (tags from API)
        if (selectedConditions.length > 0) {
          const productConditions = product.variantsId?.map(v => v.condition).filter(Boolean) || [];
          if (!productConditions.some(condition => selectedConditions.includes(condition!))) return false;
        }

        // Filter by tags
        if (selectedTags.length > 0) {
          // Assuming tags are in product.tags or similar field
          const productTags = product.tags || [];
          if (!productTags.some(tag => selectedTags.includes(tag))) return false;
        }

        // Filter by variants
        if (Object.keys(selectedVariants).length > 0) {
          for (const [variantName, selectedValues] of Object.entries(selectedVariants)) {
            if (selectedValues.length > 0) {
              const productVariantValues = product.variantsId?.flatMap(v => v.variants_values || []) ?? [];
              if (!productVariantValues.some(value => selectedValues.includes(value))) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        const getPrice = (p: Product) => {
          const v =
            p.variantsId?.find((x) => Number(x.variants_stock) > 0) ??
            p.variantsId?.[0];
          if (!v) return 0;
          const sell = Number(v.selling_price || 0);
          const offer = Number(v.offer_price || sell);
          const start = v.discount_start_date
            ? new Date(v.discount_start_date).getTime()
            : 0;
          const end = v.discount_end_date
            ? new Date(v.discount_end_date).getTime()
            : 0;
          const now = Date.now();
          const isOffer = offer < sell && now >= start && now <= end;
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
    selectedCats,
    selectedSizes,
    selectedConditions,
    selectedTags,
    selectedVariants,
    priceRange,
    search,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSelectedCats([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSelectedTags([]);
    setSelectedVariants({});
    setPriceRange([calculatedMinPrice, calculatedMaxPrice]);
    setSearch(""); // ✅ clear shared search too
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-secondary">
      <div className="mx-auto max-w-[1800px] px-2 md:px-4 lg:px-6 py-2 md:py-6 h-full">
        <div className="h-full grid grid-cols-1 md:[grid-template-columns:390px_minmax(0,1fr)] gap-x-3">
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
                search={search}          // ✅ fixed
                setSearch={setSearch}   // ✅ fixed

                filterOptions={finalFilterOptions}
                selectedConditions={selectedConditions}
                setSelectedConditions={setSelectedConditions}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                selectedVariants={selectedVariants}
                setSelectedVariants={setSelectedVariants}

                apiMinPrice={calculatedMinPrice}
                apiMaxPrice={calculatedMaxPrice}

                minPrice={calculatedMinPrice}
                maxPrice={calculatedMaxPrice}
                initialProducts={initialProducts}
                filteredProductsCount={filteredAndSorted.length}
                clearAllFilters={clearAllFilters}
                isMobile={isMobile}
                isMobileFiltersOpen={isMobileFiltersOpen}
                setIsMobileFiltersOpen={setIsMobileFiltersOpen}
              />
            </div>
          </div>

          <main className="h-full flex-1 md:-mt-0 overflow-y-auto">   {/* 👈 overflow সরানো */}
            <div className="overflow-y-auto scrollbar-hide h-full"> {/* 👈 scroll container শুধু main এ */}
              <ShopDesktopHeader
                filteredAndSorted={filteredAndSorted}
                initialProducts={allProducts}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isMobile={isMobile} // Pass isMobile state here

                //new add

                showSearch={showSearch}
                setShowSearch={setShowSearch}
                search={search}
                setSearch={setSearch}


              />
              <ShopProductsGrid
                filteredAndSorted={filteredAndSorted}
                productsContainerRef={productsContainerRef as React.RefObject<HTMLDivElement>}
                initialProducts={allProducts}
                clearAllFilters={clearAllFilters}
                containerWidth={
                  typeof window !== "undefined"
                    ? window.innerWidth - sidebarWidth
                    : undefined
                }
                isLoadingMore={isLoadingMore}
              />

              {/* Load More Button */}
              {hasMorePages && filteredAndSorted.length > 0 && (
                <div className="flex justify-center py-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoadingMore ? "Loading..." : "Load More Products"}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
