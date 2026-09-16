// order-confirmation: the customer's instant confirmation.
import { E, FONT, SERIF, emailShell, table, td, row, spacer, kv, statusBadge, esc, button } from './layout';
import { type Order, aud, paymentLabel, siteUrl, stateFromPostcode } from '@/lib/orders';
import { CONTACT } from '@/src/config/site';

export function ledgerRows(order: Order): string {
  return order.lines
    .map(
      (l) => `<tr>
      ${td(E.white, `padding:12px 0;border-bottom:1px solid ${E.line};vertical-align:top;`, `
        <div style="font-family:${FONT};font-size:14px;font-weight:700;color:${E.ink};">${esc(l.name)}</div>
        <div style="font-family:${FONT};font-size:12px;line-height:17px;color:${E.muted};padding-top:3px;">${esc(l.keySpecs)}</div>
        <div style="font-family:${FONT};font-size:12px;color:${E.muted};padding-top:3px;">Qty ${l.quantity} × ${aud(l.unitPrice)}</div>`)}
      ${td(E.white, `padding:12px 0 12px 12px;border-bottom:1px solid ${E.line};vertical-align:top;text-align:right;white-space:nowrap;font-family:${FONT};font-size:14px;font-weight:700;color:${E.ink};`, aud(l.lineTotal))}
    </tr>`
    )
    .join('');
}

export function totalsRows(order: Order, opts: { freight?: string } = {}): string {
  const t = order.totals;
  const line = (label: string, value: string, strong = false, color = E.ink) => `<tr>
    ${td(E.white, `padding:6px 0;font-family:${FONT};font-size:${strong ? 16 : 13}px;color:${color};font-weight:${strong ? 700 : 400};`, label)}
    ${td(E.white, `padding:6px 0;text-align:right;font-family:${FONT};font-size:${strong ? 18 : 13}px;color:${color};font-weight:${strong ? 700 : 400};white-space:nowrap;`, value)}
  </tr>`;
  return [
    line('Subtotal', aud(t.subtotal)),
    t.accessoryDiscount ? line('Accessory bundle discount (5%)', `−${aud(t.accessoryDiscount)}`, false, E.success) : '',
    t.cryptoDiscount ? line('Crypto settlement incentive (10%)', `−${aud(t.cryptoDiscount)}`, false, E.success) : '',
    line('Includes GST (10%)', aud(t.gst), false, E.muted),
    line('Freight', opts.freight ?? 'Quoted against your postcode', false, E.muted),
    `<tr>${td(E.white, 'padding:4px 0;', `<div style="height:1px;background-color:${E.navy};"></div>`, 'colspan="2"')}</tr>`,
    line('Total (AUD, GST inclusive)', aud(t.total), true, E.navy),
  ].join('');
}

export function renderOrderConfirmation(order: Order): { subject: string; html: string; text: string } {
  const c = order.customer;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const first = c.name.split(' ')[0];
  const site = siteUrl();
  const logo = `${site}/brand/logo-mark-192.png`;

  const body = `
    ${row(
      E.navy,
      `padding:6px 28px 26px 28px;text-align:center;`,
      `${statusBadge('Order Logged — Allocation Reserved')}
       <h1 class="be-h1" style="margin:18px 0 8px 0;font-family:${SERIF};font-size:28px;line-height:34px;font-weight:700;color:${E.white};">Thank you, ${esc(first)}.</h1>
       <p style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${E.mutedOnNavy};">Order <span style="color:${E.goldLight};font-weight:700;">${esc(order.ref)}</span> is logged at our Yatala QLD depot and the unit has been reserved in Australian inventory. Our sales concierge will send your official payment invoice shortly.</p>`,
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:24px 28px 8px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:20px 22px 6px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;">Order ledger</div>
          ${table(E.white, ledgerRows(order) + totalsRows(order))}
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
        `<tr>${td(E.white, 'padding:18px 22px 12px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;padding-bottom:6px;">Delivery &amp; payment</div>
          ${table(
            E.white,
            kv('Deliver to', `${esc(c.name)}<br />${c.postcode ? `Postcode ${esc(c.postcode)}${state ? ` (${esc(state)})` : ''}` : 'Postcode to be confirmed'}`) +
              kv('Payment method', esc(paymentLabel(order.payment))) +
              kv('Order reference', esc(order.ref), { mono: true, strong: true }) +
              kv('Placed', esc(new Date(order.createdAt).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })) + ' AEST')
          )}
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:8px 28px 26px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:18px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;">What happens next</div>
          <ol style="margin:10px 0 0 18px;padding:0;font-family:${FONT};font-size:13px;line-height:21px;color:${E.ink};">
            <li>We verify the exact unit in stock at Yatala and quote enclosed freight to your postcode.</li>
            <li>You receive the official tax invoice with the payment details for <strong>${esc(paymentLabel(order.payment))}</strong>.</li>
            <li>Once you have paid, send the receipt or a screenshot on WhatsApp and we confirm dispatch.</li>
          </ol>
          <div style="padding-top:16px;">${button(`https://wa.me/${CONTACT.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(`Hi, this is ${c.name} about order ${order.ref}.`)}`, 'Message the sales desk on WhatsApp', { bg: E.navy, color: E.white })}</div>
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${spacer(E.navyDeep, 2)}`;

  const html = emailShell({
    title: `Order ${order.ref} confirmed — The Buggies Express`,
    preheader: `Order ${order.ref} logged and reserved. Your invoice follows shortly.`,
    headerNote: 'Order confirmation',
    body,
    siteUrl: site,
    logoUrl: logo,
    footerNote: 'All prices include 10% GST. Freight is quoted against your delivery postcode and shown separately.',
  });

  const text = [
    `Thank you, ${first}. Order ${order.ref} is logged at our Yatala QLD depot and reserved.`,
    ``,
    ...order.lines.map((l) => `- ${l.name} x${l.quantity} — ${aud(l.lineTotal)}`),
    `Total ${aud(order.totals.total)} (GST incl., freight quoted separately)`,
    `Payment: ${paymentLabel(order.payment)}`,
    ``,
    `Our sales concierge will send the official payment invoice shortly. Once paid, send the receipt on WhatsApp ${CONTACT.whatsappUrl}.`,
  ].join('\n');

  return { subject: `Order ${order.ref} confirmed — The Buggies Express`, html, text };
}
