import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS, CATEGORIES, SITE } from '@/src/config/site';
import ProductClient from './ProductClient';
import { buildTitle, buildDescription, socialImages } from '@/lib/seo';
import { jsonLd, productSchema, breadcrumbSchema, absoluteUrl } from '@/lib/schema';

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

  // The product photo is the share image; the brand image is the fallback.
  const photo = product.images?.[0]
    ? { url: absoluteUrl(product.images[0]), alt: product.name }
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', siteName: SITE.name, images: socialImages(photo) },
    twitter: { card: 'summary_large_image', title, description, images: socialImages(photo) },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  // Product + Offer and the breadcrumb trail both come from lib/schema.ts so
  // every product page (including the bespoke Atlas route) emits the same
  // shape: image, brand, sku, seller by @id, GST-inclusive price.
  const schema = productSchema(product);
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop/' },
    { name: product.category, path: `/shop/${category}/` },
    { name: product.name, path: `/shop/${category}/${product.slug}/` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      <ProductClient product={product} />
    </>
  );
}
