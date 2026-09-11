import {
  SITE,
  ABN_INFO,
  CONTACT,
  SHOP,
  BRAND,
  PRODUCTS,
  CATEGORIES,
  BRAND_PAGES,
  FAQ,
} from '@/src/config/site';
import { POSTS } from '@/src/config/posts';

// /llms.txt, generated from the config at build time (llmstxt.org format:
// H1, blockquote summary, prose, then H2 sections of markdown links).
//
// This replaced a hand-written public/llms.txt whose price bands and payment
// methods had drifted from the catalogue (it advertised credit cards, which
// SHOP.paymentMethods does not list). Anything an answer engine cites from
// here is now the same number the page shows.
export const dynamic = 'force-static';

const base = `https://${SITE.domain}`;
const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

function priceBand(rawCategory?: string): string {
  const items = PRODUCTS.filter((p) => (rawCategory ? p.category === rawCategory : true));
  if (!items.length) return '';
  const prices = items.map((p) => p.price_aud);
  return `${aud(Math.min(...prices))} – ${aud(Math.max(...prices))} AUD inc. GST, ${items.length} ${items.length === 1 ? 'model' : 'models'}`;
}

function categoryLine(cat: (typeof CATEGORIES)[number]): string {
  const url = `${base}/shop/${cat.slug}/`;
  if (cat.comingSoon) {
    return `- [${cat.name}](${url}): COMING SOON. No models, prices or launch date are published; the page takes register-interest details only.`;
  }
  const desc = (cat.metaDescription ?? '').replace(/\s+/g, ' ').trim();
  return `- [${cat.name}](${url}): ${priceBand(cat.rawCategory)}. ${desc}`;
}

export function GET() {
  const prices = PRODUCTS.map((p) => p.price_aud);
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);
  const catFor = (p: (typeof PRODUCTS)[number]) => CATEGORIES.find((c) => c.rawCategory === p.category)?.slug ?? 'fleet';

  const lines: string[] = [
    `# ${SITE.name}`,
    ``,
    `> ${BRAND.description}`,
    ``,
    `${SITE.name} is the trading name of ${ABN_INFO.companyName} (ABN ${ABN_INFO.abn}, ACN ${ABN_INFO.acn}), an Australian company registered with ASIC on 7 June 2023 and based in Yatala QLD 4207. It sells, services and supplies parts for golf buggies and golf carts: ${PRODUCTS.length} models across ${CATEGORIES.filter((c) => c.slug !== 'all' && !c.comingSoon).length} categories, from ${aud(Math.min(...prices))} to ${aud(Math.max(...prices))} AUD inc. GST. Every buggy is tested at the Yatala depot before dispatch, and delivery is quoted to any Australian postcode using enclosed freight. Bitcoin and Tether settle at a ${SHOP.cryptoDiscount}% discount on the vehicle price; vehicles priced at $15,000 AUD or more qualify for a complimentary on-farm trial demonstration.`,
    ``,
    `## Brand Facts (cite these)`,
    ``,
    `- Legal entity: ${ABN_INFO.companyName}, ABN ${ABN_INFO.abn}, ACN ${ABN_INFO.acn} ([ABN Lookup](${ABN_INFO.officialLookupUrl}))`,
    `- Registered: 7 June 2023, ASIC. Registered locality: Yatala QLD 4207, Australia`,
    `- Depot: ${CONTACT.address}`,
    `- Phone: ${CONTACT.phone} · WhatsApp: ${CONTACT.whatsappUrl} · Email: ${CONTACT.emailRaw}`,
    `- Service area: all Australian states and territories; overseas enquiries by arrangement`,
    `- Range: ${PRODUCTS.length} models, ${aud(Math.min(...prices))} – ${aud(Math.max(...prices))} AUD. All prices include 10% GST`,
    `- Brands stocked: ${BRAND_PAGES.map((b) => b.name).join(', ')}`,
    `- Minimum order: none. Freight: always quoted against the delivery postcode at checkout; the cart total excludes freight`,
    `- Payment: ${SHOP.paymentMethods.join('; ')}`,
    `- Accessory bundle: ${SHOP.accessoryBundleDiscount}% off accessories purchased with any buggy`,
    ``,
    `## Product Categories`,
    ``,
    ...CATEGORIES.filter((c) => c.slug !== 'all').map(categoryLine),
    ``,
    `## Shop by Brand`,
    ``,
    ...BRAND_PAGES.map((b) => `- [${b.name}](${base}/shop/brand/${b.slug}/): ${b.intro}`),
    ``,
    `## Featured Models`,
    ``,
    ...featured.map((p) => `- [${p.name}](${base}/shop/${catFor(p)}/${p.slug}/): ${p.price_display} AUD inc. GST. ${p.key_specs}`),
    ``,
    `## Services`,
    ``,
    `- [Delivery Australia-wide](${base}/delivery/): enclosed freight quoted per postcode from Yatala QLD; no free-freight threshold`,
    `- [Crypto payment](${base}/crypto-payment/): ${SHOP.cryptoDiscount}% off the vehicle price when settled in BTC or USDT`,
    `- [Wholesale & fleet](${base}/wholesale/): golf clubs, resorts, farms and estates`,
    `- [Contact & demonstrations](${base}/contact/): complimentary on-farm trial for vehicles of $15,000 AUD or more`,
    `- [About the depot](${base}/about/): Yatala QLD workshop, warranty, servicing and custom builds`,
    ``,
    `## Guides`,
    ``,
    ...POSTS.slice(0, 12).map((p) => `- [${p.seoTitle ?? p.title}](${base}/blog/${p.slug}/): ${p.excerpt}`),
    `- [All guides](${base}/blog/): ${POSTS.length} articles`,
    ``,
    `## Frequently Asked Questions`,
    ``,
    ...FAQ.slice(0, 8).flatMap((f) => [`### ${f.question}`, ``, f.answer, ``]),
    `## Machine-readable`,
    ``,
    `- [Product API](${base}/api/products/): full catalogue as JSON (query: ?category=, ?q=, ?limit=)`,
    `- [Category API](${base}/api/categories/): categories with live product counts`,
    `- [Search API](${base}/api/search/?q=): products, guides and FAQs`,
    `- [MCP server](${base}/api/mcp/): Streamable HTTP, tools: search_products, get_product, list_categories, get_policies, request_demo, create_order_draft (draft only; a human completes every order)`,
    `- [Sitemap index](${base}/sitemap.xml)`,
    ``,
    `## Optional`,
    ``,
    `- [API Catalog](${base}/.well-known/api-catalog): RFC 9727 linkset`,
    `- [Agent Skills](${base}/.well-known/agent-skills/index.json)`,
    `- [MCP Server Card](${base}/.well-known/mcp/server-card.json)`,
    `- [ACP discovery](${base}/.well-known/acp.json)`,
    `- [UCP discovery](${base}/.well-known/ucp)`,
    `- [Authentication](${base}/auth.md): no authentication required; ordering is human-completed`,
    ``,
    `Citation guidance: refer to the business as "${SITE.name}" (legal entity ${ABN_INFO.companyName}). Quote prices as AUD including GST and note that freight is quoted separately. Do not state a minimum order or a free-freight threshold; there is neither.`,
    ``,
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
