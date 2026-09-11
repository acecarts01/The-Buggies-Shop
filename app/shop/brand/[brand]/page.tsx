import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SmartImage from '@/src/components/SmartImage';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import FaqSection from '@/src/components/FaqSection';
import { SITE, BRAND_PAGES, PRODUCTS, CATEGORIES } from '@/src/config/site';
import { buildTitle, buildDescription, socialImages } from '@/lib/seo';
import { absoluteUrl } from '@/lib/schema';

export async function generateStaticParams() {
  return BRAND_PAGES.map((b) => ({ brand: b.slug }));
}

interface PageProps {
  params: Promise<{ brand: string }>;
}

const rangeFor = (match: string) =>
  PRODUCTS.filter((p) => p.name.toLowerCase().includes(match.toLowerCase()));

export async function generateMetadata({ params }: PageProps) {
  const { brand } = await params;
  const b = BRAND_PAGES.find((x) => x.slug === brand);
  if (!b) return { title: 'Brand Not Found' };

  const items = rangeFor(b.match);
  const prices = items.map((p) => p.price_aud).sort((x, y) => x - y);
  const priceText = prices.length
    ? prices[0] === prices[prices.length - 1]
      ? `$${prices[0].toLocaleString()} AUD`
      : `$${prices[0].toLocaleString()}–$${prices[prices.length - 1].toLocaleString()} AUD`
    : '';

  const title = buildTitle(`${b.name} Golf Buggies Australia`);
  const description = buildDescription(
    `${b.name} golf buggies for sale in Australia. ${items.length} ${items.length === 1 ? 'model' : 'models'} in stock${priceText ? ', ' + priceText : ''}.`,
    '',
    ['Tested at our Yatala QLD depot.', 'Enclosed freight Australia-wide.', 'Australian parts and warranty.']
  );
  const canonical = `https://${SITE.domain}/shop/brand/${b.slug}/`;

  // Share image: the first model in the brand range, else the brand image.
  const first = PRODUCTS.find((p) => p.name.toLowerCase().includes(b.match.toLowerCase()));
  const photo = first?.images?.[0] ? { url: absoluteUrl(first.images[0]), alt: first.name } : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', siteName: SITE.name, images: socialImages(photo) },
    twitter: { card: 'summary_large_image', title, description, images: socialImages(photo) },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { brand } = await params;
  const b = BRAND_PAGES.find((x) => x.slug === brand);
  if (!b) notFound();

  const items = rangeFor(b.match);
  const prices = items.map((p) => p.price_aud).sort((x, y) => x - y);

  const catSlug = (cat: string) =>
    CATEGORIES.find((c) => c.rawCategory === cat)?.slug || 'luxury-4-seater';

  const faqs = [
    {
      q: `Do you stock ${b.name} golf buggies in Australia?`,
      a: `Yes. We hold ${items.length} ${b.name} ${items.length === 1 ? 'model' : 'models'} at our Yatala QLD 4207 depot rather than drop-shipping from overseas, which is why we can inspect and road test a unit before it ships. Availability moves, so confirm the specific model is on the floor before planning around a delivery date.`,
    },
    {
      q: `Can you get ${b.name} parts in Australia?`,
      a: `We hold ${b.name} parts in Australian stock. That is the practical difference between a repair measured in days and one measured in weeks waiting on an international order. Tell us the model and year of your buggy and we will confirm the right part from Yatala before you order.`,
    },
    {
      q: `How much does a ${b.name} buggy cost?`,
      a: prices.length
        ? `Our ${b.name} range runs from $${prices[0].toLocaleString()} to $${prices[prices.length - 1].toLocaleString()} AUD including GST. Freight is quoted separately against your delivery postcode. Finance in 4 splits any of them into four interest-free payments, and settling in Bitcoin or Tether takes 10% off the vehicle price.`
        : `Pricing depends on the model and specification. Every price we publish includes GST, and freight is quoted separately against your delivery postcode rather than averaged into the advertised figure.`,
    },
    {
      q: `Does ${b.name} come with an Australian warranty?`,
      a: `Yes. ${b.name} vehicles bought from us carry an Australian factory warranty supported from Yatala QLD, not an overseas returns address. Because we hold parts locally, a claim is handled here rather than becoming a freight exercise. Keep your tax invoice as proof of the purchase date.`,
    },
    {
      q: `Can you deliver a ${b.name} buggy to my state?`,
      a: `Yes. We deliver nationwide to every state and territory, metropolitan and regional, in enclosed weather-sealed transporters rather than on open flatbeds. Send your delivery postcode with the enquiry and the freight cost comes back alongside the vehicle quote rather than appearing later.`,
    },
    {
      q: `Is ${b.name} the right brand for my property?`,
      a: `Brand matters less than matching the buggy to your ground. A steep acreage block, a flat gated estate and a resort shuttle run point at different models regardless of badge. Tell us the terrain, how many people you carry and the daily distance, and we will recommend the right model even if it is not a ${b.name}.`,
    },
  ];

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `https://${SITE.domain}/shop/` },
      { '@type': 'ListItem', position: 3, name: 'Brands', item: `https://${SITE.domain}/shop/brand/` },
      { '@type': 'ListItem', position: 4, name: b.name, item: `https://${SITE.domain}/shop/brand/${b.slug}/` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${b.name} golf buggies available in Australia`,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://${SITE.domain}/shop/${catSlug(p.category)}/${p.slug}/`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header />

        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-[#E7E5E4] space-y-10">
          <nav aria-label="Breadcrumb" className="text-xs text-[#A8A29E] flex items-center gap-2 flex-wrap">
            <Link href="/shop/" className="hover:text-[#E2A17A]">Shop</Link>
            <span>/</span>
            <Link href="/shop/brand/" className="hover:text-[#E2A17A]">Brands</Link>
            <span>/</span>
            <span className="text-white font-medium">{b.name}</span>
          </nav>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#E2A17A] font-extrabold">
              {b.origin} · {items.length} {items.length === 1 ? 'model' : 'models'} in stock at Yatala QLD
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight tracking-tight">
              {b.name} Golf Buggies for Sale in Australia
            </h1>
            <p className="text-sm sm:text-base text-[#A8A29E] max-w-3xl leading-relaxed">{b.intro}</p>
          </div>

          <div className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 shadow-xs metal-brushed-dark">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-3">Why Buyers Choose {b.name}</h2>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">{b.body}</p>
          </div>

          <section className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              The {b.name} Range
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((p) => (
                <Link
                  key={p.slug}
                  href={`/shop/${catSlug(p.category)}/${p.slug}/`}
                  className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl overflow-hidden shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark block group"
                >
                  <div className="relative aspect-[4/3] bg-white">
                    <SmartImage
                      src={p.images?.[0] || ''}
                      alt={`${p.name} — ${b.name} golf buggy available in Australia`}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-serif font-bold text-white line-clamp-2">{p.name}</h3>
                    <p className="text-[11px] text-[#A8A29E] line-clamp-2 leading-relaxed">{p.key_specs}</p>
                    <div className="pt-2 border-t border-[#2B2F34] flex items-baseline justify-between">
                      <span className="text-base font-serif font-extrabold text-white">{p.price_display}</span>
                      <span className="text-[10px] text-[#A8A29E]">GST incl.</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 shadow-xs metal-brushed-dark">
            <FaqSection items={faqs} heading={`${b.name} in Australia — Common Questions`} tone="dark" />
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-bold">
            <Link href="/shop/brand/" className="text-[#E2A17A] hover:underline">All golf buggy brands</Link>
            <Link href="/shop/" className="text-[#E2A17A] hover:underline">Browse all {PRODUCTS.length} models</Link>
            <Link href="/delivery/" className="text-[#E2A17A] hover:underline">Delivery Australia-wide</Link>
            <Link href="/contact/" className="text-[#E2A17A] hover:underline">Ask the Yatala desk</Link>
          </div>
        </main>

        <Footer />
        <ChatHub />
      </div>
    </>
  );
}
