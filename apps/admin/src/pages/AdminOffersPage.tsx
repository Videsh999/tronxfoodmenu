import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { Plus, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react';

interface PromoOffer {
  id: string;
  code: string;
  discountPercent: number;
  activeFrom: string;
  activeTo: string;
  isActive: boolean;
}

export const AdminOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<PromoOffer[]>([
    {
      id: 'off-1',
      code: 'LETOILE15',
      discountPercent: 15,
      activeFrom: '2026-09-01',
      activeTo: '2026-12-31',
      isActive: true,
    },
    {
      id: 'off-2',
      code: 'VIPRESERVE20',
      discountPercent: 20,
      activeFrom: '2026-09-10',
      activeTo: '2026-10-31',
      isActive: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newActiveFrom, setNewActiveFrom] = useState<string>('2026-09-10');
  const [newActiveTo, setNewActiveTo] = useState<string>('2026-12-31');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const formattedCode = newCode.trim().toUpperCase();
    if (!formattedCode) {
      setErrorMsg('Promo code string is required.');
      return;
    }

    if (newDiscount <= 0 || newDiscount > 100) {
      setErrorMsg('Discount percentage must be greater than 0% and less than or equal to 100%.');
      return;
    }

    if (offers.some((o) => o.code === formattedCode)) {
      setErrorMsg(`Promo code "${formattedCode}" already exists.`);
      return;
    }

    const created: PromoOffer = {
      id: `off-${Date.now()}`,
      code: formattedCode,
      discountPercent: newDiscount,
      activeFrom: newActiveFrom,
      activeTo: newActiveTo,
      isActive: true,
    };

    setOffers([created, ...offers]);
    setIsModalOpen(false);
    setNewCode('');
  };

  return (
    <AdminLayout>
      <MetaTags title="Offers & Promo Codes | Tronx Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CC] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#241416]">Promo Codes & Offers</h1>
          <p className="text-xs text-[#7E6568] font-medium">Configure promotional discounts and validity dates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#602E31] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#4D2326] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Create Promo Code
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8D9CC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF2EA] border-b border-[#E8D9CC] text-[#533B3D] uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Promo Code</th>
                <th className="p-4">Discount %</th>
                <th className="p-4">Validity Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D9CC]">
              {offers.map((off) => (
                <tr key={off.id} className="hover:bg-[#FAF2EA]/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#241416] text-sm">{off.code}</td>
                  <td className="p-4 font-mono font-bold text-[#241416]">{off.discountPercent}% OFF</td>
                  <td className="p-4 font-mono text-[#7E6568]">
                    {off.activeFrom} to {off.activeTo}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold font-mono ${
                      off.isActive ? 'bg-[#602E31]/10 text-[#602E31] border border-[#602E31]/20' : 'bg-[#C2674F]/10 text-[#C2674F] border border-[#C2674F]/20'
                    }`}>
                      {off.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleActive(off.id)}
                      className={`px-3 py-1 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ml-auto shadow-xs ${
                        off.isActive
                          ? 'bg-[#602E31]/10 text-[#602E31] border border-[#602E31]/20'
                          : 'bg-[#C2674F]/10 text-[#C2674F] border border-[#C2674F]/20'
                      }`}
                    >
                      {off.isActive ? <ToggleRight className="w-4 h-4 text-[#602E31]" /> : <ToggleLeft className="w-4 h-4 text-[#C2674F]" />}
                      {off.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateOffer}
            className="bg-white w-full max-w-md border border-[#E8D9CC] rounded-3xl p-6 space-y-4 text-[#241416] shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#E8D9CC] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#241416]">Create Promo Code</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-[#7E6568] hover:text-[#241416] hover:bg-[#FAF2EA] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-[#C2674F]/10 border border-[#C2674F]/20 p-3 rounded-xl text-xs text-[#C2674F] flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-[#C2674F] flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Promo Code *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. LUXURY25"
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] placeholder-[#7E6568]/60 font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Discount Percentage (1 - 100%) *</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(Number(e.target.value) || 10)}
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Active From</label>
                  <input
                    type="date"
                    value={newActiveFrom}
                    onChange={(e) => setNewActiveFrom(e.target.value)}
                    className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Active To</label>
                  <input
                    type="date"
                    value={newActiveTo}
                    onChange={(e) => setNewActiveTo(e.target.value)}
                    className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D9CC] text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E8D9CC] text-[#241416] hover:bg-[#FAF2EA] font-bold cursor-pointer transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#602E31] text-white hover:bg-[#4D2326] font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                Create Code
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
