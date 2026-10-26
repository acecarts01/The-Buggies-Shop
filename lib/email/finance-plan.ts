// The Finance in 4 schedule as an email block. Shared by the client's order
// confirmation and the sales desk's new-order email so both show the same four
// payments. Returns '' for any other payment method.
import { E, FONT, SERIF, row, table, td, esc } from './layout';
import { orderPlan, fmtAud, planLines } from '@/lib/pay-in-4';
import type { Order } from '@/lib/orders-shared';

export function financePlanBlock(order: Order, audience: 'client' | 'desk'): string {
  const plan = orderPlan(order);
  if (!plan) return '';
  const cell = (s: string, extra = '') => td(E.white, `padding:9px 0;border-bottom:1px solid ${E.line};font-family:${FONT};font-size:13px;color:${E.ink};${extra}`, s);
  const rows = plan.schedule
    .map(
      (p) => `<tr>
        ${cell(`<strong>Payment ${p.n}</strong>`, 'width:30%;')}
        ${cell(`${esc(p.label)}<br /><span style="color:${E.muted};font-size:12px;">${esc(p.dateText)}</span>`)}
        ${cell(`<strong>${esc(fmtAud(p.amount))}</strong>`, 'text-align:right;')}
      </tr>`
    )
    .join('');
  const intro =
    audience === 'client'
      ? `Your plan: pay <strong>${esc(fmtAud(plan.schedule[0].amount))}</strong> today, then 3 payments of <strong>${esc(fmtAud(plan.schedule[1].amount))}</strong>, ${plan.frequency}. 0% interest.`
      : `Client chose Finance in 4, ${plan.frequency}. First payment ${esc(fmtAud(plan.schedule[0].amount))}, then 3 of ${esc(fmtAud(plan.schedule[1].amount))}.`;
  const foot =
    audience === 'client'
      ? `${esc(fmtAud(plan.total))} in total, freight quoted separately. We confirm the plan on your tax invoice.`
      : `${esc(fmtAud(plan.total))} total, freight excluded. The plan is pre-filled into the invoice instructions in the settle terminal.`;
  return row(
    E.bone,
    'padding:6px 28px 6px 28px;',
    table(
      E.white,
      `<tr>${td(E.white, 'padding:16px 20px;', `
        <div style="font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${E.gold};font-weight:700;">Finance in 4 plan</div>
        <div style="font-family:${SERIF};font-size:15px;line-height:22px;color:${E.ink};padding:6px 0 4px 0;">${intro}</div>
        ${table(E.white, rows)}
        <div style="font-family:${FONT};font-size:12px;line-height:18px;color:${E.muted};padding-top:10px;">${foot}</div>
      `)}</tr>`,
      `border-radius:12px;border:1px solid ${E.line};`
    ),
    'class="be-pad"'
  );
}

/** Plain-text twin of the block, [] when the order is not Finance in 4. */
export function financePlanText(order: Order): string[] {
  const plan = orderPlan(order);
  return plan ? ['', ...planLines(plan)] : [];
}
