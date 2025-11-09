"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import type { Product, Variant } from "@/types/product";
import VariantSelectModal from "../_component/VariantSelectModal";
import { trackProductView } from "@/utils/gtm";
import Modal from "@/components/ui/molecules/modal";
import { addProduct } from "@/lib/features/recentlyViewedSlice";
import { BkashCashbackModal } from "@/components/bkashCashbackModal";
import { useProductPricing } from "@/hooks/useProductPricing";
import { useProductMedia } from "@/hooks/useProductMedia";
import { useProductActions } from "@/hooks/useProductActions";
import { ProductLayout } from "./components/ProductLayout";
import { ProductFooter } from "./components/ProductFooter";
import RelatedProducts from "@/components/RelatedProducts";

const RecentlyViewedProducts = dynamic(() => import("@/components/RecentlyViewedProducts"), { ssr: false });

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
  subCategoryId?: string;
}

export default function ProductDetail({ product,
  relatedProducts = [],
  subCategoryId = '' }: ProductDetailProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [variantPicked, setVariantPicked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"Short-Description" | "Long-Description" | "specs" | "shipping" | string>("Short-Description");
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [wishlistVariantModalOpen, setWishlistVariantModalOpen] = useState(false);
  const [isPreorderConflictModalOpen, setIsPreorderConflictModalOpen] = useState(false);
  const [isRegularCartConflictModalOpen, setIsRegularCartConflictModalOpen] = useState(false);

  // Use consolidated hooks
  const pricingData = useProductPricing(product, selectedVariant);
  const { allMedia, selectedMediaUrl } = useProductMedia(product, selectedVariant, variantPicked);
  const { addToCartOrPreOrder, handleWishlistToggle, isWishlisted } = useProductActions(
    product,
    selectedVariant,
    pricingData.defaultVariant,
    quantity,
    pricingData.isDiscountActive,
    pricingData.finalPrice,
    pricingData.sellingPrice
  );

  // Consolidated useEffect for analytics and recently viewed tracking
  useEffect(() => {
    trackProductView(product, selectedVariant || pricingData.defaultVariant);
    dispatch(addProduct(product));
  }, [product._id, selectedVariant?._id, pricingData.defaultVariant?._id, dispatch]);

  // Handlers with optimized dependencies
  const handleQtyChange = useCallback((val: number) => {
    setQuantity(Math.min(Math.max(1, val), pricingData.stock));
  }, [pricingData.stock]);

  const handleClearPreorderAndProceed = useCallback(() => {
    setIsPreorderConflictModalOpen(false);
    addToCartOrPreOrder(selectedVariant);
  }, [addToCartOrPreOrder, selectedVariant]);

  const handleGoToCheckoutFromPreorder = useCallback(() => {
    setIsPreorderConflictModalOpen(false);
    router.push("/checkout");
  }, [router]);

  const handleClearRegularCartAndProceed = useCallback(() => {
    setIsRegularCartConflictModalOpen(false);
    addToCartOrPreOrder(selectedVariant);
  }, [addToCartOrPreOrder, selectedVariant]);

  const handleGoToCheckoutFromRegular = useCallback(() => {
    setIsRegularCartConflictModalOpen(false);
    router.push("/checkout");
  }, [router]);

  const handleAddToCart = useCallback(() => {
    if (product.hasVariants && product.variantsId.length > 1) {
      setIsVariantModalOpen(true);
      return false;
    }
    const variantToUse = product.hasVariants && product.variantsId.length > 1 ? selectedVariant : pricingData.defaultVariant;
    if (variantToUse && variantToUse.variants_stock <= 0) {
      toast.error("এই ভ্যারিয়েন্ট স্টকে নেই, অন্যটি বাছাই করুন");
      return false;
    }
    return addToCartOrPreOrder(variantToUse);
  }, [product.hasVariants, product.variantsId.length, selectedVariant, pricingData.defaultVariant, addToCartOrPreOrder]);

  // Reset variant selection when product changes
  useEffect(() => {
    setSelectedVariant(null);
    setVariantPicked(false);
    setQuantity(1);
  }, [product._id]);

  return (
    <div>
      <VariantSelectModal
        isOpen={isVariantModalOpen}
        variants={product.variantsId}
        selectedId={selectedVariant ? selectedVariant._id : undefined}
        onSelect={(v, qty, finalPrice) => {
          setSelectedVariant(v);
          setQuantity(qty);
          setVariantPicked(true);
          addToCartOrPreOrder(v, qty, finalPrice);
          setIsVariantModalOpen(false);
        }}
        onClose={() => setIsVariantModalOpen(false)}
        variantsGroup={product.variantsGroup}
        product={product}
      />
      <VariantSelectModal
        isOpen={wishlistVariantModalOpen}
        variants={product.variantsId}
        selectedId={selectedVariant ? selectedVariant._id : undefined}
        onSelect={(v, qty, finalPrice) => {
          setSelectedVariant(v);
          setQuantity(qty);
          handleWishlistToggle();
          setWishlistVariantModalOpen(false);
        }}
        onClose={() => setWishlistVariantModalOpen(false)}
        variantsGroup={product.variantsGroup}
        product={product}
        isWishlistModal={true}
      />

      {/* <BkashCashbackModal pageType="productDetails" /> */}

      <ProductLayout
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        stock={pricingData.stock}
        finalPrice={pricingData.finalPrice}
        sellingPrice={pricingData.sellingPrice}
        discountPercent={pricingData.discountPercent}
        discountStartDate={pricingData.discountStartDate}
        discountEndDate={pricingData.discountEndDate}
        isPreOrder={pricingData.isPreOrder}
        isDiscountActive={pricingData.isDiscountActive}
        activeTab={activeTab}
        allMedia={allMedia}
        selectedMediaUrl={selectedMediaUrl}
        onQuantityChange={handleQtyChange}
        onAddToCart={handleAddToCart}
        onVariantMissing={() => {
          setIsVariantModalOpen(true);
          return false;
        }}
        onWishlistVariantMissing={() => {
          setWishlistVariantModalOpen(true);
        }}
        setActiveTab={setActiveTab}
      />


      <ProductFooter
        productId={product._id}
        isPreOrder={pricingData.isPreOrder}
        isWishlisted={isWishlisted}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
        buttonText={pricingData.isPreOrder ? "প্রি-অর্ডার করুন" : "ক্যাশ অন ডেলিভারিতে অর্ডার করুন"}
        buttonTitle={pricingData.isPreOrder ? "Pre-order product" : "Add to Cart"}
      />

      {subCategoryId && (
        <div className="py-6 md:py-8 md:container md:max-w-7xl mx-auto">
          <RelatedProducts
            currentProductId={product._id}
            subCategoryId={subCategoryId}
            preloadedRelatedProducts={relatedProducts}
          />
        </div>
      )}
      <div className="py-4 md:py-8 md:container md:max-w-7xl mx-auto">
        <RecentlyViewedProducts currentProductId={product._id} />
      </div>
      <div className="w-full bg-black text-center py-1 md:py-2 flex items-center justify-center mb-12 md:static md:bottom-0 md:left-0 md:mb-0">
        <p className="flex flex-row gap-2 text-sm">
          <span className="text-gray-400">Powered by:</span>
          <a
            href="https://calquick.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <Image
              height={100}
              width={100}
              src="https://calquick.app/images/logo/logo-white.png"
              className="h-6 w-auto object-contain"
              alt="calquick-logo"
              onError={() => console.error("Failed to load footer logo")}
            />
          </a>
        </p>
      </div>

      <Modal
        isModalOpen={isPreorderConflictModalOpen}
        onClose={() => setIsPreorderConflictModalOpen(false)}
        title="প্রি-অর্ডার কনফ্লিক্ট"
        className="max-w-md"
      >
        <p className="text-gray-700 dark:text-gray-300">
          আপনার চেকআউটে ইতিমধ্যে একটা প্রি-অর্ডার প্রোডাক্ট আছে। এই নতুন প্রোডাক্ট যোগ করতে হলে প্রি-অর্ডার কার্ট ক্লিয়ার করা লাগবে।
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          কি করতে চান?
        </p>
        <div className="flex gap-3 mt-4">
          <button
            title="Clear preorder cart and add new item"
            onClick={handleClearPreorderAndProceed}
            className="flex-1 bg-primary text-white px-4 py-2 rounded"
          >
            কার্ট ক্লিয়ার করে প্রসিড করুন
          </button>
          <button
            title="Go to checkout to complete current preorder"
            onClick={handleGoToCheckoutFromPreorder}
            className="flex-1 border border-gray-300 px-4 py-2 rounded"
          >
            চেকআউটে যান
          </button>
        </div>
      </Modal>

      <Modal
        isModalOpen={isRegularCartConflictModalOpen}
        onClose={() => setIsRegularCartConflictModalOpen(false)}
        title="কার্ট কনফ্লিক্ট"
        className="max-w-md"
      >
        <p className="text-gray-700 dark:text-gray-300">
          আপনার রেগুলার কার্টে প্রোডাক্ট আছে। প্রি-অর্ডার করতে হলে রেগুলার কার্ট ক্লিয়ার করা লাগবে।
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          কন্টিনিউ করলে আপনার রেগুলার কার্টের সব প্রোডাক্ট মুছে যাবে। কি করতে চান?
        </p>
        <div className="flex gap-3 mt-4">
          <button
            title="Clear regular cart and proceed with preorder"
            onClick={handleClearRegularCartAndProceed}
            className="flex-1 bg-primary text-white px-4 py-2 rounded"
          >
            কার্ট ক্লিয়ার করে প্রসিড করুন
          </button>
          <button
            title="Go to checkout to manage regular cart"
            onClick={handleGoToCheckoutFromRegular}
            className="flex-1 border border-gray-300 px-4 py-2 rounded"
          >
            চেকআউটে যান
          </button>
        </div>
      </Modal>
    </div>
  );
}