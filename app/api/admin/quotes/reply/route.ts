import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth';
import { verifyQuote } from '@/lib/quotes';
import { type InvoiceDetails } from '@/lib/orders-shared';
import { renderQuoteReply } from '@/lib/email/quote-reply';
import { sendMail, salesDeskAddress } from '@/lib/email/send';
import { CRYPTO } from '@/src/config/site';

// POST /api/admin/quotes/reply/?preview=1  -> { html }   (live preview)
// POST /api/admin/quotes/reply/            -> sends the reply to the client
// Body: { token, message, quotedPrice?, payment?: Partial<InvoiceDetails> }

function cleanPayment(raw: Partial<InvoiceDetails> | undefined): InvoiceDetails | undefined | { error: string } {
  if (!raw || !raw.method) return undefined; // payment details are optional on a quote reply
  const method = raw.method;
  if (method !== 'bank' && method !== 'crypto' && method !== 'finance4') return { error: 'Choose a payment method or remove the payment section.' };
  const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
  const inv: InvoiceDetails = { issuedAt: new Date().toISOString(), method };

  if (method === 'bank') {
    const b: Partial<NonNullable<InvoiceDetails['bank']>> = raw.bank ?? {};
    const accountName = s(b.accountName, 80);
    const bsb = s(b.bsb, 12).replace(/[^\d-]/g, '');
    const accountNumber = s(b.accountNumber, 20).replace(/[^\d]/g, '');
    if (!accountName || !/^\d{3}-?\d{3}$/.test(bsb) || accountNumber.length < 5) return { error: 'Bank transfer needs an account name, a 6-digit BSB and an account number.' };
    inv.bank = { accountName, bsb: bsb.includes('-') ? bsb : `${bsb.slice(0, 3)}-${bsb.slice(3)}`, accountNumber, payId: s(b.payId, 80) || undefined };
  }
  if (method === 'crypto') {
    const w = CRYPTO.wallets.find((x) => x.key === raw.crypto?.walletKey);
    if (!w) return { error: 'Pick one of the configured settlement wallets.' };
    inv.crypto = { walletKey: w.key, asset: w.asset, network: w.network, address: w.address };
  }
  if (method === 'finance4') {
    const instructions = s(raw.finance4?.instructions, 600);
    const link = s(raw.finance4?.link, 300);
    if (!instructions) return { error: 'Finance in 4 needs the instructions the buyer should follow.' };
    if (link && !/^https:\/\//.test(link)) return { error: 'The Finance in 4 link must start with https://' };
    inv.finance4 = { instructions, link: link || undefined };
  }
  return inv;
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ success: false, message: 'Not signed in.' }, { status: 401 });
  }
  const url = new URL(request.url);
  const preview = url.searchParams.get('preview') === '1';

  let body: { token?: string; message?: string; quotedPrice?: number; payment?: Partial<InvoiceDetails> } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }
  const quote = verifyQuote(body.token);
  if (!quote) return NextResponse.json({ success: false, message: 'Invalid or expired quote link.' }, { status: 400 });

  const payment = cleanPayment(body.payment);
  if (payment && 'error' in payment) {
    if (preview) {
      const draft = renderQuoteReply(quote, { message: body.message || '', quotedPrice: body.quotedPrice, payment: undefined });
      return NextResponse.json({ success: true, html: draft.html, incomplete: payment.error });
    }
    return NextResponse.json({ success: false, message: payment.error }, { status: 400 });
  }

  const message = String(body.message ?? '').trim().slice(0, 4000);
  const quotedPrice = body.quotedPrice && Number.isFinite(Number(body.quotedPrice)) ? Math.max(0, Math.round(Number(body.quotedPrice))) : undefined;

  const mail = renderQuoteReply(quote, { message, quotedPrice, payment: payment || undefined });

  if (preview) return NextResponse.json({ success: true, html: mail.html, incomplete: message ? '' : 'Type the reply message the client will see.' });

  if (!message) return NextResponse.json({ success: false, message: 'Type the reply message before sending.' }, { status: 400 });

  const result = await sendMail({ to: quote.customer.email, subject: mail.subject, html: mail.html, text: mail.text, bcc: salesDeskAddress() });

  return NextResponse.json({
    success: result.sent || Boolean(result.outboxFile),
    sent: result.sent,
    error: result.error,
    ...(result.outboxFile ? { outboxFile: result.outboxFile } : {}),
  });
}
