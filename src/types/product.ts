// Product Types (from pasted document)
import { MetaResponse } from "./metaResponse";

export interface ProductResponse {
  status: number;
  success: boolean;
  message: string;
  meta: MetaResponse;
  data: Product[];
}

export interface Product {
  _id: string;
  name: string;
  short_description: string;
  long_description: string;
  tags: string[];
  images: Image[];
  video: Video[];
  brand: {
    _id: string;
    name: string;
  };
  sizeGuard?: {
    _id: string;
    name: string;
  };
  sub_category: {
    _id: string;
    name: string;
  }[];
  category_group?: {
    _id: string;
    name: string;
  }[];
  main_category?: {
    _id: string;
    name: string;
  }[];
  total_stock: number;
  total_sold: number;
  hasVariants: boolean;
  variantsId: Variant[];
  variantsGroup: VariantGroup[];
  business_category_group?: any;
  currency: string;
  search_keywords?: string[];
  isPublish: boolean;
  isPreOrder?: boolean;
  selling_price: number;
  finalPrice: number;
  related_products: Product[];
}

export interface Image {
  _id: string;
  image: {
    public_id: string;
    secure_url: string;
    optimizeUrl: string;
  };
  alterImage: {
    public_id: string;
    secure_url: string;
    optimizeUrl: string;
  };
}

export interface Video {
  _id: string;
  video?: {
    public_id: string;
    secure_url: string;
  };
  alterVideo?: {
    public_id: string;
    secure_url: string;
  };
}

export interface Variant {
  _id: string;
  productId: string;
  name: string;
  image: Image;
  barcode: string;
  sku: string;
  selling_price: string;
  finalPrice: number;
  condition: string;
  discount_type: string | null;
  discount_percent: string;
  discount_amount: string;
  discount_start_date: string | null;
  discount_end_date: string | null;
  offer_price: string;
  variants_stock: number;
  variants_values: string[] | null;
  total_sold: number;
  isPublish: boolean;
  isPreOrder: boolean;
  isDiscountActive: boolean;
}

export interface VariantGroup {
  variantName: string;
  variantValue: string[];
}
