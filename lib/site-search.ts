// Pure, client-safe site search over the compact index served by
// /api/search-index (see app/api/search-index/route.ts). No dependencies, so the
// header dialog and the /search page share one ranking.

export type SearchKind = 'range' | 'product' | 'guide' | 'page' | 'faq';

export interface SearchEntry {
  /** kind */
  t: SearchKind;
  /** title */
  ti: string;
  /** url path */
  u: string;
  /** short description / answer snippet */
  d: string;
  /** extra keywords (not shown) */
  k: string;
}

export interface SearchHit extends SearchEntry { score: number }

export const KIND_LABEL: Record<SearchKind, string> = {
  range: 'Ranges, brands and delivery',
  product: 'Products',
  guide: 'Guides',
  page: 'Pages',
  faq: 'Questions',
};
export const KIND_ORDER: SearchKind[] = ['product', 'range', 'guide', 'page', 'faq'];

const IRREG: Record<string, string> = { buggies: 'buggy', buggys: 'buggy', carts: 'cart', trolleys: 'trolley', batteries: 'battery', accessories: 'accessory', ezgo: 'e-z-go', ez: 'e-z-go' };
const STOP = new Set(['a', 'an', 'the', 'for', 'of', 'to', 'in', 'on', 'and', 'with', 'my', 'me', 'i', 'do', 'you', 'is', 'are']);

export function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/e[-\s]?z[-\s]?go/g, 'e-z-go')
    .replace(/[^a-z0-9+.\- ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => IRREG[w] ?? (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w));
}

const flat = (s: string) => ' ' + tokens(s).join(' ') + ' ';

const KIND_BOOST: Record<SearchKind, number> = { product: 6, range: 3, page: 2, guide: 1.5, faq: 0.5 };

/** Every query word must appear (as a word start) somewhere in the entry; title and keyword hits rank higher. */
export function searchIndex(index: SearchEntry[], query: string, limit = 40): SearchHit[] {
  const q = tokens(query);
  if (!q.length) return [];
  const phrase = ' ' + q.join(' ') + ' ';
  const hits: SearchHit[] = [];
  for (const e of index) {
    const title = flat(e.ti), keys = flat(e.k), desc = flat(e.d);
    let score = 0;
    let ok = true;
    for (const w of q) {
      const starts = ' ' + w;
      if (title.includes(starts)) score += 6;
      else if (keys.includes(starts)) score += 3;
      else if (desc.includes(starts)) score += 1;
      else { ok = false; break; }
    }
    if (!ok) continue;
    if (title.includes(phrase)) score += 8;           // the whole query as a phrase in the title
    else if (keys.includes(phrase)) score += 4;
    if (title.trim().split(' ')[0] === q[0]) score += 1.5;
    hits.push({ ...e, score: score + KIND_BOOST[e.t] });
  }
  return hits.sort((a, b) => b.score - a.score || a.ti.localeCompare(b.ti)).slice(0, limit);
}

export function groupHits(hits: SearchHit[]): { kind: SearchKind; hits: SearchHit[] }[] {
  return KIND_ORDER.map((kind) => ({ kind, hits: hits.filter((h) => h.t === kind) })).filter((g) => g.hits.length);
}
