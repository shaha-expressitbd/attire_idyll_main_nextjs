import { ApiResponse } from "@/types/apiResponse";
import { Business, Category } from "@/types/business";
import { OnlineOrderPayload, OnlineOrderResponse } from "@/types/onlineOrder";
import type { Product } from "@/types/product";
import type { Action, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

// Define the Video type based on API response
interface Video {
  _id: string;
  name: string;
  video: {
    alterVideo: {
      public_id: string;
      secure_url: string;
    };
  }[];
}

// Define response type for product with related products
interface ProductWithRelatedResponse {
  product: Product;
  related_products: Product[];
}

// Define filter options types
interface FilterCategory {
  _id: string;
  name: string;
  products: number;
  children: FilterCategory[];
}

interface FilterVariantValue {
  name: string;
  values: string[];
}

interface FilterOptions {
  tags: string[];
  conditions: string[];
  priceRange: {
    min: string;
    max: string;
  };
  variantsValues: FilterVariantValue[];
  categories: FilterCategory[];
}

interface FilterOptionsResponse {
  status: number;
  success: boolean;
  message: string;
  data: Array<{
    tags?: string[];
    conditions?: string[];
    priceRange?: {
      min: string;
      max: string;
    };
    variantsValues?: FilterVariantValue[];
    categories?: FilterCategory[];
  }>;
}

interface PaymentRequestPayload {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_area: string;
  customer_note?: string;
  products: { productId: string; quantity: number }[];
  due: string;
  delivery_charge: number;
  additional_discount_type?: string;
  additional_discount_amount?: string;
  total_amount: number;
  items: { productId: string; quantity: number; price: number; name: string }[];
  total: number;
  paymentMethod: string;
  transactionId: string;
  businessOrderId: string;
  backendOrderId: string;
}

interface PaymentRequestResponse {
  redirectUrl: string;
}

const OWNER_ID = process.env.NEXT_PUBLIC_OWNER_ID;
const BUSINESS_ID = process.env.NEXT_PUBLIC_BUSINESS_ID;
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function isHydrate(action: Action): action is PayloadAction<any> {
  return action.type === HYDRATE;
}

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_API_URL }),
  tagTypes: [
    "Product",
    "Products",
    "Category",
    "Videos",
    "OnlineOrder",
    "Business",
  ],
  extractRehydrationInfo(action, { reducerPath }) {
    if (isHydrate(action)) return action.payload[reducerPath];
  },
  endpoints: (builder) => ({
    /* 1. BUSINESS */
    getBusiness: builder.query<Business, void>({
      query: () => `/public/${OWNER_ID}/${BUSINESS_ID}`,
      transformResponse: (res: ApiResponse<Business[]>) => res.data[0],
      providesTags: ["Business"],
      keepUnusedDataFor: 3600,
    }),

    /* 2. PRODUCTS */
    getProducts: builder.query<
      Product[],
      Partial<{
        search?: string;
        page?: number;
        limit?: number;
        _id?: string;
        categories?: string;
        sizes?: string;
        conditions?: string;
        tags?: string;
        variants?: string;
        priceMin?: number;
        priceMax?: number;
      }>
    >({
      query: (params = {}) => {
        const payload: Record<string, number | string | undefined> = {
          ...params,
        };
        if (payload.search)
          payload.search = decodeURIComponent(String(payload.search)).trim();
        return {
          url: `/public/${OWNER_ID}/${BUSINESS_ID}/products`,
          params: payload,
        };
      },
      transformResponse: (res: ApiResponse<Product[]>) => res.data,
      keepUnusedDataFor: 1200,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    /* SINGLE PRODUCT */
    // getProduct: builder.query<Product, string>({
    //   query: (id) => `/public/${OWNER_ID}/${BUSINESS_ID}/products?_id=${id}`,
    //   transformResponse: (res: ApiResponse<Product>) => res.data,
    //   keepUnusedDataFor: 1800,
    //   providesTags: (r) =>
    //     r
    //       ? [{ type: "Product", id: r._id }]
    //       : [{ type: "Products", id: "LIST" }],
    // }),

    /* 3. ONLINE ORDER */
    createOnlineOrder: builder.mutation<
      OnlineOrderResponse,
      OnlineOrderPayload
    >({
      query: (body) => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}/online-order`;
        return {
          url,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["OnlineOrder"],
    }),

    /* 5. ONLINE ORDER WITH SSL */
    createOnlineOrderWithSSL: builder.mutation<
      OnlineOrderResponse,
      OnlineOrderPayload
    >({
      query: (body) => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}/online-order-with-ssl`;
        return {
          url,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["OnlineOrder"],
    }),

    /* 4. CATEGORIES */
    getCategories: builder.query<Category[], void>({
      query: () => `/public/${OWNER_ID}/${BUSINESS_ID}`,
      transformResponse: (res: ApiResponse<Business[]>) =>
        res.data[0].categories,
      providesTags: (r) =>
        r ? r.map((c) => ({ type: "Category" as const, id: c._id })) : [],
    }),

    /* 5. VIDEOS */
    getVideos: builder.query<
      Video[],
      Partial<{ page?: number; limit?: number }>
    >({
      query: (params = {}) => ({
        url: `/public/${OWNER_ID}/${BUSINESS_ID}/videos`,
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      }),
      transformResponse: (res: ApiResponse<Video[]>) => res.data,
      keepUnusedDataFor: 1200,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Videos" as const,
                id: _id,
              })),
              { type: "Videos", id: "LIST" },
            ]
          : [{ type: "Videos", id: "LIST" }],
    }),

    /* 6. SINGLE PRODUCT WITH RELATED PRODUCTS */
    getProductWithRelated: builder.query<
      ProductWithRelatedResponse,
      { productId: string; relatedProductLimit?: number }
    >({
      query: ({ productId, relatedProductLimit = 8 }) => ({
        url: `/public/${OWNER_ID}/${BUSINESS_ID}/${productId}/product`,
        params: {
          isRelatedProduct: true,
          relatedProductLimit,
          fields:
            "name,short_description,images,variantsId,sub_category,total_stock,total_sold,currency,isPublish,variantsGroup,long_description",
        },
      }),
      transformResponse: (res: ApiResponse<Product>) => ({
        product: res.data,
        related_products: res.data.related_products || [],
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Product", id: result.product._id },
              ...result.related_products.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    /* 7. FILTER OPTIONS */
    getFilterOptions: builder.query<
      FilterOptions,
      Partial<{
        isCategories?: boolean;
        isPriceRange?: boolean;
        isVariantsValues?: boolean;
        isConditions?: boolean;
        isTags?: boolean;
      }>
    >({
      query: (params = {}) => ({
        url: `/public/${OWNER_ID}/${BUSINESS_ID}/filter-options`,
        params: {
          isCategories: params.isCategories ?? true,
          isPriceRange: params.isPriceRange ?? true,
          isVariantsValues: params.isVariantsValues ?? true,
          isConditions: params.isConditions ?? true,
          isTags: params.isTags ?? true,
        },
      }),
      transformResponse: (res: FilterOptionsResponse) => {
        const data = res.data.reduce(
          (acc, item) => ({ ...acc, ...item }),
          {} as any
        );
        return data as FilterOptions;
      },
      providesTags: [{ type: "Products", id: "FILTERS" }], // Optional: for cache invalidation if needed
    }),

    /* 8. PAYMENT REQUEST */
    createPaymentRequest: builder.mutation<
      PaymentRequestResponse,
      PaymentRequestPayload
    >({
      query: (body) => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}/payment-request`;
        return {
          url,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

/* Hook Exports */
export const {
  useGetBusinessQuery,
  useGetProductsQuery,
  useCreateOnlineOrderMutation,
  useCreateOnlineOrderWithSSLMutation,
  useGetCategoriesQuery,
  useGetVideosQuery,
  useGetProductWithRelatedQuery,
  useGetFilterOptionsQuery,
  useCreatePaymentRequestMutation,
} = publicApi;
