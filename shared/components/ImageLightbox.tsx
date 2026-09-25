import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  category?: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageUrl,
  title,
  category,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-8"
        >
          {/* Dark Glass Backdrop with Soft Darkening */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity cursor-pointer"
          />

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all shadow-xl cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Centered Image Container with Spring Scale Zoom and Smooth Return */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center space-y-4 select-none pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/40">
              <img
                src={imageUrl}
                alt={title || 'Tronx Media'}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
              />
            </div>

            {/* Image Details Caption */}
            {(title || category) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="text-center space-y-1"
              >
                {category && (
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#E8B896] uppercase block font-semibold">
                    {category}
                  </span>
                )}
                {title && (
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    {title}
                  </h3>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
