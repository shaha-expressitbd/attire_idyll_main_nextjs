import React from 'react';
import SkeletonComponent from '@/components/ui/skeleton/SkeletonComponent';

const FullPageSkeleton = () => {
    return (
        <div className="w-full min-h-screen bg-gray-100">
            <div className="container max-w-7xl mx-auto md:mt-10 md:pb-0 pb-16">
                <div className="flex flex-row">
                    <article className="relative grid grid-cols-1 lg:grid-cols-12 md:gap-10 items-start">
                        {/* Media Gallery Section (7/12 width) */}
                        <div className="lg:col-span-7 px-2 md:px-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SkeletonComponent type="image" width="w-full" height="md:h-[600px] h-[400px]" />
                                <SkeletonComponent type="video" width="w-full" height="md:h-[600px] h-[400px]" />
                            </div>
                        </div>

                        {/* Product Details Section (5/12 width) */}
                        <div className="w-full px-2 md:px-4 lg:col-span-5">
                            {/* Product Title */}
                            <SkeletonComponent type="text" width="w-3/4" height="h-10" />

                            {/* Product Pricing */}
                            <div className="space-y-3 md:space-y-4 mt-2 sm:mb-2">
                                <div className="flex flex-row items-center gap-1 md:gap-2 flex-wrap">
                                    <SkeletonComponent type="text" width="w-1/4" height="h-6" />
                                    <SkeletonComponent type="text" width="w-1/4" height="h-6" />
                                    <SkeletonComponent type="text" width="w-1/4" height="h-6" />
                                </div>
                                <div className="bg-gray-100 rounded-xl p-2 md:p-6 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2 md:mb-4">
                                        <SkeletonComponent type="text" width="w-1/3" height="h-8" />
                                        <SkeletonComponent type="text" width="w-1/4" height="h-6" />
                                    </div>
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <SkeletonComponent type="text" width="w-1/4" height="h-6" />
                                        <SkeletonComponent type="text" width="w-1/4" height="h-6" />
                                    </div>
                                    <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
                                        <SkeletonComponent type="text" width="w-1/2" height="h-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Variant Select */}
                            <div className="my-4 hidden md:block">
                                <SkeletonComponent type="text" width="w-full" height="h-10" />
                            </div>

                            {/* Quantity Controls */}
                            <div className="md:pb-2 hidden md:flex items-center justify-between gap-4">
                                <SkeletonComponent type="text" width="w-1/4" height="h-8" />
                                <SkeletonComponent type="text" width="w-1/3" height="h-8" />
                                <SkeletonComponent type="text" width="w-1/6" height="h-8" />
                                <SkeletonComponent type="text" width="w-1/6" height="h-8" />
                            </div>

                            {/* Product Tabs */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex border-b border-gray-200 bg-gray-50">
                                    <SkeletonComponent type="text" width="w-1/4" height="h-10" />
                                    <SkeletonComponent type="text" width="w-1/4" height="h-10" />
                                    <SkeletonComponent type="text" width="w-1/4" height="h-10" />
                                    <SkeletonComponent type="text" width="w-1/4" height="h-10" />
                                </div>
                                <div className="p-4 md:p-6">
                                    <SkeletonComponent type="text" width="w-full" height="h-4" />
                                    <SkeletonComponent type="text" width="w-3/4" height="h-4" />
                                    <SkeletonComponent type="text" width="w-1/2" height="h-4" />
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Mobile Sticky Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t shadow-xl lg:hidden z-40">
                    <div className="flex items-center justify-between p-1">
                        <div className="flex items-center gap-2">
                            <SkeletonComponent type="image" width="w-10" height="h-10" />
                            <div>
                                <SkeletonComponent type="text" width="w-20" height="h-5" />
                                <SkeletonComponent type="text" width="w-16" height="h-4" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <SkeletonComponent type="text" width="w-20" height="h-8" />
                            <SkeletonComponent type="text" width="w-8" height="h-8" />
                            <SkeletonComponent type="text" width="w-12" height="h-8" />
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="py-4 md:py-8 md:pb-20">
                    <SkeletonComponent type="text" width="w-1/3" height="h-8" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <SkeletonComponent type="card" width="w-full" height="h-64" />
                        <SkeletonComponent type="card" width="w-full" height="h-64" />
                        <SkeletonComponent type="card" width="w-full" height="h-64" />
                        <SkeletonComponent type="card" width="w-full" height="h-64" />
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full bg-black py-2">
                    <div className="flex justify-center">
                        <SkeletonComponent type="text" width="w-1/3" height="h-6" />
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default FullPageSkeleton;