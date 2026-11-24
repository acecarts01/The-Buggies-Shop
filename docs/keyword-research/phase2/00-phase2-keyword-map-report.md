# Phase 2: keyword research and mapping (2026-11-25)

Deliverable: `keyword-map-2026-11-25.csv` (one row per page and keyword; role = primary, secondary, secondary+productlink), `map-flags-2026-11-25.txt` (every gap, one line each), `semrush-raw-2026-11-25.jsonl` (raw fresh Semrush pages). Rebuild with `bun scripts/keyword-map.ts`. Nothing on the site was changed.

## 1. Inputs
- September bank: 15,887 AU clusters (about 22,800 keywords including variants). Only 601 clusters meet volume 10+ and KD 1–28.
- Fresh Semrush (AU, KD 1–28, volume 10+): 15 result pages from `golf buggy`, `electric golf buggy`, `buggies for sale`, `4 seater golf buggy`, `2 seater golf buggy`, `off road golf buggy`, `petrol golf buggy` and `farm buggy`. Semrush's hourly report limit and a later server error stopped the remaining seeds.
- Pool after filtering off-topic terms (used, hire, repair, unstocked brands, other vehicles): 1,400 qualifying keywords.

## 2. Rules applied
- Primary intent: products and utility pages T or C; categories, brands, tags, delivery N, T or C; blog T or C (Informational + T/C preferred).
- Secondary: products, categories, brands, tags and delivery 5–10 (T/C only); blog and home 10–15 with 2 Navigational and 2 Informational where available.
- Every primary unique across the site (228 unique primaries; no duplicates). Each secondary used on at most 2 pages. No word-order or plural permutations (for example "golf cart petrol for sale" and "petrol golf cart for sale" count as one).
- Blog posts: 4 product primary keywords listed per post, each with its product URL for the embedded link (Phase 6).
- Home primary stays "buggies for sale" (owner-set).

## 3. Results (242 pages; rebuilt after adding the golf buggy battery, golf trolley and farm buggy seeds)
| Primary keyword status | Pages |
|---|---:|
| Meets every criterion (volume 10+, KD 1–28) | 70 |
| Volume 10+ but KD not scored by Semrush ("n/a") | 76 |
| Existing on-topic term outside the criteria (volume under 10, or no Semrush data) | 82 |
| No keyword with search demand (see section 5) | 14 |

Secondary coverage: product 81 of 102 pages at 5+ (avg 4.4), category 10 of 11, brand 9 of 13, tag 7 of 8, delivery 6 of 6, blog 54 of 89 at 10+ (avg 8.5), home 12. The shortfalls are data limits: Semrush has fewer than 5 distinct, relevant, qualifying queries for many niche parts and models.
Blog product links: 80 of 89 posts have 4 relevant product primaries; 9 have fewer.

Changes versus the September mapping: 8 primaries replaced, 3 new. `/tag/chargers/` re-keyed to "golf buggy charger" (70 searches, KD 4), leaving "golf buggy charger australia" with the blog post. Everything else kept, because replacing a specific term with a generic qualifying one (tested and rejected) would pull model and city pages onto head terms and cannibalise the brand and shop pages.

## 4. Decisions needed (exception 10)
1. **KD "n/a" with volume 10+.** Semrush leaves KD blank for low-volume terms. I treat these as acceptable (68 pages), since the rule's intent is "not too hard". Confirm.
2. **92 pages whose best existing term has volume under 10 or no data** (mostly model-name terms like "ezgo express l6 for sale"). Options: keep as the page's target because buyers do search the model name, or switch to a category-level qualifying term. I recommend keeping, flagged.
3. **Used and second-hand blog posts** (4 posts) keep their "used" primaries: their topic is used buggies, which my filter would otherwise reject.

## 5. Pages with no qualifying keyword (14)
Products: `heavy-duty-tow-hitch-ball-assembly`, `lockable-dash-glove-box-storage-system`. Category: `/shop/junior-golf-buggies/` (coming soon; keywords stay owner-initiated). Blog: finance (Pay in 4 vs crypto), buying second hand, winter storage, Canberra. Utility pages: About, Contact, FAQ, Returns, Crypto payment, Collections index, Blog index (little or no search demand; branded targets recommended). Utility pages also get no automatic secondaries; decide in Phase 6.

## 6. Still to research when Semrush works (seeds not yet read)
`golf trolley`, `electric golf trolley`, `golf buggy battery`, `lithium golf buggy battery`, `golf buggy charger`, `golf buggy accessories`, `remote control golf buggy`, `lifted golf buggy`, `golf buggy tow hitch`, `golf buggy lights`, `golf buggy enclosure`, `golf buggy controller`, the 13 brand seeds, `golf cart` terms, and the city seeds. These will mainly fill the 22 product and 15 blog shortfalls and replace tier-B terms.

## 7. How the map is used
Phase 4 (products), 5 (hubs, brands, tags) and 6 (blog and trust pages) read this CSV: primary in H1, title, description, first paragraph, FAQ and image alt; secondaries in headings, body and FAQ.

## 8. Rebuild note (second pass)
Adding the battery, trolley and farm buggy seeds moved 10 pages up a tier (tier-B 92 to 82) and changed 2 primaries. The new data mostly confirmed existing terms rather than adding new ones. A merge bug (fresh KD "n/a" overwriting a known KD) was fixed in .
