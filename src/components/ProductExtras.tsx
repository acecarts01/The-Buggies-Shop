import React from 'react';
import Link from 'next/link';
import { SHOP } from '@/src/config/site';

// Blocks shared by every product page layout (the templated ProductClient and
// the bespoke Atlas page). Props only: nothing here imports a server-only config.

export function ProductTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="pt-4 border-t border-[#2B2F34]">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#A8A29E] mb-2">Tags</h3>
      <ul className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-[#121417] border border-[#2B2F34] text-[#AEB4B8]">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Delivery, payment and warranty: stated once per page instead of in every FAQ answer. */
export function ShippingPaymentBlock() {
  return (
    <section
      className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm metal-brushed-dark"
      aria-labelledby="ship-pay-heading"
    >
      <h2 id="ship-pay-heading" className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight">
        Delivery, Payment and Warranty
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#A8A29E] leading-relaxed">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-[#ffffff]">Delivery</h3>
          <p>
            Everything ships from our single depot at Yatala QLD 4207 to every state and territory. Freight is quoted against your delivery postcode and shown separately from the GST-inclusive price. See the{' '}
            <Link href="/delivery/" className="text-[#E2A17A] font-semibold hover:underline">
              delivery areas
            </Link>
            .
          </p>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-[#ffffff]">Payment</h3>
          <p>
            {SHOP.paymentMethods.join(', ')}. After any payment, send the receipt or a screenshot to us on WhatsApp so we can confirm your order.
          </p>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-[#ffffff]">Warranty and stock</h3>
          <p>
            Warranty and parts support are handled from our Yatala QLD depot, not an overseas returns address. Keep your tax invoice as proof of purchase. Availability changes, so confirm this item is on the floor before you plan around a delivery date.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProductGuides({ guides }: { guides: { slug: string; label: string }[] }) {
  if (!guides.length) return null;
  return (
    <section
      className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm metal-brushed-dark"
      aria-labelledby="guides-heading"
    >
      <h2 id="guides-heading" className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight">
        Buying Guides for This Range
      </h2>
      <ul className="space-y-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/blog/${g.slug}/`} className="text-sm text-[#E2A17A] hover:underline font-semibold">
              {g.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
