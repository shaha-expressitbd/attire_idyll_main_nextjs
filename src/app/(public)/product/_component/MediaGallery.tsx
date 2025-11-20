// MediaGallery.tsx → FINAL LUXURY VERSION (Copy-Paste & Done!)
'use client';

import { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import Image from "@/components/ui/atoms/image";

const BiChevronLeft = dynamic(() => import('react-icons/bi').then(mod => mod.BiChevronLeft), { ssr: false });
const BiChevronRight = dynamic(() => import('react-icons/bi').then(mod => mod.BiChevronRight), { ssr: false });
const BiZoomIn = dynamic(() => import('react-icons/bi').then(mod => mod.BiZoomIn), { ssr: false });
const BiPlay = dynamic(() => import('react-icons/bi').then(mod => mod.BiPlay), { ssr: false });
const FiEye = dynamic(() => import('react-icons/fi').then(mod => mod.FiEye), { ssr: false });

export interface MediaItem {
    type: "image" | "video";
    url: string;
    public_id?: string;
    _id: string;
}

interface MediaGalleryProps {
    media: MediaItem[];
    productName: string;
    stock: number;
    selectedMediaUrl?: string;
    isPreOrder?: boolean;
}

export default function MediaGallery({
    media,
    productName,
    stock,
    selectedMediaUrl,
    isPreOrder = false,
}: MediaGalleryProps) {
    const fallbackImage = "/assets/fallback.jpg";
    const posterUrl = media.find(m => m.type === "image")?.url ?? media[0]?.url ?? fallbackImage;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [mainMedia, setMainMedia] = useState<MediaItem | null>(media[0] || null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [imageLoading, setImageLoading] = useState(true);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [isMobile, setIsMobile] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const touchStartX = useRef(0);
    const lastTap = useRef(0);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (!selectedMediaUrl || !media.length) return;
        const idx = media.findIndex(m => m.url === selectedMediaUrl);
        if (idx !== -1 && idx !== currentIndex) {
            setCurrentIndex(idx);
            setMainMedia(media[idx]);
        }
    }, [selectedMediaUrl, media]);

    useEffect(() => {
        if (media[currentIndex]) {
            setMainMedia(media[currentIndex]);
            setImageLoading(true);
            setVideoLoaded(false);
        }
    }, [currentIndex, media]);

    useEffect(() => {
        if (mainMedia?.type === "video" && videoRef.current && videoLoaded) {
            videoRef.current.play().catch(() => { });
        }
    }, [mainMedia, videoLoaded]);

    const goNext = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) return;
        lastTap.current = now;
        setCurrentIndex((i) => (i + 1) % media.length);
    };

    const goPrev = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) return;
        lastTap.current = now;
        setCurrentIndex((i) => (i - 1 + media.length) % media.length);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || isMobile || mainMedia?.type !== "image") return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        requestAnimationFrame(() => setZoomPos({ x, y }));
    };

    if (!mainMedia) return null;

    return (
        <div className="w-full">
            {/* MAIN GALLERY – FULLSCREEN MOBILE + PERFECT DESKTOP */}
            <div className="relative w-full md:ml-32 lg:ml-32 md:w-[45vh] h-[75vh] md:h-[50vh] lg:h-[60vh] bg-white rounded-xl overflow-hidden md:mt-16 lg:mt-12">

                {/* Badges */}
                {isPreOrder && (
                    <div className={`absolute z-30 top-4 ${isMobile ? "left-1/2 -translate-x-1/2" : "left-4"}`}>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xl">
                            Pre-Order
                        </span>
                    </div>
                )}


                {/* FULL VIEWPORT CENTERED IMAGE */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="relative w-full h-full cursor-zoom-in select-none"
                        onMouseEnter={() => !isMobile && mainMedia.type === "image" && setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                        onMouseMove={handleMouseMove}
                        onTouchStart={isMobile ? handleTouchStart : undefined}
                        onTouchEnd={isMobile ? handleTouchEnd : undefined}
                    >
                        {/* MAIN IMAGE – NEVER CROPS, ALWAYS FULL FIT */}
                        {mainMedia.type === "image" && (
                            <Image
                                src={imageErrors[mainMedia._id] ? fallbackImage : mainMedia.url}
                                alt={productName}
                                objectFit="contain"
                                fallbackSrc={fallbackImage}
                                priority
                                variant="large"
                                className="w-full h-full"
                                onLoad={() => setImageLoading(false)}
                                onError={() => setImageErrors(p => ({ ...p, [mainMedia._id]: true }))}
                            />
                        )}

                        {/* SUPER PREMIUM CIRCULAR ZOOM */}
                        {/* {isZoomed && !isMobile && mainMedia.type === "image" && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
                                <div
                                    className="absolute w-72 h-72 rounded-full border-8 border-white shadow-2xl"
                                    style={{
                                        left: `calc(${zoomPos.x}% - 144px)`,
                                        top: `calc(${zoomPos.y}% - 144px)`,
                                    }}
                                >
                                    <div
                                        className="w-full h-full rounded-full overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${imageErrors[mainMedia._id] ? fallbackImage : mainMedia.url})`,
                                            backgroundSize: "400% 400%",
                                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                            backgroundRepeat: "no-repeat",
                                            transform: "scale(4)",
                                            imageRendering: "-webkit-optimize-contrast",
                                        }}
                                    />
                                </div>

                                <div
                                    className="absolute inset-0 bg-black/70 pointer-events-none"
                                    style={{
                                        maskImage: `radial-gradient(circle 144px at ${zoomPos.x}% ${zoomPos.y}%, transparent 0%, transparent 100%, black 100%)`,
                                    }}
                                />


                            </div>
                        )} */}

                        {imageLoading && mainMedia.type === "image" && (
                            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                        )}

                        {/* Zoom Hint */}
                        {/* {isZoomed && !isMobile && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full text-base font-semibold flex items-center gap-3 z-50 backdrop-blur-md border border-white/20 shadow-2xl">
                                <BiZoomIn className="w-6 h-6 animate-pulse" />
                                <span>Move to Zoom</span>
                            </div>
                        )} */}

                        {/* VIDEO */}
                        {mainMedia.type === "video" && (
                            <div className="absolute inset-0 bg-black flex items-center justify-center">
                                {!videoLoaded && <img src={posterUrl} alt="Loading" className="w-full h-full object-contain" />}
                                <video
                                    ref={videoRef}
                                    src={mainMedia.url}
                                    className="w-full h-full object-contain"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    onLoadedData={() => setVideoLoaded(true)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobile && media.length > 1 && (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl z-40">
                            <BiChevronLeft className="w-9 h-9" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl z-40">
                            <BiChevronRight className="w-9 h-9" />
                        </button>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                            {media.map((_, i) => (
                                <div key={i} className={`transition-all ${i === currentIndex ? "w-10 h-2 bg-white" : "w-2 h-2 bg-white/60"} rounded-full`} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Desktop Thumbnails */}
            {!isMobile && media.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3 mt-8 px-4">
                    {media.map((item, idx) => (
                        <button
                            key={item._id}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                ? "border-primary ring-4 ring-primary/30"
                                : "border-gray-300 hover:border-gray-500"
                                }`}
                        >
                            {item.type === "image" ? (
                                <Image
                                    src={imageErrors[item._id] ? fallbackImage : item.url}
                                    alt=""
                                    objectFit="cover"
                                    variant="small"
                                    fallbackSrc={fallbackImage}
                                />
                            ) : (
                                <div className="relative w-full h-full bg-black/30 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center">
                                        <BiPlay className="w-6 h-6 text-white ml-0.5" />
                                    </div>
                                </div>
                            )}
                            {idx === currentIndex && (
                                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                                    <FiEye className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}