// Phase 2 keyword map builder (temporary). Merges the September bank + fresh Semrush rows,
// keeps compliant existing assignments, fills gaps, writes docs/keyword-research/phase2/*.
import fs from 'node:fs';
import { PRODUCTS, CATEGORIES, BRAND_PAGES, isBuggyItem } from '../src/config/site';
import { PRODUCT_DETAILS } from '../src/config/product-details';
import { POSTS } from '../src/config/posts';
import { TAGS } from '../src/config/tags';
import { categoryContent, hubContent } from '../src/config/category-content';
import { DELIVERY_METROS } from '../src/config/delivery';

const D = 'docs/keyword-research/';
const parseCsv = (t: string) => { const rows: string[][] = []; let cur: string[] = [], f = '', q = false; for (let i = 0; i < t.length; i++) { const c = t[i]; if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { cur.push(f); f = ''; } else if (c === '\n') { cur.push(f); rows.push(cur); cur = []; f = ''; } else if (c !== '\r') f += c; } if (f || cur.length) { cur.push(f); rows.push(cur); } return rows; };

// ---------------- pool
type Cand = { kw: string; vol: number; kd: number | null; I: Set<string>; src: string };
const pool = new Map<string, Cand>();
const letters = (s: string) => { const o = new Set<string>(); if (/transac|^t|\bT\b/i.test(s)) o.add('T'); if (/commerc/i.test(s) || /C/.test(s) && s.length <= 4 && !/Commerc/.test(s)) o.add('C'); if (/inform/i.test(s)) o.add('I'); if (/navig/i.test(s)) o.add('N'); return o; };
const normI = (s: string) => { if (/[a-z]{4,}/.test(s)) { const o = new Set<string>(); if (/transac/i.test(s)) o.add('T'); if (/commerc/i.test(s)) o.add('C'); if (/inform/i.test(s)) o.add('I'); if (/navig/i.test(s)) o.add('N'); return o; } return new Set(s.replace(/[^TCIN]/g, '').split('').filter(Boolean)); };
const num = (v: string) => (/K$/.test(v) ? Math.round(parseFloat(v) * 1000) : parseInt(v.replace(/,/g, ''), 10) || 0);
const bank = parseCsv(fs.readFileSync(D + 'phase0/keyword-bank-clean.csv', 'utf8'));
const bh = bank[0];
for (const r of bank.slice(1)) { const o: any = Object.fromEntries(bh.map((k, i) => [k, r[i]])); const kw = o.primary_keyword.toLowerCase().trim(); pool.set(kw, { kw, vol: +o.volume, kd: o.kd === '' ? null : +o.kd, I: normI(o.intent), src: 'bank-2026-09' }); for (const v of (o.variants || '').split(' | ')) { const k = v.toLowerCase().trim(); if (k && !pool.has(k)) pool.set(k, { kw: k, vol: +o.volume, kd: o.kd === '' ? null : +o.kd, I: normI(o.intent), src: 'bank-variant' }); } }
let fresh = 0;
for (const l of fs.readFileSync(D + 'phase2/semrush-raw-2026-11-25.jsonl', 'utf8').trim().split('\n')) { const j = JSON.parse(l); if (!j.rows) continue; for (const r of j.rows) { const kw = r[0].toLowerCase().trim(); const c: Cand = { kw, vol: num(r[2]), kd: /^\d+$/.test(r[3]) ? +r[3] : null, I: normI(r[1]), src: 'semrush-2026-11-25' }; pool.set(kw, c); fresh++; } }
for (const l of fs.readFileSync(D + 'phase2/semrush-2026-11-25-seed01-buggies-for-sale.csv', 'utf8').trim().split('\n').slice(1)) { const [kw, i, v, kd] = l.split(','); pool.set(kw, { kw, vol: +v, kd: /^\d+$/.test(kd) ? +kd : null, I: normI(i), src: 'semrush-2026-11-25' }); }

const NOT_OURS = /(used|second hand|secondhand|hire|rental|auction|gumtree|ebay|facebook|craigslist|repair|servic|accident|crash|insurance|dimension|width|size|esky|dune|beach|\bvw\b|volkswagen|polaris|honda|kubota|stinger|trilite|tri lite|motocaddy|motocaddie|bag ?boy|big max|thomson|qod|caddytek|walkinshaw|axglo|brosnan|condor|triumph|trident|stewart|emc |smoothy|parmaker|drummond|aldi|costco|bunnings|hamilton island|ecar|e car|rome|tour|zeus|powerbug|ford|toyota|stand up|stand on|scooter|ride on|junior|kids|toy|mower|\bnz\b|zealand|uk|ireland|africa)/i;
const ON_TOPIC = /(golf|buggy|buggies|trolley|caddy|cart|club car|clubcar|ezgo|e-z-go|yamaha|\bmgi\b|clicgear|clic gear|rovic|evolution|lvtong|tara|atlas|cushman|powakaddy|robera|madjax|roypow|trojan|lithium|charger|controller|solenoid)/i;
const GENERIC = new Set(['golf', 'buggy', 'buggies', 'buggys', 'buggie', 'cart', 'carts', 'for', 'sale', 'buy', 'australia', 'au', 'the', 'and', 'with', 'in', 'a', 'of', 'to', 'best', 'cheap', 'new', 'electric', 'online', 'near', 'me', 'nsw', 'qld', 'vic', 'sydney', 'brisbane', 'melbourne', 'perth', 'adelaide', 'canberra', 'gold', 'coast', 'victoria', 'tasmania', 'darwin', 'cairns', 'townsville', 'south']);
const toks = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
const meets = (c: Cand | undefined) => !!c && c.vol >= 10 && c.kd !== null && c.kd >= 1 && c.kd <= 28 && !NOT_OURS.test(c.kw) && ON_TOPIC.test(c.kw);
const qual: Cand[] = [...pool.values()].filter(meets);

// ---------------- pages
type Page = { url: string; type: string; name: string; profile: string; primary?: string; secondary: string[]; owner?: string; links?: Record<string, string> };
const pages: Page[] = [];
const catSlug = (raw: string) => CATEGORIES.find((c) => c.rawCategory === raw)?.slug ?? 'all';
for (const p of PRODUCTS) { const d = PRODUCT_DETAILS[p.slug]; const br = BRAND_PAGES.find((b) => p.name.toLowerCase().includes(b.match.toLowerCase())); pages.push({ url: `/shop/${catSlug(p.category)}/${p.slug}/`, type: 'product', name: p.name, profile: `${p.name} ${p.category} ${p.key_specs} ${br?.name ?? ''}`, primary: d?.primaryKeyword, secondary: [...(d?.supportingKeywords ?? [])] }); }
for (const c of CATEGORIES.filter((x) => x.slug !== 'all')) { const cc = categoryContent(c.slug); pages.push({ url: `/shop/${c.slug}/`, type: 'category', name: c.name, profile: `${c.name} ${c.rawCategory ?? ''}`, primary: cc.primaryKeyword, secondary: [...(cc.supportingKeywords ?? [])] }); }
{ const h = hubContent(); pages.push({ url: '/shop/', type: 'shop-hub', name: 'Shop hub', profile: 'golf buggies for sale shop all models', primary: h.primaryKeyword, secondary: [...h.supportingKeywords] }); }
for (const b of BRAND_PAGES) pages.push({ url: `/shop/brand/${b.slug}/`, type: 'brand', name: b.name, profile: `${b.name} ${b.match}`, primary: b.primaryKeyword, secondary: [...b.supportingKeywords] });
for (const t of TAGS) pages.push({ url: `/tag/${t.slug}/`, type: 'tag', name: t.name, profile: `${t.name} ${t.supporting.join(' ')}`, primary: t.primaryKeyword, secondary: [...t.supporting] });
for (const m of DELIVERY_METROS) pages.push({ url: `/delivery/${m.slug}/`, type: 'delivery', name: m.city, profile: `${m.city} ${m.state} golf buggy delivery`, primary: m.primaryKeyword, secondary: [...m.supportingKeywords] });
for (const p of POSTS) pages.push({ url: `/blog/${p.slug}/`, type: 'blog', name: p.title, profile: `${p.title} ${p.category} ${p.tags.join(' ')} ${p.slug.replace(/-/g, ' ')}`, primary: p.primaryKeyword, secondary: [...(p.supportingKeywords ?? [])] });
pages.push({ url: '/', type: 'home', name: 'Home', profile: 'golf buggies for sale australia electric petrol lithium', primary: 'buggies for sale', secondary: [] });
for (const [u, n, pr] of [['/about/', 'About', 'about golf buggies express yatala'], ['/contact/', 'Contact', 'contact golf buggy sales yatala'], ['/faq/', 'FAQ', 'golf buggy questions faq'], ['/returns/', 'Returns', 'returns warranty golf buggy'], ['/pay-in-4/', 'Pay in 4', 'buy golf buggy pay in 4 finance afterpay payment plan'], ['/crypto-payment/', 'Crypto payment', 'buy golf buggy bitcoin crypto'], ['/wholesale/', 'Wholesale', 'golf buggy wholesale fleet commercial'], ['/delivery/', 'Delivery hub', 'golf buggy delivery freight australia'], ['/shop/brand/', 'Brands index', 'golf buggy brands'], ['/tag/', 'Collections index', 'golf buggy collections'], ['/blog/', 'Blog index', 'golf buggy guides']] as const) pages.push({ url: u, type: 'static', name: n, profile: pr, primary: undefined, secondary: [] });

// ---------------- rules
const ALLOWED_PRIMARY: Record<string, (I: Set<string>) => boolean> = {
  product: (I) => I.has('T') || I.has('C'),
  static: (I) => I.has('T') || I.has('C'),
  home: (I) => I.has('T') || I.has('C'),
  'shop-hub': (I) => I.has('N') || I.has('T') || I.has('C'),
  category: (I) => I.has('N') || I.has('T') || I.has('C'),
  brand: (I) => I.has('N') || I.has('T') || I.has('C'),
  tag: (I) => I.has('N') || I.has('T') || I.has('C'),
  delivery: (I) => I.has('N') || I.has('T') || I.has('C'),
  blog: (I) => I.has('T') || I.has('C'),
};
const strictTC = (c: Cand) => [...c.I].every((x) => x === 'T' || x === 'C') && c.I.size > 0;
const rank: Record<string, (c: Cand) => number> = {
  product: (c) => (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  static: (c) => (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  home: (c) => (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  'shop-hub': (c) => (c.I.has('N') ? 3 : 0) + (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  category: (c) => (c.I.has('N') ? 3 : 0) + (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  brand: (c) => (c.I.has('N') ? 3 : 0) + (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  tag: (c) => (c.I.has('N') ? 3 : 0) + (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  delivery: (c) => (c.I.has('N') ? 3 : 0) + (c.I.has('T') ? 2 : 0) + (c.I.has('C') ? 1 : 0),
  blog: (c) => (c.I.has('I') && (c.I.has('T') || c.I.has('C')) ? 4 : 0) + (c.I.has('C') ? 2 : 0) + (c.I.has('T') ? 1 : 0),
};
const sec: Record<string, [number, number]> = { product: [5, 10], category: [5, 10], 'shop-hub': [5, 10], brand: [5, 10], tag: [5, 10], delivery: [5, 10], blog: [10, 15], home: [10, 15], static: [10, 15] };

// relevance: specific token overlap with the page profile
const rel = (kw: string, pg: Page) => {
  const pt = new Set(toks(pg.profile + ' ' + (pg.primary ?? '')));
  const has = (t: string) => pt.has(t) || [...pt].some((p) => p.length > 3 && t.length > 3 && (p.startsWith(t) || t.startsWith(p)));
  let spec = 0, gen = 0, mis = 0;
  for (const t of toks(kw)) { if (GENERIC.has(t)) { gen += 0.15; continue; } if (has(t)) spec += 1; else mis += 1; }
  return { spec, mis, score: spec - 0.9 * mis + gen };
};
const needsSpecific = (pg: Page) => !['home', 'shop-hub'].includes(pg.type);
const STATIC_OVERRIDE: Record<string, string> = { '/pay-in-4/': 'golf cart finance', '/wholesale/': 'fleet golf carts for sale', '/delivery/': 'golf cart delivery', '/shop/brand/': 'golf buggy brands' };
const primaryUse = new Map<string, string>();
const secUse = new Map<string, number>();
const info = (kw: string) => pool.get(kw.toLowerCase());
const flags: string[] = [];
const out: string[] = ['url,page_type,page_name,role,keyword,volume,kd,intent,status,source'];
const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
const status = (c: Cand | undefined) => (!c ? 'no-data' : meets(c) ? 'ok' : c.vol < 10 ? 'below-volume' : c.kd === null ? 'kd-n/a' : c.kd > 28 ? 'kd-over-28' : c.kd < 1 ? 'kd-0' : 'offtopic');

// pass 1: primaries (tier A = meets all criteria; tier B = specific on-topic term outside KD/volume criteria, kept and flagged)
const order = ['home', 'shop-hub', 'category', 'brand', 'tag', 'delivery', 'static', 'blog', 'product'];
const specNeeded = (pg: Page) => (pg.type === 'product' || pg.type === 'blog' ? 2 : 1);
for (const type of order) for (const pg of pages.filter((p) => p.type === type)) {
  const cur = pg.primary?.toLowerCase();
  const okA = (c: Cand | undefined) => meets(c) && ALLOWED_PRIMARY[pg.type](c!.I) && !primaryUse.has(c!.kw);
  if (pg.url === '/') { primaryUse.set('buggies for sale', pg.url); pg.owner = 'owner-set'; continue; }
  const PO: Record<string, string> = { '/tag/chargers/': 'golf buggy charger', '/blog/golf-buggy-chargers-explained-australia/': 'golf buggy charger australia' };
  if (PO[pg.url]) { pg.primary = PO[pg.url]; primaryUse.set(PO[pg.url], pg.url); pg.owner = 'manual (resolves tag vs blog cannibalisation)'; continue; }
  if (pg.type === 'static') { const ov = STATIC_OVERRIDE[pg.url]; if (ov) { pg.primary = ov; primaryUse.set(ov, pg.url); pg.owner = 'manual (utility page: best available demand term)'; } else { pg.owner = 'NO-DEMAND: no qualifying keyword (branded or utility page)'; flags.push(pg.url + ' primary: no qualifying keyword with search demand'); } continue; }
  const curC = cur ? info(cur) : undefined;
  const okRel = !!curC && curC.vol >= 10 && (curC.kd === null || (curC.kd >= 1 && curC.kd <= 28)) && !NOT_OURS.test(cur!) && ON_TOPIC.test(cur!) && ALLOWED_PRIMARY[pg.type](curC.I) && !primaryUse.has(cur!);
  if (cur && okA(curC)) { primaryUse.set(cur, pg.url); pg.owner = 'kept'; continue; }
  if (cur && okRel) { primaryUse.set(cur, pg.url); pg.owner = 'kept (KD not scored by Semrush; volume ok)'; flags.push(pg.url + ' primary KD-unscored: "' + cur + '" vol ' + curC!.vol); continue; }
  const curUsable = !!cur && !primaryUse.has(cur) && ON_TOPIC.test(cur) && !NOT_OURS.test(cur) && (!curC || curC.kd === null || curC.vol < 10) ;
  let best: { c: Cand; s: number } | null = null;
  for (const c of qual) {
    if (!okA(c)) continue;
    const r = rel(c.kw, pg);
    if (needsSpecific(pg) && (r.spec < specNeeded(pg) || r.mis > 0)) continue;
    const sc = r.score * 3 + rank[pg.type](c) + Math.log10(c.vol + 1) * 1.2 - c.kd! / 40;
    if (!best || sc > best.s) best = { c, s: sc };
  }
  const keepsCore = (curKw: string, cand: string) => { const ct = toks(curKw).filter((t) => !GENERIC.has(t)); const ks = new Set(toks(cand)); const n = ct.length; return n === 0 || ct.filter((t) => ks.has(t)).length >= (n <= 2 ? n : n - 1); };
  // replace a tier-B current term only when a qualifying term is at least as specific
  const curRel = cur ? rel(cur, pg) : { spec: 0, mis: 0, score: 0 };
  if (best && !curUsable) { primaryUse.set(best.c.kw, pg.url); pg.primary = best.c.kw; pg.owner = cur ? `replaced (was "${cur}": ${status(curC)})` : 'new'; }
  else if (curUsable) { primaryUse.set(cur!, pg.url); pg.owner = `TIER-B kept (${status(curC)})`; flags.push(`${pg.url} primary tier-B: "${cur}" is ${status(curC)}`); }
  else { pg.owner = cur ? `FLAG: kept "${cur}" (${status(curC)})` : 'FLAG: no keyword'; flags.push(`${pg.url} primary: ${pg.owner}`); if (cur) primaryUse.set(cur, pg.url); }
}

// pass 2: secondaries (distinct queries only: no word-order/plural permutations, no junk variants)
const skel = (kw: string) => toks(kw).map((t) => t.replace(/(ies)$/, 'y').replace(/s$/, '')).filter((t) => !['a', 'the', 'in', 'of', 'for', 'to'].includes(t)).sort().join(' ');
const junk = (kw: string) => /[.+]/.test(kw.replace(/\d\.\d/g, '')) || /\b(\w+) \1\b/.test(kw) || kw.length < 6;
const typeOkSec = (pg: Page, c: Cand) => (['product', 'category', 'brand', 'tag', 'delivery', 'shop-hub'].includes(pg.type) ? strictTC(c) : c.I.has('T') || c.I.has('C') || c.I.has('N') || c.I.has('I'));
for (const type of order) for (const pg of pages.filter((p) => p.type === type)) {
  if (pg.type === 'static') { pg.secondary = []; flags.push(pg.url + ' secondary: not auto-assigned (utility page, little search demand); decide in Phase 6'); continue; }
  const [lo, hi] = sec[pg.type];
  const chosen: Cand[] = [];
  const keys = new Set<string>([skel(pg.primary ?? '')]);
  const add = (c: Cand) => { const k = skel(c.kw); if (keys.has(k) || junk(c.kw) || chosen.length >= hi) return false; keys.add(k); chosen.push(c); return true; };
  for (const s2 of pg.secondary) { const c = info(s2); if (c && meets(c) && typeOkSec(pg, c) && (secUse.get(c.kw) ?? 0) < 2 && (!needsSpecific(pg) || rel(c.kw, pg).mis <= 1)) add(c); }
  const cands = qual.filter((c) => typeOkSec(pg, c) && (secUse.get(c.kw) ?? 0) < 2).map((c) => { const r = rel(c.kw, pg); return { c, r, s: r.score * 3 + Math.log10(c.vol + 1) - c.kd! / 60 }; }).filter((x) => (needsSpecific(pg) ? x.r.spec >= 1 && x.r.mis <= 1 : x.r.score > 0.2)).sort((a, b) => b.s - a.s);
  for (const x of cands) { if (chosen.length >= lo) break; add(x.c); }
  if (['blog', 'home'].includes(pg.type)) {
    for (const L of ['N', 'I'] as const) {
      for (const x of qual.filter((c) => c.I.has(L)).map((c) => ({ c, r: rel(c.kw, pg) })).filter((x) => x.r.spec >= 1 && x.r.mis <= 1).sort((a, b) => b.r.score + Math.log10(b.c.vol) - (a.r.score + Math.log10(a.c.vol)))) { if (chosen.filter((c) => c.I.has(L)).length >= 2) break; add(x.c); }
    }
  }
  if (chosen.length < lo) {
    const b: string[] = [];
    for (const s2 of pg.secondary) { const k = s2.toLowerCase(); if (chosen.length >= lo) break; if (!ON_TOPIC.test(k) || NOT_OURS.test(k) || primaryUse.has(k)) continue; const c = info(k) ?? { kw: k, vol: 0, kd: null, I: new Set(['C']), src: 'existing' }; if (needsSpecific(pg) && rel(k, pg).mis > 1) continue; if (add(c)) b.push(k); }
    if (b.length) flags.push(pg.url + ' secondary tier-B (' + b.length + '): ' + b.join('; '));
  }
  if (chosen.length < lo) flags.push(pg.url + ' secondary: only ' + chosen.length + ' (need ' + lo + '+)');
  pg.secondary = chosen.map((c) => c.kw);
  for (const c of chosen) secUse.set(c.kw, (secUse.get(c.kw) ?? 0) + 1);
}

// blog: 4 product primary keywords (as secondaries) with product link
const prodPages = pages.filter((p) => p.type === 'product' && p.primary);
for (const pg of pages.filter((p) => p.type === 'blog')) {
  const post = POSTS.find((x) => `/blog/${x.slug}/` === pg.url)!;
  const pt = new Set(toks(`${post.title} ${post.slug} ${post.tags.join(' ')} ${post.primaryKeyword ?? ''} ${post.relatedProductSlug ?? ''}`));
  const scored = prodPages.map((pp) => { const nt = toks(pp.name + ' ' + pp.primary + ' ' + pp.url); let s = 0; for (const t of nt) if (!GENERIC.has(t) && pt.has(t)) s += 1; if (post.relatedProductSlug && pp.url.includes(post.relatedProductSlug)) s += 5; if (post.relatedProductCategory && pp.url.includes(`/${post.relatedProductCategory}/`)) s += 1.5; return { pp, s }; }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 4);
  pg.links = {};
  for (const x of scored) pg.links[x.pp.primary!] = x.pp.url;
  if (scored.length < 4) flags.push(`${pg.url} product-links: only ${scored.length}/4 relevant product primaries`);
}

// ---------------- write
for (const pg of pages) {
  const c = pg.primary ? info(pg.primary) : undefined;
  out.push([pg.url, pg.type, q(pg.name), 'primary', q(pg.primary ?? ''), c?.vol ?? '', c?.kd ?? '', c ? [...c.I].join('') : '', pg.primary ? (pg.url === '/' ? 'owner-set' : status(c)) + ' | ' + pg.owner : 'NONE', c?.src ?? ''].join(','));
  for (const s of pg.secondary) { const k = info(s); out.push([pg.url, pg.type, q(pg.name), pg.links && pg.links[s] ? 'secondary+productlink' : 'secondary', q(s), k?.vol ?? '', k?.kd ?? '', k ? [...k.I].join('') : '', status(k), k?.src ?? ''].join(',')); }
  if (pg.links) for (const [kw, url] of Object.entries(pg.links)) if (!pg.secondary.includes(kw)) out.push([pg.url, pg.type, q(pg.name), 'secondary+productlink', q(kw), info(kw)?.vol ?? '', info(kw)?.kd ?? '', '', 'product-primary', q(url)].join(','));
}
fs.mkdirSync(D + 'phase2', { recursive: true });
fs.writeFileSync(D + 'phase2/keyword-map-2026-11-25.csv', out.join('\n'));
const by: Record<string, number> = {};
for (const pg of pages) { const k = pg.type; by[k] = (by[k] || 0) + 1; }
const kept = pages.filter((p) => p.owner === 'kept').length, repl = pages.filter((p) => p.owner?.startsWith('replaced')).length, nw = pages.filter((p) => p.owner === 'new').length, fl = pages.filter((p) => p.owner?.startsWith('FLAG')).length;
console.log('pages', pages.length, JSON.stringify(by), '| pool', pool.size, 'qualifying', qual.length, 'fresh rows', fresh);
console.log('primaries kept', kept, 'replaced', repl, 'new', nw, 'flagged', fl);
const secC = pages.map((p) => p.secondary.length); console.log('secondary counts: pages meeting min', pages.filter((p) => p.secondary.length >= sec[p.type][0]).length, '/', pages.length);
fs.writeFileSync(D + 'phase2/map-flags-2026-11-25.txt', flags.join('\n'));
console.log('flags', flags.length);
const dupP = [...primaryUse.entries()]; const seen = new Map<string, string[]>(); for (const [k, u] of dupP) seen.set(k, [...(seen.get(k) ?? []), u]);
console.log('primary keyword unique:', primaryUse.size, 'of', pages.filter((p) => p.primary).length);
