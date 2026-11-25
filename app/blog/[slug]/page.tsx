import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE, BRAND_PAGES, PRODUCTS, CATEGORIES } from '@/src/config/site';
import { buyerLinksFor } from '@/src/config/inbound-links';
import { POSTS, toPostSummary } from '@/src/config/posts';
import { buildTitle, clampDescription, socialImages } from '@/lib/seo';
import { jsonLd, blogPostingSchema, breadcrumbSchema } from '@/lib/schema';
import BlogPostClient from './BlogPostClient';
import { createLinker } from '@/lib/autolink';
import { relatedSlugs } from '@/src/config/post-related';
import type { Seg } from '@/src/components/LinkedText';
import { GUIDE_REFERENCES, resolveReferences } from '@/src/config/references';

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
  const description = clampDescription(post.excerpt);

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

  // Contextual internal links: first natural mention of a target keyword, in reading order.
  const linker = createLinker(`/blog/${post.slug}/`, 10, 3);
  // The four product primary keywords are linked once each, on the keyword itself, before the generic linker runs.
  const catOf = (raw: string) => CATEGORIES.find((c) => c.rawCategory === raw)?.slug ?? 'fleet';
  const escapeRe = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const explicit = (post.productLinks ?? []).flatMap((l) => {
    const p = PRODUCTS.find((x) => x.slug === l.slug);
    if (!p) return [];
    const parts = l.keyword.trim().split(/\s+/).map(escapeRe);
    return [{ re: new RegExp('(?<![\\w-])(' + parts.join('[\\s-]+') + ')(?![\\w-])', 'i'), href: `/shop/${catOf(p.category)}/${p.slug}/`, done: false }];
  });
  const withExplicit = (text: string): Seg[] => {
    const segs: Seg[] = [text];
    for (const e of explicit) {
      if (e.done) continue;
      for (let i = 0; i < segs.length; i++) {
        const sg = segs[i];
        if (typeof sg !== 'string') continue;
        const m = e.re.exec(sg);
        if (!m) continue;
        const before = sg.slice(0, m.index);
        const after = sg.slice(m.index + m[0].length);
        segs.splice(i, 1, ...([before, { text: m[0], href: e.href }, after].filter((x) => x !== '') as Seg[]));
        e.done = true;
        break;
      }
    }
    return segs;
  };
  const linkedBodies = post.content.map((sec) =>
    sec.body.split(/\n\n+/).map((par) => withExplicit(par).flatMap((sg) => (typeof sg === 'string' ? linker.link(sg) : [sg])))
  );

  // Models this guide helps you choose between: its featured product plus the
  // nearest others in the same range, so every guide links down to real models.
  const featured = PRODUCTS.find((p) => p.slug === post.relatedProductSlug);
  const rangeName = featured?.category ?? post.relatedProductCategory;
  const rangeProducts = PRODUCTS.filter((p) => p.category === rangeName && p.id !== featured?.id)
    .sort((a, b) => Math.abs(a.price_aud - (featured?.price_aud ?? 0)) - Math.abs(b.price_aud - (featured?.price_aud ?? 0)))
    .slice(0, featured ? 3 : 4);
  const models = [...(featured ? [featured] : []), ...rangeProducts].map((p) => ({
    name: p.name,
    price: p.price_display,
    href: `/shop/${CATEGORIES.find((c) => c.rawCategory === p.category)?.slug ?? 'fleet'}/${p.slug}/`,
  }));

  const article = blogPostingSchema(post);
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name: post.title, path: `/blog/${post.slug}/` },
  ]);

  // Three other posts for the footer strip. Summaries only, so the client
  // component does not pull every article body into its bundle.
  // The three next posts in the category ring (src/config/post-related.ts): on topic, and every
  // post receives exactly three inbound links, so none is an orphan.
  const relatedPosts = relatedSlugs(post.slug)
    .map((sl) => POSTS.find((p) => p.slug === sl))
    .filter((p): p is (typeof POSTS)[number] => Boolean(p))
    .map(toPostSummary);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      <BlogPostClient post={post} relatedPosts={relatedPosts} brands={brandLinks} references={resolveReferences(GUIDE_REFERENCES[post.slug])} buyerLinks={buyerLinksFor('blog', post.slug)} linkedBodies={linkedBodies} models={models} />
    </>
  );
}
