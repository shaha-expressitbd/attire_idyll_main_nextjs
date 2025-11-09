'use client';
import React from 'react';
import { motion } from 'framer-motion';
import SkeletonComponent from './SkeletonComponent';

const ProductPricingSkeleton: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="my-4"
        >
            <SkeletonComponent type="text" width="w-32" height="h-8" />
            <SkeletonComponent type="text" width="w-24" height="h-6" className="mt-2" />
        </motion.div>
    );
};

export default ProductPricingSkeleton;