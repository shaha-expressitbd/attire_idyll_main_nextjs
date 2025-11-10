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

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push(`/products?category=${categoryId}&name=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  return (
    <div className="pb-12 md:pb-0">
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
              { src: '/assets/banner/Bride-1.webp', alt: 'Hero Necklace' },
              { src: '/assets/banner/bride-12.webp', alt: 'Bracelet' },
              { src: '/assets/banner/bride-13.webp', alt: 'Earrings' },
              { src: '/assets/banner/bride-14.webp', alt: 'Earrings' },
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
                      priority={index === 0} // Priority for the first slide only

                      loading={index === 0 ? 'eager' : 'lazy'} // Lazy load non-critical slides
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Desktop Category Chips */}
        <div className="hidden md:block absolute bottom-2 left-0 w-full z-20">
          <div className="flex justify-center px-4">
            <div className="inline-flex overflow-x-auto max-w-full py-1 sm:py-2 px-2 sm:px-4 rounded-full bg-primary/70 backdrop-blur-sm">
              <div className="flex gap-1 sm:gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat._id, cat.name)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary backdrop-blur-sm text-white border border-white rounded-full hover:shadow transition-all min-w-[120px] text-sm"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={getCategoryImage(cat)}
                        alt={`${cat.name} category`}
                        width={32}
                        height={32}
                        className="object-cover"

                        loading="lazy" // Lazy load category images
                      />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Mobile Category Chips */}
        <div className="md:hidden absolute left-0 w-full z-20 px-2 mt-2">
          <div className="bg-primary/70 backdrop-blur-sm rounded-full p-2">
            <div className="flex px-2 justify-between mb-2">
              {CATEGORIES.slice(0, 3).map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id, cat.name)}
                  className="flex-1 flex justify-center items-center gap-1 px-2 py-1.5 bg-primary backdrop-blur-sm text-white border border-white rounded-full hover:shadow transition-all text-xs max-w-[100px]"
                  title={cat.name}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={getCategoryImage(cat)}
                      alt={`${cat.name} category`}
                      width={24}
                      height={24}
                      className="object-cover"

                      loading="lazy"
                    />
                  </div>
                  <span className="truncate">
                    {cat.name.length > 10 ? `${cat.name.substring(0, 8)}...` : cat.name}
                  </span>
                </button>
              ))}
            </div>
            {CATEGORIES.length > 3 && (
              <button
                key={CATEGORIES[3]._id}
                onClick={() => handleCategoryClick(CATEGORIES[3]._id, CATEGORIES[3].name)}
                className="w-full flex items-center justify-center gap-2 px-2 py-1.5 bg-primary backdrop-blur-sm text-white border border-white rounded-full hover:shadow transition-all text-xs"
                title={CATEGORIES[3].name}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={getCategoryImage(CATEGORIES[3])}
                    alt={`${CATEGORIES[3].name} category`}
                    width={24}
                    height={24}
                    className="object-cover"

                    loading="lazy"
                  />
                </div>
                <span className="truncate">
                  {CATEGORIES[3].name.length > 20 ? `${CATEGORIES[3].name.substring(0, 18)}...` : CATEGORIES[3].name}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div class="w-full max-w-2xl mx-auto space-y-4">

        <!-- 3 Categories in Same Line -->
        <div class="grid grid-cols-3 gap-3">
          <a href="/woman"
            class="h-12 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition">
            WOMAN
          </a>

          <a href="/man"
            class="h-12 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition">
            MAN
          </a>

          <a href="/kids-family"
            class="h-12 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition">
            KIDS & FAMILY
          </a>
        </div>

        <!-- BRIDAL Full Width -->
        <div class="w-full">
          <a href="/bridal"
            class="block w-full h-16 rounded-lg border border-gray-300 bg-white text-base font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition">
            BRIDAL
          </a>
        </div>

      </div>
    </div>
  );
}