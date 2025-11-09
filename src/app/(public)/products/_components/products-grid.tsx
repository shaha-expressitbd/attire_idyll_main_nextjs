// components/shop-all-products/products-grid.tsx
"use client";
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ui/organisms/product-card";
import ProductGridSkeleton from "@/components/ui/skeleton/ProductGridSkeleton";

interface ShopProductsGridProps {
    productsContainerRef: React.RefObject<HTMLDivElement>;
    filteredAndSorted: Product[];
    clearAllFilters: () => void;
    isLoadingMore?: boolean;
}

// Tailwind breakpoints (ডিফল্ট)
const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1380,
};

export default function ShopProductsGrid({
    productsContainerRef,
    filteredAndSorted,
    clearAllFilters,
    isLoadingMore = false,
}: ShopProductsGridProps) {
    return (
        <div ref={productsContainerRef} className="md:p-4 md:mt-0 relative z-10">
            {filteredAndSorted.length > 0 ? (
                <div
                    className={`
            grid gap-2
            grid-cols-2
            sm:grid-cols-2 
            md:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
          `}
                >
                    {filteredAndSorted.map((product, i) => (
                        <ProductCard
                            key={`${product._id}-${i}`}
                            product={product}
                            isAboveFold={i < 8}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-16 text-center text-gray-600 dark:text-white">
                    No products matched your filters.
                    <button
                        onClick={clearAllFilters}
                        className="mt-4 text-primary hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Loading skeleton */}
            {isLoadingMore && (
                <div className="mt-8">
                    <ProductGridSkeleton count={12} />
                </div>
            )}


        </div>
    );
}