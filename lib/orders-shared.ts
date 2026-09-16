// Browser-safe order types and helpers (no node:crypto). lib/orders.ts
// re-exports these and adds pricing, signing and URLs for the server.

export type PaymentChannel = 'standard' | 'finance4' | 'crypto';
export type OrderChannel = 'invoice' | 'whatsapp' | 'crypto';
export type OrderStatus = 'new' | 'awaiting_invoice' | 'invoice_sent' | 'paid' | 'dispatched';

export interface OrderLine {
  id: string;
  slug: string;
  name: string;
  category: string;
  keySpecs: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isBuggy: boolean;
}

export interface OrderTotals {
  subtotal: number;
  accessoryDiscount: number;
  cryptoDiscount: number;
  total: number;
  /** GST component of `total` (prices are GST-inclusive: total / 11). */
  gst: number;
}

export interface Order {
  ref: string;
  createdAt: string;
  status: OrderStatus;
  channel: OrderChannel;
  payment: PaymentChannel;
  customer: { name: string; email: string; phone?: string; postcode?: string; state?: string };
  lines: OrderLine[];
  totals: OrderTotals;
  /** Set by the settlement terminal when the invoice goes out. */
  invoice?: InvoiceDetails;
}

export interface InvoiceDetails {
  issuedAt: string;
  method: 'bank' | 'crypto' | 'finance4';
  bank?: { accountName: string; bsb: string; accountNumber: string; payId?: string };
  crypto?: { walletKey: string; asset: string; network: string; address: string };
  finance4?: { instructions: string; link?: string };
  freight: { amount: number | null; note: string };
  deliveryTimeframe: string;
  notes?: string;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New Order',
  awaiting_invoice: 'Awaiting Invoice',
  invoice_sent: 'Invoice Sent',
  paid: 'Paid',
  dispatched: 'Dispatched',
};

const AU_STATES: Record<string, string> = { '0': 'NT/ACT', '1': 'NSW', '2': 'NSW/ACT', '3': 'VIC', '4': 'QLD', '5': 'SA', '6': 'WA', '7': 'TAS', '8': 'NT/VIC', '9': 'QLD' };

/** Rough state from an Australian postcode, for the admin card only. */
export function stateFromPostcode(postcode?: string): string | undefined {
  if (!postcode || !/^\d{4}$/.test(postcode)) return undefined;
  const p = Number(postcode);
  if (p >= 2600 && p <= 2618) return 'ACT';
  if (p >= 2900 && p <= 2920) return 'ACT';
  if (p >= 800 && p <= 999) return 'NT';
  if (p >= 3000 && p <= 3999) return 'VIC';
  if (p >= 8000 && p <= 8999) return 'VIC';
  if (p >= 9000 && p <= 9999) return 'QLD';
  return AU_STATES[postcode[0]]?.split('/')[0];
}

export const aud = (n: number) => `$${n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} AUD`;

const PAYMENT_LABEL: Record<PaymentChannel, string> = {
  standard: 'PayID / Bank Transfer (EFT)',
  finance4: 'Finance in 4 (4 interest-free payments)',
  crypto: 'Crypto - BTC / USDT (10% discount applied)',
};
export const paymentLabel = (p: PaymentChannel) => PAYMENT_LABEL[p];
