// // components/shop-all-products/mobile-header.tsx
// "use client";
// import React from "react";
// import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
// import { AiOutlineSearch } from "react-icons/ai";
// import Link from "next/link";

// interface ShopMobileHeaderProps {
//     isMobileFiltersOpen: boolean;
//     setIsMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     sortBy: "name" | "price-low" | "price-high" | "newest";
//     setSortBy: React.Dispatch<React.SetStateAction<"name" | "price-low" | "price-high" | "newest">>;
//     selectedCats: string[];
//     selectedSizes: string[];
//     searchQuery: string;
//     setShowSearch: (val: boolean) => void;
// }

// export default function ShopMobileHeader({
//     isMobileFiltersOpen,
//     setIsMobileFiltersOpen,
//     sortBy,
//     setSortBy,
//     selectedCats,
//     selectedSizes,
//     searchQuery,
//     setShowSearch,
// }: ShopMobileHeaderProps) {
//     return (
//         <>
//             <div className="md:hidden -mx-3 px-4 py-3 bg-[#fee9f0] dark:bg-gray-700">
//                 <div className="flex items-center justify-between -mt-3">
//                     <button
//                         onClick={() => setIsMobileFiltersOpen((v) => !v)}
//                         className="flex items-center gap-1 text-gray-900 dark:text-white font-semibold"
//                     >
//                         <span>FILTERS</span>
//                         {isMobileFiltersOpen ? <FiChevronUp /> : <FiChevronDown />}
//                         {(selectedCats.length > 0 || selectedSizes.length > 0 || searchQuery) && (
//                             <span className="ml-2 px-2 py-1 bg-pink-600 text-white text-xs rounded-full">
//                                 {selectedCats.length + selectedSizes.length + (searchQuery ? 1 : 0)}
//                             </span>
//                         )}
//                     </button>
//                     <Link href="/">
//                         <img src="/assets/logo.png" alt="Logo" className="h-9 object-contain" />
//                     </Link>
//                     <button onClick={() => setShowSearch(true)} className="p-2" aria-label="Search">
//                         <AiOutlineSearch className="text-gray-800 dark:text-white" size={20} />
//                     </button>
//                 </div>
//             </div>
//             <div className="md:hidden mt-3 mb-4 flex items-center justify-between">
//                 <div className="inline-flex items-center gap-2">
//                     <p className="text-gray-500 text-sm dark:text-white">
//                         ALL <span className="text-gray-800 font-semibold dark:text-white">PRODUCTS</span>
//                     </p>
//                     <span className="w-10 h-[2px] bg-gray-800"></span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <select
//                         value={sortBy}
//                         onChange={(e) =>
//                             setSortBy(e.target.value as "name" | "price-low" | "price-high" | "newest")
//                         }
//                         className="border-2 border-primary dark:border-[#181717] rounded text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-2 bg-white dark:bg-gray-500"
//                     >
//                         <option value="newest">sort by: Relevant</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="name">Name (A–Z)</option>
//                     </select>
//                 </div>
//             </div>
//         </>
//     );
// }