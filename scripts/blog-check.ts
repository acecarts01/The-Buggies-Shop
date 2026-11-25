// Checks every refreshed blog post (src/config/post-refresh.ts) against the owner's blog ruleset.
//   bun scripts/blog-check.ts            all refreshed posts + site-wide checks, exits 1 on any failure
//   bun scripts/blog-check.ts --links    also require 2-4 outbound sources including a verified YouTube video
//   bun scripts/blog-check.ts slug...    only the named posts
// Per post: exactly 1,500 body words (sections + bullet points), answer-first openers (40-60 words), 6-9 H2s with
// question headings, primary keyword placement and density, 10-15 secondaries including 4 product keywords that
// are linked once each, FAQ of 5-6 answers of 40-60 words, 10 unique keyword tags that exist in the keyword data.
import { POSTS } from '../src/config/posts';
import { POST_REFRESH } from '../src/config/post-refresh';
import { PRODUCTS } from '../src/config/site';
import { GUIDE_REFERENCES, REFERENCES } from '../src/config/references';
import { loadPool, usedKeywords, kwKey, words } from './lib/keywords';

const args = process.argv.slice(2);
const wantLinks = args.includes('--links');
const only = args.filter((a) => !a.startsWith('--'));
const pool = loadPool();

const POWER = /\b(buy|shop|order|get|save|official|compare)\b/i;
const norm = (s: string) => s.toLowerCase().replace(/[-–—:|,.?!;()'’"]/g, ' ').replace(/\s+/g, ' ').trim();
const swap = (s: string, a: string, b: string) => s.split(' ').map((x) => (x === a ? b : x)).join(' ');
const variants = (k: string): string[] => {
  const base = norm(k);
  const out = new Set<string>();
  const forms = (b: string) => [b, swap(b, 'buggy', 'buggies'), swap(b, 'buggies', 'buggy'), swap(b, 'trolley', 'trolleys'), swap(b, 'trolleys', 'trolley'), swap(b, 'carts', 'cart'), swap(b, 'cart', 'carts'), swap(b, 'battery', 'batteries'), swap(b, 'batteries', 'battery')];
  forms(base).forEach((x) => out.add(x));
  return [...out];
};
const countOcc = (text: string, kw: string) => {
  const hay = ' ' + norm(text) + ' ';
  let n = 0;
  for (const v of variants(kw)) { let i = 0; while ((i = hay.indexOf(' ' + v + ' ', i)) >= 0) { n++; i += v.length; } if (n) break; }
  return n;
};
const has = (text: string, kw: string) => countOcc(text, kw) > 0;
const exact = (text: string, kw: string) => ' ' + norm(text) + ' ';

let failures = 0;
let checked = 0;
const slugs = Object.keys(POST_REFRESH).filter((s) => !only.length || only.includes(s));
const used = usedKeywords();
const tagOwner = new Map<string, string>();

for (const slug of slugs) {
  const p = POSTS.find((x) => x.slug === slug);
  const f: string[] = [];
  if (!p) { console.log(slug.padEnd(60), 'FAIL: slug not in BASE_POSTS'); failures++; continue; }
  checked++;
  const pk = p.primaryKeyword ?? '';
  const sec = p.supportingKeywords ?? [];
  const bodies = p.content.map((c) => c.body + ' ' + (c.bulletPoints ?? []).join(' '));
  const bodyText = bodies.join(' ');
  const wc = bodies.reduce((a, b) => a + words(b), 0);
  if (wc !== 1500) f.push(`${wc} words (need exactly 1500)`);

  // headings
  if (p.content.length < 6 || p.content.length > 9) f.push(`${p.content.length} H2 sections (6-9)`);
  const heads = p.content.map((c) => c.heading);
  const qHeads = heads.filter((h) => h.trim().endsWith('?')).length;
  if (qHeads < 3) f.push(`only ${qHeads} question headings (need 3+)`);
  if (!heads.some((h) => has(h, pk))) f.push('primary not in any H2');
  if (heads.filter((h) => sec.some((k) => has(h, k))).length < 2) f.push('fewer than 2 H2s carry a secondary');
  p.content.forEach((c, i) => {
    const first = c.body.split(/\n\n+/)[0];
    const n = words(first);
    if (n < 40 || n > 60) f.push(`section ${i + 1} opener is ${n} words (40-60)`);
  });

  // title, seo title, meta
  if (!pk) f.push('no primary keyword');
  else {
    if (!has(p.title, pk)) f.push('primary not in H1/title');
    const st = p.seoTitle ?? '';
    if (st.length < 40 || st.length > 62) f.push(`seoTitle ${st.length} chars (40-62)`);
    if (!POWER.test(st)) f.push('seoTitle has no buy-intent word');
    const at = norm(st).indexOf(norm(pk).split(' ')[0]);
    const nearStart = variants(pk).some((v) => norm(st).startsWith(v) || norm(st).indexOf(v) <= 12);
    if (!has(st, pk) || !nearStart) f.push('primary not near the start of seoTitle');
    void at;
    if (!has(p.excerpt, pk)) f.push('primary not in meta description');
    if (p.excerpt.length < 110 || p.excerpt.length > 160) f.push(`meta description ${p.excerpt.length} chars (110-160)`);
    if (p.excerpt.toLowerCase().startsWith(pk.toLowerCase() + ':')) f.push('meta description opens with a keyword stem');
    if (/^[A-Z][a-z0-9+ -]{3,50}: /.test(p.excerpt) || p.excerpt.slice(0, 55).includes(':')) f.push('meta description has a colon in its first 55 characters (reads as a keyword stem)');
    const first100 = bodyText.split(/\s+/).slice(0, 100).join(' ');
    if (!has(first100, pk)) f.push('primary not in first 100 words');
    const occ = countOcc(bodyText, pk);
    const dens = (occ * words(pk) * 100) / 1500;
    if (dens > 2.0) f.push(`primary density ${dens.toFixed(2)}% (max 2)`);
    if (dens < 0.6) f.push(`primary density ${dens.toFixed(2)}% (min 0.6)`);
  }

  // secondaries
  if (sec.length < 10 || sec.length > 15) f.push(`${sec.length} secondaries (10-15)`);
  if (new Set(sec.map(kwKey)).size !== sec.length) f.push('duplicate secondary');
  if (sec.some((k) => kwKey(k) === kwKey(pk))) f.push('secondary equals primary');
  const all = bodyText + ' ' + heads.join(' ') + ' ' + (p.faqs ?? []).map((q) => q.q + ' ' + q.a).join(' ');
  const unusedSec = sec.filter((k) => !has(all, k));
  if (unusedSec.length) f.push(`secondary not used: ${unusedSec.join(', ')}`);
  const secWords = sec.reduce((a, k) => a + countOcc(bodyText, k) * words(k), 0);
  const secDens = (secWords * 100) / 1500;
  if (secDens > 3.0) f.push(`secondary density ${secDens.toFixed(2)}% (max 3)`);
  const nonTC: string[] = [];
  let nN = 0, nI = 0;
  for (const k of [pk, ...sec, ...p.tags]) {
    const e = pool.get(kwKey(k));
    if (!e) continue;
    if (e.I && !/[TC]/.test(e.I)) { if (e.I.includes('N')) nN++; else if (e.I.includes('I')) nI++; }
  }
  if (nN > 1) f.push(`${nN} navigational keywords (max 1)`);
  if (nI > 1) f.push(`${nI} informational-only keywords (max 1)`);
  void nonTC;

  // product keyword links
  const pl = p.productLinks ?? [];
  if (pl.length !== 4) f.push(`${pl.length} product keyword links (need 4)`);
  if (new Set(pl.map((l) => l.slug)).size !== pl.length) f.push('duplicate product link');
  for (const l of pl) {
    if (!PRODUCTS.some((x) => x.slug === l.slug)) f.push(`unknown product slug ${l.slug}`);
    if (!sec.some((k) => kwKey(k) === kwKey(l.keyword))) f.push(`product keyword not a secondary: ${l.keyword}`);
    const hay = ' ' + bodyText.toLowerCase().replace(/[^a-z0-9 -]/g, ' ').replace(/\s+/g, ' ') + ' ';
    const needle = ' ' + l.keyword.toLowerCase().replace(/\s+/g, ' ') + ' ';
    if (!hay.includes(needle)) f.push(`product keyword not verbatim in body: ${l.keyword}`);
  }

  // FAQ
  const faqs = p.faqs ?? [];
  if (faqs.length < 5 || faqs.length > 6) f.push(`${faqs.length} FAQs (5-6)`);
  faqs.forEach((q, i) => { const n = words(q.a); if (n < 40 || n > 60) f.push(`FAQ ${i + 1} answer is ${n} words (40-60)`); });
  if (pk && !faqs.some((q) => has(q.q, pk))) f.push('primary not in any FAQ question');
  if (faqs.filter((q) => sec.some((k) => has(q.q + ' ' + q.a, k))).length < 3) f.push('fewer than 3 FAQs carry a secondary');
  if (p.keyTakeaways.length < 3 || p.keyTakeaways.length > 5) f.push(`${p.keyTakeaways.length} key takeaways (3-5)`);

  // tags
  const tags = p.tags;
  if (tags.length !== 10) f.push(`${tags.length} tags (need 10)`);
  if (new Set(tags.map(kwKey)).size !== tags.length) f.push('duplicate tag');
  for (const t of tags) {
    const k = kwKey(t);
    if (kwKey(pk) === k || sec.some((s) => kwKey(s) === k)) f.push(`tag equals own keyword: ${t}`);
    const owner = used.get(k);
    if (owner && owner !== 'blog-' + slug) f.push(`tag already used by ${owner}: ${t}`);
    if (tagOwner.has(k) && tagOwner.get(k) !== slug) f.push(`tag shared with ${tagOwner.get(k)}: ${t}`);
    tagOwner.set(k, slug);
    const e = pool.get(k);
    if (!e) f.push(`tag not in keyword data: ${t}`);
    else {
      if (e.vol < 10) f.push(`tag volume ${e.vol}: ${t}`);
      if (e.kd !== null && (e.kd < 1 || e.kd > 28)) f.push(`tag KD ${e.kd}: ${t}`);
    }
  }
  if (!p.updated) f.push('no updated date');
  if (p.readTime !== '8 min read') f.push(`readTime "${p.readTime}"`);

  if (wantLinks) {
    const refs = (GUIDE_REFERENCES as Record<string, string[]>)[slug] ?? [];
    const urls = refs.map((r) => (REFERENCES as Record<string, { url: string }>)[r]?.url ?? '');
    if (refs.length < 2 || refs.length > 4) f.push(`${refs.length} outbound sources (2-4)`);
    if (!urls.some((u) => /youtube\.com|youtu\.be/.test(u))) f.push('no verified YouTube video among outbound sources');
  }

  if (f.length) failures++;
  console.log(slug.slice(0, 58).padEnd(60), f.length ? 'FAIL: ' + f.join('; ') : `ok  ${wc}w`);
}
const pending = POSTS.length - Object.keys(POST_REFRESH).length;
console.log(`\n${checked} refreshed post(s) checked, ${pending} still pending, ${failures} failing`);
process.exit(failures ? 1 : 0);
void exact;
