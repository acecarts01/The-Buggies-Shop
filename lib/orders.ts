// Order model for the confirmation → admin → invoice flow.
//
// There is no database: an order lives in a signed token that travels in the
// links and emails about it. The token is HMAC-SHA256 over the JSON payload
// with ORDER_SIGNING_SECRET, so a link cannot be forged or edited, and every
// admin page and API verifies it before trusting a byte. Status advances by
// re-signing the order with the new status (the settlement terminal returns
// the "invoice_sent" token, the emails carry it onwards).
//
// Prices are recomputed here from PRODUCTS. The client sends ids and
// quantities; it never sets a price.

import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { PRODUCTS, SHOP, SITE, CONTACT, isAccessoryItem, isBuggyItem } from '@/src/config/site';

export * from './orders-shared';
import { type Order, type OrderLine, type OrderTotals, type PaymentChannel, aud, paymentLabel } from './orders-shared';

export function newOrderRef(now = new Date()): string {
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `BE-${stamp}-${randomBytes(3).toString('hex').toUpperCase().slice(0, 4)}`;
}


/** Build priced lines from client ids + quantities. Unknown ids are dropped. */
export function priceLines(items: { id: string; quantity: number }[]): OrderLine[] {
  const lines: OrderLine[] = [];
  for (const it of items) {
    const p = PRODUCTS.find((x) => x.id === it.id || x.slug === it.id);
    const qty = Math.max(1, Math.min(50, Math.floor(Number(it.quantity) || 1)));
    if (!p) continue;
    lines.push({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      keySpecs: p.key_specs,
      quantity: qty,
      unitPrice: p.price_aud,
      lineTotal: p.price_aud * qty,
      isBuggy: isBuggyItem(p.category, p.id, p.name),
    });
  }
  return lines;
}

/** Same rules as the cart drawer: 5% off accessories with a buggy, 10% off for crypto. */
export function computeTotals(lines: OrderLine[], payment: PaymentChannel): OrderTotals {
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const hasBuggy = lines.some((l) => l.isBuggy);
  const hasAccessory = lines.some((l) => isAccessoryItem(l.category, l.id, l.name));
  const accessoryTotal = lines.filter((l) => !l.isBuggy).reduce((s, l) => s + l.lineTotal, 0);
  const accessoryDiscount = hasBuggy && hasAccessory ? Math.round(accessoryTotal * (SHOP.accessoryBundleDiscount / 100)) : 0;
  const afterAccessory = Math.max(0, subtotal - accessoryDiscount);
  const cryptoDiscount = payment === 'crypto' ? Math.round(afterAccessory * (SHOP.cryptoDiscount / 100)) : 0;
  const total = Math.max(0, afterAccessory - cryptoDiscount);
  return { subtotal, accessoryDiscount, cryptoDiscount, total, gst: Math.round((total / 11) * 100) / 100 };
}

// ---------------------------------------------------------------------------
// Signed tokens

function secret(): string {
  const s = process.env.ORDER_SIGNING_SECRET;
  if (!s || s.length < 16) throw new Error('ORDER_SIGNING_SECRET is not set (min 16 chars)');
  return s;
}

const b64u = (b: Buffer) => b.toString('base64url');

export function signOrder(order: Order): string {
  const payload = b64u(Buffer.from(JSON.stringify(order), 'utf8'));
  const sig = b64u(createHmac('sha256', secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyOrder(token: string | null | undefined): Order | null {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = b64u(createHmac('sha256', secret()).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const order = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Order;
    if (!order.ref || !Array.isArray(order.lines)) return null;
    return order;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// URLs and WhatsApp

export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  // Preview deployments get a fresh *.vercel.app URL every push; VERCEL_URL is
  // set automatically by Vercel to that exact deployment's own host, so links
  // in an email sent from a Preview build always point back at that same
  // Preview, never at the production domain where this branch isn't live yet.
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `https://${SITE.domain}`;
}

export function adminOrderUrl(token: string): string {
  return `${siteUrl()}/admin/orders/?o=${encodeURIComponent(token)}`;
}
export function settleUrl(token: string): string {
  return `${siteUrl()}/admin/orders/settle/?o=${encodeURIComponent(token)}`;
}
export function payPageUrl(token: string): string {
  return `${siteUrl()}/pay/?i=${encodeURIComponent(token)}`;
}



/** Customer-side WhatsApp message: sent to the sales desk to confirm an order. */
export function whatsappOrderMessage(order: Order): string {
  const lines = order.lines.map((l) => `• ${l.name} ×${l.quantity} — ${aud(l.lineTotal)}`);
  return [
    `🛒 *Order ${order.ref}* — The Buggies Express`,
    ``,
    ...lines,
    ``,
    `Subtotal: ${aud(order.totals.subtotal)}`,
    order.totals.accessoryDiscount ? `Accessory bundle 5%: −${aud(order.totals.accessoryDiscount)}` : null,
    order.totals.cryptoDiscount ? `Crypto incentive 10%: −${aud(order.totals.cryptoDiscount)}` : null,
    `*Total: ${aud(order.totals.total)}* (GST incl., freight quoted separately)`,
    ``,
    `💳 Payment: ${paymentLabel(order.payment)}`,
    `👤 ${order.customer.name}${order.customer.postcode ? ` · postcode ${order.customer.postcode}` : ''}`,
    ``,
    `Please confirm my order and send the payment invoice. I'll reply here with the payment receipt once paid.`,
  ]
    .filter((x) => x !== null)
    .join('\n');
}

/** wa.me link to the sales desk with the order message prefilled. */
export function whatsappOrderUrl(order: Order): string {
  return `https://api.whatsapp.com/send?phone=${CONTACT.whatsappNumber.replace('+', '')}&text=${encodeURIComponent(whatsappOrderMessage(order))}`;
}

/** Admin-side WhatsApp invoice to the customer's phone (or a copyable text). */
export function whatsappInvoiceMessage(order: Order, payUrl: string): string {
  const inv = order.invoice;
  const pay: string[] = [];
  if (inv?.method === 'bank' && inv.bank) {
    pay.push(`🏦 *Bank transfer*`, `Account name: ${inv.bank.accountName}`, `BSB: ${inv.bank.bsb}`, `Account: ${inv.bank.accountNumber}`);
    if (inv.bank.payId) pay.push(`PayID: ${inv.bank.payId}`);
    pay.push(`Reference: ${order.ref}`);
  } else if (inv?.method === 'crypto' && inv.crypto) {
    pay.push(`🪙 *${inv.crypto.asset} (${inv.crypto.network})*`, inv.crypto.address, `Send the ${inv.crypto.asset} equivalent of ${aud(order.totals.total)}.`);
  } else if (inv?.method === 'finance4' && inv.finance4) {
    pay.push(`💳 *Finance in 4*`, inv.finance4.instructions, inv.finance4.link ?? '');
  }
  return [
    `📄 *Invoice ${order.ref}* — The Buggies Express`,
    `Hi ${order.customer.name.split(' ')[0]}, here are your payment details.`,
    ``,
    ...order.lines.map((l) => `• ${l.name} ×${l.quantity} — ${aud(l.lineTotal)}`),
    `*Total: ${aud(order.totals.total)}* (incl. GST ${aud(order.totals.gst)})`,
    `Freight: confirmed once payment is received`,
    ``,
    ...pay,
    ``,
    `Full invoice: ${payUrl}`,
    `Once paid, reply here with the receipt or a screenshot and we'll confirm your order.`,
  ]
    .filter((x) => x !== null && x !== '')
    .join('\n');
}

export function whatsappToCustomerUrl(order: Order, text: string): string {
  const phone = (order.customer.phone || '').replace(/[^\d+]/g, '');
  // Australian mobiles: 04xx -> 614xx
  const intl = phone.startsWith('+') ? phone.slice(1) : phone.startsWith('0') ? `61${phone.slice(1)}` : phone;
  return intl ? `https://api.whatsapp.com/send?phone=${intl}&text=${encodeURIComponent(text)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
