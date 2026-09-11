import React from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS, SITE } from '@/src/config/site';
import CategoryClient from './CategoryClient';

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== 'all').map((c) => ({
    category: c.slug,
  }));
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: 'Category Not Found' };

  // Per-category copy lives in CATEGORIES (see docs/keyword-map.md); the
  // template below is only a fallback for a category added without it.
  const title = cat.metaTitle ?? `${cat.name} | The Buggies Express Yatala QLD`;
  const description =
    cat.metaDescription ??
    `Shop our ${cat.name} range in Australia. Tested at our Yatala QLD depot. Direct ABN 28 668 598 758 guarantee with enclosed freight.`;
  const canonical = `https://${SITE.domain}/shop/${cat.slug}/`;
  // The category's assigned terms (docs/keyword-map.md), declared where
  // machines read them rather than repeated through the copy.
  const keywords = cat.primaryKeyword
    ? [cat.primaryKeyword, ...(cat.supportingKeywords ?? [])]
    : undefined;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  return <CategoryClient categorySlug={cat.slug} categoryName={cat.name} />;
}
