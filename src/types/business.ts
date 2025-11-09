import { MetaResponse } from "./metaResponse";

export interface BusinessResponse {
  status: number;
  success: boolean;
  message: string;
  meta: MetaResponse;
  data: Business[];
}

export interface Owner {
  name: string;
}

export interface Image {
  public_id: string;
  secure_url: string;
  optimizeUrl: string;
}

export interface Category {
  _id: string;
  name: string;
  children: Category[];
  products?: number;
}
export interface SSLPaymentMethod {
  name: string;
  logo: string;
}

export interface SSLCommerzConfig {
  account_id: boolean;
  isActive_SSLCommerz: boolean;
  payment_methods: SSLPaymentMethod[];
}

export interface Business {
  _id: string;
  owner: Owner;
  email: string;
  phone: string;
  businessName: string;
  categories: Category[];
  website: string;
  socialMedia: string;
  logo: Image;
  alterImage: Image;
  insideDhaka: number;
  outsideDhaka: number;
  subDhaka: number;
  currency: string[];
  location: string;
  defaultCourier: string;
  ssl_commerz?: SSLCommerzConfig;
}
