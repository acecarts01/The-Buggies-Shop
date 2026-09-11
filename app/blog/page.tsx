import React from 'react';
import type { Metadata } from 'next';
import { SITE } from '@/src/config/site';
import { POST_SUMMARIES } from '@/src/config/posts';
import { socialImages } from '@/lib/seo';
import { jsonLd, breadcrumbSchema, ORG_ID, WEBSITE_ID, ORIGIN } from '@/lib/schema';
import BlogClient from './BlogClient';

const TITLE = 'Golf Buggy Guides & Technical Advice | Buggies Express';
const DESCRIPTION =
  'Authoritative Australian golf buggy guides, lithium battery comparisons, road registration laws, and maintenance tips from Yatala QLD technicians.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${ORIGIN}/blog/`,
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: `${ORIGIN}/blog/`,
    images: socialImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: socialImages(),
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function BlogPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${ORIGIN}/blog/#blog`,
    name: 'The Buggies Express Technical Guides & Blog',
    description: DESCRIPTION,
    url: `${ORIGIN}/blog/`,
    inLanguage: 'en-AU',
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    blogPost: POST_SUMMARIES.map((post) => ({
      '@type': 'BlogPosting',
      '@id': `${ORIGIN}/blog/${post.slug}/#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { '@type': 'Person', name: post.author.name },
      url: `${ORIGIN}/blog/${post.slug}/`,
    })),
  };

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog & Technical Guides', path: '/blog/' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      <BlogClient posts={POST_SUMMARIES} />
    </>
  );
}
