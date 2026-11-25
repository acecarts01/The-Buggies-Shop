// Shared keyword data for the Phase 6 blog tooling: the September bank + fresh Semrush rows
// (volume, KD, intent) and the set of keywords already used by any page on the site.
import fs from 'node:fs';
import { PRODUCTS, CATEGORIES, BRAND_PAGES } from '../../src/config/site';
import { PRODUCT_DETAILS } from '../../src/config/product-details';
import { POSTS } from '../../src/config/posts';
import { TAGS } from '../../src/config/tags';
import { categoryContent, hubContent } from '../../src/config/category-content';
import { DELIVERY_METROS } from '../../src/config/delivery';

const D = 'docs/keyword-research/';

export interface KW { kw: string; vol: number; kd: number | null; I: string }

const parse = (t: string) => {
  const o: string[][] = [];
  let cur: string[] = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { cur.push(f); f = ''; }
    else if (c === '\n') { cur.push(f); o.push(cur); cur = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  return o;
};

/** Order- and plural-insensitive key, so "golf buggy battery" and "golf buggy batteries" count as one keyword. */
export const kwKey = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/(ies|s)$/, (m) => (m === 'ies' ? 'y' : ''))).sort().join(' ');

const intentOf = (s: string) => {
  const set = new Set<string>();
  for (const part of s.toLowerCase().split(/[^a-z/]+/).filter(Boolean)) {
    if (part === 'n/a') continue;
    if (part === 'transactional') set.add('T');
    else if (part === 'commercial') set.add('C');
    else if (part === 'informational') set.add('I');
    else if (part === 'navigational') set.add('N');
    else if (/^[tcin]+$/.test(part)) for (const ch of part) set.add(ch.toUpperCase());
  }
  return [...set].sort().join('');
};

let poolCache: Map<string, KW> | undefined;
export function loadPool(): Map<string, KW> {
  if (poolCache) return poolCache;
  const pool = new Map<string, KW>();
  const bank = parse(fs.readFileSync(D + 'phase0/keyword-bank-clean.csv', 'utf8'));
  const bh = bank[0];
  for (const r of bank.slice(1)) {
    const o: any = Object.fromEntries(bh.map((k, i) => [k, r[i]]));
    const kd = o.kd === '' ? null : +o.kd;
    for (const k of [o.primary_keyword, ...(o.variants || '').split(' | ')]) {
      const kw = String(k).toLowerCase().trim();
      if (kw) pool.set(kwKey(kw), { kw, vol: +o.volume, kd, I: intentOf(o.intent) });
    }
  }
  for (const l of fs.readFileSync(D + 'phase2/semrush-raw-2026-11-25.jsonl', 'utf8').trim().split('\n')) {
    const j = JSON.parse(l);
    if (!j.rows) continue;
    for (const r of j.rows) {
      const v = /K$/.test(r[2]) ? parseFloat(r[2]) * 1000 : +r[2];
      const kd = /^\d+$/.test(r[3]) ? +r[3] : null;
      const old = pool.get(kwKey(r[0]));
      pool.set(kwKey(r[0]), { kw: String(r[0]).toLowerCase(), vol: v, kd: kd ?? old?.kd ?? null, I: intentOf(r[1]) || old?.I || '' });
    }
  }
  poolCache = pool;
  return pool;
}

/** Every keyword currently assigned to a page, tagged with the owning URL (blog posts excluded when `exceptSlug` is given). */
export function usedKeywords(exceptSlug?: string): Map<string, string> {
  const used = new Map<string, string>();
  const add = (kw: string | undefined, owner: string) => { if (kw && !used.has(kwKey(kw))) used.set(kwKey(kw), owner); };
  for (const p of PRODUCTS) { const d = PRODUCT_DETAILS[p.slug]; add(d?.primaryKeyword, p.slug); (d?.supportingKeywords ?? []).forEach((k) => add(k, p.slug)); }
  for (const c of CATEGORIES) { if (c.slug === 'all') continue; const cc: any = categoryContent(c.slug); add(cc.primaryKeyword, c.slug); (cc.supportingKeywords ?? []).forEach((k: string) => add(k, c.slug)); }
  { const h = hubContent(); add(h.primaryKeyword, 'shop'); h.supportingKeywords.forEach((k) => add(k, 'shop')); }
  for (const b of BRAND_PAGES) { add(b.primaryKeyword, 'brand-' + b.slug); b.supportingKeywords.forEach((k) => add(k, 'brand-' + b.slug)); }
  for (const t of TAGS) { add(t.primaryKeyword, 'tag-' + t.slug); t.supporting.forEach((k) => add(k, 'tag-' + t.slug)); }
  for (const m of DELIVERY_METROS) { add(m.primaryKeyword, 'delivery-' + m.slug); m.supportingKeywords.forEach((k) => add(k, 'delivery-' + m.slug)); }
  add('buggies for sale', 'home');
  for (const p of POSTS) {
    if (p.slug === exceptSlug) continue;
    add(p.primaryKeyword, 'blog-' + p.slug);
    (p.supportingKeywords ?? []).forEach((k) => add(k, 'blog-' + p.slug));
    // Only refreshed posts carry real keyword tags; legacy labels are replaced in Phase 6.
    if (p.updated) p.tags.forEach((k) => add(k, 'blog-' + p.slug));
  }
  return used;
}

export const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
