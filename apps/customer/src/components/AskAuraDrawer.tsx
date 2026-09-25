import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Plus, Check, RotateCcw, ArrowRight, Eye, ShieldCheck, Loader2 } from 'lucide-react';
import { useMenu } from '@shared/hooks/useMenu';
import { useCart } from '@shared/hooks/useCart';
import { formatPrice } from '@shared/utils/formatters';
import type { Dish } from '@shared/types/menu';
import { CONCIERGE_COMMON_QUESTIONS } from '@shared/utils/auraConcierge';
import { requestAskAura, type ChatHistoryEntry } from '@shared/services/auraAiService';
import { DishDetailModal } from './DishDetailModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  dishes?: Dish[];
  isFallback?: boolean;
  timestamp: number;
}

export const AskAuraDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDishForModal, setSelectedDishForModal] = useState<Dish | null>(null);
  const [addedDishIds, setAddedDishIds] = useState<string[]>([]);

  const { dishes } = useMenu();
  const { addItem } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOpenAuraEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ question?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.question) {
        setTimeout(() => {
          handleAskQuestion(customEvent.detail!.question!);
        }, 350);
      }
    };
    window.addEventListener('open-ask-aura', handleOpenAuraEvent);
    return () => window.removeEventListener('open-ask-aura', handleOpenAuraEvent);
  }, [isLoading, dishes]);

  const handleAskQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Build chat history context for multi-turn conversational memory
    const historyEntries: ChatHistoryEntry[] = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
      dishIds: m.dishes ? m.dishes.map((d) => d.id) : undefined,
    }));

    try {
      const result = await requestAskAura(trimmed, dishes, historyEntries);

      const auraMsg: ChatMessage = {
        id: 'aura-' + Date.now(),
        sender: 'aura',
        text: result.message,
        dishes: result.dishes,
        isFallback: result.isFallback,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, auraMsg]);
    } catch {
      // Ultimate defensive fallback
      const auraMsg: ChatMessage = {
        id: 'aura-err-' + Date.now(),
        sender: 'aura',
        text: 'AURA is taking a moment. Here are some menu options I can recommend right now:',
        dishes: dishes.filter((d) => d.dietaryTags.includes('SIGNATURE') || d.featured).slice(0, 3),
        isFallback: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, auraMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(inputValue);
  };

  const handleAddToCart = (dish: Dish, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(dish, 1, []);
    setAddedDishIds((prev) => [...prev, dish.id]);
    setTimeout(() => {
      setAddedDishIds((prev) => prev.filter((id) => id !== dish.id));
    }, 1400);
  };

  const handleResetSession = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <>
      {/* ── Floating Luxury ASK TRONX Trigger Button ─────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ask Tronx AI Dining Concierge"
        className="fixed bottom-20 right-6 z-40 px-4 py-3 rounded-full bg-[#602E31] border border-[#4D2326] text-[#FFF5EC] shadow-[0_8px_30px_rgba(96,46,49,0.4)] hover:bg-[#4D2326] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFF5EC] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFF5EC]"></span>
        </span>
        <Sparkles className="w-4 h-4 text-[#C2674F] transition-transform duration-300 group-hover:rotate-12" />
        <span className="text-xs font-sans font-bold tracking-widest uppercase text-[#FFF5EC]">
          ✦ ASK TRONX
        </span>
      </button>

      {/* ── AI Concierge Drawer / Panel ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full sm:max-w-lg h-full bg-[#FFF5EC] border-l border-[#E8D9CC] shadow-2xl flex flex-col z-10 text-[#241416]"
            >
              {/* Header */}
              <div className="p-6 bg-[#602E31] text-[#FFF5EC] border-b border-[#4D2326] flex items-center justify-between shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C2674F]" />
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#E8D9CC] font-bold">
                      Tronx Dining Concierge
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>ASK TRONX</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-[#FFF5EC] font-normal tracking-wider border border-white/20">
                      LIVE MENU
                    </span>
                  </h2>
                  <p className="text-xs text-white/80 font-sans">
                    Refined guidance through our culinary collection
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleResetSession}
                      title="Reset conversation"
                      className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close concierge"
                    className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Conversation / Discovery Area */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 dish-detail-modal-scroll">
                {/* 10 Selectable Common Questions (Visible at start) */}
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#FAF2EA] border border-[#E8D9CC] space-y-2">
                      <div className="flex items-center gap-2 text-[#602E31] text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#C2674F]" />
                        <span>Curated Dining Inquiries</span>
                      </div>
                      <p className="text-xs text-[#7E6568] leading-relaxed">
                        Select any question below for intelligent recommendations strictly grounded in our authentic culinary creations:
                      </p>
                    </div>

                    <div className="space-y-2">
                      {CONCIERGE_COMMON_QUESTIONS.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleAskQuestion(q.question)}
                          className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-[#FAF2EA] border border-[#E8D9CC] hover:border-[#602E31] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                        >
                          <span className="text-xs font-serif font-bold tracking-wide text-[#241416] group-hover:text-[#602E31]">
                            {q.shortLabel}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#7E6568] group-hover:text-[#602E31] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Conversation History */
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        {msg.sender === 'user' ? (
                          <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-[#602E31] text-white text-xs font-medium shadow-xs leading-relaxed">
                            {msg.text}
                          </div>
                        ) : (
                          <div className="w-full space-y-3">
                            <div className="p-4 rounded-2xl bg-white border border-[#E8D9CC] text-xs leading-relaxed text-[#241416] shadow-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-[#602E31] font-bold text-[10px] tracking-widest uppercase">
                                  <Sparkles className="w-3 h-3 text-[#C2674F]" />
                                  <span>Tronx Concierge</span>
                                </div>
                                <span className="flex items-center gap-1 text-[9px] font-mono text-[#7E6568] uppercase">
                                  <ShieldCheck className="w-3 h-3 text-[#602E31]" />
                                  Menu Grounded
                                </span>
                              </div>
                              <p className="whitespace-pre-line text-[#241416]">{msg.text}</p>
                            </div>

                            {/* Real Dishes Grid */}
                            {msg.dishes && msg.dishes.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {msg.dishes.map((dish) => {
                                  const isAdded = addedDishIds.includes(dish.id);
                                  const isVeg = dish.dietaryTags.some(
                                    (t) => t === 'VEGETARIAN' || t === 'VEGAN'
                                  );
                                  const isSignature =
                                    dish.dietaryTags.includes('SIGNATURE') || !!dish.featured;

                                  return (
                                    <div
                                      key={dish.id}
                                      className="bg-white p-3 rounded-xl border border-[#E8D9CC] hover:border-[#602E31] transition-all shadow-xs flex flex-col justify-between space-y-2 group"
                                    >
                                      {/* Media Preview */}
                                      <div
                                        onClick={() => setSelectedDishForModal(dish)}
                                        className="aspect-[16/10] rounded-lg overflow-hidden bg-[#FAF2EA] relative cursor-pointer"
                                      >
                                        <img
                                          src={dish.posterUrl || dish.mediaUrl}
                                          alt={dish.name}
                                          onError={(e) => {
                                            e.currentTarget.src =
                                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';
                                          }}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 left-2 flex items-center gap-1">
                                          <span
                                            className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center bg-white shadow-xs ${
                                              isVeg ? 'border-emerald-600' : 'border-rose-700'
                                            }`}
                                          >
                                            <span
                                              className={`w-1.5 h-1.5 rounded-full ${
                                                isVeg ? 'bg-emerald-600' : 'bg-rose-700'
                                              }`}
                                            />
                                          </span>
                                          {isSignature && (
                                            <span className="px-1.5 py-0.5 rounded-xs bg-[#602E31]/90 text-[#FFF5EC] text-[8px] font-mono tracking-wider font-bold">
                                              SIGNATURE
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Details */}
                                      <div
                                        onClick={() => setSelectedDishForModal(dish)}
                                        className="cursor-pointer space-y-1"
                                      >
                                        <h4 className="font-serif text-xs font-bold text-[#241416] group-hover:text-[#602E31] line-clamp-1">
                                          {dish.name}
                                        </h4>
                                        <p className="text-[10px] text-[#7E6568] line-clamp-2 leading-relaxed">
                                          {dish.description}
                                        </p>
                                        <span className="font-mono text-xs font-bold text-[#602E31] block">
                                          {formatPrice(dish.price)}
                                        </span>
                                      </div>

                                      {/* Dual CTAs: View Dish + Add to Order */}
                                      <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-[#E8D9CC]/60">
                                        <button
                                          type="button"
                                          onClick={() => setSelectedDishForModal(dish)}
                                          className="py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#602E31] bg-[#FAF2EA] hover:bg-[#E8D9CC]/40 border border-[#E8D9CC] transition-all flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          <Eye className="w-3 h-3" />
                                          <span>View Dish</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={(e) => handleAddToCart(dish, e)}
                                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                            isAdded
                                              ? 'bg-[#241416] text-[#FFF5EC]'
                                              : 'bg-[#602E31] hover:bg-[#4D2326] text-white shadow-2xs'
                                          }`}
                                        >
                                          {isAdded ? (
                                            <>
                                              <Check className="w-3 h-3 text-[#FFF5EC]" />
                                              <span>Added</span>
                                            </>
                                          ) : (
                                            <>
                                              <Plus className="w-3 h-3" />
                                              <span>Add</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Thinking / Loading Shimmer */}
                    {isLoading && (
                      <div className="flex items-start">
                        <div className="p-4 rounded-2xl bg-white border border-[#E8D9CC] text-xs text-[#7E6568] shadow-xs flex items-center gap-2.5">
                          <Loader2 className="w-4 h-4 text-[#C2674F] animate-spin" />
                          <span className="font-serif italic text-xs text-[#602E31]">
                            Tronx is reflecting on our kitchen collection...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Follow-up Quick Chips */}
                    <div className="pt-4 border-t border-[#E8D9CC]/60">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E6568] block mb-2 font-bold">
                        Continue Exploring:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {CONCIERGE_COMMON_QUESTIONS.slice(0, 6).map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleAskQuestion(q.question)}
                            className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF2EA] border border-[#E8D9CC] hover:border-[#602E31] text-[10px] font-bold text-[#533B3D] tracking-wide transition-all cursor-pointer disabled:opacity-50"
                          >
                            {q.shortLabel}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Free-form Input Footer */}
              <div className="p-4 bg-white border-t border-[#E8D9CC] shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      maxLength={300}
                      value={inputValue}
                      disabled={isLoading}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about ingredients, dietary, dishes, or combinations..."
                      className="w-full px-4 py-2.5 pr-14 rounded-xl bg-[#FAF2EA] border border-[#E8D9CC] text-xs text-[#241416] placeholder-[#7E6568]/60 focus:outline-none focus:border-[#602E31] focus:ring-1 focus:ring-[#602E31]/20 transition-all disabled:opacity-60"
                    />
                    {inputValue.length > 200 && (
                      <span className="absolute right-3 top-2.5 text-[9px] font-mono text-[#7E6568]">
                        {300 - inputValue.length}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send inquiry"
                    className="p-2.5 rounded-xl bg-[#602E31] hover:bg-[#4D2326] text-white transition-colors cursor-pointer shrink-0 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dish Detail Modal (when clicking "View Dish" on any recommended item) */}
      <DishDetailModal
        dish={selectedDishForModal}
        isOpen={!!selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        onSelectDish={(d) => setSelectedDishForModal(d)}
      />
    </>
  );
};
