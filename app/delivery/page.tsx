import React from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { SITE, BRAND, ABN_INFO, CONTACT, SHOP, PRODUCTS } from '@/src/config/site';
import { DELIVERY_METROS } from '@/src/config/delivery';
import { socialImages } from '@/lib/seo';
import { jsonLd, organizationSchema, ORG_ID } from '@/lib/schema';
import { MapPin, Truck, Globe2, ClipboardCheck, PackageCheck, Route } from 'lucide-react';
import Link from 'next/link';
import {
  StaggeredHeading,
  StaggeredParagraph,
  FadeUpText,
  AnimatedCard,
  StaggerContainer,
  StaggerItem
} from '@/src/components/AnimatedText';

// National hub. Each metro has its own page under /delivery/<city>/ that owns
// the city keywords (e.g. "golf carts gold coast" lives on /delivery/gold-coast/).
const TITLE = 'Golf Buggy Delivery Australia-Wide | Yatala QLD Depot';
const DESCRIPTION =
  'Golf buggies and carts delivered to every Australian state from our Yatala QLD depot. Enclosed freight quoted by postcode, from the Gold Coast to Perth.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `https://${SITE.domain}/delivery/`,
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: `https://${SITE.domain}/delivery/`,
    images: socialImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: socialImages(),
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

// Delivery destinations we genuinely freight to. The metros with their own
// page come from DELIVERY_METROS; Cairns is listed as a destination only.
const METRO_ROUTES = [
  ...DELIVERY_METROS.map((m) => ({
    city: m.city,
    href: `/delivery/${m.slug}/`,
    note: m.freightMode === 'same-corridor' ? 'Same-corridor delivery from the Yatala depot.' : `Enclosed interstate freight into ${m.stateCode}.`,
  })),
  { city: 'Cairns', href: undefined as string | undefined, note: 'Regional far-north Queensland freight.' },
];

export default function DeliveryPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Golf Buggy & Golf Cart Delivery Australia',
    serviceType: 'Vehicle delivery and enclosed freight',
    description: DESCRIPTION,
    // The one organisation entity, by @id; the node itself is emitted below.
    provider: { '@id': ORG_ID },
    areaServed: [
      { '@type': 'Country', name: 'Australia' },
      ...METRO_ROUTES.map((r) => ({ '@type': 'City', name: r.city })),
    ],
    url: `https://${SITE.domain}/delivery/`,
  };

  const providerSchema = { '@context': 'https://schema.org', ...organizationSchema() };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${SITE.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Delivery',
        item: `https://${SITE.domain}/delivery/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(providerSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }}
      />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header />

        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-[#E7E5E4] space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <FadeUpText delay={0.05} className="text-xs uppercase tracking-widest text-[#E2A17A] font-extrabold">
              Yatala QLD 4207 Depot · Australia-Wide Freight
            </FadeUpText>
            {/* Exactly One H1 */}
            <StaggeredHeading
              tag="h1"
              text="Golf Buggy Delivery Australia-Wide from Yatala QLD"
              className="text-3xl sm:text-5xl font-serif font-bold text-[#ffffff] leading-tight tracking-tight"
            />
            <StaggeredParagraph delay={0.15} className="text-sm sm:text-base text-[#A8A29E] max-w-2xl mx-auto leading-relaxed">
              Every buggy we sell ships from one place: our depot at Yatala QLD 4207, in the industrial corridor between Brisbane and the Gold Coast. From there we deliver anywhere in Australia.
            </StaggeredParagraph>
          </div>

          {/* Local corridor - answers "golf carts gold coast" and near-me intent */}
          <AnimatedCard delay={0.1} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm metal-brushed-dark">
            <div className="flex items-center gap-3 text-[#E2A17A]">
              <MapPin className="w-6 h-6 flex-shrink-0" />
              <h2 className="text-lg font-serif font-bold text-[#ffffff]">
                Gold Coast, Brisbane &amp; South East Queensland
              </h2>
            </div>
            <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Yatala sits directly on the M1 between Brisbane and the Gold Coast, which makes South East Queensland our home corridor rather than a freight destination. Gold Coast and Brisbane buyers deal with the same depot that stores, tests, and dispatches the vehicle &mdash; there is no third-party reseller in between, and no interstate transporter leg.
            </StaggeredParagraph>
            <StaggeredParagraph delay={0.2} className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Gold Coast and Brisbane buyers each have a page of their own: <Link href="/delivery/gold-coast/" className="text-[#E2A17A] underline hover:text-[#EFC7A6]">golf carts for the Gold Coast</Link> and <Link href="/delivery/brisbane/" className="text-[#E2A17A] underline hover:text-[#EFC7A6]">golf carts for sale in QLD and Brisbane</Link>. To talk to the people who hold the stock, call {CONTACT.phoneDisplay} or use the chat hub. We hold {ABN_INFO.companyName} ABN {ABN_INFO.abnFormatted}, registered at {ABN_INFO.locality}.
            </StaggeredParagraph>
          </AnimatedCard>

          {/* National footprint */}
          <div className="space-y-6">
            <StaggeredHeading
              tag="h2"
              text="Australia-Wide Enclosed Freight"
              className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight"
            />
            <StaggeredParagraph delay={0.1} className="text-sm sm:text-base leading-relaxed text-[#DFE5DF]">
              We deliver nationwide. Buggies travel in enclosed, weather-sealed transporters rather than exposed on open flatbeds, and freight is quoted per order &mdash; {SHOP.shippingNote.toLowerCase()}. Metropolitan and regional addresses are both serviced.
            </StaggeredParagraph>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {METRO_ROUTES.map((route) => (
                <StaggerItem
                  key={route.city}
                  className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-5 space-y-2 shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark"
                >
                  <div className="text-[#E2A17A] flex items-center gap-2 font-bold text-sm">
                    <Route className="w-4 h-4 flex-shrink-0" />
                    {route.href ? (
                      <Link href={route.href} className="hover:underline">
                        {route.city} delivery
                      </Link>
                    ) : (
                      <span>{route.city}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">{route.note}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Not on the list? We freight to every state and territory, including regional QLD, NSW, VIC, SA, WA, TAS, NT and the ACT. Send us the delivery postcode and we will quote the freight leg with the vehicle.
            </StaggeredParagraph>
          </div>

          {/* International */}
          <AnimatedCard delay={0.1} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm metal-brushed-dark">
            <div className="flex items-center gap-3 text-[#E2A17A]">
              <Globe2 className="w-6 h-6 flex-shrink-0" />
              <h2 className="text-lg font-serif font-bold text-[#ffffff]">
                Overseas Enquiries
              </h2>
            </div>
            <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Australia is our home market, but we can make arrangements for overseas clients. International orders are handled case by case &mdash; container or crated air freight, destination paperwork, and payment terms are all quoted per enquiry rather than off a standard rate card. Tell us the destination country and the models you are after and we will come back with what is workable.
            </StaggeredParagraph>
            <div className="pt-2">
              <Link
                href="/contact/"
                className="inline-flex items-center gap-1.5 text-[#E2A17A] hover:underline font-bold text-xs"
              >
                Start an international delivery enquiry
              </Link>
            </div>
          </AnimatedCard>

          {/* How it works */}
          <div className="space-y-6">
            <StaggeredHeading
              tag="h2"
              text="How Delivery Works"
              className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight"
            />
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StaggerItem className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark">
                <div className="text-[#E2A17A] flex items-center gap-2 font-bold text-sm">
                  <ClipboardCheck className="w-5 h-5 flex-shrink-0" />
                  <span>1. Freight quoted with the vehicle</span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  Give us the delivery postcode when you enquire. Freight is {SHOP.shippingNote.toLowerCase()}, so it is priced against your actual address rather than estimated later.
                </p>
              </StaggerItem>

              <StaggerItem className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#AEB4B8]/50 transition-all metal-brushed-dark">
                <div className="text-[#AEB4B8] flex items-center gap-2 font-bold text-sm">
                  <PackageCheck className="w-5 h-5 flex-shrink-0" />
                  <span>2. Tested before it leaves Yatala</span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  Every vehicle is inspected, charge-cycled, and road tested at the depot before dispatch, so nothing goes onto a transporter untested.
                </p>
              </StaggerItem>

              <StaggerItem className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark">
                <div className="text-[#E2A17A] flex items-center gap-2 font-bold text-sm">
                  <Truck className="w-5 h-5 flex-shrink-0" />
                  <span>3. Enclosed transport to your address</span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  Delivery is to your property, club, or site &mdash; crated or ready-to-drive depending on the model and the distance travelled.
                </p>
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* Where to next */}
          <AnimatedCard delay={0.1} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm metal-brushed-dark">
            <h2 className="text-lg font-serif font-bold text-[#ffffff]">
              Pick Your Buggy, Then We Will Quote the Freight
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              {BRAND.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold">
              <Link href="/shop/" className="text-[#E2A17A] hover:underline">
                Browse all {PRODUCTS.length} buggies and parts
              </Link>
              <Link href="/shop/luxury-4-seater/" className="text-[#E2A17A] hover:underline">
                Luxury 4-seater golf buggies
              </Link>
              <Link href="/shop/walk-behind-buggies/" className="text-[#E2A17A] hover:underline">
                Motorised and remote golf trolleys
              </Link>
              <Link href="/about/" className="text-[#E2A17A] hover:underline">
                About our Yatala depot
              </Link>
            </div>
          </AnimatedCard>
        </main>

        <Footer />
        <ChatHub />
      </div>
    </>
  );
}
