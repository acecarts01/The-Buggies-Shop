'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { CONTACT, SHOP } from '@/src/config/site';
import { PAY_IN_4, fmtAud, isPayIn4Eligible, payIn4Schedule, type PayIn4Frequency } from '@/lib/pay-in-4';

interface Props {
  /** Pre-filled order amount in AUD incl. GST (a product price or a cart total). */
  defaultAmount?: number;
  /** Named in the WhatsApp message so the sales desk knows what the plan is for. */
  productName?: string;
  /** 'dark' sits on the product page; 'light' on the cart and the /pay-in-4/ page. */
  tone?: 'dark' | 'light';
  id?: string;
}

const num = (v: string) => {
  const n = parseFloat(v.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export default function PayIn4Calculator({ defaultAmount = 0, productName, tone = 'light', id = 'pay-in-4-calculator' }: Props) {
  const dark = tone === 'dark';
  const [amount, setAmount] = useState(defaultAmount ? String(defaultAmount) : '');
  const [freight, setFreight] = useState('');
  const [frequency, setFrequency] = useState<PayIn4Frequency>('fortnightly');
  // Dates are filled in after mount so the server and browser never disagree about "today".
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  const total = Math.round((num(amount) + num(freight)) * 100) / 100;
  const eligible = isPayIn4Eligible(total);
  const schedule = useMemo(() => payIn4Schedule(total, frequency, today ?? new Date()), [total, frequency, today]);
  // "Over" the minimum is strict, so exactly the minimum is still a cent short.
  const shortBy = Math.max(0.01, Math.round((PAY_IN_4.min - total) * 100) / 100);

  const c = dark
    ? {
        wrap: 'bg-[#16181B] border-[#E2A17A]/40 text-white',
        muted: 'text-[#AEB4B8]',
        input: 'bg-[#0F1113] border-[#3A3F44] text-white focus:border-[#E2A17A]',
        card: 'bg-[#0F1113] border-[#2A2E32]',
        accent: 'text-[#E2A17A]',
        on: 'bg-[#E2A17A] text-[#121417] border-[#E2A17A]',
        off: 'bg-transparent text-[#AEB4B8] border-[#3A3F44] hover:border-[#E2A17A]/60',
        note: 'bg-[#0F1113] border-[#3A3F44] text-[#F2E9E3]',
      }
    : {
        wrap: 'bg-white border-[#C86D51]/30 text-[#121417]',
        muted: 'text-[#6B645E]',
        input: 'bg-[#F7F6F2] border-[#E7E5E4] text-[#121417] focus:border-[#C86D51]',
        card: 'bg-[#F7F6F2] border-[#E7E5E4]',
        accent: 'text-[#A85640]',
        on: 'bg-[#B45A40] text-white border-[#B45A40]',
        off: 'bg-white text-[#6B645E] border-[#E7E5E4] hover:border-[#C86D51]/60',
        note: 'bg-[#F7EFEA] border-[#C86D51]/20 text-[#6B645E]',
      };

  const waText = `Hi, I would like to set up Pay in 4 (${frequency}) for ${productName ?? 'a golf buggy order'}. Order total ${fmtAud(total)} AUD incl. GST${num(freight) ? ' with my freight quote' : ''}.`;

  return (
    <section id={id} aria-label="Pay in 4 calculator" className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${c.wrap}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold leading-tight">Pay in 4 calculator</h2>
          <p className={`text-xs mt-0.5 ${c.muted}`}>
            Orders over {fmtAud(PAY_IN_4.min)} AUD · {SHOP.financeIn4.interestRate} interest · {SHOP.financeIn4.installments} equal payments
          </p>
        </div>
        <span className={`shrink-0 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${dark ? 'bg-[#E2A17A] text-[#121417]' : 'bg-[#F7EFEA] text-[#A85640] border border-[#C86D51]/30'}`}>
          Pay in 4
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block text-xs font-semibold">
          Order amount (AUD incl. GST)
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 8990"
            className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm font-bold outline-none ${c.input}`}
          />
        </label>
        <label className="block text-xs font-semibold">
          Freight quote (optional)
          <input
            inputMode="decimal"
            value={freight}
            onChange={(e) => setFreight(e.target.value)}
            placeholder="add it once we quote you"
            className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm font-bold outline-none ${c.input}`}
          />
        </label>
      </div>

      <div role="group" aria-label="Payment frequency" className="grid grid-cols-2 gap-2">
        {(['fortnightly', 'monthly'] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={frequency === f}
            onClick={() => setFrequency(f)}
            className={`rounded-lg border px-3 py-2 text-xs font-bold capitalize transition-colors ${frequency === f ? c.on : c.off}`}
          >
            {f}
          </button>
        ))}
      </div>

      {eligible ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" aria-live="polite">
            {schedule.map((p) => (
              <div key={p.n} className={`rounded-xl border p-3 text-center ${c.card}`}>
                <div className={`text-[10px] font-bold uppercase tracking-wide ${c.muted}`}>Payment {p.n}</div>
                <div className={`text-lg font-extrabold ${c.accent}`}>{fmtAud(p.amount)}</div>
                <div className="text-[11px] font-semibold">{p.label}</div>
                <div className={`text-[10px] min-h-[14px] ${c.muted}`}>
                  {today ? p.date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </div>
              </div>
            ))}
          </div>
          <p className={`flex items-start gap-2 text-[11px] leading-relaxed rounded-lg border px-3 py-2 ${c.note}`}>
            <CalendarDays className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              {fmtAud(total)} AUD in total, 0% interest. Freight is quoted separately against your delivery postcode; add the quote above to
              see the full amount split in 4. Your plan is confirmed on your tax invoice.
            </span>
          </p>
          <a
            href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold bg-[#25D366] text-[#0B2A16] hover:brightness-95 transition"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Set up this plan on WhatsApp
          </a>
        </>
      ) : (
        <p className={`rounded-lg border px-3 py-3 text-xs leading-relaxed ${c.note}`} aria-live="polite">
          {total > 0
            ? `Pay in 4 is for orders over ${fmtAud(PAY_IN_4.min)} AUD. This order is ${fmtAud(total)}, so add ${fmtAud(shortBy)} more to qualify, or pay by PayID, bank transfer or crypto (${SHOP.cryptoDiscount}% off).`
            : `Enter your order amount to see your 4 payments. Pay in 4 is available on orders over ${fmtAud(PAY_IN_4.min)} AUD.`}
        </p>
      )}
    </section>
  );
}
