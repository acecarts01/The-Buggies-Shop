import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import { verifyQuote } from '@/lib/quotes';
import AdminShell from '@/src/components/admin/AdminShell';
import QuoteReplyTerminal from '@/src/components/admin/QuoteReplyTerminal';

// /admin/quotes/reply/?q=<token> - the pre-filled quote-reply terminal,
// reached from the "Reply to Client" button in the quote-request email.
export default async function QuoteReplyPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login/?next=${encodeURIComponent(`/admin/quotes/reply/${q ? `?q=${q}` : ''}`)}`);
  const quote = verifyQuote(q);
  if (!quote || !q) redirect('/admin/portal/');

  const bankDefaults = {
    accountName: process.env.BANK_ACCOUNT_NAME ?? '',
    bsb: process.env.BANK_BSB ?? '',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '',
    payId: process.env.BANK_PAYID ?? '',
  };

  return (
    <AdminShell wide title={`Reply to ${quote.ref}`} subtitle={`${quote.customer.name} · ${quote.customer.email} · client details are loaded and locked; type your answer and send.`}>
      <QuoteReplyTerminal token={q} quote={quote} bankDefaults={bankDefaults} />
    </AdminShell>
  );
}
