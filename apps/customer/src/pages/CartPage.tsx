import React from 'react';
import { useCart } from '@shared/hooks/useCart';
import { Link } from 'react-router-dom';
import { MetaTags } from '@shared/components/MetaTags';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { RESTAURANT_BRAND } from '@shared/config/constants';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotal, taxAmount, deliveryFee, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <MetaTags title="Cart | Tronx" />
        <div className="w-16 h-16 rounded-full bg-[#602E31]/10 border border-[#602E31]/20 text-[#602E31] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold text-[#602E31] tracking-[0.25em] uppercase block">
            Concierge Selection
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#241416]">
            Your Cart is Empty
          </h1>
          <p className="text-[#7E6568] text-sm max-w-md mx-auto font-sans leading-relaxed">
            You have not added any dishes from our menu yet. Explore our wood-fired creations and fresh harvest bowls.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#602E31] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-sans font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <span>Explore Fresh Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <MetaTags title="Your Selection | Tronx" />
      <h1 className="font-serif text-3xl font-bold text-[#241416]">Your Fresh Selection</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.dish.id} className="bg-white p-4 rounded-2xl flex items-center justify-between gap-4 border border-[#E8D9CC] shadow-xs">
            <img src={item.dish.mediaUrl} alt={item.dish.name} className="w-16 h-16 rounded-xl object-cover border border-[#E8D9CC]" />
            <div className="flex-1">
              <h3 className="font-serif font-bold text-[#241416] text-sm">{item.dish.name}</h3>
              <p className="text-xs text-[#602E31] font-bold">{RESTAURANT_BRAND.currencySymbol}{item.dish.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E8D9CC] bg-[#FAF2EA] rounded-xl overflow-hidden text-xs">
                <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="px-3 py-1.5 text-[#7E6568] hover:text-[#241416] hover:bg-[#602E31]/10 transition-colors cursor-pointer">-</button>
                <span className="px-3 font-mono font-bold text-[#241416]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} className="px-3 py-1.5 text-[#7E6568] hover:text-[#241416] hover:bg-[#602E31]/10 transition-colors cursor-pointer">+</button>
              </div>
              <button onClick={() => removeItem(item.dish.id)} className="text-[#7E6568] hover:text-[#A8382B] p-1.5 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-2xl space-y-3 max-w-md ml-auto border border-[#E8D9CC] shadow-sm">
        <div className="flex justify-between text-xs text-[#7E6568]"><span>Subtotal:</span><span className="text-[#241416] font-semibold">{RESTAURANT_BRAND.currencySymbol}{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-[#7E6568]"><span>Estimated Tax:</span><span className="text-[#241416] font-semibold">{RESTAURANT_BRAND.currencySymbol}{taxAmount.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-[#7E6568]"><span>Delivery Fee:</span><span className="text-[#241416] font-semibold">{RESTAURANT_BRAND.currencySymbol}{deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm font-bold text-[#241416] pt-3 border-t border-[#E8D9CC]"><span>Total:</span><span className="text-[#602E31] font-mono text-base">{RESTAURANT_BRAND.currencySymbol}{totalAmount.toFixed(2)}</span></div>
        <Link to="/checkout" className="w-full mt-4 min-h-[48px] inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#602E31] hover:bg-[#4D2326] active:scale-[0.97] text-[#FFF5EC] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer">
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
