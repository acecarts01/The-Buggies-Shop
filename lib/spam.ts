// Spam defence for the public endpoints (/api/contact, /api/quotes,
// /api/orders). Every accepted submission emails the sales desk, so a form
// bot turns directly into inbox flooding.
//
// Three layers, none of which change what a real customer sees:
//   1. Content checks: spamReasons() flags the shapes bots actually produce
//      (random mixed-case "names", digit-only messages, dot-stuffed Gmail,
//      US-style phones, non-Australian postcodes). One hard signal, or two
//      soft ones, blocks.
//   2. Rate limits per IP and per email, counted in Postgres (serverless
//      instances share no memory).
//   3. An audit trail (spam_log) so a false positive can be found later.
// Everything touching the database fails open: a DB hiccup must never block
// a genuine customer.
import { createHash } from 'node:crypto';
import { sql } from '@vercel/postgres';

export interface SpamInput {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  message?: string;
  /** Any value in a field no human can see. */
  honeypot?: unknown;
}

const lowerToUpperFlips = (s: string) => (s.match(/[a-z][A-Z]/g) || []).length;

export function spamReasons(i: SpamInput): { hard: string[]; soft: string[] } {
  const hard: string[] = [];
  const soft: string[] = [];

  if (i.honeypot) hard.push('honeypot');

  // "bJIYHHDHrZCEsGUKoNOx": one unbroken run of letters that flips from
  // lower to upper case again and again. Real names have spaces, or at most
  // one or two capitals ("McDonald").
  const name = (i.name ?? '').trim();
  if (name.length >= 10 && /^[A-Za-z]+$/.test(name) && lowerToUpperFlips(name) >= 3) hard.push('gibberish-name');

  const message = (i.message ?? '').trim();
  if (message.length >= 6 && /^[\d\s\-+().]+$/.test(message)) hard.push('numeric-message');

  const email = (i.email ?? '').trim().toLowerCase();
  const [local = '', domain = ''] = email.split('@');
  if ((domain === 'gmail.com' || domain === 'googlemail.com') && ((local.match(/\./g) || []).length >= 4 || local.includes('..'))) soft.push('dotted-email');

  const phone = (i.phone ?? '').trim();
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && /^[2-9]/.test(digits) && !phone.startsWith('+')) soft.push('non-au-phone');

  const postcode = (i.postcode ?? '').trim();
  if (postcode && !/^\d{4}$/.test(postcode)) soft.push('non-au-postcode');

  return { hard, soft };
}

/** Reasons the submission should be blocked, or [] when it looks genuine. */
export function blockReasons(i: SpamInput): string[] {
  const { hard, soft } = spamReasons(i);
  return hard.length > 0 || soft.length >= 2 ? [...hard, ...soft] : [];
}

// ---------------------------------------------------------------------------
// Rate limits + audit log

let ready: Promise<void> | null = null;
function ensureTables(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS rate_events (bucket TEXT NOT NULL, at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      await sql`CREATE INDEX IF NOT EXISTS rate_events_idx ON rate_events (bucket, at)`;
      await sql`CREATE TABLE IF NOT EXISTS spam_log (id SERIAL PRIMARY KEY, at TIMESTAMPTZ NOT NULL DEFAULT now(), kind TEXT NOT NULL, reasons TEXT NOT NULL, name TEXT, email TEXT)`;
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

const digest = (v: string) => createHash('sha256').update(`${process.env.ORDER_SIGNING_SECRET ?? 'be'}:${v}`).digest('hex').slice(0, 24);

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip') || 'unknown').trim();
}

export type SubmissionKind = 'contact' | 'quote' | 'order';

// Orders are the high-value path, so they get far more headroom than enquiries.
const LIMITS: Record<SubmissionKind, { ipPerHour: number; emailPerDay: number }> = {
  contact: { ipPerHour: 5, emailPerDay: 3 },
  quote: { ipPerHour: 5, emailPerDay: 3 },
  order: { ipPerHour: 10, emailPerDay: 10 },
};

/** True when this IP or email has submitted too often. Counts the attempt. */
export async function overRateLimit(kind: SubmissionKind, req: Request, email?: string): Promise<boolean> {
  try {
    await ensureTables();
    const lim = LIMITS[kind];
    const buckets = [{ b: `${kind}:ip:${digest(clientIp(req))}`, max: lim.ipPerHour, hours: 1 }];
    const em = (email ?? '').trim().toLowerCase();
    if (em) buckets.push({ b: `${kind}:em:${digest(em)}`, max: lim.emailPerDay, hours: 24 });

    let over = false;
    for (const { b, max, hours } of buckets) {
      const { rows } = await sql`SELECT count(*)::int AS n FROM rate_events WHERE bucket = ${b} AND at > now() - (${hours}::int * interval '1 hour')`;
      if ((rows[0]?.n ?? 0) >= max) over = true;
      await sql`INSERT INTO rate_events (bucket) VALUES (${b})`;
    }
    if (Math.random() < 0.05) await sql`DELETE FROM rate_events WHERE at < now() - interval '3 days'`;
    return over;
  } catch (e) {
    console.error('[spam] rate-limit check failed (allowing):', (e as Error).message);
    return false;
  }
}

export async function logBlocked(kind: SubmissionKind, reasons: string[], i: SpamInput): Promise<void> {
  console.warn(`[spam] blocked ${kind}: ${reasons.join(',')}`);
  try {
    await ensureTables();
    await sql`INSERT INTO spam_log (kind, reasons, name, email) VALUES (${kind}, ${reasons.join(',')}, ${(i.name ?? '').slice(0, 80)}, ${(i.email ?? '').slice(0, 120)})`;
  } catch (e) {
    console.error('[spam] could not write spam_log:', (e as Error).message);
  }
}
