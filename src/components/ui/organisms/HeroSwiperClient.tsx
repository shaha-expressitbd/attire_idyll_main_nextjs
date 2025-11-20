// components/HeroSwiperClient.tsx
'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from '../atoms/image';


export default function HeroSwiperClient({ slides }: { slides: any[] }) {
    const progressCircle = useRef<SVGSVGElement>(null);
    const progressContent = useRef<HTMLSpanElement>(null);

    const onAutoplayTimeLeft = (_: any, time: number, progress: number) => {
        if (progressCircle.current && progressContent.current) {
            progressCircle.current.style.setProperty('--progress', String(1 - progress));
            progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
        }
    };

    return (
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
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <a
                        href={slide.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full cursor-pointer"
                    >
                        <picture className="block w-full h-full">
                            {slide.mobile && (
                                <source media="(max-width: 767px)" srcSet={slide.mobile} />
                            )}
                            {slide.tab && (
                                <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={slide.tab} />
                            )}
                            {slide.desktop && (
                                <source media="(min-width: 1024px)" srcSet={slide.desktop} />
                            )}
                            <Image
                                src={slide.fallback}
                                alt={`Hero slide ${index + 1}`}
                                fill
                                sizes="100vw"
                                className="object-contain md:object-cover"
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                variant='original'
                            />
                        </picture>
                    </a>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}