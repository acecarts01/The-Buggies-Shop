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
`src/config/site.ts` is the single source of truth for all 61 buggy models, categories, pricing, contact details, and agent metadata.
Never hand-write product pages. All routes, metadata, and JSON-LD derive from this configuration.

## Rules
- Mobile-first responsive layout (380px viewport tested, zero horizontal overflow).
- Exactly one `<h1>` per page.
- Self-hosted fonts; no `@import url('https://fonts.googleapis.com/...')` inside CSS.
- Emails entity-encoded (&#64;) everywhere, including JSON-LD.
- Web3Forms CORS method: FormData with Accept header only, no Content-Type.
- Framework Preset on Vercel must be "Next.js".

## Brand Facts
- Registered: 7/06/2023 with ASIC (Next review: 7/06/2027).
- Registered Locality: Yatala QLD 4207.
- All prices include 10% Australian GST.
- Order rules live in `SHOP` (src/config/site.ts) — never restate the numbers here, or they drift.
- Min order and free-freight threshold are UNCONFIRMED: do not publish either in customer-facing
  copy until the owner confirms them. Freight is "quoted per order" (`SHOP.shippingNote`).
- Crypto incentive: 10% discount on vehicle price for Bitcoin (BTC) or Tether (USDT).
- High-ticket rule: complimentary on-farm trial demonstration for vehicles ≥ $15,000 AUD.
