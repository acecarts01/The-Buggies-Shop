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
`src/config/posts.ts` (blog posts) and `src/config/product-details.ts` (each product's fullDescription, faqs and
keywords, keyed by slug) are server-only: never import either from a `'use client'` component. site.ts is in the
shared client chunk on every page; before the split it carried 666 KB of prose, now 85 KB. Client components receive
`PostSummary[]` / `ProductDetails` as props; server code joins with `withDetails()` / `PRODUCTS_FULL`.
Adding a product means an entry in PRODUCTS (site.ts) AND one in PRODUCT_DETAILS (product-details.ts); the build
throws on a slug missing from either.
Never hand-write product pages. All routes, metadata, and JSON-LD derive from this configuration:
- JSON-LD builders live in `lib/schema.ts` (one Organization `@id`, referenced everywhere). Serialise with `jsonLd()`.
- Route metadata goes through `pageMetadata()` / `socialImages()` in `lib/seo.ts` so og:url and og:image are never inherited.
- `llms.txt` and the sitemap index are routes generated from the config; there is no static file to edit.
- Metro delivery pages (`/delivery/<city>/`) derive from `src/config/delivery.ts`: delivery-only copy, one depot, no transit promises.
- Brand assets: the logo is `public/brand/logo.png` (full lockup) + `public/brand/logo-mark.png` (shield). `npm run brand`
  regenerates favicon.ico (16/32/48), icon.png, apple-icon.png, manifest marks and `src/config/brand-assets.ts`; `BrandMark`
  renders it in the header/footer and `lib/schema.ts` reads it. Never hand-place a logo `<img>` or hand-edit the icon files.
- Crypto is paid on-site (`CryptoCheckout`: the three `CRYPTO.wallets` addresses, QR, WhatsApp receipt step). Never link out to an
  exchange. Every payment method ends with the buyer sending the receipt or a screenshot on WhatsApp.

## Rules
- Mobile-first responsive layout (380px viewport tested, zero horizontal overflow).
- Exactly one `<h1>` per page.
- Self-hosted fonts; no `@import url('https://fonts.googleapis.com/...')` inside CSS.
- Emails entity-encoded (&#64;) in HTML. In JSON-LD `jsonLd()` writes `@` instead - `&#64;` is not decoded by JSON parsers.
- Sitemap `lastmod` comes from `CONTENT_UPDATED` in site.ts: bump `.catalog` when products/categories change, `.pages` for static copy.
- After a content deploy run `npm run indexnow` (Bing/Yandex). Full audit + GSC protocol: docs/seo-audit-2026-09-11.md.
- Web3Forms CORS method: FormData with Accept header only, no Content-Type.
- Framework Preset on Vercel must be "Next.js".
- Never run `next build` while `next dev` is running: both use `.next/`, and the build wipes the dev server's manifests
  (500s, `ENOENT routes-manifest.json`). Stop the dev server first; if it happens, `rm -rf .next` and restart dev.

## Brand Facts
- Registered: 7/06/2023 with ASIC (Next review: 7/06/2027).
- Registered Locality: Yatala QLD 4207.
- All prices include 10% Australian GST.
- Order rules live in `SHOP` (src/config/site.ts) — never restate the numbers here, or they drift.
- No minimum order. No free-freight threshold. Freight is always quoted against the delivery
  postcode at checkout, and the cart total is shown excluding freight.
- Crypto incentive: 10% discount on vehicle price for Bitcoin (BTC) or Tether (USDT).
- High-ticket rule: complimentary on-farm trial demonstration for vehicles ≥ $15,000 AUD.
