// src/config/site.ts - The Single Source of Truth for WebForge v9.1

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  fuel_type: string;
  price_aud: number;
  price_display: string;
  search_intent: string;
  target_audience: string;
  key_specs: string;
  shortDescription: string;
  fullDescription: string;
  badge?: string;
  featured?: boolean;
  images: string[];
  inStock?: boolean;
  /** The single term this page is meant to win. See docs/keyword-map.md. */
  primaryKeyword?: string;
  /** Six secondary terms. Each keyword in the catalogue is assigned to exactly
   *  one product so pages never compete with each other for the same query. */
  supportingKeywords?: string[];
  /** Six question/answer pairs, rendered on the page and as FAQPage JSON-LD. */
  faqs?: { q: string; a: string }[];
}

export const SITE = {
  name: 'The Buggies Express',
  legalEntity: 'Golf Buggies Express PTY LTD',
  tagline: "Australia's Most Complete Golf Buggy & Cart Specialists",
  domain: 'www.golfbuggiesexpress.com.au',
  locale: 'en-AU',
  currency: 'AUD',
  currencySymbol: '$',
  target: 'vercel',
  // Palette: Australian coastal & outback luxury. Warm bone canvas, white
  // card surfaces, architectural charcoal ink, sun-baked terracotta accent.
  primaryColor: '#C86D51',   // sun-baked terracotta - primary accent
  accentPressed: '#A85640',  // terracotta, hover/pressed
  accentFill: '#B45A40',     // solid CTA fill (clears 4.5:1 with white label)
  accentTint: '#F7EFEA',     // terracotta wash surface
  accentOnDark: '#E2A17A',   // ochre sand - highlights on charcoal
  charcoal: '#121417',       // architectural charcoal - ink and dark sections
  graphite: '#2B2F34',       // brushed graphite - borders on dark surfaces
  stoneMuted: '#78716C',     // secondary copy
  boneCanvas: '#F7F6F2',     // warm bone page canvas
  hairline: '#E7E5E4',       // 1px architectural border
  gscVerification: 'c84GqyF8sZHI_WHs_IfgbUi3R4vSlC2sR_zklWfWSI8',
  indexNowKey: 'golfbuggiesexpress-idx-2025',
  cartKey: 'buggies-express-cart',
};

// Sitemap <lastmod> dates. Google ignores lastmod once it sees it lie, and the
// old sitemap stamped every URL with the build time, so 118 pages claimed to
// change on every deploy. These are bumped by hand when the content they
// cover actually changes; blog posts use their own `date`.
export const CONTENT_UPDATED = {
  /** PRODUCTS, CATEGORIES or BRAND_PAGES changed (prices, specs, copy, new models). */
  catalog: '2026-09-11',
  /** Static pages: home, about, faq, delivery, contact, crypto-payment, wholesale. */
  pages: '2026-09-11',
};

export function isAccessoryItem(category?: string, id?: string, name?: string): boolean {
  if (id && id.startsWith('PART-')) return true;
  const cat = (category || '').toLowerCase();
  if (cat.includes('batteries') || cat.includes('chargers') || cat.includes('parts')) return true;
  const n = (name || '').toLowerCase();
  if (n.includes('charger') || n.includes('battery') || n.includes('cover') || n.includes('enclosure') || n.includes('windshield') || n.includes('solar') || n.includes('cable') || n.includes('mirror') || n.includes('caddy') || n.includes('cup holder') || n.includes('conversion kit')) return true;
  return false;
}

export function isBuggyItem(category?: string, id?: string, name?: string): boolean {
  return !isAccessoryItem(category, id, name);
}

export const ABN_INFO = {
  companyName: 'GOLF BUGGIES EXPRESS PTY LTD',
  acn: '668 598 758',
  abn: '28 668 598 758',
  abnFormatted: '28 668 598 758',
  status: 'Registered',
  registeredDate: '7/06/2023',
  registrationDate: '7/06/2023',
  reviewDate: '7/06/2027',
  regulator: 'Australian Securities & Investments Commission (ASIC)',
  locality: 'YATALA QLD 4207',
  country: 'Australia',
  officialLookupUrl: 'https://abr.business.gov.au/ABN/View?id=28668598758',
  abrLookupUrl: 'https://abr.business.gov.au/ABN/View?id=28668598758',
  officialAbrLink: 'https://abr.business.gov.au/ABN/View?id=28668598758',
  heroQuote: "Australia's most complete golf buggy business — sales, service, warranty, parts, and custom builds, backed by support that doesn't end at delivery.",
};

export const CONTACT = {
  email: 'sales&#64;golfbuggiesexpress.com.au',
  emailRaw: 'sales@golfbuggiesexpress.com.au',
  phone: '+61 480 804 189',
  phoneDisplay: '0480 804 189',
  whatsappNumber: '+61480804189',
  whatsappUrl: 'https://wa.me/61480804189',
  address: 'Yatala Industrial Hub, Yatala QLD 4207',
  hq: 'Yatala, Queensland, Australia',
  country: 'Australia',
  serviceFootprint: 'Australia-wide direct freight & enclosed delivery (Gold Coast, Brisbane, Sydney, Melbourne, Perth, Adelaide, Cairns)',
};

// Order rules. This block is the ONLY source of truth for them - CLAUDE.md
// deliberately no longer restates the numbers, so they cannot drift again.
//
// Confirmed by the owner 2026-09-10: there is NO minimum order, and NO
// free-freight threshold. Freight is always quoted against the delivery
// postcode at checkout. The earlier $1,000 / $25,000 / $500 figures were
// stale and are gone - do not reintroduce any of them.
export const SHOP = {
  minOrder: 0,                     // confirmed: no minimum order
  freeShippingThreshold: null,     // confirmed: no free-freight offer; always quoted
  shippingNote: 'Calculated according to location/distance & pallet freight requirements',
  cryptoDiscount: 10, // 10% on BTC / USDT
  accessoryBundleDiscount: 5, // 5% discount on all accessories when purchased alongside any buggy
  financeIn4: {
    enabled: true,
    installments: 4,
    interestRate: '0%',
    frequency: 'Fortnightly or Monthly',
    description: 'Split your purchase into 4 equal interest-free installments with 0% interest and instant approval.',
  },
  paymentMethods: [
    'PayID / Osko',
    'Direct Bank Transfer (EFT)',
    'Finance in 4 (4 Equal Interest-Free Payments)',
    'Crypto (BTC / USDT - 10% Off)',
  ],
};

// Crypto settlement. Buyers paying in BTC or USDT take SHOP.cryptoDiscount off
// the vehicle price; freight and accessories are charged at full rate on top.
//
// The seller addresses below are intentionally empty. They must be pasted in by
// the business owner and checked character by character - a mistyped address
// sends funds somewhere unrecoverable, and there is no reversal on a settled
// chain transaction. While an address is blank the portal hides the
// "pay the seller directly" route rather than showing a placeholder.
export const CRYPTO = {
  discountPercent: SHOP.cryptoDiscount,
  wallets: [
    {
      key: 'btc',
      asset: 'BTC',
      assetName: 'Bitcoin',
      network: 'Bitcoin mainnet',
      addressHint: 'starts with bc1, 1 or 3',
      address: 'bc1qe3mfevg3ud3jukp9ad37wszcfrwev7zxxex5u5',
    },
    {
      key: 'usdt-trc20',
      asset: 'USDT',
      assetName: 'Tether',
      network: 'Tron (TRC-20)',
      addressHint: 'starts with T',
      address: 'TVQGzSJKcHXTwX6Fn8CPb6A5PmAkoCFZRh',
    },
    {
      key: 'usdt-erc20',
      asset: 'USDT',
      assetName: 'Tether',
      network: 'Ethereum (ERC-20)',
      addressHint: 'starts with 0x',
      address: '0x2629c24d3720E5A24adBe7Bde4677334B559C36D',
    },
  ],
  // Independent third-party exchanges. The Buggies Express has no commercial
  // relationship with any of them and earns nothing from these links.
  portals: [
    {
      name: 'CoinSpot',
      url: 'https://www.coinspot.com.au/',
      basedIn: 'Australia',
      rails: 'PayID, Osko, bank transfer, debit and credit card',
      note: 'AUSTRAC-registered Australian exchange. AUD deposits settle without a currency conversion spread.',
    },
    {
      name: 'Coinbase',
      url: 'https://www.coinbase.com/',
      basedIn: 'United States',
      rails: 'Debit and credit card, bank transfer',
      note: 'Publicly listed and the most widely used exchange worldwide. Straightforward for a first-time buyer.',
    },
    {
      name: 'Binance',
      url: 'https://www.binance.com/en-AU/crypto/buy',
      basedIn: 'Global',
      rails: 'Debit and credit card, bank transfer',
      note: 'Largest exchange by trading volume, with deep BTC and USDT liquidity. AUD bank rails have been intermittent for Australian users.',
    },
    {
      name: 'MoonPay',
      url: 'https://www.moonpay.com/buy',
      basedIn: 'Global',
      rails: 'Debit and credit card, Apple Pay, Google Pay',
      note: 'Card-first on-ramp with no exchange account to open. Convenience fees are higher than an exchange.',
    },
  ],
};

export const FORMS = {
  provider: 'web3forms',
  web3formsKey: 'PENDING',
  zohoEmail: 'sales@golfbuggiesexpress.com.au',
  resendFrom: '',
  turnstileSiteKey: '',
};

export const CHAT = {
  whatsappNumber: '+61480804189',
  tawkPropertyId: 'pending',
};

export const BRAND = {
  foundingYear: '2023',
  foundingLocation: 'Queensland, Australia',
  description: "Australia's most complete golf buggy business — sales, service, warranty, parts, and custom builds, backed by support that doesn't end at delivery.",
  milestones: [
    { year: '2023', event: 'Registered GOLF BUGGIES EXPRESS PTY LTD (ACN 668 598 758) in Yatala QLD to bridge the gap in genuine warranty-backed golf cart sales across Australia.' },
    { year: '2024', event: 'Expanded Yatala central depot to house over 60+ in-stock models spanning lithium 4-seaters, farm utilities, and remote walk-behind buggies.' },
    { year: '2025', event: 'Expanded dedicated national delivery and freight network delivering crated and ready-to-drive golf buggies directly across regional QLD, NSW, VIC, and nationwide.' },
  ],
  differentiation: [
    'Service & warranty that does not stop at delivery — backed by dedicated technicians and field support.',
    'A true one-stop Australian shop: new, certified pre-owned, batteries, chargers, and custom builds all under one roof.',
    'Built for every customer: golf club fleet operators, luxury gated estate residents, and heavy acreage farm owners.',
    'Quality & customisation without the usual trade-offs: factory lithium upgrades, high-torque lift packages, and prompt freight delivery.',
  ],
  sameAs: [],
  awards: [],
};

// Factory finishes offered across the fleet. The swatch applies a CSS filter
// to the product photograph so the buyer can preview a finish; the render is
// indicative only, which the UI states plainly next to the swatches.
// Brands carried, with the model count each. Counts are derived from PRODUCTS
// at build time in the nav, so this list only names the brand and its query.
export const BRANDS = [
  { name: 'Club Car', q: 'Club Car' },
  { name: 'E-Z-GO', q: 'E-Z-GO' },
  { name: 'Yamaha', q: 'Yamaha' },
  { name: 'Evolution', q: 'Evolution' },
  { name: 'LVTONG', q: 'LVTONG' },
  { name: 'Tara', q: 'Tara' },
  { name: 'MGI', q: 'MGI' },
  { name: 'Atlas', q: 'Atlas' },
] as const;

/**
 * Shop-by-brand pages. `match` is tested case-insensitively against a
 * product name to build each brand's range, so adding a product to PRODUCTS
 * automatically lands it on the right brand page.
 *
 * Only brands we actually stock appear here. Rival brands are discussed in
 * blog comparisons and never given a shop page, because a shop page implies
 * stock we do not hold.
 */
export interface BrandPage {
  slug: string;
  name: string;
  match: string;
  origin: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  intro: string;
  body: string;
}

export const BRAND_PAGES: BrandPage[] = [
  {
    slug: 'club-car',
    name: 'Club Car',
    match: 'club car',
    origin: 'United States',
    primaryKeyword: 'club car golf carts',
    supportingKeywords: ['club car golf buggy australia', 'clubcar golf carts for sale', 'club car golf cart parts', 'club car onward australia', 'club car tempo australia', 'club car utility vehicle'],
    intro: 'Club Car golf buggies for sale in Australia, stocked and serviced from our Yatala QLD depot with genuine parts held locally.',
    body: 'Club Car is the brand buyers choose when resale value matters as much as the drive. The aircraft-grade aluminium frame is the reason: aluminium does not rust, so coastal salt air and irrigated fairways cannot eat the chassis out from under the bodywork the way they do with steel-framed imports. That single material decision is why a well-kept Club Car holds its price years after a cheaper buggy has become a liability. We carry the Onward, Tempo, Carryall and Transporter lines, spanning private golf, estate driving, grounds work and passenger shuttling, in both lithium and EFI petrol. Parts are held in Australia rather than ordered in when something fails.',
  },
  {
    slug: 'mgi',
    name: 'MGI',
    match: 'mgi',
    origin: 'Australia',
    primaryKeyword: 'mgi golf buggy',
    supportingKeywords: ['mgi golf cart', 'mgi golf buggies', 'mgi golf buggy australia', 'mgi buggy', 'mgi golf carts', 'mgi zip navigator'],
    intro: 'MGI motorised and remote control golf buggies, the Australian-designed walk-behind range, in stock at Yatala QLD.',
    body: 'MGI is an Australian company and it shows in how the buggies are set up for local courses. The Zip and Ai Navigator ranges cover the whole walk-behind spectrum, from a simple speed dial for a first motorised buggy through to full directional remote control with gyroscope straight-tracking that holds a line across cambered fairways. Australian conditions were the design brief rather than an afterthought, which matters on kikuyu and couch turf and through a wet season. Genuine MGI batteries, remotes and accessories are held in Australian stock, so a worn consumable does not mean replacing an otherwise healthy buggy.',
  },
  {
    slug: 'e-z-go',
    name: 'E-Z-GO',
    match: 'e-z-go',
    origin: 'United States',
    primaryKeyword: 'ezgo golf buggy',
    supportingKeywords: ['ezgo golf cart parts australia', 'ez go golf carts', 'ezgo golf carts for sale', 'ezgo golf buggy parts', 'e-z-go golf cart', 'ezgo rxv australia'],
    intro: 'E-Z-GO golf buggies and utility vehicles for sale in Australia, with ELiTE lithium models and EFI petrol, supported from Yatala QLD.',
    body: 'E-Z-GO builds around safety and serviceability rather than headline specifications. The RXV ELiTE is the clearest example: its automatic electromagnetic brake holds the buggy the instant you lift off the throttle, so it will not creep on a steep fairway or a sloped village driveway. For retirement village residents and anyone parking on an incline, that behaviour is worth more than any number on a spec sheet. The range runs from two-seat golf models through the six-seat Express L6 to the Cushman Hauler commercial line. ELiTE lithium uses Samsung SDI cells, and parts are stocked in Australia.',
  },
  {
    slug: 'yamaha',
    name: 'Yamaha',
    match: 'yamaha',
    origin: 'Japan',
    primaryKeyword: 'yamaha golf carts',
    supportingKeywords: ['yamaha golf cart parts', 'yamaha golf buggy parts', 'yamaha golf carts australia', 'yamaha golf cart for sale', 'yamaha golf car parts', 'yamaha drive2 australia'],
    intro: 'Yamaha golf buggies and UMAX utility vehicles for sale in Australia, including the QuietTech EFI petrol range, from our Yatala QLD depot.',
    body: 'Yamaha brings its engine and chassis engineering to a category where most competitors buy both in. Two things stand out. Independent front and rear suspension on the Drive2 is rare at this level and it is why the buggy absorbs rough turf and unsealed tracks as a muted movement rather than a jolt through the seat frame. And QuietTech petrol answers the one real objection to combustion: it brings a petrol buggy close enough to electric in sound that conversation at speed stays comfortable, while keeping unlimited range and one-minute refuelling. The UMAX line covers livestock properties and large regional venues.',
  },
  {
    slug: 'evolution',
    name: 'Evolution',
    match: 'evolution',
    origin: 'United States',
    primaryKeyword: 'evolution golf carts australia',
    supportingKeywords: ['evolution d5 golf cart', 'evolution golf cart price', 'evolution electric golf cart', 'evolution d5 ranger', 'evolution golf buggy', 'evolution classic golf cart'],
    intro: 'Evolution electric golf buggies for sale in Australia, from the six-passenger D5 Ranger to the Classic 2 Plus, in stock at Yatala QLD.',
    body: 'Evolution builds the most screen-forward buggies we stock, and for buyers coming across from a modern car that familiarity matters. The D5 Ranger 4+2 carries six passengers with forward-facing seating in both rows, a nine-inch touchscreen and a 110Ah lithium pack, which makes it the largest-capacity model in our luxury range. The Classic 2 Plus brings automotive-level instrumentation to a two-seat buggy: a 6.3-inch LCD, side mirrors with integrated turn signals and reverse camera compatibility, which is what buyers on shared estate roads actually ask for. The 700 heavy commercial utility covers facility and patrol work.',
  },
  {
    slug: 'lvtong',
    name: 'LVTONG',
    match: 'lvtong',
    origin: 'China',
    primaryKeyword: 'lvtong golf cart australia',
    supportingKeywords: ['lvtong golf buggy', 'lvtong electric golf cart', 'lvtong resort cruiser', 'commercial golf buggy australia', 'holiday park golf buggy', 'caravan park golf cart'],
    intro: 'LVTONG electric golf buggies for Australian resorts, caravan parks and commercial operators, supplied and supported from Yatala QLD.',
    body: 'LVTONG is specified by operators who count running cost per year rather than features per brochure, and it has become a proven workhorse across Australian caravan parks and holiday resorts. The Resort Cruiser pairs a 4kW AC motor with a maintenance-free lithium pack and an on-board charger, so any standard outlet becomes a charging point without new infrastructure. Heavy-duty bumpers take the knocks that shared-use vehicles collect from bollards and gateposts. The commercial flatbed adds a low steel mesh deck that drains, turning awkward lifts into slides for nursery and grounds work.',
  },
  {
    slug: 'tara',
    name: 'Tara',
    match: 'tara',
    origin: 'Australia',
    primaryKeyword: 'tara golf buggy australia',
    supportingKeywords: ['tara roadster golf cart', 'affordable golf buggy australia', 'value golf cart australia', 'lifted golf buggy value', 'budget 4 seater golf cart', 'tara spirit golf buggy'],
    intro: 'Tara golf buggies for sale in Australia, the value end of the lifted and two-seat lithium range, from our Yatala QLD depot.',
    body: 'Tara is where the range earns its value position with hardware rather than trim. The Roadster 2+2 Lifted is the clearest case: hydraulic disc brakes on a lifted chassis give genuine stopping control on sloped semi-rural driveways where drum brakes fade and feel vague under load, and the rear flip seat converts from passenger bench to flat cargo deck in seconds. The Roadster 4 Off-Road uses a high-torque gear reduction chosen specifically for sustained climbing rather than flat-ground speed. The Spirit Pro is a straightforward lithium two-seater for golfers stepping away from an ageing lead-acid buggy.',
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    match: 'atlas',
    origin: 'United States',
    primaryKeyword: 'atlas golf carts',
    supportingKeywords: ['atlas golf carts australia', 'atlas golf carts for sale', 'atlas golf cart accessories', 'atlas golf cars', 'atlas lifted golf cart', 'atlas 4 passenger buggy'],
    intro: 'Atlas lifted lithium golf buggies for Australian estates and acreage, including the 350A heavy-duty model, in stock at Yatala QLD.',
    body: 'Atlas is the range we point acreage owners at when a standard-height buggy has already disappointed them. Both models are built around ground clearance and hill capability rather than fairway manners. The 4-Passenger Lifted pairs a three-inch factory lift and 14-inch alloys with custom leather seating, so it clears rutted estate driveways without giving up cabin comfort. The Heavy-Duty Lifted 350A goes further, with a 350-amp controller and four-wheel hydraulic disc brakes: controller amperage is what decides whether a laden four-seater walks up a steep farm track or bogs down halfway, and the brakes are what get it back down.',
  },
  {
    slug: 'cushman',
    name: 'Cushman',
    match: 'cushman',
    origin: 'United States',
    primaryKeyword: 'cushman utility vehicle australia',
    supportingKeywords: ['cushman hauler australia', 'cushman golf cart parts', 'cushman hauler 1200', 'commercial utility buggy australia', 'turf utility vehicle australia', 'grounds maintenance buggy'],
    intro: 'Cushman Hauler utility vehicles for Australian turf, grounds and agricultural work, supplied from our Yatala QLD depot.',
    body: 'Cushman is a work brand, and the specification reflects it. The Hauler PRO runs a 72V AC drive rather than the 48V systems common elsewhere in the range, and higher system voltage lets it move heavy loads at lower current, running cooler and holding performance through a full shift. Its optional electric dump bed turns tipping a load of sand or mulch into a button rather than a shovel. The petrol Hauler 1200 takes the opposite approach: a 13.5HP Kawasaki engine and a manual dump bed, with fewer systems to fail a long way from the shed. Both carry substantial rated loads.',
  },
  {
    slug: 'powakaddy',
    name: 'PowaKaddy',
    match: 'powakaddy',
    origin: 'United Kingdom',
    primaryKeyword: 'powakaddy golf buggy',
    supportingKeywords: ['powakaddy australia', 'powakaddy electric golf buggies', 'powakaddy golf trolleys', 'powakaddy buggy', 'powakaddy fx7 australia', 'uk electric golf trolley australia'],
    intro: 'PowaKaddy electric golf trolleys in Australia, including the FX7 GPS lithium, stocked and warranty-supported from Yatala QLD.',
    body: 'PowaKaddy brings UK engineering and the most readable screen in the walk-behind category. The FX7 carries a 3.5-inch OCA full-colour touchscreen preloaded with over 40,000 courses worldwide, so it works on your home course and on holiday without hunting for a download before every round. OCA bonding is the reason it stays legible in Australian sunlight where cheaper laminated screens wash out. The 30V Plug and Play lithium system fits and removes without tools, which matters when the buggy lives in a car boot between rounds and the battery comes inside to charge.',
  },
  {
    slug: 'robera',
    name: 'Robera',
    match: 'robera',
    origin: 'International',
    primaryKeyword: 'robera golf buggy australia',
    supportingKeywords: ['follow me golf buggy australia', 'hands free golf trolley', 'smart follow golf caddy', 'robera pro golf buggy', 'ai golf buggy australia', 'self following golf buggy'],
    intro: 'Robera hands-free follow golf buggies in Australia, the smart-tracking walk-behind option, stocked at our Yatala QLD depot.',
    body: 'Robera is the only buggy in our range that needs no input at all once you start walking. A smart tracking tag clips to your belt and the buggy follows your footsteps at a safe distance, so there is no remote to hold, no dial to adjust and nothing to think about between shots. Dual-mode remote control is still there when you want to send it ahead. All-terrain dual motors supply the independent drive that follow-mode needs to hold a line across slopes and around obstacles rather than cutting corners. For buyers who decided the point of walking is to walk unencumbered, this is the step up.',
  },
];

export const VEHICLE_COLORS = [
  { id: 'factory', name: 'Factory Finish', swatch: '#E7E5E4', filter: 'none' },
  { id: 'coastal-teal', name: 'Coastal Teal', swatch: '#2E8B87', filter: 'hue-rotate(150deg) saturate(1.25)' },
  { id: 'outback-ochre', name: 'Outback Ochre', swatch: '#C86D51', filter: 'hue-rotate(330deg) saturate(1.3)' },
  { id: 'graphite', name: 'Graphite Black', swatch: '#2B2F34', filter: 'saturate(0.25) brightness(0.82) contrast(1.1)' },
] as const;

// metaTitle / metaDescription carry each category's own keyword cluster
// (see docs/keyword-map.md). Without them every category inherits one
// templated description, which reads as near-duplicate content and wastes
// seven chances to place cluster terms. Titles <=60 chars, descriptions ~150.
export const CATEGORIES = [
  { slug: 'all', name: 'All Vehicles & Parts', count: 62 },
  {
    slug: 'luxury-4-seater',
    name: 'Luxury 4-Seater',
    rawCategory: 'Luxury & High-Demand 4-Seaters',
    count: 6,
    metaTitle: '4 Seater Golf Buggies for Sale Australia | Buggies Express',
    metaDescription:
      'Six luxury 4-seater golf buggies for sale in Australia, including 4+2 six-passenger cruisers. Lithium models tested at our Yatala QLD depot.',
  },
  {
    slug: 'traditional-2-seater',
    name: 'Traditional 2-Seater',
    rawCategory: 'Traditional 2-Seater Electric Golf Buggies',
    count: 6,
    metaTitle: '2 Seater Electric Golf Buggies for Sale | Buggies Express',
    metaDescription:
      'Traditional 2-person golf carts and electric buggies for sale in Australia. Club Car, E-Z-GO and Yamaha lithium models, priced with GST included.',
  },
  {
    slug: 'off-road-4x4',
    name: 'Off-Road 4x4',
    rawCategory: 'Off-Road, Lifted & 4x4 Buggies',
    count: 6,
    metaTitle: 'Lifted 4x4 Off-Road Golf Buggies Australia | Buggies Express',
    metaDescription:
      'Lifted 4x4 golf buggies built for Australian acreage and rough terrain. High ground clearance, heavy-duty brakes and all-terrain tyres from Yatala QLD.',
  },
  {
    slug: 'commercial-utility',
    name: 'Commercial Utility',
    rawCategory: 'Commercial & Farm Utility Buggies',
    count: 6,
    metaTitle: 'Commercial Utility Buggies Australia | Buggies Express',
    metaDescription:
      'Electric utility buggies for farms, resorts and industrial parks across Australia. Flatbed, cargo and 6-passenger transporters with enclosed freight.',
  },
  {
    slug: 'mechanical-petrol',
    name: 'Mechanical Petrol',
    rawCategory: 'Mechanical & Petrol Buggies',
    count: 6,
    metaTitle: 'Petrol Golf Buggies & EFI Carts for Sale | Buggies Express',
    metaDescription:
      'Petrol and EFI golf buggies for sale in Australia. Club Car, Yamaha and E-Z-GO mechanical models for properties without charging infrastructure.',
  },
  {
    slug: 'walk-behind-buggies',
    name: 'Walk-Behind Buggies',
    rawCategory: 'Motorised Walk-Behind Golf Buggies',
    count: 6,
    // Without this the template produces "Walk-Behind Buggies Buggies".
    h1: 'Motorised Walk-Behind Golf Buggies for Sale in Australia',
    metaTitle: 'Golf Trolleys & Motorised Golf Buggies | Buggies Express',
    metaDescription:
      'Motorised, remote control and foldable golf buggies for sale in Australia. MGI, PowaKaddy and Robera electric golf trolleys shipped from Yatala QLD.',
    // Body copy for the largest winnable keyword cluster in docs/keyword-map.md
    // (~3,050/mo, mostly KD < 20). Every claim below is checked against the six
    // products actually in this category. Note: the range is entirely MOTORISED
    // - there are no manual push trolleys in stock, so push buggies are only
    // ever discussed editorially and linked to the guides, never implied to be
    // for sale. Do not add "junior golf buggy" copy either: that cluster lives
    // on the coming-soon /shop/junior-golf-buggies/ page, and nothing here is
    // a junior model.
    intro:
      'Electric golf trolleys and motorised walk-behind buggies for Australian golfers who prefer to walk the course. Six lithium models from $1,299 to $2,849 AUD, including full remote control and hands-free follow, tested and dispatched from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Electric Golf Trolleys vs Push Buggies',
        body: 'A golf push buggy is moved by hand; a motorised golf buggy drives itself under lithium power while you walk beside it. Everything in this category is motorised — we do not stock manual push trolleys. If you are still weighing a push golf buggy against an electric golf trolley, or comparing three-wheel and four-wheel frames, the guides below cover both decisions before you commit to a model.',
      },
      {
        heading: 'Remote Control Golf Buggies',
        body: 'Two models in the range ship with a golf buggy remote. The MGI Ai Navigator adds full directional remote control with an integrated touchscreen GPS and a gyroscope straight tracker, and the Robera Pro offers dual-mode remote plus smart follow — a tracking tag clips to your belt so the buggy follows your footsteps hands-free. Both remote control golf buggies are stocked in Australia with local warranty support rather than parallel imported.',
      },
      {
        heading: 'Foldable and Compact Models',
        body: 'Boot space decides more purchases than any spec sheet. The MGI Zip X1 is the entry point at $1,299 AUD with a compact fold mechanism and a simple variable speed dial, and folding is standard across the range. Check the folded dimensions against your boot before ordering — the foldable buyers guide below walks through measuring it properly.',
      },
      {
        heading: 'Lithium Battery Range and Course Conditions',
        body: 'Every buggy here runs lithium rather than lead-acid. The Zip X5 carries a 36-hole extended lithium battery with downhill speed control and an electronic park brake, while the Zip Navigator pairs twin 230W motors with a rear fold-out fifth wheel for steeper fairway contours. The PowaKaddy FX7 runs a 30V plug-and-play lithium system behind a 3.5-inch colour touchscreen preloaded with over 40,000 courses worldwide.',
      },
    ],
    guides: [
      { slug: 'best-golf-trolley-australia-push-motorized-remote-comparison', label: 'Best golf trolley in Australia: push vs motorised vs remote' },
      { slug: 'best-push-golf-buggy-australia-3-wheel-vs-4-wheel-review', label: 'Push golf buggies compared: three-wheel vs four-wheel' },
      { slug: 'remote-control-golf-buggy-australia-buyers-guide', label: 'Remote control golf buggy buyers guide' },
      { slug: 'foldable-golf-buggy-buyers-guide-boot-space-weight', label: 'Foldable golf buggy guide: boot space and weight' },
      { slug: 'motorised-vs-push-golf-buggy-health-stamina-benefits', label: 'Motorised vs push: what it changes for your round' },
    ],
  },
  {
    slug: 'batteries-chargers',
    name: 'Batteries & Chargers',
    rawCategory: 'Golf Buggy Batteries & Chargers',
    count: 10,
    h1: 'Golf Buggy Batteries & Chargers in Australia',
    metaTitle: 'Golf Buggy Batteries & Chargers Australia | Buggies Express',
    metaDescription:
      'Golf buggy batteries and chargers in Australia. Lithium conversion kits, drop-in modules, deep cycle lead acid and smart chargers from our Yatala QLD depot.',
    // Split out of the old combined parts category so the battery cluster
    // (~700/mo, KD 5-14) has a canonical target of its own. Every figure below
    // is read off the ten products actually in this category - do not add
    // chemistry or runtime claims that no product on the site supports.
    intro:
      'Golf buggy batteries and chargers for Australian owners, from an $85 voltage reducer to a $4,700 72V commercial lithium pack. Ten power-system items covering lithium conversion kits, drop-in modules, deep cycle lead acid and smart on-board chargers, dispatched from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Lithium vs Lead Acid',
        body: 'We stock both, because the right answer depends on how often the buggy runs. Lead acid is still the cheapest way back on the course - a Trojan T-875 8V deep cycle cell is $340 AUD - but it needs watering and it sags as it discharges. Lithium costs more up front, starting at $1,850 AUD for an Invicta 48V 50Ah drop-in module, and gives you a sealed, maintenance-free pack instead. The comparison guide below sets the two side by side before you commit.',
      },
      {
        heading: '48V Lithium Conversion Kits',
        body: 'Converting an existing lead-acid buggy is the most common upgrade we ship. The Eco Battery 48V 105Ah conversion kit at $3,850 AUD and the RoyPow 48V 105Ah pack at $3,600 AUD both replace a full bank of lead-acid cells, and the Invicta 48V 50Ah module is the lighter drop-in option at $1,850 AUD. Check your existing charger and battery tray dimensions before ordering - the conversion guide below covers what a realistic total cost looks like.',
      },
      {
        heading: 'Chargers and Charging',
        body: 'A lithium pack needs a charger that matches it. The Delta-Q QuiQ 48V smart on-board charger is $680 AUD and the Club Car ERIC 48V high-frequency charger is $590 AUD. For properties without a convenient power point, the 175W solar charging panel expansion kit at $520 AUD supplements mains charging rather than replacing it - the solar guide below is honest about what it will and will not do in Australian conditions.',
      },
      {
        heading: '72V, 24V and Support Components',
        body: 'At the heavy end, the RoyPow 72V 105Ah commercial pack is $4,700 AUD for utility and resort fleets that run all day. At the other, the MGI 24V lithium battery at $450 AUD is the replacement pack for walk-behind trolleys, and the universal 48V/36V to 12V 30A voltage reducer at $85 AUD is what lets accessories such as lights and a soundbar run off the main pack safely.',
      },
    ],
    guides: [
      { slug: 'lithium-vs-lead-acid-golf-buggy-batteries-australia', label: 'Lithium vs lead acid golf buggy batteries' },
      { slug: 'lithium-battery-conversion-guide-cost-australia', label: 'Lithium conversion guide: what it really costs' },
      { slug: 'electric-golf-buggy-range-test-one-charge-australia', label: 'How far a buggy goes on one charge' },
      { slug: 'golf-buggy-winter-storage-battery-care-australia', label: 'Winter storage and battery care' },
      { slug: 'solar-panels-on-golf-buggies-australia-feasibility-guide', label: 'Solar panels on golf buggies: does it stack up?' },
    ],
  },
  {
    slug: 'accessories-spare-parts',
    name: 'Accessories & Spare Parts',
    rawCategory: 'Golf Buggy Accessories & Spare Parts',
    count: 16,
    h1: 'Golf Buggy Accessories & Spare Parts in Australia',
    metaTitle: 'Golf Buggy Accessories & Spare Parts | Buggies Express',
    metaDescription:
      'Golf buggy accessories and spare parts in Australia. Controllers, brake kits, wheels, windshields, lighting, seats and covers shipped from Yatala QLD.',
    // The other half of the old combined category. This cluster is the
    // lowest-KD block on the site (~550/mo, mostly KD 4-10) and most of it is
    // brand-qualified ("ezgo golf cart parts", "yamaha golf buggy parts"), so
    // the copy names the fitments we actually carry and nothing else.
    intro:
      'Golf buggy accessories and spare parts for Australian owners, from a $75 sand bottle set to a $1,450 AC controller upgrade. Sixteen items covering controllers and solenoids, brakes, wheels and tyres, lighting, mirrors, seating, weather protection and storage, dispatched from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Controllers and Electrical Spares',
        body: 'The controller decides how a buggy actually feels to drive. The Curtis 1268 400A programmable motor controller is $890 AUD, and the Navitas 600A AC controller upgrade kit at $1,450 AUD is the bigger step for owners chasing more torque on hills. The Albright 48VDC 200A heavy duty solenoid at $120 AUD is the part most often replaced when a buggy clicks but will not move.',
      },
      {
        heading: 'Lighting, Mirrors and Restraints',
        body: 'The MadJax Alpha Lux LED light kit is $320 AUD, side mirrors with integrated LED indicators are $95 AUD, and a retractable front and rear seatbelt set is $145 AUD. These are the components commonly fitted when owners want a buggy equipped for estate roads - but registration and road-use rules differ in every state and territory, so check your own requirements with the relevant authority before you rely on any of it.',
      },
      {
        heading: 'Wheels, Brakes and Terrain Hardware',
        body: 'For acreage and rough ground, the all-terrain 23x10.5-12 wheel and tyre combo is $850 AUD for a set of four, and the heavy duty 4-wheel hydraulic disc brake kit at $750 AUD is the matching upgrade - more tyre and more speed is worth very little without more brake. A heavy duty tow hitch and ball assembly is $110 AUD for owners towing a trailer or a greens roller.',
      },
      {
        heading: 'Seating, Weather Protection and Storage',
        body: 'The rear flip seat kit at $650 AUD converts a 2-seater into a 4-seater without a new vehicle. For weather, the all-weather heavy-duty PVC enclosure is $290 AUD and the foldable tinted acrylic windshield is $160 AUD. Storage and comfort round it out: a lockable dash glove box at $185 AUD, a 26-inch waterproof marine grade Bluetooth soundbar at $420 AUD, and a dual sand bottle assembly at $75 AUD. Walk-behind owners will also find the replacement MGI Ai and Zip remote controller here at $190 AUD.',
      },
    ],
    guides: [
      { slug: 'must-have-golf-buggy-accessories-and-spares-australia', label: 'Must-have golf buggy accessories and spares' },
      { slug: 'golf-buggy-parts-and-spares-australia-guide', label: 'Golf buggy parts and spares: a buyers guide' },
      { slug: 'electric-golf-buggy-troubleshooting-and-replacement-parts', label: 'Troubleshooting and replacement parts' },
      { slug: 'mgi-golf-buggy-accessories-guide-australia', label: 'MGI accessories and spares guide' },
      { slug: 'golf-buggy-seat-covers-and-upholstery-australia', label: 'Seat covers and upholstery' },
    ],
  },
  {
    slug: 'junior-golf-buggies',
    name: 'Junior Golf Buggies',
    rawCategory: 'Junior Golf Buggies',
    count: 0,
    // No products yet. The page exists so the junior cluster has a home
    // that starts earning before stock lands, and so interest can be
    // registered. CategoryClient swaps the catalogue for a register-interest
    // block; CatalogInterface hides the filter chip (a chip with zero
    // results is a dead end). Remove the flag - and add real products - when
    // the owner confirms the range. NOTHING here may state a date, price,
    // model or specification: none is final, and inventing one breaks the
    // no-fabricated-facts rule.
    comingSoon: true,
    metaTitle: 'Junior & Kids Golf Buggies — Coming Soon | Buggies Express',
    metaDescription:
      'Junior and kids golf buggies are coming to The Buggies Express. Register your interest and we will email you the day the range, photos and pricing go live.',
    h1: 'Junior Golf Buggies in Australia — Coming Soon',
    primaryKeyword: 'junior golf buggy',
    supportingKeywords: [
      'kids golf buggy',
      'kids golf cart',
      'childrens golf buggy',
      'junior golf buggy australia',
      'junior golf carts for sale',
      'junior golf buggies',
    ],
    intro:
      'A junior golf buggy range sized for younger golfers is on its way. We are finalising the models now, and until the buggies, photos and pricing are confirmed nothing on this page is for sale. Register your interest below and you will hear from us the day it lands, dispatched as always from our Yatala QLD depot.',
    sections: [
      {
        heading: 'What Makes a Golf Buggy Junior-Sized',
        body: 'A kids golf buggy is not simply a smaller adult one. The details that matter are a handle or seat height a younger golfer can use without reaching, a frame light enough for them to load themselves, and controls that are simple and predictable. Those are the criteria we are holding the range to, and we will publish the exact specification for every model rather than describe it loosely.',
      },
      {
        heading: 'What We Will and Will Not Say Yet',
        body: 'We have not announced a launch date, a price or a model list, because none of them is final. Every product on this site carries specifications we have checked at our Yatala QLD depot, and the junior range will be no different. When the buggies arrive you will see photographs of the actual units, GST-inclusive pricing and a full specification for each - not a rendering and a promise.',
      },
      {
        heading: 'In the Meantime: Our Current Range',
        body: 'Our walk-behind electric trolleys are built for adult golfers, so we will not claim any of them is a junior model. Whether one suits a taller teenager comes down to handle height and bag weight, and that is a conversation worth having with us rather than a guess. The junior buying guide below covers what to measure before you decide.',
      },
      {
        heading: 'Register Your Interest',
        body: 'Leave your name, email and postcode and we will let you know as soon as the range is live. Like everything we sell, junior golf buggies will ship Australia-wide in enclosed freight, with the cost quoted against your delivery postcode rather than added later.',
      },
    ],
    guides: [
      { slug: 'junior-golf-buggy-australia-guide', label: 'Junior golf buggy guide: sizing, safety and what to look for' },
      { slug: 'foldable-golf-buggy-buyers-guide-boot-space-weight', label: 'Foldable buggies: boot space and weight' },
      { slug: 'motorised-vs-push-golf-buggy-health-stamina-benefits', label: 'Motorised vs push: what it changes for a round' },
      { slug: 'best-push-golf-buggy-australia-3-wheel-vs-4-wheel-review', label: 'Three-wheel vs four-wheel push buggies' },
    ],
    faqs: [
      {
        q: 'When will the junior golf buggies be available?',
        a: 'We have not set a date, and we will not guess at one. The range is being finalised now. Register your interest on this page and we will email you as soon as the junior golf buggies, their photos and their pricing are live.',
      },
      {
        q: 'What is a junior golf buggy?',
        a: 'A golf buggy sized for a younger golfer: a lower handle or seat height they can use comfortably, a lighter frame they can load into a car themselves, and simple controls. A kids golf buggy that is just a shrunken adult model usually gets the handle height wrong, and that is the dimension that matters most.',
      },
      {
        q: 'Will you publish prices and specifications before launch?',
        a: 'No - only once they are final. Every product on this site carries specifications checked at our Yatala QLD depot and a GST-inclusive price, and the junior range will be listed the same way rather than with estimates.',
      },
      {
        q: 'Can a junior use one of your current electric golf trolleys?',
        a: 'Our walk-behind range is built for adult golfers, so we will not describe any of it as a junior model. Whether one suits a taller teenager depends on handle height and bag weight. Call or message us with their height and the bag they use and we will give you a straight answer.',
      },
      {
        q: 'Will junior golf buggies be delivered Australia-wide?',
        a: 'Yes. Junior golf buggies will ship the same way as everything else we sell: enclosed freight to every state and territory from Yatala QLD, with the freight cost quoted against your delivery postcode rather than added as a surprise later.',
      },
      {
        q: 'How do I register my interest in the junior range?',
        a: 'Use the form on this page with your name, email and postcode. You can also email or WhatsApp us using the contact details in the footer. We will contact you once the junior golf buggies are available to order.',
      },
    ],
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'BUG-001',
    slug: 'atlas-4-passenger-lifted-lithium-buggy',
    name: 'Atlas 4-Passenger Lifted Lithium Buggy',
    category: 'Luxury & High-Demand 4-Seaters',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 20900,
    price_display: '$20,900 AUD',
    search_intent: 'Transactional / Commercial',
    target_audience: 'Gated estates, luxury property owners, resort operators',
    key_specs: '48V Lithium, 3-inch Factory Lift, Custom Leather Seats, Touchscreen Display, 14-inch Alloy Wheels',
    shortDescription: 'The pinnacle of luxury acreage mobility with 3-inch factory lift, high-density 48V lithium battery, and premium 4-passenger leather seating.',
    fullDescription: "Engineered for Australian acreage estates and elite gated communities such as Sanctuary Cove and Hope Island, the Atlas 4-Passenger pairs whisper-quiet 48V lithium power with genuine rough-terrain capability. The three-inch factory lift and 14-inch alloy wheels raise the floor clear of rutted driveways, garden edging and unsealed estate tracks that bottom out a standard-height golf buggy, while custom leather seating and a touchscreen display keep the cabin closer to a car than a course buggy. Four adults travel in comfort without fumes, engine noise or the weekly water-topping that lead-acid buggies demand. Every Atlas is inspected, charge-cycled and road tested at our Yatala QLD depot before enclosed freight, and at this price it qualifies for a complimentary on-farm trial demonstration before you commit.",
    badge: 'Flagship Model',
    featured: true,
    images: ['/images/atlas-4-passenger-lifted-lithium-buggy.webp'],
    inStock: true,
    primaryKeyword: "atlas golf carts",
    supportingKeywords: [
      "atlas golf carts price",
      "atlas golf cart accessories",
      "atlas golf cars",
      "atlas golf carts for sale",
      "atlas golf carts reviews",
      "atlas golf carts australia",
    ],
    faqs: [
      {
        q: "How much does the Atlas 4-Passenger Lifted Lithium Buggy cost in Australia?",
        a: "The Atlas 4-Passenger Lifted Lithium Buggy is $20,900 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the Atlas 4-Passenger Lifted Lithium Buggy use?",
        a: "The Atlas 4-Passenger Lifted Lithium Buggy runs lithium rather than lead-acid, specified as 48V Lithium. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the Atlas 4-Passenger Lifted Lithium Buggy?",
        a: "The Atlas 4-Passenger Lifted Lithium Buggy is supplied with 48V Lithium, 3-inch Factory Lift, Custom Leather Seats, Touchscreen Display and 14-inch alloy wheels. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Atlas 4-Passenger Lifted Lithium Buggy best suited to?",
        a: "We specify the Atlas 4-Passenger Lifted Lithium Buggy for gated estates, luxury property owners, resort operators. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Atlas 4-Passenger Lifted Lithium Buggy before I buy it?",
        a: "Yes. Because the Atlas 4-Passenger Lifted Lithium Buggy is priced at $20,900 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $20,900 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Atlas 4-Passenger Lifted Lithium Buggy road registrable in Australia?",
        a: "Conditional registration for a buggy like the Atlas 4-Passenger Lifted Lithium Buggy is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
    ],
  },
  {
    id: 'BUG-002',
    slug: 'evolution-d5-ranger-4-plus-2',
    name: 'Evolution D5 Ranger 4+2 Plus',
    category: 'Luxury & High-Demand 4-Seaters',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 22500,
    price_display: '$22,500 AUD',
    search_intent: 'Transactional',
    target_audience: 'High net-worth families, lifestyle acreage owners',
    key_specs: '110Ah Lithium, Soundbar with Bluetooth, 9-inch Touchscreen, Foldable Windshield, Forward Facing Seats',
    shortDescription: 'Modern luxury 6-passenger cruiser equipped with a 110Ah lithium battery, marine Bluetooth soundbar, and multi-functional 9-inch touch screen.',
    fullDescription: "The Evolution D5 Ranger 4+2 carries six passengers across expansive private properties and championship fairways without a second trip. Forward-facing seating in both rows means conversation stays natural and nobody rides backwards over rough ground, which matters on long estate driveways and resort transfers. A 110Ah lithium pack supplies the range for a full day of running, and the nine-inch touchscreen, Bluetooth soundbar and foldable windshield make it as suited to a summer afternoon around the property as to eighteen holes. Families choosing a buggy as a genuine second vehicle tend to land here: it is the largest-capacity model in our luxury range while still driving with the quiet, low-effort manners of a lithium buggy. Tested at Yatala QLD and delivered Australia-wide by enclosed transporter.",
    badge: 'Popular Family',
    featured: true,
    images: ['/images/evolution-d5-ranger-4-plus-2.webp'],
    inStock: true,
    primaryKeyword: "evolution 6 seater golf cart",
    supportingKeywords: [
      "evolution d5 golf carts",
      "evolution d5 golf cart",
      "evolution d5 golf cart price",
      "evolution 4 seater golf cart",
      "evolution golf carts",
      "evolution golf carts australia",
    ],
    faqs: [
      {
        q: "How much does the Evolution D5 Ranger 4+2 Plus cost in Australia?",
        a: "The Evolution D5 Ranger 4+2 Plus is $22,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the Evolution D5 Ranger 4+2 Plus use?",
        a: "The Evolution D5 Ranger 4+2 Plus runs lithium rather than lead-acid, specified as 110Ah Lithium. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the Evolution D5 Ranger 4+2 Plus?",
        a: "The Evolution D5 Ranger 4+2 Plus is supplied with 110Ah Lithium, Soundbar with Bluetooth, 9-inch Touchscreen, Foldable Windshield and forward facing seats. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Evolution D5 Ranger 4+2 Plus best suited to?",
        a: "We specify the Evolution D5 Ranger 4+2 Plus for high net-worth families, lifestyle acreage owners. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Evolution D5 Ranger 4+2 Plus before I buy it?",
        a: "Yes. Because the Evolution D5 Ranger 4+2 Plus is priced at $22,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $22,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Evolution D5 Ranger 4+2 Plus road registrable in Australia?",
        a: "Conditional registration for a buggy like the Evolution D5 Ranger 4+2 Plus is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
    ],
  },
  {
    id: 'BUG-003',
    slug: 'club-car-onward-4-passenger-lithium',
    name: 'Club Car Onward 4-Passenger Lithium',
    category: 'Luxury & High-Demand 4-Seaters',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 24500,
    price_display: '$24,500 AUD',
    search_intent: 'Brand Direct / High-Intent',
    target_audience: 'Club Car brand loyalists, premium golf village residents',
    key_specs: 'AC Drive Motor, Custom Metallic Paint, Premium Canopy Top, Ergonomic Seating, Aircraft-Grade Aluminum Frame',
    shortDescription: 'Industry gold standard featuring rust-proof aircraft-grade aluminum chassis, high-efficiency AC drive motor, and custom metallic coachwork.',
    fullDescription: "Club Car's aircraft-grade aluminium frame is the reason the Onward holds its value so well in Australian conditions: aluminium does not rust, so coastal salt air and irrigated fairways cannot eat the chassis out from under the bodywork the way they do with steel-framed imports. The AC drive motor delivers smooth, progressive power up village inclines rather than the surging feel of older DC systems, and the premium canopy top, ergonomic seating and custom metallic paint make this the model buyers choose when the buggy will be parked in front of the house. Zero-maintenance lithium removes acid spills and water topping entirely. Supported from our Yatala QLD depot with genuine Club Car parts held in Australia, backed by an Australian factory warranty and nationwide enclosed freight.",
    badge: 'Heritage Elite',
    featured: true,
    images: ['/images/club-car-onward-4-passenger-lithium.webp'],
    inStock: true,
    primaryKeyword: "6 seater club car golf cart",
    supportingKeywords: [
      "club car 6 seater golf cart",
      "club car onward golf cart",
      "club car golf cart onward",
      "4 seater club car golf cart",
      "club car 4 seater golf cart",
      "club car golf cart 4 seater",
    ],
    faqs: [
      {
        q: "How much does the Club Car Onward 4-Passenger Lithium cost in Australia?",
        a: "The Club Car Onward 4-Passenger Lithium is $24,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Club Car Onward 4-Passenger Lithium?",
        a: "The Club Car Onward 4-Passenger Lithium is supplied with AC Drive Motor, Custom Metallic Paint, Premium Canopy Top, Ergonomic Seating and aircraft-grade aluminum frame. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Club Car Onward 4-Passenger Lithium best suited to?",
        a: "We specify the Club Car Onward 4-Passenger Lithium for club car brand loyalists, premium golf village residents. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Club Car Onward 4-Passenger Lithium before I buy it?",
        a: "Yes. Because the Club Car Onward 4-Passenger Lithium is priced at $24,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $24,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Club Car Onward 4-Passenger Lithium road registrable in Australia?",
        a: "Conditional registration for a buggy like the Club Car Onward 4-Passenger Lithium is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Club Car Onward 4-Passenger Lithium anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car Onward 4-Passenger Lithium travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-004',
    slug: 'tara-roadster-2-plus-2-lifted',
    name: 'Tara Roadster 2+2 Lifted',
    category: 'Luxury & High-Demand 4-Seaters',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 18990,
    price_display: '$18,990 AUD',
    search_intent: 'Commercial',
    target_audience: 'Budget-luxury buyers, semi-rural properties',
    key_specs: 'Lithium Battery, Lifted Chassis, Hydraulic Disc Brakes, LED Light Package, Rear Flip Seat',
    shortDescription: 'High-value lifted lithium buggy with automotive hydraulic disc brakes, full LED package, and convertible flatbed rear seat.',
    fullDescription: "The Tara Roadster 2+2 is the value entry into lifted four-seat buggies, and it earns that position with hardware rather than trim. Hydraulic disc brakes on a lifted chassis give you genuine stopping control on sloped semi-rural driveways, where drum brakes fade and feel vague under load. The rear flip seat converts from passenger bench to flat cargo deck in seconds, so the same buggy carries the family down to the gate in the morning and mulch, feed or tools in the afternoon. A full LED light package keeps it usable at dusk on unlit property tracks. For lifestyle blocks and semi-rural acreage that need ground clearance and dual-purpose flexibility without a luxury price tag, this is the most sensible buy in the range.",
    badge: 'Value Pick',
    featured: false,
    images: ['/images/tara-roadster-2-plus-2-lifted.webp'],
    inStock: true,
    primaryKeyword: "tara roadster 2 golf cart",
    supportingKeywords: [
      "tara roadster 2 golf cart reviews",
      "tara golf carts price",
      "tara electric golf cart",
      "tara ev golf cart",
      "who makes tara golf carts",
      "tara golf cart accessories",
    ],
    faqs: [
      {
        q: "How much does the Tara Roadster 2+2 Lifted cost in Australia?",
        a: "The Tara Roadster 2+2 Lifted is $18,990 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the Tara Roadster 2+2 Lifted use?",
        a: "The Tara Roadster 2+2 Lifted runs lithium rather than lead-acid, specified as Lithium Battery. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the Tara Roadster 2+2 Lifted?",
        a: "The Tara Roadster 2+2 Lifted is supplied with Lithium Battery, Lifted Chassis, Hydraulic Disc Brakes, LED Light Package and rear flip seat. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Tara Roadster 2+2 Lifted best suited to?",
        a: "We specify the Tara Roadster 2+2 Lifted for budget-luxury buyers, semi-rural properties. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Tara Roadster 2+2 Lifted before I buy it?",
        a: "Yes. Because the Tara Roadster 2+2 Lifted is priced at $18,990 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $18,990 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Tara Roadster 2+2 Lifted road registrable in Australia?",
        a: "Conditional registration for a buggy like the Tara Roadster 2+2 Lifted is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
    ],
  },
  {
    id: 'BUG-005',
    slug: 'ezgo-express-l6-lithium',
    name: 'E-Z-GO Express L6 Lithium',
    category: 'Luxury & High-Demand 4-Seaters',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 27900,
    price_display: '$27,900 AUD',
    search_intent: 'High-Ticket Transactional',
    target_audience: 'Resort transport, large family estates, commercial venues',
    key_specs: 'ELiTE Lithium Technology, 6-Passenger Seating, High Ground Clearance, Heavy Duty Suspension',
    shortDescription: '6-passenger luxury transporter powered by Samsung SDI ELiTE Lithium batteries and heavy-duty reinforced off-road suspension.',
    fullDescription: "The E-Z-GO Express L6 seats six on a single chassis, which makes it the natural choice for resort hospitality, holiday parks and large family estates that move groups rather than pairs. High ground clearance and heavy-duty suspension let it cross gravel service roads and grassed overflow areas without shaking guests loose, and E-Z-GO's ELiTE lithium technology means no fumes, no engine noise and no daily battery maintenance for the staff running it. For commercial venues that is the whole argument: a petrol shuttle needs fuel handling, servicing and somewhere to idle away from guests, while a lithium shuttle simply plugs in overnight. Supplied with Australian warranty support and dispatched by enclosed transporter from our Yatala QLD depot to any state or territory.",
    badge: '6-Seater Transporter',
    featured: true,
    images: ['/images/ezgo-express-l6-lithium.webp'],
    inStock: true,
    primaryKeyword: "ezgo 6 seater golf cart",
    supportingKeywords: [
      "ezgo golf cart 6 seater",
      "ez go golf cart 4 seater",
      "ezgo 4 seater golf cart",
      "ezgo golf cart 4 seater",
      "ezgo 4 seater golf cart for sale",
      "ezgo golf buggies",
    ],
    faqs: [
      {
        q: "How much does the E-Z-GO Express L6 Lithium cost in Australia?",
        a: "The E-Z-GO Express L6 Lithium is $27,900 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the E-Z-GO Express L6 Lithium use?",
        a: "The E-Z-GO Express L6 Lithium runs lithium rather than lead-acid, specified as ELiTE Lithium Technology. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the E-Z-GO Express L6 Lithium?",
        a: "The E-Z-GO Express L6 Lithium is supplied with ELiTE Lithium Technology, 6-Passenger Seating, High Ground Clearance and heavy duty suspension. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the E-Z-GO Express L6 Lithium best suited to?",
        a: "We specify the E-Z-GO Express L6 Lithium for resort transport, large family estates, commercial venues. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the E-Z-GO Express L6 Lithium before I buy it?",
        a: "Yes. Because the E-Z-GO Express L6 Lithium is priced at $27,900 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $27,900 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the E-Z-GO Express L6 Lithium road registrable in Australia?",
        a: "Conditional registration for a buggy like the E-Z-GO Express L6 Lithium is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
    ],
  },
  {
    id: 'BUG-006',
    slug: 'lvtong-4-seater-resort-cruiser',
    name: 'LVTONG 4-Seater Resort Cruiser',
    category: 'Luxury & High-Demand 4-Seaters',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 16800,
    price_display: '$16,800 AUD',
    search_intent: 'Commercial',
    target_audience: 'Hotels, holiday parks, community centers',
    key_specs: '4kW AC Motor, Maintenance-Free Lithium, On-Board Charger, Heavy Duty Bumper',
    shortDescription: 'Dependable commercial 4-seater buggy with high-torque 4kW AC motor, integrated smart charger, and rugged bumper protection.',
    fullDescription: "A proven workhorse across Australian caravan parks and holiday resorts, the LVTONG 4-Seater Resort Cruiser is specified for operators who count running cost per year rather than features per brochure. The 4kW AC motor pulls four adults and luggage up park inclines without straining, the maintenance-free lithium pack removes the labour of watering and equalising a lead-acid bank, and the on-board charger means any standard outlet becomes a charging point without extra infrastructure. A heavy-duty bumper takes the knocks that shared-use vehicles inevitably collect from bollards, kerbs and gateposts. For hotels, holiday parks and community centres running a small fleet, it delivers dependable all-day duty with low maintenance overheads. Freight is quoted per delivery postcode and every unit is tested at Yatala QLD before dispatch.",
    badge: 'Resort Fleet',
    featured: false,
    images: ['/images/lvtong-4-seater-resort-cruiser.webp'],
    inStock: true,
    primaryKeyword: "6 seater electric golf cart",
    supportingKeywords: [
      "electric 6 seater golf cart",
      "6 seater golf buggy",
      "6 seater golf buggy for sale",
      "6 seater golf carts for sale",
      "golf buggy 6 seater",
      "golf carts 6 seater for sale",
    ],
    faqs: [
      {
        q: "How much does the LVTONG 4-Seater Resort Cruiser cost in Australia?",
        a: "The LVTONG 4-Seater Resort Cruiser is $16,800 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the LVTONG 4-Seater Resort Cruiser use?",
        a: "The LVTONG 4-Seater Resort Cruiser runs lithium rather than lead-acid, specified as 4kW AC Motor. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the LVTONG 4-Seater Resort Cruiser?",
        a: "The LVTONG 4-Seater Resort Cruiser is supplied with 4kW AC Motor, Maintenance-Free Lithium, On-Board Charger and heavy duty bumper. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the LVTONG 4-Seater Resort Cruiser best suited to?",
        a: "We specify the LVTONG 4-Seater Resort Cruiser for hotels, holiday parks, community centers. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the LVTONG 4-Seater Resort Cruiser before I buy it?",
        a: "Yes. Because the LVTONG 4-Seater Resort Cruiser is priced at $16,800 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $16,800 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the LVTONG 4-Seater Resort Cruiser road registrable in Australia?",
        a: "Conditional registration for a buggy like the LVTONG 4-Seater Resort Cruiser is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
    ],
  },
  {
    id: 'BUG-007',
    slug: 'club-car-tempo-lithium-2025',
    name: 'Club Car Tempo Lithium (2025 Model)',
    category: 'Traditional 2-Seater Electric Golf Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 16990,
    price_display: '$16,990 AUD',
    search_intent: 'Brand Direct / Transactional',
    target_audience: 'Avid golfers, private course members',
    key_specs: 'Monaco Drive System, Rust-Proof Aluminum Frame, Automotive-Style Dashboard',
    shortDescription: 'The latest 2025 Club Car Tempo 2-seater with maintenance-free lithium battery and iconic rustproof aluminum frame.',
    fullDescription: "The 2025 Club Car Tempo is built for the golfer who plays the same course every week and wants the buggy to disappear underneath them. The Monaco drive system delivers smooth hill-climbing acceleration without the lurch that makes a full bag shift on steep fairway transitions, and the automotive-style dashboard puts digital battery metrics in front of you so range stops being guesswork on the back nine. A rust-proof aluminium frame is the long-term argument: Australian courses combine irrigation, humidity and coastal air, and an aluminium chassis simply does not corrode the way steel does. Golf bag caddy security keeps clubs stable through turns. Private course members and avid golfers choose the Tempo when they intend to keep a buggy for many seasons rather than trade it quickly.",
    badge: '2025 Model',
    featured: true,
    images: ['/images/club-car-tempo-lithium-2025.webp'],
    inStock: true,
    primaryKeyword: "club car tempo golf cart accessories",
    supportingKeywords: [
      "club car tempo golf buggy",
      "2025 club car golf cart",
      "club car tempo golf cart",
      "club car golf cart tempo",
      "club car tempo electric golf cart",
      "club car tempo golf cart for sale",
    ],
    faqs: [
      {
        q: "How much does the Club Car Tempo Lithium (2025 Model) cost in Australia?",
        a: "The Club Car Tempo Lithium (2025 Model) is $16,990 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Club Car Tempo Lithium (2025 Model)?",
        a: "The Club Car Tempo Lithium (2025 Model) is supplied with Monaco Drive System, Rust-Proof Aluminum Frame and automotive-style dashboard. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Club Car Tempo Lithium (2025 Model) best suited to?",
        a: "We specify the Club Car Tempo Lithium (2025 Model) for avid golfers, private course members. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Club Car Tempo Lithium (2025 Model) before I buy it?",
        a: "Yes. Because the Club Car Tempo Lithium (2025 Model) is priced at $16,990 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $16,990 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Club Car Tempo Lithium (2025 Model) road registrable in Australia?",
        a: "Conditional registration for a buggy like the Club Car Tempo Lithium (2025 Model) is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Club Car Tempo Lithium (2025 Model) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car Tempo Lithium (2025 Model) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-008',
    slug: 'ezgo-rxv-elite-lithium',
    name: 'E-Z-GO RXV ELiTE Lithium',
    category: 'Traditional 2-Seater Electric Golf Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 15800,
    price_display: '$15,800 AUD',
    search_intent: 'High Traffic / Commercial',
    target_audience: 'Golfers, fleet buyers, retirement village residents',
    key_specs: 'Samsung SDI Lithium Batteries, Automatic Electromagnetic Brake, High-Efficiency AC Drive',
    shortDescription: 'Famous automatic auto-park electromagnetic braking system paired with Samsung SDI maintenance-free lithium battery power.',
    fullDescription: "The defining feature of the RXV ELiTE is what happens when you lift your foot: the automatic electromagnetic brake holds the buggy the moment you step off the throttle, so it will not creep or run away on a steep fairway slope or a sloped village driveway. For retirement village residents and anyone parking on an incline, that single behaviour is worth more than any spec on the sheet. Samsung SDI lithium batteries supply consistent power delivery through the full charge rather than fading toward the end like lead-acid, and the high-efficiency AC drive keeps consumption low across a full round. Fleet buyers value the reduced servicing burden across many units. Supported with Australian parts and warranty from our Yatala QLD depot, delivered nationwide by enclosed transporter.",
    badge: 'Auto-Park Brake',
    featured: true,
    images: ['/images/ezgo-rxv-elite-lithium.webp', '/images/ezgo-rxv-elite-lithium-2.webp'],
    inStock: true,
    primaryKeyword: "ezgo rxv elite golf cart",
    supportingKeywords: [
      "ez go rxv elite golf cart",
      "ezgo rxv golf cart",
      "ezgo elite golf cart accessories",
      "ezgo rxv golf cart accessories",
      "ez go elite golf cart",
      "ezgo elite golf cart",
    ],
    faqs: [
      {
        q: "How much does the E-Z-GO RXV ELiTE Lithium cost in Australia?",
        a: "The E-Z-GO RXV ELiTE Lithium is $15,800 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the E-Z-GO RXV ELiTE Lithium use?",
        a: "The E-Z-GO RXV ELiTE Lithium runs lithium rather than lead-acid, specified as Samsung SDI Lithium Batteries. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the E-Z-GO RXV ELiTE Lithium?",
        a: "The E-Z-GO RXV ELiTE Lithium is supplied with Samsung SDI Lithium Batteries, Automatic Electromagnetic Brake and high-efficiency ac drive. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the E-Z-GO RXV ELiTE Lithium best suited to?",
        a: "We specify the E-Z-GO RXV ELiTE Lithium for golfers, fleet buyers, retirement village residents. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the E-Z-GO RXV ELiTE Lithium before I buy it?",
        a: "Yes. Because the E-Z-GO RXV ELiTE Lithium is priced at $15,800 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $15,800 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the E-Z-GO RXV ELiTE Lithium road registrable in Australia?",
        a: "Conditional registration for a buggy like the E-Z-GO RXV ELiTE Lithium is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
    ],
  },
  {
    id: 'BUG-009',
    slug: 'yamaha-drive2-ac-lithium',
    name: 'Yamaha Drive2 AC Lithium',
    category: 'Traditional 2-Seater Electric Golf Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 16500,
    price_display: '$16,500 AUD',
    search_intent: 'Commercial',
    target_audience: 'Golfers wanting smooth ride comfort, course fleets',
    key_specs: 'Independent Front & Rear Suspension, Ultra-Comfort Seats, Wide Dash Storage',
    shortDescription: 'Unrivaled ride comfort with Yamaha four-wheel independent suspension and wide contoured comfort seating.',
    fullDescription: "Independent front and rear suspension is rare at this level and it is the reason the Drive2 rides the way it does. Most buggies transmit every rut and root straight into the seat frame; independent suspension lets each wheel move on its own, so rough turf, unsealed tracks and cart-path joins arrive as a muted movement rather than a jolt. Combined with ultra-comfort seats, that makes the Drive2 the model to choose if you or a passenger have a back that objects to rough ground, or if the daily run crosses unmade surfaces rather than manicured fairway. Wide dash storage takes phones, scorecards, keys and a drink without anything sliding off through turns. Tested at our Yatala QLD depot and freighted enclosed to any Australian address.",
    badge: 'Ultra-Comfort',
    featured: false,
    images: ['/images/yamaha-drive2-ac-lithium.webp'],
    inStock: true,
    primaryKeyword: "yamaha drive2 golf cart for sale",
    supportingKeywords: [
      "yamaha 2 seater golf cart",
      "yamaha golf cart covers 2 passenger",
      "yamaha golf cart",
      "yamaha golf carts for sale",
      "yamaha golf carts brisbane",
      "yamaha golf cart accessories",
    ],
    faqs: [
      {
        q: "How much does the Yamaha Drive2 AC Lithium cost in Australia?",
        a: "The Yamaha Drive2 AC Lithium is $16,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Yamaha Drive2 AC Lithium?",
        a: "The Yamaha Drive2 AC Lithium is supplied with Independent Front & Rear Suspension, Ultra-Comfort Seats and wide dash storage. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Yamaha Drive2 AC Lithium best suited to?",
        a: "We specify the Yamaha Drive2 AC Lithium for golfers wanting smooth ride comfort, course fleets. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Yamaha Drive2 AC Lithium before I buy it?",
        a: "Yes. Because the Yamaha Drive2 AC Lithium is priced at $16,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $16,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Yamaha Drive2 AC Lithium road registrable in Australia?",
        a: "Conditional registration for a buggy like the Yamaha Drive2 AC Lithium is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Yamaha Drive2 AC Lithium anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Yamaha Drive2 AC Lithium travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-010',
    slug: 'tara-spirit-pro-2-seater',
    name: 'Tara Spirit Pro 2-Seater',
    category: 'Traditional 2-Seater Electric Golf Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 13500,
    price_display: '$13,500 AUD',
    search_intent: 'Transactional / Value',
    target_audience: 'Cost-conscious private golfers',
    key_specs: 'Lightweight Frame, Rapid Charger, Digital Speedometer, Sweater Basket',
    shortDescription: 'Modern, cost-effective 2-passenger electric buggy with rapid charging capability and clear digital dashboard instrumentation.',
    fullDescription: "The Tara Spirit Pro is aimed squarely at private golfers stepping away from an ageing lead-acid buggy, and it is priced so that the upgrade is realistic rather than aspirational. A lightweight frame means less mass for the motor to move, which translates directly into usable range from the lithium pack, and the rapid charger shortens turnaround between rounds so the buggy is ready when you are rather than the next morning. The digital speedometer gives you a real read on pace instead of a guess, and a sweater basket handles the layers that Australian mornings demand and afternoons make redundant. Cost-conscious buyers get modern lithium reliability, current styling and an end to acid spills and water topping without paying for badge prestige.",
    badge: 'Great Value',
    featured: false,
    images: ['/images/tara-spirit-pro-2-seater.webp', '/images/tara-spirit-pro-2-seater-2.webp'],
    inStock: true,
    primaryKeyword: "2 seater electric golf carts",
    supportingKeywords: [
      "2 seater golf cart price",
      "2 seater golf cart",
      "two seater golf cart",
      "2 seater electric golf cart",
      "two seater electric golf cart",
      "12 seater golf cart for sale",
    ],
    faqs: [
      {
        q: "How much does the Tara Spirit Pro 2-Seater cost in Australia?",
        a: "The Tara Spirit Pro 2-Seater is $13,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Tara Spirit Pro 2-Seater?",
        a: "The Tara Spirit Pro 2-Seater is supplied with Lightweight Frame, Rapid Charger, Digital Speedometer and sweater basket. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Tara Spirit Pro 2-Seater best suited to?",
        a: "We specify the Tara Spirit Pro 2-Seater for cost-conscious private golfers. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Is the Tara Spirit Pro 2-Seater road registrable in Australia?",
        a: "Conditional registration for a buggy like the Tara Spirit Pro 2-Seater is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Tara Spirit Pro 2-Seater anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Tara Spirit Pro 2-Seater travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Do you sell a used version of the Tara Spirit Pro 2-Seater?",
        a: "We do carry reconditioned buggies alongside new stock, and availability changes as trade-ins come through. A reconditioned unit is checked, charge-cycled and road tested at Yatala the same way a new one is. Ask us what is on the floor — if a used equivalent of the Tara Spirit Pro 2-Seater is available, we will tell you what it is and what it has done.",
      },
    ],
  },
  {
    id: 'BUG-011',
    slug: 'lvtong-2-passenger-golf-buggy',
    name: 'LVTONG 2-Passenger Golf Buggy',
    category: 'Traditional 2-Seater Electric Golf Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 11990,
    price_display: '$11,990 AUD',
    search_intent: 'Value / Commercial',
    target_audience: 'Budget private buyers, local golf clubs',
    key_specs: '48V System, Split Foldable Windshield, Dual Sand Bottles, Caddy Bag Holder',
    shortDescription: 'Fully loaded course-ready 2-seater with split windshield, dual divot repair sand bottles, and rear bag brackets.',
    fullDescription: "The LVTONG 2-Passenger is specified so you can roll straight onto your local course without a shopping list of extras. The split foldable windshield, dual sand bottles and caddy bag holder are fitted rather than optional, which is where competing budget buggies quietly recover margin once you start adding the parts you actually need. A 48V system keeps it compact, agile and energy efficient around tight club layouts and shorter suburban courses, and the two-seat footprint parks and stores in a standard garage or club bay without difficulty. For budget-focused private buyers and smaller local clubs building a modest fleet, it delivers dependable electric running with no hidden extra costs. Prices include GST and freight is quoted against your delivery postcode.",
    badge: 'Course Ready',
    featured: false,
    images: ['/images/lvtong-2-passenger-golf-buggy.webp'],
    inStock: true,
    primaryKeyword: "2 seater golf buggy",
    supportingKeywords: [
      "2 seater golf buggy for sale",
      "golf buggy 2 seater",
      "electric golf buggy 2 seater",
      "two seater golf buggy",
      "golf buggy phone holder",
      "golf buggy umbrella holder",
    ],
    faqs: [
      {
        q: "How much does the LVTONG 2-Passenger Golf Buggy cost in Australia?",
        a: "The LVTONG 2-Passenger Golf Buggy is $11,990 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the LVTONG 2-Passenger Golf Buggy?",
        a: "The LVTONG 2-Passenger Golf Buggy is supplied with 48V System, Split Foldable Windshield, Dual Sand Bottles and caddy bag holder. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the LVTONG 2-Passenger Golf Buggy best suited to?",
        a: "We specify the LVTONG 2-Passenger Golf Buggy for budget private buyers, local golf clubs. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Is the LVTONG 2-Passenger Golf Buggy road registrable in Australia?",
        a: "Conditional registration for a buggy like the LVTONG 2-Passenger Golf Buggy is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the LVTONG 2-Passenger Golf Buggy anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The LVTONG 2-Passenger Golf Buggy travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Do you sell a used version of the LVTONG 2-Passenger Golf Buggy?",
        a: "We do carry reconditioned buggies alongside new stock, and availability changes as trade-ins come through. A reconditioned unit is checked, charge-cycled and road tested at Yatala the same way a new one is. Ask us what is on the floor — if a used equivalent of the LVTONG 2-Passenger Golf Buggy is available, we will tell you what it is and what it has done.",
      },
    ],
  },
  {
    id: 'BUG-012',
    slug: 'evolution-classic-2-plus',
    name: 'Evolution Classic 2 Plus',
    category: 'Traditional 2-Seater Electric Golf Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 14200,
    price_display: '$14,200 AUD',
    search_intent: 'Transactional',
    target_audience: 'Modern tech-focused golfers',
    key_specs: '6.3-inch LCD Screen, Lithium-Ion Battery, Two-Tone Seats, Side Mirrors with Turn Signals',
    shortDescription: 'Feature-packed 2-seater buggy with automotive LCD instrument cluster, integrated mirrors, and two-tone luxury upholstery.',
    fullDescription: "The Evolution Classic 2 Plus brings automotive-level instrumentation to a two-seat buggy, which is exactly what buyers moving across from a modern car expect and rarely find. A 6.3-inch LCD screen with reverse camera compatibility, side mirrors with integrated turn signals and two-tone seating make it road-aware in a way that matters on estate roads shared with vehicles, not just on fairway. Turn signals and mirrors are also the features most often required when a buggy is used around traffic on private roads or a gated community's internal network. Lithium-ion power keeps it quiet enough to hold a conversation at speed and removes the maintenance routine lead-acid demands. Dispatched from Yatala QLD with Australian warranty support and enclosed nationwide freight.",
    badge: 'Tech Spec',
    featured: false,
    images: ['/images/evolution-classic-2-plus.webp'],
    inStock: true,
    primaryKeyword: "evolution 2 seater golf carts",
    supportingKeywords: [
      "evolution golf cart reviews",
      "evolution golf cart price",
      "evolution golf carts for sale",
      "evolution golf carts near me",
      "hdk evolution golf cart",
      "where are evolution golf carts made",
    ],
    faqs: [
      {
        q: "How much does the Evolution Classic 2 Plus cost in Australia?",
        a: "The Evolution Classic 2 Plus is $14,200 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the Evolution Classic 2 Plus use?",
        a: "The Evolution Classic 2 Plus runs lithium rather than lead-acid, specified as 6.3-inch LCD Screen. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the Evolution Classic 2 Plus?",
        a: "The Evolution Classic 2 Plus is supplied with 6.3-inch LCD Screen, Lithium-Ion Battery, Two-Tone Seats and side mirrors with turn signals. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Evolution Classic 2 Plus best suited to?",
        a: "We specify the Evolution Classic 2 Plus for modern tech-focused golfers. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Is the Evolution Classic 2 Plus road registrable in Australia?",
        a: "Conditional registration for a buggy like the Evolution Classic 2 Plus is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Evolution Classic 2 Plus anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Evolution Classic 2 Plus travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-013',
    slug: 'atlas-4-seater-heavy-duty-lifted-350a',
    name: 'Atlas 4-Seater Heavy Duty Lifted (350A)',
    category: 'Off-Road, Lifted & 4x4 Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 21990,
    price_display: '$21,990 AUD',
    search_intent: 'Commercial / High-Torque',
    target_audience: 'Acreage owners, hilly farm tracks, rural properties',
    key_specs: '350A Controller, 4-wheel Hydraulic Brakes, Rugged All-Terrain Tires, Brush Guard',
    shortDescription: 'High-torque 350-amp power controller with 4-wheel hydraulic disc brakes and steel brush guard for steep Australian hills.',
    fullDescription: "The 350-amp controller is the specification that matters on this buggy. Controller amperage governs how much current the motor can draw under load, which is what decides whether a fully laden four-seater walks up a steep farm track or bogs down halfway and overheats. Paired with four-wheel hydraulic disc brakes, it also means you can come back down that same hill under control rather than riding the brakes to the bottom. Rugged all-terrain tyres and a steel brush guard handle the scrub, stumps and gateposts that acreage driving involves. For hilly Australian properties where a standard golf buggy has already disappointed you, this is the model built to answer that specific problem. Tested at Yatala QLD and freighted enclosed anywhere in Australia.",
    badge: 'High-Torque 350A',
    featured: true,
    images: ['/images/atlas-4-seater-heavy-duty-lifted-350a.webp'],
    inStock: true,
    primaryKeyword: "atlas golf cart",
    supportingKeywords: [
      "atlas golf cart for sale",
      "atlas golf cart reviews",
      "atlas golf carts near me",
      "lifted 4x4 golf cart",
      "lifted golf carts",
      "custom lifted golf cart",
    ],
    faqs: [
      {
        q: "How much does the Atlas 4-Seater Heavy Duty Lifted (350A) cost in Australia?",
        a: "The Atlas 4-Seater Heavy Duty Lifted (350A) is $21,990 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Atlas 4-Seater Heavy Duty Lifted (350A)?",
        a: "The Atlas 4-Seater Heavy Duty Lifted (350A) is supplied with 350A Controller, 4-wheel Hydraulic Brakes, Rugged All-Terrain Tires and brush guard. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Atlas 4-Seater Heavy Duty Lifted (350A) best suited to?",
        a: "We specify the Atlas 4-Seater Heavy Duty Lifted (350A) for acreage owners, hilly farm tracks, rural properties. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Atlas 4-Seater Heavy Duty Lifted (350A) before I buy it?",
        a: "Yes. Because the Atlas 4-Seater Heavy Duty Lifted (350A) is priced at $21,990 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $21,990 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Atlas 4-Seater Heavy Duty Lifted (350A) road registrable in Australia?",
        a: "Conditional registration for a buggy like the Atlas 4-Seater Heavy Duty Lifted (350A) is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Atlas 4-Seater Heavy Duty Lifted (350A) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Atlas 4-Seater Heavy Duty Lifted (350A) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-014',
    slug: 'evolution-d-max-gt4-off-road',
    name: 'Evolution D-MAX GT4 Off-Road',
    category: 'Off-Road, Lifted & 4x4 Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 23800,
    price_display: '$23,800 AUD',
    search_intent: 'High-Ticket Off-Road',
    target_audience: 'Hunters, large property managers, trail enthusiasts',
    key_specs: 'Heavy Duty Roll Cage, Independent Off-Road Suspension, Integrated Winch, High-Power AC Engine',
    shortDescription: 'Aggressive trail buggy with full roll cage, heavy-duty recovery winch, and long-travel independent suspension.',
    fullDescription: "The D-Max GT4 is the only buggy in our range built around recovery rather than comfort. A heavy-duty roll cage and long-travel independent off-road suspension let it work genuine trail terrain instead of merely surviving a gravel driveway, and the integrated winch means a bogged vehicle, a fallen limb or a stuck gate is a job you finish yourself rather than a call you make. Hunters and large property managers choose it because the working day happens well away from the shed. The high-power AC drivetrain delivers torque quietly, which matters more than most buyers expect around livestock and wildlife. This is a serious piece of equipment rather than a lifted golf buggy, and it is specified accordingly.",
    badge: 'Trail Edition',
    featured: true,
    images: ['/images/evolution-d-max-gt4-off-road.webp'],
    inStock: true,
    primaryKeyword: "evolution electric golf cart",
    supportingKeywords: [
      "evolution ev golf cart",
      "evolution golf cart",
      "evolution golf cart review",
      "evolution golf.cart",
      "evolution golf cars near me",
      "evolution golf cart dealers",
    ],
    faqs: [
      {
        q: "How much does the Evolution D-MAX GT4 Off-Road cost in Australia?",
        a: "The Evolution D-MAX GT4 Off-Road is $23,800 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Evolution D-MAX GT4 Off-Road?",
        a: "The Evolution D-MAX GT4 Off-Road is supplied with Heavy Duty Roll Cage, Independent Off-Road Suspension, Integrated Winch and high-power ac engine. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Evolution D-MAX GT4 Off-Road best suited to?",
        a: "We specify the Evolution D-MAX GT4 Off-Road for hunters, large property managers, trail enthusiasts. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Evolution D-MAX GT4 Off-Road before I buy it?",
        a: "Yes. Because the Evolution D-MAX GT4 Off-Road is priced at $23,800 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $23,800 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Evolution D-MAX GT4 Off-Road road registrable in Australia?",
        a: "Conditional registration for a buggy like the Evolution D-MAX GT4 Off-Road is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Evolution D-MAX GT4 Off-Road anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Evolution D-MAX GT4 Off-Road travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-015',
    slug: 'ezgo-express-s4-lifted-high-torque',
    name: 'E-Z-GO Express S4 Lifted High-Torque',
    category: 'Off-Road, Lifted & 4x4 Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 20500,
    price_display: '$20,500 AUD',
    search_intent: 'Transactional',
    target_audience: 'Rural families, farm transport',
    key_specs: '4-inch Lift Kit, Desert Eagle All-Terrain Tires, Convertible Rear Seat to Cargo Bed',
    shortDescription: '4-inch factory lifted chassis riding on Desert Eagle all-terrain tyres with flip-over flatbed utility platform.',
    fullDescription: "The Express S4 solves the problem every rural family runs into: you need seats in the morning and a tray in the afternoon, and you do not want two vehicles. The rear seat flips over into a flatbed utility platform, so the school-run configuration becomes the feed-and-tools configuration in seconds without unbolting anything. A four-inch factory lift on Desert Eagle all-terrain tyres gives it the clearance to cross paddock ruts, washouts and unsealed tracks that would ground a standard-height buggy. Because the lift is factory rather than aftermarket, the geometry, braking and warranty are engineered together rather than bolted on afterwards. For farm transport and rural families it is the most flexible chassis we stock.",
    badge: 'Dual Purpose',
    featured: false,
    images: ['/images/ezgo-express-s4-lifted-high-torque.webp'],
    inStock: true,
    primaryKeyword: "ezgo golf cart lifted",
    supportingKeywords: [
      "lifted ez go golf cart",
      "lifted ezgo golf cart",
      "ez go golf cart lift kit",
      "ezgo golf cart lift kit",
      "lift kit for golf cart for ez go",
      "lift kit golf cart ezgo",
    ],
    faqs: [
      {
        q: "How much does the E-Z-GO Express S4 Lifted High-Torque cost in Australia?",
        a: "The E-Z-GO Express S4 Lifted High-Torque is $20,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the E-Z-GO Express S4 Lifted High-Torque?",
        a: "The E-Z-GO Express S4 Lifted High-Torque is supplied with 4-inch Lift Kit, Desert Eagle All-Terrain Tires and convertible rear seat to cargo bed. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the E-Z-GO Express S4 Lifted High-Torque best suited to?",
        a: "We specify the E-Z-GO Express S4 Lifted High-Torque for rural families, farm transport. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the E-Z-GO Express S4 Lifted High-Torque before I buy it?",
        a: "Yes. Because the E-Z-GO Express S4 Lifted High-Torque is priced at $20,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $20,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the E-Z-GO Express S4 Lifted High-Torque road registrable in Australia?",
        a: "Conditional registration for a buggy like the E-Z-GO Express S4 Lifted High-Torque is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the E-Z-GO Express S4 Lifted High-Torque anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The E-Z-GO Express S4 Lifted High-Torque travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-016',
    slug: 'lvtong-rough-terrain-lifted-buggy',
    name: 'LVTONG Rough-Terrain Lifted Buggy',
    category: 'Off-Road, Lifted & 4x4 Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 17500,
    price_display: '$17,500 AUD',
    search_intent: 'Value Commercial',
    target_audience: 'Farmers, orchard owners, bush properties',
    key_specs: 'High Ground Clearance, Reinforced Steel Subframe, Front LED Light Bar',
    shortDescription: 'Rugged high ground clearance buggy reinforced with steel front bash guard and high-intensity night LED light bar.',
    fullDescription: "Built for farmers, orchard owners and bush properties where the terrain is the job rather than the obstacle. A reinforced steel subframe carries the twisting loads that rough ground puts through a chassis, and the front bash guard takes the low-speed impacts that orchard rows, stumps and undergrowth inevitably deliver. High ground clearance keeps the underbody clear of the ruts and irrigation lines that catch out standard buggies. The front LED light bar is the feature owners end up valuing most: stock work, harvest and property checks do not stop at sunset, and a high-intensity bar turns a dark row into a working one. Straightforward, reinforced and specified for work rather than presentation.",
    badge: 'Farm Ready',
    featured: false,
    images: ['/images/lvtong-rough-terrain-lifted-buggy.webp'],
    inStock: true,
    primaryKeyword: "all terrain golf buggy",
    supportingKeywords: [
      "electric farm buggy for sale australia",
      "4x4 golf buggy",
      "electric farm buggy australia",
      "farm buggy for sale australia",
      "farm buggy for sale qld",
      "farm buggy for sale victoria",
    ],
    faqs: [
      {
        q: "How much does the LVTONG Rough-Terrain Lifted Buggy cost in Australia?",
        a: "The LVTONG Rough-Terrain Lifted Buggy is $17,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the LVTONG Rough-Terrain Lifted Buggy?",
        a: "The LVTONG Rough-Terrain Lifted Buggy is supplied with High Ground Clearance, Reinforced Steel Subframe and front led light bar. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the LVTONG Rough-Terrain Lifted Buggy best suited to?",
        a: "We specify the LVTONG Rough-Terrain Lifted Buggy for farmers, orchard owners, bush properties. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the LVTONG Rough-Terrain Lifted Buggy before I buy it?",
        a: "Yes. Because the LVTONG Rough-Terrain Lifted Buggy is priced at $17,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $17,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the LVTONG Rough-Terrain Lifted Buggy road registrable in Australia?",
        a: "Conditional registration for a buggy like the LVTONG Rough-Terrain Lifted Buggy is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the LVTONG Rough-Terrain Lifted Buggy anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The LVTONG Rough-Terrain Lifted Buggy travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-017',
    slug: 'club-car-onward-lifted-efi-petrol',
    name: 'Club Car Onward Lifted EFI Petrol',
    category: 'Off-Road, Lifted & 4x4 Buggies',
    fuel_type: 'Mechanical (Petrol EFI)',
    price_aud: 19800,
    price_display: '$19,800 AUD',
    search_intent: 'Rural Long Range',
    target_audience: 'Buyers without grid power access, long-distance farm users',
    key_specs: 'Kohler 14HP EFI Petrol Engine, Lifted Suspension, All-Terrain Tread',
    shortDescription: 'Electronic Fuel Injection (EFI) petrol engine delivering infinite remote range without battery charging reliance.',
    fullDescription: "For properties without reliable grid power, or runs too long to plan around a charge cycle, electronic fuel injection changes the maths. The Onward Lifted EFI carries a Kohler 14HP EFI petrol engine, so range is limited by the jerry can rather than the battery pack, and refuelling takes a minute rather than a night. EFI also means it starts cleanly cold, meters fuel accurately at altitude and across temperature swings, and avoids the carburettor tuning that older petrol buggies demanded every season. Lifted suspension and all-terrain tread give it the clearance to work the same ground as our electric lifted models. For remote and long-distance farm use, petrol remains the honest answer and this is the refined version of it.",
    badge: 'Petrol Range',
    featured: false,
    images: ['/images/club-car-onward-lifted-efi-petrol.webp'],
    inStock: true,
    primaryKeyword: "club car lifted golf carts",
    supportingKeywords: [
      "lifted club car golf carts",
      "club car golf carts",
      "club car golf carts for sale",
      "club car golf buggy for sale",
      "lift kit for a club car golf cart",
      "club car golf cart",
    ],
    faqs: [
      {
        q: "How much does the Club Car Onward Lifted EFI Petrol cost in Australia?",
        a: "The Club Car Onward Lifted EFI Petrol is $19,800 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Club Car Onward Lifted EFI Petrol?",
        a: "The Club Car Onward Lifted EFI Petrol is supplied with Kohler 14HP EFI Petrol Engine, Lifted Suspension and all-terrain tread. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Club Car Onward Lifted EFI Petrol best suited to?",
        a: "We specify the Club Car Onward Lifted EFI Petrol for buyers without grid power access, long-distance farm users. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Club Car Onward Lifted EFI Petrol before I buy it?",
        a: "Yes. Because the Club Car Onward Lifted EFI Petrol is priced at $19,800 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $19,800 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Club Car Onward Lifted EFI Petrol road registrable in Australia?",
        a: "Conditional registration for a buggy like the Club Car Onward Lifted EFI Petrol is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Club Car Onward Lifted EFI Petrol anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car Onward Lifted EFI Petrol travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-018',
    slug: 'tara-roadster-4-off-road',
    name: 'Tara Roadster 4 Off-Road',
    category: 'Off-Road, Lifted & 4x4 Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 19500,
    price_display: '$19,500 AUD',
    search_intent: 'Transactional',
    target_audience: 'Property owners needing steep incline power',
    key_specs: 'High-Torque Gear Ratio, 12-inch Off-Road Rims, Rear Cargo Tray Option',
    shortDescription: 'High-torque gear reduction transmission designed specifically for heavy incline climbing and rugged acreage trails.',
    fullDescription: "Gearing, not power, is what gets a loaded buggy up a steep incline, and the Tara Roadster 4 is built around a high-torque gear reduction ratio chosen for exactly that. Lower gearing multiplies motor torque at the wheel, so sustained climbs happen at a steady pace instead of a struggle that heats the motor and drains the pack. Twelve-inch off-road rims put more sidewall and tread between the rim and the rock than a standard golf wheel, which is what prevents pinch damage on rutted acreage trails. An optional rear cargo tray adds working capacity when the buggy is not carrying passengers. For property owners whose main complaint is that their current buggy cannot climb, this is the direct fix.",
    badge: 'Hill Climber',
    featured: false,
    images: ['/images/tara-roadster-4-off-road.webp'],
    inStock: true,
    primaryKeyword: "off road golf cart",
    supportingKeywords: [
      "off road golf buggy",
      "electric golf carts off road",
      "electric off road golf cart",
      "off road electric golf cart",
      "off road golf cart electric",
      "off road golf cart for sale",
    ],
    faqs: [
      {
        q: "How much does the Tara Roadster 4 Off-Road cost in Australia?",
        a: "The Tara Roadster 4 Off-Road is $19,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Tara Roadster 4 Off-Road?",
        a: "The Tara Roadster 4 Off-Road is supplied with High-Torque Gear Ratio, 12-inch Off-Road Rims and rear cargo tray option. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Tara Roadster 4 Off-Road best suited to?",
        a: "We specify the Tara Roadster 4 Off-Road for property owners needing steep incline power. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Tara Roadster 4 Off-Road before I buy it?",
        a: "Yes. Because the Tara Roadster 4 Off-Road is priced at $19,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $19,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Tara Roadster 4 Off-Road road registrable in Australia?",
        a: "Conditional registration for a buggy like the Tara Roadster 4 Off-Road is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Tara Roadster 4 Off-Road anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Tara Roadster 4 Off-Road travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-019',
    slug: 'club-car-carryall-700-electric-utility',
    name: 'Club Car Carryall 700 Electric Utility',
    category: 'Commercial & Farm Utility Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 22900,
    price_display: '$22,900 AUD',
    search_intent: 'Commercial / B2B',
    target_audience: 'Councils, maintenance teams, commercial farms',
    key_specs: '6-Foot Aluminum Cargo Box, 680kg Payload Capacity, Heavy-Duty Tow Hitch',
    shortDescription: 'Heavy-duty 6-foot aluminum cargo bed boasting an immense 680kg payload and integrated industrial tow hitch.',
    fullDescription: "A 680kg payload puts the Carryall 700 in genuine work-vehicle territory rather than utility-buggy territory. The six-foot aluminium cargo box is the right material for the job: aluminium will not rust out from wet turf, fertiliser, sand or salt air the way a steel tray does, and it keeps unladen weight down so more of the payload rating is available for cargo. An integrated heavy-duty tow hitch extends that further to trailers, spreaders and turf equipment. Councils, maintenance teams and commercial farms specify it because lithium removes fuel handling, engine servicing and exhaust from shared work areas entirely. Delivered Australia-wide by enclosed transporter with freight quoted against your site postcode.",
    badge: '680kg Payload',
    featured: true,
    images: ['/images/club-car-carryall-700-electric-utility.webp'],
    inStock: true,
    primaryKeyword: "club car utility golf cart",
    supportingKeywords: [
      "club car electric golf cart",
      "club car golf carts electric",
      "electric golf cart club car",
      "club car electric golf buggy",
      "club car golf cart electric",
      "golf cart motors electric club car",
    ],
    faqs: [
      {
        q: "How much does the Club Car Carryall 700 Electric Utility cost in Australia?",
        a: "The Club Car Carryall 700 Electric Utility is $22,900 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Club Car Carryall 700 Electric Utility?",
        a: "The Club Car Carryall 700 Electric Utility is supplied with 6-Foot Aluminum Cargo Box, 680kg Payload Capacity and heavy-duty tow hitch. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Club Car Carryall 700 Electric Utility best suited to?",
        a: "We specify the Club Car Carryall 700 Electric Utility for councils, maintenance teams, commercial farms. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Club Car Carryall 700 Electric Utility before I buy it?",
        a: "Yes. Because the Club Car Carryall 700 Electric Utility is priced at $22,900 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $22,900 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Club Car Carryall 700 Electric Utility road registrable in Australia?",
        a: "Conditional registration for a buggy like the Club Car Carryall 700 Electric Utility is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Club Car Carryall 700 Electric Utility anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car Carryall 700 Electric Utility travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-020',
    slug: 'ezgo-cushman-hauler-pro-lithium',
    name: 'E-Z-GO Cushman Hauler PRO Lithium',
    category: 'Commercial & Farm Utility Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 21500,
    price_display: '$21,500 AUD',
    search_intent: 'Commercial / Industrial',
    target_audience: 'Turf managers, schools, university campuses',
    key_specs: '72V AC Drive, Electric Cargo Bed Dump Option, 544kg Towing Capacity',
    shortDescription: 'High-voltage 72V commercial AC drive system with optional electric hydraulic tilt bed dump and 544kg tow capacity.',
    fullDescription: "The Hauler PRO runs a 72V AC drive rather than the 48V systems common elsewhere in the range, and higher system voltage is what lets it move heavy loads at lower current, running cooler and holding performance through a full working shift. A 544kg towing capacity covers turf equipment, trailers and grounds machinery. The optional electric dump bed is the feature that changes the working day: tipping a load of sand, mulch or clippings becomes a button rather than a shovel, which is the difference between one trip and one trip plus twenty minutes. Turf managers, schools and university campuses choose it for exactly that combination of capacity and quiet, fume-free operation around students and public areas.",
    badge: '72V Commercial',
    featured: true,
    images: ['/images/ezgo-cushman-hauler-pro-lithium.webp'],
    inStock: true,
    primaryKeyword: "ezgo golf carts australia",
    supportingKeywords: [
      "ezgo golf cart for sale",
      "ezgo golf buggy for sale",
      "ez go golf cart",
      "ezgo golf cart accessories",
      "ezgo golf cart",
      "ezgo golf carts",
    ],
    faqs: [
      {
        q: "How much does the E-Z-GO Cushman Hauler PRO Lithium cost in Australia?",
        a: "The E-Z-GO Cushman Hauler PRO Lithium is $21,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the E-Z-GO Cushman Hauler PRO Lithium?",
        a: "The E-Z-GO Cushman Hauler PRO Lithium is supplied with 72V AC Drive, Electric Cargo Bed Dump Option and 544kg towing capacity. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the E-Z-GO Cushman Hauler PRO Lithium best suited to?",
        a: "We specify the E-Z-GO Cushman Hauler PRO Lithium for turf managers, schools, university campuses. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the E-Z-GO Cushman Hauler PRO Lithium before I buy it?",
        a: "Yes. Because the E-Z-GO Cushman Hauler PRO Lithium is priced at $21,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $21,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the E-Z-GO Cushman Hauler PRO Lithium road registrable in Australia?",
        a: "Conditional registration for a buggy like the E-Z-GO Cushman Hauler PRO Lithium is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the E-Z-GO Cushman Hauler PRO Lithium anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The E-Z-GO Cushman Hauler PRO Lithium travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-021',
    slug: 'yamaha-umax-rally-efi-petrol',
    name: 'Yamaha UMAX Rally EFI Petrol',
    category: 'Commercial & Farm Utility Buggies',
    fuel_type: 'Mechanical (Petrol EFI)',
    price_aud: 18900,
    price_display: '$18,900 AUD',
    search_intent: 'Commercial / Farm',
    target_audience: 'Livestock properties, large regional venues',
    key_specs: '402cc Yamaha EFI Engine, Side-Filling Fuel Tank, Bucket Seats, Under-Hood Storage',
    shortDescription: 'Heavy-duty 402cc Yamaha EFI commercial workhorse with huge under-hood dry storage and side fuel filler.',
    fullDescription: "The UMAX Rally is Yamaha's commercial workhorse, powered by a 402cc EFI engine sized for sustained duty rather than short bursts. Livestock properties and large regional venues run these hard for long days, and the details reflect it: a side-filling fuel tank means refuelling without climbing over the bed or unloading first, and substantial under-hood dry storage keeps tools, medications, tags and paperwork out of the weather rather than sliding loose in an open tray. Bucket seats hold you in place across paddock ground instead of letting you slide with every camber change. Electronic fuel injection keeps starting reliable through cold mornings and hot afternoons alike, which matters when the vehicle is part of the day's routine.",
    badge: 'Heavy Farm Spec',
    featured: false,
    images: ['/images/yamaha-umax-rally-efi-petrol.webp'],
    inStock: true,
    primaryKeyword: "yamaha fleet golf carts",
    supportingKeywords: [
      "yamaha petrol golf carts for sale",
      "yamaha petrol golf buggy for sale",
      "yamaha g29 petrol golf cart",
      "yamaha petrol golf buggy",
      "yamaha petrol golf carts for sale qld",
      "yamaha petrol golf carts for sale victoria",
    ],
    faqs: [
      {
        q: "How much does the Yamaha UMAX Rally EFI Petrol cost in Australia?",
        a: "The Yamaha UMAX Rally EFI Petrol is $18,900 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Yamaha UMAX Rally EFI Petrol?",
        a: "The Yamaha UMAX Rally EFI Petrol is supplied with 402cc Yamaha EFI Engine, Side-Filling Fuel Tank, Bucket Seats and under-hood storage. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Yamaha UMAX Rally EFI Petrol best suited to?",
        a: "We specify the Yamaha UMAX Rally EFI Petrol for livestock properties, large regional venues. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Yamaha UMAX Rally EFI Petrol before I buy it?",
        a: "Yes. Because the Yamaha UMAX Rally EFI Petrol is priced at $18,900 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $18,900 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Yamaha UMAX Rally EFI Petrol road registrable in Australia?",
        a: "Conditional registration for a buggy like the Yamaha UMAX Rally EFI Petrol is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Yamaha UMAX Rally EFI Petrol anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Yamaha UMAX Rally EFI Petrol travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-022',
    slug: 'evolution-700-heavy-commercial-utility',
    name: 'Evolution 700 Heavy Commercial Utility',
    category: 'Commercial & Farm Utility Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 19200,
    price_display: '$19,200 AUD',
    search_intent: 'Commercial',
    target_audience: 'Facility management, security patrols',
    key_specs: 'Drop-Side Flatbed Tray, Lithium-Ion, High-Output Headlights, Tow Bar',
    shortDescription: 'Industrial drop-side flatbed carrying tray with lithium-ion power and automotive front headlights.',
    fullDescription: "Specified for facility management and security patrol work, where the vehicle runs continuously across a defined site rather than covering open country. The drop-side flatbed tray is the practical distinction: dropping a side lets you load and unload from any angle, including with a trolley or by sliding long items on, instead of lifting everything up and over a fixed wall. Lithium-ion power keeps patrol runs quiet enough not to disturb residents, guests or wildlife on night rounds, and removes refuelling from a shift pattern entirely. High-output automotive headlights and a fitted tow bar make it useful after dark and behind a trailer. A straightforward industrial platform, supported from our Yatala QLD depot.",
    badge: 'Drop-Side Tray',
    featured: false,
    images: ['/images/evolution-700-heavy-commercial-utility.webp', '/images/evolution-700-heavy-commercial-utility-2.webp'],
    inStock: true,
    primaryKeyword: "evolution golf cart dealers near me",
    supportingKeywords: [
      "evolution golf cart for sale",
      "price evolution golf carts",
      "evolution golf carts dealer near me",
      "evolution golf carts dealers near me",
      "evolution golf cart accessories",
      "golf carts evolution",
    ],
    faqs: [
      {
        q: "How much does the Evolution 700 Heavy Commercial Utility cost in Australia?",
        a: "The Evolution 700 Heavy Commercial Utility is $19,200 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the Evolution 700 Heavy Commercial Utility use?",
        a: "The Evolution 700 Heavy Commercial Utility runs lithium rather than lead-acid, specified as Drop-Side Flatbed Tray. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "What is included with the Evolution 700 Heavy Commercial Utility?",
        a: "The Evolution 700 Heavy Commercial Utility is supplied with Drop-Side Flatbed Tray, Lithium-Ion, High-Output Headlights and tow bar. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Evolution 700 Heavy Commercial Utility best suited to?",
        a: "We specify the Evolution 700 Heavy Commercial Utility for facility management, security patrols. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Evolution 700 Heavy Commercial Utility before I buy it?",
        a: "Yes. Because the Evolution 700 Heavy Commercial Utility is priced at $19,200 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $19,200 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Evolution 700 Heavy Commercial Utility road registrable in Australia?",
        a: "Conditional registration for a buggy like the Evolution 700 Heavy Commercial Utility is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
    ],
  },
  {
    id: 'BUG-023',
    slug: 'lvtong-commercial-flatbed-cargo-buggy',
    name: 'LVTONG Commercial Flatbed / Cargo Buggy',
    category: 'Commercial & Farm Utility Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 15900,
    price_display: '$15,900 AUD',
    search_intent: 'Value B2B',
    target_audience: 'Warehouses, nurseries, eco-resort groundskeepers',
    key_specs: 'Steel Mesh Flatbed, Low Loader Height, Regenerative Braking',
    shortDescription: 'Low-loading steel deck cargo carrier with intelligent regenerative braking for safe warehouse and estate transit.',
    fullDescription: "Low loader height is the reason this model exists. Every centimetre of deck height is a lift your staff perform on every item, all day, and a low steel mesh deck turns awkward lifts into slides. The mesh itself drains, so wet nursery stock, hosed-down bins and rain do not pool in the tray. Regenerative braking recovers energy on the descents and, more usefully indoors, gives controlled slowing without riding the brake pedal through a warehouse aisle. Warehouses, nurseries and eco-resort groundskeepers choose it as a load-carrying platform rather than a passenger vehicle with a tray attached. Quiet, low-slung and specified for repetitive handling work across sealed and semi-sealed surfaces.",
    badge: 'Low Loader Deck',
    featured: false,
    images: ['/images/lvtong-commercial-flatbed-cargo-buggy.webp'],
    inStock: true,
    primaryKeyword: "flatbed golf cart",
    supportingKeywords: [
      "cargo golf cart",
      "commercial golf carts",
      "golf cart cargo",
      "golf cart commercial",
      "golf cart with cargo bed",
      "electric golf carts for commercial use",
    ],
    faqs: [
      {
        q: "How much does the LVTONG Commercial Flatbed / Cargo Buggy cost in Australia?",
        a: "The LVTONG Commercial Flatbed / Cargo Buggy is $15,900 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the LVTONG Commercial Flatbed / Cargo Buggy?",
        a: "The LVTONG Commercial Flatbed / Cargo Buggy is supplied with Steel Mesh Flatbed, Low Loader Height and regenerative braking. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the LVTONG Commercial Flatbed / Cargo Buggy best suited to?",
        a: "We specify the LVTONG Commercial Flatbed / Cargo Buggy for warehouses, nurseries, eco-resort groundskeepers. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the LVTONG Commercial Flatbed / Cargo Buggy before I buy it?",
        a: "Yes. Because the LVTONG Commercial Flatbed / Cargo Buggy is priced at $15,900 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $15,900 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the LVTONG Commercial Flatbed / Cargo Buggy road registrable in Australia?",
        a: "Conditional registration for a buggy like the LVTONG Commercial Flatbed / Cargo Buggy is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the LVTONG Commercial Flatbed / Cargo Buggy anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The LVTONG Commercial Flatbed / Cargo Buggy travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-024',
    slug: 'club-car-transporter-6-commercial',
    name: 'Club Car Transporter 6 Commercial',
    category: 'Commercial & Farm Utility Buggies',
    fuel_type: 'Electric (Lithium-Ion)',
    price_aud: 26400,
    price_display: '$26,400 AUD',
    search_intent: 'High-Ticket B2B',
    target_audience: 'Airports, mines, large resort guest shuttles',
    key_specs: '6-Passenger Forward-Facing Seating, Armor-Flex Body, Heavy-Duty Axles',
    shortDescription: 'Premium 6-passenger forward-facing shuttle featuring dent-resistant ArmorFlex bodywork and reinforced commercial axles.',
    fullDescription: "Where the Carryall carries loads, the Transporter 6 carries people, and it is built for shuttle duty at airports, mine sites and large resorts. Six forward-facing seats keep every passenger travelling in the direction of movement, which matters on longer transfers and with luggage. ArmorFlex bodywork resists the dents and scuffs that shared shuttle vehicles collect from trolleys, cases, bollards and inattentive drivers, so the fleet still looks presentable after a season rather than a fortnight. Heavy-duty axles carry a full load of adults and bags without the sag that shortens component life. For any operator whose vehicle is the first impression a guest receives, the durability specification pays for itself.",
    badge: '6-Passenger VIP',
    featured: true,
    images: ['/images/club-car-transporter-6-commercial.webp'],
    inStock: true,
    primaryKeyword: "club car golf buggy",
    supportingKeywords: [
      "how heavy is a club car golf cart",
      "body kit for club car golf cart",
      "club car golf cart body kits",
      "club car golf cart won't go forward or reverse",
      "golf cart body kits club car",
      "club car golf car",
    ],
    faqs: [
      {
        q: "How much does the Club Car Transporter 6 Commercial cost in Australia?",
        a: "The Club Car Transporter 6 Commercial is $26,400 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Club Car Transporter 6 Commercial?",
        a: "The Club Car Transporter 6 Commercial is supplied with 6-Passenger Forward-Facing Seating, Armor-Flex Body and heavy-duty axles. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Club Car Transporter 6 Commercial best suited to?",
        a: "We specify the Club Car Transporter 6 Commercial for airports, mines, large resort guest shuttles. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Club Car Transporter 6 Commercial before I buy it?",
        a: "Yes. Because the Club Car Transporter 6 Commercial is priced at $26,400 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $26,400 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Club Car Transporter 6 Commercial road registrable in Australia?",
        a: "Conditional registration for a buggy like the Club Car Transporter 6 Commercial is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Club Car Transporter 6 Commercial anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car Transporter 6 Commercial travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-025',
    slug: 'yamaha-drive2-quiettech-efi-petrol',
    name: 'Yamaha Drive2 QuietTech EFI Petrol',
    category: 'Mechanical & Petrol Buggies',
    fuel_type: 'Mechanical (Petrol EFI)',
    price_aud: 14800,
    price_display: '$14,800 AUD',
    search_intent: 'Commercial / Quiet Petrol',
    target_audience: 'Golfers and property owners wanting petrol range without noise',
    key_specs: 'Quietest Petrol Engine on the Market, Fully Independent Rear Suspension, High MPG',
    shortDescription: 'Patented QuietTech engineering creates the quietest petrol golf cart on earth—sounds like electric with unlimited petrol range.',
    fullDescription: "QuietTech exists to solve the one real objection to petrol: the noise. Yamaha's engineering brings the Drive2 close enough to electric in sound that conversation at speed stays comfortable, while keeping the unlimited range and one-minute refuelling that petrol offers. For golfers and property owners who want to cover long distances without planning around a charge cycle, but who have ruled out petrol because of engine drone, this is the model that reopens the option. Fully independent rear suspension keeps rough turf and unsealed tracks from reaching the seat frame, and high fuel efficiency keeps the running cost sensible across long weekly distances. Supported with Australian parts and warranty from our Yatala QLD depot.",
    badge: 'Quietest Petrol',
    featured: true,
    images: ['/images/yamaha-drive2-quiettech-efi-petrol.webp'],
    inStock: true,
    primaryKeyword: "yamaha golf cart petrol engine",
    supportingKeywords: [
      "petrol yamaha golf cart",
      "yamaha petrol golf cart",
      "yamaha petrol golf cart price",
      "yamaha petrol golf carts for sale nsw",
      "yamaha petrol golf carts",
      "yamaha petrol golf cart for sale",
    ],
    faqs: [
      {
        q: "How much does the Yamaha Drive2 QuietTech EFI Petrol cost in Australia?",
        a: "The Yamaha Drive2 QuietTech EFI Petrol is $14,800 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Yamaha Drive2 QuietTech EFI Petrol?",
        a: "The Yamaha Drive2 QuietTech EFI Petrol is supplied with Quietest Petrol Engine on the Market, Fully Independent Rear Suspension and high mpg. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Yamaha Drive2 QuietTech EFI Petrol best suited to?",
        a: "We specify the Yamaha Drive2 QuietTech EFI Petrol for golfers and property owners wanting petrol range without noise. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Is the Yamaha Drive2 QuietTech EFI Petrol road registrable in Australia?",
        a: "Conditional registration for a buggy like the Yamaha Drive2 QuietTech EFI Petrol is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Yamaha Drive2 QuietTech EFI Petrol anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Yamaha Drive2 QuietTech EFI Petrol travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Do you sell a used version of the Yamaha Drive2 QuietTech EFI Petrol?",
        a: "We do carry reconditioned buggies alongside new stock, and availability changes as trade-ins come through. A reconditioned unit is checked, charge-cycled and road tested at Yatala the same way a new one is. Ask us what is on the floor — if a used equivalent of the Yamaha Drive2 QuietTech EFI Petrol is available, we will tell you what it is and what it has done.",
      },
    ],
  },
  {
    id: 'BUG-026',
    slug: 'club-car-tempo-efi-petrol',
    name: 'Club Car Tempo EFI Petrol',
    category: 'Mechanical & Petrol Buggies',
    fuel_type: 'Mechanical (Petrol EFI)',
    price_aud: 14250,
    price_display: '$14,250 AUD',
    search_intent: 'Brand Direct / Petrol',
    target_audience: 'Traditional rural users, remote property caretakers',
    key_specs: '14HP Single Cylinder Engine, Overhead Cam, Tank Capacity 25.4L',
    shortDescription: '14HP overhead-cam petrol engine backed by a generous 25.4-litre fuel tank for long weeks between refills.',
    fullDescription: "The 25.4-litre fuel tank is the headline for remote users, and the reason is simple arithmetic: a larger tank means fewer trips to town, fewer jerry cans and longer stretches between refuelling on properties where the nearest bowser is a genuine drive away. The 14HP overhead-cam single-cylinder engine is a conventional, proven layout that rural mechanics understand and that does not require specialist tooling to service. Traditional rural users and remote property caretakers tend to prefer exactly this: mechanical simplicity, long range and parts availability over touchscreens and app connectivity. Club Car build quality underpins it, and the whole vehicle is supported from our Yatala QLD depot with nationwide enclosed freight quoted per postcode.",
    badge: '25.4L Fuel Tank',
    featured: false,
    images: ['/images/club-car-tempo-efi-petrol.webp'],
    inStock: true,
    primaryKeyword: "club car petrol golf buggy",
    supportingKeywords: [
      "club car petrol golf cart",
      "club car golf cart engine",
      "club car golf cart engine swap",
      "club car tempo golf cart price",
      "tempo club car golf cart",
      "club car golf carts engines",
    ],
    faqs: [
      {
        q: "How much does the Club Car Tempo EFI Petrol cost in Australia?",
        a: "The Club Car Tempo EFI Petrol is $14,250 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Club Car Tempo EFI Petrol?",
        a: "The Club Car Tempo EFI Petrol is supplied with 14HP Single Cylinder Engine, Overhead Cam and tank capacity 25.4l. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Club Car Tempo EFI Petrol best suited to?",
        a: "We specify the Club Car Tempo EFI Petrol for traditional rural users, remote property caretakers. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Is the Club Car Tempo EFI Petrol road registrable in Australia?",
        a: "Conditional registration for a buggy like the Club Car Tempo EFI Petrol is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Club Car Tempo EFI Petrol anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car Tempo EFI Petrol travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Do you sell a used version of the Club Car Tempo EFI Petrol?",
        a: "We do carry reconditioned buggies alongside new stock, and availability changes as trade-ins come through. A reconditioned unit is checked, charge-cycled and road tested at Yatala the same way a new one is. Ask us what is on the floor — if a used equivalent of the Club Car Tempo EFI Petrol is available, we will tell you what it is and what it has done.",
      },
    ],
  },
  {
    id: 'BUG-027',
    slug: 'ezgo-freedom-rxv-gas',
    name: 'E-Z-GO Freedom RXV Gas',
    category: 'Mechanical & Petrol Buggies',
    fuel_type: 'Mechanical (Petrol)',
    price_aud: 13900,
    price_display: '$13,900 AUD',
    search_intent: 'Transactional',
    target_audience: 'Farmers, acreage owners',
    key_specs: 'EX1 Closed-Loop EFI Petrol Engine, Low Maintenance, Energy Efficient',
    shortDescription: 'Purpose-built EX1 closed-loop petrol engine engineered specifically to reduce oil changes and maintenance intervals.',
    fullDescription: "The EX1 engine was designed around a maintenance problem rather than a power target. Its closed-loop electronic fuel injection continuously adjusts the fuel mixture based on live exhaust readings, which keeps combustion clean, reduces the fuel dilution and carbon build-up that contaminate oil, and lengthens the interval between oil changes. For farmers and acreage owners that translates into fewer hours spent servicing and more spent using the vehicle. Closed-loop metering also means it adapts automatically to temperature and altitude instead of needing seasonal adjustment. If your previous petrol buggy felt like a maintenance commitment, the Freedom RXV is the direct answer to that experience. Dispatched from Yatala QLD with Australian warranty support.",
    badge: 'Low Maintenance Gas',
    featured: false,
    images: ['/images/ezgo-freedom-rxv-gas.webp'],
    inStock: true,
    primaryKeyword: "ezgo golf cart gas engine",
    supportingKeywords: [
      "ezgo rxv gas golf cart",
      "ez go gas golf cart",
      "ez go gas golf carts",
      "ez go golf cart gas",
      "ezgo gas golf cart",
      "ezgo gas golf cart for sale",
    ],
    faqs: [
      {
        q: "How much does the E-Z-GO Freedom RXV Gas cost in Australia?",
        a: "The E-Z-GO Freedom RXV Gas is $13,900 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the E-Z-GO Freedom RXV Gas?",
        a: "The E-Z-GO Freedom RXV Gas is supplied with EX1 Closed-Loop EFI Petrol Engine, Low Maintenance and energy efficient. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the E-Z-GO Freedom RXV Gas best suited to?",
        a: "We specify the E-Z-GO Freedom RXV Gas for farmers, acreage owners. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Is the E-Z-GO Freedom RXV Gas road registrable in Australia?",
        a: "Conditional registration for a buggy like the E-Z-GO Freedom RXV Gas is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the E-Z-GO Freedom RXV Gas anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The E-Z-GO Freedom RXV Gas travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Do you sell a used version of the E-Z-GO Freedom RXV Gas?",
        a: "We do carry reconditioned buggies alongside new stock, and availability changes as trade-ins come through. A reconditioned unit is checked, charge-cycled and road tested at Yatala the same way a new one is. Ask us what is on the floor — if a used equivalent of the E-Z-GO Freedom RXV Gas is available, we will tell you what it is and what it has done.",
      },
    ],
  },
  {
    id: 'BUG-028',
    slug: 'cushman-hauler-1200-gas-utility',
    name: 'Cushman Hauler 1200 Gas Utility',
    category: 'Mechanical & Petrol Buggies',
    fuel_type: 'Mechanical (Petrol)',
    price_aud: 16800,
    price_display: '$16,800 AUD',
    search_intent: 'Commercial Utility',
    target_audience: 'Heavy agricultural property work',
    key_specs: '13.5HP Kawasaki Engine, Manual Dump Bed, 544kg Total Load Capacity',
    shortDescription: 'Bulletproof 13.5HP Kawasaki petrol engine with heavy-duty manual dump bed and 544kg carrying capacity.',
    fullDescription: "The 13.5HP Kawasaki engine is the reason this model has the reputation it does. Kawasaki's small industrial engines are a known quantity on Australian properties, which means parts, service knowledge and reliability are all readily available rather than dependent on a single importer. A manual dump bed handles 544kg of sand, gravel, feed or spoil and tips it without hydraulics to fail or maintain, which on heavy agricultural work is a feature rather than a compromise. Fewer systems means fewer things to go wrong a long way from the shed. For properties that need a genuinely rugged load carrier and value mechanical simplicity over convenience features, the Hauler 1200 is the straightforward choice.",
    badge: 'Kawasaki Powered',
    featured: false,
    images: ['/images/cushman-hauler-1200-gas-utility.webp'],
    inStock: true,
    primaryKeyword: "cushman golf buggy",
    supportingKeywords: [
      "cushman golf cart for sale",
      "cushman golf cart",
      "cushman golf carts for sale",
      "vintage cushman golf cart for sale",
      "cushman electric golf cart",
      "cushman buggies",
    ],
    faqs: [
      {
        q: "How much does the Cushman Hauler 1200 Gas Utility cost in Australia?",
        a: "The Cushman Hauler 1200 Gas Utility is $16,800 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Cushman Hauler 1200 Gas Utility?",
        a: "The Cushman Hauler 1200 Gas Utility is supplied with 13.5HP Kawasaki Engine, Manual Dump Bed and 544kg total load capacity. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Cushman Hauler 1200 Gas Utility best suited to?",
        a: "We specify the Cushman Hauler 1200 Gas Utility for heavy agricultural property work. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Cushman Hauler 1200 Gas Utility before I buy it?",
        a: "Yes. Because the Cushman Hauler 1200 Gas Utility is priced at $16,800 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $16,800 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Cushman Hauler 1200 Gas Utility road registrable in Australia?",
        a: "Conditional registration for a buggy like the Cushman Hauler 1200 Gas Utility is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Cushman Hauler 1200 Gas Utility anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Cushman Hauler 1200 Gas Utility travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-029',
    slug: 'yamaha-umax-one-efi-utility',
    name: 'Yamaha UMAX One EFI Utility',
    category: 'Mechanical & Petrol Buggies',
    fuel_type: 'Mechanical (Petrol EFI)',
    price_aud: 15500,
    price_display: '$15,500 AUD',
    search_intent: 'Commercial / Farm',
    target_audience: 'Small farms, lifestyle blocks, sport venues',
    key_specs: 'Compact Utility Bed, One-Hand Latch System, High Comfort Bucket Seats',
    shortDescription: 'Compact yet capable EFI utility buggy with single-handed tailgate latch and wide contoured bucket seats.',
    fullDescription: "The UMAX One is the compact end of the commercial range, sized for small farms, lifestyle blocks and sport venues where a full-size utility vehicle is more machine than the site needs. A one-hand tailgate latch sounds minor until you are carrying something in the other arm, which on a working vehicle is most of the time. The compact utility bed carries a genuine load without the length that makes manoeuvring awkward around sheds, gates and spectator areas. Wide contoured bucket seats keep the driver comfortable across a long day rather than merely seated. Yamaha EFI keeps starting and running reliable across the temperature range Australian sites actually experience.",
    badge: 'Compact Utility',
    featured: false,
    images: ['/images/yamaha-umax-one-efi-utility.webp'],
    inStock: true,
    primaryKeyword: "efi yamaha golf cart",
    supportingKeywords: [
      "yamaha efi golf cart",
      "yamaha efi golf cart for sale",
      "yamaha efi golf cart price",
      "yamaha golf cart efi",
      "engine for yamaha golf cart",
      "fuel filter yamaha golf cart",
    ],
    faqs: [
      {
        q: "How much does the Yamaha UMAX One EFI Utility cost in Australia?",
        a: "The Yamaha UMAX One EFI Utility is $15,500 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Yamaha UMAX One EFI Utility?",
        a: "The Yamaha UMAX One EFI Utility is supplied with Compact Utility Bed, One-Hand Latch System and high comfort bucket seats. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Yamaha UMAX One EFI Utility best suited to?",
        a: "We specify the Yamaha UMAX One EFI Utility for small farms, lifestyle blocks, sport venues. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Yamaha UMAX One EFI Utility before I buy it?",
        a: "Yes. Because the Yamaha UMAX One EFI Utility is priced at $15,500 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $15,500 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Yamaha UMAX One EFI Utility road registrable in Australia?",
        a: "Conditional registration for a buggy like the Yamaha UMAX One EFI Utility is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Yamaha UMAX One EFI Utility anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Yamaha UMAX One EFI Utility travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-030',
    slug: 'club-car-carryall-300-petrol',
    name: 'Club Car Carryall 300 Petrol',
    category: 'Mechanical & Petrol Buggies',
    fuel_type: 'Mechanical (Petrol EFI)',
    price_aud: 16200,
    price_display: '$16,200 AUD',
    search_intent: 'Commercial',
    target_audience: 'Light commercial, school groundskeeping',
    key_specs: 'Rustproof Aircraft Grade Aluminum Frame, 14HP Engine, Compact Turning Radius',
    shortDescription: 'Agile utility buggy featuring tight turning circle and rustproof aluminum bed for schools and grounds teams.',
    fullDescription: "A tight turning circle is the specification that decides whether a utility vehicle is useful around buildings, and the Carryall 300 is built for exactly that environment. Schools, grounds teams and light commercial sites work between structures, walkways, garden beds and parked cars, where a large turning radius means three-point turns all day. The rustproof aircraft-grade aluminium bed is the durability argument: grounds work means wet clippings, fertiliser and sand, all of which corrode a steel tray from the inside out over a few seasons. Aluminium simply does not. A 14HP engine provides adequate power for the loads this class carries without the running costs of a larger unit. Supported from Yatala QLD.",
    badge: 'Tight Radius Work',
    featured: false,
    images: ['/images/club-car-carryall-300-petrol.webp'],
    inStock: true,
    primaryKeyword: "club car golf carts australia",
    supportingKeywords: [
      "club car golf cart for sale",
      "club car golf cart sales",
      "club car golf cart wrap",
      "club car buggy",
      "club car golf cars australia",
      "club car golf cart accessories",
    ],
    faqs: [
      {
        q: "How much does the Club Car Carryall 300 Petrol cost in Australia?",
        a: "The Club Car Carryall 300 Petrol is $16,200 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What is included with the Club Car Carryall 300 Petrol?",
        a: "The Club Car Carryall 300 Petrol is supplied with Rustproof Aircraft Grade Aluminum Frame, 14HP Engine and compact turning radius. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Who is the Club Car Carryall 300 Petrol best suited to?",
        a: "We specify the Club Car Carryall 300 Petrol for light commercial, school groundskeeping. If your situation is different — a steeper property, more passengers, longer daily distances or a commercial duty cycle — call the Yatala desk on 0480 804 189 and we will point you at the right model in the range rather than selling you this one.",
      },
      {
        q: "Can I try the Club Car Carryall 300 Petrol before I buy it?",
        a: "Yes. Because the Club Car Carryall 300 Petrol is priced at $16,200 AUD, it qualifies for a complimentary on-farm or on-course trial demonstration. Spending $16,200 AUD on a vehicle you have only seen in photographs is a large leap, so we would rather you drove it on your own ground first. Contact us with your location to arrange it.",
      },
      {
        q: "Is the Club Car Carryall 300 Petrol road registrable in Australia?",
        a: "Conditional registration for a buggy like the Club Car Carryall 300 Petrol is decided by your state road authority, and often your local council as well, so requirements differ by address and change over time. Check with them before buying or fitting a road package. We can supply the vehicle and the compliance details; the approval itself is theirs to give.",
      },
      {
        q: "Can you deliver the Club Car Carryall 300 Petrol anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car Carryall 300 Petrol travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-031',
    slug: 'mgi-ai-navigator-gps-remote-buggy',
    name: 'MGI Ai Navigator GPS Remote Buggy',
    category: 'Motorised Walk-Behind Golf Buggies',
    fuel_type: 'Electric (Walk-Behind Lithium)',
    price_aud: 2849,
    price_display: '$2,849 AUD',
    search_intent: 'High Volume Consumer (#1 Seller)',
    target_audience: 'Private golfers walking the course',
    key_specs: 'Full Directional Remote, Integrated Touchscreen GPS, Gyroscope Straight Tracker',
    shortDescription: "Australia's #1 motorized remote buggy with integrated high-resolution touchscreen GPS and Patented Gyroscope Straight Tracker.",
    fullDescription: "The gyroscope straight tracker is what separates a good remote buggy from a frustrating one. Without it, any motorised buggy drifts off line on a cambered fairway and you spend the walk correcting it; the gyroscope holds the chosen heading across slopes so the buggy tracks where you pointed it. Full directional remote control means you can send it ahead to the next tee or around a bunker while you play, and the integrated touchscreen GPS puts distances in front of you without reaching for a phone or a separate rangefinder. For private golfers who walk the course, this is the flagship of the MGI range and the model to choose if you want the buggy to require no attention at all.",
    badge: 'Australia #1 Seller',
    featured: true,
    images: ['/images/mgi-ai-navigator-gps-remote-buggy.webp'],
    inStock: true,
    primaryKeyword: "mgi ai navigator gps+ remote golf buggy",
    supportingKeywords: [
      "mgi ai navigator gps+ motorised buggy",
      "mgi remote golf buggy",
      "mgi electric golf buggy with remote",
      "mgi golf buggy remote control",
      "mgi buggy remote",
      "mgi buggy with remote",
    ],
    faqs: [
      {
        q: "How much does the MGI Ai Navigator GPS Remote Buggy cost in Australia?",
        a: "The MGI Ai Navigator GPS Remote Buggy is $2,849 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "Will the MGI Ai Navigator GPS Remote Buggy fit in my car boot?",
        a: "The MGI Ai Navigator GPS Remote Buggy folds for transport, but measure before ordering rather than after. Check the usable space — width between the wheel arches at their narrowest, height under a closed boot lid, depth to the tailgate — and load a golf bag alongside during the check. Boot litre ratings are a poor guide, and hatchbacks and sedans differ far more than the numbers imply.",
      },
      {
        q: "What is included with the MGI Ai Navigator GPS Remote Buggy?",
        a: "The MGI Ai Navigator GPS Remote Buggy is supplied with Full Directional Remote, Integrated Touchscreen GPS and gyroscope straight tracker. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Does the MGI Ai Navigator GPS Remote Buggy come with an Australian warranty?",
        a: "Yes. The MGI Ai Navigator GPS Remote Buggy carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Can you deliver the MGI Ai Navigator GPS Remote Buggy anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The MGI Ai Navigator GPS Remote Buggy travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Is the MGI Ai Navigator GPS Remote Buggy in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the MGI Ai Navigator GPS Remote Buggy is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'BUG-032',
    slug: 'mgi-zip-navigator-all-terrain',
    name: 'MGI Zip Navigator All-Terrain',
    category: 'Motorised Walk-Behind Golf Buggies',
    fuel_type: 'Electric (Walk-Behind Lithium)',
    price_aud: 2209,
    price_display: '$2,209 AUD',
    search_intent: 'High Volume Consumer',
    target_audience: 'Walk-behind golfers wanting all-terrain stability',
    key_specs: 'Twin 230W Motors, 24V 380Wh Lithium Battery, Rear Anti-Tip 5th Wheel',
    shortDescription: 'Dual calibrated 230W motors with rear fold-out 5th wheel for zero tipping on steep fairway contours.',
    fullDescription: "Twin 230W motors drive the wheels independently, which is what gives the Zip Navigator its footing on wet slopes and cambered lies where a single-motor buggy scrabbles and slides sideways. The rear fold-out fifth wheel is the other half of the story: it sits behind the main axle and stops the buggy tipping backwards when climbing steep contours, a genuine risk on undulating Australian courses when a full bag sits high on the frame. A 24V 380Wh lithium pack supplies the sustained power both motors need. For walk-behind golfers whose home course has real elevation rather than gentle undulation, this is the stability specification worth paying for.",
    badge: 'Twin 230W Motors',
    featured: true,
    images: ['/images/mgi-zip-navigator-all-terrain.webp'],
    inStock: true,
    primaryKeyword: "mgi zip navigator all terrain motorised golf buggy",
    supportingKeywords: [
      "mgi zip navigator at all terrain electric golf caddy",
      "mgi golf zip navigator electric caddy",
      "mgi zip navigator at electric golf caddy",
      "mgi zip navigator motorised golf buggy",
      "mgi zip navigator electric golf caddy",
      "mgi zip navigator electric golf caddy accessories",
    ],
    faqs: [
      {
        q: "How much does the MGI Zip Navigator All-Terrain cost in Australia?",
        a: "The MGI Zip Navigator All-Terrain is $2,209 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the MGI Zip Navigator All-Terrain use?",
        a: "The MGI Zip Navigator All-Terrain runs lithium rather than lead-acid, specified as Twin 230W Motors. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "Will the MGI Zip Navigator All-Terrain fit in my car boot?",
        a: "The MGI Zip Navigator All-Terrain folds for transport, but measure before ordering rather than after. Check the usable space — width between the wheel arches at their narrowest, height under a closed boot lid, depth to the tailgate — and load a golf bag alongside during the check. Boot litre ratings are a poor guide, and hatchbacks and sedans differ far more than the numbers imply.",
      },
      {
        q: "What is included with the MGI Zip Navigator All-Terrain?",
        a: "The MGI Zip Navigator All-Terrain is supplied with Twin 230W Motors, 24V 380Wh Lithium Battery and rear anti-tip 5th wheel. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Does the MGI Zip Navigator All-Terrain come with an Australian warranty?",
        a: "Yes. The MGI Zip Navigator All-Terrain carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Can you deliver the MGI Zip Navigator All-Terrain anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The MGI Zip Navigator All-Terrain travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-033',
    slug: 'mgi-2024-zip-x5-36-hole-lithium',
    name: 'MGI 2024 Zip X5 36-Hole Lithium',
    category: 'Motorised Walk-Behind Golf Buggies',
    fuel_type: 'Electric (Walk-Behind Lithium)',
    price_aud: 1875,
    price_display: '$1,875 AUD',
    search_intent: 'Transactional',
    target_audience: 'Golfers playing long 36-hole days',
    key_specs: 'Downhill Speed Control, Electronic Park Brake, Distance Control Function',
    shortDescription: 'Downhill speed control keeps a steady walking pace downhill automatically, with 36-hole extended lithium battery.',
    fullDescription: "Built for golfers who play long days, the Zip X5 carries a 36-hole lithium battery so a second round does not become a range calculation. Downhill speed control is the feature that earns its keep on hilly courses: rather than running away from you and forcing a jog, the buggy holds a steady walking pace on descents automatically. An electronic park brake holds it in place on a slope while you play your shot, instead of chocking a wheel or angling it across the hill. Distance control lets you send it forward a set distance and have it stop on its own. Straightforward, well-sorted and specified for volume golf rather than occasional rounds.",
    badge: 'Downhill Speed Control',
    featured: false,
    images: ['/images/mgi-2024-zip-x5-36-hole-lithium.webp'],
    inStock: true,
    primaryKeyword: "mgi zip x5 motorised golf buggy",
    supportingKeywords: [
      "mgi zip x5 electric golf caddy",
      "mgi zip golf trolley",
      "mgi zip electric golf caddy",
      "mgi electric golf caddy",
      "mgi electric golf trolley",
      "mgi golf caddy",
    ],
    faqs: [
      {
        q: "How much does the MGI 2024 Zip X5 36-Hole Lithium cost in Australia?",
        a: "The MGI 2024 Zip X5 36-Hole Lithium is $1,875 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "Will the MGI 2024 Zip X5 36-Hole Lithium fit in my car boot?",
        a: "The MGI 2024 Zip X5 36-Hole Lithium folds for transport, but measure before ordering rather than after. Check the usable space — width between the wheel arches at their narrowest, height under a closed boot lid, depth to the tailgate — and load a golf bag alongside during the check. Boot litre ratings are a poor guide, and hatchbacks and sedans differ far more than the numbers imply.",
      },
      {
        q: "What is included with the MGI 2024 Zip X5 36-Hole Lithium?",
        a: "The MGI 2024 Zip X5 36-Hole Lithium is supplied with Downhill Speed Control, Electronic Park Brake and distance control function. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Does the MGI 2024 Zip X5 36-Hole Lithium come with an Australian warranty?",
        a: "Yes. The MGI 2024 Zip X5 36-Hole Lithium carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Can you deliver the MGI 2024 Zip X5 36-Hole Lithium anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The MGI 2024 Zip X5 36-Hole Lithium travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Is the MGI 2024 Zip X5 36-Hole Lithium in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the MGI 2024 Zip X5 36-Hole Lithium is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'BUG-034',
    slug: 'powakaddy-fx7-gps-lithium',
    name: 'PowaKaddy FX7 GPS Lithium',
    category: 'Motorised Walk-Behind Golf Buggies',
    fuel_type: 'Electric (Walk-Behind Lithium)',
    price_aud: 2099,
    price_display: '$2,099 AUD',
    search_intent: 'Brand Direct / High-End',
    target_audience: 'Tech-savvy golfers seeking UK engineering',
    key_specs: '3.5-inch OCA Full Color Touch Screen, High-Power 30V Plug n Play Lithium',
    shortDescription: 'Brilliant 3.5-inch full colour touchscreen pre-loaded with over 40,000 worldwide golf courses and 30V lithium system.',
    fullDescription: "PowaKaddy's FX7 brings UK engineering and a genuinely usable screen to the walk-behind category. The 3.5-inch OCA full colour touchscreen comes preloaded with over 40,000 courses worldwide, so it works on your home course and on holiday without a subscription hunt or a manual download before every round. OCA bonding is the reason it stays readable in Australian sunlight where cheaper laminated screens wash out. The high-power 30V Plug 'n' Play lithium system fits and removes without tools, which matters when the buggy lives in a car boot between rounds and the battery comes inside to charge. For tech-focused golfers who want the data on the buggy rather than the wrist, this is the pick.",
    badge: '3.5" GPS Screen',
    featured: false,
    images: ['/images/powakaddy-fx7-gps-lithium.webp'],
    inStock: true,
    primaryKeyword: "powakaddy fx7 gps electric golf trolley",
    supportingKeywords: [
      "powakaddy ct8 gps electric golf trolley",
      "powakaddy micra golf push trolley",
      "powakaddy micra push golf trolley",
      "electric golf trolley powakaddy",
      "powakaddy electric golf trolley",
      "powakaddy golf trolley",
    ],
    faqs: [
      {
        q: "How much does the PowaKaddy FX7 GPS Lithium cost in Australia?",
        a: "The PowaKaddy FX7 GPS Lithium is $2,099 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the PowaKaddy FX7 GPS Lithium use?",
        a: "The PowaKaddy FX7 GPS Lithium runs lithium rather than lead-acid, specified as 3.5-inch OCA Full Color Touch Screen. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "Will the PowaKaddy FX7 GPS Lithium fit in my car boot?",
        a: "The PowaKaddy FX7 GPS Lithium folds for transport, but measure before ordering rather than after. Check the usable space — width between the wheel arches at their narrowest, height under a closed boot lid, depth to the tailgate — and load a golf bag alongside during the check. Boot litre ratings are a poor guide, and hatchbacks and sedans differ far more than the numbers imply.",
      },
      {
        q: "What is included with the PowaKaddy FX7 GPS Lithium?",
        a: "The PowaKaddy FX7 GPS Lithium is supplied with 3.5-inch OCA Full Color Touch Screen and high-power 30v plug n play lithium. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Does the PowaKaddy FX7 GPS Lithium come with an Australian warranty?",
        a: "Yes. The PowaKaddy FX7 GPS Lithium carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Can you deliver the PowaKaddy FX7 GPS Lithium anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The PowaKaddy FX7 GPS Lithium travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  {
    id: 'BUG-035',
    slug: 'robera-pro-follow-remote-golf-buggy',
    name: 'Robera Pro Follow Remote Golf Buggy',
    category: 'Motorised Walk-Behind Golf Buggies',
    fuel_type: 'Electric (Walk-Behind Lithium)',
    price_aud: 2799,
    price_display: '$2,799 AUD',
    search_intent: 'High-End Niche',
    target_audience: 'Premium walk-behind buyers seeking hands-free tech',
    key_specs: 'Smart Follow Tracking Tag, Remote Control Dual-Mode, All-Terrain Dual Motors',
    shortDescription: 'Hands-free automatic smart follow technology—clips to your belt and tracks your footsteps at a safe distance.',
    fullDescription: "The Robera Pro is the only buggy in our range that requires no input at all once you start walking. A smart tracking tag clips to your belt and the buggy follows your footsteps at a safe distance, so there is no remote to hold, no dial to adjust and nothing to think about between shots. When you do want direct control, dual-mode remote operation is still there. All-terrain dual motors supply the independent drive that follow-mode needs to hold a line across slopes and around obstacles rather than cutting corners. For premium buyers who have decided the point of walking is to walk unencumbered, hands-free follow technology is the feature worth the step up.",
    badge: 'Smart Follow Mode',
    featured: true,
    images: ['/images/robera-pro-follow-remote-golf-buggy.webp'],
    inStock: true,
    primaryKeyword: "follow me remote control golf trolley",
    supportingKeywords: [
      "remote control motorised golf buggy",
      "remote control golf buggy",
      "remote control golf caddy that follows you",
      "motorised golf buggy with remote",
      "remote control electric golf buggy",
      "golf buggy remote control",
    ],
    faqs: [
      {
        q: "How much does the Robera Pro Follow Remote Golf Buggy cost in Australia?",
        a: "The Robera Pro Follow Remote Golf Buggy is $2,799 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "Will the Robera Pro Follow Remote Golf Buggy fit in my car boot?",
        a: "The Robera Pro Follow Remote Golf Buggy folds for transport, but measure before ordering rather than after. Check the usable space — width between the wheel arches at their narrowest, height under a closed boot lid, depth to the tailgate — and load a golf bag alongside during the check. Boot litre ratings are a poor guide, and hatchbacks and sedans differ far more than the numbers imply.",
      },
      {
        q: "What is included with the Robera Pro Follow Remote Golf Buggy?",
        a: "The Robera Pro Follow Remote Golf Buggy is supplied with Smart Follow Tracking Tag, Remote Control Dual-Mode and all-terrain dual motors. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Does the Robera Pro Follow Remote Golf Buggy come with an Australian warranty?",
        a: "Yes. The Robera Pro Follow Remote Golf Buggy carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Can you deliver the Robera Pro Follow Remote Golf Buggy anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Robera Pro Follow Remote Golf Buggy travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Is the Robera Pro Follow Remote Golf Buggy in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Robera Pro Follow Remote Golf Buggy is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'BUG-036',
    slug: 'mgi-zip-x1-lithium-buggy',
    name: 'MGI Zip X1 Lithium Buggy',
    category: 'Motorised Walk-Behind Golf Buggies',
    fuel_type: 'Electric (Walk-Behind Lithium)',
    price_aud: 1299,
    price_display: '$1,299 AUD',
    search_intent: 'Entry Level High Volume',
    target_audience: 'First-time motorised buggy buyers',
    key_specs: 'Simple Speed Dial, Click & Go Lithium System, Compact Fold Mechanism',
    shortDescription: 'The most popular entry-level motorized walking buggy in Australia with smooth variable speed dial and fast fold chassis.',
    fullDescription: "The Zip X1 is where most Australians make the move from pushing to motorised, and it is deliberately uncomplicated. A single variable speed dial is the entire control interface, so there is no menu, no pairing and nothing to learn before your first round. The Click & Go lithium system drops the battery in and out without tools or cables, and the compact fold mechanism collapses the frame quickly for a standard car boot. Measure your boot before ordering and the rest takes care of itself. For first-time motorised buyers, this is the model that answers the real question, which is not what it can do but whether it will be simple enough to use every week.",
    badge: 'Best Entry Electric',
    featured: false,
    images: ['/images/mgi-zip-x1-lithium-buggy.webp'],
    inStock: true,
    primaryKeyword: "mgi zip x1 motorised golf buggy",
    supportingKeywords: [
      "mgi motorised golf buggy",
      "mgi x1 electric golf trolley",
      "mgi zip x1 lithium electric golf trolley",
      "mgi electric buggy",
      "mgi ai 500 electric buggy",
      "mgi golf push cart",
    ],
    faqs: [
      {
        q: "How much does the MGI Zip X1 Lithium Buggy cost in Australia?",
        a: "The MGI Zip X1 Lithium Buggy is $1,299 AUD including GST. That is the vehicle price only — freight is quoted separately against your delivery postcode rather than averaged into the advertised figure. You can split it into four interest-free payments with Finance in 4, or take 10% off the vehicle price by settling in Bitcoin or Tether.",
      },
      {
        q: "What battery does the MGI Zip X1 Lithium Buggy use?",
        a: "The MGI Zip X1 Lithium Buggy runs lithium rather than lead-acid, specified as Simple Speed Dial. Lithium removes the acid spills, terminal corrosion and fortnightly water topping that lead-acid demands, and it holds voltage more consistently through the discharge instead of fading toward the end of a round or a job.",
      },
      {
        q: "Will the MGI Zip X1 Lithium Buggy fit in my car boot?",
        a: "The MGI Zip X1 Lithium Buggy folds for transport, but measure before ordering rather than after. Check the usable space — width between the wheel arches at their narrowest, height under a closed boot lid, depth to the tailgate — and load a golf bag alongside during the check. Boot litre ratings are a poor guide, and hatchbacks and sedans differ far more than the numbers imply.",
      },
      {
        q: "What is included with the MGI Zip X1 Lithium Buggy?",
        a: "The MGI Zip X1 Lithium Buggy is supplied with Simple Speed Dial, Click & Go Lithium System and compact fold mechanism. It is inspected, charge-cycled and road tested at our Yatala QLD depot before dispatch, so nothing goes onto a transporter untested. Accessories and spares can be added to the same order, and buying them alongside a buggy earns the 5% bundle discount.",
      },
      {
        q: "Does the MGI Zip X1 Lithium Buggy come with an Australian warranty?",
        a: "Yes. The MGI Zip X1 Lithium Buggy carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Can you deliver the MGI Zip X1 Lithium Buggy anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The MGI Zip X1 Lithium Buggy travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
    ],
  },
  // 26 parts & accessories: 10 batteries/chargers, 16 accessories/spares
  {
    id: 'PART-001',
    slug: 'eco-battery-48v-105ah-lithium-conversion-kit',
    name: 'Eco Battery 48V 105Ah Lithium Conversion Kit',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Battery Part',
    price_aud: 3850,
    price_display: '$3,850 AUD',
    search_intent: 'High-Margin Replacement',
    target_audience: 'Golf cart owners upgrading from lead-acid to lithium',
    key_specs: 'Includes CAN-bus Charger, Digital Gauge, Mounting Bracket, Universal Harness',
    shortDescription: 'Complete drop-in lithium upgrade kit that eliminates 140kg of toxic lead-acid weight with an 8-year warranty.',
    fullDescription: "A complete drop-in conversion that removes roughly 140kg of lead-acid weight from an existing buggy and replaces it with a single lithium pack. That weight reduction is felt immediately in acceleration, hill climbing and range, because the motor is no longer hauling the battery bank around as dead mass. The kit is genuinely complete: CAN-bus charger, digital gauge, mounting bracket and universal harness are all included, so there is no parts-chasing partway through the job. It also ends acid spills, terminal corrosion and the fortnightly water topping that lead-acid maintenance demands. Backed by an 8-year warranty, this is the single upgrade that most transforms an ageing but otherwise sound golf buggy.",
    badge: 'Complete Kit',
    featured: true,
    images: ['/images/eco-battery-48v-105ah-lithium-conversion-kit.webp'],
    inStock: true,
    primaryKeyword: "eb eco battery golf cart",
    supportingKeywords: [
      "golf buggy battery lithium",
      "buggy spare parts",
      "electric golf trolley battery charger",
      "golf buggy battery charger",
      "golf trolley battery charger",
      "battery charger for golf buggy",
    ],
    faqs: [
      {
        q: "How much is the Eco Battery 48V 105Ah Lithium Conversion Kit?",
        a: "The Eco Battery 48V 105Ah Lithium Conversion Kit is $3,850 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Eco Battery 48V 105Ah Lithium Conversion Kit fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Eco Battery 48V 105Ah Lithium Conversion Kit is specified as Includes CAN-bus Charger. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Eco Battery 48V 105Ah Lithium Conversion Kit myself?",
        a: "Many owners fit the Eco Battery 48V 105Ah Lithium Conversion Kit at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Eco Battery 48V 105Ah Lithium Conversion Kit anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Eco Battery 48V 105Ah Lithium Conversion Kit travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Eco Battery 48V 105Ah Lithium Conversion Kit come with an Australian warranty?",
        a: "Yes. The Eco Battery 48V 105Ah Lithium Conversion Kit carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Eco Battery 48V 105Ah Lithium Conversion Kit in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Eco Battery 48V 105Ah Lithium Conversion Kit is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-002',
    slug: 'roypow-48v-105ah-lithium-battery-pack',
    name: 'RoyPow 48V 105Ah Golf Cart Lithium Battery Pack',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Battery Part',
    price_aud: 3600,
    price_display: '$3,600 AUD',
    search_intent: 'High Search Volume',
    target_audience: 'Club Car Precedent / EZGO RXV owners',
    key_specs: 'Drop-In Replacement, Built-in BMS, 5-Year Warranty, Thermal Protection',
    shortDescription: 'Automotive-grade LiFePO4 cells with smart Bluetooth BMS and integrated thermal freeze-prevention circuitry.',
    fullDescription: "Automotive-grade LiFePO4 cells and a smart Bluetooth BMS make this the straightforward drop-in replacement for a tired 48V lead-acid bank. The Bluetooth battery management system is the part owners appreciate most day to day: state of charge, cell balance and pack health are visible on a phone instead of inferred from how the buggy feels, which turns range anxiety into a number. Integrated thermal protection guards against charging in freezing conditions, a genuine consideration for alpine and inland properties where overnight temperatures drop well below what coastal buyers expect. LiFePO4 chemistry is the safest and longest-cycling of the common lithium types. Supplied with a 5-year warranty and dispatched from our Yatala QLD depot.",
    badge: 'LiFePO4 Grade',
    featured: false,
    images: ['/images/roypow-48v-105ah-lithium-battery-pack.webp'],
    inStock: true,
    primaryKeyword: "golf cart battery charger not working",
    supportingKeywords: [
      "how to check golf cart battery charger",
      "lithium battery charger for golf trolley",
      "golf cart parts and accessories",
      "golf cart spare parts",
      "golf cart parts and accessories near me",
      "golf cart spare parts australia",
    ],
    faqs: [
      {
        q: "How much is the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack?",
        a: "The RoyPow 48V 105Ah Golf Cart Lithium Battery Pack is $3,600 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The RoyPow 48V 105Ah Golf Cart Lithium Battery Pack is specified as Drop-In Replacement. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack myself?",
        a: "Many owners fit the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The RoyPow 48V 105Ah Golf Cart Lithium Battery Pack travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack come with an Australian warranty?",
        a: "Yes. The RoyPow 48V 105Ah Golf Cart Lithium Battery Pack carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the RoyPow 48V 105Ah Golf Cart Lithium Battery Pack is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-026',
    slug: 'roypow-72v-105ah-commercial-lithium-battery',
    name: 'RoyPow 72V 105Ah Commercial Lithium Battery Pack',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Battery Part',
    price_aud: 4700,
    price_display: '$4,700 AUD',
    search_intent: 'Commercial',
    target_audience: 'Resort fleets, security patrols and grounds teams running 72V vehicles',
    key_specs: '72V 105Ah, Drop-In Replacement, Built-in BMS, 5-Year Warranty, Thermal Protection',
    shortDescription: 'Commercial-duty 72V LiFePO4 pack with smart BMS and thermal protection, sized for full-shift resort and grounds work.',
    fullDescription: "The 72V version of the RoyPow drop-in pack, specified for commercial duty rather than private golf. Higher system voltage moves the same load at lower current, so the pack and cabling run cooler and hold performance through a full working shift instead of fading toward the end of it. That is why resort fleets, security patrols and grounds teams end up here rather than on a 48V pack. Automotive-grade LiFePO4 cells and a smart BMS report state of charge and pack health rather than leaving you to infer them from how the vehicle feels, and integrated thermal protection guards against charging in freezing conditions. Supplied with a 5-year warranty and dispatched from our Yatala QLD depot.",
    badge: '72V Commercial',
    featured: false,
    images: ['/images/roypow-72v-105ah-commercial-lithium-battery.webp'],
    inStock: true,
    primaryKeyword: "golf buggy battery",
    supportingKeywords: [
      "golf buggy battery replacement",
      "lithium battery golf buggy",
      "golf buggy battery replacement price",
      "electric golf buggy battery",
      "electric golf buggy lithium battery",
      "golf buggy battery life",
    ],
    faqs: [
      {
        q: "How much is the RoyPow 72V 105Ah Commercial Lithium Battery Pack?",
        a: "The RoyPow 72V 105Ah Commercial Lithium Battery Pack is $4,700 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the RoyPow 72V pack fit my golf buggy?",
        a: "Only if your vehicle is already a 72V system. A 72V pack is not a drop-in upgrade for a 48V buggy, because the controller, motor and charger are all matched to system voltage. Tell us the make, model and year before ordering and we will confirm from Yatala rather than let you find out after delivery.",
      },
      {
        q: "What is the difference between the 72V and 48V RoyPow packs?",
        a: "System voltage, and it is not an upgrade path between them. Higher voltage moves the same load at lower current, so the pack and cabling run cooler and hold performance through a long shift. That suits commercial duty. For a standard 48V golf buggy the 48V 105Ah pack is the correct part.",
      },
      {
        q: "Does the RoyPow 72V pack come with a warranty?",
        a: "Yes, a 5-year warranty, the same term as the RoyPow 48V pack, supported from our Yatala QLD depot rather than an overseas returns address. Because we hold stock in Australia a claim is handled locally. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Can I fit the RoyPow 72V pack myself?",
        a: "The pack is designed as a drop-in for an existing 72V system, and many commercial operators fit their own. Anything involving opening the pack belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can carry out the work.",
      },
      {
        q: "Do I need a different charger for a 72V lithium pack?",
        a: "Yes. A charger is matched to both system voltage and chemistry, so a 48V charger will not serve a 72V pack and a lead-acid charger is unsuitable for lithium regardless of voltage. Confirm your existing charger with us before ordering, because getting this wrong is a safety and longevity risk rather than a minor mismatch.",
      },
    ],
  },
  {
    id: 'PART-003',
    slug: 'invicta-48v-50ah-lithium-drop-in-module',
    name: 'Invicta 48V 50Ah Lithium Drop-in Module',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Battery Part',
    price_aud: 1850,
    price_display: '$1,850 AUD',
    search_intent: 'Transactional',
    target_audience: 'Compact or light-duty cart owners',
    key_specs: 'Parallel Expansion Capable, Integrated Bluetooth Monitoring',
    shortDescription: 'Compact modular lithium module allowing parallel linking for custom capacity expansions on light vehicles.',
    fullDescription: "A compact 50Ah module designed to be linked rather than bought oversized. Parallel expansion capability means you can start with the capacity a light vehicle actually needs and add a second module later if the duty changes, instead of paying upfront for range you may never use. That modularity also helps where physical space is tight and one large pack simply will not fit the existing battery tray. Integrated Bluetooth monitoring reports state of charge and pack health to a phone. For walk-behind buggies, light utility vehicles and custom builds where a standard 105Ah pack is more battery than the application warrants, this is the sensible building block.",
    badge: 'Bluetooth BMS',
    featured: false,
    images: ['/images/invicta-48v-50ah-lithium-drop-in-module.webp'],
    inStock: true,
    primaryKeyword: "golf buggy spare parts",
    supportingKeywords: [
      "golf trolley spare parts",
      "im4 golf buggy spare parts",
      "pilgrim golf buggy spare parts",
      "thomson golf buggy spare parts",
      "walkinshaw golf buggy spare parts",
      "walkinshaw golf buggy spare parts online",
    ],
    faqs: [
      {
        q: "How much is the Invicta 48V 50Ah Lithium Drop-in Module?",
        a: "The Invicta 48V 50Ah Lithium Drop-in Module is $1,850 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Invicta 48V 50Ah Lithium Drop-in Module fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Invicta 48V 50Ah Lithium Drop-in Module is specified as Parallel Expansion Capable. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Invicta 48V 50Ah Lithium Drop-in Module myself?",
        a: "Many owners fit the Invicta 48V 50Ah Lithium Drop-in Module at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Invicta 48V 50Ah Lithium Drop-in Module anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Invicta 48V 50Ah Lithium Drop-in Module travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Invicta 48V 50Ah Lithium Drop-in Module come with an Australian warranty?",
        a: "Yes. The Invicta 48V 50Ah Lithium Drop-in Module carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Invicta 48V 50Ah Lithium Drop-in Module in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Invicta 48V 50Ah Lithium Drop-in Module is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-004',
    slug: 'trojan-t-875-8v-deep-cycle-lead-acid-battery',
    name: 'Trojan T-875 8V Deep Cycle Lead Acid Battery',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Battery Part',
    price_aud: 340,
    price_display: '$340 AUD',
    search_intent: 'High Volume Replacements',
    target_audience: 'Fleet operators, standard golf carts',
    key_specs: '8V Deep Cycle, T2 Technology, High Capacity Grid Design',
    shortDescription: 'Genuine Trojan T-875 8-volt deep cycle battery engineered with Alpha Plus paste formulation for maximum fleet cycles.',
    fullDescription: "Genuine Trojan T-875s remain the benchmark for fleet operators who have deliberately stayed with lead-acid, and the reasoning is sound: low upfront cost per vehicle, familiar charging infrastructure and batteries that any technician can test and replace individually rather than as a sealed pack. Trojan's Alpha Plus paste formulation and T2 Technology target the plate degradation that ends most deep-cycle battery lives, delivering more usable cycles from the same footprint. The high-capacity grid design supports the deep discharge and recharge pattern that golf duty imposes daily. Clubs running larger fleets on established charging banks often find the economics still favour these. Held in stock at Yatala QLD.",
    badge: 'Genuine Trojan',
    featured: false,
    images: ['/images/trojan-t-875-8v-deep-cycle-lead-acid-battery.webp'],
    inStock: true,
    primaryKeyword: "lead acid battery for golf trolley",
    supportingKeywords: [
      "albatross golf buggy spare parts",
      "golf trolley battery chargers",
      "parmaker golf buggy spare parts",
      "golf buggy spare parts australia",
      "grasshopper golf buggy spare parts",
      "grasshopper golf buggy spare parts online",
    ],
    faqs: [
      {
        q: "How much is the Trojan T-875 8V Deep Cycle Lead Acid Battery?",
        a: "The Trojan T-875 8V Deep Cycle Lead Acid Battery is $340 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Trojan T-875 8V Deep Cycle Lead Acid Battery fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Trojan T-875 8V Deep Cycle Lead Acid Battery is specified as 8V Deep Cycle. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Trojan T-875 8V Deep Cycle Lead Acid Battery myself?",
        a: "Many owners fit the Trojan T-875 8V Deep Cycle Lead Acid Battery at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Trojan T-875 8V Deep Cycle Lead Acid Battery anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Trojan T-875 8V Deep Cycle Lead Acid Battery travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Trojan T-875 8V Deep Cycle Lead Acid Battery come with an Australian warranty?",
        a: "Yes. The Trojan T-875 8V Deep Cycle Lead Acid Battery carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Trojan T-875 8V Deep Cycle Lead Acid Battery in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Trojan T-875 8V Deep Cycle Lead Acid Battery is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-005',
    slug: 'delta-q-quiq-48v-smart-on-board-charger',
    name: 'Delta-Q QuiQ 48V Smart On-Board Charger',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Charger Part',
    price_aud: 680,
    price_display: '$680 AUD',
    search_intent: 'High Intent Repair',
    target_audience: 'E-Z-GO RXV / TXT owners needing charger replacement',
    key_specs: 'Multi-Profile Charging Algorithms, Weatherproof Sealed Enclosure',
    shortDescription: 'IP66 sealed weatherproof on-board charger featuring pre-loaded multi-profile charging algorithms for all battery chemistries.',
    fullDescription: "An IP66 sealed enclosure is the specification that matters for an on-board charger in Australia. On-board means the charger lives on the vehicle, so it endures wash-downs, rain, dust and the vibration of rough ground rather than sitting safe on a shelf, and IP66 rates it against powerful water jets and total dust ingress. The Delta-Q QuiQ also carries multiple pre-loaded charging algorithms, which lets one charger serve lead-acid, AGM and lithium packs correctly as a mixed fleet transitions rather than forcing a matched charger for each chemistry. Selecting the right profile matters: charging a battery on the wrong algorithm is the fastest way to shorten its life.",
    badge: 'IP66 Sealed',
    featured: false,
    images: ['/images/delta-q-quiq-48v-smart-on-board-charger.webp'],
    inStock: true,
    primaryKeyword: "on board golf cart charger",
    supportingKeywords: [
      "smart golf cart charger",
      "golf carts parts and accessories",
      "golf cart charger",
      "golf buggy parts",
      "golf buggy parts australia",
      "golf buggy charger",
    ],
    faqs: [
      {
        q: "How much is the Delta-Q QuiQ 48V Smart On-Board Charger?",
        a: "The Delta-Q QuiQ 48V Smart On-Board Charger is $680 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Delta-Q QuiQ 48V Smart On-Board Charger fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Delta-Q QuiQ 48V Smart On-Board Charger is specified as Multi-Profile Charging Algorithms. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Delta-Q QuiQ 48V Smart On-Board Charger myself?",
        a: "Many owners fit the Delta-Q QuiQ 48V Smart On-Board Charger at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Delta-Q QuiQ 48V Smart On-Board Charger anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Delta-Q QuiQ 48V Smart On-Board Charger travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Delta-Q QuiQ 48V Smart On-Board Charger come with an Australian warranty?",
        a: "Yes. The Delta-Q QuiQ 48V Smart On-Board Charger carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Delta-Q QuiQ 48V Smart On-Board Charger in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Delta-Q QuiQ 48V Smart On-Board Charger is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-006',
    slug: 'club-car-eric-48v-high-frequency-charger',
    name: 'Club Car ERIC 48V High-Frequency Charger',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Charger Part',
    price_aud: 590,
    price_display: '$590 AUD',
    search_intent: 'Brand Replacement',
    target_audience: 'Club Car Precedent & Tempo owners',
    key_specs: 'Automatic Voltage Compensation, Global AC Input Compatibility',
    shortDescription: 'OEM high-frequency intelligent battery charger with automatic voltage compensation and lightweight footprint.',
    fullDescription: "The genuine Club Car ERIC charger, built around high-frequency switching rather than the older transformer design. That is why it weighs a fraction of a conventional charger of the same output, which matters if it is carried between vehicles or lifted onto a bench regularly. Automatic voltage compensation adjusts for the supply it is given, so it charges correctly on a long extension lead or a rural supply that sags under load, situations where a fixed-output charger delivers an incomplete charge and slowly ruins the pack. Global AC input compatibility handles varying mains conditions. As OEM equipment it speaks to Club Car onboard systems natively. Stocked at our Yatala QLD depot.",
    badge: 'OEM Club Car',
    featured: false,
    images: ['/images/club-car-eric-48v-high-frequency-charger.webp'],
    inStock: true,
    primaryKeyword: "club car golf cart battery charger",
    supportingKeywords: [
      "battery charger for a club car golf cart",
      "club car golf cart parts and accessories",
      "golf cart parts club car accessories",
      "club car golf cart parts",
      "club car golf buggy parts",
      "club car buggy parts",
    ],
    faqs: [
      {
        q: "How much is the Club Car ERIC 48V High-Frequency Charger?",
        a: "The Club Car ERIC 48V High-Frequency Charger is $590 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Club Car ERIC 48V High-Frequency Charger fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Club Car ERIC 48V High-Frequency Charger is specified as Automatic Voltage Compensation. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Club Car ERIC 48V High-Frequency Charger myself?",
        a: "Many owners fit the Club Car ERIC 48V High-Frequency Charger at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Club Car ERIC 48V High-Frequency Charger anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Club Car ERIC 48V High-Frequency Charger travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Club Car ERIC 48V High-Frequency Charger come with an Australian warranty?",
        a: "Yes. The Club Car ERIC 48V High-Frequency Charger carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Club Car ERIC 48V High-Frequency Charger in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Club Car ERIC 48V High-Frequency Charger is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-007',
    slug: 'mgi-24v-lithium-battery-36-hole',
    name: 'MGI 24V Lithium Battery (24-Spindle / 36 Hole)',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Walk-Behind Battery',
    price_aud: 450,
    price_display: '$450 AUD',
    search_intent: 'High Volume Consumer Replacement',
    target_audience: 'Owners of MGI Zip & Ai Series buggies',
    key_specs: '24V 380Wh Capacity, Advanced BMS, Click & Go Design',
    shortDescription: 'Genuine replacement 36-hole lithium battery for all MGI Zip Navigator and Ai Series motorized buggies.',
    fullDescription: "The genuine MGI 36-hole replacement battery for Zip Navigator and Ai Series buggies. Walk-behind batteries are consumables: after a few seasons of weekly rounds the pack no longer finishes eighteen holes with margin, and the honest fix is replacement rather than nursing it. This is the factory 24V 380Wh unit with the correct advanced BMS, which matters because the BMS is what protects the cells and communicates correctly with the buggy's electronics. The Click & Go design means fitting is tool-free. Buying the genuine pack rather than an unbranded equivalent preserves both the buggy's warranty position and its charging behaviour. Held in Australian stock at Yatala QLD.",
    badge: 'Genuine MGI Part',
    featured: false,
    images: ['/images/mgi-24v-lithium-battery-36-hole.webp'],
    inStock: true,
    primaryKeyword: "mgi golf buggy lithium battery",
    supportingKeywords: [
      "mgi golf buggy battery charger",
      "mgi golf buggy spare parts australia",
      "mgi golf buggy spare parts",
      "mgi golf buggy spare parts australia price list",
      "mgi golf buggy spare parts australia online",
      "mgi golf buggy battery",
    ],
    faqs: [
      {
        q: "How much is the MGI 24V Lithium Battery (24-Spindle / 36 Hole)?",
        a: "The MGI 24V Lithium Battery (24-Spindle / 36 Hole) is $450 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the MGI 24V Lithium Battery (24-Spindle / 36 Hole) fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The MGI 24V Lithium Battery (24-Spindle / 36 Hole) is specified as 24V 380Wh Capacity. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the MGI 24V Lithium Battery (24-Spindle / 36 Hole) myself?",
        a: "Many owners fit the MGI 24V Lithium Battery (24-Spindle / 36 Hole) at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the MGI 24V Lithium Battery (24-Spindle / 36 Hole) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The MGI 24V Lithium Battery (24-Spindle / 36 Hole) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the MGI 24V Lithium Battery (24-Spindle / 36 Hole) come with an Australian warranty?",
        a: "Yes. The MGI 24V Lithium Battery (24-Spindle / 36 Hole) carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the MGI 24V Lithium Battery (24-Spindle / 36 Hole) in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the MGI 24V Lithium Battery (24-Spindle / 36 Hole) is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-008',
    slug: 'curtis-1268-400a-programmable-motor-controller',
    name: 'Curtis 1268 400A Programmable Motor Controller',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Electrical Component',
    price_aud: 890,
    price_display: '$890 AUD',
    search_intent: 'Performance Upgrade',
    target_audience: 'Lifted cart builders, performance tuners',
    key_specs: '400 Amp Peak Output, Regenerative Braking Control, Programmable Curves',
    shortDescription: 'Heavy-duty 400-amp programmable motor speed controller for lifted and high-torque cart conversions.',
    fullDescription: "The controller is the component that decides how much current reaches the motor, which makes it the real limit on a lifted or high-torque conversion. Fitting larger tyres and a lift kit increases the load on every hill, and a factory controller current-limits or overheats long before the motor does. The Curtis 1268 raises that ceiling to 400 amps peak and adds programmable acceleration and speed curves, so the buggy can be tuned for torque on steep acreage rather than left with a flat factory map. Regenerative braking control recovers energy on descents and adds engine-braking feel. A well-known industrial unit with parts and programming knowledge widely available in Australia.",
    badge: '400A Peak',
    featured: false,
    images: ['/images/curtis-1268-400a-programmable-motor-controller.webp'],
    inStock: true,
    primaryKeyword: "curtis controller golf cart",
    supportingKeywords: [
      "curtis golf cart controller",
      "golf cart curtis controller",
      "curtis controller for golf cart",
      "curtis controllers for golf carts",
      "curtis golf cart controllers",
      "curtis golf cart programmer",
    ],
    faqs: [
      {
        q: "How much is the Curtis 1268 400A Programmable Motor Controller?",
        a: "The Curtis 1268 400A Programmable Motor Controller is $890 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Curtis 1268 400A Programmable Motor Controller fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Curtis 1268 400A Programmable Motor Controller is specified as 400 Amp Peak Output. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Curtis 1268 400A Programmable Motor Controller myself?",
        a: "Many owners fit the Curtis 1268 400A Programmable Motor Controller at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Curtis 1268 400A Programmable Motor Controller anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Curtis 1268 400A Programmable Motor Controller travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Curtis 1268 400A Programmable Motor Controller come with an Australian warranty?",
        a: "Yes. The Curtis 1268 400A Programmable Motor Controller carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Curtis 1268 400A Programmable Motor Controller in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Curtis 1268 400A Programmable Motor Controller is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-009',
    slug: 'navitas-600a-ac-controller-upgrade-kit',
    name: 'Navitas 600A AC Controller Upgrade Kit',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Electrical Component',
    price_aud: 1450,
    price_display: '$1,450 AUD',
    search_intent: 'High Intent Performance',
    target_audience: 'Golfers needing speed (40+ km/h) & hill climbing torque',
    key_specs: 'Bluetooth On-the-Fly Lockout Control, Up to 600 Amps Output',
    shortDescription: 'Unleashes blistering 40+ km/h speeds and massive hill torque with on-the-fly dashboard adjustment dial.',
    fullDescription: "A 600-amp AC controller upgrade for owners who want a decisive change rather than a marginal one, delivering both substantially higher top speed and the hill torque that heavy lifted buggies demand. The feature that sets it apart is Bluetooth on-the-fly control: performance modes can be changed from a dashboard dial or a phone, so the same vehicle can run a restricted profile when guests, children or staff are driving and full output when you are. That lockout is a genuine safety consideration on a family property. AC drive also brings smoother power delivery and better regenerative braking than a DC system. Fitting is best handled by an experienced technician.",
    badge: '600A High Power',
    featured: true,
    images: ['/images/navitas-600a-ac-controller-upgrade-kit.webp'],
    inStock: true,
    primaryKeyword: "navitas golf cart controller",
    supportingKeywords: [
      "navitas golf cart parts",
      "navitas golf cart kit",
      "navitas golf cart controllers",
      "navitas golf cart motors",
      "navitas golf cart for sale",
      "golf cart controller upgrade",
    ],
    faqs: [
      {
        q: "How much is the Navitas 600A AC Controller Upgrade Kit?",
        a: "The Navitas 600A AC Controller Upgrade Kit is $1,450 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Navitas 600A AC Controller Upgrade Kit fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Navitas 600A AC Controller Upgrade Kit is specified as Bluetooth On-the-Fly Lockout Control. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Navitas 600A AC Controller Upgrade Kit myself?",
        a: "Many owners fit the Navitas 600A AC Controller Upgrade Kit at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Navitas 600A AC Controller Upgrade Kit anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Navitas 600A AC Controller Upgrade Kit travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Navitas 600A AC Controller Upgrade Kit come with an Australian warranty?",
        a: "Yes. The Navitas 600A AC Controller Upgrade Kit carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Navitas 600A AC Controller Upgrade Kit in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Navitas 600A AC Controller Upgrade Kit is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-010',
    slug: 'universal-48v-to-12v-30a-voltage-reducer',
    name: 'Universal 48V/36V to 12V 30A Voltage Reducer',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Electrical Component',
    price_aud: 85,
    price_display: '$85 AUD',
    search_intent: 'Accessory Install',
    target_audience: 'DIY cart builders adding lights, audio, or horns',
    key_specs: 'Key-Switch Triggered, Waterproof Cast Aluminum Housing',
    shortDescription: 'Step-down converter allowing safe 12V supply for LED lights, audio soundbars, and USB phone chargers.',
    fullDescription: "Every accessory worth adding to a golf buggy runs on 12V, and the pack does not. A voltage reducer is the correct way to bridge that gap: it steps 48V down to a clean, regulated 12V supply at up to 30 amps, which is enough headroom for an LED light kit, a soundbar and USB charging together. Tapping a single battery in the bank instead, which is the shortcut people take, unbalances the pack and shortens the life of every cell in it. Key-switch triggering means it powers down with the buggy rather than draining the pack overnight. Waterproof cast aluminium housing handles under-seat heat and moisture.",
    badge: 'Essential Upgrade',
    featured: false,
    images: ['/images/universal-48v-to-12v-30a-voltage-reducer.webp'],
    inStock: true,
    primaryKeyword: "golf carts and parts",
    supportingKeywords: [
      "buggies parts",
      "buggy parts near me",
      "chinese buggy parts",
      "condor golf buggy parts",
      "electric buggy parts",
      "electric golf buggy parts",
    ],
    faqs: [
      {
        q: "How much is the Universal 48V/36V to 12V 30A Voltage Reducer?",
        a: "The Universal 48V/36V to 12V 30A Voltage Reducer is $85 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Universal 48V/36V to 12V 30A Voltage Reducer fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Universal 48V/36V to 12V 30A Voltage Reducer is specified as Key-Switch Triggered. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Universal 48V/36V to 12V 30A Voltage Reducer myself?",
        a: "Many owners fit the Universal 48V/36V to 12V 30A Voltage Reducer at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Universal 48V/36V to 12V 30A Voltage Reducer anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Universal 48V/36V to 12V 30A Voltage Reducer travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Universal 48V/36V to 12V 30A Voltage Reducer come with an Australian warranty?",
        a: "Yes. The Universal 48V/36V to 12V 30A Voltage Reducer carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Universal 48V/36V to 12V 30A Voltage Reducer in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Universal 48V/36V to 12V 30A Voltage Reducer is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-011',
    slug: 'madjax-alpha-lux-street-legal-led-light-kit',
    name: 'MadJax Alpha Lux Street Legal LED Light Kit',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Accessories & Lighting',
    price_aud: 320,
    price_display: '$320 AUD',
    search_intent: 'Street-Legal Conversion',
    target_audience: 'Gated estate drivers driving at night',
    key_specs: 'Automotive Turn Signals, Hazard Lights, Horn, Brake Switch Included',
    shortDescription: 'High-intensity automotive LED projector headlights, sequential turn signals, brake switch, and mechanical horn.',
    fullDescription: "A complete lighting package rather than a pair of headlights, and that distinction matters if the buggy is used on private estate roads shared with vehicles. It includes automotive LED projector headlights, sequential turn signals, hazard lights, a brake switch and a mechanical horn, which together cover the signalling equipment normally expected for legitimate road use. Projector optics put light where it is needed with a defined cut-off rather than scattering glare at oncoming drivers. Note that conditional registration requirements differ by state, so confirm what your state requires before assuming a kit alone makes a buggy road legal. Supplied with mounting hardware and dispatched from Yatala QLD.",
    badge: 'Street Legal Spec',
    featured: false,
    images: ['/images/madjax-alpha-lux-street-legal-led-light-kit.webp'],
    inStock: true,
    primaryKeyword: "madjax golf cart parts",
    supportingKeywords: [
      "madjax golf cart accessories",
      "madjax golf cart",
      "madjax golf carts",
      "flashing battery light on golf cart",
      "electric golf trolley parts",
      "golf trolley parts",
    ],
    faqs: [
      {
        q: "How much is the MadJax Alpha Lux Street Legal LED Light Kit?",
        a: "The MadJax Alpha Lux Street Legal LED Light Kit is $320 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the MadJax Alpha Lux Street Legal LED Light Kit fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The MadJax Alpha Lux Street Legal LED Light Kit is specified as Automotive Turn Signals. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the MadJax Alpha Lux Street Legal LED Light Kit myself?",
        a: "Many owners fit the MadJax Alpha Lux Street Legal LED Light Kit at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the MadJax Alpha Lux Street Legal LED Light Kit anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The MadJax Alpha Lux Street Legal LED Light Kit travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the MadJax Alpha Lux Street Legal LED Light Kit come with an Australian warranty?",
        a: "Yes. The MadJax Alpha Lux Street Legal LED Light Kit carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the MadJax Alpha Lux Street Legal LED Light Kit in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the MadJax Alpha Lux Street Legal LED Light Kit is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-012',
    slug: 'heavy-duty-4-wheel-hydraulic-disc-brake-kit',
    name: 'Heavy Duty 4-Wheel Hydraulic Disc Brake Kit',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Mechanical Part',
    price_aud: 750,
    price_display: '$750 AUD',
    search_intent: 'Safety / Performance',
    target_audience: 'Heavy utility and fast lifted cart owners',
    key_specs: 'Dual-Piston Calipers, Stainless Steel Lines, Direct Bolt-On',
    shortDescription: 'Replaces weak factory rear drum brakes with automotive dual-piston hydraulic disc brakes on all four wheels.',
    fullDescription: "Factory rear drum brakes are the weakest point on most golf buggies, and they become genuinely inadequate once a lift kit, larger tyres, extra seats or a loaded cargo tray increase the mass being stopped. Drums also fade when hot and hold water after wet grass, which is precisely when you need them. This kit replaces all four corners with dual-piston hydraulic calipers on stainless steel lines, giving consistent, repeatable stopping that does not deteriorate down a long descent. Stainless lines resist the corrosion that causes soft pedal feel over time. Direct bolt-on fitment means no fabrication. If you have lifted a buggy, this is the upgrade to pair with it.",
    badge: '4-Wheel Hydraulic',
    featured: false,
    images: ['/images/heavy-duty-4-wheel-hydraulic-disc-brake-kit.webp'],
    inStock: true,
    primaryKeyword: "golf cart brake parts",
    supportingKeywords: [
      "4 wheel drive golf cart kit",
      "3 wheel golf buggy",
      "three wheel golf buggy",
      "three wheel golf cart",
      "3 wheel golf cart",
      "golf buggy 3 wheel",
    ],
    faqs: [
      {
        q: "How much is the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit?",
        a: "The Heavy Duty 4-Wheel Hydraulic Disc Brake Kit is $750 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Heavy Duty 4-Wheel Hydraulic Disc Brake Kit is specified as Dual-Piston Calipers. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit myself?",
        a: "Many owners fit the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Heavy Duty 4-Wheel Hydraulic Disc Brake Kit travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit come with an Australian warranty?",
        a: "Yes. The Heavy Duty 4-Wheel Hydraulic Disc Brake Kit carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Heavy Duty 4-Wheel Hydraulic Disc Brake Kit is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-013',
    slug: 'all-weather-heavy-duty-pvc-enclosure',
    name: 'All-Weather Heavy-Duty PVC Enclosure',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Accessories',
    price_aud: 290,
    price_display: '$290 AUD',
    search_intent: 'High Volume Accessory',
    target_audience: 'Golfers playing in rain, winter drivers',
    key_specs: 'Roll-Up Clear Vinyl Windows, Heavy Duty Zippers, Universal Fit Options',
    shortDescription: 'Heavy-duty 4-sided weather enclosure with crystal clear marine vinyl roll-up windows and reinforced brass eyelets.',
    fullDescription: "A four-sided enclosure turns a buggy into a usable vehicle through winter mornings, wet season downpours and dusty afternoons, which for most owners is the difference between using it year round and leaving it in the shed. The clear marine-grade vinyl windows roll up individually, so ventilation can be adjusted rather than being an all-or-nothing choice. Marine vinyl is specified because standard clear PVC yellows and cracks under Australian UV within a season or two. Heavy-duty zippers and reinforced brass eyelets are the components that usually fail first on cheap enclosures, which is exactly why they are upgraded here. Universal fit options cover most common two and four-seat models.",
    badge: 'All-Weather',
    featured: false,
    images: ['/images/all-weather-heavy-duty-pvc-enclosure.webp'],
    inStock: true,
    primaryKeyword: "proline golf buggy parts",
    supportingKeywords: [
      "prosimmon golf buggy parts",
      "rail buggy parts",
      "walkinshaw golf buggy parts",
      "golf carts parts",
      "cart golf parts",
      "golf cart golf cart parts",
    ],
    faqs: [
      {
        q: "How much is the All-Weather Heavy-Duty PVC Enclosure?",
        a: "The All-Weather Heavy-Duty PVC Enclosure is $290 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the All-Weather Heavy-Duty PVC Enclosure fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The All-Weather Heavy-Duty PVC Enclosure is specified as Roll-Up Clear Vinyl Windows. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the All-Weather Heavy-Duty PVC Enclosure myself?",
        a: "Many owners fit the All-Weather Heavy-Duty PVC Enclosure at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the All-Weather Heavy-Duty PVC Enclosure anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The All-Weather Heavy-Duty PVC Enclosure travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the All-Weather Heavy-Duty PVC Enclosure come with an Australian warranty?",
        a: "Yes. The All-Weather Heavy-Duty PVC Enclosure carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the All-Weather Heavy-Duty PVC Enclosure in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the All-Weather Heavy-Duty PVC Enclosure is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-014',
    slug: 'all-terrain-23x10-5-12-wheel-tyre-combo',
    name: 'All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4)',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Wheels & Tires',
    price_aud: 850,
    price_display: '$850 AUD',
    search_intent: 'Visual & Off-Road Upgrade',
    target_audience: 'Lifted cart owners, property buyers',
    key_specs: '12-inch Machined Alloy Rims, 6-ply Off-Road Tread, Includes Lug Nuts',
    shortDescription: 'Aggressive 23-inch 6-ply puncture-resistant tyres mounted on diamond-cut 12-inch aluminum alloy wheels.',
    fullDescription: "A matched wheel and tyre package, supplied mounted with lug nuts included, so there is no separate fitting exercise. The 6-ply construction is the specification that matters on rural property: standard golf tyres are built for turf and puncture readily on stubble, stones and stick, while a 6-ply carcass resists that. Twenty-three-inch diameter adds genuine ground clearance under the axle rather than just filling the arch, and the aggressive tread clears mud instead of packing with it. Diamond-cut 12-inch alloy rims handle the side loads of off-camber driving better than pressed steel. Pair with a lift kit for the intended geometry, and check clearance before fitting to an unlifted chassis.",
    badge: 'Set of 4 Rims & Tyres',
    featured: true,
    images: ['/images/all-terrain-23x10-5-12-wheel-tyre-combo.webp'],
    inStock: true,
    primaryKeyword: "all wheel drive golf cart",
    supportingKeywords: [
      "10 golf cart wheel and tire combo",
      "golf cart wheel and tire combo",
      "golf cart wheel set",
      "golf cart wheel tire combo",
      "golf three wheel trolley",
      "4 wheel golf buggy",
    ],
    faqs: [
      {
        q: "How much is the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4)?",
        a: "The All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) is $850 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) is specified as 12-inch Machined Alloy Rims. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) myself?",
        a: "Many owners fit the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) come with an Australian warranty?",
        a: "Yes. The All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the All-Terrain 23x10.5-12 Wheel & Tyre Combo (Set of 4) is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-015',
    slug: 'foldable-tinted-acrylic-windshield-system',
    name: 'Foldable Tinted Acrylic Windshield System',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Body Accessory',
    price_aud: 160,
    price_display: '$160 AUD',
    search_intent: 'Replacement / Upgrade',
    target_audience: 'Club Car, EZGO, and Yamaha owners',
    key_specs: 'High-Impact Acrylic, Snug Noise-Reduction Clips, UV Protection',
    shortDescription: 'Smoke tinted UV-blocking split windshield that folds down for refreshing summer breeze.',
    fullDescription: "A split windshield that folds down, which is the practical arrangement for Australian conditions: up for cold mornings, insects and rain, down for airflow on hot afternoons. Fixed windshields force you to choose once and live with it. High-impact acrylic resists the stone and stick strikes that shatter glass, and the smoke tint blocks UV, which matters as much for the driver as for the dashboard and seats that would otherwise fade and crack. Snug noise-reduction clips are a small detail that prevents the buzz and rattle that makes cheaper folding windshields irritating at speed. A straightforward comfort upgrade that is fitted in minutes.",
    badge: 'UV Tinted',
    featured: false,
    images: ['/images/foldable-tinted-acrylic-windshield-system.webp'],
    inStock: true,
    primaryKeyword: "golf cart windshield parts",
    supportingKeywords: [
      "golf cart windshield clips",
      "golf cart windshield rubber clips",
      "windshield hinge for golf cart",
      "golf trolley batteries and chargers",
      "golf buggy parts brisbane",
      "rail buggy parts catalog",
    ],
    faqs: [
      {
        q: "How much is the Foldable Tinted Acrylic Windshield System?",
        a: "The Foldable Tinted Acrylic Windshield System is $160 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Foldable Tinted Acrylic Windshield System fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Foldable Tinted Acrylic Windshield System is specified as High-Impact Acrylic. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Foldable Tinted Acrylic Windshield System myself?",
        a: "Many owners fit the Foldable Tinted Acrylic Windshield System at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Foldable Tinted Acrylic Windshield System anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Foldable Tinted Acrylic Windshield System travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Foldable Tinted Acrylic Windshield System come with an Australian warranty?",
        a: "Yes. The Foldable Tinted Acrylic Windshield System carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Foldable Tinted Acrylic Windshield System in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Foldable Tinted Acrylic Windshield System is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-016',
    slug: 'heavy-duty-solenoid-albright-48vdc-200a',
    name: 'Heavy Duty Solenoid Albright 48VDC 200A',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Electrical Maintenance',
    price_aud: 120,
    price_display: '$120 AUD',
    search_intent: 'Repair / Maintenance',
    target_audience: 'Carts experiencing ignition or starting issues',
    key_specs: 'Continuous Duty Rating, Silver Alloy Contacts',
    shortDescription: 'Industrial continuous duty Albright 48V solenoid with silver alloy contacts to handle high current spikes.',
    fullDescription: "The solenoid is the high-current switch between the battery pack and the motor, and it is a common failure point on buggies that have been upgraded or worked hard. Every start draws a current spike through its contacts, and a lightweight solenoid pits and welds under that duty until it either sticks closed or stops passing current. The Albright unit uses silver alloy contacts with a continuous duty rating, meaning it is built to stay energised for extended periods without overheating, rather than for intermittent switching. If your buggy clicks but will not move, or has started intermittently cutting out, this is the part to suspect. Industrial-grade and stocked at Yatala QLD.",
    badge: 'Continuous Duty',
    featured: false,
    images: ['/images/heavy-duty-solenoid-albright-48vdc-200a.webp'],
    inStock: true,
    primaryKeyword: "heavy duty solenoid for golf cart",
    supportingKeywords: [
      "36 volt golf cart solenoid",
      "48 volt golf cart solenoid",
      "electric golf cart bad solenoid symptoms",
      "golf cart solenoid location",
      "how does a golf cart solenoid work",
      "solenoid for golf cart",
    ],
    faqs: [
      {
        q: "How much is the Heavy Duty Solenoid Albright 48VDC 200A?",
        a: "The Heavy Duty Solenoid Albright 48VDC 200A is $120 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Heavy Duty Solenoid Albright 48VDC 200A fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Heavy Duty Solenoid Albright 48VDC 200A is specified as Continuous Duty Rating. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Heavy Duty Solenoid Albright 48VDC 200A myself?",
        a: "Many owners fit the Heavy Duty Solenoid Albright 48VDC 200A at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Heavy Duty Solenoid Albright 48VDC 200A anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Heavy Duty Solenoid Albright 48VDC 200A travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Heavy Duty Solenoid Albright 48VDC 200A come with an Australian warranty?",
        a: "Yes. The Heavy Duty Solenoid Albright 48VDC 200A carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Heavy Duty Solenoid Albright 48VDC 200A in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Heavy Duty Solenoid Albright 48VDC 200A is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-017',
    slug: 'replacement-mgi-ai-zip-remote-controller',
    name: 'Replacement MGI Ai & Zip Remote Controller Unit',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Walk-Behind Part',
    price_aud: 190,
    price_display: '$190 AUD',
    search_intent: 'High Intent Replacement',
    target_audience: 'MGI buggy owners who lost or damaged their remote',
    key_specs: 'Pre-programmed Pairing Capability, USB-C Rechargeable',
    shortDescription: 'Official replacement handheld directional remote control unit for MGI Zip Navigator and Ai Series buggies.',
    fullDescription: "The official replacement handheld remote for MGI Zip Navigator and Ai Series buggies. Remotes lead a hard life clipped to a bag or a belt through every round, and a cracked case, failed button or dead internal battery does not justify replacing an otherwise healthy buggy. This is the genuine unit with pre-programmed pairing capability, so it links to your buggy without a service visit. USB-C charging means it takes the same cable as everything else rather than a proprietary lead you will lose. Using the official remote rather than a generic substitute preserves correct pairing behaviour and directional response. Held in Australian stock and dispatched from Yatala QLD.",
    badge: 'Official MGI Remote',
    featured: false,
    images: ['/images/replacement-mgi-ai-zip-remote-controller.webp'],
    inStock: true,
    primaryKeyword: "mgi golf cart replacement parts",
    supportingKeywords: [
      "mgi golf cart battery replacement",
      "mgi buggy parts",
      "mgi golf buggy parts",
      "mgi golf buggy parts online",
      "mgi golf cart parts",
      "mgi golf buggy spares",
    ],
    faqs: [
      {
        q: "How much is the Replacement MGI Ai & Zip Remote Controller Unit?",
        a: "The Replacement MGI Ai & Zip Remote Controller Unit is $190 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Replacement MGI Ai & Zip Remote Controller Unit fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Replacement MGI Ai & Zip Remote Controller Unit is specified as Pre-programmed Pairing Capability. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Replacement MGI Ai & Zip Remote Controller Unit myself?",
        a: "Many owners fit the Replacement MGI Ai & Zip Remote Controller Unit at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Replacement MGI Ai & Zip Remote Controller Unit anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Replacement MGI Ai & Zip Remote Controller Unit travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Replacement MGI Ai & Zip Remote Controller Unit come with an Australian warranty?",
        a: "Yes. The Replacement MGI Ai & Zip Remote Controller Unit carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Replacement MGI Ai & Zip Remote Controller Unit in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Replacement MGI Ai & Zip Remote Controller Unit is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-018',
    slug: 'golf-cart-side-mirrors-integrated-led-indicators',
    name: 'Golf Cart Side Mirrors with Integrated LED Indicators',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Safety Accessory',
    price_aud: 95,
    price_display: '$95 AUD',
    search_intent: 'Safety Upgrade',
    target_audience: 'Road-registered or estate golf buggy users',
    key_specs: 'Convex Glass for Wide Angle View, Integrated LED Amber Indicators',
    shortDescription: 'Wide-angle convex mirrors with built-in amber LED turn signal indicators on mirror face.',
    fullDescription: "Convex glass gives a genuinely wide field of view, which matters more on a buggy than a car because there is no rear window, no pillar geometry to work around and passengers or cargo frequently block the view directly behind. Integrated amber LED indicators built into the mirror face put the turn signal where following drivers already look, rather than requiring separate indicator pods elsewhere on the body. That combination makes them a sensible pairing with a street-legal light kit if the buggy shares estate roads with vehicles. Straightforward to fit to standard strut positions, and supplied as a pair with mounting hardware.",
    badge: 'LED Turn Mirror',
    featured: false,
    images: ['/images/golf-cart-side-mirrors-integrated-led-indicators.webp'],
    inStock: true,
    primaryKeyword: "golf cart charger parts",
    supportingKeywords: [
      "golf cart parts accessories",
      "golf cart parts australia",
      "regar golf cart parts",
      "spare parts for golf trolleys",
      "golf cart for parts",
      "how to move a golf cart with dead batteries",
    ],
    faqs: [
      {
        q: "How much is the Golf Cart Side Mirrors with Integrated LED Indicators?",
        a: "The Golf Cart Side Mirrors with Integrated LED Indicators is $95 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Golf Cart Side Mirrors with Integrated LED Indicators fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Golf Cart Side Mirrors with Integrated LED Indicators is specified as Convex Glass for Wide Angle View. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Golf Cart Side Mirrors with Integrated LED Indicators myself?",
        a: "Many owners fit the Golf Cart Side Mirrors with Integrated LED Indicators at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Golf Cart Side Mirrors with Integrated LED Indicators anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Golf Cart Side Mirrors with Integrated LED Indicators travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Golf Cart Side Mirrors with Integrated LED Indicators come with an Australian warranty?",
        a: "Yes. The Golf Cart Side Mirrors with Integrated LED Indicators carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Golf Cart Side Mirrors with Integrated LED Indicators in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Golf Cart Side Mirrors with Integrated LED Indicators is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-019',
    slug: 'heavy-duty-rear-flip-seat-kit-2-to-4',
    name: 'Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater)',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Body Upgrade',
    price_aud: 650,
    price_display: '$650 AUD',
    search_intent: 'High Search Volume Conversion',
    target_audience: 'Owners wanting to expand 2-seater capacity to 4',
    key_specs: 'Folds Flat into Flatbed Cargo Tray, Powder-Coated Steel Frame',
    shortDescription: 'Transforms any standard 2-seater cart into a 4-passenger cruiser or a heavy flatbed cargo hauler.',
    fullDescription: "The most cost-effective way to add capacity to a buggy you already own. Rather than trading a two-seater for a four-seater, this kit converts it: rear-facing seating for two more passengers that folds flat into a cargo tray when you need to carry rather than seat. That dual purpose is why it suits property owners as much as families, since the same vehicle handles the school gate and the feed run. The powder-coated steel frame resists the corrosion that would otherwise start at every weld and bolt hole in coastal or irrigated conditions. Consider pairing it with a seatbelt set and upgraded brakes, since added passengers mean added mass to stop.",
    badge: '2-in-1 Conversion',
    featured: true,
    images: ['/images/heavy-duty-rear-flip-seat-kit-2-to-4.webp'],
    inStock: true,
    primaryKeyword: "golf cart rear flip seat",
    supportingKeywords: [
      "golf cart rear seat kit",
      "rear flip seat for golf cart",
      "rear golf cart seat kit",
      "rear seat golf cart kit",
      "golf cart rear seat cover",
      "golf cart rear seat covers",
    ],
    faqs: [
      {
        q: "How much is the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater)?",
        a: "The Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) is $650 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) is specified as Folds Flat into Flatbed Cargo Tray. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) myself?",
        a: "Many owners fit the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) come with an Australian warranty?",
        a: "Yes. The Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-020',
    slug: 'heavy-duty-tow-hitch-ball-assembly',
    name: 'Heavy Duty Tow Hitch & Ball Assembly',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Utility Accessory',
    price_aud: 110,
    price_display: '$110 AUD',
    search_intent: 'Utility / Farm Work',
    target_audience: 'Farm cart owners pulling trailers or mowers',
    key_specs: '2-inch Receiver, Powder Coated Steel, Mounting Hardware Included',
    shortDescription: 'Standard 2-inch hitch receiver with 50mm chrome tow ball for towing garden trailers and sprayers.',
    fullDescription: "A standard 2-inch receiver with a 50mm chrome ball, which are the common Australian sizes, so it accepts the garden trailers, box trailers and sprayers most properties already own rather than requiring anything bespoke. The receiver format also means the ball mount can be swapped for a different height or a pin-style attachment as needs change. Powder-coated steel handles the wet grass, fertiliser and mud that would rust bare steel quickly at the rear of a working vehicle. Mounting hardware is included. Remember that towing adds substantially to stopping distance, so it is worth reviewing brake condition before putting a loaded trailer behind a buggy.",
    badge: '50mm Tow Ball',
    featured: false,
    images: ['/images/heavy-duty-tow-hitch-ball-assembly.webp'],
    inStock: true,
    primaryKeyword: "thomson golf buggy parts",
    supportingKeywords: [
      "parmaker golf buggy parts",
      "1010 golf cart parts",
      "10l0l golf cart parts",
      "10lol golf cart parts",
      "1olol golf cart parts",
      "aftermarket golf cart parts",
    ],
    faqs: [
      {
        q: "How much is the Heavy Duty Tow Hitch & Ball Assembly?",
        a: "The Heavy Duty Tow Hitch & Ball Assembly is $110 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Heavy Duty Tow Hitch & Ball Assembly fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Heavy Duty Tow Hitch & Ball Assembly is specified as 2-inch Receiver. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Heavy Duty Tow Hitch & Ball Assembly myself?",
        a: "Many owners fit the Heavy Duty Tow Hitch & Ball Assembly at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Heavy Duty Tow Hitch & Ball Assembly anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Heavy Duty Tow Hitch & Ball Assembly travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Heavy Duty Tow Hitch & Ball Assembly come with an Australian warranty?",
        a: "Yes. The Heavy Duty Tow Hitch & Ball Assembly carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Heavy Duty Tow Hitch & Ball Assembly in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Heavy Duty Tow Hitch & Ball Assembly is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-021',
    slug: 'golf-cart-solar-charging-panel-expansion-kit',
    name: 'Golf Cart Solar Charging Panel Expansion Kit (175W)',
    category: 'Golf Buggy Batteries & Chargers',
    fuel_type: 'Solar Accessory',
    price_aud: 520,
    price_display: '$520 AUD',
    search_intent: 'High Intent Eco / Rural',
    target_audience: 'Acreage cart owners parked away from power',
    key_specs: 'Flexible Rooftop Panel, MPPT Charge Controller (36V/48V), Extends Daily Range by 20%',
    shortDescription: 'Aerodynamic flexible solar panel that mounts to cart roof to trickle charge your battery pack throughout sunny days.',
    fullDescription: "A flexible rooftop panel with an MPPT charge controller that trickle charges the pack whenever the buggy is parked in sun, extending daily range by around 20%. MPPT is the important part of that specification: it continuously finds the panel's maximum power point rather than passing raw output through, which is what allows a modest rooftop panel to contribute usefully instead of marginally. The practical benefit is greatest for vehicles that sit outdoors between short trips, which describes most resort, farm and estate duty. The flexible panel follows the roof contour and adds negligible weight or wind noise. Compatible with 36V and 48V systems.",
    badge: 'Solar Range Extender',
    featured: true,
    images: ['/images/golf-cart-solar-charging-panel-expansion-kit.webp'],
    inStock: true,
    primaryKeyword: "solar charging golf cart",
    supportingKeywords: [
      "golf cart parts",
      "brosnan golf buggy spare parts",
      "condor golf buggy spare parts",
      "electric golf buggy spare parts",
      "electric golf trolley spare parts",
      "elk golf buggy spare parts",
    ],
    faqs: [
      {
        q: "How much is the Golf Cart Solar Charging Panel Expansion Kit (175W)?",
        a: "The Golf Cart Solar Charging Panel Expansion Kit (175W) is $520 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Golf Cart Solar Charging Panel Expansion Kit (175W) fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Golf Cart Solar Charging Panel Expansion Kit (175W) is specified as Flexible Rooftop Panel. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Golf Cart Solar Charging Panel Expansion Kit (175W) myself?",
        a: "Many owners fit the Golf Cart Solar Charging Panel Expansion Kit (175W) at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Golf Cart Solar Charging Panel Expansion Kit (175W) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Golf Cart Solar Charging Panel Expansion Kit (175W) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Golf Cart Solar Charging Panel Expansion Kit (175W) come with an Australian warranty?",
        a: "Yes. The Golf Cart Solar Charging Panel Expansion Kit (175W) carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Golf Cart Solar Charging Panel Expansion Kit (175W) in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Golf Cart Solar Charging Panel Expansion Kit (175W) is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-022',
    slug: 'waterproof-marine-grade-bluetooth-soundbar',
    name: 'Waterproof Marine Grade Bluetooth Soundbar (26-inch)',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Audio Accessory',
    price_aud: 420,
    price_display: '$420 AUD',
    search_intent: 'High Margin Leisure',
    target_audience: 'Resort and lifestyle cart drivers',
    key_specs: 'IP67 Waterproof, Integrated RGB Lights, Direct Clamp to Roll Cage',
    shortDescription: 'High-output marine Bluetooth audio soundbar with deep bass radiators and integrated customizable accent lighting.',
    fullDescription: "Marine-grade IP67 construction is the right specification for a golf buggy, because the vehicle lives outdoors and gets rained on, hosed down and covered in dust regardless of intent. IP67 means fully protected against dust and capable of surviving temporary immersion, which comfortably covers weather and washing. Bass radiators produce genuine low end from a compact enclosure without the ported bulk that would not survive the vibration of rough ground. Integrated RGB accent lighting is customisable, and the direct clamp mount fits roll cages and roof struts without drilling. Pair it with a voltage reducer rather than tapping a single battery, which unbalances the pack.",
    badge: 'IP67 Marine Audio',
    featured: false,
    images: ['/images/waterproof-marine-grade-bluetooth-soundbar.webp'],
    inStock: true,
    primaryKeyword: "golf cart parts direct",
    supportingKeywords: [
      "amazon golf cart parts",
      "buggy parts australia",
      "carts and parts golf carts",
      "cheap golf cart parts",
      "chinese buggy parts australia",
      "condor golf cart parts",
    ],
    faqs: [
      {
        q: "How much is the Waterproof Marine Grade Bluetooth Soundbar (26-inch)?",
        a: "The Waterproof Marine Grade Bluetooth Soundbar (26-inch) is $420 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Waterproof Marine Grade Bluetooth Soundbar (26-inch) fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Waterproof Marine Grade Bluetooth Soundbar (26-inch) is specified as IP67 Waterproof. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Waterproof Marine Grade Bluetooth Soundbar (26-inch) myself?",
        a: "Many owners fit the Waterproof Marine Grade Bluetooth Soundbar (26-inch) at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Waterproof Marine Grade Bluetooth Soundbar (26-inch) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Waterproof Marine Grade Bluetooth Soundbar (26-inch) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Waterproof Marine Grade Bluetooth Soundbar (26-inch) come with an Australian warranty?",
        a: "Yes. The Waterproof Marine Grade Bluetooth Soundbar (26-inch) carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Waterproof Marine Grade Bluetooth Soundbar (26-inch) in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Waterproof Marine Grade Bluetooth Soundbar (26-inch) is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-023',
    slug: 'retractable-seatbelt-system-set',
    name: 'Retractable Seatbelt System Set (Front & Rear)',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Safety Accessory',
    price_aud: 145,
    price_display: '$145 AUD',
    search_intent: 'Safety Compliance',
    target_audience: 'Families with kids, estate road compliance',
    key_specs: '3-Point Lap & Shoulder Harness, Bracket Kit Included, E-Mark Certified',
    shortDescription: 'E-Mark certified automatic retractable 3-point seatbelt system with heavy-duty steel mounting brackets.',
    fullDescription: "E-Mark certification is the meaningful detail here: it means the harness has been tested and approved against a recognised international standard rather than simply resembling a seatbelt. For anyone carrying children, elderly passengers or driving on sloped or uneven ground, that distinction is worth insisting on. The three-point lap and shoulder configuration restrains the torso as well as the hips, which is what prevents the forward pitch that causes most buggy injuries. Automatic retraction keeps the belts out of the door aperture and off the ground when unused, so they stay clean and actually get worn. Heavy-duty steel mounting brackets are included, and the kit should be anchored to structural frame points.",
    badge: 'Safety Certified',
    featured: false,
    images: ['/images/retractable-seatbelt-system-set.webp'],
    inStock: true,
    primaryKeyword: "golf cart front end parts",
    supportingKeywords: [
      "golf cart front suspension parts",
      "golf cart rear bag cover",
      "ds golf cart parts",
      "eagle golf cart parts",
      "ebay golf cart parts",
      "ez golf cart parts",
    ],
    faqs: [
      {
        q: "How much is the Retractable Seatbelt System Set (Front & Rear)?",
        a: "The Retractable Seatbelt System Set (Front & Rear) is $145 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Retractable Seatbelt System Set (Front & Rear) fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Retractable Seatbelt System Set (Front & Rear) is specified as 3-Point Lap & Shoulder Harness. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Retractable Seatbelt System Set (Front & Rear) myself?",
        a: "Many owners fit the Retractable Seatbelt System Set (Front & Rear) at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Retractable Seatbelt System Set (Front & Rear) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Retractable Seatbelt System Set (Front & Rear) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Retractable Seatbelt System Set (Front & Rear) come with an Australian warranty?",
        a: "Yes. The Retractable Seatbelt System Set (Front & Rear) carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Retractable Seatbelt System Set (Front & Rear) in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Retractable Seatbelt System Set (Front & Rear) is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-024',
    slug: 'lockable-dash-glove-box-storage-system',
    name: 'Lockable Dash Glove Box Storage System',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Body Accessory',
    price_aud: 185,
    price_display: '$185 AUD',
    search_intent: 'Security Upgrade',
    target_audience: 'Golfers leaving valuables at the club or resort',
    key_specs: 'Carbon Fiber Finish, Dual Keys, Custom Fitted Molding for Popular Models',
    shortDescription: 'Secure locking dual glove box compartments with carbon fiber textured lids to safeguard smartphones and keys.',
    fullDescription: "Dual lockable compartments with a carbon-fibre textured finish, custom moulded to fit popular models rather than fixed on as a universal box. The value is straightforward: a golf buggy has no doors and no boot, so a phone, wallet or keys left on the seat are visible and available to anyone walking past while you play a hole or step into the clubhouse. A lockable compartment turns that from a risk into a non-issue. Two keys are supplied, which is worth noting since single-key accessories become a problem the moment the key is lost. It also stops loose items sliding off the dash through turns.",
    badge: 'Lockable Security',
    featured: false,
    images: ['/images/lockable-dash-glove-box-storage-system.webp'],
    inStock: true,
    primaryKeyword: "spare parts for golf buggies",
    supportingKeywords: [
      "spare parts for golf carts",
      "custom parts for golf carts",
      "parts for a golf cart",
      "custom golf cart parts",
      "golf cart parts for sale",
      "electric golf cart parts for sale",
    ],
    faqs: [
      {
        q: "How much is the Lockable Dash Glove Box Storage System?",
        a: "The Lockable Dash Glove Box Storage System is $185 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Lockable Dash Glove Box Storage System fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Lockable Dash Glove Box Storage System is specified as Carbon Fiber Finish. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Lockable Dash Glove Box Storage System myself?",
        a: "Many owners fit the Lockable Dash Glove Box Storage System at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Lockable Dash Glove Box Storage System anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Lockable Dash Glove Box Storage System travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Lockable Dash Glove Box Storage System come with an Australian warranty?",
        a: "Yes. The Lockable Dash Glove Box Storage System carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Lockable Dash Glove Box Storage System in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Lockable Dash Glove Box Storage System is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
  {
    id: 'PART-025',
    slug: 'heavy-duty-sand-bottle-assembly-dual-set',
    name: 'Heavy Duty Sand Bottle Assembly (Dual Set)',
    category: 'Golf Buggy Accessories & Spare Parts',
    fuel_type: 'Golf Accessory',
    price_aud: 75,
    price_display: '$75 AUD',
    search_intent: 'High Volume Replacement',
    target_audience: 'Private golf cart owners, course operators',
    key_specs: 'Rattle-Free Bracket Mounts, Easy-Pour Curved Neck Design',
    shortDescription: 'Curved neck easy-pour sand divot bottles with heavy-duty rattle-free side frame mounting brackets.',
    fullDescription: "A dual set of divot bottles with curved easy-pour necks and rattle-free bracket mounts. Repairing divots is basic course etiquette and most clubs expect it, but factory bottle mounts are notorious for rattling loose over a round until they are removed and left in the shed. The rattle-free bracket design is the entire point of upgrading: mounts that stay quiet and stay put get used, while ones that buzz constantly do not. The curved neck pours accurately into the divot rather than scattering sand across the surrounding turf, which is what makes the repair actually take. Supplied as a pair with side-frame mounting hardware.",
    badge: 'Course Essential',
    featured: false,
    images: ['/images/heavy-duty-sand-bottle-assembly-dual-set.webp'],
    inStock: true,
    primaryKeyword: "easy go golf cart parts",
    supportingKeywords: [
      "easy go golf carts parts",
      "fairplay golf cart parts",
      "g16 golf cart parts",
      "g22 golf cart parts",
      "g29 golf cart parts",
      "golf buggy parts online",
    ],
    faqs: [
      {
        q: "How much is the Heavy Duty Sand Bottle Assembly (Dual Set)?",
        a: "The Heavy Duty Sand Bottle Assembly (Dual Set) is $75 AUD including GST. Buy it alongside a buggy and the 5% accessory bundle discount applies. Freight is quoted against your delivery postcode, and every order is issued with a proper Australian tax invoice showing GST separately and our ABN 28 668 598 758.",
      },
      {
        q: "Will the Heavy Duty Sand Bottle Assembly (Dual Set) fit my golf buggy?",
        a: "Tell us the make, model and year of your buggy before ordering and we will confirm fitment from Yatala. The Heavy Duty Sand Bottle Assembly (Dual Set) is specified as Rattle-Free Bracket Mounts. Fitment varies more between models than most buyers expect, and a part that almost fits is a part you send back, so the two-minute check is worth it.",
      },
      {
        q: "Can I fit the Heavy Duty Sand Bottle Assembly (Dual Set) myself?",
        a: "Many owners fit the Heavy Duty Sand Bottle Assembly (Dual Set) at home, but the boundary matters. Anything involving opening a lithium pack, or replacing and programming a controller, belongs with a qualified technician. Stop immediately for any burning smell, a swollen or leaking battery, discoloured connectors, or a component too hot to touch. Our Yatala workshop can advise or carry out the work.",
      },
      {
        q: "Can you deliver the Heavy Duty Sand Bottle Assembly (Dual Set) anywhere in Australia?",
        a: "Yes. We deliver nationwide to every state and territory from our Yatala QLD 4207 depot, including regional addresses. The Heavy Duty Sand Bottle Assembly (Dual Set) travels in an enclosed, weather-sealed transporter rather than exposed on an open flatbed. Send us your delivery postcode and the freight cost is quoted with the vehicle rather than added later.",
      },
      {
        q: "Does the Heavy Duty Sand Bottle Assembly (Dual Set) come with an Australian warranty?",
        a: "Yes. The Heavy Duty Sand Bottle Assembly (Dual Set) carries an Australian factory warranty supported from our Yatala QLD depot, not an overseas returns address. Because we hold parts in Australia, a warranty claim is handled locally rather than becoming a shipping exercise. Keep your tax invoice, as it is the proof of purchase date.",
      },
      {
        q: "Is the Heavy Duty Sand Bottle Assembly (Dual Set) in stock at your Yatala depot?",
        a: "We hold stock at Yatala QLD 4207 rather than drop-shipping from overseas, which is why we can test a unit before it ships. Availability does move, so confirm the Heavy Duty Sand Bottle Assembly (Dual Set) is on the floor before you plan around a delivery date — call 0480 804 189 or use the chat and we will check it while you are on the line.",
      },
    ],
  },
];

export const FAQ = [
  {
    question: 'How do you deliver golf buggies and carts across regional Australia?',
    answer: 'We dispatch fully assembled and tested buggies from our Yatala QLD depot via specialized enclosed freight and tilt-tray carriers with direct delivery to residential estates, regional properties, and golf courses across QLD, NSW, VIC, SA, WA, and TAS.',
  },
  {
    question: 'How do lifted lithium buggies perform on steep slopes and wet paddocks?',
    answer: 'Our lifted lithium models (such as the Atlas HD and Evolution D-MAX) feature high-torque 350A/400A AC motors, 4-wheel hydraulic disc brakes, and wide all-terrain tyres that maintain superior traction on 25+ degree muddy inclines without slipping or losing power.',
  },
  {
    question: 'What is the real-world driving range of lithium golf buggies per charge?',
    answer: 'Equipped with 48V 105Ah to 110Ah lithium-ion battery packs, our 4-seater and utility buggies deliver between 65km to 90km of real-world driving range per full charge, requiring zero water maintenance and charging in just 2.5 to 4 hours.',
  },
  {
    question: 'How does ordering and enclosed freight delivery work across Australia?',
    answer: 'You can order online, over the phone, or via WhatsApp with our team. We issue an official Australian Tax Invoice and coordinate enclosed direct delivery across Australia with comprehensive pre-delivery inspection (we deliver directly to your property, business, or club).',
  },
  {
    question: 'What warranty is provided by Golf Buggies Express PTY LTD?',
    answer: 'Every new buggy includes our comprehensive Australian warranty covering chassis, motor, and controller, plus up to 5-8 years manufacturer warranty on lithium battery cells, fully backed by our Yatala QLD service center and mobile technicians.',
  },
  {
    question: 'Do you offer crypto discounts and flexible payment methods?',
    answer: 'Yes. We provide a 10% discount on orders settled via Bitcoin (BTC) or Tether (USDT). We also accept PayID / Osko for instant bank clearance, standard EFT, credit cards, and Finance in 4 interest-free installments.',
  },
  {
    question: 'How does the 5% accessory bundle discount work when purchasing with a buggy?',
    answer: 'When you purchase any accessories, battery upgrades, chargers, or weatherproof covers alongside a golf buggy, you receive an automatic 5% discount on all accessory items. This bundle discount applies across all payment methods including Finance in 4, PayID, credit cards, and bank transfer.',
  },
  {
    question: 'How does Finance in 4 work for buggies and accessories?',
    answer: 'Finance in 4 allows Australian buyers to split their order into 4 equal interest-free installments with 0% interest and instant pre-qualification. It is available on all models, parts, and accessories with flexible fortnightly or monthly schedules.',
  },
];

export const KEYWORDS = {
  primary: 'golf buggies for sale',
  primaryHubs: [
    'golf buggies for sale',
    'golf buggy for sale',
    'electric golf buggy for sale',
    'golf buggy australia',
    'golf push buggy',
  ],
  secondary: [
    'electric golf buggies for sale',
    'golf buggy electric',
    'motorised golf buggy for sale',
    'motorized golf buggy',
    'push golf buggy for sale',
    'remote control golf buggies',
    'remote control golf buggy for sale',
    'remote control golf buggy australia',
    'three wheel golf buggy',
    'foldable golf buggy',
    'folding golf buggy australia',
    'golf buggy sales',
    'electric golf buggy australia',
    'golf buggy accessories australia',
    'mgi golf buggy accessories',
    'golf buggy spares',
    'electric golf buggy parts',
    'second hand golf carts for sale',
    'best push golf buggy australia review',
    'golf trolley',
    '4 seater lifted golf cart australia',
    'electric utility buggy price',
    'lithium golf cart for acreage',
    'heavy duty off road golf buggy',
  ],
};
