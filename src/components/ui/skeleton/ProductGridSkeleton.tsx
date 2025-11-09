import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 max-[345px]:grid-cols-1 max-[1030px]:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Product Image Skeleton */}
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
                        <SkeletonComponent
                            type="image"
                            width="w-full"
                            height="h-full"
                            className="rounded-none"
                        />
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="p-4 space-y-3">
                        {/* Title */}
                        <SkeletonComponent
                            type="text"
                            width="w-full"
                            height="h-4"
                            className="rounded"
                        />

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <SkeletonComponent
                                type="text"
                                width="w-16"
                                height="h-5"
                                className="rounded"
                            />
                            <SkeletonComponent
                                type="text"
                                width="w-12"
                                height="h-4"
                                className="rounded"
                            />
                        </div>

                        {/* Rating/Reviews */}
                        <div className="flex items-center gap-2">
                            <SkeletonComponent
                                type="text"
                                width="w-20"
                                height="h-3"
                                className="rounded"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGridSkeleton;