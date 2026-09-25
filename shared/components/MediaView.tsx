import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { MediaService } from '../services/mediaService';

interface MediaViewProps {
  mediaUrl: string;
  posterUrl?: string;
  videoUrl?: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  autoPlayOnHover?: boolean;
  priority?: boolean;
  clickable?: boolean;
  onImageClick?: (url: string, title?: string) => void;
}

export const MediaView: React.FC<MediaViewProps> = ({
  mediaUrl,
  posterUrl,
  videoUrl,
  alt,
  aspectRatio = 'aspect-[4/3]',
  className = '',
  autoPlayOnHover = true,
  priority = false,
  clickable = false,
  onImageClick,
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(priority);
  const [imgLoaded, setImgLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy loading observer
  useEffect(() => {
    if (priority) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [priority]);

  const handleMouseEnter = () => {
    if (autoPlayOnHover && videoUrl && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be restricted
      });
    }
  };

  const handleMouseLeave = () => {
    if (autoPlayOnHover && videoUrl && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resolvedImage = MediaService.resolveMediaUrl(mediaUrl || posterUrl || '');
  const resolvedPoster = MediaService.resolveMediaUrl(posterUrl || mediaUrl || '');
  const resolvedVideo = videoUrl ? MediaService.resolveMediaUrl(videoUrl) : null;

  const handleClick = (e: React.MouseEvent) => {
    if (clickable && onImageClick) {
      e.stopPropagation();
      onImageClick(resolvedImage, alt);
    }
  };

  return (
    <div
      ref={containerRef}
      data-cursor={clickable ? 'image' : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-[#FAF2EA] ${aspectRatio} ${clickable ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Elegant Shimmer Placeholder while image loads */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-[#FAF2EA] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-[#E8D9CC] bg-white flex items-center justify-center opacity-60">
            <span className="w-2 h-2 rounded-full bg-[#602E31]/50 animate-ping" />
          </div>
        </div>
      )}

      {/* High-res Image / Poster */}
      {isInView && (
        <img
          src={resolvedImage}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${isPlaying ? 'opacity-0' : 'opacity-100'} ${clickable ? 'group-hover:scale-105 transition-transform duration-700' : ''}`}
        />
      )}

      {/* Video layer if present */}
      {isInView && resolvedVideo && (
        <video
          ref={videoRef}
          src={resolvedVideo}
          poster={resolvedPoster}
          preload="metadata"
          playsInline
          muted={isMuted}
          loop
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isPlaying && isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Video Indicator Badge */}
      {resolvedVideo && !isPlaying && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#602E31]/40 text-[#C2674F] text-[10px] font-sans font-semibold tracking-wider shadow-lg">
          <Play className="w-2.5 h-2.5 fill-[#C2674F]" />
          <span>Cinematic Preview</span>
        </div>
      )}

      {/* Audio toggle if video playing */}
      {isPlaying && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          className="absolute bottom-3 right-3 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md text-[#C2674F] hover:bg-[#602E31] hover:text-[#FFF5EC] transition-colors border border-[#602E31]/40 cursor-pointer"
          title={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
    </div>
  );
};
