"use client";

import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { useSidebar } from "@/hooks/useSidebar";
import { navbarRef } from "@/lib/refs";
import { SidebarToggler } from "../molecules/sidebarToggler";
import ThemeToggler from "../molecules/themeToggler";
import { CartSheet } from "../organisms/cart-sheet";
import { WishlistSheet } from "./WishlistSheet";
import { MenuSidebar } from "../molecules/menusidebar";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { AnimatePresence } from "framer-motion";
import { Business } from "@/types/business";
import Image from "../atoms/image";

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

const DEFAULT_IMAGE = "/assets/falback.jpg";

export const Navbar = ({ className, business }: NavbarProps) => {
  const { toggle, isDesktop } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products, fetchProducts, loading: productsLoading, hasFetched } = useProducts();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isFetchingForSearch, setIsFetchingForSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const isProductsPage = pathname?.startsWith("/products");
  const isProductDetailPage = pathname?.startsWith("/product");
  const isCheckoutPage = pathname?.startsWith("/checkout");
  const categories = business?.categories || [];

  // Slug generator
  const generateSlug = (name: string): string => {
    const BANGLA_TO_LATIN: Record<string, string> = {
      "অ": "o", "আ": "a", "ই": "i", "ঈ": "i", "উ": "u", "ঊ": "u", "ঋ": "ri",
      "এ": "e", "ঐ": "oi", "ও": "o", "ঔ": "ou", "ক": "k", "খ": "kh", "গ": "g",
      "ঘ": "gh", "ঙ": "ng", "চ": "ch", "ছ": "chh", "জ": "j", "ঝ": "jh", "ঞ": "ny",
      "ট": "t", "ঠ": "th", "ড": "d", "ঢ": "dh", "ণ": "n", "ত": "t", "থ": "th",
      "দ": "d", "ধ": "dh", "ন": "n", "প": "p", "ফ": "ph", "ব": "b", "ভ": "bh",
      "ম": "m", "য": "j", "র": "r", "ল": "l", "শ": "sh", "ষ": "sh", "স": "s",
      "হ": "h", "ড়": "r", "ঢ়": "rh", "য়": "y", "ৎ": "t", "ং": "ng", "ঃ": "h", "ঁ": "",
    };
    return name
      .toLowerCase()
      .replace(/[অ-হ]/g, (char) => BANGLA_TO_LATIN[char] || char)
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on outside click
  useEffect(() => {
    if (!showSearchBar) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchBar(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showSearchBar]);

  // Clear isFetchingForSearch when products are loaded
  useEffect(() => {
    if (hasFetched) setIsFetchingForSearch(false);
  }, [hasFetched]);

  // Debounce search term
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
        name: cat.name || "Unnamed Category",
        url: `/products?category=${cat._id}&name=${encodeURIComponent(cat.name?.toLowerCase() || "")}`,
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
        name: product.name || "Unnamed Product",
        url: `/product/${generateSlug(product.name || "")}?id=${product._id}`,
        image: product.images?.[0]?.image?.secure_url
          ? product.images[0].alterImage?.secure_url || product.images[0].image.secure_url
          : DEFAULT_IMAGE,
      }));

    return [...categoryMatches, ...productMatches].slice(0, 8);
  }, [debouncedSearchTerm, categories, products, hasFetched]);

  // Handle search submission
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !searchTerm.trim()) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("search", searchTerm.trim());
    router.push(`/products?${newSearchParams.toString()}`);
    setShowSearchBar(false);
    setSearchTerm("");
  };

  // Handle search button click
  const handleSearchClick = () => {
    setShowSearchBar(true);
    if (!hasFetched && !productsLoading) {
      setIsFetchingForSearch(true);
      fetchProducts();
    }
  };

  // Placeholder text for search input
  const placeholderText = isFetchingForSearch
    ? "Loading products..."
    : !hasFetched
      ? "Click to load and search products..."
      : "Search products...";

  return (
    <>
      {/* Main Navbar */}
      <div
        ref={navbarRef}
        className={`w-full z-[100] sticky top-0 transition-all duration-300
          ${isScrolled
            ? "bg-white border-xl border-gray-200 shadow-sm dark:bg-black dark:border-gray-800 dark:shadow-none dark:text-white"
            : "bg-white text-black dark:bg-black dark:text-white"
          } ${className || ""}`}
      >
        {/* Mobile Bottom Navigation Bar */}
        {!isProductsPage && !isCheckoutPage && !isProductDetailPage && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t flex justify-around items-center h-16 shadow-lg">
            <div className="flex flex-col items-center text-xs ml-4">
              <SidebarToggler />
              <span>Menu</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="flex flex-col items-center text-xs text-black dark:text-white"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                className="text-lg"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z"></path>
              </svg>
              <span className="text-xs transition-all duration-500 ease-in-out text-black dark:text-white">
                Shop
              </span>
            </button>
            <Link
              href="/"
              className="left-1/2 absolute flex justify-center items-center border-2 border-gray-200 bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl rounded-full w-16 h-16 transform transition -translate-x-1/2 -translate-y-1/2 duration-300 ease-in-out"
              aria-current="page"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 576 512"
                className="w-7 h-7 text-pink-400 transition duration-200 ease-in-out"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path>
              </svg>
            </Link>
            <Link href="/about" className="flex flex-col items-center ml-10 group">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="w-7 h-7 text-black dark:text-white transition duration-200 ease-in-out"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 11C14.7614 11 17 13.2386 17 16V22H15V16C15 14.4023 13.7511 13.0963 12.1763 13.0051L12 13C10.4023 13 9.09634 14.2489 9.00509 15.8237L9 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5.5 14C5.77885 14 6.05009 14.0326 6.3101 14.0942C6.14202 14.594 6.03873 15.122 6.00896 15.6693L6 16L6.0007 16.0856C5.88757 16.0456 5.76821 16.0187 5.64446 16.0069L5.5 16C4.7203 16 4.07955 16.5949 4.00687 17.3555L4 17.5V22H2V17.5C2 15.567 3.567 14 5.5 14ZM18.5 14C20.433 14 22 15.567 22 17.5V22H20V17.5C20 16.7203 19.4051 16.0796 18.6445 16.0069L18.5 16C18.3248 16 18.1566 16.03 18.0003 16.0852L18 16C18 15.3343 17.8916 14.694 17.6915 14.0956C17.9499 14.0326 18.2211 14 18.5 14ZM5.5 8C6.88071 8 8 9.11929 8 10.5C8 11.8807 6.88071 13 5.5 13C4.11929 13 3 11.8807 3 10.5C3 9.11929 4.11929 8 5.5 8ZM18.5 8C19.8807 8 21 9.11929 21 10.5C21 11.8807 19.8807 13 18.5 13C17.1193 13 16 11.8807 16 10.5C16 9.11929 17.1193 8 18.5 8ZM5.5 10C5.22386 10 5 10.2239 5 10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5C6 10.2239 6 10 5.5 10ZM18.5 10C18.2239 10 18 10.2239 18 10.5C18 10.7761 18.2239 11 18.5 11C18.7761 11 19 10.7761 19 10.5C19 10.2239 19 10 18.5 10ZM12 2C14.2091 2 16 3.79086 16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2ZM12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4Z"></path>
              </svg>
              <span className="text-xs transition-all duration-500 ease-in-out text-black dark:text-white">
                About US
              </span>
            </Link>
            <ThemeToggler />
          </div>
        )}

        {/* Desktop Full Header */}
        <div
          className={`hidden md:flex items-center justify-between px-6 py-2
            ${isScrolled ? "text-gray-900" : "text-black dark:text-white"}`}
        >
          {/* Left: Menu + Search */}
          <div className="flex items-center gap-6 text-sm font-semibold ml-16">
            <div className="flex items-center gap-1 cursor-pointer text-black dark:text-white">
              <SidebarToggler />
              <span className="cursor-pointer px-3 py-2" onClick={toggle}>
                Menu
              </span>
            </div>
            <div className="relative" ref={searchRef}>
              <button
                type="button"
                onClick={handleSearchClick}
                className="flex items-center gap-1 cursor-pointer text-black dark:text-white hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              >
                <AiOutlineSearch className="text-lg" />
                <span>Search</span>
              </button>
              <AnimatePresence>
                {showSearchBar && (
                  <Suspense fallback={<div className="text-center p-2">Loading search...</div>}>
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
          <div>
            <Link href="/">
              <Image
                src={business?.alterImage?.secure_url || DEFAULT_IMAGE}
                alt="Business Logo"
                sizes="160px"
                className="h-10 md:h-12 object-contain"
                variant="small"
              />
            </Link>
          </div>

          {/* Right: Shop + Cart + Wishlist + Theme */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="flex flex-col items-center text-xs text-black dark:text-white"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                className="text-lg text-black dark:text-white"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z"></path>
              </svg>
            </button>
            <CartSheet />
            <WishlistSheet />
            <ThemeToggler />
          </div>
        </div>

        <MenuSidebar />
      </div>
    </>
  );
};

export default Navbar;
