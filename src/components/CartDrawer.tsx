'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShieldCheck, ArrowRight, MessageSquare, Zap, Sparkles, CreditCard, CheckCircle2, ChevronRight, Bitcoin, ArrowLeft } from 'lucide-react';
import { SITE, CONTACT, SHOP, isAccessoryItem, isBuggyItem, PRODUCTS } from '@/src/config/site';
import CryptoCheckout from './CryptoCheckout';

/** Order reference shown on the crypto invoice and quoted back on WhatsApp. */
function newOrderRef(): string {
  const d = new Date();
  const stamp = `${d.getFullYear().toString().slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `BE-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

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
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPostcode, setBuyerPostcode] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  // Crypto: after "Pay" the drawer shows the on-site invoice (addresses, QR,
  // WhatsApp receipt step) instead of leaving the site.
  const [cryptoStage, setCryptoStage] = useState<'form' | 'pay'>('form');
  const [orderRef, setOrderRef] = useState('');

  const sendOrderToSalesDesk = async (method: 'whatsapp' | 'invoice' | 'crypto', ref?: string) => {
    try {
      await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          formType: 'order',
          subject: 'NEW ORDER',
          name: buyerName.trim() || 'Website Customer',
          phone: buyerPhone.trim() || undefined,
          email: buyerEmail.trim() || undefined,
          postcode: buyerPostcode.trim() || 'Pending',
          paymentOption,
          total: finalTotal,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price_aud,
            id: i.id,
          })),
          message: `NEW ORDER placed via website manifest (${
            method === 'invoice' ? 'Direct Tax Invoice' : method === 'crypto' ? 'On-site Crypto Invoice' : 'WhatsApp Checkout'
          }).${ref ? `
Order Ref: ${ref}` : ''}
Payment Option: ${paymentOption}${method === 'crypto' ? ' (BTC / USDT - buyer confirms with receipt on WhatsApp)' : ''}
Subtotal: $${rawSubtotal.toLocaleString()} AUD
Bundle Discount: -$${accessoryDiscount.toLocaleString()} AUD
Crypto Discount: -$${cryptoDiscount.toLocaleString()} AUD
Final Total: $${finalTotal.toLocaleString()} AUD (excludes freight)
Freight: to be quoted against the delivery postcode
Postcode: ${buyerPostcode || 'Not specified'}

Items:
${items.map((i) => `• ${i.name} x${i.quantity} ($${(i.price_aud * i.quantity).toLocaleString()} AUD)`).join('\n')}`,
        }),
      });
    } catch (e) {
      console.error('[CartDrawer] Error notifying sales desk:', e);
    }
  };

  const handleInvoiceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setOrderError('Please enter your full name.');
      return;
    }
    if (!buyerPhone.trim() && !buyerEmail.trim()) {
      setOrderError('Please provide either an email or mobile phone number.');
      return;
    }

    setSubmittingOrder(true);
    setOrderError('');

    try {
      await sendOrderToSalesDesk('invoice');
      onClearCart();
      window.location.assign('/thank-you-order/');
    } catch {
      window.location.assign('/thank-you-order/');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Crypto "Pay": record the order with the sales desk, then show the invoice.
  const handleCryptoPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setOrderError('Please enter your full name.');
      return;
    }
    if (!buyerPhone.trim() && !buyerEmail.trim()) {
      setOrderError('Please provide either an email or mobile phone number.');
      return;
    }
    setSubmittingOrder(true);
    setOrderError('');
    const ref = newOrderRef();
    setOrderRef(ref);
    try {
      await sendOrderToSalesDesk('crypto', ref);
    } finally {
      setSubmittingOrder(false);
      setCryptoStage('pay');
    }
  };

  const handleWhatsAppOrderClick = () => {
    sendOrderToSalesDesk('whatsapp');
  };

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

The total above excludes freight. Please confirm stock availability at the Yatala QLD depot, dispatch timing, and the freight quote for my postcode.`;
    return encodeURIComponent(text);
  };

  // Full-viewport overlay: render nothing while closed, otherwise the
  // backdrop sits over the page and swallows every click beneath it.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E7E5E4] text-[#121417] shadow-sm flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E7E5E4] flex items-center justify-between bg-[#F7F6F2]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#121417]" id="slide-over-title">
                  Your Order Manifest
                </h2>
                <span className="bg-[#F7EFEA] text-[#A85640] border border-[#C86D51]/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  DIRECT DISPATCH
                </span>
              </div>
              <div className="text-xs text-[#6B645E]">
                {items.length} {items.length === 1 ? 'item' : 'items'} in order draft • Yatala Central Depot
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#E7E5E4] text-[#6B645E] hover:text-[#121417] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Special Bundle Notification Bar */}
          {items.length > 0 && isBundleEligible && (
            <div className="bg-[#F7EFEA] border-b border-[#C86D51]/20 px-4 py-2.5 flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#A85640] shrink-0 animate-pulse" />
              <div className="text-[#121417] leading-tight">
                <span className="font-bold text-[#A85640]">5% Bundle Discount Active!</span> You unlocked 5% off all accessories purchased alongside your buggy.
              </div>
            </div>
          )}

          {/* Cart Upsell / Recommendation Bar */}
          {items.length > 0 && hasAccessory && !hasBuggy && (
            <div className="bg-[#F7EFEA] border-b border-[#C86D51]/20 px-4 py-2 text-xs flex items-center justify-between gap-2">
              <div className="text-[#121417]">
                💡 <span className="font-semibold text-[#A85640]">Pro Tip:</span> Add any Golf Buggy to get <span className="font-bold underline">5% OFF all accessories</span>!
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-bold text-[#A85640] hover:underline shrink-0"
              >
                Browse Buggies &rarr;
              </button>
            </div>
          )}

          {items.length > 0 && hasBuggy && !hasAccessory && (
            <div className="bg-[#F7EFEA] border-b border-[#C86D51]/20 px-4 py-2 text-xs flex items-center justify-between gap-2">
              <div className="text-[#121417]">
                ✨ <span className="font-semibold text-[#A85640]">Bundle Deal:</span> Add an all-weather cover, high-amp charger, or battery to save <span className="font-bold text-[#A85640]">5% automatically</span>!
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-bold text-[#A85640] hover:underline shrink-0"
              >
                Add Parts &rarr;
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-[#E7E5E4]">
            {items.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#F7EFEA] border border-[#C86D51]/20 flex items-center justify-center text-[#A85640] shadow-inner">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="text-base font-bold text-[#121417]">Your order manifest is currently empty</div>
                <p className="text-xs text-[#6B645E] max-w-xs mx-auto leading-relaxed">
                  Browse our {PRODUCTS.length} Australian models including luxury 4-seaters, lifted 4x4 acreage buggies, and golf course carts.
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
                        <span className="text-xs font-bold text-[#121417] line-clamp-2">
                          {item.name}
                        </span>
                        {isAcc ? (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EFEDE6] text-[#6B645E] border border-[#E7E5E4]">
                            Part / Accessory
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F7EFEA] text-[#A85640] border border-[#C86D51]/20">
                            Buggy
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#A85640] font-semibold mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>${item.price_aud.toLocaleString()} AUD</span>
                        <span className="text-[10px] text-[#6B645E]">(GST Included)</span>
                      </div>

                      {/* 5% Bundle Discount applied tag */}
                      {isBundleEligible && isAcc && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#A85640] bg-[#F7EFEA] px-2 py-0.5 rounded border border-[#C86D51]/20">
                          <Sparkles className="w-3 h-3 text-[#A85640]" />
                          <span>5% Bundle Savings: -${itemSavings.toLocaleString()} AUD</span>
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#E7E5E4] rounded-lg bg-[#F7F6F2] surface-card">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="px-2 py-1 text-xs text-[#6B645E] hover:text-[#121417] hover:bg-[#F7EFEA] rounded-l"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#121417]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="px-2 py-1 text-xs text-[#6B645E] hover:text-[#121417] hover:bg-[#F7EFEA] rounded-r"
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

                    <div className="text-xs font-bold text-[#121417] text-right shrink-0">
                      ${(item.price_aud * item.quantity).toLocaleString()} AUD
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Crypto invoice stage: addresses, QR and the WhatsApp receipt step */}
          {items.length > 0 && paymentOption === 'crypto' && cryptoStage === 'pay' && (
            <div className="p-4 sm:p-5 border-t border-[#E7E5E4] bg-[#F7F6F2] space-y-3">
              <button
                type="button"
                onClick={() => setCryptoStage('form')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B645E] hover:text-[#A85640]"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                Back to order details
              </button>
              <CryptoCheckout
                compact
                amountAud={finalTotal}
                orderRef={orderRef}
                buyerName={buyerName.trim() || undefined}
                itemLines={items.map((i) => `• ${i.name} x${i.quantity}`)}
                onConfirm={onClearCart}
              />
            </div>
          )}

          {/* Checkout & WhatsApp Order Summary Footer */}
          {items.length > 0 && !(paymentOption === 'crypto' && cryptoStage === 'pay') && (
            <div className="p-4 sm:p-5 border-t border-[#E7E5E4] bg-[#F7F6F2] space-y-3">
              {/* Payment Method Selector (Pay-in-4, Standard, Crypto) */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#121417] flex items-center justify-between">
                  <span>Select Payment Option</span>
                  <span className="text-[10px] text-[#6B645E] font-normal">All receive 5% accessory discount</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {/* Option 1: Standard (Bank / PayID) */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('standard')}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      paymentOption === 'standard'
                        ? 'bg-[#F7EFEA] border-[#C86D51] text-[#A85640] ring-1 ring-[#C86D51]'
                        : 'bg-white border-[#E7E5E4] text-[#6B645E] hover:border-[#C86D51]/40'
                    }`}
                  >
                    <div className="font-bold text-[11px] leading-tight text-[#121417]">Standard</div>
                    <div className="text-[9px] text-[#6B645E] mt-0.5">PayID / EFT</div>
                  </button>

                  {/* Option 2: Finance in 4 */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('finance4')}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all relative ${
                      paymentOption === 'finance4'
                        ? 'bg-[#F7EFEA] border-[#C86D51] text-[#A85640] ring-1 ring-[#C86D51]'
                        : 'bg-white border-[#E7E5E4] text-[#6B645E] hover:border-[#C86D51]/40'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-[#A85640] leading-tight">Finance in 4</div>
                    <div className="text-[9px] text-[#6B645E] mt-0.5">0% Interest</div>
                  </button>

                  {/* Option 3: Crypto 10% Off */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('crypto')}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      paymentOption === 'crypto'
                        ? 'bg-[#F7EFEA] border-[#C86D51] text-[#A85640] ring-1 ring-[#C86D51]'
                        : 'bg-white border-[#E7E5E4] text-[#6B645E] hover:border-[#C86D51]/40'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-[#A85640] leading-tight">Crypto</div>
                    <div className="text-[9px] text-[#4F7A5A] font-bold mt-0.5">SAVE 10%</div>
                  </button>
                </div>
              </div>

              {/* Crypto: paid on this page. The addresses and QR appear after Pay. */}
              {paymentOption === 'crypto' && (
                <div className="bg-white border border-[#C86D51]/30 rounded-xl p-3 shadow-2xs">
                  <div className="font-bold text-[11px] text-[#A85640] mb-0.5 flex items-center gap-1.5">
                    <Bitcoin className="w-3.5 h-3.5" aria-hidden="true" />
                    Pay in BTC or USDT on this page
                  </div>
                  <div className="text-[10px] text-[#6B645E] leading-relaxed">
                    Tap <strong>Pay with BTC / USDT</strong> below: you get our Bitcoin, USDT (TRC-20) or USDT (ERC-20) address and
                    QR code, send from any wallet or exchange, then confirm with the receipt on WhatsApp.{' '}
                    <Link href="/crypto-payment/" className="underline hover:text-[#A85640]">How it works</Link>
                  </div>
                </div>
              )}

              {/* Finance in 4 Schedule Breakdown Card */}
              {paymentOption === 'finance4' && (
                <div className="bg-white border border-[#C86D51]/30 rounded-xl p-3 text-xs space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#A85640] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#A85640]" />
                      <span>Finance in 4: 4x ${installmentAmount.toLocaleString()} AUD</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F7EFEA] text-[#A85640] border border-[#C86D51]/20">
                      0% Interest
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1">
                    <div className="p-1.5 rounded bg-[#F7F6F2] border border-[#E7E5E4]">
                      <div className="text-[#6B645E]">Payment 1</div>
                      <div className="font-bold text-[#121417]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#A85640] font-medium">Today</div>
                    </div>
                    <div className="p-1.5 rounded bg-[#F7F6F2] border border-[#E7E5E4]">
                      <div className="text-[#6B645E]">Payment 2</div>
                      <div className="font-bold text-[#121417]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#6B645E]">2 Weeks</div>
                    </div>
                    <div className="p-1.5 rounded bg-[#F7F6F2] border border-[#E7E5E4]">
                      <div className="text-[#6B645E]">Payment 3</div>
                      <div className="font-bold text-[#121417]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#6B645E]">4 Weeks</div>
                    </div>
                    <div className="p-1.5 rounded bg-[#F7F6F2] border border-[#E7E5E4]">
                      <div className="text-[#6B645E]">Payment 4</div>
                      <div className="font-bold text-[#121417]">${installmentAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-[#6B645E]">6 Weeks</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#6B645E] flex items-center gap-1 pt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#A85640] shrink-0" />
                    <span>No hidden fees • Instant approval on invoice via Yatala finance team.</span>
                  </div>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#121417]">
                <div className="flex justify-between">
                  <span className="text-[#6B645E]">Subtotal (AUD):</span>
                  <span className="font-semibold">${rawSubtotal.toLocaleString()}</span>
                </div>

                {/* 5% Accessory Bundle Discount row */}
                {isBundleEligible && accessoryDiscount > 0 && (
                  <div className="flex justify-between text-[#A85640] font-bold bg-[#F7EFEA] px-2 py-1 rounded border border-[#C86D51]/20">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#A85640]" />
                      <span>Buggy + Accessory 5% Bundle Discount:</span>
                    </span>
                    <span>-${accessoryDiscount.toLocaleString()} AUD</span>
                  </div>
                )}

                {/* Crypto Discount row */}
                {paymentOption === 'crypto' && (
                  <div className="flex justify-between text-[#4F7A5A] font-semibold bg-[#DFE5DF] px-2 py-1 rounded border border-[#A9C6B0]">
                    <span>10% Crypto Settlement Incentive:</span>
                    <span>-${cryptoDiscount.toLocaleString()} AUD</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] text-[#6B645E]">
                  <span>GST:</span>
                  <span>Included in prices (Official Tax Invoice provided)</span>
                </div>

                {/* There is no free-freight threshold and no minimum order.
                    Freight is always quoted against the delivery postcode, so
                    the cart says so rather than leaving the buyer to read the
                    total as a delivered price. */}
                <div className="flex justify-between text-[11px] text-[#6B645E]">
                  <span>Freight:</span>
                  <span className="text-right">Quoted separately by delivery postcode</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-[#121417] pt-2 border-t border-[#E7E5E4]">
                  <span>
                    Estimated Total:
                    <span className="block text-[10px] font-sans font-medium text-[#6B645E]">
                      Excludes freight
                    </span>
                  </span>
                  <div className="text-right">
                    <div className="text-[#A85640] font-sans font-bold">${finalTotal.toLocaleString()} AUD</div>
                    {paymentOption === 'finance4' && (
                      <div className="text-[11px] font-sans font-medium text-[#6B645E]">
                        or 4 payments of ${installmentAmount.toLocaleString()} AUD
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="bg-white border border-[#E7E5E4] rounded-lg px-2.5 py-2 text-[#121417] placeholder-[#78716C]/60 focus:outline-none focus:border-[#C86D51] surface-card"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Delivery Postcode *"
                    value={buyerPostcode}
                    onChange={(e) => setBuyerPostcode(e.target.value)}
                    className="bg-white border border-[#E7E5E4] rounded-lg px-2.5 py-2 text-[#121417] placeholder-[#78716C]/60 focus:outline-none focus:border-[#C86D51] surface-card"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Phone Number (Mobile)"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="bg-white border border-[#E7E5E4] rounded-lg px-2.5 py-2 text-[#121417] placeholder-[#78716C]/60 focus:outline-none focus:border-[#C86D51] surface-card"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="bg-white border border-[#E7E5E4] rounded-lg px-2.5 py-2 text-[#121417] placeholder-[#78716C]/60 focus:outline-none focus:border-[#C86D51] surface-card"
                  />
                </div>
              </div>

              {orderError && (
                <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded px-2.5 py-1.5 font-medium">
                  {orderError}
                </div>
              )}

              {/* Primary Order Action: invoice order, or the on-site crypto invoice */}
              <button
                type="button"
                onClick={paymentOption === 'crypto' ? handleCryptoPay : handleInvoiceOrderSubmit}
                disabled={submittingOrder}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#B45A40] hover:bg-[#9A4C36] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-xs disabled:opacity-50 hover:-translate-y-px duration-200"
                id="cart-submit-order-btn"
              >
                {paymentOption === 'crypto' ? <Bitcoin className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                <span>
                  {submittingOrder
                    ? 'Submitting Order...'
                    : paymentOption === 'crypto'
                    ? 'Pay with BTC / USDT'
                    : paymentOption === 'finance4'
                    ? 'Place Order with Finance in 4'
                    : 'Place Order & Request Official Invoice'}
                </span>
              </button>
              <p className="text-[10px] text-[#6B645E] leading-relaxed text-center">
                After paying by any method, confirm your order by sending the payment receipt or a screenshot of it to us on
                WhatsApp.
              </p>

              {/* Secondary Order Action: Confirm Order via WhatsApp */}
              <a
                href={`https://wa.me/61480804189?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppOrderClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#188741] hover:bg-[#147136] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
                id="cart-whatsapp-order-btn"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm Order via WhatsApp</span>
              </a>

              {/* Direct Yatala Inquiry */}
              <a
                href={`tel:${CONTACT.phone}`}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-[#E7E5E4] text-[#121417] bg-white text-xs font-semibold rounded-lg hover:bg-[#F7F6F2] transition-colors shadow-2xs surface-card"
                id="cart-call-depot-btn"
              >
                <span>Call Yatala Sales Desk: 0480 804 189</span>
              </a>

              <div className="flex items-center justify-center gap-1 text-[10px] text-[#6B645E] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A85640]" />
                <span>ASIC Registered • ABN 28 668 598 758 • Full ACL Warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
