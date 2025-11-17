// components/filters/Filters.tsx
"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BiFilterAlt } from "react-icons/bi";
import CategoryTree from "./category-tree";
import RangePriceFilter from "./rangeSlider";

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

/* -------------------------------------------------------------------------- */
/*                               Helper: Toggle                               */
/* -------------------------------------------------------------------------- */
const useToggle = <T extends string>(
  list: T[],
  setList: React.Dispatch<React.SetStateAction<T[]>>,
  value: T
) => {
  setList((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
};

/* -------------------------------------------------------------------------- */
/*                              Accordion Section                             */
/* -------------------------------------------------------------------------- */
const FilterSection: React.FC<{
  id: string;
  title: string;
  count?: number;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}> = ({ id, title, count, isOpen, toggle, children }) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        {count !== undefined && count > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({count})
          </span>
        )}
      </div>
      {isOpen ? (
        <FiChevronUp className="text-gray-500" size={18} />
      ) : (
        <FiChevronDown className="text-gray-500" size={18} />
      )}
    </button>
    {isOpen && <div className="px-4 pb-4">{children}</div>}
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */
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
  const [openSections, setOpenSections] = useState<string[]>([
    "categories",
    "price",
  ]);

  const toggleSection = useCallback(
    (section: string) => {
      setOpenSections((prev) =>
        prev.includes(section)
          ? prev.filter((s) => s !== section)
          : [...prev, section]
      );
    },
    []
  );

  const toggle = useCallback(
    <T extends string>(
      list: T[],
      setList: React.Dispatch<React.SetStateAction<T[]>>,
      value: T
    ) => useToggle(list, setList, value),
    []
  );

  /* -------------------------- Derived data -------------------------- */
  const conditions = filterOptions?.conditions || [];
  const tags = filterOptions?.tags || [];
  const variantsValues = filterOptions?.variantsValues || [];
  const apiCategories = filterOptions?.categories || [];

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    const sizeVariant = variantsValues.find((v) =>
      v.name.toLowerCase().includes("size")
    );

    if (sizeVariant) return sizeVariant.values.sort();

    initialProducts.forEach((p) =>
      p.variantsId?.forEach((v) =>
        v.variants_values?.forEach((s) => s?.trim() && set.add(s.trim()))
      )
    );

    return Array.from(set).sort();
  }, [initialProducts, variantsValues]);

  const activeCount = useMemo(() => {
    const priceActive =
      priceRange[0] !== (apiMinPrice ?? minPrice) ||
      priceRange[1] !== (apiMaxPrice ?? maxPrice);
    return (
      selectedCats.length +
      selectedSizes.length +
      selectedConditions.length +
      selectedTags.length +
      Object.values(selectedVariants).flat().length +
      (priceActive ? 1 : 0)
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
    apiMinPrice,
    apiMaxPrice,
  ]);

  /* ------------------------------------------------------------------ */
  return (
    <aside className="w-full md:w-80">
      <div className="bg-white dark:bg-secondary rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BiFilterAlt size={20} />
            Filters
          </h2>
          {activeCount > 0 && clearAllFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Categories */}
          <FilterSection
            id="categories"
            title="Categories"
            count={selectedCats.length}
            isOpen={openSections.includes("categories")}
            toggle={() => toggleSection("categories")}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
                checked={selectedCats.length === 0}
                onChange={() => setSelectedCats([])}
              />
              <span className="text-sm">All Categories</span>
              <span className="ml-auto text-xs text-gray-500">
                ({apiCategories.reduce((a, c) => a + (c.products || 0), 0) ||
                  initialProducts.length})
              </span>
            </label>

            <CategoryTree
              categories={categories}
              selectedCats={selectedCats}
              setSelectedCats={setSelectedCats}
              initialProducts={initialProducts}
              apiCategories={apiCategories}
            />
          </FilterSection>

          {/* Price */}
          <FilterSection
            id="price"
            title="Price Range"
            count={
              priceRange[0] !== (apiMinPrice ?? minPrice) ||
                priceRange[1] !== (apiMaxPrice ?? maxPrice)
                ? 1
                : 0
            }
            isOpen={openSections.includes("price")}
            toggle={() => toggleSection("price")}
          >
            <RangePriceFilter
              minPrice={apiMinPrice ?? minPrice}
              maxPrice={apiMaxPrice ?? maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </FilterSection>

          {/* Sizes */}
          {allSizes.length > 0 && (
            <FilterSection
              id="size"
              title="Size"
              count={selectedSizes.length}
              isOpen={openSections.includes("size")}
              toggle={() => toggleSection("size")}
            >
              <div className="grid grid-cols-4 gap-2">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggle(selectedSizes, setSelectedSizes, s)}
                    className={`py-2 text-sm font-medium rounded border transition-colors ${selectedSizes.includes(s)
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "bg-white dark:bg-secondary text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Other Variants */}
          {variantsValues
            .filter((v) => !v.name.toLowerCase().includes("size"))
            .map((variant) => (
              <FilterSection
                key={variant.name}
                id={`variant-${variant.name}`}
                title={variant.name}
                count={selectedVariants[variant.name]?.length || 0}
                isOpen={openSections.includes(`variant-${variant.name}`)}
                toggle={() => toggleSection(`variant-${variant.name}`)}
              >
                <div className="flex flex-wrap gap-2">
                  {variant.values.map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setSelectedVariants((prev) => {
                          const cur = prev[variant.name] || [];
                          const updated = cur.includes(val)
                            ? cur.filter((v) => v !== val)
                            : [...cur, val];
                          return { ...prev, [variant.name]: updated };
                        });
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${selectedVariants[variant.name]?.includes(val)
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "bg-white dark:bg-secondary text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                        }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </FilterSection>
            ))}

          {/* Conditions */}
          {conditions.length > 0 && (
            <FilterSection
              id="condition"
              title="Condition"
              count={selectedConditions.length}
              isOpen={openSections.includes("condition")}
              toggle={() => toggleSection("condition")}
            >
              <div className="space-y-2">
                {conditions.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={selectedConditions.includes(c)}
                      onChange={() =>
                        toggle(selectedConditions, setSelectedConditions, c)
                      }
                    />
                    <span className="text-sm">{c}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <FilterSection
              id="tags"
              title="Tags"
              count={selectedTags.length}
              isOpen={openSections.includes("tags")}
              toggle={() => toggleSection("tags")}
            >
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggle(selectedTags, setSelectedTags, t)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${selectedTags.includes(t)
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "bg-white dark:bg-secondary text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}
        </div>
      </div>
    </aside>
  );
}