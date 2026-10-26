// Admin-built quotes and tax invoices. One validator and builder shared by the
// live preview and the send, so the preview can never show something the send
// would not produce. Prices come from the desk (they may differ from the shelf
// price for a negotiated deal), but every line is checked, GST is recomputed,
// and payment details must be a configured wallet or well-formed bank details.
import { PRODUCTS, isBuggyItem } from '@/src/config/site';
import { type Order, type OrderLine, type InvoiceDetails, type PaymentChannel, stateFromPostcode, aud } from './orders-shared';
import { newOrderRef } from './orders';
import { newQuoteRef } from './quotes';
import { cleanPayment } from './reply-payment';
import { DEFAULT_AFTER_PAYMENT } from './document-defaults';
import { isPayIn4Eligible, PAY_IN_4, fmtAud } from './pay-in-4';

export type DocKind = 'quote' | 'invoice';

export interface DocLineInput {
  slug?: string;
  name?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface DocInput {
  kind?: string;
  client?: { name?: string; company?: string; email?: string; phone?: string; address?: string; postcode?: string };
  lines?: DocLineInput[];
  payment?: Partial<InvoiceDetails>;
  financeFrequency?: string;
  afterPayment?: string;
  message?: string;
  validDays?: number;
  subject?: string;
}

export interface BuiltDocument {
  kind: DocKind;
  /** An Order-shaped record: persisted only for invoices. */
  order: Order;
  validUntil?: string;
  message: string;
  afterPayment: string;
  subject: string;
}


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const round2 = (n: number) => Math.round(n * 100) / 100;
const s = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export function buildDocument(raw: DocInput, opts: { strict: boolean; ref?: string; createdAt?: string }): { doc?: BuiltDocument; error?: string; incomplete?: string } {
  const kind: DocKind = raw.kind === 'invoice' ? 'invoice' : 'quote';
  const problems: string[] = [];
  const bad = (m: string) => problems.push(m);

  // --- client
  const c = raw.client ?? {};
  const name = s(c.name, 120);
  const email = s(c.email, 160).toLowerCase();
  const postcode = s(c.postcode, 4);
  if (!name) bad('Enter the client\'s name.');
  if (!EMAIL_RE.test(email)) bad('Enter a valid client email address.');
  if (postcode && !/^\d{4}$/.test(postcode)) bad('The postcode must be 4 digits.');

  // --- lines
  const lines: OrderLine[] = [];
  (Array.isArray(raw.lines) ? raw.lines : []).slice(0, 40).forEach((l, i) => {
    const product = l.slug ? PRODUCTS.find((p) => p.slug === l.slug) : undefined;
    const lineName = s(l.name, 160) || product?.name || '';
    const qty = Math.floor(Number(l.quantity));
    const unit = round2(Number(l.unitPrice));
    if (!lineName && !Number.isFinite(unit)) return; // an untouched blank row
    if (!lineName) return bad(`Line ${i + 1} needs a description.`);
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) return bad(`Line ${i + 1}: quantity must be 1 to 999.`);
    if (!Number.isFinite(unit) || Math.abs(unit) > 10_000_000) return bad(`Line ${i + 1}: enter a price in AUD (GST included). Use a negative price for a discount.`);
    lines.push({
      id: product?.id ?? `CUSTOM-${lines.length + 1}`,
      slug: product?.slug ?? '',
      name: lineName,
      category: product?.category ?? 'Custom item',
      keySpecs: s(l.description, 240) || product?.key_specs || '',
      quantity: qty,
      unitPrice: unit,
      lineTotal: round2(unit * qty),
      isBuggy: product ? isBuggyItem(product.category, product.id, product.name) : false,
    });
  });
  if (lines.length === 0) bad('Add at least one line item.');
  const subtotal = round2(lines.reduce((t, l) => t + l.lineTotal, 0));
  const total = Math.max(0, subtotal);
  if (lines.length > 0 && total <= 0) bad('The total must be more than $0.');

  // --- payment
  const cleaned = cleanPayment(raw.payment);
  let payment: InvoiceDetails | undefined;
  if (cleaned && 'error' in cleaned) bad(cleaned.error);
  else payment = cleaned;
  if (kind === 'invoice' && !payment && !(cleaned && 'error' in cleaned)) bad('An invoice needs payment details: choose how the client pays.');
  if (payment?.method === 'finance4' && total > 0 && !isPayIn4Eligible(total)) bad(`Finance in 4 is for orders over ${fmtAud(PAY_IN_4.min)} AUD. Choose bank transfer or crypto for this total.`);

  const incomplete = problems[0];
  if (opts.strict && problems.length) return { error: problems[0] };

  // --- assemble
  const now = opts.createdAt && !Number.isNaN(Date.parse(opts.createdAt)) ? new Date(opts.createdAt) : new Date();
  const issued = new Date();
  const ref = opts.ref ? opts.ref : opts.strict ? (kind === 'invoice' ? newOrderRef(now) : newQuoteRef(now)) : kind === 'invoice' ? 'BE-PREVIEW' : 'QT-PREVIEW';
  const channel: PaymentChannel = payment?.method === 'crypto' ? 'crypto' : payment?.method === 'finance4' ? 'finance4' : 'standard';
  const financeFrequency = raw.financeFrequency === 'monthly' ? ('monthly' as const) : ('fortnightly' as const);
  const gst = round2(total / 11);
  const order: Order = {
    ref,
    createdAt: now.toISOString(),
    status: kind === 'invoice' ? 'invoice_sent' : 'new',
    channel: 'invoice',
    payment: channel,
    customer: {
      name: name || 'Client name',
      email,
      phone: s(c.phone, 40) || undefined,
      postcode: postcode || undefined,
      state: stateFromPostcode(postcode || undefined),
      company: s(c.company, 120) || undefined,
      address: s(c.address, 160) || undefined,
    },
    lines,
    totals: { subtotal, accessoryDiscount: 0, cryptoDiscount: 0, total, gst, ...(channel === 'finance4' ? { financeFrequency } : {}) },
  };
  const afterPayment = (s(raw.afterPayment, 1200) || DEFAULT_AFTER_PAYMENT).split('{ref}').join(ref);
  if (payment) {
    // {ref} may be typed into the Finance in 4 instructions too.
    if (payment.finance4) payment.finance4 = { ...payment.finance4, instructions: payment.finance4.instructions.split('{ref}').join(ref) };
    order.invoice = { ...payment, afterPayment };
  }

  let validUntil: string | undefined;
  if (kind === 'quote') {
    const days = Math.min(90, Math.max(1, Math.floor(Number(raw.validDays)) || 14));
    validUntil = new Date(issued.getTime() + days * 86_400_000).toISOString();
  }

  const subject = s(raw.subject, 200) || (kind === 'invoice' ? `Tax invoice ${ref} — ${aud(total)} — The Buggies Express` : `Your quote ${ref} — ${aud(total)} — The Buggies Express`);
  return { doc: { kind, order, validUntil, message: s(raw.message, 3000), afterPayment, subject }, incomplete };
}
