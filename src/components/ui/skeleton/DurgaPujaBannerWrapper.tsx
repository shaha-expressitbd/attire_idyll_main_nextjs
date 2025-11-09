"use client";

import React, { useState, useEffect } from "react";
import DurgaPujaBanner from "@/components/DurgaPujaBanner";
import DurgaPujaBannerSkeleton from "./DurgaPujaBannerSkeleton";

const DurgaPujaBannerWrapper: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulated loading delay (replace with actual API call logic)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 second delay
        return () => clearTimeout(timer);
    }, []);

    return isLoading ? <DurgaPujaBannerSkeleton /> : <DurgaPujaBanner />;
};

export default DurgaPujaBannerWrapper;