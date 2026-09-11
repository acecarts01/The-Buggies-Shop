// JSON-LD builders shared by every route.
//
// One organisation entity, one `@id`, referenced everywhere. Before this file
// the homepage, about page, delivery page, product pages and blog posts each
// wrote their own Organization/seller/publisher with four different spellings
// of the company name and no `@id`, so an answer engine saw four loosely
// related businesses instead of one. Everything here derives from
// src/config/site.ts; nothing is hand-typed per page.
//
// Serialise with `jsonLd()` rather than JSON.stringify: it keeps the contact
// email out of the raw HTML (`\u0040` in place of `@`) while still decoding to a
// valid address for any JSON parser. `&#64;` inside JSON-LD is NOT decoded
// by parsers and produced an invalid email value in the live schema.

import {
  SITE,
  ABN_INFO,
  CONTACT,
  BRAND,
  PRODUCTS,
  CATEGORIES,
  BRAND_PAGES,
  ProductItem,
} from '@/src/config/site';
import type { BlogPost } from '@/src/config/posts';
import { getProductDetails } from '@/src/config/product-details';

export const ORIGIN = `https://${SITE.domain}`;
export const ORG_ID = `${ORIGIN}/#organization`;
export const WEBSITE_ID = `${ORIGIN}/#website`;
export const LOGO_URL = `${ORIGIN}/icon.png`;
export const DEFAULT_IMAGE_URL = `${ORIGIN}/opengraph-image.jpg`;

const prices = PRODUCTS.map((p) => p.price_aud);
const LOW = Math.min(...prices);
const HIGH = Math.max(...prices);

/** Serialise for a <script type="application/ld+json"> block. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .split(CONTACT.emailRaw)
    .join(CONTACT.emailRaw.replace('@', '\\u0040'));
}

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${ORIGIN}${path}`;
}

/** Registered address. The depot's street number is not published. */
const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: CONTACT.address,
  addressLocality: 'Yatala',
  addressRegion: 'QLD',
  postalCode: '4207',
  addressCountry: 'AU',
};

/**
 * The organisation entity. Store and AutomotiveBusiness are both
 * LocalBusiness subtypes: the company sells, services and repairs motorised
 * vehicles from one depot, which is exactly what those types describe.
 */
export function organizationSchema(opts: { full?: boolean } = {}) {
  const base = {
    '@type': ['Organization', 'Store', 'AutomotiveBusiness'],
    '@id': ORG_ID,
    name: SITE.name,
    legalName: ABN_INFO.companyName,
    alternateName: ['Buggies Express', SITE.legalEntity],
    url: `${ORIGIN}/`,
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
    image: DEFAULT_IMAGE_URL,
    telephone: CONTACT.phone,
    email: CONTACT.emailRaw,
    address: POSTAL_ADDRESS,
  };
  if (!opts.full) return base;

  return {
    ...base,
    description: BRAND.description,
    slogan: SITE.tagline,
    // ASIC registration date, not just the year.
    foundingDate: '2023-06-07',
    foundingLocation: { '@type': 'Place', name: 'Yatala, Queensland, Australia', address: POSTAL_ADDRESS },
    taxID: ABN_INFO.abn.replace(/\s/g, ''),
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'ABN', value: ABN_INFO.abn },
      { '@type': 'PropertyValue', propertyID: 'ACN', value: ABN_INFO.acn },
    ],
    // Every state and territory: freight is quoted to any Australian postcode.
    areaServed: [
      { '@type': 'Country', name: 'Australia' },
      ...['Queensland', 'New South Wales', 'Victoria', 'South Australia', 'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'].map(
        (name) => ({ '@type': 'State', name })
      ),
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: CONTACT.phone,
        email: CONTACT.emailRaw,
        url: CONTACT.whatsappUrl,
        areaServed: 'AU',
        availableLanguage: 'en-AU',
      },
    ],
    currenciesAccepted: 'AUD',
    paymentAccepted: 'PayID, Osko, Bank Transfer, Finance in 4, Bitcoin, Tether',
    priceRange: `$${LOW.toLocaleString('en-AU')}–$${HIGH.toLocaleString('en-AU')} AUD`,
    numberOfItems: PRODUCTS.length,
    knowsAbout: [
      'Golf buggies',
      'Electric golf carts',
      'Lithium golf buggy batteries',
      '4-seater golf buggies',
      'Lifted 4x4 off-road golf carts',
      'Commercial and farm utility vehicles',
      'Motorised walk-behind golf trolleys',
      'Golf buggy servicing, warranty and spare parts',
    ],
    brand: BRAND_PAGES.map((b) => ({ '@type': 'Brand', name: b.name })),
    makesOffer: {
      '@type': 'AggregateOffer',
      priceCurrency: 'AUD',
      lowPrice: LOW,
      highPrice: HIGH,
      offerCount: PRODUCTS.length,
      availability: 'https://schema.org/InStock',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${SITE.name} range`,
      url: `${ORIGIN}/shop/`,
      itemListElement: CATEGORIES.filter((c) => c.slug !== 'all' && !c.comingSoon).map((c) => ({
        '@type': 'OfferCatalog',
        name: c.name,
        url: `${ORIGIN}/shop/${c.slug}/`,
      })),
    },
    // Only real, owner-supplied profiles belong here. Empty is honest.
    ...(BRAND.sameAs.length ? { sameAs: BRAND.sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${ORIGIN}/`,
    name: SITE.name,
    inLanguage: 'en-AU',
    publisher: { '@id': ORG_ID },
    // /search/ is a real client-side search over products, posts and FAQs.
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${ORIGIN}/search/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Homepage graph: the full organisation plus the website node. */
export function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema({ full: true }), websiteSchema()],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function categorySlugFor(product: ProductItem): string {
  return CATEGORIES.find((c) => c.rawCategory === product.category)?.slug ?? 'fleet';
}

export function productUrl(product: ProductItem): string {
  return `${ORIGIN}/shop/${categorySlugFor(product)}/${product.slug}/`;
}

// Component makers (batteries, controllers, chargers) have no shop page but
// are real manufacturers and Product schema should name them.
const COMPONENT_BRANDS = ['RoyPow', 'Eco Battery', 'Invicta', 'Trojan', 'Delta-Q', 'Curtis', 'Navitas', 'MadJax', 'Albright'];

export function productBrandName(product: ProductItem): string | undefined {
  const n = product.name.toLowerCase();
  return (
    BRAND_PAGES.find((b) => n.includes(b.match.toLowerCase()))?.name ??
    COMPONENT_BRANDS.find((b) => n.includes(b.toLowerCase()))
  );
}

/**
 * Product + Offer. No aggregateRating: rating markup is only valid for
 * genuine, attributable reviews. No priceValidUntil: prices are not
 * guaranteed to a date, so the site does not claim one.
 */
export function productSchema(product: ProductItem) {
  const url = productUrl(product);
  const brand = productBrandName(product);
  const images = (product.images || []).map(absoluteUrl);
  const details = getProductDetails(product.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    url,
    description: details.fullDescription || product.shortDescription,
    sku: product.id,
    category: product.category,
    image: images.length ? images : [DEFAULT_IMAGE_URL],
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    ...(details.primaryKeyword
      ? { keywords: [details.primaryKeyword, ...(details.supportingKeywords || [])].join(', ') }
      : {}),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: SITE.currency,
      price: product.price_aud,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: product.price_aud,
        priceCurrency: SITE.currency,
        valueAddedTaxIncluded: true,
      },
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: 'Australia' },
    },
  };
}

/**
 * Category listing. ItemList carries the products so an engine can read the
 * range without following 61 links; coming-soon categories have no list.
 */
export function collectionPageSchema(cat: { slug: string; name: string; rawCategory?: string; comingSoon?: boolean; metaDescription?: string }) {
  const url = `${ORIGIN}/shop/${cat.slug}/`;
  const items = cat.comingSoon ? [] : PRODUCTS.filter((p) => (cat.rawCategory ? p.category === cat.rawCategory : true));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: cat.name,
    ...(cat.metaDescription ? { description: cat.metaDescription } : {}),
    inLanguage: 'en-AU',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    ...(items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: items.length,
            itemListOrder: 'https://schema.org/ItemListUnordered',
            itemListElement: items.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: productUrl(p),
              name: p.name,
              ...(p.images?.[0] ? { image: absoluteUrl(p.images[0]) } : {}),
            })),
          },
        }
      : {}),
  };
}

function isPlaceholderImage(src?: string): boolean {
  return !src || /picsum\.photos|placeholder/i.test(src);
}

/** Blog article. Falls back to the brand image while a post has no real photo. */
export function blogPostingSchema(post: BlogPost) {
  const url = `${ORIGIN}/blog/${post.slug}/`;
  const wordCount = post.content.reduce((n, s) => n + s.body.split(/\s+/).length + (s.bulletPoints || []).join(' ').split(/\s+/).length, 0);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    image: [isPlaceholderImage(post.image) ? DEFAULT_IMAGE_URL : absoluteUrl(post.image)],
    inLanguage: 'en-AU',
    articleSection: post.category,
    wordCount,
    ...(post.primaryKeyword
      ? { keywords: [post.primaryKeyword, ...(post.supportingKeywords || []), ...(post.tags || [])].join(', ') }
      : { keywords: (post.tags || []).join(', ') }),
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      worksFor: { '@id': ORG_ID },
    },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}
