// // components/shop-all-products/filter-content.tsx
// "use client";
// import React, { useCallback, useMemo } from "react";
// import { Category } from "@/types/business";
// import { Product } from "@/types/product";
// import { AiOutlineSearch } from "react-icons/ai";
// import CategoryTree from "./category-tree";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

// interface FilterContentProps {
//     categories: Category[];
//     selectedCats: string[];
//     setSelectedCats: React.Dispatch<React.SetStateAction<string[]>>;
//     selectedSizes: string[];
//     setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
//     priceRange: [number, number];
//     setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
//     searchQuery: string;
//     setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
//     minPrice: number;
//     maxPrice: number;
//     initialProducts: Product[];
//     isMobile?: boolean;
// }

// export default function FilterContent({
//     categories,
//     selectedCats,
//     setSelectedCats,
//     selectedSizes,
//     setSelectedSizes,
//     priceRange,
//     setPriceRange,
//     searchQuery,
//     setSearchQuery,
//     minPrice,
//     maxPrice,
//     initialProducts,
//     isMobile = false,
// }: FilterContentProps) {
//     const toggle = useCallback(
//         (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
//             setList((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
//         },
//         []
//     );

//     const allSizes = useMemo(() => {
//         const sizes = new Set<string>();
//         initialProducts.forEach((p) => {
//             p.variantsId?.forEach((v) => {
//                 v.variants_values?.forEach((size) => {
//                     if (size && size.trim()) sizes.add(size.trim());
//                 });
//             });
//         });
//         return Array.from(sizes).sort((a, b) => {
//             const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
//             const aIndex = sizeOrder.indexOf(a.toUpperCase());
//             const bIndex = sizeOrder.indexOf(b.toUpperCase());
//             if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
//             if (aIndex !== -1) return -1;
//             if (bIndex !== -1) return 1;
//             return a.localeCompare(b);
//         });
//     }, [initialProducts]);

//     return (
//         <div className={`space-y-6 ${isMobile ? "pb-20" : ""}`}>
//             {/* Search */}
//             {isMobile && (
//                 <div className="relative">
//                     <input
//                         type="text"
//                         placeholder="Search products..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full h-10 pl-5 pr-12 rounded-full bg-white dark:bg-gray-600 text-black dark:text-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
//                     />
//                     <AiOutlineSearch
//                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white pointer-events-none"
//                         size={18}
//                         aria-hidden="true"
//                     />
//                 </div>
//             )}
//             {/* Categories */}
//             <div>
//                 <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
//                     Filter by Category
//                 </h3>
//                 <div className="space-y-2 max-h-[260px] overflow-auto pr-1 no-scrollbar">
//                     <label className="flex items-center gap-2 text-sm">
//                         <input
//                             type="checkbox"
//                             className="accent-pink-600 w-4 h-4 rounded"
//                             checked={selectedCats.length === 0}
//                             onChange={() => setSelectedCats([])}
//                         />
//                         <span className="text-gray-700 dark:text-white">All Categories</span>
//                         <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
//                             ({initialProducts.length})
//                         </span>
//                     </label>
//                     <CategoryTree
//                         categories={categories}
//                         selectedCats={selectedCats}
//                         setSelectedCats={setSelectedCats}
//                         initialProducts={initialProducts}
//                     />
//                 </div>
//             </div>
//             {/* Price Range */}
//             <div>
//                 <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
//                     Filter by Price
//                 </h3>
//                 <div className="px-1">
//                     <Slider
//                         range
//                         min={Math.floor(minPrice)}
//                         max={Math.ceil(maxPrice)}
//                         value={priceRange}
//                         onChange={(v) => setPriceRange(v as [number, number])}
//                         allowCross={false}
//                         railStyle={{ backgroundColor: "#ffe2ef", height: 6 }}
//                         trackStyle={[{ backgroundColor: "#c43882", height: 6 }]}
//                         handleStyle={[
//                             { borderColor: "#c43882", backgroundColor: "#fff", width: 18, height: 18, boxShadow: "none" },
//                             { borderColor: "#c43882", backgroundColor: "#fff", width: 18, height: 18, boxShadow: "none" },
//                         ]}
//                     />
//                 </div>
//                 <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-white">
//                     <span>Min: ৳{Math.floor(priceRange[0])}</span>
//                     <span>Max: ৳{Math.ceil(priceRange[1])}</span>
//                 </div>
//             </div>
//             {/* Size */}
//             <div>
//                 <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
//                     Filter by Size
//                 </h3>
//                 <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto no-scrollbar">
//                     <label className="flex items-center gap-2 text-sm">
//                         <input
//                             type="checkbox"
//                             className="accent-pink-600 w-4 h-4 rounded"
//                             checked={selectedSizes.length === 0}
//                             onChange={() => setSelectedSizes([])}
//                         />
//                         <span className="text-gray-700 dark:text-white">All Sizes</span>
//                     </label>
//                     {allSizes.map((size) => (
//                         <label
//                             key={size}
//                             className="flex items-center gap-2 text-sm"
//                         >
//                             <input
//                                 type="checkbox"
//                                 className="accent-pink-600 w-4 h-4 rounded"
//                                 checked={selectedSizes.includes(size)}
//                                 onChange={() => toggle(selectedSizes, setSelectedSizes, size)}
//                             />
//                             <span className="text-gray-700 dark:text-white">{size}</span>
//                         </label>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }