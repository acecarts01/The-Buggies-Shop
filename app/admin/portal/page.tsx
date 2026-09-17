import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Inbox, PackageCheck, Wallet, Clock } from 'lucide-react';
import { isAdminRequest } from '@/lib/admin-auth';
import { listOrders, listEnquiries, orderCounts, orderRevenue, enquiryTotalCount } from '@/lib/db';
import { signOrder, aud, STATUS_LABEL, type Order, type OrderStatus } from '@/lib/orders';
import AdminShell from '@/src/components/admin/AdminShell';
import StatusBadge from '@/src/components/admin/StatusBadge';

// /admin/portal/?tab=dashboard|orders|enquiries&status=&type=&q= - the
// database-backed views the signed-link pages don't have: an overview, and
// full lists with search and filters. Individual orders still open through a
// signed token (regenerated here from the stored row, never stored itself).
export default async function PortalPage({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string; type?: string; q?: string }> }) {
  const sp = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login/?next=${encodeURIComponent(`/admin/portal/`)}`);

  const tab = sp.tab === 'orders' ? 'orders' : sp.tab === 'enquiries' ? 'enquiries' : 'dashboard';
  const q = sp.q?.trim() || '';

  return (
    <AdminShell wide title="Portal" subtitle="Every order and enquiry captured on the site, newest first.">
      <div className="flex gap-2 mb-6" role="tablist" aria-label="Portal section">
        <Link href="/admin/portal/" role="tab" aria-selected={tab === 'dashboard'} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'dashboard' ? 'bg-[#B8973F] text-[#071527]' : 'bg-[#0B1F3A] border border-white/10 text-[#A9B4C6] hover:border-white/30'}`}>
          Dashboard
        </Link>
        <Link href="/admin/portal/?tab=orders" role="tab" aria-selected={tab === 'orders'} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'orders' ? 'bg-[#B8973F] text-[#071527]' : 'bg-[#0B1F3A] border border-white/10 text-[#A9B4C6] hover:border-white/30'}`}>
          Orders
        </Link>
        <Link href="/admin/portal/?tab=enquiries" role="tab" aria-selected={tab === 'enquiries'} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'enquiries' ? 'bg-[#B8973F] text-[#071527]' : 'bg-[#0B1F3A] border border-white/10 text-[#A9B4C6] hover:border-white/30'}`}>
          Enquiries
        </Link>
      </div>
      {tab === 'dashboard' ? <DashboardTab /> : tab === 'orders' ? <OrdersTab status={sp.status} q={q} /> : <EnquiriesTab formType={sp.type} q={q} />}
    </AdminShell>
  );
}

function orderToToken(r: { ref: string; createdAt: string; status: OrderStatus; channel: string; payment: string; customer: Order['customer']; lines: Order['lines']; totals: Order['totals']; invoice: Order['invoice'] | null }): string {
  const order: Order = { ref: r.ref, createdAt: r.createdAt, status: r.status, channel: r.channel as Order['channel'], payment: r.payment as Order['payment'], customer: r.customer, lines: r.lines, totals: r.totals, invoice: r.invoice ?? undefined };
  return signOrder(order);
}

async function DashboardTab() {
  const [counts, revenue, enquiryCount, recentOrders, recentEnquiries] = await Promise.all([
    orderCounts(),
    orderRevenue(),
    enquiryTotalCount(),
    listOrders({ limit: 5 }),
    listEnquiries({ limit: 5 }),
  ]);
  const totalOrders = Object.values(counts).reduce((s, n) => s + n, 0);
  const needsAction = (counts.new ?? 0) + (counts.awaiting_invoice ?? 0);

  const cards = [
    { label: 'Orders', value: totalOrders.toLocaleString('en-AU'), icon: Inbox, href: '/admin/portal/?tab=orders' },
    { label: 'Needs invoicing', value: needsAction.toLocaleString('en-AU'), icon: Clock, href: '/admin/portal/?tab=orders&status=new' },
    { label: 'Settled revenue', value: aud(revenue.settled), icon: PackageCheck, href: '/admin/portal/?tab=orders&status=paid' },
    { label: 'Pipeline value', value: aud(revenue.pipeline), icon: Wallet, href: '/admin/portal/?tab=orders' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5 hover:border-[#B8973F]/50 transition-colors">
            <c.icon className="w-4 h-4 text-[#D9C27A] mb-2" aria-hidden="true" />
            <div className="text-2xl font-serif font-bold">{c.value}</div>
            <div className="text-xs text-[#A9B4C6] mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Recent orders</h2>
            <Link href="/admin/portal/?tab=orders" className="text-xs font-bold text-[#A9B4C6] hover:text-[#D9C27A] inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-[#A9B4C6]">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentOrders.map((r) => (
                <li key={r.ref} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{r.customer.name}</div>
                    <div className="text-xs text-[#A9B4C6] font-mono">{r.ref}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm whitespace-nowrap">{aud(r.totals.total)}</span>
                    <StatusBadge status={r.status} active done={false} />
                    <Link href={`/admin/orders/?o=${encodeURIComponent(orderToToken(r))}`} className="text-xs font-bold text-[#D9C27A] hover:underline">Open</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-[#D9C27A] font-bold">Recent enquiries ({enquiryCount.toLocaleString('en-AU')} total)</h2>
            <Link href="/admin/portal/?tab=enquiries" className="text-xs font-bold text-[#A9B4C6] hover:text-[#D9C27A] inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-[#A9B4C6]">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{e.name}</div>
                    <div className="text-xs text-[#A9B4C6] truncate">{e.email ?? e.phone ?? '—'}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#071527] bg-[#D9C27A] rounded-full px-2 py-0.5 font-bold shrink-0">{ENQUIRY_LABEL[e.formType] ?? e.formType}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
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
        <>
          {/* Cards on mobile - a wide table doesn't fit a phone screen. */}
          <ul className="sm:hidden space-y-3">
            {rows.map((r) => {
              const token = orderToToken(r);
              return (
                <li key={r.ref} className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{r.customer.name}</div>
                      <div className="text-xs text-[#A9B4C6] truncate">{r.customer.email}</div>
                      <div className="text-xs text-[#A9B4C6] font-mono mt-0.5">{r.ref}</div>
                    </div>
                    <span className="font-bold whitespace-nowrap shrink-0">{aud(r.totals.total)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10">
                    <StatusBadge status={r.status} active done={false} />
                    <Link href={`/admin/orders/?o=${encodeURIComponent(token)}`} className="text-xs font-bold text-[#D9C27A] hover:underline">
                      Open
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Table from tablet width up. */}
          <div className="hidden sm:block bg-[#0B1F3A] border border-white/10 rounded-2xl overflow-hidden">
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
                    const token = orderToToken(r);
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
        </>
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
