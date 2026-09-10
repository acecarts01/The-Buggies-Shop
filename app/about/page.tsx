import React from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { SITE, BRAND, ABN_INFO, CONTACT } from '@/src/config/site';
import { ShieldCheck, MapPin, Award, Truck, Wrench, BatteryCharging, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  StaggeredHeading,
  StaggeredParagraph,
  FadeUpText,
  AnimatedCard,
  StaggerContainer,
  StaggerItem
} from '@/src/components/AnimatedText';

export const metadata = {
  title: 'About The Buggies Express | Yatala QLD Depot',
  description:
    'Golf Buggies Express PTY LTD, ABN 28 668 598 758, based in Yatala QLD. Sales, custom lithium builds, spare parts and nationwide enclosed freight.',
  alternates: {
    canonical: `https://${SITE.domain}/about/`,
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'About The Buggies Express | Yatala QLD Depot',
    description:
      'Australian owned golf buggy specialist in Yatala QLD. 61 buggy models, 5-year commercial lithium warranties, and nationwide delivery.',
    url: `https://${SITE.domain}/about/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function AboutPage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Store', 'Organization', 'AboutPage'],
    name: 'Golf Buggies Express PTY LTD',
    alternateName: 'The Buggies Express',
    description: BRAND.description,
    foundingDate: BRAND.foundingYear,
    foundingLocation: {
      '@type': 'Place',
      name: BRAND.foundingLocation,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Yatala Light Industrial Precinct',
      addressLocality: 'Yatala',
      addressRegion: 'QLD',
      postalCode: '4207',
      addressCountry: 'AU',
    },
    url: `https://${SITE.domain}/`,
    taxID: ABN_INFO.abn,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    areaServed: ['AU'],
    numberOfItems: 61,
    knowsAbout: [
      'Golf Buggies Australia',
      'Lithium Golf Cart Conversions',
      'Acreage Utility Vehicles',
      'Commercial Passenger Shuttles',
      'Off-Road 4x4 Buggies',
    ],
    priceRange: '$1,300 - $24,500 AUD',
  };

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
        name: 'About',
        item: `https://${SITE.domain}/about/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header />

        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-[#E7E5E4] space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <FadeUpText delay={0.05} className="text-xs uppercase tracking-widest text-[#E2A17A] font-extrabold">
              Australian Business Register Verified · ABN 28 668 598 758
            </FadeUpText>
            {/* Exactly One H1 */}
            <StaggeredHeading
              tag="h1"
              text="About The Buggies Express & Our Yatala QLD Operations"
              className="text-3xl sm:text-5xl font-serif font-bold text-[#ffffff] leading-tight tracking-tight"
            />
            <StaggeredParagraph delay={0.15} className="text-sm sm:text-base text-[#A8A29E] max-w-2xl mx-auto leading-relaxed">
              Australia&rsquo;s dedicated electric golf buggy supplier, service center, and lithium retrofit specialist headquartered in Yatala, Queensland.
            </StaggeredParagraph>
          </div>

          {/* Corporate Credibility Box */}
          <AnimatedCard delay={0.1} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm metal-brushed-dark">
            <div className="flex items-center gap-3 text-[#E2A17A]">
              <ShieldCheck className="w-6 h-6 flex-shrink-0" />
              <h2 className="text-lg font-serif font-bold text-[#ffffff]">
                Corporate Entity &amp; ASIC Accreditation
              </h2>
            </div>
            <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Golf Buggies Express PTY LTD is an Australian Proprietary Company, Limited By Shares, officially registered with the Australian Securities and Investments Commission (ASIC) on 7 June 2023 under ACN 668 598 758 and Australian Business Number (ABN) 28 668 598 758. Our registered corporate locality and technical depot is located at Yatala QLD 4207, situated in South East Queensland&rsquo;s premier industrial corridor between Brisbane and the Gold Coast.
            </StaggeredParagraph>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <a
                href={ABN_INFO.abrLookupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#E2A17A] hover:underline font-bold"
              >
                <span>Verify ABN 28 668 598 758 on ABR Government Registry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[#A8A29E]">Next Review Date: 7/06/2027</span>
            </div>
          </AnimatedCard>

          {/* The Story & Narrative (>700 words content) */}
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-[#DFE5DF]">
            <StaggeredHeading
              tag="h2"
              text="Built for the Rigours of the Australian Landscape"
              className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight"
            />
            <StaggeredParagraph delay={0.1}>
              When Golf Buggies Express PTY LTD was established, Australian golf course managers, acreage homesteaders, and commercial resort operators faced a persistent problem: imported low-grade lead-acid golf carts that deteriorated in coastal humidity, stalled on 20-degree rural gradients, and lacked local spare parts support when a controller or solenoid inevitably burnt out.
            </StaggeredParagraph>
            <StaggeredParagraph delay={0.15}>
              We established our Yatala operations depot with a singular charter: engineer, assemble, and deliver high-torque, lithium-powered golf buggies specifically calibrated for Australian soil, coastal salt spray, and extreme summer thermal cycles. Every chassis we supply features reinforced tubular steel framing, automotive e-coat corrosion dip treatment, and sealed electronic controllers rated to IP65 or higher.
            </StaggeredParagraph>
            <StaggeredParagraph delay={0.2}>
              Unlike traditional distributors who operate purely as drop-shippers with zero physical stock in the country, Golf Buggies Express maintains over $1.2M in vehicle stock across 61 models and a dedicated inventory of over 7,200 genuine replacement parts right here in Yatala QLD. Whether you need an Atlas 72V 105Ah replacement battery pack, a Club Car heavy-duty leaf spring assembly, or an EZGO Curtis controller, our dispatch bays ship the same day across the country.
            </StaggeredParagraph>
          </div>

          {/* 4 Pillars of Differentiation */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaggerItem className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark">
              <div className="text-[#E2A17A] flex items-center gap-2 font-bold text-sm">
                <BatteryCharging className="w-5 h-5" />
                <span>Commercial-Grade 72V &amp; 48V Lithium Systems</span>
              </div>
              <StaggeredParagraph delay={0.1} className="text-xs text-[#A8A29E] leading-relaxed">
                Zero maintenance, zero battery acid corrosion, and zero memory decay. Our lithium packs are manufactured with Grade-A prismatic LiFePO4 cells paired with intelligent BMS modules engineered to operate flawlessly in ambient temperatures exceeding 42°C. Backed by our Yatala 5-year replacement warranty.
              </StaggeredParagraph>
            </StaggerItem>

            <StaggerItem className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark">
              <div className="text-[#E2A17A] flex items-center gap-2 font-bold text-sm">
                <Truck className="w-5 h-5" />
                <span>Australia-Wide Enclosed Freight Network</span>
              </div>
              <StaggeredParagraph delay={0.1} className="text-xs text-[#A8A29E] leading-relaxed">
                We do not ship buggies exposed on open flatbeds. All customer deliveries across Queensland, New South Wales, Victoria, and South Australia travel in enclosed, weather-sealed transporters. Your buggy arrives fully charged, clean, and ready for immediate deployment on the green or around your homestead.
              </StaggeredParagraph>
            </StaggerItem>

            <StaggerItem className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#AEB4B8]/50 transition-all metal-brushed-dark">
              <div className="text-[#AEB4B8] flex items-center gap-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Pre-Delivery Testing &amp; Enclosed Freight</span>
              </div>
              <StaggeredParagraph delay={0.1} className="text-xs text-[#A8A29E] leading-relaxed">
                Buying a premium 4-passenger or lifted 4x4 buggy over $15,000 AUD is a significant investment. Every vehicle undergoes a rigorous multi-point mechanical inspection, full lithium diagnostic cycle, and road test before direct enclosed trailer dispatch to your property or club.
              </StaggeredParagraph>
            </StaggerItem>

            <StaggerItem className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark">
              <div className="text-[#E2A17A] flex items-center gap-2 font-bold text-sm">
                <Award className="w-5 h-5" />
                <span>Full Australian Consumer Law Guarantee</span>
              </div>
              <StaggeredParagraph delay={0.1} className="text-xs text-[#A8A29E] leading-relaxed">
                As an accredited Queensland proprietary company, all transactions carry statutory guarantees under Australian Consumer Law. We provide comprehensive repair, replacement, or refund remedies managed directly by our Yatala engineering technicians, not outsourced international call centers.
              </StaggeredParagraph>
            </StaggerItem>
          </StaggerContainer>

          {/* Historical Milestones */}
          <AnimatedCard delay={0.15} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm metal-brushed-dark">
            <StaggeredHeading
              tag="h2"
              text="Company Milestones & Evolution"
              className="text-xl font-serif font-bold text-[#ffffff]"
            />
            <div className="space-y-4">
              {BRAND.milestones.map((m, idx) => (
                <div key={idx} className="flex gap-4 items-start text-xs sm:text-sm">
                  <span className="font-bold text-[#E2A17A] bg-[#121417] border border-[#2B2F34] px-3 py-1 rounded-md shadow-sm">
                    {m.year}
                  </span>
                  <div className="text-[#E7E5E4] pt-1">
                    {m.event}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Call to action */}
          <FadeUpText delay={0.2} className="p-8 rounded-2xl bg-gradient-to-r from-[#16211C] via-[#16181B] to-[#1A1D21] border-2 border-[#E2A17A] text-center space-y-4 shadow-sm">
            <StaggeredHeading
              tag="h3"
              text="Order Direct with Nationwide Enclosed Freight"
              className="text-xl font-serif font-bold text-[#ffffff]"
            />
            <StaggeredParagraph delay={0.1} className="text-xs sm:text-sm text-[#A8A29E] max-w-lg mx-auto">
              Our engineering workshop and vehicle showroom prepares direct deliveries and welcomes collection in Yatala QLD. Speak directly with an Australian buggy technician.
            </StaggeredParagraph>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/shop/"
                className="px-6 py-3 bg-gradient-to-r from-[#C86D51] to-[#E2A17A] hover:from-[#E2A17A] hover:to-[#EFC7A6] text-[#121417] font-extrabold text-xs rounded-lg transition-all shadow-xs"
              >
                Browse All 61 Buggies &amp; Order Now
              </Link>
              <Link
                href="/contact/"
                className="px-6 py-3 bg-[#1A1D21] text-[#ffffff] font-bold text-xs rounded-lg hover:bg-[#AEB4B8]/20 transition-all border border-[#2B2F34] metal-brushed-dark"
              >
                Contact Yatala Depot
              </Link>
            </div>
          </FadeUpText>
        </main>

        <Footer />
        <ChatHub />
      </div>
    </>
  );
}
