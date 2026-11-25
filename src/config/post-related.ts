// SERVER-ONLY. Related-post links for the blog.
//
// Every post links to three others in the "More guides" strip, and the choice must (a) stay on
// topic and (b) leave no post an orphan. Posts are ordered by category, then range, then title, and
// each post links to the next three in that ring. The ring wraps, so every post receives exactly
// three inbound links from its neighbours, whatever the topic mix.
import { POSTS } from './posts';

const ring = [...POSTS]
  .sort((a, b) => a.category.localeCompare(b.category) || (a.relatedProductCategory ?? '').localeCompare(b.relatedProductCategory ?? '') || a.title.localeCompare(b.title))
  .map((p) => p.slug);

const RELATED = new Map<string, string[]>(
  ring.map((slug, i) => [slug, [1, 2, 3].map((k) => ring[(i + k) % ring.length])])
);

/** Slugs of the three posts this post links to. */
export const relatedSlugs = (slug: string): string[] => RELATED.get(slug) ?? [];

/** Slugs of the posts that link to this one (exactly three). */
export const inboundSlugs = (slug: string): string[] => ring.filter((s) => RELATED.get(s)?.includes(slug));
