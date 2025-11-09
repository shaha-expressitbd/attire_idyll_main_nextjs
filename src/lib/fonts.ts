import {
  Noto_Sans_Bengali,
  Plus_Jakarta_Sans,
  Poppins,
  Urbanist,
} from "next/font/google";

export const notosans = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto",
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});
