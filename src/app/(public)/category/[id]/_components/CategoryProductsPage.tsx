
// app/(public)/category/[id]/_components/CategoryProductsPage.tsx
'use client';

import { Product } from '@/types/product';
import ProductCard from '@/components/ui/organisms/product-card';
import { Pagination } from '@/components/ui/molecules/pagination';
import { FiGrid, FiPackage } from 'react-icons/fi';
import { useState } from 'react';

interface Props {
    initialProducts?: Product[];
    category?: string;
    error?: string;
}

export default function CategoryProductsPage({ initialProducts = [], category = '', error: serverError }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Show 12 products per page

    const filtered = initialProducts; // Use server-side filtered data directly

    // Pagination logic
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filtered.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Smooth scroll to top of products grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FFEBF0] dark:bg-gray-800 md:mt-20">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary -top-2">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-red-800 to-primary" />
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 100 }).map((_, i) => {
                        const size = Math.random() * 14 + 12;
                        const left = Math.random() * 100;
                        const duration = Math.random() * 20 + 20;
                        const delay = Math.random() * 10;
                        return (
                            <span
                                key={i}
                                className="snowflake"
                                style={{
                                    left: `${left}%`,
                                    fontSize: `${size}px`,
                                    animationDuration: `${duration}s`,
                                    animationDelay: `${delay}s`,
                                }}
                            >
                                *
                            </span>
                        );
                    })}
                </div>

                <div className="relative md:py-6 py-2 mx-auto max-w-7xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-1 md:mb-4 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                        <FiGrid className="w-4 h-4" />
                        Category Collection
                    </div>
                    <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-4 animate-fade-in capitalize">
                        {category || 'Category'}
                    </h1>
                    <p className="text-sm md:text-xl text-white/90 md:mb-4 mb-1 max-w-2xl mx-auto">
                        Discover our curated collection of premium products
                    </p>
                    <div className="flex items-center justify-center gap-4 text-white/80">
                        <div className="flex items-center gap-2">
                            <FiPackage className="w-5 h-5" />
                            <span className="md:text-lg text-sm font-semibold">
                                {filtered.length} Product{filtered.length !== 1 && 's'}
                            </span>
                        </div>
                        <div className="w-2 h-2 bg-white/50 rounded-full" />
                        <span className="text-sm">Premium Quality</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto md:py-4 md:px-2 py-1">
                {serverError ? (
                    <div className="text-center py-20" role="status" aria-live="polite">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6">
                            <FiPackage className="w-10 h-10 text-gray-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            Error Loading Products
                        </h3>
                        <p className="text-red-500 text-sm mt-2" role="alert">
                            {serverError}
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20" role="status" aria-live="polite">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6">
                            <FiPackage className="w-10 h-10 text-gray-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            No Products Found
                        </h3>
                        <p className="text-gray-600 mb-1">
                            We couldn&apos;t find any products in this category.
                        </p>
                        <p className="text-sm text-gray-500">
                            Searched through {filtered.length} products.
                        </p>
                    </div>
                ) : (
                    <div>

                        <div className="grid max-[345px]:grid-cols-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 sm:gap-2 md:gap-4 w-full max-w-[1600px] mx-auto px-2 sm:px-4">
                            {currentProducts.map((product, idx) => (
                                <div
                                    key={product._id}
                                    className="animate-fade-in-up"
                                    style={{
                                        animationDelay: `${idx * 0.1}s`,
                                        animationFillMode: 'both',
                                    }}
                                    aria-label={`Product: ${product.name}`}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 max-w-7xl mx-auto px-2 sm:px-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}