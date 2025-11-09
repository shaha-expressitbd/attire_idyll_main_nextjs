/* ==================================================================
   components/ui/molecules/cartItem.tsx - Fully Responsive Version
   ================================================================== */
"use client";

import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { Button } from "../atoms/button";
import { formatCurrency } from "@/utils/formatCurrency";
import type { TCartItem } from "@/lib/features/cart/cartSlice";
import Image from "../atoms/image";

export interface CartItemProps {
  item: TCartItem;
  onRemove: () => void;
  onQuantityChange?: (quantity: number) => void;
  showQuantityControls?: boolean;
  currency?: string;
  ignoreStockCap?: boolean;
}

export function CartItem({
  item,
  onRemove,
  onQuantityChange,
  showQuantityControls = true,
  currency = "BDT",
  ignoreStockCap = false,
}: CartItemProps) {
  const rawImage = item?.image || "";

  const unitPrice = Number(item?.price ?? 0);
  const qty = Number(item?.quantity ?? 0);
  const totalPrice = unitPrice * qty;
  const canInc = ignoreStockCap ? qty < 10 : qty < (item?.maxStock ?? 10);
  const canDec = qty > 1;

  // Helper function to truncate product name to 20 characters
  const truncateName = (name: string) => {
    if (!name) return '';
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };

  // Helper Components
  const ProductImage = ({ size, sizes }: { size: string; sizes: string }) => (
    <div className="relative group/image flex-shrink-0 max-w-full">
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-md group-hover:shadow-lg transition-all duration-300 ${size}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/image:translate-x-full transition-transform duration-1000"></div>

        {rawImage ? (
          <Image
            src={rawImage}
            alt={item?.name || "Product image"}
            fill
            sizes="(max-width: 375px) 64px, (max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
            className="object-cover transition-all duration-300"
            loading="lazy"
            variant="small"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <FiShoppingBag className="w-4 h-4 xs:w-6 xs:h-6 mb-1" />
            <span className="text-[9px] xs:text-[10px]">No Image</span>
          </div>
        )}
      </div>

      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] xs:text-[10px] sm:text-xs px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-1 rounded-full shadow-md transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
        ৳{unitPrice}
      </div>
    </div>
  );

  const VariantInfo = ({ layout }: { layout: string }) => {
    if (!item.variantValues?.length) return null;

    return (
      <div className={`${layout === 'mobile' ? 'mt-1' : 'mt-2'}`}>
        <div className="flex flex-col gap-1">
          {item.variantGroups?.length
            ? item.variantValues.map((val, idx) => {
              const groupName = item.variantGroups?.[idx]?.variantName || "";
              return (
                <div key={idx} className={`flex items-center ${layout === 'mobile' ? 'gap-1' : 'gap-2'}`}>
                  <span className={`text-gray-500 dark:text-gray-400 ${layout === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                    {groupName}:
                  </span>
                  <span className={`font-medium text-gray-800 dark:text-white ${layout === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                    {val}
                  </span>
                </div>
              );
            })
            : item.variantValues.map((val, idx) => (
              <span key={idx} className={`font-medium text-gray-800 dark:text-white ${layout === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                {val}
              </span>
            ))}
        </div>
      </div>
    );
  };

  const ProductInfo = ({ layout, totalClasses = "" }: { layout: string; totalClasses?: string }) => (
    <div className="flex-1 min-w-0 space-y-1">
      <h3
        className={`font-bold text-gray-800 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-pink-400 transition-colors duration-300 ${layout === 'mobile' ? 'text-sm ' : layout === 'tablet' ? 'text-base sm:text-lg' : 'text-lg xl:text-xl 2xl:text-2xl'} truncate pr-2`}
        title={item?.name}
      >
        {truncateName(item?.name)}
      </h3>

      {/* Variant information displayed right below the product name */}
      <VariantInfo layout={layout} />

      {layout === 'desktop' && (
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-500"></div>
      )}

      <div className={`${layout === 'mobile' ? 'flex flex-col gap-1 mt-1' : layout === 'tablet' ? 'flex flex-wrap items-center gap-2 xs:gap-4 mt-2' : 'flex flex-col lg:flex-row lg:items-center gap-1 xs:gap-2 lg:gap-4 xl:gap-6 2xl:gap-8 mt-2'}`}>
        <div className="flex items-center gap-1 xs:gap-2">
          {item.isDiscountActive && item.sellingPrice && item.sellingPrice > unitPrice ? (
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-primary dark:text-pink-400 ${layout === 'mobile' ? 'text-sm' : layout === 'tablet' ? 'text-sm xs:text-base' : 'text-base lg:text-lg xl:text-xl'}`}>
                {formatCurrency(unitPrice, currency)}
              </span>
              <span className={`line-through text-gray-500 dark:text-gray-400 ${layout === 'mobile' ? 'text-sm' : 'text-sm'}`}>
                {formatCurrency(item.sellingPrice, currency)}
              </span>
            </div>
          ) : (
            <span className={`font-semibold text-primary dark:text-pink-400 ${layout === 'mobile' ? 'text-sm' : layout === 'tablet' ? 'text-sm xs:text-base' : 'text-base lg:text-lg xl:text-xl'}`}>
              {formatCurrency(unitPrice, currency)}
            </span>
          )}
        </div>

        {layout === 'desktop' && (
          <div className="hidden lg:flex items-center">
            <div className="w-5 h-5 xs:w-6 xs:h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs xs:text-sm">×</span>
            </div>
          </div>
        )}

        {/* <div className="flex items-center gap-1 xs:gap-2">
          <span className={`text-gray-500 dark:text-gray-400 ${layout === 'mobile' ? 'text-xs' : 'text-sm'}`}>Total:</span>
          <div className={`bg-gradient-to-r from-primary/10 to-pink-500/10 dark:from-pink-400/10 dark:to-pink-500/10 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full border border-primary/20 dark:border-pink-400/20 ${totalClasses}`}>
            <span className={`font-bold text-primary dark:text-pink-400 ${layout === 'mobile' ? 'text-sm xs:text-base' : layout === 'tablet' ? 'text-sm xs:text-lg' : 'text-lg xl:text-xl 2xl:text-2xl'}`}>
              {formatCurrency(totalPrice, currency)}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );

  const QuantityControls = ({ size }: { size: string }) => (
    <div className={`flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 group-hover:border-primary dark:group-hover:border-pink-400 transition-all duration-300 ${size === 'desktop' ? 'rounded-xl border-2' : ''}`}>
      <button
        className={`hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 group/dec ${size === 'mobile' ? 'p-2' : size === 'tablet' ? 'p-2.5' : 'p-1 rounded-l-xl'}`}
        onClick={() => onQuantityChange?.(Math.max(1, qty - 1))}
        disabled={!canDec}
      >
        <FiMinus className={`text-gray-600 dark:text-gray-300 group-hover/dec:text-primary dark:group-hover/dec:text-pink-400 transition-all duration-200 ${size === 'mobile' ? 'w-3.5 h-3.5' : size === 'tablet' ? 'w-4 h-4' : 'w-4 h-4 group-hover/dec:scale-110'}`} />
      </button>

      <div className={`text-center bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-600 min-w-[${size === 'mobile' ? '50px' : '50px'}] ${size === 'tablet' ? 'min-w-[50px]' : size === 'desktop' ? 'min-w-[60px]' : 'min-w-[50px]'} px-3 py-2 ${size === 'desktop' ? 'px-2 py-1' : ''}`}>
        <span className={`font-bold text-gray-800 dark:text-white ${size === 'mobile' ? 'text-sm' : size === 'tablet' ? 'text-base' : 'text-lg'}`}>
          {qty}
        </span>
      </div>

      <button
        className={`hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 group/inc ${size === 'mobile' ? 'p-2 rounded-r-lg' : size === 'tablet' ? 'p-2.5 rounded-r-xl' : 'p-1 rounded-r-xl'}`}
        onClick={() => onQuantityChange?.(Math.max(1, qty + 1))}
        disabled={!canInc || (!ignoreStockCap && qty >= (item?.maxStock ?? 10))}
      >
        <FiPlus className={`text-gray-600 dark:text-gray-300 group-hover/inc:text-primary dark:group-hover/inc:text-pink-400 transition-all duration-200 ${size === 'mobile' ? 'w-3.5 h-3.5' : size === 'tablet' ? 'w-4 h-4' : 'w-4 h-4 group-hover/inc:scale-110'}`} />
      </button>

      {size === 'desktop' && (
        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 dark:text-gray-500">
          Quantity
        </span>
      )}
    </div>
  );

  const RemoveButton = ({ size, layout }: { size: string; layout: string }) => (
    <div className="relative group/remove">
      <Button
        title="Remove Item"
        variant="ghost"
        className={`text-primary hover:text-red-500  border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 group/trash ${size === 'mobile' ? 'w-8 h-8 xs:w-10 xs:h-10 rounded-lg' : size === 'tablet' ? 'w-11 h-11 rounded-xl border-2' : 'w-12 h-12 rounded-xl border-2'}`}
        onClick={onRemove}
        aria-label="Remove item"
      >
        <FiTrash2 className={`group-hover/trash:scale-110 group-hover/trash:rotate-12 transition-all duration-200 ${size === 'mobile' ? 'w-3.5 h-3.5 xs:w-4 xs:h-4' : size === 'tablet' ? 'w-4.5 h-4.5' : 'w-5 h-5'}`} />
      </Button>

      {(layout === 'tablet' || layout === 'desktop') && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-xs rounded-lg opacity-0 group-hover/remove:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Remove Item
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-shadow duration-300">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/0 to-transparent group-hover:via-indigo-50/50 dark:group-hover:via-indigo-900/20 transition-all duration-500"></div>

      {/* Main Content - Mobile First Design */}
      <div className="relative p-2 md:p-4 mt-2">

        {/* Mobile Layout (< sm) */}
        <div className="block sm:hidden">
          {/* Mobile Top Section - Image + Basic Info + Remove */}
          <div className="flex items-start gap-3">
            <ProductImage size="w-16 h-16 xs:w-20 xs:h-20" sizes="80px" />
            <ProductInfo layout="mobile" />
            <RemoveButton size="mobile" layout="mobile" />
          </div>

          {/* Mobile Bottom Section - Quantity + Total */}
          <div className="flex flex-row items-center justify-between gap-2 mt-2">
            <QuantityControls size="mobile" />

            <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 dark:from-pink-400/10 dark:to-pink-500/10 px-2.5 py-1.5 rounded-lg border border-primary/20 dark:border-pink-400/20">
              <span className="font-bold text-primary dark:text-pink-400 text-sm xs:text-base">
                {formatCurrency(totalPrice, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Tablet Layout (sm - md) */}
        <div className="hidden sm:block md:hidden">
          <div className="flex items-center gap-4">
            <ProductImage size="w-24 h-24" sizes="96px" />
            <ProductInfo layout="tablet" />
            <div className="flex items-center gap-3 flex-shrink-0">
              <QuantityControls size="tablet" />
              <RemoveButton size="tablet" layout="tablet" />
            </div>
          </div>
        </div>

        {/* Desktop Layout (md+) - Original Grid Layout */}
        <div className="hidden md:grid grid-cols-4 gap-2 items-center">
          {/* Product Image Section */}
          <div className="relative flex justify-center md:justify-start">
            <div className="relative group/image">
              <div className="relative w-28 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/image:translate-x-full transition-transform duration-1000"></div>

                {rawImage ? (
                  <Image
                    src={rawImage}
                    alt={item?.name || "Product image"}
                    fill
                    sizes="112px"
                    className="object-cover transition-all duration-300 group-hover/image:scale-110"
                    variant="small"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <FiShoppingBag className="w-8 h-8 mb-2" />
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>

              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300 text-nowrap">
                {formatCurrency(unitPrice, currency)}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="col-span-2 space-y-3">
            <div className="relative">
              <h3 className="font-bold text-lg xl:text-xl text-gray-800 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-pink-400 transition-colors duration-300">
                {truncateName(item?.name)}
              </h3>

              {/* Variant information for desktop */}
              {item.variantValues?.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {item.variantGroups?.length
                    ? item.variantValues.map((val, idx) => {
                      const groupName = item.variantGroups?.[idx]?.variantName || "";
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {groupName}:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {val}
                          </span>
                        </div>
                      );
                    })
                    : item.variantValues.map((val, idx) => (
                      <span key={idx} className="text-sm font-medium text-gray-900 dark:text-white">
                        {val}
                      </span>
                    ))}
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
              <div className="flex items-center gap-2">
                {item.isDiscountActive && item.sellingPrice && item.sellingPrice > unitPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary dark:text-pink-400 text-lg text-nowrap">
                      {formatCurrency(unitPrice, currency)}
                    </span>
                    <span className="line-through text-gray-500 dark:text-gray-400 text-sm">
                      {formatCurrency(item.sellingPrice, currency)}
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold text-primary dark:text-pink-400 text-lg text-nowrap">
                    {formatCurrency(unitPrice, currency)}
                  </span>
                )}
              </div>

              <div className="hidden lg:flex items-center">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="dark:text-gray-200 text-gray-600 text-xs">×</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 dark:from-pink-400/10 dark:to-pink-500/10 px-3 py-1 rounded-full border border-primary/20 dark:border-pink-400/20 text-nowrap">
                {item.isDiscountActive && item.sellingPrice && item.sellingPrice > unitPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary dark:text-pink-400 text-sm">
                      {formatCurrency(totalPrice, currency)}
                    </span>
                    <span className="line-through text-gray-500 dark:text-gray-400 text-xs">
                      {formatCurrency(item.sellingPrice * item.quantity, currency)}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-primary dark:text-pink-400 text-sm">
                    {formatCurrency(totalPrice, currency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col items-end justify-end gap-4">
            <div className="relative group/qty">
              <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 group-hover/qty:border-primary dark:group-hover/qty:border-pink-400 transition-all duration-300 overflow-hidden">
                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 group/dec"
                  onClick={() => onQuantityChange?.(Math.max(1, qty - 1))}
                  disabled={!canDec}
                >
                  <FiMinus className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/dec:text-primary dark:group-hover/dec:text-pink-400 group-hover/dec:scale-110 transition-all duration-200" />
                </button>

                <div className="px-2 py-1 min-w-[60px] text-center bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-600">
                  <span className="font-bold text-lg text-gray-800 dark:text-white">
                    {qty}
                  </span>
                </div>

                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 group/inc"
                  onClick={() => onQuantityChange?.(qty + 1)}
                  disabled={!canInc || (!ignoreStockCap && qty >= (item?.maxStock ?? 10))}
                >
                  <FiPlus className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/inc:text-primary dark:group-hover/inc:text-pink-400 group-hover/inc:scale-110 transition-all duration-200" />
                </button>
              </div>

              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 dark:text-gray-500">
                Quantity
              </span>
            </div>

            <div className="relative group/remove">
              <Button
                title="Remove Item"
                variant="ghost"
                className="w-12 h-12 rounded-xl text-primary hover:text-red-500 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 group/trash"
                onClick={onRemove}
                aria-label="Remove item"
              >
                <FiTrash2 className="w-5 h-5 group-hover/trash:scale-110 group-hover/trash:rotate-12 transition-all duration-200" />
              </Button>

              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-red-600 text-white text-xs rounded-lg opacity-0 group-hover/remove:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Remove Item
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border Animation */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-pink-500 to-purple-500 transition-all duration-700 ease-out"></div>

      {/* Side Glow Effect */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-20 bg-gradient-to-b from-primary to-pink-500 transition-all duration-500 rounded-r-full shadow-lg shadow-primary/50"></div>
    </div>
  );
}