import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import CryptoPortal from '@/src/components/CryptoPortal';
import { SITE, CRYPTO, CONTACT } from '@/src/config/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: `Pay in Bitcoin or USDT | ${CRYPTO.discountPercent}% Off | ${SITE.name}`,
  description: `Pay for your golf buggy in BTC or USDT on this site and take ${CRYPTO.discountPercent}% off the vehicle price. Address and QR at checkout; confirm with your receipt on WhatsApp.`,
  path: '/crypto-payment/',
});

export default function CryptoPaymentPage() {
  // HowTo describes the three steps on the page itself. No offer or price
  // claims here - those live on the product pages where they are authoritative.
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Pay for a golf buggy in Bitcoin or USDT at ${SITE.name}`,
    description: `How to settle a golf buggy order in cryptocurrency and claim the ${CRYPTO.discountPercent}% vehicle-price discount.`,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Add the buggy to your cart and choose Crypto',
        text: `The ${CRYPTO.discountPercent}% crypto settlement discount comes off the vehicle price automatically; accessories and freight stay at full rate.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Tap Pay with BTC / USDT',
        text: 'The cart shows the Bitcoin, USDT (TRC-20) or USDT (ERC-20) settlement address with a QR code and your order reference. Send the AUD-equivalent from any wallet or exchange you already use.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Confirm on WhatsApp with your receipt',
        text: 'Send a screenshot of the payment receipt or the transaction ID on WhatsApp. The sales desk matches it on-chain, issues the tax invoice and quotes freight to your postcode.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Header />
      <main className="bg-[#F7F6F2] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7EFEA] border border-[#C86D51]/30 text-xs font-bold text-[#A85640] mb-4">
              {CRYPTO.discountPercent}% off the vehicle price
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#121417] leading-tight mb-3">
              Pay in Bitcoin or USDT
            </h1>
            <p className="text-sm sm:text-base text-[#6B645E] leading-relaxed max-w-2xl">
              Card and bank settlement carry interchange and international wire costs we
              would otherwise pass on. Paying in crypto avoids them, so we hand that
              saving back as {CRYPTO.discountPercent}% off the vehicle price. You pay
              on this website: the cart&rsquo;s Pay button shows our Bitcoin or USDT
              address and a QR code, you send from whichever wallet or exchange you
              already use, then confirm with your receipt on WhatsApp.
            </p>
          </header>

          <CryptoPortal />

          <p className="mt-8 text-xs text-[#78716C] leading-relaxed">
            Prefer to talk it through first? Call{' '}
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="font-bold text-[#A85640] underline">
              {CONTACT.phoneDisplay}
            </a>{' '}
            or email{' '}
            <span
              className="font-bold text-[#A85640]"
              dangerouslySetInnerHTML={{ __html: CONTACT.email }}
            />
            . All prices on this site include 10% Australian GST, and a tax invoice is
            issued for crypto-settled orders exactly as it is for any other payment
            method.
          </p>
        </div>
      </main>
      <ChatHub />
      <Footer />
    </>
  );
}
