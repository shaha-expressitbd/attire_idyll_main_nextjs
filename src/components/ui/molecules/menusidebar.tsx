"use client";
import { useSidebar } from "@/hooks/useSidebar";
import { useEffect, useRef, useState } from "react";
import { useBusiness } from "@/hooks/useBusiness";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

export const MenuSidebar = () => {
  const { isSidebarOpen, toggle } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { businessData } = useBusiness();
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Initialize all categories as open by default
  useEffect(() => {
    if (businessData?.categories && openCategoryIds.size === 0) {
      const allCategoryIds = new Set<string>();
      const gatherIds = (categories: any[]) => {
        categories.forEach(cat => {
          allCategoryIds.add(cat._id);
          if (cat.children && cat.children.length > 0) {
            gatherIds(cat.children);
          }
        });
      };
      gatherIds(businessData.categories);
      setOpenCategoryIds(allCategoryIds);
    }
  }, [businessData?.categories, openCategoryIds.size]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        !target.closest("#sidebar-toggler")
      ) {
        toggle(); // Close sidebar
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside); // ✅ for mobile taps
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside); // cleanup
    };
  }, [isSidebarOpen, toggle]);


  // Prevent sidebar from closing when clicking inside it
  const handleSidebarClick = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation(); // Prevent click/tap from bubbling up and closing the sidebar
  };

  // If sidebar is closed, do not render it
  if (!isSidebarOpen) return null;

  const toggleCategory = (categoryId: string) => {
    setOpenCategoryIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(categoryId) ? newSet.delete(categoryId) : newSet.add(categoryId);
      return newSet;
    });
  };

  const CategoryItem = ({ category, level = 0 }: { category: any; level?: number }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isOpen = openCategoryIds.has(category._id);

    const goToCategory = () => {
      router.push(`/category/${category.name.toLowerCase()}`);
      toggle(); // Close sidebar after navigation
      setOpenCategoryIds(new Set()); // Reset open categories
    };

    return (
      <li className="flex flex-col">
        <button
          onClick={() => (hasChildren ? toggleCategory(category._id) : goToCategory())}
          className={`flex items-center justify-between w-full py-2 pr-3 text-left hover:text-green-600 ${level === 0 ? "font-medium border-b border-gray-200" : ""
            } ${level > 0 ? `pl-${level * 4}` : ""}`}
        >
          <span>{category.name}</span>
          {hasChildren && (
            isOpen ? <FaChevronDown className="shrink-0" /> : <FaChevronRight className="shrink-0" />
          )}
        </button>

        {hasChildren && isOpen && (
          <ul className="flex flex-col">
            {category.children.map((child: any) => (
              <CategoryItem key={child._id} category={child} level={level + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex ">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-30"></div>

      {/* Sidebar Content */}
      <div
        ref={sidebarRef}
        className="relative bg-white dark:bg-gray-600 w-64 md:w-80 h-full shadow-lg z-50 p-6 overflow-y-auto"
        onClick={handleSidebarClick}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-xl text-black dark:text-white">Categories</span>
          <button onClick={toggle} className="text-gray-500 hover:text-gray-700" id="sidebar-toggler">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 352 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-1 text-black dark:text-white">
          {businessData?.categories?.map((category: any) => (
            <CategoryItem key={category._id} category={category} />
          ))}
        </ul>
      </div>
    </div>
  );
};
