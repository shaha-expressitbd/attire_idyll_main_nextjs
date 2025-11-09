"use client";

import { useCallback } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import type { Product, Variant } from "@/types/product";
import { useWishlist } from "@/hooks/useWishlist";

interface Props {
    item: Product;
    variant?: Variant | null;
    requireVariant?: boolean;
    size?: "sm" | "md" | "icon";
    className?: string;
    labelOn?: string;
    labelOff?: string;
    onVariantMissing?: () => void;
}

export default function AddToWishlistBtn({
    item,
    variant = null,
    requireVariant = false,
    size = "sm",
    className,
    labelOn = "Wishlisted",
    labelOff = "Wishlist",
    onVariantMissing,
}: Props) {
    const { items, addItem, removeItem } = useWishlist();

    /* ENHANCED CONSISTENCY: Always use variant-level IDs for proper merging */
    const hasVariants = item.hasVariants && item.variantsId.length > 0;
    const uniqueId = variant && hasVariants ? variant._id : item.variantsId[0]._id;

    const isWishlisted = items.some((i) => i._id === uniqueId);

    /* Check if pre-order */
    const isPreOrder =
        item.isPreOrder ||
        (hasVariants ? (variant?.isPreOrder ?? false) : (item.variantsId?.[0]?.isPreOrder ?? false));

    /* ---------------- handler ---------------- */
    const handleClick = useCallback(() => {
        if (requireVariant && !variant) {
            toast.error("Please select a variant first");
            onVariantMissing?.();
            return;
        }

        if (isPreOrder) {
            toast.error("Pre-order items cannot be added to wishlist");
            return;
        }

        const outOfStock =
            variant ? variant.variants_stock <= 0 : item.total_stock <= 0;

        if (outOfStock) {
            toast.error("Out of stock");
            return;
        }

        /* remove */
        if (isWishlisted) {
            removeItem(uniqueId);
            toast.success("Removed from wishlist");
            return;
        }

        /* add */
        const selectedV = variant ?? item.variantsId?.[0]; // Fallback to first variant if no variant
        // Trust backend finalPrice if discount is active, otherwise use offerPrice or sellingPrice
        const price = selectedV?.isDiscountActive === true && selectedV?.finalPrice
            ? Number(selectedV.finalPrice)
            : Number(selectedV?.offer_price ?? selectedV?.selling_price ?? item.selling_price ?? 0);

        const sellingPrice = Number(selectedV?.selling_price ?? item.selling_price ?? 0);
        const isDiscountActive = selectedV?.isDiscountActive ?? false;

        addItem({
            _id: uniqueId, // Always use variant ID for variant products, product ID for non-variant
            productId: item._id, // Always the main product ID
            variantId: hasVariants ? (variant ? variant._id : undefined) : undefined, // Set variantId consistently
            name: item.name,
            price,
            sellingPrice,
            isDiscountActive,
            currency: "BDT",
            image: `${variant?.image?.alterImage?.secure_url ??
                item.images[0]?.alterImage?.secure_url ??
                "/placeholder.png"}`,
            variantValues: variant?.variants_values ?? [],
            variantGroups: item.variantsGroup ?? [],
        });
        toast.success("Added to wishlist");
    }, [
        item,
        variant,
        requireVariant,
        isWishlisted,
        addItem,
        removeItem,
        uniqueId,
        onVariantMissing,
        isPreOrder,
    ]);

    /* ---------------- UI ---------------- */
    return (
        <button
            onClick={handleClick}
            aria-label={isWishlisted ? labelOn : labelOff}
            className={`inline-flex items-center justify-center border rounded-md ${size === "icon" ? "p-1" : "px-3 py-1"
                } ${isWishlisted
                    ? "text-red-500 border-red-400 bg-red-50"
                    : "text-gray-600 border-gray-300 bg-white"
                } ${className ?? ""}`}
        >
            <FiHeart
                size={size === "icon" ? 18 : 16}
                fill={isWishlisted ? "#ef4444" : "none"}
            />
            {size !== "icon" && (
                <span className="ml-1 text-sm">
                    {isWishlisted ? labelOn : labelOff}
                </span>
            )}
        </button>
    );
}