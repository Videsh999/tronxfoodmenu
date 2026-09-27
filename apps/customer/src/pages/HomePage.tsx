import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Search,
  Calendar,
  Play,
  X,
  ChefHat,
  Filter,
  Utensils,
} from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { SEATING_SECTIONS } from '@shared/config/constants';
import { useMenu } from '@shared/hooks/useMenu';
import { formatPrice } from '@shared/utils/formatters';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import { CinematicHero } from '../components/CinematicHero';
import { ComingSoonMarquee } from '../components/ComingSoonMarquee';
import type { Dish } from '@shared/types/menu';

export const HomePage: React.FC = () => {
  const { dishes, categories } = useMenu();
  const [selectedQuickViewDish, setSelectedQuickViewDish] = useState<Dish | null>(null);

  // PlatePost Filter State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDietaryFilter, setActiveDietaryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ── TRENDING REEL STORIES (PlatePost signature feature) ──
  const trendingReels = useMemo(() => {
    // Select dishes with verified video URLs across key categories
    const reelSlugs = [
      'tronx-biryani',
      'chicken-tikka',
      'wood-fired-margherita',
      'creamy-alfredo-pasta',
      'crispy-chicken-wings',
      'chocolate-lava-brownie',
    ];
    return dishes.filter((d) => reelSlugs.includes(d.slug));
  }, [dishes]);

  // ── FILTERED DISHES FOR PLATEPOST VIDEO GRID ──
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category filter
      if (activeCategory !== 'all' && dish.categorySlug !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (activeDietaryFilter === 'VEG') {
        const isVeg = dish.dietaryTags.some((t) => t === 'VEGETARIAN' || t === 'VEGAN');
        if (!isVeg) return false;
      } else if (activeDietaryFilter === 'NON_VEG') {
        const isVeg = dish.dietaryTags.some((t) => t === 'VEGETARIAN' || t === 'VEGAN');
        if (isVeg) return false;
      } else if (activeDietaryFilter === 'CHEFS_CHOICE') {
        if (!dish.dietaryTags.includes('CHEFS_CHOICE')) return false;
      } else if (activeDietaryFilter === 'SPICY') {
        if (!dish.dietaryTags.includes('SPICY')) return false;
      } else if (activeDietaryFilter === 'SIGNATURE') {
        if (!dish.dietaryTags.includes('SIGNATURE')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesTag = dish.dietaryTags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      return true;
    });
  }, [dishes, activeCategory, activeDietaryFilter, searchQuery]);

  // Dietary Filter Options
  const dietaryFilters = [
    { id: 'ALL', label: 'All Dishes', icon: Utensils },
    { id: 'VEG', label: 'Pure Veg', dot: 'bg-emerald-500' },
    { id: 'NON_VEG', label: 'Non-Veg', dot: 'bg-rose-500' },
    { id: 'SIGNATURE', label: 'Signature', icon: Sparkles },
    { id: 'CHEFS_CHOICE', label: "Chef's Choice", icon: ChefHat },
    { id: 'SPICY', label: 'Spicy Fire', icon: Flame },
  ];

  // Visual photos mapped to the 4 seating sanctuaries
  const sanctuaryImages: Record<string, string> = {
    MAIN_DINING: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=900&auto=format&fit=crop',
    CHEFS_COUNTER: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=900&auto=format&fit=crop',
    TERRACE: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop',
    PRIVATE_VAULT: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=900&auto=format&fit=crop',
  };

  const handleAskAuraPrompt = (prompt: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-ask-aura', {
          detail: { question: prompt },
        })
      );
    }
  };

  return (
    <div className="space-y-0 pb-24 overflow-x-hidden">
      <MetaTags
        title="Tronx — Live Video Menu & Artisanal Dining"
        description="Every dish presented with high-definition culinary video, authentic recipes, and seamless one-click ordering."
      />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC FULL-SCREEN VIDEO HERO */}
      {/* ========================================================================= */}
      <CinematicHero />

      {/* ========================================================================= */}
      {/* 2. PLATEPOST VIDEO STORIES / REELS SPOTLIGHT (Signature Video Feature) */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#FFF5EC] to-white border-b border-[#E8D9CC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <h2 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#602E31]">
                Trending Video Reels
              </h2>
              <span className="text-[10px] font-mono text-[#7E6568] bg-[#602E31]/10 px-2 py-0.5 rounded-full font-semibold">
                Tap to Watch & Order
              </span>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-[#602E31] hover:text-[#4D2326] flex items-center gap-1 group"
            >
              <span>Full Video Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Horizontal Reel Stories Row */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
            {trendingReels.map((dish) => (
              <button
                key={dish.id}
                type="button"
                onClick={() => setSelectedQuickViewDish(dish)}
                className="group flex-shrink-0 flex flex-col items-center text-center space-y-2 cursor-pointer focus:outline-none"
              >
                {/* Pulsing Gradient Story Ring */}
                <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#602E31] via-[#C2674F] to-[#E8B896] shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-black relative border-2 border-white">
                    <video
                      src={dish.videoUrl}
                      poster={dish.posterUrl || dish.mediaUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-24 text-center">
                  <span className="font-serif text-xs font-bold text-[#241416] group-hover:text-[#602E31] transition-colors block truncate leading-tight">
                    {dish.name}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#602E31] block">
                    {formatPrice(dish.price)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATEPOST INTERACTIVE VIDEO MENU & 1-TAP ORDERING (MAIN TARGET) */}
      {/* ========================================================================= */}
      <section id="platepost-video-menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8D9CC] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#602E31]/10 text-[#602E31] text-[10px] font-mono uppercase font-bold tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PlatePost Video-First Experience</span>
            </div>
            <h2 className="font-luxury text-3xl sm:text-5xl font-bold text-[#241416]">
              Interactive Live Video Menu
            </h2>
            <p className="text-[#7E6568] text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
              Every dish is paired with high-definition culinary video footage, verified farm-fresh ingredients, and instant 1-tap ordering.
            </p>
          </div>

          {/* Quick Dietary Counter Stats */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#241416] bg-white border border-[#E8D9CC] px-3 py-1.5 rounded-xl shadow-xs">
              {filteredDishes.length} {filteredDishes.length === 1 ? 'Dish Available' : 'Dishes Available'}
            </span>
          </div>
        </div>

        {/* ── Category Tabs (PlatePost Navigation) ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex-shrink-0 flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-[#602E31] text-white shadow-md'
                  : 'bg-white text-[#533B3D] border border-[#E8D9CC] hover:border-[#602E31]'
              }`}
            >
              <span>All Dishes</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#FAF2EA] text-[#7E6568]'
              }`}>
                {dishes.length}
              </span>
            </button>

            {categories.map((cat) => {
              const catCount = dishes.filter((d) => d.categorySlug === cat.slug).length;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex-shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#602E31] text-white shadow-md'
                      : 'bg-white text-[#533B3D] border border-[#E8D9CC] hover:border-[#602E31]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FAF2EA] text-[#7E6568]'
                  }`}>
                    {catCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Live Search & Dietary Filter Bar ── */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7E6568] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes by name, spice, or ingredients..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#E8D9CC] text-xs text-[#241416] placeholder:text-[#7E6568]/70 focus:outline-none focus:border-[#602E31] focus:ring-1 focus:ring-[#602E31] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E6568] hover:text-[#241416]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dietary Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {dietaryFilters.map((df) => {
                const isActive = activeDietaryFilter === df.id;
                const Icon = df.icon;
                return (
                  <button
                    key={df.id}
                    type="button"
                    onClick={() => setActiveDietaryFilter(df.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-200 cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-xs ${
                      isActive
                        ? 'bg-[#241416] text-white shadow-sm border border-[#241416]'
                        : 'bg-white text-[#533B3D] border border-[#E8D9CC] hover:border-[#602E31]'
                    }`}
                  >
                    {df.dot ? (
                      <span className={`w-2 h-2 rounded-full ${df.dot}`} />
                    ) : Icon ? (
                      <Icon className="w-3.5 h-3.5 text-[#C2674F]" />
                    ) : null}
                    <span>{df.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── VIDEO DISH GRID (PlatePost Style) ── */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onQuickView={(d) => setSelectedQuickViewDish(d)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8D9CC] p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FAF2EA] text-[#602E31] flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#241416]">No matching dishes found</h3>
            <p className="text-xs text-[#7E6568] leading-relaxed">
              We couldn't find any dishes matching your current search or dietary filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveDietaryFilter('ALL');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#602E31] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#4D2326] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE AURA AI SOMMELIER & CONCIERGE SHOWCASE (FUNCTIONALITY) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#241416] via-[#3A181A] to-[#602E31] text-[#FFF5EC] p-8 sm:p-12 lg:p-14 border border-[#602E31]/50 shadow-2xl">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C2674F]/20 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B86268]/20 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E8B896] text-[10px] font-sans font-bold tracking-[0.25em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#E8B896]" />
                <span>Next-Gen Dining Intelligence</span>
              </div>
              <h2 className="font-luxury text-3xl sm:text-5xl font-bold leading-tight text-white">
                Need Help Deciding?
                <br />
                <span className="gold-gradient-text italic font-normal">
                  Ask Aura AI Concierge.
                </span>
              </h2>
              <p className="text-[#E8D9CC] text-xs sm:text-sm font-light leading-relaxed max-w-xl">
                Not sure which vintage pairs with wood-fired biryani? Seeking an artisanal 4-course vegetarian journey? Tap any inquiry below for real-time recommendations.
              </p>

              {/* Quick Interactive Prompt Chips */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#E8B896] font-semibold block">
                  Tap an inquiry to consult Aura right now:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '🍷 Recommend a wine pairing', prompt: 'What wine notes pair best with the artisanal Truffle Fries and Biryani?' },
                    { label: '🌶️ Spiciest signature dish', prompt: 'What is the spiciest and most flavorful wood-fired dish on the menu?' },
                    { label: '🕯️ Romantic dinner for 2', prompt: 'Curate a memorable romantic dinner for 2 with drinks, mains, and dessert.' },
                    { label: '🌿 100% plant-forward curation', prompt: 'Show me your best vegan and plant-based dishes crafted with organic herbs.' },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleAskAuraPrompt(chip.prompt)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.97] border border-white/20 hover:border-[#E8B896] text-xs text-[#FFF5EC] font-sans font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span>{chip.label}</span>
                      <ArrowRight className="w-3 h-3 text-[#E8B896]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Sommelier Phone Card Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#602E31] border border-[#E8B896]/40 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#E8B896]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-white tracking-wide">Aura Concierge</h4>
                      <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live & Ready
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#E8D9CC]/70">v2.4</span>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-[11px] text-[#E8D9CC] leading-relaxed">
                    <p className="font-serif italic text-white/90">
                      "I recommend the <strong className="text-[#E8B896]">Tronx Wood-Fired Biryani</strong> paired with a chilled pomegranate raita and an earthy Pinot Noir to complement the smoldering saffron notes."
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-white block">Truffle French Fries</span>
                      <span className="text-[10px] text-[#E8B896] font-mono">₹189 • Chef's Choice</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAskAuraPrompt('Tell me about the Truffle Fries')}
                      className="px-2.5 py-1 rounded-lg bg-[#602E31] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#4D2326] transition-colors cursor-pointer"
                    >
                      Inquire
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAskAuraPrompt('Hello Aura, recommend something special for me today.')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#602E31] to-[#4D2326] hover:from-[#4D2326] hover:to-[#3A181A] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer border border-[#E8B896]/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8B896]" />
                  <span>Open Full Aura Concierge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TABLE RESERVATIONS QUICK-BOOKING (FUNCTIONALITY) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8D9CC] pb-6">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.3em] uppercase block">
              Direct Seating
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-[#241416]">
              Reserve Your Table
            </h2>
            <p className="text-[#7E6568] text-xs sm:text-sm font-light">
              Choose your preferred dining salon with live capacity checks and instant booking.
            </p>
          </div>
          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#602E31] hover:text-[#4D2326] uppercase tracking-widest group"
          >
            <span>All Reservation Options</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEATING_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              className="bg-white rounded-2xl border border-[#E8D9CC] overflow-hidden hover:border-[#602E31] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={sanctuaryImages[sec.id] || sanctuaryImages.MAIN_DINING}
                  alt={sec.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono tracking-wider uppercase text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                  Salon 0{sec.id.length % 4 + 1}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-[#241416] group-hover:text-[#602E31] transition-colors">
                    {sec.name}
                  </h3>
                  <p className="text-[#7E6568] text-xs leading-relaxed font-sans line-clamp-2">
                    {sec.desc}
                  </p>
                </div>
                <Link
                  to={`/reservation?section=${sec.id}`}
                  className="w-full py-2.5 rounded-xl border border-[#E8D9CC] group-hover:border-[#602E31] group-hover:bg-[#602E31] group-hover:text-white text-[#241416] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C2674F] group-hover:text-white" />
                  <span>Reserve Table</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMING SOON CONTINUOUS HORIZONTAL MARQUEE SHOWCASE */}
      {/* ========================================================================= */}
      <ComingSoonMarquee
        dishes={dishes}
        onSelectDish={(d) => setSelectedQuickViewDish(d)}
      />

      {/* Quick View Modal */}
      <DishDetailModal
        dish={selectedQuickViewDish}
        isOpen={!!selectedQuickViewDish}
        onClose={() => setSelectedQuickViewDish(null)}
        onSelectDish={(d) => setSelectedQuickViewDish(d)}
      />
    </div>
  );
};
