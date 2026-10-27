import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SmartImage from '@/src/components/SmartImage';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import FaqSection from '@/src/components/FaqSection';
import { ShippingPaymentBlock, ProductGuides } from '@/src/components/ProductExtras';
import { CATEGORIES } from '@/src/config/site';
import { POSTS } from '@/src/config/posts';
import { TAGS, findTag, tagProducts, tagGate } from '@/src/config/tags';
import { pageMetadata, buildTitle, buildDescription } from '@/lib/seo';
import { absoluteUrl, breadcrumbSchema, jsonLd } from '@/lib/schema';

export async function generateStaticParams() {
  return TAGS.map((t) => ({ tag: t.slug }));
}
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ tag: string }>;
}

const catSlug = (cat: string) => CATEGORIES.find((c) => c.rawCategory === cat)?.slug ?? 'all';
const money = (n: number) => `$${n.toLocaleString('en-AU')}`;

export async function generateMetadata({ params }: PageProps) {
  const { tag } = await params;
  const t = findTag(tag);
  if (!t) return { title: 'Not Found' };
  const items = tagProducts(t);
  const prices = items.map((p) => p.price_aud).sort((a, b) => a - b);
  const first = items[0];
  const photo = first?.images?.[0] ? { url: absoluteUrl(first.images[0]), alt: first.name } : undefined;
  return {
    ...pageMetadata({
      title: buildTitle(`${t.name} Australia`),
      description: buildDescription(`${t.name} in Australia: ${items.length} products from ${money(prices[0])} to ${money(prices[prices.length - 1])} AUD inc GST.`, '', ['Supplied from our Yatala QLD depot.', 'Freight quoted to your postcode.']),
      path: `/tag/${t.slug}/`,
      image: photo,
    }),
    keywords: [t.primaryKeyword, ...t.supporting],
    ...(tagGate(t).length ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const t = findTag(tag);
  if (!t) notFound();
  const items = tagProducts(t);
  const guides = t.guideSlugs
    .map((s) => POSTS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ slug: p.slug, label: p.title }));
  const cats = [...new Set(items.map((p) => p.category))];
  const related = TAGS.filter((o) => o.slug !== t.slug && o.productSlugs.some((s) => t.productSlugs.includes(s)));
  const url = `/tag/${t.slug}/`;

  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(url)}#webpage`,
    url: absoluteUrl(url),
    name: t.name,
    inLanguage: 'en-AU',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: absoluteUrl(`/shop/${catSlug(p.category)}/${p.slug}/`) })),
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop/' }, { name: 'Collections', path: '/tag/' }, { name: t.name, path: url }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collection) }} />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header />
        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-[#E7E5E4] space-y-10">
          <nav aria-label="Breadcrumb" className="text-xs text-[#A8A29E] flex items-center gap-2 flex-wrap">
            <Link href="/shop/" className="hover:text-[#E2A17A]">Shop</Link>
            <span>/</span>
            <Link href="/tag/" className="hover:text-[#E2A17A]">Collections</Link>
            <span>/</span>
            <span className="text-white font-medium">{t.name}</span>
          </nav>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#E2A17A] font-extrabold">{items.length} products · supplied from Yatala QLD</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight tracking-tight">{t.name} in Australia</h1>
            {t.intro.map((para, i) => (
              <p key={i} className="text-sm sm:text-base text-[#A8A29E] max-w-3xl leading-relaxed">{para}</p>
            ))}
          </div>

          <section className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">Shop {t.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((p) => (
                <Link key={p.slug} href={`/shop/${catSlug(p.category)}/${p.slug}/`} className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl overflow-hidden shadow-xs hover:border-[#E2A17A]/50 transition-all metal-brushed-dark block group">
                  <div className="relative aspect-[4/3] bg-white">
                    <SmartImage src={p.images?.[0] || ''} alt={`${p.name} — ${t.name.toLowerCase()} in Australia`} fill className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
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
            <FaqSection items={t.faqs} heading={`${t.name}: Common Questions`} tone="dark" />
          </div>

          <ShippingPaymentBlock />
          <ProductGuides guides={guides} />

          <nav aria-label="Related collections and categories" className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
            {cats.map((cat) => {
              const c = CATEGORIES.find((x) => x.rawCategory === cat);
              return c ? <Link key={cat} href={`/shop/${c.slug}/`} className="text-[#E2A17A] hover:underline">{c.name}</Link> : null;
            })}
            {related.map((o) => (
              <Link key={o.slug} href={`/tag/${o.slug}/`} className="text-[#E2A17A] hover:underline">{o.name}</Link>
            ))}
          </nav>

          <div className="flex flex-wrap gap-4 text-xs font-bold">
            <Link href="/tag/" className="text-[#E2A17A] hover:underline">All collections</Link>
            <Link href="/shop/" className="text-[#E2A17A] hover:underline">Browse the full range</Link>
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
