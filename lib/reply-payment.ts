// Validates the payment block of a reply: only configured wallets, well-formed bank details.
import { type InvoiceDetails } from '@/lib/orders-shared';
import { CRYPTO } from '@/src/config/site';

export function cleanPayment(raw: Partial<InvoiceDetails> | undefined): InvoiceDetails | undefined | { error: string } {
  if (!raw || !raw.method) return undefined; // payment details are optional on a quote reply
  const method = raw.method;
  if (method !== 'bank' && method !== 'crypto' && method !== 'finance4') return { error: 'Choose a payment method or remove the payment section.' };
  const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
  const inv: InvoiceDetails = { issuedAt: new Date().toISOString(), method };

  if (method === 'bank') {
    const b: Partial<NonNullable<InvoiceDetails['bank']>> = raw.bank ?? {};
    const accountName = s(b.accountName, 80);
    const bsb = s(b.bsb, 12).replace(/[^\d-]/g, '');
    const accountNumber = s(b.accountNumber, 20).replace(/[^\d]/g, '');
    if (!accountName || !/^\d{3}-?\d{3}$/.test(bsb) || accountNumber.length < 5) return { error: 'Bank transfer needs an account name, a 6-digit BSB and an account number.' };
    inv.bank = { accountName, bsb: bsb.includes('-') ? bsb : `${bsb.slice(0, 3)}-${bsb.slice(3)}`, accountNumber, payId: s(b.payId, 80) || undefined };
  }
  if (method === 'crypto') {
    const w = CRYPTO.wallets.find((x) => x.key === raw.crypto?.walletKey);
    if (!w) return { error: 'Pick one of the configured settlement wallets.' };
    inv.crypto = { walletKey: w.key, asset: w.asset, network: w.network, address: w.address };
  }
  if (method === 'finance4') {
    const instructions = s(raw.finance4?.instructions, 600);
    const link = s(raw.finance4?.link, 300);
    if (!instructions) return { error: 'Finance in 4 needs the instructions the buyer should follow.' };
    if (link && !/^https:\/\//.test(link)) return { error: 'The Finance in 4 link must start with https://' };
    inv.finance4 = { instructions, link: link || undefined };
  }
  return inv;
}
