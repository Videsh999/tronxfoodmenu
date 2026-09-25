import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bell, UtensilsCrossed, XCircle, Truck, Store } from 'lucide-react';
import type { OrderStatus, OrderType } from '@shared/types/order';

interface OrderTimelineProps {
  orderStatus: OrderStatus;
  orderType: OrderType;
}

interface TimelineStep {
  key: OrderStatus;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STATUS_MESSAGES: Record<OrderStatus, string> = {
  PENDING: 'Order received',
  ACCEPTED: 'Order accepted by the kitchen',
  PREPARING: 'Our chefs are preparing your order',
  READY: 'Your order is ready',
  COMPLETED: 'Order completed',
  CANCELLED: 'Order cancelled',
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ orderStatus, orderType }) => {
  const getReadyLabel = () => {
    switch (orderType) {
      case 'DELIVERY':
        return 'Out for Delivery';
      case 'PICKUP':
        return 'Ready for Pickup';
      case 'DINE_IN':
      default:
        return 'Ready to Serve';
    }
  };

  const steps: TimelineStep[] = [
    {
      key: 'PENDING',
      label: 'Order Received',
      sublabel: STATUS_MESSAGES.PENDING,
      icon: Clock,
    },
    {
      key: 'ACCEPTED',
      label: 'Accepted',
      sublabel: STATUS_MESSAGES.ACCEPTED,
      icon: CheckCircle2,
    },
    {
      key: 'PREPARING',
      label: 'Preparing',
      sublabel: STATUS_MESSAGES.PREPARING,
      icon: ChefHat,
    },
    {
      key: 'READY',
      label: getReadyLabel(),
      sublabel: STATUS_MESSAGES.READY,
      icon: orderType === 'DELIVERY' ? Truck : orderType === 'PICKUP' ? Store : Bell,
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      sublabel: STATUS_MESSAGES.COMPLETED,
      icon: UtensilsCrossed,
    },
  ];

  if (orderStatus === 'CANCELLED') {
    return (
      <div className="p-6 rounded-2xl border border-[#A8382B]/20 text-center space-y-3 bg-white shadow-xs">
        <XCircle className="w-12 h-12 text-[#A8382B] mx-auto" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A8382B]/10 text-[#A8382B] text-[11px] font-bold tracking-wider uppercase border border-[#A8382B]/20">
          ● Current Status
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#A8382B]">Order Cancelled</h3>
        <p className="text-sm font-semibold text-[#A8382B]">Order cancelled</p>
        <p className="text-xs text-[#7E6568] max-w-sm mx-auto">
          This culinary order was cancelled. If you believe this is an error or wish to modify your order, please contact our concierge.
        </p>
      </div>
    );
  }

  const statusOrder: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(orderStatus);

  return (
    <div className="space-y-6">
      {/* Step Indicators Bar (Horizontal Desktop & Compact) */}
      <div className="relative flex items-center justify-between max-w-2xl mx-auto px-2 sm:px-4">
        {/* Background Line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-[#E8D9CC] -z-10" />
        
        {/* Active Progress Line */}
        <motion.div
          className="absolute top-5 left-8 -z-10 h-0.5 bg-[#602E31]"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min(100, Math.max(0, (currentIndex / (steps.length - 1)) * 100))}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center group flex-1 max-w-[120px]">
              <div className="relative flex items-center justify-center">
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: 1.55, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2.0, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-[#602E31]/30 pointer-events-none"
                  />
                )}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.12 : 1,
                  }}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                    isDone
                      ? 'bg-[#602E31] border-[#602E31] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-white border-2 border-[#602E31] text-[#602E31] ring-4 ring-[#602E31]/15 shadow-xs'
                      : 'bg-[#FAF2EA] border border-[#E8D9CC] text-[#7E6568]/40'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </motion.div>
              </div>

              <div className="mt-2 text-center">
                <p className={`text-[10px] sm:text-[11px] font-bold leading-tight ${isCurrent ? 'text-[#602E31]' : isDone ? 'text-[#241416]' : 'text-[#7E6568]/40'}`}>
                  {step.label}
                </p>
                <div className="mt-1">
                  {isDone && (
                    <span className="text-[9px] sm:text-[10px] font-semibold text-[#602E31] inline-flex items-center justify-center gap-0.5">
                      ✓ Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#602E31] inline-flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#602E31] animate-ping" />
                      ● Current Status
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-[9px] sm:text-[10px] text-[#7E6568]/40 inline-flex items-center justify-center">
                      ○ Upcoming
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Current Status Badge */}
      <motion.div
        key={orderStatus}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8D9CC] text-center space-y-2 max-w-lg mx-auto shadow-xs"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#602E31]/10 text-[#602E31] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-[#602E31] animate-ping" />
          ● Current Status
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#241416]">
          {steps[currentIndex]?.label || orderStatus}
        </h3>
        <p className="text-sm font-semibold text-[#602E31]">
          {STATUS_MESSAGES[orderStatus] || steps[currentIndex]?.sublabel}
        </p>
      </motion.div>
    </div>
  );
};
