import React from "react";
import SkeletonComponent from "./SkeletonComponent";

const ProductCardSkeleton = () => {
  return (
    <div className="group relative py-2">
      <div className="relative rounded-2xl bg-tertiary dark:bg-gray-800 border border-gray-300 dark:border-gray-800 shadow-sm">
    
        {/* Product Image */}
        <div className="relative w-full aspect-[3/4] bg-tertiary overflow-hidden rounded-xl">
          <SkeletonComponent type="text" width="w-full" height="h-full" />
        </div>

        {/* Bottom Content */}
        <div className="p-3 sm:p-4 bg-pink-50/40">
          <SkeletonComponent type="text" width="w-3/4" height="h-5" />

          <div className="mt-3 flex items-center justify-between">
            <SkeletonComponent type="text" width="w-24" height="h-8" />
            <SkeletonComponent type="text" width="w-16" height="h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
