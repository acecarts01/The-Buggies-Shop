'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Copy, Check, MessageSquare, Mail, ShieldCheck } from 'lucide-react';
import { type Order, aud, stateFromPostcode } from '@/lib/orders-shared';
import { ABN_INFO, CONTACT } from '@/src/config/site';
import { BRAND_ASSETS } from '@/src/config/brand-assets';

function CopyField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setOk(true);
      setTimeout(() => setOk(false), 1800);
    } catch {
      /* value is selectable */
    }
  };
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-[#A9B4C6] mb-1">{label}</div>
      <div className="flex items-stretch gap-2">
        <code className={`flex-1 min-w-0 break-all px-3 py-2.5 rounded-lg bg-[#071527] border border-[#B8973F] text-white text-sm ${mono ? 'font-mono' : ''} select-all`}>{value}</code>
        <button type="button" onClick={copy} aria-label={`Copy ${label}`} className="shrink-0 px-3 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] transition-colors">
          {ok ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

export default function PayInvoice({ order }: { order: Order | null }) {
  const [qr, setQr] = useState('');
  const inv = order?.invoice;

  useEffect(() => {
    if (!order || inv?.method !== 'crypto' || !inv.crypto) return;
    const payload = inv.crypto.asset === 'BTC' ? `bitcoin:${inv.crypto.address}?label=${encodeURIComponent(`The Buggies Express ${order.ref}`)}` : inv.crypto.address;
    QRCode.toDataURL(payload, { margin: 1, width: 200, color: { dark: '#071527', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [order, inv]);

  const mark = BRAND_ASSETS.mark ?? BRAND_ASSETS.logo;

  if (!order || !inv) {
    return (
      <main id="main" className="min-h-screen bg-[#071527] text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-3">
          {mark && <Image src={mark.path} alt="" width={Math.round((mark.width / mark.height) * 56)} height={56} className="h-14 w-auto mx-auto" />}
          <h1 className="text-xl font-serif font-bold">This invoice link isn&rsquo;t valid</h1>
          <p className="text-sm text-[#A9B4C6]">Open the link from your invoice email, or message the sales desk on WhatsApp {CONTACT.phoneDisplay} and we&rsquo;ll resend it.</p>
        </div>
      </main>
    );
  }

  const c = order.customer;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const grand = order.totals.total;
  const wa = `https://wa.me/${CONTACT.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(`Payment receipt for invoice ${order.ref} — receipt/screenshot attached below.`)}`;

  return (
    <main id="main" className="min-h-screen bg-[#071527] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-5">
        {/* Header */}
        <header className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          {mark && <Image src={mark.path} alt="The Buggies Express" width={Math.round((mark.width / mark.height) * 64)} height={64} className="h-16 w-auto mx-auto" priority />}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8973F] text-[#071527] text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#071527] animate-pulse" aria-hidden="true" /> Tax invoice · payment due
          </span>
          <h1 className="text-xl sm:text-3xl font-serif font-bold break-words">Invoice {order.ref}</h1>
          <p className="text-sm text-[#A9B4C6]">Hi {c.name.split(' ')[0]} — your unit is reserved at Yatala. Settle below and we book dispatch.</p>
        </header>

        {/* Details + items */}
        <section className="bg-white text-[#1A1F2B] rounded-2xl p-6 sm:p-8 space-y-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#6B7280]">Invoice to</dt><dd className="font-semibold">{c.name}<br /><span className="font-normal">{c.email}</span></dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#6B7280]">Deliver to</dt><dd>{c.postcode ? `Postcode ${c.postcode}${state ? ` (${state})` : ''}` : 'To be confirmed'}</dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#6B7280]">Supplier</dt><dd>{ABN_INFO.companyName}<br />ABN {ABN_INFO.abn} · Yatala QLD 4207</dd></div>
            <div><dt className="text-[10px] uppercase tracking-[0.14em] text-[#6B7280]">Issued</dt><dd>{new Date(inv.issuedAt).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'long' })}</dd></div>
          </dl>
          <div className="border-t border-[#E3E6EC]">
            {order.lines.map((l) => (
              <div key={l.id} className="py-3 border-b border-[#E3E6EC] flex justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{l.name}</div>
                  <div className="text-xs text-[#6B7280] leading-relaxed">{l.keySpecs}</div>
                  <div className="text-xs text-[#6B7280]">Qty {l.quantity} × {aud(l.unitPrice)}</div>
                </div>
                <div className="font-bold whitespace-nowrap shrink-0 text-right">{aud(l.lineTotal)}</div>
              </div>
            ))}
          </div>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{aud(order.totals.subtotal)}</dd></div>
            {order.totals.accessoryDiscount > 0 && <div className="flex justify-between text-[#1E7A46]"><dt>Accessory bundle discount (5%)</dt><dd>−{aud(order.totals.accessoryDiscount)}</dd></div>}
            {order.totals.cryptoDiscount > 0 && <div className="flex justify-between text-[#1E7A46]"><dt>Crypto settlement incentive (10%)</dt><dd>−{aud(order.totals.cryptoDiscount)}</dd></div>}
            <div className="flex justify-between text-[#6B7280]"><dt>Includes GST (10%)</dt><dd>{aud(order.totals.gst)}</dd></div>
            <div className="flex justify-between text-[#6B7280]"><dt>Freight</dt><dd>Confirmed once payment is received</dd></div>
            <div className="flex justify-between text-lg font-bold text-[#0B1F3A] pt-2 border-t border-[#0B1F3A]"><dt>Amount payable</dt><dd>{aud(grand)}</dd></div>
          </dl>
        </section>

        {/* Settlement box */}
        <section className="bg-[#12294A] border border-[#B8973F] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Payment settlement</div>
          {inv.method === 'bank' && inv.bank && (
            <div className="space-y-3">
              <h2 className="text-lg font-serif font-bold">Bank transfer · PayID / EFT</h2>
              <CopyField label="Account name" value={inv.bank.accountName} mono={false} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CopyField label="BSB" value={inv.bank.bsb} />
                <CopyField label="Account number" value={inv.bank.accountNumber} />
              </div>
              {inv.bank.payId && <CopyField label="PayID" value={inv.bank.payId} mono={false} />}
              <CopyField label="Payment reference (required)" value={order.ref} />
              <CopyField label="Amount" value={String(grand)} />
            </div>
          )}
          {inv.method === 'crypto' && inv.crypto && (
            <div className="space-y-3">
              <h2 className="text-lg font-serif font-bold">{inv.crypto.asset} · {inv.crypto.network}</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`QR code for the ${inv.crypto.asset} address`} width={160} height={160} className="rounded-lg border border-white/15 bg-white shrink-0" />
                ) : (
                  <div className="w-40 h-40 rounded-lg border border-white/15" aria-hidden="true" />
                )}
                <div className="flex-1 min-w-0 space-y-3">
                  <CopyField label={`${inv.crypto.asset} address`} value={inv.crypto.address} />
                  <p className="text-xs text-[#A9B4C6] leading-relaxed">Send the {inv.crypto.asset} equivalent of <strong className="text-white">{aud(order.totals.total)}</strong> at the rate your wallet shows when you send. Check the network first — a transfer on the wrong network cannot be recovered. Only ever use an address shown on this site.</p>
                </div>
              </div>
            </div>
          )}
          {inv.method === 'finance4' && inv.finance4 && (
            <div className="space-y-3">
              <h2 className="text-lg font-serif font-bold">Finance in 4</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">{inv.finance4.instructions}</p>
              {inv.finance4.link && (
                <a href={inv.finance4.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full py-3 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] font-bold text-sm transition-colors">Open your Finance in 4 plan</a>
              )}
            </div>
          )}
          {inv.notes && <p className="text-xs text-[#E7ECF3] border-t border-white/15 pt-3 leading-relaxed">{inv.notes}</p>}
          <div className="pt-2 space-y-2">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#188741] hover:bg-[#1E9A4F] text-white font-bold text-sm transition-colors">
              <MessageSquare className="w-4 h-4" aria-hidden="true" /> Send payment receipt on WhatsApp
            </a>
            <p className="text-[11px] text-[#A9B4C6] text-center">Once paid, send the receipt or a screenshot and we confirm your order. Questions: <a href="mailto:sales&#64;golfbuggiesexpress.com.au" className="text-[#D9C27A] hover:underline inline-flex items-center gap-1"><Mail className="w-3 h-3" aria-hidden="true" />sales&#64;golfbuggiesexpress.com.au</a></p>
          </div>
        </section>

        <footer className="text-center text-[11px] text-[#A9B4C6] space-y-1">
          <p className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#B8973F]" aria-hidden="true" /> {ABN_INFO.companyName} · ABN {ABN_INFO.abn} · registered with ASIC · Yatala QLD 4207</p>
          <p>All prices include 10% GST. <Link href="/delivery/" className="underline hover:text-[#D9C27A]">Delivery</Link> · <Link href="/faq/" className="underline hover:text-[#D9C27A]">FAQ</Link></p>
        </footer>
      </div>
    </main>
  );
}
