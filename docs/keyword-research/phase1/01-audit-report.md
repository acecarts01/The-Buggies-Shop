# Phase 1 audit: current state of the live site

Audited 2026-10-06 from the production build: **174 pages built, 169 indexable** (5 are noindex utility pages).
Per-page data for every one of them is in `page-audit.csv` (title, description, H1, word count, declared keyword,
cluster, intent check, keyword placement, schema, links, images). Nothing on the site has been changed.

Decisions applied (your "go with your recommendations"): "buggies for sale" leads the homepage title and H1; "golf
buggy" is carried in the H2, meta description and body; cart vocabulary stays out of headings (metadata and a few
supporting mentions only); used, parts and informational-only terms stay out of **new** targeting; city keywords
extend the existing `/delivery/<city>/` pages.

## 1. What already passes (no work needed)

| Check | Result |
|---|---|
| Missing / over-60-character titles, missing / out-of-range descriptions | 0 / 0 |
| Pages without exactly one H1, or with no H2 | 0 |
| Duplicate titles, descriptions or H1s | 0 |
| Canonical self-referencing, og:url matches, `lang="en-AU"` | 169 / 169 |
| JSON-LD blocks that fail to parse | 0 |
| Broken internal links | 0 |
| Images with missing or empty alt text | 0 of 676 |
| Sitemap vs built pages | 169 URLs, exact match, nothing missing or extra |
| FAQPage schema | every product, guide, brand and city page, the homepage and /faq |
| Product schema | Product + Offer + BreadcrumbList on 62/62; image, SKU, description and keywords on 62/62 |

## 2. Findings, in priority order

### P1. Money pages are not carrying the keywords they should

1. **Product pages (62).** The declared primary keyword is in the title or H1 on **1 of 62**; titles and H1s are the
   model name only. The declared keywords are also poor fits: 10 break the intent rules (Navigational on a product
   page), most use cart vocabulary ("atlas golf carts"), and **14 accessory and battery pages declare parts keywords
   that do not match the product**, for example the side-mirrors page targets "golf cart charger parts", the sand bottle
   targets "easy go golf cart parts", the PVC enclosure targets "proline golf buggy parts" and the tow hitch targets
   "thomson golf buggy parts" (competitor brands you do not stock).
2. **The Top 14 are largely not carried where the workbook intends.** Strict phrase check on the target pages:

   | Keyword | Target page | In title / H1 / meta / first 100 words |
   |---|---|---|
   | golf buggy | `/` | no / yes / yes / yes (16 uses; title says "Golf Carts") |
   | buggies for sale (owner-set) | `/` | yes / yes / yes / yes |
   | golf buggy for sale, golf buggy sales | `/shop/` | **none of the four, 0 uses** |
   | electric golf buggy (3,290/mo cluster), electric golf buggy for sale | no money page exists | owned only by one guide |
   | golf push buggy, remote control golf buggy | `/shop/walk-behind-buggies/` | no / no / no / no (push: one body mention; remote: one H2) |
   | golf trolley | walk-behind category | yes / no / yes / yes |
   | golf buggy accessories | accessories category | yes / yes / yes / yes |
   | golf buggy for sale brisbane | `/delivery/brisbane/` | nowhere on the site (page targets "golf carts for sale qld") |
   | golf carts for sale, electric golf cart | `/shop/` | none (consistent with decision 2) |
3. **Category pages are thin and unfocused.** Five of nine (luxury 4-seater, 2-seater, off-road, commercial utility,
   petrol) are 247 to 262 words with a single H2. Eight of nine have no declared primary keyword and no FAQ section
   (the other three categories have six H2s and 579 to 804 words, so the pattern is known to work). `/shop/` is 440
   words with one H2, no FAQ and no declared keyword.
4. **No declared keyword at all** on 26 of 71 guides (the older ones), 8 categories, and the 10 hub and static pages.

### P2. Cannibalisation and intent-rule breaches

* **Eight guides declare Transactional keywords**, which your rules forbid on blog pages: the five metro buyer guides
  ("golf carts for sale brisbane / melbourne / perth / adelaide / nsw"), Canberra, "how much is a golf cart", and
  "second hand golf buggies for sale".
* **Those five metro guides compete with the five delivery city pages** for the same city + "for sale" search.
* **Clusters owned by more than one page:** Melbourne (guide vs delivery page), `powakaddy golf buggy` (guide vs brand
  page), `atlas golf carts` (brand page plus two product pages), and "spare parts" on two products.
* **49 supporting-keyword clusters are reused across pages**, which breaks one-cluster-one-page.
* Delivery pages for Brisbane, Gold Coast and Melbourne use cart vocabulary in the H1 and title, against decision 2
  (Sydney, Perth and Adelaide already use "buggy").

### P3. Keyword-source hygiene

* Of 125 declared keywords, **50 sit outside the cleaned bank**: 27 were removed in Phase 0 (15 parts, plus used,
  junior, competitor-brand, informational and unclassified terms) and 23 have no Semrush volume. Nineteen of those 23
  are guide topics, most from the 20 guides I added last month (sensible editorial gaps, but not validated by search
  data); the other four are brand pages (Cushman, LVTONG, Robera, Tara).
* Five guides about used, second-hand and reconditioned buggies target "used" terms, which the strict rules remove.
  The pages are useful and exist; I will **leave their copy and keywords alone** (see open decision C).

### P4. Content quality and linking

* **Boilerplate on product pages:** on average 35% of sentences (up to 50%) appear on four or more other product
  pages. One delivery sentence is on 54 of 62; the freight, inspection and warranty sentences are on 31 to 36 each.
  Brand pages share 29%, city pages 11%.
* **Keyword density already over 1% on six pages:** junior coming-soon page 4.14% (10 uses), golf-caddy guide
  1.83%, golf car vs buggy vs cart 1.54%, electric buggy guide 1.32%, Gold Coast 1.19%, electric complete guide
  1.05%. These need trimming in Phase 2.
* **Hub and spoke runs one way.** All 71 guides link to the shop; **none of the 62 product pages link back to a
  guide**. 27% of the 1,592 shop and guide links use generic anchors ("Read", "View Full Specs").
* **Orphans (no inbound link anywhere):** `/crypto-payment/`, `/wholesale/`, and four accessory pages (sand bottle,
  glove box, seatbelts, soundbar). Two more pages (one category, one static) are reachable from navigation only.
* Thin static pages: `/contact/` 163 words, `/faq/` 170, `/wholesale/` 230 (the FAQ page's answers live in its schema
  and accordions, so its low count is partly structural).

### P5. Minor technical

* `/contact/`, `/wholesale/` and `/crypto-payment/` have no BreadcrumbList schema.
* 13 of 62 Product schemas have no `brand` (accessories without a mapped maker).
* **No product has a `tags` field.** Each product carries exactly six supporting keywords, which are not shown as
  tags. The 10 to 14 tags per product must be added as new data.

## 3. Phase 2 plan, in batches (each verified and deployed on its own)

| Batch | Scope | Main changes |
|---|---|---|
| 1 | Homepage, `/shop/`, 9 categories | Titles, H1s, metas and H2s for the Top 14; expand five thin categories; add FAQ sections and schema; declare a primary keyword per page |
| 2 | 6 delivery pages + hub | Buggy vocabulary in H1/title, add the Top 14 and city variants, differentiate from the metro guides |
| 3 | 62 products + data model | New `tags` field (10 to 14 true tags each, from the bank), correct the mismatched declared keywords, cut boilerplate, link each product to its guides |
| 4 | 11 brand pages, 71 guides | Declare keywords for the 26 undeclared guides, retarget the 8 Transactional ones, fix cannibalisation, trim over-density pages, descriptive anchors |
| 5 | Orphans, breadcrumbs, 301s | Link the 6 orphans, add missing breadcrumbs, redirects for any URL changed |

Every batch ends with the stuffing audit, the intent-compliance matrix, a build and crosscheck, and a live check.

## 4. Open decisions before Phase 2

A. **Electric hub.** "Electric golf buggy" (3,290/mo) and "for sale" (780/mo) have no money page. I recommend a new
   `/shop/electric-golf-buggies/` landing page (curated lithium models across categories, own copy and FAQ). It adds a
   route but changes none. Yes or no?
B. **The five metro guides.** Recommended: keep them, retarget to Commercial terms (what to check when buying in that
   city) and point their call to action at the delivery page. The alternative is to merge them into the delivery pages
   with 301 redirects. Which?
C. **Used and reconditioned guides.** Recommended: keep as they are, grandfathered, with no new used-term targeting.
   Confirm?
D. **Cities.** Delivery pages exist for six cities. Which others, if any, do you deliver to and want built
   (Canberra, Hobart, Darwin, Cairns, Newcastle...)? Cairns is already named in your service footprint.
E. **Cadence.** Five batches, each deployed after verification, or one large release at the end?
