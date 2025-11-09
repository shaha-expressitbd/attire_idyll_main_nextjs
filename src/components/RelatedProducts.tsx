"use client";

import React, { useMemo, useEffect, useState, useRef } from "react";
import type { Product } from "@/types/product";
import ProductCard from "./ui/organisms/product-card";
import {
  buildGtmItem,
  trackViewRelatedItemList,
} from "@/utils/gtm";

interface RelatedProductsProps {
  currentProductId: string;
  subCategoryId: string;
  preloadedRelatedProducts: Product[];
}

export default function RelatedProducts({
  currentProductId,
  subCategoryId,
  preloadedRelatedProducts,
}: RelatedProductsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Filter related products to exclude the current product and match subCategoryId
  const related = useMemo(() => {
    return preloadedRelatedProducts.filter(
      (p: Product) =>
        p._id !== currentProductId &&
        p.sub_category.some((sc) => sc._id === subCategoryId)
    );
  }, [preloadedRelatedProducts, currentProductId, subCategoryId]);

  // Track related products for analytics
  useEffect(() => {
    console.log("Related Products Data:", { related, currentProductId, subCategoryId });
    if (related.length === 0) return;

    const productsForTracking = related.slice(0, 4).map((p: Product, idx) => {
      const firstVariant = p.variantsId?.[0];
      return buildGtmItem(
        p,
        firstVariant,
        1,
        "Related Products",
        subCategoryId,
        idx + 1
      );
    });

    trackViewRelatedItemList(productsForTracking, subCategoryId);
  }, [related, subCategoryId]);

  // Show placeholder until section is visible
  if (!isVisible) {
    return (
      <section ref={sectionRef}>
        <div className="py-2 text-3xl text-center mb-4">
          <div className="inline-flex gap-2 items-center">
            <p className="text-gray-500 dark:text-white">
              RELATED<span className="text-gray-700 dark:text-white font-medium">PRODUCTS</span>
            </p>
            <p className="w-8 sm:w-12 h-0.5 bg-gray-700 dark:bg-white"></p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-10 opacity-30">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (related.length === 0) return null;

  return (
    <section ref={sectionRef}>
      <div className="py-2 text-3xl text-center mb-4">
        <div className="inline-flex gap-2 items-center">
          <p className="text-gray-500 dark:text-white">
            RELATED<span className="text-gray-700 dark:text-white font-medium">PRODUCTS</span>
          </p>
          <p className="w-8 sm:w-12 h-0.5 bg-gray-700 dark:bg-white"></p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-10 animate-in fade-in duration-500">
        {related.slice(0, 4).map((product: Product, idx: number) => (
          <div key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}