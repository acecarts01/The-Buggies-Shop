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

  return {
    title: `${cat.name} | The Buggies Express Yatala QLD`,
    description: `Shop our ${cat.name} range in Australia. Tested at our Yatala QLD depot. Direct ABN 28 668 598 758 guarantee with enclosed freight.`,
    alternates: {
      canonical: `https://${SITE.domain}/shop/${cat.slug}/`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  return <CategoryClient categorySlug={cat.slug} categoryName={cat.name} />;
}
