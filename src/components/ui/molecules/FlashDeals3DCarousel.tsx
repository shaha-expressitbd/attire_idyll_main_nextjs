/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Autoplay,
    FreeMode,
    Pagination,
    EffectCoverflow,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import { motion, AnimatePresence } from 'framer-motion';

import { Product } from '@/types/product';
import ProductCard from '@/components/ui/organisms/product-card';
import { CountdownTimer } from '../../../app/(public)/product/_component/CountdownTimer';

export const MobileCarouselView = ({
    deals,
    prevRef,
    nextRef,
    showNav,
    activeIndex,
    handleMouseEnter,
    handleMouseLeave,
    setSwiper,
    updateNav,
    setActiveIndex,
    isAutoplayPaused,
    getDiscountProgress
}: {
    deals: Product[];
    prevRef: React.RefObject<HTMLDivElement | null>;
    nextRef: React.RefObject<HTMLDivElement | null>;
    showNav: { prev: boolean; next: boolean };
    activeIndex: number;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    setSwiper: (swiper: any) => void;
    updateNav: () => void;
    setActiveIndex: (index: number) => void;
    isAutoplayPaused: boolean;
    getDiscountProgress: (p: Product) => number;
}) => (
    <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        {/* Progress Bar */}
        <div className="mb-4 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((activeIndex + 1) / deals.length) * 100}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>

        <Swiper
            modules={[
                Navigation,
                Autoplay,
                FreeMode,
                Pagination,
                EffectCoverflow,
            ]}
            centeredSlides
            effect="coverflow"
            coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
            }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            }}
            onSwiper={(s) => {
                setSwiper(s);
                setTimeout(updateNav, 50);
            }}
            onSlideChange={(s) => {
                updateNav();
                setActiveIndex(s.activeIndex);
            }}
            breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 12 },
                375: { slidesPerView: 1.35, spaceBetween: 14 },
                480: { slidesPerView: 1.6, spaceBetween: 16 },
                640: { slidesPerView: 2.2, spaceBetween: 18 },
            }}
            className="pb-12"
        >
            <AnimatePresence mode="popLayout">
                {deals.map((deal, idx) => {
                    const v = deal.variantsId?.[0];
                    const endDate =
                        v?.discount_end_date ?? new Date().toISOString();
                    const expiring =
                        v?.discount_end_date &&
                        new Date(v.discount_end_date).getTime() - Date.now() <=
                        60 * 60 * 1000;
                    const progress = getDiscountProgress(deal);

                    const getUniqueKey = (deal: Product, idx: number) => {
                        return deal._id ? String(deal._id) : `deal-${idx}`;
                    };
                    return (
                        <SwiperSlide
                            key={getUniqueKey(deal, idx)}
                            className="!w-auto pt-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 5,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                }}
                                transition={{ duration: 0.4 }}
                                className={`relative w-[250px] sm:w-[280px] ${expiring ? 'animate-pulse' : ''
                                    }`}
                            >
                                {/* Deal badge */}
                                <div className="absolute -top-2 right-20 z-20">
                                    <motion.div
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${expiring
                                            ? 'bg-red-500 text-white'
                                            : 'bg-green-500 text-white'
                                            }`}
                                        animate={{
                                            rotate: expiring ? [0, -5, 5, 0] : 0,
                                        }}
                                        transition={{
                                            repeat: expiring ? Infinity : 0,
                                            duration: 0.5,
                                        }}
                                    >
                                        {expiring ? '🔥 ENDING SOON!' : '⚡ HOT DEAL!'}
                                    </motion.div>
                                </div>
                                {/* Progress Ring */}
                                <div className="absolute top-2 left-2 z-20">
                                    <svg
                                        className="w-8 h-8 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                    >
                                        <path
                                            className="text-gray-300"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-red-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray={`${progress}, 100`}
                                            strokeLinecap="round"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                </div>

                                <ProductCard product={deal} isAboveFold={false} />

                                <div className="mt-3 space-y-2">
                                    <CountdownTimer endDate={endDate} />

                                </div>
                            </motion.div>
                        </SwiperSlide>
                    );
                })}
            </AnimatePresence>
        </Swiper>

        {/* ─── Navigation Buttons ─── */}
        <AnimatePresence>
            {showNav.prev && (
                <motion.div
                    ref={prevRef}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.div>
            )}
            {showNav.next && (
                <motion.div
                    ref={nextRef}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Autoplay Status Indicator */}
        <div className="fixed bottom-4 right-4 z-50">
            <motion.div
                className={`px-3 py-2 rounded-full text-xs font-medium ${isAutoplayPaused ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white`}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                {isAutoplayPaused ? '⏸️ Paused' : '▶️ Auto‑playing'}
            </motion.div>
        </div>
    </div>
);

export const DesktopCarouselView = ({
    deals,
    prevRef,
    nextRef,
    showNav,
    activeIndex,
    handleMouseEnter,
    handleMouseLeave,
    setSwiper,
    updateNav,
    setActiveIndex,
    isAutoplayPaused,
    getDiscountProgress
}: {
    deals: Product[];
    prevRef: React.RefObject<HTMLDivElement | null>;
    nextRef: React.RefObject<HTMLDivElement | null>;
    showNav: { prev: boolean; next: boolean };
    activeIndex: number;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    setSwiper: (swiper: any) => void;
    updateNav: () => void;
    setActiveIndex: (index: number) => void;
    isAutoplayPaused: boolean;
    getDiscountProgress: (p: Product) => number;
}) => (
    <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        {/* Progress Bar */}
        <div className="mb-4 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((activeIndex + 1) / deals.length) * 100}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>

        <Swiper
            modules={[
                Navigation,
                Autoplay,
                FreeMode,
                Pagination,
                EffectCoverflow,
            ]}
            centeredSlides
            effect="coverflow"
            coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
            }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            }}
            onSwiper={(s) => {
                setSwiper(s);
                setTimeout(updateNav, 50);
            }}
            onSlideChange={(s) => {
                updateNav();
                setActiveIndex(s.activeIndex);
            }}
            breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 12 },
                375: { slidesPerView: 1.35, spaceBetween: 14 },
                480: { slidesPerView: 1.6, spaceBetween: 16 },
                640: { slidesPerView: 2.2, spaceBetween: 18 },
                768: { slidesPerView: 2.5, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="pb-12"
        >
            <AnimatePresence mode="popLayout">
                {deals.map((deal, idx) => {
                    const v = deal.variantsId?.[0];
                    const endDate =
                        v?.discount_end_date ?? new Date().toISOString();
                    const expiring =
                        v?.discount_end_date &&
                        new Date(v.discount_end_date).getTime() - Date.now() <=
                        60 * 60 * 1000;
                    const progress = getDiscountProgress(deal);

                    const getUniqueKey = (deal: Product, idx: number) => {
                        return deal._id ? String(deal._id) : `deal-${idx}`;
                    };
                    return (
                        <SwiperSlide
                            key={getUniqueKey(deal, idx)}
                            className="!w-auto pt-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 5,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                }}
                                transition={{ duration: 0.4 }}
                                className={`relative w-[250px] sm:w-[280px] ${expiring ? 'animate-pulse' : ''
                                    }`}
                            >
                                {/* Deal badge */}
                                <div className="absolute -top-2 right-20 z-20">
                                    <motion.div
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${expiring
                                            ? 'bg-red-500 text-white'
                                            : 'bg-green-500 text-white'
                                            }`}
                                        animate={{
                                            rotate: expiring ? [0, -5, 5, 0] : 0,
                                        }}
                                        transition={{
                                            repeat: expiring ? Infinity : 0,
                                            duration: 0.5,
                                        }}
                                    >
                                        {expiring ? '🔥 ENDING SOON!' : '⚡ HOT DEAL!'}
                                    </motion.div>
                                </div>
                                {/* Progress Ring */}
                                <div className="absolute top-2 left-2 z-20">
                                    <svg
                                        className="w-8 h-8 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                    >
                                        <path
                                            className="text-gray-300"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-red-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray={`${progress}, 100`}
                                            strokeLinecap="round"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                </div>

                                <ProductCard product={deal} isAboveFold={false} />

                                <div className="mt-3 space-y-2">
                                    <CountdownTimer endDate={endDate} />

                                </div>
                            </motion.div>
                        </SwiperSlide>
                    );
                })}
            </AnimatePresence>
        </Swiper>

        {/* ─── Navigation Buttons ─── */}
        <AnimatePresence>
            {showNav.prev && (
                <motion.div
                    ref={prevRef}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.div>
            )}
            {showNav.next && (
                <motion.div
                    ref={nextRef}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Autoplay Status Indicator */}
        <div className="fixed bottom-4 right-4 z-50">
            <motion.div
                className={`px-3 py-2 rounded-full text-xs font-medium ${isAutoplayPaused ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white`}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                {isAutoplayPaused ? '⏸️ Paused' : '▶️ Auto‑playing'}
            </motion.div>
        </div>
    </div>
);