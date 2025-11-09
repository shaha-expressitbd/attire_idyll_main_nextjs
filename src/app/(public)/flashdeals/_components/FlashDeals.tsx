/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { Product } from '@/types/product';
import ProductCard from '@/components/ui/organisms/product-card';
import { CountdownTimer } from '../../product/_component/CountdownTimer';
import { FlashDealTimeCounter } from '@/components/ui/atoms/FlashDealTimeCounter';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Pagination } from '@/components/ui/molecules/pagination';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */
const getCategoryName = (p: Product) =>
    p.sub_category?.[0]?.name ?? 'Uncategorised';

const toNumber = (v: string | number | undefined | null) =>
    v === undefined || v === null ? 0 : Number(v);

interface FlashDealsProps {
    initialDeals: Product[];
}

export default function FlashDeals({ initialDeals }: FlashDealsProps) {
    /* ───────── State ───────── */
    const [sortBy, setSortBy] = useState<'discount' | 'time' | 'price'>('discount');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [showExpired, setShowExpired] = useState(false);
    const [dealStats, setDealStats] = useState({
        total: 0,
        active: 0,
        expiring: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);



    /* ───────── Derived Data ───────── */
    const { deals, categories } = useMemo(() => {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        /* ---------- Active / expired filtering ---------- */
        let filteredDeals = initialDeals.filter((p) => {
            const v = p.variantsId?.[0];
            const end = v?.discount_end_date;
            const start = v?.discount_start_date;

            if (!end) return false;

            const endTime = new Date(end).getTime();
            const startTime = start ? new Date(start).getTime() : 0;

            const isActive = now >= startTime && now <= endTime;
            const isExpired = now > endTime;

            return showExpired ? isActive || isExpired : isActive;
        });

        /* ---------- Category filter ---------- */
        if (filterCategory !== 'all') {
            filteredDeals = filteredDeals.filter(
                (p) => getCategoryName(p).toLowerCase() === filterCategory.toLowerCase(),
            );
        }

        /* ---------- Sorting ---------- */
        filteredDeals.sort((a, b) => {
            const va = a.variantsId?.[0];
            const vb = b.variantsId?.[0];

            switch (sortBy) {
                case 'discount': {
                    const da = toNumber(va?.discount_percent);
                    const db = toNumber(vb?.discount_percent);
                    return db - da;
                }
                case 'time': {
                    const ea = new Date(va?.discount_end_date ?? 0).getTime();
                    const eb = new Date(vb?.discount_end_date ?? 0).getTime();
                    return ea - eb;
                }
                case 'price': {
                    const pa = toNumber(va?.offer_price) || toNumber(va?.selling_price) || 0;
                    const pb = toNumber(vb?.offer_price) || toNumber(vb?.selling_price) || 0;
                    return pa - pb;
                }
                default:
                    return 0;
            }
        });

        /* ---------- Unique categories ---------- */
        const uniqueCategories = [...new Set(initialDeals.map(getCategoryName))];

        return { deals: filteredDeals, categories: uniqueCategories };
    }, [initialDeals, filterCategory, sortBy, showExpired]);

    /* ───────── Pagination ───────── */
    const totalPages = Math.ceil(deals.length / itemsPerPage);
    const paginatedDeals = deals.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /* ───────── Deal stats ---------- */
    useEffect(() => {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        const stats = initialDeals.reduce(
            (acc, p) => {
                const v = p.variantsId?.[0];
                if (!v?.discount_end_date) return acc;

                const end = new Date(v.discount_end_date).getTime();
                const start = v.discount_start_date
                    ? new Date(v.discount_start_date).getTime()
                    : 0;

                acc.total += 1;
                if (now >= start && now <= end) {
                    acc.active += 1;
                    if (end - now <= oneHour) acc.expiring += 1;
                }
                return acc;
            },
            { total: 0, active: 0, expiring: 0 },
        );

        setDealStats(stats);
    }, [initialDeals]);



    /* ───────── JSX ───────── */
    return (
        <div className="max-w-7xl mx-auto px-2 md:px-6 py-2 md:mt-24">
            {/* ───────── Header + Stats ───────── */}
            <div className="text-center mb-2 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <h1 className="text-3xl md:text-6xl font-black tracking-tight relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-red-600 animate-pulse">
                            ⚡ Flash Deals
                        </span>

                    </h1>

                    {/* Stats Bar */}
                    <div className="flex justify-center items-center gap-6 md:mt-4 mt-1 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {dealStats.active} Active Deals
                            </span>
                        </div>
                        {dealStats.expiring > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-red-600 dark:text-red-400">
                                    {dealStats.expiring} Expiring Soon!
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ───────── Controls ───────── */}
                <div className="flex flex-wrap justify-center items-center gap-4 mt-6">

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="md:px-3 md:py-2 px-2  text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                    >
                        <option value="discount">🔥 Best Discount</option>
                        <option value="time">⏰ Ending Soon</option>
                        <option value="price">💰 Lowest Price</option>
                    </select>

                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="md:px-3 md:py-2 px-2  text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                        >
                            <option value="all">📂 All Categories</option>
                            {categories.map((cat, i) => (
                                <option key={`${cat}-${i}`} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Show Expired Toggle */}
                    <label className="flex items-center gap-2 text-sm ">
                        <input
                            type="checkbox"
                            checked={showExpired}
                            onChange={(e) => setShowExpired(e.target.checked)}
                            className="rounded focus:ring-red-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                            Show Expired
                        </span>
                    </label>
                </div>

                <div className="h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-6 w-full max-w-md mx-auto rounded-full opacity-60" />
            </div>

            {/* ───────── Content ───────── */}
            <DesktopGridView deals={paginatedDeals} />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        itemsPerPage={itemsPerPage}
                        totalItems={deals.length}
                    />
                </div>
            )}

            {/* ───────── Empty State ───────── */}
            {deals.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                >
                    <div className="md:text-6xl text-2xl mb-4">😔</div>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2 ">
                        No {showExpired ? '' : 'active'} flash deals available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-6">
                        {filterCategory !== 'all'
                            ? `No deals found in "${filterCategory}" category.`
                            : "Don't worry, amazing deals are coming soon!"}
                    </p>
                    <div className="flex justify-center gap-3">
                        {filterCategory !== 'all' && (
                            <button
                                onClick={() => setFilterCategory('all')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                View All Categories
                            </button>
                        )}
                        {!showExpired && (
                            <button
                                onClick={() => setShowExpired(true)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Show Expired Deals
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

/* ───────── Component Sub-sections ───────── */

const DesktopGridView = ({ deals }: { deals: Product[] }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-3 gap-1"
        >
            <AnimatePresence>
                {deals.map((deal, idx) => {
                    const v = deal.variantsId?.[0];
                    const endDate = deal.variantsId?.[0]?.discount_end_date ?? '';
                    const expiring =
                        v?.discount_end_date &&
                        new Date(v.discount_end_date).getTime() - Date.now() <=
                        60 * 60 * 1000;

                    const getUniqueKey = (deal: Product, idx: number) => {
                        return deal._id ? String(deal._id) : `grid-${idx}`;
                    };
                    return (
                        <motion.div
                            key={getUniqueKey(deal, idx)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            className={`relative ${expiring ? 'animate-pulse' : ''}`}
                        >
                            {expiring && (
                                <div className="absolute -top-2 -right-2 z-20 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                                    🔥 ENDING SOON!
                                </div>
                            )}
                            <ProductCard product={deal} isAboveFold={false} />
                            <div className="mt-2">
                                {isMobile ? <FlashDealTimeCounter endDate={endDate} /> : <CountdownTimer endDate={endDate} />}

                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
};
