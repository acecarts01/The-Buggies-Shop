// Checks every hand-written product (src/config/product-copy.ts) against the SEO ruleset:
//   bun scripts/product-copy-check.ts          # table + exits 1 on any failure
// Rules: exactly 400 words (intro + section bodies), primary keyword in the first 100 words,
// H1 and title, density (primary <= 2%, secondaries combined <= 3%), title <= 62 chars with a
// buy-intent word and different from the H1, meta description 110-160 chars with the primary
// keyword and no "keyword:" prefix, FAQs include the primary keyword and 2+ secondaries.
import { PRODUCT_COPY, descriptionParts } from '../src/config/product-copy';
import { PRODUCTS, BRAND_PAGES, CATEGORIES } from '../src/config/site';
import { TAGS } from '../src/config/tags';
import { categoryContent } from '../src/config/category-content';

const TARGET = 400;
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const count = (text: string, kw: string) => (text.toLowerCase().match(new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
let bad = 0;
// primaries used by pages that are not products must stay unique; secondaries may be reused at most twice across products
const otherPrimaries = new Set<string>([...BRAND_PAGES.map((b) => b.primaryKeyword), ...CATEGORIES.map((c) => categoryContent(c.slug).primaryKeyword ?? ''), ...TAGS.map((t) => t.primaryKeyword)].filter(Boolean).map((k) => k.toLowerCase()));
const primaryOwners = new Map<string, string[]>();
const secUses = new Map<string, number>();
for (const [sl, c] of Object.entries(PRODUCT_COPY)) { const k = c.primaryKeyword.toLowerCase(); primaryOwners.set(k, [...(primaryOwners.get(k) ?? []), sl]); for (const x of c.supportingKeywords) secUses.set(x.toLowerCase(), (secUses.get(x.toLowerCase()) ?? 0) + 1); }
const rows: string[] = [];
for (const [slug, c] of Object.entries(PRODUCT_COPY)) {
  const fails: string[] = [];
  if (!PRODUCTS.some((p) => p.slug === slug)) fails.push('unknown slug');
  const parts = descriptionParts(slug);
  const body = [parts.intro, ...parts.sections.map((s) => s.body)].join(' ');
  const w = words(body);
  if (w !== TARGET) fails.push(`${w} words (need ${TARGET})`);
  const pk = c.primaryKeyword.toLowerCase();
  if (!c.intro.toLowerCase().split(/\s+/).slice(0, 100).join(' ').includes(pk)) fails.push('primary keyword not in first 100 words');
  // H1 keeps the Australian word "buggy": a primary written with "golf cart(s)" matches its buggy form (approved exception)
  const h1l = c.h1.toLowerCase();
  const h1ok = h1l.includes(pk) || h1l.includes(pk.replace(/\bcarts?\b/g, 'buggy')) || h1l.includes(pk.replace(/\bcarts?\b/g, 'buggies'));
  if (!h1ok) fails.push('primary keyword (or its buggy form) not in H1');
  if ((primaryOwners.get(pk) ?? []).length > 1) fails.push('primary keyword also used by ' + primaryOwners.get(pk)!.filter((x) => x !== slug).join(', '));
  if (otherPrimaries.has(pk)) fails.push('primary keyword is already a brand, category or tag primary');
  const overused = c.supportingKeywords.filter((x) => (secUses.get(x.toLowerCase()) ?? 0) > 2);
  if (overused.length) fails.push('secondary used on more than 2 products: ' + overused.join(', '));
  if (parts.sections.length < 4) fails.push('fewer than 4 sections');
  if (!c.seoTitle.toLowerCase().includes(pk)) fails.push('primary keyword not in title');
  else if (c.seoTitle.toLowerCase().indexOf(pk) > 12) fails.push('primary keyword not near the start of the title');
  if (c.seoTitle.length > 62) fails.push(`title ${c.seoTitle.length} chars`);
  if (c.seoTitle === c.h1) fails.push('title equals H1');
  if (!/\b(buy|shop|order|get|save|official)\b/i.test(c.seoTitle + ' ' + c.seoDescription)) fails.push('no buy-intent word in title or description');
  if (c.seoDescription.length < 110 || c.seoDescription.length > 160) fails.push(`description ${c.seoDescription.length} chars`);
  if (!c.seoDescription.toLowerCase().includes(pk) && !c.seoDescription.toLowerCase().includes(pk.replace(/ for sale$/, ''))) fails.push('primary keyword not in description');
  if (/^[A-Z][a-z0-9+\- ]{3,50}: /.test(c.seoDescription)) fails.push('description opens with a keyword stem');
  const pkWords = pk.split(' ').length;
  const pd = (count(body, pk) * pkWords * 100) / w;
  if (pd > 2) fails.push(`primary density ${pd.toFixed(2)}% (max 2)`);
  const sd = (c.supportingKeywords.reduce((n, k) => n + count(body, k) * k.split(' ').length, 0) * 100) / w;
  if (sd > 3) fails.push(`secondary density ${sd.toFixed(2)}% (max 3)`);
  const missing = c.supportingKeywords.filter((k) => count(body + ' ' + parts.sections.map((s) => s.heading).join(' ') + ' ' + c.faqs.map((f) => f.q + ' ' + f.a).join(' '), k) === 0);
  if (missing.length) fails.push('secondary not used anywhere: ' + missing.join(', '));
  const faqText = c.faqs.map((f) => f.q + ' ' + f.a).join(' ').toLowerCase();
  if (!faqText.includes(pk)) fails.push('primary keyword not in FAQ');
  if (c.supportingKeywords.filter((k) => faqText.includes(k.toLowerCase())).length < 2) fails.push('fewer than 2 secondaries in FAQ');
  if (c.faqs.length < 5) fails.push('fewer than 5 FAQs');
  if (c.supportingKeywords.length < 5 || c.supportingKeywords.length > 10) fails.push('secondary keyword count outside 5-10');
  const inHeadings = c.supportingKeywords.filter((k) => parts.sections.some((s) => s.heading.toLowerCase().includes(k.toLowerCase()))).length;
  if (inHeadings < 1) fails.push('no secondary keyword in a section heading');
  rows.push(`${slug.padEnd(42)} ${String(w).padStart(4)}w  primary ${count(body, pk)}x (${pd.toFixed(2)}%)  secondary ${sd.toFixed(2)}%  H3 w/ kw ${inHeadings}  ${fails.length ? 'FAIL: ' + fails.join('; ') : 'ok'}`);
  bad += fails.length;
}
console.log(rows.join('\n'));
console.log(bad ? `\n${bad} problem(s)` : `\nall ${rows.length} product pages pass`);
process.exit(bad ? 1 : 0);
