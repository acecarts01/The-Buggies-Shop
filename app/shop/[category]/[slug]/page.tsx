import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS, CATEGORIES, SITE, ABN_INFO, BRAND_PAGES } from '@/src/config/site';
import ProductClient from './ProductClient';
import { buildTitle, buildDescription } from '@/lib/seo';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => {
    const cat = CATEGORIES.find((c) => c.rawCategory === p.category) || { slug: 'fleet' };
    return {
      category: cat.slug,
      slug: p.slug,
    };
  });
}

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Buggy Not Found' };

  // Built rather than interpolated, so long model names cannot push the
  // title or description past what Google will show. See lib/seo.ts.
  const title = buildTitle(product.name);
  const description = buildDescription(
    `${product.name}, ${product.price_display} inc GST.`,
    product.key_specs,
    ['Tested at our Yatala QLD depot.', 'Enclosed freight Australia-wide.', 'Finance in 4 available.']
  );
  const canonical = `https://${SITE.domain}/shop/${category}/${product.slug}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', siteName: SITE.name },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const url = `https://${SITE.domain}/shop/${category}/${product.slug}/`;
  // Brands with a shop page resolve from BRAND_PAGES. Component makers
  // (batteries, controllers, chargers) do not get a shop page but are still
  // real manufacturers, and Product schema should name them.
  const COMPONENT_BRANDS = [
    'RoyPow', 'Eco Battery', 'Invicta', 'Trojan', 'Delta-Q', 'Curtis',
    'Navitas', 'MadJax', 'Albright',
  ];
  const brandName =
    BRAND_PAGES.find((b) => product.name.toLowerCase().includes(b.match.toLowerCase()))?.name ??
    COMPONENT_BRANDS.find((b) => product.name.toLowerCase().includes(b.toLowerCase()));

  // Product + Offer. No aggregateRating is emitted: rating markup is only
  // valid for genuine, attributable reviews, and inventing one to win a star
  // in the results page is exactly the kind of claim this site does not make.
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.fullDescription || product.shortDescription,
    sku: product.id,
    category: product.category,
    // The terms this page is assigned in docs/keyword-map.md, declared where
    // machines read them rather than repeated through the copy. Schema.org
    // supports `keywords` as a comma-separated list, so the assignment does
    // real work without any of it being stuffed into sentences.
    ...(product.primaryKeyword
      ? { keywords: [product.primaryKeyword, ...(product.supportingKeywords || [])].join(', ') }
      : {}),
    image: (product.images || []).map((img) => `https://${SITE.domain}${img}`),
    ...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: SITE.currency,
      price: product.price_aud,
      // Prices on site include GST; stated so aggregators do not add it again.
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: product.price_aud,
        priceCurrency: SITE.currency,
        valueAddedTaxIncluded: true,
      },
      availability:
        product.inStock === false
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: ABN_INFO.companyName,
        taxID: ABN_INFO.abn,
      },
      areaServed: 'AU',
    },
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `https://${SITE.domain}/shop/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category,
        item: `https://${SITE.domain}/shop/${category}/`,
      },
      { '@type': 'ListItem', position: 4, name: product.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ProductClient product={product} />
    </>
  );
}
