import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, SkipForward } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const SoundControl: React.FC = () => {
  const { isPlaying, toggleSound, currentTrack, nextTrack } = useMusic();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 select-none">
      {/* Track Info Popover when hovering / active */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-white text-[11px] font-sans border border-white/15 shadow-xl"
          >
            <Music className="w-3 h-3 text-[#78956A]" />
            <div className="flex flex-col">
              <span className="font-semibold text-white/95 leading-tight">{currentTrack.title}</span>
              <span className="text-[9px] text-white/60">{currentTrack.artist}</span>
            </div>
            {isPlaying && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextTrack();
                }}
                className="ml-1 p-1 hover:text-[#78956A] text-white/70 transition-colors cursor-pointer"
                title="Next Ambient Track"
              >
                <SkipForward className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Botanical Pill Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={toggleSound}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          background: 'linear-gradient(180deg, #78383B 0%, #602E31 50%, #4D2326 100%)',
          boxShadow: '0 8px 25px rgba(96, 46, 49, 0.45), 0 2px 6px rgba(36, 20, 22, 0.2)',
        }}
        className="group relative flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 rounded-full border border-white/35 border-t-white/50 text-white cursor-pointer select-none touch-manipulation transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B86268] focus:ring-offset-2"
        title={isPlaying ? 'Mute Ambient Music' : 'Play Ambient Dining Music'}
        aria-label={isPlaying ? 'Sound On - Click to mute' : 'Sound Off - Click to play'}
      >
        {/* Custom Filled Vector Speaker Icon */}
        {isPlaying ? (
          <div className="relative flex items-center justify-center shrink-0">
            <svg viewBox="0 0 28 24" className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" fill="none">
              {/* Solid White Speaker Body */}
              <path
                d="M12 4.5L6.5 9H3C2.45 9 2 9.45 2 10V14C2 14.55 2.45 15 3 15H6.5L12 19.5C12.75 20.1 13.5 19.65 13.5 18.7V5.3C13.5 4.35 12.75 3.9 12 4.5Z"
                fill="white"
              />
              {/* Sound Wave 1 */}
              <motion.path
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                d="M17.5 8.5C18.5 9.5 19.2 10.9 19.2 12C19.2 13.1 18.5 14.5 17.5 15.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Sound Wave 2 */}
              <motion.path
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                d="M21.5 5.5C23.2 7.2 24.2 9.5 24.2 12C24.2 14.5 23.2 16.8 21.5 18.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : (
          <div className="relative flex items-center justify-center shrink-0">
            <svg viewBox="0 0 28 24" className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" fill="none">
              {/* Solid White Speaker Body */}
              <path
                d="M12 4.5L6.5 9H3C2.45 9 2 9.45 2 10V14C2 14.55 2.45 15 3 15H6.5L12 19.5C12.75 20.1 13.5 19.65 13.5 18.7V5.3C13.5 4.35 12.75 3.9 12 4.5Z"
                fill="white"
              />
              {/* Sound Wave Arc */}
              <path
                d="M17.5 8.5C18.5 9.5 19.2 10.9 19.2 12C19.2 13.1 18.5 14.5 17.5 15.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Terracotta Diagonal Strike Through Icon */}
              <line
                x1="4"
                y1="5"
                x2="20"
                y2="19"
                stroke="#C97852"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* Text Label */}
        <span className="text-sm sm:text-base md:text-lg font-sans font-bold tracking-tight text-white whitespace-nowrap leading-none">
          {isPlaying ? 'Sound On' : 'Sound Off'}
        </span>
      </motion.button>
    </div>
  );
};
