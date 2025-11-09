import { Product } from "./product";
export interface TWishlistItem {
  productId: string;
  _id: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
  variantValues: string[];
  variantId: string;
  isDescountActive: boolean;
}
