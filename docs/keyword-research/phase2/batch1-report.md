# Phase 2, Batch 1: `/shop/` hub, 9 categories, new electric hub

Built and verified 2026-10-07. Copy lives in `src/config/category-content.ts` (server-only); prices, counts and
specs are computed from `PRODUCTS`, and the build throws if a referenced product slug does not exist.

## Keyword-to-page map (one primary per page, cluster ids from `phase0/keyword-bank-clean.csv`)

| Page | Primary (cluster, vol / cluster total, KD) | Supporting (declared in meta keywords and used in copy) |
|---|---|---|
| `/shop/` | golf buggy for sale (C00004, 1,900 / 3,440, 14) | golf buggies for sale australia, buy golf buggy, best golf buggy australia, golf buggy sales, golf buggy price |
| `/shop/electric-golf-buggies/` (new) | electric golf buggy (C00006, 1,900 / 3,290, 36) | electric golf buggy for sale (C00028), electric golf buggies australia, best electric golf buggy australia, remote control electric golf buggy, electric golf cart |
| `/shop/luxury-4-seater/` | 4 seater golf buggy for sale (C00324) | 6 seater golf buggy, 6 seater golf buggy for sale, 4 seater golf cart, 4 seater electric golf buggy |
| `/shop/traditional-2-seater/` | 2 seater golf buggy for sale (C00323) | 2 seater golf buggy, electric golf buggy 2 seater, two seater golf buggy, 2 seater golf cart |
| `/shop/off-road-4x4/` | off road golf buggy (C00281) | off road golf cart, 4x4 golf cart for sale, 4x4 electric golf cart, lifted golf cart |
| `/shop/commercial-utility/` | farm buggies for sale (C00218, 50, KD 6) | utility buggy for sale, electric utility buggy, utility golf buggy, farm buggy for sale australia |
| `/shop/mechanical-petrol/` | petrol golf buggy for sale (C00259) | petrol golf buggy, petrol golf carts for sale (C00035, 320), petrol golf cart, gas golf carts for sale |
| `/shop/walk-behind-buggies/` | golf trolley (C00009, 880 / 1,170, 13) | remote control golf buggy (C00017), golf push buggy (C00016), electric golf trolley, motorised golf buggy, electric golf caddy |
| `/shop/batteries-chargers/` | golf buggy battery (C00045, 260 / 960, 6) | golf buggy battery lithium, golf buggy charger, golf buggy battery replacement |
| `/shop/accessories-spare-parts/` | golf buggy accessories (C00023, 390, 4) | golf buggy accessories australia, golf buggy wheels, golf buggy tyres |
| `/shop/junior-golf-buggies/` | junior golf buggy (unchanged, coming-soon) | unchanged |

Decisions applied: buggy vocabulary in H1/H2/title; cart vocabulary only in meta keywords, one meta description
(petrol) and a few supporting mentions. "golf push buggy" is discussed honestly on the walk-behind page as the
manual alternative; we do not stock push trolleys and the page says so.

## What changed

* **`/shop/`**: title, H1, meta now carry "golf buggy for sale"; 4 H2 sections, "Browse the Range" links to every
  category, 6-question FAQ with FAQPage schema. Page is now a server wrapper (`app/shop/page.tsx`) around
  `ShopClient.tsx`.
* **`/shop/electric-golf-buggies/`**: virtual category (`electric: true`, `isElectricBuggy()` = electric fuel type
  and not a part) listing all 28 electric vehicles; CollectionPage + ItemList, 5 sections, 5 guide links, 6 FAQs;
  wired into nav, footer, chips, sitemap, `llms.txt`, `/api/categories`, ACP catalog.
* **Five thin categories** (4-seater, 2-seater, off-road, utility, petrol): from ~250 words to ~900 rendered, 5 H2
  sections each, 5 FAQs, 4 to 5 guide links. All prices computed.
* **Walk-behind**: title, H1, meta now carry golf trolley, remote control golf buggy, golf push buggy; added FAQ.
* **Batteries, accessories**: declared keywords and added 5-question FAQs (existing copy unchanged).
* **Junior**: head-term repetition trimmed (10 uses to 5); no model, price or date claim added.
* `CONTENT_UPDATED.catalog` bumped to 2026-10-07.

## Verification

Clean `next build` (no dev server running), `npm run crosscheck` OK (175 pages, 170 indexable; it caught one
169-character description, now fixed), one H1 per page, FAQPage and CollectionPage JSON-LD parse on all 11 pages,
no horizontal overflow at 380px, electric hub shows 28 models.

Known leftovers, not touched in this batch: product cards print the category name on every card (this inflates raw
keyword counts on category pages; prose density is under 1%); "electric golf buggy" is also targeted by a guide
(retarget in Batch 4).
