// official-client-invoice: the tax invoice with the payment settlement box.
// Rendered for the email, for the settlement terminal's live preview, and
// (same data, React) for the hosted /pay/ page where copy buttons and the QR
// actually work - email clients do not run scripts.
import { E, FONT, SERIF, emailShell, table, td, row, kv, statusBadge, esc, button } from './layout';
import { type Order, aud, siteUrl, stateFromPostcode } from '@/lib/orders';
import { ABN_INFO, CONTACT } from '@/src/config/site';
import { ledgerRows, totalsRows } from './order-confirmation';

/** Selectable, monospace value box - the email equivalent of a copy button. */
function valueBox(label: string, value: string): string {
  return `<tr>${td(E.navySoft, 'padding:0 0 8px 0;', `
    <div style="font-family:${FONT};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${E.mutedOnNavy};padding-bottom:4px;">${esc(label)}</div>
    ${table(E.navyDeep, `<tr>${td(E.navyDeep, `padding:10px 12px;border:1px solid ${E.gold};border-radius:8px;font-family:'Courier New',Courier,monospace;font-size:14px;color:${E.white};word-break:break-all;`, esc(value))}</tr>`, 'border-radius:8px;')}
  `)}</tr>`;
}

export function settlementRows(order: Order): string {
  const inv = order.invoice;
  if (!inv) return '';
  if (inv.method === 'bank' && inv.bank) {
    return (
      valueBox('Account name', inv.bank.accountName) +
      valueBox('BSB', inv.bank.bsb) +
      valueBox('Account number', inv.bank.accountNumber) +
      (inv.bank.payId ? valueBox('PayID', inv.bank.payId) : '') +
      valueBox('Payment reference (required)', order.ref)
    );
  }
  if (inv.method === 'crypto' && inv.crypto) {
    return (
      valueBox(`${inv.crypto.asset} · ${inv.crypto.network}`, inv.crypto.address) +
      `<tr>${td(E.navySoft, `padding:2px 0 8px 0;font-family:${FONT};font-size:12px;line-height:18px;color:${E.mutedOnNavy};`, `Send the ${esc(inv.crypto.asset)} equivalent of <strong style="color:${E.white};">${aud(order.totals.total)}</strong> at the rate your wallet shows when you send. Check the network before sending — a transfer on the wrong network cannot be recovered.`)}</tr>`
    );
  }
  if (inv.method === 'finance4' && inv.finance4) {
    return (
      `<tr>${td(E.navySoft, `padding:0 0 10px 0;font-family:${FONT};font-size:13px;line-height:20px;color:${E.white};`, esc(inv.finance4.instructions))}</tr>` +
      (inv.finance4.link ? `<tr>${td(E.navySoft, 'padding:0 0 8px 0;', button(inv.finance4.link, 'Open your Finance in 4 plan', { full: true }))}</tr>` : '')
    );
  }
  return '';
}

const METHOD_TITLE = { bank: 'Bank transfer · PayID / EFT', crypto: 'Crypto settlement', finance4: 'Finance in 4' } as const;

export function renderInvoice(order: Order, payUrl: string): { subject: string; html: string; text: string } {
  const c = order.customer;
  const inv = order.invoice;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const site = siteUrl();
  const first = c.name.split(' ')[0];
  const issued = inv?.issuedAt ? new Date(inv.issuedAt) : new Date();

  const body = `
    ${row(
      E.navy,
      'padding:6px 28px 24px 28px;text-align:center;',
      `${statusBadge('Tax invoice · payment due')}
       <h1 class="be-h1" style="margin:16px 0 6px 0;font-family:${SERIF};font-size:28px;line-height:34px;color:${E.white};">Invoice ${esc(order.ref)}</h1>
       <p style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${E.mutedOnNavy};">Hi ${esc(first)} — your unit is reserved at Yatala. Settle using the details below and we book dispatch.</p>`,
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
            kv('Invoice to', `${esc(c.name)}<br /><a href="mailto:${esc(c.email)}" style="color:${E.navy};">${esc(c.email)}</a>`) +
              kv('Deliver to', c.postcode ? `Postcode ${esc(c.postcode)}${state ? ` (${esc(state)})` : ''}` : 'To be confirmed') +
              kv('Issued', esc(issued.toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'long' }))) +
              kv('Supplier', `${esc(ABN_INFO.companyName)}<br />ABN ${esc(ABN_INFO.abn)} · Yatala QLD 4207`) +
              kv('Order reference', esc(order.ref), { mono: true, strong: true })
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
          ${table(E.white, ledgerRows(order) + totalsRows(order, { freight: 'Confirmed once payment is received' }))}
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:8px 28px 8px 28px;',
      table(
        E.navySoft,
        `<tr>${td(E.navySoft, 'padding:20px 22px 12px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.goldLight};font-weight:700;">Payment settlement</div>
          <div style="font-family:${SERIF};font-size:20px;color:${E.white};padding:6px 0 12px 0;">${esc(inv ? METHOD_TITLE[inv.method] : 'Payment details')}</div>
          ${table(E.navySoft, settlementRows(order))}
          <div style="padding:8px 0 4px 0;">${button(payUrl, 'Open invoice · copy details · QR code', { full: true })}</div>
          <div style="font-family:${FONT};font-size:12px;line-height:18px;color:${E.mutedOnNavy};padding-top:8px;">Once paid, send the receipt or a screenshot on WhatsApp <a href="${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Payment receipt for invoice ${order.ref}`)}" style="color:${E.goldLight};">${esc(CONTACT.phoneDisplay)}</a> and we confirm your order.</div>
          ${inv?.notes ? `<div style="font-family:${FONT};font-size:12px;line-height:18px;color:${E.white};padding-top:10px;border-top:1px solid rgba(255,255,255,0.15);margin-top:10px;">${esc(inv.notes)}</div>` : ''}
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.gold};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:8px 28px 26px 28px;text-align:center;font-family:' + FONT + ';font-size:12px;line-height:18px;color:' + E.muted + ';',
      `Questions? <a href="mailto:${CONTACT.email}" style="color:${E.navy};">${CONTACT.email}</a> · <a href="${esc(site)}/faq/" style="color:${E.navy};">FAQ</a> · <a href="${esc(site)}/delivery/" style="color:${E.navy};">Delivery</a>`,
      'class="be-pad"'
    )}`;

  const html = emailShell({
    title: `Tax invoice ${order.ref} — The Buggies Express`,
    preheader: `Invoice ${order.ref}: ${aud(order.totals.total)} payable. Payment details inside.`,
    headerNote: 'Tax invoice',
    body,
    siteUrl: site,
    logoUrl: `${site}/brand/logo-mark-192.png`,
    footerNote: 'This is a tax invoice. All prices include 10% GST.',
  });

  const payLines: string[] = [];
  if (inv?.method === 'bank' && inv.bank) payLines.push(`Account name: ${inv.bank.accountName}`, `BSB: ${inv.bank.bsb}`, `Account: ${inv.bank.accountNumber}`, inv.bank.payId ? `PayID: ${inv.bank.payId}` : '', `Reference: ${order.ref}`);
  if (inv?.method === 'crypto' && inv.crypto) payLines.push(`${inv.crypto.asset} (${inv.crypto.network}): ${inv.crypto.address}`);
  if (inv?.method === 'finance4' && inv.finance4) payLines.push(inv.finance4.instructions, inv.finance4.link ?? '');

  const text = [
    `TAX INVOICE ${order.ref} — ${ABN_INFO.companyName}, ABN ${ABN_INFO.abn}`,
    ...order.lines.map((l) => `- ${l.name} x${l.quantity} — ${aud(l.lineTotal)}`),
    `Total ${aud(order.totals.total)} (incl. GST ${aud(order.totals.gst)}) · Freight confirmed once payment is received`,
    ``,
    ...payLines.filter(Boolean),
    ``,
    `Full invoice: ${payUrl}`,
    `Once paid, send the receipt on WhatsApp ${CONTACT.phoneDisplay}.`,
  ]
    .filter((l) => l !== '')
    .join('\n');

  return { subject: `Tax invoice ${order.ref} — ${aud(order.totals.total)} — The Buggies Express`, html, text };
}
