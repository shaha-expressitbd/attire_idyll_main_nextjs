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

  const progressCircle = useRef<SVGSVGElement>(null);
  const progressContent = useRef<HTMLSpanElement>(null);

  // Active & valid slides from businessTheme
  const heroSlides = businessData?.businessTheme
    ?.filter((theme: any) => theme.isActive === true)
    .map((theme: any) => ({
      redirectUrl: theme.redirect_URL || '#',
      // Device-specific images (priority: mobile → tab → desktop → alterImage)
      mobile: theme.slider_Mobile?.alterImage?.optimizeUrl || theme.slider_Mobile?.alterImage?.secure_url,
      tab: theme.slider_Tab?.alterImage?.optimizeUrl || theme.slider_Tab?.alterImage?.secure_url,
      desktop: theme.slider_Desktop?.alterImage?.optimizeUrl || theme.slider_Desktop?.alterImage?.secure_url,
      fallback: theme.slider?.alterImage?.optimizeUrl || theme.slider?.alterImage?.secure_url || '/assets/placeholder.webp',
    }))
    .filter(slide => slide.fallback || slide.desktop || slide.mobile || slide.tab); // at least one image

  const onAutoplayTimeLeft = (_: any, time: number, progress: number) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  // Category buttons remain same
  const CATEGORIES = businessData?.categories?.slice(0, 5) ?? [];

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

  if (!heroSlides || heroSlides.length === 0) {
    return null; // or fallback UI
  }

  return (
    <div className="pb-12 md:pb-0 lg:container md:container mx-auto lg:mt-12 md:mt-12 mt-8">
      <div className="relative w-full overflow-hidden h-[260px] md:h-[800px] lg:h-[800px]">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper w-full h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <a
                href={slide.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full cursor-pointer"
              >
                <picture className="block w-full h-full">
                  {/* Mobile */}
                  {slide.mobile && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={slide.mobile}
                    />
                  )}
                  {/* Tablet */}
                  {slide.tab && (
                    <source
                      media="(min-width: 768px) and (max-width: 1023px)"
                      srcSet={slide.tab}
                    />
                  )}
                  {/* Desktop */}
                  {slide.desktop && (
                    <source
                      media="(min-width: 1024px)"
                      srcSet={slide.desktop}
                    />
                  )}
                  {/* Fallback Image */}
                  <Image
                    src={slide.fallback}
                    alt={`Hero slide ${index + 1}`}
                    fill
                    sizes="100vw"
                    objectFit="contain"
                    variant="original"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Category Buttons - unchanged */}
      <div className="w-full mx-auto space-y-4 mt-10">
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
                  className="h-12 rounded-lg border border-gray-300 bg-white dark:bg-secondary dark:text-white text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition"
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
                  className=" w-full h-16 rounded-lg border border-gray-300 bg-white dark:bg-secondary dark:text-white  text-base font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition"
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