import React from 'react';
import type { Order } from '../types/order';
import { RESTAURANT_BRAND } from '../config/constants';
import { formatPrice } from '../utils/formatters';
import { Printer, X, Receipt } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${order.orderNumber.replace('#', '')}`;
  const orderDate = new Date(order.createdAt).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handlePrint = () => {
    window.print();
  };

  const halfTax = order.taxAmount / 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs print:p-0 print:bg-white print:static">
      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2E8E0] overflow-hidden max-h-[90vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D9CC] bg-[#FAF2EA] print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#241416]">
            <Receipt className="w-4 h-4 text-[#602E31]" />
            <span>Tax Invoice / Cash Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#602E31] hover:bg-[#4D2326] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7E6568] hover:text-[#241416] hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:overflow-visible print:p-0 print:text-black">
          
          {/* Header Brand & Registration */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8D9CC] pb-6 print:border-gray-300">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#241416] tracking-tight print:text-black">
                {RESTAURANT_BRAND.name}
              </h2>
              <p className="text-xs text-[#7E6568] print:text-gray-600 mt-0.5">
                {RESTAURANT_BRAND.address || 'Artisanal Botanical Dining & Hearth'}
              </p>
              <p className="text-[11px] font-mono text-[#7E6568] print:text-gray-600">
                GSTIN: 29AABCC1234F1Z8 • FSSAI Lic: 11223344000123
              </p>
            </div>
            <div className="sm:text-right font-mono text-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-[#602E31]/10 border border-[#E8D9CC] text-[#602E31] font-bold uppercase text-[10px] print:border-gray-300 print:bg-white print:text-black">
                ORIGINAL TAX INVOICE
              </span>
              <p className="font-bold text-[#241416] text-sm mt-1 print:text-black">{invoiceNumber}</p>
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-[#FAF2EA] p-4 rounded-xl border border-[#E8D9CC] print:bg-white print:border-gray-300">
            <div>
              <span className="text-[10px] text-[#7E6568] uppercase font-bold block print:text-gray-500">Invoice No</span>
              <span className="font-bold text-[#241416] print:text-black">{invoiceNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7E6568] uppercase font-bold block print:text-gray-500">Date & Time</span>
              <span className="text-[#241416] print:text-black">{orderDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7E6568] uppercase font-bold block print:text-gray-500">Order Mode</span>
              <span className="font-bold text-[#602E31] print:text-black">
                {order.orderType === 'DINE_IN'
                  ? (order.tableNumber?.startsWith('Table') ? order.tableNumber : `Table ${order.tableNumber || '1'}`)
                  : order.orderType}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#7E6568] uppercase font-bold block print:text-gray-500">Payment</span>
              <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-[#602E31]' : 'text-[#C97852]'} print:text-black`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer / Delivery Info if present */}
          {((order as any).guestName || (order as any).guestPhone || order.deliveryAddress) && (
            <div className="text-xs font-mono bg-[#FAF2EA] p-3 rounded-xl border border-[#E8D9CC] print:bg-white print:border-gray-300 space-y-1">
              <span className="text-[10px] text-[#7E6568] uppercase font-bold block print:text-gray-500">Billed To</span>
              <div className="text-[#241416] font-sans">
                {(order as any).guestName && <span className="font-bold">{(order as any).guestName} </span>}
                {(order as any).guestPhone && <span className="text-slate-500 font-mono">({(order as any).guestPhone})</span>}
                {order.deliveryAddress && (
                  <p className="text-[11px] text-slate-600 mt-0.5">{order.deliveryAddress}</p>
                )}
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-[#7E6568] border-b border-[#E8D9CC] pb-1.5 font-bold print:border-gray-300 print:text-gray-600">
              <span>Item & Modifiers</span>
              <span className="text-right">Qty × Price = Amount</span>
            </div>

            <div className="divide-y divide-[#E8D9CC] print:divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 text-xs flex justify-between items-start gap-4">
                  <div>
                    <span className="font-serif font-bold text-[#241416] print:text-black block text-sm">
                      {item.dishName}
                    </span>
                    {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                      <div className="text-[11px] text-[#7E6568] font-mono print:text-gray-600">
                        {item.selectedModifiers.map((m, idx) => (
                          <span key={idx} className="block">• {m.optionName} {m.price > 0 && `(+${formatPrice(m.price)})`}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className="text-[#7E6568] text-[11px] block print:text-gray-600">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </span>
                    <span className="font-bold text-[#241416] print:text-black">
                      {formatPrice(item.itemSubtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-1.5 pt-4 border-t border-[#E8D9CC] text-xs font-mono print:border-gray-300">
            <div className="flex justify-between text-[#7E6568] print:text-gray-600">
              <span>Item Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#7E6568] print:text-gray-600">
              <span>CGST (2.5%):</span>
              <span>{formatPrice(halfTax)}</span>
            </div>
            <div className="flex justify-between text-[#7E6568] print:text-gray-600">
              <span>SGST (2.5%):</span>
              <span>{formatPrice(halfTax)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-[#7E6568] print:text-gray-600">
                <span>Delivery & Handling:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            {order.tipAmount > 0 && (
              <div className="flex justify-between text-[#7E6568] print:text-gray-600">
                <span>Concierge Gratuity:</span>
                <span>{formatPrice(order.tipAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-serif font-bold text-[#241416] pt-3 border-t-2 border-[#241416] print:text-black print:border-black">
              <span>Total Payable:</span>
              <span className="font-mono font-extrabold text-[#602E31] print:text-black">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Reference & Legal Disclaimer */}
          <div className="text-[10px] font-mono text-[#7E6568] text-center pt-4 border-t border-[#E8D9CC] print:border-gray-300 print:text-gray-500 space-y-1">
            {order.paymentReference && (
              <p>Payment ID / Gateway Ref: <span className="font-bold text-[#241416] print:text-black">{order.paymentReference}</span></p>
            )}
            <p>Thank you for dining with Tronx. This is a computer-generated tax invoice.</p>
          </div>

        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E8D9CC] bg-[#FAF2EA] print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E8D9CC] text-[#241416] hover:bg-white text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#602E31] text-white hover:bg-[#4D2326] text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Download
          </button>
        </div>

      </div>
    </div>
  );
};
