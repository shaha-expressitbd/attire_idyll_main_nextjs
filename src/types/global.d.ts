declare global {
  interface Window {
    dataLayer: any[];
  }
}

declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
declare module "swiper/css/thumbs";

export {};
