"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import { FiX } from "react-icons/fi";
import { BiFilterAlt } from "react-icons/bi";
import CategoryTree from "./category-tree";
import RangePriceFilter from "./rangeSlider";

// Type definitions
interface FilterCategory {
    _id: string;
    name: string;
    products: number;
    children: FilterCategory[];
}

interface FilterOptions {
    tags: string[];
    conditions: string[];
    priceRange: { min: string; max: string };
    variantsValues: { name: string; values: string[] }[];
    categories: FilterCategory[];
}

interface MobileFilterModalProps {
    categories: Category[];
    selectedCats: string[];
    setSelectedCats: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSizes: string[];
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    minPrice: number;
    maxPrice: number;
    initialProducts: Product[];
    isMobileFiltersOpen: boolean;
    setIsMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filterOptions?: FilterOptions;
    selectedConditions?: string[];
    setSelectedConditions?: React.Dispatch<React.SetStateAction<string[]>>;
    selectedTags?: string[];
    setSelectedTags?: React.Dispatch<React.SetStateAction<string[]>>;
    selectedVariants?: { [key: string]: string[] };
    setSelectedVariants?: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
    apiMinPrice?: number;
    apiMaxPrice?: number;
    clearAllFilters?: () => void;
}

// Updated sectionStyles to use bg-secondary
const sectionStyles = {


    default: { accentColor: 'text-gray-600 dark:text-gray-400' },
};

export default function MobileFilterModal({
    categories,
    selectedCats,
    setSelectedCats,
    selectedSizes,
    setSelectedSizes,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    initialProducts,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    filterOptions,
    selectedConditions = [],
    setSelectedConditions = () => { },
    selectedTags = [],
    setSelectedTags = () => { },
    selectedVariants = {},
    setSelectedVariants = () => { },
    apiMinPrice,
    apiMaxPrice,
    clearAllFilters,
}: MobileFilterModalProps) {
    // Safe defaults for optional filterOptions
    const conditions = filterOptions?.conditions || [];
    const tags = filterOptions?.tags || [];
    const variantsValues = filterOptions?.variantsValues || [];
    const apiCategories = filterOptions?.categories || [];

    const toggle = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setList(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
    };

    // Memoized size calculation
    const allSizes = React.useMemo(() => {
        const sizes = new Set<string>();
        const sizeVariant = variantsValues.find(v => v.name.toLowerCase().includes('size'));

        if (sizeVariant) {
            return sizeVariant.values.sort((a, b) => {
                const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
                const aIndex = sizeOrder.indexOf(a.toUpperCase());
                const bIndex = sizeOrder.indexOf(b.toUpperCase());
                return aIndex !== -1 && bIndex !== -1 ? aIndex - bIndex :
                    aIndex !== -1 ? -1 :
                        bIndex !== -1 ? 1 :
                            a.localeCompare(b);
            });
        }

        initialProducts.forEach(p => {
            p.variantsId?.forEach(v => {
                v.variants_values?.forEach(size => size?.trim() && sizes.add(size.trim()));
            });
        });

        return Array.from(sizes).sort((a, b) => {
            const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
            const aIndex = sizeOrder.indexOf(a.toUpperCase());
            const bIndex = sizeOrder.indexOf(b.toUpperCase());
            return aIndex !== -1 && bIndex !== -1 ? aIndex - bIndex :
                aIndex !== -1 ? -1 :
                    bIndex !== -1 ? 1 :
                        a.localeCompare(b);
        });
    }, [initialProducts, filterOptions?.variantsValues]);

    // Memoized active filters count
    const activeFiltersCount = React.useMemo(() => (
        selectedCats.length +
        selectedSizes.length +
        selectedConditions.length +
        selectedTags.length +
        Object.values(selectedVariants).flat().length +
        ((priceRange[0] !== (apiMinPrice ?? minPrice) || priceRange[1] !== (apiMaxPrice ?? maxPrice)) ? 1 : 0)
    ), [selectedCats, selectedSizes, selectedConditions, selectedTags, selectedVariants, priceRange, minPrice, maxPrice, apiMinPrice, apiMaxPrice]);

    // Filter Section Component
    const FilterSection = ({ title, children, id, count }: { title: string; children: React.ReactNode; id: string; count?: number }) => {
        const [isOpen, setIsOpen] = React.useState(true); // Default open for mobile
        const style = sectionStyles[id as keyof typeof sectionStyles] || sectionStyles.default;

        return (
            <div className={`mb-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-secondary dark:bg-secondary hover:shadow-md transition-all duration-300 ${isOpen ? 'shadow-lg' : ''}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-2 pt-2 text-left bg-secondary dark:bg-secondary hover:opacity-90 transition-all duration-200`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${style.accentColor}`}>{title}</span>
                            {count !== undefined && count > 0 && (
                                <span className="text-xs text-gray-600 dark:text-gray-300">{count} selected</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {count !== undefined && count > 0 && (
                            <span className={`px-2.5 py-1 text-xs font-bold bg-white dark:bg-gray-800 ${style.accentColor} rounded-full shadow-sm`}>{count}</span>
                        )}
                        <div className="p-1 rounded-full bg-white/50 dark:bg-gray-700/50">
                            {isOpen ? <span className="text-gray-700 dark:text-gray-200">−</span> :
                                <span className="text-gray-700 dark:text-gray-200">+</span>}
                        </div>
                    </div>
                </button>
                {isOpen && (
                    <div className="px-2 pb-2 bg-secondary dark:bg-secondary animate-in slide-in-from-top-2 duration-300 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    if (!isMobileFiltersOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[200]">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="absolute inset-0 bg-secondary dark:bg-secondary shadow-2xl border-4 border-pink-500 animate-in slide-in-from-right duration-300">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-secondary dark:bg-secondary">
                        <div className="flex items-center gap-3">
                            <BiFilterAlt className="text-primary dark:text-white" size={24} />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                            {activeFiltersCount > 0 && (
                                <span className="px-3 py-1 text-sm font-bold bg-primary text-white rounded-full shadow-sm">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <FiX size={24} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                        <FilterSection title="Categories" id="categories" count={selectedCats.length}>
                            <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                                <label className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl cursor-pointer transition-all group border-2 border-transparent hover:border-primary dark:hover:border-primary">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-primary rounded-md"
                                        checked={selectedCats.length === 0}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setSelectedCats([]);
                                        }}
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">All Categories</span>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                                        {apiCategories.reduce((total, cat) => total + (cat.products || 0), 0) || initialProducts.length}
                                    </span>
                                </label>
                                <CategoryTree
                                    categories={categories}
                                    selectedCats={selectedCats}
                                    setSelectedCats={setSelectedCats}
                                    initialProducts={initialProducts}
                                    apiCategories={apiCategories}
                                />
                            </div>
                        </FilterSection>

                        <FilterSection
                            title="Price Range"
                            id="price"
                            count={(priceRange[0] !== (apiMinPrice ?? minPrice) || priceRange[1] !== (apiMaxPrice ?? maxPrice)) ? 1 : 0}
                        >
                            <div className="p-5 bg-secondary dark:bg-secondary rounded-xl">
                                <RangePriceFilter
                                    minPrice={apiMinPrice ?? minPrice}
                                    maxPrice={apiMaxPrice ?? maxPrice}
                                    priceRange={priceRange}
                                    setPriceRange={setPriceRange}
                                />
                            </div>
                        </FilterSection>

                        {allSizes.length > 0 && (
                            <FilterSection title="Size" id="size" count={selectedSizes.length}>
                                <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                                    {allSizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggle(selectedSizes, setSelectedSizes, size)}
                                            className={`relative py-3 px-3 text-sm font-bold rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedSizes.includes(size)
                                                ? "border-purple-600 bg-purple-600 text-white shadow-lg shadow-purple-300 dark:shadow-purple-900/50"
                                                : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md bg-white dark:bg-gray-700"
                                                }`}
                                        >
                                            {selectedSizes.includes(size) && (
                                                <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-purple-600 text-xs">✓</span>
                                            )}
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>
                        )}

                        {conditions.length > 0 && (
                            <FilterSection title="Condition" id="condition" count={selectedConditions.length}>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                                    {conditions.map(condition => (
                                        <label
                                            key={condition}
                                            className="flex items-center gap-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl cursor-pointer transition-all group border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-800"
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-orange-600 rounded-md"
                                                checked={selectedConditions.includes(condition)}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    toggle(selectedConditions, setSelectedConditions, condition);
                                                }}
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-orange-700 dark:group-hover:text-orange-300">{condition}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>
                        )}

                        {variantsValues.some(v => !v.name.toLowerCase().includes('size')) && (
                            <FilterSection title="Variants" id="variants" count={Object.values(selectedVariants).flat().length}>
                                <div className="space-y-4 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                                    {variantsValues
                                        .filter(v => !v.name.toLowerCase().includes('size'))
                                        .map(variant => (
                                            <div key={variant.name} className="p-5 bg-secondary dark:bg-secondary rounded-xl">
                                                <h4 className="text-sm font-bold text-primary dark:text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                    {variant.name}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {variant.values.map(value => (
                                                        <button
                                                            key={value}
                                                            onClick={() => {
                                                                setSelectedVariants(prev => {
                                                                    const current = prev[variant.name] || [];
                                                                    const updated = current.includes(value)
                                                                        ? current.filter(v => v !== value)
                                                                        : [...current, value];
                                                                    return { ...prev, [variant.name]: updated };
                                                                });
                                                            }}
                                                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${selectedVariants[variant.name]?.includes(value)
                                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300 dark:shadow-indigo-900/50"
                                                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-800"
                                                                }`}
                                                        >
                                                            {value}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </FilterSection>
                        )}

                        {tags.length > 0 && (
                            <FilterSection title="Tags" id="tags" count={selectedTags.length}>
                                <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                                    {tags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggle(selectedTags, setSelectedTags, tag)}
                                            className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${selectedTags.includes(tag)
                                                ? "bg-rose-600 text-white shadow-lg shadow-rose-300 dark:shadow-rose-900/50"
                                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-gray-300 dark:border-gray-600"
                                                }`}
                                        >
                                            {selectedTags.includes(tag) && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-rose-600 text-xs">✓</span>
                                            )}
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-secondary dark:bg-secondary">
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    clearAllFilters?.();
                                    setIsMobileFiltersOpen(false);
                                }}
                                className="flex-1 py-4 px-6 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="flex-1 py-4 px-6 text-base font-semibold text-white bg-primary rounded-2xl "
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}