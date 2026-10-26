#!/usr/bin/env node
// Site validation: crawls every sitemap URL and checks what Semrush, Search
// Console and a buyer would trip over. Run it after every batch of changes:
//
//   node scripts/site-validate.mjs                      # live site
//   node scripts/site-validate.mjs http://localhost:3100  # a local `next start`
//
// Exits non-zero on any FAIL. WARN lines are advisory.
//
// Checks: status codes, self-canonicals, title and description length and
// duplicates, one H1, JSON-LD parses and carries no invalid Organization
// properties, keyword-stem meta descriptions, internal links (broken,
// redirecting), inbound-link counts (orphans), sitemap parity, redirect chains
// (legacy shop URLs, http/apex, category-less products), robots.txt grouping.

const LIVE = 'https://www.golfbuggiesexpress.com.au';
const BASE = (process.argv[2] || LIVE).replace(/\/$/, '');
const fails = [];
const warns = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const local = (u) => u.replace(/^https:\/\/www\.golfbuggiesexpress\.com\.au/, BASE);
const path = (u) => u.replace(BASE, '').replace(LIVE, '') || '/';

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
}
async function get(u, opts = {}) {
  for (let t = 0; t < 3; t++) {
    try { return await fetch(u, { redirect: 'manual', ...opts }); } catch (e) { if (t === 2) throw e; await new Promise((r) => setTimeout(r, 800)); }
  }
}

// ---- sitemap
const index = await (await get(`${BASE}/sitemap.xml`)).text();
const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => local(m[1]));
const urls = [];
for (const c of children) {
  const x = await (await get(c)).text();
  urls.push(...[...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => local(m[1])));
}
const sitemap = new Set(urls);
if (urls.length !== sitemap.size) fail(`sitemap lists ${urls.length - sitemap.size} duplicate URLs`);

// ---- pages
const pages = new Map();
const inbound = new Map();
const internalTargets = new Set();
await pool(urls, 8, async (u) => {
  const r = await get(u);
  const t = r.status === 200 ? await r.text() : '';
  const g = (re) => (t.match(re) || [])[1] || '';
  const p = {
    status: r.status,
    title: decode(g(/<title>([^<]*)<\/title>/)),
    desc: decode(g(/<meta name="description" content="([^"]*)"/)),
    canon: g(/<link rel="canonical" href="([^"]*)"/),
    robots: g(/<meta name="robots" content="([^"]*)"/),
    h1: (t.match(/<h1[\s>]/g) || []).length,
    h1text: decode(g(/<h1[^>]*>([\s\S]*?)<\/h1>/).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()),
    hasQuoteCta: /Request Quote \/ Tax Invoice/.test(t),
    words: t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
    ld: [...t.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]),
  };
  pages.set(u, p);
  for (const m of t.matchAll(/<a [^>]*href="([^"#]+)"/g)) {
    let h = decode(m[1]);
    if (/^(mailto:|tel:|javascript:)/.test(h)) continue;
    if (h.startsWith('/')) h = BASE + h;
    if (!h.startsWith(BASE)) continue;
    h = h.split('?')[0];
    if (/\.(txt|xml|png|jpg|webp|ico|json)$/.test(h)) continue;
    internalTargets.add(h);
    if (!inbound.has(h)) inbound.set(h, new Set());
    inbound.get(h).add(u);
  }
});

const titles = new Map();
const descs = new Map();
for (const [u, p] of pages) {
  const id = path(u);
  if (p.status !== 200) { fail(`${id}: status ${p.status}`); continue; }
  if (local(p.canon) !== u) fail(`${id}: canonical is ${p.canon || 'missing'}`);
  if (/noindex/.test(p.robots)) fail(`${id}: noindex but listed in sitemap`);
  if (p.h1 !== 1) fail(`${id}: ${p.h1} <h1>`);
  if (!p.title || p.title.length > 62) fail(`${id}: title ${p.title.length} chars`);
  if (p.desc.length < 110 || p.desc.length > 160) fail(`${id}: description ${p.desc.length} chars`);
  if (p.h1text && p.h1text === p.title) fail(`${id}: title is identical to the H1`);
  if (p.words < 300) warn(`${id}: only ${p.words} words`);
  if (titles.has(p.title)) fail(`${id}: duplicate title with ${path(titles.get(p.title))}`); else titles.set(p.title, u);
  if (descs.has(p.desc)) fail(`${id}: duplicate description with ${path(descs.get(p.desc))}`); else descs.set(p.desc, u);
  // "keyword stem: " prefixes read as spam in search results.
  if (/^[A-Z][a-z0-9+\- ]{3,50}: /.test(p.desc) && /\/(shop\/[^/]+\/[^/]+|blog\/[^/]+)\/$/.test(id) && !id.startsWith('/shop/brand/')) fail(`${id}: description opens with a keyword stem ("${p.desc.slice(0, 40)}")`);
  if (/Finance in 4|Pay in 4/.test(p.desc) && /\/shop\/[^/]+\/[^/]+\/$/.test(id)) {
    const price = Number((p.desc.match(/\$([\d,]+)/) || [])[1]?.replace(/,/g, ''));
    if (price && price <= 3000) fail(`${id}: description promises Pay in 4 on a $${price} item`);
  }
  const isProduct = /\/shop\/[^/]+\/[^/]+\/$/.test(id) && !id.startsWith('/shop/brand/');
  let returnPolicy = false;
  for (const raw of p.ld) {
    let j;
    try { j = JSON.parse(raw); } catch { fail(`${id}: invalid JSON-LD`); continue; }
    for (const n of j['@graph'] || [j]) {
      const types = [].concat(n['@type'] || []);
      if (types.includes('Product')) { const pol = [].concat(n.offers || [])[0]?.hasMerchantReturnPolicy; if (pol?.applicableCountry === 'AU' && pol.returnPolicyCategory) returnPolicy = true; }
      if (types.some((t) => ['Organization', 'LocalBusiness', 'Store'].includes(t)) && 'numberOfItems' in n) fail(`${id}: numberOfItems on ${types.join('/')} (not a valid property)`);
    }
  }
  if (isProduct && !p.hasQuoteCta) fail(`${id}: no "Request Quote / Tax Invoice" button`);
  if (isProduct && !returnPolicy) fail(`${id}: Product offer has no hasMerchantReturnPolicy`);
  const inb = inbound.get(u)?.size ?? 0;
  if (id !== '/' && inb === 0) fail(`${id}: orphan (no internal links in)`);
  else if (id !== '/' && inb < 2) fail(`${id}: only ${inb} internal link in`);
}

// ---- internal links resolve without redirects
const broken = [];
await pool([...internalTargets], 8, async (u) => {
  const r = await get(u);
  if (r.status >= 400) broken.push(`${path(u)} -> ${r.status}`);
  else if (r.status >= 300) broken.push(`${path(u)} redirects (${r.status}) -> ${r.headers.get('location')}`);
});
broken.forEach((b) => fail(`internal link: ${b}`));
for (const u of internalTargets) if (!sitemap.has(u) && !sitemap.has(u + '/') && !/\/_next\//.test(u)) warn(`linked but not in sitemap: ${path(u)}`);

// ---- redirects land in one hop on a 200
const chains = [
  '/shop/batteries-chargers-parts/',
  '/shop/batteries-chargers-parts/heavy-duty-tow-hitch-ball-assembly/',
  '/shop/atlas-4-seater-heavy-duty-lifted-350a/',
  '/shop/atlas-4-passenger-lifted-lithium-buggy/',
];
for (const c of chains) {
  let hops = 0, cur = BASE + c, r;
  while (hops < 5) { r = await get(cur); if (r.status >= 300 && r.status < 400) { cur = new URL(r.headers.get('location'), cur).toString(); hops++; } else break; }
  if (r.status !== 200) fail(`redirect ${c}: ends ${r.status}`);
  else if (hops !== 1) fail(`redirect ${c}: ${hops} hops`);
}
if (BASE === LIVE) {
  for (const v of ['http://www.golfbuggiesexpress.com.au/', 'https://golfbuggiesexpress.com.au/']) {
    const r = await get(v);
    if (r.status !== 308 && r.status !== 301) fail(`${v}: ${r.status}`);
  }
  const apex = await get('http://golfbuggiesexpress.com.au/');
  if (apex.status >= 300 && apex.status < 400) { const r2 = await get(apex.headers.get('location')); if (r2.status >= 300 && r2.status < 400) warn('http://golfbuggiesexpress.com.au/ takes 2 redirects (Vercel domain setting)'); }
}
const nf = await get(`${BASE}/not-a-real-page-xyz/`);
if (nf.status !== 404) fail(`unknown URL returns ${nf.status}, not 404`);

// ---- robots.txt
const robots = await (await get(`${BASE}/robots.txt`)).text();
const star = robots.split(/\n\s*\n/).find((b) => /User-agent:\s*\*/.test(b)) || '';
if (!/Content-Signal:/.test(star)) fail('robots.txt: Content-Signal is not inside the User-agent: * group');
if (!/Sitemap:\s*\S+/.test(robots)) fail('robots.txt: no Sitemap line');
for (const line of robots.split('\n')) {
  const l = line.trim();
  if (l && !l.startsWith('#') && !/^(User-agent|Allow|Disallow|Sitemap|Content-Signal|Crawl-delay):/i.test(l)) fail(`robots.txt: unknown line "${l}"`);
}
if (!pages.has(BASE + '/returns/')) fail('/returns/ is not in the sitemap');

// ---- report
console.log(`Validated ${pages.size} pages on ${BASE}`);
console.log(`  sitemap URLs ${urls.length}, internal link targets ${internalTargets.size}`);
warns.slice(0, 20).forEach((w) => console.log('  WARN ' + w));
if (warns.length > 20) console.log(`  ... ${warns.length - 20} more warnings`);
if (fails.length) {
  console.log(`\nFAIL (${fails.length})`);
  const kinds = {};
  for (const f of fails) {
    const k = f.replace(/^[^:]*: /, '').replace(/\(.*$/, '').replace(/[0-9,]+/g, 'N').trim().slice(0, 70);
    kinds[k] = (kinds[k] || 0) + 1;
  }
  console.log('  by check:');
  Object.entries(kinds).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log('    ' + String(n).padStart(4) + '  ' + k));
  console.log('  first failures:');
  fails.slice(0, 12).forEach((f) => console.log('  - ' + f));

  process.exit(1);
}
console.log('\nPASS: all checks clean');
