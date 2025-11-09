'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import DurgaPujaBannerSkeleton from './ui/skeleton/DurgaPujaBannerSkeleton';

interface DurgaPujaBannerProps {
    className?: string;
    alt?: string;
}

const DurgaPujaBanner: React.FC<DurgaPujaBannerProps> = ({
    className,
    alt = "Durga Puja Banner"
}) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    return (
        <div className={`w-full relative pt-0 md:pt-16 lg:pt-8 ${className || ''}`}>  {/* Removed pt-* paddings to avoid shifting/cropping */}
            {status === 'loading' && (
                <div className="absolute inset-0">
                    <DurgaPujaBannerSkeleton />
                </div>
            )}
            {status === 'error' && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <p className="mt-2">Image failed to load</p>
                    </div>
                </div>
            )}
            <div className={`${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                    src={`https://cloudecalquick.xyz/v2/api/files/upload/images/durgapuja-192373.webp`}
                    alt={alt}
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    priority={true}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('error')}
                />
            </div>
        </div>
    );
};

export default DurgaPujaBanner;