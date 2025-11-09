// "use client";

// import { useBusiness } from "@/hooks/useBusiness";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// export default function Logo() {
//   const { businessData } = useBusiness();
//   const [imgError, setImgError] = useState(false);

//   // Static fallback logo URL
//   const fallbackLogoUrl = "/assets/mega-logo.webp";
//   const logoUrl = businessData?.logo?.secure_url || businessData?.logo?.optimizeUrl || fallbackLogoUrl;
//   // Preload the fallback logo using useEffect
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const img = document.createElement('img');
//       img.src = logoUrl;
//     }
//   }, []);

//   if (!businessData) {
//     // Show fallback immediately while loading
//     return (
//       <Image
//         src={logoUrl}
//         alt="Loading logo"
//         width={160}
//         height={40}
//         priority={true}
//         className="h-12 md:h-16 w-auto"
//       />
//     );
//   }

//   const { businessName, logo } = businessData;

//   // const logoUrl = logo?.optimizeUrl || logo?.secure_url || fallbackLogoUrl;
//   ;

//   if (imgError || !logoUrl) {
//     return <h1 className="text-2xl font-bold">{businessName}</h1>;
//   }

//   return (
//     <Image
//       src={logoUrl}
//       alt={businessName + " logo"}
//       width={160}
//       height={40}
//       priority={true}
//       loading="eager"
//       className="h-12 md:h-16 w-auto"
//       onError={() => setImgError(true)}
//     />
//   );
// }