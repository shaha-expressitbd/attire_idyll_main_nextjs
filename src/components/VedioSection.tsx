'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { BiChevronLeft, BiChevronRight, BiPause, BiError } from 'react-icons/bi'
import { FaCirclePlay, FaSpinner } from 'react-icons/fa6'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import { MdTouchApp } from 'react-icons/md'
import Link from 'next/link'
import { useGetVideosQuery } from '@/lib/api/publicApi'
import { useSelector } from 'react-redux'
import { RootState } from '@reduxjs/toolkit/query'
import Image from './ui/atoms/image'

interface Video {
  _id: string
  name: string
  video: {
    alterVideo: {
      secure_url: string
      public_id: string
      thumbnail_url?: string
      alter_thumbnail_url?: string
    }
  }[]
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[অ-হ]/g, char => {
      const banglaToLatin: Record<string, string> = {
        অ: 'o', আ: 'a', ই: 'i', ঈ: 'i', উ: 'u', ঊ: 'u', ঋ: 'ri',
        এ: 'e', ঐ: 'oi', ও: 'o', ঔ: 'ou', ক: 'k', খ: 'kh', গ: 'g', ঘ: 'gh',
        ঙ: 'ng', চ: 'ch', ছ: 'chh', জ: 'j', ঝ: 'jh', ঞ: 'ny', ট: 't',
        ঠ: 'th', ড: 'd', ঢ: 'dh', ণ: 'n', ত: 't', থ: 'th', দ: 'd',
        ধ: 'dh', ন: 'n', প: 'p', ফ: 'ph', ব: 'b', ভ: 'bh', ম: 'm',
        য: 'j', র: 'r', ল: 'l', শ: 'sh', ষ: 'sh', স: 's', হ: 'h',
        ড়: 'r', ঢ়: 'rh', য়: 'y', ৎ: 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': ''
      }
      return banglaToLatin[char] || char
    })
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default function ProductVideosSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [canAutoChange, setCanAutoChange] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const cloudStorageUrl = useSelector((state: RootState) => state.business.data?.cloud_storage_url)
  const ownerId = process.env.NEXT_PUBLIC_OWNER_ID
  const videoUrlEnv = cloudStorageUrl ? `${cloudStorageUrl}/${ownerId}/original` : ''

  const { data: videos, isLoading: isFetchingVideos, isError } = useGetVideosQuery({})

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
      }
    }
  }, [])

  useEffect(() => {
    if (canAutoChange && videos && videos.length > 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % videos.length)
        setCanAutoChange(false)
        setVideoProgress(0)
        setIsVideoLoaded(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [canAutoChange, videos])

  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
      setIsVideoLoaded(true)
      setIsLoading(false)
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setVideoProgress(progress)
    }
  }, [])

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false)
    setCanAutoChange(true)
    setVideoProgress(100)
  }, [])

  const handleVideoError = useCallback(() => {
    setVideoError('Video failed to load')
    setIsLoading(false)
  }, [])

  const handleSlideChange = useCallback((newIndex: number) => {
    if (isTransitioning || !videos) return
    setIsTransitioning(true)
    if (videoRef.current) videoRef.current.pause()

    setTimeout(() => {
      setCurrentSlide(newIndex)
      setIsPlaying(false)
      setVideoProgress(0)
      setCanAutoChange(false)
      setIsVideoLoaded(false)
      setVideoError(null)
      setIsLoading(true)
      setIsTransitioning(false)
    }, 300)
  }, [isTransitioning, videos])

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      }
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !videos) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe && currentSlide < videos.length - 1) handleSlideChange(currentSlide + 1)
    if (isRightSwipe && currentSlide > 0) handleSlideChange(currentSlide - 1)
  }, [touchStart, touchEnd, currentSlide, videos, handleSlideChange])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videos) return
      if (e.key === 'ArrowLeft') handleSlideChange((currentSlide - 1 + videos.length) % videos.length)
      else if (e.key === 'ArrowRight') handleSlideChange((currentSlide + 1) % videos.length)
      else if (e.key === ' ') { e.preventDefault(); togglePlay() }
    }
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide, videos, handleSlideChange, togglePlay])

  if (isFetchingVideos) {
    return (
      <div className='w-full h-80 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-2xl'>
        <FaSpinner className='w-8 h-8 animate-spin text-gray-500' />
      </div>
    )
  }

  if (isError || !videos || videos.length === 0) {
    return (
      <div className='w-full h-80 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl'>
        <p className='text-gray-500 dark:text-gray-300 text-lg'>No videos available</p>
      </div>
    )
  }

  const currentVideo = videos[currentSlide]
  const videoUrl = currentVideo.video[0]?.alterVideo?.secure_url
    ? `${videoUrlEnv}${currentVideo.video[0].alterVideo.secure_url}`
    : ''

  const showSideVideos = windowWidth >= 1024 && !isMobile
  const showTwoSideVideos = windowWidth >= 1280 && !isMobile

  return (
    <div className='w-full overflow-hidden bg-secondary dark:bg-secondary text-black dark:text-white relative'>
      {/* Background Effects */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
        <div className={`absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-blue-500/10 rounded-full blur-xl sm:blur-2xl md:blur-3xl animate-pulse ${isMobile ? '' : 'transform-gpu'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-purple-500/10 rounded-full blur-xl sm:blur-2xl md:blur-3xl animate-pulse ${isMobile ? '' : 'transform-gpu'}`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 right-1/3 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-green-500/10 rounded-full blur-xl sm:blur-2xl md:blur-3xl animate-pulse ${isMobile ? '' : 'transform-gpu'}`} style={{ animationDelay: '4s' }}></div>
      </div>

      <div className={`relative px-2 py-4 sm:py-8 w-full ${isMobile ? '' : 'perspective-1000'}`}>
        <div className='mx-auto w-full'>
          <div className='flex flex-row items-center justify-center sm:space-y-0 sm:space-x-2 md:space-x-4 lg:space-x-6 w-full transform-gpu'>

            {/* Previous Button */}
            <button
              onClick={() => handleSlideChange((currentSlide - 1 + videos.length) % videos.length)}
              className={`group relative p-2 sm:p-3 md:p-4 bg-white dark:bg-secondary backdrop-blur-xl hover:bg-white dark:hover:bg-gray-600 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-600/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-3xl z-20 ${isMobile ? '' : 'transform-gpu'}`}
              style={isMobile ? {} : { transform: isTransitioning ? 'rotateY(-15deg) scale(0.95)' : 'rotateY(-5deg)', transformStyle: 'preserve-3d' }}
              aria-label='Previous video'
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isMobile ? '' : 'transform-gpu'}`}></div>
              <BiChevronLeft className='w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 transform-gpu group-hover:scale-110' />
            </button>

            {/* Videos Container */}
            <div
              ref={sliderRef}
              className='flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4 w-full max-w-[100vw] overflow-hidden transform-gpu'
              style={isMobile ? {} : { perspective: '1000px' }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role='region'
              aria-label='Video carousel'
            >

              {/* Left Side Videos */}
              {showSideVideos &&
                [-2, -1].map(offset => {
                  if (!showTwoSideVideos && offset === -2) return null
                  const index = (currentSlide + offset + videos.length) % videos.length
                  const video = videos[index]
                  const thumb = video.video[0].alterVideo.thumbnail_url

                  return (
                    <div
                      key={`left-${offset}`}
                      onClick={() => handleSlideChange(index)}
                      className='hidden lg:block cursor-pointer group flex-shrink-0 transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform-gpu'
                      style={isMobile ? {} : {
                        transform: isTransitioning
                          ? `rotateY(${offset === -1 ? 25 : 35}deg) translateX(${offset === -1 ? '20px' : '40px'}) scale(${offset === -1 ? 0.7 : 0.6}) translateZ(-80px)`
                          : `rotateY(${offset === -1 ? 15 : 25}deg) translateX(${offset === -1 ? '10px' : '20px'}) scale(${offset === -1 ? 0.9 : 0.8}) translateZ(-20px)`,
                        opacity: isTransitioning ? (offset === -1 ? 0.5 : 0.3) : (offset === -1 ? 0.8 : 0.6),
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className='relative w-[120px] md:w-[140px] lg:w-[160px] xl:w-[200px] bg-white/90 dark:bg-secondary/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden hover:opacity-100 hover:scale-105 transition-all duration-500 transform-gpu'>
                        <div className='aspect-[9/16] relative overflow-hidden'>
                          <Image
                            src={thumb || ''}
                            alt={video.name}
                            variant="large"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            placeholder="blur"
                            isBlur={true}
                            loading="lazy"
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center'>
                            <FaCirclePlay className='w-10 h-10 text-white animate-pulse' />
                          </div>
                        </div>
                        <div className='p-2 md:p-3'>
                          <Link href={`/product/${generateSlug(video.name)}?id=${video._id}`}>
                            <h3 className='text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                              {video.name}
                            </h3>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}

              {/* Center Video */}
              <div
                className='relative group transform-gpu transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]'
                style={isMobile ? {} : {
                  transform: isTransitioning
                    ? 'rotateY(0deg) scale(0.85) translateZ(-100px) rotateX(-5deg)'
                    : 'rotateY(0deg) scale(1) translateZ(50px) rotateX(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className='relative w-full max-w-[320px] sm:max-w-[360px] md:w-96 lg:w-[420px] xl:w-[480px] bg-white/95 dark:bg-secondary/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-3xl sm:shadow-4xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden hover:scale-[1.02] transition-all duration-500 transform-gpu'>
                  <div className='relative aspect-[9/16] overflow-hidden'>
                    {videoError ? (
                      <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'>
                        <BiError className='w-12 h-12 mb-2' />
                        <p className='text-sm text-center px-4'>{videoError}</p>
                      </div>
                    ) : !videoUrl ? (
                      <div className='absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600'>
                        <p className='text-gray-500 dark:text-gray-300'>Video unavailable</p>
                      </div>
                    ) : (
                      <>
                        {/* Thumbnail while loading */}
                        {isLoading && currentVideo.video[0].alterVideo.thumbnail_url && (
                          <div className='absolute inset-0'>
                            <Image
                              src={currentVideo.video[0].alterVideo.thumbnail_url}
                              alt={currentVideo.name}
                              variant="large"
                              className="w-full h-full object-cover animate-pulse"
                              placeholder="blur"
                              isBlur={true}
                            />
                          </div>
                        )}

                        {/* Video */}
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          poster={currentVideo.video[0].alterVideo.thumbnail_url || undefined}
                          className={`w-full h-full object-cover transition-all duration-500 transform-gpu ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                          muted={isMuted}
                          onLoadedData={handleVideoLoad}
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={handleVideoEnd}
                          onError={handleVideoError}
                          preload="metadata"
                          autoPlay
                          playsInline
                        />
                      </>
                    )}

                    {/* Controls Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform-gpu'>
                      <div className='absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-start'>
                        {isPlaying && (
                          <div className='flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-full animate-pulse'>
                            <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse'></div>
                            <span className='text-white text-xs sm:text-sm font-medium'>LIVE</span>
                          </div>
                        )}
                        <div className='bg-black/50 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-full'>
                          <span className='text-white text-xs sm:text-sm font-medium'>
                            {Math.floor(videoDuration / 60)}:{Math.floor(videoDuration % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      <div className='absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4'>
                        <div className='w-full bg-white/20 backdrop-blur-sm rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4 shadow-inner'>
                          <div
                            className='bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full transition-all duration-300 relative overflow-hidden shadow-lg'
                            style={{ width: `${videoProgress}%` }}
                          >
                            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse transform-gpu'></div>
                          </div>
                        </div>
                        <div className='flex justify-between items-center'>
                          <button onClick={togglePlay} className='group/btn p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/30 hover:scale-110 transition-all duration-500 transform-gpu hover:shadow-2xl' aria-label={isPlaying ? 'Pause' : 'Play'}>
                            {isPlaying ? <BiPause className='w-5 h-5 sm:w-6 sm:h-6 text-white' /> : <FaCirclePlay className='w-5 h-5 sm:w-6 sm:h-6 text-white' />}
                          </button>
                          <button onClick={toggleMute} className='group/btn p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl hover:bg-white/30 hover:scale-110 transition-all duration-500 transform-gpu hover:shadow-2xl' aria-label={isMuted ? 'Unmute' : 'Mute'}>
                            {isMuted ? <FiVolumeX className='w-5 h-5 sm:w-6 sm:h-6 text-white' /> : <FiVolume2 className='w-5 h-5 sm:w-6 sm:h-6 text-white' />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 sm:p-4 md:p-6 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-700/50 dark:to-gray-800/50 backdrop-blur-sm'>
                    <Link href={`/product/${generateSlug(currentVideo.name)}?id=${currentVideo._id}`}>
                      <h3 className='text-sm md:text-lg lg:text-xl xl:text-2xl font-bold text-black dark:text-white mb-1 sm:mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform-gpu hover:scale-105'>
                        {currentVideo.name}
                      </h3>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side Videos */}
              {showSideVideos &&
                [1, 2].map(offset => {
                  if (!showTwoSideVideos && offset === 2) return null
                  const index = (currentSlide + offset) % videos.length
                  const video = videos[index]
                  const thumb = video.video[0].alterVideo.thumbnail_url || video.video[0].alterVideo.thumbnail_url

                  return (
                    <div
                      key={`right-${offset}`}
                      onClick={() => handleSlideChange(index)}
                      className='hidden lg:block cursor-pointer group flex-shrink-0 transition-all duration-700 ease-out transform-gpu'
                      style={isMobile ? {} : {
                        transform: isTransitioning
                          ? `rotateY(-${offset === 1 ? 25 : 35}deg) translateX(-${offset === 1 ? '20px' : '40px'}) scale(${offset === 1 ? 0.7 : 0.6}) translateZ(-50px)`
                          : `rotateY(-${offset === 1 ? 15 : 25}deg) translateX(-${offset === 1 ? '10px' : '20px'}) scale(${offset === 1 ? 0.9 : 0.8})`,
                        opacity: offset === 1 ? 0.8 : 0.6,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className='relative w-[120px] md:w-[140px] lg:w-[160px] xl:w-[200px] bg-white/90 dark:bg-secondary/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-600/50 overflow-hidden hover:opacity-100 hover:scale-105 transition-all duration-500 transform-gpu'>
                        <div className='aspect-[9/16] relative overflow-hidden'>
                          <Image
                            src={thumb || ''}
                            alt={video.name}
                            variant="large"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            placeholder="blur"
                            isBlur={true}
                            loading="lazy"
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center'>
                            <FaCirclePlay className='w-10 h-10 text-white animate-pulse' />
                          </div>
                        </div>
                        <div className='p-2 md:p-3'>
                          <Link href={`/product/${generateSlug(video.name)}?id=${video._id}`}>
                            <h3 className='text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                              {video.name}
                            </h3>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}

            </div>

            {/* Next Button */}
            <button
              onClick={() => handleSlideChange((currentSlide + 1) % videos.length)}
              className={`group relative p-2 sm:p-3 md:p-4 bg-white dark:bg-secondary backdrop-blur-xl hover:bg-white dark:hover:bg-gray-600 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-600/50 transition-all duration-500 z-20 ${isMobile ? '' : 'transform-gpu'}`}
              style={isMobile ? {} : { transform: isTransitioning ? 'rotateY(15deg) scale(0.95)' : 'rotateY(5deg)', transformStyle: 'preserve-3d' }}
              aria-label='Next video'
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-green-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isMobile ? '' : 'transform-gpu'}`}></div>
              <BiChevronRight className='w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 dark:text-white duration-300' />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className={`flex justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-10 space-x-1 sm:space-x-2 md:space-x-3 ${isMobile ? '' : 'perspective-500'}`}>
            {videos.map((_, index: number) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`relative transition-all duration-500 transform-gpu hover:scale-125 hover:-translate-y-1 ${index === currentSlide
                  ? 'w-8 sm:w-10 md:w-12 h-2 sm:h-3 md:h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg'
                  : 'w-4 sm:w-5 h-2 sm:h-3 bg-gray-300/70 dark:bg-gray-500/70 hover:bg-gray-400 dark:hover:bg-gray-400 rounded-full backdrop-blur-sm'
                  }`}
                style={isMobile ? {} : { transform: index === currentSlide ? 'rotateX(10deg) translateZ(5px)' : 'rotateX(0deg) translateZ(0px)', transformStyle: 'preserve-3d' }}
                aria-label={`Go to video ${index + 1}`}
              >
                {index === currentSlide && !isMobile && (
                  <>
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full animate-pulse opacity-75 transform-gpu'></div>
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-green-400/50 rounded-full animate-ping transform-gpu'></div>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Info */}
          <div className='lg:hidden text-center mt-3 sm:mt-4'>
            <p className='text-gray-500 dark:text-gray-300 text-xs sm:text-sm backdrop-blur-sm bg-white/10 dark:bg-secondary/10 px-3 py-1 rounded-full flex items-center gap-2 justify-center'>
              <MdTouchApp className='w-4 h-4' />
              {currentSlide + 1} of {videos.length} • Swipe to navigate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}