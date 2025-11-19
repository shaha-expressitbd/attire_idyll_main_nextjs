/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';


interface SrcSetItem {
  src: string;
  width: number;
  breakpoint: number;
}

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  srcSet?: SrcSetItem[];
  sizes?: string;
  width?: number | string;
  height?: number | string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  fallbackSrc?: string;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  rootMargin?: string;
  threshold?: number;
  enableIntersectionObserver?: boolean;
  fill?: boolean;
  placeholder?: 'blur' | undefined;
  blurDataURL?: string;
  priority?: boolean;
  isBlur?: boolean;
  variant?: 'original' | 'small' | 'medium' | 'large';
}

const Image: React.FC<ImageProps> = ({
  src: propSrc,
  alt,
  className,
  width,
  height,
  srcSet,
  sizes,
  rounded = 'none',
  objectFit: propObjectFit = 'cover',
  loading = 'lazy',
  decoding = 'async',
  onClick,
  role,
  tabIndex,
  onError,
  fallbackSrc: propFallbackSrc,
  onLoad,
  rootMargin = '100px',
  threshold = 0.1,
  enableIntersectionObserver = false,
  fill = false,
  placeholder,
  blurDataURL,
  priority = false,
  isBlur = false,
  variant = 'medium', // ডিফল্ট medium
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [autoDimensions, setAutoDimensions] = useState<{
    width?: string | number;
    height?: string | number;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  }>({ width, height, objectFit: propObjectFit });

  const containerRef = useRef<HTMLDivElement>(null);
  const fetchPriorityValue = priority ? 'high' : undefined;

  // Redux থেকে cloud_storage_url নেওয়া
  const cloudStorageUrl = useSelector((state: RootState) => state.business.data?.cloud_storage_url);
  const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;

  // Dynamic BASE_URL
  const BASE_URL = cloudStorageUrl ? `${cloudStorageUrl}/${ownerId}` : '';

  // {quality} → variant দিয়ে রিপ্লেস
  const replaceQuality = (url: string, variant: string): string => {
    if (!url) return '';
    return url.replace('{quality}', variant);
  };

  // URL প্রসেস করা (variant + {quality} রিপ্লেস)
  const processUrl = (url: string, variant?: string): string => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !BASE_URL) return '';

    let finalUrl = trimmedUrl;

    // যদি absolute URL হয়
    if (trimmedUrl.startsWith('http')) {
      finalUrl = trimmedUrl;
    } else {
      // relative URL
      const variantPath = variant && variant !== 'original' ? `/${variant}` : '/original';
      finalUrl = `${BASE_URL}${variantPath}${trimmedUrl.startsWith('/') ? '' : '/'}${trimmedUrl}`;
    }

    // {quality} রিপ্লেস করো
    if (variant && variant !== 'original') {
      finalUrl = replaceQuality(finalUrl, variant);
    }

    // /original/ → /variant/ রিপ্লেস (যদি থাকে)
    if (variant && variant !== 'original') {
      finalUrl = finalUrl.replace(/\/original\//g, `/${variant}/`);
    }

    return finalUrl;
  };

  const processedSrc = processUrl(propSrc, variant);
  const processedFallback = propFallbackSrc ? processUrl(propFallbackSrc, variant) : undefined;
  const hasFallback = Boolean(processedFallback);

  // currentSrc আপডেট
  useEffect(() => {
    setCurrentSrc(processedSrc);
  }, [processedSrc, cloudStorageUrl, variant]);

  // Load হ্যান্ডলার
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  // Error হ্যান্ডলার
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    if (hasFallback && currentSrc === processedSrc) {
      setCurrentSrc(processedFallback!);
    }
    onError?.(e);
  };

  // Auto aspect ratio
  const detectAspectRatio = (src: string) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      if (!naturalWidth || !naturalHeight) return;

      const aspectRatio = naturalWidth / naturalHeight;
      const isPortrait916 = Math.abs(aspectRatio - 9 / 16) < 0.05;
      const calculatedObjectFit = isPortrait916 ? 'cover' : 'contain';

      setAutoDimensions({
        width: '100%',
        height: `${(naturalHeight / naturalWidth) * 100}%`,
        objectFit: calculatedObjectFit,
      });
    };
    img.onerror = () => {
      setAutoDimensions({ width: '100%', height: 'auto', objectFit: 'contain' });
    };
  };

  useEffect(() => {
    if (width || height || propObjectFit) {
      setAutoDimensions({ width, height, objectFit: propObjectFit });
      return;
    }
    if (processedSrc) detectAspectRatio(processedSrc);
  }, [processedSrc, width, height, propObjectFit]);

  // Classes
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  const objectFitClass = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }[autoDimensions.objectFit || 'cover'];

  // srcSet with {quality} replace
  const generateSrcSet = (): string | undefined => {
    if (!srcSet || hasFallback || !variant || variant === 'original' || !BASE_URL) return undefined;

    return srcSet
      .map((item) => {
        let fullSrc = item.src.startsWith('http')
          ? item.src
          : `${BASE_URL}/${variant}${item.src.startsWith('/') ? '' : '/'}${item.src}`;

        fullSrc = replaceQuality(fullSrc, variant);
        fullSrc = fullSrc.replace(/\/original\//g, `/${variant}/`);

        return `${fullSrc} ${item.width}w`;
      })
      .join(', ');
  };

  const generatedSrcSet = generateSrcSet();

  const generateDefaultSizes = () => {
    if (!srcSet) return '100vw';
    const breakpoints = srcSet.map((item) => item.breakpoint).sort((a, b) => a - b);
    const maxBreakpoint = breakpoints[breakpoints.length - 1];
    return `(max-width: ${maxBreakpoint}px) 100vw, ${maxBreakpoint}px`;
  };

  // Keyboard
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  // Intersection Observer
  useEffect(() => {
    if (!enableIntersectionObserver || loading === 'eager') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin, threshold }
    );

    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => observer.disconnect();
  }, [enableIntersectionObserver, loading, rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        'relative h-full w-full overflow-hidden',
        className,
        onClick && 'cursor-pointer',
        fill && 'h-full'
      )}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={role}
      tabIndex={tabIndex}
    >
      {/* Blurred Background */}
      {isBlur && ((blurDataURL && blurDataURL.trim() !== '') || (currentSrc && currentSrc.trim() !== '')) && (
        <img
          src={blurDataURL || currentSrc}
          alt={`${alt} blurred background`}
          className={twMerge(
            'absolute inset-0 h-full w-full blur-xl object-cover scale-110 z-0',
            roundedClass
          )}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriorityValue}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Main Image */}
      {isVisible && currentSrc && currentSrc.trim() !== '' && (
        <img
          src={currentSrc}
          alt={alt}
          srcSet={currentSrc === processedSrc ? undefined : generatedSrcSet}
          sizes={currentSrc === processedSrc ? undefined : sizes || generateDefaultSizes()}
          className={twMerge(
            'relative h-full w-full transition-opacity duration-300',
            roundedClass,
            objectFitClass,
            isLoading ? 'opacity-0' : 'opacity-100',
            onClick && 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          )}
          style={{
            ...(autoDimensions.width ? { width: autoDimensions.width } : {}),
            ...(autoDimensions.height ? { height: autoDimensions.height } : {}),
          }}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriorityValue}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default Image;