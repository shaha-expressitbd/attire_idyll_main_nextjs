"use client";
import React from "react";
import { Product } from "@/types/product";
import { AiOutlineSearch } from "react-icons/ai";

interface ShopDesktopHeaderProps {
  filteredAndSorted: Product[];
  initialProducts: Product[];
  sortBy: "name" | "price-low" | "price-high" | "newest";
  setSortBy: React.Dispatch<React.SetStateAction<"name" | "price-low" | "price-high" | "newest">>;
  isMobile: boolean; // Add this prop

  //new add
  showSearch: boolean; // add
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>; // add
  search: string; // add
  setSearch: React.Dispatch<React.SetStateAction<string>>; // add
}

export default function ShopDesktopHeader({
  filteredAndSorted,
  initialProducts,
  sortBy,
  setSortBy,
  isMobile,  // Access isMobile for conditional rendering


  showSearch,      // ✅ add
  setShowSearch,   // ✅ add
  search,          // ✅ add
  setSearch,       // ✅ add
}: ShopDesktopHeaderProps) {
  return (
    <>


      {/* Search above header only for 771px–1156px */}
      {/* Search above header only for tablet: 768px–1155px */}
      <div className="relative w-full mt-16 mb-4 hidden md:flex xl:hidden">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full h-10 pl-5 pr-12 rounded-full bg-white dark:bg-gray-600 text-black dark:text-white border border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <AiOutlineSearch
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white pointer-events-none"
          size={18}
        />
      </div>


      {/* Desktop Header */}
      {!isMobile && (
        <div className="mb-2 md:mt-4 lg:mt-16 hidden md:flex items-center justify-between gap-4 px-2">

          {/* Left: Title */}
          <div className="inline-flex gap-2 items-center">
            <p className="text-gray-500 dark:text-white">
              ALL <span className="text-gray-700 font-medium dark:text-white">PRODUCTS</span>
            </p>
            <p className="w-8 sm:w-12 h-0.5 bg-gray-700"></p>
          </div>

          {/* Center: Search bar for large screens only (≥1156px) */}
          <div className="flex-1 relative hidden xl:flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full h-10 pl-5 pr-12 rounded-full bg-white dark:bg-gray-600 text-black dark:text-white border border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <AiOutlineSearch
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white pointer-events-none"
              size={18}
            />
          </div>

          {/* Right: Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600 dark:text-white">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "price-low" | "price-high" | "newest")
              }
              className="border-2 border-primary dark:border-[#0f0f0f] bg-white dark:bg-gray-600 text-black dark:text-white px-2 text-sm rounded"
            >
              <option value="newest">Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>
      )}


      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden mt-4 mb-2 flex flex-col">

          {/* Collections title + sort */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <p className="text-gray-500 text-sm dark:text-white">
                ALL <span className="text-gray-800 font-semibold dark:text-white">COLLECTIONS</span>
              </p>
              <span className="w-10 h-[2px] bg-gray-800"></span>
            </div>

            <select
              id="sort-mobile"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "price-low" | "price-high" | "newest")
              }
              className="border-2 border-primary dark:border-[#181717] text-black dark:text-white rounded text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-2 bg-white dark:bg-gray-500"
            >
              <option value="newest">Sort by: Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
}
