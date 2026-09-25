import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@shared/components/Modal';
import type { Dish } from '@shared/types/menu';
import type { SelectedModifierOption } from '@shared/types/order';
import { useCart } from '@shared/hooks/useCart';
import { useMenu } from '@shared/hooks/useMenu';
import { useFavorites } from '@shared/hooks/useFavorites';
import {
  Plus,
  Minus,
  Flame,
  ShieldAlert,
  Leaf,
  Check,
  Star,
  Clock,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { PremiumAutoVideo } from '@shared/components/PremiumAutoVideo';
import { formatPrice } from '@shared/utils/formatters';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectDish?: (dish: Dish) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  isOpen,
  onClose,
  onSelectDish,
}) => {
  const { addItem } = useCart();
  const { dishes } = useMenu();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifierOption[]>([]);
  const [isAdded, setIsAdded] = useState(false);

  const currentIndex = useMemo(() => {
    if (!dish || !dishes.length) return -1;
    return dishes.findIndex((d) => d.id === dish.id);
  }, [dish, dishes]);

  if (!dish) return null;

  const isFav = isFavorite(dish.id);

  const handleNavigateDish = (targetDish: Dish) => {
    if (onSelectDish) {
      onSelectDish(targetDish);
      setQuantity(1);
      setSelectedModifiers([]);
      setIsAdded(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > -1 && dishes.length > 1) {
      const prevDish = dishes[(currentIndex - 1 + dishes.length) % dishes.length];
      handleNavigateDish(prevDish);
    }
  };

  const handleNext = () => {
    if (currentIndex > -1 && dishes.length > 1) {
      const nextDish = dishes[(currentIndex + 1) % dishes.length];
      handleNavigateDish(nextDish);
    }
  };

  const handleModifierToggle = (
    modifierTitle: string,
    optionName: string,
    price: number,
    required: boolean
  ) => {
    setSelectedModifiers((prev) => {
      const exists = prev.some(
        (m) => m.modifierTitle === modifierTitle && m.optionName === optionName
      );
      if (exists) {
        return prev.filter((m) => !(m.modifierTitle === modifierTitle && m.optionName === optionName));
      }
      if (required) {
        const filtered = prev.filter((m) => m.modifierTitle !== modifierTitle);
        return [...filtered, { modifierTitle, optionName, price }];
      }
      return [...prev, { modifierTitle, optionName, price }];
    });
  };

  const extraModifiersPrice = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
  const unitPrice = dish.price + extraModifiersPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (isAdded) return;
    addItem(dish, quantity, selectedModifiers);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 450);
  };

  const isVegetarian = dish.dietaryTags.some((t) => t === 'VEGETARIAN' || t === 'VEGAN');
  const isSignature = dish.dietaryTags.includes('SIGNATURE');

  // Determine authentic spice level from tags and description
  const isSpicy =
    dish.dietaryTags.includes('SPICY') ||
    dish.description.toLowerCase().includes('chili') ||
    dish.description.toLowerCase().includes('peppers') ||
    dish.description.toLowerCase().includes('spicy') ||
    dish.description.toLowerCase().includes('charcoal');

  const spiceLevelLabel = isSpicy
    ? 'Medium–High Heat (Charred Chili & Embers)'
    : dish.categorySlug === 'desserts'
    ? 'Delicate / Sweet'
    : 'Mild / Balanced Warmth';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="customer"
      maxWidth="max-w-5xl"
      hideHeader={true}
      className="p-0 overflow-hidden border-0 shadow-2xl"
    >
      {/* ── Outer Side-by-Side Flexbox (Guaranteed 50/50 Desktop, Stacked Mobile) ── */}
      <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-white">
        
        {/* ── LEFT SIDE (Desktop 50% / lg:w-1/2): Large Cinematic Media ── */}
        <div className="w-full lg:w-1/2 h-[260px] sm:h-[320px] lg:h-full shrink-0 relative overflow-hidden bg-[#0A1F12] flex items-center justify-center">
          <PremiumAutoVideo
            videoUrl={dish.videoUrl}
            posterUrl={dish.posterUrl || dish.mediaUrl}
            fallbackImageUrl={dish.mediaUrl}
            alt={dish.name}
            aspectRatio="aspect-auto h-full w-full"
            className="w-full h-full"
            priority={true}
          />

          {/* Cinematic atmospheric edge gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />

          {/* Top-left Badges on Media */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            {isSignature && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#C97852] text-white shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Signature
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/50 backdrop-blur-md text-white/90 border border-white/15">
              {dish.categorySlug.replace('-', ' ')}
            </span>
          </div>

          {/* Mobile Close Button (top-right of media) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="lg:hidden absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all hover:bg-black/70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Previous / Next Dish Navigation Buttons */}
          {dishes.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous dish"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/45 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next dish"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/45 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom Pagination Pill */}
          {currentIndex > -1 && dishes.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md text-white/90 text-[10px] font-mono tracking-widest border border-white/15 pointer-events-none">
              {currentIndex + 1} / {dishes.length}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDE (Desktop 50% / lg:w-1/2): Editorial Information Panel ── */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-between overflow-hidden bg-white text-[#241416]">
          
          {/* Top Header Bar */}
          <div className="px-6 sm:px-8 pt-5 pb-3 border-b border-[#E8D9CC]/60 flex items-center justify-between shrink-0">
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#602E31] font-bold">
              {dish.categorySlug.replace('-', ' ')} • Artisanal Selection
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite(dish.id)}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                className="p-2 rounded-full hover:bg-[#FAF2EA] transition-colors border border-transparent hover:border-[#E8D9CC] cursor-pointer"
                title={isFav ? 'In Favorites' : 'Add to Favorites'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${isFav ? 'fill-[#C2674F] text-[#C2674F]' : 'text-[#7E6568]'}`}
                />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="hidden lg:flex p-2 rounded-full hover:bg-[#FAF2EA] transition-colors border border-transparent hover:border-[#E8D9CC] cursor-pointer text-[#7E6568] hover:text-[#241416]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Information Body (2px ultra-thin scrollbar) */}
          <div className="dish-detail-modal-scroll flex-1 overflow-y-auto px-6 sm:px-8 py-5 space-y-5 min-h-0">
            {/* Title, Veg indicator & Price */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center bg-white shadow-xs shrink-0 mt-1.5 ${
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
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241416] leading-tight">
                    {dish.name}
                  </h2>
                </div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#602E31] shrink-0">
                  {formatPrice(unitPrice)}
                </span>
              </div>
              <p className="text-[#3A453C] text-xs sm:text-sm leading-relaxed font-sans">
                {dish.description}
              </p>
            </div>

            {/* 2x2 Information Grid (Rating, Time, Calories, Dietary) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Rating Card */}
              <div className="p-3 rounded-xl bg-[#FAF2EA] border border-[#E8D9CC]/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C2674F]/10 text-[#C2674F] flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-[#C2674F]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-mono text-[#7E6568] tracking-wider block">
                    Rating
                  </span>
                  <span className="text-xs font-serif font-bold text-[#241416]">
                    4.9 ★ <span className="text-[10px] font-sans font-normal text-[#7E6568]">(Curated)</span>
                  </span>
                </div>
              </div>

              {/* Prep Time Card */}
              <div className="p-3 rounded-xl bg-[#FAF2EA] border border-[#E8D9CC]/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#602E31]/10 text-[#602E31] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-mono text-[#7E6568] tracking-wider block">
                    Prep Time
                  </span>
                  <span className="text-xs font-serif font-bold text-[#241416]">
                    15–20 min
                  </span>
                </div>
              </div>

              {/* Calories Card */}
              <div className="p-3 rounded-xl bg-[#FAF2EA] border border-[#E8D9CC]/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C2674F]/10 text-[#C2674F] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-mono text-[#7E6568] tracking-wider block">
                    Calories
                  </span>
                  <span className="text-xs font-serif font-bold text-[#241416]">
                    {dish.calories ? `${dish.calories} kcal` : 'Artisanal Fresh'}
                  </span>
                </div>
              </div>

              {/* Dietary Card */}
              <div className="p-3 rounded-xl bg-[#FAF2EA] border border-[#E8D9CC]/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#602E31]/10 text-[#602E31] flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-mono text-[#7E6568] tracking-wider block">
                    Dietary
                  </span>
                  <span className="text-xs font-serif font-bold text-[#241416] truncate block">
                    {dish.dietaryTags.length > 0 ? dish.dietaryTags[0].replace('_', ' ') : 'Fresh Harvest'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dietary Tags Pill Row */}
            {dish.dietaryTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {dish.dietaryTags.map((tag) => {
                  const isVeg = tag === 'VEGETARIAN' || tag === 'VEGAN';
                  return (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isVeg
                          ? 'bg-[#602E31]/10 text-[#602E31] border-[#E8D9CC]'
                          : tag === 'SIGNATURE'
                          ? 'bg-[#C2674F]/15 text-[#C2674F] border-[#C2674F]/30 font-bold'
                          : 'bg-[#FAF2EA] text-[#3A453C] border-[#E8D9CC]'
                      }`}
                    >
                      {isVeg && <Leaf className="w-2.5 h-2.5" />}
                      {tag.replace('_', ' ')}
                    </span>
                  );
                })}
              </div>
            )}

            {/* ── INGREDIENTS Section ── */}
            <div className="p-3.5 rounded-2xl bg-[#FAF2EA] border border-[#E8D9CC] flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#602E31]/10 text-[#602E31] flex items-center justify-center shrink-0 mt-0.5">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs font-sans">
                <span className="font-serif font-bold text-[#241416] block">Artisanal Ingredients</span>
                <p className="text-[#7E6568] leading-relaxed">
                  Crafted fresh using prime market harvest, estate cold-pressed oils, and bespoke stone-ground house seasonings.
                </p>
              </div>
            </div>

            {/* ── ALLERGENS Section ── */}
            <div className="p-3.5 rounded-2xl bg-[#FCEBE9] border border-[#E8D9CC] flex items-start gap-3 text-[#A8382B]">
              <div className="w-7 h-7 rounded-lg bg-[#A8382B]/10 text-[#A8382B] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs font-sans">
                <span className="font-serif font-bold text-[#A8382B] block">Allergen Notice</span>
                <p className="text-[#A8382B]/90 leading-relaxed font-medium">
                  {dish.allergens && dish.allergens.length > 0
                    ? `Contains: ${dish.allergens.join(', ')}`
                    : 'No common allergens declared. Please advise your captain if you have specific dietary sensitivities.'}
                </p>
              </div>
            </div>

            {/* ── SPICE LEVEL Section ── */}
            <div className="p-3.5 rounded-2xl bg-[#FAF2EA] border border-[#E8D9CC] flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#C2674F]/10 text-[#C2674F] flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs font-sans">
                <span className="font-serif font-bold text-[#241416] block">Spice Calibration</span>
                <p className="text-[#7E6568] leading-relaxed">
                  {spiceLevelLabel}
                </p>
              </div>
            </div>

            {/* ── MODIFIERS Section ── */}
            {dish.modifiers && dish.modifiers.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-[#E8D9CC]">
                <h4 className="font-serif text-xs font-bold text-[#241416] tracking-wider uppercase">
                  Customizations
                </h4>
                {dish.modifiers.map((mod) => (
                  <div key={mod.id} className="space-y-2">
                    <p className="text-xs text-[#7E6568] font-medium">
                      {mod.title} {mod.required && <span className="text-[#602E31] font-bold">*</span>}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mod.options.map((opt) => {
                        const isSelected = selectedModifiers.some(
                          (m) => m.modifierTitle === mod.title && m.optionName === opt.name
                        );
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleModifierToggle(mod.title, opt.name, opt.price, mod.required)}
                            className={`p-2.5 rounded-xl border text-left text-xs flex justify-between items-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#602E31] bg-[#602E31]/10 text-[#241416] font-semibold ring-1 ring-[#602E31]'
                                : 'border-[#E8D9CC] bg-[#FAF2EA] text-[#3A453C] hover:border-[#602E31]/40 hover:text-[#241416]'
                            }`}
                          >
                            <span>{opt.name}</span>
                            <span className="text-[#602E31] font-mono font-bold">
                              {opt.price > 0 ? `+${formatPrice(opt.price)}` : 'Included'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── STICKY BOTTOM ACTION BAR ── */}
          <div className="p-4 sm:p-5 border-t border-[#E8D9CC] bg-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 bg-[#FAF2EA] p-1.5 rounded-full border border-[#E8D9CC]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7E6568] hover:text-[#241416] hover:bg-white transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-serif font-bold text-sm px-2 text-[#241416]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7E6568] hover:text-[#241416] hover:bg-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={!dish.isAvailable || isAdded}
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-initial sm:min-w-[200px] px-6 py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-xs border cursor-pointer min-h-[44px] flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-[#241416] text-[#C2674F] border-[#C2674F]'
                  : dish.isAvailable
                  ? 'bg-[#602E31] hover:bg-[#4D2326] text-white border-[#4D2326]'
                  : 'bg-[#FAF2EA] text-[#7E6568] border-[#E8D9CC] cursor-not-allowed'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-[#C2674F]" />
                  <span>Added To Order</span>
                </>
              ) : dish.isAvailable ? (
                `Add To Order • ${formatPrice(totalPrice)}`
              ) : (
                'Currently Unavailable'
              )}
            </motion.button>
          </div>

        </div>
      </div>
    </Modal>
  );
};
