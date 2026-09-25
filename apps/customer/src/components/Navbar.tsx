import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Calendar, User, Menu as MenuIcon, X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useCart } from '@shared/hooks/useCart';
import { useMusic } from '@shared/context/MusicContext';
import { TronxLogo } from '@shared/components/CraftslandLogo';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { isPlaying, toggleSound } = useMusic();

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAura = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-ask-aura', {
          detail: { question: 'What do you recommend for dinner tonight?' },
        })
      );
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <>
      {/* Editorial Announcement Banner */}
      <div className="bg-[#4D2326] text-[#E8D9CC] text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.24em] py-1.5 px-4 text-center border-b border-white/10 flex items-center justify-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>Open Tonight: 16:30 – 23:30</span>
        <span className="hidden sm:inline-block text-white/30">•</span>
        <span className="hidden sm:inline-block text-[#E8B896]">Complimentary Truffle Brioche with Tasting Menu</span>
        <span className="hidden md:inline-block text-white/30">•</span>
        <Link to="/reservation" className="hidden md:inline-block underline hover:text-white transition-colors">
          Reserve Sanctuary
        </Link>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#602E31]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-md'
            : 'bg-[#602E31] py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Tronx Brand Logo with Cream & Wine Inverted Crest */}
            <Link to="/" className="group flex items-center transition-transform duration-300 hover:scale-[1.02]">
              <TronxLogo variant="green-invert" size="md" />
            </Link>

            {/* Editorial Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-medium tracking-[0.2em] uppercase transition-all duration-200 relative py-1.5 ${
                      isActive
                        ? 'text-[#FFF5EC] font-semibold'
                        : 'text-[#E8D9CC]/80 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="custActiveNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFF5EC] rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Luxury Actions & Utilities */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5">
              
              {/* Ask Aura AI Concierge Button */}
              <button
                type="button"
                onClick={handleOpenAura}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E8B896]/40 bg-gradient-to-r from-white/10 to-[#C2674F]/25 hover:from-white/20 hover:to-[#C2674F]/35 text-[#FFF5EC] font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.97]"
                title="Consult Tronx AI Concierge"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8B896] animate-pulse" />
                <span>Ask Aura</span>
              </button>

              {/* Table Reservation Button */}
              <Link
                to="/reservation"
                className="hidden sm:inline-flex items-center gap-2 px-4.5 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-[#FFF5EC] font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm active:scale-[0.97]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E8D9CC]" />
                <span>Reserve</span>
              </Link>

            {/* Sound Toggle - Circular Outlined Container */}
            <button
              type="button"
              onClick={toggleSound}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-200 active:scale-[0.97] cursor-pointer"
              title={isPlaying ? 'Sound On — Click to mute' : 'Sound Off — Click to play'}
              aria-label={isPlaying ? 'Sound On' : 'Sound Off'}
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-[#FFF5EC]" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/60" />
              )}
            </button>

            {/* Account Profile Icon - Circular Outlined Container */}
            <Link
              to="/account"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-200 active:scale-[0.97]"
              title="Customer Account"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Cart Drawer Trigger - Circular Outlined Container */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-200 active:scale-[0.97] cursor-pointer"
              title="View Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <AnimatePresence mode="popLayout">
                {totalItemsCount > 0 && (
                  <motion.span
                    key={totalItemsCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#C2674F] text-white font-bold text-[9px] flex items-center justify-center border-2 border-[#602E31] shadow-xs"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/90 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-white/10 bg-[#602E31] px-6 py-6 space-y-5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col space-y-3.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium tracking-[0.2em] uppercase transition-colors ${
                    location.pathname === link.path ? 'text-[#FFF5EC] font-bold' : 'text-[#E8D9CC]/80 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                type="button"
                onClick={toggleSound}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/15 text-[#FFF5EC] text-xs font-semibold uppercase tracking-wider active:scale-[0.97] transition-all cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#FFF5EC]" />
                    <span>Ambient Sound: On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-white/60" />
                    <span>Ambient Sound: Muted</span>
                  </>
                )}
              </button>

              <Link
                to="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-xl bg-white/10 border border-white/20 text-[#FFF5EC] font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-white/20 active:scale-[0.97] transition-transform"
              >
                Reserve a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};

