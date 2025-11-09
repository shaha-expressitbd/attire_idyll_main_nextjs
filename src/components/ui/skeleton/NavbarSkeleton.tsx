import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const NavbarSkeleton: React.FC = () => {
    return (
        <div className="w-full h-16 bg-secondary dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 py-3">
            {/* Left: Menu + Search skeleton */}
            <div className="flex items-center gap-6 text-sm font-semibold ml-16">
                <div className="flex items-center gap-1 cursor-pointer text-black dark:text-white">
                    <SkeletonComponent
                        type="text"
                        width="w-12"
                        height="h-4"
                        className="rounded"
                    />
                </div>
                <div className="flex items-center gap-1 cursor-pointer">
                    <SkeletonComponent
                        type="text"
                        width="w-16"
                        height="h-4"
                        className="rounded"
                    />
                </div>
            </div>

            {/* Center: Logo skeleton */}
            <div>
                <SkeletonComponent
                    type="text"
                    width="w-32"
                    height="h-8"
                    className="rounded"
                />
            </div>

            {/* Right: Shop + Cart + Wishlist skeleton */}
            <div className="flex items-center gap-6 text-sm font-semibold">
                <SkeletonComponent
                    type="text"
                    width="w-12"
                    height="h-4"
                    className="rounded"
                />
                <SkeletonComponent
                    type="text"
                    width="w-6"
                    height="h-6"
                    className="rounded-full"
                />
                <SkeletonComponent
                    type="text"
                    width="w-6"
                    height="h-6"
                    className="rounded-full"
                />
                <SkeletonComponent
                    type="text"
                    width="w-6"
                    height="h-6"
                    className="rounded-full"
                />
            </div>
        </div>
    );
};

export default NavbarSkeleton;