// app/layout.tsx

"use client";
import { storeUtmParams, trackPageView } from "@/utils/gtm";
import { usePathname } from "next/navigation";
import { useEffect } from "react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    performance.mark('root-layout-start');
    trackPageView(pathname);
    storeUtmParams();
    performance.mark('root-layout-end');
    performance.measure('root-layout-load', 'root-layout-start', 'root-layout-end');
    const measure = performance.getEntriesByName('root-layout-load')[0];
    console.log(`RootLayout load time: ${measure.duration}ms`);
  }, [pathname]);

  return (
    <>
      {children}

    </>
  );
}
