# Proposed additions to the keyword-engine skill

Written after the October 2026 build (40 products, 3 brand pages, 1 category, 10 guides). Each item is a gap between
what the skill says today and what the work actually needed. Nothing here has been applied to the skill yet.

## A. Gaps found when the finished work was checked against the skill

| # | Gap | Evidence from this build | Skill file |
|---|-----|--------------------------|------------|
| 1 | Primary keyword is chosen by Opportunity Score, which over-weights low difficulty | 6 of 40 products got zero- or low-volume primaries (e.g. "mgi seat" 70/mo lost to a 0-volume term). Fixed to volume first, difficulty as tie-break | filter-and-cluster.md, Scoring Rules |
| 2 | No concept of **tags** | 7 keyword tags per product and 10 per guide were needed, unique, relevance-gated | filter-and-cluster.md, page-mapping.md, output-formats.md |
| 3 | Money pages allow Commercial, Question and Navigational secondaries | Brief required T and C only on products, I and N only on guides | filter-and-cluster.md, Secondary Keyword Selection |
| 4 | No "what we actually sell" filter | 800+ exported terms named models, services or brands the site does not offer (repairs, X4, G800, Quad) | filter-and-cluster.md, Filtering Rules |
| 5 | No vocabulary rule | Site rule "buggies, not carts" meant dropping every "cart" keyword from products | filter-and-cluster.md, Geography Filter |
| 6 | No ingestion of the **live site's** existing keywords | 727 mapped keywords plus tags had to be excluded by hand | SKILL.md, Phase 1 |
| 7 | No variant rule | 4 colours of one model shared one keyword family and would compete | page-mapping.md |
| 8 | No supply-versus-need check | 585 keywords needed; the MGI pool was 170 short, found late | filter-and-cluster.md |
| 9 | Internal linking is "2-3 links per page" | Needed one anchored inbound link per keyword, each from a different page, with caps | page-mapping.md, Internal Link Slots |
| 10 | No outbound-link policy | Needed maker, regulator or safety-body sources, a "leak" check and a blocked-site check | ai-visibility.md or new file |
| 11 | FAQ rules cover answer length (40-65 words) but not intent mix per page type, and nothing checks it | Products had 108 of 612 answers over 65 words; new guide answers had 50 of 74 under 40 words | content-planning.md, audit-mode.md |
| 12 | No catalogue-name verification | Image file names carried no product titles; exact names came from the maker's catalogue | new intake step |
| 13 | Output set stops at 5 docs | Reuse next time needs a used-keywords register, link plan and FAQ-intent table | output-formats.md |

## B. Text to add

### SKILL.md: new Phase 0, "Existing-site ingestion"
Before Phase 1, when the site already has pages, load every keyword the site already uses (page map, product keywords,
tags, category and brand terms, FAQ questions) into a **used-keywords register** (`used-keywords.csv`). Every later phase
checks it. A keyword may appear in the register once, as a primary, a secondary, or a tag. Report how many incoming
keywords were removed because they are already used.

### SKILL.md / filter-and-cluster.md: new filters in Phase 1
- **Offer allowlist.** Ask for the list of products, services and brands actually offered. Drop keywords that name anything
  else (other models, other brands, repairs or servicing if not offered, second-hand if not sold).
- **Vocabulary rule.** Ask for banned or required words (for example "buggies" not "carts"). Apply to money-page keywords.
- **Competitor and noise lists** are produced from the export, shown to the user, and then applied.

### filter-and-cluster.md: replace the primary-selection rule
> The primary keyword is the term with the **highest real search volume** among keywords that pass the filters and the
> page's allowed intents, with **lowest difficulty as the tie-break**. A term with no volume data, or volume of 0, is never
> a primary while a term with real volume exists. The Opportunity Score is used to order candidates within a tier and to
> rank secondaries, not to pick the primary.

### filter-and-cluster.md: page-type intent matrix (configurable, default shown)
| Page type | Primary and secondary intents | FAQ intents |
|---|---|---|
| Product / service / category | Transactional, Commercial | 3 T and 3 C |
| Brand hub | Navigational, Commercial | 2 N, 2 C, 1 T |
| Guide / blog | Informational, Navigational | 2 I, 1 N, 1 C, 1 T |
The user may override the matrix in Session Startup. Question-intent keywords feed FAQs, never secondaries on money pages.

### filter-and-cluster.md: new "Tags" section
- Tags are keywords: 7 per product page, 10 per guide, unique across the site, never equal to a primary or secondary.
- A tag must pass a relevance gate (it names the product, its model family or its use) and a noise gate (no place names,
  typos, other brands, models not offered, informational problems on money pages).
- Real-data tags first, then generated model-specific tags, always labelled.

### filter-and-cluster.md: new "Supply versus need" check (before assignment)
Print a table: pages x (1 + 5 + tags) = keywords needed, against the cleaned pool per family or brand. Show shortfalls and the
supplementation plan **before** assigning, and report the real-versus-generated ratio at the end.

### page-mapping.md: variant rule
When several pages are variants of one product (colour, size), do not give each a full keyword set from the same family.
Offer a single page with options, or give variants model-and-variant-specific terms only, and flag the cannibalisation risk.

### page-mapping.md: replace "Internal Link Slots" with the **Inbound Anchor Map**
1. Each target page receives one inbound link per assigned keyword (primary and secondaries), each from a **different** page.
2. The anchor text is that keyword. Links go on other pages, never as self-links. Max one anchor per target per page.
3. Candidate sources, in order: category hub, brand page, guides that cover it, sibling pages, complementary pages.
4. The primary is anchored from the strongest source (category hub or brand page).
5. Caps keep text natural (default: hubs 8, brand pages 10, guides 12, product pages 4 outgoing). Rank targets by primary volume
   so high-volume pages get the hub slots; others use siblings and guides.
6. Output `link-plan.csv` (target, anchor, intent, source, source type) and verify after build that every row renders.

### New: Outbound Source Policy
- Allowed: the maker's support or manual pages, regulators, safety bodies, standards bodies. Editorial or reference sites only
  when the owner approves, used sparingly.
- Not allowed: link directories, link exchanges, paid links, affiliate pages.
- Leak check: if a source sells the same product, do not link to its shop pages. Prefer support and manual pages. Ask the owner.
- Every URL must return 200; for sites that block scripts, confirm by search and mark "blocked, confirmed by search".
- State plainly to the user that outbound links support trust and accuracy but do not pass authority; authority needs inbound
  links, and list the owner-only actions (supplier listings, business profiles, citations).

### content-planning.md: FAQ intent matrix and gates
- Use the matrix above. Questions carry their intent label in `faq-intents.csv`.
- Answer length gate: 40-65 words, checked on the rendered page. Flag any answer outside the range.
- No price figures inside guide answers (they drift); link to the product instead.
- Run the FAQ-level cannibalisation registry across product, brand and guide pages together.

### SKILL.md: new final phase, "Verification gates"
Before delivery: used-keywords register has no repeats; every primary is the maximum-volume valid term; every link-plan row
renders; every outbound URL returns 200 or is marked blocked; FAQ counts, intents and lengths pass; one H1 per page; 380px
no overflow; pages appear in sitemap and llms.txt.

### output-formats.md: add outputs
`used-keywords.csv` (register), `tags.csv`, `link-plan.csv`, `faq-intents.csv`, and a `supply-vs-need.md` table.

### audit-mode.md: add Audit Phase checks
Primary-versus-maximum-volume check, link-plan render check, FAQ intent mix and length audit, tag uniqueness, outbound URL status.

## C. Bank updates already made for conformity (this repo)
- `phase0/keyword-bank-clean.csv`: +923 clusters from the October 2026 exports, flagged `new-2026-10`.
- `final/keyword-to-page-map.csv`: +320 rows (40 products, 3 brand and category pages, 10 guides).
- `phase2/product-keywords.csv` +240 rows, `phase2/product-tags.csv` +280 rows.
- `final/used-keywords.csv`: new consolidated register (1,871 keywords) for the next session to load first.
