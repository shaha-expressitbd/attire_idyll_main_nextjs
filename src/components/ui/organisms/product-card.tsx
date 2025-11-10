// src/components/ui/organisms/product-card.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import type { TPreorderCartItem } from "@/lib/features/preOrderCartSlice/preOrderCartSlice";
import VariantSelectModal from "@/app/(public)/product/_component/VariantSelectModal";
import QuickViewModal from "../molecules/QuickViewModal";

// Import all 4 utility functions (ager moto)
import {
  calculateProductPricing,
  getProductStock,
  isProductPreOrder,
  generateProductLink,
} from "@/utils/productUtils";
import Image from "../atoms/image";

interface ProductCardProps {
  product: Product;
  isAboveFold?: boolean;
}

export default function ProductCard({
  product,
  isAboveFold = false,
}: ProductCardProps) {
  const router = useRouter();
  const { addItem: addCartItem, openCart, items: cartItems } = useCart();
  const { addItem: addPreorderItem, item: preorderItem, clearCart: clearPreorderCart } = usePreorderCart();
  const {
    items: wishlistItems,
    addItem: addWishlistItem,
    removeItem: removeWishlistItem,
    openWishlist,
  } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"cart" | "wishlist" | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  // Use utility functions (ager moto)
  const variant = useMemo(() =>
    product.variantsId?.find((v) => v.variants_stock > 0) ??
    product.variantsId?.[0] ??
    null,
    [product.variantsId]
  );

  const pricingData = useMemo(() => calculateProductPricing(variant, product), [variant, product]);
  const productLink = useMemo(() => generateProductLink(product), [product]);
  const isOutOfStock = useMemo(() => getProductStock(variant, product) <= 0 || !product.isPublish, [variant, product]);
  const isPreOrder = useMemo(() => isProductPreOrder(variant, product), [variant, product]);

  // Use finalPrice directly from utility
  const displayPrice = pricingData.finalPrice;
  const discountPercent = pricingData.discountPercent;

  // Wishlist check
  useEffect(() => {
    if (variant) {
      const hasVariants = product.hasVariants && product.variantsId.length > 0;
      const wishlistedId = hasVariants ? variant._id : product.variantsId[0]._id;
      setIsWishlisted(wishlistItems.some((item) => item._id === wishlistedId));
    }
  }, [wishlistItems, variant, product]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add to Cart / Preorder
  const addVariantToCart = (selectedVariant: any, quantity: number = 1, finalPrice?: number) => {
    if (isPreOrder) {
      if (cartItems.length > 0) {
        toast.error("আপানার রেগুলার কার্টে প্রোডাক্ট আছে। প্রি-অর্ডার করতে হলে রেগুলার কার্ট ক্লিয়ার করুন।", {
          description: "চেকআউট পেজে গিয়ে রেগুলার কার্ট ক্লিয়ার করুন।",
          duration: 5000,
        });
        return;
      }

      const preOrderItem: TPreorderCartItem = {
        _id: selectedVariant._id,
        name: product.name,
        price: finalPrice ?? displayPrice,
        image: selectedVariant.image?.alterImage?.secure_url ?? product.images[0]?.alterImage?.secure_url ?? "/assets/fallback.jpg",
        quantity,
        maxStock: selectedVariant.variants_stock ?? product.total_stock,
        variantValues: selectedVariant.variants_values ?? [],
        variantGroups: product.variantsGroup ?? [],
        variantId: selectedVariant._id,
        isPreOrder: true,
        currency: product.currency || "BDT",
      };
      addPreorderItem(preOrderItem);
      toast.success("Pre-order item added to cart!");
    } else {
      if (preorderItem) {
        toast.error("আপনার চেকআউটে ইতিমধ্যে একটা প্রি-অর্ডার প্রোডাক্ট আছে!", {
          description: "চেকআউট ক্লিয়ার করে রেগুলার প্রোডাক্ট যোগ করতে চান?",
          duration: 10000,
          action: {
            label: "চেকআউট ক্লিয়ার করুন",
            onClick: () => {
              clearPreorderCart();
              toast.success("চেকআউট ক্লিয়ার হয়েছে!", {
                description: "এখন আপনি রেগুলার প্রোডাক্ট কার্টে যোগ করতে পারবেন",
                duration: 5000,
              });
            },
          },
        });
        return;
      }

      const hasVariants = product.hasVariants && product.variantsId.length > 0;
      const cartId = hasVariants ? selectedVariant._id : product.variantsId[0]._id;
      const cartVariantId = hasVariants ? selectedVariant._id : undefined;

      const cartItem = {
        _id: cartId,
        variantId: cartVariantId,
        name: product.name,
        price: finalPrice ?? displayPrice,
        image: selectedVariant.image?.alterImage?.secure_url || product.images?.[0]?.alterImage?.secure_url,
        quantity,
        maxStock: selectedVariant.variants_stock || product.total_stock,
        variantValues: selectedVariant.variants_values ?? [],
        variantGroups: product.variantsGroup ?? [],
        sellingPrice: selectedVariant.selling_price ? Number(selectedVariant.selling_price) : pricingData.sellingPrice,
        currency: product.currency || "BDT",
        isDiscountActive: selectedVariant.isDiscountActive ?? pricingData.isDiscountActive ?? false,
        ...(selectedVariant.variants_values?.length > 0 && {
          variantLabel: selectedVariant.variants_values.join(" / "),
        }),
      };
      addCartItem(cartItem);
      openCart();
      toast.success("কার্টে যোগ করা হয়েছে!");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || !variant) {
      toast.error("Out of stock");
      return;
    }

    if (product.hasVariants) {
      setModalAction("cart");
      setIsModalOpen(true);
      return;
    }

    addVariantToCart(variant);
  };

  const handleVariantSelect = (selectedVariant: any, quantity: number, finalPrice?: number) => {
    if (modalAction === "cart") {
      addVariantToCart(selectedVariant, quantity, finalPrice);
    } else if (modalAction === "wishlist") {
      const hasVariants = product.hasVariants && product.variantsId.length > 0;
      const wishlistId = hasVariants ? selectedVariant._id : product.variantsId[0]._id;
      const wishlistVariantId = hasVariants ? selectedVariant._id : undefined;

      const isAlreadyWishlisted = wishlistItems.some((item) => item._id === wishlistId);

      if (isAlreadyWishlisted) {
        removeWishlistItem(wishlistId);
        toast.success("Removed from wishlist!");
      } else {
        const wishlistItem = {
          _id: wishlistId,
          productId: product._id,
          variantId: wishlistVariantId,
          name: product.name,
          price: finalPrice ?? displayPrice,
          sellingPrice: selectedVariant.selling_price ? Number(selectedVariant.selling_price) : pricingData.sellingPrice,
          isDiscountActive: selectedVariant.isDiscountActive ?? pricingData.isDiscountActive ?? false,
          currency: product.currency || "BDT",
          image: selectedVariant.image?.alterImage?.secure_url || product.images?.[0]?.alterImage?.secure_url,
          variantValues: selectedVariant.variants_values ?? [],
          variantGroups: product.variantsGroup ?? [],
        };
        addWishlistItem(wishlistItem);
        toast.success("Added to wishlist!");
      }
      openWishlist();
    }

    setIsModalOpen(false);
    setModalAction(null);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPreOrder) {
      toast.error("Pre-order items cannot be added to wishlist");
      return;
    }

    if (!variant) {
      toast.error("Unavailable");
      return;
    }

    if (product.hasVariants) {
      setModalAction("wishlist");
      setIsModalOpen(true);
      return;
    }

    const hasVariants = product.hasVariants && product.variantsId.length > 0;
    const wishlistedId = hasVariants ? variant._id : product.variantsId[0]._id;

    if (isWishlisted) {
      removeWishlistItem(wishlistedId);
      toast.success("Removed from wishlist!");
    } else {
      const wishlistId = hasVariants ? variant._id : product.variantsId[0]._id;
      const wishlistVariantId = hasVariants ? variant._id : undefined;

      const wishlistItem = {
        _id: wishlistId,
        productId: product._id,
        variantId: wishlistVariantId,
        name: product.name,
        price: displayPrice,
        sellingPrice: pricingData.sellingPrice,
        isDiscountActive: pricingData.isDiscountActive ?? false,
        currency: product.currency || "BDT",
        image: variant.image?.alterImage?.secure_url || product.images?.[0]?.alterImage?.secure_url,
        variantValues: variant.variants_values ?? [],
        variantGroups: product.variantsGroup ?? [],
      };

      addWishlistItem(wishlistItem);
      toast.success("Added to wishlist!");
    }
    openWishlist();
  };

  // Image URL
  const img = product.images?.[0]?.alterImage?.secure_url ||
    product.images?.[0]?.image?.secure_url ||
    "/assets/fallback.jpg";

  return (
    <div
      className="group relative py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={productLink}
        className="block relative"
        aria-label={`View ${product.name} details`}
        prefetch={false}
      >
        <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-black shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              -{discountPercent}%
            </span>
          )}

          {/* Product Image */}
          <div className="relative w-full aspect-[3/5] sm:aspect-[3/4] bg-pink-50 dark:bg-black overflow-hidden rounded-xl">
            {isImageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Image not available</span>
              </div>
            ) : (
              <Image
                src={img}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading={isAboveFold && !isMobile ? "eager" : "lazy"}
                priority={isAboveFold && !isMobile}
                className={`transition-transform duration-500 ${isHovered ? "scale-[1.3] rotate-1" : "scale-100"}`}
                onError={() => setIsImageError(true)}
                objectFit="cover"
              />
            )}

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute top-2 right-2 p-2 rounded-full border ${isWishlisted
                ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-500"
                : "border-pink-200 bg-white dark:bg-gray-700 text-primary"
                } hover:shadow-md z-10 transition-colors ${isPreOrder ? "cursor-not-allowed opacity-50" : ""}`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              disabled={isPreOrder}
            >
              <FiHeart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4 bg-pink-50/40 dark:bg-black">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white line-clamp-1">
              {product.name}
            </h3>
            <div className="flex justify-between items-baseline">
              <span className="md:text-xl text-[14px] font-semibold text-primary">
                ৳{displayPrice}
              </span>
              {discountPercent > 0 && (
                <span className="line-through text-gray-400 md:text-xl">
                  ৳{pricingData.sellingPrice}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between md:flex-col lg:flex-row gap-2 px-1 py-1 w-full">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`inline-block text-white font-bold rounded-lg text-xs md:text-sm lg:text-lg p-1 md:p-1.5 hover:shadow-md disabled:opacity-60 text-nowrap w-full ${isPreOrder
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-primary dark:bg-primary"
                }`}
            >
              {isPreOrder ? "প্রি-অর্ডার করুন" : "অর্ডার করুন"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="inline-block text-primary border border-primary text-xs md:text-sm lg:text-lg p-1 md:p-1.5 font-bold rounded-lg hover:bg-primary hover:text-white transition-colors text-nowrap w-full"
            >
              Quick View
            </button>
          </div>
        </div>
      </Link>

      {/* Variant Modal */}
      {product.variantsId && (
        <VariantSelectModal
          isOpen={isModalOpen}
          variants={product.variantsId}
          onSelect={handleVariantSelect}
          onClose={() => {
            setIsModalOpen(false);
            setModalAction(null);
          }}
          product={product}
          isWishlistModal={modalAction === "wishlist"}
          variantsGroup={product.variantsGroup}
        />
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}