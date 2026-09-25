import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <MetaTags title="404 — Page Not Found | Tronx" />
      <div className="w-16 h-16 rounded-full bg-[#FAF2EA] border border-[#602E31]/25 flex items-center justify-center mb-6 text-[#602E31]">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl font-bold tracking-tight text-[#241416] mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-[#7E6568] max-w-md mb-8 text-sm leading-relaxed font-sans">
        The culinary destination or page you are attempting to visit does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-xl bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold text-xs tracking-wider uppercase shadow-sm transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
