import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { RESTAURANT_BRAND } from '@shared/config/constants';
import { Save, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [brandName, setBrandName] = useState(RESTAURANT_BRAND.name);
  const [tagline, setTagline] = useState(RESTAURANT_BRAND.tagline);
  const [phone, setPhone] = useState(RESTAURANT_BRAND.phone);
  const [email, setEmail] = useState(RESTAURANT_BRAND.email);
  const [address, setAddress] = useState(RESTAURANT_BRAND.address);
  const [hours, setHours] = useState(RESTAURANT_BRAND.operatingHours);
  const [taxRate, setTaxRate] = useState(RESTAURANT_BRAND.defaultTaxRate * 100);
  const [deliveryFee, setDeliveryFee] = useState(RESTAURANT_BRAND.defaultDeliveryFee);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [savedMsg, setSavedMsg] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 4000);
  };

  return (
    <AdminLayout>
      <MetaTags title="Restaurant Settings | Tronx Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CC] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#241416]">Restaurant System Settings</h1>
          <p className="text-xs text-[#7E6568] font-medium">Configure operating parameters, concierge contacts, taxes, and store status</p>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-[#602E31]/10 p-4 rounded-xl border border-[#602E31]/20 text-[#602E31] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#602E31]" />
          <span>Restaurant system settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl space-y-6 border border-[#E8D9CC] max-w-3xl shadow-sm text-[#241416]">
        {/* Store Open / Closed Override */}
        <div className="flex items-center justify-between bg-[#FAF2EA] p-4 rounded-2xl border border-[#E8D9CC]">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#241416]">Restaurant Operational State</h3>
            <p className="text-xs text-[#7E6568] font-medium">Toggle whether the online ordering pass & table reservations are active</p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer transition-all ${
              isOpen
                ? 'bg-[#602E31]/10 text-[#602E31] border border-[#602E31]/20'
                : 'bg-[#C2674F]/10 text-[#C2674F] border border-[#C2674F]/20'
            }`}
          >
            {isOpen ? <ToggleRight className="w-5 h-5 text-[#602E31]" /> : <ToggleLeft className="w-5 h-5 text-[#C2674F]" />}
            {isOpen ? 'STORE OPEN' : 'STORE CLOSED'}
          </button>
        </div>

        {/* Brand Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#241416] border-b border-[#E8D9CC] pb-2">
            Brand Identity & Concierge Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Restaurant Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] focus:outline-none focus:border-[#602E31] transition-colors font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] focus:outline-none focus:border-[#602E31] transition-colors font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Concierge Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] focus:outline-none focus:border-[#602E31] transition-colors font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Concierge Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] focus:outline-none focus:border-[#602E31] transition-colors font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] focus:outline-none focus:border-[#602E31] transition-colors font-medium"
            />
          </div>
        </div>

        {/* Financial & Logistics Config */}
        <div className="space-y-4 pt-4 border-t border-[#E8D9CC]">
          <h3 className="font-serif text-lg font-bold text-[#241416] border-b border-[#E8D9CC] pb-2">
            Tax Rates & Logistics Fees
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Delivery Fee (₹ INR)</label>
              <input
                type="number"
                step="0.5"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Operating Hours</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] focus:outline-none focus:border-[#602E31] transition-colors font-medium"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-[#602E31] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#4D2326] transition-all min-h-[48px]"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
