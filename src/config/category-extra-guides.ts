// SERVER-ONLY. Phase 6 inbound links: category pages (and, through them, product pages, which show the
// first six guides of their category) link to the rewritten blog guides. Merged into each category's own
// guides by resolveCategory() in category-content.ts, de-duplicated by slug.
export const CATEGORY_EXTRA_GUIDES: Record<string, { slug: string; label: string }[]> = {
  all: [
    { slug: 'how-much-does-a-golf-cart-cost-australia', label: 'Golf cart prices in Australia, from $899 to $27,900' },
    { slug: 'how-golf-buggy-ordering-invoicing-delivery-works', label: 'How ordering, invoicing and delivery work' },
    { slug: 'golf-cart-finance-options-pay-in-4-vs-crypto-discounts', label: 'Finance in 4 vs the 10% crypto discount' },
    { slug: 'paying-for-a-golf-buggy-in-crypto-btc-usdt-guide', label: 'Buy a golf buggy with crypto: step-by-step guide' },
    { slug: 'golf-buggy-warranty-australia-explained', label: 'Warranty and repairs: what is covered' },
    { slug: 'eofy-golf-buggy-deals-australia-buying-guide', label: 'The honest EOFY buying guide' },
    { slug: 'golf-car-vs-golf-buggy-vs-golf-cart-australia', label: 'Golf car, golf buggy or golf cart?' },
    { slug: 'golf-carts-for-sale-brisbane-buyers-guide', label: 'Electric golf carts in Brisbane' },
    { slug: 'golf-carts-for-sale-sydney-nsw-buyers-guide', label: 'Golf carts for sale in Sydney and NSW' },
    { slug: 'golf-carts-for-sale-melbourne-buyers-guide', label: 'Golf carts in Melbourne' },
    { slug: 'golf-carts-for-sale-perth-wa-buyers-guide', label: 'Electric golf carts in Perth and WA' },
    { slug: 'golf-carts-for-sale-adelaide-sa-buyers-guide', label: 'Electric golf carts in Adelaide and SA' },
    { slug: 'golf-buggies-for-sale-canberra-act', label: 'Golf buggies for sale in Canberra and the ACT' },
  ],
  'electric-golf-buggies': [
    { slug: 'electric-golf-buggy-australia-complete-guide', label: 'Electric golf cart complete guide: choosing, charging, owning' },
    { slug: 'electric-buggy-australia-what-it-means', label: 'What "electric buggy" covers and which one you need' },
    { slug: 'electric-golf-buggy-maintenance-schedule-australia', label: 'Electric buggy maintenance schedule' },
    { slug: 'electric-golf-buggy-troubleshooting-and-replacement-parts', label: 'Power but will not move: troubleshooting' },
    { slug: 'petrol-vs-electric-golf-buggy-running-costs-australia', label: 'Gas or electric golf cart: running costs compared' },
  ],
  'traditional-2-seater': [
    { slug: 'buying-second-hand-golf-carts-in-australia-checklist', label: 'Second hand golf buggy: 15-point inspection checklist' },
    { slug: 'used-golf-carts-for-sale-australia-what-we-check', label: 'Used golf buggy: the 12 checks that matter' },
    { slug: 'second-hand-golf-buggy-value-guide-australia', label: 'What a second hand electric buggy is worth' },
    { slug: 'reconditioned-vs-new-golf-buggy-cost-comparison', label: 'Reconditioned vs new: five-year golf buggy cost' },
  ],
  'mechanical-petrol': [
    { slug: 'used-petrol-golf-buggy-prices-australia', label: 'Second hand petrol golf buggies: what drives the price' },
    { slug: 'petrol-vs-electric-golf-buggy-running-costs-australia', label: 'Gas or electric golf cart: running costs compared' },
  ],
  'commercial-utility': [
    { slug: 'golf-buggy-fleet-purchase-guide-australia', label: 'Golf cart fleet: specification, charging and total cost' },
    { slug: 'buggy-vs-golf-cart-vs-side-by-side-utv-five-year-cost-australia', label: 'Buggy vs golf cart vs side-by-side: five-year cost' },
  ],
  'walk-behind-buggies': [
    { slug: 'golf-caddy-australia-buyers-guide', label: 'Motorised golf caddy: push, electric, remote and follow' },
    { slug: 'mgi-vs-motocaddy-electric-golf-trolley-australia', label: 'MGI golf trolley vs Motocaddy' },
    { slug: 'powakaddy-vs-mgi-electric-golf-trolley-australia', label: 'PowaKaddy vs MGI: compare electric golf trolleys' },
    { slug: 'best-electric-golf-trolley-brands-australia', label: 'How to judge the best electric golf trolley brands' },
    { slug: 'golf-cart-with-remote-control-australia-guide', label: 'Golf cart with remote control: how it works' },
    { slug: 'electric-golf-buggy-that-follows-you-gps-follow-vs-remote-australia', label: 'Buggy that follows you: GPS follow vs remote' },
  ],
  'push-golf-buggies': [
    { slug: 'golf-push-cart-vs-electric-trolley-australia', label: 'Golf push cart or electric trolley?' },
    { slug: 'clicgear-vs-mgi-push-buggy-comparison-australia', label: 'Clicgear buggy vs MGI: push or motorised' },
    { slug: 'junior-golf-buggy-australia-guide', label: 'Childrens golf trolley: sizing, safety and what to look for' },
  ],
  'batteries-chargers': [
    { slug: 'golf-buggy-chargers-explained-australia', label: 'Charger for golf cart: amperage, charge times, matching' },
    { slug: 'lithium-battery-conversion-guide-cost-australia', label: 'Lithium conversion cost and 10-year savings' },
    { slug: 'solar-panels-on-golf-buggies-australia-feasibility-guide', label: 'Solar powered golf carts: do roof panels work?' },
  ],
  'accessories-spare-parts': [
    { slug: 'mgi-golf-buggy-accessories-guide-australia', label: 'MGI buggy accessories guide' },
    { slug: 'golf-buggy-seat-covers-and-upholstery-australia', label: 'Golf buggy seat covers: sun and wet protection' },
    { slug: 'golf-buggy-with-seat-options-explained-australia', label: 'Rear flip seat kits and adding capacity' },
    { slug: 'golf-buggy-windscreens-weather-enclosures-australia', label: 'Windscreens and weather enclosures' },
    { slug: 'golf-buggy-parts-and-spares-australia-guide', label: 'Golf buggy parts: what to stock and what to source' },
    { slug: 'golf-buggy-brakes-explained-australia', label: 'Golf buggy brakes: drum, disc and electromagnetic' },
    { slug: 'golf-buggy-tyres-explained-australia', label: 'Golf buggy tyres: turf, all-terrain and street' },
  ],
};
