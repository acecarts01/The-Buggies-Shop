import { NextResponse } from 'next/server';
import { PRODUCTS, CATEGORIES, BRAND_PAGES, FAQ } from '@/src/config/site';
import { POSTS } from '@/src/config/posts';
import { DELIVERY_METROS } from '@/src/config/delivery';
import { getProductDetails } from '@/src/config/product-details';
import { resolveCategory } from '@/src/config/category-content';
import type { SearchEntry } from '@/lib/site-search';

// Compact, build-time search index for the header search and /search page.
// Everything derives from the same config the pages are built from, so a new
// product, guide, brand or city is searchable the moment it exists. Served as
// a static, cacheable JSON file: the browser downloads it once, on first open.
export const dynamic = 'force-static';

const clip = (s: string, n = 140) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

function build(): SearchEntry[] {
  const out: SearchEntry[] = [];

  // Ranges, brands and delivery areas
  out.push({ t: 'range', ti: 'All golf buggies for sale', u: '/shop/', d: 'The full range: passenger, utility, petrol, walk-behind, batteries and accessories.', k: 'shop catalogue buy golf buggy for sale' });
  for (const c of CATEGORIES) {
    if (c.slug === 'all') continue;
    const r = resolveCategory(c.slug);
    out.push({ t: 'range', ti: c.name, u: `/shop/${c.slug}/`, d: clip(r?.metaDescription ?? ''), k: [r?.primaryKeyword, ...(r?.supportingKeywords ?? [])].filter(Boolean).join(' ') });
  }
  for (const b of BRAND_PAGES) {
    out.push({ t: 'range', ti: `${b.name} golf buggies`, u: `/shop/brand/${b.slug}/`, d: clip(b.intro), k: [b.name, b.match, b.primaryKeyword, ...b.supportingKeywords].filter(Boolean).join(' ') });
  }
  for (const m of DELIVERY_METROS) {
    out.push({ t: 'range', ti: `Golf buggy delivery to ${m.city}`, u: `/delivery/${m.slug}/`, d: clip(m.metaDescription), k: [m.city, m.state, m.stateCode, m.primaryKeyword, ...m.supportingKeywords].join(' ') });
  }

  // Products
  for (const p of PRODUCTS) {
    const d = getProductDetails(p.slug);
    const cat = CATEGORIES.find((c) => c.rawCategory === p.category)?.slug ?? 'fleet';
    out.push({
      t: 'product',
      ti: p.name,
      u: `/shop/${cat}/${p.slug}/`,
      d: `${p.price_display} · ${clip(p.key_specs, 110)}`,
      k: [p.category, p.fuel_type, p.target_audience, d.primaryKeyword, ...(d.supportingKeywords ?? []), ...d.tags].filter(Boolean).join(' '),
    });
  }

  // Guides
  for (const g of POSTS) {
    out.push({ t: 'guide', ti: g.title, u: `/blog/${g.slug}/`, d: clip(g.excerpt), k: [g.category, ...g.tags, g.primaryKeyword, ...(g.supportingKeywords ?? [])].filter(Boolean).join(' ') });
  }

  // Pages
  const pages: [string, string, string, string][] = [
    ['Delivery Australia-wide', '/delivery/', 'Enclosed freight from Yatala QLD to every state, quoted by postcode.', 'delivery freight shipping postcode transport'],
    ['Guides and articles', '/blog/', 'Buying guides, comparisons and technical articles.', 'blog guides articles'],
    ['Shop by brand', '/shop/brand/', 'Club Car, E-Z-GO, Yamaha, MGI, PowaKaddy, Evolution, Atlas, Tara, LVTONG, Cushman and Robera.', 'brands makers'],
    ['Frequently asked questions', '/faq/', 'Delivery, warranty, payment and buying questions.', 'faq help questions'],
    ['Pay in Bitcoin or USDT', '/crypto-payment/', 'How crypto payment and the 10% discount work.', 'bitcoin usdt crypto pay discount'],
    ['Fleet and wholesale enquiries', '/wholesale/', 'Buying several buggies: fleet and wholesale.', 'wholesale fleet bulk trade'],
    ['Contact and sales desk', '/contact/', 'Phone, WhatsApp, email and enquiry form.', 'contact phone whatsapp email quote'],
    ['About Golf Buggies Express', '/about/', 'Company details, ABN and the Yatala QLD depot.', 'about abn acn company yatala'],
  ];
  for (const [ti, u, d, k] of pages) out.push({ t: 'page', ti, u, d, k });

  // Questions: each opens the FAQ page
  for (const f of FAQ) out.push({ t: 'faq', ti: f.question, u: '/faq/', d: clip(f.answer), k: '' });

  return out;
}

export function GET() {
  return NextResponse.json(build(), {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
