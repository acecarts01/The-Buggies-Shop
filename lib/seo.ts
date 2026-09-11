import type { Metadata } from 'next';
import { SITE } from '@/src/config/site';

// Title and meta-description builders.
//
// Google truncates titles past roughly 60 characters and descriptions past
// roughly 160. Before this existed, product titles were built as
// `name | price | The Buggies Express` and descriptions pasted the whole of
// key_specs in, so 52 of 61 product titles and every product description
// overflowed and were cut off in results.
//
// These helpers assemble from the longest option that still fits rather than
// truncating with an ellipsis, so nothing ever renders mid-word.

export const TITLE_MAX = 60;
export const DESC_MIN = 120;
export const DESC_MAX = 158;

const BRAND_SUFFIXES = [' | The Buggies Express', ' | Buggies Express', ''];

/**
 * Appends the longest brand suffix that keeps the title within TITLE_MAX.
 * A name long enough to leave no room simply stands on its own - the model
 * name matters more in a result listing than the brand tail does.
 */
export function buildTitle(name: string, max: number = TITLE_MAX): string {
  for (const suffix of BRAND_SUFFIXES) {
    if (name.length + suffix.length <= max) return name + suffix;
  }
  return name;
}

/**
 * Shortens text to fit a meta description without cutting mid-word.
 *
 * The blog previously did `excerpt.slice(0, 152) + '...'`, which left 18 of
 * 26 descriptions ending on a fragment like "windscreen protect...". This
 * prefers the last complete sentence, and falls back to the last whole word.
 */
export function clampDescription(text: string, max: number = DESC_MAX, min: number = DESC_MIN): string {
  if (text.length <= max) return text;

  const cut = text.slice(0, max);

  // A clean sentence end is best, but only if enough text survives.
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (lastStop + 1 >= min) return cut.slice(0, lastStop + 1);

  // Otherwise end on a whole word, dropping any dangling punctuation.
  const lastSpace = cut.lastIndexOf(' ');
  const body = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, '');
  return body + '…';
}

/**
 * Builds a description by adding whole clauses while they fit, so the result
 * always ends on a complete sentence. `specs` is trimmed on its own comma
 * boundaries rather than mid-item.
 */
export function buildDescription(
  core: string,
  specs: string,
  clauses: string[],
  max: number = DESC_MAX
): string {
  let out = core.trim();

  if (specs) {
    const items = specs.split(',').map((s) => s.trim()).filter(Boolean);
    let kept = '';
    for (const item of items) {
      const next = kept ? kept + ', ' + item : item;
      if ((out + ' ' + next + '.').length <= max) kept = next;
      else break;
    }
    if (kept) out += ' ' + kept + '.';
  }

  for (const clause of clauses) {
    const c = ' ' + clause.trim();
    if ((out + c).length <= max) out += c;
  }

  return out;
}

// ---------------------------------------------------------------------------
// Social images
//
// Next only applies the root `app/opengraph-image.jpg` to routes that do not
// define their own `openGraph` object, and every route here does, so category,
// blog, brand and static pages were shipping without any og:image. Each
// route's metadata spreads one of these so a share card never comes up blank.
// Product pages pass their own photo; everything else uses the brand image.

export const OG_IMAGE_PATH = '/opengraph-image.jpg';

export const DEFAULT_OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: 'The Buggies Express signpost on an Australian golf course fairway, with buggies and players behind.',
};

/** `openGraph.images` / `twitter.images` for a route. */
export function socialImages(image?: { url: string; alt: string; width?: number; height?: number }) {
  return [image ?? DEFAULT_OG_IMAGE];
}

/**
 * Complete metadata for a static route. Next does not merge a child route's
 * missing `openGraph` with the parent's field by field: a route that sets
 * only `title`/`description` inherits the ROOT openGraph object wholesale, so
 * /shop/, /contact/, /faq/, /wholesale/ and /crypto-payment/ were sharing as
 * the homepage card with the homepage URL. Every static route goes through
 * this so og:title, og:url, og:image and the Twitter card always match.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  /** Path with leading and trailing slash, e.g. '/contact/'. */
  path: string;
  type?: 'website' | 'article';
  image?: { url: string; alt: string; width?: number; height?: number };
  robots?: Metadata['robots'];
}): Metadata {
  const url = `https://${SITE.domain}${opts.path}`;
  const images = socialImages(opts.image);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type ?? 'website',
      siteName: SITE.name,
      locale: 'en_AU',
      title: opts.title,
      description: opts.description,
      url,
      images,
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images },
    ...(opts.robots ? { robots: opts.robots } : {}),
  };
}
