import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchBarProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearch, search, setShowSearch }) => {
  return (
    <div className="hidden md:mb-6 md:block">
      <div className="mx-auto max-w-3xl flex items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full h-10 pl-5 pr-12 rounded-full bg-white dark:bg-gray-600 text-black dark:text-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
          />
          <AiOutlineSearch
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white pointer-events-none"
            size={18}
            aria-hidden="true"
          />
        </div>

        {/* Hide searchbar button */}
        <button
          onClick={() => setShowSearch(false)}
          className="shrink-0 w-10 h-10 flex items-center justify-center border-gray-300 text-gray-500 dark:text-white hover:text-gray-700 hover:bg-gray-100"
          title="Close search"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
