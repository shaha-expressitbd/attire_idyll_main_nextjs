"use client";

import { useMemo, useState, useEffect } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ui/organisms/product-card";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";
import PoweredByBar from "./PoweredByBar";
import { calculateProductPricing } from "@/utils/productUtils";


type Props = {
  initialProducts: Product[];
  showSearch?: boolean; // optional
  setShowSearch?: (val: boolean) => void; // optional
};


export default function CollectionsClient({
  initialProducts,
  showSearch: controlledShow,
  setShowSearch: controlledSetShow,
}: Props) {



  // ---------- helpers: price + subcategory ---------------
  const getDisplayPrice = (p: Product) => {
    const pricing = calculateProductPricing(null, p);
    return pricing.isWithinOffer ? pricing.offerPrice : pricing.sellingPrice;
  };


  // ✅ controlled vs uncontrolled
  const isControlled =
    typeof controlledShow === "boolean" &&
    typeof controlledSetShow === "function";




  // uncontrolled local state (fallback)
  const [uncontrolledShow, setUncontrolledShow] = useState(false);

  // Run on mount + when resizing
  useEffect(() => {
    const updateVisibility = () => {
      if (controlledShow !== undefined) {
        setUncontrolledShow(controlledShow);
      } else {
        if (window.innerWidth >= 768) {
          setUncontrolledShow(true); // desktop open
        } else {
          setUncontrolledShow(false); // mobile closed
        }
      }
    };

    updateVisibility(); // check immediately on mount
    window.addEventListener("resize", updateVisibility);

    return () => window.removeEventListener("resize", updateVisibility);
  }, [controlledShow]);





  // একীভূত getter/setter — নিচে সবখানে এগুলোকেই ব্যবহার করবে
  const showSearch = isControlled ? (controlledShow as boolean) : uncontrolledShow;
  const setShowSearch = isControlled
    ? (controlledSetShow as (v: boolean) => void)
    : setUncontrolledShow;

  // শুধু Category (product.sub_category[].name) নেবে
  const extractSubcats = (p: Product): string[] => {
    const names = Array.isArray(p.sub_category)
      ? p.sub_category.map((sc) => sc?.name).filter(Boolean)
      : [];
    if ((p as any).category) names.push(String((p as any).category));
    return Array.from(new Set(names.map((s) => s.trim())));
  };

  // ---------- derive: price bounds, unique subcats ----------
  const { minPrice, maxPrice, allSubcats } = useMemo(() => {
    const prices = initialProducts.map(getDisplayPrice).filter((n) => !Number.isNaN(n));
    const mp = prices.length ? Math.min(...prices) : 0;
    const xp = prices.length ? Math.max(...prices) : 0;

    const subcatSet = new Set<string>();
    initialProducts.forEach((p) => extractSubcats(p).forEach((s) => subcatSet.add(s)));

    return {
      minPrice: mp,
      maxPrice: xp,
      allSubcats: Array.from(subcatSet),
    };
  }, [initialProducts]);

  // ---------- UI state ----------
  const [search, setSearch] = useState("");
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());
  const [range, setRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sort, setSort] =
    useState<"relevant" | "price_asc" | "price_desc" | "name_asc">("relevant");

  // NEW: mobile filter toggle (desktop sidebar অপরিবর্তিত)
  const [showMobileFilters, setShowMobileFilters] = useState(false);


  const [visibleCount, setVisibleCount] = useState(15);
  const [showAll, setShowAll] = useState(false);




  // min/max আপডেট হলে রেঞ্জ রিসেট
  useEffect(() => {
    setRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // ---------- filtering + sorting ----------
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    let list = initialProducts.filter((p) => {
      const price = getDisplayPrice(p);
      if (price < range[0] || price > range[1]) return false;

      if (s) {
        const hay =
          (p.name || "") +
          " " +
          extractSubcats(p).join(" ") +
          " " +
          (p?.variantsId?.map((v) => v.condition).join(" ") || "");
        if (!hay.toLowerCase().includes(s)) return false;
      }

      if (selectedSubs.size) {
        const subs = extractSubcats(p);
        const anyMatch = subs.some((x) => selectedSubs.has(x));
        if (!anyMatch) return false;
      }

      return true;
    });

    if (sort === "price_asc") {
      list = list.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (sort === "price_desc") {
      list = list.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    } else if (sort === "name_asc") {
      list = list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return list;
  }, [initialProducts, search, selectedSubs, range, sort]);

  // ---------- handlers ----------
  const toggleSub = (label: string) => {
    const next = new Set(selectedSubs);
    next.has(label) ? next.delete(label) : next.add(label);
    setSelectedSubs(next);
  };

  // ---------- UI ----------
  return (
    <div className="bg-[#FFEBF0] dark:bg-gray-800">
      <Header setShowSearch={setShowSearch} />

      <div className="mx-auto max-w-[1800px] px-3 md:px-4 lg:px-6 py-6 md:-ml-2 ">
        {/* Top search row */}
        {showSearch && (
          <div className="hidden md:mb-6 md:block">

            <div className="mx-auto max-w-3xl flex items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full h-10 pl-5 pr-12 rounded-full bg-white dark:bg-gray-600 text-black dark:text-white  border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                />

                <AiOutlineSearch
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white pointer-events-none"
                  size={18}
                  aria-hidden="true"
                />
              </div>

              {/* Hide searchbar button — now outside */}
              <button
                onClick={() => setShowSearch(false)}
                className="shrink-0 w-10 h-10 flex items-center justify-center border-gray-300 text-gray-500 dark:text-white hover:text-gray-700 hover:bg-gray-100"
                title="Close search"
              >
                ✕
              </button>
            </div>
          </div>
        )}






        {/* ===== MOBILE TOP RIBBON (instead of searchbar) ===== */}
        <div className="md:hidden -mx-3 px-4 py-3 bg-[#fee9f0] dark:bg-gray-700">
          <div className="flex items-center justify-between -mt-3">
            {/* Filters button (opens the collapsible filter section) */}
            <button
              onClick={() => setShowMobileFilters(v => !v)}
              className="flex items-center gap-1 text-gray-900 dark:text-white font-semibold"
            >
              <span>FILTERS</span>
              {showMobileFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {/* Center logo (use your logo path) */}
            <Link href="/">
              <img
                src="/assets/logo.png"
                alt="G' Lore Logo"
                className="h-9 md:h-12 object-contain"
              />
            </Link>

            {/* Search icon (shows the existing searchbar) */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2"
              aria-label="Search"
            >
              <AiOutlineSearch className="text-gray-800 dark:text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Mobile page header row */}
        <div className="md:hidden mt-3 mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <p className="text-gray-500 text-sm dark:text-white">
              ALL <span className="text-gray-800 font-semibold dark:text-white">COLLECTIONS</span>
            </p>
            <span className="w-10 h-[2px] bg-gray-800"></span>
          </div>

          <div className="flex items-center gap-2">
            {/* <label htmlFor="sort-m" className="text-sm text-gray-600">Sort by:</label> */}
            <select
              id="sort-m"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}


              //   className="border-2 border-primary px-2 text-sm rounded h-9"
              // >

              className="border-2 border-primary  dark:border-[#181717] rounded 
            text-xs sm:text-sm 
            px-1 sm:px-2 
            py-1 sm:py-2 bg-white dark:bg-gray-500"
            >
              <option value="relevant">sort by: Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Collapsible mobile filters */}
        {showMobileFilters && (
          <div className="md:hidden rounded-2xl border border-gray-200 bg-[#FFEBF0]  dark:bg-gray-700 p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 dark:text-white">
              Filter by Sub-Category
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-auto pr-1  no-scrollbar">
              {allSubcats.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-white">No sub-categories found</p>
              )}
              {allSubcats.map((label) => {
                const id = `m-sub-${label.replace(/\s+/g, "-")}`;
                const checked = selectedSubs.has(label);
                return (
                  <label key={id} htmlFor={id} className="flex items-center gap-2 text-sm">
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSub(label)}
                      className="accent-pink-600 w-4 h-4 rounded"
                    />
                    <span className="text-gray-700 dark:text-white">{label}</span>
                  </label>
                );
              })}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 dark:text-white">Filter by Price</h3>
              <div className="px-1">
                <Slider
                  range
                  min={Math.floor(minPrice)}
                  max={Math.ceil(maxPrice)}
                  value={range}
                  onChange={(v) => setRange(v as [number, number])}
                  allowCross={false}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-white">
                <span>Min: ৳{Math.floor(range[0])}</span>
                <span>Max: ৳{Math.ceil(range[1])}</span>
              </div>
            </div>

            {(selectedSubs.size > 0 ||
              search ||
              range[0] !== minPrice ||
              range[1] !== maxPrice) && (
                <div className="mt-4 flex gap-3">


                </div>
              )}
          </div>
        )}

        {/* ====== 2-column layout on desktop only ====== */}
        <div className="grid grid-cols-1 md:[grid-template-columns:240px_minmax(0,1fr)] gap-x-40">
          {/* Sidebar: desktop only (unchanged) */}
          <aside className="mt-3 translate-x-32 hidden md:block">
            <div className="rounded-sm bg-[#FFEBF0] dark:bg-gray-700 border border-gray-300 p-3 sticky top-4">
              <h3 className="text-sm font-semibold text-gray-800  dark:text-white mb-3">
                Filter by Sub-Category
              </h3>

              <div className="space-y-2 max-h-[260px] overflow-auto pr-1  no-scrollbar">
                {allSubcats.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-white">No sub-categories found</p>
                )}
                {allSubcats.map((label) => {
                  const id = `sub-${label.replace(/\s+/g, "-")}`;
                  const checked = selectedSubs.has(label);
                  return (
                    <label key={id} htmlFor={id} className="flex items-center gap-2 text-sm ">
                      <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSub(label)}
                        className="accent-pink-600 w-4 h-4 rounded"
                      />
                      <span className="text-gray-700 dark:text-white ">{label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 dark:text-white">
                  Filter by Price
                </h3>
                <div className="px-1">
                  <Slider
                    range
                    min={Math.floor(minPrice)}
                    max={Math.ceil(maxPrice)}
                    value={range}
                    onChange={(v) => setRange(v as [number, number])}
                    allowCross={false}
                    railStyle={{ backgroundColor: '#ffe2ef', height: 6 }}
                    trackStyle={[{ backgroundColor: '#c43882', height: 6 }]}
                    handleStyle={[
                      { borderColor: '#c43882', backgroundColor: '#fff', width: 18, height: 18, boxShadow: 'none' },
                      { borderColor: '#c43882', backgroundColor: '#fff', width: 18, height: 18, boxShadow: 'none' },
                    ]}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-white">
                  <span>Min: ৳{Math.floor(range[0])}</span>
                  <span>Max: ৳{Math.ceil(range[1])}</span>
                </div>
              </div>

              {/* {(selectedSubs.size > 0 || search || range[0] !== minPrice || range[1] !== maxPrice) && (
                <button
                  onClick={() => {
                    setSelectedSubs(new Set());
                    setSearch("");
                    setRange([minPrice, maxPrice]);
                  }}
                  className="mt-5 w-full h-10 rounded-lg bg-pink-600 text-white text-sm font-semibold hover:opacity-95"
                >
                  Clear Filters
                </button>
              )} */}
            </div>
          </aside>


          <section>
            {/* header row */}
            <div className="mb-4 hidden md:flex items-center justify-between">
              <div className="inline-flex gap-2 items-center mb-3">
                <p className="text-gray-500 dark:text-white">
                  ALL <span className="text-gray-700 font-medium dark:text-white">COLLECTIONS</span>
                </p>
                <p className="w-8 sm:w-12 h-0.5 bg-gray-700"></p>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-600 dark:text-white">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}



                  className="border-2  border-primary dark:border-[#0f0f0f] bg-white dark:bg-gray-600 text-black dark:text-white px-2 text-sm rounded"
                >
                  <option value="relevant">Relevant</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name (A–Z)</option>
                </select>
              </div>
            </div>

            {/* products */}

            <div className="grid grid-cols-1 sm:grid-cols-2  max-[345px]:grid-cols-1     max-[1030px]:grid-cols-2  xl:grid-cols-4 gap-4  ">

              {filtered.slice(0).map((p, i) => (
                <ProductCard key={`${p._id}-${i}`} product={p} isAboveFold={i < 8} />
              ))}
            </div>




            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-600">
                No products matched your filters.
              </div>
            )}
          </section>
        </div>







        <PoweredByBar />

      </div>










    </div>
  );
}
