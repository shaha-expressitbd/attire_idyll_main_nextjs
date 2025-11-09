import React from 'react';
import { motion } from 'framer-motion';
import SkeletonComponent from "./SkeletonComponent";

const PromotionBannerSkeleton: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="bg-[#f7c4cb] dark:bg-black px-4 md:px-8 py-8 md:py-10 xl:p-20 mt-0 mb-0"
        >
            <div className="mySwiper w-full">
                <div className="bg-[#FFEBF0] dark:bg-gray-600 rounded-3xl w-full relative overflow-hidden md:mt-12 lg:-mt-4 xl:-mt-16">
                    <div className="grid grid-cols-12">
                        {/* Left Side: Text Content */}
                        <div className="flex flex-col justify-center items-center text-center sm:text-left px-4 col-span-7">
                            <div className="md:hidden block w-32 ml-4 mt-4">
                                <SkeletonComponent type="image" width="w-32" height="h-10" />
                            </div>
                            <div className="space-y-4 pt-5 md:pt-2 lg:ml-16">
                                <div className="ml-16 lg:ml-72">
                                    <SkeletonComponent type="text" width="w-40 lg:w-64" height="h-10 lg:h-16" />
                                    <SkeletonComponent type="text" width="w-32 lg:w-48" height="h-10 lg:h-16" />
                                </div>
                                <div className="space-y-2">
                                    <SkeletonComponent type="text" width="w-3/4" height="h-4 md:h-5" />
                                    <SkeletonComponent type="text" width="w-2/3" height="h-4 md:h-5" />
                                    <SkeletonComponent type="text" width="w-1/2" height="h-4 md:h-5" />
                                </div>
                                <div className="mt-2 mb-4 mobile-lg:mb-8 xl:ml-32 xl:mt-8">
                                    <SkeletonComponent type="text" width="w-28 md:w-32" height="h-10 md:h-12" />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Image */}
                        <div className="flex justify-center sm:justify-end px-4 lg:px-32 col-span-5 md:mt-16 mobile-xs:mt-8">
                            <SkeletonComponent type="image" width="w-[450px]" height="h-[600px]" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PromotionBannerSkeleton;