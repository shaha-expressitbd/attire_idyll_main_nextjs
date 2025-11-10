"use client";

import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import Link from "next/link";
import { AiOutlineSearch, AiTwotoneShopping } from "react-icons/ai";
import { HiOutlineMenu } from "react-icons/hi";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { AnimatePresence, motion } from "framer-motion";
import { Business } from "@/types/business";
import Image from "../atoms/image";
import { CartSheet } from "../organisms/cart-sheet";
import { WishlistSheet } from "./WishlistSheet";
import ThemeToggler from "../molecules/themeToggler";
import { PiShoppingBagThin } from "react-icons/pi";

const SearchDropdown = lazy(() => import("./SearchDropdown"));

export interface NavbarProps {
  className?: string;
  business: Business;
}

interface SearchResultItem {
  type: "product" | "category";
  id: string;
  name: string;
  url: string;
  image?: string;
}

const DEFAULT_IMAGE = "/assets/fallback.jpg";

export const Navbar = ({ className, business }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products, fetchProducts, loading: productsLoading, hasFetched } = useProducts();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isFetchingForSearch, setIsFetchingForSearch] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const categories = business?.categories || [];

  // Slug generator
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === লক/আনলক বডি স্ক্রল (শুধু মোবাইলে সার্চ ওপেনে) ===
  useEffect(() => {
    if (showSearchBar && isMobile) {
      // পেজ স্ক্রল লক
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`; // স্ক্রল পজিশন মেইনটেইন
    } else if (!showSearchBar && isMobile) {
      // আনলক + পুরানো স্ক্রল পজিশন রিস্টোর
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      // ক্লিনআপ
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [showSearchBar, isMobile]);

  // Close search on outside click (desktop only)
  useEffect(() => {
    if (!showSearchBar || isMobile) return;
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchBar(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearchBar, isMobile]);

  // Close category dropdown on outside click
  useEffect(() => {
    if (!isCategoryOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isCategoryOpen]);

  // Clear fetching
  useEffect(() => {
    if (hasFetched) setIsFetchingForSearch(false);
  }, [hasFetched]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search suggestions
  const suggestions: SearchResultItem[] = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term || !hasFetched) return [];

    const categoryMatches = categories
      .filter((cat: any) => cat.name?.toLowerCase().includes(term))
      .map((cat: any) => ({
        type: "category" as const,
        id: cat._id,
        name: cat.name || "Unnamed",
        url: `/category=${cat._id}&name=${encodeURIComponent(cat.name)}`,
        image: cat.image?.optimizeUrl || DEFAULT_IMAGE,
      }));

    const productMatches = products
      .filter((product: any) =>
        [product.name, product.short_description, product.long_description]
          .some((field) => field?.toLowerCase().includes(term))
      )
      .map((product: any) => ({
        type: "product" as const,
        id: product._id,
        name: product.name || "Unnamed",
        url: `/product/${generateSlug(product.name)}?id=${product._id}`,
        image: product.images?.[0]?.image?.secure_url
          ? product.images[0].alterImage?.secure_url || product.images[0].image.secure_url
          : DEFAULT_IMAGE,
      }));

    return [...categoryMatches, ...productMatches].slice(0, 8);
  }, [debouncedSearchTerm, categories, products, hasFetched]);

  // Handle search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !searchTerm.trim()) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("search", searchTerm.trim());
    router.push(`/products?${newSearchParams.toString()}`);
    setShowSearchBar(false);
    setSearchTerm("");
  };

  const handleSearchClick = () => {
    setShowSearchBar(true);
    if (!hasFetched && !productsLoading) {
      setIsFetchingForSearch(true);
      fetchProducts();
    }
  };

  const placeholderText = isFetchingForSearch
    ? "Loading..."
    : !hasFetched
      ? "Click to load..."
      : "Search products...";

  return (
    <>
      {/* Sticky Navbar */}
      <div
        className={`w-full z-[100] sticky top-0 transition-all duration-300
          ${isScrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm dark:bg-black/95 dark:border-gray-800"
            : "bg-white dark:bg-black"
          } ${className || ""}`}
      >
        {/* Top Row */}
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 gap-2 sm:gap-3 lg:container md:container mx-auto">
          {/* Left: Menu + Search */}
          <div className="flex items-center gap-2 sm:gap-3 relative" ref={dropdownRef}>
            {/* Menu Icon */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition"
            >
              <HiOutlineMenu className="text-xl sm:text-2xl" />
            </button>

            {/* Category Dropdown */}
            <AnimatePresence>
              {isCategoryOpen && categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 w-screen sm:w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50"
                  style={{ maxWidth: "100vw" }}
                >
                  <nav className="max-h-60 overflow-y-auto">
                    {categories.map((cat: any) => {
                      const slug = generateSlug(cat.name);
                      return (
                        <Link
                          key={cat._id}
                          href={`/maincategory/${slug}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300
                            hover:bg-pink-50 dark:hover:bg-gray-800
                            hover:text-primary dark:hover:text-pink-400
                            transition text-left"
                        >
                          {cat.name}
                        </Link>
                      );
                    })}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Button */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={handleSearchClick}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition"
              >
                <AiOutlineSearch className="text-lg sm:text-xl" />
                <span className="text-xs sm:text-sm hidden xs:block">Search</span>
              </button>

              {/* Mobile Full Screen Search */}
              <AnimatePresence>
                {showSearchBar && isMobile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-white dark:bg-black z-[200] flex flex-col"
                  >
                    {/* Search Header */}
                    <div className="flex items-center gap-3 p-4 border-b dark:border-gray-800">
                      <button
                        onClick={() => {
                          setShowSearchBar(false);
                          setSearchTerm("");
                        }}
                        className="text-gray-600 dark:text-gray-400"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder={placeholderText}
                        className="flex-1 text-base outline-none dark:bg-transparent dark:text-white"
                        autoFocus
                      />
                      {isFetchingForSearch && (
                        <div className="animate-spin">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Scrollable Results */}
                    <div className="flex-1 overflow-y-auto px-4 py-2">
                      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                        {suggestions.length > 0 ? (
                          <div className="space-y-1">
                            {suggestions.map((item) => (
                              <Link
                                key={`${item.type}-${item.id}`}
                                href={item.url}
                                onClick={() => {
                                  setShowSearchBar(false);
                                  setSearchTerm("");
                                }}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                              >
                                {item.image && (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded"
                                    variant="small"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.type}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : debouncedSearchTerm && hasFetched ? (
                          <p className="text-center text-gray-500 py-8">No results found</p>
                        ) : null}
                      </Suspense>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop Search Dropdown */}
              <AnimatePresence>
                {showSearchBar && !isMobile && (
                  <Suspense fallback={<div className="p-2">Loading...</div>}>
                    <SearchDropdown
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      placeholderText={placeholderText}
                      isFetchingForSearch={isFetchingForSearch}
                      hasFetched={hasFetched}
                      suggestions={suggestions}
                      generateSlug={generateSlug}
                      onClose={() => {
                        setShowSearchBar(false);
                        setSearchTerm("");
                      }}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </Suspense>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center max-w-44 ">
            <Link href="/">
              <Image
                src={business?.alterImage?.secure_url || DEFAULT_IMAGE}
                alt="Logo"
                sizes="100px"
                className="h-7 sm:h-9 object-contain"
                variant="small"
              />
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/products")}
              className="text-gray-700 dark:text-gray-300 hover:text-primary"
            >
              <PiShoppingBagThin className="w-6 h-6 " />
            </button>
            <CartSheet />
            <WishlistSheet />
            <ThemeToggler />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;