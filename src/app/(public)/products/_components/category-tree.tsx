// components/shop-all-products/category-tree.tsx
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

// Define FilterCategory to match API response
interface FilterCategory {
  _id: string;
  name: string;
  products: number;
  children: FilterCategory[];
}

interface CategoryTreeProps {
  categories: Category[];
  selectedCats: string[];
  setSelectedCats: React.Dispatch<React.SetStateAction<string[]>>;
  initialProducts: Product[];
  apiCategories?: FilterCategory[];
}


/* ───────────────────────── helpers ───────────────────────── */
function getAllDescendantIds(cat: Category): string[] {
  let ids: string[] = [cat._id];
  if (cat.children && cat.children.length > 0) {
    for (const child of cat.children) {
      ids = ids.concat(getAllDescendantIds(child));
    }
  }
  return ids;
}

// Recursive function to find category by _id in hierarchical structure
function findCategoryById(categories: FilterCategory[], id: string): FilterCategory | undefined {
  for (const cat of categories) {
    if (cat._id === id) return cat;
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

// Calculate total products for a category including all its descendants
function getTotalProductsForCategory(cat: Category, apiCategories: FilterCategory[]): number {
  const apiCat = findCategoryById(apiCategories, cat._id);
  if (apiCat) {
    return apiCat.products || 0;
  }

  // Fallback: sum products from all descendant categories
  let total = 0;
  const descendants = getAllDescendantIds(cat);
  for (const descId of descendants) {
    const descCat = findCategoryById(apiCategories, descId);
    if (descCat && descCat.products) {
      total += descCat.products;
    }
  }
  return total;
}

function getCategorySelectionState(
  cat: Category,
  selectedCats: string[]
): "none" | "partial" | "all" {
  const allIds = getAllDescendantIds(cat);
  const selectedCount = allIds.filter((id) => selectedCats.includes(id)).length;
  if (selectedCount === 0) return "none";
  if (selectedCount === allIds.length) return "all";
  return "partial";
}

function buildInitiallyExpandedMap(cats: Category[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  const walk = (list: Category[]) => {
    list.forEach((c) => {
      map[c._id] = true;
      if (c.children?.length) walk(c.children);
    });
  };
  walk(cats);
  return map;
}

/* ───────────────────────── component ───────────────────────── */
export default function CategoryTree({
  categories,
  selectedCats,
  setSelectedCats,
  initialProducts,
  apiCategories,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => buildInitiallyExpandedMap(categories));

  useEffect(() => {
    setExpandedCategories(buildInitiallyExpandedMap(categories));
  }, [categories]);

  const toggleCategoryWithChildren = useCallback(
    (cat: Category) => {
      const allIds = getAllDescendantIds(cat);
      setSelectedCats((prev) => {
        const allSelected = allIds.every((id) => prev.includes(id));
        return allSelected
          ? prev.filter((id) => !allIds.includes(id))
          : [...new Set([...prev, ...allIds])];
      });
    },
    [setSelectedCats]
  );

  const toggleCategoryExpand = useCallback((catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  }, []);

  const renderCategoryTree = useCallback(
    (cats: Category[], depth = 0) =>
      cats.map((cat) => {
        const hasChildren = cat.children && cat.children.length > 0;
        const isExpanded = expandedCategories[cat._id];
        const selectionState = getCategorySelectionState(cat, selectedCats);

        return (
          <div
            key={cat._id}
            className="mb-1 "
            style={{ marginLeft: `${depth * 16}px` }}
          >
            <div className="flex items-center group">
              {hasChildren && (
                <button
                  onClick={() => toggleCategoryExpand(cat._id)}
                  className="mr-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${cat.name
                    }`}
                >
                  {isExpanded ? (
                    <FiChevronDown className="w-3 h-3" />
                  ) : (
                    <FiChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}
              <label className="flex items-center flex-grow px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="accent-pink-600 w-3 h-3 rounded"
                  checked={selectionState === "all"}
                  ref={(input) => {
                    if (input)
                      input.indeterminate = selectionState === "partial";
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    toggleCategoryWithChildren(cat);
                  }}
                  aria-label={`Filter by ${cat.name}`}
                />
                <span className="ml-3 text-gray-700 dark:text-white text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  {cat.name}
                </span>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  (
                  {
                    apiCategories ?
                      getTotalProductsForCategory(cat, apiCategories as FilterCategory[]) :
                      initialProducts.filter((p) =>
                        p.sub_category?.some((sc) =>
                          getAllDescendantIds(cat).includes(sc._id)
                        )
                      ).length
                  }
                  )
                </span>
              </label>
            </div>
            {hasChildren && isExpanded && (
              <div className="mt-1">
                {renderCategoryTree(cat.children || [], depth + 1)}
              </div>
            )}
          </div>
        );
      }),
    [
      expandedCategories,
      selectedCats,
      toggleCategoryExpand,
      toggleCategoryWithChildren,
      initialProducts,
    ]
  );

  return (
    <div className="space-y-2 max-h-48 overflow-auto pr-1 no-scrollbar">
      {renderCategoryTree(categories)}
    </div>
  );
}
