import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@shared/services/supabaseClient';
import { Bell, X, ShoppingBag, Calendar, AlertTriangle, Check, Trash2 } from 'lucide-react';

export interface AdminNotification {
  id: string;
  type: 'ORDER' | 'RESERVATION' | 'ALERT';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface AdminNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const AdminNotificationDrawer: React.FC<AdminNotificationDrawerProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange,
}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('tronx_admin_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const seenEventIds = useRef<Set<string>>(new Set());

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tronx_admin_notifs', JSON.stringify(notifications));
    } catch {
      // storage quota or private browsing catch
    }
    const unread = notifications.filter((n) => !n.read).length;
    onUnreadCountChange?.(unread);
  }, [notifications, onUnreadCountChange]);

  const addNotification = (notif: AdminNotification) => {
    if (seenEventIds.current.has(notif.id)) return;
    seenEventIds.current.add(notif.id);

    setNotifications((prev) => [notif, ...prev.slice(0, 49)]); // Keep latest 50
  };

  useEffect(() => {
    // 1. Subscribe to orders
    const orderChannel = supabase
      .channel('admin_drawer_orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload: any) => {
          const newOrder = payload.new;
          if (!newOrder) return;
          addNotification({
            id: `order-insert-${newOrder.id}-${newOrder.created_at}`,
            type: 'ORDER',
            title: `New Order: ${newOrder.order_number}`,
            message: `Amount: ₹${Number(newOrder.total_amount || 0).toFixed(2)} • Mode: ${newOrder.order_type}`,
            timestamp: new Date().toISOString(),
            read: false,
            link: '/orders',
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload: any) => {
          const updated = payload.new;
          if (!updated) return;
          if (updated.order_status === 'CANCELLED' || updated.payment_status === 'FAILED') {
            addNotification({
              id: `order-alert-${updated.id}-${updated.order_status}-${Date.now()}`,
              type: 'ALERT',
              title: `Order Alert: ${updated.order_number}`,
              message: `Status: ${updated.order_status} • Payment: ${updated.payment_status}`,
              timestamp: new Date().toISOString(),
              read: false,
              link: '/orders',
            });
          }
        }
      )
      .subscribe();

    // 2. Subscribe to reservations
    const resChannel = supabase
      .channel('admin_drawer_reservations')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reservations' },
        (payload: any) => {
          const r = payload.new;
          if (!r) return;
          addNotification({
            id: `res-insert-${r.id}-${r.created_at}`,
            type: 'RESERVATION',
            title: `New Reservation: ${r.guest_name}`,
            message: `${r.party_size} Guests • ${r.reservation_date} at ${r.reservation_time} (${r.seating_section})`,
            timestamp: new Date().toISOString(),
            read: false,
            link: '/reservations',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(resChannel);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    seenEventIds.current.clear();
  };

  const handleItemClick = (n: AdminNotification) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    if (n.link) {
      navigate(n.link);
      onClose();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
            onClick={onClose}
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l border-[#DDD9CB] shadow-2xl z-50 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#E8D9CC] flex items-center justify-between bg-[#FAF2EA]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#602E31]" />
                <h3 className="font-serif font-bold text-sm text-[#241416]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#602E31] text-white text-[10px] font-mono font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-[#7E6568] hover:text-[#241416] hover:bg-[#E8D9CC]/40 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    title="Clear all"
                    className="p-1.5 rounded-lg text-[#7E6568] hover:text-[#A8382B] hover:bg-[#A8382B]/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#7E6568] hover:text-[#241416] hover:bg-[#E8D9CC]/40 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E8D9CC]/60 p-2">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#7E6568] space-y-2">
                  <Bell className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-xs font-serif">No new operations alerts</p>
                  <p className="text-[11px] text-[#7E6568] font-mono">Incoming orders & reservations stream here live.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start gap-3 text-xs ${
                      n.read ? 'hover:bg-[#FAF2EA]' : 'bg-[#FAF2EA] hover:bg-[#E8D9CC]/30'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === 'ORDER'
                          ? 'bg-[#602E31]/15 text-[#602E31]'
                          : n.type === 'RESERVATION'
                          ? 'bg-[#C2674F]/15 text-[#C2674F]'
                          : 'bg-[#A8382B]/10 text-[#A8382B]'
                      }`}
                    >
                      {n.type === 'ORDER' ? (
                        <ShoppingBag className="w-3.5 h-3.5" />
                      ) : n.type === 'RESERVATION' ? (
                        <Calendar className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold truncate ${n.read ? 'text-[#241416]' : 'text-[#602E31] font-extrabold'}`}>
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#602E31] shrink-0" />
                        )}
                      </div>
                      <p className="text-[#3A453C] text-[11px] truncate mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-[#7E6568] font-mono block mt-1">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
