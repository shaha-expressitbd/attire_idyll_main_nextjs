// "use client";

// import { usePathname } from "next/navigation";

// export default function PoweredByBar() {
//   const pathname = usePathname();

//   // ✅ চাইলে এখানে route-check করে দিতে পারো
//   // উদাহরণ: শুধু collections রুটে দেখাতে চাইলে নিচের লাইন আনকমেন্ট করো
//   // if (!pathname?.startsWith("/collections")) return null;

//   return (
//     <div>

//       {/* mobile */}
//     <div className="sm:block md:hidden bottom-0 left-0 mx-auto w-[100%] max-w-[400px] h-[30px] bg-black py-2 mt-1 mb-36 text-center flex items-center justify-center gap-1 z-10">
//       <p className="text-white text-sm">© 2025 Powered by</p>
//       <a href="https://calquick.app">
//         <img className="w-[56px]" src="/assets/logo4.webp" alt="CalQuick Logo" />
//       </a>
//     </div>


// {/* dekstop */}
// <div className=" hidden sm:flex  fixed bottom-0 left-0 right-0 bg-black py-2  mt-24  text-center flex items-center justify-center  gap-1 z-50">
//   <p className="text-white text-sm">© 2025 Powered by</p>
//   <a href="https://calquick.app">
//     <img className="w-[70px]" src="/assets/logo4.webp" alt="CalQuick Logo"/>
//   </a>
// </div>


// </div>
//   );
// }


"use client";

import { usePathname } from "next/navigation";

export default function PoweredByBar() {
  const pathname = usePathname();

  // উদাহরণ: শুধু collections এ দেখাতে চাইলে:
  // if (!pathname?.startsWith("/collections")) return null;

  return (
    <>
      {/* ✅ Spacer: fixed footer-এর জন্য উপরের গ্যাপ রিজার্ভ */}
      <div className="h-[30px] sm:h-[120px]" />

      {/* ✅ Mobile (fixed) */}
 <div className="sm:block md:hidden bottom-0 left-0 mx-auto w-[100%] max-w-[400px] h-[30px] bg-black py-2 mt-1 mb-36 text-center flex items-center justify-center gap-1 z-10">
        <p className="text-white text-sm">© 2025 Powered by</p>
        <a href="https://calquick.app">
          <img className="w-[56px]" src="/assets/logo4.webp" alt="CalQuick Logo" />
        </a>
      </div>

      {/* ✅ Desktop (fixed) */}
      {/* ✅ Desktop Footer */}
      <div className="hidden sm:flex fixed bottom-0 left-0 right-0 bg-black h-[44px] px-4 text-center items-center justify-center gap-x-4 z-50">
        <p className="text-white text-sm">© 2025 Powered by</p>
        <a href="https://calquick.app">
          <img className="w-[70px]" src="/assets/logo4.webp" alt="CalQuick Logo" />
        </a>
      </div>
    </>
  );
}

