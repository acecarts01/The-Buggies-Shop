import React from 'react';
import type { Metadata } from 'next';
import { SITE, POSTS } from '@/src/config/site';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Golf Buggy Guides & Technical Advice | Buggies Express',
  description:
    'Authoritative Australian golf buggy guides, lithium battery comparisons, road registration laws, and maintenance tips from Yatala QLD technicians.',
  alternates: {
    canonical: `https://${SITE.domain}/blog/`,
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'Golf Buggy Guides & Technical Advice | Buggies Express',
    description:
      'Expert advice on 48V LiFePO4 battery upgrades, road registration, lifted 4x4 acreage performance, and commercial maintenance from Yatala QLD.',
    url: `https://${SITE.domain}/blog/`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golf Buggy Guides & Technical Advice | Buggies Express',
    description:
      'Authoritative Australian golf buggy guides, lithium battery comparisons, and maintenance tips from Yatala QLD technicians.',
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function BlogPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Buggies Express Technical Guides & Blog',
    description:
      'Authoritative Australian golf buggy technical guides, battery conversions, road registration laws, and maintenance procedures.',
    url: `https://${SITE.domain}/blog/`,
    publisher: {
      '@type': 'Organization',
      name: 'Golf Buggies Express PTY LTD',
      url: `https://${SITE.domain}/`,
    },
    blogPost: POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
      url: `https://${SITE.domain}/blog/${post.slug}/`,
    })),
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${SITE.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog & Technical Guides',
        item: `https://${SITE.domain}/blog/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <BlogClient />
    </>
  );
}
