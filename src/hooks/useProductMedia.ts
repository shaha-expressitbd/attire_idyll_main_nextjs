"use client";

import { useMemo } from "react";
import type { Product, Variant } from "@/types/product";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

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
  // Move useSelector OUTSIDE useMemo
  const cloudStorageUrl = useSelector(
    (state: RootState) => state.business.data?.cloud_storage_url
  );

  const allMedia = useMemo<MediaItem[]>(() => {
    const media: MediaItem[] = [];

    // Add video if available
    if (product.video?.[0]?.video) {
      const videoUrl =
        product.video[0].alterVideo?.secure_url ||
        product.video[0].video.secure_url;

      if (videoUrl && cloudStorageUrl) {
        media.push({
          type: "video",
          url: `${cloudStorageUrl}/${process.env.NEXT_PUBLIC_OWNER_ID}/original${videoUrl}`,
          public_id: product.video[0].video.public_id,
          _id: product.video[0]._id,
        });
      }
    }

    // Add product images
    const images: MediaItem[] = product.images.map((img) => {
      const imageUrl =
        img.alterImage?.optimizeUrl || img.alterImage?.secure_url;
      return {
        type: "image",
        url: imageUrl || "/assets/fallback.jpg",
        public_id: img.image.public_id,
        _id: img._id,
      };
    });

    // Handle selected variant image
    if (selectedVariant?.image) {
      const vUrl =
        selectedVariant.image.alterImage?.optimizeUrl ||
        selectedVariant.image.alterImage?.secure_url;

      if (vUrl) {
        const idx = images.findIndex((i) => i.url === vUrl);
        let vItem: MediaItem;

        if (idx > -1) {
          vItem = images.splice(idx, 1)[0];
        } else {
          vItem = {
            type: "image",
            url: vUrl,
            public_id: selectedVariant.image.alterImage?.public_id,
            _id: `${selectedVariant._id}-img`,
          };
        }

        // Insert variant image at position 1 (after video, if any)
        media.splice(media.length > 0 ? 1 : 0, 0, vItem);
      }
    }

    media.push(...images);
    return media;
  }, [product.images, product.video, selectedVariant, cloudStorageUrl]);

  const selectedMediaUrl = useMemo(() => {
    if (variantPicked && selectedVariant?.image) {
      return (
        selectedVariant.image.alterImage?.optimizeUrl ||
        selectedVariant.image.alterImage?.secure_url
      );
    }
    return undefined;
  }, [variantPicked, selectedVariant]);

  return {
    allMedia,
    selectedMediaUrl,
  };
}
