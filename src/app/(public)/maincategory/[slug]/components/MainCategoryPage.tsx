'use client';

import { useMemo, useState, useCallback, useEffect, memo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { FiGrid, FiPackage, FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '@/components/ui/organisms/product-card';
import { Pagination } from '@/components/ui/molecules/pagination';
import { LoadingSpinner } from '@/components/ui/atoms/loading-spinner';
import { debounce } from 'lodash';
import { useGetFilterOptionsQuery } from '@/lib/api/publicApi';

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
/*  Slug helper (copied from server)                                   */
/* ------------------------------------------------------------------ */
const createSlug = (name: string): string =>
    name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

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

    // Use the useGetFilterOptionsQuery hook to fetch filter options including price range
    const { data: filterOptions, isLoading: isLoadingPrice, error: priceError } = useGetFilterOptionsQuery({
        isPriceRange: true,
    });

    // Calculate price range with API data priority, fallback to product calculation
    const calculatedPriceRange = useMemo(() => {
        if (filterOptions?.priceRange) {
            const apiMin = Number(filterOptions.priceRange.min);
            const apiMax = Number(filterOptions.priceRange.max);
            return [apiMin, apiMax] as [number, number];
        }
        // Fallback to product calculation
        const prices = initialProducts.map(getPrice).filter(p => p > 0);
        const min = prices.length ? Math.min(...prices) : 0;
        const max = prices.length ? Math.max(...prices) : 1000;
        return [min, max] as [number, number];
    }, [filterOptions?.priceRange, initialProducts]);

    const [priceRange, setPriceRange] = useState<[number, number]>(calculatedPriceRange);
    const [priceMin, setPriceMin] = useState(calculatedPriceRange[0]);
    const [priceMax, setPriceMax] = useState(calculatedPriceRange[1]);

    // Update priceRange state when calculatedPriceRange changes
    useEffect(() => {
        setPriceRange(calculatedPriceRange);
        setPriceMin(calculatedPriceRange[0]);
        setPriceMax(calculatedPriceRange[1]);
    }, [calculatedPriceRange]);

    /* ---------- Sub-category filter state ---------- */
    const [selectedSubs, setSelectedSubs] = useState<string | null>(null);

    /* ---------- Mobile filters modal state ---------- */
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    /* ---------- Sub-category IDs (once) ---------- */
    const subCategoryIds = useMemo(() => {
        if (!mainCategory) return [];
        return mainCategory.children.map(c => c._id.toLowerCase());
    }, [mainCategory]);

    /* ---------- Sync URL with subcategory from searchParams ---------- */
    useEffect(() => {
        const subSlug = searchParams.get('subcategory');
        if (subSlug && mainCategory) {
            const sub = mainCategory.children.find(
                c => createSlug(c.name) === subSlug
            );
            if (sub) {
                setSelectedSubs(sub._id.toLowerCase());
            } else {
                setSelectedSubs(null);
            }
        } else {
            setSelectedSubs(null);
        }
    }, [searchParams, mainCategory]);

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

    const toggleSub = (id: string, name: string) => {
        const slug = createSlug(name);
        const isCurrentlySelected = selectedSubs === id;

        setSelectedSubs(isCurrentlySelected ? null : id);
        setCurrentPage(1);

        const p = new URLSearchParams(searchParams.toString());
        if (!isCurrentlySelected) {
            p.set('subcategory', slug);
        } else {
            p.delete('subcategory');
        }
        p.set('page', '1');
        updateUrl(p);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSubs(null);
        setPriceMin(priceRange[0]);
        setPriceMax(priceRange[1]);
        setCurrentPage(1);
        const p = new URLSearchParams(searchParams.toString());
        p.delete('subcategory');
        p.delete('page');
        updateUrl(p);
    };

    /* ------------------------------------------------------------------ */
    /*  Filtering + sorting + pagination                                   */
    /* ------------------------------------------------------------------ */
    const { filteredProducts, paginatedProducts, totalPages } = useMemo(() => {
        let list = [...initialProducts];

        /* ---- 1. Sub-category filter ---- */
        if (selectedSubs) {
            list = list.filter(p =>
                p.sub_category?.some(sc =>
                    selectedSubs === sc._id.toLowerCase()
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

    /* ---------- Loading state for price range ---------- */
    if (isLoadingPrice) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    /* ---------- Error state for price range ---------- */
    if (priceError && !mainCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Failed to load price range information.</p>
            </div>
        );
    }

    if (!mainCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Category not found.</p>
            </div>
        );
    }

    /* ------------------------------------------------------------------ */
    /*  Filter Sidebar Component (Memoized)                                */
    /* ------------------------------------------------------------------ */
    const FilterSidebar = memo(({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`space-y-6 ${isMobile ? '' : 'sticky top-6'}`}>
            {/* Sub-categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                    Sub-categories
                    {selectedSubs && (
                        <button
                            onClick={() => {
                                const sub = mainCategory.children.find(s => s._id.toLowerCase() === selectedSubs);
                                if (sub) toggleSub(selectedSubs, sub.name);
                            }}
                            className="text-xs text-primary hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {mainCategory.children.map(child => {
                        const checked = selectedSubs === child._id.toLowerCase();
                        return (
                            <label
                                key={child._id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                            >
                                <input
                                    type="radio"
                                    name={isMobile ? "subcategory-mobile" : "subcategory"}
                                    checked={checked}
                                    onChange={() => toggleSub(child._id.toLowerCase(), child.name)}
                                    className="w-4 h-4 text-primary focus:ring-primary"
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
                    {isLoadingPrice ? (
                        <LoadingSpinner />
                    ) : (
                        <button
                            onClick={() => {
                                setPriceMin(priceRange[0]);
                                setPriceMax(priceRange[1]);
                                setCurrentPage(1);
                                syncUrl(1);
                            }}
                            className="text-xs text-primary hover:underline"
                            disabled={isLoadingPrice}
                        >
                            Reset
                        </button>
                    )}
                </h3>

                {priceError ? (
                    <p className="text-red-500 text-sm">Unable to load price filter options.</p>
                ) : (
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
                            disabled={isLoadingPrice}
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
                                disabled={isLoadingPrice}
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
                                disabled={isLoadingPrice}
                            />
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            ৳{priceMin} – ৳{priceMax}
                        </p>
                    </div>
                )}
            </div>

            {/* Clear All */}
            {(selectedSubs || searchTerm || priceMin !== priceRange[0] || priceMax !== priceRange[1]) && (
                <button
                    onClick={clearFilters}
                    className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-1"
                >
                    <FiX className="w-4 h-4" />
                    Clear All Filters
                </button>
            )}
        </div>
    ));

    FilterSidebar.displayName = 'FilterSidebar';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* ------------------- CONTENT ------------------- */}
            <div className="container mx-auto md:px-4 px-1 py-6">
                {/* ---- Two-column layout ---- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* ---------- LEFT SIDEBAR (DESKTOP - STICKY) ---------- */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <FilterSidebar />
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
                                        ? `No products match "${searchTerm}". Try different keywords.`
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

                {/* ---------- MOBILE FILTER TOGGLE BUTTON (RIGHT SIDE STICKY) ---------- */}
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 lg:hidden z-40 bg-primary text-white px-2 py-6 rounded-l-lg shadow-lg hover:bg-secondary transition-all duration-300 hover:px-3"
                    aria-label="Open filters"
                >
                    <div className="flex flex-col items-center gap-1">
                        <FiChevronLeft className="w-5 h-5" />
                        <span className="text-xs font-semibold writing-mode-vertical">FILTER</span>
                    </div>
                </button>

                {/* ---------- MOBILE FILTER SLIDE PANEL ---------- */}
                <div
                    className={`fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-primary to-secondary">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FiFilter className="w-5 h-5" />
                            Filters
                        </h2>
                        <button
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                            aria-label="Close filters"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable content */}
                    <div className="overflow-y-auto h-[calc(100vh-64px)] p-4">
                        <FilterSidebar isMobile />
                    </div>
                </div>

                {/* Backdrop */}
                {isMobileFiltersOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                        onClick={() => setIsMobileFiltersOpen(false)}
                    />
                )}
            </div>

            <style jsx>{`
                .writing-mode-vertical {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </div>
    );
}