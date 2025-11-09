"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BiX, BiMinus, BiPlus } from "react-icons/bi";
import type { Variant, VariantGroup, Product } from "@/types/product";
import Image from "@/components/ui/atoms/image";

interface Props {
  isOpen: boolean;
  variants: Variant[];
  selectedId?: string;
  onSelect: (variant: Variant, quantity: number, finalPrice: number) => void;
  onClose: () => void;
  product?: Product;
  isWishlistModal?: boolean;
  variantsGroup?: { variantName: string; variantValue: string[] }[];
}

export default function VariantSelectModal({
  isOpen,
  variants,
  selectedId,
  onSelect,
  onClose,
  product,
  isWishlistModal = false,
  variantsGroup,
}: Props) {
  const [currentId, setCurrentId] = useState<string | undefined>(selectedId);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    variants.reduce((acc, v) => ({ ...acc, [v._id]: 1 }), {})
  );
  const fallbackImage = "/assets/falback.jpg";

  useEffect(() => {
    setCurrentId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setQuantities(variants.reduce((acc, v) => ({ ...acc, [v._id]: 1 }), {}));
    onClose();
  };

  const handleQtyChange = (variantId: string, val: number, stock: number) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: Math.min(Math.max(1, val), stock),
    }));
  };

  const handlePick = (v: Variant) => {
    setCurrentId(v._id);
    const selectedQuantity = quantities[v._id] || 1;
    const finalPrice = v.finalPrice ? Number(v.finalPrice) : Number(v.selling_price);
    onSelect(v, selectedQuantity, finalPrice);
    handleClose();
  };

  const getVariantLabel = (values: string[]) => {
    if (!values?.length || !variantsGroup?.length) return values?.join(", ") ?? "";
    return values.map((val, idx) => {
      const groupName = variantsGroup[idx]?.variantName || "";
      return groupName ? `${groupName}: ${val}` : val;
    }).join(", ");
  };

  const getVariantDetails = (values: string[]) => {
    if (!values?.length || !variantsGroup?.length) return null;
    return (
      <div className="mt-1 flex flex-col gap-1">
        {values.map((val, idx) => {
          const groupName = variantsGroup[idx]?.variantName || "";
          if (!groupName) return null;
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{groupName}:</span>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{val}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 min-h-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="variant-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative z-[100001] w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h2 id="variant-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
              Select Your Preference
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {variants.length} options available
            </p>
          </div>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <BiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {variants.map((v) => {
            console.log(`VariantSelectModal: Variant ${v._id} (${v.name}): isPreOrder = ${v.isPreOrder}`);
            const isDisabled = v.variants_stock <= 0;
            const variantLabel = getVariantLabel(v.variants_values ?? []);
            const variantDetails = getVariantDetails(v.variants_values ?? []);
            const isSelected = currentId === v._id;
            const imgSrc =
              v.image?.alterImage?.secure_url ||
              v.image?.alterImage?.optimizeUrl ||
              product?.images?.[0]?.alterImage?.secure_url ||
              fallbackImage;
            const quantity = quantities[v._id] || 1;

            const displayPrice = v.finalPrice ? Number(v.finalPrice).toFixed(2) : Number(v.selling_price).toFixed(2);
            const discountPercent = v.finalPrice && Number(v.finalPrice) < Number(v.selling_price)
              ? Math.round(((Number(v.selling_price) - Number(v.finalPrice)) / Number(v.selling_price)) * 100)
              : 0;

            const showQtyControls = !isWishlistModal && !isDisabled;
            console.log(`VariantSelectModal: Variant ${v._id} showQtyControls = ${showQtyControls} (isWishlistModal=${isWishlistModal}, isDisabled=${isDisabled}, isPreOrder=${v.isPreOrder})`);

            return (
              <div
                key={v._id}
                className={`flex items-start p-3 border rounded-lg transition-all ${isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : isSelected
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary"
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border flex-shrink-0">
                      <Image
                        src={imgSrc}
                        alt={variantLabel}
                        fill
                        className="object-cover"
                        variant="small"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {variantDetails}
                      {isDisabled ? (
                        <span className="text-sm text-red-500 block mt-1">Out of stock</span>
                      ) : (
                        <span className="text-sm text-gray-500 block mt-1">
                          Stock: {v.variants_stock} units
                        </span>
                      )}
                      <button
                        onClick={() => {
                          if (isDisabled) return;
                          handlePick(v);
                        }}
                        disabled={isDisabled}
                        className={`mt-2 px-3 py-1 text-sm rounded-md text-nowrap ${isDisabled
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary"
                          }`}
                      >
                        {isWishlistModal ? "Add to Wishlist" : v.isPreOrder ? "প্রি-অর্ডার করুন" : "অর্ডার করুন"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 text-right">
                  <div className="flex flex-col items-end gap-2">
                    <div>
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        {"৳"}{displayPrice}
                      </span>
                      {discountPercent > 0 && (
                        <>
                          <span className="text-sm line-through text-gray-400 dark:text-gray-500 block">
                            {"৳"}{Number(v.selling_price).toFixed(2)}
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    {showQtyControls && (
                      <div className="flex items-center border rounded-md bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-600 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQtyChange(v._id, quantity - 1, v.variants_stock);
                          }}
                          disabled={quantity <= 1}
                          className="flex items-center justify-center w-6 h-6 disabled:opacity-30"
                        >
                          <BiMinus className="w-3 h-3 text-black dark:text-white" />
                        </button>
                        <input
                          type="number"
                          readOnly
                          value={quantity}
                          className="w-8 text-center text-sm font-medium border-x bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:outline-none text-black dark:text-white "
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQtyChange(v._id, quantity + 1, v.variants_stock);
                          }}
                          disabled={quantity >= v.variants_stock}
                          className="flex items-center justify-center w-6 h-6 disabled:opacity-30"
                        >
                          <BiPlus className="w-3 h-3 text-black dark:text-white" />
                        </button>
                      </div>
                    )
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>,
    document.body
  );
}