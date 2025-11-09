/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface SrcSetItem {
  src: string
  width: number
  breakpoint: number
}

interface ImageProps {
  src: string
  alt: string
  className?: string
  srcSet?: SrcSetItem[]
  sizes?: string
  width?: number | string
  height?: number | string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'eager' | 'lazy'
  decoding?: 'sync' | 'async' | 'auto'
  onClick?: () => void
  role?: string
  tabIndex?: number
  onError?: React.ReactEventHandler<HTMLImageElement>
  fallbackSrc?: string
  onLoad?: React.ReactEventHandler<HTMLImageElement>
  rootMargin?: string
  threshold?: number
  enableIntersectionObserver?: boolean
  fill?: boolean
  placeholder?: 'blur' | undefined
  blurDataURL?: string
  priority?: boolean
  isBlur?: boolean
  variant?: 'original' | 'small' | 'medium' | 'large' // NEW PROP
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
  variant = "medium",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSrc, setCurrentSrc] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [autoDimensions, setAutoDimensions] = useState<{
    width?: string | number
    height?: string | number
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  }>({ width, height, objectFit: propObjectFit })

  const containerRef = useRef<HTMLDivElement>(null)
  const fetchPriorityValue = priority ? 'high' : undefined

  // BASE URL
  const BASE_URL = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${process.env.NEXT_PUBLIC_OWNER_ID}`

  // PROCESS SRC WITH VARIANT
  const processUrl = (url: string, variant?: string): string => {
    if (!url) return ''
    if (!variant || variant === 'original') return url.startsWith('http') ? url : BASE_URL + '/' + variant + url

    const fullUrl = url.startsWith('http') ? url : BASE_URL + '/' + variant + url
    return fullUrl.replace(/\/original\//, `/${variant}/`)
  }

  const processedSrc = processUrl(propSrc, variant)
  const processedFallback = propFallbackSrc ? processUrl(propFallbackSrc, variant) : undefined
  const hasFallback = Boolean(processedFallback)

  // SET INITIAL SRC
  useEffect(() => {
    setCurrentSrc(processedSrc)
  }, [processedSrc])

  // HANDLE LOAD
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    onLoad?.(e)
  }

  // HANDLE ERROR
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    if (hasFallback && currentSrc === processedSrc) {
      setCurrentSrc(processedFallback!)
    }
    // Prevent infinite loop: don't reset to processedSrc if fallback fails
    onError?.(e)
  }

  // AUTO DETECT ASPECT RATIO
  const detectAspectRatio = (src: string) => {
    const img = new window.Image()
    img.src = src

    img.onload = () => {
      const naturalWidth = img.naturalWidth
      const naturalHeight = img.naturalHeight
      const aspectRatio = naturalWidth / naturalHeight
      const isPortrait916 = Math.abs(aspectRatio - 9 / 16) < 0.05
      const calculatedObjectFit = isPortrait916 ? 'cover' : 'contain'

      setAutoDimensions({
        width: '100%',
        height: naturalWidth && naturalHeight ? `${(naturalHeight / naturalWidth) * 100}%` : 'auto',
        objectFit: calculatedObjectFit,
      })
    }

    img.onerror = () => {
      setAutoDimensions({ width: '100%', height: 'auto', objectFit: 'contain' })
    }
  }

  useEffect(() => {
    if (width || height || propObjectFit) {
      setAutoDimensions({ width, height, objectFit: propObjectFit })
      return
    }

    detectAspectRatio(processedSrc)
  }, [processedSrc, width, height, propObjectFit])

  // ROUNDED & OBJECT FIT CLASSES
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded]

  const objectFitClass = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }[autoDimensions.objectFit || 'cover']

  // SRCSET WITH VARIANT
  const generateSrcSet = (): string | undefined => {
    if (!srcSet || hasFallback || !variant || variant === 'original') return undefined

    return srcSet
      .map((item) => {
        const fullSrc = item.src.startsWith('http') ? item.src : BASE_URL + '/' + variant + item.src
        const variantSrc = fullSrc.replace(/\/original\//, `/${variant}/`)
        return `${variantSrc} ${item.width}w`
      })
      .join(', ')
  }

  const generatedSrcSet = generateSrcSet()

  // DEFAULT SIZES
  const generateDefaultSizes = () => {
    if (!srcSet) return '100vw'
    const breakpoints = srcSet.map((item) => item.breakpoint).sort((a, b) => a - b)
    const maxBreakpoint = breakpoints[breakpoints.length - 1]
    return `(max-width: ${maxBreakpoint}px) 100vw, ${maxBreakpoint}px`
  }

  // KEYBOARD SUPPORT
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick?.()
    }
  }

  // INTERSECTION OBSERVER
  useEffect(() => {
    if (!enableIntersectionObserver || loading === 'eager') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin, threshold }
    )

    const currentRef = containerRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      observer.disconnect()
    }
  }, [enableIntersectionObserver, loading, rootMargin, threshold])

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
      {/* BLURRED BACKGROUND */}
      {isBlur && (
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

      {/* MAIN IMAGE */}
      {isVisible && (
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
  )
}

export default Image