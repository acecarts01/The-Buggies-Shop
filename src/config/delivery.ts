// src/config/delivery.ts - Metro delivery pages (/delivery/<slug>/).
//
// One entry per metro we freight to. Everything on a city page derives from
// here: route, metadata, H1, copy, FAQs, Service schema, sitemap entry, and
// the card on /delivery/. Server-only (imported by routes and the sitemap).
//
// These are DELIVERY pages, not local-presence pages. The business has one
// depot, at Yatala QLD 4207. Nothing here may imply a showroom, technician
// or stock in another city, and no transit time is promised: freight is
// quoted against the delivery postcode, so the copy says how it travels,
// not when it lands. Distances are road distances from Yatala, rounded.

export interface DeliveryMetro {
  slug: string;
  city: string;
  state: string;
  stateCode: 'QLD' | 'NSW' | 'VIC' | 'SA' | 'WA';
  /** Approximate road distance from the Yatala depot, km. */
  roadKm: number;
  /** How the vehicle travels for this destination. */
  freightMode: 'same-corridor' | 'interstate-enclosed';
  metaTitle: string;
  metaDescription: string;
  h1: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  /** Category slugs most relevant to this metro's typical buyers. */
  categories: string[];
}

export const DELIVERY_METROS: DeliveryMetro[] = [
  {
    slug: 'gold-coast',
    city: 'Gold Coast',
    state: 'Queensland',
    stateCode: 'QLD',
    roadKm: 35,
    freightMode: 'same-corridor',
    metaTitle: 'Golf Carts Gold Coast | Delivered from Yatala QLD',
    metaDescription:
      'Golf carts and buggies for the Gold Coast, delivered from our Yatala depot 35 km up the M1. Lithium 4-seaters and lifted acreage buggies, tested first.',
    h1: 'Golf Carts Gold Coast: Delivered from Our Yatala Depot',
    primaryKeyword: 'golf carts gold coast',
    supportingKeywords: [
      'golf carts for sale gold coast',
      'golf buggy gold coast',
      'golf buggies gold coast',
      'golf buggy for sale gold coast',
      'gold coast golf carts',
      'yamaha golf carts gold coast',
    ],
    intro:
      'The Gold Coast is our home corridor. Our depot at Yatala sits on the M1 roughly 35 km north of Southport, so a golf cart bought for a Gold Coast address is stored, tested and dispatched by the same people you speak to on the phone. No interstate transporter, no reseller in between.',
    sections: [
      {
        heading: 'What Gold Coast buyers tend to order',
        body: 'Canal-front and gated estates around Hope Island, Sanctuary Cove and Coomera are the natural home of the lithium 4-seater: quiet, no fuel, and sized for the run to the clubhouse or the marina. Acreage blocks in the hinterland behind the coast suit a lifted 4x4 with all-terrain tyres. Every model we list is held at Yatala, which is close enough that you can come and sit in one before deciding.',
      },
      {
        heading: 'How delivery to the Gold Coast works',
        body: 'Same-corridor delivery: the buggy is charged, road-tested and cleaned at Yatala, then carried down the M1 on an enclosed transporter or tilt-tray to your address. Freight is quoted against your postcode when you order, and the cart total is shown without it, so there is nothing added later. Vehicles priced at $15,000 AUD or more qualify for a complimentary on-site trial demonstration; ask the sales desk to book it.',
      },
      {
        heading: 'After delivery',
        body: 'Because the depot is on the same stretch of motorway, warranty, servicing, lithium battery upgrades and spare parts are handled from Yatala rather than shipped away. Batteries, chargers, tyres and accessories can be bundled with the vehicle at a 5% accessory discount and travel on the same truck.',
      },
    ],
    faqs: [
      {
        q: 'Do you deliver golf carts to the Gold Coast?',
        a: 'Yes. Our depot at Yatala QLD 4207 is about 35 km north of Southport on the M1, so the Gold Coast is a same-corridor delivery rather than an interstate freight leg. The buggy is tested at Yatala and carried to your address on an enclosed transporter or tilt-tray.',
      },
      {
        q: 'How much is delivery to a Gold Coast address?',
        a: 'Freight is quoted against your delivery postcode at checkout and shown separately from the vehicle price. There is no minimum order and no free-freight threshold; the quote covers the actual leg from Yatala to your street.',
      },
      {
        q: 'Can I see a golf cart before I buy?',
        a: 'Yes. Every model on this site is held at the Yatala depot, and Gold Coast buyers are close enough to visit. Vehicles priced at $15,000 AUD or more also qualify for a complimentary on-site trial demonstration at your property.',
      },
      {
        q: 'Which golf buggy suits a Gold Coast estate?',
        a: 'For gated and canal estates a lithium 4-seater is the usual choice: quiet, no fuel, and sized for the clubhouse and marina run. Check your estate bylaws and, for any gazetted road use, Queensland conditional registration rules with TMR before you order.',
      },
      {
        q: 'Do you stock Yamaha golf carts for the Gold Coast?',
        a: 'Yes. Yamaha, Club Car, E-Z-GO, Evolution and Atlas models are all stocked at Yatala and listed on the shop-by-brand pages with GST-inclusive prices.',
      },
      {
        q: 'Where is servicing done for a Gold Coast buggy?',
        a: 'At the Yatala depot, on the same motorway corridor. Warranty work, lithium conversions, chargers and spare parts are handled there rather than sent interstate.',
      },
    ],
    categories: ['luxury-4-seater', 'off-road-4x4', 'traditional-2-seater', 'walk-behind-buggies'],
  },
  {
    slug: 'brisbane',
    city: 'Brisbane',
    state: 'Queensland',
    stateCode: 'QLD',
    roadKm: 40,
    freightMode: 'same-corridor',
    metaTitle: 'Golf Carts for Sale QLD | Brisbane Delivery from Yatala',
    metaDescription:
      'Golf carts and buggies for sale in QLD, delivered to Brisbane and South East Queensland from our Yatala depot 40 km south of the CBD. GST-inclusive prices.',
    h1: 'Golf Carts for Sale in QLD: Brisbane Delivery from Yatala',
    primaryKeyword: 'golf carts for sale qld',
    supportingKeywords: [
      'golf buggy for sale qld',
      'golf buggies for sale qld',
      'qld golf carts',
      'golf buggies for sale brisbane',
      'north brisbane golf carts',
      'golf cart batteries brisbane',
    ],
    intro:
      'Brisbane is roughly 40 km up the M1 from our Yatala depot, which makes it a same-corridor delivery: the golf cart you order is the one we charged and road-tested that week, carried straight to your address without an interstate leg. Every model is held in Queensland and priced with GST included.',
    sections: [
      {
        heading: 'Brisbane and South East Queensland buyers',
        body: 'Acreage on the city fringe, from Samford and the Redlands down through Logan, is where the lifted 4x4 and commercial utility buggies earn their keep: hauling feed, tools and people over uneven ground without a diesel ute. Closer in, retirement villages, golf estates and the bayside suburbs favour the quieter lithium 2- and 4-seaters. North Brisbane, Ipswich and the Sunshine Coast are all on the same delivery run.',
      },
      {
        heading: 'Batteries, chargers and parts for Brisbane owners',
        body: 'If you already own a buggy, the depot supplies lithium conversion kits, deep-cycle lead-acid cells, smart on-board chargers, controllers, brake kits and tyres from stock, dispatched to Brisbane addresses on the same freight run as the vehicles. Fitting and lithium upgrades are done at Yatala.',
      },
      {
        heading: 'How delivery to Brisbane works',
        body: 'The buggy is tested and cleaned at Yatala, then delivered on an enclosed transporter or tilt-tray. Freight is quoted against your postcode at checkout and shown separately; there is no minimum order and no free-freight threshold. Vehicles priced at $15,000 AUD or more qualify for a complimentary on-site trial demonstration.',
      },
    ],
    faqs: [
      {
        q: 'Where in QLD are your golf carts for sale?',
        a: 'All stock is held at our depot in Yatala QLD 4207, about 40 km south of the Brisbane CBD on the M1. The catalogue on this site is that stock, priced with GST included, and we deliver anywhere in Queensland.',
      },
      {
        q: 'How much is delivery to Brisbane?',
        a: 'Freight is quoted against your delivery postcode at checkout and shown separately from the vehicle price. Brisbane and the surrounding council areas are a same-corridor run from Yatala rather than interstate freight.',
      },
      {
        q: 'Do you deliver golf buggies to north Brisbane and the Sunshine Coast?',
        a: 'Yes. North Brisbane, Moreton Bay, Ipswich and the Sunshine Coast are all serviced from Yatala by enclosed transporter or tilt-tray, quoted per postcode.',
      },
      {
        q: 'Can I buy golf cart batteries in Brisbane from you?',
        a: 'Yes. Lithium conversion kits, drop-in lithium modules, deep-cycle lead-acid cells and smart chargers are stocked at Yatala and dispatched to Brisbane addresses. Fitting and lithium upgrades are done at the depot.',
      },
      {
        q: 'Can I inspect a golf cart before buying?',
        a: 'Yes. Every model is at the Yatala depot and Brisbane buyers are close enough to visit. Vehicles priced at $15,000 AUD or more also qualify for a complimentary on-site trial demonstration.',
      },
      {
        q: 'Are your golf buggies road registrable in Queensland?',
        a: 'Some models can be conditionally registered for gazetted roads through Queensland TMR; the rules depend on the vehicle and the route. Tell us how you intend to use it and we will say plainly whether the model suits, but confirm the registration itself with TMR.',
      },
    ],
    categories: ['off-road-4x4', 'commercial-utility', 'luxury-4-seater', 'batteries-chargers'],
  },
  {
    slug: 'sydney',
    city: 'Sydney',
    state: 'New South Wales',
    stateCode: 'NSW',
    roadKm: 900,
    freightMode: 'interstate-enclosed',
    metaTitle: 'Golf Buggy for Sale Sydney | Enclosed Delivery to NSW',
    metaDescription:
      'Golf buggies for sale, delivered to Sydney and NSW in enclosed interstate freight from our Yatala QLD depot. Lithium 4-seaters, acreage 4x4s, GST included.',
    h1: 'Golf Buggy for Sale, Delivered to Sydney and NSW',
    primaryKeyword: 'golf buggy for sale sydney',
    supportingKeywords: [
      'golf buggies for sale sydney',
      'golf buggies sydney',
      'electric golf buggies sydney',
      'yamaha golf carts sydney',
      'petrol golf carts for sale sydney',
      'yamaha golf carts nsw',
    ],
    intro:
      'We deliver golf buggies to Sydney and across New South Wales from our Yatala depot in Queensland, roughly 900 km up the Pacific Motorway. The buggy travels in an enclosed transporter rather than exposed on a flatbed, and freight is quoted against your postcode before you commit.',
    sections: [
      {
        heading: 'What Sydney and NSW buyers order',
        body: 'Acreage in the Hills district, the Hawkesbury and the Southern Highlands suits a lifted 4x4 or a commercial utility buggy. Golf estates and retirement communities on the Central Coast and the Northern Beaches lean to the lithium 4-seater. For golfers who walk, the motorised walk-behind trolleys ship as a parcel at a fraction of vehicle freight. For properties without charging, the petrol EFI models from Yamaha and Club Car are stocked too.',
      },
      {
        heading: 'How interstate delivery to Sydney works',
        body: 'Every vehicle is charged, road-tested and cleaned at Yatala before it is loaded. It travels in an enclosed, weather-sealed transporter to your address; the freight leg is quoted against your delivery postcode at checkout and shown separately from the vehicle price. There is no minimum order and no free-freight threshold, and the price you see already includes GST.',
      },
      {
        heading: 'Registration and warranty from interstate',
        body: 'Conditional registration for gazetted roads in NSW is handled through Transport for NSW and depends on the model and the route; we will tell you honestly whether a vehicle is a candidate, but the registration itself is confirmed with the authority. Warranty and parts are supported from Yatala, with parts and batteries dispatched to NSW addresses.',
      },
    ],
    faqs: [
      {
        q: 'Do you deliver golf buggies to Sydney?',
        a: 'Yes. We freight to Sydney and all of New South Wales from our Yatala QLD depot in enclosed, weather-sealed transporters. Freight is quoted against your delivery postcode at checkout.',
      },
      {
        q: 'How much does delivery from Queensland to Sydney cost?',
        a: 'It depends on the vehicle and your postcode, so it is quoted per order and shown separately from the GST-inclusive vehicle price. There is no free-freight threshold and no minimum order.',
      },
      {
        q: 'Is the buggy tested before it is shipped interstate?',
        a: 'Yes. Every vehicle is charged, road-tested and cleaned at Yatala before loading. It is shipped ready to drive, not crated for assembly.',
      },
      {
        q: 'Do you sell electric golf buggies suitable for Sydney golf estates?',
        a: 'Yes. Lithium 2- and 4-seaters from Club Car, E-Z-GO, Evolution and Atlas are stocked at Yatala with GST-inclusive prices. Check your estate bylaws before ordering.',
      },
      {
        q: 'Do you have Yamaha golf carts for NSW?',
        a: 'Yes. Yamaha petrol EFI and electric models are stocked at Yatala and listed on the Yamaha brand page. They ship to NSW the same way as every other vehicle.',
      },
      {
        q: 'What about warranty and parts once the buggy is in NSW?',
        a: 'Warranty is supported from the Yatala depot. Batteries, chargers, controllers and spare parts are dispatched to NSW addresses, and we will tell you which items are owner-fit and which need a workshop.',
      },
    ],
    categories: ['luxury-4-seater', 'off-road-4x4', 'walk-behind-buggies', 'mechanical-petrol'],
  },
  {
    slug: 'melbourne',
    city: 'Melbourne',
    state: 'Victoria',
    stateCode: 'VIC',
    roadKm: 1750,
    freightMode: 'interstate-enclosed',
    metaTitle: 'Golf Cart for Sale Melbourne | Enclosed Delivery to VIC',
    metaDescription:
      'Golf carts for sale, delivered to Melbourne and Victoria in enclosed freight from our Yatala QLD depot. Lithium, petrol and utility models, GST included.',
    h1: 'Golf Cart for Sale, Delivered to Melbourne and Victoria',
    primaryKeyword: 'golf cart for sale melbourne',
    supportingKeywords: [
      'golf carts melbourne australia',
      'golf buggy for sale melbourne',
      'golf buggies for sale melbourne',
      'melbourne golf cars',
      'yamaha golf carts melbourne',
      'electric golf buggies melbourne',
    ],
    intro:
      'Melbourne is about 1,750 km from our Yatala depot, and we deliver there the same way we deliver everywhere: the golf cart is tested in Queensland, loaded into an enclosed transporter, and freighted to your Victorian address with the leg quoted against your postcode before you order.',
    sections: [
      {
        heading: 'What Melbourne and Victorian buyers order',
        body: 'Vineyards in the Yarra Valley and on the Mornington Peninsula use electric utility buggies for short-haul work between rows and sheds where a ute is too wide. Lifestyle acreage in the Macedon Ranges and Gippsland suits the lifted 4x4. Golf estates and retirement villages choose the lithium 4-seater for quiet, fuel-free runs. For golfers, the walk-behind electric trolleys travel as a parcel.',
      },
      {
        heading: 'How interstate delivery to Melbourne works',
        body: 'The vehicle is charged, road-tested and cleaned at Yatala, then travels enclosed and weather-sealed to your address. Freight is quoted against your delivery postcode at checkout and shown separately from the GST-inclusive vehicle price; there is no minimum order and no free-freight threshold. Batteries, chargers and accessories ordered with the vehicle travel on the same load at a 5% accessory discount.',
      },
      {
        heading: 'Cold-climate battery notes',
        body: 'Lithium packs hold their charge well through a Melbourne winter but should be stored above freezing and charged indoors where possible; lead-acid cells lose more capacity in the cold. If the buggy will live outside in the Dandenongs or Gippsland, tell us and we will suggest the pack and charger that suits, plus an all-weather enclosure.',
      },
    ],
    faqs: [
      {
        q: 'Do you deliver golf carts to Melbourne?',
        a: 'Yes. We freight to Melbourne and all of Victoria from our Yatala QLD depot in enclosed, weather-sealed transporters, with the freight leg quoted against your delivery postcode at checkout.',
      },
      {
        q: 'How much is golf cart delivery from Queensland to Melbourne?',
        a: 'It is quoted per order against your postcode and shown separately from the GST-inclusive vehicle price. There is no free-freight threshold and no minimum order.',
      },
      {
        q: 'Do you stock Yamaha golf carts for Melbourne buyers?',
        a: 'Yes. Yamaha, along with Club Car, E-Z-GO, Evolution and Atlas, is stocked at Yatala and listed on the brand pages with GST-inclusive prices. Every model ships to Victoria the same way.',
      },
      {
        q: 'Which buggy suits a Victorian vineyard or farm?',
        a: 'Electric utility buggies with a flatbed or drop-side tray for row work and sheds, or a lifted 4x4 for uneven acreage. Both are stocked at Yatala; tell us the terrain and the loads and we will say which fits.',
      },
      {
        q: 'Are electric golf buggies suitable for Melbourne winters?',
        a: 'Yes, with sensible storage. Lithium packs cope with the cold far better than lead-acid but should be charged indoors where possible and stored above freezing. We can pair the vehicle with an all-weather enclosure and the right charger.',
      },
      {
        q: 'Is the golf cart ready to drive when it arrives in Melbourne?',
        a: 'Yes. It is charged, road-tested and cleaned at Yatala before loading and arrives ready to drive, not crated for assembly.',
      },
    ],
    categories: ['commercial-utility', 'off-road-4x4', 'luxury-4-seater', 'walk-behind-buggies'],
  },
  {
    slug: 'adelaide',
    city: 'Adelaide',
    state: 'South Australia',
    stateCode: 'SA',
    roadKm: 2000,
    freightMode: 'interstate-enclosed',
    metaTitle: 'Golf Buggies Adelaide | Enclosed Delivery to South Australia',
    metaDescription:
      'Golf buggies delivered to Adelaide and South Australia in enclosed freight from our Yatala QLD depot. Electric, petrol and utility models, GST included.',
    h1: 'Golf Buggies for Adelaide and South Australia, Delivered from Yatala',
    primaryKeyword: 'golf buggies adelaide',
    supportingKeywords: [
      'golf cars adelaide',
      'electric golf buggies adelaide',
      'electric golf carts adelaide',
      'yamaha golf carts adelaide',
      'petrol golf cart for sale south australia',
    ],
    intro:
      'Adelaide is roughly 2,000 km from our Yatala depot. We freight there in enclosed transporters, with the vehicle tested in Queensland before it leaves and the freight leg quoted against your South Australian postcode before you order. Every price on this site includes GST.',
    sections: [
      {
        heading: 'What Adelaide and SA buyers order',
        body: 'Wine-region properties in the Barossa, McLaren Vale and the Adelaide Hills use electric utility buggies for short-haul work between rows, cellar door and sheds. Golf estates and retirement communities favour the lithium 4-seater. Petrol EFI models from Yamaha and Club Car suit properties without reliable charging, and the walk-behind trolleys ship as a parcel for golfers who walk.',
      },
      {
        heading: 'How interstate delivery to Adelaide works',
        body: 'The buggy is charged, road-tested and cleaned at Yatala, then travels enclosed and weather-sealed to your address. Freight is quoted against your delivery postcode at checkout and shown separately from the vehicle price; there is no minimum order and no free-freight threshold. Accessories ordered with the vehicle travel on the same load at a 5% discount.',
      },
      {
        heading: 'Heat, dust and batteries',
        body: 'South Australian summers are hard on lead-acid cells; lithium packs hold capacity better in heat and need no watering. For dusty properties, an all-weather enclosure and a set of all-terrain tyres are worth bundling with the vehicle. Tell us how the buggy will be used and we will spec it honestly.',
      },
    ],
    faqs: [
      {
        q: 'Do you deliver golf buggies to Adelaide?',
        a: 'Yes. We freight to Adelaide and all of South Australia from our Yatala QLD depot in enclosed, weather-sealed transporters, with freight quoted against your delivery postcode at checkout.',
      },
      {
        q: 'How much is delivery from Queensland to Adelaide?',
        a: 'It is quoted per order against your postcode and shown separately from the GST-inclusive vehicle price. There is no free-freight threshold and no minimum order.',
      },
      {
        q: 'Do you sell electric golf carts suitable for Adelaide heat?',
        a: 'Yes. Lithium models from Club Car, E-Z-GO, Evolution and Atlas hold capacity in heat better than lead-acid and need no watering. All are stocked at Yatala with GST-inclusive prices.',
      },
      {
        q: 'Can I get a petrol golf cart delivered to South Australia?',
        a: 'Yes. Yamaha and Club Car petrol EFI models are stocked at Yatala for properties without charging and ship to SA the same way as the electric range.',
      },
      {
        q: 'Is the buggy ready to drive on arrival in Adelaide?',
        a: 'Yes. It is charged, road-tested and cleaned at Yatala before loading and arrives ready to drive.',
      },
      {
        q: 'What about warranty and parts in South Australia?',
        a: 'Warranty is supported from the Yatala depot. Batteries, chargers, controllers and spare parts are dispatched to SA addresses; we will tell you which items are owner-fit and which need a workshop.',
      },
    ],
    categories: ['commercial-utility', 'luxury-4-seater', 'mechanical-petrol', 'walk-behind-buggies'],
  },
  {
    slug: 'perth',
    city: 'Perth',
    state: 'Western Australia',
    stateCode: 'WA',
    roadKm: 4300,
    freightMode: 'interstate-enclosed',
    metaTitle: 'Golf Buggy for Sale Perth | Enclosed Delivery to WA',
    metaDescription:
      'Golf buggies for sale, delivered to Perth and WA in enclosed freight from our Yatala QLD depot. Lithium, petrol and utility models with GST-inclusive prices.',
    h1: 'Golf Buggy for Sale, Delivered to Perth and Western Australia',
    primaryKeyword: 'golf buggy for sale perth',
    supportingKeywords: [
      'golf buggies perth',
      'electric golf buggy for sale perth',
      'golf cart perth',
      'electric golf buggies perth',
      'electric golf carts perth',
      'yamaha golf carts perth',
    ],
    intro:
      'Perth is the longest run we do, roughly 4,300 km from our Yatala depot. It is a real freight leg and we quote it honestly against your Western Australian postcode before you order, so you can weigh the delivered price against what is available locally. The buggy is tested in Queensland and travels enclosed the whole way.',
    sections: [
      {
        heading: 'What Perth and WA buyers order',
        body: 'Lifestyle acreage in the Swan Valley, the Perth Hills and the South West suits the lifted 4x4 and the electric utility buggies. Golf estates and retirement communities choose the lithium 4-seater. Petrol EFI models from Yamaha and Club Car are stocked for properties without charging, and the walk-behind electric trolleys travel as a parcel, which makes them the cheapest thing to freight west.',
      },
      {
        heading: 'How delivery to Perth works',
        body: 'The vehicle is charged, road-tested and cleaned at Yatala, then travels in an enclosed, weather-sealed transporter to your address. The freight leg is quoted against your delivery postcode at checkout and shown separately from the GST-inclusive vehicle price. There is no minimum order and no free-freight threshold; bundling batteries, chargers and accessories on the same load at the 5% accessory discount makes the leg work harder.',
      },
      {
        heading: 'Choosing a buggy for WA conditions',
        body: 'Heat and distance favour lithium: no watering, better capacity retention in summer, and a lighter vehicle to freight. For sandy or coastal properties, all-terrain tyres and an all-weather enclosure are worth specifying up front. Tell us the terrain and we will say plainly which model suits and what the delivered price is.',
      },
    ],
    faqs: [
      {
        q: 'Do you deliver golf buggies to Perth?',
        a: 'Yes. We freight to Perth and Western Australia from our Yatala QLD depot in enclosed, weather-sealed transporters. It is roughly a 4,300 km leg and it is quoted against your delivery postcode at checkout.',
      },
      {
        q: 'How much is delivery from Queensland to Perth?',
        a: 'It is quoted per order against your postcode and shown separately from the GST-inclusive vehicle price, so you can compare the delivered figure before committing. There is no free-freight threshold and no minimum order.',
      },
      {
        q: 'Do you sell electric golf buggies suitable for Perth heat?',
        a: 'Yes. Lithium models from Club Car, E-Z-GO, Evolution and Atlas hold capacity in heat better than lead-acid cells and need no watering. All are stocked at Yatala with GST-inclusive prices.',
      },
      {
        q: 'Do you stock Yamaha golf carts for Western Australia?',
        a: 'Yes. Yamaha petrol EFI and electric models are stocked at Yatala and listed on the Yamaha brand page. They ship to WA the same way as every other vehicle.',
      },
      {
        q: 'Is the buggy ready to drive when it arrives in Perth?',
        a: 'Yes. It is charged, road-tested and cleaned at Yatala before loading and arrives ready to drive, not crated for assembly.',
      },
      {
        q: 'What about warranty and parts in WA?',
        a: 'Warranty is supported from the Yatala depot. Batteries, chargers, controllers and spare parts are dispatched to WA addresses; we will tell you which items are owner-fit and which need a workshop.',
      },
    ],
    categories: ['off-road-4x4', 'luxury-4-seater', 'mechanical-petrol', 'walk-behind-buggies'],
  },
];

export function getDeliveryMetro(slug: string): DeliveryMetro | undefined {
  return DELIVERY_METROS.find((m) => m.slug === slug);
}
