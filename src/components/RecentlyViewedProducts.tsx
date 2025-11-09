"use client";

import React, { useMemo, useEffect, useState, useRef } from "react";
import type { Product } from "@/types/product";
import ProductCard from "./ui/organisms/product-card";
import { useSelector } from "react-redux";
import { selectRecentlyViewedItems } from "@/lib/features/recentlyViewedSlice";
import { LoadingSpinner } from "./ui/atoms/loading-spinner";
import {
    buildGtmItem,
    trackViewRelatedItemList,
} from "@/utils/gtm";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface RecentlyViewedProductsProps {
    currentProductId?: string;
}

export default function RecentlyViewedProducts({ currentProductId }: RecentlyViewedProductsProps) {
    const allViewedProducts = useSelector(selectRecentlyViewedItems);
    const viewedProducts = useMemo(
        () =>
            allViewedProducts.filter((product: Product) => product._id !== currentProductId),
        [allViewedProducts, currentProductId]
    );

    const [isVisible, setIsVisible] = useState(false);
    const [hasPrefetched, setHasPrefetched] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for prefetching
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasPrefetched) {
                    setHasPrefetched(true);
                    setIsVisible(true);
                }
            },
            {
                rootMargin: "200px",
                threshold: 0.1,
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasPrefetched]);

    // GTM Tracking
    useEffect(() => {
        if (viewedProducts.length === 0) return;

        const productsForTracking = viewedProducts.slice(0, 4).map((p: Product, idx) => {
            const firstVariant = p.variantsId?.[0];
            return buildGtmItem(p, firstVariant, 1, "Recently Viewed", "recently-viewed", idx + 1);
        });

        trackViewRelatedItemList(productsForTracking, "recently-viewed");
    }, [viewedProducts]);

    // Responsive slides per view based on device size
    const slidesPerView = {
        mobile: 1.2,
        sm: 2.2,
        md: 3.2,
        lg: 4.2,
    };

    // Hide component when there are no recently viewed products
    if (viewedProducts.length === 0) {
        return null;
    }

    // Enhanced placeholder with shimmer effect
    if (!isVisible) {
        return (
            <section ref={sectionRef} className="py-8 px-4">
                {/* Enhanced Header with Gradient */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 group">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-gray-600 dark:via-gray-400 dark:to-white transition-all duration-500 group-hover:w-12"></div>
                        <h2 className="text-2xl md:text-3xl font-light tracking-wider">
                            <span className="text-gray-500 dark:text-gray-300">RECENTLY</span>
                            <span className="text-gray-800 dark:text-white font-medium ml-1 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">VIEWED</span>
                        </h2>
                        <div className="w-8 h-0.5 bg-gradient-to-l from-transparent via-gray-400 to-gray-600 dark:via-gray-400 dark:to-white transition-all duration-500 group-hover:w-12"></div>
                    </div>
                </div>

                {/* Enhanced Skeleton with Shimmer */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl h-64 overflow-hidden shadow-md"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // Enhanced loading spinner
    if (!hasPrefetched) {
        return (
            <section ref={sectionRef} className="py-8 px-4">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-600 dark:to-white"></div>
                        <h2 className="text-2xl md:text-3xl font-light tracking-wider">
                            <span className="text-gray-500 dark:text-gray-300">RECENTLY</span>
                            <span className="text-gray-800 dark:text-white font-medium ml-1">VIEWED</span>
                        </h2>
                        <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-600 dark:to-white"></div>
                    </div>
                </div>
                <div className="flex justify-center items-center min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
                    <div className="flex flex-col items-center gap-4">
                        <LoadingSpinner size="lg" color="red" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading your recently viewed items...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="py-8 px-4">
            {/* Beautiful Enhanced Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-4 group">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-red-600 transition-all duration-700 group-hover:w-16 group-hover:via-red-500"></div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wider relative">
                        <span className="text-gray-500 dark:text-gray-300 transition-colors duration-300">RECENTLY</span>
                        <span className="text-gray-800 dark:text-white font-medium ml-2 relative">
                            VIEWED
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-700 group-hover:w-full"></div>
                        </span>
                    </h2>
                    <div className="w-8 h-0.5 bg-gradient-to-l from-transparent via-red-400 to-red-600 transition-all duration-700 group-hover:w-16 group-hover:via-red-500"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 opacity-0 animate-fade-in-up animation-delay-300">
                    Discover items you've recently explored
                </p>
            </div>

            {/* Enhanced Swiper Container */}
            <div className="relative group">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Enhanced Swiper Slider */}
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    spaceBetween={16}
                    slidesPerView={slidesPerView.mobile}
                    centeredSlides={false}
                    loop={viewedProducts.length > 4}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                        480: {
                            slidesPerView: slidesPerView.sm,
                            spaceBetween: 16,
                        },
                        768: {
                            slidesPerView: slidesPerView.md,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: slidesPerView.lg,
                            spaceBetween: 24,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 28,
                        },
                    }}
                    navigation={{
                        prevEl: '.custom-prev',
                        nextEl: '.custom-next',
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        renderBullet: (index, className) => {
                            return `<span class="${className} w-2 h-2 bg-red-400 rounded-full transition-all duration-300 hover:bg-red-600"></span>`;
                        },
                    }}
                    className="!pb-12 animate-fade-in-up animation-delay-500"
                    style={{
                        '--swiper-navigation-color': '#ef4444',
                        '--swiper-pagination-color': '#ef4444',
                    } as React.CSSProperties}
                >
                    {viewedProducts.map((product: Product, index) => (
                        <SwiperSlide key={product._id} className="group">


                            <ProductCard product={product} />


                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button className="custom-prev absolute left-2 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 group/btn opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 mx-auto transition-transform group-hover/btn:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button className="custom-next absolute right-2 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 group/btn opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 mx-auto transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

        </section>
    );
}