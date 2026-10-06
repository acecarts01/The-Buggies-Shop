# Phase 2, Batch 3: 62 product pages and the product data model

Built and verified 2026-10-07. Per-product tables: `product-keywords.csv` (role, keyword, cluster id, volume,
intent) and `product-tags.csv` (every tag with its source: a bank cluster id and volume, or "spec sheet").

## Data model

* `ProductDetails` (`src/config/product-details.ts`, server-only) gains **`tags: string[]`** (10 to 14 per product,
  62/62 meet it: min 10, max 14; 264 of 814 tags map to a bank cluster, the rest are descriptors taken from the
  product's own spec sheet, audience and type). Tags render on the page and join the Product JSON-LD `keywords`.
* **FAQs are no longer stored 62 times.** `src/config/product-faqs.ts` builds them from each product's own price,
  specs, audience and nearest-priced sibling (4 to 6 per product). A product can still carry hand-written `faqs`.
  `PRODUCT_DETAILS` shrank from 2,396 to about 1,280 lines; the build still throws on a product without an entry.
* New `lib/product-meta.ts` gives the templated route and the bespoke Atlas route one title/description builder.

## Keywords

* 54 of 62 products have a declared primary keyword from the cleaned bank; 125 supporting keywords. **Every
  cluster is owned by exactly one page** across products, categories, hub and delivery pages (the script refuses
  duplicates).
* Fixed: the 10 Navigational-intent primaries (for example "atlas golf carts", "club car golf carts australia")
  and the 14 accessory/battery pages that declared parts keywords or competitor brands ("thomson golf buggy
  parts", "proline golf buggy parts", "easy go golf cart parts", "1010 golf cart parts", "golf cart charger
  parts" and the like). Brand-and-model terms ("club car tempo for sale", "ezgo express s4 for sale") now lead.
* **8 products have no declared primary keyword**, deliberately: solenoid, windshield, brake kit, tow hitch,
  soundbar, glove box, sand bottle and the RoyPow 72V pack. The bank holds only parts terms for them, which
  Phase 0 removed under your "keep parts out" recommendation. They keep tags. Reinstating parts terms for the
  accessories range alone would fix this (open decision 5 from Phase 0).

## Page changes

* Title: "<model> for Sale | Buggies Express" (falls back to shorter forms to stay within 60 characters).
* Meta description leads with the primary keyword, then price and specs.
* New opening sentence under the H1 carries the primary keyword (so it is in the first 100 words).
* **Generic claims removed.** Every product page showed the same four-pillar grid claiming an e-coated steel
  ladder frame, double A-arm suspension and "3-5 year factory warranties" regardless of what the product was
  (including a tow hitch). It is replaced by that product's own spec list. Also removed: "Yatala 3-5 Year
  Australian Factory Backed" and "hydraulic tailgate delivery", neither of which is supported by anything in the catalogue; tell me if either is true and I will restore it.
* Delivery, payment and warranty now appear once, in a shared block, instead of inside four FAQ answers.
* Each product links to four buying guides for its range with descriptive anchors (the hub now links down;
  before, none of the 62 product pages linked to a guide). The Atlas flagship (its own layout) gets the same
  tags, block and guides.

## Verification

Clean build, `npm run crosscheck` OK (175 pages). All 62 pages: one H1, title <= 60, description 120 to 158,
JSON-LD parses, 10+ tags, 4+ guide links. Sentences shared across 4+ pages in the authored copy (description and
FAQs): about 35 percent of sentences (Phase 1, whole page) to 13.7 percent now. The whole-page figure is still
higher because customer reviews, the "related vehicles" cards and the site-wide trust box repeat by design.

## Left as is, on purpose

* The H1 stays the model name (a keyword H1 on a product page reads as stuffing); the primary keyword is in the
  meta description and first sentence instead, and in the title where the model name allows.
* Customer review text (including reviews that appear on more than one product page) is untouched.
* `fullDescription` copy is unchanged; it was already page-specific.
