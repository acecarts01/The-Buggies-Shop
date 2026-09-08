'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, ArrowRight, MessageSquare, Zap, Sparkles, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import { SITE, CONTACT, SHOP, isAccessoryItem, isBuggyItem } from '@/src/config/site';

export interface CartItem {
  id: string;
  name: string;
  price_aud: number;
  price_display: string;
  quantity: number;
  image?: string;
  category?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  // Payment option: 'standard' | 'finance4' | 'crypto'
  const [paymentOption, setPaymentOption] = useState<'standard' | 'finance4' | 'crypto'>('standard');
  const [showFinanceSchedule, setShowFinanceSchedule] = useState(true);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPostcode, setBuyerPostcode] = useState('');

  if (!isOpen) return null;

  // Determine buggy vs accessory breakdown for the 5% bundle discount
  const hasBuggy = items.some((i) => isBuggyItem(i.category, i.id, i.name));
  const hasAccessory = items.some((i) => isAccessoryItem(i.category, i.id, i.name));
  const isBundleEligible = hasBuggy && hasAccessory;

  const rawSubtotal = items.reduce((sum, i) => sum + i.price_aud * i.quantity, 0);

  // 5% discount on all accessories when bought alongside buggies
  const accessoryTotal = items
    .filter((i) => isAccessoryItem(i.category, i.id, i.name))
    .reduce((sum, i) => sum + i.price_aud * i.quantity, 0);

  const accessoryDiscount = isBundleEligible ? Math.round(accessoryTotal * 0.05) : 0;
  const subtotalAfterAccessory = Math.max(0, rawSubtotal - accessoryDiscount);

  // 10% crypto discount on the resulting subtotal if crypto is chosen
  const cryptoDiscount = paymentOption === 'crypto' ? Math.round(subtotalAfterAccessory * 0.1) : 0;
  const finalTotal = Math.max(0, subtotalAfterAccessory - cryptoDiscount);

  // Finance in 4 calculations: 4 equal installments
  const installmentAmount = Math.round((finalTotal / 4) * 100) / 100;

  const generateWhatsAppMessage = () => {
    const lines = items.map((item) => {
      const isAcc = isAccessoryItem(item.category, item.id, item.name);
      const discountTag = isBundleEligible && isAcc ? ' [5% Bundle Discount Applied]' : '';
      return `• ${item.name} x${item.quantity} - $${(item.price_aud * item.quantity).toLocaleString()} AUD${discountTag}`;
    });

    const paymentLabel =
      paymentOption === 'finance4'
        ? `Finance in 4 (4 Equal Interest-Free Payments of $${installmentAmount.toLocaleString()} AUD)`
        : paymentOption === 'crypto'
        ? 'Crypto BTC / USDT (10% Discount Applied)'
        : 'PayID / Direct Bank Transfer (EFT)';

    const text = `Hello The Buggies Express team,
I'd like to place an order inquiry for:
${lines.join('\n')}

Subtotal: $${rawSubtotal.toLocaleString()} AUD
${isBundleEligible ? `Buggy + Accessory 5% Bundle Discount: -$${accessoryDiscount.toLocaleString()} AUD (Applies to all payment methods!)\n` : ''}${paymentOption === 'crypto' ? `Crypto 10% Incentive: -$${cryptoDiscount.toLocaleString()} AUD\n` : ''}Final Estimated Total: $${finalTotal.toLocaleString()} AUD
${paymentOption === 'finance4' ? `Finance in 4 Plan: 4 interest-free payments of $${installmentAmount.toLocaleString()} AUD\n` : ''}
Payment Method Preference: ${paymentLabel}
Customer: ${buyerName || 'Australian Buyer'}
Delivery Postcode: ${buyerPostcode || 'Pending'}

Please confirm stock availability at the Yatala QLD depot and dispatch timing.`;
    return encodeURIComponent(text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E2E8F0] text-[#1E293B] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F9FA]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#1E293B]" id="slide-over-title">
                  Your Order Manifest
                </h2>
                <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  DIRECT DISPATCH
                </span>
              </div>
              <div className="text-xs text-[#64748B]">
                {items.length} {items.length === 1 ? 'item' : 'items'} in order draft • Yatala Central Depot
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Special Bundle Notification Bar */}
          {items.length > 0 && isBundleEligible && (
            <div className="bg-[#EFF6FF] border-b border-[#2563EB]/20 px-4 py-2.5 flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 animate-pulse" />
              <div className="text-[#1E293B] leading-tight">
                <span className="font-bold text-[#2563EB]">5% Bundle Discount Active!</span> You unlocked 5% off all accessories purchased alongside your buggy.
              </div>
            </div>
          )}

          {/* Cart Upsell / Recommendation Bar */}
          {items.length > 0 && hasAccessory && !hasBuggy && (
            <div className="bg-[#EFF6FF] border-b border-[#2563EB]/20 px-4 py-2 text-xs flex items-center justify-between gap-2">
              <div className="text-[#1E293B]">
                💡 <span className="font-semibold text-[#2563EB]">Pro Tip:</span> Add any Golf Buggy to get <span className="font-bold underline">5% OFF all accessories</span>!
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-bold text-[#2563EB] hover:underline shrink-0"
              >
                Browse Buggies &rarr;
              </button>
            </div>
          )}

          {items.length > 0 && hasBuggy && !hasAccessory && (
            <div className="bg-[#EFF6FF] border-b border-[#2563EB]/20 px-4 py-2 text-xs flex items-center justify-between gap-2">
              <div className="text-[#1E293B]">
                ✨ <span className="font-semibold text-[#2563EB]">Bundle Deal:</span> Add an all-weather cover, high-amp charger, or battery to save <span className="font-bold text-[#2563EB]">5% automatically</span>!
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-bold text-[#2563EB] hover:underline shrink-0"
              >
                Add Parts &rarr;
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-[#E2E8F0]">
            {items.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#EFF6FF] border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shadow-inner">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="text-base font-bold text-[#1E293B]">Your order manifest is currently empty</div>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
                  Browse our 61 Australian models including luxury 4-seaters, lifted 4x4 acreage buggies, and golf course carts.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const isAcc = isAccessoryItem(item.category, item.id, item.name);
                const itemSavings = isBundleEligible && isAcc ? Math.round(item.price_aud * item.quantity * 0.05) : 0;

                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#1E293B] line-clamp-2">
                          {item.name}
                        </span>
                        {isAcc ? (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                            Part / Accessory
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
                            Buggy
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#2563EB] font-semibold mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>${item.price_aud.toLocaleString()} AUD</span>
                        <span className="text-[10px] text-[#64748B]">(GST Included)</span>
                      </div>

                      {/* 5% Bundle Discount applied tag */}
                      {isBundleEligible && isAcc && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#2563EB]/20">
                          <Sparkles className="w-3 h-3 text-[#2563EB]" />
                          <span>5% Bundle Savings: -${itemSavings.toLocaleString()} AUD</span>
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#E2E8F0] rounded-lg bg-[#F8F9FA]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="px-2 py-1 text-xs text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] rounded-l"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#1E293B]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="px-2 py-1 text-xs text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] rounded-r"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 ml-2 font-medium"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-[#1E293B] text-right shrink-0">
                      ${(item.price_aud * item.quantity).toLocaleString()} AUD
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout & WhatsApp Order Summary Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-[#F8F9FA] space-y-3">
              {/* Payment Method Selector (Pay-in-4, Standard, Crypto) */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1E293B] flex items-center justify-between">
                  <span>Select Payment Option</span>
                  <span className="text-[10px] text-[#64748B] font-normal">All receive 5% accessory discount</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {/* Option 1: Standard (Bank / PayID) */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('standard')}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      paymentOption === 'standard'
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] ring-1 ring-[#2563EB]'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB]/40'
                    }`}
                  >
                    <div className="font-bold text-[11px] leading-tight text-[#1E293B]">Standard</div>
                    <div className="text-[9px] text-[#64748B] mt-0.5">PayID / EFT</div>
                  </button>

                  {/* Option 2: Finance in 4 */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('finance4')}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all relative ${
                      paymentOption === 'finance4'
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] ring-1 ring-[#2563EB]'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB]/40'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-[#2563EB] leading-tight">Finance in 4</div>
                    <div className="text-[9px] text-[#64748B] mt-0.5">0% Interest</div>
                  </button>

                  {/* Option 3: Crypto 10% Off */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('crypto')}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      paymentOption === 'crypto'
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] ring-1 ring-[#2563EB]'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB]/40'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-[#2563EB] leading-tight">Crypto</div>
                    <div className="text-[9px] text-emerald-600 font-bold mt-0.5">SAVE 10%</div>
                  </button>
                </div>
              </div>

              {/* Finance in 4 Schedule Breakdown Card */}
              {paymentOption === 'finance4' && (
                <div className="bg-white border border-[#2563EB]/30 rounded-xl p-3 text-xs space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#2563EB] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#2563EB]" />
                      <span>Finance in 4: 4x ${installmentAmount.toLocaleString()} AUD</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
                      0% Interest
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1">
                    <div className="p-1.5 rounded bg-[#F8F9FA] border border-[#E2E8F0]">
                      <div className="text-[#64748B]">Payment 1</div>
                      <div className="font-bold text-[#1E293B]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#2563EB] font-medium">Today</div>
                    </div>
                    <div className="p-1.5 rounded bg-[#F8F9FA] border border-[#E2E8F0]">
                      <div className="text-[#64748B]">Payment 2</div>
                      <div className="font-bold text-[#1E293B]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#64748B]">2 Weeks</div>
                    </div>
                    <div className="p-1.5 rounded bg-[#F8F9FA] border border-[#E2E8F0]">
                      <div className="text-[#64748B]">Payment 3</div>
                      <div className="font-bold text-[#1E293B]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#64748B]">4 Weeks</div>
                    </div>
                    <div className="p-1.5 rounded bg-[#F8F9FA] border border-[#E2E8F0]">
                      <div className="text-[#64748B]">Payment 4</div>
                      <div className="font-bold text-[#1E293B]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#64748B]">6 Weeks</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#64748B] flex items-center gap-1 pt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2563EB] shrink-0" />
                    <span>No hidden fees • Instant approval on invoice via Yatala finance team.</span>
                  </div>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#1E293B]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Subtotal (AUD):</span>
                  <span className="font-semibold">${rawSubtotal.toLocaleString()}</span>
                </div>

                {/* 5% Accessory Bundle Discount row */}
                {isBundleEligible && accessoryDiscount > 0 && (
                  <div className="flex justify-between text-[#2563EB] font-bold bg-[#EFF6FF] px-2 py-1 rounded border border-[#2563EB]/20">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Buggy + Accessory 5% Bundle Discount:</span>
                    </span>
                    <span>-${accessoryDiscount.toLocaleString()} AUD</span>
                  </div>
                )}

                {/* Crypto Discount row */}
                {paymentOption === 'crypto' && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    <span>10% Crypto Settlement Incentive:</span>
                    <span>-${cryptoDiscount.toLocaleString()} AUD</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] text-[#64748B]">
                  <span>GST:</span>
                  <span>Included in prices (Official Tax Invoice provided)</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-[#1E293B] pt-2 border-t border-[#E2E8F0]">
                  <span>Estimated Total:</span>
                  <div className="text-right">
                    <div className="text-[#2563EB] font-sans font-bold">${finalTotal.toLocaleString()} AUD</div>
                    {paymentOption === 'finance4' && (
                      <div className="text-[11px] font-sans font-medium text-[#64748B]">
                        or 4 payments of ${installmentAmount.toLocaleString()} AUD
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fast Fields */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-[#1E293B] placeholder-[#64748B]/60 focus:outline-none focus:border-[#2563EB]"
                />
                <input
                  type="text"
                  placeholder="Delivery Postcode (e.g. 4207)"
                  value={buyerPostcode}
                  onChange={(e) => setBuyerPostcode(e.target.value)}
                  className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-[#1E293B] placeholder-[#64748B]/60 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Order Confirmation via WhatsApp */}
              <a
                href={`https://wa.me/61480408189?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
                id="cart-whatsapp-order-btn"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {paymentOption === 'finance4'
                    ? 'Confirm Order with Finance in 4'
                    : 'Confirm Order via WhatsApp'}
                </span>
              </a>

              {/* Direct Yatala Inquiry */}
              <a
                href={`tel:${CONTACT.phone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E2E8F0] text-[#1E293B] bg-white text-xs font-semibold rounded-lg hover:bg-[#F8F9FA] transition-colors shadow-2xs"
                id="cart-call-depot-btn"
              >
                <span>Call Yatala Sales Desk: 0480 408 189</span>
              </a>

              <div className="flex items-center justify-center gap-1 text-[10px] text-[#64748B] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>ASIC Registered • ABN 28 668 598 758 • Full ACL Warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
