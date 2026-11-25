import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import ExternalReferences from '@/src/components/ExternalReferences';
import { SITE, CONTACT } from '@/src/config/site';
import { REFERENCES } from '@/src/config/references';
import { pageMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = pageMetadata({
  title: `Privacy Policy | ${SITE.name}`,
  description: 'How GOLF BUGGIES EXPRESS PTY LTD collects, uses and protects personal information from orders and enquiries, and how to ask for access or correction.',
  path: '/privacy/',
});

const SECTIONS: [string, string[]][] = [
  [
    'Who we are',
    [
      'This policy applies to the website operated by GOLF BUGGIES EXPRESS PTY LTD (ACN 668 598 758, ABN 28 668 598 758), Yatala QLD 4207, trading as The Buggies Express. Where this policy says we, us or our, it means that company.',
    ],
  ],
  [
    'What we collect',
    [
      'We collect the information you give us when you place an order, request a quote, use the contact or wholesale forms, register interest in a product or message us by email, phone or WhatsApp. That usually means your name, email address, phone number, delivery address and postcode, the products you ask about and anything you choose to tell us.',
      'For orders we also keep the details needed to issue a tax invoice and to confirm payment, such as the order contents, the payment method you chose and the receipt or screenshot you send us. We do not ask for your card details on this website, and we never ask for your crypto wallet seed phrase or private keys.',
    ],
  ],
  [
    'How we use it',
    [
      'We use personal information to answer enquiries, prepare quotes and invoices, take payment, arrange enclosed freight to your address, provide warranty and parts support, meet our tax and record-keeping duties and keep the website secure. We may also contact you about an order or enquiry you started.',
      'We do not sell personal information. We send marketing messages only where you have asked for them or where the law allows, and every such message tells you how to opt out.',
    ],
  ],
  [
    'Who we share it with',
    [
      'We share only what is needed with the people who help us serve you: freight carriers and transport operators (name, address, phone and delivery instructions), our email and website hosting providers, payment and banking providers, and our accountants and professional advisers. We may also disclose information where the law requires it.',
      'Some of these providers store data on servers outside Australia. We choose providers with care and share only the information needed for the task.',
    ],
  ],
  [
    'Cookies and your browser',
    [
      'The site stores small items in your browser, such as your cart, so that it works between pages. You can clear them in your browser settings. If we add analytics or advertising tools in future, we will update this page first.',
    ],
  ],
  [
    'Security and how long we keep it',
    [
      'We keep order and invoice records for as long as tax and business record-keeping rules require, and enquiries for as long as they are useful for service and support. We take reasonable steps to protect information from misuse, loss and unauthorised access, but no internet service can promise absolute security. Please do not send passwords or private keys by email or message.',
    ],
  ],
  [
    'Access, correction and complaints',
    [
      `You can ask to see the personal information we hold about you, ask us to correct it or ask us to delete it where we are allowed to. Email ${CONTACT.emailRaw.replace('@', ' at ')} or call ${CONTACT.phoneDisplay} and we will respond within a reasonable time. If you are unhappy with our response, you can contact the Office of the Australian Information Commissioner at oaic.gov.au.`,
    ],
  ],
  [
    'Changes to this policy',
    [
      'We may update this policy as the website or the law changes. The current version is always on this page.',
    ],
  ],
];

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy policy', path: '/privacy/' }])) }}
      />
      <Header />
      <main className="bg-[#F7F6F2] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
          <header>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#121417] leading-tight mb-3">Privacy policy</h1>
            <p className="text-sm sm:text-base text-[#6B645E] leading-relaxed">
              This page explains what personal information we collect when you buy from or contact The Buggies Express, why we collect it and what your rights are.
              Last updated November 2026.
            </p>
          </header>
          {SECTIONS.map(([h, paras]) => (
            <section key={h} className="rounded-2xl bg-white border border-[#E7E5E4] p-5 sm:p-6">
              <h2 className="text-lg font-serif font-bold text-[#121417] mb-3">{h}</h2>
              <div className="space-y-3">
                {paras.map((p) => (
                  <p key={p.slice(0, 40)} className="text-sm text-[#57534E] leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          ))}
          <ExternalReferences refs={[REFERENCES.abr]} heading="Verify Our Business Details" tone="light" />
          <p className="text-xs text-[#6B645E] leading-relaxed">
            Questions about this policy? <Link href="/contact/" className="font-bold text-[#8F4632] underline">Contact the sales desk</Link>, read our{' '}
            <Link href="/returns/" className="font-bold text-[#8F4632] underline">returns and warranty page</Link> or see{' '}
            <Link href="/delivery/" className="font-bold text-[#8F4632] underline">delivery details</Link>.
          </p>
        </div>
      </main>
      <Footer />
      <ChatHub />
    </>
  );
}
