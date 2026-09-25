import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Dish } from '@shared/types/menu';
import { formatPrice } from '@shared/utils/formatters';

interface ComingSoonMarqueeProps {
  dishes: Dish[];
  onSelectDish?: (dish: Dish) => void;
}

export const ComingSoonMarquee: React.FC<ComingSoonMarqueeProps> = ({ dishes, onSelectDish }) => {
  // If no dishes loaded yet, render nothing
  if (!dishes || dishes.length === 0) return null;

  // Use real dishes for the preview showcase (up to 8 dishes)
  const previewDishes = dishes.slice(0, 8);
  // Duplicate for seamless 0% -> -50% CSS translation loop
  const marqueeList = [...previewDishes, ...previewDishes];

  return (
    <section className="relative py-20 bg-[#241416] overflow-hidden border-y border-white/10">
      {/* Editorial Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#C2674F] text-xs font-sans font-semibold tracking-[0.25em] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Culinary Horizon</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FFF5EC] tracking-tight">
          Coming Soon to Tronx
        </h2>

        <p className="text-[#E8D9CC]/80 text-xs sm:text-sm font-light max-w-xl mx-auto font-sans leading-relaxed">
          An exclusive preview of upcoming seasonal compositions, hearth-baked creations, and botanical pairings handcrafted by our master chefs.
        </p>

        {/* Decorative Editorial Accent Line */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#C2674F]/60" />
          <div className="w-2 h-2 rotate-45 border border-[#C2674F] bg-[#241416]" />
          <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#C2674F]/60" />
        </div>
      </div>

      {/* Infinite Seamless Continuous Marquee Track (Right -> Left) */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge gradient fades for cinematic focus */}
        <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#241416] to-transparent z-10" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#241416] to-transparent z-10" />

        <div className="animate-marquee-left flex items-center gap-6 py-4 px-3">
          {marqueeList.map((dish, idx) => {
            const isVegetarian = dish.dietaryTags.some((t) => t === 'VEGETARIAN' || t === 'VEGAN');
            return (
              <div
                key={`${dish.id}-${idx}`}
                onClick={() => onSelectDish && onSelectDish(dish)}
                className="group relative w-[280px] sm:w-[320px] shrink-0 bg-[#3A181A] rounded-2xl border border-white/10 hover:border-[#C2674F]/60 p-4 transition-all duration-300 shadow-lg hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-black/40 mb-3.5">
                  <img
                    src={dish.posterUrl || dish.mediaUrl}
                    alt={dish.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <span
                      className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center bg-white/95 shadow-xs ${
                        isVegetarian ? 'border-emerald-600' : 'border-rose-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isVegetarian ? 'bg-emerald-600' : 'bg-rose-700'
                        }`}
                      />
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider bg-[#C2674F] text-white shadow-xs">
                      Preview
                    </span>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono font-semibold text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    {formatPrice(dish.price)}
                  </span>
                </div>

                {/* Dish Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#FFF5EC] group-hover:text-[#C2674F] transition-colors truncate">
                      {dish.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#E8D9CC]/70 font-sans line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Bottom CTA Row */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#C2674F] font-semibold">
                    {dish.categorySlug}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E8D9CC] group-hover:text-[#FFF5EC] group-hover:translate-x-1 transition-all">
                    <span>View details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
