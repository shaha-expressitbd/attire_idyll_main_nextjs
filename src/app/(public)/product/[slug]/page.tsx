'use server';

import { publicApi } from "@/lib/api/publicApi";
import { makeStore } from "@/lib/store";
import { stripHtml } from "@/utils/stripHTML";
import { generateSlug } from "@/utils/slug";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import ProductDetail from "./product-details";
import ProductPageSkeleton from "@/components/ui/skeleton/ProductPageSkeleton";
import { Product } from "@/types/product";


// Interface for getProductWithRelated response
interface ProductWithRelated {
  product: Product | null;
  related_products: Product[];
}

// Fetch product and related products by ID
async function getProductWithRelated(productId: string, relatedProductLimit: number = 8): Promise<ProductWithRelated | null> {
  const store = makeStore();
  const res = await store.dispatch(
    publicApi.endpoints.getProductWithRelated.initiate({ productId, relatedProductLimit })
  );
  return res.data || null;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // console.log("Metadata - Slug:", resolvedParams.slug, "ID:", resolvedSearchParams.id);

  if (!resolvedSearchParams.id) {
    return {
      title: "পণ্য পাওয়া যায়নি",
      description: "কোনো পণ্য পাওয়া যায়নি।",
    };
  }

  const data = await getProductWithRelated(resolvedSearchParams.id);
  const product = data?.product;

  if (!product) {
    return {
      title: "পণ্য পাওয়া যায়নি",
      description: "কোনো পণ্য পাওয়া যায়নি।",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://attireIdyll.com";
  const expectedSlug = generateSlug(product.name, product._id); // Use generateSlug from utils/slug.ts
  const canonicalUrl = `${baseUrl}/product/${expectedSlug}`;

  const rawDescription = product.short_description || "পণ্যের বিস্তারিত বিবরণ দেখুন";
  const cleanedDescription = stripHtml(rawDescription);

  const firstImg = product.images?.[0]?.alterImage?.secure_url
    ? product.images[0].alterImage.secure_url
    : "/assets/fallback.jpg";

  return {
    title: `${product.name} | AttireIdyll`,
    description: cleanedDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      url: canonicalUrl,
      title: product.name,
      description: cleanedDescription,
      images: [
        {
          url: firstImg,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: baseUrl.replace(/^https?:\/\//, ""),
      title: product.name,
      description: cleanedDescription,
      images: [firstImg],
    },
  };
}

// Product page component
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  console.log("ProductPage - Slug:", resolvedParams.slug, "ID:", resolvedSearchParams.id);

  if (!resolvedSearchParams.id) {
    console.error("No product ID provided in query parameters");
    return notFound();
  }

  const data = await getProductWithRelated(resolvedSearchParams.id);
  const product = data?.product;

  if (!product) {
    console.error("Product not found for ID:", resolvedSearchParams.id);
    return notFound();
  }

  const expectedSlug = generateSlug(product.name, product._id); // Use generateSlug from utils/slug.ts
  const cleanSlug = resolvedParams.slug.split("?")[0]; // Remove query params from provided slug
  const cleanExpectedSlug = expectedSlug.split("?")[0]; // Remove query params from expected slug

  if (cleanSlug !== cleanExpectedSlug) {
    redirect(`/product/${expectedSlug}`);
  }

  return (
    <div className="bg-white dark:bg-secondary">
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductDetail
          product={product}
          key={product._id}
          relatedProducts={data?.related_products || []}
          subCategoryId={product.sub_category[0]?._id || ""}
        />
      </Suspense>
    </div>
  );
}