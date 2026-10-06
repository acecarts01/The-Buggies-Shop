# Phase 2, Batch 2: six `/delivery/<city>/` pages

Built and verified 2026-10-07. Config: `src/config/delivery.ts`; template: `app/delivery/[city]/page.tsx`.
Still delivery-only pages: one depot at Yatala QLD 4207, no showroom, no transit-time promises (the new FAQ says
there is no showroom in the city).

## Keyword-to-page map (cluster ids from `phase0/keyword-bank-clean.csv`)

| Page | Primary | Supporting |
|---|---|---|
| `/delivery/gold-coast/` | golf buggy for sale gold coast (C00138) | golf buggy gold coast (C00102), golf buggies gold coast, golf carts gold coast (C00055), golf carts for sale gold coast, electric golf buggy for sale gold coast, yamaha golf carts gold coast |
| `/delivery/brisbane/` | golf buggy for sale brisbane (C00067, Top 14) | golf buggy for sale qld (C00112), golf buggies for sale brisbane, golf carts for sale brisbane, golf carts for sale qld, electric golf buggies brisbane, golf buggy batteries brisbane |
| `/delivery/sydney/` | golf buggy for sale sydney (C00134) | golf buggy for sale nsw (C00142), golf carts for sale sydney, electric/motorised golf buggies sydney |
| `/delivery/melbourne/` | golf buggy for sale melbourne (C00270) | golf buggies for sale victoria (C00136), golf carts for sale melbourne/victoria, electric golf buggies melbourne |
| `/delivery/adelaide/` | golf buggy for sale adelaide (C00285) | golf buggies adelaide (C00178), golf carts for sale adelaide, golf carts for sale south australia |
| `/delivery/perth/` | golf buggy for sale perth (C00130) | golf buggies perth, golf carts for sale perth (C00053) / wa, electric golf buggy for sale perth |

## Changes

* Title, H1 and meta description of all six now carry the contiguous "golf buggy for sale <city>" phrase
  (Brisbane, Gold Coast and Melbourne moved off "golf cart" vocabulary; Sydney, Adelaide and Perth had it already
  in some fields but not all). Cart terms stay in meta keywords and a few mentions.
* New computed section "Golf buggy for sale in <city>: what we deliver" (vehicle count, GST-inclusive price band,
  electric and petrol counts), with links to `/shop/`, the electric hub and the city buyers guide.
* New FAQ "Where can I buy a golf buggy in <city>?" (7 FAQs per page, FAQPage schema unchanged in shape).
* Each metro page links to its existing city guide (kept; retargeted in Batch 4 per decision B).
* `CONTENT_UPDATED.pages` bumped.

## Verification

Clean build, crosscheck OK, primary keyword present in title, H1, meta and body on all six, body density about
0.25%, one H1, Service/Organization/Breadcrumb/FAQPage JSON-LD parse, no overflow at 380px.
