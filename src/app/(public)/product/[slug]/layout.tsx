// app/(public)/products/[slug]/layout.tsx
import "@/app/globals.css";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Product Details - YourStore",
  description: "View detailed product information",
  openGraph: {
    title: "Product Details - YourStore",
    description: "View detailed product information",
    type: "website",
    images: [{ url: "/assets/falback.jpg" }],
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">   {children}</div>
  );
}