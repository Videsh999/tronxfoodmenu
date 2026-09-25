import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { ReservationService } from '@shared/services/reservationService';
import { supabase } from '@shared/services/supabaseClient';
import type { Reservation, ReservationStatus } from '@shared/types/reservation';
import { SEATING_SECTIONS } from '@shared/config/constants';
import { Search, RefreshCw } from 'lucide-react';

export const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');

  const loadReservations = async () => {
    setLoading(true);
    const list = await ReservationService.getReservations();
    setReservations(list);
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();

    // Subscribe to realtime reservations updates
    const channel = supabase
      .channel('admin_reservations_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          loadReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (sectionFilter !== 'ALL' && r.seatingSection !== sectionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = r.bookingReference.toLowerCase().includes(q);
      const matchGuest = r.guestName.toLowerCase().includes(q);
      const matchEmail = r.guestEmail.toLowerCase().includes(q);
      if (!matchRef && !matchGuest && !matchEmail) return false;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    await ReservationService.updateReservationStatus(id, newStatus);
    await loadReservations();
  };

  return (
    <AdminLayout>
      <MetaTags title="Reservations Control | Tronx Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CC] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#241416]">Table Reservations Suite</h1>
          <p className="text-xs text-[#7E6568] font-medium">Manage seating section allocations, guest check-ins, and booking status</p>
        </div>
        <button
          onClick={() => loadReservations()}
          className="px-4 py-2.5 rounded-xl border border-[#E8D9CC] bg-white text-[#241416] hover:bg-[#FAF2EA] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Bookings
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs border border-[#E8D9CC] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#7E6568] uppercase font-bold tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-1.5 text-xs text-[#241416] font-medium focus:outline-none focus:border-[#602E31] transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SEATED">SEATED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO_SHOW</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#7E6568] uppercase font-bold tracking-wider">Seating Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-1.5 text-xs text-[#241416] font-medium focus:outline-none focus:border-[#602E31] transition-colors"
            >
              <option value="ALL">All Sections</option>
              {SEATING_SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#7E6568]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking #, guest, or email..."
            className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#241416] placeholder-[#7E6568]/50 focus:outline-none focus:border-[#602E31] transition-colors font-medium"
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8D9CC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF2EA] border-b border-[#E8D9CC] text-[#533B3D] uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Reference #</th>
                <th className="p-4">Guest Info</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Party Size</th>
                <th className="p-4">Seating Section</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D9CC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#7E6568] font-mono animate-pulse">
                    Loading table reservations...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#7E6568] font-serif text-sm">
                    No table reservations match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const sectionObj = SEATING_SECTIONS.find((s) => s.id === res.seatingSection);
                  return (
                    <tr key={res.id} className="hover:bg-[#FAF2EA] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#241416]">{res.bookingReference}</td>
                      <td className="p-4">
                        <span className="font-serif font-bold text-[#241416] text-sm block">{res.guestName}</span>
                        <span className="text-[11px] text-[#7E6568] font-mono">{res.guestEmail} • {res.guestPhone}</span>
                        {res.specialRequests && (
                          <p className="text-[10px] text-[#533B3D] italic mt-0.5 max-w-xs truncate">
                            "{res.specialRequests}"
                          </p>
                        )}
                      </td>
                      <td className="p-4 font-mono text-[#7E6568]">
                        <span className="block font-bold text-[#241416]">{res.reservationDate}</span>
                        <span className="text-[#533B3D]">{res.reservationTime}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#241416]">{res.partySize} Guests</td>
                      <td className="p-4 font-mono text-[#533B3D]">{sectionObj?.name || res.seatingSection}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-bold ${
                          res.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : res.status === 'CONFIRMED'
                            ? 'bg-[#602E31]/10 text-[#602E31] border border-[#602E31]/20'
                            : res.status === 'SEATED'
                            ? 'bg-[#C2674F]/10 text-[#C2674F] border border-[#C2674F]/20'
                            : res.status === 'COMPLETED'
                            ? 'bg-[#FAF2EA] text-[#602E31] border border-[#602E31]/20'
                            : res.status === 'CANCELLED'
                            ? 'bg-[#C2674F]/10 text-[#C2674F] border border-[#C2674F]/20'
                            : 'bg-[#E8D9CC]/40 text-[#533B3D] border border-[#E8D9CC]'
                        }`}>
                          {res.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={res.status}
                          onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatus)}
                          className="bg-[#FAF2EA] border border-[#E8D9CC] rounded-lg px-2.5 py-1 text-xs text-[#241416] font-medium focus:outline-none focus:border-[#602E31] transition-colors"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SEATED">SEATED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="NO_SHOW">NO_SHOW</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
