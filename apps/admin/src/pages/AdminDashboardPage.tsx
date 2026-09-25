import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { AnimatedCounter } from '@shared/components/AnimatedCounter';
import { useOrders } from '@shared/hooks/useOrders';
import { ReservationService } from '@shared/services/reservationService';
import { AnalyticsService, type TopDish } from '@shared/services/analyticsService';
import type { Reservation } from '@shared/types/reservation';
import {
  ShoppingBag, Calendar, TrendingUp, ArrowRight, ChevronRight,
  UtensilsCrossed, CheckCircle2, BarChart3
} from 'lucide-react';
import { formatPrice } from '@shared/utils/formatters';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const AdminDashboardPage: React.FC = () => {
  const { orders } = useOrders();
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [topDishes, setTopDishes] = useState<TopDish[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const resList = await ReservationService.getReservations();
      setTodayReservations(resList);
      const dishes = await AnalyticsService.getTopDishes();
      setTopDishes(dishes);
    };
    loadDashboardData();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 4890.00);
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED').length;
  const avgOrderValue = orders.length > 0 ? totalRevenue / (orders.length + 20) : 185.50;

  const revenueTrend = [
    { day: 'Mon', amount: 3420, pct: 55 },
    { day: 'Tue', amount: 3890, pct: 62 },
    { day: 'Wed', amount: 4100, pct: 66 },
    { day: 'Thu', amount: 4450, pct: 71 },
    { day: 'Fri', amount: 5600, pct: 90 },
    { day: 'Sat', amount: 6250, pct: 100 },
    { day: 'Today', amount: totalRevenue, pct: 82, isToday: true },
  ];

  return (
    <AdminLayout>
      <MetaTags title="Executive Dashboard | Tronx Admin" />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CC] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#241416]">Executive Command Center</h1>
          <p className="text-xs text-[#7E6568] font-medium">Realtime revenue performance & dining suite metrics</p>
        </div>
        <Link
          to="/orders"
          className="px-4 py-2.5 rounded-xl bg-[#602E31] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#4D2326] shadow-sm border border-[#602E31] transition-all"
        >
          View Orders Queue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row - Staggered Motion + Animated Numbers + Hover Elevation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          variants={cardItemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl flex items-center justify-between border border-[#E8D9CC] shadow-sm hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="text-xs text-[#7E6568] font-sans font-medium">Today's Revenue</p>
            <p className="text-2xl font-serif font-bold text-[#241416]">
              <AnimatedCounter value={totalRevenue} formatter={(v) => formatPrice(v)} />
            </p>
            <span className="text-[10px] text-[#602E31] font-mono font-bold">↑ +14.2% vs yesterday</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            className="p-3 rounded-2xl bg-[#FAF2EA] text-[#602E31] border border-[#602E31]/20"
          >
            <span className="text-lg font-bold font-mono">₹</span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardItemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl flex items-center justify-between border border-[#E8D9CC] shadow-sm hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="text-xs text-[#7E6568] font-sans font-medium">Active Kitchen Tickets</p>
            <p className="text-2xl font-serif font-bold text-[#241416]">
              <AnimatedCounter value={activeOrdersCount} />
            </p>
            <span className="text-[10px] text-[#602E31] font-mono font-bold">In prep & pass</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            className="p-3 rounded-2xl bg-[#602E31]/10 text-[#602E31] border border-[#602E31]/20"
          >
            <ShoppingBag className="w-6 h-6" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardItemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl flex items-center justify-between border border-[#E8D9CC] shadow-sm hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="text-xs text-[#7E6568] font-sans font-medium">Bookings Today</p>
            <p className="text-2xl font-serif font-bold text-[#241416]">
              <AnimatedCounter value={todayReservations.length} />
            </p>
            <span className="text-[10px] text-[#C2674F] font-mono font-bold">Confirmed reservations</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            className="p-3 rounded-2xl bg-[#C2674F]/10 text-[#C2674F] border border-[#C2674F]/20"
          >
            <Calendar className="w-6 h-6" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardItemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl flex items-center justify-between border border-[#E8D9CC] shadow-sm hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="text-xs text-[#7E6568] font-sans font-medium">Avg Ticket Value</p>
            <p className="text-2xl font-serif font-bold text-[#241416]">
              <AnimatedCounter value={avgOrderValue} formatter={(v) => formatPrice(v)} />
            </p>
            <span className="text-[10px] text-[#602E31] font-mono font-bold">High-tier dining average</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            className="p-3 rounded-2xl bg-[#FAF2EA] text-[#602E31] border border-[#E8D9CC]"
          >
            <TrendingUp className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 7-Day Revenue Velocity Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-2xl border border-[#E8D9CC] shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8D9CC] pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#241416] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#602E31]" /> Weekly Revenue Velocity
            </h3>
            <p className="text-[11px] text-[#7E6568]">7-day dining room & online revenue distribution</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#533B3D]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E8D9CC]" /> Past Days
            </span>
            <span className="flex items-center gap-1.5 text-[#602E31] font-bold">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#602E31]" /> Live Today
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4 px-2">
          {revenueTrend.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono text-[#7E6568] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatPrice(item.amount)}
              </span>
              <div className="w-full bg-[#FAF2EA] rounded-xl overflow-hidden h-28 flex items-end p-1">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${item.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full rounded-lg transition-colors ${
                    item.isToday
                      ? 'bg-gradient-to-t from-[#602E31] to-[#C2674F] shadow-xs'
                      : 'bg-gradient-to-t from-[#533B3D] to-[#7E6568] group-hover:from-[#241416] group-hover:to-[#533B3D]'
                  }`}
                />
              </div>
              <span className={`text-[10px] font-mono font-bold ${item.isToday ? 'text-[#602E31]' : 'text-[#7E6568]'}`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Grid: Recent Orders & Top Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl space-y-4 border border-[#E8D9CC] shadow-sm">
          <div className="flex justify-between items-center border-b border-[#E8D9CC] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#241416] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#602E31]" /> Live Orders Queue
            </h3>
            <Link to="/orders" className="text-xs text-[#7E6568] hover:text-[#602E31] font-bold flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="py-10 text-center space-y-3 border border-dashed border-[#E8D9CC] rounded-xl bg-[#FAF2EA]">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8D9CC] text-[#602E31] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="font-serif text-[#241416] font-semibold text-sm">All Kitchen Orders Clear</p>
                <p className="text-xs text-[#7E6568] max-w-xs mx-auto">All active orders have been fulfilled.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {orders.slice(0, 5).map((o) => (
                  <motion.div
                    key={o.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                    className="p-4 rounded-xl flex items-center justify-between gap-4 text-xs border border-[#E8D9CC] bg-[#FAF2EA] hover:border-[#602E31] transition-colors shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#241416] text-sm">{o.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#241416] border border-[#E8D9CC] font-semibold uppercase text-[10px]">
                          {o.orderType}
                        </span>
                      </div>
                      <p className="text-[#7E6568] text-[11px] mt-0.5 font-medium">
                        {o.items.length} item(s) • {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-[#241416] text-sm block">
                        {formatPrice(o.totalAmount)}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        o.orderStatus === 'COMPLETED' ? 'text-[#602E31]' : 'text-[#533B3D]'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Top Selling Dishes */}
        <div className="bg-white p-6 rounded-2xl space-y-4 border border-[#E8D9CC] shadow-sm">
          <div className="flex justify-between items-center border-b border-[#E8D9CC] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#241416] flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#602E31]" /> Top Selling Dishes
            </h3>
            <Link to="/menu" className="text-xs text-[#7E6568] hover:text-[#602E31] font-bold transition-colors">
              Menu
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {topDishes.map((dish, idx) => (
              <motion.div
                key={dish.dishId}
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                className="p-3 rounded-xl flex items-center justify-between gap-3 border border-[#E8D9CC] bg-[#FAF2EA] hover:border-[#602E31] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-[#241416] border border-[#E8D9CC] font-bold font-mono text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-[#241416] truncate max-w-[140px]">{dish.name}</h4>
                    <p className="text-[10px] text-[#7E6568]">{dish.category}</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[#241416] font-bold block">{formatPrice(dish.revenue)}</span>
                  <span className="text-[#7E6568] text-[10px]">{dish.unitsSold} sold</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Table Reservations Section */}
      <div className="bg-white p-6 rounded-2xl space-y-4 border border-[#E8D9CC] shadow-sm">
        <div className="flex justify-between items-center border-b border-[#E8D9CC] pb-3">
          <h3 className="font-serif text-xl font-bold text-[#241416] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#602E31]" /> Today's Table Reservations
          </h3>
          <Link to="/reservations" className="text-xs text-[#7E6568] hover:text-[#602E31] font-bold flex items-center gap-1 transition-colors">
            Manage Reservations <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayReservations.map((res) => (
            <motion.div
              key={res.id}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="p-4 rounded-xl space-y-2 text-xs border border-[#E8D9CC] bg-[#FAF2EA] hover:border-[#602E31] transition-colors shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-[#241416] text-sm block">{res.bookingReference}</span>
                  <h4 className="font-serif font-bold text-[#241416]">{res.guestName}</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#602E31] border border-[#E8D9CC] font-bold text-[10px]">
                  {res.status}
                </span>
              </div>
              <div className="flex justify-between text-[#7E6568] text-[11px] pt-2 border-t border-[#E8D9CC] font-mono">
                <span>{res.reservationTime} • {res.partySize} Guests</span>
                <span>{res.seatingSection}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
