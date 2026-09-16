import { NextResponse } from 'next/server';
import {
  type Order,
  type OrderChannel,
  type PaymentChannel,
  computeTotals,
  newOrderRef,
  priceLines,
  signOrder,
  stateFromPostcode,
  whatsappOrderUrl,
} from '@/lib/orders';
import { renderOrderConfirmation } from '@/lib/email/order-confirmation';
import { renderAdminNewOrder } from '@/lib/email/admin-new-order';
import { sendMail, salesDeskAddress } from '@/lib/email/send';
import { upsertOrder } from '@/lib/db';

// POST /api/orders/ - the cart's order submission.
//
// Prices are recomputed from PRODUCTS; the client only sends ids and
// quantities. Two emails go out at once: the customer's confirmation and the
// sales desk's copy carrying the signed "View in Admin" link. The response
// gives the client its order reference and, for WhatsApp checkout, the
// prefilled message URL. The admin token is never returned to the browser.

const PAYMENTS: PaymentChannel[] = ['standard', 'finance4', 'crypto'];
const CHANNELS: OrderChannel[] = ['invoice', 'whatsapp', 'crypto'];
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
  const payment = PAYMENTS.includes(body.payment as PaymentChannel) ? (body.payment as PaymentChannel) : 'standard';
  const channel = CHANNELS.includes(body.channel as OrderChannel) ? (body.channel as OrderChannel) : 'invoice';
  const rawItems = Array.isArray(body.items) ? (body.items as { id: string; quantity: number }[]) : [];

  if (!name) return NextResponse.json({ success: false, message: 'Please enter your full name.' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ success: false, message: 'A valid email address is required so we can send your confirmation.' }, { status: 400 });

  const lines = priceLines(rawItems.slice(0, 30));
  if (!lines.length) return NextResponse.json({ success: false, message: 'Your cart is empty.' }, { status: 400 });

  const order: Order = {
    ref: typeof body.ref === 'string' && /^BE-\d{6}-[A-Z0-9]{4}$/.test(body.ref) ? body.ref : newOrderRef(),
    createdAt: new Date().toISOString(),
    status: 'new',
    channel,
    payment,
    customer: { name, email, phone, postcode, state: stateFromPostcode(postcode) },
    lines,
    totals: computeTotals(lines, payment),
  };

  const token = signOrder(order);
  const confirmation = renderOrderConfirmation(order);
  const adminMail = renderAdminNewOrder(order, token);

  const [customerResult, adminResult] = await Promise.all([
    sendMail({ to: email, subject: confirmation.subject, html: confirmation.html, text: confirmation.text }),
    sendMail({ to: salesDeskAddress(), subject: adminMail.subject, html: adminMail.html, text: adminMail.text, replyTo: email }),
    upsertOrder(order, 'Order placed'),
  ]);

  return NextResponse.json({
    success: true,
    ref: order.ref,
    total: order.totals.total,
    whatsappUrl: whatsappOrderUrl(order),
    email: { customer: customerResult.sent, salesDesk: adminResult.sent },
    ...(process.env.NODE_ENV !== 'production' ? { dev: { customerOutbox: customerResult.outboxFile, adminOutbox: adminResult.outboxFile } } : {}),
  });
}
