import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Wrench, Truck, MessageCircle } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import FaqSection from '@/src/components/FaqSection';
import ExternalReferences from '@/src/components/ExternalReferences';
import { SITE, CONTACT, RETURNS } from '@/src/config/site';
import { RETURNS_FAQS } from '@/src/config/returns-faqs';
import { REFERENCES } from '@/src/config/references';
import { pageMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = pageMetadata({
  title: `Returns, Refunds & Warranty | ${SITE.name}`,
  description: `Buy with confidence: Australian Consumer Law guarantees apply, faults are fixed locally from Yatala QLD, and parts can be returned within ${RETURNS.accessoryChangeOfMindDays} days.`,
  path: RETURNS.path,
});

const PROMISES = [
  { icon: ShieldCheck, title: 'Tested before it leaves', body: 'Every vehicle is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so it arrives ready to use.' },
  { icon: Wrench, title: 'Faults fixed locally', body: 'Warranty and repair work is handled from our Australian depot, with parts held here, not by an overseas returns address.' },
  { icon: Truck, title: 'Delivery damage is on us', body: `Tell us within ${RETURNS.transitReportBusinessDays} business days of delivery and we arrange the repair, replacement or refund and deal with the carrier.` },
  { icon: MessageCircle, title: 'One team, straight answers', body: 'Message the same sales desk that sold you the buggy. A person replies, and you are told the next step in plain words.' },
];

const SITUATIONS: [string, string][] = [
  ['It arrives damaged or incomplete', `Note it on the delivery docket and message us with photos within ${RETURNS.transitReportBusinessDays} business days. We arrange the repair, replacement or refund at our cost.`],
  ['It has a fault or is not as described', 'We repair it, replace it or refund it under the Australian Consumer Law guarantees, and we cover the reasonable cost of returning it. For a major failure you choose a replacement or a refund.'],
  ['You need a warranty repair', 'Claim against the Australian warranty shown on your product page. Keep your tax invoice. Repairs are handled by our Yatala QLD workshop and technicians.'],
  ['You change your mind about a buggy', RETURNS.cancelBeforeDispatch ? 'Cancel any time before it is dispatched and we refund everything you have paid. Once dispatched it cannot be returned for change of mind.' : 'Once dispatched it cannot be returned for change of mind. Ask us before you order if you are unsure.'],
  ['You change your mind about a part or accessory', `Unused, unopened items in original packaging can be returned within ${RETURNS.accessoryChangeOfMindDays} days of delivery for a refund of the item price. Message us first and you cover the return freight.`],
];

export default function ReturnsPage() {
  const policySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Returns, Refunds and Warranty | ${SITE.name}`,
    url: `https://${SITE.domain}${RETURNS.path}`,
    about: { '@type': 'MerchantReturnPolicy', applicableCountry: 'AU' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(policySchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Returns, refunds & warranty', path: RETURNS.path }])) }}
      />
      <Header />
      <main className="bg-[#F7F6F2] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
          <header>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7EFEA] border border-[#C86D51]/30 text-xs font-bold text-[#8F4632] mb-4">
              Australian Consumer Law guarantees apply
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#121417] leading-tight mb-3">Returns, refunds and warranty</h1>
            <p className="text-sm sm:text-base text-[#6B645E] leading-relaxed max-w-2xl">
              You are buying from a registered Australian company with a real depot, a real workshop and a real phone number. If something is wrong with
              what we sold you, we put it right, quickly and in writing. Here is exactly how it works, so there are no surprises after you buy.
            </p>
          </header>

          <section aria-label="Our promises" className="grid gap-4 sm:grid-cols-2">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white border border-[#E7E5E4] p-5 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F7EFEA] text-[#8F4632] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#121417] mb-1">{title}</h2>
                  <p className="text-xs text-[#6B645E] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </section>

          <section aria-labelledby="what-happens" className="rounded-2xl bg-white border border-[#E7E5E4] p-5 sm:p-6">
            <h2 id="what-happens" className="text-lg font-serif font-bold text-[#121417] mb-4">What happens if&hellip;</h2>
            <dl className="divide-y divide-[#E7E5E4]">
              {SITUATIONS.map(([q, a]) => (
                <div key={q} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-bold text-[#121417] mb-1 sm:mb-0">{q}</dt>
                  <dd className="text-sm text-[#6B645E] leading-relaxed sm:col-span-2">{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="claim-steps" className="rounded-2xl bg-white border border-[#E7E5E4] p-5 sm:p-6">
            <h2 id="claim-steps" className="text-lg font-serif font-bold text-[#121417] mb-4">Making a claim takes three steps</h2>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                ['1', 'Message us', 'WhatsApp or email the sales desk with your tax invoice number and a few photos.'],
                ['2', 'We reply with the plan', 'A person at the Yatala QLD depot confirms the next step: repair, replacement, collection or refund.'],
                ['3', 'It is put right', 'We arrange the fix or the refund and confirm it in writing. Refunds go back to the method you paid with.'],
              ].map(([n, t, d]) => (
                <li key={n}>
                  <div className="w-7 h-7 rounded-full bg-[#B45A40] text-white text-xs font-extrabold flex items-center justify-center mb-2">{n}</div>
                  <h3 className="text-sm font-extrabold text-[#121417] mb-1">{t}</h3>
                  <p className="text-xs text-[#6B645E] leading-relaxed">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent('Hi, I need help with a return, refund or warranty claim.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold bg-[#25D366] text-[#0B2A16] hover:brightness-95 transition"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" /> Start a claim on WhatsApp
              </a>
              <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-bold border border-[#C86D51]/40 text-[#8F4632] hover:bg-[#F7EFEA] transition-colors">
                Call {CONTACT.phoneDisplay}
              </a>
            </div>
          </section>

          <section aria-labelledby="acl" className="rounded-2xl bg-[#F7EFEA] border border-[#C86D51]/30 p-5 sm:p-6">
            <h2 id="acl" className="text-lg font-serif font-bold text-[#121417] mb-2">Your rights under the Australian Consumer Law</h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major
              failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if the
              goods fail to be of acceptable quality and the failure does not amount to a major failure. Nothing on this page limits those rights.
            </p>
          </section>

          <FaqSection items={RETURNS_FAQS} heading="Returns and refunds questions" tone="light" />

          <ExternalReferences refs={[REFERENCES['accc-guarantees']]} heading="Consumer Guarantees: Official Guidance" tone="light" />

          <p className="text-xs text-[#6B645E] leading-relaxed">
            {SITE.name} is operated by Golf Buggies Express Pty Ltd, Yatala QLD. Questions before you buy? Read our{' '}
            <Link href="/delivery/" className="font-bold text-[#8F4632] underline">delivery details</Link>, see{' '}
            <Link href="/pay-in-4/" className="font-bold text-[#8F4632] underline">Pay in 4</Link> or{' '}
            <Link href="/contact/" className="font-bold text-[#8F4632] underline">contact the sales desk</Link>.
          </p>
        </div>
      </main>
      <ChatHub />
      <Footer />
    </>
  );
}
