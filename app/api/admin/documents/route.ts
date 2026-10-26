import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth';
import { buildDocument, type DocInput } from '@/lib/document';
import { signOrder, adminOrderUrl, payPageUrl, whatsappInvoiceMessage, whatsappToCustomerUrl, aud } from '@/lib/orders';
import { renderDocument } from '@/lib/email/document';
import { sendMail, salesDeskAddress } from '@/lib/email/send';
import { upsertOrder, insertEnquiry, markEnquiryReplied } from '@/lib/db';

// POST /api/admin/documents/?preview=1 -> { html, incomplete }  live preview of the email
// POST /api/admin/documents/           -> builds, emails and records a quote or tax invoice
// Invoices become real orders (status invoice_sent) with a hosted /pay/ page;
// quotes are logged in the portal as an answered enquiry. Both BCC the sales desk.

export async function POST(request: Request) {
  const jar = await cookies();
  if (!verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ success: false, message: 'Not signed in.' }, { status: 401 });
  }
  const preview = new URL(request.url).searchParams.get('preview') === '1';

  let body: DocInput = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const built = buildDocument(body, { strict: !preview });
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
    try {
      if (doc.kind === 'invoice') {
        await upsertOrder(doc.order, 'Invoice created in admin');
        adminUrl = token ? adminOrderUrl(token) : undefined;
      } else {
        const o = doc.order;
        const summary = o.lines.map((l) => `${l.name} x${l.quantity}`).join('; ');
        const id = await insertEnquiry({
          formType: 'quote',
          name: o.customer.name,
          email: o.customer.email,
          phone: o.customer.phone,
          message: `Quote ${o.ref} sent by the sales desk: ${summary}. Total ${aud(o.totals.total)}.`,
          payload: { ref: o.ref, buggyModel: summary.slice(0, 160), postcode: o.customer.postcode, state: o.customer.state, source: 'admin-quote', total: o.totals.total },
        });
        if (id) await markEnquiryReplied(id, mail.subject, `Quote ${o.ref} for ${aud(o.totals.total)} emailed to ${o.customer.email}.`);
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
