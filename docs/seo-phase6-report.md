# Phase 6 report: blog rewrite, outbound sources, inbound links, trust pages

Status: CLOSED. Owner approved Phase 6 and the Privacy wording. 20 guides remain deferred by the owner until vetted keywords exist.

## 1. Blog rewrite

- 69 of 89 posts rewritten to the blog ruleset and shipped in 8 batches, each committed and pushed before the next (last batch commit `15e1902`).
- Every rewritten post: exactly 1,500 body words, one primary keyword, 10 secondaries (4 product-keyword links), 10 unique tags, 5-6 FAQs, 40-60 word section openers, TOC, "Last updated", Article and FAQ schema, 3 inbound links from the category-ring related posts. `bun scripts/blog-check.ts` reports 69 checked, 0 failing.
- Facts come from the catalogue and site policy. Illustrative arithmetic is labelled as illustrative. No invented statistics, quotes, awards or distances (Canberra has no sourced road distance, so none is stated). No buggy is called road or street legal.
- **Deferred (20):** their mapped primary keyword had no volume, an informational or navigational intent, or did not match the topic. The owner said to skip them for now. Slugs and reasons: `bun scripts/_pend.ts`. They need vetted keywords (Semrush top-up) before rewriting.
- Posts 65 and 66 and a few earlier ones use a substitute primary chosen from the keyword pool because the mapped one had no data; the substitutes are listed in the batch commit messages.

## 2. Outbound sources and verified videos

- All 69 rewritten guides now carry 2-4 vetted outbound sources including at least one YouTube video (`bun scripts/blog-check.ts --links`: 69 checked, 0 failing).
- 24 videos, each confirmed public with YouTube oEmbed (title and channel read back) in November 2026. Channels: MGI Golf (official), Club Car (official), Yamaha Golf-Car Company (official), Clicgear (official), ACCC, Fire and Rescue NSW, Moneysmart, USGA and Golfalot (independent reviewer). No retailer channel is linked.
- Gaps: no official PowaKaddy or E-Z-GO videos could be found, so those posts use independent reviewer or other-maker videos. Several ACCC videos are old but cover rules that still apply. For some topics (tyres, brakes, windscreens) there is no topic-specific official video, so the video is the closest official product video and is described that way.
- `npm run links:check`: no dead links. YouTube answers scripted requests with 429, so videos are verified by oEmbed instead (re-run `node scripts/_refs.mjs` inputs in `scripts/_vids.json` to recheck).

## 3. Inbound links from category and product pages

- Before: 16 of 69 rewritten posts were linked from a category page. Now every category page lists its guides (`src/config/category-extra-guides.ts`, merged by `resolveCategory`), and product pages show the first six guides of their category, so rewritten guides are linked from category and product pages as well as from each other.
- Hub (`all`) carries the city, payment, warranty, finance and cost guides; each product category carries the guides for its range.

## 4. Trust pages

| Page | Result |
|---|---|
| About | Live, one H1, ABN and ABR link, Yatala address |
| Contact | Live, one H1, ABN and ABR link, entity-encoded email |
| Delivery (shipping) | Live, one H1, quoted-by-postcode wording, six city pages |
| Returns | Live, one H1, derives from `RETURNS`, ACL stated, ACCC source |
| Privacy | **Did not exist. Added at `/privacy/`** (footer link, sitemap, breadcrumb schema). It describes only what the site actually does: forms, orders, WhatsApp, hosting, no analytics or ad tools. **Owner or a lawyer should review it before relying on it.** |

## 5. Measurement and off-page

See `docs/seo-phase6-measurement-plan.md`: 7 off-page actions (all need owner approval), 30 AI prompts, KPI table, cadence.

## 6. Verification

- Live `node scripts/site-validate.mjs`: PASS (239 sitemap URLs, 243 link targets). Remaining WARNs are known: four brand pages not in the sitemap, and a two-hop http redirect that is a Vercel domain setting.
- `npm run crosscheck`: OK. Product copy check: all 102 pass. Build and tsc clean.
- `npm run indexnow`: 200, 239 URLs submitted.
- Commits this phase: batch 1-8 plus `db3db05` (sources, videos, category links, privacy, measurement plan).

## 7. Not done and why

- PageSpeed re-check not repeated: the changes are copy and links, not layout. Re-run after approval if wanted.
- 20 deferred guides (section 1).
- Owner to decide: approve Phase 6 close, review the Privacy page, and approve any off-page actions.
