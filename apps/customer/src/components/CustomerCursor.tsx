import React, { useEffect, useRef, useState } from 'react';

export const CustomerCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only mount on desktop with fine mouse pointer
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const checkFine = () => setIsFinePointer(mediaQuery.matches);
    checkFine();
    mediaQuery.addEventListener('change', checkFine);

    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', checkFine);
    }

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;

    let isHovering = false;
    let isMouseDown = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Inspect target element for interactive hover state
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor="hover"], .cursor-pointer'
        );
        isHovering = !!interactive;
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth RAF Interpolation Loop (No React re-renders)
    const updateCursor = () => {
      // Dot follows tightly
      dotX += (mouseX - dotX) * 0.72;
      dotY += (mouseY - dotY) * 0.72;

      // Outer ring follows with smooth luxury lag
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      const ringScale = isMouseDown ? 0.82 : isHovering ? 1.35 : 1;
      const dotScale = isMouseDown ? 0.7 : isHovering ? 1.2 : 1;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        if (isHovering) {
          ringRef.current.style.borderColor = '#602E31';
          ringRef.current.style.backgroundColor = 'rgba(96, 46, 49, 0.12)';
          ringRef.current.style.boxShadow = '0 0 16px rgba(96, 46, 49, 0.4)';
        } else {
          ringRef.current.style.borderColor = 'rgba(96, 46, 49, 0.65)';
          ringRef.current.style.backgroundColor = 'rgba(96, 46, 49, 0.04)';
          ringRef.current.style.boxShadow = '0 0 10px rgba(96, 46, 49, 0.2)';
        }
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.backgroundColor = isHovering ? '#FFF5EC' : '#602E31';
        dotRef.current.style.boxShadow = isHovering
          ? '0 0 10px rgba(255, 245, 236, 0.8)'
          : '0 0 6px rgba(96, 46, 49, 0.6)';
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      mediaQuery.removeEventListener('change', checkFine);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isFinePointer) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}
    >
      {/* 1. Outer Ring: Thin delicate outline with lag and wine glow */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-[#602E31]/65 transition-[border-color,background-color,box-shadow] duration-200 pointer-events-none will-change-transform"
        style={{
          boxShadow: '0 0 10px rgba(96, 46, 49, 0.2)',
        }}
      />

      {/* 2. Inner Dot: Solid precision wine dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#602E31] pointer-events-none will-change-transform"
        style={{
          boxShadow: '0 0 6px rgba(96, 46, 49, 0.6)',
        }}
      />
    </div>
  );
};

export const TronxCursor = CustomerCursor;
