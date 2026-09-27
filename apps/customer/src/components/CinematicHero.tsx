import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles, ChevronDown, Flame, Compass } from 'lucide-react';

const HERO_VIDEO_URL = 'https://raw.githubusercontent.com/adrianhajdin/project_modern_ui_ux_restaurant/main/src/assets/meal.mp4';
const HERO_POSTER_URL = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920&auto=format&fit=crop';

export const CinematicHero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (reducedMotion || !videoRef.current) return;
    const vid = videoRef.current;
    const tryPlay = () => {
      vid.play().catch(() => {
        // Autoplay blocked — poster image will show instead
      });
    };
    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
      return () => vid.removeEventListener('canplay', tryPlay);
    }
  }, [reducedMotion]);

  const handleOpenAuraSommelier = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-ask-aura', {
          detail: { question: 'What is the chef tasting menu recommendation for tonight?' },
        })
      );
    }
  };

  const handleExploreMenu = (e: React.MouseEvent) => {
    const nextSection = document.getElementById('platepost-video-menu');
    if (nextSection) {
      e.preventDefault();
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('platepost-video-menu') || document.getElementById('tronx-discovery-start');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#180C0E]">
      {/* Background Video / Poster Fallback */}
      {!reducedMotion ? (
        <video
          ref={videoRef}
          src={HERO_VIDEO_URL}
          poster={HERO_POSTER_URL}
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 scale-105 motion-safe:animate-pulse-slow ${
            videoReady ? 'opacity-65' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* Poster fallback (also shows while video loads) */}
      <img
        src={HERO_POSTER_URL}
        alt="Tronx culinary experience"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoReady && !reducedMotion ? 'opacity-0' : 'opacity-55'
        }`}
        loading="eager"
      />

      {/* Ambient Radial Vignette Overlays & Monolith Glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#180C0E_90%] z-[1] opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#180C0E] z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#FFF5EC] via-[#FFF5EC]/70 to-transparent z-[3]" />

      {/* Sculpted Monolith Halo in negative space backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#602E31]/30 blur-[130px] rounded-full pointer-events-none z-[2]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 pt-12 pb-16">
        
        {/* Live Service Pill with Pulsing Dot */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-4.5 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl text-[11px] font-sans font-semibold tracking-[0.22em] text-[#FFF5EC] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Live Hearth Active</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-[#E8B896]">Tables Open Tonight</span>
          </div>
        </motion.div>

        {/* Editorial Master Headline */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="space-y-3"
        >
          <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#E8B896] block">
            Est. 2026 • Artisanal Dining Sanctuary
          </span>
          <h1 className="font-luxury text-5xl sm:text-7xl lg:text-8xl font-bold text-[#FFF5EC] leading-[1.02] tracking-tight drop-shadow-md">
            Crafted With Fire,
            <br />
            <span className="gold-gradient-text italic font-normal tracking-wide">
              Served With Passion.
            </span>
          </h1>
        </motion.div>

        {/* Sensory Philosophy Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-sm sm:text-base lg:text-lg text-[#FFF5EC]/85 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-xs"
        >
          An unhurried culinary journey marrying organic farm-harvested aromatics,
          smoldering oak-fired embers, and unforgettable flavors crafted to elevate your mood.
        </motion.p>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          {/* Primary CTA: Explore Menu */}
          <Link
            to="/menu"
            onClick={handleExploreMenu}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#602E31] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-[0.22em] transition-all duration-300 shadow-[0_10px_30px_rgba(96,46,49,0.5)] border border-[#C2674F]/40 flex items-center justify-center gap-2.5 group cursor-pointer min-h-[50px]"
          >
            <span>Explore Video Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#E8B896]" />
          </Link>

          {/* Secondary CTA: Reserve Table */}
          <Link
            to="/reservation"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/12 hover:bg-white/20 active:scale-[0.97] backdrop-blur-md text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-[0.22em] border border-white/25 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl cursor-pointer min-h-[50px]"
          >
            <Calendar className="w-4 h-4 text-[#E8B896]" />
            <span>Reserve Table</span>
          </Link>

          {/* Tertiary CTA: Ask Aura AI Sommelier */}
          <button
            type="button"
            onClick={handleOpenAuraSommelier}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-[#241416]/80 to-[#3A181A]/80 hover:from-[#602E31]/90 hover:to-[#4D2326]/90 active:scale-[0.97] backdrop-blur-md text-[#FFF5EC] font-sans font-semibold text-xs tracking-wider border border-[#E8B896]/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg group min-h-[50px]"
            title="Ask our AI dining concierge for wine pairings and menu secrets"
          >
            <Sparkles className="w-4 h-4 text-[#E8B896] group-hover:rotate-12 transition-transform animate-pulse" />
            <span className="text-[#FFF5EC]">Ask Aura AI</span>
          </button>
        </motion.div>

        {/* Accolades & Quality Credentials Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-sans uppercase tracking-[0.2em] text-[#FFF5EC]/70"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#E8B896] font-bold">★ 4.9</span>
            <span>Gastronomy Index</span>
          </div>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#E8D9CC]/30" />
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#C2674F]" />
            <span>100% Wood-Fired Hearth</span>
          </div>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#E8D9CC]/30" />
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#E8B896]" />
            <span>Zero Preservatives</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.button
        type="button"
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-[9px] font-sans tracking-[0.3em] uppercase font-bold text-[#602E31] group-hover:text-[#4D2326]">
          Discover Tronx
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-full bg-white/80 border border-[#E8D9CC] flex items-center justify-center shadow-xs"
        >
          <ChevronDown className="w-4 h-4 text-[#602E31]" />
        </motion.div>
      </motion.button>
    </section>
  );
};

