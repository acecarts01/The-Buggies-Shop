# Phase 5: commercial hubs (complete)

Status: `bun scripts/hub-check.ts` passes for every category, brand and tag hub; `site-validate`, `crosscheck` and `product-copy-check` still pass.

## What changed

| Hub | Before | After |
| --- | --- | --- |
| Categories (11) | Push category 148 words; primary keyword missing from the first 100 words on 5; two titles/descriptions without the exact primary; petrol meta description opened with a keyword stem | All 300+ words (push: 302, now with Model 4.0 vs 4.5 and accessories sections plus 2 FAQs); exact primary in title, H1, meta description and opening copy |
| Brands (13) | 176-275 words; primary in the title for 2 of 9; meta descriptions began with "keyword:" | 299-393 words; exact primary in title, H1, description and the opening paragraph; descriptions rebuilt without the stem; two question-style sections added per brand (`src/config/brand-more.ts`) |
| Thin brands (Atlas, Cushman, PowaKaddy, Robera) | noindex | Still noindex and out of the sitemap until 3 products; now 300+ words so they qualify on content when stock arrives |
| Tags (8) | 152-169 words; exact primary missing from title, H1, description and opening | 300-306 words; answer-first lead, two question-style sections, exact primary in title, H1 and description (`src/config/tag-more.ts`); tag gate now also requires 300+ editorial words |
| Home | Title, H1 and description already carry "buggies for sale" | Three H2s rewritten as questions; reviews untouched |
| Junior (coming soon) | Title had no exact primary; 298 words | Title and description lead with "junior golf buggy"; 306 words; still states no model, price or date |

## Rules held

- One H1 per page; titles <= 62 characters; meta descriptions 110-160 characters.
- No "keyword: ..." meta stems; no road-legal claims; no invented facts (specs and models come from the catalogue, prices are computed on the page).
- Footer "Last updated" bumped to 2026-11-24 for pages and catalog (real copy edits).

## Verification

- `scripts/hub-check.ts` (new): word counts, exact primary in title/H1/description/first 100 words, title and description length, one H1, noindex state for thin brands.
- 380px: no horizontal overflow on a brand page and a tag page.
- Core Web Vitals (PageSpeed Insights, before this phase): mobile 98, LCP 2.3 s, TBT 10 ms, CLS 0; desktop LCP 0.5 s. Re-measure after deploy.
