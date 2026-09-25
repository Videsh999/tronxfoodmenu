import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Heart } from 'lucide-react';
import type { Dish } from '@shared/types/menu';
import { useCart } from '@shared/hooks/useCart';
import { useFavorites } from '@shared/hooks/useFavorites';
import { PremiumAutoVideo } from '@shared/components/PremiumAutoVideo';
import { formatPrice } from '@shared/utils/formatters';

interface DishCardProps {
  dish: Dish;
  onQuickView: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onQuickView }) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);

  const isFav = isFavorite(dish.id);
  const isVegetarian = dish.dietaryTags.some((t) => t === 'VEGETARIAN' || t === 'VEGAN');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.isAvailable) return;

    // If dish has required modifiers, open detail modal for user selection
    if (dish.modifiers && dish.modifiers.some((m) => m.required)) {
      onQuickView(dish);
      return;
    }

    addItem(dish, 1, []);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(dish.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onQuickView(dish)}
      className="group bg-white rounded-2xl border border-[#E8D9CC] overflow-hidden hover:border-[#602E31]/60 hover:shadow-[0_12px_32px_rgba(96,46,49,0.12)] shadow-xs transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* ── 1. DOMINANT AUTOPLAY FOOD VIDEO (occupies majority of card) ── */}
      <div className="relative overflow-hidden bg-[#FAF2EA]">
        <PremiumAutoVideo
          videoUrl={dish.videoUrl}
          posterUrl={dish.posterUrl || dish.mediaUrl}
          fallbackImageUrl={dish.mediaUrl}
          alt={dish.name}
          aspectRatio="aspect-[16/11]"
        />

        {/* Veg / Non-Veg Indicator & Dietary Tag Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          {/* Authentic Dietary Dot Symbol */}
          <span
            className={`w-4 h-4 rounded-xs border flex items-center justify-center bg-white/95 backdrop-blur-xs shadow-xs ${
              isVegetarian ? 'border-emerald-600' : 'border-rose-700'
            }`}
            title={isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isVegetarian ? 'bg-emerald-600' : 'bg-rose-700'
              }`}
            />
          </span>

          {/* Signature / Chef's Pick Badge */}
          {dish.dietaryTags.includes('SIGNATURE') ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider bg-[#C2674F] text-white shadow-xs">
              Signature
            </span>
          ) : dish.dietaryTags.includes('CHEFS_CHOICE') ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider bg-[#602E31] text-white shadow-xs">
              Chef's Pick
            </span>
          ) : null}
        </div>

        {/* Favorite Heart Button (Bottom Right of Video Area, matching reference) */}
        <button
          type="button"
          onClick={handleFavoriteToggle}
          className={`absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md ${
            isFav
              ? 'bg-rose-50/95 text-rose-600 border border-rose-200 scale-105'
              : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border border-white/25 hover:scale-110'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isFav ? 'fill-rose-600 stroke-rose-600 scale-110' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* Sold Out Overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-white text-[#533B3D] border border-[#E8D9CC] text-xs font-bold uppercase tracking-widest shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── 2. SEPARATOR LINE & COMPACT TEXT AREA ── */}
      <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#E8D9CC] bg-white space-y-3">
        {/* Title & Ingredient Subtitle */}
        <div className="space-y-1">
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#241416] group-hover:text-[#602E31] transition-colors line-clamp-1 leading-snug">
            {dish.name}
          </h3>
          <p className="text-[#7E6568] text-xs leading-relaxed line-clamp-1 font-sans">
            {dish.description}
          </p>
        </div>

        {/* Bottom Row: Price on Left, Plus Button on Right */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono font-bold text-base text-[#241416]">
            {formatPrice(dish.price)}
          </span>

          {/* Quick Add '+' Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={!dish.isAvailable}
            onClick={handleQuickAdd}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
              justAdded
                ? 'bg-[#602E31] text-white shadow-sm'
                : dish.isAvailable
                ? 'bg-[#602E31] hover:bg-[#4D2326] text-white hover:shadow-md hover:scale-105 active:scale-[0.97]'
                : 'bg-[#FAF2EA] text-[#7E6568] border border-[#E8D9CC] cursor-not-allowed'
            }`}
            title={dish.isAvailable ? 'Add to order' : 'Sold out'}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
