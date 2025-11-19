import { Product } from "./product";

// export interface TCartItem {
//   productId: Product["variantsId"][number]["_id"];
//   quantity: number;
// }

export interface TCartItem {
  _id: string;
  variantId?: string;
  name: string;
  price: number;
  sellingPrice?: number;
  image: string;
  quantity: number;
  maxStock: number;
  currency?: string;
  variantValues?: string[];
  variantGroups?: any[];
  isDiscountActive?: boolean;
  isPreOrder?: boolean;
  variantLabel?: string;
}
