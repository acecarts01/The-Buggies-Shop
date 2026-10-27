import React from 'react';
import Link from 'next/link';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { TAGS, tagProducts } from '@/src/config/tags';
import { pageMetadata, buildTitle, buildDescription } from '@/lib/seo';
import { absoluteUrl, breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata = pageMetadata({
  title: buildTitle('Golf Buggy Collections Australia'),
  description: buildDescription('Golf buggy collections by need: lithium batteries, chargers, lifted buggies, remote trolleys, tow hitches, lighting, weather gear and controllers.', '', ['Supplied from our Yatala QLD depot.', 'Freight quoted to your postcode.']),
  path: '/tag/',
});

export default function TagIndexPage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: absoluteUrl('/tag/'),
    name: 'Golf buggy collections',
    inLanguage: 'en-AU',
    mainEntity: { '@type': 'ItemList', itemListElement: TAGS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: absoluteUrl(`/tag/${t.slug}/`) })) },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop/' }, { name: 'Collections', path: '/tag/' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList) }} />
      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header />
        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-[#E7E5E4] space-y-8">
          <nav aria-label="Breadcrumb" className="text-xs text-[#A8A29E] flex items-center gap-2">
            <Link href="/shop/" className="hover:text-[#E2A17A]">Shop</Link>
            <span>/</span>
            <span className="text-white font-medium">Collections</span>
          </nav>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight tracking-tight">Golf Buggy Collections by Need</h1>
            <p className="text-sm sm:text-base text-[#A8A29E] max-w-3xl leading-relaxed">Categories sort the range by type of buggy, and brands by maker. These collections cut across both, grouping what you need for a job: a battery upgrade, a lifted chassis, a tow hitch or weather protection. Each lists real products from our Yatala QLD depot, priced in AUD with GST included.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TAGS.map((t) => (
              <Link key={t.slug} href={`/tag/${t.slug}/`} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-5 hover:border-[#E2A17A]/50 transition-all metal-brushed-dark block space-y-2">
                <h2 className="text-lg font-serif font-bold text-white">{t.name}</h2>
                <p className="text-xs text-[#A8A29E] leading-relaxed line-clamp-3">{t.intro[0]}</p>
                <span className="text-xs font-bold text-[#E2A17A]">{tagProducts(t).length} products →</span>
              </Link>
            ))}
          </div>
        </main>
        <Footer />
        <ChatHub />
      </div>
    </>
  );
}
