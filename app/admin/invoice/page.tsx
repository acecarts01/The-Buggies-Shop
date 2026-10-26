import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import { getEnquiry } from '@/lib/db';
import { verifyQuote } from '@/lib/quotes';
import { verifyOrder, aud, paymentLabel } from '@/lib/orders';
import { contextFromEnquiry, contextFromQuote, type EnquiryContext } from '@/lib/enquiry-context';
import { findProduct } from '@/lib/reply-draft';
import { PRODUCTS, SHOP } from '@/src/config/site';
import { introFor } from '@/lib/order-kind';
import AdminShell from '@/src/components/admin/AdminShell';
import DocumentBuilder, { type BuilderPrefill } from '@/src/components/admin/DocumentBuilder';

// /admin/invoice/ - build a quote or a tax invoice and email it.
// Every entry point arrives with the client and the products already filled in,
// so the desk only adds the payment details and presses send:
//   ?o=<order token>   a cart order: client, every line, discounts, payment choice
//   ?q=<token>         a quote-request link
//   ?enquiry=<id>      a portal enquiry
// With no parameter it is a blank builder. Bank details load from env:
//   BANK_ACCOUNT_NAME, BANK_BSB, BANK_ACCOUNT_NUMBER, BANK_PAYID

const first = (name: string) => name.split(' ')[0] || 'there';

function fromContext(ctx: EnquiryContext, source: BuilderPrefill['source'], asked: 'quote' | 'invoice'): BuilderPrefill {
  // The form sends "Name (price AUD)": match the exact product first, then fall back to a fuzzy match.
  const exact = ctx.model ? PRODUCTS.find((p) => ctx.model!.toLowerCase().startsWith(p.name.toLowerCase())) : undefined;
  const product = exact ?? findProduct(ctx.message, ctx.model);
  return {
    kind: asked,
    client: { name: ctx.name, email: ctx.email, phone: ctx.phone ?? '', postcode: ctx.postcode ?? '' },
    lines: product ? [{ slug: product.slug, name: product.name, description: '', qty: 1, price: product.price_aud }] : [],
    message: introFor({ first: first(ctx.name), lines: product ? [{ slug: product.slug, name: product.name }] : [], source: 'request', asked, postcode: ctx.postcode }),
    paymentPreference: ctx.paymentPreference,
    source,
    request: { message: ctx.message, delivery: ctx.deliveryPreference, model: ctx.model, asked },
  };
}

export default async function InvoicePage({ searchParams }: { searchParams: Promise<{ o?: string; enquiry?: string; q?: string; kind?: string }> }) {
  const { o, enquiry, q, kind } = await searchParams;
  if (!(await isAdminRequest())) {
    const qs = o ? `?o=${o}` : enquiry ? `?enquiry=${enquiry}` : q ? `?q=${q}` : '';
    redirect(`/admin/login/?next=${encodeURIComponent(`/admin/invoice/${qs}`)}`);
  }

  let prefill: BuilderPrefill | undefined;

  if (o) {
    const order = verifyOrder(o);
    if (order) {
      const t = order.totals;
      const lines: BuilderPrefill['lines'] = order.lines.map((l) => ({ slug: l.slug, name: l.name, description: '', qty: l.quantity, price: l.unitPrice }));
      if (t.accessoryDiscount > 0) lines.push({ name: `Accessory bundle discount (${SHOP.accessoryBundleDiscount}%)`, description: '', qty: 1, price: -t.accessoryDiscount });
      if (t.cryptoDiscount > 0) lines.push({ name: `Crypto settlement discount (${SHOP.cryptoDiscount}% off the vehicle price)`, description: '', qty: 1, price: -t.cryptoDiscount });
      prefill = {
        kind: 'invoice',
        client: { name: order.customer.name, email: order.customer.email, phone: order.customer.phone ?? '', postcode: order.customer.postcode ?? '' },
        lines,
        message: introFor({ first: first(order.customer.name), lines: order.lines.map((l) => ({ slug: l.slug, name: l.name })), source: 'order', asked: 'invoice', postcode: order.customer.postcode }),
        paymentPreference: order.payment,
        financeFrequency: t.financeFrequency,
        source: { type: 'order', ref: order.ref, label: `order ${order.ref} (${aud(t.total)}, ${paymentLabel(order.payment)})`, token: o },
        request: { asked: 'invoice' },
      };
    }
  } else if (q) {
    const quote = verifyQuote(q);
    if (quote) prefill = fromContext(contextFromQuote(quote), { type: 'quote', ref: quote.ref, label: `quote request ${quote.ref}`, token: q }, quote.requestType === 'invoice' ? 'invoice' : 'quote');
  } else if (enquiry) {
    const n = Number(enquiry);
    const row = Number.isInteger(n) && n > 0 ? await getEnquiry(n).catch(() => null) : null;
    if (row) {
      const ctx = contextFromEnquiry(row);
      const asked = row.payload?.requestType === 'invoice' ? 'invoice' : 'quote';
      prefill = fromContext(ctx, { type: 'enquiry', ref: ctx.ref, label: `enquiry ${ctx.ref}`, id: row.id }, asked);
    }
  }

  const bankDefaults = {
    accountName: process.env.BANK_ACCOUNT_NAME ?? '',
    bsb: process.env.BANK_BSB ?? '',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '',
    payId: process.env.BANK_PAYID ?? '',
  };

  return (
    <AdminShell
      wide
      title={prefill ? `${prefill.kind === 'invoice' ? 'Invoice' : 'Quote'} for ${prefill.client.name}` : 'New quote or invoice'}
      subtitle={prefill ? 'Client and products are filled in. Add the payment details, check the preview and send.' : 'Build it, check the live preview, approve and send. The client gets a branded email and the sales desk gets a copy.'}
    >
      <DocumentBuilder bankDefaults={bankDefaults} prefill={prefill} initialKind={prefill?.kind ?? (kind === 'invoice' ? 'invoice' : 'quote')} />
    </AdminShell>
  );
}
