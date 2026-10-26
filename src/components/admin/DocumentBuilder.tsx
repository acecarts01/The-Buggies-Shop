'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Landmark, Bitcoin, CreditCard, Send, Plus, Trash2, CheckCircle2, AlertTriangle, FileText, Receipt, Truck, BadgePercent, Copy } from 'lucide-react';
import { type InvoiceDetails, type PaymentChannel, paymentLabel } from '@/lib/orders-shared';
import { CRYPTO, PRODUCTS, CATEGORIES, SHOP, isBuggyItem } from '@/src/config/site';
import { DEFAULT_AFTER_PAYMENT } from '@/lib/document-defaults';
import { PAY_IN_4, fmtAud, isPayIn4Eligible, orderPlan, planLines } from '@/lib/pay-in-4';

type Method = InvoiceDetails['method'];
type Kind = 'quote' | 'invoice';

export interface BuilderPrefill {
  client: { name: string; email: string; phone: string; postcode: string };
  productSlug?: string;
  source: string;
  paymentPreference?: PaymentChannel;
}

interface Props {
  bankDefaults: { accountName: string; bsb: string; accountNumber: string; payId: string };
  prefill?: BuilderPrefill;
  initialKind: Kind;
}

interface Line {
  key: number;
  slug: string;
  name: string;
  description: string;
  qty: string;
  price: string;
}

const METHODS: { key: Method; label: string; icon: React.ElementType; hint: string }[] = [
  { key: 'bank', label: 'Bank / PayID', icon: Landmark, hint: 'BSB, account, reference' },
  { key: 'crypto', label: 'Crypto', icon: Bitcoin, hint: 'All coins, QR code' },
  { key: 'finance4', label: 'Finance in 4', icon: CreditCard, hint: 'Plan instructions' },
];

const input =
  'w-full px-3 py-2.5 rounded-lg bg-[#071527] border border-white/15 text-white text-sm placeholder-[#5C6B85] focus:outline-none focus:border-[#B8973F] transition-colors';
const label = 'block text-[11px] uppercase tracking-[0.15em] text-[#D9C27A] font-bold mb-1.5';
const card = 'bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 space-y-4';
const cardTitle = 'text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold';

const num = (v: string) => {
  const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const money = (n: number) => `$${n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DocumentBuilder({ bankDefaults, prefill, initialKind }: Props) {
  const nextKey = useRef(1);
  const mkLine = (over: Partial<Line> = {}): Line => ({ key: nextKey.current++, slug: '', name: '', description: '', qty: '1', price: '', ...over });

  const [kind, setKind] = useState<Kind>(initialKind);
  const [client, setClient] = useState({ name: prefill?.client.name ?? '', company: '', email: prefill?.client.email ?? '', phone: prefill?.client.phone ?? '', address: '', postcode: prefill?.client.postcode ?? '' });
  const [lines, setLines] = useState<Line[]>(() => {
    const p = prefill?.productSlug ? PRODUCTS.find((x) => x.slug === prefill.productSlug) : undefined;
    return [p ? { key: nextKey.current++, slug: p.slug, name: p.name, description: '', qty: '1', price: String(p.price_aud) } : { key: nextKey.current++, slug: '', name: '', description: '', qty: '1', price: '' }];
  });
  const [includePayment, setIncludePayment] = useState(initialKind === 'invoice');
  const [method, setMethod] = useState<Method>(prefill?.paymentPreference === 'crypto' ? 'crypto' : prefill?.paymentPreference === 'finance4' ? 'finance4' : 'bank');
  const [bank, setBank] = useState(bankDefaults);
  const [walletKey, setWalletKey] = useState(CRYPTO.wallets[0].key);
  const [finance, setFinance] = useState({ instructions: '', link: '' });
  const [financeFreq, setFinanceFreq] = useState<'fortnightly' | 'monthly'>('fortnightly');
  const [afterPayment, setAfterPayment] = useState(DEFAULT_AFTER_PAYMENT);
  const [message, setMessage] = useState('');
  const [validDays, setValidDays] = useState('14');
  const [subject, setSubject] = useState('');
  const [qr, setQr] = useState('');
  const [preview, setPreview] = useState('');
  const [incomplete, setIncomplete] = useState('');
  const [approved, setApproved] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ sent: boolean; error?: string; outboxFile?: string; ref: string; to: string; kind: Kind; payUrl?: string; adminUrl?: string; whatsappUrl?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const wallet = useMemo(() => CRYPTO.wallets.find((w) => w.key === walletKey) ?? CRYPTO.wallets[0], [walletKey]);
  const total = Math.max(0, lines.reduce((t, l) => t + num(l.qty) * num(l.price), 0));
  const gst = total / 11;
  const paymentOn = kind === 'invoice' || includePayment;
  const financeBlocked = paymentOn && method === 'finance4' && total > 0 && !isPayIn4Eligible(total);

  const productGroups = useMemo(() => {
    const groups = new Map<string, typeof PRODUCTS>();
    for (const p of PRODUCTS) groups.set(p.category, [...(groups.get(p.category) ?? []), p]);
    return [...groups.entries()];
  }, []);

  const payment = useMemo<Partial<InvoiceDetails> | undefined>(() => {
    if (!paymentOn) return undefined;
    return {
      method,
      bank: method === 'bank' ? bank : undefined,
      crypto: method === 'crypto' ? { walletKey: wallet.key, asset: wallet.asset, network: wallet.network, address: wallet.address } : undefined,
      finance4: method === 'finance4' ? finance : undefined,
    };
  }, [paymentOn, method, bank, wallet, finance]);

  const payload = () => ({
    kind,
    client,
    lines: lines.map((l) => ({ slug: l.slug || undefined, name: l.name, description: l.description, quantity: num(l.qty), unitPrice: l.price === '' ? NaN : num(l.price) })),
    payment,
    financeFrequency: financeFreq,
    afterPayment,
    message,
    validDays: num(validDays),
    subject: subject || undefined,
  });

  useEffect(() => {
    if (!paymentOn || method !== 'crypto') return;
    const data = wallet.asset === 'BTC' ? `bitcoin:${wallet.address}?label=${encodeURIComponent('The Buggies Express')}` : wallet.address;
    QRCode.toDataURL(data, { margin: 1, width: 160, color: { dark: '#071527', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [paymentOn, method, wallet]);

  // Live preview: the exact HTML the client receives, debounced.
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/documents/?preview=1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()) });
        const data = await res.json();
        if (data.html) setPreview(data.html);
        setIncomplete(data.incomplete || (data.success === false ? data.message : '') || '');
      } catch {
        /* keep the last preview */
      }
    }, 400);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, client, lines, payment, financeFreq, afterPayment, message, validDays, subject]);

  const touch = () => setApproved(false);
  const setLine = (key: number, patch: Partial<Line>) => {
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
    touch();
  };
  const pickProduct = (key: number, slug: string) => {
    const p = PRODUCTS.find((x) => x.slug === slug);
    setLine(key, p ? { slug: p.slug, name: p.name, price: String(p.price_aud), description: '' } : { slug: '' });
  };
  const addLine = (over: Partial<Line> = {}) => {
    setLines((ls) => [...ls, mkLine(over)]);
    touch();
  };
  const removeLine = (key: number) => {
    setLines((ls) => (ls.length > 1 ? ls.filter((l) => l.key !== key) : ls));
    touch();
  };
  const vehicleTotal = lines.reduce((t, l) => {
    const p = l.slug ? PRODUCTS.find((x) => x.slug === l.slug) : undefined;
    return p && isBuggyItem(p.category, p.id, p.name) ? t + num(l.qty) * num(l.price) : t;
  }, 0);
  const applyCryptoDiscount = () => {
    const off = Math.round(vehicleTotal * (SHOP.cryptoDiscount / 100) * 100) / 100;
    if (off <= 0) return;
    setLines((ls) => [...ls.filter((l) => !l.name.startsWith('Crypto settlement discount')), mkLine({ name: `Crypto settlement discount (${SHOP.cryptoDiscount}% off the vehicle price)`, price: String(-off) })]);
    touch();
  };
  const fillFinance = () => {
    const plan = orderPlan({
      payment: 'finance4',
      totals: { subtotal: total, accessoryDiscount: 0, cryptoDiscount: 0, total, gst: 0, financeFrequency: financeFreq },
      createdAt: new Date().toISOString(),
    });
    if (plan) setFinance((f) => ({ ...f, instructions: planLines(plan).join('\n') }));
    touch();
  };

  const canSend = !sending && approved && client.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(client.email.trim()) && total > 0 && !incomplete;

  const dispatch = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/admin/documents/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Send failed');
      setSent(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const reset = () => {
    setSent(null);
    setApproved(false);
    setClient({ name: '', company: '', email: '', phone: '', address: '', postcode: '' });
    setLines([mkLine()]);
    setMessage('');
    setSubject('');
    setAfterPayment(DEFAULT_AFTER_PAYMENT);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* ------------------------------------------------ Left: the form */}
      <div className="xl:col-span-2 space-y-5">
        {prefill && (
          <section className="bg-[#1E2A12] border border-[#B8973F]/40 rounded-2xl p-4 text-xs text-[#E8D48F]">
            Pre-filled from <strong>{prefill.source}</strong>. Check the client details and the items before you send.
          </section>
        )}

        {/* Quote or invoice */}
        <section className={card}>
          <h2 className={cardTitle}>Document type</h2>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Document type">
            {([
              { key: 'quote', label: 'Quote', icon: FileText, hint: 'Valid for a set time' },
              { key: 'invoice', label: 'Tax invoice', icon: Receipt, hint: 'Payment due, hosted pay page' },
            ] as const).map((k) => {
              const active = kind === k.key;
              return (
                <button
                  key={k.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setKind(k.key);
                    if (k.key === 'invoice') setIncludePayment(true);
                    touch();
                  }}
                  className={`rounded-lg border p-3 text-left transition-all hover:-translate-y-px ${active ? 'border-[#B8973F] bg-[#12294A] shadow-[0_0_0_3px_rgba(184,151,63,0.18)]' : 'border-white/15 hover:border-white/40'}`}
                >
                  <k.icon className={`w-4 h-4 mb-1 ${active ? 'text-[#D9C27A]' : 'text-[#A9B4C6]'}`} aria-hidden="true" />
                  <div className="text-sm font-bold leading-tight">{k.label}</div>
                  <div className="text-[10px] text-[#A9B4C6] leading-tight">{k.hint}</div>
                </button>
              );
            })}
          </div>
          {kind === 'quote' && (
            <div>
              <label className={label} htmlFor="valid-days">Valid for (days)</label>
              <input id="valid-days" className={input} inputMode="numeric" value={validDays} onChange={(e) => { setValidDays(e.target.value.replace(/[^\d]/g, '')); touch(); }} />
            </div>
          )}
        </section>

        {/* Client */}
        <section className={card}>
          <h2 className={cardTitle}>Client details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="c-name">Full name</label>
              <input id="c-name" className={input} value={client.name} onChange={(e) => { setClient({ ...client, name: e.target.value }); touch(); }} autoComplete="off" />
            </div>
            <div>
              <label className={label} htmlFor="c-company">Company <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional)</span></label>
              <input id="c-company" className={input} value={client.company} onChange={(e) => { setClient({ ...client, company: e.target.value }); touch(); }} autoComplete="off" />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="c-email">Email</label>
              <input id="c-email" type="email" className={input} value={client.email} onChange={(e) => { setClient({ ...client, email: e.target.value }); touch(); }} autoComplete="off" />
            </div>
            <div>
              <label className={label} htmlFor="c-phone">Phone <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional)</span></label>
              <input id="c-phone" className={input} value={client.phone} onChange={(e) => { setClient({ ...client, phone: e.target.value }); touch(); }} autoComplete="off" />
            </div>
            <div>
              <label className={label} htmlFor="c-postcode">Delivery postcode</label>
              <input id="c-postcode" className={input} inputMode="numeric" maxLength={4} value={client.postcode} onChange={(e) => { setClient({ ...client, postcode: e.target.value.replace(/[^\d]/g, '') }); touch(); }} autoComplete="off" />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="c-address">Address <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional)</span></label>
              <input id="c-address" className={input} value={client.address} onChange={(e) => { setClient({ ...client, address: e.target.value }); touch(); }} autoComplete="off" />
            </div>
          </div>
        </section>

        {/* Items */}
        <section className={card}>
          <div className="flex items-center justify-between gap-3">
            <h2 className={cardTitle}>Items (prices include GST)</h2>
            <span className="text-xs font-bold text-[#E7ECF3]">Total {money(total)}</span>
          </div>
          <div className="space-y-3">
            {lines.map((l, i) => (
              <div key={l.key} className="rounded-xl border border-white/10 bg-[#071527]/60 p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#A9B4C6]">Line {i + 1}</span>
                  <button type="button" onClick={() => removeLine(l.key)} disabled={lines.length === 1} aria-label={`Remove line ${i + 1}`} className="text-[#A9B4C6] hover:text-[#F3C6B0] disabled:opacity-30">
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                <select aria-label={`Product for line ${i + 1}`} className={input} value={l.slug} onChange={(e) => pickProduct(l.key, e.target.value)}>
                  <option value="">Custom item</option>
                  {productGroups.map(([cat, items]) => (
                    <optgroup key={cat} label={CATEGORIES.find((c) => c.rawCategory === cat)?.name ?? cat}>
                      {items.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
                <input aria-label={`Description for line ${i + 1}`} className={input} placeholder="Item name" value={l.name} onChange={(e) => setLine(l.key, { name: e.target.value })} />
                <input aria-label={`Details for line ${i + 1}`} className={input} placeholder="Details shown under the name (optional)" value={l.description} onChange={(e) => setLine(l.key, { description: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A9B4C6] mb-1" htmlFor={`qty-${l.key}`}>Qty</label>
                    <input id={`qty-${l.key}`} className={input} inputMode="numeric" value={l.qty} onChange={(e) => setLine(l.key, { qty: e.target.value.replace(/[^\d]/g, '') })} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#A9B4C6] mb-1" htmlFor={`price-${l.key}`}>Unit price</label>
                    <input id={`price-${l.key}`} className={input} inputMode="decimal" value={l.price} onChange={(e) => setLine(l.key, { price: e.target.value.replace(/[^0-9.\-]/g, '') })} placeholder="0.00" />
                  </div>
                  <div>
                    <div className="block text-[10px] uppercase tracking-wider text-[#A9B4C6] mb-1">Line total</div>
                    <div className="py-2.5 text-sm font-bold text-[#E7ECF3]">{money(num(l.qty) * num(l.price))}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => addLine()} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-white/15 text-[#E7ECF3] hover:border-[#B8973F]">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add item
            </button>
            <button type="button" onClick={() => addLine({ name: `Freight${client.postcode ? ` to ${client.postcode}` : ''}` })} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-white/15 text-[#E7ECF3] hover:border-[#B8973F]">
              <Truck className="w-3.5 h-3.5" aria-hidden="true" /> Add freight
            </button>
            <button type="button" onClick={() => addLine({ name: 'Discount' })} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-white/15 text-[#E7ECF3] hover:border-[#B8973F]">
              <BadgePercent className="w-3.5 h-3.5" aria-hidden="true" /> Add discount
            </button>
          </div>
          <p className="text-[11px] text-[#A9B4C6]">Enter a negative price for a discount. Includes GST {money(gst)}. If you add no freight line, the client is told freight is quoted against their postcode.</p>
        </section>

        {/* Payment */}
        <section className={card}>
          <div className="flex items-center justify-between">
            <h2 className={cardTitle}>Payment details</h2>
            {kind === 'quote' ? (
              <button type="button" onClick={() => { setIncludePayment((v) => !v); touch(); }} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${includePayment ? 'border-[#B8973F] bg-[#12294A] text-[#D9C27A]' : 'border-white/15 text-[#A9B4C6] hover:border-white/40'}`}>
                {includePayment ? 'Included' : 'Not included'}
              </button>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-[#D9C27A] font-bold">Required</span>
            )}
          </div>
          {paymentOn && (
            <>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
                {METHODS.map((m) => {
                  const active = m.key === method;
                  return (
                    <button key={m.key} type="button" role="radio" aria-checked={active} onClick={() => { setMethod(m.key); touch(); }} className={`rounded-lg border p-2.5 text-left transition-all hover:-translate-y-px ${active ? 'border-[#B8973F] bg-[#12294A] shadow-[0_0_0_3px_rgba(184,151,63,0.18)]' : 'border-white/15 hover:border-white/40'}`}>
                      <m.icon className={`w-4 h-4 mb-1 ${active ? 'text-[#D9C27A]' : 'text-[#A9B4C6]'}`} aria-hidden="true" />
                      <div className="text-xs font-bold leading-tight">{m.label}</div>
                      <div className="text-[10px] text-[#A9B4C6] leading-tight">{m.hint}</div>
                    </button>
                  );
                })}
              </div>

              {method === 'bank' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="acct-name">Account name</label>
                    <input id="acct-name" className={input} value={bank.accountName} onChange={(e) => { setBank({ ...bank, accountName: e.target.value }); touch(); }} placeholder="Golf Buggies Express Pty Ltd" />
                  </div>
                  <div>
                    <label className={label} htmlFor="bsb">BSB</label>
                    <input id="bsb" className={input} inputMode="numeric" value={bank.bsb} onChange={(e) => { setBank({ ...bank, bsb: e.target.value }); touch(); }} placeholder="000-000" />
                  </div>
                  <div>
                    <label className={label} htmlFor="acct-no">Account number</label>
                    <input id="acct-no" className={input} inputMode="numeric" value={bank.accountNumber} onChange={(e) => { setBank({ ...bank, accountNumber: e.target.value }); touch(); }} placeholder="12345678" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="payid">PayID <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional)</span></label>
                    <input id="payid" className={input} value={bank.payId} onChange={(e) => { setBank({ ...bank, payId: e.target.value }); touch(); }} placeholder="e.g. an email or ABN registered for PayID" />
                  </div>
                </div>
              )}

              {method === 'crypto' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Wallet">
                    {CRYPTO.wallets.map((w) => (
                      <button key={w.key} type="button" role="radio" aria-checked={w.key === walletKey} onClick={() => { setWalletKey(w.key); touch(); }} className={`rounded-lg border p-2 text-left transition-colors ${w.key === walletKey ? 'border-[#B8973F] bg-[#12294A]' : 'border-white/15 hover:border-white/40'}`}>
                        <div className="text-xs font-bold">{w.asset}</div>
                        <div className="text-[10px] text-[#A9B4C6]">{w.network}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 items-start">
                    {qr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qr} alt={`QR for ${wallet.asset} address`} width={112} height={112} className="rounded-lg border border-white/15 bg-white shrink-0" />
                    ) : (
                      <div className="w-28 h-28 rounded-lg border border-white/15" aria-hidden="true" />
                    )}
                    <code className="text-[11px] font-mono break-all text-[#E7ECF3] bg-[#071527] border border-white/15 rounded-lg p-2.5 flex-1">{wallet.address}</code>
                  </div>
                  <button type="button" onClick={applyCryptoDiscount} disabled={vehicleTotal <= 0} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-[#B8973F]/60 text-[#D9C27A] hover:bg-[#12294A] disabled:opacity-40">
                    <BadgePercent className="w-3.5 h-3.5" aria-hidden="true" /> Apply the {SHOP.cryptoDiscount}% crypto discount to the vehicle lines
                  </button>
                </div>
              )}

              {method === 'finance4' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Payment frequency">
                    {(['fortnightly', 'monthly'] as const).map((f) => (
                      <button key={f} type="button" aria-pressed={financeFreq === f} onClick={() => { setFinanceFreq(f); touch(); }} className={`rounded-lg border px-3 py-2 text-xs font-bold capitalize ${financeFreq === f ? 'border-[#B8973F] bg-[#12294A] text-[#D9C27A]' : 'border-white/15 text-[#A9B4C6] hover:border-white/40'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  {financeBlocked && <p className="text-[11px] text-[#F3C6B0]">Finance in 4 is for orders over {fmtAud(PAY_IN_4.min)} AUD. This total is {money(total)}.</p>}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={label} htmlFor="f4-instr">Instructions for the buyer</label>
                      <button type="button" onClick={fillFinance} disabled={total <= 0} className="text-[11px] font-bold text-[#D9C27A] underline disabled:opacity-40 mb-1.5">Fill from the plan</button>
                    </div>
                    <textarea id="f4-instr" className={`${input} min-h-[110px]`} value={finance.instructions} onChange={(e) => { setFinance({ ...finance, instructions: e.target.value }); touch(); }} placeholder="How the 4 interest-free payments are set up and what the buyer does next." />
                  </div>
                  <div>
                    <label className={label} htmlFor="f4-link">Plan link <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional, https)</span></label>
                    <input id="f4-link" className={input} value={finance.link} onChange={(e) => { setFinance({ ...finance, link: e.target.value }); touch(); }} placeholder="https://…" />
                  </div>
                </div>
              )}
              <div>
                <p className="text-[11px] text-[#A9B4C6]">The payment reference shown to the client is the document reference. {prefill?.paymentPreference ? `The client prefers ${paymentLabel(prefill.paymentPreference)}.` : ''}</p>
              </div>
            </>
          )}
        </section>

        {/* After payment + message */}
        <section className={card}>
          <h2 className={cardTitle}>What the client does next</h2>
          <div>
            <label className={label} htmlFor="after">{kind === 'invoice' ? 'Instructions to follow after payment' : 'Instructions to follow when they accept'} <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(one step per line; {'{ref}'} becomes the reference)</span></label>
            <textarea id="after" className={`${input} min-h-[150px] leading-relaxed`} value={afterPayment} onChange={(e) => { setAfterPayment(e.target.value); touch(); }} />
          </div>
          <div>
            <label className={label} htmlFor="msg">Personal note at the top <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional; blank line = new paragraph)</span></label>
            <textarea id="msg" className={`${input} min-h-[110px] leading-relaxed`} value={message} onChange={(e) => { setMessage(e.target.value); touch(); }} />
          </div>
          <div>
            <label className={label} htmlFor="subj">Subject <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(blank = automatic)</span></label>
            <input id="subj" className={input} value={subject} onChange={(e) => { setSubject(e.target.value); touch(); }} />
          </div>
        </section>

        {/* Approve and send */}
        <section className="bg-gradient-to-r from-[#12294A] to-[#0B1F3A] border border-[#B8973F]/50 rounded-2xl p-5 space-y-3">
          {incomplete && !sent && (
            <p className="flex items-start gap-2 text-[11px] text-[#D9C27A]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
              {incomplete}
            </p>
          )}
          {error && <p role="alert" className="text-xs text-[#F3C6B0] bg-[#3A1C14] border border-[#7A3A28] rounded-lg px-3 py-2">{error}</p>}
          {!sent ? (
            <>
              <label className="flex items-start gap-2 text-xs text-[#E7ECF3] cursor-pointer">
                <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="mt-0.5 accent-[#B8973F]" />
                <span>I have checked the client, the items, the total and the payment details in the preview. It is correct and ready to send.</span>
              </label>
              <button type="button" onClick={dispatch} disabled={!canSend} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] font-bold text-sm transition-all hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0">
                <Send className="w-4 h-4" aria-hidden="true" />
                {client.email ? `Approve and send ${kind === 'invoice' ? 'invoice' : 'quote'} to ${client.email}` : `Send ${kind === 'invoice' ? 'invoice' : 'quote'}`}
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="flex items-start gap-2 text-sm text-[#7FD09A]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                {sent.sent
                  ? `${sent.kind === 'invoice' ? 'Invoice' : 'Quote'} ${sent.ref} emailed to ${sent.to}. A copy went to the sales desk.`
                  : `${sent.kind === 'invoice' ? 'Invoice' : 'Quote'} ${sent.ref} rendered but not emailed: ${sent.error}. ${sent.outboxFile ? 'Written to the local outbox.' : ''}`}
              </p>
              <div className="flex flex-wrap gap-2">
                {sent.payUrl && (
                  <button type="button" onClick={() => copy(sent.payUrl!)} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-white/15 text-[#E7ECF3] hover:border-[#B8973F]">
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" /> {copied ? 'Copied' : 'Copy pay link'}
                  </button>
                )}
                {sent.whatsappUrl && (
                  <a href={sent.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-white/15 text-[#E7ECF3] hover:border-[#B8973F]">
                    Send on WhatsApp too
                  </a>
                )}
                {sent.adminUrl && <Link href={sent.adminUrl} className="inline-flex items-center text-xs font-bold px-3 py-2 rounded-lg border border-white/15 text-[#D9C27A] hover:border-[#B8973F]">Open order</Link>}
                <button type="button" onClick={reset} className="inline-flex items-center text-xs font-bold px-3 py-2 rounded-lg border border-white/15 text-[#A9B4C6] hover:border-white/40">New document</button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ------------------------------------------------ Right: live preview */}
      <section className="xl:col-span-3 bg-[#0B1F3A] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col min-h-[560px] xl:sticky xl:top-4 xl:self-start xl:h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className={cardTitle}>Live preview: what the client receives</h2>
          <span className="text-[10px] text-[#A9B4C6]">updates as you edit</span>
        </div>
        <iframe title="Document preview" srcDoc={preview} className="flex-1 w-full rounded-xl bg-[#071527] border border-white/10 min-h-[520px]" sandbox="" />
      </section>
    </div>
  );
}
