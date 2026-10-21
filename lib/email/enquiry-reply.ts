// enquiry-reply: the branded HTML email a client receives when the sales desk
// answers any enquiry (quote, contact, wholesale, trade-in). Same visual system
// as the quote reply and the tax invoice, so everything from the desk looks like
// it comes from one company. The client's own question is quoted back so the
// reply makes sense on its own.
import { E, FONT, SERIF, emailShell, table, td, row, spacer, kv, statusBadge, esc, button } from './layout';
import { METHOD_TITLE, paymentRows } from './quote-reply';
import { type EnquiryContext, KIND_LABEL } from '@/lib/enquiry-context';
import { type InvoiceDetails, aud } from '@/lib/orders-shared';
import { siteUrl } from '@/lib/orders';
import { PRODUCTS, ABN_INFO, CONTACT } from '@/src/config/site';
import { productUrl } from '@/lib/schema';

export interface EnquiryReplyInput {
  subject: string;
  message: string;
  quotedPrice?: number;
  productSlug?: string;
  payment?: InvoiceDetails;
}

/** Plain paragraphs to HTML: blank line = new paragraph, single newline = line break. */
function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${E.ink};">${esc(p).replace(/\n/g, '<br />').replace(/(https?:\/\/[^\s<)]+)/g, `<a href="$1" style="color:${E.navy};text-decoration:underline;">$1</a>`)}</p>`)
    .join('');
}

export function renderEnquiryReply(ctx: EnquiryContext, reply: EnquiryReplyInput): { subject: string; html: string; text: string } {
  const site = siteUrl();
  const first = ctx.name.split(' ')[0] || 'there';
  const product = reply.productSlug ? PRODUCTS.find((p) => p.slug === reply.productSlug) : undefined;
  const label = KIND_LABEL[ctx.kind];
  const received = new Date(ctx.receivedAt).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', day: 'numeric', month: 'long', year: 'numeric' });

  const productCard = product
    ? row(
        E.bone,
        'padding:0 28px 12px 28px;',
        table(
          E.white,
          `<tr>
            ${td(E.white, 'padding:16px 0 16px 16px;width:120px;vertical-align:top;', product.images[0] ? `<a href="${esc(productUrl(product))}"><img src="${esc(site + product.images[0])}" width="104" alt="${esc(product.name)}" style="display:block;border:0;border-radius:8px;width:104px;height:auto;" /></a>` : '')}
            ${td(E.white, 'padding:16px;vertical-align:top;', `
              <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;padding-bottom:4px;">The model</div>
              <div style="font-family:${SERIF};font-size:18px;line-height:24px;color:${E.ink};padding-bottom:4px;">${esc(product.name)}</div>
              <div style="font-family:${FONT};font-size:14px;color:${E.ink};font-weight:700;padding-bottom:8px;">${aud(product.price_aud)} <span style="font-weight:400;color:${E.muted};">incl. GST · freight quoted to your postcode</span></div>
              <a href="${esc(productUrl(product))}" style="font-family:${FONT};font-size:13px;color:${E.navy};text-decoration:underline;">See photos and full details</a>
            `)}
          </tr>`,
          `border-radius:12px;border:1px solid ${E.line};`
        ),
        'class="be-pad"'
      )
    : '';

  const quoted = ctx.message.trim()
    ? row(
        E.bone,
        'padding:0 28px 12px 28px;',
        table(
          E.bone,
          `<tr>${td(E.bone, `padding:12px 16px;border-left:3px solid ${E.gold};`, `
            <div style="font-family:${FONT};font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${E.muted};padding-bottom:4px;">Your message, ${esc(received)}</div>
            <div style="font-family:${FONT};font-size:13px;line-height:20px;color:${E.muted};white-space:pre-wrap;">${esc(ctx.message.length > 700 ? `${ctx.message.slice(0, 700)}…` : ctx.message)}</div>
          `)}</tr>`
        ),
        'class="be-pad"'
      )
    : '';

  const body = `
    ${row(
      E.navy,
      'padding:6px 28px 24px 28px;text-align:center;',
      `${statusBadge(label)}
       <h1 class="be-h1" style="margin:16px 0 6px 0;font-family:${SERIF};font-size:28px;line-height:34px;color:${E.white};">${esc(ctx.kind === 'quote' ? `Quote ${ctx.ref}` : `Reply to your ${label.toLowerCase()}`)}</h1>
       <p style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${E.mutedOnNavy};">Hi ${esc(first)}, here is the answer from the Yatala sales desk.</p>`,
      'class="be-pad"'
    )}
    ${quoted ? spacer(E.bone, 20) : ''}
    ${quoted}
    ${row(
      E.bone,
      `padding:${quoted ? '4px' : '24px'} 28px 12px 28px;`,
      table(
        E.white,
        `<tr>${td(E.white, 'padding:22px 24px 8px 24px;', paragraphs(reply.message))}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${productCard}
    ${
      reply.quotedPrice
        ? row(
            E.bone,
            'padding:0 28px 12px 28px;',
            table(
              E.white,
              `<tr>${td(E.white, 'padding:12px 22px 4px 22px;', table(E.white, kv('Quoted price', `${aud(reply.quotedPrice)} incl. GST`, { strong: true }) + kv('Reference', esc(ctx.ref), { mono: true, strong: true })))}</tr>`,
              `border-radius:12px;border:1px solid ${E.line};`
            ),
            'class="be-pad"'
          )
        : ''
    }
    ${
      reply.payment
        ? row(
            E.bone,
            'padding:0 28px 12px 28px;',
            table(
              E.navySoft,
              `<tr>${td(E.navySoft, 'padding:20px 22px 12px 22px;', `
                <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.goldLight};font-weight:700;">How to pay</div>
                <div style="font-family:${SERIF};font-size:20px;color:${E.white};padding:6px 0 12px 0;">${esc(METHOD_TITLE[reply.payment.method])}</div>
                ${table(E.navySoft, paymentRows(reply.payment, ctx.ref))}
                <div style="font-family:${FONT};font-size:12px;line-height:18px;color:${E.mutedOnNavy};padding-top:8px;">Once paid, send the receipt or a screenshot on WhatsApp <a href="${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Payment receipt for ${ctx.ref}`)}" style="color:${E.goldLight};">${esc(CONTACT.phoneDisplay)}</a> and we confirm your order.</div>
              `)}</tr>`,
              `border-radius:12px;border:1px solid ${E.gold};`
            ),
            'class="be-pad"'
          )
        : ''
    }
    ${row(
      E.bone,
      'padding:8px 28px 26px 28px;text-align:center;',
      `${button(`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi, following up on ${ctx.ref}.`)}`, 'Reply on WhatsApp', { full: true })}
       <div style="padding-top:12px;font-family:${FONT};font-size:12px;line-height:18px;color:${E.muted};">Or reply to this email · <a href="mailto:${CONTACT.email}" style="color:${E.navy};">${CONTACT.email}</a> · ${esc(CONTACT.phoneDisplay)}<br />${esc(ABN_INFO.companyName)} · ABN ${esc(ABN_INFO.abn)} · Yatala QLD 4207</div>`,
      'class="be-pad"'
    )}`;

  const html = emailShell({
    title: reply.subject,
    preheader: reply.quotedPrice ? `${aud(reply.quotedPrice)} · reply from the Yatala sales desk` : 'Reply from the Yatala sales desk',
    headerNote: ctx.kind === 'quote' ? 'Official quote reply' : 'Sales desk reply',
    body,
    siteUrl: site,
    logoUrl: `${site}/brand/logo-mark-192.png`,
  });

  const payLines: string[] = [];
  if (reply.payment?.method === 'bank' && reply.payment.bank) payLines.push(`Account name: ${reply.payment.bank.accountName}`, `BSB: ${reply.payment.bank.bsb}`, `Account: ${reply.payment.bank.accountNumber}`, reply.payment.bank.payId ? `PayID: ${reply.payment.bank.payId}` : '', `Reference: ${ctx.ref}`);
  if (reply.payment?.method === 'crypto' && reply.payment.crypto) payLines.push(`${reply.payment.crypto.asset} (${reply.payment.crypto.network}): ${reply.payment.crypto.address}`);
  if (reply.payment?.method === 'finance4' && reply.payment.finance4) payLines.push(reply.payment.finance4.instructions, reply.payment.finance4.link ?? '');

  const text = [
    reply.message,
    '',
    product ? `${product.name}: ${aud(product.price_aud)} incl. GST - ${productUrl(product)}` : '',
    reply.quotedPrice ? `Quoted price: ${aud(reply.quotedPrice)} incl. GST (ref ${ctx.ref})` : '',
    ...payLines.filter(Boolean),
    '',
    `WhatsApp ${CONTACT.phoneDisplay} - ${ABN_INFO.companyName}, ABN ${ABN_INFO.abn}`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return { subject: reply.subject, html, text };
}
