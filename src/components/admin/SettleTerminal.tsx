'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Landmark, Bitcoin, CreditCard, Send, MessageSquare, Copy, Check, Lock, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { type Order, type InvoiceDetails, aud, paymentLabel } from '@/lib/orders-shared';
import { CRYPTO } from '@/src/config/site';

type Method = InvoiceDetails['method'];

interface Props {
  token: string;
  order: Order;
  bankDefaults: { accountName: string; bsb: string; accountNumber: string; payId: string };
}

const METHODS: { key: Method; label: string; icon: React.ElementType; hint: string }[] = [
  { key: 'bank', label: 'Bank / PayID', icon: Landmark, hint: 'BSB, account, reference' },
  { key: 'crypto', label: 'Crypto', icon: Bitcoin, hint: 'BTC · USDT, QR code' },
  { key: 'finance4', label: 'Finance in 4', icon: CreditCard, hint: 'Plan instructions / link' },
];

const input =
  'w-full px-3 py-2.5 rounded-lg bg-[#071527] border border-white/15 text-white text-sm placeholder-[#5C6B85] focus:outline-none focus:border-[#B8973F] transition-colors';
const label = 'block text-[11px] uppercase tracking-[0.15em] text-[#D9C27A] font-bold mb-1.5';

export default function SettleTerminal({ token, order, bankDefaults }: Props) {
  const defaultMethod: Method = order.payment === 'crypto' ? 'crypto' : order.payment === 'finance4' ? 'finance4' : 'bank';
  const [method, setMethod] = useState<Method>(defaultMethod);
  const [bank, setBank] = useState(bankDefaults);
  const [walletKey, setWalletKey] = useState(CRYPTO.wallets[0].key);
  const [finance, setFinance] = useState({ instructions: '', link: '' });
  const [notes, setNotes] = useState('');
  const [qr, setQr] = useState('');
  const [preview, setPreview] = useState('');
  const [incomplete, setIncomplete] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState<{ payUrl: string; adminUrl: string; whatsappText: string; whatsappUrl: string; sent: boolean; error?: string; outboxFile?: string } | null>(null);

  const wallet = useMemo(() => CRYPTO.wallets.find((w) => w.key === walletKey) ?? CRYPTO.wallets[0], [walletKey]);

  const invoice = useMemo<Partial<InvoiceDetails>>(
    () => ({
      method,
      bank: method === 'bank' ? bank : undefined,
      crypto: method === 'crypto' ? { walletKey: wallet.key, asset: wallet.asset, network: wallet.network, address: wallet.address } : undefined,
      finance4: method === 'finance4' ? finance : undefined,
      notes,
    }),
    [method, bank, wallet, finance, notes]
  );

  // QR for the crypto panel.
  useEffect(() => {
    if (method !== 'crypto') return;
    const payload = wallet.asset === 'BTC' ? `bitcoin:${wallet.address}?label=${encodeURIComponent(`The Buggies Express ${order.ref}`)}` : wallet.address;
    QRCode.toDataURL(payload, { margin: 1, width: 160, color: { dark: '#071527', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [method, wallet, order.ref]);

  // Live preview: server-rendered invoice HTML, debounced.
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/invoice/?preview=1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, invoice }),
        });
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
  }, [token, invoice]);

  const dispatch = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/admin/invoice/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, invoice }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Send failed');
      setSent(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const copyWhatsApp = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent.whatsappText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* selectable fallback below */
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* ------------------------------------------------ Left: the form */}
      <div className="xl:col-span-2 space-y-5">
        {/* Locked order data */}
        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Order (locked)</h2>
            <Lock className="w-3.5 h-3.5 text-[#A9B4C6]" aria-hidden="true" />
          </div>
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Customer</dt><dd className="font-semibold text-right">{order.customer.name}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Email</dt><dd className="text-right break-all">{order.customer.email}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Phone</dt><dd className="text-right">{order.customer.phone ?? '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Postcode</dt><dd className="text-right">{order.customer.postcode ?? '—'}{order.customer.state ? ` · ${order.customer.state}` : ''}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[#A9B4C6]">Chosen on site</dt><dd className="text-right">{paymentLabel(order.payment)}</dd></div>
          </dl>
          <ul className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
            {order.lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-3">
                <span className="text-[#E7ECF3]">{l.name} <span className="text-[#A9B4C6]">×{l.quantity}</span></span>
                <span className="whitespace-nowrap">{aud(l.lineTotal)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-3 pt-2 border-t border-white/10 font-bold text-[#D9C27A]"><span>Total excl. freight</span><span>{aud(order.totals.total)}</span></li>
          </ul>
        </section>

        {/* Method */}
        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 space-y-4">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Payment coordinates</h2>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
            {METHODS.map((m) => {
              const active = m.key === method;
              return (
                <button
                  key={m.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMethod(m.key)}
                  className={`rounded-lg border p-2.5 text-left transition-all hover:-translate-y-px ${active ? 'border-[#B8973F] bg-[#12294A] shadow-[0_0_0_3px_rgba(184,151,63,0.18)]' : 'border-white/15 hover:border-white/40'}`}
                >
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
              <p className="sm:col-span-2 text-[11px] text-[#A9B4C6]">Reference is fixed to <span className="font-mono text-white">{order.ref}</span>. Set BANK_* env vars on Vercel to pre-load these fields.</p>
            </div>
          )}

          {method === 'crypto' && (
            <div className="space-y-3">
              {order.payment !== 'crypto' && (
                <p className="flex items-start gap-2 text-[11px] text-[#F3C6B0] bg-[#3A1C14] border border-[#7A3A28] rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
                  This order was priced without the 10% crypto discount. Ask the buyer to reorder with Crypto selected, or invoice by bank.
                </p>
              )}
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
              <p className="text-[11px] text-[#A9B4C6]">Addresses come from the site config only; nothing typed here can change them.</p>
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
        </section>

        {/* Notes */}
        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Invoice notes</h2>
          <div>
            <label className={label} htmlFor="notes">Notes on the invoice <span className="normal-case tracking-normal font-normal text-[#A9B4C6]">(optional)</span></label>
            <textarea id="notes" className={`${input} min-h-[72px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Freight is quoted once payment clears — mention that here if useful." />
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-white/10">
            <span className="text-[#A9B4C6]">Amount payable (freight confirmed after payment)</span>
            <span className="font-bold text-[#D9C27A] text-lg">{aud(order.totals.total)}</span>
          </div>
        </section>

        {/* Dispatch */}
        <section className="bg-gradient-to-r from-[#12294A] to-[#0B1F3A] border border-[#B8973F]/50 rounded-2xl p-5 space-y-3">
          {incomplete && !sent && (
            <p className="flex items-start gap-2 text-[11px] text-[#D9C27A]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
              {incomplete}
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-[#F3C6B0] bg-[#3A1C14] border border-[#7A3A28] rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {!sent ? (
            <button
              type="button"
              onClick={dispatch}
              disabled={sending || Boolean(incomplete)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] font-bold text-sm transition-all hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Send Official HTML Invoice to {order.customer.email}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="flex items-start gap-2 text-sm text-[#7FD09A]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                {sent.sent ? `Invoice emailed to ${order.customer.email} (copy to the sales desk).` : `Invoice rendered but not emailed: ${sent.error}. ${sent.outboxFile ? 'Written to the local outbox.' : ''}`}
              </p>
              <a href={sent.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#188741] hover:bg-[#1E9A4F] text-white font-bold text-sm transition-colors">
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                Dispatch WhatsApp payment invoice{order.customer.phone ? ` to ${order.customer.phone}` : ''}
              </a>
              <div className="flex gap-2">
                <button type="button" onClick={copyWhatsApp} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/20 hover:border-[#B8973F] text-sm font-semibold transition-colors">
                  {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy WhatsApp text'}
                </button>
                <a href={sent.payUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/20 hover:border-[#B8973F] text-sm font-semibold transition-colors">
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Open client invoice
                </a>
              </div>
              <textarea readOnly value={sent.whatsappText} className={`${input} min-h-[120px] text-[11px] font-mono`} aria-label="WhatsApp invoice text" />
              <p className="text-[11px] text-[#A9B4C6]">Status is now <strong className="text-white">Invoice Sent</strong>. <a href={sent.adminUrl} className="underline hover:text-[#D9C27A]">Updated order card</a>.</p>
            </div>
          )}
        </section>
      </div>

      {/* ------------------------------------------------ Right: live preview */}
      <section className="xl:col-span-3 bg-[#0B1F3A] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col min-h-[560px]">
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Live preview — what the client receives</h2>
          <span className="text-[10px] text-[#A9B4C6]">updates as you type</span>
        </div>
        <iframe title="Invoice preview" srcDoc={preview} className="flex-1 w-full rounded-xl bg-[#071527] border border-white/10 min-h-[520px]" sandbox="" />
      </section>
    </div>
  );
}
