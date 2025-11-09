// app/products/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products - AttireIdyll",
  description: "Browse all products available from AttireIdyll businesses.",
  openGraph: {
    title: "All Products - AttireIdyll",
    description: "Browse a wide selection of products offered by various businesses.",
    url: "https://AttireIdyll.com/products",
    type: "website",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "All Products Preview",
      },
    ],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>;
}
