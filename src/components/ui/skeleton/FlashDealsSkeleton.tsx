// components/FlashDealsSkeleton.tsx
import React from 'react';
import SkeletonComponent from './SkeletonComponent';

export default function FlashDealsSkeleton() {
    return (
        <div className="py-4 space-y-6">
            <section className="group/section py-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 container mx-auto">
                    <div className="col-span-12 relative md:px-4 sm:px-0 px-2">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary dark:text-gray-100 capitalize flex items-center justify-between">
                            Flash Deals
                            {/* Custom Swiper Nav Buttons */}
                            <div className="flex gap-2 ml-4">
                                <div className="p-2 rounded-full bg-secondary dark:bg-primary shadow dark:hover:bg-green-100 hover:bg-green-50 transition opacity-50">
                                    <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                                <div className="p-2 rounded-full bg-secondary dark:bg-primary shadow hover:bg-green-50 dark:hover:bg-green-100 transition opacity-50">
                                    <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                                <div className="px-2 py-2 text-sm bg-secondary dark:bg-primary text-gray-700 rounded shadow hover:bg-green-50 dark:hover:bg-green-100 transition opacity-50">
                                    <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </h2>

                        <div className="mt-4">
                            {/* Skeleton mimicking Swiper carousel layout */}
                            <div className="relative overflow-hidden py-8">
                                <div className="flex gap-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex-shrink-0 w-[calc(100vw/2-16px)] sm:w-[calc(100vw/3-16px)] md:w-[calc(100vw/3-16px)] lg:w-[calc(100vw/4-16px)] xl:w-[calc(100vw/4-16px)] 2xl:w-[calc(100vw/4-16px)] min-w-0"
                                        >
                                            <div className="relative">
                                                {/* Flash deal timer skeleton */}
                                                <div className="flex absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 items-center justify-center z-10">
                                                    <div className="bg-white/90 dark:bg-secondary/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                                                        <div className="flex gap-1">
                                                            <div className="w-6 h-4 bg-gray-300 rounded animate-pulse"></div>
                                                            <div className="w-6 h-4 bg-gray-300 rounded animate-pulse"></div>
                                                            <div className="w-6 h-4 bg-gray-300 rounded animate-pulse"></div>
                                                            <div className="w-6 h-4 bg-gray-300 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Product card skeleton */}
                                                <div className="space-y-2">
                                                    <SkeletonComponent type="image" height="h-48 md:h-64" className="rounded-xl" />
                                                    <SkeletonComponent type="text" height="h-5" className="rounded-lg" />
                                                    <div className="flex justify-between items-center">
                                                        <SkeletonComponent type="text" width="w-16" height="h-6" className="rounded" />
                                                        <SkeletonComponent type="text" width="w-20" height="h-6" className="rounded" />
                                                    </div>
                                                    <SkeletonComponent type="text" height="h-8" className="rounded-lg" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Placeholder for nav buttons space */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 -ml-2 sm:-ml-2 md:-ml-4 opacity-0" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 -mr-2 sm:-mr-2 md:-mr-4 opacity-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}