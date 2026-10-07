// node docs/keyword-research/tools/make-autolinks.mjs
// Builds src/config/autolink-rules.json from final/keyword-to-page-map.csv:
// "anchor phrase -> page" pairs, highest search volume first, for the contextual
// internal-link engine in lib/autolink.ts. Re-run after the keyword map changes.
import fs from 'node:fs';

const ROOT = new URL('../../../', import.meta.url);
const csv = fs.readFileSync(new URL('docs/keyword-research/final/keyword-to-page-map.csv', ROOT), 'utf8').replace(/\r/g, '');

function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; } else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const [head, ...data] = parseCsv(csv);
const col = Object.fromEntries(head.map((h, i) => [h, i]));

// Target priority: money pages first, guides last. Home is never a link target.
const PRIORITY = { category: 0, 'shop hub': 0, 'delivery city': 1, brand: 1, product: 2, guide: 3 };
const CITY = /(brisbane|sydney|melbourne|perth|adelaide|gold coast|canberra|qld|queensland|nsw|victoria|south australia|western australia|wa\b|sa\b|sunshine coast|newcastle|tasmania|darwin|cairns)/i;
const NOISE = /(near me|review|reviews|dealer|dealers|manual|parts|used|second hand|cheap|how to|vs\b|what is|australia$|price range|consumer reports|cost)/i;

const best = new Map(); // phrase -> rule
for (const r of data) {
  if (!r[col.url] || r[col.url] === '/') continue;
  const type = r[col.page_type]; if (!(type in PRIORITY)) continue;
  const phrase = r[col.keyword].toLowerCase().trim();
  const words = phrase.split(/\s+/);
  const vol = +r[col.monthly_volume] || 0;
  const isPrimary = r[col.role] === 'primary';
  if (words.length < 2 || words.length > 6) continue;
  if (words.length === 2 && type !== 'brand') continue;      // too generic to hijack a sentence
  if (NOISE.test(phrase) && !(type === 'category' && /parts/.test(phrase))) continue;
  if (CITY.test(phrase) && type !== 'delivery city') continue; // city phrases only point at that city's page
  if (/\b(19|20)\d\d\b/.test(phrase)) continue;
  if (vol < 10 && !isPrimary) continue;
  if (/&|\bgolf cars?\b|2nd hand|clicgear|motocaddy/.test(phrase)) continue; // awkward or competitor anchors
  // sales terms belong to money pages; the used/second-hand guides are not promoted
  if (type === 'guide' && (/for sale/.test(phrase) || /used|second-hand|reconditioned|trade/.test(r[col.url]))) continue;
  const rule = { p: phrase, h: r[col.url], v: vol, t: type, k: PRIORITY[type] };
  const prev = best.get(phrase);
  if (!prev || rule.k < prev.k || (rule.k === prev.k && rule.v > prev.v)) best.set(phrase, rule);
}
// Product names are the natural anchor for a product.
const configText = fs.readFileSync(new URL('src/config/site.ts', ROOT), 'utf8');
for (const m of configText.matchAll(/slug: '([a-z0-9-]+)',\n\s+name: '([^']+)',\n\s+category: '([^']+)'/g)) {
  const [, slug, name, category] = m;
  const cat = { 'Luxury & High-Demand 4-Seaters': 'luxury-4-seater', 'Traditional 2-Seater Electric Golf Buggies': 'traditional-2-seater', "Off-Road, Lifted & 4x4 Buggies": 'off-road-4x4', 'Commercial & Farm Utility Buggies': 'commercial-utility', 'Mechanical & Petrol Buggies': 'mechanical-petrol', 'Motorised Walk-Behind Golf Buggies': 'walk-behind-buggies', 'Golf Buggy Batteries & Chargers': 'batteries-chargers', 'Golf Buggy Accessories & Spare Parts': 'accessories-spare-parts' }[category];
  if (!cat) continue;
  const phrase = name.toLowerCase();
  if (phrase.split(/\s+/).length >= 3) best.set(phrase, { p: phrase, h: `/shop/${cat}/${slug}/`, v: 1000, t: 'product', k: 2 });
}
// Natural-prose anchors the keyword map cannot supply: guides rarely repeat a full
// target keyword, but they constantly say a brand, a seat count, a city or a
// model short name. Each links to the one page that owns that idea.
const manual = [
  // brands (first mention in a page links to the brand page)
  ...[['club car', 'club-car'], ['mgi', 'mgi'], ['e-z-go', 'e-z-go'], ['ezgo', 'e-z-go'], ['yamaha', 'yamaha'], ['powakaddy', 'powakaddy'], ['lvtong', 'lvtong'], ['cushman', 'cushman'], ['robera', 'robera']].map(([p, s]) => ({ p, h: `/shop/brand/${s}/`, v: 900, t: 'brand', k: 1 })),
  // cities
  ...[['gold coast', 'gold-coast'], ['brisbane', 'brisbane'], ['sydney', 'sydney'], ['melbourne', 'melbourne'], ['perth', 'perth'], ['adelaide', 'adelaide']].map(([p, s]) => ({ p, h: `/delivery/${s}/`, v: 800, t: 'delivery city', k: 1 })),
  // ranges, as the way people actually phrase them
  { p: 'lithium batteries', h: '/shop/batteries-chargers/', v: 700, t: 'category', k: 0 },
  { p: 'lithium conversion', h: '/shop/batteries-chargers/', v: 690, t: 'category', k: 0 },
  { p: 'walk-behind', h: '/shop/walk-behind-buggies/', v: 700, t: 'category', k: 0 },
  { p: 'golf trolley', h: '/shop/walk-behind-buggies/', v: 690, t: 'category', k: 0 },
  { p: 'follow-me', h: '/shop/walk-behind-buggies/', v: 600, t: 'category', k: 0 },
  { p: '4 seater', h: '/shop/luxury-4-seater/', v: 700, t: 'category', k: 0 },
  { p: 'four seater', h: '/shop/luxury-4-seater/', v: 700, t: 'category', k: 0 },
  { p: '6 seater', h: '/shop/luxury-4-seater/', v: 690, t: 'category', k: 0 },
  { p: '2 seater', h: '/shop/traditional-2-seater/', v: 700, t: 'category', k: 0 },
  { p: 'lifted 4x4', h: '/shop/off-road-4x4/', v: 700, t: 'category', k: 0 },
  { p: 'off-road buggies', h: '/shop/off-road-4x4/', v: 700, t: 'category', k: 0 },
  { p: 'utility buggies', h: '/shop/commercial-utility/', v: 700, t: 'category', k: 0 },
  { p: 'efi petrol', h: '/shop/mechanical-petrol/', v: 700, t: 'category', k: 0 },
  { p: 'petrol buggies', h: '/shop/mechanical-petrol/', v: 690, t: 'category', k: 0 },
  { p: 'bitcoin', h: '/crypto-payment/', v: 650, t: 'page', k: 0 },
  { p: 'usdt', h: '/crypto-payment/', v: 640, t: 'page', k: 0 },
  { p: 'wholesale', h: '/wholesale/', v: 650, t: 'page', k: 0 },
  { p: 'fleet pricing', h: '/wholesale/', v: 640, t: 'page', k: 0 },
  // model short names, each unique to one product
  { p: 'zip x5', h: '/shop/walk-behind-buggies/mgi-2024-zip-x5-36-hole-lithium/', v: 500, t: 'product', k: 2 },
  { p: 'zip x1', h: '/shop/walk-behind-buggies/mgi-zip-x1-lithium-buggy/', v: 500, t: 'product', k: 2 },
  { p: 'zip navigator', h: '/shop/walk-behind-buggies/mgi-zip-navigator-all-terrain/', v: 500, t: 'product', k: 2 },
  { p: 'ai navigator', h: '/shop/walk-behind-buggies/mgi-ai-navigator-gps-remote-buggy/', v: 500, t: 'product', k: 2 },
  { p: 'fx7', h: '/shop/walk-behind-buggies/powakaddy-fx7-gps-lithium/', v: 500, t: 'product', k: 2 },
  { p: 'rxv elite', h: '/shop/traditional-2-seater/ezgo-rxv-elite-lithium/', v: 500, t: 'product', k: 2 },
  { p: 'express l6', h: '/shop/luxury-4-seater/ezgo-express-l6-lithium/', v: 500, t: 'product', k: 2 },
  { p: 'd5 ranger', h: '/shop/luxury-4-seater/evolution-d5-ranger-4-plus-2/', v: 500, t: 'product', k: 2 },
  { p: 'transporter 6', h: '/shop/commercial-utility/club-car-transporter-6-commercial/', v: 500, t: 'product', k: 2 },
  { p: 'carryall 700', h: '/shop/commercial-utility/club-car-carryall-700-electric-utility/', v: 500, t: 'product', k: 2 },
  { p: 'umax rally', h: '/shop/commercial-utility/yamaha-umax-rally-efi-petrol/', v: 500, t: 'product', k: 2 },
  { p: 'delta-q', h: '/shop/batteries-chargers/delta-q-quiq-48v-smart-on-board-charger/', v: 500, t: 'product', k: 2 },
  { p: 'roypow', h: '/shop/batteries-chargers/', v: 500, t: 'category', k: 0 },
];
for (const m of manual) if (!best.has(m.p)) best.set(m.p, m);
const rules = [...best.values()].sort((a, b) => a.k - b.k || b.v - a.v || b.p.length - a.p.length).map(({ p, h, v, t }) => ({ p, h, v, t }));
fs.writeFileSync(new URL('src/config/autolink-rules.json', ROOT), JSON.stringify(rules, null, 0));
const byType = {}; for (const r of rules) byType[r.t] = (byType[r.t] || 0) + 1;
console.log('rules', rules.length, byType);
