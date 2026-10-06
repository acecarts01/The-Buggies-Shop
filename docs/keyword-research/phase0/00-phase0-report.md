# Phase 0 report: dedupe and clean the keyword bank

Run date 2026-10-06. Reproducible with `tools/build.mjs` (needs `xlsx` and `csv-parse`; reads
`Keyword Export/*.csv` and `golf-buggy-keywords-AU.xlsx`, writes the files in this folder).
`docs/` never ships to the live site.

## 1. Inputs found

| Input | Found | Notes |
|---|---|---|
| `golf-buggy-keywords-AU.xlsx` | yes | Sheets: Top 14 Picks (14), Top 200 Scored (200), City Pages (13), City Keywords (188), Assumptions |
| Raw Semrush CSVs | yes, 59 files in `Keyword Export/` | 1,147,454 rows, all AU, exported 2026-09-06 and 2026-09-10 |
| Website source | yes, but it is **Next.js, not static HTML** | Copy lives in `src/config/*.ts` and `app/`; see open decision 9 |
| `docs/keyword-research/keywords-with-metrics.tsv` | not merged | Older pre-Semrush working list; it is a subset of the same 118,875 pool |
| Missing | nothing blocking | No product tag field exists in the data model yet (Phase 2 adds it) |

## 2. Counts, before and after

| Step | Count |
|---|---:|
| Raw rows loaded (59 CSVs + 3 workbook sheets) | **1,147,856** (1,147,454 CSV + 402 workbook) |
| Unique keywords after case/whitespace normalisation and exact-duplicate removal | **118,875** |
| Exact duplicates removed | 1,028,981 |
| Duplicate rows whose volume disagreed | 0 (every export agreed) |
| Blank KD filled from another copy | 688 |
| Blank Intent filled from another copy | 685 |
| Removed or held (reasons in section 3) | 97,427 |
| **Kept keywords** | **21,448** |
| **Clusters** (one primary + natural variants, one cluster = one page) | **14,933** |
| Clusters with search volume > 0 | 4,476 |
| Clusters with 0 volume (long tail, kept for FAQ and body coverage) | 10,457 |

## 3. What was removed and why (first matching rule wins)

| Reason | Keywords |
|---|---:|
| Off-topic: no golf buggy / cart / trolley anchor (golf bags, clubs, sets, apparel, generic) | 61,091 |
| Unclassified: no intent modifier, held for review | 9,564 |
| Off-topic: other vehicle, product or meaning (VW Golf, scooters, prams, dune/sand buggies, toys) | 6,501 |
| Off-topic: non-Australian market or non-English | 5,382 |
| Intent rule: Informational only (no allowed page type) | 3,841 |
| Parts / repair / manuals | 3,335 |
| Used / second-hand / marketplace / "old" / "vintage" | 2,903 |
| Competitor brand or retailer, not stocked | 1,636 |
| Off-topic: golf equipment (bags, clubs, balls, umbrellas) | 1,675 |
| Off-topic: hire / rental / tours (you sell, not hire) | 1,236 |
| Held: junior range (owner-initiated coming-soon page only) | 263 |

Every removed keyword with volume is listed with its reason in `keyword-removed.csv`
(35,908 rows), so any rule can be reversed. "Battery replacement" is deliberately **kept** (you sell batteries).

## 4. Clustering

Near-duplicates are merged by a normalised key: plural/singular, `buggie/buggy/buggies`, `golf car` = `golf cart`,
`kart` = `cart`, `sale/sales`, word order, and filler words (`for`, `a`, `the`, `with`). Primary = highest volume,
then lowest KD. Check against your brief's own example:

> C00001 `golf buggy` (12,170 combined monthly searches): buggies golf, golf buggies, buggy for golf, golf buggie,
> buggy golf, buggies for golf, golf buggys, golf.buggy, buggie golf.

## 5. Intent labels

* **Semrush-labelled:** 531 kept keywords. **Inferred from modifiers:** 20,909. **Inferred head terms** (bare
  `golf buggy` style, which Semrush itself labels Commercial): 8. Every inferred row says so in `intent_source`.
* Inference order: question or after-sale phrasing (Informational unless it asks price/buying/comparison) ->
  Transactional modifiers (buy, for sale, price, near me, cheap, dealer...) -> Commercial modifiers (best, review,
  vs, electric, remote, push, lithium, seater, wheels, accessories...) -> brand/model (Navigational).
* Page-type flags in the clean bank (`product_page_ok`, `info_page_ok`, `money_page_ok`) apply your strict rules:
  product and money pages need Transactional or Commercial; blogs, FAQs and info pages need Navigational or
  Commercial. Result: **12,080** clusters usable on product/money pages, **10,756** on blog/FAQ/info pages.

## 6. Your Top 14 mapped into clusters

| Pick | Cluster | Cluster total searches/mo | Intent |
|---|---|---:|---|
| golf buggy, buggies golf, golf buggies | C00001 | 12,170 | Commercial (Semrush) |
| golf buggy for sale, golf buggy sales, golf buggies for sale | C00004 | 3,440 | Transactional |
| electric golf buggy | C00006 | 3,290 | Informational, Commercial |
| electric golf buggy for sale | C00028 | 780 | Transactional |
| golf push buggy | C00016 | 1,730 | Commercial |
| golf trolley | C00009 | 1,170 | Commercial |
| remote control golf buggy | C00017 | 710 | Commercial |
| golf buggy accessories | C00023 | 390 | Commercial |
| golf buggy for sale brisbane | C00067 | 240 | Transactional |
| golf carts for sale | C00003 | 5,210 | Transactional |
| electric golf cart | C00012 | 1,430 | Commercial |
| **buggies for sale** (owner-set, not in the Top 14) | C00014 | 710 | Transactional |

Consequence: the workbook treats "golf buggy for sale" and "golf buggy sales" as separate picks. They are one
cluster and will map to **one** page, which is what prevents the two pages competing.

## 7. Quality checks and one defect I found and fixed

* My first rule set discarded **"buggies for sale"** (590/mo, KD 14), which your `docs/keyword-map.md` marks
  "PRIMARY, owner-set, do not change". The "must contain golf" gate was too strict. Fixed: a buggy word plus a
  buying modifier is on-topic. Baby, dune, beach and sand buggies stay excluded (checked: none leaked).
* Brand scan: first pass let Prosimmon, Trilite, EMC, Thomson, Hunter, Triumph, Augusta, ECAR, HDK, Hillbilly,
  Stowamatic and others through; added and re-run. 514 clusters are flagged "brand stocked, model not stocked"
  (for example Yamaha G29/G16, EZGO TXT, Club Car Precedent) so pages never imply stock you do not hold.
* **Limit, stated plainly:** brand removal is list-driven. An unknown long-tail brand can still be in the 0-volume
  tail. The top 120 clusters by volume were reviewed by eye and are clean; Phase 2 will re-check every keyword it
  assigns to a page.

## 8. Open decisions (I need your answers before Phase 1 and Phase 2)

1. **Homepage keyword conflict.** The workbook says homepage title/H1 = "golf buggy" (12,170/mo cluster). Your saved
   instruction and `keyword-map.md` say "buggies for sale" (710/mo) is the owner-set primary and must lead the
   homepage. These cannot both be the H1. Options: keep "buggies for sale" in the title and H1 and use the "golf
   buggy" cluster in the H2, meta and body (my recommendation, it respects your rule); or switch the H1.
2. **"Carts" versus your Buggies-not-carts rule.** 11,164 of 14,933 clusters are cart-type, including "golf carts for
   sale" (5,210/mo). Your catalogue does include riding buggies, so the brief allows them, but `CLAUDE.md` says use
   "Buggies". Do you want cart terms used in page copy, or kept to metadata and a few supporting mentions only?
3. **Informational-only keywords (3,841) and unclassified (9,564)** are unusable under the strict intent rules.
   This includes "golf caddy" (1,000/mo), "mgi zip x5" (170) and "golf buggy dimensions" (110). Allow informational
   brand/model terms on spec and FAQ pages, or stay strict?
4. **Used and second-hand (2,903 removed).** You sell reconditioned stock and take trade-ins (existing guides cover
   both). Keep them out, or reinstate for the reconditioned and trade-in pages only?
5. **Parts (3,335 removed).** You have an Accessories & Spare Parts category (16 SKUs). Keep parts out, or reinstate
   for that one category?
6. **City pages.** The workbook proposes `/golf-buggies-for-sale/<city>/`. The site already has delivery-only pages
   at `/delivery/<city>/` for Gold Coast, Brisbane, Sydney, Melbourne, Adelaide and Perth (one depot, no local
   presence, no transit promises). New URLs would duplicate and cannibalise those. Recommendation: extend the
   existing delivery pages with the city keywords. Which further cities do you actually deliver to and want built?
7. **Competitor terms (1,636) and junior (263)** are held: comparison/alternatives content only, and the junior
   coming-soon page only. Confirm.
8. **Existing keyword ownership.** 62 product pages and 45 of 71 guides already carry a primary keyword, and your
   one-keyword-one-page rule applies. Phase 1 will reconcile against these rather than overwrite them blindly.
9. **Scope and format.** This is a Next.js site, so I will edit the source in place (no "complete files" dump), add
   301s in `next.config.ts`, and add a `tags` field to products (none exists). Phases 1 and 2 touch 62 products, 71
   guides, all category/brand/delivery pages and the homepage; I propose doing Phase 1 (audit) first and stopping
   for your review, then Phase 2 in batches, each verified and deployed separately.

## 9. Files in this folder

* `keyword-bank-clean.csv`: 14,933 clusters (primary, volume, KD, CPC, intent, source, page-type flags, type,
  stocked-brand flag, variants, cluster total volume).
* `keyword-removed.csv`: every removed or held keyword with volume > 0 and its reason.
* `_stats.json`: the counts above. `tools/`: the scripts that produced everything.
