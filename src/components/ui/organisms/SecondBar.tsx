"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useBusiness } from "@/hooks/useBusiness";
import { useRouter, usePathname } from "next/navigation";
import { menuItems } from "@/config/routes.config";
import {
  FaBars,
  FaAngleDown,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";


const indentCls = ["pl-4", "pl-8", "pl-12", "pl-16", "pl-20"];

export default function SecondBar() {
  const [showCategories, setShowCategories] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { businessData } = useBusiness();
  const router = useRouter();
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  const [openIds, setOpenIds] = useState<Set<string>>(new Set());


  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    if (!showCategories) return;
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowCategories(false);
        setOpenIds(new Set());
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showCategories]);


  const CategoryItem = ({
    cat,
    level = 0,
  }: {
    cat: any;
    level?: number;
  }) => {
    const hasChildren =
      Array.isArray(cat.children) && cat.children.length > 0;
    const isOpen = openIds.has(cat._id);


    const openOnHover = () =>
      hasChildren &&
      setOpenIds((prev) => {
        if (prev.has(cat._id)) return prev;
        const next = new Set(prev);
        next.add(cat._id);
        return next;
      });


    const toggleOpen = () =>
      setOpenIds((prev) => {
        const next = new Set(prev);
        next.has(cat._id) ? next.delete(cat._id) : next.add(cat._id);
        return next;
      });


    const goToCategory = () => {
      router.push(`/category/${cat.name.toLowerCase()}`);
      setShowCategories(false);
      setOpenIds(new Set());
    };

    return (
      <li className="flex flex-col">
        <button
          onClick={hasChildren ? toggleOpen : goToCategory}
          onMouseEnter={openOnHover}
          className={`flex items-center justify-between w-full rounded-md py-2 pr-3
                      text-left dark:text-white hover:bg-red-50 hover:text-red-600
                      dark:hover:bg-gray-700 dark:hover:text-red-400 focus:outline-none
                      transition-colors ${indentCls[Math.min(level, indentCls.length - 1)]}`}
        >
          <span className="truncate">{cat.name}</span>
          {hasChildren &&
            (isOpen ? (
              <FaChevronDown className="shrink-0" />
            ) : (
              <FaChevronRight className="shrink-0" />
            ))}
        </button>


        {hasChildren && isOpen && (
          <ul className="flex flex-col gap-0.5">
            {cat.children.map((child: any) => (
              <CategoryItem key={child._id} cat={child} level={level + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };


  return (
    <div
      className={`w-full z-50 transition-all duration-300 hidden md:block ${isScrolled
        ? "bg-white/95 dark:bg-gray-800/95 shadow-md py-1"
        : "bg-white dark:bg-gray-700 py-1"
        }`}
    >
      <div className="container mx-auto flex items-end px-4 relative">

        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowCategories((v) => !v)}
            aria-expanded={showCategories}
            aria-controls="categories-dropdown"
            className="flex items-center gap-2 px-3 py-1 bg-black dark:bg-gray-200
                       text-white dark:text-gray-900 rounded focus:outline-none
                       focus:ring-2 focus:ring-red-500"
          >
            <FaBars /> All Categories
            <FaAngleDown
              className={`transition-transform ${showCategories ? "rotate-180" : ""
                }`}
            />
          </button>

          {showCategories && (
            <div
              ref={dropdownRef}
              id="categories-dropdown"
              data-show={showCategories}
              className="absolute top-full left-0 mt-2 min-w-[260px] max-h-[75vh]
                         overflow-y-auto bg-white dark:bg-gray-800 border
                         dark:border-gray-700 rounded-lg shadow-xl z-50 p-2
                         ring-1 ring-red-100 dark:ring-gray-700
                         opacity-0 -translate-y-2.5
                         data-[show=true]:opacity-100 data-[show=true]:translate-y-0
                         transition-all duration-200 ease-out"
            >
              <ul className="flex flex-col gap-0.5">
                {businessData?.categories?.map((cat: any) => (
                  <CategoryItem key={cat._id} cat={cat} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* টপ-লেভেল মেনু লিঙ্ক */}
        <ul
          className="flex items-center justify-center flex-1 space-x-4
                     text-gray-700 dark:text-gray-300 ml-4"
        >
          {menuItems.map((item) => (
            <li key={item.title} className="flex items-center gap-1">
              {item.icon && <item.icon className="text-red-500" />}
              <Link
                href={item.path ?? "/"}
                className={`inline-block font-medium transition-colors
                            hover:text-red-600 dark:hover:text-white
                            ${pathname === item.path
                    ? "border-b-2 border-red-600"
                    : ""
                  }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
