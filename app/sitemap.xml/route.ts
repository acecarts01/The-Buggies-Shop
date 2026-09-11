import { SITE, CONTENT_UPDATED } from '@/src/config/site';
import { POSTS } from '@/src/config/posts';
import { SITEMAP_IDS } from '../sitemap';

// The sitemap index. app/sitemap.ts (generateSitemaps) emits the children at
// /sitemap/<id>.xml; this is the single URL robots.txt, Search Console and
// Bing Webmaster Tools are given.
export const dynamic = 'force-static';

export function GET() {
  const base = `https://${SITE.domain}`;
  const latestPost = POSTS.map((p) => p.date).sort().at(-1) ?? CONTENT_UPDATED.pages;
  const lastmod: Record<number, string> = {
    0: CONTENT_UPDATED.pages,
    1: CONTENT_UPDATED.catalog,
    2: CONTENT_UPDATED.catalog,
    3: latestPost,
  };

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    SITEMAP_IDS.map(
      (id) => `  <sitemap>\n    <loc>${base}/sitemap/${id}.xml</loc>\n    <lastmod>${lastmod[id]}</lastmod>\n  </sitemap>\n`
    ).join('') +
    `</sitemapindex>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
