// document: the quote or tax invoice the sales desk builds in /admin/invoice/.
// One template for both kinds, in the same visual system as the order
// confirmation and the settlement invoice (navy header, white cards, gold
// rules, bulletproof tables), so everything from the desk reads as one company.
import { E, FONT, SERIF, emailShell, table, td, row, kv, statusBadge, esc, button } from './layout';
import { ledgerRows, totalsRows } from './order-confirmation';
import { settlementRows } from './official-client-invoice';
import { METHOD_TITLE } from './quote-reply';
import { type Order, aud, siteUrl, payPageUrl, stateFromPostcode } from '@/lib/orders';
import { orderPlan, planLines } from '@/lib/pay-in-4';
import { ABN_INFO, CONTACT } from '@/src/config/site';
import type { DocKind } from '@/lib/document';

export interface DocumentMail {
  kind: DocKind;
  order: Order;
  validUntil?: string;
  message: string;
  afterPayment: string;
  subject: string;
  /** Signed token for the hosted /pay/ page (invoices only). */
  payToken?: string;
}

const date = (iso: string) => new Date(iso).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'long' });

/** Plain paragraphs to HTML: blank line = new paragraph, single newline = line break. */
function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${E.ink};">${esc(p).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function steps(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim().replace(/^\d+[.)]\s*/, ''))
    .filter(Boolean);
}

export function renderDocument(d: DocumentMail): { subject: string; html: string; text: string } {
  const { order, kind } = d;
  const c = order.customer;
  const inv = order.invoice;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const site = siteUrl();
  const first = c.name.split(' ')[0] || 'there';
  const isInvoice = kind === 'invoice';
  const label = isInvoice ? 'Invoice' : 'Quote';
  const hasFreightLine = order.lines.some((l) => /freight|delivery/i.test(l.name));
  const plan = orderPlan(order);
  const payUrl = d.payToken ? payPageUrl(d.payToken) : '';
  const afterSteps = steps(d.afterPayment);

  const billTo = [c.company ? `<strong>${esc(c.company)}</strong>` : '', esc(c.name), c.address ? esc(c.address) : '', `<a href="mailto:${esc(c.email)}" style="color:${E.navy};">${esc(c.email)}</a>`, c.phone ? esc(c.phone) : '']
    .filter(Boolean)
    .join('<br />');

  const body = `
    ${row(
      E.navy,
      'padding:6px 28px 24px 28px;text-align:center;',
      `${statusBadge(isInvoice ? 'Tax invoice · payment due' : `Quote · valid until ${d.validUntil ? date(d.validUntil) : ''}`)}
       <h1 class="be-h1" style="margin:16px 0 6px 0;font-family:${SERIF};font-size:28px;line-height:34px;color:${E.white};">${label} ${esc(order.ref)}</h1>
       <p style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${E.mutedOnNavy};">Hi ${esc(first)}, ${
         isInvoice ? 'your tax invoice is below. Settle using the details and we book dispatch.' : 'here is your quote from the Yatala sales desk. Everything you need to accept it is below.'
       }</p>`,
      'class="be-pad"'
    )}
    ${
      d.message
        ? row(
            E.bone,
            'padding:24px 28px 4px 28px;',
            table(E.white, `<tr>${td(E.white, 'padding:20px 22px 8px 22px;', paragraphs(d.message))}</tr>`, `border-radius:12px;border:1px solid ${E.line};`),
            'class="be-pad"'
          )
        : ''
    }
    ${row(
      E.bone,
      `padding:${d.message ? '12px' : '24px'} 28px 8px 28px;`,
      table(
        E.white,
        `<tr>${td(E.white, 'padding:18px 22px 10px 22px;', `
          ${table(
            E.white,
            kv(isInvoice ? 'Invoice to' : 'Prepared for', billTo) +
              kv('Deliver to', c.postcode ? `Postcode ${esc(c.postcode)}${state ? ` (${esc(state)})` : ''}` : 'To be confirmed') +
              kv('Issued', esc(date(order.createdAt))) +
              (isInvoice ? kv('Payment', 'Due on receipt') : kv('Valid until', esc(d.validUntil ? date(d.validUntil) : ''))) +
              kv('Supplier', `${esc(ABN_INFO.companyName)}<br />ABN ${esc(ABN_INFO.abn)} · Yatala QLD 4207`) +
              kv(`${label} reference`, esc(order.ref), { mono: true, strong: true })
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
        `<tr>${td(E.white, 'padding:18px 22px 6px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;">Itemised</div>
          ${table(E.white, ledgerRows(order) + totalsRows(order, { freight: hasFreightLine ? 'Included in the items above' : 'Quoted against your postcode' }))}
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${
      inv
        ? row(
            E.bone,
            'padding:8px 28px 8px 28px;',
            table(
              E.navySoft,
              `<tr>${td(E.navySoft, 'padding:20px 22px 12px 22px;', `
                <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.goldLight};font-weight:700;">${isInvoice ? 'Payment details' : 'How to pay when you accept'}</div>
                <div style="font-family:${SERIF};font-size:20px;color:${E.white};padding:6px 0 12px 0;">${esc(METHOD_TITLE[inv.method])}</div>
                ${table(E.navySoft, settlementRows(order))}
                ${isInvoice && payUrl ? `<div style="padding:8px 0 4px 0;">${button(payUrl, 'Open invoice · copy details · QR code', { full: true })}</div>` : ''}
                ${inv.notes ? `<div style="font-family:${FONT};font-size:12px;line-height:18px;color:${E.white};padding-top:10px;border-top:1px solid rgba(255,255,255,0.15);margin-top:10px;">${esc(inv.notes)}</div>` : ''}
              `)}</tr>`,
              `border-radius:12px;border:1px solid ${E.gold};`
            ),
            'class="be-pad"'
          )
        : ''
    }
    ${row(
      E.bone,
      'padding:8px 28px 8px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:18px 22px 10px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;padding-bottom:6px;">${isInvoice ? 'After you have paid' : 'When you accept this quote'}</div>
          ${table(
            E.white,
            afterSteps
              .map(
                (t, i) => `<tr>
                  ${td(E.white, 'padding:6px 12px 6px 0;vertical-align:top;width:26px;', `<div style="width:24px;height:24px;line-height:24px;border-radius:12px;background-color:${E.navy};color:${E.white};font-family:${FONT};font-size:12px;font-weight:700;text-align:center;">${i + 1}</div>`)}
                  ${td(E.white, `padding:6px 0;font-family:${FONT};font-size:14px;line-height:21px;color:${E.ink};`, esc(t))}
                </tr>`
              )
              .join('')
          )}
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:12px 28px 8px 28px;text-align:center;',
      button(
        `${CONTACT.whatsappUrl}?text=${encodeURIComponent(isInvoice ? `Payment receipt for invoice ${order.ref}` : `Hi, I would like to accept quote ${order.ref}.`)}`,
        isInvoice ? 'Send your receipt on WhatsApp' : 'Accept this quote on WhatsApp',
        { full: true }
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:8px 28px 26px 28px;text-align:center;font-family:' + FONT + ';font-size:12px;line-height:18px;color:' + E.muted + ';',
      `Questions? <a href="mailto:${CONTACT.email}" style="color:${E.navy};">${CONTACT.email}</a> · ${esc(CONTACT.phoneDisplay)} · <a href="${esc(site)}/returns/" style="color:${E.navy};">Returns &amp; warranty</a> · <a href="${esc(site)}/delivery/" style="color:${E.navy};">Delivery</a>`,
      'class="be-pad"'
    )}`;

  const html = emailShell({
    title: d.subject,
    preheader: `${label} ${order.ref}: ${aud(order.totals.total)}${isInvoice ? ' payable. Payment details inside.' : `. Valid until ${d.validUntil ? date(d.validUntil) : ''}.`}`,
    headerNote: isInvoice ? 'Tax invoice' : 'Quote',
    body,
    siteUrl: site,
    logoUrl: `${site}/brand/logo-mark-192.png`,
    footerNote: isInvoice ? 'This is a tax invoice. All prices include 10% GST.' : 'All prices include 10% GST. Freight is confirmed against your delivery postcode unless shown above.',
  });

  const payLines: string[] = [];
  if (inv?.method === 'bank' && inv.bank) payLines.push(`Account name: ${inv.bank.accountName}`, `BSB: ${inv.bank.bsb}`, `Account: ${inv.bank.accountNumber}`, inv.bank.payId ? `PayID: ${inv.bank.payId}` : '', `Reference: ${order.ref}`);
  if (inv?.method === 'crypto' && inv.crypto) payLines.push(`${inv.crypto.asset} (${inv.crypto.network}): ${inv.crypto.address}`);
  if (inv?.method === 'finance4' && inv.finance4) payLines.push(plan ? planLines(plan).join('\n') : '', inv.finance4.instructions, inv.finance4.link ?? '');

  const text = [
    `${isInvoice ? 'TAX INVOICE' : 'QUOTE'} ${order.ref} - ${ABN_INFO.companyName}, ABN ${ABN_INFO.abn}`,
    d.validUntil ? `Valid until ${date(d.validUntil)}` : '',
    '',
    d.message,
    '',
    `For: ${[c.company, c.name, c.address, c.email, c.phone].filter(Boolean).join(', ')}`,
    ...order.lines.map((l) => `- ${l.name} x${l.quantity} - ${aud(l.lineTotal)}`),
    `Total ${aud(order.totals.total)} (incl. GST ${aud(order.totals.gst)})${hasFreightLine ? '' : ' - freight quoted against your postcode'}`,
    '',
    ...payLines.filter(Boolean),
    '',
    isInvoice ? 'After you have paid:' : 'When you accept this quote:',
    ...afterSteps.map((t, i) => `${i + 1}. ${t}`),
    isInvoice && payUrl ? `\nOpen invoice: ${payUrl}` : '',
    '',
    `WhatsApp ${CONTACT.phoneDisplay} - ${ABN_INFO.companyName}`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return { subject: d.subject, html, text };
}
