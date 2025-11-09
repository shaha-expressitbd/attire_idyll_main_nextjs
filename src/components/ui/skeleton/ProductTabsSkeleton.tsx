'use client';
import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const ProductTabsSkeleton: React.FC = () => {
    return (
        <div className="mt-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <div className="flex gap-4 mb-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonComponent key={index} type="text" width="w-24" height="h-8" />
                ))}
            </div>
            <SkeletonComponent type="text" width="w-full" height="h-32" />
        </div>
    );
};

export default ProductTabsSkeleton;