// Pay in 4: the rules and the schedule maths, shared by the calculator, the
// cart and the order API so the three can never disagree. The threshold lives
// in SHOP.financeIn4.minAmount (site.ts); nothing here restates it.
import { SHOP } from '@/src/config/site';

export type PayIn4Frequency = 'fortnightly' | 'monthly';

export const PAY_IN_4 = {
  min: SHOP.financeIn4.minAmount,
  installments: SHOP.financeIn4.installments,
} as const;

/** Over the minimum (strictly), in AUD including GST. */
export function isPayIn4Eligible(amount: number): boolean {
  return SHOP.financeIn4.enabled && Number.isFinite(amount) && amount > PAY_IN_4.min;
}

export interface PayIn4Payment {
  n: number;
  amount: number; // AUD
  date: Date;
  label: string; // "Today", "In 2 weeks", "In 1 month"
}

/** First payment today, then every 14 days or every calendar month. Works in cents so four payments always add back to the exact total. */
export function payIn4Schedule(total: number, frequency: PayIn4Frequency, start: Date = new Date()): PayIn4Payment[] {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / PAY_IN_4.installments);
  const extra = cents - base * PAY_IN_4.installments; // 0-3 cents, added to the first payment
  return Array.from({ length: PAY_IN_4.installments }, (_, i) => {
    const date = new Date(start.getTime());
    if (frequency === 'fortnightly') date.setDate(date.getDate() + i * 14);
    else date.setMonth(date.getMonth() + i);
    const label = i === 0 ? 'Today' : frequency === 'fortnightly' ? `In ${i * 2} weeks` : `In ${i} month${i > 1 ? 's' : ''}`;
    return { n: i + 1, amount: (base + (i === 0 ? extra : 0)) / 100, date, label };
  });
}

/** "$1,234" or "$1,234.50" - no trailing .00. */
export function fmtAud(n: number): string {
  return `$${n.toLocaleString('en-AU', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
}
