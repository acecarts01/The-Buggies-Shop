'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Bitcoin, MessageSquare, ShieldAlert } from 'lucide-react';
import { CRYPTO, PRODUCTS, CATEGORIES, SITE, isBuggyItem } from '@/src/config/site';
import CryptoCheckout from './CryptoCheckout';

const money = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 });

// Only vehicles earn the settlement discount - accessories and freight are
// charged at full rate, which is what the FAQ and finance guide already promise.
const BUGGIES = PRODUCTS.filter((p) => isBuggyItem(p.category, p.id, p.name));

/**
 * /crypto-payment/. Payment happens on this site: the buyer works out the
 * discounted AUD figure, gets the settlement address and QR here (or from the
 * cart's Pay button), sends from whichever wallet or exchange they already
 * use, and confirms with a receipt on WhatsApp. This page used to send
 * buyers off to third-party exchanges; it no longer links to any.
 */
export default function CryptoPortal() {
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<string>('');

  const vehiclePrice = useMemo(() => {
    if (selectedSlug) {
      const match = BUGGIES.find((p) => p.slug === selectedSlug);
      if (match) return match.price_aud;
    }
    const parsed = parseFloat(manualAmount.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [selectedSlug, manualAmount]);

  const selected = BUGGIES.find((p) => p.slug === selectedSlug);
  const selectedUrl = selected
    ? `/shop/${CATEGORIES.find((c) => c.rawCategory === selected.category)?.slug ?? 'fleet'}/${selected.slug}/`
    : '/shop/';

  const discount = vehiclePrice * (CRYPTO.discountPercent / 100);
  const payable = Math.round((vehiclePrice - discount) * 100) / 100;

  const steps = [
    {
      icon: ShoppingCart,
      title: 'Add the buggy to your cart and choose Crypto',
      body: `The ${CRYPTO.discountPercent}% discount comes off the vehicle price automatically. Accessories and freight stay at full rate.`,
    },
    {
      icon: Bitcoin,
      title: 'Tap "Pay with BTC / USDT"',
      body: 'The cart shows our Bitcoin, USDT (TRC-20) or USDT (ERC-20) address with a QR code and your order reference. Send from any wallet or exchange you already use.',
    },
    {
      icon: MessageSquare,
      title: 'Confirm on WhatsApp with your receipt',
      body: 'Send a screenshot of the receipt or the transaction ID. We match it on-chain, issue the tax invoice and quote freight to your postcode.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ---------------- How it works ---------------- */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl p-5 sm:p-7 shadow-sm surface-card">
        <h2 className="text-lg sm:text-xl font-bold text-[#121417] mb-4">How paying in crypto works here</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-[#E7E5E4] bg-[#F7F6F2] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#121417] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <s.icon className="w-4 h-4 text-[#A85640]" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-[#121417] leading-snug">{s.title}</h3>
              <p className="text-xs text-[#6B645E] leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-[#6B645E] leading-relaxed">
          Nothing leaves this website and no third party is involved: you pay directly to {SITE.name}&rsquo;s own
          settlement address. We never quote a live exchange rate; the invoice is the AUD figure, and the coin amount is
          whatever your wallet shows for it at the moment you send.
        </p>
      </section>

      {/* ---------------- Work out the figure ---------------- */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl p-5 sm:p-7 shadow-sm surface-card">
        <h2 className="text-lg sm:text-xl font-bold text-[#121417] mb-4">Work out your discounted figure</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="buggy-select" className="block text-xs font-bold text-[#6B645E] mb-1.5">
              Pick your buggy
            </label>
            <select
              id="buggy-select"
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                if (e.target.value) setManualAmount('');
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E7E5E4] bg-[#F7F6F2] text-sm text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#B45A40]"
            >
              <option value="">Select a model…</option>
              {BUGGIES.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — {p.price_display}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="manual-amount" className="block text-xs font-bold text-[#6B645E] mb-1.5">
              Or enter a quoted vehicle price (AUD)
            </label>
            <input
              id="manual-amount"
              inputMode="decimal"
              placeholder="e.g. 20900"
              value={manualAmount}
              onChange={(e) => {
                setManualAmount(e.target.value);
                if (e.target.value) setSelectedSlug('');
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E7E5E4] bg-[#F7F6F2] text-sm text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#B45A40]"
            />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#E7E5E4] bg-[#F7F6F2] p-4 sm:p-5">
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#6B645E]">Vehicle price (incl. GST)</dt>
              <dd className="font-bold text-[#121417] tabular-nums">{vehiclePrice > 0 ? money(vehiclePrice) : '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#487053]">Crypto settlement discount ({CRYPTO.discountPercent}%)</dt>
              <dd className="font-bold text-[#487053] tabular-nums">{vehiclePrice > 0 ? `− ${money(discount)}` : '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2.5 border-t border-[#E7E5E4]">
              <dt className="font-bold text-[#121417]">You pay in crypto</dt>
              <dd className="text-xl font-extrabold text-[#121417] tabular-nums">{vehiclePrice > 0 ? money(payable) : '—'}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-[#6B645E] leading-relaxed">
            Freight and any accessories are quoted separately and are charged at full rate — the {CRYPTO.discountPercent}%
            applies to the vehicle price only.
          </p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link
            href={selectedUrl}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#B45A40] hover:bg-[#9A4C36] text-white text-xs font-bold transition-colors"
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            {selected ? `Go to the ${selected.name} page` : 'Choose a buggy to pay for'}
          </Link>
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E7E5E4] bg-white text-xs font-semibold text-[#121417] hover:bg-[#F7F6F2] transition-colors"
          >
            Ask the sales desk first
          </Link>
        </div>
      </section>

      {/* ---------------- The addresses ---------------- */}
      <section aria-label="Settlement addresses">
        <h2 className="text-lg sm:text-xl font-bold text-[#121417] mb-1">Our settlement addresses</h2>
        <p className="text-xs text-[#6B645E] mb-4 leading-relaxed">
          These are the only three addresses {SITE.name} settles to. They are the same ones shown at checkout. If you have
          already agreed a figure with the sales desk, you can pay from here and confirm on WhatsApp.
        </p>
        <CryptoCheckout amountAud={payable > 0 ? payable : 0} />
      </section>

      <p className="flex items-start gap-2 text-[11px] text-[#6B645E] leading-relaxed">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-px text-[#A85640]" aria-hidden="true" />
        <span>
          Crypto prices move and transfers are irreversible. {SITE.name} is not a financial adviser and does not recommend
          any exchange or wallet; use whichever you already hold funds with. Every price on this site includes 10% GST.
        </span>
      </p>
    </div>
  );
}
