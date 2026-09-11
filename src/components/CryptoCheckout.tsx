'use client';

import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Bitcoin, Copy, Check, MessageSquare, ShieldAlert, AlertTriangle } from 'lucide-react';
import { CRYPTO, CONTACT, SITE } from '@/src/config/site';

type WalletKey = (typeof CRYPTO.wallets)[number]['key'];

interface CryptoCheckoutProps {
  /** AUD payable after the crypto discount, excluding freight. */
  amountAud: number;
  /** Order reference shown on the invoice and in the WhatsApp confirmation.
   *  Omit for the guide on /crypto-payment/, where there is no order yet. */
  orderRef?: string;
  /** One line per item, for the WhatsApp confirmation. */
  itemLines?: string[];
  /** Buyer name, if collected, for the WhatsApp confirmation. */
  buyerName?: string;
  /** Fired when the buyer taps the WhatsApp confirmation (e.g. to clear the cart). */
  onConfirm?: () => void;
  /** Tighter layout for the cart drawer. */
  compact?: boolean;
}

/**
 * On-site crypto invoice. Nothing leaves the page: the buyer picks BTC or USDT,
 * sees the settlement address and its QR, sends from whichever wallet or
 * exchange they already use, then confirms with a receipt on WhatsApp. The
 * three addresses are the owner's; they are read from CRYPTO.wallets and are
 * never fetched or generated. No live exchange rate is quoted (the site makes
 * no outbound calls); the invoice is the AUD figure and the sales desk
 * confirms the crypto amount received against it.
 */
export default function CryptoCheckout({
  amountAud,
  orderRef,
  itemLines = [],
  buyerName,
  onConfirm,
  compact = false,
}: CryptoCheckoutProps) {
  const [walletKey, setWalletKey] = useState<WalletKey>(CRYPTO.wallets[0].key);
  const [qr, setQr] = useState<string>('');
  const [copied, setCopied] = useState<'address' | 'amount' | null>(null);

  const wallet = useMemo(() => CRYPTO.wallets.find((w) => w.key === walletKey) ?? CRYPTO.wallets[0], [walletKey]);

  // BIP-21 for Bitcoin so wallet apps pre-fill the recipient; a bare address
  // for USDT, which every Tron and Ethereum wallet scans directly.
  const qrPayload =
    wallet.asset === 'BTC'
      ? `bitcoin:${wallet.address}?label=${encodeURIComponent(orderRef ? `${SITE.name} ${orderRef}` : SITE.name)}`
      : wallet.address;
  const headingId = `crypto-invoice-${orderRef ?? 'guide'}`;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(qrPayload, { errorCorrectionLevel: 'M', margin: 1, width: 220, color: { dark: '#121417', light: '#ffffff' } })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => setQr(''));
    return () => {
      cancelled = true;
    };
  }, [qrPayload]);

  const copy = async (what: 'address' | 'amount', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard unavailable: the value is visible and selectable */
    }
  };

  // On the guide page there may be no figure yet.
  const hasAmount = amountAud > 0;
  const amountText = hasAmount ? `$${amountAud.toLocaleString('en-AU')} AUD` : 'the amount agreed with our sales desk';

  const whatsappMessage = encodeURIComponent(
    `Hello ${SITE.name}, I have paid ${orderRef ? `order ${orderRef}` : 'my order'} in ${wallet.asset} (${wallet.network}).\n` +
      (hasAmount ? `Amount: ${amountText} (10% crypto discount applied, freight to be quoted)\n` : '') +
      (itemLines.length ? `Items:\n${itemLines.join('\n')}\n` : '') +
      (buyerName ? `Name: ${buyerName}\n` : '') +
      `Receipt / transaction screenshot attached below.`
  );

  const pad = compact ? 'p-4' : 'p-5 sm:p-6';

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      {/* Invoice header */}
      <div className={`bg-[#121417] text-white rounded-2xl ${pad} space-y-3`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#E2A17A]">
              {orderRef ? 'Crypto invoice' : 'Settlement addresses'}
            </div>
            <h3 id={headingId} className="text-base sm:text-lg font-serif font-bold leading-tight">
              {orderRef ? `Order ${orderRef}` : 'Pay in BTC or USDT'}
            </h3>
          </div>
          <Bitcoin className="w-6 h-6 text-[#E2A17A] shrink-0" aria-hidden="true" />
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-[#2B2F34] pt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#A8A29E]">Amount payable</div>
            <div className={`${hasAmount ? 'text-2xl' : 'text-sm'} font-extrabold text-[#E2A17A] leading-none mt-1`}>{amountText}</div>
            <div className="text-[10px] text-[#A8A29E] mt-1">10% crypto discount applied · excludes freight · GST inclusive</div>
          </div>
          {hasAmount && (
            <button
              type="button"
              onClick={() => copy('amount', String(amountAud))}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#2B2F34] text-[11px] font-semibold text-white hover:border-[#E2A17A] transition-colors"
            >
              {copied === 'amount' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'amount' ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>

        {/* Asset / network picker */}
        <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Choose the coin and network">
          {CRYPTO.wallets.map((w) => {
            const active = w.key === walletKey;
            return (
              <button
                key={w.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setWalletKey(w.key)}
                className={`rounded-lg border px-2 py-2 text-left transition-colors ${
                  active ? 'border-[#E2A17A] bg-[#1A1D21]' : 'border-[#2B2F34] hover:border-[#6B645E]'
                }`}
              >
                <div className="text-[11px] font-bold leading-tight">{w.asset}</div>
                <div className="text-[9px] text-[#A8A29E] leading-tight">{w.network}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Address + QR */}
      <div className={`bg-white border border-[#E7E5E4] rounded-2xl ${pad} space-y-3`}>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#A85640]">
          Send {wallet.asset} on {wallet.network} to
        </div>
        <div className={`flex ${compact ? 'flex-col' : 'flex-col sm:flex-row'} gap-3 items-start`}>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt={`QR code for the ${wallet.asset} ${wallet.network} settlement address`}
              width={compact ? 132 : 160}
              height={compact ? 132 : 160}
              className="rounded-lg border border-[#E7E5E4] bg-white shrink-0"
            />
          ) : (
            <div className="w-[132px] h-[132px] rounded-lg border border-[#E7E5E4] bg-[#F7F6F2]" aria-hidden="true" />
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <code className="block break-all text-[11px] sm:text-xs font-mono text-[#121417] bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg px-2.5 py-2 select-all">
              {wallet.address}
            </code>
            <button
              type="button"
              onClick={() => copy('address', wallet.address)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#B45A40] hover:bg-[#9A4C36] text-white text-xs font-bold transition-colors"
            >
              {copied === 'address' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'address' ? 'Address copied' : 'Copy address'}
            </button>
            <p className="text-[10px] text-[#6B645E] leading-relaxed">
              {wallet.assetName} address ({wallet.addressHint}). Send the {wallet.asset} equivalent of {amountText} at the rate your wallet or
              exchange shows at the time of transfer. Network fees are paid by the sender.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-[#7A2E12] bg-[#FBEDE7] border border-[#E2A17A]/50 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong>Check the network before you send.</strong> USDT sent on the wrong network, or any coin sent to a mistyped
            address, cannot be recovered. Only ever use an address shown on this website — never one sent to you by email or
            message.
          </p>
        </div>
      </div>

      {/* Confirmation step */}
      <div className={`bg-[#F7F6F2] border border-[#E7E5E4] rounded-2xl ${pad} space-y-3`}>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#A85640]">After you have paid</div>
        <ol className="space-y-1.5 text-xs text-[#121417] list-decimal pl-4">
          <li>Take a screenshot of the receipt, or copy the transaction ID (TXID / hash).</li>
          <li>Tap the button below and attach it to the WhatsApp message.</li>
          <li>We confirm the payment on-chain, issue the tax invoice, and quote freight to your postcode.</li>
        </ol>
        <a
          href={`${CONTACT.whatsappUrl}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#188741] hover:bg-[#147136] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
        >
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span>Confirm payment on WhatsApp with receipt</span>
        </a>
        <p className="flex items-start gap-1.5 text-[10px] text-[#6B645E] leading-relaxed">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
          <span>
            Your order is confirmed once we match the payment{orderRef ? ` to order ${orderRef}` : ' to your order'}. WhatsApp{' '}
            {CONTACT.phoneDisplay} · {SITE.legalEntity}, ABN
            28 668 598 758.
          </span>
        </p>
      </div>
    </section>
  );
}
