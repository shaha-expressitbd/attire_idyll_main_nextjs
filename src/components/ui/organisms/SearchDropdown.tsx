import React from "react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";

interface SearchResultItem {
    type: "product" | "category";
    id: string;
    name: string;
    url: string;
    image?: string;
}

const DEFAULT_IMAGE = "/assets/placeholder.webp";

interface SearchDropdownProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    placeholderText: string;
    isFetchingForSearch: boolean;
    hasFetched: boolean;
    suggestions: SearchResultItem[];
    generateSlug: (name: string) => string;
    onClose: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
    searchTerm,
    setSearchTerm,
    placeholderText,
    isFetchingForSearch,
    hasFetched,
    suggestions,
    generateSlug,
    onClose,
    onKeyDown,
}) => {
    return (
        <div className="absolute top-12 left-0 z-50 w-[90vw] md:w-[300px] lg:w-[400px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
            <div className="relative">
                <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholderText}
                    className="w-full pl-10 pr-8 py-2 rounded-md bg-gray-50 dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    autoFocus
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                    >
                        ✕
                    </button>
                )}
            </div>
            {isFetchingForSearch && (
                <div className="mt-2 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                </div>
            )}
            {!isFetchingForSearch && hasFetched && suggestions.length === 0 && searchTerm && (
                <div className="mt-2 text-center text-gray-500">
                    No results found
                </div>
            )}
            {!isFetchingForSearch && hasFetched && suggestions.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                    <ul>
                        {suggestions.map((item) => (
                            <li key={`${item.type}-${item.id}`}>
                                <Link
                                    href={item.url}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                    onClick={onClose}
                                >
                                    {item.type === "product" ? (
                                        <>
                                            <Image
                                                src={item.image || DEFAULT_IMAGE}
                                                alt={item.name}
                                                width={24}
                                                height={24}
                                                sizes="24px"
                                                className="object-cover rounded"
                                                loading="lazy"
                                            />
                                            <span className="truncate text-black dark:text-white">{item.name}</span>
                                            <span className="ml-auto text-gray-500">Product</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5 text-pink-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                            </svg>
                                            <span className="truncate">{item.name}</span>
                                            <span className="ml-auto text-gray-500">Category</span>
                                        </>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;