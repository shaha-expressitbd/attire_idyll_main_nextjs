"use client";

import { useMemo } from "react";
import type { Product, Variant } from "@/types/product";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  public_id?: string;
  _id: string;
}

interface ProductMediaHook {
  allMedia: MediaItem[];
  selectedMediaUrl?: string;
}

export function useProductMedia(
  product: Product,
  selectedVariant: Variant | null,
  variantPicked: boolean
): ProductMediaHook {
  const allMedia = useMemo<MediaItem[]>(() => {
    const media: MediaItem[] = [];

    // Add video if available
    if (product.video?.[0]?.video) {
      const videoUrl =
        product.video[0].alterVideo?.secure_url ||
        product.video[0].video.secure_url;
      if (videoUrl) {
        media.push({
          type: "video",
          url: `${process.env.NEXT_PUBLIC_VIDEO_URL}/${process.env.NEXT_PUBLIC_OWNER_ID}/original${videoUrl}`,
          public_id: product.video[0].video.public_id,
          _id: product.video[0]._id,
        });
      }
    }

    // Add product images
    const images = product.images.map((img) => {
      const imageUrl =
        img.alterImage?.optimizeUrl || img.alterImage?.secure_url;
      return {
        type: "image" as const,
        url: imageUrl || "/assets/fallback.jpg",
        public_id: img.image.public_id,
        _id: img._id,
      };
    });

    // Add selected variant's image if available
    if (selectedVariant?.image) {
      const vUrl =
        selectedVariant.image.alterImage.optimizeUrl ||
        selectedVariant.image.alterImage.secure_url;
      const idx = images.findIndex((i) => i.url === vUrl);
      const vItem: MediaItem =
        idx > -1
          ? images.splice(idx, 1)[0]
          : {
              type: "image",
              url: vUrl,
              public_id: selectedVariant.image.alterImage.public_id,
              _id: `${selectedVariant._id}-img`,
            };
      media.splice(media.length ? 1 : 0, 0, vItem);
    }

    media.push(...images);
    return media;
  }, [product.images, product.video, selectedVariant]);

  // Compute selectedMediaUrl for the variant
  const selectedMediaUrl = useMemo(() => {
    if (variantPicked && selectedVariant?.image) {
      return (
        selectedVariant.image.alterImage.optimizeUrl ||
        selectedVariant.image.alterImage.secure_url
      );
    }
    return undefined;
  }, [variantPicked, selectedVariant]);

  return {
    allMedia,
    selectedMediaUrl,
  };
}
