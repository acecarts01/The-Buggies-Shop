# Phase 4: product pages (complete)

Date: 2026-11-26. Status: all 102 product pages pass `bun scripts/product-copy-check.ts`; live `node scripts/site-validate.mjs` PASS; `npm run indexnow` submitted 238 URLs (HTTP 200).

## What every product page now has

- Exactly 400 words of description (intro, three H3 question sections, one standard "where can I buy" section), hand-written per product in `src/config/product-copy.ts`.
- Answer-first intro with the primary keyword in the first 100 words.
- Custom H1, title (<= 62 chars, buy-intent word, differs from H1) and meta description (110-160 chars, contains the primary, no "keyword:" stem).
- Six custom FAQs (FAQPage schema) carrying the primary and at least two secondaries.
- Five secondary keywords, each used on at most three products; densities are ceilings (primary <= 2%, secondaries combined <= 3%).
- Product schema unchanged (no reviews, no GTIN, no shipping or priceValidUntil that is not real).

## Delivery

Ten batches, each built, validated (`site-validate`, `crosscheck`, `product-copy-check`), committed and pushed before the next:

| Batch | Products | Commit |
| --- | --- | --- |
| Sample + 1-6 | 64 | up to `290001d` |
| 7 | 10 (MGI Ai 500, Navigator Halo, E-Boost x3, Clicgear 4.0 x4, Clicgear 4.5) | `214c3b3` |
| 8 | 10 (Rovic RV1S/RV1C, MGI batteries, charger, charging box, Halo Eye, phone and GPS holders) | `dcdcab9` |
| 9 | 10 (MGI umbrella holder and extender, drink holder, hook, scorecard holder, seat, rain cover, wheel covers, cooler bag, travel bag) | `11d7932` |
| 10 | 8 (accessories bag, Clicgear and Rovic seats, MGI 299Wh and 12V batteries, E Series charger, telescopic umbrella, rear wheels) | `028b64a` |

## Decisions worth knowing

- Colour variants (E-Boost black/navy/white, Clicgear 4.0 four colours) each have a different primary keyword and unique prose, so they do not compete with each other.
- Where the map's primary had no search volume ("buy mgi e-boost navy" and similar), a keyword with volume >= 10 from the pool was used instead.
- No "road legal" or "street legal" claims anywhere; copy sticks to catalogue facts (specs, prices, compatibility notes).
- The teal Clicgear 4.0 is $399 and the other colours $489: the copy states this plainly.

## Carry-overs

- Freight stays "quoted against the delivery postcode at checkout" (not a percentage of the order).
- Home-page Core Web Vitals remeasure still needs a clean network (PageSpeed API was rate-limited).
- Remaining Semrush seed top-ups and the three new delivery regions (sourced road distances) are still open.

Next: Phase 5 (home, categories, brands to 300+ words, tags to 300+ words) once approved.
