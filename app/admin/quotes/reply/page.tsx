import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import { verifyQuote } from '@/lib/quotes';
import { contextFromQuote } from '@/lib/enquiry-context';
import { draftReply } from '@/lib/reply-draft';
import AdminShell from '@/src/components/admin/AdminShell';
import EnquiryReplyTerminal from '@/src/components/admin/EnquiryReplyTerminal';

// /admin/quotes/reply/?q=<token> - reached from the "Reply to Client" button in
// the quote-request email. Same auto-drafted reply terminal as every other
// enquiry (/admin/enquiries/reply/), loaded from the signed link.
export default async function QuoteReplyPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login/?next=${encodeURIComponent(`/admin/quotes/reply/${q ? `?q=${q}` : ''}`)}`);
  const quote = verifyQuote(q);
  if (!quote || !q) redirect('/admin/portal/');

  const ctx = contextFromQuote(quote);
  const draft = draftReply(ctx);
  const bankDefaults = {
    accountName: process.env.BANK_ACCOUNT_NAME ?? '',
    bsb: process.env.BANK_BSB ?? '',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '',
    payId: process.env.BANK_PAYID ?? '',
  };

  return (
    <AdminShell wide title={`Reply to ${quote.ref}`} subtitle={`${quote.customer.name} · ${quote.customer.email} · the reply is drafted from their quote request; read, edit, approve and send.`}>
      <EnquiryReplyTerminal source={{ kind: 'quote', token: q }} ctx={ctx} draft={draft} bankDefaults={bankDefaults} />
    </AdminShell>
  );
}
