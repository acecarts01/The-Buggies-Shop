import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Truck, Route, MessageSquare, ArrowRight } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import FaqSection from '@/src/components/FaqSection';
import { CONTACT, ABN_INFO, SHOP, CATEGORIES, PRODUCTS } from '@/src/config/site';
import { DELIVERY_METROS, getDeliveryMetro } from '@/src/config/delivery';
import { pageMetadata } from '@/lib/seo';
import { jsonLd, organizationSchema, breadcrumbSchema, ORG_ID, ORIGIN } from '@/lib/schema';

// /delivery/<city>/ - one page per metro in DELIVERY_METROS. Delivery pages,
// not local-presence pages: the copy says how a buggy gets from Yatala to
// that city and what buyers there typically order. See src/config/delivery.ts.

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return DELIVERY_METROS.map((m) => ({ city: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const metro = getDeliveryMetro(city);
  if (!metro) return { title: 'Delivery area not found' };
  return {
    ...pageMetadata({ title: metro.metaTitle, description: metro.metaDescription, path: `/delivery/${metro.slug}/` }),
    keywords: [metro.primaryKeyword, ...metro.supportingKeywords],
  };
}

export default async function DeliveryCityPage({ params }: PageProps) {
  const { city } = await params;
  const metro = getDeliveryMetro(city);
  if (!metro) notFound();

  const url = `${ORIGIN}/delivery/${metro.slug}/`;
  const cats = metro.categories
    .map((slug) => CATEGORIES.find((c) => c.slug === slug))
    .filter((c): c is (typeof CATEGORIES)[number] => Boolean(c))
    .map((c) => ({ ...c, count: PRODUCTS.filter((p) => p.category === c.rawCategory).length }));

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: `Golf buggy delivery to ${metro.city}`,
    serviceType: metro.freightMode === 'same-corridor' ? 'Vehicle delivery by enclosed transporter or tilt-tray' : 'Enclosed interstate vehicle freight',
    description: metro.metaDescription,
    url,
    provider: { '@id': ORG_ID },
    areaServed: [
      { '@type': 'City', name: metro.city, containedInPlace: { '@type': 'State', name: metro.state } },
      { '@type': 'State', name: metro.state },
    ],
    // Freight is quoted per postcode, so no price is declared.
    offers: { '@type': 'Offer', priceCurrency: 'AUD', availability: 'https://schema.org/InStock', url: `${ORIGIN}/shop/` },
  };
  const providerSchema = { '@context': 'https://schema.org', ...organizationSchema() };
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Delivery', path: '/delivery/' },
    { name: metro.city, path: `/delivery/${metro.slug}/` },
  ]);

  const others = DELIVERY_METROS.filter((m) => m.slug !== metro.slug);
  const whatsapp = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(
    `Hello The Buggies Express, I'm in ${metro.city} (${metro.stateCode}). Could you quote delivery to my postcode for a buggy?`
  )}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(providerSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header />

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="bg-[#0A0B0D] border-b border-[#1F2226] px-4 py-2 text-xs">
          <ol className="max-w-5xl mx-auto flex items-center gap-2 text-[#A8A29E] overflow-x-auto whitespace-nowrap">
            <li><Link href="/" className="hover:text-[#E2A17A]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/delivery/" className="hover:text-[#E2A17A]">Delivery</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#E2A17A] font-medium" aria-current="page">{metro.city}</li>
          </ol>
        </nav>

        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-[#E7E5E4] space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#E2A17A] font-extrabold">
              {metro.freightMode === 'same-corridor' ? 'Same-corridor delivery' : 'Enclosed interstate freight'} · about {metro.roadKm.toLocaleString('en-AU')} km from Yatala QLD 4207
            </p>
            {/* Exactly one H1 */}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#ffffff] leading-tight tracking-tight">{metro.h1}</h1>
            <p className="text-sm sm:text-base text-[#A8A29E] max-w-2xl mx-auto leading-relaxed">{metro.intro}</p>
          </div>

          {/* Facts strip */}
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Delivery facts">
            {[
              { icon: MapPin, label: 'Dispatched from', value: `Yatala QLD 4207, our only depot` },
              { icon: Truck, label: 'How it travels', value: metro.freightMode === 'same-corridor' ? 'Enclosed transporter or tilt-tray down the M1' : 'Enclosed, weather-sealed transporter' },
              { icon: Route, label: 'Freight', value: `Quoted against your ${metro.stateCode} postcode at checkout; no minimum order, no free-freight threshold` },
            ].map((f) => (
              <li key={f.label} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-5 space-y-1.5 metal-brushed-dark">
                <div className="flex items-center gap-2 text-[#E2A17A] text-xs font-bold uppercase tracking-wider">
                  <f.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {f.label}
                </div>
                <p className="text-sm text-[#E7E5E4] leading-snug">{f.value}</p>
              </li>
            ))}
          </ul>

          {/* Sections */}
          <div className="space-y-6">
            {metro.sections.map((s) => (
              <section key={s.heading} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm metal-brushed-dark">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#ffffff]">{s.heading}</h2>
                <p className="text-sm text-[#A8A29E] leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>

          {/* Ranges for this metro */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight">
              Ranges {metro.city} buyers look at first
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}/`}
                  className="group bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-5 hover:border-[#E2A17A]/60 transition-colors metal-brushed-dark"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-[#ffffff]">{c.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#E2A17A] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-[#A8A29E] mt-1">{c.count} models · GST included · delivered to {metro.city}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Quote CTA */}
          <section className="bg-gradient-to-r from-[#1A1D21] to-[#0A0B0D] border border-[#E2A17A]/40 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-3 space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff]">Get the delivered price for {metro.city}</h2>
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                Send your postcode and the model you have in mind. We quote the freight leg with the vehicle so you see one delivered figure.{' '}
                {SHOP.shippingNote}. Once you have paid, confirm your order on WhatsApp with the payment receipt.
              </p>
              <p className="text-xs text-[#6B645E]">
                {ABN_INFO.companyName} · ABN {ABN_INFO.abn} · {ABN_INFO.locality}
              </p>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-2">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#188741] hover:bg-[#147136] text-white font-bold text-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                Quote my postcode on WhatsApp
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-[#2B2F34] text-[#ffffff] font-semibold text-sm hover:border-[#E2A17A] transition-colors"
              >
                Call {CONTACT.phoneDisplay}
              </a>
            </div>
          </section>

          {/* FAQs (FaqSection emits the FAQPage JSON-LD) */}
          <FaqSection items={metro.faqs} heading={`${metro.city} delivery: your questions`} tone="dark" />

          {/* Other metros */}
          <nav aria-label="Other delivery areas" className="border-t border-[#2B2F34] pt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#A8A29E] mb-3">We also deliver to</h2>
            <ul className="flex flex-wrap gap-2">
              {others.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/delivery/${m.slug}/`}
                    className="inline-block px-3 py-1.5 rounded-lg border border-[#2B2F34] text-xs font-semibold text-[#E7E5E4] hover:border-[#E2A17A] transition-colors"
                  >
                    {m.city}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/delivery/"
                  className="inline-block px-3 py-1.5 rounded-lg border border-[#2B2F34] text-xs font-semibold text-[#E2A17A] hover:border-[#E2A17A] transition-colors"
                >
                  All of Australia
                </Link>
              </li>
            </ul>
          </nav>
        </main>

        <Footer />
        <ChatHub />
      </div>
    </>
  );
}
