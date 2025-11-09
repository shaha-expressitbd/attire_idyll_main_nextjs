'use client';
import React from 'react';
import { motion } from 'framer-motion';
import SkeletonComponent from './SkeletonComponent';

const QuantityControlsSkeleton: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex items-center gap-4 my-4"
        >
            <SkeletonComponent type="text" width="w-16" height="h-10" />
            <SkeletonComponent type="text" width="w-10" height="h-10" />
            <SkeletonComponent type="text" width="w-16" height="h-10" />
        </motion.div>
    );
};

export default QuantityControlsSkeleton;