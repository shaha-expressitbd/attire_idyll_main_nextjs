'use client';

import { useMemo, useState, useCallback, useEffect, memo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { FiGrid, FiPackage, FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '@/components/ui/organisms/product-card';
import { Pagination } from '@/components/ui/molecules/pagination';
import { LoadingSpinner } from '@/components/ui/atoms/loading-spinner';
import { debounce } from 'lodash';
import RangePriceFilter from '@/app/(public)/products/_components/rangeSlider';

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
/*  Helper – price of a product (first variant with offer logic)     */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Slug helper (copied from server)                                  */
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
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [selectedSubs, setSelectedSubs] = useState<string | null>(null);

    // Sub-category IDs
    const subCategoryIds = useMemo(() => {
        if (!mainCategory) return [];
        return mainCategory.children.map(c => c._id.toLowerCase());
    }, [mainCategory]);

    // Filter products by current category (including subcategories)
    const categoryFilteredProducts = useMemo(() => {
        if (!mainCategory || !initialProducts.length) return [];
        return initialProducts.filter(p =>
            p.sub_category?.some(sc => subCategoryIds.includes(sc._id.toLowerCase()))
        );
    }, [initialProducts, subCategoryIds, mainCategory]);

    // Calculate price range from category-specific products with offer price logic
    const calculatedPriceRange = useMemo(() => {
        if (categoryFilteredProducts.length === 0) return [0, 10000] as [number, number];

        const prices = categoryFilteredProducts.map((p) => {
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
        }).filter((n) => !isNaN(n) && n > 0);

        const min = prices.length ? Math.min(...prices) : 0;
        const max = prices.length ? Math.max(...prices) : 10000;
        return [min, max] as [number, number];
    }, [categoryFilteredProducts]);

    const [priceRange, setPriceRange] = useState<[number, number]>(calculatedPriceRange);
    const [priceMin, setPriceMin] = useState(calculatedPriceRange[0]);
    const [priceMax, setPriceMax] = useState(calculatedPriceRange[1]);

    // Update price range when calculated range changes (avoid infinite loops)
    useEffect(() => {
        // Only update if the calculated range has actually changed and user hasn't custom set values
        const hasUserInteracted = priceMin !== priceRange[0] || priceMax !== priceRange[1];
        if (!hasUserInteracted || priceRange[0] === 0 && priceRange[1] === 10000) {
            setPriceRange(calculatedPriceRange);
            setPriceMin(calculatedPriceRange[0]);
            setPriceMax(calculatedPriceRange[1]);
        } else {
            // Just update boundaries without changing user selection
            setPriceRange(calculatedPriceRange);
        }
    }, [calculatedPriceRange]);

    // Sync URL with subcategory from searchParams
    useEffect(() => {
        const subSlug = searchParams.get('subcategory');
        if (subSlug && mainCategory) {
            const sub = mainCategory.children.find(
                c => createSlug(c.name) === subSlug
            );
            setSelectedSubs(sub ? sub._id.toLowerCase() : null);
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

    const syncUrl = (newPage: number, additionalParams?: Record<string, string>) => {
        const p = new URLSearchParams(searchParams.toString());
        p.set('page', newPage.toString());
        if (additionalParams) {
            Object.entries(additionalParams).forEach(([key, value]) => {
                if (value) p.set(key, value);
                else p.delete(key);
            });
        }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePriceChange = useCallback((min: number, max: number) => {
        setPriceMin(min);
        setPriceMax(max);
        setCurrentPage(1);
        syncUrl(1);
    }, [syncUrl]);

    const toggleSub = (id: string, name: string) => {
        const slug = createSlug(name);
        const isCurrentlySelected = selectedSubs === id;
        const newSelection = isCurrentlySelected ? null : id;

        setSelectedSubs(newSelection);
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
        const p = new URLSearchParams();
        p.set('page', '1');
        updateUrl(p);
    };

    const hasActiveFilters = selectedSubs || searchTerm || priceMin !== priceRange[0] || priceMax !== priceRange[1];

    /* ------------------------------------------------------------------ */
    /*  Filtering + sorting + pagination                                   */
    /* ------------------------------------------------------------------ */
    const { filteredProducts, paginatedProducts, totalPages } = useMemo(() => {
        let list = [...initialProducts];

        // 1. Sub-category filter
        if (selectedSubs) {
            list = list.filter(p =>
                p.sub_category?.some(sc => selectedSubs === sc._id.toLowerCase())
            );
        } else {
            list = list.filter(p =>
                p.sub_category?.some(sc => subCategoryIds.includes(sc._id.toLowerCase()))
            );
        }

        // 2. Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            list = list.filter(p => {
                const n = p.name?.toLowerCase().includes(term);
                const s = p.short_description?.toLowerCase().includes(term);
                const l = p.long_description?.toLowerCase().includes(term);
                return n || s || l;
            });
        }

        // 3. Price filter
        list = list.filter(p => {
            const v = p.variantsId?.find((x) => Number(x.variants_stock) > 0) ?? p.variantsId?.[0];
            if (!v) return true; // Include products without variants
            const sell = Number(v.selling_price || 0);
            const offer = Number(v.offer_price || sell);
            const now = Date.now();
            const isOffer =
                offer < sell &&
                now >= new Date(v.discount_start_date || 0).getTime() &&
                now <= new Date(v.discount_end_date || 0).getTime();
            const price = isOffer ? offer : sell;
            return price >= priceMin && price <= priceMax;
        });

        // 4. Sorting
        if (sortBy === 'price-low') {
            list.sort((a, b) => {
                const getPriceForSort = (p: Product) => {
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
                return getPriceForSort(a) - getPriceForSort(b);
            });
        } else if (sortBy === 'price-high') {
            list.sort((a, b) => {
                const getPriceForSort = (p: Product) => {
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
                return getPriceForSort(b) - getPriceForSort(a);
            });
        } else if (sortBy === 'name-asc') {
            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortBy === 'name-desc') {
            list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        }

        // 5. Pagination
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

    /* ---------- Loading state ---------- */
    // No longer using isLoadingPrice since we removed the API call

    if (!mainCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary">
                <div className="text-center">
                    <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Category Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400">The requested category does not exist.</p>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------------------------ */
    /*  Filter Sidebar Component (Memoized)                                */
    /* ------------------------------------------------------------------ */
    const FilterSidebar = memo(({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="space-y-4">
            {/* Sub-categories */}
            <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Sub-categories</h3>
                        {selectedSubs && (
                            <button
                                onClick={() => {
                                    const sub = mainCategory.children.find(s => s._id.toLowerCase() === selectedSubs);
                                    if (sub) toggleSub(selectedSubs, sub.name);
                                }}
                                className="text-xs text-primary hover:text-primary-dark transition"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
                <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                    {mainCategory.children.map(child => {
                        const checked = selectedSubs === child._id.toLowerCase();
                        return (
                            <label
                                key={child._id}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${checked
                                    ? 'bg-primary/10 border border-primary'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                                    }`}
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
                                        className="w-10 h-10 object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-secondary rounded-md flex items-center justify-center">
                                        <FiPackage className="w-5 h-5 text-gray-400" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                                    {child.name}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Price Range</h3>
                        <button
                            onClick={() => handlePriceChange(priceRange[0], priceRange[1])}
                            className="text-xs text-primary hover:text-primary-dark transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <RangePriceFilter
                        minPrice={priceRange[0]}
                        maxPrice={priceRange[1]}
                        priceRange={[priceMin, priceMax]}
                        setPriceRange={(newRange) => handlePriceChange(newRange[0], newRange[1])}
                    />
                </div>
            </div>

            {/* Clear All Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center justify-center gap-2 font-medium"
                >
                    <FiX className="w-4 h-4" />
                    Clear All Filters
                </button>
            )}
        </div>
    ));

    FilterSidebar.displayName = 'FilterSidebar';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-secondary">
            <div className="container mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="mb-6">


                    {/* Search and Sort Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 md:mt-20">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={e => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-secondary dark:text-white"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative sm:w-48">
                            <select
                                value={sortBy}
                                onChange={e => handleSort(e.target.value)}
                                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none dark:bg-secondary dark:text-white cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                                <option value="name-desc">Name: Z to A</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="lg:hidden px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 font-medium"
                        >
                            <FiFilter className="w-5 h-5" />
                            Filters
                            {hasActiveFilters && (
                                <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                                    Active
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-20">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-secondary rounded-lg shadow-sm">
                                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-secondary rounded-full flex items-center justify-center mb-6">
                                    <FiPackage className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {searchTerm ? 'No Results Found' : 'No Products Available'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                    {searchTerm
                                        ? `No products match "${searchTerm}". Try different keywords or filters.`
                                        : `No products available in ${mainCategory.name} category.`}
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Products Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {paginatedProducts.map(product => (
                                        <div key={product._id} className="group">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8">
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

                {/* Mobile Filter Panel */}
                {isMobileFiltersOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        />
                        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-secondary shadow-2xl lg:hidden overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-primary text-white p-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <FiFilter className="w-5 h-5" />
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <FilterSidebar isMobile />
                            </div>

                            {/* Apply Button */}
                            <div className="sticky bottom-0 p-4 bg-white dark:bg-secondary border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}