"use client";

import React, { useState, useEffect } from "react";
import PromotionBanner from "@/components/PromotionBanner";
import PromotionBannerSkeleton from "@/components/ui/skeleton/PromotionBannerSkeleton";

const PromotionBannerWrapper: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // সিমুলেটেড লোডিং ডিলে (API কলের জন্য পরিবর্তন করতে পারিস)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // ২ সেকেন্ড ডিলে
        return () => clearTimeout(timer);
    }, []);

    return isLoading ? <PromotionBannerSkeleton /> : <PromotionBanner />;
};

export default PromotionBannerWrapper;