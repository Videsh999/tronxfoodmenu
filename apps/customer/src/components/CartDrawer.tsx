import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Utensils, Truck, Store, Sparkles } from 'lucide-react';
import { useCart } from '@shared/hooks/useCart';
import { RESTAURANT_BRAND } from '@shared/config/constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    items,
    orderType,
    setOrderType,
    tableNumber,
    removeItem,
    updateQuantity,
    clearCart,
    tipPercent,
    setTipPercent,
    subtotal,
    taxAmount,
    deliveryFee,
    totalAmount,
  } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FFF5EC] border-l border-[#E8D9CC] flex flex-col justify-between text-[#241416] shadow-2xl pointer-events-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E8D9CC] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#602E31]" />
                  <h2 className="font-serif text-xl font-bold text-[#241416]">Your Tronx Order</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-stone-400 hover:text-[#241416] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table Indicator Badge if Table Param is set */}
              {tableNumber && (
                <div className="bg-[#602E31]/10 border-b border-[#602E31]/20 px-6 py-2 flex items-center justify-between text-xs text-[#602E31]">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" /> Dine-In Order
                  </span>
                  <span className="font-mono font-bold bg-[#602E31] text-[#FFF5EC] px-2 py-0.5 rounded">
                    Table {tableNumber}
                  </span>
                </div>
              )}

              {/* Order Type Selector */}
              <div className="px-6 py-3 border-b border-[#E8D9CC] grid grid-cols-3 gap-2 text-xs bg-white">
                <button
                  onClick={() => setOrderType('DINE_IN')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer font-bold ${
                    orderType === 'DINE_IN'
                      ? 'bg-[#602E31] text-[#FFF5EC] border-[#602E31] shadow-xs'
                      : 'bg-[#FAF2EA] border-[#E8D9CC] text-[#533B3D] hover:text-[#241416]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" /> Dine-In
                </button>
                <button
                  onClick={() => setOrderType('PICKUP')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer font-bold ${
                    orderType === 'PICKUP'
                      ? 'bg-[#602E31] text-[#FFF5EC] border-[#602E31] shadow-xs'
                      : 'bg-[#FAF2EA] border-[#E8D9CC] text-[#533B3D] hover:text-[#241416]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" /> Pickup
                </button>
                <button
                  onClick={() => setOrderType('DELIVERY')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer font-bold ${
                    orderType === 'DELIVERY'
                      ? 'bg-[#602E31] text-[#FFF5EC] border-[#602E31] shadow-xs'
                      : 'bg-[#FAF2EA] border-[#E8D9CC] text-[#533B3D] hover:text-[#241416]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> Delivery
                </button>
              </div>

              {/* Complimentary Chef's Treat Milestone Bar */}
              {items.length > 0 && (
                <div className="bg-[#FAF2EA] border-b border-[#E8D9CC] px-6 py-2.5">
                  {(() => {
                    const CHEF_GIFT_THRESHOLD = 500;
                    const giftProgress = Math.min(100, Math.round((subtotal / CHEF_GIFT_THRESHOLD) * 100));
                    const amountToGift = Math.max(0, CHEF_GIFT_THRESHOLD - subtotal);
                    return (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#602E31] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C2674F]" />
                            {giftProgress >= 100 ? (
                              <span className="text-[#602E31] font-bold">Complimentary Truffle Brioche Unlocked! 🥖✨</span>
                            ) : (
                              <span>Add <strong className="font-mono font-bold text-[#602E31]">₹{amountToGift.toFixed(0)}</strong> for Complimentary Truffle Brioche</span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-[#7E6568] text-[10px]">{giftProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E8D9CC] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#602E31] to-[#C2674F] rounded-full transition-all duration-500"
                            style={{ width: `${giftProgress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[#602E31]/30 mx-auto" />
                    <p className="text-[#7E6568] text-sm font-serif">Your dining cart is currently empty.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.dish.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-[#E8D9CC] p-4 rounded-2xl space-y-2 shadow-xs"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#241416]">{item.dish.name}</h4>
                            <p className="text-xs text-[#602E31] font-mono font-bold">
                              {RESTAURANT_BRAND.currencySymbol}
                              {item.dish.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.dish.id)}
                            className="text-stone-400 hover:text-[#A8382B] p-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Modifiers List */}
                        {item.selectedModifiers.length > 0 && (
                          <div className="text-[11px] text-[#7E6568] space-y-0.5 pt-1 border-t border-[#E8D9CC]">
                            {item.selectedModifiers.map((m, idx) => (
                              <div key={idx} className="flex justify-between font-mono">
                                <span>• {m.optionName}</span>
                                {m.price > 0 && (
                                  <span className="text-[#602E31] font-bold">
                                    +{RESTAURANT_BRAND.currencySymbol}
                                    {m.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quantity & Subtotal */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#E8D9CC] rounded-xl overflow-hidden bg-[#FAF2EA] text-xs">
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-[#7E6568] hover:text-[#241416] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 font-mono font-bold text-[#602E31]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-[#7E6568] hover:text-[#241416] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#241416]">
                            {RESTAURANT_BRAND.currencySymbol}
                            {item.itemSubtotal.toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer Summary & Actions */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#E8D9CC] space-y-4 bg-white shadow-lg">
                  {/* Tip Selector */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#7E6568] font-medium">Add Concierge Gratuity:</span>
                    <div className="grid grid-cols-4 gap-1.5 text-xs">
                      {[10, 15, 18, 20].map((percent) => (
                        <button
                          key={percent}
                          onClick={() => setTipPercent(percent)}
                          className={`py-1.5 rounded-xl border text-[11px] font-mono cursor-pointer transition-colors font-bold ${
                            tipPercent === percent
                              ? 'bg-[#602E31] border-[#602E31] text-[#FFF5EC] shadow-xs'
                              : 'border-[#E8D9CC] bg-[#FAF2EA] text-[#533B3D] hover:text-[#241416]'
                          }`}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#533B3D]">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold">
                        {RESTAURANT_BRAND.currencySymbol}
                        {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#533B3D]">
                      <span>Tax (8.5%):</span>
                      <span className="font-mono font-semibold">
                        {RESTAURANT_BRAND.currencySymbol}
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                    {orderType === 'DELIVERY' && (
                      <div className="flex justify-between text-[#533B3D]">
                        <span>Delivery Fee:</span>
                        <span className="font-mono font-semibold">
                          {RESTAURANT_BRAND.currencySymbol}
                          {deliveryFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-serif text-sm font-bold text-[#241416] pt-2 border-t border-[#E8D9CC]">
                      <span>Total Amount:</span>
                      <span className="text-[#602E31] font-mono font-bold text-base">
                        {RESTAURANT_BRAND.currencySymbol}
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="px-4 py-3 rounded-xl border border-[#E8D9CC] bg-[#FAF2EA] text-[#533B3D] hover:bg-stone-100 active:scale-[0.97] text-xs font-bold cursor-pointer transition-all shadow-xs"
                    >
                      Clear
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={handleCheckout}
                      className="flex-1 py-3.5 rounded-xl bg-[#602E31] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all min-h-[48px]"
                    >
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
