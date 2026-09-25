import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Utensils, Store, Truck, AlertTriangle, CheckCircle2, ChefHat, Bell } from 'lucide-react';
import type { Order, OrderStatus } from '@shared/types/order';

interface KDSTicketCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

export const KDSTicketCard: React.FC<KDSTicketCardProps> = ({ order, onUpdateStatus }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const created = new Date(order.createdAt).getTime();
    return Math.max(0, Math.floor((Date.now() - created) / 1000));
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const created = new Date(order.createdAt).getTime();
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - created) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const displaySeconds = String(elapsedSeconds % 60).padStart(2, '0');
  const displayMinutes = String(elapsedMinutes).padStart(2, '0');

  // Preparation target: 15 minutes (900 seconds) standard benchmark
  const targetPrepSeconds = 15 * 60;
  const prepProgressPercent = Math.min(100, (elapsedSeconds / targetPrepSeconds) * 100);

  // Urgency tier classification
  let urgencyLevel: 'normal' | 'warning' | 'urgent' = 'normal';
  if (elapsedMinutes >= 20) {
    urgencyLevel = 'urgent';
  } else if (elapsedMinutes >= 10) {
    urgencyLevel = 'warning';
  }

  // Action Button config
  const getActionConfig = () => {
    switch (order.orderStatus) {
      case 'PENDING':
        return {
          nextStatus: 'ACCEPTED' as OrderStatus,
          label: 'Accept Order',
          bgClass: 'bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-sm',
          icon: CheckCircle2,
        };
      case 'ACCEPTED':
        return {
          nextStatus: 'PREPARING' as OrderStatus,
          label: 'Start Preparing',
          bgClass: 'bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold shadow-sm',
          icon: ChefHat,
        };
      case 'PREPARING':
        return {
          nextStatus: 'READY' as OrderStatus,
          label: 'Mark Ready',
          bgClass: 'bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold shadow-sm',
          icon: Bell,
        };
      case 'READY':
        return {
          nextStatus: 'COMPLETED' as OrderStatus,
          label: 'Complete Order',
          bgClass: 'bg-[#241416] hover:bg-[#4D2326] text-[#FFF5EC] font-bold shadow-sm',
          icon: CheckCircle2,
        };
      default:
        return null;
    }
  };

  const actionConfig = getActionConfig();

  const handleActionClick = async () => {
    if (!actionConfig || isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, actionConfig.nextStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  // Allergy warning detection logic
  const allergyList: string[] = [];
  const textToCheck = `${order.specialInstructions || ''}`.toLowerCase();
  
  if (textToCheck.includes('nut') || textToCheck.includes('peanut')) allergyList.push('NUT ALLERGY');
  if (textToCheck.includes('gluten') || textToCheck.includes('wheat')) allergyList.push('GLUTEN SENSITIVE');
  if (textToCheck.includes('dairy') || textToCheck.includes('lactose')) allergyList.push('DAIRY FREE');
  if (textToCheck.includes('shellfish') || textToCheck.includes('seafood')) allergyList.push('SHELLFISH ALLERGY');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 shadow-sm ${
        urgencyLevel === 'urgent'
          ? 'border-red-500 bg-red-50/90 ring-2 ring-red-400/50 shadow-md'
          : urgencyLevel === 'warning'
          ? 'border-amber-400 bg-amber-50/90 ring-1 ring-amber-300 shadow-sm'
          : 'border-[#E8D9CC] bg-white'
      }`}
    >
      {/* Ticket Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-[#E8D9CC] pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-extrabold text-[#602E31] block">
                {order.orderNumber}
              </span>
              {elapsedSeconds < 120 && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.06, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono font-black text-[10px] tracking-wider uppercase shadow-xs flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  NEW
                </motion.span>
              )}
            </div>
            <span className="text-xs text-[#7E6568] font-mono font-medium">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Elapsed Timer Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold ${
              urgencyLevel === 'urgent'
                ? 'bg-red-100 border border-red-400 text-red-900 ring-2 ring-red-300 font-bold animate-pulse'
                : urgencyLevel === 'warning'
                ? 'bg-amber-100 border border-amber-400 text-amber-900 font-bold'
                : 'bg-[#FAF2EA] border border-[#E8D9CC] text-[#602E31] font-bold'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{displayMinutes}:{displaySeconds}</span>
          </div>
        </div>

        {/* Preparation Target Visual Progress Bar */}
        <div className="w-full bg-[#E8D9CC]/50 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all ${
              urgencyLevel === 'urgent'
                ? 'bg-red-500'
                : urgencyLevel === 'warning'
                ? 'bg-amber-500'
                : 'bg-[#602E31]'
            }`}
            style={{ width: `${prepProgressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Order Mode Badge & Table Info */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            {order.orderType === 'DINE_IN' && (
              <span className="inline-flex items-center gap-1 bg-[#FAF2EA] border border-[#E8D9CC] text-[#602E31] px-2.5 py-1 rounded-full font-bold text-xs">
                <Utensils className="w-3 h-3" /> Dine-In
              </span>
            )}
            {order.orderType === 'PICKUP' && (
              <span className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-800 px-2.5 py-1 rounded-full font-bold text-xs">
                <Store className="w-3 h-3" /> Pickup
              </span>
            )}
            {order.orderType === 'DELIVERY' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-full font-bold text-xs">
                <Truck className="w-3 h-3" /> Delivery
              </span>
            )}
          </div>

          {order.tableNumber && (
            <span className="font-mono font-bold text-[#602E31] bg-[#FAF2EA] border border-[#E8D9CC] px-2.5 py-1 rounded-lg text-xs tracking-wider shadow-xs">
              {order.tableNumber.startsWith('Table') ? order.tableNumber : `Table ${order.tableNumber}`}
            </span>
          )}
        </div>
      </div>

      {/* Allergy Callout Warnings */}
      {allergyList.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 p-2.5 rounded-xl space-y-1">
          {allergyList.map((allergy, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-red-800 tracking-wider uppercase">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>⚠️ {allergy}</span>
            </div>
          ))}
        </div>
      )}

      {/* Item List */}
      <div className="space-y-3 py-2 border-t border-b border-[#E8D9CC] my-1 max-h-56 overflow-y-auto">
        {order.items.map((item) => (
          <div key={item.id} className="text-xs space-y-1">
            <div className="flex items-start justify-between font-bold">
              <span className="flex items-center gap-2">
                <span className="text-[#602E31] font-mono text-sm bg-[#FAF2EA] border border-[#E8D9CC] px-2 py-0.5 rounded font-bold">
                  {item.quantity}×
                </span>
                <span className="text-sm font-serif font-bold text-[#241416]">{item.dishName}</span>
              </span>
            </div>

            {/* Modifiers List */}
            {item.selectedModifiers.length > 0 && (
              <div className="pl-7 space-y-0.5 text-[11px] text-[#7E6568] font-mono">
                {item.selectedModifiers.map((m, idx) => (
                  <span key={idx} className="block font-medium"><strong className="text-[#602E31]">•</strong> {m.optionName}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Special Instructions Notes */}
      {order.specialInstructions && (
        <div className="bg-[#FAF2EA] border border-[#E8D9CC] p-2.5 rounded-xl text-xs space-y-1">
          <span className="text-[10px] text-[#602E31] uppercase tracking-wider block font-bold">Special Instructions</span>
          <p className="text-[#241416] italic font-serif">{order.specialInstructions}</p>
        </div>
      )}

      {/* Status Action Button - Minimum 48px touch target */}
      {actionConfig && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          onClick={handleActionClick}
          disabled={isUpdating}
          className={`w-full min-h-[48px] py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${actionConfig.bgClass} disabled:opacity-50`}
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Updating Ticket...
            </span>
          ) : (
            <>
              <actionConfig.icon className="w-4 h-4" /> {actionConfig.label}
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};
