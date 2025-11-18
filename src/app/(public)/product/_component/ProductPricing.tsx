"use client";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { CountdownTimer } from "./CountdownTimer";
import { LiveViews } from "./Liveviews";
import { FiThumbsUp } from "react-icons/fi";

interface ProductPricingProps {
    finalPrice: number;
    sellingPrice: number;
    stock: number;
    discountPercent: number;
    isDiscountActive: boolean;
    discountStartDate?: string;
    discountEndDate?: string;
    isPreorder?: boolean;
}

export default function ProductPricing({
    finalPrice,
    sellingPrice,
    stock,
    discountPercent,
    isDiscountActive,
    discountStartDate,
    discountEndDate,
    isPreorder = false,
}: ProductPricingProps) {
    const displayPrice = finalPrice;

    return (
        <div className="space-y-3 md:space-y-4 mt-2 sm:mb-2">


            {/* Pricing Section - Hide for preorder items */}
            {!isPreorder && (
                <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-2xl md:text-4xl font-bold text-primary dark:text-white">
                            ৳{displayPrice.toFixed(2)}
                        </span>
                        {isDiscountActive && discountPercent > 0 && (
                            <span className="line-through text-gray-400 text-base md:text-xl">
                                ৳{sellingPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {!isPreorder && isDiscountActive && discountPercent > 0 && (
                <div className="mt-1 md:mt-2 flex items-center gap-1 md:gap-2">
                    <span className="bg-primary dark:bg-primary text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full">
                        {discountPercent}% OFF
                    </span>
                    <span className="text-xs md:text-sm text-black dark:text-gray-200">
                        Save ৳{(sellingPrice - finalPrice).toFixed(2)}
                    </span>
                </div>
            )}

            {isDiscountActive && discountEndDate && (
                <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
                    <div className="text-xs md:text-sm text-primary dark:text-primary font-semibold">
                        <CountdownTimer endDate={discountEndDate} />
                    </div>
                </div>
            )}
        </div>
    );
}