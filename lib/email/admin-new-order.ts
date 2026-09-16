// admin-new-order: the sales desk's copy, with the "View in Admin" link.
import { E, FONT, SERIF, emailShell, table, td, row, kv, statusBadge, esc, button } from './layout';
import { type Order, aud, paymentLabel, siteUrl, stateFromPostcode, adminOrderUrl, settleUrl, STATUS_LABEL } from '@/lib/orders';
import { ledgerRows, totalsRows } from './order-confirmation';

const CHANNEL_LABEL = { invoice: 'Website - invoice request', whatsapp: 'Website - WhatsApp checkout', crypto: 'Website - on-site crypto invoice' } as const;

export function renderAdminNewOrder(order: Order, token: string): { subject: string; html: string; text: string } {
  const c = order.customer;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const site = siteUrl();
  const view = adminOrderUrl(token);
  const settle = settleUrl(token);

  const body = `
    ${row(
      E.navy,
      'padding:6px 28px 24px 28px;text-align:center;',
      `${statusBadge(STATUS_LABEL[order.status])}
       <h1 class="be-h1" style="margin:16px 0 6px 0;font-family:${SERIF};font-size:26px;line-height:32px;color:${E.white};">New order ${esc(order.ref)}</h1>
       <p style="margin:0;font-family:${FONT};font-size:14px;color:${E.mutedOnNavy};">${esc(CHANNEL_LABEL[order.channel])} · ${aud(order.totals.total)}</p>`,
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:24px 28px 8px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:18px 22px 10px 22px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;padding-bottom:6px;">Customer</div>
          ${table(
            E.white,
            kv('Name', esc(c.name), { strong: true }) +
              kv('Email', `<a href="mailto:${esc(c.email)}" style="color:${E.navy};">${esc(c.email)}</a>`) +
              kv('Phone / WhatsApp', c.phone ? `<a href="tel:${esc(c.phone)}" style="color:${E.navy};">${esc(c.phone)}</a>` : '—') +
              kv('Postcode / state', c.postcode ? `${esc(c.postcode)}${state ? ` · ${esc(state)}` : ''}` : '—') +
              kv('Payment method', esc(paymentLabel(order.payment)))
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
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;">Items</div>
          ${table(E.white, ledgerRows(order) + totalsRows(order))}
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:8px 28px 28px 28px;',
      `${button(settle, 'Review Order &amp; Settle Payment', { full: true })}
       <div style="padding-top:10px;text-align:center;font-family:${FONT};font-size:12px;color:${E.muted};">or <a href="${esc(view)}" style="color:${E.navy};">open the order card</a> · links require the admin passphrase</div>`,
      'class="be-pad"'
    )}`;

  const html = emailShell({
    title: `New order ${order.ref}`,
    preheader: `${c.name} · ${aud(order.totals.total)} · ${paymentLabel(order.payment)}`,
    headerNote: 'Sales desk',
    body,
    siteUrl: site,
    logoUrl: `${site}/brand/logo-mark-192.png`,
  });

  const text = [
    `NEW ORDER ${order.ref} (${CHANNEL_LABEL[order.channel]})`,
    `${c.name} · ${c.email} · ${c.phone ?? '-'} · postcode ${c.postcode ?? '-'}`,
    `Payment: ${paymentLabel(order.payment)}`,
    ...order.lines.map((l) => `- ${l.name} x${l.quantity} — ${aud(l.lineTotal)}`),
    `Total ${aud(order.totals.total)}`,
    ``,
    `Settle: ${settle}`,
    `View: ${view}`,
  ].join('\n');

  return { subject: `NEW ORDER ${order.ref} — ${c.name} — ${aud(order.totals.total)}`, html, text };
}
