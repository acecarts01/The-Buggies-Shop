// quote-request: the sales desk's copy when a client asks for an official
// quote. One link, straight into the pre-filled reply terminal - mirrors
// admin-new-order.ts's "View Order in Admin" pattern.
import { E, FONT, SERIF, emailShell, table, td, row, statusBadge, esc, button } from './layout';
import { type QuoteRequest, adminQuoteReplyUrl } from '@/lib/quotes';
import { siteUrl, stateFromPostcode } from '@/lib/orders';
import { paymentLabel } from '@/lib/orders-shared';

export function renderQuoteRequest(quote: QuoteRequest, token: string): { subject: string; html: string; text: string } {
  const c = quote.customer;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const site = siteUrl();
  const reply = adminQuoteReplyUrl(token);

  const body = `
    ${row(
      E.navy,
      'padding:6px 28px 20px 28px;text-align:center;',
      `${statusBadge('Quote requested')}
       <h1 class="be-h1" style="margin:14px 0 4px 0;font-family:${SERIF};font-size:24px;line-height:30px;color:${E.white};">Quote request ${esc(quote.ref)}</h1>
       <p style="margin:0;font-family:${FONT};font-size:13px;color:${E.mutedOnNavy};">${esc(quote.buggyModel || 'Model not specified')}</p>`,
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:20px 28px 6px 28px;',
      table(
        E.white,
        `<tr>${td(E.white, 'padding:16px 20px;', `
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;padding-bottom:6px;">Customer</div>
          <div style="font-family:${FONT};font-size:13px;line-height:20px;color:${E.ink};padding-bottom:14px;border-bottom:1px solid ${E.line};">
            <strong>${esc(c.name)}</strong><br />
            <a href="mailto:${esc(c.email)}" style="color:${E.navy};">${esc(c.email)}</a>${c.phone ? ` · <a href="tel:${esc(c.phone)}" style="color:${E.navy};">${esc(c.phone)}</a>` : ''}<br />
            ${c.postcode ? `${esc(c.postcode)}${state ? ` · ${esc(state)}` : ''}` : 'No postcode given'}
          </div>
          <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;padding:14px 0 4px 0;">Request</div>
          <div style="font-family:${FONT};font-size:13px;line-height:20px;color:${E.ink};">
            ${quote.deliveryPreference ? `Delivery preference: ${esc(quote.deliveryPreference)}<br />` : ''}
            ${quote.paymentPreference ? `Payment preference: ${esc(paymentLabel(quote.paymentPreference))}<br />` : ''}
            ${quote.notes ? `Notes: ${esc(quote.notes)}` : '<em style="color:' + E.muted + ';">No additional notes.</em>'}
          </div>
        `)}</tr>`,
        `border-radius:12px;border:1px solid ${E.line};`
      ),
      'class="be-pad"'
    )}
    ${row(
      E.bone,
      'padding:6px 28px 24px 28px;',
      `${button(reply, 'Reply to Client', { full: true })}
       <div style="padding-top:10px;text-align:center;font-family:${FONT};font-size:11px;color:${E.muted};">Opens with the client's details loaded, ready to type the answer and send · requires the admin passphrase</div>`,
      'class="be-pad"'
    )}`;

  const html = emailShell({
    title: `Quote request ${quote.ref}`,
    preheader: `${c.name} · ${quote.buggyModel || 'Model not specified'} · postcode ${c.postcode || '-'}`,
    headerNote: 'Sales desk',
    body,
    siteUrl: site,
    logoUrl: `${site}/brand/logo-mark-192.png`,
  });

  const text = [
    `QUOTE REQUEST ${quote.ref}`,
    `${c.name} · ${c.email} · ${c.phone ?? '-'} · postcode ${c.postcode ?? '-'}`,
    quote.buggyModel ? `Model: ${quote.buggyModel}` : '',
    quote.deliveryPreference ? `Delivery preference: ${quote.deliveryPreference}` : '',
    quote.paymentPreference ? `Payment preference: ${paymentLabel(quote.paymentPreference)}` : '',
    quote.notes ? `Notes: ${quote.notes}` : '',
    ``,
    `Reply: ${reply}`,
  ]
    .filter(Boolean)
    .join('\n');

  return { subject: `Quote request ${quote.ref} — ${c.name}`, html, text };
}
