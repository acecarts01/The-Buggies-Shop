import { MetadataRoute } from 'next';
import { SITE, PRODUCTS, CATEGORIES, BRAND_PAGES, CONTENT_UPDATED } from '@/src/config/site';
import { POSTS } from '@/src/config/posts';

// Split sitemaps, served at /sitemap/<id>.xml and indexed by
// app/sitemap.xml/route.ts (which robots.txt and Search Console point at).
//
//   0  static pages
//   1  category + brand hubs
//   2  products, each with its photo as <image:image>
//   3  blog posts
//
// Every URL carries a real lastmod: blog posts use their publish date, the
// rest use CONTENT_UPDATED (bumped by hand when that content changes). The
// previous single sitemap stamped the build time on everything, which tells
// Google nothing and gets lastmod ignored entirely.

export const SITEMAP_IDS = [0, 1, 2, 3] as const;

const base = `https://${SITE.domain}`;
const catalogDate = new Date(CONTENT_UPDATED.catalog);
const pagesDate = new Date(CONTENT_UPDATED.pages);

export function generateSitemaps() {
  return SITEMAP_IDS.map((id) => ({ id }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  switch (Number(id)) {
    case 0:
      return [
        { url: `${base}/`, lastModified: catalogDate, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${base}/shop/`, lastModified: catalogDate, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${base}/shop/brand/`, lastModified: catalogDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${base}/blog/`, lastModified: new Date(latestPostDate()), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${base}/delivery/`, lastModified: pagesDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${base}/contact/`, lastModified: pagesDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${base}/crypto-payment/`, lastModified: pagesDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/about/`, lastModified: pagesDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/faq/`, lastModified: pagesDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/wholesale/`, lastModified: pagesDate, changeFrequency: 'monthly', priority: 0.6 },
      ];

    case 1:
      return [
        ...CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => ({
          url: `${base}/shop/${cat.slug}/`,
          lastModified: catalogDate,
          changeFrequency: 'weekly' as const,
          // A coming-soon category has copy but no catalogue yet.
          priority: cat.comingSoon ? 0.6 : 0.85,
        })),
        ...BRAND_PAGES.map((b) => ({
          url: `${base}/shop/brand/${b.slug}/`,
          lastModified: catalogDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })),
      ];

    case 2:
      // product.category holds the display name; map it back to the route slug
      // (same lookup as generateStaticParams).
      return PRODUCTS.map((product) => {
        const cat = CATEGORIES.find((c) => c.rawCategory === product.category);
        return {
          url: `${base}/shop/${cat?.slug ?? 'fleet'}/${product.slug}/`,
          lastModified: catalogDate,
          changeFrequency: 'weekly' as const,
          priority: product.featured ? 0.9 : 0.8,
          images: (product.images || []).map((img) => (img.startsWith('http') ? img : `${base}${img}`)),
        };
      });

    case 3:
      return POSTS.map((post) => ({
        url: `${base}/blog/${post.slug}/`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: post.featured ? 0.8 : 0.7,
      }));

    default:
      return [];
  }
}

function latestPostDate(): string {
  return POSTS.map((p) => p.date).sort().at(-1) ?? CONTENT_UPDATED.pages;
}
