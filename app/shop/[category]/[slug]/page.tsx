import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS, CATEGORIES, SITE } from '@/src/config/site';
import ProductClient from './ProductClient';

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
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Buggy Not Found' };

  return {
    title: `${product.name} | ${product.price_display} AUD | The Buggies Express`,
    description: `${product.name} (${product.price_display} AUD). ${product.key_specs}. Yatala QLD depot warranty with enclosed Australia-wide freight.`,
    alternates: {
      canonical: `https://${SITE.domain}/shop/${product.slug}/`,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return <ProductClient product={product} />;
}
