import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS, CATEGORIES, SITE } from '@/src/config/site';
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
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return <ProductClient product={product} />;
}
