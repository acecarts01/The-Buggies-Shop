'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Landmark, Bitcoin, CreditCard, Send, Lock, CheckCircle2, AlertTriangle, Wand2, RotateCcw } from 'lucide-react';
import { type InvoiceDetails, paymentLabel } from '@/lib/orders-shared';
import { type EnquiryContext, KIND_LABEL } from '@/lib/enquiry-context';
import { type ReplyDraft } from '@/lib/reply-draft';
import { CRYPTO, PRODUCTS, CATEGORIES } from '@/src/config/site';

type Method = InvoiceDetails['method'];
type Source = { kind: 'enquiry'; id: number } | { kind: 'quote'; token: string };

interface Props {
  source: Source;
  ctx: EnquiryContext;
  draft: ReplyDraft;
  bankDefaults: { accountName: string; bsb: string; accountNumber: string; payId: string };
  /** Set when this enquiry has already been answered. */
  replied?: { at: string; subject: string | null; message: string | null } | null;
}

const METHODS: { key: Method; label: string; icon: React.ElementType; hint: string }[] = [
  { key: 'bank', label: 'Bank / PayID', icon: Landmark, hint: 'BSB, account, reference' },
  { key: 'crypto', label: 'Crypto', icon: Bitcoin, hint: 'All coins, QR code' },
  { key: 'finance4', label: 'Finance in 4', icon: CreditCard, hint: 'Plan instructions / link' },
];

const INTENT_LABEL: Record<string, string> = {
  price: 'Price', stock: 'Stock', delivery: 'Delivery', payment: 'Payment', finance: 'Finance in 4', crypto: 'Crypto', tradein: 'Trade-in',
  fleet: 'Fleet', registration: 'Registration / insurance', warranty: 'Warranty', range: 'Range / battery', trial: 'Trial / visit',
  parts: 'Parts / accessories', spec: 'Specs', custom: 'Custom', invoice: 'ABN / GST',
};

const input =
  'w-full px-3 py-2.5 rounded-lg bg-[#071527] border border-white/15 text-white text-sm placeholder-[#5C6B85] focus:outline-none focus:border-[#B8973F] transition-colors';
const label = 'block text-[11px] uppercase tracking-[0.15em] text-[#D9C27A] font-bold mb-1.5';

export default function EnquiryReplyTerminal({ source, ctx, draft, bankDefaults, replied }: Props) {
  const [subject, setSubject] = useState(draft.subject);
  const [message, setMessage] = useState(draft.message);
  const [quotedPrice, setQuotedPrice] = useState(draft.quotedPrice ? String(draft.quotedPrice) : '');
  const [productSlug, setProductSlug] = useState(draft.productSlug ?? '');
  const [notes, setNotes] = useState(draft.notes);
  const [intents, setIntents] = useState(draft.intents);
  const [includePayment, setIncludePayment] = useState(false);
  const [method, setMethod] = useState<Method>(ctx.paymentPreference === 'crypto' ? 'crypto' : ctx.paymentPreference === 'finance4' ? 'finance4' : 'bank');
  const [bank, setBank] = useState(bankDefaults);
  const [walletKey, setWalletKey] = useState(CRYPTO.wallets[0].key);
  const [finance, setFinance] = useState({ instructions: '', link: '' });
  const [qr, setQr] = useState('');
  const [preview, setPreview] = useState('');
  const [incomplete, setIncomplete] = useState('');
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ sent: boolean; error?: string; outboxFile?: string } | null>(null);
  const [approved, setApproved] = useState(false);
  const edited = message !== draft.message;

  const wallet = useMemo(() => CRYPTO.wallets.find((w) => w.key === walletKey) ?? CRYPTO.wallets[0], [walletKey]);

  const payment = useMemo<Partial<InvoiceDetails> | undefined>(() => {
    if (!includePayment) return undefined;
    return {
      method,
      bank: method === 'bank' ? bank : undefined,
      crypto: method === 'crypto' ? { walletKey: wallet.key, asset: wallet.asset, network: wallet.network, address: wallet.address } : undefined,
      finance4: method === 'finance4' ? finance : undefined,
    };
  }, [includePayment, method, bank, wallet, finance]);

  useEffect(() => {
    if (!includePayment || method !== 'crypto') return;
    const payload = wallet.asset === 'BTC' ? `bitcoin:${wallet.address}?label=${encodeURIComponent(`The Buggies Express ${ctx.ref}`)}` : wallet.address;
    QRCode.toDataURL(payload, { margin: 1, width: 160, color: { dark: '#071527', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [includePayment, method, wallet, ctx.ref]);

  const body = () => JSON.stringify({ source, subject, message, quotedPrice: quotedPrice ? Number(quotedPrice) : undefined, productSlug: productSlug || undefined, payment });

  // Live preview: the exact HTML the client receives, debounced.
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/enquiries/reply/?preview=1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body() });
        const data = await res.json();
        if (data.html) setPreview(data.html);
        setIncomplete(data.incomplete || '');
      } catch {
        /* keep the last preview */
      }
    }, 350);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, subject, message, quotedPrice, productSlug, payment]);

  const redraft = async () => {
    if (edited && !window.confirm('Replace your edits with a fresh auto-drafted reply?')) return;
    setDrafting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/enquiries/reply/?draft=1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body() });
      const data = await res.json();
      if (!res.ok || !data.draft) throw new Error(data.message || 'Could not draft');
      const d: ReplyDraft = data.draft;
      setSubject(d.subject);
      setMessage(d.message);
      setQuotedPrice(d.quotedPrice ? String(d.quotedPrice) : '');
      setProductSlug(d.productSlug ?? '');
      setNotes(d.notes);
      setIntents(d.intents);
      setApproved(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDrafting(false);
    }
  };

  const dispatch = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/admin/enquiries/reply/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body() });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Send failed');
      setSent(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const productGroups = useMemo(() => {
    const groups = new Map<string, typeof PRODUCTS>();
    for (const p of PRODUCTS) groups.set(p.category, [...(groups.get(p.category) ?? []), p]);
    return [...groups.entries()];
  }, []);

  const received = new Date(ctx.receivedAt).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' });
  const canSend = !sending && message.trim().length > 0 && approved && Boolean(ctx.email);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* ------------------------------------------------ Left: the form */}
      <div className="xl:col-span-2 space-y-5">
        {replied && (
          <section className="bg-[#12331F] border border-[#2E7D4F] rounded-2xl p-4 text-sm text-[#BFEBD0]">
            <p className="flex items-start gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              Already answered on {new Date(replied.at).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })}
            </p>
            {replied.message && (
              <details className="mt-2 text-xs text-[#BFEBD0]/90">
                <summary className="cursor-pointer">See what was sent</summary>
                <p className="mt-2 whitespace-pre-line">{replied.message}</p>
              </details>
            )}
          </section>
        )}

        {/* Locked client data + their words */}
        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">{KIND_LABEL[ctx.kind]} (locked)</h2>
            <Lock className="w-3.5 h-3.5 text-[#A9B4C6]" aria-hidden="true" />
          </div>
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Reference</dt><dd className="font-mono text-right">{ctx.ref}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Received</dt><dd className="text-right">{received}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Customer</dt><dd className="font-semibold text-right">{ctx.name}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Email</dt><dd className="text-right break-all">{ctx.email || '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Phone</dt><dd className="text-right">{ctx.phone ?? '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Postcode</dt><dd className="text-right">{ctx.postcode ?? '—'}{ctx.state ? ` · ${ctx.state}` : ''}</dd></div>
            {ctx.model && <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Model</dt><dd className="text-right">{ctx.model}</dd></div>}
            {ctx.deliveryPreference && <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Delivery</dt><dd className="text-right">{ctx.deliveryPreference}</dd></div>}
            {ctx.paymentPreference && <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Payment preference</dt><dd className="text-right">{paymentLabel(ctx.paymentPreference)}</dd></div>}
            {ctx.organization && <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Organisation</dt><dd className="text-right">{ctx.organization}</dd></div>}
            {ctx.quantity && <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Quantity</dt><dd className="text-right">{ctx.quantity}</dd></div>}
          </dl>
          <div className="border-t border-white/10 pt-3">
            <div className="text-[11px] uppercase tracking-[0.15em] text-[#A9B4C6] font-bold mb-1">Their message</div>
            {ctx.message ? <p className="text-sm text-[#E7ECF3] whitespace-pre-line leading-relaxed">{ctx.message}</p> : <p className="text-sm text-[#A9B4C6] italic">No message, form details only.</p>}
          </div>
        </section>

        {/* Check before sending */}
        <section className="bg-[#1E2A12] border border-[#B8973F]/40 rounded-2xl p-4 space-y-2">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5" aria-hidden="true" /> Auto-drafted from their enquiry
          </h2>
          {intents.length > 0 && (
            <p className="flex flex-wrap gap-1.5">
              {intents.map((i) => (
                <span key={i} className="text-[10px] uppercase tracking-wider bg-[#B8973F]/20 text-[#E8D48F] rounded-full px-2 py-0.5 font-bold">{INTENT_LABEL[i] ?? i}</span>
              ))}
            </p>
          )}
          {notes.length > 0 ? (
            <ul className="text-xs text-[#E8D48F] space-y-1.5 list-disc pl-4">
              {notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          ) : (
            <p className="text-xs text-[#E8D48F]">Nothing needs adding. Read it through once, then approve.</p>
          )}
        </section>

        {/* Reply content */}
        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Your reply</h2>
            <button type="button" onClick={redraft} disabled={drafting} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-white/15 text-[#A9B4C6] hover:border-white/40 disabled:opacity-50">
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              {drafting ? 'Drafting…' : 'Redraft'}
            </button>
          </div>
          <div>
            <label className={label} htmlFor="reply-subject">Subject</label>
            <input id="reply-subject" className={input} value={subject} onChange={(e) => { setSubject(e.target.value); setApproved(false); }} />
          </div>
          <div>
            <label className={label} htmlFor="reply-product">Model shown in the email</label>
            <select id="reply-product" className={input} value={productSlug} onChange={(e) => {
              const p = PRODUCTS.find((x) => x.slug === e.target.value);
              setProductSlug(e.target.value);
              if (p) setQuotedPrice(String(p.price_aud));
              setApproved(false);
            }}>
              <option value="">No product card</option>
              {productGroups.map(([cat, items]) => (
                <optgroup key={cat} label={CATEGORIES.find((c) => c.rawCategory === cat)?.name ?? cat}>
                  {items.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                </optgroup>
              ))}
            </select>
            {draft.alternatives.length > 0 && (
              <p className="text-[11px] text-[#A9B4C6] mt-1.5">Nearest alternatives: {draft.alternatives.map((a) => `${a.name} ($${a.price.toLocaleString('en-AU')})`).join(' · ')}</p>
            )}
          </div>
          <div>
            <label className={label} htmlFor="quoted-price">Quoted price <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional, AUD incl. GST)</span></label>
            <input id="quoted-price" className={input} inputMode="numeric" value={quotedPrice} onChange={(e) => { setQuotedPrice(e.target.value.replace(/[^\d]/g, '')); setApproved(false); }} placeholder="e.g. 20900" />
          </div>
          <div>
            <label className={label} htmlFor="reply-message">Message to client <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(edit freely; blank line = new paragraph)</span></label>
            <textarea id="reply-message" className={`${input} min-h-[340px] leading-relaxed`} value={message} onChange={(e) => { setMessage(e.target.value); setApproved(false); }} />
          </div>
        </section>

        {/* Optional payment */}
        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Payment details</h2>
            <button type="button" onClick={() => { setIncludePayment((v) => !v); setApproved(false); }} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${includePayment ? 'border-[#B8973F] bg-[#12294A] text-[#D9C27A]' : 'border-white/15 text-[#A9B4C6] hover:border-white/40'}`}>
              {includePayment ? 'Included' : 'Not included'}
            </button>
          </div>
          {!includePayment && ctx.paymentPreference && <p className="text-[11px] text-[#A9B4C6]">The client prefers {paymentLabel(ctx.paymentPreference)}. Switch this on to add the details to the email.</p>}

          {includePayment && (
            <>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
                {METHODS.map((m) => {
                  const active = m.key === method;
                  return (
                    <button key={m.key} type="button" role="radio" aria-checked={active} onClick={() => setMethod(m.key)} className={`rounded-lg border p-2.5 text-left transition-all hover:-translate-y-px ${active ? 'border-[#B8973F] bg-[#12294A] shadow-[0_0_0_3px_rgba(184,151,63,0.18)]' : 'border-white/15 hover:border-white/40'}`}>
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
                    <input id="acct-name" className={input} value={bank.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} placeholder="Golf Buggies Express Pty Ltd" />
                  </div>
                  <div>
                    <label className={label} htmlFor="bsb">BSB</label>
                    <input id="bsb" className={input} inputMode="numeric" value={bank.bsb} onChange={(e) => setBank({ ...bank, bsb: e.target.value })} placeholder="000-000" />
                  </div>
                  <div>
                    <label className={label} htmlFor="acct-no">Account number</label>
                    <input id="acct-no" className={input} inputMode="numeric" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} placeholder="12345678" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="payid">PayID <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional)</span></label>
                    <input id="payid" className={input} value={bank.payId} onChange={(e) => setBank({ ...bank, payId: e.target.value })} placeholder="e.g. an email or ABN registered for PayID" />
                  </div>
                </div>
              )}

              {method === 'crypto' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Wallet">
                    {CRYPTO.wallets.map((w) => (
                      <button key={w.key} type="button" role="radio" aria-checked={w.key === walletKey} onClick={() => setWalletKey(w.key)} className={`rounded-lg border p-2 text-left transition-colors ${w.key === walletKey ? 'border-[#B8973F] bg-[#12294A]' : 'border-white/15 hover:border-white/40'}`}>
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
                </div>
              )}

              {method === 'finance4' && (
                <div className="space-y-3">
                  <div>
                    <label className={label} htmlFor="f4-instr">Instructions for the buyer</label>
                    <textarea id="f4-instr" className={`${input} min-h-[96px]`} value={finance.instructions} onChange={(e) => setFinance({ ...finance, instructions: e.target.value })} placeholder="How the 4 interest-free payments are set up and what the buyer does next." />
                  </div>
                  <div>
                    <label className={label} htmlFor="f4-link">Plan link <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional, https)</span></label>
                    <input id="f4-link" className={input} value={finance.link} onChange={(e) => setFinance({ ...finance, link: e.target.value })} placeholder="https://…" />
                  </div>
                </div>
              )}
            </>
          )}
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
                <span>I have read the reply and the preview. It is correct and ready to send{notes.length ? ', and I have checked the notes above' : ''}.</span>
              </label>
              <button type="button" onClick={dispatch} disabled={!canSend} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] font-bold text-sm transition-all hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0">
                <Send className="w-4 h-4" aria-hidden="true" />
                {ctx.email ? `Approve and send to ${ctx.email}` : 'No email address on file'}
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <p className="flex items-start gap-2 text-sm text-[#7FD09A]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                {sent.sent ? `Reply emailed to ${ctx.email}. A copy went to the sales desk.` : `Reply rendered but not emailed: ${sent.error}. ${sent.outboxFile ? 'Written to the local outbox.' : ''}`}
              </p>
              <Link href="/admin/portal/?tab=enquiries" className="inline-block text-xs font-bold text-[#D9C27A] underline">Back to enquiries</Link>
            </div>
          )}
        </section>
      </div>

      {/* ------------------------------------------------ Right: live preview */}
      <section className="xl:col-span-3 bg-[#0B1F3A] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col min-h-[560px] xl:sticky xl:top-4 xl:self-start xl:h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Live preview: what the client receives</h2>
          <span className="text-[10px] text-[#A9B4C6]">updates as you edit</span>
        </div>
        <iframe title="Reply preview" srcDoc={preview} className="flex-1 w-full rounded-xl bg-[#071527] border border-white/10 min-h-[520px]" sandbox="" />
      </section>
    </div>
  );
}
