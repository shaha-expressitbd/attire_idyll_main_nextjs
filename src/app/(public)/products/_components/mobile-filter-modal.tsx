"use client";

import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import CategoryTree from "./category-tree";
import RangePriceFilter from "./rangeSlider";
import { BiFilterAlt } from "react-icons/bi";

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
    categories: any[];
    selectedCats: string[];
    setSelectedCats: React.Dispatch<React.SetStateAction<string[]>>;

    selectedSizes: string[];
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;

    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;

    minPrice: number;
    maxPrice: number;

    initialProducts: any[];
    filterOptions?: FilterOptions;

    selectedConditions: string[];
    setSelectedConditions: React.Dispatch<React.SetStateAction<string[]>>;

    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;

    selectedVariants: { [key: string]: string[] };
    setSelectedVariants: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;

    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

    clearAllFilters: () => void;
}

const toggle = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T
) => {
    setList((prev) =>
        prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
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
    filterOptions,
    selectedConditions,
    setSelectedConditions,
    selectedTags,
    setSelectedTags,
    selectedVariants,
    setSelectedVariants,
    isOpen,
    setIsOpen,
    clearAllFilters,
}: MobileFilterModalProps) {
    const conditions = filterOptions?.conditions ?? [];
    const tags = filterOptions?.tags ?? [];
    const variantsValues = filterOptions?.variantsValues ?? [];
    const apiCategories = filterOptions?.categories ?? [];

    const allSizes = useMemo(() => {
        const set = new Set<string>();
        const sizeVar = variantsValues.find((v) => v.name.toLowerCase().includes("size"));
        if (sizeVar) return sizeVar.values;

        initialProducts.forEach((p) =>
            p.variantsId?.forEach((v) =>
                v.variants_values?.forEach((s) => s?.trim() && set.add(s.trim()))
            )
        );
        return Array.from(set).sort();
    }, [initialProducts, variantsValues]);

    const activeCount = useMemo(() => {
        const priceChanged = priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0;
        return (
            selectedCats.length +
            selectedSizes.length +
            selectedConditions.length +
            selectedTags.length +
            Object.values(selectedVariants).flat().length +
            priceChanged
        );
    }, [
        selectedCats,
        selectedSizes,
        selectedConditions,
        selectedTags,
        selectedVariants,
        priceRange,
        minPrice,
        maxPrice,
    ]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999] bg-black/50" onClick={() => setIsOpen(false)}>
            <div
                className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-secondary shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <BiFilterAlt className="text-primary" size={22} />
                        <h2 className="text-lg font-bold">Filters</h2>
                        {activeCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-primary text-white rounded-full">
                                {activeCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Categories */}
                    <section>
                        <h3 className="font-semibold mb-2">Categories</h3>
                        <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                            <input
                                type="checkbox"
                                className="accent-primary"
                                checked={selectedCats.length === 0}
                                onChange={() => setSelectedCats([])}
                            />
                            <span>All Categories</span>
                            <span className="ml-auto text-xs text-gray-500">
                                {apiCategories.reduce((s, c) => s + (c.products ?? 0), 0) || initialProducts.length}
                            </span>
                        </label>
                        <div className="mt-2">
                            <CategoryTree
                                categories={categories}
                                selectedCats={selectedCats}
                                setSelectedCats={setSelectedCats}
                                initialProducts={initialProducts}
                                apiCategories={apiCategories}
                            />
                        </div>
                    </section>

                    {/* Price */}
                    <section>
                        <h3 className="font-semibold mb-2">Price Range</h3>
                        <div className="p-3 bg-gray-50 dark:bg-secondary rounded">
                            <RangePriceFilter
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                            />
                        </div>
                    </section>

                    {/* Sizes */}
                    {allSizes.length > 0 && (
                        <section>
                            <h3 className="font-semibold mb-2">Size</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {allSizes.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggle(selectedSizes, setSelectedSizes, s);
                                        }}
                                        className={`py-2 text-xs font-medium rounded border transition-colors ${selectedSizes.includes(s)
                                            ? "bg-primary text-white border-primary"
                                            : "border-gray-300 dark:border-gray-600 hover:border-primary"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Conditions */}
                    {conditions.length > 0 && (
                        <section>
                            <h3 className="font-semibold mb-2">Condition</h3>
                            <div className="space-y-1">
                                {conditions.map((c) => (
                                    <label
                                        key={c}
                                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="accent-orange-600"
                                            checked={selectedConditions.includes(c)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggle(selectedConditions, setSelectedConditions, c);
                                            }}
                                        />
                                        <span>{c}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Variants */}
                    {variantsValues.filter(v => !v.name.toLowerCase().includes('size')).length > 0 && (
                        <section>
                            <h3 className="font-semibold mb-2">Variants</h3>
                            <div className="space-y-4">
                                {variantsValues
                                    .filter(v => !v.name.toLowerCase().includes('size'))
                                    .map(variant => (
                                        <div key={variant.name} className="space-y-2">
                                            <h4 className="text-sm font-medium">{variant.name}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {variant.values.map(value => (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedVariants(prev => {
                                                                const current = prev[variant.name] || [];
                                                                const updated = current.includes(value)
                                                                    ? current.filter(v => v !== value)
                                                                    : [...current, value];
                                                                return { ...prev, [variant.name]: updated };
                                                            });
                                                        }}
                                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${selectedVariants[variant.name]?.includes(value)
                                                            ? "bg-primary text-white"
                                                            : "bg-gray-100 dark:bg-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                                                            }`}
                                                    >
                                                        {value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <section>
                            <h3 className="font-semibold mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggle(selectedTags, setSelectedTags, t);
                                        }}
                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${selectedTags.includes(t)
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 dark:bg-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        #{t}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex gap-3">
                    <button
                        onClick={() => {
                            clearAllFilters();
                            setIsOpen(false);
                        }}
                        className="flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-secondary rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}