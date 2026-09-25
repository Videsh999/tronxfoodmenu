import React, { useState } from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { Link } from 'react-router-dom';
import { EmptyState } from '@shared/components/EmptyState';
import { Heart } from 'lucide-react';
import { useFavorites } from '@shared/hooks/useFavorites';
import { useMenu } from '@shared/hooks/useMenu';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import type { Dish } from '@shared/types/menu';

export const FavoritesPage: React.FC = () => {
  const { favoriteIds } = useFavorites();
  const { dishes } = useMenu();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const favoritedDishes = dishes.filter((d) => favoriteIds.includes(d.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <MetaTags title="Saved Favorites | Tronx" description="Your bookmarked artisanal dishes and culinary favorites." />

      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#602E31] font-bold block">
          Your Curated Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241416]">
          Saved Favorites ({favoritedDishes.length})
        </h1>
      </div>

      {favoritedDishes.length === 0 ? (
        <div className="max-w-md mx-auto">
          <EmptyState
            title="No Saved Favorites Yet"
            description="Tap the heart icon (♡) on any dish across our video-first menu to keep your favorite recipes at your fingertips."
            icon={<Heart className="w-7 h-7 text-[#C2674F]" />}
            action={
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Explore Video Menu
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritedDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onQuickView={(d) => setSelectedDish(d)}
            />
          ))}
        </div>
      )}

      <DishDetailModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </div>
  );
};
