// src/lib/fonts.ts  (অথবা যেকোনো lib ফোল্ডারে)

import { Jura, IBM_Plex_Sans_Hebrew } from "next/font/google";

// === Google Fonts ===
export const jura = Jura({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans", // এটাই গ্লোবাল ডিফল্ট হবে
});

export const hebrew = IBM_Plex_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-hebrew",
});
