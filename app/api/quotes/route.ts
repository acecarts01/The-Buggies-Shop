import { NextResponse } from 'next/server';
import { newQuoteRef, signQuote, type QuoteRequest } from '@/lib/quotes';
import { stateFromPostcode } from '@/lib/orders';
import type { PaymentChannel } from '@/lib/orders-shared';
import { renderQuoteRequest } from '@/lib/email/quote-request';
import { sendMail, salesDeskAddress } from '@/lib/email/send';

const PAYMENTS: PaymentChannel[] = ['standard', 'finance4', 'crypto'];

// POST /api/quotes/ - a client's "Request Formal Tax Quote" submission.
//
// Sends the branded admin notification (with the "Reply to Client" button)
// to the sales desk and waits for that attempt to finish before responding,
// so the site only opens WhatsApp once the quote has actually reached the
// inbox (or definitively failed to) rather than racing a fire-and-forget
// request against a fixed timeout.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim().slice(0, 120);
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 160);
  const phone = String(body.phone ?? '').trim().slice(0, 40) || undefined;
  const postcode = String(body.postcode ?? '').trim().slice(0, 4) || undefined;
  const buggyModel = String(body.buggyModel ?? '').trim().slice(0, 160) || undefined;
  const deliveryPreference = String(body.deliveryPreference ?? '').trim().slice(0, 120) || undefined;
  const paymentPreference = PAYMENTS.includes(body.paymentPreference as PaymentChannel) ? (body.paymentPreference as PaymentChannel) : undefined;
  const notes = String(body.notes ?? '').trim().slice(0, 600) || undefined;

  if (!name) return NextResponse.json({ success: false, message: 'Please enter your full name.' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ success: false, message: 'A valid email address is required so we can send your official quote.' }, { status: 400 });

  const quote: QuoteRequest = {
    kind: 'quote',
    ref: newQuoteRef(),
    createdAt: new Date().toISOString(),
    customer: { name, email, phone, postcode, state: stateFromPostcode(postcode) },
    buggyModel,
    deliveryPreference,
    paymentPreference,
    notes,
  };

  const token = signQuote(quote);
  const mail = renderQuoteRequest(quote, token);

  const result = await sendMail({ to: salesDeskAddress(), subject: mail.subject, html: mail.html, text: mail.text, replyTo: email });

  return NextResponse.json({
    success: true,
    ref: quote.ref,
    emailSent: result.sent,
    emailError: result.error,
  });
}
