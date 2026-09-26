// Quote request model: a client asking for an official tax quote on a
// model, signed the same way as an order (lib/orders.ts) so a "Reply to
// client" link in the admin notification email can carry the client's
// details without a database round trip. `kind: 'quote'` and the `QT-`
// ref prefix stop an order token from ever being accepted here, or vice
// versa, even though both use the same signing secret.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { InvoiceDetails } from './orders-shared';
import { siteUrl } from './orders';

export interface QuoteRequest {
  kind: 'quote';
  ref: string;
  createdAt: string;
  customer: { name: string; email: string; phone?: string; postcode?: string; state?: string };
  buggyModel?: string;
  deliveryPreference?: string;
  notes?: string;
}

/** The admin's typed answer, optionally with payment details, once sent. */
export interface QuoteReply {
  sentAt: string;
  message: string;
  quotedPrice?: number;
  payment?: InvoiceDetails;
}

function secret(): string {
  const s = process.env.ORDER_SIGNING_SECRET;
  if (!s || s.length < 16) throw new Error('ORDER_SIGNING_SECRET is not set (min 16 chars)');
  return s;
}

const b64u = (b: Buffer) => b.toString('base64url');

export function newQuoteRef(now = new Date()): string {
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `QT-${stamp}-${randomBytes(5).toString('hex').toUpperCase()}`;
}

export function signQuote(quote: QuoteRequest): string {
  const payload = b64u(Buffer.from(JSON.stringify(quote), 'utf8'));
  const sig = b64u(createHmac('sha256', secret()).update(`quote:${payload}`).digest());
  return `${payload}.${sig}`;
}

export function verifyQuote(token: string | null | undefined): QuoteRequest | null {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = b64u(createHmac('sha256', secret()).update(`quote:${payload}`).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const quote = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as QuoteRequest;
    if (quote.kind !== 'quote' || !quote.ref?.startsWith('QT-') || !quote.customer?.email) return null;
    return quote;
  } catch {
    return null;
  }
}

export function adminQuoteReplyUrl(token: string): string {
  return `${siteUrl()}/admin/quotes/reply/?q=${encodeURIComponent(token)}`;
}
