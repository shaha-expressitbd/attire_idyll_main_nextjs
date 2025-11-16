"use client";

import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
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

interface FiltersProps {
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
  filteredProductsCount?: number;

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

export default function Filters({
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
  selectedConditions = [],
  setSelectedConditions = () => { },
  selectedTags = [],
  setSelectedTags = () => { },
  selectedVariants = {},
  setSelectedVariants = () => { },
  apiMinPrice,
  apiMaxPrice,
  clearAllFilters,
}: FiltersProps) {
  const [activeAccordion, setActiveAccordion] = useState<string[]>(["categories", "price"]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Safe defaults
  const conditions = filterOptions?.conditions || [];
  const tags = filterOptions?.tags || [];
  const variantsValues = filterOptions?.variantsValues || [];
  const apiCategories = filterOptions?.categories || [];

  const toggle = useCallback(<T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T
  ) => {
    setList(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
  }, []);

  const toggleAccordion = useCallback((section: string) => {
    const isOpening = !activeAccordion.includes(section);
    if (isOpening && scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollTop);
    }
    setActiveAccordion(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  }, [activeAccordion]);

  // All sizes
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    const sizeVariant = variantsValues.find(v => v.name.toLowerCase().includes('size'));

    if (sizeVariant) {
      return sizeVariant.values.sort((a, b) => {
        const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
        const aIdx = order.indexOf(a.toUpperCase());
        const bIdx = order.indexOf(b.toUpperCase());
        return aIdx !== -1 && bIdx !== -1 ? aIdx - bIdx :
          aIdx !== -1 ? -1 : bIdx !== -1 ? 1 : a.localeCompare(b);
      });
    }

    initialProducts.forEach(p => {
      p.variantsId?.forEach(v => {
        v.variants_values?.forEach(size => size?.trim() && sizes.add(size.trim()));
      });
    });

    return Array.from(sizes).sort((a, b) => {
      const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
      const aIdx = order.indexOf(a.toUpperCase());
      const bIdx = order.indexOf(b.toUpperCase());
      return aIdx !== -1 && bIdx !== -1 ? aIdx - bIdx :
        aIdx !== -1 ? -1 : bIdx !== -1 ? 1 : a.localeCompare(b);
    });
  }, [initialProducts, variantsValues]);

  // Active filters count
  const activeFiltersCount = useMemo(() => (
    selectedCats.length +
    selectedSizes.length +
    selectedConditions.length +
    selectedTags.length +
    Object.values(selectedVariants).flat().length +
    ((priceRange[0] !== (apiMinPrice ?? minPrice) || priceRange[1] !== (apiMaxPrice ?? maxPrice)) ? 1 : 0)
  ), [
    selectedCats, selectedSizes, selectedConditions, selectedTags, selectedVariants,
    priceRange, minPrice, maxPrice, apiMinPrice, apiMaxPrice
  ]);

  // Restore scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, [activeAccordion, scrollPosition]);

  // Filter Section Component
  const FilterSection = ({ title, children, id, count }: { title: string; children: React.ReactNode; id: string; count?: number }) => {
    const isOpen = activeAccordion.includes(id);

    return (
      <div className="border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleAccordion(id)}
          className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
            {count !== undefined && count > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
            )}
          </div>
          {isOpen ?
            <FiChevronUp className="text-gray-500 dark:text-gray-400" size={18} /> :
            <FiChevronDown className="text-gray-500 dark:text-gray-400" size={18} />
          }
        </button>
        {isOpen && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="mt-14 hidden md:block w-64">
      <div className="sticky top-24">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BiFilterAlt size={20} />
                Filters
              </h2>
              {activeFiltersCount > 0 && clearAllFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
              </p>
            )}
          </div>

          {/* Filter Sections */}
          <div ref={scrollRef} className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Categories */}
            <FilterSection title="Categories" id="categories" count={selectedCats.length}>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={selectedCats.length === 0}
                    onChange={() => setSelectedCats([])}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">All Categories</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    ({apiCategories.reduce((total, cat) => total + (cat.products || 0), 0) || initialProducts.length})
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

            {/* Price Range */}
            <FilterSection
              title="Price Range"
              id="price"
              count={(priceRange[0] !== (apiMinPrice ?? minPrice) || priceRange[1] !== (apiMaxPrice ?? maxPrice)) ? 1 : 0}
            >
              <div className="pt-2">
                <RangePriceFilter
                  minPrice={apiMinPrice ?? minPrice}
                  maxPrice={apiMaxPrice ?? maxPrice}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
            </FilterSection>

            {/* Sizes */}
            {allSizes.length > 0 && (
              <FilterSection title="Size" id="size" count={selectedSizes.length}>
                <div className="grid grid-cols-4 gap-2">
                  {allSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggle(selectedSizes, setSelectedSizes, size)}
                      className={`py-2 text-sm font-medium rounded border transition-colors ${selectedSizes.includes(size)
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                        : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Variants (non-size) */}
            {variantsValues.filter(v => !v.name.toLowerCase().includes('size')).length > 0 && (
              <FilterSection title="Options" id="variants" count={Object.values(selectedVariants).flat().length}>
                <div className="space-y-4">
                  {variantsValues
                    .filter(v => !v.name.toLowerCase().includes('size'))
                    .map(variant => (
                      <div key={variant.name} className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
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
                              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${selectedVariants[variant.name]?.includes(value)
                                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
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

            {/* Conditions */}
            {conditions.length > 0 && (
              <FilterSection title="Condition" id="condition" count={selectedConditions.length}>
                <div className="space-y-2">
                  {conditions.map(condition => (
                    <label
                      key={condition}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => toggle(selectedConditions, setSelectedConditions, condition)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{condition}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <FilterSection title="Tags" id="tags" count={selectedTags.length}>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggle(selectedTags, setSelectedTags, tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${selectedTags.includes(tag)
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                        : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </FilterSection>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}