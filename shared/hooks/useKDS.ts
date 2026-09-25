import { useEffect, useState, useRef } from 'react';
import { useOrderContext } from '../context/OrderContext';
import { OrderService } from '../services/orderService';
import type { Order } from '../types/order';

export type KDSFilter = 'ALL' | 'DINE_IN' | 'PICKUP' | 'DELIVERY' | 'URGENT';

export const useKDS = () => {
  const { orders, updateOrderStatus, isLoading, refreshOrders, realtimeStatus } = useOrderContext();

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [filter, setFilter] = useState<KDSFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const connectionStatus = realtimeStatus;

  const knownIncomingIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // Web Audio Synthesizer Chime Function (zero external asset needed)
  const playNewOrderChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Play double chime note (G5 -> C6)
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now); // G5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.50, now + 0.15); // C6
      gain2.gain.setValueAtTime(0.2, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio playback restricted or uninitialised:', e);
    }
  };

  // Play chime when new confirmed PAID & PENDING orders arrive (idempotent, no duplicates)
  useEffect(() => {
    const currentIncomingPaid = orders.filter((o) => o.orderStatus === 'PENDING' && o.paymentStatus === 'PAID');

    // On initial mount, populate existing order IDs without chiming
    if (isInitialLoadRef.current) {
      currentIncomingPaid.forEach((o) => knownIncomingIdsRef.current.add(o.id));
      isInitialLoadRef.current = false;
      return;
    }

    const newIncoming = currentIncomingPaid.filter((o) => !knownIncomingIdsRef.current.has(o.id));
    if (newIncoming.length > 0) {
      newIncoming.forEach((o) => knownIncomingIdsRef.current.add(o.id));
      playNewOrderChime();
    }
  }, [orders]);

  // Filter & Search helper function
  const applyFilters = (orderList: Order[]) => {
    return orderList.filter((o) => {
      // 1. Order Type Filter
      if (filter === 'DINE_IN' && o.orderType !== 'DINE_IN') return false;
      if (filter === 'PICKUP' && o.orderType !== 'PICKUP') return false;
      if (filter === 'DELIVERY' && o.orderType !== 'DELIVERY') return false;

      // 2. Urgent Filter (> 10 mins elapsed)
      if (filter === 'URGENT') {
        const elapsedMins = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60);
        if (elapsedMins < 10) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = o.orderNumber.toLowerCase().includes(q);
        const matchesTable = o.tableNumber?.toLowerCase().includes(q);
        const matchesItem = o.items.some((i) => i.dishName.toLowerCase().includes(q));
        if (!matchesNumber && !matchesTable && !matchesItem) return false;
      }

      return true;
    });
  };

  // Active tickets sorted by creation time (oldest first). Only verified paid orders enter KDS.
  const sortedActiveOrders = [...orders]
    .filter((o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED' && o.paymentStatus === 'PAID')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const filteredOrders = applyFilters(sortedActiveOrders);

  const incomingOrders = filteredOrders.filter((o) => o.orderStatus === 'PENDING' && o.paymentStatus === 'PAID');
  const acceptedOrders = filteredOrders.filter((o) => o.orderStatus === 'ACCEPTED');
  const preparingOrders = filteredOrders.filter((o) => o.orderStatus === 'PREPARING');
  const readyOrders = filteredOrders.filter((o) => o.orderStatus === 'READY');

  // Helper to simulate a new demo order in development mode
  const simulateNewOrder = async () => {
    try {
      await OrderService.createOrder({
        orderType: 'DINE_IN',
        tableNumber: String(Math.floor(1 + Math.random() * 20)),
        specialInstructions: '⚠️ GLUTEN SENSITIVE — Chef demo ticket',
        items: [
          {
            dishId: 'd3',
            dishName: 'A5 Miyazaki Wagyu Tenderloin',
            unitPrice: 165.00,
            quantity: 1,
            selectedModifiers: [{ modifierTitle: 'Doneness', optionName: 'Medium Rare', price: 0 }],
            itemSubtotal: 165.00,
          },
          {
            dishId: 'd5',
            dishName: 'Tronx Smoked Chocolate Sphere',
            unitPrice: 28.00,
            quantity: 1,
            selectedModifiers: [],
            itemSubtotal: 28.00,
          },
        ],
        subtotal: 193.00,
        taxAmount: 16.40,
        deliveryFee: 0,
        discountAmount: 0,
        tipAmount: 30.00,
        totalAmount: 239.40,
      });

      await refreshOrders();
    } catch (err) {
      console.error('Failed to simulate mock order:', err);
    }
  };

  return {
    incomingOrders,
    acceptedOrders,
    preparingOrders,
    readyOrders,
    totalActiveCount: filteredOrders.length,
    soundEnabled,
    setSoundEnabled,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    connectionStatus,
    updateOrderStatus,
    isLoading,
    refreshOrders,
    simulateNewOrder,
  };
};
