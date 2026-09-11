# Keyword Map — The Buggies Express

> **Superseded in part, 2026-09-10.** A full Semrush export (59 files,
> 1,147,454 rows) has since been analysed. The page-by-page assignments below
> still hold, but the authoritative pool is now:
>
> - **`docs/keyword-reserve.md`** — the 11,565 targetable keywords not yet
>   assigned to any page, grouped by intent then cluster. Draw from here.
> - **`src/config/site.ts`** — every assigned keyword now lives on the page
>   that owns it, as `primaryKeyword` and `supportingKeywords`.
>
> Headline numbers from that analysis: 118,875 unique keywords de-duplicated,
> 12,102 survived the relevance filter (299,150/mo), and 537 are assigned
> across products, brands and articles. The largest single cut was 28,821
> keywords that were not about the vehicle at all — the export dragged in the
> whole golf retail category, including "golf clearance outlet" at 40,500/mo.

**Source:** Semrush AU exports (2026-09-06) → `docs/keyword-research/`
**Dataset:** 72 keywords · 30,160 combined AU monthly searches
**Split:** 38 commercial (19,440) · 30 transactional (10,000) · 4 mixed/informational (720)

Every keyword below is assigned to exactly ONE canonical page. Where a term is
also served by a supporting page, that page is listed as *support* — it links to
the canonical target, it does not compete with it.

**Rule:** this file never ships. It lives in `docs/`, outside the build output.

---

## 1. Home — `/`

Head terms and brand-level demand. The homepage H1 carries "golf buggy"; these
are the terms it must keep owning.

> **Fixed 2026-09-10 — the H1 keyword was not machine-readable.**
> `StaggeredHeading`/`StaggeredParagraph` split copy into one `inline-block`
> span per word and spaced them with `mr-[0.28em]`. It *looked* right, but
> there was no space character anywhere in the markup, so the homepage H1
> resolved to `Australia'sMostCompleteGolfBuggySpecialists…` in both
> `textContent` and `innerText`. No crawler or extractor could match "golf
> buggy" — the primary 6,600/mo term — in the site's most important heading,
> and the same applied to every heading and paragraph on every page.
> The spacing is now a real text node. Never reintroduce margin-only word
> spacing in those components.

| Keyword | Vol | KD | Intent | Role |
|---|---:|---:|---|---|
| golf buggy | 6,600 | 11 | Commercial | **primary** |
| golf cart | 5,400 | 39 | Commercial | secondary (H1 pairs both) |
| buggies golf | 2,900 | 12 | Commercial | variant — natural in brand name |
| golf buggy sales | 390 | 6 | Transactional | secondary |
| golf cart sales | 90 | 6 | Transactional | variant |
| sales golf carts | 90 | 8 | Transactional | variant |
| golf buggy australia | 110 | 6 | Commercial | national signal |

**Cluster: 15,580/mo.** Highest-value real estate on the site. `golf cart` at
KD 39 is the hardest head term in the set — a long-term hold, not a quick win.

---

## 2. Shop hub — `/shop`

The whole "for sale / buy / price" transactional block. This page is the
commercial engine.

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| golf carts for sale | 2,400 | 17 | Transactional |
| golf buggy for sale | 1,900 | 10 | Transactional |
| golf cart for sale | 1,300 | 8 | Transactional |
| golf buggies for sale | 480 | 13 | Transactional |
| golf buggy sale | 320 | 10 | Transactional |
| golf cart sale | 70 | 11 | Transactional |
| buy golf cart | 210 | 17 | Transactional |
| buy golf buggy | 90 | 9 | Transactional |
| golf carts for sale australia | 110 | 21 | Transactional |
| golf cart price | 170 | 8 | Transactional |
| low price golf carts | 110 | 5 | Transactional |
| new golf carts for sale | 90 | 25 | Transactional |
| new golf buggies | 90 | 4 | Commercial |
| golf carts for sale near me | 170 | 13 | Transactional |
| golf cart for sale near me | 90 | 12 | Transactional |

**Cluster: 7,600/mo.** Uniformly low KD (4–25) against high transactional
volume — the best effort-to-return ratio on the site.

> The two "near me" terms (260/mo) resolve on local signals, not page copy.
> They are answered by the Yatala QLD depot address plus `areaServed` in the
> Store schema, not by writing "near me" anywhere. See gap **G1**.

---

## 3. Electric sub-cluster — `/shop`

Support: `/blog/how-to-choose-the-right-electric-golf-buggy-in-australia`

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| golf buggy electric | 390 | 41 | Commercial |
| electric golf buggy for sale | 390 | 27 | Transactional |
| electric golf carts for sale | 260 | 6 | Transactional |
| electric golf buggies for sale | 210 | 32 | Transactional |
| electric golf cart for sale | 210 | 5 | Transactional |
| electric carts for sale | 170 | 6 | Transactional |
| electric golf buggy australia | 90 | 21 | Commercial |

**Cluster: 1,720/mo.** Note the KD spread: the "for sale" variants sit at
KD 5–6 while the bare commercial forms hit KD 27–41. Prioritise the
transactional variants.

---

## 4. Category pages

### `/shop/walk-behind-buggies` — the biggest category opportunity

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| golf trolley | 880 | 11 | Commercial |
| golf push buggy | 480 | 11 | Commercial |
| motorized golf buggy | 320 | 39 | Commercial |
| golf buggy remote | 320 | 5 | Commercial |
| three wheel golf buggy | 210 | 11 | Info/Trans |
| motorised golf buggy for sale | 170 | 17 | Transactional |
| battery golf buggy | 140 | 42 | Commercial |
| foldable golf buggy | 110 | 9 | Commercial |
| junior golf buggy | 110 | 11 | Commercial |
| push golf buggy for sale | 90 | 8 | Transactional |
| remote control golf buggies | 90 | 17 | Commercial |
| remote control golf buggy for sale | 50 | 2 | Transactional |
| remote control golf buggy australia | 40 | 5 | Commercial |
| folding golf buggy australia | 20 | 7 | Commercial |
| best push golf buggy australia review | 20 | 19 | Commercial |

**Cluster: 3,050/mo** across 15 keywords, most at KD < 20 — the strongest
single-category cluster in the dataset. Six products currently sit here.

Support posts already published (all should link up to the category):

- `/blog/remote-control-golf-buggy-australia-buyers-guide`
- `/blog/best-push-golf-buggy-australia-3-wheel-vs-4-wheel-review`
- `/blog/foldable-golf-buggy-buyers-guide-boot-space-weight`
- `/blog/best-golf-trolley-australia-push-motorized-remote-comparison`
- `/blog/motorised-vs-push-golf-buggy-health-stamina-benefits`

> `junior golf buggy` (110/mo) is listed here for scale only. It is assigned to
> `/shop/junior-golf-buggies` (below), not to this page, and no walk-behind
> model may be described as junior — see gap **G4**.

### `/shop/junior-golf-buggies` — coming-soon category (no products yet)

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| junior golf buggy | 110 | 11 | Commercial |
| kids golf buggy | 110 | 7 | Commercial |
| kids golf cart | 90 | 24 | Commercial |
| childrens golf buggy | 40 | 10 | Commercial |
| junior golf buggy australia | 20 | — | Commercial |
| junior golf carts for sale | 20 | — | Transactional |
| junior golf buggies | 20 | — | Commercial |

**Cluster: 410/mo** across 7 keywords.

Owner-initiated on 2026-09-11 ("stay connected, coming to you soon"). The
page carries `comingSoon: true` in `CATEGORIES`: CategoryClient swaps the
catalogue for a register-interest form, the filter chip is hidden, and the
header/footer links carry a "Coming soon" tag. Intro, four sections and six
FAQs target the cluster **without stating a date, price, model or
specification** — none is final, and inventing one breaks the
no-fabricated-facts rule. `junior golf buggy` moved here from the guide;
the guide now leads on `junior golf trolley` and links up to this page.

Support post: `/blog/junior-golf-buggy-australia-guide`.

### `/shop/batteries-chargers` and `/shop/accessories-spare-parts`

(Split from the former `/shop/batteries-chargers-parts` — see gap **G3**.)

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| golf buggy accessories australia | 110 | 11 | Commercial |
| mgi golf buggy accessories | 90 | 9 | Nav/Trans |
| triumph golf buggy accessories | 70 | 8 | Commercial |
| golf buggy spares | 30 | 1 | Commercial |
| big max golf buggy spare parts australia | 30 | 7 | Informational |
| smoothy golf buggy spare parts | 30 | 4 | Commercial |
| universal golf buggy accessories | 30 | 7 | Commercial |
| golf buggy spare parts | 20 | 0 | Commercial |
| electric golf buggy parts | 20 | 6 | Commercial |
| electric golf buggy spare parts | 20 | 0 | Commercial |
| electric buggy parts | 20 | 0 | Commercial |
| electric golf buggy accessories australia | 20 | 6 | Commercial |
| electric golf trolley accessories | 20 | 4 | Commercial |
| buggy parts near me | 20 | 6 | Transactional |
| golf car accessories | 20 | 6 | Commercial |
| golf club car accessories | 20 | 4 | Commercial |

**Cluster: 570/mo** across 16 keywords at KD 0–11 — the lowest-difficulty
block in the entire set. Low individual volume, but 25 products already sit
in this category and almost nothing competes for these terms.

Support: `/blog/must-have-golf-buggy-accessories-and-spares-australia`,
`/blog/mgi-golf-buggy-accessories-guide-australia`,
`/blog/electric-golf-buggy-troubleshooting-and-replacement-parts`

> Three keywords name third-party brands the site does not stock
> (`triumph`, `big max`, `smoothy` — 130/mo combined). Only target these if
> those spares are genuinely carried. Brand-integrity rule: no implied
> stockist relationship that does not exist.

### `/shop/traditional-2-seater`

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| 2 person golf cart | 20 | 0 | Commercial |
| 2 seater golf cart price | 20 | 0 | Transactional |
| 1 seater golf cart for sale | 20 | 3 | Transactional |

**Cluster: 60/mo.** KD 0–3. Thin, but free.

### `/shop/luxury-4-seater`

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| 5 passenger golf cart | 20 | 0 | Commercial |
| 5 seater golf cart | 20 | 0 | Commercial |

**Cluster: 40/mo.** Both terms imply 5+ seats. The category is named
4-Seater. Confirm actual seat counts on the Evolution D5 Ranger 4+2 and the
Tara Roadster 2+2 before writing any "5/6 seater" copy — state the real
configuration, never round up.

Support: `/blog/buying-a-4-seater-golf-buggy-in-australia-rules-and-guide`

### `/shop/off-road-4x4`

No direct keyword support in this dataset. Served by
`/blog/lifted-4x4-golf-carts-acreage-and-farm-performance` and
`/blog/heavy-duty-off-road-golf-buggy-rural-acreage-guide`.

### `/shop/commercial-utility`

No direct keyword support in this dataset. Served by
`/blog/commercial-utility-golf-buggies-resorts-and-industrial-parks` and
`/blog/electric-utility-buggy-price-guide-australia`.

### `/shop/mechanical-petrol`

No direct keyword support in this dataset. Category exists for range
completeness, not search demand.

---

## 5. Delivery / service area — `/delivery`

Added to close gap **G1**. Holds the local Gold Coast term plus the national
and "near me" intent that no other page could carry.

| Keyword | Vol | KD | Intent |
|---|---:|---:|---|
| golf carts gold coast | 210 | 6 | Commercial |
| golf carts for sale near me | 170 | 13 | Transactional |
| golf cart for sale near me | 90 | 12 | Transactional |
| buggy parts near me | 20 | 6 | Transactional |
| golf carts for sale australia | 110 | 21 | Transactional |
| golf buggy australia | 110 | 6 | Commercial |

**Cluster: 710/mo.** The last three are shared with `/shop` and `/` — those
pages stay canonical for them; `/delivery` reinforces the geographic signal
rather than competing.

**Facts this page is allowed to state** (confirmed by the owner, 2026-09-10):
single depot at Yatala QLD 4207 in the Brisbane–Gold Coast corridor;
delivery nationwide to every state and territory; overseas orders possible
by arrangement, quoted case by case. There is **no second location and no
branch network** — the page must never imply one. Freight is quoted per
order (`SHOP.shippingNote`), never advertised as a flat or free rate.

---

## 6. Blog — assigned keywords

| Keyword | Vol | KD | Canonical post |
|---|---:|---:|---|
| second hand golf carts for sale | 170 | 8 | `buying-second-hand-golf-carts-in-australia-checklist` |
| club car golf carts for sale | 140 | 9 | *unassigned* — see gap **G2** |

Every other published post supports a cluster above rather than owning a
keyword of its own. 26 posts are live; 24 of them are support assets.

---

## 7. Excluded — deliberately not targeted

| Keyword | Vol | Why excluded |
|---|---:|---|
| gold carts | 390 | Misspelling of "golf carts". Cannot be placed in copy without the page reading as broken. Google's own correction handles it. |
| golf and carts | 590 | KD 35, ambiguous intent, no clean page fit. Revisit only if a genuine editorial angle appears. |
| golf buggy repairs perth | 20 | The business operates from Yatala QLD. Claiming a Perth service presence would be a fabricated fact. |
| golf club attachment for stroller | 20 | Irrelevant to the product range. |

---

## Coverage gaps — ranked

### G1. `golf carts gold coast` — 210/mo, KD 6 — ✅ CLOSED

The single best uncovered term. Yatala QLD 4207 sits in the Brisbane–Gold
Coast corridor, so this is a **factual** local claim, not a stretch. There is
currently no service-area page to hold it, and it also answers the two
"near me" terms (260/mo) that page copy alone cannot reach.

**Action:** a service-area page, or a homepage depot/coverage section, stating
the real Yatala location and the regions genuinely serviced. Nothing
invented — no second location, no branch.

### G2. Brand-model queries — `club car golf carts for sale` 140/mo, KD 9

Club Car is the most-stocked brand on the site (9 products), followed by
MGI (6), E-Z-GO (6), Yamaha (5), LVTONG (5), Evolution (5), Tara (4). There is
no brand hub route — brand demand currently has nowhere to land except
individual product pages.

**Action:** consider `/shop/brand/[brand]` derived from `PRODUCTS`, the same
way categories are. Config-driven, no hand-written pages.

### G3. Accessories and batteries share one page — CLOSED

16 accessory/spares keywords (570/mo) and all the battery/charger products
collapsed onto `/shop/batteries-chargers-parts`. The category held 26
products — the largest on the site — against the lowest-KD keyword block.

**Resolved.** Split into `/shop/batteries-chargers` (10 products, the battery
and charger cluster) and `/shop/accessories-spare-parts` (16 products, the
accessories/spares cluster). Each has its own title, description, intro, four
body sections and five guide links.

Because product URLs are built as `/shop/<category>/<product>/`, the split
moved 26 live URLs. All 26, plus the old category page, are 308-redirected in
`next.config.ts` — derived from `PRODUCTS` rather than hand-listed, so the map
cannot drift from the catalogue. The old category page points at
`/shop/accessories-spare-parts/`, which inherited its title and 16 of its 26
products.

### G4. `junior golf buggy` — 110/mo, KD 11 — coming-soon category (owner-initiated)

Real demand, no stock yet. Held until 2026-09-11, when the owner asked for a
coming-soon category page carrying the cluster and FAQs while the products
and photos are awaited:

- `/shop/junior-golf-buggies/` is live as a register-interest page (section
  4 above). It takes `junior golf buggy` and six supporting terms.
- `/blog/junior-golf-buggy-australia-guide/` keeps the trolley-phrased terms
  (`junior golf trolley` primary) and links up to the category page.
- Four junior terms remain in `docs/keyword-reserve.md` for the product pages
  when models are added.
- No page states a launch date, price, model or specification. When stock
  lands: remove `comingSoon`, add the products, and reassign the reserve.

### G5. Category meta descriptions are templated

`app/shop/[category]/page.tsx:23` generates every category description from
one string with `cat.name` interpolated. Technically unique, substantively
near-duplicate across all seven categories — a duplicate-content signal, and
it wastes seven chances to place cluster keywords.

**Action:** per-category descriptions carrying that category's own keywords.

---

## Priority order

1. **G1 — Gold Coast / service-area coverage.** 210/mo at KD 6, plus 260/mo of
   "near me" intent, on genuinely factual local ground.
2. **G5 — per-category meta descriptions.** One file, seven strings, unlocks
   the category clusters below.
3. **Walk-behind category depth.** 3,050/mo at mostly KD < 20 — the largest
   winnable cluster, already stocked and already supported by five posts.
4. **G3 — accessories/batteries split.** 570/mo at KD 0–11 against almost no
   competition.
5. **G2 — brand hubs.** 140/mo measured here, but brand-model long-tail is
   systematically under-sampled by keyword tools.
6. **Head terms.** `golf cart` (KD 39) and the electric commercial variants
   (KD 27–41) are a long hold — maintain, do not chase.
