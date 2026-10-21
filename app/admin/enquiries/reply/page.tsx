import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import { getEnquiry } from '@/lib/db';
import { contextFromEnquiry } from '@/lib/enquiry-context';
import { draftReply } from '@/lib/reply-draft';
import AdminShell from '@/src/components/admin/AdminShell';
import EnquiryReplyTerminal from '@/src/components/admin/EnquiryReplyTerminal';

// /admin/enquiries/reply/?id=<enquiry id> - the reply terminal for any enquiry
// in the portal (contact, quote, wholesale, trade-in). The client's details and
// words are loaded from the database, and the reply is auto-drafted from them:
// read it, edit it, approve it, send it.
export default async function EnquiryReplyPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!(await isAdminRequest())) redirect(`/admin/login/?next=${encodeURIComponent(`/admin/enquiries/reply/${id ? `?id=${id}` : ''}`)}`);
  const n = Number(id);
  const row = Number.isInteger(n) && n > 0 ? await getEnquiry(n) : null;
  if (!row) redirect('/admin/portal/?tab=enquiries');

  const ctx = contextFromEnquiry(row);
  const draft = draftReply(ctx);
  const bankDefaults = {
    accountName: process.env.BANK_ACCOUNT_NAME ?? '',
    bsb: process.env.BANK_BSB ?? '',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '',
    payId: process.env.BANK_PAYID ?? '',
  };

  return (
    <AdminShell wide title={`Reply to ${ctx.name}`} subtitle={`${ctx.ref} · ${ctx.email || 'no email on file'} · the reply is drafted from their enquiry; read, edit, approve and send.`}>
      <EnquiryReplyTerminal
        source={{ kind: 'enquiry', id: row.id }}
        ctx={ctx}
        draft={draft}
        bankDefaults={bankDefaults}
        replied={row.repliedAt ? { at: row.repliedAt, subject: row.replySubject, message: row.replyMessage } : null}
      />
    </AdminShell>
  );
}
