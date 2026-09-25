import React from 'react';
import { Link } from 'react-router-dom';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { getRestaurantLiveStatus } from '@shared/utils/operatingHours';
import { TronxLogo } from '@shared/components/CraftslandLogo';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const liveStatus = getRestaurantLiveStatus();
  return (
    <footer className="bg-[#602E31] border-t border-white/10 text-[#FFF5EC] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Philosophy */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <TronxLogo variant="green-invert" size="md" />
            </Link>
            <p className="text-[#E8D9CC] text-xs leading-relaxed font-sans pt-2">
              An artisanal culinary destination delivering vibrant flavors, wood-fired craftsmanship, and warm hospitality designed to elevate your mood.
            </p>
            <p className="text-[#E8B896] font-serif text-xs font-semibold italic">
              "{RESTAURANT_BRAND.tagline}"
            </p>
          </div>

          {/* Quick Experience Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#E8B896] uppercase font-bold">
              Explore Tronx
            </h4>
            <ul className="space-y-2 text-xs text-[#E8D9CC] font-sans">
              <li><Link to="/menu" className="hover:text-white transition-colors">Artisanal Menu</Link></li>
              <li><Link to="/menu/mains" className="hover:text-white transition-colors">Signature Wood-Fired Mains</Link></li>
              <li><Link to="/reservation" className="hover:text-white transition-colors">Book a Table</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Private Gatherings & Catering</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Culinary Gallery</Link></li>
            </ul>
          </div>

          {/* Location & Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#E8B896] uppercase font-bold">
              Visit & Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8D9CC] font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8B896] shrink-0 mt-0.5" />
                <span>{RESTAURANT_BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E8B896] shrink-0" />
                <a href={`tel:${RESTAURANT_BRAND.phone}`} className="hover:text-white transition-colors">
                  {RESTAURANT_BRAND.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E8B896] shrink-0" />
                <a href={`mailto:${RESTAURANT_BRAND.email}`} className="hover:text-white transition-colors">
                  {RESTAURANT_BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#E8B896] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>{RESTAURANT_BRAND.operatingHours}</span>
                  <span className="text-[10px] font-mono mt-0.5 inline-flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${liveStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className={liveStatus.isOpen ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-medium'}>
                      {liveStatus.statusLabel} • {liveStatus.detailText}
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / Club */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-widest text-[#E8B896] uppercase font-bold">
              The Tronx Circle
            </h4>
            <p className="text-xs text-[#E8D9CC] leading-relaxed font-sans">
              Join our community for seasonal harvest previews, healthy culinary recipes, and table privileges.
            </p>
            <div className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-[#4D2326] border border-[#7D383D] rounded-xl text-xs text-[#FFF5EC] placeholder-[#E8D9CC]/50 focus:outline-none focus:border-[#FFF5EC]"
              />
              <button
                type="button"
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-white/20 shadow-xs"
              >
                Join Circle
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8D9CC]">
          <p>© {new Date().getFullYear()} TRONX Culinary & Dining Sanctuary. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-white transition-colors">Our Story</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
