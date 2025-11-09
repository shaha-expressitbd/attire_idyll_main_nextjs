// Simple loading skeleton for progressive loading
import React from 'react';

interface SimpleLoadingSkeletonProps {
    className?: string;
    height?: string;
}

export default function SimpleLoadingSkeleton({ className = '', height = 'h-4' }: SimpleLoadingSkeletonProps) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${height} ${className}`}></div>
    );
}

// Product card skeleton
export function ProductSkeleton() {
    return (
        <div className="border rounded-lg p-4 space-y-3">
            <SimpleLoadingSkeleton className="w-full" height="h-48" />
            <SimpleLoadingSkeleton className="w-3/4" height="h-4" />
            <SimpleLoadingSkeleton className="w-1/2" height="h-4" />
            <SimpleLoadingSkeleton className="w-1/4" height="h-6" />
        </div>
    );
}

// Products grid skeleton
export function ProductsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}