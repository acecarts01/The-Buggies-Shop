// Contextual internal linking.
//
// Turns the first natural mention of a page's target keyword inside copy into a
// link to that page, highest-search-volume phrases first (the rules come from
// the keyword-to-page map: docs/keyword-research/tools/make-autolinks.mjs).
// Server-side only: the rule table never reaches a client bundle, the client
// just renders the resulting segments with <LinkedText />.
//
// Guard rails, so this stays editorial rather than spammy:
//   * a page gets at most `max` links in total and `perText` per paragraph;
//   * each destination is linked once per page, never the page itself;
//   * only the first match of a phrase is linked, whole words only, never
//     inside an existing link;
//   * the rule table already excludes generic two-word phrases, "near me",
//     review/price-range noise, other cities' names and competitor anchors.

import rules from '@/src/config/autolink-rules.json';
import type { Seg } from '@/src/components/LinkedText';

interface Rule { p: string; h: string; v: number; t: string }

const WORDS: Record<string, string> = {
  buggy: 'bugg(?:y|ies)', buggies: 'bugg(?:y|ies)',
  battery: 'batter(?:y|ies)', batteries: 'batter(?:y|ies)',
  accessory: 'accessor(?:y|ies)', accessories: 'accessor(?:y|ies)',
  trolley: 'trolleys?', trolleys: 'trolleys?',
  cart: 'carts?', carts: 'carts?',
};
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const COMPILED: { rule: Rule; re: RegExp }[] = (rules as Rule[]).map((rule) => {
  const parts = rule.p.split(/\s+/).map((t) => WORDS[t] ?? escapeRe(t));
  return { rule, re: new RegExp('(?<![\\w-])(' + parts.join('[\\s-]+') + ')(?![\\w-])', 'i') };
});

export interface Linker {
  /** Segments for one paragraph; call in reading order so earlier copy gets first pick. */
  link: (text: string) => Seg[];
  /** How many links this page now carries. */
  readonly count: number;
}

export function createLinker(self: string, max: number, perText = 2): Linker {
  const used = new Set<string>();
  let count = 0;
  return {
    get count() { return count; },
    link(text: string): Seg[] {
      let segs: Seg[] = [text];
      let here = 0;
      for (const { rule, re } of COMPILED) {
        if (count >= max || here >= perText) break;
        if (rule.h === self || used.has(rule.h)) continue;
        for (let i = 0; i < segs.length; i++) {
          const s = segs[i];
          if (typeof s !== 'string') continue;
          const m = re.exec(s);
          if (!m) continue;
          const before = s.slice(0, m.index);
          const after = s.slice(m.index + m[0].length);
          segs.splice(i, 1, ...([before, { text: m[0], href: rule.h }, after].filter((x) => x !== '') as Seg[]));
          used.add(rule.h);
          count++; here++;
          break;
        }
      }
      return segs;
    },
  };
}

export const plainSegs = (text: string): Seg[] => [text];
