import React, { useState } from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { Modal } from '@shared/components/Modal';
import { CheckCircle } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const eventTypes = [
    {
      title: 'Private Vault Dining',
      desc: 'Our subterranean VIP vault suite offering complete privacy, custom 9-course menu, and a dedicated sommelier.',
      guests: 'Up to 12 Guests',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: "Chef's Table Experience",
      desc: 'Front-row culinary choreography led personally by Executive Chef Jean-Luc Laurent with custom vintage pairings.',
      guests: 'Up to 8 Guests',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Corporate VIP Banquets',
      desc: 'Bespoke corporate dining packages with private reception lounge, custom branded menus, and dedicated valet.',
      guests: '20 to 50 Guests',
      img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <MetaTags title="Private Dining & VIP Vault Events | Tronx" />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.25em] uppercase block">
          Exclusive Gatherings
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#241416]">
          Private Vault & VIP Experiences
        </h1>
        <p className="text-[#7E6568] text-sm max-w-xl mx-auto font-light">
          Host your private celebrations and corporate dinners in our discreet VIP suites.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventTypes.map((evt, idx) => (
          <div key={idx} className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between border border-[#E8D9CC] hover:border-[#602E31]/50 shadow-sm transition-all">
            <div className="relative h-48">
              <img src={evt.img} alt={evt.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 text-[#241416] font-mono text-[11px] border border-[#E8D9CC] shadow-xs font-semibold">
                {evt.guests}
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#241416]">{evt.title}</h3>
                <p className="text-[#7E6568] text-xs leading-relaxed">{evt.desc}</p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full min-h-[42px] py-2.5 rounded-xl bg-[#FAF2EA] text-[#602E31] border border-[#602E31]/30 text-xs font-bold uppercase tracking-wider hover:bg-[#602E31] hover:text-[#FFF5EC] transition-colors cursor-pointer shadow-xs"
              >
                Inquire Private Booking
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Private Event Request">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="w-12 h-12 text-[#602E31] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#241416]">Request Transmitted</h3>
            <p className="text-xs text-[#7E6568]">Our VIP Event Director will contact you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#241416] mb-1 font-semibold">Host Full Name</label>
              <input type="text" required placeholder="Sterling Vance" className="w-full px-4 py-2.5 bg-[#FAF2EA] border border-[#E8D9CC] focus:border-[#602E31] rounded-xl text-[#241416] placeholder:text-[#7E6568]/40 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#241416] mb-1 font-semibold">Preferred Date</label>
                <input type="date" required className="w-full px-4 py-2.5 bg-[#FAF2EA] border border-[#E8D9CC] focus:border-[#602E31] rounded-xl text-[#241416] outline-none" />
              </div>
              <div>
                <label className="block text-[#241416] mb-1 font-semibold">Guest Count</label>
                <input type="number" min="2" max="50" required placeholder="8" className="w-full px-4 py-2.5 bg-[#FAF2EA] border border-[#E8D9CC] focus:border-[#602E31] rounded-xl text-[#241416] placeholder:text-[#7E6568]/40 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[#241416] mb-1 font-semibold">Special Requirements</label>
              <textarea rows={3} placeholder="Sommelier pairing preferences, dietary allergies, audio-visual needs..." className="w-full px-4 py-2.5 bg-[#FAF2EA] border border-[#E8D9CC] focus:border-[#602E31] rounded-xl text-[#241416] placeholder:text-[#7E6568]/40 outline-none" />
            </div>
            <button type="submit" className="w-full min-h-[44px] py-3 rounded-xl bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer">
              Transmit Inquiry
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
