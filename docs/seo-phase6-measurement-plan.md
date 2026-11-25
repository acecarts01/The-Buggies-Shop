# Phase 6: off-page plan and AI-prompt measurement plan

Written November 2026. Everything here is a plan for the owner to run or approve. Nothing in it has been done off-site yet, and no result is claimed.

## 1. Ground rules

- No invented facts, awards, partner claims, reviews or sameAs profiles. Only link to profiles the business actually owns.
- Never ask for or accept paid links, link exchanges or directory spam. Every off-page action is a real listing, a real citation or a real piece of content.
- Business identity everywhere is identical: GOLF BUGGIES EXPRESS PTY LTD, ABN 28 668 598 758, ACN 668 598 758, Yatala QLD 4207, 0480 804 189, sales@golfbuggiesexpress.com.au.
- GSC and Bing Webmaster are on the G account (genuinechartergates). Do not use the A account.

## 2. Off-page plan (owner-approved actions only)

| # | Action | Why | Evidence it is done |
|---|---|---|---|
| 1 | Claim and complete the Google Business Profile (service-area business, Yatala address, hours, phone, categories) | Local and "near me" intent, AI answer engines read it | Verified profile URL, screenshot |
| 2 | Claim the Bing Places listing from the same details | Bing/Copilot answers | Listing URL |
| 3 | Register the ABN-linked entries that already exist (ABR) and make sure the site's ABR link matches | Trust, entity match | ABR page matches site footer |
| 4 | Ask genuine buyers for Google reviews using a plain link after delivery (no incentive, no gating) | Review volume and recency | Review count in GBP |
| 5 | List the business in the maker partner or dealer pages only where the maker confirms the relationship in writing | Authoritative citation | Written confirmation, then link |
| 6 | Pitch one factual guide a quarter to a relevant Australian golf, caravan-park or farm publication (battery care, lifted-buggy brakes, vineyard row width) using our own catalogue facts | Earned links | Published URL |
| 7 | Add the YouTube channel only when the owner records real product videos, then embed and link them from the matching guides | Video citations | Channel URL |

Do not start any of these without the owner's go-ahead. Items 1, 2 and 4 are the highest value and cost nothing.

## 3. Pages to monitor

Tracked in a sheet with one row per URL and one column per week.

- Money pages: home, `/shop/`, 12 category pages, 9 brand pages, 102 product pages, 6 delivery pages.
- Guides: the 69 rewritten posts (list in `src/config/post-refresh.ts`) and the 20 still pending (see `scripts/_pend.ts`).
- Trust pages: About, Contact, Delivery, Returns, Privacy, FAQ, Pay in 4, Crypto payment.

## 4. Search Console and Bing KPIs (weekly, same weekday)

| KPI | Source | Target direction |
|---|---|---|
| Indexed pages vs sitemap URLs (sitemap has 239 URLs after Privacy) | GSC Pages report | Equal, no "Crawled, not indexed" growth |
| Impressions and clicks for the 69 guides, grouped by primary keyword | GSC Performance, page filter | Up month on month |
| Average position for each page's primary keyword | GSC Performance, query + page filter | Down (better), 4-week rolling |
| Queries per page (breadth) | GSC | Up |
| Core Web Vitals (mobile) | GSC CWV and PageSpeed | No regression from the Phase 6 changes |
| Pages indexed in Bing | Bing Webmaster | Matches Google |

Record a baseline before the first read: export the last 28 days of GSC data on the day of approval and store it in `docs/`.

## 5. AI-prompt measurement (answer engines)

Goal: see whether ChatGPT, Gemini, Perplexity, Copilot and Google AI Overviews mention or cite the site for the questions buyers ask. Run monthly, same prompts, logged-out or fresh session, Australian location.

### Prompt set (30, grouped)

Buying: where can I buy a golf buggy in Australia; best electric golf buggy in Australia; electric golf cart for sale Australia; golf cart prices Australia; used golf buggy checklist; reconditioned vs new golf buggy cost; 4 seater vs 6 seater golf buggy; luxury golf cart for estates.
Trolleys: best electric golf trolley Australia; MGI vs PowaKaddy; Clicgear vs MGI; electric golf buggy that follows you; childrens golf trolley.
Technical: charger for golf cart (lithium vs lead-acid); lithium battery safety for golf buggies; golf buggy brakes; golf buggy tyres for sand; windshield for Club Car golf cart; golf buggy top speed rules.
Local and payment: golf buggy delivery to Perth, Sydney, Melbourne, Brisbane, Adelaide, Canberra; buy a golf buggy with crypto; golf cart finance Australia; golf buggy warranty Australia.
Business use: golf buggies for wineries; caravan park golf buggies; retirement village golf buggies; golf cart fleet for sale.

### What to log per prompt and engine

1. Is the brand named (yes/no)? 2. Is a URL on golfbuggiesexpress.com.au cited (yes/no, which page)? 3. Are the facts stated correct (price, delivery, warranty, minimum order)? 4. Which competitors or sources are cited instead? 5. Date, engine, location, exact wording.

### Reading the results

- Cited with correct facts: good, note the page.
- Named but wrong fact: fix the page that should have said it, check `llms.txt`, and make the correct statement more prominent.
- Not named: check the matching guide has the answer in its first 100 words and an FAQ with the exact question, and that the page is indexed.
- Never ask an engine to "remember" or edit anything, and never post fabricated reviews or prompts to influence results.

## 6. Cadence

| When | Task |
|---|---|
| Weekly | GSC and Bing KPIs, new indexing errors, broken-link check (`npm run links:check`) |
| Monthly | AI-prompt run, content freshness review (bump `CONTENT_UPDATED` when copy changes), `node scripts/site-validate.mjs` live, `npm run indexnow` after content deploys |
| Quarterly | Refresh the guides with the lowest click-through, review competitors' coverage, decide on one earned-link pitch |
| Every 6 months | Reverify outbound YouTube links with oEmbed (`scripts/_refs.mjs` list) and replace any that were removed |

## 7. What would change the plan

Real owner-recorded video, a confirmed maker dealer relationship, or Semrush top-ups that supply vetted primary keywords for the 20 deferred guides.
