/* src/components/ui/molecules/AddToCartBtn.tsx */
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "../atoms/button";
import type { Product, Variant } from "@/types/product";

interface AddToCartBtnProps {
  item: Product;               // পুরো প্রোডাক্ট
  variant?: Variant;           // সিলেক্টেড ভ্যারিয়েন্ট (না‑থাকলে undefined)
  quantity?: number;           // ক’টি অ্যাড করবেন (default 1)
  className?: string;          // অতিরিক্ত CSS ক্লাস
  onAddToCart: () => boolean;  // প্যারেন্ট‑কন্ট্রোল্ড অ্যাকশন
  buttonText?: string;         // কাস্টম বাটন টেক্সট
  buttonTitle?: string;        // কাস্টম বাটন টাইটেল
}

export default function AddToCartBtn({
  item,
  variant,
  quantity = 1,
  className,
  onAddToCart,
  buttonText = "অর্ডার করুন",
  buttonTitle = "Add to Cart",
}: AddToCartBtnProps) {
  const [isAdding, setIsAdding] = useState(false);   // duplicate‑click lock

  /* ---------------- handler ---------------- */
  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isAdding) return;          // ইতিমধ্যেই অ্যাডিং চললে ব্লক করুন

      /* -------- স্টক‑চেক -------- */
      const outOfStock =
        variant ? variant.variants_stock <= 0 : item.total_stock <= 0;

      if (outOfStock) {
        toast.error("Out of stock");
        return;                      // স্টকে নেই → শুধু টোস্ট দেখিয়ে ফিরে যান
      }

      /* অভ্যন্তরীণ লক অন করুন */
      setIsAdding(true);

      /* প্যারেন্টকে জানিয়ে দিন — সে রিটার্ন true/false করতে পারে */
      const success = onAddToCart();
      // console.debug("AddToCartBtn:", { success, itemId: item._id, quantity });

      /* ছোট ডিবাউন্স; এখান থেকে মিউটেবল স্টেট আপডেট হলে বাড়িয়ে নিন */
      setTimeout(() => setIsAdding(false), 300);
    },
    [item, variant, onAddToCart, isAdding]
  );

  /* -------- ডিসেবল লজিক --------
     - প্রোডাক্ট unpublish হলে ডিসেবল
     - অ্যাড হলেই সাময়িক লক (isAdding)
     - স্টকের কারণে আর ডিসেবল নয়; স্টক ০ হলে ক্লিক‑পর টোস্ট দেখবে
  ---------------------------------*/
  const disabled = !item.isPublish || isAdding;

  /* ---------------- UI ---------------- */
  return (
    <Button
      title={buttonTitle}
      size="md"
      onClick={handleAdd}
      disabled={disabled}
      className=" bg-primary dark:bg-primary w-full h-12 text-lg"
    >
      {buttonText}
    </Button>
  );
}
