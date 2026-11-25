// Outbound links: a short, vetted list of authoritative sources, each placed only
// where it supports what the page says.
//
// Selection rules (anything that fails one is left out):
//   1. Primary source: a government or regulator page, the maker's own site, or
//      a standards/rules body. No aggregators, link directories, blogs, review
//      sites, affiliate pages or commercial competitors. Owner-approved
//      exceptions: Wikipedia and Australian Golf Digest, used sparingly.
//   2. Directly relevant to the page that carries it (registration guidance on
//      the registration guide, the ACCC on the warranty guide, and so on).
//   3. Checked live. Each URL was fetched; pages behind bot protection that
//      answer scripted requests with 403/429 (ACCC, VicRoads, SA Government,
//      MGI) were confirmed through search results instead.
//      `npm run links:check` repeats the check.
//   4. Stable, deep-linked to the specific page, not a site home page, except
//      for manufacturers, where the home page is the right target.
//
// Links are plain editorial links (no nofollow) with rel="noopener noreferrer".
// Do not add a link here without checking it against the four rules.

export interface Reference {
  /** Link text: what the page is, not "click here". */
  title: string;
  /** Who publishes it, shown after the link. */
  publisher: string;
  url: string;
}

export const REFERENCES = {
  // ---- road registration, by state (conditional registration of golf buggies)
  'nsw-golf-buggy': { title: 'Golf buggy vehicle sheet (conditional registration)', publisher: 'NSW Government', url: 'https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/conditional-and-seasonal/vehicle-sheets/golf-buggy' },
  'qld-golf-buggy': { title: 'Golf buggy (or derivative): conditional registration', publisher: 'Queensland Government', url: 'https://www.publications.qld.gov.au/dataset/conditional-registration-of-recreational-vehicles/resource/09e65a7e-ba2b-4ea9-af6f-cd5614c55915' },
  'qld-conditional': { title: 'Conditionally registering a vehicle in Queensland', publisher: 'Queensland Government', url: 'https://www.publications.qld.gov.au/dataset/vehicle-standards-safe-movement-guidelines/resource/722c95c8-c9c5-4771-bdaf-8f1a8489f6e6' },
  'vic-noncompliant': { title: 'Register a non-compliant vehicle', publisher: 'VicRoads', url: 'https://www.vicroads.vic.gov.au/registration/new-registration/register-non-compliant-vehicles' },
  'sa-restricted': { title: 'Restricted miscellaneous vehicle registration', publisher: 'SA Government', url: 'https://www.sa.gov.au/topics/driving-and-transport/registration/conditional-registration/restricted-miscellaneous-vehicle' },
  'wa-registration': { title: 'WA vehicle registration', publisher: 'Australian Business Licence and Information Service', url: 'https://ablis.business.gov.au/service/wa/wa-vehicle-registration/16991' },
  // ---- consumer, finance, tax
  'accc-guarantees': { title: 'Consumer rights and guarantees', publisher: 'ACCC', url: 'https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees' },
  'accc-warranties': { title: 'Warranties', publisher: 'ACCC', url: 'https://www.accc.gov.au/consumers/buying-products-and-services/warranties' },
  'accc-lithium': { title: 'Using and storing lithium-ion batteries safely', publisher: 'ACCC', url: 'https://www.accc.gov.au/media-release/consumers-urged-to-use-and-store-lithium-ion-batteries-safely-to-prevent-deadly-fires' },
  'ato-crypto': { title: 'What are crypto assets?', publisher: 'Australian Taxation Office', url: 'https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments/what-are-crypto-assets' },
  'moneysmart-bnpl': { title: 'Buy now pay later services', publisher: 'MoneySmart (ASIC)', url: 'https://moneysmart.gov.au/other-ways-to-borrow/buy-now-pay-later-services' },
  'moneysmart-insurance': { title: 'Insurance', publisher: 'MoneySmart (ASIC)', url: 'https://moneysmart.gov.au/insurance' },
  // ---- business identity
  abr: { title: 'ABN Lookup', publisher: 'Australian Business Register', url: 'https://abr.business.gov.au/' },
  'asic-search': { title: 'Search ASIC registers', publisher: 'ASIC', url: 'https://www.asic.gov.au/online-services/search-asic-registers' },
  // ---- transport
  'nhvr-load': { title: 'Load Restraint Guide', publisher: 'National Heavy Vehicle Regulator', url: 'https://www.nhvr.gov.au/road-access/loading/load-restraint-guide' },
  // ---- reference and golf bodies
  'wiki-golf-cart': { title: 'Golf cart', publisher: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Golf_cart' },
  'wiki-lfp': { title: 'Lithium iron phosphate battery', publisher: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Lithium_iron_phosphate_battery' },
  'rules-of-golf': { title: 'The Rules of Golf', publisher: 'The R&A', url: 'https://www.randa.org/en/rog/the-rules-of-golf' },
  // ---- manufacturers (official sites)
  'maker-club-car': { title: 'Club Car official website', publisher: 'Club Car', url: 'https://www.clubcar.com/' },
  'maker-e-z-go': { title: 'E-Z-GO official website', publisher: 'E-Z-GO (Textron)', url: 'https://www.ezgo.com/' },
  'maker-yamaha': { title: 'Yamaha Golf Car official website', publisher: 'Yamaha Golf Car Company', url: 'https://www.yamahagolfcar.com/' },
  'maker-powakaddy': { title: 'PowaKaddy official website', publisher: 'PowaKaddy', url: 'https://www.powakaddy.com/' },
  'maker-mgi': { title: 'MGI Golf official website', publisher: 'MGI Golf', url: 'https://mgigolf.com/' },
  'maker-evolution': { title: 'Evolution Electric Vehicles official website', publisher: 'Evolution Electric Vehicles', url: 'https://evolutionelectricvehicle.com/' },
  'maker-cushman': { title: 'Cushman official website', publisher: 'Cushman (Textron)', url: 'https://www.cushman.com/' },
  'maker-clicgear': { title: 'Clicgear official website (includes Rovic)', publisher: 'Clicgear', url: 'https://www.clicgear.com/' },
  // MGI's own support and product pages (maker). Checked live in October 2026.
  'mgi-zip-faq': { title: 'Zip Series FAQs', publisher: 'MGI Golf', url: 'https://mgigolf.com/pages/zip-series-faqs' },
  'mgi-ai-faq': { title: 'Ai Series FAQs', publisher: 'MGI Golf', url: 'https://mgigolf.com/pages/ai-series-faqs' },
  'mgi-lithium-faq': { title: 'Lithium Battery FAQs', publisher: 'MGI Golf', url: 'https://mgigolf.com/pages/lithium-battery-faqs' },
  'mgi-eboost': { title: 'MGI E-Boost pushcart', publisher: 'MGI Golf', url: 'https://mgigolf.com/pages/e-boost-pushcart' },
  'mgi-accessories': { title: 'MGI buggy accessories', publisher: 'MGI Golf', url: 'https://mgigolf.com/collections/accessories' },
  'mgi-manuals': { title: 'User manuals', publisher: 'MGI Golf', url: 'https://mgigolf.com/pages/user-manuals' },
  'mgi-warranty': { title: 'Warranty', publisher: 'MGI Golf', url: 'https://mgigolf.com/pages/warranty' },
  // Safety bodies. These sites block scripted requests, so each was confirmed through search results.
  'psa-lithium': { title: 'Lithium-ion batteries guide', publisher: 'Product Safety Australia (ACCC)', url: 'https://www.productsafety.gov.au/products/electronics-technology/lithium-ion-batteries' },
  'ato-iawo': { title: '$20,000 instant asset write-off', publisher: 'Australian Taxation Office', url: 'https://www.ato.gov.au/about-ato/new-legislation/in-detail/businesses/20000-dollars-instant-asset-write-off' },
  'qfd-bushfire': { title: 'Plan to survive: bushfire survival planning', publisher: 'Queensland Fire Department', url: 'https://www.fire.qld.gov.au/plantosurvive' },
  'accc-parallel': { title: 'Buying parallel imports', publisher: 'ACCC', url: 'https://www.accc.gov.au/consumers/buying-products-and-services/buying-parallel-imports' },
  'qfd-lithium': { title: 'Lithium-ion battery safety', publisher: 'Queensland Fire Department', url: 'https://www.fire.qld.gov.au/safety-education/battery-and-charging-safety/lithium-ion-battery-safety' },
  // Owner-approved exceptions to rule 1 (reference and editorial sources), used sparingly.
  'wiki-golf-trolley': { title: 'Golf trolley', publisher: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Golf_trolley' },
  'golf-digest-mgi': { title: 'MGI Golf: 2026 equipment guide', publisher: 'Australian Golf Digest', url: 'https://www.australiangolfdigest.com.au/2026-equipment-guide-mgi-golf/' },
  // YouTube videos from official brand channels, government bodies and respected reviewers. Each was confirmed public
  // with YouTube oEmbed (title and channel read back) in November 2026. Never link a retailer's channel.
  'yt-mgi-zip': { title: "MGI Golf | Zip Series (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=zU88SD9rHRk' },
  'yt-mgi-ai': { title: "MGI Golf | Ai Series (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=LOdjuJ1E8c0' },
  'yt-mgi-zip-navigator': { title: "MGI Zip Navigator Product Video (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=7djk8Qrt9WE' },
  'yt-mgi-fold': { title: "How to Unfold and Fold | Ai Series (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=xV2ZAs1P3xU' },
  'yt-mgi-battery': { title: "How to Best Care for Your Lithium Battery (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=hKNgNvFBwkI' },
  'yt-mgi-charge': { title: "How to Charge Your Battery | Zip Series (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=lrjpFRotpl4' },
  'yt-mgi-seat': { title: "How to Attach the Seat | Ai Navigator Halo (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=AurvDREdpv8' },
  'yt-mgi-service': { title: "MGI Service | Replace the Motor | Ai Nav GPS+ (video)", publisher: "MGI Golf", url: 'https://www.youtube.com/watch?v=-u6fe92ZK8M' },
  'yt-clubcar-onward': { title: "Onward HP LI-ION 2 Passenger Personal Transportation Vehicle (video)", publisher: "Club Car", url: 'https://www.youtube.com/watch?v=jKO_zgJtExw' },
  'yt-clubcar-resorts': { title: "Club Car Connect on Resorts (video)", publisher: "Club Car", url: 'https://www.youtube.com/watch?v=8ob2-7bvxjE' },
  'yt-clubcar-campgrounds': { title: "Club Car Connect on Campgrounds (video)", publisher: "Club Car", url: 'https://www.youtube.com/watch?v=RuLpAodj7FA' },
  'yt-clubcar-industrial': { title: "Club Car Connect: Industrial (video)", publisher: "Club Car", url: 'https://www.youtube.com/watch?v=ZR00b7c15T4' },
  'yt-yamaha-quietech': { title: "Yamaha QuieTech EFI Gas Golf Car (video)", publisher: "Yamaha Golf-Car Company", url: 'https://www.youtube.com/watch?v=USc6pnUcYzU' },
  'yt-yamaha-powertech': { title: "Introducing Yamaha's All-New Drive2 PowerTech Lithium with IRS (video)", publisher: "Yamaha Golf-Car Company", url: 'https://www.youtube.com/watch?v=gatKiw3iJ10' },
  'yt-yamaha-umax': { title: "Introducing.. the UMAX Rally™ (video)", publisher: "Yamaha Golf-Car Company", url: 'https://www.youtube.com/watch?v=3s_rE7LEI5c' },
  'yt-clicgear-4': { title: "Introducing the Clicgear Model 4.0 (video)", publisher: "Clicgear", url: 'https://www.youtube.com/watch?v=YEb_xNM5YRg' },
  'yt-clicgear-fold': { title: "Clicgear Model 4.0 Unfolding & Folding Instructions (video)", publisher: "Clicgear", url: 'https://www.youtube.com/watch?v=pJXxE9gnMSA' },
  'yt-usga-etiquette': { title: "Fore the Golfer: Golf Cart and Pull Cart Etiquette (video)", publisher: "United States Golf Association (USGA)", url: 'https://www.youtube.com/watch?v=m2PKDVsHqiE' },
  'yt-accc-basics': { title: "Consumer guarantees: the basics (video)", publisher: "ACCC", url: 'https://www.youtube.com/watch?v=H1a1ojlgyJQ' },
  'yt-accc-detail': { title: "Consumer guarantees: in detail (video)", publisher: "ACCC", url: 'https://www.youtube.com/watch?v=niRakzWL_9k' },
  'yt-frnsw-lithium': { title: "Safeguard your homes from Lithium-ion battery risks (video)", publisher: "Fire and Rescue NSW", url: 'https://www.youtube.com/watch?v=vgEG0shJExI' },
  'yt-moneysmart-bnpl': { title: "How Buy Now Pay Later Works (video)", publisher: "Moneysmart", url: 'https://www.youtube.com/watch?v=uuNSAQldaMA' },
  'yt-moneysmart-scam': { title: "How to Spot an Investment Scam (video)", publisher: "Moneysmart", url: 'https://www.youtube.com/watch?v=6xbfeTANaQc' },
  'yt-golfalot-trolley': { title: "Electric Golf Trolley BUYING GUIDE! (video)", publisher: "Golfalot", url: 'https://www.youtube.com/watch?v=g_yxd5V07BU' },
} satisfies Record<string, Reference>;

export type ReferenceId = keyof typeof REFERENCES;

/** Brand page slug -> the maker's own site. Only makers with a verified official site. */
export const BRAND_REFERENCES: Record<string, ReferenceId> = {
  'club-car': 'maker-club-car',
  'e-z-go': 'maker-e-z-go',
  yamaha: 'maker-yamaha',
  powakaddy: 'maker-powakaddy',
  mgi: 'maker-mgi',
  clicgear: 'maker-clicgear',
  rovic: 'maker-clicgear',
  evolution: 'maker-evolution',
  cushman: 'maker-cushman',
};

/** A second source for a brand page, beyond the maker. */
export const BRAND_EXTRA_REFERENCES: Record<string, ReferenceId[]> = {
  mgi: ['golf-digest-mgi'],
  clicgear: ['wiki-golf-trolley'],
};

/** Product page -> its outbound sources: the maker, plus a safety body for batteries and chargers. */
export function productReferenceIds(p: { name: string; category: string }, fullSizeVehicle: boolean): ReferenceId[] {
  const n = p.name;
  const mgi = /^MGI/i.test(n);
  if (/Fireproof Charging Box/i.test(n)) return ['mgi-lithium-faq', 'psa-lithium', 'qfd-lithium'];
  if (p.category === 'Golf Buggy Batteries & Chargers') return mgi ? ['mgi-lithium-faq', 'psa-lithium'] : ['accc-lithium', 'wiki-lfp'];
  if (/^(Clicgear|Rovic)/i.test(n)) return ['maker-clicgear'];
  if (p.category === 'Motorised Walk-Behind Golf Buggies' && mgi) {
    if (/E-Boost/i.test(n)) return ['mgi-eboost'];
    if (/Ai |Halo/i.test(n)) return ['mgi-ai-faq'];
    if (/Zip|Navigator/i.test(n)) return ['mgi-zip-faq'];
    return ['maker-mgi'];
  }
  if (p.category === 'Golf Buggy Accessories & Spare Parts' && mgi) return /Halo Eye/i.test(n) ? ['mgi-ai-faq'] : ['mgi-accessories'];
  if (fullSizeVehicle) return ['nsw-golf-buggy', 'qld-golf-buggy', 'vic-noncompliant', 'sa-restricted'];
  return [];
}

const STATE_REFS: Record<string, ReferenceId[]> = {
  QLD: ['qld-golf-buggy', 'qld-conditional'],
  NSW: ['nsw-golf-buggy'],
  VIC: ['vic-noncompliant'],
  SA: ['sa-restricted'],
  WA: ['wa-registration'],
};
export const referencesForState = (stateCode: string): ReferenceId[] => STATE_REFS[stateCode] ?? [];

/** Guide slug -> the sources that back what the guide says. */
export const GUIDE_REFERENCES: Record<string, ReferenceId[]> = {
  'electric-golf-buggy-that-follows-you-gps-follow-vs-remote-australia': ['mgi-ai-faq', 'golf-digest-mgi'],
  'golf-buggy-top-speed-australia-what-to-know-before-you-change-it': ['qld-golf-buggy', 'nsw-golf-buggy'],
  'buggy-vs-golf-cart-vs-side-by-side-utv-five-year-cost-australia': ['accc-guarantees'],
  'golf-buggy-bushfire-season-battery-charging-safety-australia': ['qfd-bushfire', 'qfd-lithium'],
  'golf-buggy-salt-air-coastal-care-australia': ['qfd-lithium', 'accc-lithium'],
  'golf-buggy-heat-summer-battery-storage-australia': ['qfd-lithium', 'mgi-lithium-faq'],
  'golf-buggy-instant-asset-write-off-business-australia': ['ato-iawo'],
  'parallel-import-golf-buggies-grey-import-risks-australia': ['accc-parallel', 'accc-guarantees', 'accc-warranties'],
  'golf-buggy-registration-australia-conditional-road-access': ['qld-golf-buggy', 'nsw-golf-buggy', 'vic-noncompliant', 'sa-restricted', 'wa-registration'],
  'golf-carts-for-sale-brisbane-buyers-guide': ['qld-golf-buggy', 'qld-conditional'],
  'golf-carts-for-sale-sydney-nsw-buyers-guide': ['nsw-golf-buggy'],
  'golf-carts-for-sale-melbourne-buyers-guide': ['vic-noncompliant'],
  'golf-carts-for-sale-adelaide-sa-buyers-guide': ['sa-restricted'],
  'golf-carts-for-sale-perth-wa-buyers-guide': ['wa-registration'],
  'buying-a-4-seater-golf-buggy-in-australia-rules-and-guide': ['nsw-golf-buggy', 'qld-golf-buggy'],
  'golf-buggy-lighting-street-legal-kits-australia': ['nsw-golf-buggy', 'qld-golf-buggy'],
  'golf-buggy-warranty-australia-explained': ['accc-guarantees', 'accc-warranties'],
  'buying-second-hand-golf-carts-in-australia-checklist': ['accc-guarantees'],
  'golf-buggy-insurance-australia-explained': ['moneysmart-insurance', 'accc-guarantees'],
  'golf-cart-finance-options-pay-in-4-vs-crypto-discounts': ['moneysmart-bnpl', 'ato-crypto'],
  'paying-for-a-golf-buggy-in-crypto-btc-usdt-guide': ['ato-crypto'],
  'how-golf-buggy-ordering-invoicing-delivery-works': ['abr', 'accc-guarantees'],
  'lithium-vs-lead-acid-golf-buggy-batteries-australia': ['wiki-lfp', 'accc-lithium'],
  'mgi-zip-x-series-explained': ['mgi-zip-faq', 'mgi-manuals'],
  'mgi-ai-navigator-gps-explained': ['mgi-ai-faq', 'golf-digest-mgi'],
  'mgi-zip-navigator-setup-guide': ['mgi-zip-faq', 'mgi-manuals'],
  'clicgear-rovic-push-buggies-guide': ['maker-clicgear', 'wiki-golf-trolley'],
  'mgi-buggy-accessories-guide': ['mgi-accessories', 'mgi-manuals'],
  'mgi-remote-pairing-guide': ['mgi-zip-faq', 'mgi-ai-faq'],
  'mgi-battery-charger-guide': ['mgi-lithium-faq', 'psa-lithium', 'qfd-lithium'],
  'mgi-golf-buggies-australia-guide': ['maker-mgi', 'golf-digest-mgi', 'mgi-warranty'],
  'mgi-parts-wheels-warranty-guide': ['mgi-warranty', 'mgi-manuals', 'accc-guarantees'],
  'mgi-zip-navigator-troubleshooting': ['mgi-zip-faq', 'qfd-lithium'],
  'clicgear-vs-mgi-push-buggy-comparison-australia': ['maker-clicgear', 'maker-mgi'],
  'golf-push-cart-vs-electric-trolley-australia': ['wiki-golf-trolley'],
  'lithium-battery-conversion-guide-cost-australia': ['accc-lithium', 'wiki-lfp'],
  'golf-buggy-winter-storage-battery-care-australia': ['accc-lithium'],
  'golf-buggy-chargers-explained-australia': ['accc-lithium'],
  'electric-golf-buggy-maintenance-schedule-australia': ['accc-lithium'],
  'solar-panels-on-golf-buggies-australia-feasibility-guide': ['accc-lithium'],
  'transporting-towing-golf-buggy-australia-trailers-tie-downs': ['nhvr-load'],
  'golf-buggy-etiquette-course-rules-australia': ['rules-of-golf'],
  'golf-car-vs-golf-buggy-vs-golf-cart-australia': ['wiki-golf-cart'],
};

/** Guides rewritten in Phase 6: 2-4 sources each, at least one verified YouTube video. Overrides the entries above. */
const PHASE6_GUIDE_REFERENCES: Record<string, ReferenceId[]> = {
  'lithium-vs-lead-acid-golf-buggy-batteries-australia': [
    'wiki-lfp',
    'accc-lithium',
    'yt-frnsw-lithium'
  ],
  'buying-a-4-seater-golf-buggy-in-australia-rules-and-guide': [
    'nsw-golf-buggy',
    'qld-golf-buggy',
    'yt-clubcar-onward'
  ],
  'lifted-4x4-golf-carts-acreage-and-farm-performance': [
    'maker-club-car',
    'yt-clubcar-industrial'
  ],
  'golf-buggy-maintenance-checklist-australian-climates': [
    'qfd-lithium',
    'accc-lithium',
    'yt-mgi-battery'
  ],
  'golf-cart-finance-options-pay-in-4-vs-crypto-discounts': [
    'moneysmart-bnpl',
    'ato-crypto',
    'yt-moneysmart-bnpl'
  ],
  'commercial-utility-golf-buggies-resorts-and-industrial-parks': [
    'maker-club-car',
    'yt-clubcar-resorts'
  ],
  'remote-control-golf-buggy-australia-buyers-guide': [
    'mgi-ai-faq',
    'yt-mgi-zip-navigator'
  ],
  'best-push-golf-buggy-australia-3-wheel-vs-4-wheel-review': [
    'maker-clicgear',
    'yt-clicgear-4'
  ],
  'foldable-golf-buggy-buyers-guide-boot-space-weight': [
    'maker-mgi',
    'yt-mgi-fold',
    'yt-clicgear-fold'
  ],
  'motorised-vs-push-golf-buggy-health-stamina-benefits': [
    'wiki-golf-trolley',
    'yt-golfalot-trolley'
  ],
  'must-have-golf-buggy-accessories-and-spares-australia': [
    'mgi-accessories',
    'yt-mgi-seat'
  ],
  'buying-second-hand-golf-carts-in-australia-checklist': [
    'accc-guarantees',
    'yt-accc-basics'
  ],
  'heavy-duty-off-road-golf-buggy-rural-acreage-guide': [
    'maker-club-car',
    'yt-yamaha-umax'
  ],
  'electric-utility-buggy-price-guide-australia': [
    'maker-club-car',
    'yt-clubcar-industrial'
  ],
  'electric-golf-buggy-troubleshooting-and-replacement-parts': [
    'mgi-zip-faq',
    'mgi-manuals',
    'yt-mgi-service'
  ],
  'how-to-choose-the-right-electric-golf-buggy-in-australia': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'golf-buggy-registration-australia-conditional-road-access': [
    'qld-golf-buggy',
    'nsw-golf-buggy',
    'vic-noncompliant',
    'yt-clubcar-onward'
  ],
  'lithium-battery-conversion-guide-cost-australia': [
    'accc-lithium',
    'wiki-lfp',
    'yt-frnsw-lithium'
  ],
  'electric-golf-buggy-maintenance-schedule-australia': [
    'accc-lithium',
    'yt-mgi-battery'
  ],
  'electric-golf-buggy-range-test-one-charge-australia': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'best-golf-trolley-australia-push-motorized-remote-comparison': [
    'wiki-golf-trolley',
    'maker-mgi',
    'yt-golfalot-trolley'
  ],
  'transporting-towing-golf-buggy-australia-trailers-tie-downs': [
    'nhvr-load',
    'yt-mgi-fold'
  ],
  'golf-buggy-winter-storage-battery-care-australia': [
    'accc-lithium',
    'yt-mgi-battery'
  ],
  'ac-vs-dc-golf-buggy-motors-torque-efficiency-australia': [
    'maker-yamaha',
    'yt-yamaha-powertech'
  ],
  'mgi-golf-buggy-accessories-guide-australia': [
    'mgi-accessories',
    'mgi-manuals',
    'yt-mgi-seat'
  ],
  'solar-panels-on-golf-buggies-australia-feasibility-guide': [
    'accc-lithium',
    'yt-frnsw-lithium'
  ],
  'used-golf-carts-for-sale-australia-what-we-check': [
    'accc-guarantees',
    'yt-accc-basics'
  ],
  'second-hand-golf-buggy-value-guide-australia': [
    'accc-guarantees',
    'yt-accc-detail'
  ],
  'used-petrol-golf-buggy-prices-australia': [
    'accc-guarantees',
    'yt-yamaha-quietech'
  ],
  'reconditioned-vs-new-golf-buggy-cost-comparison': [
    'accc-guarantees',
    'yt-accc-basics'
  ],
  'golf-caddy-australia-buyers-guide': [
    'wiki-golf-trolley',
    'maker-mgi',
    'yt-golfalot-trolley'
  ],
  'golf-carts-for-sale-brisbane-buyers-guide': [
    'qld-golf-buggy',
    'qld-conditional',
    'yt-clubcar-onward'
  ],
  'golf-carts-for-sale-melbourne-buyers-guide': [
    'vic-noncompliant',
    'yt-mgi-zip-navigator'
  ],
  'golf-carts-for-sale-perth-wa-buyers-guide': [
    'wa-registration',
    'yt-clubcar-onward'
  ],
  'golf-carts-for-sale-sydney-nsw-buyers-guide': [
    'nsw-golf-buggy',
    'yt-clubcar-onward'
  ],
  'golf-carts-for-sale-adelaide-sa-buyers-guide': [
    'sa-restricted',
    'yt-clubcar-industrial'
  ],
  'electric-buggy-australia-what-it-means': [
    'wiki-golf-cart',
    'yt-golfalot-trolley'
  ],
  'golf-push-cart-vs-electric-trolley-australia': [
    'wiki-golf-trolley',
    'yt-clicgear-4',
    'yt-golfalot-trolley'
  ],
  'golf-cart-with-remote-control-australia-guide': [
    'mgi-ai-faq',
    'yt-mgi-zip-navigator'
  ],
  'electric-golf-buggy-australia-complete-guide': [
    'wiki-lfp',
    'accc-lithium',
    'yt-clubcar-onward'
  ],
  'golf-car-vs-golf-buggy-vs-golf-cart-australia': [
    'wiki-golf-cart',
    'yt-clubcar-onward'
  ],
  'mgi-vs-motocaddy-electric-golf-trolley-australia': [
    'maker-mgi',
    'yt-mgi-zip-navigator',
    'yt-golfalot-trolley'
  ],
  'clicgear-vs-mgi-push-buggy-comparison-australia': [
    'maker-clicgear',
    'maker-mgi',
    'yt-clicgear-4',
    'yt-mgi-zip-navigator'
  ],
  'powakaddy-vs-mgi-electric-golf-trolley-australia': [
    'maker-powakaddy',
    'maker-mgi',
    'yt-golfalot-trolley'
  ],
  'best-electric-golf-trolley-brands-australia': [
    'maker-mgi',
    'maker-powakaddy',
    'yt-golfalot-trolley'
  ],
  'junior-golf-buggy-australia-guide': [
    'maker-clicgear',
    'yt-clicgear-fold'
  ],
  'how-much-does-a-golf-cart-cost-australia': [
    'accc-guarantees',
    'yt-clubcar-onward'
  ],
  'golf-buggy-parts-and-spares-australia-guide': [
    'accc-guarantees',
    'yt-mgi-service'
  ],
  'golf-buggy-seat-covers-and-upholstery-australia': [
    'mgi-accessories',
    'yt-mgi-seat'
  ],
  'golf-buggy-with-seat-options-explained-australia': [
    'mgi-accessories',
    'yt-mgi-seat'
  ],
  'golf-buggy-fleet-purchase-guide-australia': [
    'maker-club-car',
    'yt-clubcar-industrial'
  ],
  'eofy-golf-buggy-deals-australia-buying-guide': [
    'ato-iawo',
    'yt-moneysmart-bnpl'
  ],
  'golf-buggies-for-retirement-villages-australia': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'golf-buggy-tyres-explained-australia': [
    'maker-yamaha',
    'yt-yamaha-powertech'
  ],
  'golf-buggy-brakes-explained-australia': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'golf-buggy-chargers-explained-australia': [
    'accc-lithium',
    'qfd-lithium',
    'yt-mgi-charge'
  ],
  'how-golf-buggy-ordering-invoicing-delivery-works': [
    'abr',
    'accc-guarantees',
    'yt-accc-basics'
  ],
  'paying-for-a-golf-buggy-in-crypto-btc-usdt-guide': [
    'ato-crypto',
    'yt-moneysmart-scam'
  ],
  'golf-buggy-warranty-australia-explained': [
    'accc-guarantees',
    'accc-warranties',
    'yt-accc-detail'
  ],
  'golf-buggies-for-wineries-vineyards-australia': [
    'maker-club-car',
    'yt-clubcar-industrial'
  ],
  'golf-buggies-for-caravan-parks-holiday-resorts-australia': [
    'maker-club-car',
    'yt-clubcar-campgrounds',
    'yt-clubcar-resorts'
  ],
  'petrol-vs-electric-golf-buggy-running-costs-australia': [
    'maker-yamaha',
    'yt-yamaha-quietech'
  ],
  '4-seater-vs-6-seater-golf-buggies-australia': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'golf-buggies-for-gated-communities-residential-estates': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'golf-buggies-for-sale-canberra-act': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'golf-buggy-windscreens-weather-enclosures-australia': [
    'maker-club-car',
    'yt-clubcar-onward'
  ],
  'electric-golf-buggy-that-follows-you-gps-follow-vs-remote-australia': [
    'mgi-ai-faq',
    'golf-digest-mgi',
    'yt-mgi-ai'
  ],
  'golf-buggy-top-speed-australia-what-to-know-before-you-change-it': [
    'qld-golf-buggy',
    'nsw-golf-buggy',
    'yt-yamaha-powertech'
  ],
  'buggy-vs-golf-cart-vs-side-by-side-utv-five-year-cost-australia': [
    'accc-guarantees',
    'yt-clubcar-industrial'
  ]
};
Object.assign(GUIDE_REFERENCES, PHASE6_GUIDE_REFERENCES);

/** Resolve ids to links, dropping any id that does not exist (a typo cannot ship a dead link). */
export function resolveReferences(ids: ReferenceId[] | undefined): Reference[] {
  return (ids ?? []).map((id) => REFERENCES[id]).filter((r): r is Reference => Boolean(r));
}
