import React from 'react';
import Link from 'next/link';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { SITE, BRAND_PAGES, PRODUCTS } from '@/src/config/site';
import { buildTitle, buildDescription } from '@/lib/seo';

const TITLE = buildTitle('Shop Golf Buggies by Brand Australia');
const DESCRIPTION = buildDescription(
  'Every golf buggy brand we stock in Australia, from Club Car and Yamaha to MGI walk-behind trolleys.',
  '',
  ['All models tested and dispatched from our Yatala QLD depot.', 'Enclosed freight Australia-wide.']
);

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://${SITE.domain}/shop/brand/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://${SITE.domain}/shop/brand/`, type: 'website', siteName: SITE.name },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function BrandIndexPage() {
  const brands = BRAND_PAGES.map((b) => {
    const items = PRODUCTS.filter((p) => p.name.toLowerCase().includes(b.match.toLowerCase()));
    const prices = items.map((p) => p.price_aud).sort((x, y) => x - y);
    return { ...b, count: items.length, low: prices[0], high: prices[prices.length - 1] };
  }).filter((b) => b.count > 0);

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `https://${SITE.domain}/shop/` },
      { '@type': 'ListItem', position: 3, name: 'Brands', item: `https://${SITE.domain}/shop/brand/` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Golf buggy brands stocked in Australia',
    numberOfItems: brands.length,
    itemListElement: brands.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      url: `https://${SITE.domain}/shop/brand/${b.slug}/`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header />

        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-[#E7E5E4] space-y-10">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#E2A17A] font-extrabold">
              {brands.length} Brands · {PRODUCTS.length} Models · Yatala QLD
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight tracking-tight">
              Shop Golf Buggies by Brand in Australia
            </h1>
            <p className="text-sm sm:text-base text-[#A8A29E] max-w-3xl leading-relaxed">
              Buyers usually arrive knowing the badge before the model. Every brand below is one we
              actually hold at our Yatala QLD depot, with parts stocked in Australia and warranty
              handled locally rather than through an overseas returns address.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/shop/brand/${b.slug}/`}
                className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark block"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-serif font-bold text-white">{b.name}</h2>
                  <span className="text-[10px] uppercase tracking-wider text-[#A8A29E] shrink-0">{b.origin}</span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed line-clamp-3">{b.intro}</p>
                <div className="pt-2 border-t border-[#2B2F34] flex items-baseline justify-between text-[11px]">
                  <span className="text-[#E2A17A] font-bold">
                    {b.count} {b.count === 1 ? 'model' : 'models'}
                  </span>
                  <span className="text-[#A8A29E]">
                    {b.low === b.high ? `$${b.low.toLocaleString()}` : `$${b.low.toLocaleString()} – $${b.high.toLocaleString()}`} AUD
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs metal-brushed-dark">
            <h2 className="text-lg font-serif font-bold text-white">Not Sure Which Brand Fits?</h2>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Brand matters less than matching the buggy to your ground. A steep acreage block, a flat
              gated estate and a resort shuttle run all point at different models regardless of badge.
              Browse by <Link href="/shop/" className="text-[#E2A17A] hover:underline font-semibold">what you need the buggy to do</Link>{' '}
              instead, or call the Yatala desk on 0480 804 189 and we will narrow it down with you.
            </p>
          </div>
        </main>

        <Footer />
        <ChatHub />
      </div>
    </>
  );
}
