// order-confirmation: the customer's instant confirmation.
import { E, FONT, SERIF, emailShell, table, td, row, spacer, statusBadge, esc, button } from './layout';
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
      `padding:6px 28px 20px 28px;text-align:center;`,
      `${statusBadge('Order Logged — Allocation Reserved')}
       <h1 class="be-h1" style="margin:14px 0 6px 0;font-family:${SERIF};font-size:26px;line-height:32px;font-weight:700;color:${E.white};">Thank you, ${esc(first)}.</h1>
       <p style="margin:0;font-family:${FONT};font-size:13px;line-height:20px;color:${E.mutedOnNavy};">Order <span style="color:${E.goldLight};font-weight:700;">${esc(order.ref)}</span> is reserved at our Yatala QLD depot. Your official payment invoice follows shortly.</p>`,
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:20px 28px 6px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:16px 20px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;">Order ledger</div>
          ${table(E.white, ledgerRows(order) + totalsRows(order))}
          <div style="font-family:${FONT};font-size:13px;line-height:20px;color:${E.ink};padding-top:14px;border-top:1px solid ${E.line};">
            Deliver to <strong>${esc(c.name)}</strong>${c.postcode ? `, postcode ${esc(c.postcode)}${state ? ` (${esc(state)})` : ''}` : ''} · ${esc(paymentLabel(order.payment))}
          </div>
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:6px 28px 24px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:18px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;">What happens next</div>
          <p style="margin:8px 0 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${E.ink};">We quote enclosed freight to your postcode, send your tax invoice for <strong>${esc(paymentLabel(order.payment))}</strong>, then dispatch once you've paid and sent the receipt on WhatsApp.</p>
          <div style="padding-top:14px;">${button(`https://wa.me/${CONTACT.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(`Hi, this is ${c.name} about order ${order.ref}.`)}`, 'Message the sales desk on WhatsApp', { bg: E.navy, color: E.white })}</div>
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
