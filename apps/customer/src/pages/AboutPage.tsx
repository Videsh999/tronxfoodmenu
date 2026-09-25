import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { Utensils, Calendar, Heart, Leaf, ChefHat } from 'lucide-react';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { ImageLightbox } from '@shared/components/ImageLightbox';

export const AboutPage: React.FC = () => {
  const [activeImage, setActiveImage] = useState<{ url: string; title: string; category?: string } | null>(null);

  return (
    <div className="space-y-24 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <MetaTags
        title="Our Story & Culinary Passion | Tronx"
        description="Learn how Tronx delivers Good Food Brighter Moods through exceptional craft, farm-fresh ingredients, and warm hospitality."
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.25em] uppercase block">
          Heritage & Mission
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#241416]">
          Crafted with Passion. Served with Purpose.
        </h1>
        <p className="text-[#7E6568] text-base font-light leading-relaxed font-sans">
          {RESTAURANT_BRAND.storySubheading}
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#E8D9CC] shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-[#241416]">The Tronx Philosophy</h2>
          <p className="text-[#533B3D] text-sm leading-relaxed font-sans">
            We founded Tronx on a simple realization: extraordinary food transforms moods. Whether it's the warm comfort of handmade pasta ribbons or the smoky aroma of flame-seared herbs, food has the power to spark joy and connection.
          </p>
          <p className="text-[#7E6568] text-sm leading-relaxed font-sans">
            Our culinary artisans partner with organic regenerative farms, small-batch dairies, and regional growers. By honoring seasonal produce and slow cooking traditions, we craft meals that nourish both body and spirit.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8D9CC] text-xs text-[#7E6568]">
            <div className="flex items-center gap-2"><Leaf className="w-4 h-4 text-[#602E31]" /> Farm Sourced</div>
            <div className="flex items-center gap-2"><ChefHat className="w-4 h-4 text-[#602E31]" /> Master Artisans</div>
            <div className="flex items-center gap-2"><Utensils className="w-4 h-4 text-[#602E31]" /> Scratch Kitchen</div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-[#C2674F]" /> Warm Hospitality</div>
          </div>
        </div>

        <div
          data-cursor="image"
          onClick={() => setActiveImage({
            url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1400&auto=format&fit=crop',
            title: 'Tronx Scratch Culinary Kitchen Creation',
            category: 'Kitchen Heritage'
          })}
          className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#E8D9CC] hover:border-[#602E31]/60 shadow-sm cursor-pointer transition-all duration-500"
        >
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"
            alt="Tronx Culinary Creation"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-xs font-serif font-bold text-white">Click to Expand View</span>
          </div>
        </div>
      </div>

      {/* Executive Chef & Culinary Team */}
      <div className="bg-[#FAF2EA] p-8 sm:p-14 rounded-3xl border border-[#E8D9CC] shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        <div
          data-cursor="image"
          onClick={() => setActiveImage({
            url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop',
            title: 'Executive Culinary Director Master Artisan Mateo Rossi',
            category: 'Culinary Master'
          })}
          className="group relative aspect-square rounded-2xl overflow-hidden border border-[#E8D9CC] hover:border-[#602E31]/60 shadow-sm cursor-pointer transition-all duration-500 bg-white"
        >
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop"
            alt="Tronx Executive Culinary Director"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-xs font-serif font-bold text-white">Portrait Preview</span>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.25em] uppercase block">
            Executive Culinary Director
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#241416]">Master Artisan Mateo Rossi</h2>
          <p className="text-[#533B3D] text-sm leading-relaxed font-sans">
            With decades of experience spanning Michelin-starred kitchens in Milan and rustic stone-oven bakeries in the Mediterranean, Chef Rossi brings an obsessive devotion to flavor harmony and authentic cooking technique.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-xl bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
            >
              <Utensils className="w-4 h-4" /> Explore the Menu
            </Link>
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-xl border border-[#E8D9CC] text-[#241416] hover:border-[#602E31] hover:text-[#602E31] bg-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4" /> Reserve a Table
            </Link>
          </div>
        </div>
      </div>

      {/* Shared Lightbox */}
      <ImageLightbox
        isOpen={!!activeImage}
        imageUrl={activeImage?.url || null}
        title={activeImage?.title}
        category={activeImage?.category}
        onClose={() => setActiveImage(null)}
      />
    </div>
  );
};
