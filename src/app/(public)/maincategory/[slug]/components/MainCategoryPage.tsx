'use client';

import { useMemo, useState, useCallback, useEffect, memo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { FiPackage, FiFilter, FiX, FiChevronLeft } from 'react-icons/fi';
import ProductCard from '@/components/ui/organisms/product-card';
import { Pagination } from '@/components/ui/molecules/pagination';
import { debounce } from 'lodash';

import Image from '@/components/ui/atoms/image';
import RangePriceFilter from './rangeSlider';

interface BusinessCategory {
    _id: string;
    name: string;
    children: {
        _id: string;
        name: string;
        alterImage?: { secure_url: string };
    }[];
    cover?: { secure_url: string };
}

interface Props {
    business: any;
    initialProducts: Product[];
    mainCategory: BusinessCategory | null;
    mainCategoryId: string | null;
    page: number;
    limit: number;
}

// Static category images mapping
const STATIC_CATEGORY_IMAGES: Record<string, string[]> = {
    women: ['/assets/11.png', '/assets/11.png', '/assets/11.png'],
    man: ['/assets/11.png'],
    "kids-&-family": ['/assets/11.png'],
    bridal: ['/assets/11.png', '/assets/11.png', '/assets/11.png'],
};

/**
 * Creates a URL-friendly slug from a given string
 * @param {string} name - The input string to be converted into a slug
 * @returns {string} The formatted slug string
 */
const createSlug = (name: string): string =>
    name
        .toLowerCase() // Convert all characters to lowercase
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters except hyphens
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

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

    useEffect(() => {
        if (isMobileFiltersOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => document.body.classList.remove('overflow-hidden');
    }, [isMobileFiltersOpen]);

    const subCategoryIds = useMemo(() => {
        return mainCategory?.children.map(c => c._id.toLowerCase()) || [];
    }, [mainCategory]);

    const categoryFilteredProducts = useMemo(() => {
        if (!mainCategory || !initialProducts.length) return [];
        return initialProducts.filter(p =>
            p.sub_category?.some(sc => subCategoryIds.includes(sc._id.toLowerCase()))
        );
    }, [initialProducts, subCategoryIds]);

    const calculatedPriceRange = useMemo(() => {
        if (categoryFilteredProducts.length === 0) return [0, 10000] as [number, number];
        const prices = categoryFilteredProducts.map(getPrice).filter(n => n > 0);
        const min = prices.length ? Math.min(...prices) : 0;
        const max = prices.length ? Math.max(...prices) : 10000;
        return [min, max] as [number, number];
    }, [categoryFilteredProducts]);

    const [priceRange, setPriceRange] = useState<[number, number]>(calculatedPriceRange);
    const [priceMin, setPriceMin] = useState(calculatedPriceRange[0]);
    const [priceMax, setPriceMax] = useState(calculatedPriceRange[1]);

    useEffect(() => {
        const hasUserInteracted = priceMin !== priceRange[0] || priceMax !== priceRange[1];
        if (!hasUserInteracted) {
            setPriceRange(calculatedPriceRange);
            setPriceMin(calculatedPriceRange[0]);
            setPriceMax(calculatedPriceRange[1]);
        } else {
            setPriceRange(calculatedPriceRange);
        }
    }, [calculatedPriceRange]);

    useEffect(() => {
        const subSlug = searchParams.get('subcategory');
        if (subSlug && mainCategory) {
            const sub = mainCategory.children.find(c => createSlug(c.name) === subSlug);
            setSelectedSubs(sub ? sub._id.toLowerCase() : null);
        } else {
            setSelectedSubs(null);
        }
    }, [searchParams, mainCategory]);

    const currentCategoryName = useMemo(() => {
        if (selectedSubs && mainCategory) {
            const sub = mainCategory.children.find(c => c._id.toLowerCase() === selectedSubs);
            return sub?.name || mainCategory.name;
        }
        return mainCategory?.name || 'Category';
    }, [selectedSubs, mainCategory]);

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
                value ? p.set(key, value) : p.delete(key);
            });
        }
        updateUrl(p);
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
        const isSelected = selectedSubs === id;
        setSelectedSubs(isSelected ? null : id);
        setCurrentPage(1);

        const p = new URLSearchParams(searchParams.toString());
        if (!isSelected) p.set('subcategory', slug);
        else p.delete('subcategory');
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

    const { filteredProducts, paginatedProducts, totalPages } = useMemo(() => {
        let list = [...categoryFilteredProducts];

        if (selectedSubs) {
            list = list.filter(p =>
                p.sub_category?.some(sc => sc._id.toLowerCase() === selectedSubs)
            );
        }

        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            list = list.filter(p =>
                p.name?.toLowerCase().includes(term) ||
                p.short_description?.toLowerCase().includes(term) ||
                p.long_description?.toLowerCase().includes(term)
            );
        }

        list = list.filter(p => {
            const price = getPrice(p);
            return price >= priceMin && price <= priceMax;
        });

        if (sortBy === 'price-low') list.sort((a, b) => getPrice(a) - getPrice(b));
        if (sortBy === 'price-high') list.sort((a, b) => getPrice(b) - getPrice(a));
        if (sortBy === 'name-asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        const total = Math.ceil(list.length / limit);
        const start = (currentPage - 1) * limit;
        const pageItems = list.slice(start, start + limit);

        return { filteredProducts: list, paginatedProducts: pageItems, totalPages: total };
    }, [categoryFilteredProducts, selectedSubs, searchTerm, sortBy, priceMin, priceMax, currentPage, limit]);

    if (!mainCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary">
                <div className="text-center">
                    <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Category Not Found</h2>
                </div>
            </div>
        );
    }

    const FilterSidebar = memo(({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="space-y-6">
            {/* Sub-categories with Image */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-secondary border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Sub-categories</h3>
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
                    </div>
                </div>
                <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                    {mainCategory.children.map(child => {
                        const checked = selectedSubs === child._id.toLowerCase();
                        return (
                            <label
                                key={child._id}
                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${checked
                                    ? 'bg-primary/10 border-primary shadow-md'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={isMobile ? "sub-mobile" : "subcategory"}
                                    checked={checked}
                                    onChange={() => toggleSub(child._id.toLowerCase(), child.name)}
                                    className="w-5 h-5 text-primary"
                                />
                                {child.alterImage?.secure_url ? (
                                    <Image
                                        src={child.alterImage.secure_url}
                                        alt={child.name}
                                        className="w-14 h-14 object-cover rounded-lg shadow-sm"
                                        variant='small'
                                    />
                                ) : (
                                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <FiPackage className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">
                                    {child.name}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-gray-50 dark:bg-secondary border-b">
                    <h3 className="font-semibold text-black dark:text-white">Price Range</h3>
                </div>
                <div className="p-5">
                    <RangePriceFilter
                        minPrice={priceRange[0]}
                        maxPrice={priceRange[1]}
                        priceRange={[priceMin, priceMax]}
                        setPriceRange={(r) => handlePriceChange(r[0], r[1])}
                    />
                </div>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    ));
    FilterSidebar.displayName = 'FilterSidebar';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-secondary">
            {/* Full Width Banner */}
            {mainCategory.cover?.secure_url ? (
                <div className="relative h-64 md:h-96 w-full overflow-hidden">
                    <Image
                        src={mainCategory.cover.secure_url}
                        alt={mainCategory.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h1 className="text-4xl md:text-6xl font-bold">{mainCategory.name}</h1>
                        <p className="text-xl md:text-2xl mt-2 opacity-90">Best collection for you</p>
                    </div>
                </div>
            ) : (
                <div className="h-64 md:h-80 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white">{mainCategory.name}</h1>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="hidden lg:block">
                        <div className="sticky top-20">
                            <FilterSidebar />
                        </div>
                    </aside>

                    <div className="lg:col-span-3">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">{currentCategoryName}</h2>

                        {/* Static 3 Cards for Fixed Categories - Always Show */}
                        {!selectedSubs && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {(() => {
                                    const categorySlug = createSlug(mainCategory.name);
                                    const images = STATIC_CATEGORY_IMAGES[categorySlug] || [];
                                    return images.map((image, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                                            <div className="relative h-64">
                                                <Image
                                                    src={image}
                                                    alt={`${mainCategory.name} ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    variant='large'
                                                    priority={index < 2} // Preload first 2 images
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {mainCategory.name} Collection {index + 1}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Discover our curated {mainCategory.name.toLowerCase()} styles
                                                </p>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}

                        {/* Products Section - Only show when subcategory is selected */}
                        {selectedSubs && filteredProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                                    {paginatedProducts.map((product, i) => (
                                        <div key={product._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center">
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
                        ) : selectedSubs && filteredProducts.length === 0 ? (
                            <div className="text-center py-24">
                                <FiPackage className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">No products found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Try different filters</p>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Mobile Filter Button */}
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-white px-3 py-10 rounded-l-xl shadow-2xl lg:hidden hover:px-4 transition-all"
                >
                    <div className="flex flex-col items-center gap-2">
                        <FiChevronLeft className="w-6 h-6" />
                        <span className="text-xs font-bold writing-mode-vertical">FILTERS</span>
                    </div>
                </button>

                {/* Mobile Filter Panel */}
                {isMobileFiltersOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setIsMobileFiltersOpen(false)} />
                        <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 z-50 shadow-2xl overflow-y-auto">
                            <div className="p-4 bg-primary text-white flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FiFilter /> Filters
                                </h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)}>
                                    <FiX className="w-7 h-7" />
                                </button>
                            </div>
                            <div className="p-6">
                                <FilterSidebar isMobile />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                .writing-mode-vertical { writing-mode: vertical-rl; text-orientation: mixed; }
            `}</style>
        </div>
    );
}