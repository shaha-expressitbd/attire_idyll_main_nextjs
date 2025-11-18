"use client";

import { BiMinus, BiPlus, BiShare } from "react-icons/bi";
import { toast } from "sonner";
import AddToCartBtn from "@/components/ui/molecules/addToCartBtn";
import AddToWishlistBtn from "@/components/ui/molecules/AddToWishlistBtn";
import type { Product, Variant } from "@/types/product";
import { Button } from "@/components/ui/atoms/button";
import { FaWhatsapp } from "react-icons/fa";

interface QuantityControlsProps {
  quantity: number;
  stock: number;
  onQuantityChange: (val: number) => void;
  product: Pick<
    Product,
    "_id" | "name" | "images" | "hasVariants" | "total_stock"
  > &
  Partial<Product>;
  variant: Variant | null;
  isDiscountActive: boolean;
  finalPrice: number;
  sellingPrice: number;
  onAddToCart: () => boolean;
  onVariantMissing: () => void;
  onWishlistVariantMissing?: () => void;
  buttonText?: string;
  buttonTitle?: string;
}

/** Desktop‑only (md up) row. */
export default function QuantityControls({
  quantity,
  stock,
  onQuantityChange,
  product,
  variant,
  isDiscountActive,
  finalPrice,
  sellingPrice,
  onAddToCart,
  onVariantMissing,
  onWishlistVariantMissing,
  buttonText,
  buttonTitle,
}: QuantityControlsProps) {
  /* ------ share helper ------ */
  const shareProduct = async () => {
    const slug = product.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const url = `${window.location.origin}/products/${slug}?id=${product._id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        toast.error("Failed to share product");
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="md:flex flex-col gap-3">
      {/* Top Row: QTY + Wishlist + Share */}
      <div className="flex items-center justify-between gap-4">
        {/* QTY */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-white">
            QTY:
          </label>
          <div className="flex items-center border border-gray-200 rounded">
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-l-sm disabled:opacity-30"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <BiMinus className="w-2.5 h-2.5" />
            </button>
            <input
              type="number"
              min={1}
              max={stock}
              value={quantity}
              onChange={(e) =>
                onQuantityChange(
                  Math.max(1, Math.min(stock, Number(e.target.value)))
                )
              }
              className="w-8 h-6 text-center text-xs border-x border-gray-200 focus:outline-none"
            />
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-r-sm disabled:opacity-30"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= stock}
              aria-label="Increase quantity"
            >
              <BiPlus className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Wishlist */}
        <div className="flex items-center gap-2">
          <AddToWishlistBtn
            item={product as Product}
            variant={variant}
            requireVariant={product.hasVariants}
            size="icon"
            className="h-9 w-9"
            onVariantMissing={onWishlistVariantMissing || onVariantMissing}
          />

          {/* Share */}
          <button
            onClick={shareProduct}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
            aria-label="Share"
          >
            <BiShare className="w-5 h-5" />
            <span>Share</span>

          </button>
        </div>
      </div>

      {/* Separate Row: Add to Cart */}
      <div className="pt-1 md:pt-0 flex flex-row gap-2 items-center justify-between">
        <AddToCartBtn
          item={product as Product}
          variant={
            variant
              ? {
                ...variant,
                selling_price: finalPrice.toString(),
              }
              : undefined
          }
          quantity={quantity}
          className="w-full"
          onAddToCart={onAddToCart}
          buttonText={buttonText}
          buttonTitle={buttonTitle}
        />

        <Button
          title="WhatsApp"
          onClick={() => {
            const slug = product.name.trim().replace(/\s+/g, "-");
            const productUrl = `${window.location.origin}/product/${slug}?id=${product._id}`;

            // Professional & friendly English message (proven to work great in BD)
            const message = `Hi! 👋\nI'm interested in "${product.name}"\nIs it still available? What's the best price right now?\n\n🔗 ${productUrl}`;

            const waUrl = `https://wa.me/8801709503503?text=${encodeURIComponent(message)}`;

            // Better mobile experience
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              window.location.href = waUrl;
            } else {
              window.open(waUrl, "_blank");
            }
          }}
          variant="edge"
          className="flex items-center gap-2"
        >
          <FaWhatsapp className="w-5 h-5" />
          WhatsApp
        </Button>
      </div>



    </div>
  );
}