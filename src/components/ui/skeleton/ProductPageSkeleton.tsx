// ProductPageSkeleton.tsx
'use client';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ProductDetailSkeleton from './ProductDetailSkeleton';

const ProductPageSkeleton: React.FC = () => {
    return (
        <AnimatePresence>
            <ProductDetailSkeleton key="product-page-skeleton" />
        </AnimatePresence>
    );
};

export default ProductPageSkeleton;