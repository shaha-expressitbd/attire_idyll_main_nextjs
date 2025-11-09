// // MediaGallery.tsx
// 'use client';
// import { useState, useRef, useEffect, useMemo } from "react";
// import dynamic from 'next/dynamic';
// import Image from 'next/image';

// import SkeletonComponent from "@/components/ui/skeleton/SkeletonComponent";
// import { LiveViews } from "@/app/(public)/product/_component/Liveviews";

// const BiChevronRight = dynamic(() => import('react-icons/bi').then(mod => mod.BiChevronRight), { ssr: false });

// export interface MediaItem {
//     type: "image" | "video";
//     url: string;
//     public_id?: string;
//     _id: string;
// }

// interface MediaGalleryProps {
//     media: MediaItem[];
//     productName: string;
//     stock: number;
//     selectedMediaUrl?: string;
// }

// export default function MediaGallery({
//     media,
//     productName,
//     stock,
//     selectedMediaUrl,
// }: MediaGalleryProps) {
//     const fallbackImage = "/assets/falback.jpg";

//     const initialLoadingStates = useMemo(() => {
//         const states: { [key: string]: boolean } = {};
//         media.forEach((item) => {
//             states[item._id] = true;
//         });
//         return states;
//     }, [media]);

//     const [mediaLoading, setMediaLoading] = useState(initialLoadingStates);
//     const [playingVideos, setPlayingVideos] = useState<{ [key: string]: boolean }>({});
//     const [isMobile, setIsMobile] = useState(false);
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
//     const touchStartX = useRef(0);
//     const touchEndX = useRef(0);
//     const lastSlideChange = useRef<number>(0);

//     const handleVideoPlay = (itemId: string) => {
//         const video = videoRefs.current[itemId];
//         if (video) {
//             const isPlaying = playingVideos[itemId];
//             setPlayingVideos((prev) => ({ ...prev, [itemId]: !isPlaying }));
//             isPlaying ? video.pause() : video.play().catch(() => null);
//         }
//     };

//     const goToSlide = (direction: "next" | "prev") => {
//         const now = Date.now();
//         if (now - lastSlideChange.current < 300) return;
//         lastSlideChange.current = now;

//         setCurrentSlide((prev) => direction === "next" ? (prev + 1) % media.length : (prev - 1 + media.length) % media.length);
//     };

//     const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
//     const onTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
//     const onTouchEnd = () => {
//         const distance = touchStartX.current - touchEndX.current;
//         if (distance > 50) goToSlide("next");
//         else if (distance < -50) goToSlide("prev");
//     };

//     // Update current slide when selectedMediaUrl changes
//     useEffect(() => {
//         if (!selectedMediaUrl) return;
//         const idx = media.findIndex((m) => m.url === selectedMediaUrl);
//         if (idx > -1 && idx !== currentSlide) {
//             setCurrentSlide(idx);
//         }
//     }, [selectedMediaUrl, media, currentSlide]);

//     useEffect(() => {
//         const handleResize = () => setIsMobile(window.innerWidth < 768);
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     useEffect(() => {
//         media.forEach((item) => {
//             if (item.type === "video") {
//                 setPlayingVideos((prev) => ({ ...prev, [item._id]: true }));
//                 const video = videoRefs.current[item._id];
//                 if (video) {
//                     video.load();
//                 }
//             }
//         });
//     }, [media]);

//     return (
//         <div className="w-full md:mt-2">
//             {/* Preload first 4 videos' metadata */}
//             {!isMobile && media.slice(0, 4).map((item) => (
//                 item.type === "video" && (
//                     <video
//                         key={item._id}
//                         src={`${item.url}`}
//                         preload="metadata"
//                         style={{ display: "none" }}
//                         onLoadedMetadata={() => setMediaLoading((prev) => ({ ...prev, [item._id]: false }))}
//                     />
//                 )
//             ))}

//             {!isMobile ? (
//                 <div className={media.length === 1 ? "w-full" : "grid grid-cols-2 gap-4"}>
//                     {media.map((item, index) => {
//                         const isVideo = item.type === "video";
//                         const isLoading = mediaLoading[item._id];
//                         const imageSrc = isVideo ? "" : (item.url || fallbackImage);

//                         return (
//                             <div
//                                 key={item._id}
//                                 className={`relative ${media.length === 1 ? "w-full h-[900px]" : "w-full h-[600px]"} bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
//                             >
//                                 {isLoading && (
//                                     <SkeletonComponent
//                                         type={isVideo ? "video" : "image"}
//                                         width="w-full"
//                                         height={media.length === 1 ? "h-[900px]" : "h-[600px]"}
//                                     />
//                                 )}

//                                 {!isVideo && (
//                                     <div className="relative w-full h-full">
//                                         <Image
//                                             src={`${imageSrc}`}
//                                             alt={`${productName} view ${index + 1}`}
//                                             fill
//                                             sizes={media.length === 1 ?
//                                                 "(max-width: 768px) 100vw, 100vw" :
//                                                 "(max-width: 768px) 100vw, 50vw"
//                                             }
//                                             className="object-cover"
//                                             loading={index < 4 ? "eager" : "lazy"}
//                                             priority={index < 4}
//                                             onLoad={() => setMediaLoading((prev) => ({ ...prev, [item._id]: false }))}
//                                             onError={(e) => {
//                                                 console.error(`Failed to load image ${item._id}: ${imageSrc}`);
//                                                 setMediaLoading((prev) => ({ ...prev, [item._id]: false }));
//                                                 // Fallback to fallback image
//                                                 const target = e.target as HTMLImageElement;
//                                                 if (target.src !== fallbackImage) {
//                                                     target.src = fallbackImage;
//                                                 }
//                                             }}
//                                         />
//                                     </div>
//                                 )}

//                                 {isVideo && (
//                                     <video
//                                         ref={(el) => { videoRefs.current[item._id] = el; }}
//                                         src={`${item.url}`}
//                                         width={600}
//                                         height={media.length === 1 ? 900 : 600}
//                                         className="w-full h-full object-cover"
//                                         autoPlay={index < 4}
//                                         loop
//                                         muted
//                                         playsInline
//                                         preload="metadata"
//                                         onLoadedMetadata={() => setMediaLoading((prev) => ({ ...prev, [item._id]: false }))}
//                                         onClick={() => handleVideoPlay(item._id)}
//                                         onError={() => console.error(`Failed to load video ${item._id}: ${item.url}`)}
//                                     />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <div className="relative w-full h-screen bg-black overflow-hidden" style={{ height: "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))" }}>
//                     <div className="relative w-full h-full" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
//                         {media.map((item, index) => {
//                             const isVideo = item.type === "video";
//                             const isLoading = mediaLoading[item._id];
//                             const isActive = index === currentSlide;
//                             const imageSrc = isVideo ? "" : (item.url || fallbackImage);

//                             return (
//                                 <div key={item._id} className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${isActive ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"}`}>
//                                     {isLoading && <SkeletonComponent type={isVideo ? "video" : "image"} width="w-full" height="h-full" />}

//                                     {!isVideo && (
//                                         <>
//                                             {/* Background blur image */}
//                                             <div className="absolute inset-0 w-full h-full">
//                                                 <Image
//                                                     src={`${imageSrc}&blur=10`}
//                                                     alt={`${productName} view ${index + 1}`}
//                                                     fill
//                                                     sizes="100vw"
//                                                     className="object-cover"
//                                                     loading={isActive ? "eager" : "lazy"}
//                                                     priority={isActive}
//                                                     onLoad={() => setMediaLoading((prev) => ({ ...prev, [item._id]: false }))}
//                                                     onError={(e) => {
//                                                         console.error(`Failed to load image ${item._id}: ${imageSrc}`);
//                                                         const target = e.target as HTMLImageElement;
//                                                         if (target.src !== fallbackImage) {
//                                                             target.src = fallbackImage;
//                                                         }
//                                                     }}
//                                                 />
//                                             </div>

//                                             {/* Main image */}
//                                             <div className="absolute inset-0 w-full h-full">
//                                                 <Image
//                                                     src={`${imageSrc}`}
//                                                     alt={`${productName} view ${index + 1}`}
//                                                     fill
//                                                     sizes="100vw"
//                                                     className="object-contain"
//                                                     loading={isActive ? "eager" : "lazy"}
//                                                     priority={isActive}
//                                                     onLoad={() => setMediaLoading((prev) => ({ ...prev, [item._id]: false }))}
//                                                     onError={(e) => {
//                                                         console.error(`Failed to load image ${item._id}: ${imageSrc}`);
//                                                         const target = e.target as HTMLImageElement;
//                                                         if (target.src !== fallbackImage) {
//                                                             target.src = fallbackImage;
//                                                         }
//                                                     }}
//                                                 />
//                                             </div>
//                                         </>
//                                     )}

//                                     {isVideo && (
//                                         <video
//                                             ref={(el) => { videoRefs.current[item._id] = el; }}
//                                             src={`${item.url}`}
//                                             width={600}
//                                             height={800}
//                                             className="w-full h-full object-cover"
//                                             autoPlay={isActive}
//                                             loop
//                                             muted
//                                             playsInline
//                                             preload="metadata"
//                                             onLoadedMetadata={() => {
//                                                 setMediaLoading((prev) => ({ ...prev, [item._id]: false }));
//                                                 if (isActive) videoRefs.current[item._id]?.play().catch(() => null);
//                                             }}
//                                             onClick={() => handleVideoPlay(item._id)}
//                                             onError={() => console.error(`Failed to load video ${item._id}: ${item.url}`)}
//                                         />
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     {media.length > 1 && (
//                         <>
//                             <button onClick={() => goToSlide("prev")} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary hover:bg-primary rounded-full text-white flex items-center justify-center shadow-lg" aria-label="Previous">
//                                 <BiChevronRight className="w-6 h-6 rotate-180" />
//                             </button>
//                             <button onClick={() => goToSlide("next")} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary hover:bg-primary rounded-full text-white flex items-center justify-center shadow-lg" aria-label="Next">
//                                 <BiChevronRight className="w-6 h-6" />
//                             </button>
//                         </>
//                     )}

//                     <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
//                         {media.map((_, index) => (
//                             <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-blue-600" : "bg-white/50"}`} />
//                         ))}
//                     </div>

//                     <div className="absolute top-4 left-4 z-50">
//                         <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${stock > 10 ? "bg-green-600" : stock > 0 ? "bg-amber-500" : "bg-red-600"} text-white`}>
//                             {stock > 10 ? `${stock} Available` : stock > 0 ? `Only ${stock} Left!` : "Out of Stock"}
//                         </span>
//                     </div>

//                     <div className="absolute top-4 right-4 z-50 md:hidden block">
//                         <LiveViews initialCount={10} />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }