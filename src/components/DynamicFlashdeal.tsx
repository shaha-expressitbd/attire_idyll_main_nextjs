/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/organisms/product-card';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { FlashDealTimeCounter } from './ui/atoms/FlashDealTimeCounter';
import FlashDealsSkeleton from './ui/skeleton/FlashDealsSkeleton';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */
const getCategoryName = (p: Product) =>
  p.sub_category?.[0]?.name ?? 'Uncategorised';

const toNumber = (v: string | number | undefined | null) =>
  v === undefined || v === null ? 0 : Number(v);

interface FlashDealsProps {
  initialProducts: Product[];
}

// Loading states
type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

interface LoadingStateData {
  state: LoadingState;
  data: Product[] | null;
  error: string | null;
}

function FlashDeals({ initialProducts }: FlashDealsProps) {
  const router = useRouter();

  /* ───────── State ───────── */
  const [state, setState] = useState<LoadingStateData>({
    state: 'idle',
    data: null,
    error: null,
  });

  const [swiper, setSwiper] = useState<any>(null);

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const [showNav, setShowNav] = useState({ prev: false, next: false });

  /* ───────── Initialize loading ───────── */
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setState({ state: 'succeeded', data: initialProducts, error: null });
    }
  }, [initialProducts]);

  /* ───────── Derived Data ───────── */
  const deals = useMemo(() => {
    if (!state.data) {
      return [];
    }

    const now = Date.now();

    return state.data.filter((p) => {
      const v = p.variantsId?.[0];
      const end = v?.discount_end_date;
      const start = v?.discount_start_date;
      const discountPercent = toNumber(v?.discount_percent);

      if (!end || discountPercent <= 0) return false;

      const endTime = new Date(end).getTime();
      const startTime = start ? new Date(start).getTime() : 0;

      return now >= startTime && now <= endTime;
    }).sort((a, b) => {
      const da = toNumber(a.variantsId?.[0]?.discount_percent);
      const db = toNumber(b.variantsId?.[0]?.discount_percent);
      return db - da;
    });
  }, [state.data]);

  const updateNav = () => {
    if (!swiper) return;
    setShowNav({ prev: !swiper.isBeginning, next: !swiper.isEnd });
  };

  useEffect(updateNav, [swiper, deals]);

  /* ───────── JSX ───────── */
  if (state.state === 'failed') {
    return (
      <div className="max-w-7xl mx-auto px-2 md:px-6 py-2 md:mt-24 text-center">
        <div className="py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
            Failed to load flash deals
          </h3>
        </div>
      </div>
    );
  }

  if (state.state === 'loading' || state.data === null) {
    return <FlashDealsSkeleton />;
  }

  if (deals.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="py-4 space-y-6">
        <section className="group/section py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 container mx-auto">
            <div className="col-span-12 relative md:px-4 sm:px-0 px-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary dark:text-gray-100 capitalize flex items-center justify-between">
                Flash Deals
                {/* Custom Swiper Nav Buttons */}
                <div className="flex gap-1 ml-4">
                  {showNav.prev && (
                    <div
                      ref={prevRef}
                      className="p-2 rounded-full bg-secondary dark:bg-primary shadow dark:hover:bg-green-100 hover:bg-green-50 transition"
                    >
                      <HiOutlineChevronLeft className="h-5 w-5 text-gray-700" />
                    </div>
                  )}
                  {showNav.next && (
                    <div
                      ref={nextRef}
                      className="p-2 rounded-full bg-secondary dark:bg-primary shadow hover:bg-green-50 dark:hover:bg-green-100 transition"
                    >
                      <HiOutlineChevronRight className="h-5 w-5 text-gray-700" />
                    </div>
                  )}

                  <button
                    onClick={() => router.push('/flashdeals')}
                    className="px-2 py-2 text-sm bg-secondary dark:bg-primary text-gray-700 rounded shadow hover:bg-green-50 dark:hover:bg-green-100 transition"
                  >
                    See More
                  </button>
                </div>
              </h2>

              <div className="mt-4">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={8}
                  slidesPerView={2}
                  breakpoints={{
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  loop={false}
                  autoplay={{ delay: 4000 }}
                  onSwiper={setSwiper}
                  onSlideChange={updateNav}
                  className="py-8"
                >
                  {deals.map((deal) => (
                    <SwiperSlide key={deal._id} className="relative">
                      <div className="transform transition-transform relative">
                        <div className="flex absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 items-center justify-center z-10">
                          <FlashDealTimeCounter endDate={deal.variantsId?.[0]?.discount_end_date ?? ''} />
                        </div>
                        <ProductCard product={deal} isAboveFold={false} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FlashDeals;