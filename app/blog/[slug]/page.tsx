import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE, BRAND_PAGES, PRODUCTS } from '@/src/config/site';
import { POSTS, toPostSummary } from '@/src/config/posts';
import { buildTitle, clampDescription, socialImages, keywordLead } from '@/lib/seo';
import { jsonLd, blogPostingSchema, breadcrumbSchema } from '@/lib/schema';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  return POSTS.map((p) => ({
    slug: p.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: 'Article Not Found | The Buggies Express',
    };
  }

  // post.title is the H1 and runs long by design; seoTitle is the short form
  // for the <title> tag. buildTitle adds the brand only when it still fits.
  const title = buildTitle(post.seoTitle ?? post.title);
  const description = clampDescription(keywordLead(post.excerpt, post.primaryKeyword));

  return {
    title,
    description,
    alternates: {
      canonical: `https://${SITE.domain}/blog/${post.slug}/`,
    },
    openGraph: {
      type: 'article',
      siteName: SITE.name,
      title,
      description,
      url: `https://${SITE.domain}/blog/${post.slug}/`,
      publishedTime: post.date,
      authors: [post.author.name],
      images: socialImages(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImages(),
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  // Brand pages this guide is about: named in the title, excerpt, tags or slug, or
  // mentioned twice or more in the body; else the brand of its featured product.
  const bodyText = post.content.map((c) => c.body).join(' ').toLowerCase();
  const head = (post.title + ' ' + post.excerpt + ' ' + post.tags.join(' ') + ' ' + post.slug.replace(/-/g, ' ')).toLowerCase();
  const flat = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const mentions = (b: (typeof BRAND_PAGES)[number], hay: string) => hay.split(b.name.toLowerCase()).length - 1;
  let brands = BRAND_PAGES.filter((b) => flat(head).includes(flat(b.name)) || mentions(b, bodyText) >= 2)
    .sort((a, b) => mentions(b, bodyText) - mentions(a, bodyText))
    .slice(0, 4);
  if (!brands.length && post.relatedProductSlug) {
    const rp = PRODUCTS.find((p) => p.slug === post.relatedProductSlug);
    brands = BRAND_PAGES.filter((b) => rp && rp.name.toLowerCase().includes(b.match.toLowerCase())).slice(0, 1);
  }
  const brandLinks = brands.map((b) => ({ slug: b.slug, name: b.name }));

  const article = blogPostingSchema(post);
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name: post.title, path: `/blog/${post.slug}/` },
  ]);

  // Three other posts for the footer strip. Summaries only, so the client
  // component does not pull every article body into its bundle.
  // Ranked by shared tags, then category, so a guide links to guides on its own
  // topic rather than to the same three newest posts every time.
  const tagSet = new Set(post.tags);
  const score = (p: (typeof POSTS)[number]) => p.tags.filter((t) => tagSet.has(t)).length * 2 + (p.category === post.category ? 1 : 0);
  const relatedPosts = POSTS.filter((p) => p.slug !== post.slug)
    .map((p, i) => ({ p, i, sc: score(p) }))
    .sort((a, b) => b.sc - a.sc || a.i - b.i)
    .slice(0, 3)
    .map((x) => toPostSummary(x.p));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      <BlogPostClient post={{ ...post, excerpt: keywordLead(post.excerpt, post.primaryKeyword) }} relatedPosts={relatedPosts} brands={brandLinks} />
    </>
  );
}
