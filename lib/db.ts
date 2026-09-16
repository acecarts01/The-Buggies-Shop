// Persistence for the admin portal: orders, their status history, and
// enquiries (contact / wholesale / quote / trade-in submissions). Everything
// else in the order system stays token-based and stateless - this table is
// purely so the portal has something to list. A write failure here never
// blocks an order or enquiry from emailing out; it's logged and swallowed.
import { sql } from '@vercel/postgres';
import type { Order, OrderStatus } from './orders-shared';

let migrated: Promise<void> | null = null;

function migrate(): Promise<void> {
  if (!migrated) {
    migrated = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS orders (
        ref TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL,
        channel TEXT NOT NULL,
        payment TEXT NOT NULL,
        customer JSONB NOT NULL,
        lines JSONB NOT NULL,
        totals JSONB NOT NULL,
        invoice JSONB,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS order_events (
        id SERIAL PRIMARY KEY,
        order_ref TEXT NOT NULL REFERENCES orders(ref) ON DELETE CASCADE,
        status TEXT NOT NULL,
        note TEXT,
        at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        form_type TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        message TEXT,
        payload JSONB NOT NULL
      )`;
      await sql`CREATE INDEX IF NOT EXISTS order_events_ref_idx ON order_events (order_ref, at)`;
      await sql`CREATE INDEX IF NOT EXISTS enquiries_created_idx ON enquiries (created_at DESC)`;
    })();
  }
  return migrated;
}

export async function upsertOrder(order: Order, note?: string): Promise<void> {
  try {
    await migrate();
    await sql`
      INSERT INTO orders (ref, created_at, status, channel, payment, customer, lines, totals, invoice, updated_at)
      VALUES (${order.ref}, ${order.createdAt}, ${order.status}, ${order.channel}, ${order.payment},
        ${JSON.stringify(order.customer)}::jsonb, ${JSON.stringify(order.lines)}::jsonb, ${JSON.stringify(order.totals)}::jsonb,
        ${order.invoice ? JSON.stringify(order.invoice) : null}::jsonb, now())
      ON CONFLICT (ref) DO UPDATE SET
        status = EXCLUDED.status,
        invoice = EXCLUDED.invoice,
        updated_at = now()
    `;
    await sql`INSERT INTO order_events (order_ref, status, note) VALUES (${order.ref}, ${order.status}, ${note ?? null})`;
  } catch (e) {
    console.error('[db] upsertOrder failed (non-fatal):', e);
  }
}

export interface OrderRow {
  ref: string;
  createdAt: string;
  status: OrderStatus;
  channel: string;
  payment: string;
  customer: Order['customer'];
  lines: Order['lines'];
  totals: Order['totals'];
  invoice: Order['invoice'] | null;
  updatedAt: string;
}

export async function listOrders(opts: { limit?: number; status?: string; search?: string } = {}): Promise<OrderRow[]> {
  await migrate();
  const limit = Math.min(200, Math.max(1, opts.limit ?? 50));
  const status = opts.status && opts.status !== 'all' ? opts.status : null;
  const search = opts.search ? `%${opts.search.toLowerCase()}%` : null;
  const { rows } = await sql`
    SELECT ref, created_at, status, channel, payment, customer, lines, totals, invoice, updated_at
    FROM orders
    WHERE (${status}::text IS NULL OR status = ${status})
      AND (${search}::text IS NULL OR ref ILIKE ${search} OR customer->>'name' ILIKE ${search} OR customer->>'email' ILIKE ${search})
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map(rowToOrder);
}

export async function getOrder(ref: string): Promise<OrderRow | null> {
  await migrate();
  const { rows } = await sql`SELECT ref, created_at, status, channel, payment, customer, lines, totals, invoice, updated_at FROM orders WHERE ref = ${ref}`;
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export interface OrderEvent {
  status: string;
  note: string | null;
  at: string;
}

export async function getOrderEvents(ref: string): Promise<OrderEvent[]> {
  await migrate();
  const { rows } = await sql`SELECT status, note, at FROM order_events WHERE order_ref = ${ref} ORDER BY at ASC`;
  return rows.map((r) => ({ status: r.status, note: r.note, at: new Date(r.at).toISOString() }));
}

export async function setOrderStatus(ref: string, status: OrderStatus, note?: string): Promise<void> {
  await migrate();
  await sql`UPDATE orders SET status = ${status}, updated_at = now() WHERE ref = ${ref}`;
  await sql`INSERT INTO order_events (order_ref, status, note) VALUES (${ref}, ${status}, ${note ?? null})`;
}

export async function orderCounts(): Promise<Record<string, number>> {
  await migrate();
  const { rows } = await sql`SELECT status, count(*)::int AS n FROM orders GROUP BY status`;
  const out: Record<string, number> = {};
  for (const r of rows) out[r.status] = r.n;
  return out;
}

function rowToOrder(r: any): OrderRow {
  return {
    ref: r.ref,
    createdAt: new Date(r.created_at).toISOString(),
    status: r.status,
    channel: r.channel,
    payment: r.payment,
    customer: r.customer,
    lines: r.lines,
    totals: r.totals,
    invoice: r.invoice,
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Enquiries (contact / wholesale / quote / trade-in)

export interface EnquiryInput {
  formType: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  payload: Record<string, unknown>;
}

export async function insertEnquiry(e: EnquiryInput): Promise<void> {
  try {
    await migrate();
    await sql`
      INSERT INTO enquiries (form_type, name, email, phone, message, payload)
      VALUES (${e.formType}, ${e.name}, ${e.email ?? null}, ${e.phone ?? null}, ${e.message ?? null}, ${JSON.stringify(e.payload)}::jsonb)
    `;
  } catch (err) {
    console.error('[db] insertEnquiry failed (non-fatal):', err);
  }
}

export interface EnquiryRow {
  id: number;
  createdAt: string;
  formType: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  payload: Record<string, unknown>;
}

export async function listEnquiries(opts: { limit?: number; formType?: string; search?: string } = {}): Promise<EnquiryRow[]> {
  await migrate();
  const limit = Math.min(200, Math.max(1, opts.limit ?? 50));
  const formType = opts.formType && opts.formType !== 'all' ? opts.formType : null;
  const search = opts.search ? `%${opts.search.toLowerCase()}%` : null;
  const { rows } = await sql`
    SELECT id, created_at, form_type, name, email, phone, message, payload
    FROM enquiries
    WHERE (${formType}::text IS NULL OR form_type = ${formType})
      AND (${search}::text IS NULL OR name ILIKE ${search} OR email ILIKE ${search} OR phone ILIKE ${search})
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    formType: r.form_type,
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    payload: r.payload,
  }));
}
