'use client';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useBusiness } from '@/hooks/useBusiness';
import { useRouter } from 'next/navigation';
import Image from './ui/atoms/image';
import Link from 'next/link';

export default function HeroSection() {
  const { businessData } = useBusiness();
  const router = useRouter();
  const CATEGORIES = businessData?.categories.slice(0, 5) ?? [];
  const progressCircle = useRef<SVGSVGElement | null>(null);
  const progressContent = useRef<HTMLSpanElement | null>(null);

  const DEFAULT_IMAGE = '/assets/placeholder.webp';

  // Function to get a fallback image from subcategories if the main category lacks an image
  const getCategoryImage = (category: any) => {
    if (category.image?.optimizeUrl) {
      return category.image.optimizeUrl;
    }
    const subCategoryWithImage = category.children?.find((child: any) => child.image?.optimizeUrl);
    return subCategoryWithImage?.image?.optimizeUrl || DEFAULT_IMAGE;
  };

  const onAutoplayTimeLeft = (_: import('swiper').Swiper, time: number, progress: number) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const slug = categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    router.push(`/maincategory/${slug}`);
  };

  return (
    <div className="pb-12 md:pb-0 lg:container md:container mx-auto lg:mt-12 md:mt-12 mt-8">
      <div className="relative w-full overflow-hidden h-[260px] md:h-[800px] lg:h-[800px] md:pb-10">
        <section className="w-full h-full">
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="mySwiper w-full h-full"
          >
            {[
              { src: '/upload/images/bride-14-160707.webp', alt: 'Hero Necklace' },
              { src: '/upload/images/bride-13-795681.webp', alt: 'Bracelet' },
              { src: '/upload/images/bride-12-313748.webp', alt: 'Earrings' },
              { src: '/upload/images/Bride-1-994403.webp', alt: 'Earrings' },
            ].map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full flex flex-col md:flex-row items-center">
                  <div className="w-full h-full">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      variant='original'
                      // Priority for the first slide only

                      loading={index === 0 ? 'eager' : 'lazy'} // Lazy load non-critical slides
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>


      </div>

      <div className="w-full mx-auto space-y-4">
        {CATEGORIES.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.slice(0, 3).map((category) => (
                <Link
                  key={category._id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.name);
                  }}
                  className="h-12 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition"
                >
                  {category.name.toUpperCase()}
                </Link>
              ))}
            </div>

            {CATEGORIES.length > 3 && (
              <div className="w-full">
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(CATEGORIES[3].name);
                  }}
                  className="block w-full h-16 rounded-lg border border-gray-300 bg-white text-base font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition"
                >
                  {CATEGORIES[3].name.toUpperCase()}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}