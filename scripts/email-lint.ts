// Renders every transactional template with a fixture order, checks the
// bulletproof-email rules, and writes previews to docs/email-previews/.
// Run with bun (resolves the @/ path aliases): `bun scripts/email-lint.ts`.
// Exits non-zero on any violation. Called by scripts/crosscheck.mjs.

process.env.ORDER_SIGNING_SECRET ??= 'crosscheck-fixture-secret-not-for-production';
process.env.NEXT_PUBLIC_SITE_URL ??= 'https://www.golfbuggiesexpress.com.au';

import fs from 'node:fs';
import path from 'node:path';
import { type Order, computeTotals, priceLines, signOrder, payPageUrl } from '@/lib/orders';
import { renderOrderConfirmation } from '@/lib/email/order-confirmation';
import { renderAdminNewOrder } from '@/lib/email/admin-new-order';
import { renderInvoice } from '@/lib/email/official-client-invoice';
import { type QuoteRequest, signQuote } from '@/lib/quotes';
import { renderQuoteRequest } from '@/lib/email/quote-request';
import { renderQuoteReply } from '@/lib/email/quote-reply';
import { renderDocument } from '@/lib/email/document';
import { PRODUCTS } from '@/src/config/site';
import { afterPaymentFor, introFor, lineKind, reservationPhrase } from '@/lib/order-kind';
import { buildDocument, type DocInput } from '@/lib/document';

const lines = priceLines([
  { id: 'BUG-001', quantity: 1 },
  { id: 'PART-001', quantity: 2 },
]);
const base: Order = {
  ref: 'BE-260916-TEST',
  createdAt: '2026-09-16T01:15:00.000Z',
  status: 'new',
  channel: 'invoice',
  payment: 'standard',
  customer: { name: 'Test Buyer', email: 'acecarts01@gmail.com', phone: '0400 000 000', postcode: '4217', state: 'QLD' },
  lines,
  totals: computeTotals(lines, 'standard'),
};
const cryptoLines = priceLines([{ id: 'BUG-002', quantity: 1 }]);
const cryptoOrder: Order = { ...base, ref: 'BE-260916-CRYP', channel: 'crypto', payment: 'crypto', lines: cryptoLines, totals: computeTotals(cryptoLines, 'crypto') };

const bankInvoiced: Order = {
  ...base,
  status: 'invoice_sent',
  invoice: {
    issuedAt: '2026-09-16T02:00:00.000Z',
    method: 'bank',
    bank: { accountName: 'Golf Buggies Express Pty Ltd', bsb: '000-000', accountNumber: '00000000', payId: 'ABN 28 668 598 758' },
    notes: 'Fixture invoice for template checks only.',
  },
};
const cryptoInvoiced: Order = {
  ...cryptoOrder,
  status: 'invoice_sent',
  invoice: {
    issuedAt: '2026-09-16T02:00:00.000Z',
    method: 'crypto',
    crypto: { walletKey: 'btc', asset: 'BTC', network: 'Bitcoin mainnet', address: 'bc1qe3mfevg3ud3jukp9ad37wszcfrwev7zxxex5u5' },
  },
};

const financeLines = priceLines([{ id: 'BUG-002', quantity: 1 }]);
const financeOrder: Order = {
  ...base,
  ref: 'BE-260916-FIN4',
  payment: 'finance4',
  lines: financeLines,
  totals: { ...computeTotals(financeLines, 'finance4'), financeFrequency: 'monthly' },
};

const quote: QuoteRequest = {
  kind: 'quote',
  ref: 'QT-260916-TEST',
  createdAt: '2026-09-16T01:15:00.000Z',
  customer: { name: 'Test Buyer', email: 'acecarts01@gmail.com', phone: '0400 000 000', postcode: '4217', state: 'QLD' },
  buggyModel: 'Atlas 4-Passenger Lifted Lithium Buggy ($20,900 AUD)',
  deliveryPreference: 'Door-to-Door Enclosed Freight',
  paymentPreference: 'crypto',
  notes: 'Fixture quote request for template checks only.',
};
const quoteToken = signQuote(quote);

const token = signOrder(base);

const docBase: DocInput = {
  client: { name: 'Test Buyer', company: 'Fixture Golf Club', email: 'acecarts01@gmail.com', phone: '0400 000 000', address: '1 Test Street, Yatala', postcode: '4207' },
  lines: [
    { slug: 'atlas-4-passenger-lifted-lithium-buggy', quantity: 1, unitPrice: 20900 },
    { name: 'Freight to 4207', description: 'Enclosed freight', quantity: 1, unitPrice: 650 },
    { name: 'Discount', quantity: 1, unitPrice: -500 },
  ],
  payment: { method: 'bank', bank: { accountName: 'Golf Buggies Express Pty Ltd', bsb: '000-000', accountNumber: '00000000', payId: 'ABN 28 668 598 758' } },
  message: 'Fixture note for template checks only.\n\nSecond paragraph.',
};
const docMail = (kind: 'quote' | 'invoice') => {
  const built = buildDocument({ ...docBase, kind }, { strict: false });
  if (!built.doc) throw new Error('fixture document failed to build: ' + built.error);
  const o = built.doc.order;
  return renderDocument({ ...built.doc, payToken: kind === 'invoice' ? signOrder(o) : undefined });
};
const renders: { name: string; html: string; subject: string }[] = [
  { name: 'order-confirmation', ...renderOrderConfirmation(base) },
  { name: 'order-confirmation-crypto', ...renderOrderConfirmation(cryptoOrder) },
  { name: 'order-confirmation-finance4', ...renderOrderConfirmation(financeOrder) },
  { name: 'document-quote', ...docMail('quote') },
  { name: 'document-invoice', ...docMail('invoice') },
  { name: 'admin-new-order', ...renderAdminNewOrder(base, token) },
  { name: 'admin-new-order-finance4', ...renderAdminNewOrder(financeOrder, signOrder(financeOrder)) },
  { name: 'official-client-invoice-bank', ...renderInvoice(bankInvoiced, payPageUrl(signOrder(bankInvoiced))) },
  { name: 'official-client-invoice-crypto', ...renderInvoice(cryptoInvoiced, payPageUrl(signOrder(cryptoInvoiced))) },
  { name: 'admin-quote-request', ...renderQuoteRequest(quote, quoteToken) },
  { name: 'quote-reply-message-only', ...renderQuoteReply(quote, { message: 'Fixture reply for template checks only.' }) },
  {
    name: 'quote-reply-with-payment',
    ...renderQuoteReply(quote, {
      message: 'Fixture reply for template checks only.',
      quotedPrice: 20900,
      payment: { issuedAt: '2026-09-16T02:00:00.000Z', method: 'bank', bank: { accountName: 'Golf Buggies Express Pty Ltd', bsb: '000-000', accountNumber: '00000000', payId: 'ABN 28 668 598 758' } },
    }),
  },
];

const failures: string[] = [];

// Preparation claims must match the product: only rideable vehicles are road tested, only electric
// ones are charge-cycled, and parts, accessories, push buggies and custom lines claim neither.
for (const p of PRODUCTS) {
  const kind = lineKind({ slug: p.slug, name: p.name });
  const vehicle = kind === 'electric-vehicle' || kind === 'petrol-vehicle';
  const single = [{ slug: p.slug, name: p.name }];
  const steps = afterPaymentFor(single);
  const intro = introFor({ first: 'Sam', lines: single, source: 'order', asked: 'invoice', postcode: '4207' });
  const res = reservationPhrase(single);
  const all = `${steps}\n${intro}\n${res.badge} ${res.sentence} ${res.invoiceLine}`;
  if (/road.?test/i.test(all) !== vehicle) failures.push(`copy: ${p.slug} (${kind}) ${vehicle ? 'is missing' : 'wrongly claims'} a road test`);
  if (/charge-cycled/i.test(all) !== (kind === 'electric-vehicle')) failures.push(`copy: ${p.slug} (${kind}) ${kind === 'electric-vehicle' ? 'is missing' : 'wrongly claims'} a charge cycle`);
  if (/enclosed/i.test(all) !== vehicle) failures.push(`copy: ${p.slug} (${kind}) enclosed-freight wording does not fit`);
  if (/reserved/i.test(all) !== vehicle) failures.push(`copy: ${p.slug} (${kind}) reservation wording does not fit`);
}
{
  const custom = afterPaymentFor([{ name: 'Custom fabrication' }]);
  if (/road.?test|charge-cycled|enclosed/i.test(custom)) failures.push('copy: a custom-only order claims vehicle preparation');
  const mixed = afterPaymentFor([{ slug: 'evolution-d-max-gt4-off-road', name: 'Evolution D-MAX GT4 Off-Road' }, { slug: 'mgi-multipurpose-hook', name: 'MGI Multipurpose Hook' }]);
  if (/parts and accessories (has|have) been/i.test(mixed) || /hook[^.]*road tested/i.test(mixed)) failures.push('copy: a vehicle-plus-parts order claims the parts were tested');
  if (!/road tested/i.test(mixed) || !/parts and accessories are packed/i.test(mixed)) failures.push('copy: a vehicle-plus-parts order must test the vehicle and only pack the parts');
}
const outDir = path.join(process.cwd(), 'docs', 'email-previews');
fs.mkdirSync(outDir, { recursive: true });

for (const r of renders) {
  const tables = [...r.html.matchAll(/<table\b[^>]*>/g)].map((m) => m[0]);
  const tds = [...r.html.matchAll(/<td\b[^>]*>/g)].map((m) => m[0]);
  const bad = (tag: string) => !/\bbgcolor="/.test(tag) || !/background-color:/.test(tag);
  const badTables = tables.filter(bad);
  const badTds = tds.filter(bad);
  if (badTables.length) failures.push(`${r.name}: ${badTables.length} <table> without bgcolor + background-color, e.g. ${badTables[0].slice(0, 120)}`);
  if (badTds.length) failures.push(`${r.name}: ${badTds.length} <td> without bgcolor + background-color, e.g. ${badTds[0].slice(0, 120)}`);
  if (!/<meta name="color-scheme" content="light dark"/.test(r.html)) failures.push(`${r.name}: missing color-scheme meta`);
  if (!/<meta name="supported-color-schemes" content="light dark"/.test(r.html)) failures.push(`${r.name}: missing supported-color-schemes meta`);
  if (/<link[^>]+rel="stylesheet"/.test(r.html)) failures.push(`${r.name}: external stylesheet (must be inline)`);
  if (/@import/.test(r.html)) failures.push(`${r.name}: @import in CSS`);
  if (/sales@golfbuggiesexpress\.com\.au/.test(r.html.replace(/mailto:[^"]+/g, '').replace(/acecarts01@gmail\.com/g, '').replace(/PayID<\/div>[\s\S]{0,400}?sales@golfbuggiesexpress\.com\.au/g, ''))) failures.push(`${r.name}: plaintext sales email in body (entity-encode it)`);
  if (r.subject.length > 90) failures.push(`${r.name}: subject too long (${r.subject.length})`);
  if (Buffer.byteLength(r.html, 'utf8') > 100 * 1024) failures.push(`${r.name}: HTML over 100 KB (Gmail clips at ~102 KB)`);
  fs.writeFileSync(path.join(outDir, `${r.name}.html`), r.html);
  console.log(`${r.name}: ${tables.length} tables, ${tds.length} cells, ${Math.round(Buffer.byteLength(r.html) / 1024)} KB - ${r.subject}`);
}

if (failures.length) {
  console.error('\nEMAIL LINT FAILED');
  failures.forEach((f) => console.error(' - ' + f));
  process.exit(1);
}
console.log(`\nemail lint OK - previews in docs/email-previews/`);
