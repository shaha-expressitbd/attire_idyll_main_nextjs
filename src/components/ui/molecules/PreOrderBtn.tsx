"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiShoppingBag } from "react-icons/bi";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import type { Product, Variant } from "@/types/product";
import { TPreorderCartItem } from "@/lib/features/preOrderCartSlice/preOrderCartSlice";
import { Button } from "../atoms/button";
import Modal from "./modal";

interface PreOrderBtnProps {
    item: Pick<Product, "_id" | "name" | "images" | "hasVariants" | "total_stock" | "variantsGroup" | "currency"> & Partial<Product>;
    variant?: Variant | null;
    quantity: number;
    className?: string;
}

export default function PreOrderBtn({ item, variant, quantity, className = "" }: PreOrderBtnProps) {
    const { addItem, item: preorderItem, clearCart: clearPreorderCart } = usePreorderCart();
    const { items: cartItems, clearCart: clearRegularCart } = useCart();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreorderConflictModalOpen, setIsPreorderConflictModalOpen] = useState(false);

    // Helper function to calculate price with robust validation
    const calculateValidPrice = (variant: Variant | null | undefined, item: PreOrderBtnProps['item']): number => {
        // Function to validate if a value is a valid positive number
        const isValidPrice = (value: any): boolean => {
            if (value === undefined || value === null || value === '') return false;
            const num = Number(value);
            return !isNaN(num) && num > 0;
        };

        // Extract prices - use finalPrice from variant if available (trust backend)
        const variantFinalPrice = variant?.finalPrice;
        const variantOfferPrice = variant?.offer_price;
        const variantSellingPrice = variant?.selling_price;
        const itemSellingPrice = item.selling_price;

        // Determine the price to use - prioritize finalPrice if available
        let price: number | null = null;

        // Trust backend finalPrice if discount is active
        if (variant?.isDiscountActive === true && isValidPrice(variantFinalPrice)) {
            price = Number(variantFinalPrice);
        } else if (isValidPrice(variantOfferPrice)) {
            price = Number(variantOfferPrice);
        } else if (isValidPrice(variantSellingPrice)) {
            price = Number(variantSellingPrice);
        } else if (isValidPrice(itemSellingPrice)) {
            price = Number(itemSellingPrice);
        }

        // Ensure the final price is a positive number (fallback to 1 if invalid)
        if (price === null || price <= 0) {
            // Log warning for debugging
            console.warn('⚠️ PreOrderBtn: Invalid or zero price detected, using fallback', {
                variantFinalPrice,
                variantOfferPrice,
                variantSellingPrice,
                itemSellingPrice,
                calculatedPrice: price
            });
            price = 1; // Fallback to positive number
        }

        return price;
    };

    const handlePreOrder = () => {
        // Check if there's already a preorder item in checkout
        if (preorderItem) {
            // Debug logging (only in development)
            if (process.env.NODE_ENV === "development") {
                console.log("🏷️ PreOrderBtn: Preorder conflict detected", {
                    currentPreorder: preorderItem.name,
                    tryingToAdd: item.name + " (variant: " + (variant?.variants_values?.join(", ") || "no variant") + ")"
                });
            }

            setIsPreorderConflictModalOpen(true);
            return;
        }

        // Check if regular cart has items
        if (cartItems.length > 0) {
            setIsModalOpen(true);
            return;
        }

        // Calculate price with validation
        const price = calculateValidPrice(variant, item);

        console.log("🔍 PreOrderBtn Price Debug (first instance):", {
            variantId: variant?._id,
            productId: item._id,
            variantOfferPrice: variant?.offer_price,
            variantSellingPrice: variant?.selling_price,
            itemSellingPrice: item.selling_price,
            calculatedPrice: price,
        });

        const cartItem: TPreorderCartItem = {
            _id: variant?._id ?? item._id,
            name: item.name,
            price,
            image: variant?.image?.alterImage.secure_url ?? item.images[0]?.alterImage.secure_url,
            quantity,
            maxStock: variant?.variants_stock ?? item.total_stock,
            variantValues: variant?.variants_values ?? [],
            variantGroups: item.variantsGroup ?? [],
            variantId: variant?._id,
            isPreOrder: true,
            currency: item.currency || "BDT",
        };

        addItem(cartItem);
        toast.success("প্রি-অর্ডার লিস্টে যোগ করা হয়েছে");
        router.push("/checkout");
    };

    const handleClearCartAndProceed = () => {
        clearRegularCart();
        setIsModalOpen(false);

        // Calculate price with validation
        const price = calculateValidPrice(variant, item);

        console.log("🔍 PreOrderBtn Price Debug (second instance):", {
            variantId: variant?._id,
            productId: item._id,
            variantOfferPrice: variant?.offer_price,
            variantSellingPrice: variant?.selling_price,
            itemSellingPrice: item.selling_price,
            calculatedPrice: price,
        });

        const cartItem: TPreorderCartItem = {
            _id: variant?._id ?? item._id,
            name: item.name,
            price,
            image: variant?.image?.alterImage.secure_url ?? item.images[0]?.alterImage.secure_url,
            quantity,
            maxStock: variant?.variants_stock ?? item.total_stock,
            variantValues: variant?.variants_values ?? [],
            variantGroups: item.variantsGroup ?? [],
            variantId: variant?._id,
            isPreOrder: true,
            currency: item.currency || "BDT",
        };

        addItem(cartItem);
        toast.success("রেগুলার কার্ট ক্লিয়ার করে প্রি-অর্ডার লিস্টে যোগ করা হয়েছে");
        router.push("/checkout");
    };

    const handleClearPreorderAndProceed = () => {
        clearPreorderCart();
        setIsPreorderConflictModalOpen(false);

        // Calculate price with validation
        const price = calculateValidPrice(variant, item);

        const cartItem: TPreorderCartItem = {
            _id: variant?._id ?? item._id,
            name: item.name,
            price,
            image: variant?.image?.alterImage.secure_url ?? item.images[0]?.alterImage.secure_url,
            quantity,
            maxStock: variant?.variants_stock ?? item.total_stock,
            variantValues: variant?.variants_values ?? [],
            variantGroups: item.variantsGroup ?? [],
            variantId: variant?._id,
            isPreOrder: true,
            currency: item.currency || "BDT",
        };

        addItem(cartItem);
        toast.success("প্রি-অর্ডার কার্ট ক্লিয়ার করে নতুন প্রোডাক্ট যোগ করা হয়েছে");
        router.push("/checkout");
    };

    const handleGoToCheckout = () => {
        setIsPreorderConflictModalOpen(false);
        router.push("/checkout");
    };

    return (
        <>
            <Button
                title="Pre-order product"
                className=" bg-primary dark:bg-primary w-full h-12 "
                size="sm"
                onClick={handlePreOrder}
                aria-label="Pre-order product"
            >
                <span>PRE-ORDER NOW</span>
            </Button>

            <Modal
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="কার্ট কনফ্লিক্ট"
                onConfirm={handleClearCartAndProceed}
                confirmText="কার্ট ক্লিয়ার করে প্রি-অর্ডার করুন"
                className="max-w-md"
            >
                <p className="text-gray-700 dark:text-gray-300">
                    আপনার রেগুলার কার্টে {cartItems.length} টি প্রোডাক্ট আছে। প্রি-অর্ডার করতে হলে রেগুলার কার্ট ক্লিয়ার করা লাগবে।
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                    কন্টিনিউ করলে আপনার রেগুলার কার্টের সব প্রোডাক্ট মুছে যাবে।
                </p>
            </Modal>

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
                    <Button
                        title="Clear cart and proceed with new preorder"
                        onClick={handleClearPreorderAndProceed}
                        className="flex-1"
                    >
                        কার্ট ক্লিয়ার করে প্রসিড করুন
                    </Button>
                    <Button
                        title="Go to checkout to complete current preorder"
                        onClick={handleGoToCheckout}
                        variant="outline"
                        className="flex-1"
                    >
                        চেকআউটে যান
                    </Button>
                </div>
            </Modal>
        </>
    );
}