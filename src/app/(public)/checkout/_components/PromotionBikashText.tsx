import Image from "next/image";
import React from "react";

export default function PromotionBikashText() {
  return (
    <>
      <div className="block md:hidden fixed top-0 left-0 right-0 z-50 overflow-x-hidden bg-primary text-white w-full">
        <div className="py-1 animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="inline-flex items-center mx-4">
              <Image
                width={24}
                height={24}
                src="/assets/bKash-Icon3.png"
                alt="Promotion Icon"
                className="h-6 w-6 object-contain mr-2"
              />
              <span className="text-xl sm:text-lg font-noto">
                বিকাশ পেমেন্টে ১০০ টাকা পর্যন্ত ক্যাশব্যাক!
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="md:block hidden relative overflow-x-hidden bg-primary text-white w-full">
        <div className="py-1 animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="inline-flex items-center mx-4">
              <Image
                width={24}
                height={24}
                src="/assets/bKash-Icon3.png"
                alt="Promotion Icon"
                className="h-6 w-6 object-contain mr-2"
              />
              <span className="text-xl inline-block font-noto">
                বিকাশ পেমেন্টে ১০০ টাকা পর্যন্ত ক্যাশব্যাক!
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}