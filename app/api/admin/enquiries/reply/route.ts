import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth';
import { verifyQuote } from '@/lib/quotes';
import { getEnquiry, markEnquiryReplied, markEnquiryRepliedByRef } from '@/lib/db';
import { type InvoiceDetails } from '@/lib/orders-shared';
import { contextFromEnquiry, contextFromQuote, type EnquiryContext } from '@/lib/enquiry-context';
import { draftReply } from '@/lib/reply-draft';
import { cleanPayment } from '@/lib/reply-payment';
import { renderEnquiryReply } from '@/lib/email/enquiry-reply';
import { sendMail, salesDeskAddress } from '@/lib/email/send';
import { PRODUCTS } from '@/src/config/site';

// POST /api/admin/enquiries/reply/?preview=1 -> { html }   live preview of the client's email
// POST /api/admin/enquiries/reply/?draft=1   -> { draft }  a fresh auto-drafted reply
// POST /api/admin/enquiries/reply/           -> sends the reply to the client
// Body: { source: { kind: 'enquiry', id } | { kind: 'quote', token }, subject, message,
//         quotedPrice?, productSlug?, payment? }

type Source = { kind: 'enquiry'; id: number } | { kind: 'quote'; token: string };

async function loadContext(source: Source | undefined): Promise<{ ctx: EnquiryContext; enquiryId?: number } | null> {
  if (!source) return null;
  if (source.kind === 'quote') {
    const q = verifyQuote(source.token);
    return q ? { ctx: contextFromQuote(q) } : null;
  }
  const id = Number(source.id);
  if (!Number.isInteger(id) || id < 1) return null;
  const row = await getEnquiry(id);
  return row ? { ctx: contextFromEnquiry(row), enquiryId: id } : null;
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ success: false, message: 'Not signed in.' }, { status: 401 });
  }
  const url = new URL(request.url);

  let body: { source?: Source; subject?: string; message?: string; quotedPrice?: number; productSlug?: string; payment?: Partial<InvoiceDetails> } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const loaded = await loadContext(body.source);
  if (!loaded) return NextResponse.json({ success: false, message: 'That enquiry could not be found, or the quote link is invalid.' }, { status: 404 });
  const { ctx, enquiryId } = loaded;

  if (url.searchParams.get('draft') === '1') {
    return NextResponse.json({ success: true, draft: draftReply(ctx) });
  }

  const payment = cleanPayment(body.payment);
  const paymentError = payment && 'error' in payment ? payment.error : '';
  const message = String(body.message ?? '').trim().slice(0, 6000);
  const subject = String(body.subject ?? '').trim().slice(0, 200) || `Re: your enquiry (${ctx.ref})`;
  const quotedPrice = body.quotedPrice && Number.isFinite(Number(body.quotedPrice)) ? Math.max(0, Math.round(Number(body.quotedPrice))) : undefined;
  const productSlug = body.productSlug && PRODUCTS.some((p) => p.slug === body.productSlug) ? body.productSlug : undefined;

  const mail = renderEnquiryReply(ctx, { subject, message, quotedPrice, productSlug, payment: payment && !('error' in payment) ? payment : undefined });

  if (url.searchParams.get('preview') === '1') {
    const incomplete = paymentError || (!message ? 'Write or edit the reply the client will see.' : '');
    return NextResponse.json({ success: true, html: mail.html, incomplete });
  }

  if (paymentError) return NextResponse.json({ success: false, message: paymentError }, { status: 400 });
  if (!message) return NextResponse.json({ success: false, message: 'Write the reply before sending.' }, { status: 400 });
  if (!ctx.email) return NextResponse.json({ success: false, message: 'This client left no email address. Call or WhatsApp them instead.' }, { status: 400 });

  const result = await sendMail({ to: ctx.email, subject: mail.subject, html: mail.html, text: mail.text, bcc: salesDeskAddress() });

  // Only mark it answered when the email really went out (or was written to the dev outbox).
  if (result.sent || result.outboxFile) {
    try {
      if (enquiryId) await markEnquiryReplied(enquiryId, mail.subject, message);
      else await markEnquiryRepliedByRef(ctx.ref, mail.subject, message);
    } catch (e) {
      console.error('[enquiry reply] could not mark replied (email already sent):', e);
    }
  }

  return NextResponse.json({
    success: result.sent || Boolean(result.outboxFile),
    sent: result.sent,
    error: result.error,
    ...(result.outboxFile ? { outboxFile: result.outboxFile } : {}),
  });
}
