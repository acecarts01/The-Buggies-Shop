// quote-reply: the branded email a client receives when the sales desk
// answers their quote request. Same visual system as the tax invoice
// (official-client-invoice.ts) so a client who later gets an actual
// invoice recognises the same company sending it.
import { E, FONT, SERIF, emailShell, table, td, row, kv, statusBadge, esc, button } from './layout';
import { type QuoteRequest } from '@/lib/quotes';
import { type InvoiceDetails, aud, stateFromPostcode } from '@/lib/orders-shared';
import { siteUrl } from '@/lib/orders';
import { ABN_INFO, CONTACT } from '@/src/config/site';

/** Selectable, monospace value box - same treatment as the tax invoice. */
function valueBox(label: string, value: string): string {
  return `<tr>${td(E.navySoft, 'padding:0 0 8px 0;', `
    <div style="font-family:${FONT};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${E.mutedOnNavy};padding-bottom:4px;">${esc(label)}</div>
    ${table(E.navyDeep, `<tr>${td(E.navyDeep, `padding:10px 12px;border:1px solid ${E.gold};border-radius:8px;font-family:'Courier New',Courier,monospace;font-size:14px;color:${E.white};word-break:break-all;`, esc(value))}</tr>`, 'border-radius:8px;')}
  `)}</tr>`;
}

const METHOD_TITLE = { bank: 'Bank transfer · PayID / EFT', crypto: 'Crypto settlement', finance4: 'Finance in 4' } as const;

function paymentRows(inv: InvoiceDetails, ref: string): string {
  if (inv.method === 'bank' && inv.bank) {
    return (
      valueBox('Account name', inv.bank.accountName) +
      valueBox('BSB', inv.bank.bsb) +
      valueBox('Account number', inv.bank.accountNumber) +
      (inv.bank.payId ? valueBox('PayID', inv.bank.payId) : '') +
      valueBox('Payment reference (required)', ref)
    );
  }
  if (inv.method === 'crypto' && inv.crypto) {
    return valueBox(`${inv.crypto.asset} · ${inv.crypto.network}`, inv.crypto.address);
  }
  if (inv.method === 'finance4' && inv.finance4) {
    return (
      `<tr>${td(E.navySoft, `padding:0 0 10px 0;font-family:${FONT};font-size:13px;line-height:20px;color:${E.white};`, esc(inv.finance4.instructions))}</tr>` +
      (inv.finance4.link ? `<tr>${td(E.navySoft, 'padding:0 0 8px 0;', button(inv.finance4.link, 'Open your Finance in 4 plan', { full: true }))}</tr>` : '')
    );
  }
  return '';
}

export function renderQuoteReply(
  quote: QuoteRequest,
  reply: { message: string; quotedPrice?: number; payment?: InvoiceDetails }
): { subject: string; html: string; text: string } {
  const c = quote.customer;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const site = siteUrl();
  const first = c.name.split(' ')[0];

  const body = `
    ${row(
      E.navy,
      'padding:6px 28px 24px 28px;text-align:center;',
      `${statusBadge('Your quote')}
       <h1 class="be-h1" style="margin:16px 0 6px 0;font-family:${SERIF};font-size:28px;line-height:34px;color:${E.white};">Quote ${esc(quote.ref)}</h1>
       <p style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${E.mutedOnNavy};">Hi ${esc(first)} — here's your answer from the Yatala sales desk.</p>`,
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:24px 28px 8px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:18px 22px 10px 22px;', `
          ${table(
            E.white,
            kv('Model', esc(quote.buggyModel || 'As discussed')) +
              kv('Deliver to', c.postcode ? `Postcode ${esc(c.postcode)}${state ? ` (${esc(state)})` : ''}` : 'To be confirmed') +
              (reply.quotedPrice ? kv('Quoted price', aud(reply.quotedPrice), { strong: true }) : '') +
              kv('Reference', esc(quote.ref), { mono: true, strong: true })
          )}
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:8px 28px 8px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:18px 22px 18px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;padding-bottom:8px;">From the sales desk</div>
          <div style="font-family:${FONT};font-size:14px;line-height:22px;color:${E.ink};white-space:pre-wrap;">${esc(reply.message)}</div>
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${
      reply.payment
        ? row(
            E.bone,
            'padding:8px 28px 8px 28px;',
            table(
              E.navySoft,
              `<tr>${td(E.navySoft, 'padding:20px 22px 12px 22px;', `
                <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.goldLight};font-weight:700;">Payment settlement</div>
                <div style="font-family:${SERIF};font-size:20px;color:${E.white};padding:6px 0 12px 0;">${esc(METHOD_TITLE[reply.payment.method])}</div>
                ${table(E.navySoft, paymentRows(reply.payment, quote.ref))}
                <div style="font-family:${FONT};font-size:12px;line-height:18px;color:${E.mutedOnNavy};padding-top:8px;">Once paid, send the receipt or a screenshot on WhatsApp <a href="${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Payment receipt for quote ${quote.ref}`)}" style="color:${E.goldLight};">${esc(CONTACT.phoneDisplay)}</a> and we confirm your order.</div>
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
      `${button(CONTACT.whatsappUrl + `?text=${encodeURIComponent(`Hi, following up on quote ${quote.ref}.`)}`, 'Message the sales desk on WhatsApp', { full: true })}
       <div style="padding-top:12px;font-family:${FONT};font-size:12px;line-height:18px;color:${E.muted};">Questions? <a href="mailto:${CONTACT.email}" style="color:${E.navy};">${CONTACT.email}</a> · ${esc(CONTACT.phoneDisplay)}</div>`,
      'class="be-pad"'
    )}`;

  const html = emailShell({
    title: `Your quote ${quote.ref} — The Buggies Express`,
    preheader: reply.quotedPrice ? `${aud(reply.quotedPrice)} — reply from the Yatala sales desk` : 'Reply from the Yatala sales desk',
    headerNote: 'Official quote reply',
    body,
    siteUrl: site,
    logoUrl: `${site}/brand/logo-mark-192.png`,
  });

  const payLines: string[] = [];
  if (reply.payment?.method === 'bank' && reply.payment.bank) payLines.push(`Account name: ${reply.payment.bank.accountName}`, `BSB: ${reply.payment.bank.bsb}`, `Account: ${reply.payment.bank.accountNumber}`, reply.payment.bank.payId ? `PayID: ${reply.payment.bank.payId}` : '', `Reference: ${quote.ref}`);
  if (reply.payment?.method === 'crypto' && reply.payment.crypto) payLines.push(`${reply.payment.crypto.asset} (${reply.payment.crypto.network}): ${reply.payment.crypto.address}`);
  if (reply.payment?.method === 'finance4' && reply.payment.finance4) payLines.push(reply.payment.finance4.instructions, reply.payment.finance4.link ?? '');

  const text = [
    `QUOTE ${quote.ref} — ${ABN_INFO.companyName}`,
    quote.buggyModel ? `Model: ${quote.buggyModel}` : '',
    reply.quotedPrice ? `Quoted price: ${aud(reply.quotedPrice)}` : '',
    ``,
    reply.message,
    ``,
    ...payLines.filter(Boolean),
    ``,
    `WhatsApp: ${CONTACT.phoneDisplay}`,
  ]
    .filter((l) => l !== '')
    .join('\n');

  return { subject: `Your quote ${quote.ref}${reply.quotedPrice ? ` — ${aud(reply.quotedPrice)}` : ''} — The Buggies Express`, html, text };
}
