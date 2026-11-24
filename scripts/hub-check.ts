// Checks commercial hubs (home, categories, brands, tags) against the SEO ruleset.
//   bun scripts/hub-check.ts [baseUrl]      default: http://localhost:3100
// Fetches rendered HTML for title / meta description / H1 / first 100 words, and counts editorial words from config.
import { CATEGORIES, BRAND_PAGES } from '../src/config/site';
import { resolveCategory } from '../src/config/category-content';
import { TAGS, wordCount } from '../src/config/tags';
import { brandRange, brandRangeParagraph, brandIndexable } from '../lib/brand-copy';
import { brandMore } from '../src/config/brand-more';
import { tagMore, TAG_META } from '../src/config/tag-more';

const base = (process.argv[2] ?? 'http://localhost:3100').replace(/\/$/, '');
const w = (s?: string) => (s ? wordCount(s) : 0);
const strip = (h: string) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const norm = (s: string) => s.toLowerCase().replace(/[-–—:|,.?!;()]/g, ' ').replace(/\s+/g, ' ');
const swapWord = (s: string, a: string, b: string) => s.split(' ').map((x) => (x === a ? b : x)).join(' ');
const variants = (k: string): string[] => {
  const base = norm(k); const out = new Set<string>();
  const forms = (b: string) => [b, swapWord(b, 'buggy', 'buggies'), swapWord(b, 'buggies', 'buggy'), swapWord(b, 'trolley', 'trolleys'), swapWord(b, 'trolleys', 'trolley'), swapWord(b, 'carts', 'cart'), swapWord(b, 'cart', 'carts'), swapWord(b, 'battery', 'batteries'), swapWord(b, 'batteries', 'battery')];
  const toBuggy = (b: string) => swapWord(swapWord(b, 'carts', 'buggies'), 'cart', 'buggy');
  for (const b of [base, toBuggy(base)]) forms(b).forEach((x) => out.add(x));
  return [...out];
};
const has = (hay: string, kw: string) => { const h = ' ' + norm(hay) + ' '; return variants(kw).some((v) => h.includes(' ' + v + ' ')); };

interface Hub { url: string; kind: string; pk: string; words: number; min: number; indexable?: boolean }
const hubs: Hub[] = [];
for (const c of CATEGORIES) {
  if (c.slug === 'all') continue;
  const k: any = resolveCategory(c.slug);
  hubs.push({ url: `/shop/${c.slug}/`, kind: 'category', pk: k.primaryKeyword ?? '', words: w(k.intro) + (k.sections ?? []).reduce((a: number, s: any) => a + w(s.body), 0), min: 300 });
}
for (const b of BRAND_PAGES) {
  const more = brandMore(b.slug).reduce((a, s) => a + w(s.body), 0);
  hubs.push({ url: `/shop/brand/${b.slug}/`, kind: 'brand', pk: b.primaryKeyword, words: w(b.intro) + w(b.body) + w(brandRangeParagraph(b)) + more, min: 300, indexable: brandIndexable(b) });
}
for (const t of TAGS) {
  const more = tagMore(t.slug).reduce((a, s) => a + w(s.body), 0);
  hubs.push({ url: `/tag/${t.slug}/`, kind: 'tag', pk: t.primaryKeyword, words: w(t.intro.join(' ')) + w(TAG_META[t.slug]?.lead) + more, min: 300 });
}
let bad = 0;
for (const h of hubs) {
  const html = await (await fetch(base + h.url)).text();
  const clean = strip(html);
  const title = (clean.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').replace(/&amp;/g, '&').trim();
  const desc = (clean.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '').replace(/&amp;/g, '&');
  const h1s = [...clean.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
  const main = text((clean.match(/<main[\s\S]*<\/main>/i)?.[0] ?? clean));
  const afterH1 = h1s[0] ? main.slice(main.indexOf(h1s[0]) + h1s[0].length) : main;
  const first100 = afterH1.split(' ').slice(0, 100).join(' ');
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(clean);
  if (process.env.DBG) console.log({ title, desc, h1: h1s, pk: h.pk, v: variants(h.pk).slice(0,3) });
  const f: string[] = [];
  if (!h.pk) f.push('no primary keyword');
  else {
    if (!has(title.split('|')[0], h.pk)) f.push('primary not in title');
    if (!has(h1s[0] ?? '', h.pk)) f.push('primary not in H1');
    if (!has(desc, h.pk)) f.push('primary not in description');
    if (!has(first100, h.pk)) f.push('primary not in first 100 words');
  }
  if (title.length > 62) f.push(`title ${title.length} chars`);
  if (desc.length < 110 || desc.length > 160) f.push(`description ${desc.length} chars`);
  if (h1s.length !== 1) f.push(`${h1s.length} H1s`);
  if (h.words < h.min) f.push(`${h.words} words (need ${h.min})`);
  if (h.kind === 'brand' && h.indexable === false && !noindex) f.push('thin brand is not noindex');
  if (h.kind === 'brand' && h.indexable === true && noindex) f.push('indexable brand is noindex');
  if (h.pk && desc.toLowerCase().startsWith(h.pk.toLowerCase() + ':')) f.push('description opens with a keyword stem');
  if (f.length) bad++;
  console.log(h.kind.padEnd(8), h.url.padEnd(42), String(h.words).padStart(4) + 'w', f.length ? 'FAIL: ' + f.join('; ') : 'ok');
}
console.log(bad ? `\n${bad} hub(s) failing` : '\nall hubs pass');
process.exit(bad ? 1 : 0);
