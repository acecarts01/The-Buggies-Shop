// One shape for "a client asked us something", whichever form it came from.
// The reply terminal, the draft writer and the reply email all work from this,
// so a quote request (signed email link), a contact, wholesale or trade-in
// enquiry (database row) are answered the same way.
import type { PaymentChannel } from './orders-shared';
import type { QuoteRequest } from './quotes';
import type { EnquiryRow } from './db';
import { stateFromPostcode } from './orders-shared';

export type EnquiryKind = 'quote' | 'contact' | 'wholesale' | 'tradein' | 'other';

export interface EnquiryContext {
  /** Shown to the client and used as the payment reference. QT-… for quotes, EQ-<id> otherwise. */
  ref: string;
  kind: EnquiryKind;
  receivedAt: string;
  name: string;
  email: string;
  phone?: string;
  postcode?: string;
  state?: string;
  /** The model the client named, if any. */
  model?: string;
  deliveryPreference?: string;
  paymentPreference?: PaymentChannel;
  organization?: string;
  fleetType?: string;
  quantity?: string;
  /** The client's own words, exactly as submitted. */
  message: string;
  /** The subject line they chose, if the form had one. */
  subject?: string;
}

const str = (v: unknown, max = 2000): string | undefined => {
  const s = typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '';
  return s ? s.slice(0, max) : undefined;
};

export const KIND_LABEL: Record<EnquiryKind, string> = {
  quote: 'Quote request',
  contact: 'Enquiry',
  wholesale: 'Wholesale / fleet enquiry',
  tradein: 'Trade-in enquiry',
  other: 'Enquiry',
};

export function contextFromQuote(q: QuoteRequest): EnquiryContext {
  return {
    ref: q.ref,
    kind: 'quote',
    receivedAt: q.createdAt,
    name: q.customer.name,
    email: q.customer.email,
    phone: q.customer.phone,
    postcode: q.customer.postcode,
    state: q.customer.state ?? stateFromPostcode(q.customer.postcode),
    model: q.buggyModel,
    deliveryPreference: q.deliveryPreference,
    paymentPreference: q.paymentPreference,
    message: q.notes ?? '',
  };
}

export function contextFromEnquiry(e: EnquiryRow): EnquiryContext {
  const p = e.payload ?? {};
  const kind: EnquiryKind = (['quote', 'contact', 'wholesale', 'tradein'] as const).find((k) => k === e.formType) ?? 'other';
  const postcode = str(p.postcode, 4);
  const pay = str(p.paymentPreference, 20);
  return {
    ref: str(p.ref, 40) ?? `EQ-${String(e.id).padStart(5, '0')}`,
    kind,
    receivedAt: e.createdAt,
    name: e.name,
    email: e.email ?? '',
    phone: e.phone ?? undefined,
    postcode,
    state: str(p.state, 8) ?? stateFromPostcode(postcode),
    model: str(p.buggyModel, 160),
    deliveryPreference: str(p.deliveryPreference, 120),
    paymentPreference: pay === 'standard' || pay === 'finance4' || pay === 'crypto' ? pay : undefined,
    organization: str(p.organization, 160),
    fleetType: str(p.fleetType, 160),
    quantity: str(p.quantity, 40),
    message: e.message ?? '',
    subject: str(p.subject, 200),
  };
}
