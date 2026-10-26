import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import GuideLinks from '@/src/components/GuideLinks';
import ChatHub from '@/src/components/ChatHub';
import PayIn4Calculator from '@/src/components/PayIn4Calculator';
import FaqSection from '@/src/components/FaqSection';
import { SITE, SHOP, CONTACT } from '@/src/config/site';
import { PAY_IN_4, fmtAud } from '@/lib/pay-in-4';
import { pageMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { PAY_IN_4_FAQS } from '@/src/config/pay-in-4-faqs';

export const metadata: Metadata = pageMetadata({
  title: `Pay in 4 Golf Buggies | 0% Interest | ${SITE.name}`,
  description: `Split a golf buggy order over ${fmtAud(PAY_IN_4.min)} AUD into 4 equal ${SHOP.financeIn4.interestRate} interest payments, fortnightly or monthly. Use the calculator to see your payments and dates.`,
  path: '/pay-in-4/',
});

export default function PayIn4Page() {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Pay for a golf buggy in 4 payments at ${SITE.name}`,
    description: `How to split a golf buggy order over ${fmtAud(PAY_IN_4.min)} AUD into 4 equal interest-free payments.`,
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Work out your 4 payments', text: 'Enter the order amount in the calculator, add your freight quote if you have one, and choose fortnightly or monthly to see each payment and its date.' },
      { '@type': 'HowToStep', position: 2, name: 'Choose Finance in 4 at checkout', text: `Add an eligible buggy to your cart and choose Finance in 4. It is offered on orders over ${fmtAud(PAY_IN_4.min)} AUD.` },
      { '@type': 'HowToStep', position: 3, name: 'Confirm with the sales desk', text: 'We issue your tax invoice with the plan, quote freight to your postcode, and you confirm your order by sending your first payment receipt on WhatsApp.' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Pay in 4', path: '/pay-in-4/' }])) }}
      />
      <Header />
      <main className="bg-[#F7F6F2] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7EFEA] border border-[#C86D51]/30 text-xs font-bold text-[#8F4632] mb-4">
              {SHOP.financeIn4.interestRate} interest · orders over {fmtAud(PAY_IN_4.min)}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#121417] leading-tight mb-3">Pay in 4 for golf buggies</h1>
            <p className="text-sm sm:text-base text-[#6B645E] leading-relaxed max-w-2xl">
              Split any order over {fmtAud(PAY_IN_4.min)} AUD into 4 equal payments with {SHOP.financeIn4.interestRate} interest, paid fortnightly or monthly.
              The first payment is due today and the other three follow on schedule. Try your own numbers below: the amounts and dates update as you type.
            </p>
          </header>

          <PayIn4Calculator tone="light" />

          <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="How Pay in 4 works">
            {[
              ['1', 'Work out your payments', 'Enter your order amount and, once we quote it, your freight. Pick fortnightly or monthly.'],
              ['2', 'Choose Finance in 4', `Add an eligible buggy to your cart and select Finance in 4. It appears on orders over ${fmtAud(PAY_IN_4.min)}.`],
              ['3', 'Confirm on WhatsApp', 'We issue your tax invoice with the plan and quote freight to your postcode. Send your first payment receipt to confirm.'],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl bg-white border border-[#E7E5E4] p-4">
                <div className="w-7 h-7 rounded-full bg-[#B45A40] text-white text-xs font-extrabold flex items-center justify-center mb-2">{n}</div>
                <h2 className="text-sm font-extrabold text-[#121417] mb-1">{t}</h2>
                <p className="text-xs text-[#6B645E] leading-relaxed">{d}</p>
              </div>
            ))}
          </section>

          <div className="mt-10">
            <FaqSection items={PAY_IN_4_FAQS} heading="Pay in 4 questions" tone="light" />
          </div>

          <div className="mt-10">
            <GuideLinks
              heading="Related buying guides"
              guides={[
                { slug: 'golf-cart-finance-options-pay-in-4-vs-crypto-discounts', label: 'Golf buggy finance in Australia: Pay in 4 vs crypto discounts' },
                { slug: 'eofy-golf-buggy-deals-australia-buying-guide', label: 'EOFY golf buggy buying guide' },
                { slug: 'golf-buggy-instant-asset-write-off-business-australia', label: 'Instant asset write-off for business buggies' },
              ]}
            />
          </div>

          <p className="mt-8 text-xs text-[#6B645E] leading-relaxed">
            Prefer to talk it through? Call{' '}
            <a href={`tel:${CONTACT.phone}`} className="font-bold text-[#A85640] underline">{CONTACT.phoneDisplay}</a> or{' '}
            <a href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent('Hi, I have a question about Pay in 4.')}`} className="font-bold text-[#A85640] underline">message us on WhatsApp</a>.
            All prices include 10% Australian GST. Browse <Link href="/shop/" className="font-bold text-[#A85640] underline">all golf buggies</Link>.
          </p>
        </div>
      </main>
      <ChatHub />
      <Footer />
    </>
  );
}
