import React from "react";
import { ProductContent } from "./ProductContent";
import MediaGallery from "../../_component/MediaGallery";
import type { Product, Variant } from "@/types/product";
import type { MediaItem } from "@/hooks/useProductMedia";

interface ProductLayoutProps {
    product: Product;
    selectedVariant: Variant | null;
    quantity: number;
    stock: number;
    finalPrice: number;
    sellingPrice: number;
    discountPercent: number;
    discountStartDate?: Date;
    discountEndDate?: Date;
    isPreOrder: boolean;
    isDiscountActive: boolean;
    activeTab: string;
    allMedia: MediaItem[];
    selectedMediaUrl?: string;
    onQuantityChange: (val: number) => void;
    onAddToCart: () => boolean;
    onVariantMissing: () => void;
    onWishlistVariantMissing: () => void;
    setActiveTab: (tab: string | ((prevState: string) => string)) => void;
}

export function ProductLayout({
    product,
    selectedVariant,
    quantity,
    stock,
    finalPrice,
    sellingPrice,
    discountPercent,
    discountStartDate,
    discountEndDate,
    isPreOrder,
    isDiscountActive,
    activeTab,
    allMedia,
    selectedMediaUrl,
    onQuantityChange,
    onAddToCart,
    onVariantMissing,
    onWishlistVariantMissing,
    setActiveTab,
}: ProductLayoutProps) {
    return (
        <div className="container max-w-7xl mx-auto md:mt-16 md:pb-0 pb-16">
            <div className="flex flex-row">
                <article className="relative grid grid-cols-1 lg:grid-cols-12 md:gap-10 items-start w-full">
                    <div className={`lg:col-span-7 ${allMedia.length >= 4 ? "" : "lg:sticky md:top-24 md:self-start md:h-fit"}`}>
                        <MediaGallery
                            media={allMedia}
                            productName={product.name}
                            stock={stock}
                            selectedMediaUrl={selectedMediaUrl}
                        />
                    </div>

                    <ProductContent
                        product={product}
                        selectedVariant={selectedVariant}
                        quantity={quantity}
                        stock={stock}
                        finalPrice={finalPrice}
                        sellingPrice={sellingPrice}
                        discountPercent={discountPercent}
                        discountStartDate={discountStartDate}
                        discountEndDate={discountEndDate}
                        isPreOrder={isPreOrder}
                        isDiscountActive={isDiscountActive}
                        activeTab={activeTab}
                        onQuantityChange={onQuantityChange}
                        onAddToCart={onAddToCart}
                        onVariantMissing={onVariantMissing}
                        onWishlistVariantMissing={onWishlistVariantMissing}
                        setActiveTab={setActiveTab}
                        allMedia={allMedia}
                    />

                </article>
            </div>
        </div>
    );
}