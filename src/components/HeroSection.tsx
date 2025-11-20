// components/HeroSection.tsx   ← এটা Server Component
import { getBusinessServer } from '@/lib/api/serverApi';
import CategorySection from './ui/organisms/CategorySection';
import HeroSwiperClient from './ui/organisms/HeroSwiperClient';


export default async function HeroSection() {
  const businessData = await getBusinessServer(); // Server এ fetch হচ্ছে

  // তোমার একদম same logic
  const heroSlides = businessData?.businessTheme
    ?.filter((theme: any) => theme.isActive === true)
    .map((theme: any) => ({
      redirectUrl: theme.redirect_URL || '#',
      mobile: theme.slider_Mobile?.alterImage?.optimizeUrl || theme.slider_Mobile?.alterImage?.secure_url,
      tab: theme.slider_Tab?.alterImage?.optimizeUrl || theme.slider_Tab?.alterImage?.secure_url,
      desktop: theme.slider_Desktop?.alterImage?.optimizeUrl || theme.slider_Desktop?.alterImage?.secure_url,
      fallback: theme.slider?.alterImage?.optimizeUrl || theme.slider?.alterImage?.secure_url || '/assets/placeholder.webp',
    }))
    .filter(slide => slide.fallback || slide.desktop || slide.mobile || slide.tab);

  const categories = businessData?.categories?.slice(0, 5) ?? [];

  if (!heroSlides || heroSlides.length === 0) {
    return null;
  }

  return (
    <div className="pb-12 md:pb-0 lg:container md:container mx-auto lg:mt-12 md:mt-12 mt-8">
      {/* Swiper টা client-এ আছে, কিন্তু slides গুলো SSR থেকে পাচ্ছে */}
      <div className="relative w-full overflow-hidden h-[260px] md:h-[800px] lg:h-[800px]">
        <HeroSwiperClient slides={heroSlides} />
      </div>

      {/* Category buttons আলাদা কম্পোনেন্ট করলাম যাতে router ব্যবহার করতে পারি */}
      <CategorySection categories={categories} />
    </div>
  );
}