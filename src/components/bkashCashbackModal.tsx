"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

interface bkashCashbackModalProps {
    pageType: "checkout" | "productDetails"; // Identify which page is using the modal
}

export const BkashCashbackModal: React.FC<bkashCashbackModalProps> = ({
    pageType,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    // Set different localStorage keys for different pages
    const storageKey = `bkashModalLastShown_${pageType}`;

    // Check localStorage and show modal with appropriate delay
    useEffect(() => {
        const lastShown = localStorage.getItem(storageKey);
        const now = new Date().getTime();
        const twentyFourHours = 6 * 60 * 60 * 1000;

        const shouldShowModal = !lastShown || (now - parseInt(lastShown)) > twentyFourHours;

        if (shouldShowModal) {
            if (pageType === "checkout") {
                // Show immediately on checkout page
                setIsOpen(true);
                localStorage.setItem(storageKey, now.toString());
            } else if (pageType === "productDetails") {
                // Show after 5 seconds on product details page
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    localStorage.setItem(storageKey, now.toString());
                }, 5000);

                return () => clearTimeout(timer);
            }
        }
    }, [pageType, storageKey]);

    // Auto-close timer logic
    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsOpen(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 m-4 max-w-md w-full border border-gray-200 dark:border-gray-700 animate-fade-in">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                    <RxCross2 size={24} />
                </button>

                <div className="absolute top-4 left-4 text-sm text-gray-500 dark:text-gray-400">
                    {timeLeft}s
                </div>

                <div className="flex flex-col items-center text-center">
                    <Image
                        src="/assets/bkash.png"
                        alt="bKash"
                        width={120}
                        height={40}
                        className="mb-4 object-contain"
                    />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        bKash পেমেন্টে ১০০ টাকা পর্যন্ত ক্যাশব্যাক!
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        চেকআউটে bKash পেমেন্ট পদ্ধতি নির্বাচন করুন এবং ১০০ টাকা পর্যন্ত ক্যাশব্যাক পান।
                    </p>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors w-full"
                    >
                        ঠিক আছে
                    </button>
                </div>
            </div>
        </div>
    );
};