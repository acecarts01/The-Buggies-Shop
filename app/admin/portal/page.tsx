import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import { listOrders, listEnquiries, orderCounts } from '@/lib/db';
import { signOrder, aud, STATUS_LABEL, type Order, type OrderStatus } from '@/lib/orders';
import AdminShell from '@/src/components/admin/AdminShell';
import StatusBadge from '@/src/components/admin/StatusBadge';

// /admin/portal/?tab=orders|enquiries&status=&type=&q= - the list view the
// signed-link pages don't have: everything captured in the database, newest
// first, with a quick filter. Individual orders still open through a signed
// token (regenerated here from the stored row, never stored itself).
export default async function PortalPage({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string; type?: string; q?: string }> }) {
  const sp = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login/?next=${encodeURIComponent(`/admin/portal/`)}`);

  const tab = sp.tab === 'enquiries' ? 'enquiries' : 'orders';
  const q = sp.q?.trim() || '';

  return (
    <AdminShell wide title="Portal" subtitle="Every order and enquiry captured on the site, newest first.">
      <div className="flex gap-2 mb-6" role="tablist" aria-label="Portal section">
        <Link href="/admin/portal/?tab=orders" role="tab" aria-selected={tab === 'orders'} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'orders' ? 'bg-[#B8973F] text-[#071527]' : 'bg-[#0B1F3A] border border-white/10 text-[#A9B4C6] hover:border-white/30'}`}>
          Orders
        </Link>
        <Link href="/admin/portal/?tab=enquiries" role="tab" aria-selected={tab === 'enquiries'} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'enquiries' ? 'bg-[#B8973F] text-[#071527]' : 'bg-[#0B1F3A] border border-white/10 text-[#A9B4C6] hover:border-white/30'}`}>
          Enquiries
        </Link>
      </div>
      {tab === 'orders' ? <OrdersTab status={sp.status} q={q} /> : <EnquiriesTab formType={sp.type} q={q} />}
    </AdminShell>
  );
}

const ORDER_STATUSES: OrderStatus[] = ['new', 'awaiting_invoice', 'invoice_sent', 'paid', 'dispatched'];

async function OrdersTab({ status, q }: { status?: string; q: string }) {
  const [rows, counts] = await Promise.all([listOrders({ status, search: q || undefined, limit: 100 }), orderCounts()]);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-5">
      <form className="flex flex-wrap gap-2 items-center" method="get">
        <input type="hidden" name="tab" value="orders" />
        <input name="q" defaultValue={q} placeholder="Search name, email or ref…" className="px-3 py-2 rounded-lg bg-[#0B1F3A] border border-white/15 text-white text-sm placeholder-[#5C6B85] focus:outline-none focus:border-[#B8973F] min-w-[220px]" />
        <select name="status" defaultValue={status || 'all'} className="px-3 py-2 rounded-lg bg-[#0B1F3A] border border-white/15 text-white text-sm focus:outline-none focus:border-[#B8973F]">
          <option value="all">All statuses ({total})</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]} ({counts[s] ?? 0})</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] text-sm font-bold transition-colors">Filter</button>
        {(q || status) && <Link href="/admin/portal/?tab=orders" className="text-xs text-[#A9B4C6] hover:text-white underline">Clear</Link>}
      </form>

      {rows.length === 0 ? (
        <p className="text-sm text-[#A9B4C6] bg-[#0B1F3A] border border-white/10 rounded-2xl p-6 text-center">No orders match yet.</p>
      ) : (
        <div className="bg-[#0B1F3A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-[#A9B4C6] border-b border-white/10">
                  <th className="px-4 py-3 font-bold">Ref</th>
                  <th className="px-4 py-3 font-bold">Customer</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Total</th>
                  <th className="px-4 py-3 font-bold">Placed</th>
                  <th className="px-4 py-3 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((r) => {
                  const order: Order = { ref: r.ref, createdAt: r.createdAt, status: r.status, channel: r.channel as Order['channel'], payment: r.payment as Order['payment'], customer: r.customer, lines: r.lines, totals: r.totals, invoice: r.invoice ?? undefined };
                  const token = signOrder(order);
                  return (
                    <tr key={r.ref} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{r.ref}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{r.customer.name}</div>
                        <div className="text-xs text-[#A9B4C6]">{r.customer.email}</div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} active done={false} /></td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">{aud(r.totals.total)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-[#A9B4C6] text-xs">{new Date(r.createdAt).toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium' })}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Link href={`/admin/orders/?o=${encodeURIComponent(token)}`} className="text-xs font-bold text-[#D9C27A] hover:underline">
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const ENQUIRY_TYPES = ['contact', 'wholesale', 'quote', 'tradein'] as const;
const ENQUIRY_LABEL: Record<string, string> = { contact: 'Contact', wholesale: 'Wholesale', quote: 'Quote', tradein: 'Trade-in' };

async function EnquiriesTab({ formType, q }: { formType?: string; q: string }) {
  const rows = await listEnquiries({ formType, search: q || undefined, limit: 100 });

  return (
    <div className="space-y-5">
      <form className="flex flex-wrap gap-2 items-center" method="get">
        <input type="hidden" name="tab" value="enquiries" />
        <input name="q" defaultValue={q} placeholder="Search name, email or phone…" className="px-3 py-2 rounded-lg bg-[#0B1F3A] border border-white/15 text-white text-sm placeholder-[#5C6B85] focus:outline-none focus:border-[#B8973F] min-w-[220px]" />
        <select name="type" defaultValue={formType || 'all'} className="px-3 py-2 rounded-lg bg-[#0B1F3A] border border-white/15 text-white text-sm focus:outline-none focus:border-[#B8973F]">
          <option value="all">All types</option>
          {ENQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>{ENQUIRY_LABEL[t]}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] text-sm font-bold transition-colors">Filter</button>
        {(q || formType) && <Link href="/admin/portal/?tab=enquiries" className="text-xs text-[#A9B4C6] hover:text-white underline">Clear</Link>}
      </form>

      {rows.length === 0 ? (
        <p className="text-sm text-[#A9B4C6] bg-[#0B1F3A] border border-white/10 rounded-2xl p-6 text-center">No enquiries match yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((e) => (
            <li key={e.id} className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold">{e.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#071527] bg-[#D9C27A] rounded-full px-2 py-0.5 font-bold">{ENQUIRY_LABEL[e.formType] ?? e.formType}</span>
                  </div>
                  <div className="text-xs text-[#A9B4C6] mt-1">
                    {e.email && <a href={`mailto:${e.email}`} className="hover:text-[#D9C27A]">{e.email}</a>}
                    {e.email && e.phone && ' · '}
                    {e.phone && <a href={`tel:${e.phone}`} className="hover:text-[#D9C27A]">{e.phone}</a>}
                  </div>
                </div>
                <time className="text-[11px] text-[#A9B4C6] whitespace-nowrap">{new Date(e.createdAt).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'medium', timeStyle: 'short' })}</time>
              </div>
              {e.message && <p className="mt-3 text-sm text-[#E7ECF3] leading-relaxed whitespace-pre-line">{e.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
