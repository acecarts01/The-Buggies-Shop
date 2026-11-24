# Phase 1 audit: gap report against the 26-rule SEO/GEO ruleset

Date: 2026-11-24. Read-only: nothing on the site was changed. Source: a production build served locally (238 sitemap URLs crawled) plus the config files (`product-details.ts`, `posts.ts`, `site.ts`, `tags.ts`, `category-content.ts`).
Buckets: **Fix** (resolved in the owning phase), **Exception** (decided at Phase 1 approval), **Owner input** (needs the owner before the phase that uses it).

## 1. Headline numbers

| Page type | Count | Biggest gap vs the rules | Owner phase |
|---|---|---|---|
| Products | 102 | Description field 52–141 words (median 110) vs exactly 400. All 102 short. | 4 |
| Blog posts | 89 | Body 206–776 words (median 538) vs exactly 1,500. All 89 short. | 6 |
| Brands | 13 (9 indexable) | Intro + body 110–168 words (about 175–250 rendered with the range paragraph) vs 300+. | 5 |
| Tags | 8 | Intro 152–169 words vs 300+ (if held to the category rule). | 5 |
| Categories | 11 | Word counts pass (756–1,643 rendered); exact-keyword placement weak. | 5 |
| Home | 1 | Passes length (2,129); no `sameAs`; no visible Last Updated. | 3 and 5 |
| Static pages | 7 | Contact 194, FAQ 192, Wholesale 271, Pay in 4 581 words (page minimum 600); FAQ schema missing on Contact, About, Wholesale, Crypto. | 6 |
| Index pages (/blog/, /tag/, /shop/brand/, /delivery/) | 4 | No FAQ section on any of the 4. | 5 and 6 |
| Delivery | 6 | Passes length (782–871); zero product links out. | 5 and 6 |

## 2. Findings by rule

### Products (rules 1–5, 9, 12, 14)
- Description word count: 0 of 102 at 400. Page totals look large (1,173–1,944 rendered) only because FAQs, specs, reviews and shared shipping/payment blocks are counted; the description itself is the gap. **Fix, Phase 4.**
- Primary keyword: 99 of 102 have one; 3 do not (`roypow-72v-105ah-commercial-lithium-battery`, `heavy-duty-tow-hitch-ball-assembly`, `lockable-dash-glove-box-storage-system`). In the H1: 9 of 102. In the first 10% of the description: 7 of 99. **Fix, Phases 2 and 4.**
- Secondary keywords: 0–6 per product; 50 of 102 are outside the 5–10 band. **Fix, Phases 2 and 4.**
- Density: 6 products above the 2% ceiling for the primary keyword (max 4.76%). **Fix, Phase 4.**
- FAQs: 6 per product, all auto-built from peers (0 hand-written). Meets "FAQ present"; includes the primary keyword only by chance. **Fix, Phase 4.**
- Titles over 60 characters: 1; descriptions outside 120–160: 1.

### Product schema (rules 14, 22)
Of 102 products: SKU 102, price 102, availability 102, return policy 102, brand 89 (13 missing, likely parts); GTIN/MPN 0; priceValidUntil 0; shippingDetails 0; AggregateRating 0; Review 0.
- **Reviews are visible on the pages (owner-confirmed genuine) but absent from the schema.** The rule says schema must match visible content. **Fix, Phase 3 then 4.**
- shippingDetails: shipping stays "quoted at checkout" (decision B). Phase 3 chooses a valid markup for that, or omits it. **Fix, Phase 3.**
- GTIN/MPN: none exist in the catalogue data. **Owner input**: supply real values per product or leave out (exception 6).
- priceValidUntil: no policy exists. **Owner input** (exception 6).

### Blog (rules 1–3, 9, 12, 17)
- Body words: 0 of 89 at 1,500 (median 538 config body; rendered 1,107–1,673 including FAQ and takeaways). **Fix, Phase 6.**
- Tags: median 4; only 17 of 89 have exactly 10 unique tags. **Fix, Phase 6.**
- Secondary keywords: only 1 of 89 within 10–15 (median 5; 17 posts have 0). **Fix, Phases 2 and 6.**
- Primary keyword: 6 posts have none; in the title for 21 of 89. **Fix, Phases 2 and 6.**
- Product links in body: 7.6 on average across rendered posts, but the rule needs 4 links on 4 product keywords; to be measured per post in Phase 6.
- Author schema exists on all 89. Author names include non-persons: "Finance & Accounts Team", "Commercial Fleet Division", "The Buggies Express Team" (3 of 7 names). Person credentials need real facts. **Owner input** (exception 5).
- 6 posts have a title over 60 characters.

### Brands, tags, categories, home (rules 4, 10, 11)
- Brands: all 13 under 300 words; the keyword is in the title for 2 of 9 and in the H1 for 2 of 9. Atlas, Cushman, PowaKaddy and Robera stay `noindex` (exception 9). **Fix, Phase 5.**
- Tags: intros 152–169 words; the exact primary keyword is in the title, H1 and description for 0 of 8 (H1 reads "X in Australia", not the exact phrase). **Fix, Phases 2 and 5. Owner input**: hold tags to 300 words (exception 8)?
- Categories: exact primary keyword in title for 3 of 11, description for 4, H1 for 3, slug for 0; 2 titles over 60. **Fix, Phase 5** (slug stays, exception 1).
- Home: Organization, Store, WebSite and FAQPage present; **no `sameAs`**. **Owner input**: list of real profile URLs.

### Static and trust pages (rules 9, 12, 15)
| Page | Words | FAQPage | Gap |
|---|---|---|---|
| /about/ | 619 | no | needs FAQ |
| /contact/ | 194 | no | under 600; needs FAQ |
| /faq/ | 192 | yes | page is the FAQ; length rule needs a decision |
| /returns/ | 921 | yes | fine |
| /pay-in-4/ | 581 | yes | 19 words under 600 |
| /crypto-payment/ | 1,109 | no | needs FAQ |
| /wholesale/ | 271 | no | under 600; needs FAQ |
| **/privacy/ (404)** | n/a | n/a | **page does not exist** |
| **/shipping/ (404)** | n/a | n/a | covered by /delivery/ today; standalone page is a choice |
| /terms/ (404) | n/a | n/a | not requested; flagged only |
All **Fix, Phase 6**, except the Shipping-page choice (**Owner input**).

### Structure and on-page (rules 4, 8, 11, 12)
- Every page has exactly one H1, no heading-level skips, no missing alt text (0 of 563 images in `<main>`). Passes.
- Question-style headings are sparse (home 0, products 0, categories 0.3 on average). **Fix, Phases 4 to 6.**
- Visible "Last Updated" dates: 0 pages. `dateModified` in schema: blog only (89); none on products, categories, brands, tags or static pages. **Fix, Phase 3 (infrastructure) then each phase.**
- Image file names containing keywords: not auto-checked; applies to new images only (exception 1).

### Technical and AI readiness (rules 18, 19)
- robots.txt: all required search and citation bots are allowed (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Googlebot, Bingbot by default), sitemap referenced. Passes.
- **Training bots conflict:** the file declares `Content-Signal: ai-train=no` yet allows GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider and Meta-ExternalAgent. **Owner input**: which training bots to allow or block (rule 19 says make a deliberate decision).
- Noindex: thank-you pages, /search/, /pay/ and admin are correct. /cart/ and /checkout/ do not exist as URLs (the cart is a drawer), so nothing to noindex. Passes.
- llms.txt, MCP card and API catalog exist. Sitemap: 238 URLs, no duplicates, brand thin pages excluded. Passes.
- **Core Web Vitals not measured this phase:** the PageSpeed API returned HTTP 429 (rate limit). Phase 3 will measure with a key or the browser. Not claimed either way.

### Cannibalisation (rule 16)
- Across 212 primary keywords, 1 duplicate: `golf buggy charger australia` is used by both the blog post `golf-buggy-chargers-explained-australia` and the new `/tag/chargers/` hub. **Fix, Phase 2** (re-key the tag).
- No duplicate titles or meta descriptions across 238 pages.
- Note: the first `meta keywords` value on product pages is a shared default ("golf buggy for sale"), so it is not evidence of 100 pages competing. Real per-page keywords were compared from config instead.

## 3. Conflicts register (exceptions approved with the plan)
| # | Rule vs reality | Evidence | Decision |
|---|---|---|---|
| 1 | Keyword in slug/image names vs 240+ live URLs | 238 indexed URLs | New pages only |
| 2 | KD 1–28 vs owner primary "buggies for sale" | owner-set | Keep |
| 3 | "Cart" terms vs "Buggies" vernacular | CLAUDE.md | Buggies in H1/slug, "golf cart" in titles/body where data supports it |
| 4 | Power words vs no unproven claims | CLAUDE.md | Only true ones |
| 5 | Stats, quotes, credentials, `sameAs` | 3 of 7 blog "authors" are teams | Real and owner-confirmed only |
| 6 | GTIN/MPN, shipping, priceValidUntil | 0 data; freight quoted by postcode | Real data only; shipping stays "quoted at checkout" (B) |
| 7 | Densities 2% / 3% vs natural writing | 6 products already over 2% | Ceilings |
| 8 | Brand/tag 300 words vs current 110–169 | table above | Lift in Phase 5; tag choice pending |
| 9 | Exact 400 / 1,500 words | 0 of 191 pages at target | Validator-enforced on description/body |

## 4. Owner input needed (with the phase that needs it)
1. CSV files and the Semrush link (Phase 2).
2. Real profile URLs for `sameAs` (Phase 3).
3. Training-bot decision (Phase 3).
4. GTIN/MPN values if any exist, and any priceValidUntil policy (Phase 3 and 4).
5. Real author names and credentials for blog posts (Phase 6).
6. Tag hubs at 300 words? (Phase 5).
7. Standalone /shipping/ page, and a Privacy policy (Phase 6; Privacy must reflect how data is really handled).
