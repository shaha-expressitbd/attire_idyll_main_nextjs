"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiX, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { Product } from "@/types/product";
import { Button } from "../atoms/button";

interface QuickViewModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    isPreorder?: boolean;
}

export default function QuickViewModal({
    product,
    isOpen,
    onClose,
    isPreorder = false,
}: QuickViewModalProps) {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    // Get all product images
    const images = useMemo(() => {
        const variantImages = product.hasVariants
            ? product.variantsId?.flatMap(v => v.image ? [v.image] : []) || []
            : [];

        const productImages = product.images || [];

        // Combine and remove duplicates
        const allImages = [...productImages, ...variantImages];
        return allImages.filter((img, index, self) =>
            img && self.findIndex(i => i._id === img._id) === index
        );
    }, [product]);

    // Calculate pricing
    const { displayPrice, originalPrice, isOffer } = useMemo(() => {
        const variant = product.variantsId?.find(v => v.variants_stock > 0) ?? product.variantsId?.[0];
        const sell = variant ? Number(variant.selling_price) : Number(product.selling_price);
        const finalPrice = variant?.finalPrice ? Number(variant.finalPrice) : sell;

        return {
            displayPrice: finalPrice,
            originalPrice: finalPrice < sell ? sell : null,
            isOffer: finalPrice < sell,
        };
    }, [product]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        const isLeftSwipe = distanceX > 50;
        const isRightSwipe = distanceX < -50;
        const isDownSwipe = distanceY > 50;

        if (isZoomed && isDownSwipe) {
            setIsZoomed(false);
        } else if (!isZoomed) {
            if (isLeftSwipe) nextImage();
            if (isRightSwipe) prevImage();
        }
    };

    const handleImageClick = (e: React.MouseEvent) => {
        if (isZoomed) {
            setIsZoomed(false);
        } else {
            const rect = imageRef.current?.getBoundingClientRect();
            if (rect) {
                setZoomPosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100
                });
                setIsZoomed(true);
            }
        }
    };

    const handleViewDetails = () => {
        const slugify = (name: string) =>
            name
                .toLowerCase()
                .replace(/[অ-হ]/g, (c) => {
                    const m: Record<string, string> = {
                        অ: "o", আ: "a", ই: "i", ঈ: "i", উ: "u", ঊ: "u", ঋ: "ri",
                        এ: "e", ঐ: "oi", ও: "o", ঔ: "ou", ক: "k", খ: "kh", গ: "g", ঘ: "gh",
                    };
                    return m[c] || c;
                })
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .replace(/--+/g, "-")
                .replace(/^-+|-+$/g, "");

        const productLink = `/product/${slugify(product.name)}?id=${product._id}`;
        router.push(productLink);
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setIsZoomed(false);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100000] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-modal-title"
        >
            {/* Main content container */}
            <div className="relative z-[100001] w-full max-w-6xl mx-auto bg-white dark:bg-secondary rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh]" style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Close button - inside modal */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Close modal"
                >
                    <FiX className="w-6 h-6" />
                </button>

                {/* Mobile layout - stacked */}
                <div className="md:hidden">
                    {/* Mobile header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                            {product.name}
                        </h2>
                        {!isPreorder && (
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-xl font-bold text-primary">
                                    {"৳"}{displayPrice.toFixed(2)}
                                </span>
                                {isOffer && originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {"৳"}{originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile image section */}
                    <div className="relative aspect-square bg-gray-100 dark:bg-secondary">
                        <div
                            ref={imageRef}
                            className="relative w-full h-full cursor-zoom-in overflow-hidden"
                            onClick={handleImageClick}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Image
                                src={images[currentImageIndex]?.alterImage?.secure_url || images[currentImageIndex]?.image?.secure_url || product.images?.[0]?.alterImage?.secure_url || product.images?.[0]?.image?.secure_url || "/assets/fallback.jpg"}
                                alt={product.name}
                                fill
                                className={`object-cover transition-transform duration-300 ${isZoomed ? "scale-200" : "scale-100"
                                    }`}

                                sizes="100vw"
                            />


                        </div>

                        {/* Mobile navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-secondary/90 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-secondary/90 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <FiChevronRight className="w-5 h-5" />
                                </button>

                                {/* Image counter */}
                                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile content */}
                    <div className="p-4 space-y-4">
                        {product.short_description && (
                            <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
                                <span className="text-sm md:text-lg">Description:</span>
                                <div
                                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${product.total_stock > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : product.total_stock > 0
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}>
                                {product.total_stock > 10
                                    ? "In Stock"
                                    : product.total_stock > 0
                                        ? "Low Stock"
                                        : "Out of Stock"
                                }
                            </span>
                        </div>

                        <Button
                            onClick={handleViewDetails}
                            title="View Full Product Details"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            View Full Details
                        </Button>
                    </div>
                </div>

                {/* Desktop layout - side by side */}
                <div className="hidden md:flex h-full max-h-[90vh]">
                    {/* Desktop image section */}
                    <div className="relative w-1/2 bg-gray-100 dark:bg-secondary">
                        <div
                            ref={imageRef}
                            className="relative w-full h-full cursor-zoom-in overflow-hidden"
                            onClick={handleImageClick}
                        >
                            <Image
                                src={images[currentImageIndex]?.alterImage?.secure_url || images[currentImageIndex]?.image?.secure_url || product.images?.[0]?.alterImage?.secure_url || product.images?.[0]?.image?.secure_url || "/assets/fallback.jpg"}
                                alt={product.name}
                                fill
                                className={`object-cover transition-transform duration-300 ${isZoomed ? "scale-200" : "scale-100"
                                    }`}
                                style={isZoomed ? {
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                } : undefined}
                                sizes="50vw"
                            />

                        </div>

                        {/* Desktop navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white dark:bg-secondary/90 dark:hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg transition-colors"
                                >
                                    <FiChevronLeft className="w-6 h-6 text-black dark:text-white" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white dark:bg-secondary/90 dark:hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg transition-colors"
                                >
                                    <FiChevronRight className="w-6 h-6  text-black dark:text-white" />
                                </button>

                                {/* Image counter */}
                                <div className="absolute top-6 right-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    {currentImageIndex + 1} of {images.length}
                                </div>
                            </>
                        )}

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <div className="flex justify-center space-x-3">
                                    {images.map((image, index) => (
                                        <button
                                            key={image._id}
                                            onClick={(e) => { e.stopPropagation(); goToImage(index); }}
                                            className={`relative w-16 h-16 rounded-lg overflow-hidden border-3 transition-all duration-200 ${index === currentImageIndex
                                                ? "border-white scale-110 shadow-lg"
                                                : "border-white/30 hover:border-white/60 hover:scale-105"
                                                }`}
                                        >
                                            <Image
                                                src={image.alterImage?.secure_url || image.image?.secure_url || "/assets/fallback.jpg"}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop content section */}
                    <div className="flex-1 p-8 flex flex-col bg-white dark:bg-secondary">
                        {/* Product header */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                {product.name}
                            </h1>

                            {!isPreorder && (
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-3xl font-bold text-primary">
                                        {product.currency || "৳"}{displayPrice.toFixed(2)}
                                    </span>
                                    {isOffer && originalPrice && (
                                        <span className="text-xl text-gray-500 line-through">
                                            {product.currency || "৳"}{originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                    {isOffer && (
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            SAVE {originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0}%
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-4">
                                <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full ${product.total_stock > 10
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : product.total_stock > 0
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }`}>
                                    {product.total_stock > 10
                                        ? `${product.total_stock} Available`
                                        : product.total_stock > 0
                                            ? `Only ${product.total_stock} Left`
                                            : "Out of Stock"
                                    }
                                </span>
                            </div>
                        </div>

                        {/* Product description */}
                        {product.short_description && (
                            <div className="flex-1 mb-6">
                                <div className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="text-sm md:text-lg">Description:</span>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: product.short_description }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleViewDetails}
                                title="View Full Product Details"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                                View Full Details
                            </Button>

                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Press ← → to navigate • ESC to close
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}