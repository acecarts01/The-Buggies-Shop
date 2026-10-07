# Keyword program: final report

Run 2026-10-06 to 2026-10-07 on the live Next.js site. Source of truth for every number: the files in this folder
and `phase0` to `phase2`. Nothing here was written to the live site by hand: all copy is edited in `src/config`
and `app/`, built and verified, then deployed in five batches.

## 1. Deliverables

| Deliverable | File |
|---|---|
| Deduped, clustered, intent-labelled keyword bank (21,448 kept, 14,933 clusters) | `phase0/keyword-bank-clean.csv`, `phase0/keyword-removed.csv` |
| Site audit (174 pages) | `phase1/01-audit-report.md`, `phase1/page-audit.csv` |
| **Keyword-to-page map** (639 rows: every page, primary and supporting keyword, cluster id, volume, KD, intent) | `final/keyword-to-page-map.csv` |
| **Product tag table** (62 products, 814 tags, each with its bank source or "spec sheet") | `phase2/product-tags.csv` |
| Product keyword table | `phase2/product-keywords.csv` |
| **Internal linking map** (see section 3) | `final/internal-linking-map.csv` |
| **Uncovered keywords** (the largest clusters no page owns, with a suggested home) | `final/uncovered-keywords.csv` |
| Change log per batch | `phase2/batch1-report.md` to `batch4-report.md`, this file for batch 5 |
| QA results | section 4 |
| Open decisions | section 5 |

## 2. Change log (all deployed)

| Batch | Commit | Scope |
|---|---|---|
| 1 | e88fd71 | `/shop/` hub, new `/shop/electric-golf-buggies/` (28 models), 5 thin categories expanded to about 900 words with FAQs, walk-behind retargeted, FAQs on batteries and accessories, junior page density trimmed |
| 2 | 30622fc | Six delivery pages lead with "golf buggy for sale <city>", computed range section, extra FAQ, link to city guide |
| 3 | 509598f | 62 products: `tags` field (10 to 14 each), bank-valid keywords one cluster per page, FAQs built from product data, unsupported generic claims removed, guides linked from every product |
| 4 | e069ad7 | 11 brand pages and 71 guides: keywords, retargeted metro guides, no shared clusters, keyword lead in meta and opening line, descriptive anchors |
| 5 | (this batch) | Orphans linked, breadcrumb schema on the last three pages, every model linked in plain HTML from its category, closer related products |

## 3. Internal linking (batch 5)

* **Orphans**: at audit there were 6 pages with no inbound link anywhere in a page body (`/crypto-payment/`,
  `/wholesale/`, and four accessories: sand bottle, glove box, seatbelts, soundbar) plus `/faq/` linked only from
  navigation. Now **0**. Fixes: footer links to wholesale and crypto payment; the delivery/payment block (on every
  product and brand page) links to the FAQ and to crypto payment; the utility category links to wholesale; and
  every category page now lists **all** its models as plain links (the catalogue grid shows 12 at a time, which is
  why the four accessories, all past the first 12, had no crawlable link).
* **Related products** on a product page were the first three in its category, or any item under $1,000. They are
  now the three nearest in price within the category.
* **Hub and spoke**: guides link to the shop (as before), and now every product, brand and category links down to
  its range's guides with descriptive anchors.
* Broken internal links: 0. Pages without BreadcrumbList: 3, now 0.

## 4. QA results (production build, every batch)

* Clean `next build` with no dev server running, then `npm run crosscheck`: OK on every batch (175 pages, 170
  indexable).
* One H1 on every page; titles at most 60 characters and descriptions 120 to 158 on every page checked.
* Every declared keyword unique site-wide: 429 declared clusters, 0 owned by two pages.
* Strict placement (declared primary in meta description and first 100 words): 65/65 guides, 9/9 brand pages that
  have a keyword, 54/54 products with a keyword, all 9 categories, hub and six city pages. In the title: guides
  27/65, most products only where the model name allows (the H1 stays the model name on purpose).
* Density: no page over 1% on prose; product cards repeat the category name, which inflates raw counts on
  category pages only.
* Mobile: no horizontal overflow at 380px on the hub, electric hub, a category, a city page, a brand page, a
  guide and three product pages (vehicle, accessory, Atlas flagship).
* Live checks after each deploy: titles, one H1, new blocks present, sitemap and `llms.txt` carry the electric hub.
  IndexNow pinged after each deploy.
* Copy rules held: "buggy" in headings, cart vocabulary only in metadata and a few mentions; no fabricated facts
  (four unsupported claims removed, see decision 1); ABN link and company details untouched.

## 5. Open decisions for you

1. **Claims I removed from every product page** because nothing in the catalogue supports them: "3-5 Year
   Australian Factory Backed", "3-5 year factory warranties", "e-coated steel ladder frame, double A-arm
   suspension" (a generic four-box grid), and "door-to-door hydraulic tailgate delivery". If any is true, tell me
   which and I will restore it for the products it applies to. The brand FAQs also no longer say "we hold
   <brand> parts in Australian stock" for every brand; confirm which brands you genuinely stock parts for.
2. **Informational brand and model terms.** The biggest uncovered clusters are Semrush "Informational" brand terms:
   mgi golf buggy (2,320/mo), mgi zip navigator (1,880), mgi golf cart (1,090), yamaha golf cart (890). Under the
   strict intent rules they cannot target a shop page. Allowing them on the brand pages would open about 6,000
   searches a month. Recommendation: allow them on the matching brand pages only.
3. **Parts keywords for the accessories range only.** Eight accessories have no declared keyword because the bank
   holds only parts terms for them. Recommendation: reinstate parts terms for `/shop/accessories-spare-parts/` and
   its products.
4. **"golf buggy" (12,170/mo)** is carried by the homepage as supporting copy under your rule that "buggies for
   sale" leads. No other page owns it. Confirm you are happy with that.
5. **Cities.** The bank has no volume for Canberra, Hobart, Darwin or Cairns beyond a 20/mo Canberra term.
   Recommendation: do not build new city pages; the six delivery pages cover the volume.
6. **Six guides still have no keyword** (lithium versus lead acid, lithium conversion cost, winter storage,
   finance, second-hand checklist, Canberra) because the bank has no clean fit. Say if you want me to add
   non-bank editorial terms for them.
7. **Local intent.** "golf cart near me for sale" (640/mo), "golf carts for sale near me" and dealer terms need a
   page that states the depot address and who can collect, not a new city page. Recommendation: a short
   "Visit our Yatala depot" page if you do take collections.
8. **LVTONG and Tara brand pages** have no declared keyword (no clean bank term). Left blank rather than invent one.
9. **Zoho and the database**: unrelated to SEO but still open from earlier: 106 bot rows in `enquiries` are still
   in the database; say if you want them deleted.

## 6. Where the new FAQ and blog content went

No new blog posts were written (71 already exist). New FAQ sets, all with FAQPage schema and built from
catalogue data: `/shop/` (6), electric hub (6), 9 categories (5 each, 6 for electric/junior), 6 delivery cities
(+1 each), 62 products (3 to 6 each, computed), 11 brands (5 each). The top uncovered topics for new guides are in
`uncovered-keywords.csv`.
