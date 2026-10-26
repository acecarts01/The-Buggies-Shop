import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import { getEnquiry } from '@/lib/db';
import { verifyQuote } from '@/lib/quotes';
import { contextFromEnquiry, contextFromQuote, type EnquiryContext } from '@/lib/enquiry-context';
import { findProduct } from '@/lib/reply-draft';
import AdminShell from '@/src/components/admin/AdminShell';
import DocumentBuilder, { type BuilderPrefill } from '@/src/components/admin/DocumentBuilder';

// /admin/invoice/ - build a quote or a tax invoice from scratch and email it.
//   ?enquiry=<id>  pre-fills the client and the model from a portal enquiry
//   ?q=<token>     the same, from a signed quote-request link
// Bank details load from env so the desk never retypes them:
//   BANK_ACCOUNT_NAME, BANK_BSB, BANK_ACCOUNT_NUMBER, BANK_PAYID
export default async function InvoicePage({ searchParams }: { searchParams: Promise<{ enquiry?: string; q?: string; kind?: string }> }) {
  const { enquiry, q, kind } = await searchParams;
  if (!(await isAdminRequest())) {
    const qs = enquiry ? `?enquiry=${enquiry}` : q ? `?q=${q}` : '';
    redirect(`/admin/login/?next=${encodeURIComponent(`/admin/invoice/${qs}`)}`);
  }

  let ctx: EnquiryContext | null = null;
  let asked: string | undefined;
  if (q) {
    const quote = verifyQuote(q);
    if (quote) {
      ctx = contextFromQuote(quote);
      asked = quote.requestType;
    }
  } else if (enquiry) {
    const n = Number(enquiry);
    const row = Number.isInteger(n) && n > 0 ? await getEnquiry(n).catch(() => null) : null;
    if (row) {
      ctx = contextFromEnquiry(row);
      asked = typeof row.payload?.requestType === 'string' ? (row.payload.requestType as string) : undefined;
    }
  }

  let prefill: BuilderPrefill | undefined;
  if (ctx) {
    const product = findProduct(ctx.message, ctx.model);
    prefill = {
      client: { name: ctx.name, email: ctx.email, phone: ctx.phone ?? '', postcode: ctx.postcode ?? '' },
      productSlug: product?.slug,
      source: `${ctx.ref} · ${ctx.name}`,
      paymentPreference: ctx.paymentPreference,
    };
  }

  const bankDefaults = {
    accountName: process.env.BANK_ACCOUNT_NAME ?? '',
    bsb: process.env.BANK_BSB ?? '',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '',
    payId: process.env.BANK_PAYID ?? '',
  };

  return (
    <AdminShell wide title="New quote or invoice" subtitle="Build it, check the live preview, approve and send. The client gets a branded email and the sales desk gets a copy.">
      <DocumentBuilder bankDefaults={bankDefaults} prefill={prefill} initialKind={(kind ?? asked) === 'invoice' ? 'invoice' : 'quote'} />
    </AdminShell>
  );
}
