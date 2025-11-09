// MediaGallerySkeleton.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import SkeletonComponent from './SkeletonComponent';

interface MediaGallerySkeletonProps {
    mediaCount?: number;
}

const MediaGallerySkeleton: React.FC<MediaGallerySkeletonProps> = ({ mediaCount = 2 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full"
        >
            <div className="hidden md:block">
                <div className="flex justify-between items-center mb-4">
                    <SkeletonComponent type="text" width="w-32" height="h-6" />
                    <SkeletonComponent type="text" width="w-24" height="h-6" />
                </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
                {Array.from({ length: mediaCount }).map((_, index) => (
                    <SkeletonComponent key={index} type="image" width="w-full" height="h-[600px]" />
                ))}
            </div>
            <div className="md:hidden relative w-full h-screen bg-black">
                <SkeletonComponent type="image" width="w-full" height="h-full" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
                    {Array.from({ length: mediaCount }).map((_, index) => (
                        <div key={index} className="w-3 h-3 rounded-full bg-gray-400" />
                    ))}
                </div>
                <div className="absolute top-4 left-4 z-50">
                    <SkeletonComponent type="text" width="w-24" height="h-6" />
                </div>
                <div className="absolute top-4 right-4 z-50">
                    <SkeletonComponent type="text" width="w-20" height="h-6" />
                </div>
            </div>
        </motion.div>
    );
};

export default MediaGallerySkeleton;