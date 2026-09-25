import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Leaf,
  ChefHat,
  Sparkles,
  Flame,
  Utensils,
  Calendar,
  Quote,
} from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND, SEATING_SECTIONS } from '@shared/config/constants';
import { useMenu } from '@shared/hooks/useMenu';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import { CinematicHero } from '../components/CinematicHero';
import { ComingSoonMarquee } from '../components/ComingSoonMarquee';
import type { Dish } from '@shared/types/menu';

export const HomePage: React.FC = () => {
  const { dishes } = useMenu();
  const [selectedQuickViewDish, setSelectedQuickViewDish] = useState<Dish | null>(null);

  // Featured signature dishes
  const featuredDishes = dishes.filter((d) => d.featured).slice(0, 6);

  // Four Experience Highlights
  const pillars = [
    {
      title: 'Artisanal Hearth',
      desc: 'Oak and smoldering embers imparting depth to every dish.',
      icon: Flame,
      stat: '100% Fire-Baked',
    },
    {
      title: 'Master Chefs',
      desc: 'Crafted with obsessive precision and heritage technique.',
      icon: ChefHat,
      stat: 'Decades of Mastery',
    },
    {
      title: 'Botanical Purity',
      desc: 'Locally foraged herbs and organic farm harvests.',
      icon: Leaf,
      stat: 'Zero Preservatives',
    },
    {
      title: 'Atmospheric Sanctuaries',
      desc: 'Warm candlelight, brass accents, and curated sonic ambiance.',
      icon: Sparkles,
      stat: '4 Bespoke Salons',
    },
  ];

  // Real mood discovery mapped directly to authenticated database attributes
  const moods = [
    {
      title: "Chef's Curations",
      desc: 'Master craft dishes chosen by our culinary team',
      href: '/menu?tag=CHEFS_CHOICE',
      icon: ChefHat,
      count: dishes.filter((d) => d.dietaryTags.includes('CHEFS_CHOICE')).length,
    },
    {
      title: 'Signature Icons',
      desc: 'Our most celebrated creations plated to perfection',
      href: '/menu?tag=SIGNATURE',
      icon: Sparkles,
      count: dishes.filter((d) => d.dietaryTags.includes('SIGNATURE')).length,
    },
    {
      title: 'Botanical & Fresh',
      desc: 'Plant-forward garden botanicals and light greens',
      href: '/menu?tag=VEGAN',
      icon: Leaf,
      count: dishes.filter((d) => d.dietaryTags.includes('VEGAN') || d.dietaryTags.includes('VEGETARIAN')).length,
    },
    {
      title: 'Bold & Fiery',
      desc: 'Artisanal spices with wood-fired heat',
      href: '/menu?tag=SPICY',
      icon: Flame,
      count: dishes.filter((d) => d.dietaryTags.includes('SPICY')).length,
    },
    {
      title: 'Hearty Mains',
      desc: 'Slow-simmered gravies and flame-seared mains',
      href: '/menu/mains',
      icon: Utensils,
      count: dishes.filter((d) => d.categorySlug === 'mains').length,
    },
    {
      title: 'Something Sweet',
      desc: 'Artisanal confections and chilled indulgences',
      href: '/menu/desserts',
      icon: Heart,
      count: dishes.filter((d) => d.categorySlug === 'desserts').length,
    },
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

  // Editorial Critic Reviews
  const accolades = [
    {
      critic: 'The Epicurean Chronicle',
      rating: '★★★★★',
      quote:
        'A triumph of fire and soul. Tronx delivers an intoxicating balance of intimacy, culinary audacity, and sensory elevation.',
      author: 'Julian Thorne, Chief Gastronomy Critic',
    },
    {
      critic: 'Michelin Dining Guide Journal',
      rating: 'Exceptional Distinction',
      quote:
        'The wood-fired biryani and stone-baked creations demonstrate a profound command of smoke, aromatic botanicals, and heat calibration.',
      author: 'Global Culinary Inspectorate',
    },
    {
      critic: 'Vogue Gastronomy',
      rating: 'Destination of the Year',
      quote:
        'From the brass-illuminated Main Dining Sanctuary to the private wine pairings, Tronx is where culinary theater becomes pure poetry.',
      author: 'Claire Delacroix, Arts & Culture Editor',
    },
  ];

  return (
    <div className="space-y-0 pb-24 overflow-x-hidden">
      <MetaTags
        title="Tronx — Good Food Brighter Moods"
        description="Experience a world of flavors crafted with passion and the freshest ingredients."
      />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC FULL-SCREEN VIDEO HERO */}
      {/* ========================================================================= */}
      <CinematicHero />

      {/* ========================================================================= */}
      {/* 2. THE FOUR PILLARS / EXPERIENCE SECTION */}
      {/* ========================================================================= */}
      <section id="tronx-discovery-start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.3em] uppercase block">
            The Tronx Standard
          </span>
          <h2 className="font-luxury text-3xl sm:text-5xl font-bold text-[#241416]">
            Four Pillars of Culinary Artistry
          </h2>
          <p className="text-[#7E6568] text-xs sm:text-sm font-light leading-relaxed">
            Every element—from foraged botanicals to our smoldering oak hearth—is calibrated to awaken your senses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-7 sm:p-8 rounded-2xl border border-[#E8D9CC] hover:border-[#602E31] hover:shadow-[0_12px_30px_rgba(96,46,49,0.08)] transition-all duration-300 flex flex-col justify-between space-y-5 text-center group shadow-xs hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#602E31]/10 border border-[#602E31]/20 text-[#602E31] flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#241416] group-hover:text-[#602E31] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#7E6568] text-xs leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8D9CC]/50">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#C2674F] font-bold">
                    {item.stat}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE AURA AI SOMMELIER & CONCIERGE SHOWCASE (SHOWSTOPPER) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#241416] via-[#3A181A] to-[#602E31] text-[#FFF5EC] p-8 sm:p-12 lg:p-16 border border-[#602E31]/50 shadow-2xl">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C2674F]/20 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B86268]/20 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E8B896] text-[10px] font-sans font-bold tracking-[0.25em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#E8B896]" />
                <span>Next-Gen Dining Intelligence</span>
              </div>
              <h2 className="font-luxury text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white">
                Meet Aura.
                <br />
                <span className="gold-gradient-text italic font-normal">
                  Your AI Gastronomy Concierge.
                </span>
              </h2>
              <p className="text-[#E8D9CC] text-xs sm:text-sm font-light leading-relaxed max-w-xl">
                Not sure which vintage pairs with wood-fired biryani? Seeking an artisanal 4-course vegetarian journey? Ask Aura to curate your table in real-time, grounded directly in our live kitchen pantry.
              </p>

              {/* Quick Interactive Prompt Chips */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#E8B896] font-semibold block">
                  Tap an inquiry to consult Aura right now:
                </span>
                <div className="flex flex-wrap gap-2.5">
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
              <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#602E31] border border-[#E8B896]/40 flex items-center justify-center">
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

                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-[11px] text-[#E8D9CC] leading-relaxed">
                    <p className="font-serif italic text-white/90">
                      "I recommend the <strong className="text-[#E8B896]">Tronx Wood-Fired Biryani</strong> paired with a chilled pomegranate raita and an earthy Pinot Noir to complement the smoldering saffron notes."
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-white block">Truffle Fries</span>
                      <span className="text-[10px] text-[#E8B896] font-mono">₹280 • Chef's Choice</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAskAuraPrompt('Tell me about the Truffle Fries')}
                      className="px-3 py-1.5 rounded-lg bg-[#602E31] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#4D2326] transition-colors cursor-pointer"
                    >
                      Inquire
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAskAuraPrompt('Hello Aura, recommend something special for me today.')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#602E31] to-[#4D2326] hover:from-[#4D2326] hover:to-[#3A181A] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer border border-[#E8B896]/30 flex items-center justify-center gap-2"
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
      {/* 4. WHAT ARE YOU IN THE MOOD FOR? (REAL DATABASE DISCOVERY) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.3em] uppercase block">
            Sensory Exploration
          </span>
          <h2 className="font-luxury text-3xl sm:text-5xl font-bold text-[#241416]">
            What Are You in the Mood For?
          </h2>
          <p className="text-[#7E6568] text-xs sm:text-sm font-light leading-relaxed">
            Navigate our seasonal menu through taste profiles, culinary heat, and botanical inspirations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {moods.map((mood) => {
            const MoodIcon = mood.icon;
            return (
              <Link
                key={mood.title}
                to={mood.href}
                className="group relative bg-white p-5 rounded-2xl border border-[#E8D9CC] hover:border-[#602E31] transition-all duration-300 flex flex-col items-center text-center space-y-3 shadow-xs hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF2EA] group-hover:bg-[#602E31] text-[#602E31] group-hover:text-[#FFF5EC] flex items-center justify-center transition-colors">
                  <MoodIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#241416] group-hover:text-[#602E31] transition-colors leading-tight">
                    {mood.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#7E6568] mt-1 block font-semibold">
                    {mood.count} {mood.count === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SIGNATURE FEATURED DISHES (WITH VIDEO AUTOPLAY) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8D9CC] pb-6">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.3em] uppercase block">
              Curated Selections
            </span>
            <h2 className="font-luxury text-3xl sm:text-5xl font-bold text-[#241416]">
              Signature Harvest Dishes
            </h2>
            <p className="text-[#7E6568] text-sm font-light max-w-xl">
              Watch each dish come alive with cinematic video previews and farm-fresh artistry.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#602E31] hover:text-[#4D2326] uppercase tracking-widest group"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onQuickView={(d) => setSelectedQuickViewDish(d)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. THE TRONX ARCHITECTURAL SANCTUARIES */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.3em] uppercase block">
            Atmospheric Sanctuaries
          </span>
          <h2 className="font-luxury text-3xl sm:text-5xl font-bold text-[#241416]">
            Choose Your Dining Salon
          </h2>
          <p className="text-[#7E6568] text-xs sm:text-sm font-light leading-relaxed">
            Four uniquely sculpted environments tailored for intimate dates, lively celebrations, or private VIP tastings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <span>Reserve Space</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. EDITORIAL PHILOSOPHY & GASTRONOMY STORYTELLING */}
      {/* ========================================================================= */}
      <section className="bg-[#241416] text-[#FFF5EC] py-24 sm:py-32 relative overflow-hidden border-y border-[#3A181A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,103,79,0.18),transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-sans text-xs font-bold text-[#C2674F] tracking-[0.3em] uppercase block">
                The Tronx Philosophy
              </span>
              <h2 className="font-luxury text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                {RESTAURANT_BRAND.storyHeading}
              </h2>
              <p className="text-[#E8D9CC] text-sm sm:text-base font-light leading-relaxed">
                {RESTAURANT_BRAND.storySubheading} At Tronx, dining is approached as an unhurried sensory dialogue. From our morning forage of organic herbs to the smoldering oak logs that season our wood-fired hearths, every plate embodies our devotion to purity, vitality, and mood elevation.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm border border-[#C2674F]/40"
                >
                  <span>Our Culinary Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/reservation"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FFF5EC] hover:text-[#C2674F] uppercase tracking-widest transition-colors"
                >
                  <span>Reserve Table</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop"
                    alt="Wood-fired craft"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
                  <span className="font-serif text-2xl font-bold text-[#C2674F] block">100%</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#E8D9CC]">Artisanal Hearth</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
                  <span className="font-serif text-2xl font-bold text-[#C2674F] block">Daily</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#E8D9CC]">Fresh Harvest</span>
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
                    alt="Plated culinary excellence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CRITIC ACCOLADES & GASTRONOMY PRAISE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.3em] uppercase block">
            Critical Acclaim
          </span>
          <h2 className="font-luxury text-3xl sm:text-5xl font-bold text-[#241416]">
            Words From The Gastronomy Press
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accolades.map((item) => (
            <div
              key={item.critic}
              className="bg-white p-8 rounded-3xl border border-[#E8D9CC] flex flex-col justify-between space-y-6 shadow-xs relative hover:border-[#602E31] hover:shadow-md transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-[#C2674F]/25" />
              <div className="space-y-4">
                <span className="text-xs font-mono tracking-widest uppercase text-[#C2674F] font-bold block">
                  {item.rating}
                </span>
                <p className="font-serif text-sm sm:text-base italic text-[#241416] leading-relaxed">
                  "{item.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-[#E8D9CC] space-y-0.5">
                <span className="font-sans text-xs font-bold text-[#241416] block">
                  {item.critic}
                </span>
                <span className="text-[10px] text-[#7E6568] font-sans">
                  {item.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. COMING SOON CONTINUOUS HORIZONTAL MARQUEE SHOWCASE (RIGHT -> LEFT) */}
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
