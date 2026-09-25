import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CraftslandCursor: React.FC = () => {
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'image'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for fluid motion
  // Dot follows tightly
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 50 });

  // Ring follows with a soft, luxury fluid lag
  const ringX = useSpring(mouseX, { stiffness: 260, damping: 26 });
  const ringY = useSpring(mouseY, { stiffness: 260, damping: 26 });

  useEffect(() => {
    // Detect touch capability
    const checkTouch = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(hasTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Determine hover state based on element under cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isImage = target.closest('[data-cursor="image"]') || target.tagName.toLowerCase() === 'img';
      const isInteractive =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('.cursor-pointer') ||
        target.closest('[data-cursor="hover"]');

      if (isImage) {
        setCursorState('image');
      } else if (isInteractive) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isTouchDevice, isVisible, mouseX, mouseY]);

  // Clean up ripples after animation duration
  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  if (isTouchDevice) return null;

  // Sizes and styles depending on state
  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      borderColor: 'rgba(96, 46, 49, 0.65)',
      backgroundColor: 'rgba(96, 46, 49, 0.04)',
      scale: 1,
    },
    hover: {
      width: 48,
      height: 48,
      borderColor: 'rgba(96, 46, 49, 0.95)',
      backgroundColor: 'rgba(96, 46, 49, 0.08)',
      scale: 1.1,
    },
    image: {
      width: 58,
      height: 58,
      borderColor: 'rgba(77, 35, 38, 0.95)',
      backgroundColor: 'rgba(96, 46, 49, 0.15)',
      scale: 1.15,
    },
  };

  const dotVariants = {
    default: {
      width: 6,
      height: 6,
      backgroundColor: '#602E31',
      opacity: 1,
    },
    hover: {
      width: 8,
      height: 8,
      backgroundColor: '#4D2326',
      opacity: 0.95,
    },
    image: {
      width: 4,
      height: 4,
      backgroundColor: '#241416',
      opacity: 0.9,
    },
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ width: 10, height: 10, opacity: 0.85, scale: 0.8 }}
            animate={{ width: 64, height: 64, opacity: 0, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            style={{
              position: 'fixed',
              left: ripple.x,
              top: ripple.y,
              x: '-50%',
              y: '-50%',
              borderRadius: '50%',
              border: '1.5px solid #602E31',
              boxShadow: '0 0 16px rgba(96, 46, 49, 0.4)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Outer Fluid Ring */}
      <motion.div
        animate={cursorState}
        variants={ringVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          display: isVisible ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 14px rgba(96, 46, 49, 0.2)',
        }}
      >
        {/* Subtle VIEW text inside ring when hovering over image */}
        {cursorState === 'image' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="font-sans font-bold text-[8px] tracking-[0.2em] text-[#241416] uppercase select-none drop-shadow-xs"
          >
            VIEW
          </motion.span>
        )}
      </motion.div>

      {/* Center Precision Dot */}
      <motion.div
        animate={cursorState}
        variants={dotVariants}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          display: isVisible ? 'block' : 'none',
          boxShadow: '0 0 8px rgba(96, 46, 49, 0.6)',
        }}
      />
    </div>
  );
};

export const TronxCursor = CraftslandCursor;
