import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth';
import { buildDocument, type DocInput } from '@/lib/document';
import { signOrder, verifyOrder, adminOrderUrl, payPageUrl, whatsappInvoiceMessage, whatsappToCustomerUrl, aud } from '@/lib/orders';
import { verifyQuote } from '@/lib/quotes';
import { contextFromEnquiry } from '@/lib/enquiry-context';
import { renderDocument } from '@/lib/email/document';
import { sendMail, salesDeskAddress } from '@/lib/email/send';
import { upsertOrder, insertEnquiry, markEnquiryReplied, markEnquiryRepliedByRef, getEnquiry, getOrder } from '@/lib/db';

// POST /api/admin/documents/?preview=1 -> { html, incomplete }  live preview of the email
// POST /api/admin/documents/           -> builds, emails and records a quote or tax invoice
// Invoices become real orders (status invoice_sent) with a hosted /pay/ page;
// quotes are logged in the portal as an answered enquiry. Both BCC the sales desk.
//
// A document built from something the client sent keeps that thing's reference
// and closes it off, so nothing is duplicated:
//   source { type:'order', token }  -> the same order, now invoice_sent
//   source { type:'quote', token }  -> the quote request, marked answered
//   source { type:'enquiry', id }   -> the portal enquiry, marked answered

type Source = { type: 'order'; token: string } | { type: 'quote'; token: string } | { type: 'enquiry'; id: number };
type Body = DocInput & { source?: Source };

interface Resolved {
  ref?: string;
  createdAt?: string;
  orderRef?: string;
  quoteRef?: string;
  enquiryId?: number;
}

async function resolveSource(src: Source | undefined, kind: string | undefined): Promise<Resolved | { error: string }> {
  if (!src) return {};
  if (src.type === 'order') {
    const order = verifyOrder(src.token);
    if (!order) return { error: 'That order link is invalid.' };
    // The database is the live source of truth for status: never regress a paid order.
    const live = await getOrder(order.ref).catch(() => null);
    if (live && (live.status === 'paid' || live.status === 'dispatched')) return { error: `This order is already marked ${live.status}.` };
    return kind === 'invoice' ? { ref: order.ref, createdAt: order.createdAt, orderRef: order.ref } : {};
  }
  if (src.type === 'quote') {
    const q = verifyQuote(src.token);
    if (!q) return { error: 'That quote-request link is invalid.' };
    return { ref: kind === 'quote' ? q.ref : undefined, createdAt: kind === 'quote' ? q.createdAt : undefined, quoteRef: q.ref };
  }
  const id = Number(src.id);
  if (!Number.isInteger(id) || id < 1) return { error: 'That enquiry could not be found.' };
  const row = await getEnquiry(id).catch(() => null);
  if (!row) return { error: 'That enquiry could not be found.' };
  const ctx = contextFromEnquiry(row);
  return { ref: kind === 'quote' ? ctx.ref : undefined, createdAt: kind === 'quote' ? ctx.receivedAt : undefined, enquiryId: id };
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ success: false, message: 'Not signed in.' }, { status: 401 });
  }
  const preview = new URL(request.url).searchParams.get('preview') === '1';

  let body: Body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const resolved = await resolveSource(body.source, body.kind);
  if ('error' in resolved) return NextResponse.json({ success: false, message: resolved.error }, { status: 400 });

  const built = buildDocument(body, { strict: !preview, ref: resolved.ref, createdAt: resolved.createdAt });
  if (!built.doc) return NextResponse.json({ success: false, message: built.error ?? 'Could not build the document.' }, { status: 400 });
  const { doc } = built;
  const token = doc.kind === 'invoice' && doc.order.invoice ? signOrder(doc.order) : undefined;
  const mail = renderDocument({ ...doc, payToken: token });

  if (preview) return NextResponse.json({ success: true, html: mail.html, incomplete: built.incomplete ?? '' });

  const result = await sendMail({ to: doc.order.customer.email, subject: mail.subject, html: mail.html, text: mail.text, bcc: salesDeskAddress() });
  const delivered = result.sent || Boolean(result.outboxFile);

  // Record it only when the email really went out (or was written to the dev outbox).
  let adminUrl: string | undefined;
  if (delivered) {
    const o = doc.order;
    const note = `${doc.kind === 'invoice' ? 'Tax invoice' : 'Quote'} ${o.ref} for ${aud(o.totals.total)} emailed to ${o.customer.email}.`;
    try {
      if (doc.kind === 'invoice') {
        await upsertOrder(o, resolved.orderRef ? 'Invoice sent from the admin builder' : 'Invoice created in admin');
        adminUrl = token ? adminOrderUrl(token) : undefined;
      }
      if (resolved.enquiryId) await markEnquiryReplied(resolved.enquiryId, mail.subject, note);
      else if (resolved.quoteRef) await markEnquiryRepliedByRef(resolved.quoteRef, mail.subject, note);
      else if (doc.kind === 'quote') {
        const summary = o.lines.map((l) => `${l.name} x${l.quantity}`).join('; ');
        const id = await insertEnquiry({
          formType: 'quote',
          name: o.customer.name,
          email: o.customer.email,
          phone: o.customer.phone,
          message: `Quote ${o.ref} sent by the sales desk: ${summary}. Total ${aud(o.totals.total)}.`,
          payload: { ref: o.ref, buggyModel: summary.slice(0, 160), postcode: o.customer.postcode, state: o.customer.state, source: 'admin-quote', total: o.totals.total },
        });
        if (id) await markEnquiryReplied(id, mail.subject, note);
      }
    } catch (e) {
      console.error('[admin document] could not record (email already sent):', e);
    }
  }

  const payUrl = token ? payPageUrl(token) : undefined;
  const waText = doc.kind === 'invoice' && payUrl ? whatsappInvoiceMessage(doc.order, payUrl) : undefined;
  return NextResponse.json({
    success: delivered,
    sent: result.sent,
    error: result.error,
    kind: doc.kind,
    ref: doc.order.ref,
    to: doc.order.customer.email,
    ...(payUrl ? { payUrl } : {}),
    ...(adminUrl ? { adminUrl } : {}),
    ...(waText ? { whatsappUrl: whatsappToCustomerUrl(doc.order, waText) } : {}),
    ...(result.outboxFile ? { outboxFile: result.outboxFile } : {}),
  });
}
