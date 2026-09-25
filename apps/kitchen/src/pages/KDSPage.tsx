import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useKDS, type KDSFilter } from '@shared/hooks/useKDS';
import { KDSTicketCard } from '../components/KDSTicketCard';
import { MetaTags } from '@shared/components/MetaTags';
import { useAuth } from '@shared/hooks/useAuth';
import {
  ChefHat, Clock, Volume2, VolumeX, RefreshCw, Search, Filter,
  Wifi, PlusCircle, LogOut, CheckCircle2, Utensils, Store, Truck, Flame
} from 'lucide-react';

export const KDSPage: React.FC = () => {
  const { logout } = useAuth();
  const {
    incomingOrders,
    acceptedOrders,
    preparingOrders,
    readyOrders,
    totalActiveCount,
    soundEnabled,
    setSoundEnabled,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    connectionStatus,
    updateOrderStatus,
    refreshOrders,
    simulateNewOrder,
  } = useKDS();

  // Live Clock State (HH:MM:SS)
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5EC] text-[#241416] flex flex-col p-4 sm:p-6 space-y-6">
      <MetaTags title="Kitchen Display System (KDS) | Tronx" />

      {/* Header Bar */}
      <header className="bg-white p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 border border-[#E8D9CC] shadow-sm">
        {/* Left: Branding & Clock */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#602E31] text-white flex items-center justify-center shadow-md">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#602E31] tracking-wide">
                Tronx
              </h1>
              <span className="text-[10px] font-mono uppercase bg-[#FAF2EA] text-[#602E31] border border-[#E8D9CC] px-2 py-0.5 rounded-full font-bold">
                Pass & KDS
              </span>
            </div>
            <p className="text-xs text-[#7E6568] font-mono flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[#241416] font-bold"><Clock className="w-3.5 h-3.5 text-[#602E31]" /> {currentTime}</span>
              <span>•</span>
              <span>Active Tickets: <strong className="text-[#602E31] font-bold">{totalActiveCount}</strong></span>
            </p>
          </div>
        </div>

        {/* Right: Controls (Realtime, Audio, Refresh, Demo, Logout) */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Connection Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold border text-xs ${
            connectionStatus === 'Connected'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : connectionStatus === 'Connecting'
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}>
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>{connectionStatus}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-bold text-xs shadow-xs ${
              soundEnabled
                ? 'bg-[#602E31] border-[#602E31] text-white'
                : 'bg-white border-[#E8D9CC] text-[#241416] hover:bg-[#FAF2EA]'
            }`}
            title={soundEnabled ? 'Disable Order Sound Chime' : 'Enable Order Sound Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>

          {/* Refresh / Reconnect Button */}
          <button
            onClick={() => refreshOrders()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E8D9CC] bg-white text-[#241416] hover:bg-[#FAF2EA] cursor-pointer transition-colors shadow-xs font-bold text-xs"
            title="Refresh Order Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Demo Order Simulator */}
          <button
            onClick={() => simulateNewOrder()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#602E31] hover:bg-[#4D2326] text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
            title="Inject Mock Demo Ticket"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Demo Ticket</span>
          </button>

          {/* Exit / Logout Button */}
          <button
            onClick={() => logout()}
            className="p-2 rounded-full border border-[#E8D9CC] bg-white text-[#241416] hover:text-red-600 hover:border-red-300 cursor-pointer transition-colors shadow-xs"
            title="Logout of Kitchen Display"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter Bar & Search */}
      <div className="bg-white p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border border-[#E8D9CC] shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[#7E6568] font-bold uppercase text-[10px] tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#602E31]" /> Filter:
          </span>

          {[
            { id: 'ALL', label: 'All Active', icon: ChefHat },
            { id: 'DINE_IN', label: 'Dine-In', icon: Utensils },
            { id: 'PICKUP', label: 'Pickup', icon: Store },
            { id: 'DELIVERY', label: 'Delivery', icon: Truck },
            { id: 'URGENT', label: 'Urgent (>10m)', icon: Flame },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as KDSFilter)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer font-bold text-xs whitespace-nowrap shadow-xs ${
                  isActive
                    ? 'bg-[#602E31] border-[#602E31] text-white'
                    : 'bg-[#FAF2EA] border-[#E8D9CC] text-[#241416] hover:bg-[#E8D9CC]/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#7E6568]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket # or dish..."
            className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#241416] placeholder-[#7E6568]/50 focus:outline-none focus:border-[#602E31] transition-colors font-medium"
          />
        </div>
      </div>

      {/* 4-Column Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto min-h-[500px]">
        {/* Column 1: Incoming Orders (PENDING) */}
        <div className="bg-white p-4 rounded-2xl space-y-4 border-t-4 border-t-blue-600 border border-[#DDD9CB] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD9CB] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-blue-700 tracking-wide uppercase">
                  1. Incoming
                </h3>
              </div>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {incomingOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {incomingOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-40 text-blue-500" />
                  <p>No incoming tickets</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {incomingOrders.map((o) => (
                    <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Accepted Orders (ACCEPTED) */}
        <div className="bg-white p-4 rounded-2xl space-y-4 border-t-4 border-t-purple-600 border border-[#DDD9CB] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD9CB] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600" />
                <h3 className="font-serif font-bold text-sm text-purple-700 tracking-wide uppercase">
                  2. Accepted
                </h3>
              </div>
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {acceptedOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {acceptedOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-40 text-purple-500" />
                  <p>No accepted tickets</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {acceptedOrders.map((o) => (
                    <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: In Prep (PREPARING) */}
        <div className="bg-white p-4 rounded-2xl space-y-4 border-t-4 border-t-[#602E31] border border-[#E8D9CC] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8D9CC] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#602E31] animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-[#602E31] tracking-wide uppercase">
                  3. In Preparation
                </h3>
              </div>
              <span className="bg-[#FAF2EA] text-[#602E31] border border-[#E8D9CC] px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {preparingOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-40 text-[#602E31]" />
                  <p>No tickets in prep</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {preparingOrders.map((o) => (
                    <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Column 4: Ready for Pass (READY) */}
        <div className="bg-white p-4 rounded-2xl space-y-4 border-t-4 border-t-[#602E31] border border-[#E8D9CC] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8D9CC] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#602E31]" />
                <h3 className="font-serif font-bold text-sm text-[#602E31] tracking-wide uppercase">
                  4. Ready for Pass
                </h3>
              </div>
              <span className="bg-[#FAF2EA] text-[#602E31] border border-[#602E31]/20 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {readyOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-40 text-[#602E31]" />
                  <p>No tickets on pass</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {readyOrders.map((o) => (
                    <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
