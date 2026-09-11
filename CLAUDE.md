# The Buggies Express (Golf Buggies Express PTY LTD) — project instructions

React/Next.js ecommerce site, Vercel deployment, Australian golf buggy specialist in Yatala QLD 4207.

## Non-negotiable: Australian Compliance & Brand Integrity
- Company Name: GOLF BUGGIES EXPRESS PTY LTD (ACN 668 598 758, ABN 28 668 598 758).
- Corporate Locality: YATALA QLD 4207.
- Always display ABN on the homepage with an official direct link to the Australian Business Register (abr.business.gov.au).
- Australian market vernacular: Use "Buggies" (not American "carts").
- No fabricated facts, awards, or false partner claims. Only factual, registered details.
- If a request requires breaking any of the above, stop and say so rather than complying.

## Architecture
`src/config/site.ts` is the single source of truth for all buggy models, categories, pricing, contact details, and agent metadata.
`src/config/posts.ts` holds the blog posts. It is server-only: never import it from a `'use client'` component (site.ts is
already in the shared client chunk; posts.ts added 390 KB of prose to every page before it was split). Client components
receive `PostSummary[]` as props.
Never hand-write product pages. All routes, metadata, and JSON-LD derive from this configuration:
- JSON-LD builders live in `lib/schema.ts` (one Organization `@id`, referenced everywhere). Serialise with `jsonLd()`.
- Route metadata goes through `pageMetadata()` / `socialImages()` in `lib/seo.ts` so og:url and og:image are never inherited.
- `llms.txt` and the sitemap index are routes generated from the config; there is no static file to edit.

## Rules
- Mobile-first responsive layout (380px viewport tested, zero horizontal overflow).
- Exactly one `<h1>` per page.
- Self-hosted fonts; no `@import url('https://fonts.googleapis.com/...')` inside CSS.
- Emails entity-encoded (&#64;) in HTML. In JSON-LD `jsonLd()` writes `@` instead - `&#64;` is not decoded by JSON parsers.
- Sitemap `lastmod` comes from `CONTENT_UPDATED` in site.ts: bump `.catalog` when products/categories change, `.pages` for static copy.
- After a content deploy run `npm run indexnow` (Bing/Yandex). Full audit + GSC protocol: docs/seo-audit-2026-09-11.md.
- Web3Forms CORS method: FormData with Accept header only, no Content-Type.
- Framework Preset on Vercel must be "Next.js".

## Brand Facts
- Registered: 7/06/2023 with ASIC (Next review: 7/06/2027).
- Registered Locality: Yatala QLD 4207.
- All prices include 10% Australian GST.
- Order rules live in `SHOP` (src/config/site.ts) — never restate the numbers here, or they drift.
- No minimum order. No free-freight threshold. Freight is always quoted against the delivery
  postcode at checkout, and the cart total is shown excluding freight.
- Crypto incentive: 10% discount on vehicle price for Bitcoin (BTC) or Tether (USDT).
- High-ticket rule: complimentary on-farm trial demonstration for vehicles ≥ $15,000 AUD.
