"use client";

import React from "react";
import { FiChevronLeft } from "react-icons/fi";

interface MobileFilterButtonProps {
    onClick: () => void;
}

export default function MobileFilterButton({ onClick }: MobileFilterButtonProps) {
    return (
        <>
            <button
                onClick={onClick}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-primary text-white px-2 py-6 rounded-l-lg shadow-lg hover:bg-primary/90 transition-all duration-300 hover:px-3"
                aria-label="Open filters"
            >
                <div className="flex flex-col items-center gap-1">
                    <FiChevronLeft className="w-5 h-5" />
                    <span className="text-xs font-semibold writing-mode-vertical">FILTER</span>
                </div>
            </button>

            {/* CSS for vertical text */}
            <style jsx>{`
                .writing-mode-vertical {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </>
    );
}