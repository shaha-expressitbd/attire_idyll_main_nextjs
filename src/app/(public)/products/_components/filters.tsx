"use client";

import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
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

const sectionStyles = {
  default: { accentColor: 'text-gray-600 dark:text-gray-400' },
};

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
    const style = sectionStyles[id as keyof typeof sectionStyles] || sectionStyles.default;

    return (
      <div className={`mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 ${isOpen ? 'shadow-lg' : 'shadow-sm'}`}>
        <button
          onClick={() => toggleAccordion(id)}
          className={`w-full flex items-center justify-between px-2 py-2 text-left bg-secondary dark:bg-secondary hover:brightness-95 dark:hover:brightness-110 transition-all duration-200`}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-start">
              <span className={`text-sm font-bold ${style.accentColor}`}>{title}</span>
              {count !== undefined && count > 0 && (
                <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">{count} selected</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {count !== undefined && count > 0 && (
              <span className={`px-2 py-1 text-xs font-bold bg-white dark:bg-gray-800 ${style.accentColor} rounded-full shadow-sm`}>
                {count}
              </span>
            )}
            <div className="p-1 rounded-full bg-white/80 dark:bg-gray-700/80">
              {isOpen ? <FiChevronUp className="text-black dark:text-white" size={16} /> : <FiChevronDown className="text-black dark:text-white" size={16} />}
            </div>
          </div>
        </button>
        {isOpen && (
          <div className="px-2 py-2 bg-secondary dark:bg-secondary animate-in slide-in-from-top-2 duration-300 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="mt-14 hidden md:block w-50">
      <div className="sticky top-24">
        <div className="rounded-2xl bg-secondary dark:bg-secondary border border-gray-200 dark:border-gray-700 shadow-xl">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-3">
                <BiFilterAlt className="text-primary dark:text-primary" size={24} />
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {activeFiltersCount} active
                  </span>
                  {clearAllFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Filter Sections */}
          <div ref={scrollRef} className="p-6 space-y-4 max-h-[350px] md:max-h-[450px] lg:max-h-[600px] xl:max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {/* Categories */}
            <FilterSection title="Categories" id="categories" count={selectedCats.length}>
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary rounded"
                    checked={selectedCats.length === 0}
                    onChange={() => setSelectedCats([])}
                  />
                  <span className="text-sm font-medium text-black dark:text-white flex-1">All Categories</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
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

            {/* Price Range */}
            <FilterSection
              title="Price Range"
              id="price"
              count={(priceRange[0] !== (apiMinPrice ?? minPrice) || priceRange[1] !== (apiMaxPrice ?? maxPrice)) ? 1 : 0}
            >
              <div className="p-2">
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
              <FilterSection title="Sizes" id="size" count={selectedSizes.length}>
                <div className="grid grid-cols-4 gap-2 max-h-[120px] overflow-y-auto">
                  {allSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggle(selectedSizes, setSelectedSizes, size)}
                      className={`relative py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${selectedSizes.includes(size)
                        ? "bg-primary text-white shadow-md"
                        : "border-gray-300 dark:border-gray-600 text-black dark:text-white hover:border-primary dark:hover:border-primary bg-white dark:bg-gray-700"
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
              <FilterSection title="Variants" id="variants" count={Object.values(selectedVariants).flat().length}>
                <div className="space-y-4 max-h-[200px] overflow-y-auto">
                  {variantsValues
                    .filter(v => !v.name.toLowerCase().includes('size'))
                    .map(variant => (
                      <div key={variant.name} className="space-y-2">
                        <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wide">
                          {variant.name}
                        </h4>
                        <div className="flex flex-wrap gap-1">
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
                              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${selectedVariants[variant.name]?.includes(value)
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
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
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {conditions.map(condition => (
                    <label
                      key={condition}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-orange-600 rounded"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => toggle(selectedConditions, setSelectedConditions, condition)}
                      />
                      <span className="text-sm font-medium text-black dark:text-white">{condition}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <FilterSection title="Tags" id="tags" count={selectedTags.length}>
                <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggle(selectedTags, setSelectedTags, tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${selectedTags.includes(tag)
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                        }`}
                    >
                      #{tag}
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
