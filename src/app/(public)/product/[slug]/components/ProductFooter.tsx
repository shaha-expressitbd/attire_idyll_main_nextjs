import React from "react";
import { FaHome } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/atoms/button";
import { CartSheet } from "@/components/ui/organisms/cart-sheet";
import { WishlistSheet } from "@/components/ui/organisms/WishlistSheet";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductFooterProps {
    productId: string;
    isPreOrder: boolean;
    isWishlisted: boolean;
    onWishlistToggle: () => void;
    onAddToCart: () => boolean;
    buttonText: string;
    buttonTitle: string;
}

export function ProductFooter({
    productId,
    isPreOrder,
    isWishlisted,
    onWishlistToggle,
    onAddToCart,
    buttonText,
    buttonTitle,
}: ProductFooterProps) {
    const { items: cartItems } = useCart();
    const { items: wishItems } = useWishlist();

    return (
        <>
            <div className="fixed bottom-16 left-2 z-50 md:hidden max-w-[50px] bg-primary p-2 rounded-full">
                <Link href="/">
                    <FaHome className="h-6 w-6 text-white" />
                </Link>
            </div>

            {(!isPreOrder && wishItems.length > 0) && (
                <div className="fixed bottom-16 right-2 z-50 md:hidden flex flex-col gap-2 items-end max-w-[50px] bg-secondary p-2 rounded-full">
                    <WishlistSheet />
                </div>
            )}

            <div className="flex items-center gap-1">
                <div className="fixed bottom-0 left-0 right-0  backdrop-blur-lg border-t shadow-xl lg:hidden z-50">
                    <div className="flex items-center justify-between p-1 gap-2 bg-white dark:bg-black">
                        {!isPreOrder && (
                            <div className="pl-2">
                                <button
                                    onClick={onWishlistToggle}
                                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                    className={`p-1 rounded-md border ${isWishlisted ? "text-red-500 border-red-400 bg-red-50" : "text-gray-500 border-gray-300 bg-white"}`}
                                >
                                    <FiHeart size={20} fill={isWishlisted ? "#ef4444" : "none"} />
                                </button>
                            </div>
                        )}
                        <Button
                            title={buttonTitle}
                            className={isPreOrder ? "bg-primary dark:bg-primary w-full h-12 flex-1" : "flex-1"}
                            variant={isPreOrder ? "default" : "custom"}
                            onClick={onAddToCart}
                            size="md"
                        >
                            {buttonText}
                        </Button>
                        {!isPreOrder && cartItems.length > 0 && (
                            <div className="pr-4 mt-2">
                                <CartSheet />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}