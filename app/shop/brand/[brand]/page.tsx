import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SmartImage from '@/src/components/SmartImage';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import FaqSection from '@/src/components/FaqSection';
import { SITE, BRAND_PAGES, PRODUCTS, CATEGORIES, isBuggyItem } from '@/src/config/site';
import { POSTS } from '@/src/config/posts';
import { resolveCategory } from '@/src/config/category-content';
import { ShippingPaymentBlock, ProductGuides } from '@/src/components/ProductExtras';
import ExternalReferences from '@/src/components/ExternalReferences';
import LinkedText from '@/src/components/LinkedText';
import { createLinker } from '@/lib/autolink';
import { BRAND_REFERENCES, REFERENCES } from '@/src/config/references';
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

/** The vehicles in a brand's range; its batteries, remotes and parts are listed but are not "models". */
const vehiclesFor = (match: string) => rangeFor(match).filter((p) => isBuggyItem(p.category, p.id, p.name));

/** Capitalises a keyword, restoring the brand's own spelling at the start ("mgi ..." -> "MGI ..."). */
function capKeyword(kw: string, brandName: string): string {
  const flat = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const words = kw.split(' ');
  for (let n = Math.min(3, words.length); n >= 1; n--) {
    if (flat(words.slice(0, n).join(' ')) === flat(brandName)) return [brandName, ...words.slice(n)].join(' ');
  }
  return kw.charAt(0).toUpperCase() + kw.slice(1);
}

export async function generateMetadata({ params }: PageProps) {
  const { brand } = await params;
  const b = BRAND_PAGES.find((x) => x.slug === brand);
  if (!b) return { title: 'Brand Not Found' };

  const items = vehiclesFor(b.match);
  const prices = items.map((p) => p.price_aud).sort((x, y) => x - y);
  const priceText = prices.length
    ? prices[0] === prices[prices.length - 1]
      ? `$${prices[0].toLocaleString()} AUD`
      : `$${prices[0].toLocaleString()}–$${prices[prices.length - 1].toLocaleString()} AUD`
    : '';

  const title = buildTitle(`${b.name} Golf Buggies for Sale Australia`);
  const lead = b.primaryKeyword ? `${capKeyword(b.primaryKeyword, b.name)}: ${b.name} golf buggies in Australia.` : `${b.name} golf buggies for sale in Australia.`;
  const description = buildDescription(
    `${lead} ${items.length} ${items.length === 1 ? 'model' : 'models'} in stock${priceText ? ', ' + priceText : ''}.`,
    '',
    ['Tested at our Yatala QLD depot.', 'Enclosed freight Australia-wide.', 'GST included.']
  );
  const canonical = `https://${SITE.domain}/shop/brand/${b.slug}/`;

  // Share image: the first model in the brand range, else the brand image.
  const first = PRODUCTS.find((p) => p.name.toLowerCase().includes(b.match.toLowerCase()));
  const photo = first?.images?.[0] ? { url: absoluteUrl(first.images[0]), alt: first.name } : undefined;

  return {
    title,
    description,
    ...(b.primaryKeyword ? { keywords: [b.primaryKeyword, ...b.supportingKeywords] } : {}),
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', siteName: SITE.name, images: socialImages(photo) },
    twitter: { card: 'summary_large_image', title, description, images: socialImages(photo) },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { brand } = await params;
  const b = BRAND_PAGES.find((x) => x.slug === brand);
  if (!b) notFound();

  const everything = rangeFor(b.match);
  const items = vehiclesFor(b.match);
  const prices = items.map((p) => p.price_aud).sort((x, y) => x - y);

  const catSlug = (cat: string) =>
    CATEGORIES.find((c) => c.rawCategory === cat)?.slug || 'luxury-4-seater';

  const money = (n: number) => `$${n.toLocaleString('en-AU')}`;
  const sorted = [...items].sort((x, y) => x.price_aud - y.price_aud);
  const cheapest = sorted[0];
  const dearest = sorted[sorted.length - 1];
  const byCat = new Map<string, string[]>();
  for (const p of items) byCat.set(p.category, [...(byCat.get(p.category) ?? []), p.name]);
  const electric = items.filter((p) => p.fuel_type.startsWith('Electric')).length;
  const petrol = items.filter((p) => p.fuel_type.startsWith('Mechanical')).length;
  const n = items.length;
  const faqs = [
    {
      q: `Which ${b.name} models do you stock?`,
      a: `We stock ${n} ${b.name} ${n === 1 ? 'model' : 'models'}: ${items.map((p) => `${p.name} (${p.price_display})`).join('; ')}.`,
    },
    {
      q: `How much does a ${b.name} buggy cost?`,
      a: prices.length
        ? `${b.name} prices run from ${money(prices[0])} for the ${cheapest.name} to ${money(prices[prices.length - 1])} for the ${dearest.name}, GST included.`
        : `Pricing depends on the model and specification, and every price we publish includes GST.`,
    },
    {
      q: `Which ${b.name} model suits which job?`,
      a: [...byCat.entries()].map(([cat, names]) => `In ${cat}: ${names.join(', ')}`).join('. ') + '.',
    },
    {
      q: `Are ${b.name} buggies electric or petrol?`,
      a: `Of our ${n} ${b.name} ${n === 1 ? 'model' : 'models'}, ${electric} ${electric === 1 ? 'is' : 'are'} electric and ${petrol} ${petrol === 1 ? 'is' : 'are'} petrol.`,
    },
    {
      q: `Can you get ${b.name} parts in Australia?`,
      a: `We hold ${b.name} parts in Australian stock. That is the practical difference between a repair measured in days and one measured in weeks waiting on an international order. Tell us the model and year of your buggy and we will confirm the right part from Yatala before you order.`,
    },
    {
      q: `Does ${b.name} come with an Australian warranty?`,
      a: `Yes. ${b.name} vehicles bought from us carry an Australian factory warranty supported from Yatala QLD, not an overseas returns address. Because we hold parts locally, a claim is handled here rather than becoming a freight exercise. Keep your tax invoice as proof of the purchase date.`,
    },
    {
      q: `Is ${b.name} the right brand for my property?`,
      a: `Brand matters less than matching the buggy to your ground. Tell us the terrain, how many people you carry and the daily distance, and we will recommend the right model even if it is not a ${b.name}.`,
    },
  ];

  // Guides: any that name the brand, else the guides for the brand's main category.
  const named = POSTS.filter((p) => (p.slug + ' ' + p.title).toLowerCase().includes(b.match.toLowerCase().replace('-', '')) || (p.slug + ' ' + p.title).toLowerCase().includes(b.match.toLowerCase()));
  const mainCat = [...byCat.entries()].sort((x, y) => y[1].length - x[1].length)[0]?.[0];
  const catGuides = resolveCategory(CATEGORIES.find((c) => c.rawCategory === mainCat)?.slug ?? '')?.guides ?? [];
  const guides = [
    ...named.map((p) => ({ slug: p.slug, label: p.title })),
    ...catGuides.filter((g) => !named.some((p) => p.slug === g.slug)),
  ].slice(0, 4);
  const leadLine = b.primaryKeyword
    ? `${capKeyword(b.primaryKeyword, b.name)}: ${n} ${b.name} ${n === 1 ? 'model' : 'models'} in stock at Yatala QLD${prices.length ? `, from ${money(prices[0])} to ${money(prices[prices.length - 1])} AUD inc GST` : ''}.`
    : '';

  const bodySegs = createLinker(`/shop/brand/${b.slug}/`, 3, 3).link(b.body);

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
            {leadLine && <p className="text-sm text-[#D6D3D1] max-w-3xl leading-relaxed">{leadLine}</p>}
          </div>

          <div className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 shadow-xs metal-brushed-dark">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-3">Why Buyers Choose {b.name}</h2>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed"><LinkedText segs={bodySegs} /></p>
          </div>

          <section className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              The {b.name} Range
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {everything.map((p) => (
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

          <ShippingPaymentBlock />

          <ProductGuides guides={guides} />

          {BRAND_REFERENCES[b.slug] && (
            <ExternalReferences refs={[REFERENCES[BRAND_REFERENCES[b.slug]]]} heading={`${b.name} Official Website`} />
          )}

          <nav aria-label={`${b.name} by category`} className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
            {[...byCat.keys()].map((cat) => (
              <Link key={cat} href={`/shop/${catSlug(cat)}/`} className="text-[#E2A17A] hover:underline">
                {b.name} in {CATEGORIES.find((c) => c.rawCategory === cat)?.name ?? cat}
              </Link>
            ))}
          </nav>

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
