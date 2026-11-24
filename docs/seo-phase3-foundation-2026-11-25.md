# Phase 3: technical foundation (2026-11-25)

Shipped (commit bb8bdb2), live validator PASS, IndexNow resubmitted (238 URLs).

## Done
- **AI crawlers:** `public/robots.txt` blocks 24 training crawlers (GPTBot, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, Applebot-Extended, Amazonbot, Bytespider, CCBot, Meta-ExternalAgent, FacebookBot, cohere-ai and others). Search and citation bots stay allowed (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Googlebot, Bingbot, Applebot, DuckAssistBot, YouBot). `Content-Signal: ai-train=no` unchanged.
- **Last updated:** footer shows a visible "Last updated" date on home, shop, categories, products, brands, tags, delivery, About, Contact, FAQ, Returns, Pay in 4, Crypto, Wholesale and the blog (post date). Pages read `CONTENT_UPDATED` in `site.ts` (set to 2026-11-15, the last real copy change). Bump `.pages` / `.catalog` when copy changes.
- **Core Web Vitals:** found a layout shift of 0.225 on the Atlas page (rotating hero word, 31 px per swap, repeating) and an announcement bar that changed height on phones. Fixed in `RotatingWords` and `AnnouncementBar`. Measured 0 CLS on Atlas, home and a standard product (375 px, no horizontal overflow). Product LCP measured 1.4 s on the live site before the fix.
- **Schema:** blog authors that are a team or desk are now `Organization` (not `Person` with a job title). Reviews untouched (standing rule).
- **Validator** (`scripts/site-validate.mjs`): training bots blocked, search bots allowed, "Last updated" on content pages, Product sku/price/availability present.

## Not done, by decision
- `sameAs`: left as is (no profile URLs supplied).
- `shippingDetails`: not marked up. Freight is quoted per postcode, and marking a rate the page does not show would break schema/content consistency.
- GTIN/MPN, `priceValidUntil`: no real data or policy.
- `dateModified` on non-blog pages: the visible date and `CONTENT_UPDATED` exist; schema-level `dateModified` is added with each page type's content work in Phases 4 to 6.

## Open
- PageSpeed API returned HTTP 429 (keyless quota), so no PSI score was obtained. The live home page measured slowly on its first load from this machine (LCP about 8 s, TTFB 3.5 s) because of a slow first connection; a warm product page measured 1.4 s. Re-measure with a PSI key or from a clean network before treating the home figure as real.
