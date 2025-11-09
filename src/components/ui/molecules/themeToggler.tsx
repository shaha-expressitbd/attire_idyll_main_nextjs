"use client";
import useTheme from "@/hooks/useTheme";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "../atoms/button";

const ThemeToggler: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <>
      {/* Mobile version (shows icon + text) - visible on small screens only */}
      <Button
        title='Theme Toggler'
        variant='ghost'
        onClick={toggleMode}
        className="md:hidden group flex items-center gap-2"
      >
        {mode === "light" ? (
          <div className="flex flex-col items-center">
            <FaMoon className='w-6 h-6 text-gray-700 dark:text-gray-300' />
            <span className="text-xs transition-all duration-500 ease-in-out text-black dark:text-white">
              Dark
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaSun className='w-6 h-6 text-yellow-500 dark:text-yellow-300' />
            <span className="text-xs transition-all duration-500 ease-in-out text-black dark:text-white">
              Light
            </span>
          </div>
        )}
      </Button>

      {/* Desktop version (shows icon only) - hidden on mobile, visible on md and up */}
      <Button
        title='Theme Toggler'
        variant='ghost'
        onClick={toggleMode}
        className='hidden md:inline-flex'
      >
        {mode === "light" ? (
          <FaMoon className='w-5 h-5 text-gray-700 dark:text-gray-300' />
        ) : (
          <FaSun className='w-5 h-5 text-yellow-500 dark:text-yellow-300' />
        )}
      </Button>
    </>
  );
};

export default ThemeToggler;