import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Mail, Phone, MapPin, CreditCard, ArrowRight, Inbox, MessageSquare } from 'lucide-react';
import { isAdminRequest } from '@/lib/admin-auth';
import { verifyOrder, aud, paymentLabel, stateFromPostcode, whatsappToCustomerUrl, STATUS_LABEL, type OrderStatus } from '@/lib/orders';
import { getOrder, getOrderEvents } from '@/lib/db';
import AdminShell from '@/src/components/admin/AdminShell';
import StatusBadge from '@/src/components/admin/StatusBadge';
import OrderStatusActions from '@/src/components/admin/OrderStatusActions';

// /admin/orders/?o=<token> - the "View in Admin" card. Without a token it
// explains where orders arrive (there is no order list: orders live in the
// signed links inside the sales desk's emails, not in a database).
export default async function AdminOrderPage({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login/?next=${encodeURIComponent(`/admin/orders/${o ? `?o=${o}` : ''}`)}`);

  const order = verifyOrder(o);

  if (!order) {
    return (
      <AdminShell title="Orders" subtitle="Open an order from the link in its sales-desk email.">
        <div className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-8 text-center space-y-3">
          <Inbox className="w-8 h-8 mx-auto text-[#D9C27A]" aria-hidden="true" />
          <p className="text-sm text-[#A9B4C6] max-w-md mx-auto">
            {o ? 'That order link is invalid or was signed with a different secret.' : 'Every new order emails the sales desk a signed link. Tap “Review Order & Settle Payment” in that email to land here with the order loaded.'}
          </p>
        </div>
      </AdminShell>
    );
  }

  // The token carries the order as it was when it was signed; the database
  // (when reachable) is the live source of truth for status, since it
  // advances from actions (paid, dispatched) the token was never re-signed
  // for. Line items, customer and totals don't change after the fact, so
  // those stay token-derived either way.
  const dbRow = await getOrder(order.ref).catch(() => null);
  if (dbRow) order.status = dbRow.status;

  const c = order.customer;
  const state = c.state ?? stateFromPostcode(c.postcode);
  const settle = `/admin/orders/settle/?o=${encodeURIComponent(o!)}`;
  const steps: OrderStatus[] = ['new', 'awaiting_invoice', 'invoice_sent', 'paid', 'dispatched'];
  const current = steps.indexOf(order.status);
  const events = await getOrderEvents(order.ref).catch(() => []);

  return (
    <AdminShell title={`Order ${order.ref}`} subtitle={`Placed ${new Date(order.createdAt).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })} AEST · ${order.channel === 'whatsapp' ? 'WhatsApp checkout' : order.channel === 'crypto' ? 'On-site crypto invoice' : 'Invoice request'}`}>
      {/* Status rail */}
      <ol className="flex flex-wrap gap-2 mb-6" aria-label="Order status">
        {steps.map((s, i) => (
          <li key={s}>
            <StatusBadge status={s} active={i === current} done={i < current} />
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Customer */}
        <section className="lg:col-span-2 bg-[#0B1F3A] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-[#B8973F]/50 transition-colors">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Customer</h2>
          <div className="text-lg font-serif font-bold">{c.name}</div>
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#A9B4C6] mt-0.5 shrink-0" aria-hidden="true" />
              <a href={`mailto:${c.email}`} className="hover:text-[#D9C27A] break-all">{c.email}</a>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#A9B4C6] mt-0.5 shrink-0" aria-hidden="true" />
              {c.phone ? (
                <span className="flex flex-wrap gap-x-3">
                  <a href={`tel:${c.phone}`} className="hover:text-[#D9C27A]">{c.phone}</a>
                  <a href={whatsappToCustomerUrl(order, `Hi ${c.name.split(' ')[0]}, this is The Buggies Express about order ${order.ref}.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#25D366] hover:underline">
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> WhatsApp
                  </a>
                </span>
              ) : (
                <span className="text-[#A9B4C6]">No phone given</span>
              )}
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#A9B4C6] mt-0.5 shrink-0" aria-hidden="true" />
              <span>{c.postcode ? `Postcode ${c.postcode}${state ? ` · ${state}` : ''}` : <span className="text-[#A9B4C6]">Postcode not given</span>}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-[#A9B4C6] mt-0.5 shrink-0" aria-hidden="true" />
              <span>{paymentLabel(order.payment)}</span>
            </div>
          </dl>
        </section>

        {/* Items */}
        <section className="lg:col-span-3 bg-[#0B1F3A] border border-white/10 rounded-2xl p-6 hover:border-[#B8973F]/50 transition-colors">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold mb-4">Ordered</h2>
          <ul className="divide-y divide-white/10">
            {order.lines.map((l) => (
              <li key={l.id} className="py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold leading-snug">{l.name}</div>
                  <div className="text-xs text-[#A9B4C6] mt-0.5 leading-relaxed">{l.keySpecs}</div>
                  <div className="text-xs text-[#A9B4C6] mt-0.5">Qty {l.quantity} × {aud(l.unitPrice)}</div>
                </div>
                <div className="font-bold whitespace-nowrap shrink-0">{aud(l.lineTotal)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-[#A9B4C6]">Subtotal</dt><dd>{aud(order.totals.subtotal)}</dd></div>
            {order.totals.accessoryDiscount > 0 && <div className="flex justify-between text-[#7FD09A]"><dt>Accessory bundle 5%</dt><dd>−{aud(order.totals.accessoryDiscount)}</dd></div>}
            {order.totals.cryptoDiscount > 0 && <div className="flex justify-between text-[#7FD09A]"><dt>Crypto incentive 10%</dt><dd>−{aud(order.totals.cryptoDiscount)}</dd></div>}
            <div className="flex justify-between text-[#A9B4C6]"><dt>Includes GST</dt><dd>{aud(order.totals.gst)}</dd></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10 text-[#D9C27A]"><dt>Total (excl. freight)</dt><dd>{aud(order.totals.total)}</dd></div>
          </dl>
        </section>
      </div>

      {/* Primary CTA */}
      <div className="mt-6 bg-gradient-to-r from-[#12294A] to-[#0B1F3A] border border-[#B8973F]/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-serif font-bold text-lg">{order.status === 'invoice_sent' ? 'Invoice already sent' : 'Ready to invoice'}</div>
          <p className="text-sm text-[#A9B4C6]">The settlement terminal opens with every field from this order already filled.</p>
        </div>
        <Link
          href={settle}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] font-bold text-sm transition-all hover:-translate-y-px shadow-lg shadow-black/30"
        >
          View Order in Admin
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-[#A9B4C6]">Status: {STATUS_LABEL[order.status]}. Statuses advance as invoices go out; the updated link is emailed to the sales desk each time.</p>
        <OrderStatusActions orderRef={order.ref} status={order.status} />
      </div>

      {events.length > 0 && (
        <section className="mt-6 bg-[#0B1F3A] border border-white/10 rounded-2xl p-6">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold mb-4">Activity</h2>
          <ol className="space-y-3">
            {events.map((e, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8973F] mt-1.5 shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-semibold">{STATUS_LABEL[e.status as OrderStatus] ?? e.status}</span>
                  {e.note ? <span className="text-[#A9B4C6]"> — {e.note}</span> : null}
                  <div className="text-[11px] text-[#A9B4C6]">{new Date(e.at).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })} AEST</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </AdminShell>
  );
}
