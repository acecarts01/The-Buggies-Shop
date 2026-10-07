# Phase 2, Batch 4: 11 brand pages and 71 guides

Built and verified 2026-10-07. Keyword rules as before: money pages (brands) use Transactional or Commercial
bank terms, guides use Navigational or Commercial, every cluster belongs to one page.

## Result in numbers

| Check | Before | After |
|---|---|---|
| Guides with a declared primary keyword | 45 of 71 | **65 of 71** |
| Declared keyword in the meta description / first 100 words (guides) | 7 / 4 of 45 | **65 / 65 of 65** |
| Declared keyword in the title (guides) | 19 of 45 | 27 of 65 |
| Transactional keywords on guides | 8 | 1 (the grandfathered second-hand guide) |
| Clusters declared by more than one page, site-wide | 49 supporting clusters reused | **0** (429 declared clusters) |
| Guides over 1% keyword density | 4 | 0 |
| Generic anchors ("Read", "View Full Specs", "Compare Fleet", "Tour Fleet Flagship") in the page body | 283 on guide pages alone | 0 |
| Brand pages: keyword in meta and first 100 words | 0 of 11 | 9 of 9 that have a keyword |

## Brand pages

* Primaries re-based on the bank: club car golf carts, mgi electric golf buggy, ezgo golf buggy, yamaha golf carts
  for sale, buy evolution golf cart, atlas golf carts near me, powakaddy trolley, cushman electric cart for sale,
  robera golf trolley. Navigational primaries ("atlas golf carts", "evolution golf carts australia") and parts
  keywords ("club car golf cart parts", "yamaha golf buggy parts") are gone.
* **LVTONG and Tara have no declared keyword**: the bank holds none for LVTONG and every Tara cluster belongs to a
  product page.
* The six identical FAQs (parts, warranty, delivery and so on, 29% of sentences shared) are replaced by five built
  from the brand's own range (models and prices, cheapest to dearest, which model suits which job, electric
  versus petrol). Delivery and payment sit in the shared block. "Models in stock" now counts vehicles only: the
  MGI page used to say "6 models from $190" because the remote and battery were counted.
* New: keyword lead line, `keywords` metadata, buying guides for the brand, shared delivery/payment/warranty block.

## Guides

* 21 undeclared guides got a primary and up to five supporting keywords from the bank. **Six remain undeclared**
  because the bank offers no clean fit: lithium versus lead acid, lithium conversion cost, winter storage, finance
  and crypto discounts, second-hand checklist (grandfathered), Canberra.
* **Metro guides retargeted (decision B).** Brisbane, Sydney, Perth and Adelaide moved to "electric golf carts
  <city>", Melbourne to "golf carts melbourne", all Commercial; their titles and H1s no longer say "for sale", which
  the delivery pages own. Canberra dropped its 20-a-month Transactional keyword. URLs are unchanged, so no
  redirects are needed.
* "How much does a golf cart cost" now targets "golf cart prices australia" (Commercial).
* The electric complete guide no longer targets "electric golf buggy" (the new electric hub owns it); the
  PowaKaddy vs MGI guide no longer targets "powakaddy golf buggy" (the brand page owns it). The Melbourne and
  atlas/powakaddy overlaps from Phase 1 are closed.
* Kept as they were, on purpose: used and reconditioned guides, parts guide, junior guide, the two competitor
  comparisons (comparison content is where competitor terms are allowed).
* Meta description and the opening line now lead with the keyword when the hand-written excerpt does not
  already contain it (`keywordLead` in `lib/seo.ts`).
* Related guides were the same three newest posts on every guide. They are now ranked by shared tags and category.
* Over-density: the golf car terminology guide fell from 1.54% to under 1% by rewording repeats.

## Anchors

"Read", "Read Guide", "View Full Specs", "Compare Fleet" now carry the guide or product name (visible or
screen-reader text); the "Tour Fleet Flagship" badge moved out of the product image link.

## Verification

Clean build, `npm run crosscheck` OK (175 pages), one H1 per page, title <= 60, description 120 to 158 on all 82
pages, no overflow at 380px on a brand page and a retargeted guide.

## Not done here (Batch 5)

Orphan pages, missing breadcrumb schema on three static pages, redirects for changed URLs (none changed in this
batch).
