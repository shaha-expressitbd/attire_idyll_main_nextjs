import { useState, useEffect, useRef, useCallback } from "react";

interface VideoOptimizationOptions {
  rootMargin?: string;
  threshold?: number;
  autoplayMobile?: boolean;
  preloadStrategy?: "metadata" | "auto" | "none";
  maxConcurrentPreloads?: number;
}

interface VideoState {
  isLoading: boolean;
  isLoaded: boolean;
  isPlaying: boolean;
  isVisible: boolean;
  error: boolean;
}

export function useVideoOptimization(
  videos: Array<{ id: string; src: string }>,
  options: VideoOptimizationOptions = {}
) {
  const {
    rootMargin = "200px",
    threshold = 0.1,
    autoplayMobile = true,
    preloadStrategy = "metadata",
    maxConcurrentPreloads = 2,
  } = options;

  const [videoStates, setVideoStates] = useState<Record<string, VideoState>>(
    () =>
      Object.fromEntries(
        videos.map((video) => [
          video.id,
          {
            isLoading: true,
            isLoaded: false,
            isPlaying: false,
            isVisible: false,
            error: false,
          },
        ])
      )
  );

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const isMobile = useRef(false);
  const preloadedRefs = useRef<Set<string>>(new Set());

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer for visibility detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    let loadingCount = 0;

    videos.forEach((video, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          const videoElement = videoRefs.current[video.id];

          setVideoStates((prev) => ({
            ...prev,
            [video.id]: {
              ...prev[video.id],
              isVisible: entry.isIntersecting,
            },
          }));

          if (entry.isIntersecting && videoElement) {
            const state = videoStates[video.id];

            // Preload video metadata when coming into view
            if (
              index < maxConcurrentPreloads &&
              !preloadedRefs.current.has(video.id)
            ) {
              loadingCount++;
              preloadedRefs.current.add(video.id);

              videoElement.preload = "metadata";
              videoElement.addEventListener("loadedmetadata", () => {
                setVideoStates((prev) => ({
                  ...prev,
                  [video.id]: {
                    ...prev[video.id],
                    isLoading: false,
                    isLoaded: true,
                  },
                }));
                loadingCount = Math.max(0, loadingCount - 1);
              });

              videoElement.addEventListener("error", () => {
                setVideoStates((prev) => ({
                  ...prev,
                  [video.id]: {
                    ...prev[video.id],
                    isLoading: false,
                    error: true,
                  },
                }));
                loadingCount = Math.max(0, loadingCount - 1);
              });
            }

            // Autoplay for mobile video when visible
            if (isMobile.current && autoplayMobile && !state.isPlaying) {
              videoElement.muted = true;
              videoElement.playsInline = true;
              videoElement
                .play()
                .then(() => {
                  setVideoStates((prev) => ({
                    ...prev,
                    [video.id]: {
                      ...prev[video.id],
                      isPlaying: true,
                    },
                  }));
                })
                .catch(() => {
                  console.log("Autoplay failed for video:", video.id);
                });
            }
          }
        },
        {
          rootMargin,
          threshold,
        }
      );

      const videoElement = videoRefs.current[video.id];
      if (videoElement) {
        observer.observe(videoElement);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [
    videos,
    videoStates,
    rootMargin,
    threshold,
    autoplayMobile,
    maxConcurrentPreloads,
  ]);

  const togglePlayPause = useCallback(
    (videoId: string) => {
      const videoElement = videoRefs.current[videoId];
      if (!videoElement) return;

      const currentState = videoStates[videoId];

      if (currentState.isPlaying) {
        videoElement.pause();
        setVideoStates((prev) => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            isPlaying: false,
          },
        }));
      } else {
        videoElement.muted = true; // Enable muted autoplay
        videoElement.playsInline = true;
        videoElement
          .play()
          .then(() => {
            setVideoStates((prev) => ({
              ...prev,
              [videoId]: {
                ...prev[videoId],
                isPlaying: true,
              },
            }));
          })
          .catch((error) => {
            console.warn("Video playback failed:", error);
            setVideoStates((prev) => ({
              ...prev,
              [videoId]: {
                ...prev[videoId],
                error: true,
              },
            }));
          });
      }
    },
    [videoStates]
  );

  const setVideoRef = useCallback(
    (videoId: string, ref: HTMLVideoElement | null) => {
      videoRefs.current[videoId] = ref;
    },
    []
  );

  const getVideoState = useCallback(
    (videoId: string) => videoStates[videoId],
    [videoStates]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        video.load();
      }
    });
    videoRefs.current = {};
    preloadedRefs.current.clear();
  }, []);

  return {
    videoStates,
    togglePlayPause,
    setVideoRef,
    getVideoState,
    cleanup,
    isMobile: isMobile.current,
  };
}
