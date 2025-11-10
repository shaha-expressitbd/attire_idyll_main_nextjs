'use client';

import { useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { FiGrid, FiPackage, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '@/components/ui/organisms/product-card';
import { Pagination } from '@/components/ui/molecules/pagination';
import { debounce } from 'lodash';


interface BusinessCategory {
    _id: string;
    name: string;
    children: {
        _id: string;
        name: string;
        image?: { secure_url: string };
    }[];
}

interface Props {
    business: any;
    initialProducts: Product[];
    mainCategory: BusinessCategory | null;
    mainCategoryId: string | null;
    page: number;
    limit: number;
}

/* ------------------------------------------------------------------ */
/*  Helper – price of a product (first variant)                        */
/* ------------------------------------------------------------------ */
const getPrice = (p: Product) =>
    Number(p.variantsId?.[0]?.selling_price) || 0;

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function MainCategoryPage({
    business,
    initialProducts,
    mainCategory,
    mainCategoryId,
    page,
    limit,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [sortBy, setSortBy] = useState('featured');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(page);

    /* ---------- Price filter state ---------- */
    const [priceRange, setPriceRange] = useState<[number, number]>(() => {
        const prices = initialProducts.map(getPrice).filter(p => p > 0);
        const min = prices.length ? Math.min(...prices) : 0;
        const max = prices.length ? Math.max(...prices) : 1000;
        return [min, max];
    });
    const [priceMin, setPriceMin] = useState(priceRange[0]);
    const [priceMax, setPriceMax] = useState(priceRange[1]);

    /* ---------- Sub-category filter state ---------- */
    const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

    /* ---------- Sub-category IDs (once) ---------- */
    const subCategoryIds = useMemo(() => {
        if (!mainCategory) return [];
        return mainCategory.children.map(c => c._id.toLowerCase());
    }, [mainCategory]);

    /* ---------- Debounced URL update ---------- */
    const updateUrl = useCallback(
        debounce((params: URLSearchParams) => {
            router.replace(`?${params.toString()}`, { scroll: false });
        }, 300),
        [router]
    );

    const syncUrl = (newPage: number) => {
        const p = new URLSearchParams(searchParams.toString());
        p.set('page', newPage.toString());
        updateUrl(p);
    };

    /* ---------- Handlers ---------- */
    const handleSort = (v: string) => {
        setSortBy(v);
        setCurrentPage(1);
        syncUrl(1);
    };

    const handleSearch = (v: string) => {
        setSearchTerm(v);
        setCurrentPage(1);
        syncUrl(1);
    };

    const handlePage = (p: number) => {
        setCurrentPage(p);
        syncUrl(p);
    };

    const handlePriceChange = (min: number, max: number) => {
        setPriceMin(min);
        setPriceMax(max);
        setCurrentPage(1);
        syncUrl(1);
    };

    const toggleSub = (id: string) => {
        setSelectedSubs(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
        setCurrentPage(1);
        syncUrl(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSubs([]);
        setPriceMin(priceRange[0]);
        setPriceMax(priceRange[1]);
        setCurrentPage(1);
        syncUrl(1);
    };

    /* ------------------------------------------------------------------ */
    /*  Filtering + sorting + pagination                                   */
    /* ------------------------------------------------------------------ */
    const { filteredProducts, paginatedProducts, totalPages } = useMemo(() => {
        let list = [...initialProducts];

        /* ---- 1. Sub-category filter ---- */
        if (selectedSubs.length) {
            list = list.filter(p =>
                p.sub_category?.some(sc =>
                    selectedSubs.includes(sc._id.toLowerCase())
                )
            );
        } else {
            // keep only products that belong to the main category
            list = list.filter(p =>
                p.sub_category?.some(sc => subCategoryIds.includes(sc._id.toLowerCase()))
            );
        }

        /* ---- 2. Search filter ---- */
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            list = list.filter(p => {
                const n = p.name?.toLowerCase().includes(term);
                const s = p.short_description?.toLowerCase().includes(term);
                const l = p.long_description?.toLowerCase().includes(term);
                return n || s || l;
            });
        }

        /* ---- 3. Price filter ---- */
        list = list.filter(p => {
            const price = getPrice(p);
            return price >= priceMin && price <= priceMax;
        });

        /* ---- 4. Sorting ---- */
        if (sortBy === 'price-low') {
            list.sort((a, b) => getPrice(a) - getPrice(b));
        } else if (sortBy === 'price-high') {
            list.sort((a, b) => getPrice(b) - getPrice(a));
        }
        // 'newest' not implemented – add createdAt field if you have it

        /* ---- 5. Pagination ---- */
        const total = Math.ceil(list.length / limit);
        const start = (currentPage - 1) * limit;
        const end = start + limit;
        const pageItems = list.slice(start, end);

        return {
            filteredProducts: list,
            paginatedProducts: pageItems,
            totalPages: total,
        };
    }, [
        initialProducts,
        subCategoryIds,
        selectedSubs,
        searchTerm,
        sortBy,
        priceMin,
        priceMax,
        currentPage,
        limit,
    ]);

    if (!mainCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Category not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">



            {/* ------------------- CONTENT ------------------- */}
            <div className="container mx-auto md:px-4 px-1 py-6">


                {/* ---- Two-column layout ---- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* ---------- LEFT SIDEBAR ---------- */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Sub-categories */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                            <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                                Sub-categories
                                {selectedSubs.length > 0 && (
                                    <button
                                        onClick={() => setSelectedSubs([])}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Clear
                                    </button>
                                )}
                            </h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {mainCategory.children.map(child => {
                                    const checked = selectedSubs.includes(child._id.toLowerCase());
                                    return (
                                        <label
                                            key={child._id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleSub(child._id.toLowerCase())}
                                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                                            />
                                            {child.image?.secure_url ? (
                                                <img
                                                    src={child.image.secure_url}
                                                    alt={child.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                                    <FiPackage className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                            <span className="text-sm flex-1">{child.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price range */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                            <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                                Price Range
                                <button
                                    onClick={() => {
                                        setPriceMin(priceRange[0]);
                                        setPriceMax(priceRange[1]);
                                        setCurrentPage(1);
                                        syncUrl(1);
                                    }}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Reset
                                </button>
                            </h3>

                            <div className="space-y-4">
                                {/* Slider */}
                                <input
                                    type="range"
                                    min={priceRange[0]}
                                    max={priceRange[1]}
                                    value={priceMax}
                                    onChange={e => handlePriceChange(priceMin, Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${((priceMax - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100
                                            }%, #e5e7eb ${((priceMax - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100
                                            }%, #e5e7eb 100%)`,
                                    }}
                                />

                                {/* Min-Max inputs */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={priceMin}
                                        onChange={e => {
                                            const v = Number(e.target.value);
                                            if (v >= priceRange[0] && v <= priceMax) handlePriceChange(v, priceMax);
                                        }}
                                        className="w-full px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <span className="text-gray-500">–</span>
                                    <input
                                        type="number"
                                        value={priceMax}
                                        onChange={e => {
                                            const v = Number(e.target.value);
                                            if (v <= priceRange[1] && v >= priceMin) handlePriceChange(priceMin, v);
                                        }}
                                        className="w-full px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    ৳{priceMin} – ৳{priceMax}
                                </p>
                            </div>
                        </div>

                        {/* Clear All */}
                        {(selectedSubs.length || searchTerm || priceMin !== priceRange[0] || priceMax !== priceRange[1]) && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-1"
                            >
                                <FiX className="w-4 h-4" />
                                Clear All Filters
                            </button>
                        )}
                    </aside>

                    {/* ---------- RIGHT GRID ---------- */}
                    <div className="lg:col-span-3">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="mx-auto w-32 h-32 mb-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10" />
                                    <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full shadow-inner flex items-center justify-center">
                                        <FiPackage className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {searchTerm ? 'No Results Found' : 'No Products Available'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                    {searchTerm
                                        ? `No products match “${searchTerm}”. Try different keywords.`
                                        : `No products in ${mainCategory.name} category.`}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => handleSearch('')}
                                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FiPackage className="w-6 h-6 text-primary" />
                                        <h2 className="text-xl md:text-2xl font-bold capitalize">
                                            All Products in {mainCategory.name}
                                        </h2>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''})
                                    </span>
                                </div>

                                {/* Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                    {paginatedProducts.map((product, i) => (
                                        <div
                                            key={product._id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${i * 0.05}s` }}
                                        >
                                            <div className="group transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-1">
                                                <ProductCard product={product} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePage}
                                            itemsPerPage={limit}
                                            totalItems={filteredProducts.length}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}