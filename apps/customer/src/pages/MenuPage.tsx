import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMenu } from '@shared/hooks/useMenu';
import { useCart } from '@shared/hooks/useCart';
import { MetaTags } from '@shared/components/MetaTags';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { EmptyState } from '@shared/components/EmptyState';
import { Search, Utensils, X, Filter, ChefHat } from 'lucide-react';
import type { Dish, DietaryTag } from '@shared/types/menu';

export const MenuPage: React.FC = () => {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories, dishes, searchQuery, setSearchQuery, isLoading } = useMenu();
  const { tableNumber, setTableNumber } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>(urlCategory || 'all');
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<DietaryTag | null>(null);
  const [quickViewDish, setQuickViewDish] = useState<Dish | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Parse QR table parameter and mood tag from URL e.g. /menu?table=12 or /menu?tag=CHEFS_CHOICE
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
    const tagParam = searchParams.get('tag') as DietaryTag | null;
    if (tagParam && dietaryOptions.includes(tagParam)) {
      setSelectedDietaryTag(tagParam);
    }
  }, [searchParams, setTableNumber]);

  // Keep URL & state synchronized when category tab changes
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    } else {
      setActiveCategory('all');
    }
  }, [urlCategory]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      navigate('/menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If we're in the "all" view, scroll to the section instead of routing
      const section = document.getElementById(`menu-section-${slug}`);
      if (section && !urlCategory) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Keep URL as /menu (all view) but highlight the pill
      } else {
        navigate(`/menu/${slug}`);
      }
    }
  };

  const dietaryOptions: DietaryTag[] = ['SIGNATURE', 'CHEFS_CHOICE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'NUT_FREE', 'HALAL'];

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory = activeCategory === 'all' || dish.categorySlug === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDietary = !selectedDietaryTag || dish.dietaryTags.includes(selectedDietaryTag);
      return matchesCategory && matchesSearch && matchesDietary;
    });
  }, [dishes, activeCategory, searchQuery, selectedDietaryTag]);

  // Group dishes by category for the "all" view
  const categorySections = useMemo(() => {
    if (activeCategory !== 'all' && !urlCategory) return null;
    if (urlCategory) return null; // single category view

    return categories
      .map((cat) => ({
        category: cat,
        dishes: filteredDishes.filter((d) => d.categorySlug === cat.slug),
      }))
      .filter((section) => section.dishes.length > 0);
  }, [categories, filteredDishes, activeCategory, urlCategory]);

  if (isLoading) {
    return <LoadingSpinner label="Loading the Tronx Menu..." />;
  }

  return (
    <div className="min-h-screen">
      <MetaTags title="Menu | Tronx" description="Explore the complete Tronx culinary collection — flame-grilled mains, artisanal pastas, stone-baked pizzas, and more." />

      {/* ── Premium Menu Hero ────────────────────────────────────────── */}
      <section className="relative h-56 sm:h-72 flex items-center justify-center overflow-hidden bg-[#241416]">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920&auto=format&fit=crop"
          alt="Tronx culinary artistry"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241416]/90 via-[#241416]/50 to-transparent" />
        <div className="relative z-10 text-center space-y-3 px-4">
          {tableNumber && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 font-mono text-xs mb-2 font-bold">
              <Utensils className="w-3.5 h-3.5" /> Dine-In • Table {tableNumber}
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-sans uppercase tracking-[0.35em] text-[#C2674F] font-bold block mb-2">
              Artisanal Harvest Collection
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              MENU
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/75 text-sm max-w-xl mx-auto font-sans"
          >
            Watch each dish come alive — seasonal harvest, flame-grilled perfection, and artisanal craft.
          </motion.p>
        </div>
      </section>

      {/* ── Sticky Filter & Category Navigation ──────────────────────── */}
      <div
        ref={navRef}
        className="sticky top-[68px] sm:top-[72px] z-30 bg-[#FFF5EC]/95 backdrop-blur-md border-b border-[#E8D9CC] shadow-sm transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          {/* Search & Dietary Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Live Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#7E6568]" />
              <input
                type="text"
                placeholder="Search dish or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#E8D9CC] text-xs text-[#241416] placeholder-[#7E6568]/60 focus:outline-none focus:border-[#602E31] focus:ring-1 focus:ring-[#602E31]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-[#7E6568] hover:text-[#241416] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary Filter Tags */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs text-[#7E6568] font-mono flex items-center gap-1 mr-1.5">
                <Filter className="w-3.5 h-3.5 text-[#602E31]" />
              </span>
              {dietaryOptions.map((tag) => {
                const isSelected = selectedDietaryTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedDietaryTag(isSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#602E31] text-[#FFF5EC] font-bold border-[#602E31]'
                        : 'bg-white text-[#533B3D] border-[#E8D9CC] hover:border-[#602E31]/40 hover:text-[#241416]'
                    }`}
                  >
                    {tag.replace('_', ' ')}
                  </button>
                );
              })}
              {selectedDietaryTag && (
                <button
                  onClick={() => setSelectedDietaryTag(null)}
                  className="text-[11px] text-[#602E31] underline ml-1 cursor-pointer font-bold"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`relative px-4 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase whitespace-nowrap transition-all active:scale-[0.97] cursor-pointer z-0 flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'text-[#FFF5EC]'
                  : 'bg-[#FAF2EA] text-[#533B3D] hover:text-[#241416] border border-[#E8D9CC] hover:border-[#602E31]/40'
              }`}
            >
              {activeCategory === 'all' && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#602E31] rounded-xl border border-[#4D2326] shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <ChefHat className="w-3.5 h-3.5" />
              <span>All</span>
              <span className="ml-0.5 opacity-70">({dishes.length})</span>
            </button>
            {categories.map((cat) => {
              const catCount = dishes.filter((d) => d.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`relative px-4 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase whitespace-nowrap transition-all active:scale-[0.97] cursor-pointer z-0 ${
                    activeCategory === cat.slug
                      ? 'text-[#FFF5EC]'
                      : 'bg-[#FAF2EA] text-[#533B3D] hover:text-[#241416] border border-[#E8D9CC] hover:border-[#602E31]/40'
                  }`}
                >
                  {activeCategory === cat.slug && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-[#602E31] rounded-xl border border-[#4D2326] shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {cat.name}
                  {catCount > 0 && <span className="ml-1 opacity-70">({catCount})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Menu Content ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-32">
        {/* Result Counter & Active Filter Indicators */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#E8D9CC]/70 text-xs text-[#7E6568]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-medium text-[#241416]">
              Showing {filteredDishes.length} {filteredDishes.length === 1 ? 'culinary creation' : 'culinary creations'}
            </span>
            {selectedDietaryTag && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#602E31]/10 text-[#602E31] font-bold text-[10px] tracking-wider uppercase border border-[#602E31]/20">
                {selectedDietaryTag.replace('_', ' ')}
                <button
                  onClick={() => setSelectedDietaryTag(null)}
                  className="hover:text-[#241416] cursor-pointer ml-0.5"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#602E31]/10 text-[#602E31] font-bold text-[10px] tracking-wider border border-[#602E31]/20">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-[#241416] cursor-pointer ml-0.5"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          {(selectedDietaryTag || searchQuery || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDietaryTag(null);
                handleCategorySelect('all');
              }}
              className="text-[11px] font-bold text-[#602E31] hover:underline cursor-pointer tracking-wider uppercase"
            >
              Clear All
            </button>
          )}
        </div>

        {filteredDishes.length === 0 ? (
          <EmptyState
            title="No Dishes Match Your Search"
            description="Try adjusting your category selection, search term, or dietary filters."
            action={
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDietaryTag(null);
                  handleCategorySelect('all');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#602E31] text-[#FFF5EC] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs hover:bg-[#4D2326] border border-[#4D2326]"
              >
                Reset Filters
              </button>
            }
          />
        ) : categorySections ? (
          /* ── All Categories: Sectioned Layout ── */
          <div className="space-y-16">
            {categorySections.map((section, sectionIdx) => (
              <section
                key={section.category.id}
                id={`menu-section-${section.category.slug}`}
                className="scroll-mt-40"
              >
                {/* Category Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: sectionIdx * 0.05 }}
                  className="text-center space-y-3 mb-10"
                >
                  <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-[#602E31] font-bold block">
                    {section.category.name}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241416]">
                    {section.category.name}
                  </h2>
                  <div className="w-12 h-px bg-[#602E31]/30 mx-auto" />
                  {section.category.description && (
                    <p className="text-[#7E6568] text-xs max-w-md mx-auto font-sans">
                      {section.category.description}
                    </p>
                  )}
                </motion.div>

                {/* Dish Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.dishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onQuickView={(d) => setQuickViewDish(d)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* ── Single Category: Flat Grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onQuickView={(d) => setQuickViewDish(d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <DishDetailModal
        dish={quickViewDish}
        isOpen={!!quickViewDish}
        onClose={() => setQuickViewDish(null)}
        onSelectDish={(d) => setQuickViewDish(d)}
      />
    </div>
  );
};
