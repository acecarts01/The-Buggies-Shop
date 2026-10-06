import fs from 'node:fs'; import path from 'node:path';
import { loadAll } from './load.mjs';

// ------------------------------------------------------------------ 1. merge + exact dedupe
const { rows, perSource } = loadAll();
const rawCsv = Object.entries(perSource).filter(([k]) => k.startsWith('csv:')).reduce((a, [, v]) => a + v, 0);
const rawXlsx = Object.entries(perSource).filter(([k]) => k.startsWith('xlsx:')).reduce((a, [, v]) => a + v, 0);
const m = new Map(); let conflicts = 0, filledKd = 0, filledIntent = 0;
for (const r of rows) {
  const cur = m.get(r.kw);
  if (!cur) { m.set(r.kw, { ...r, n: 1, srcs: new Set([r.src]) }); continue; }
  cur.n++; cur.srcs.add(r.src);
  if ((r.vol ?? -1) !== (cur.vol ?? -1)) conflicts++;
  const best = (r.vol ?? -1) > (cur.vol ?? -1) ? r : cur; // keep the highest-volume row
  const other = best === r ? cur : r;
  const merged = { ...best, n: cur.n, srcs: cur.srcs };
  if (merged.kd == null && other.kd != null) { merged.kd = other.kd; filledKd++; }
  if (!merged.intent && other.intent) { merged.intent = other.intent; filledIntent++; }
  if (merged.rel == null && other.rel != null) merged.rel = other.rel;
  if (merged.cpc == null && other.cpc != null) merged.cpc = other.cpc;
  if (!merged.track && other.track) merged.track = other.track;
  m.set(r.kw, merged);
}
const uniq = [...m.values()];

// ------------------------------------------------------------------ 2. relevance / removal rules (first match wins)
const STOCKED = /\b(club ?car|e-?z-?go|yamaha|lvtong|evolution|tara|mgi|atlas|powa ?kaddy|power ?kaddy|robera|cushman|roypow|eco battery|invicta|trojan|delta-?q|curtis|navitas|madjax|albright)\b/;
const STOCKED_MODEL = /\b(onward|tempo|carryall|rxv|drive ?2|express (l6|s4)|umax|zip ?x\d|navigator|fx7|spirit pro|roadster|transporter|hauler|d5 ranger|d-?max)\b/;
const NOT_STOCKED_MODEL = /\b(precedent|txt|ds|medalist|pds|villager|g ?\d{1,2})\b/;
const COMPETITOR = /\b(motocaddy|caddytek|clicgear|click ?gear|stewart|powerbug|parmaker|stinger|drummond|leopard|bag ?boy|sun mountain|big max|jucad|rovic|garia|prosimmon|tri ?-?lite|emc|thomson|hunter|brosnan|bad boy|regar|fast ?-?fold|razor|masters|triumph|augusta|ecar|hdk|lion|grasshopper|axglo|hillbilly|qod|mig|e-?car|e car|all coast|walkinshaw|marshell|condor|cougar|alphard|smoothy|stowamatic|porsche|highland|ford|par car|polaris|kubota|honda|suzuki|kawasaki|toyota|tesla|segway|kymco|can-?am|bunnings|kmart|big w|amazon|walmart|costco|aldi|ikea|home depot|golf ?town|golf ?warehouse|golfgear|pga tour superstore|ping|taylormade|callaway|titleist|nike|cobra|mizuno|srixon|cleveland|bridgestone|odyssey|scotty cameron)\b/;
const USED = /\b(used|old|vintage|antique|retro|second ?hand|secondhand|2nd ?hand|pre-?owned|pre-?loved|preloved|refurbished|reconditioned|ex-?demo|ebay|gumtree|marketplace|carsales|trademe|trade me|craigslist|autotrader|auctions?|salvage|wrecker)\b/;
const PARTS = /\b(parts?|spares?|replacement|repair|repairs|rebuild|rebuilt|wiring|diagram|solenoid|axles?|differential|carburettor|carburetor|starter generator|fuse|ignition|spark plugs?|clutch|torque converter|steering (box|rack)|tie rod|ball joint|leaf springs?|shock mounts?|bushings?|(owners?|owner's|service|repair|workshop|parts) manual|serial numbers?)\b/;
const RENTAL = /\b(rent|rental|rentals|hire|hiring|lease|leasing|tour|tours)\b/;
const EQUIP = /\b(bags?|clubs?|balls?|umbrellas?|shoes?|gloves?|tees?|putters?|irons?|drivers?|woods?|wedges?|headcovers?|rangefinders?|towels?|scorecards?|apparel|shirts?|polos?|hats?|caps?|jackets?|pants|trousers|socks|grips?|simulators?|cooler|tumbler|gifts?)\b/;
const OTHERVEH = /\b(sand|beach|jeep|joyner|volkswagen|vw|gti|jetta|tdi|mk ?\d|scooters?|mobility|wheelchairs?|go ?karts?|lawn ?mowers?|mowers?|tractors?|atv|utv|quad|dune|motorbikes?|motorcycles?|bicycles?|bikes?|baby|prams?|strollers?|pushchairs?|dogs?|pets?|kayak|boat|swing|game|games|minecraft|roblox|toys?|lego|rc car|trucks?|utes?|vans?|school bus|bus)\b/;
const NONAU = /\b(florida|texas|california|arizona|georgia|ohio|carolina|new jersey|colorado|nevada|utah|michigan|indiana|tennessee|alabama|virginia|canada|toronto|ontario|usa|america|uk|england|ireland|scotland|wales|india|philippines|dubai|uae|south africa|singapore|malaysia|japan|germany|france|spain|nz|new zealand)\b|[^\x00-\x7f]/;
const JUNIOR = /\b(junior|juniors|kids?|child|children|toddlers?|youth|boys?|girls?)\b/;
const HAS_GOLF = /\bgolf(ing|er|ers)?\b/;
const VEHICLE = /\b(buggy|buggies|buggie|buggys|carts?|karts?|cars?|trolleys?|trollies|trolly|caddy|caddie|caddies)\b/;
const PUSHY = /\b(electric|motorised|motorized|remote|push|lithium|folding|foldable)\b/;
const stripClubCar = (s) => s.replace(/\bclub ?car\b/g, 'clubcar');
function classifyRemoval(kw) {
  const k = stripClubCar(kw);
  if (NONAU.test(kw)) return 'off-topic: non-Australian market / non-English';
  if (OTHERVEH.test(k)) return 'off-topic: other vehicle, product or meaning';
  // The owner's own primary term is the bare "buggies for sale" family (no "golf"), so a buggy word plus a
  // buying modifier is on-topic. Baby/dune/beach/sand buggies are already excluded by OTHERVEH above.
  const BUY_MOD = /\b(for sale|sale|sales|buy|buying|price|prices|cost|near me|cheap|cheapest|online|dealers?)\b/;
  const onTopic = (HAS_GOLF.test(k) && VEHICLE.test(k)) || (/\b(buggy|buggies|buggie)\b/.test(k) && BUY_MOD.test(k)) ||(PUSHY.test(k) && /\b(buggy|buggies|trolleys?|trolly)\b/.test(k)) || (STOCKED.test(k) && (VEHICLE.test(k) || STOCKED_MODEL.test(k)));
  if (!onTopic) return 'off-topic: no golf buggy/cart/trolley anchor';
  if (EQUIP.test(k)) return 'off-topic: golf equipment (bags, clubs, balls, apparel...)';
  if (RENTAL.test(k)) return 'off-topic: hire / rental / tours (we sell, not hire)';
  if (USED.test(k)) return 'used / second-hand / marketplace';
  // "battery replacement" / "lithium replacement" is buying a battery, which we sell - not a spare part.
  if (PARTS.test(k) && !(/\breplacement\b/.test(k) && /\b(batter(y|ies)|charger|lithium|cells?)\b/.test(k) && !/\bparts?\b/.test(k))) return 'parts / repair / manuals';
  if (COMPETITOR.test(k) && !STOCKED.test(k)) return 'competitor brand or retailer (not stocked)';
  if (JUNIOR.test(k)) return 'held: junior range (owner-initiated coming-soon page only)';
  return null;
}

// ------------------------------------------------------------------ 3. intent: Semrush label, else inferred from modifiers
const TXN = /\b(buy|buying|purchase|for sale|sale|sales|price|prices|pricing|cost|costs|shop|store|stores|near me|cheap|cheapest|order|deals?|discount|dealers?|supplier|suppliers|stockists?|quote|finance|afford\w*|online|delivery|delivered|in stock|brand new|where to buy|how much)\b/;
const QUESTION = /^(how|what|why|when|where|who|which|can|does|do|is|are|should|will|could|would)\b/;
const MAINT = /\b(troubleshooting|reset|maintenance|adjust\w*|oil|engine|governor|filter|how to|dimensions?|weigh|weights?|specs?|phone|location|wont|won't|not working)\b/;
const COM = /\b(best|top|review|reviews|vs|versus|compare|comparison|alternatives?|accessor(y|ies)|electric|remote|push|lithium|motori[sz]ed|folding|foldable|\d ?seater|seaters?|seats?|lifted|lift kits?|off ?road|battery|batteries|charger|gps|enclosure|windshield|trolley|trolleys|brands?|models?|types?|wheels?|wheeled|wheelers?|tyres?|tires?|rims|lights?|solar|passenger|utility|petrol|gas|diesel|follow(s|ing)?|new|compact|heavy duty|street legal)\b/;
const INFO = /^(how|what|why|when|where|who|which|can|does|do|is|are|should|will|could|would)\b|\b(diy|meaning|definition|history|legal|illegal|law|laws|rules?|licen[cs]e|registration|rego|street legal|insurance|tutorial|guide|ideas?|pdf|free|problems?|not working|won't|wont)\b/;
const NAVBRAND = /\b(golf ?buggies express|the buggies express|buggies express|golfbuggiesexpress)\b/;
const HEADTERM = /^(golf )?(buggy|buggies|buggie|cart|carts|trolley|trolleys)( golf)?( australia| au| aus| for golf)?$|^(buggy|buggies|cart|carts) golf$/;
function intentOf(r) {
  const label = (r.intent || '').trim();
  if (label) return { set: label.split(',').map((s) => s.trim()), source: 'semrush' };
  const k = r.kw;
  if (NAVBRAND.test(k)) return { set: ['Navigational'], source: 'inferred' };
  // A question or after-sale/maintenance phrasing is Informational unless it clearly asks about price, buying or comparison.
  if (QUESTION.test(k) || MAINT.test(k)) {
    if (/\b(how much|price|prices|cost|costs|buy|for sale|where to buy|near me)\b/.test(k)) return { set: ['Transactional'], source: 'inferred' };
    if (/\b(best|top|review|reviews|vs|versus|compare|comparison|alternatives?)\b/.test(k)) return { set: ['Commercial'], source: 'inferred' };
    return { set: ['Informational'], source: 'inferred' };
  }
  if (TXN.test(k)) return { set: ['Transactional'], source: 'inferred' };
  if (COM.test(k)) return { set: ['Commercial'], source: 'inferred' };
  if (INFO.test(k)) return { set: ['Informational'], source: 'inferred' };
  if (STOCKED.test(stripClubCar(k)) || STOCKED_MODEL.test(k)) return { set: ['Navigational'], source: 'inferred' };
  if (HEADTERM.test(k)) return { set: ['Commercial'], source: 'inferred (head term)' };
  return { set: ['Unclassified'], source: 'inferred (no modifier)' };
}
const pageTypes = (set) => ({
  product: set.some((s) => s === 'Transactional' || s === 'Commercial'),
  info: set.some((s) => s === 'Navigational' || s === 'Commercial'),
  money: set.some((s) => s === 'Transactional' || s === 'Commercial'),
});

// ------------------------------------------------------------------ 4. apply rules
const removed = []; const kept = []; const removalCounts = {};
const bump = (w) => (removalCounts[w] = (removalCounts[w] || 0) + 1);
for (const r of uniq) {
  const why = classifyRemoval(r.kw);
  if (why) { removed.push({ ...r, reason: why }); bump(why); continue; }
  const it = intentOf(r); const pt = pageTypes(it.set);
  const k = stripClubCar(r.kw);
  const brand = STOCKED.test(k) ? 'stocked' : '';
  const flag = NOT_STOCKED_MODEL.test(r.kw) && STOCKED.test(k) ? 'brand stocked, model not stocked' : '';
  const type = /\b(trolleys?|trolly|caddy|caddie|powa ?kaddy|mgi)\b/.test(k) ? 'trolley' : /\b(buggy|buggies|buggie|buggys)\b/.test(k) ? 'buggy' : 'cart';
  if (!pt.product && !pt.info && !pt.money) {
    const w = it.set[0] === 'Unclassified' ? 'unclassified: no intent modifier (held for review)' : 'intent rule: Informational only (no allowed page type)';
    removed.push({ ...r, reason: w }); bump(w); continue;
  }
  kept.push({ ...r, intentSet: it.set, intentLabel: it.set.join(', '), intentSource: it.source, ...pt, brand, flag, type });
}

// ------------------------------------------------------------------ 5. cluster near-duplicates
const IRREG = { buggies: 'buggy', buggie: 'buggy', buggys: 'buggy', trollies: 'trolley', trolleys: 'trolley', trolly: 'trolley', accessories: 'accessory', batteries: 'battery', kart: 'cart', karts: 'cart', carts: 'cart', sales: 'sale', caddies: 'caddy' };
const STOP = new Set(['for', 'a', 'the', 'of', 'to', 'and', 'with', 'in', 'on', 'at']);
function clusterKey(kw) {
  const s = kw.replace(/e[- ]?z[- ]?go/g, 'ezgo').replace(/\bgolf cars?\b/g, 'golf cart').replace(/(\d+)\s*-?\s*seater/g, '$1seater').replace(/[^a-z0-9 ]/g, ' ');
  const t = s.split(/\s+/).filter(Boolean).map((w) => IRREG[w] || (w.length > 3 && /s$/.test(w) && !/(ss|us|is)$/.test(w) ? w.slice(0, -1) : w)).filter((w) => !STOP.has(w));
  return [...new Set(t)].sort().join(' ');
}
const clusters = new Map();
for (const r of kept) { const key = clusterKey(r.kw); if (!clusters.has(key)) clusters.set(key, []); clusters.get(key).push(r); }
const out = [];
for (const [key, list] of clusters) {
  list.sort((a, b) => (b.vol ?? -1) - (a.vol ?? -1) || (a.kd ?? 999) - (b.kd ?? 999) || a.kw.length - b.kw.length);
  const p = list[0];
  out.push({ key, primary: p.kw, vol: p.vol ?? 0, kd: p.kd, cpc: p.cpc, intent: p.intentLabel, intentSource: p.intentSource, product: p.product, info: p.info, money: p.money, type: p.type, brand: p.brand, flag: p.flag, variants: list.slice(1).map((x) => x.kw), total: list.reduce((a, x) => a + (x.vol ?? 0), 0) });
}
out.sort((a, b) => b.vol - a.vol || (a.kd ?? 999) - (b.kd ?? 999));
out.forEach((c, i) => (c.id = 'C' + String(i + 1).padStart(5, '0')));

// ------------------------------------------------------------------ 6. write outputs (docs/ never ships)
const OUT = path.join('C:/VERCEL PROJECTS/Buggy Carts', 'docs', 'keyword-research', 'phase0'); fs.mkdirSync(OUT, { recursive: true });
const q = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
fs.writeFileSync(path.join(OUT, 'keyword-bank-clean.csv'), ['cluster_id,primary_keyword,volume,kd,cpc_usd,intent,intent_source,product_page_ok,info_page_ok,money_page_ok,type,stocked_brand,flag,variant_count,cluster_total_volume,variants'].concat(out.map((c) => [c.id, q(c.primary), c.vol, c.kd ?? '', c.cpc ?? '', q(c.intent), q(c.intentSource), c.product ? 'Y' : 'N', c.info ? 'Y' : 'N', c.money ? 'Y' : 'N', c.type, c.brand, q(c.flag), c.variants.length, c.total, q(c.variants.join(' | '))].join(','))).join('\n'));
removed.sort((a, b) => (b.vol ?? 0) - (a.vol ?? 0));
fs.writeFileSync(path.join(OUT, 'keyword-removed.csv'), ['keyword,volume,kd,reason'].concat(removed.filter((r) => (r.vol ?? 0) > 0).map((r) => [q(r.kw), r.vol ?? 0, r.kd ?? '', q(r.reason)].join(','))).join('\n'));
const count = (arr, f) => arr.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + 1; return a; }, {});
const stats = { rawCsv, rawXlsx, rawTotal: rows.length, conflicts, filledKd, filledIntent, unique: uniq.length, removedTotal: removed.length, removalCounts, keptKeywords: kept.length, clusters: out.length,
  keptIntentSource: count(kept, (r) => r.intentSource), clusterIntent: count(out, (c) => c.intent),
  clustersVol0: out.filter((c) => c.vol === 0).length, clustersVolPos: out.filter((c) => c.vol > 0).length, product: out.filter((c) => c.product).length, info: out.filter((c) => c.info).length,
  byType: count(out, (c) => c.type), stockedBrand: out.filter((c) => c.brand).length, notStockedModel: out.filter((c) => c.flag).length,
  removedWithVolume: removed.filter((r) => (r.vol ?? 0) > 0).length };
fs.writeFileSync(path.join(OUT, '_stats.json'), JSON.stringify(stats, null, 1));
console.log(JSON.stringify(stats, null, 1));
console.log('\nTOP 45 CLUSTERS:'); for (const c of out.slice(0, 45)) console.log(`${c.id} ${String(c.vol).padStart(5)} kd${String(c.kd ?? '-').padStart(3)} ${c.intent.padEnd(26)} ${c.primary}  (+${c.variants.length})`);
