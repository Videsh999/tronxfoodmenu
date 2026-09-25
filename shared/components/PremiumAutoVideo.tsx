import React, { useRef, useState, useEffect, useCallback } from 'react';
import { MediaService } from '../services/mediaService';

// ── Global active-video queue ──────────────────────────────────────────────
const activeVideos = new Set<HTMLVideoElement>();

function getMaxConcurrent(): number {
  if (typeof window === 'undefined') return 3;
  return window.innerWidth < 768 ? 2 : 3;
}

function enqueueVideo(video: HTMLVideoElement): boolean {
  const max = getMaxConcurrent();
  if (activeVideos.has(video)) return true;
  if (activeVideos.size < max) {
    activeVideos.add(video);
    return true;
  }
  // Evict the oldest entry
  const oldest = activeVideos.values().next().value;
  if (oldest && oldest !== video) {
    oldest.pause();
    activeVideos.delete(oldest);
  }
  activeVideos.add(video);
  return true;
}

function dequeueVideo(video: HTMLVideoElement): void {
  activeVideos.delete(video);
}

// ── Reduced-motion query ───────────────────────────────────────────────────
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── Props ──────────────────────────────────────────────────────────────────
interface PremiumAutoVideoProps {
  videoUrl?: string;
  posterUrl: string;
  fallbackImageUrl: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

export const PremiumAutoVideo: React.FC<PremiumAutoVideoProps> = ({
  videoUrl,
  posterUrl,
  fallbackImageUrl,
  alt,
  aspectRatio = 'aspect-[4/3]',
  className = '',
  priority = false,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const reducedMotion = prefersReducedMotion();
  const resolvedPoster = MediaService.resolveMediaUrl(
    posterUrl || (videoUrl ? MediaService.getVideoPosterUrl(videoUrl) : fallbackImageUrl)
  );
  const resolvedVideo = videoUrl && !reducedMotion ? MediaService.getOptimizedVideoUrl(videoUrl) : null;

  // ── 1. Proximity observer: start loading when within 300px ────────────
  useEffect(() => {
    if (priority || !resolvedVideo) {
      setIsNearViewport(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, resolvedVideo]);

  // ── 2. Visibility observer: play/pause based on viewport ──────────────
  useEffect(() => {
    if (!resolvedVideo || !isNearViewport || reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !videoRef.current) return;
        if (entry.intersectionRatio >= 0.4) {
          // Attempt to play
          if (enqueueVideo(videoRef.current)) {
            videoRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              dequeueVideo(videoRef.current!);
            });
          }
        } else if (entry.intersectionRatio < 0.1) {
          videoRef.current.pause();
          dequeueVideo(videoRef.current);
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.1, 0.4, 0.6] }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (videoRef.current) {
        videoRef.current.pause();
        dequeueVideo(videoRef.current);
      }
    };
  }, [resolvedVideo, isNearViewport, reducedMotion]);

  // ── Priority autoplay for modal / hero usage ──────────────────────────
  useEffect(() => {
    if (!priority || !resolvedVideo || reducedMotion) return;
    const vid = videoRef.current;
    if (!vid) return;

    const tryPlay = () => {
      if (enqueueVideo(vid)) {
        vid.play().then(() => setIsPlaying(true)).catch(() => dequeueVideo(vid));
      }
    };

    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
      return () => vid.removeEventListener('canplay', tryPlay);
    }
  }, [priority, resolvedVideo, reducedMotion, isVideoReady]);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        dequeueVideo(videoRef.current);
      }
    };
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    if (videoRef.current) {
      dequeueVideo(videoRef.current);
    }
  }, []);

  const showVideo = resolvedVideo && !hasError && !reducedMotion;

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#FAF2EA] ${aspectRatio} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Shimmer placeholder */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-[#FAF2EA] animate-pulse flex items-center justify-center z-[1]">
          <div className="w-8 h-8 rounded-full border border-[#E8D9CC] bg-white flex items-center justify-center opacity-60">
            <span className="w-2 h-2 rounded-full bg-[#602E31]/50 animate-ping" />
          </div>
        </div>
      )}

      {/* Poster / fallback image — always rendered */}
      <img
        src={resolvedPoster}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        } ${isPlaying && isVideoReady ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Video element — conditionally mounted */}
      {showVideo && isNearViewport && (
        <video
          ref={videoRef}
          src={resolvedVideo!}
          poster={resolvedPoster}
          preload={priority ? 'auto' : 'metadata'}
          playsInline
          muted
          loop
          onCanPlay={handleCanPlay}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isPlaying && isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none z-[2]" />

      {/* Live indicator when video is playing */}
      {isPlaying && isVideoReady && (
        <div className="absolute top-3 left-3 z-[3] flex items-center gap-1.5 opacity-60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#78956A] animate-pulse" />
        </div>
      )}
    </div>
  );
};
