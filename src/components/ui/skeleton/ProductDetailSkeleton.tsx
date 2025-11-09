// Optimized Skeleton Components with CSS transitions
// ProductDetailSkeleton.tsx
'use client';
import React from 'react';
import MediaGallerySkeleton from './MediaGallerySkeleton';
import QuantityControlsSkeleton from './QuantityControlsSkeleton';
import ProductTabsSkeleton from './ProductTabsSkeleton';
import ProductPricingSkeleton from './ProductPricingSkeleton';
import SkeletonComponent from './SkeletonComponent';

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto md:mt-10 md:pb-0 pb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex flex-row">
        <article className="relative grid grid-cols-1 lg:grid-cols-12 md:gap-10 items-start">
          <div className="lg:col-span-7">
            <MediaGallerySkeleton />
          </div>
          <div className="w-full px-2 md:px-4 lg:col-span-5">
            <SkeletonComponent type="text" width="w-full" height="h-10 md:h-12" className="mt-8" />
            <ProductPricingSkeleton />
            <div className="my-4">
              <SkeletonComponent type="text" width="w-full" height="h-10" />
            </div>
            <QuantityControlsSkeleton />
            <ProductTabsSkeleton />
          </div>
        </article>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t shadow-xl lg:hidden z-40">
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-2">
            <SkeletonComponent type="image" width="w-10" height="h-10" />
            <div>
              <SkeletonComponent type="text" width="w-20" height="h-6" />
              <SkeletonComponent type="text" width="w-16" height="h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SkeletonComponent type="text" width="w-24" height="h-8" />
            <SkeletonComponent type="text" width="w-8" height="h-8" />
            <SkeletonComponent type="text" width="w-8" height="h-8" />
          </div>
        </div>
      </div>
      <div className="py-4 md:py-8 md:pb-20">
        <SkeletonComponent type="text" width="w-32" height="h-8" className="mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonComponent key={index} type="card" width="w-full" height="h-64" />
          ))}
        </div>
      </div>
      <div className="w-full bg-black py-2">
        <SkeletonComponent type="text" width="w-32" height="h-6" className="mx-auto" />
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;