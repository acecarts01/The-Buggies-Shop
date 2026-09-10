'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Copy,
  Info,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { CRYPTO, PRODUCTS, SITE, isBuggyItem } from '@/src/config/site';

const money = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 });

// Only vehicles earn the settlement discount - accessories and freight are
// charged at full rate, which is what the FAQ and finance guide already promise.
const BUGGIES = PRODUCTS.filter((p) => isBuggyItem(p.category, p.id, p.name));

const FUNDED_WALLETS = CRYPTO.wallets.filter((w) => w.address.trim().length > 0);

type Delivery = 'own' | 'direct';

export default function CryptoPortal() {
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<string>('');
  const [delivery, setDelivery] = useState<Delivery>('own');
  const [copied, setCopied] = useState<string | null>(null);

  const vehiclePrice = useMemo(() => {
    if (selectedSlug) {
      const match = BUGGIES.find((p) => p.slug === selectedSlug);
      if (match) return match.price_aud;
    }
    const parsed = parseFloat(manualAmount.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [selectedSlug, manualAmount]);

  const discount = vehiclePrice * (CRYPTO.discountPercent / 100);
  const payable = vehiclePrice - discount;

  const copyAddress = async (key: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* ---------------- Step 1: what are you settling? ---------------- */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl p-5 sm:p-7 shadow-sm surface-card">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="w-7 h-7 rounded-full bg-[#121417] text-white text-xs font-bold flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#121417]">
            Tell us what you are settling
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="buggy-select"
              className="block text-xs font-bold text-[#6B645E] mb-1.5"
            >
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
            <label
              htmlFor="manual-amount"
              className="block text-xs font-bold text-[#6B645E] mb-1.5"
            >
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

        {/* Live discount maths */}
        <div className="mt-5 rounded-xl border border-[#E7E5E4] bg-[#F7F6F2] p-4 sm:p-5">
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#6B645E]">Vehicle price (incl. GST)</dt>
              <dd className="font-bold text-[#121417] tabular-nums">
                {vehiclePrice > 0 ? money(vehiclePrice) : '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#487053]">
                Crypto settlement discount ({CRYPTO.discountPercent}%)
              </dt>
              <dd className="font-bold text-[#487053] tabular-nums">
                {vehiclePrice > 0 ? `− ${money(discount)}` : '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2.5 border-t border-[#E7E5E4]">
              <dt className="font-bold text-[#121417]">Crypto you need to buy</dt>
              <dd className="text-xl font-extrabold text-[#121417] tabular-nums">
                {vehiclePrice > 0 ? money(payable) : '—'}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-[#6B645E] leading-relaxed">
            Freight and any accessories are quoted separately and are charged at full
            rate — the {CRYPTO.discountPercent}% applies to the vehicle price only.
            Buy the AUD figure above in BTC or USDT; exchange and network fees sit on
            top of it.
          </p>
        </div>
      </section>

      {/* ---------------- Step 2: buy the crypto ---------------- */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl p-5 sm:p-7 shadow-sm surface-card">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="w-7 h-7 rounded-full bg-[#121417] text-white text-xs font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#121417]">
            Buy {vehiclePrice > 0 ? money(payable) : 'your amount'} of BTC or USDT
          </h2>
        </div>
        <p className="text-sm text-[#6B645E] mb-5 sm:ml-10">
          Any of these will sell you crypto with a bank card or bank transfer. They are
          independent businesses — open an account, buy the amount above, then come back
          for step 3.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 sm:ml-10">
          {CRYPTO.portals.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group block rounded-xl border border-[#E7E5E4] bg-[#F7F6F2] p-4 hover:border-[#B45A40] hover:bg-[#F7EFEA] transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-bold text-[#121417] text-sm">{portal.name}</span>
                <ArrowUpRight className="w-4 h-4 text-[#6B645E] group-hover:text-[#A85640] shrink-0" />
              </div>
              <div className="text-[11px] font-bold text-[#487053] mb-1">
                {portal.basedIn}
              </div>
              <div className="text-xs text-[#6B645E] leading-relaxed mb-1.5">
                {portal.rails}
              </div>
              <div className="text-xs text-[#78716C] leading-relaxed">{portal.note}</div>
            </a>
          ))}
        </div>

        <p className="mt-4 sm:ml-10 text-xs text-[#78716C] leading-relaxed">
          {SITE.name} is not affiliated with any of these exchanges, receives no
          commission from them, and does not control their fees, limits or identity
          checks. Compare their rates yourself before buying.
        </p>
      </section>

      {/* ---------------- Step 3: where the coins land ---------------- */}
      <section className="bg-white border border-[#E7E5E4] rounded-2xl p-5 sm:p-7 shadow-sm surface-card">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="w-7 h-7 rounded-full bg-[#121417] text-white text-xs font-bold flex items-center justify-center shrink-0">
            3
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#121417]">
            Choose where the coins land
          </h2>
        </div>
        <p className="text-sm text-[#6B645E] mb-5 sm:ml-10">
          You decide whether the exchange pays us directly, or pays you first so the
          funds stay under your control until you are ready.
        </p>

        <div className="grid gap-3 sm:ml-10" role="radiogroup" aria-label="Delivery method">
          {/* Buyer's own wallet */}
          <button
            type="button"
            role="radio"
            aria-checked={delivery === 'own'}
            onClick={() => setDelivery('own')}
            className={`text-left rounded-xl border p-4 transition-all ${
              delivery === 'own'
                ? 'border-[#B45A40] bg-[#F7EFEA] ring-1 ring-[#B45A40]'
                : 'border-[#E7E5E4] bg-[#F7F6F2] hover:border-[#C86D51]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-[#A85640] shrink-0" />
              <span className="font-bold text-[#121417] text-sm">
                Into your own wallet first
              </span>
              <span className="text-[10px] font-bold text-white bg-[#567F60] px-1.5 py-0.5 rounded">
                RECOMMENDED
              </span>
            </div>
            <p className="text-xs text-[#6B645E] leading-relaxed">
              The exchange sends the crypto to a wallet you control. You confirm the
              order with our sales desk, then release the payment yourself. Your money
              stays yours until you choose to send it.
            </p>
          </button>

          {/* Straight to seller */}
          <button
            type="button"
            role="radio"
            aria-checked={delivery === 'direct'}
            onClick={() => setDelivery('direct')}
            className={`text-left rounded-xl border p-4 transition-all ${
              delivery === 'direct'
                ? 'border-[#B45A40] bg-[#F7EFEA] ring-1 ring-[#B45A40]'
                : 'border-[#E7E5E4] bg-[#F7F6F2] hover:border-[#C86D51]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="w-4 h-4 text-[#A85640] shrink-0" />
              <span className="font-bold text-[#121417] text-sm">
                Straight to our settlement wallet
              </span>
            </div>
            <p className="text-xs text-[#6B645E] leading-relaxed">
              One step instead of two: the exchange delivers to our address at the point
              of purchase. Faster, but the payment is final the moment it settles, and
              some exchanges restrict withdrawals to third-party addresses.
            </p>
          </button>
        </div>

        {/* Addresses, or an honest explanation of why they are absent */}
        <div className="mt-5 sm:ml-10">
          {FUNDED_WALLETS.length > 0 ? (
            <>
              <div className="rounded-xl border border-[#C86D51]/30 bg-[#F7EFEA] p-4 mb-4">
                <div className="flex gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#A85640] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#121417] leading-relaxed">
                    <strong>Check the address and the network before you send.</strong>{' '}
                    A transfer on the wrong network, or to a mistyped address, cannot be
                    reversed or recovered by anyone. Send a small test amount first if
                    this is your first transfer to us, and confirm the address with our
                    sales desk on {SITE.name}&apos;s published phone number — never from
                    an address someone emails or messages you.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {CRYPTO.wallets
                  .filter((w) => w.address.trim().length > 0)
                  .map((w) => (
                    <div
                      key={w.key}
                      className="rounded-xl border border-[#E7E5E4] bg-[#F7F6F2] p-4"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                          <span className="font-bold text-[#121417] text-sm">
                            {w.assetName} ({w.asset})
                          </span>
                          <span className="block text-[11px] font-bold text-[#A85640]">
                            {w.network}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyAddress(w.key, w.address)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121417] text-white text-xs font-bold hover:bg-[#2B2F34] transition-all shrink-0"
                        >
                          {copied === w.key ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <code className="block text-xs text-[#121417] break-all bg-white border border-[#E7E5E4] rounded-lg px-3 py-2 font-mono">
                        {w.address}
                      </code>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#C86D51]/30 bg-[#F7EFEA] p-4">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-[#A85640] shrink-0 mt-0.5" />
                <p className="text-xs text-[#121417] leading-relaxed">
                  <strong>Settlement addresses are issued per order.</strong> We do not
                  publish a standing wallet address on the site — it is the single
                  easiest thing for a scammer to swap out. Confirm your order with our
                  sales desk and we will give you the address for that order, which you
                  should read back to us before sending anything.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 sm:ml-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#B45A40] hover:bg-[#A85640] text-white font-bold text-xs rounded-lg transition-all shadow-xs"
          >
            Confirm this order with our sales desk
          </Link>
          <Link
            href="/faq/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F7F6F2] hover:bg-[#F7EFEA] text-[#121417] border border-[#E7E5E4] font-bold text-xs rounded-lg transition-all"
          >
            Read the payment FAQ
          </Link>
        </div>
      </section>

      {/* ---------------- Plain-language footnote ---------------- */}
      <p className="text-xs text-[#78716C] leading-relaxed">
        This page is a convenience for buyers who already want to pay in crypto. It is
        not financial advice and not a recommendation to buy or hold cryptocurrency.
        Crypto prices move, transfers are irreversible, and the exchanges listed above
        set their own fees, limits and identity requirements. If you are not comfortable
        with any of that, our PayID, bank transfer, card and Finance in 4 options are
        unchanged and carry no {CRYPTO.discountPercent}% reduction.
      </p>
    </div>
  );
}
