"use client";


import Link from "next/link";
import Image from "./ui/atoms/image";

export default function PromotionBanner() {
  return (
    <div className="bg-tertiary dark:bg-black px-4 md:px-8 py-8 md:py-10 xl:p-20 mt-0 md:mt-12 lg:mt-16 mb-0">

      <div className="bg-[#FFEBF0] dark:bg-gray-600 rounded-3xl w-full relative overflow-hidden   md:mt-12  lg:-mt-4  xl:-mt-8">
        <div className="grid grid-cols-12 ">
          {/* Left Side: Text Content */}
          <div className="flex flex-col justify-center items-center text-center sm:text-left px-4 col-span-7">
            <div className="md:hidden block w-32 ml-4 mt-4">
              <Link href="/">
                <img
                  src="/assets/logo.png"
                  alt="G' Lore Logo"
                  width={120}
                  height={40}

                  className="h-10 md:h-12 object-contain"
                />
              </Link>
            </div>
            <div className="space-y-4 pt-5 md:pt-2 lg:ml-16 dark:text-white  ">
              <h1 className="text-3xl lg:text-6xl font-bold leading-tight lg:leading-normal font-serif ml-16 lg:ml-72">
                <span>New</span> <br />
                <span className="text-primary  -ml-8 lg:-ml-20 ">
                  Collection
                </span>
              </h1>
              <div className="text-sm md:text-lg md:leading-relaxed ">
                {/*dekstop*/}
                <p className="hidden md:block ipad-mini:hidden ">
                  <span className="text-primary  ml-4 lg:ml-44 inline-block ">
                    ✨AttireIdyll
                  </span>

                  <span className="lg:ml-0 inline-block font-serif  ">
                    - Step into fashion with AttireIdyll in a new horizon! ❤️
                  </span>
                </p>

                {/*mobile*/}

                <div className="text-sm md:text-lg md:leading-relaxed md:hidden ipad-mini:hidden">
                  {" "}
                  <div className=" block">
                    ✨<span className="text-primary">AttireIdyll</span> - Step into fashion
                    in a new
                  </div>
                  <span className="block break-words pl-8">
                    {" "}
                    horizon! ❤️
                  </span>{" "}
                </div>

                {/* iPad Mini */}
                <div className="hidden ipad-mini:block text-center">
                  ✨<span className="text-primary">AttireIdyll</span> - Step into fashion
                  in a new horizon!
                  <br />
                  ❤️
                </div>

                <span className="hidden md:block font-serif">
                  <span className="lg:ml-44 ">
                    Our exclusive new collection is now available!
                  </span>{" "}
                  <br />
                  <span className="lg:ml-24 ">
                    Find your favorite fashion style and dress yourself
                    uniquely. ❤️
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-2 mb-4 mobile-lg:mb-8">
              <a
                className="inline-block bg-primary px-3.5 py-2 xl:px-10 md:py-3.5 rounded-xl  xl:ml-32 xl:mt-8 mt-1 font-bold text-sm md:text-[16px] text-white dark:text-white  transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                href="/products"
              >
                Order Now
              </a>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex justify-center sm:justify-end px-4 lg:px-32 lg:w-350px sm:w-100px col-span-5 md:mt-16 mobile-xs:mt-8 h-full">
            <Image
              src="/upload/images/banner-511845.webp"
              // src="/assets/banner.png"
              alt="AttireIdyll"
              objectFit='contain'
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyCrA3j9kdKfE8XIWz99PW+U+NiujMj6mycqyLjvLzUPGIjvfOI6ZxJBQQshkqKaMyMexCjVIJCmPwDLXQ7xEMGkJNN4Dr8T8jjPmxeQaGqrCFATxpKJHFYP8X+zMmUZYFatPEbrBl BEK TSWvhQgxQC1jWbQxVxCRNXAHQx8ONDnTKk+EzTjqRzTF7mDxj7LJWJqQThQ+kMGZPrrEYGFLKQWCjHgMPDkakSxvLkAPMfLKOTEQwLCzjlSRKlXjHIJKpKzwGiOMFhSJBrTTHIsBKLSxyPdRaJHzhkGjWvVH2aPd6WJHFUkReTxGUfAATrCwZK80qAaGjjSMNpQqWxZo+yP8MPYRHSwMqRIoaDHJvy+y6fvRzMruxxSPkPdIgIBBHGxCNKxOGwFWLVOpNSyUlPC8tLJJTTHKjbcLY7YWภู"
              className="pt-5 rounded-lg mobile-lg:scale-[1.23] mobile-sm:scale-[1.30] mobile-xs:scale-[1.38]  min-h-full"
              variant="large"

            />
          </div>
        </div>
      </div>
    </div>




  );
}
