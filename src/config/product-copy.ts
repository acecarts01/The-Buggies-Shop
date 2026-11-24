// src/config/product-copy.ts - hand-written product pages (Phase 4 of the SEO plan).
//
// One entry per product. The description is exactly 400 words: `intro` plus every
// section `body` (headings are not counted). scripts/product-copy-check.ts enforces
// the count, the primary keyword in the first 100 words, keyword density (primary
// at most 2%, secondaries at most 3% combined) and the FAQ rules.
//
// Facts come only from PRODUCTS (site.ts), the product's existing description and the
// brand rules (GST, freight quoted at checkout, minimum order, Pay in 4 over $3,000).
// Nothing here may claim a spec, award or test the catalogue does not hold.
//
// Server-only, like product-details.ts. Never import it from a 'use client' file.

import { PRODUCTS, isAccessoryItem } from './site';

export interface ProductCopy {
  primaryKeyword: string;
  supportingKeywords: string[];
  /** H1 (contains the primary keyword). */
  h1: string;
  /** <title>, primary keyword first, a buy-intent word, at most 62 characters. */
  seoTitle: string;
  /** Meta description, 110 to 160 characters, no "keyword:" prefix. */
  seoDescription: string;
  /** Answer-first opening paragraph, primary keyword inside the first 100 words. */
  intro: string;
  sections: { heading: string; body: string }[];
  /** When set, a standard "how to buy" section is appended (closingFor): short name and heading. */
  closingHeading?: string;
  short?: string;
  faqs: { q: string; a: string }[];
}

/**
 * The standard closing section: stock, freight, minimum order, trial and finance, worded for the
 * product's price and type so every claim is true for that product (trial from $15,000, Finance in 4
 * over $3,000, no warranty or fit claims the catalogue cannot back).
 */
export function closingFor(slug: string, short: string): string {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) throw new Error('closingFor: unknown slug ' + slug);
  const price = p.price_display.replace(' AUD', '');
  const part = isAccessoryItem(p.category, p.id, p.name);
  const pay = 'Pay by PayID, bank transfer or crypto, then send the receipt on WhatsApp so we can confirm your order in writing.';
  const terms = 'Prices include GST and freight is quoted against your delivery postcode at checkout. The minimum order is $250 AUD.';
  if (part) return `We supply the ${short} from our Yatala QLD depot. Send us your buggy's make, model and year and we will confirm the fit before you order. ${terms} ${p.price_aud > 3000 ? 'Finance in 4 is available on orders over $3,000. ' : ''}${pay}`;
  if (p.price_aud >= 15000) return `We supply the ${short} from our Yatala QLD depot with Australian warranty support and enclosed freight Australia-wide. At ${price} it qualifies for a complimentary on-farm trial demonstration. ${terms} Finance in 4 is available on orders over $3,000, and you can also pay by PayID, bank transfer or crypto.`;
  if (p.price_aud > 3000) return `We supply the ${short} from our Yatala QLD depot with Australian warranty support and enclosed freight Australia-wide. ${terms} Finance in 4 is available on orders over $3,000, and you can also pay by PayID, bank transfer or crypto, then send the receipt on WhatsApp.`;
  return `We supply the ${short} from our Yatala QLD depot with freight quoted to your postcode. ${terms} ${pay}`;
}

/** The description as it is published: intro, the written sections and, where set, the standard closing section. */
export function descriptionParts(slug: string): { intro: string; sections: { heading: string; body: string }[] } {
  const c = PRODUCT_COPY[slug];
  const sections = [...c.sections];
  if (c.closingHeading && c.short) sections.push({ heading: c.closingHeading, body: closingFor(slug, c.short) });
  return { intro: c.intro, sections };
}

export const PRODUCT_COPY: Record<string, ProductCopy> = {
  'yamaha-drive2-quiettech-efi-petrol': {
    primaryKeyword: 'yamaha petrol golf buggy for sale',
    supportingKeywords: ['yamaha golf cart for sale', 'yamaha golf cart australia', 'petrol golf carts', 'petrol golf buggies for sale', 'yamaha golf buggy'],
    h1: 'Yamaha Petrol Golf Buggy for Sale: Drive2 QuietTech EFI',
    seoTitle: 'Yamaha Petrol Golf Buggy for Sale: Buy Drive2 QuietTech',
    seoDescription: 'Shop the Yamaha petrol golf buggy for sale. Drive2 QuietTech EFI, $14,800 inc GST, in stock at Yatala QLD with enclosed freight Australia-wide.',
    intro:
      'Looking for a yamaha petrol golf buggy for sale in Australia? The Yamaha Drive2 QuietTech EFI Petrol is built to remove the one real objection to petrol, which is noise. It sounds close to an electric buggy while keeping unlimited range and one-minute refuelling. It is $14,800 AUD including GST and in stock at our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why choose a quiet petrol golf cart over electric?',
        body: 'Choose petrol when your daily distance is long or you do not want to plan around a charge cycle. Yamaha QuietTech engineering brings the Drive2 close enough to electric in sound that conversation at speed stays comfortable, while keeping the unlimited range and one-minute refuelling of petrol. Golfers and property owners who ruled out petrol because of engine drone can consider it again. High fuel efficiency keeps running costs sensible across long weekly distances, and there is no charger to install or battery to replace. Over a long day the difference is simple: you fill the tank and keep going all day.',
      },
      {
        heading: 'What makes the Drive2 comfortable on rough ground?',
        body: 'Fully independent rear suspension keeps rough turf and unsealed tracks from reaching the seat frame, so the ride stays composed over fairways, farm tracks and gravel paths. That matters on a buggy used for property work as much as for golf, where the surface changes from one corner of the block to the next. On a working property, that range of surfaces is normal rather than occasional. The engine uses electronic fuel injection, which is why this model sits in our petrol range beside the Club Car and E-Z-GO petrol buggies.',
      },
      {
        heading: 'Who is the Drive2 petrol golf buggy best suited to?',
        body: 'It suits golfers and property owners who want petrol range without the noise. If you cover long distances each week, run a large property, or simply prefer to refuel in a minute rather than wait on a charge, a petrol golf cart makes sense. Among petrol golf carts, the Drive2 is aimed at exactly those buyers: people who have been put off petrol by engine drone and want a quieter alternative that still goes all day.',
      },
      {
        heading: 'Where is a Yamaha golf cart for sale in Australia?',
        body: 'Buy the Drive2 direct from our Yatala QLD depot, with Australian parts and warranty support behind it. Prices include GST and freight is quoted against your delivery postcode at checkout. The minimum order is $250 AUD. Pay by PayID, bank transfer, Finance in 4 on orders over $3,000, or crypto, then send the receipt on WhatsApp. Compare the other petrol golf buggies for sale in our Mechanical and Petrol range before you decide.',
      },
    ],
    faqs: [
      { q: 'How much is a Yamaha petrol golf buggy for sale in Australia?', a: 'The Yamaha Drive2 QuietTech EFI Petrol is $14,800 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight, so you see the full cost before you commit to the order.' },
      { q: 'Is the Drive2 really quiet for a petrol golf cart?', a: 'QuietTech is Yamaha engineering aimed at engine noise. The Drive2 is built to sound close to electric, so conversation at speed stays comfortable, while keeping the unlimited range and one-minute refuelling that make petrol golf carts practical on large properties.' },
      { q: 'Can I buy this Yamaha golf cart in Australia with Finance in 4?', a: 'Yes. Orders over $3,000 AUD can use Finance in 4, split into four equal instalments at 0% interest, fortnightly or monthly. You can also pay by PayID, bank transfer or crypto. Every method ends with you sending the payment receipt on WhatsApp.' },
      { q: 'Where can I buy a Yamaha golf cart Australia wide, and how is it delivered?', a: 'We deliver Australia-wide by enclosed freight from our Yatala QLD depot. Freight is quoted against your delivery postcode at checkout, not averaged into the price, and the quote covers the actual leg from Yatala to your address.' },
      { q: 'Who is the Yamaha golf buggy Drive2 best suited to?', a: 'It suits golfers and property owners who want petrol range without the noise. Long weekly distances, large acreage and anyone who does not want to plan around charging are the typical buyers for petrol golf buggies for sale like this one.' },
      { q: 'Is there a warranty and are parts available in Australia?', a: 'Yes. We supply the Drive2 with Australian parts and warranty support from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top. Keep your tax invoice as proof of purchase for any claim.' },
    ],
  },

  'club-car-onward-4-passenger-lithium': {
    primaryKeyword: 'club car onward for sale',
    supportingKeywords: ['club car golf buggies for sale', 'club car golf carts', 'club car electric cart', '4 seater golf buggy for sale', 'lithium golf buggy'],
    h1: 'Club Car Onward for Sale: 4-Passenger Lithium Golf Buggy',
    seoTitle: 'Club Car Onward for Sale: Buy 4-Passenger Lithium',
    seoDescription: 'Shop the Club Car Onward for sale. 4-passenger lithium golf buggy with aluminium frame, $24,500 inc GST, from our Yatala QLD depot.',
    intro:
      'Searching for a club car onward for sale in Australia? The Club Car Onward 4-Passenger Lithium is a four-seat golf buggy built on an aircraft-grade aluminium frame, with an AC drive motor and zero-maintenance lithium power. It is $24,500 AUD including GST, supported from our Yatala QLD depot with genuine parts held in Australia.',
    sections: [
      {
        heading: 'Why does the aluminium frame matter on Club Car golf carts?',
        body: 'Aluminium does not rust. Coastal salt air and irrigated fairways cannot eat the chassis out from under the bodywork the way they can with steel-framed imports, which is why a well-kept Club Car holds its value years after a cheaper buggy has become a liability. The Onward adds a premium canopy top, ergonomic seating and custom metallic paint, so it suits a buggy that will be parked in front of the house as much as one used on the course. Paint and bodywork stay presentable because the frame underneath is not corroding. Coastal buyers notice this difference the most.',
      },
      {
        heading: 'What do the AC drive motor and lithium golf buggy battery change?',
        body: 'The AC drive motor delivers smooth, progressive power up village inclines rather than the surging feel of older DC systems. Lithium removes acid spills and water topping entirely, so ownership is simpler than with a lead-acid club car electric cart. It is a four-passenger layout, which makes it a practical 4 seater golf buggy for sale for families, estates and golf villages where two seats are never enough. Range and charging depend on how you drive, so tell us your daily distance and we will say whether one charge suits it.',
      },
      {
        heading: 'Who buys the Club Car Onward?',
        body: 'The Onward is the model buyers choose when resale value matters as much as the drive. Club Car brand loyalists and premium golf village residents are the typical owners, because the frame, motor and finish are the reasons a buggy like this keeps its price. Genuine Club Car parts are held in Australia rather than ordered in when something fails, which keeps repairs measured in days. If you are comparing it with an Evolution D5 Ranger or an E-Z-GO Express L6, ask us for a side-by-side before you commit.',
      },
      {
        heading: 'Can I see a Club Car before I buy?',
        body: 'Vehicles at $15,000 or more come with a complimentary on-farm trial demonstration, and the Onward qualifies. We supply it from Yatala QLD with an Australian factory warranty and nationwide enclosed freight, quoted against your postcode at checkout. Prices include GST, the minimum order is $250 AUD, and Finance in 4 is available on orders over $3,000. Ask the Yatala desk to arrange the trial before you order.',
      },
    ],
    faqs: [
      { q: 'How much is a Club Car Onward for sale in Australia?', a: 'The Club Car Onward 4-Passenger Lithium is $24,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight so there are no surprises.' },
      { q: 'Does the Club Car Onward come with a warranty in Australia?', a: 'Yes. It is supplied with an Australian factory warranty and supported from our Yatala QLD depot with genuine Club Car parts held in Australia. Australian Consumer Law guarantees apply on top, so keep your tax invoice.' },
      { q: 'Is a lithium Club Car electric cart better than lead-acid?', a: 'Lithium removes acid spills and water topping, so day-to-day ownership is simpler. The Onward uses zero-maintenance lithium with an AC drive motor for smooth, progressive power on inclines.' },
      { q: 'Can I pay for Club Car golf buggies for sale with crypto or Finance in 4?', a: 'Yes. Finance in 4 is available on orders over $3,000, and paying in crypto takes 10% off the vehicle price. PayID and bank transfer are also accepted, and every method ends with a WhatsApp receipt.' },
      { q: 'How many people does the Onward carry?', a: 'It is a four-passenger buggy with ergonomic seating and a premium canopy top, which suits families, estates and golf villages looking for a 4 seater golf buggy for sale.' },
      { q: 'Can I trial the Club Car Onward on my property?', a: 'Yes. Vehicles priced at $15,000 AUD or more include a complimentary on-farm trial demonstration. Ask the Yatala desk to arrange it before you order.' },
    ],
  },

  'roypow-48v-105ah-lithium-battery-pack': {
    primaryKeyword: 'electric golf buggy lithium battery',
    supportingKeywords: ['lithium battery for golf buggy', 'lithium golf buggy battery', 'golf buggy battery replacement', 'golf buggy battery lithium', 'golf buggy battery'],
    h1: 'Electric Golf Buggy Lithium Battery: RoyPow 48V 105Ah Pack',
    seoTitle: 'Electric Golf Buggy Lithium Battery: Buy RoyPow 48V 105Ah',
    seoDescription: 'Shop an electric golf buggy lithium battery. RoyPow 48V 105Ah drop-in pack with Bluetooth BMS and 5-year warranty, $3,600 inc GST.',
    intro:
      'Need an electric golf buggy lithium battery? The RoyPow 48V 105Ah pack is a drop-in replacement for a tired 48V lead-acid bank, built from automotive-grade LiFePO4 cells with a smart Bluetooth battery management system. It carries a 5-year warranty, is $3,600 AUD including GST and ships from our Yatala QLD depot.',
    sections: [
      {
        heading: 'What does the Bluetooth battery management system do?',
        body: 'The battery management system shows state of charge, cell balance and pack health on your phone, instead of leaving you to guess from how the buggy feels. That turns range anxiety into a number you can read before you leave the shed. It also protects the cells while the pack charges and discharges, which is why a lithium golf buggy battery like this is simple to live with once it is installed and left alone. Because the data is on your phone, you can check the pack before a long drive or after a week in storage.',
      },
      {
        heading: 'Is it a drop-in golf buggy battery replacement?',
        body: 'Yes. It is designed as a drop-in replacement for a tired 48V lead-acid bank and is aimed at Club Car Precedent and EZGO RXV owners. Check that your buggy is a 48V system before you order. Send us the make, model and year and we will confirm the fit from Yatala before you pay, so you do not buy a pack that will not suit your wiring or battery tray. Battery trays and wiring vary between models, which is why we check the fit for your buggy before you buy, not afterwards.',
      },
      {
        heading: 'Does a lithium battery for golf buggy use suit cold weather?',
        body: 'Integrated thermal protection guards against charging in freezing conditions, a real consideration for alpine and inland properties where overnight temperatures fall well below what coastal buyers expect. The cells are automotive-grade LiFePO4, a lithium chemistry chosen for safety and long cycle life. Prices include GST and freight is quoted to your postcode at checkout, with a minimum order of $250 AUD. That protection is built into the pack, so you do not need to remember a cold-weather routine.',
      },
      {
        heading: 'Why buy lithium instead of another lead-acid bank?',
        body: 'A lead-acid bank needs watering and eventually replacing, and its performance falls as it ages. Lithium removes the topping-up and holds steadier power across the charge. The pack carries a 5-year warranty and ships from our Yatala QLD depot. At $3,600 it is over the $3,000 Finance in 4 minimum, so you can spread the cost in four interest-free payments. Tell us the buggy and how far you drive, and we will confirm lithium is the right upgrade before you spend $3,600.',
      },
    ],
    faqs: [
      { q: 'How much is an electric golf buggy lithium battery like the RoyPow 48V 105Ah?', a: 'The RoyPow 48V 105Ah Golf Cart Lithium Battery Pack is $3,600 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Will this lithium battery for a golf buggy fit my buggy?', a: 'It is a 48V drop-in replacement and suits Club Car Precedent and EZGO RXV owners. Send us your make, model and year and we will confirm the fit from Yatala before you order and pay.' },
      { q: 'What warranty comes with a golf buggy battery lithium pack like this?', a: 'It carries a 5-year warranty. Australian Consumer Law guarantees apply on top, so keep your tax invoice as proof of the purchase date.' },
      { q: 'Does it work in cold weather?', a: 'It has integrated thermal protection against charging in freezing conditions, which matters for alpine and inland properties where nights can be very cold.' },
      { q: 'Can I pay for this golf buggy battery replacement with Finance in 4?', a: 'Yes. At $3,600 it is over the $3,000 Finance in 4 minimum, so you can split it into four interest-free instalments. PayID, bank transfer and crypto are also accepted.' },
      { q: 'Do I need a new charger with a lithium pack?', a: 'Lithium packs are charged with a charger matched to them. Tell us your current charger and we will confirm whether it suits, or recommend one from our chargers range.' },
    ],
  },

  'mgi-zip-navigator': {
    primaryKeyword: 'mgi zip navigator',
    supportingKeywords: ['mgi zip navigator remote control', 'mgi remote control', 'electric golf buggy with remote control', 'remote control golf buggy australia', 'mgi navigator'],
    h1: 'MGI Zip Navigator: Remote Control Golf Buggy',
    seoTitle: 'MGI Zip Navigator: Buy Remote Control Golf Buggy',
    seoDescription: 'Buy the MGI Zip Navigator remote control golf buggy with gyroscope straight tracker and downhill speed control, $2,285 inc GST, Yatala QLD.',
    intro:
      'The MGI Zip Navigator is a remote control golf buggy for golfers who want to walk without pushing. Put the bag on, walk wherever suits your round and steer the buggy from the remote. It has full directional remote control, a Gyroscope Straight Tracker and downhill speed control. It is $2,285 AUD including GST, from Yatala QLD.',
    sections: [
      {
        heading: 'How does MGI Zip Navigator remote control work?',
        body: 'Full directional remote control means you do not have to touch the handle. The Gyroscope Straight Tracker keeps the buggy on line across cambered ground that would pull a basic buggy off course, and downhill speed control stops it running away from you on slopes. Together they make an electric golf buggy with remote control that stays predictable on hilly courses, so you can concentrate on the shot instead of the trolley. If a remote is ever lost or damaged, a replacement MGI remote is available from us in Australian stock.',
      },
      {
        heading: 'Which MGI remote control model suits my course?',
        body: 'The matte grey and black finish and gloss top box give it a modern look. The all-terrain version is listed separately, and the choice between them comes down to the ground you play on. The Zip range suits cart bags, and not every stand or carry bag fits, so tell us your bag before you order. We confirm the fit before you pay, rather than after the buggy arrives. The Ai Navigator range adds GPS and costs a little more.',
      },
      {
        heading: 'Who is the Zip Navigator for?',
        body: 'It is for golfers who want full directional remote control without moving up to a GPS model. You still get the straight tracking and downhill control that make a motorised walk-behind buggy worth owning, in a Zip-series buggy that shares batteries and chargers with the rest of the Zip range, which keeps spares simple. If you want GPS on the screen, look at the MGI Ai Navigator range instead. If you want the remote and the straight tracking at a lower price, the Zip Navigator is the MGI navigator to choose.',
      },
      {
        heading: 'Where can I buy a remote control golf buggy in Australia?',
        body: 'Buy from our Yatala QLD depot, where MGI batteries, remotes and accessories are held in Australian stock. Prices include GST and freight is quoted to your delivery postcode at checkout. The minimum order is $250 AUD. Pay by PayID, bank transfer or crypto, then send the receipt or a screenshot on WhatsApp so we can confirm your order in writing. Spares such as lithium batteries and chargers are listed on our site, so you can complete the order in one go.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Zip Navigator remote control golf buggy?', a: 'The MGI Zip Navigator is $2,285 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What is the difference between the Zip Navigator and the all-terrain version?', a: 'Both are remote control Zip buggies. The all-terrain version is listed separately, and the choice comes down to the ground you play on. Tell us your course and we will recommend one.' },
      { q: 'Does an MGI remote control golf buggy stay on line on sloping fairways?', a: 'The Gyroscope Straight Tracker keeps the buggy on line across cambered ground, and downhill speed control stops it running away from you on slopes.' },
      { q: 'Will my golf bag fit the MGI Zip Navigator?', a: 'The Zip range suits cart bags, and not every stand or carry bag fits. Send us the bag you use and we will confirm before you order.' },
      { q: 'Can I buy a spare remote or battery later?', a: 'Yes. MGI batteries, chargers, remotes and accessories are held in Australian stock at our Yatala QLD depot, so a worn consumable does not mean replacing the whole buggy.' },
      { q: 'How do I buy a remote control golf buggy Australia wide, and pay?', a: 'Pay by PayID, bank transfer or crypto. Every method ends with you sending the payment receipt or a screenshot on WhatsApp, and we confirm your order in writing.' },
    ],
  },

  'atlas-4-passenger-lifted-lithium-buggy': {
    primaryKeyword: 'atlas golf carts for sale',
    supportingKeywords: ['atlas golf carts price', 'atlas golf carts australia', 'lifted golf cart for sale', 'lithium golf buggy', '4 seater golf buggy for sale'],
    h1: 'Atlas Golf Buggy for Sale: 4-Passenger Lifted Lithium',
    seoTitle: 'Atlas Golf Carts for Sale: Buy 4-Passenger Lifted Lithium',
    seoDescription: 'Shop Atlas golf carts for sale. 4-passenger lifted lithium buggy with 3-inch factory lift, $20,900 inc GST, from Yatala QLD with enclosed freight.',
    short: 'Atlas',
    closingHeading: 'Can I try an Atlas before I order?',
    intro:
      'Looking for atlas golf carts for sale in Australia? The Atlas 4-Passenger Lifted Lithium Buggy is our flagship for acreage estates and gated communities. It pairs quiet 48V lithium power with a 3-inch factory lift, 14-inch alloy wheels and custom leather seating. It is $20,900 AUD including GST, in stock at our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a lifted lithium golf buggy suit acreage?',
        body: 'The three-inch factory lift and 14-inch alloy wheels raise the floor clear of rutted driveways, garden edging and unsealed estate tracks that bottom out a standard-height golf buggy. Whisper-quiet 48V lithium power means four adults travel without fumes, engine noise or the weekly water-topping that lead-acid buggies demand. That combination is why a lithium golf buggy like this suits large properties, gated estates and anywhere the surface changes from sealed to rough within a few hundred metres. Extra clearance is the practical difference, and it matters most on driveways that collect ruts after heavy rain.',
      },
      {
        heading: 'What does the cabin feel like?',
        body: 'Custom leather seating and a touchscreen display keep the cabin closer to a car than a course buggy. It is a true 4-passenger layout, so it works as a family or guest vehicle as well as a property runabout. Look at this model when comfort matters as much as capability, and when you want a buggy that looks right parked in front of the house rather than hidden away in the shed. Four adults sit comfortably, and the cabin stays quiet because there is no engine, which makes conversation easy.',
      },
      {
        heading: 'Who buys the Atlas Lifted Lithium?',
        body: 'It is aimed at gated estates, luxury property owners and resort operators who want rough-terrain capability without giving up refinement. If you are comparing atlas golf carts price against other lifted models, remember that the lift, the alloy wheels, the leather seating and the touchscreen are all included in the $20,900 price rather than being extras to add later. That keeps the real cost of ownership easy to understand from the first day. If you are unsure whether lifted or standard height suits your ground, tell us about the property and we will advise.',
      },
    ],
    faqs: [
      { q: 'How much are Atlas golf carts for sale in Australia?', a: 'The Atlas 4-Passenger Lifted Lithium Buggy is $20,900 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight, so you see the full cost first.' },
      { q: 'What is the Atlas golf carts price compared with other lifted models?', a: 'At $20,900 it includes the 3-inch factory lift, 14-inch alloy wheels, custom leather seats and touchscreen display. Compare it side by side with the other lifted models in our off-road range before you decide.' },
      { q: 'Where can I buy Atlas golf carts Australia wide?', a: 'We supply the Atlas from our Yatala QLD depot and deliver Australia-wide by enclosed freight. Vehicles priced at $15,000 AUD or more also include a complimentary on-farm trial demonstration.' },
      { q: 'Is this a lifted golf cart for sale with lithium power?', a: 'Yes. It combines a 3-inch factory lift with a high-density 48V lithium battery, so it handles rough estate tracks without engine noise, fumes or water-topping.' },
      { q: 'How many people does it carry?', a: 'Four passengers, with premium leather seating. That makes it a practical 4 seater golf buggy for sale for families, guests and resort use.' },
      { q: 'How is the Atlas delivered and paid for?', a: 'It is freighted enclosed from Yatala QLD to any Australian address. Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price.' },
    ],
  },

  'evolution-d5-ranger-4-plus-2': {
    primaryKeyword: 'evolution d5 golf cart for sale',
    supportingKeywords: ['evolution golf carts australia', 'evolution golf cart', '6 seater golf buggy for sale', 'electric 6 seater golf cart', 'electric golf buggy for sale'],
    h1: 'Evolution D5 Golf Buggy for Sale: Ranger 4+2 Plus',
    seoTitle: 'Evolution D5 Golf Cart for Sale: Buy the Ranger 4+2 Plus',
    seoDescription: 'Shop the Evolution D5 golf cart for sale. Ranger 4+2 Plus 6-passenger lithium buggy, $22,500 inc GST, in stock at Yatala QLD.',
    short: 'D5 Ranger',
    closingHeading: 'Is this electric golf buggy for sale supplied in Australia?',
    intro:
      'Searching for an evolution d5 golf cart for sale? The Evolution D5 Ranger 4+2 Plus carries six passengers in forward-facing seats, with a 110Ah lithium battery, a nine-inch touchscreen and a Bluetooth soundbar. It is the largest-capacity model in our luxury range, $22,500 AUD including GST, and in stock at our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why choose a 6 seater golf buggy for a family?',
        body: 'Six passengers across two rows means a full family or a group of guests travels without a second trip. Forward-facing seating in both rows keeps conversation natural and nobody rides backwards over rough ground, which matters on long estate driveways and resort transfers. It is the largest-capacity model in our luxury range, yet it still drives with the quiet, low-effort manners of a lithium buggy, with no fumes and no engine noise to spoil the trip. That makes it the practical answer for households that have outgrown a four-seater.',
      },
      {
        heading: 'What are the Evolution golf carts known for?',
        body: 'A 110Ah lithium pack supplies the range for a full day of running. The nine-inch touchscreen, Bluetooth soundbar and foldable windshield make the D5 as suited to a summer afternoon around the property as to eighteen holes. Evolution golf cart buyers tend to want a vehicle that feels modern, and the screen-forward cabin delivers that from the moment you sit in it, in a way older buggies simply cannot. It is a feature set you would normally expect in a car, delivered in a buggy that runs quietly all day.',
      },
      {
        heading: 'Who is the D5 Ranger for?',
        body: 'High net-worth families and lifestyle acreage owners are the typical buyers. Families choosing a buggy as a genuine second vehicle tend to land here, because it carries the whole household in one go. If you move fewer people, other models in our luxury range may suit you better, so tell us how many passengers you carry and how far, and we will recommend the right size for the way you use it. Ask for a demonstration if you want to see how six passengers sit before you decide. Questions are welcome before you buy, not just after. Questions are welcome.',
      },
    ],
    faqs: [
      { q: 'How much is an Evolution D5 golf cart for sale in Australia?', a: 'The Evolution D5 Ranger 4+2 Plus is $22,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'How many passengers does the D5 Ranger carry?', a: 'Six, with forward-facing seating in both rows. It is the largest-capacity model in our luxury range, so a family or a group of guests can travel in one trip.' },
      { q: 'Who supports Evolution golf carts Australia wide?', a: 'Yes. We supply the D5 Ranger from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'What battery does the electric 6 seater golf cart use?', a: 'A 110Ah lithium pack, which supplies the range for a full day of running. Lithium also removes acid spills and water topping.' },
      { q: 'Is this a 6 seater golf buggy for sale with a touchscreen?', a: 'Yes. It has a nine-inch touchscreen, a Bluetooth soundbar, a foldable windshield and forward-facing seats in both rows.' },
      { q: 'Can I trial it and pay with crypto or Finance in 4?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial, Finance in 4 is available over $3,000, and paying in crypto takes 10% off the vehicle price.' },
    ],
  },

  'tara-roadster-2-plus-2-lifted': {
    primaryKeyword: 'tara golf carts price',
    supportingKeywords: ['tara golf carts', 'tara golf cart price', 'lifted golf cart for sale', '2 seater golf buggy for sale', 'lifted golf carts'],
    h1: 'Tara Golf Buggy Price: Roadster 2+2 Lifted Lithium',
    seoTitle: 'Tara Golf Carts Price: Buy the Roadster 2+2 Lifted',
    seoDescription: 'See Tara golf carts price and buy the Roadster 2+2 Lifted. Lithium buggy with hydraulic disc brakes, $18,990 inc GST, from Yatala QLD.',
    short: 'Roadster 2+2',
    closingHeading: 'How is the Roadster supplied?',
    intro:
      'Comparing tara golf carts price against other lifted buggies? The Tara Roadster 2+2 Lifted is the value entry into lifted four-seat lithium buggies, at $18,990 AUD including GST. It earns that position with hardware rather than trim: hydraulic disc brakes, a lifted chassis, a full LED package and a rear flip seat.',
    sections: [
      {
        heading: 'Why do hydraulic disc brakes matter on a lifted buggy?',
        body: 'Hydraulic disc brakes on a lifted chassis give you genuine stopping control on sloped semi-rural driveways, where drum brakes fade and feel vague under load. That matters more on a lifted golf cart than a standard one, because the extra ground clearance goes hand in hand with steeper, rougher ground. It is the main reason this model stands out at its price, and the feature most owners mention first. Better braking also helps when the buggy is loaded with passengers or cargo, which is when drum brakes are most likely to feel vague.',
      },
      {
        heading: 'How does the rear flip seat work on lifted golf carts?',
        body: 'The rear flip seat converts from passenger bench to flat cargo deck in seconds. The same buggy carries the family down to the gate in the morning and mulch, feed or tools in the afternoon. That dual-purpose flexibility is what lifestyle blocks need, and it is why many buyers searching for a lifted golf cart for sale end up choosing a 2+2 layout instead of a plain four-seater. It also means one vehicle can do the work of a buggy and a small utility on a lifestyle block.',
      },
      {
        heading: 'Is the Tara Roadster good for semi-rural properties?',
        body: 'A full LED light package keeps it usable at dusk on unlit property tracks. For lifestyle blocks and semi-rural acreage that need ground clearance and dual-purpose flexibility without a luxury price tag, this is the most sensible buy in the range. Budget-luxury buyers are the typical owners, and the price reflects that, with lithium power and no water topping or acid to manage. If you are weighing it against a standard-height four-seater, tell us about your driveway and we will advise which suits. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide.',
      },
    ],
    faqs: [
      { q: 'What is the Tara golf carts price for the Roadster 2+2 Lifted?', a: 'The Tara Roadster 2+2 Lifted is $18,990 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What do Tara golf carts include at this price?', a: 'Hydraulic disc brakes, a lifted chassis, a lithium battery, a full LED light package and a rear flip seat that converts to a flatbed.' },
      { q: 'Can the rear seat carry cargo?', a: 'Yes. The rear flip seat converts from a passenger bench to a flat cargo deck in seconds, so the buggy carries passengers or mulch, feed and tools.' },
      { q: 'Is it a lifted golf cart for sale with disc brakes?', a: 'Yes. Hydraulic disc brakes give better stopping control than drum brakes on sloped semi-rural driveways, especially under load.' },
      { q: 'Does it suit a 2 seater golf buggy for sale search?', a: 'It is a 2+2 layout: two seats up front and a rear flip seat that carries two more or folds flat for cargo.' },
      { q: 'What is the Tara golf cart price if I pay with crypto?', a: 'Paying in crypto takes 10% off the vehicle price. Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, with enclosed freight quoted to your postcode.' },
    ],
  },

  'ezgo-express-l6-lithium': {
    primaryKeyword: 'ezgo express l6 for sale',
    supportingKeywords: ['ez go golf cart for sale', 'e-z-go golf buggy', '6 seater golf buggy for sale', 'electric 6 seater golf cart', 'ez go golf cart accessories'],
    h1: 'EZGO Express L6 for Sale: 6 Seater Lithium Golf Buggy',
    seoTitle: 'EZGO Express L6 for Sale: Buy the 6-Passenger Lithium',
    seoDescription: 'Shop the EZGO Express L6 for sale. 6-passenger ELiTE lithium transporter, $27,900 inc GST, supplied from Yatala QLD with Australian warranty.',
    short: 'Express L6',
    closingHeading: 'How is the Express L6 supplied?',
    intro:
      'Need an ezgo express l6 for sale? The E-Z-GO Express L6 Lithium seats six on a single chassis, powered by ELiTE lithium technology with Samsung SDI cells. It is the natural choice for resorts, holiday parks and large estates that move groups rather than pairs. It is $27,900 AUD including GST and in stock at Yatala QLD.',
    sections: [
      {
        heading: 'Why choose a 6 seater golf buggy for a resort?',
        body: 'High ground clearance and heavy-duty suspension let it cross gravel service roads and grassed overflow areas without shaking guests loose. ELiTE lithium means no fumes, no engine noise and no daily battery maintenance for the staff running it. For commercial venues that is the whole argument: a petrol shuttle needs fuel handling, servicing and somewhere to idle away from guests, while a lithium shuttle simply plugs in overnight and is ready the next morning. Heavy-duty suspension also protects the chassis over years of service on unsealed roads.',
      },
      {
        heading: 'What makes this e-z-go golf buggy different?',
        body: 'The Express L6 uses ELiTE lithium technology with Samsung SDI cells, so power delivery stays consistent across the charge instead of fading as lead-acid does. Anyone running a busy site benefits most from that consistency, because a shuttle that slows late in the day frustrates guests and staff alike, and a slow fleet means more vehicles to cover the same demand. Fewer slow vehicles means fewer vehicles needed.',
      },
      {
        heading: 'Who uses the Express L6?',
        body: 'Resort transport teams, large family estates and commercial venues are the typical operators. The six-passenger layout means fewer trips and fewer vehicles for the same guest numbers. Tell us how many people you move and how far, and we will confirm the L6 is the right size, or recommend a smaller model from our luxury range if six seats is more than you need for everyday use. Staff also train quickly on it, because lithium power removes the fuel and battery routines. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is the EZGO Express L6 for sale in Australia?', a: 'The E-Z-GO Express L6 Lithium is $27,900 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'How many passengers does the Express L6 carry?', a: 'Six, on a single chassis. That makes it a practical 6 seater golf buggy for sale for resorts, holiday parks and large estates.' },
      { q: 'What battery does this electric 6 seater golf cart use?', a: 'ELiTE lithium technology with Samsung SDI cells, which means no fumes, no engine noise and no daily battery maintenance.' },
      { q: 'Can I buy an EZ GO golf cart for sale with Australian warranty?', a: 'Yes. The Express L6 is supplied with Australian warranty support from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Can I get EZ GO golf cart accessories with it?', a: 'Ask the Yatala desk. We list accessories and parts across our range and can confirm what suits the Express L6 before you order.' },
      { q: 'Can I pay with crypto or Finance in 4?', a: 'Yes. Finance in 4 is available on orders over $3,000, and paying in crypto takes 10% off the vehicle price. PayID and bank transfer are also accepted.' },
    ],
  },

  'lvtong-4-seater-resort-cruiser': {
    primaryKeyword: 'resort buggy for sale',
    supportingKeywords: ['lvtong golf carts', 'lvtong golf cart price', 'lvtong golf cart for sale', 'lvtong buggy', 'electric motorized golf carts'],
    h1: 'Resort Buggy for Sale: LVTONG 4-Seater Resort Cruiser',
    seoTitle: 'Resort Buggy for Sale: Buy the LVTONG 4-Seater Cruiser',
    seoDescription: 'Shop a resort buggy for sale. LVTONG 4-Seater Resort Cruiser with 4kW AC motor and lithium pack, $16,800 inc GST, from Yatala QLD.',
    short: 'Resort Cruiser',
    closingHeading: 'How is the Resort Cruiser supplied?',
    intro:
      'Operators looking for a resort buggy for sale usually want a dependable fleet vehicle. The LVTONG 4-Seater Resort Cruiser pairs a 4kW AC motor with a maintenance-free lithium pack and an on-board charger. It is a proven workhorse across Australian caravan parks and resorts, $16,800 AUD including GST, and in stock at Yatala QLD.',
    sections: [
      {
        heading: 'Why do resorts specify the LVTONG Resort Cruiser?',
        body: 'It is specified by operators who count running cost per year rather than features per brochure. The 4kW AC motor pulls four adults and luggage up park inclines without straining, and the maintenance-free lithium pack removes the labour of watering and equalising a lead-acid bank. For hotels, holiday parks and community centres running a small fleet, that means dependable all-day duty with low maintenance overheads and fewer breakdowns. Operators who run several units also value having one charging routine for the whole fleet.',
      },
      {
        heading: 'What does the on-board charger change?',
        body: 'The on-board charger means any standard outlet becomes a charging point without extra infrastructure, so there is no separate charging station to build or maintain. A heavy-duty bumper takes the knocks that shared-use vehicles inevitably collect from bollards, kerbs and gateposts, which keeps the body presentable for guests. Both details suit a buggy bought for shared use rather than for one careful owner. Guests step into a clean vehicle, and staff spend their time on service rather than repairs.',
      },
      {
        heading: 'Is the LVTONG golf cart price right for a small fleet?',
        body: 'At $16,800 the Resort Cruiser sits below the premium four-seat models while keeping the features operators need: a strong AC motor, lithium power, an on-board charger and a rugged bumper. That is why it is a common choice when buying several units, and why an lvtong golf cart for sale is often compared against pricier brands by park managers working to a budget. Ask about fleet pricing if you are buying more than one unit. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Questions are welcome before you buy, not just after.',
      },
    ],
    faqs: [
      { q: 'How much is a resort buggy for sale like the LVTONG Resort Cruiser?', a: 'The LVTONG 4-Seater Resort Cruiser is $16,800 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What is the LVTONG golf cart price for fleet orders?', a: 'The single-unit price is $16,800. For several units, ask our wholesale and fleet desk, which can quote combined freight and pricing.' },
      { q: 'Is this LVTONG golf cart for sale suitable for holiday parks?', a: 'Yes. It is specified for caravan parks and resorts, with a 4kW AC motor, lithium power, an on-board charger and a heavy-duty bumper.' },
      { q: 'Does the LVTONG buggy need a special charger?', a: 'No. The on-board charger means any standard outlet becomes a charging point, so no extra infrastructure is needed.' },
      { q: 'Are LVTONG golf carts like this electric motorized golf carts?', a: 'Yes. It uses a 4kW AC electric motor and a maintenance-free lithium battery pack, so there is no fuel to handle.' },
      { q: 'How is it delivered and paid for?', a: 'Enclosed freight from Yatala QLD, quoted to your postcode. Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price.' },
    ],
  },

  'club-car-tempo-lithium-2025': {
    primaryKeyword: 'club car tempo for sale',
    supportingKeywords: ['club car golf cart sales', 'club car golf buggies for sale', 'club car golf cart', 'club car electric carts', '2 seater electric golf cart'],
    h1: 'Club Car Tempo for Sale: 2025 Lithium Golf Buggy',
    seoTitle: 'Club Car Tempo for Sale: Buy the 2025 Lithium 2-Seater',
    seoDescription: 'Shop the Club Car Tempo for sale. 2025 lithium 2-seater with aluminium frame, $16,990 inc GST, from our Yatala QLD depot.',
    short: 'Tempo',
    closingHeading: 'How is the Tempo supplied in Australia?',
    intro:
      'Searching for a club car tempo for sale? The 2025 Club Car Tempo Lithium is a two-seater built for golfers who play the same course every week and want the buggy to disappear underneath them. It has the Monaco drive system, a rust-proof aluminium frame and an automotive-style dashboard. It is $16,990 AUD including GST.',
    sections: [
      {
        heading: 'What does the Monaco drive system do?',
        body: 'The Monaco drive system delivers smooth hill-climbing acceleration without the lurch that makes a full bag shift on steep fairway transitions. The automotive-style dashboard puts digital battery metrics in front of you, so range stops being guesswork on the back nine. Together they make club car golf buggies for sale like this the choice of players who value a calm, predictable round and a buggy that never draws attention to itself. It is a quiet, composed drive that lets you concentrate on your game rather than the buggy.',
      },
      {
        heading: 'Why does a rust-proof aluminium frame matter?',
        body: 'Australian courses combine irrigation, humidity and coastal air, and an aluminium chassis does not corrode the way steel does. That is the long-term argument for a Club Car: it keeps its frame and its value across many seasons. Golf bag caddy security also keeps clubs stable through turns, which is worth having on every round, and the frame stays sound long after cheaper steel buggies start to rust. Fewer things to maintain means fewer reasons to be without it.',
      },
      {
        heading: 'Who buys Club Car electric carts like the Tempo?',
        body: 'Avid golfers and private course members choose the Tempo when they intend to keep a buggy for many seasons rather than trade it quickly. The lithium battery is maintenance-free, so there is no watering or acid to manage. If you want a two-seat 2 seater electric golf cart with a heritage name behind it, the 2025 Tempo is the model to look at, and we can compare it with the other two-seaters in our range for you. Tell us how often you play and we will confirm it suits. Our team can answer questions on delivery, parts and warranty before you commit. Our desk replies to enquiries from all states and territories.',
      },
    ],
    faqs: [
      { q: 'How much is a Club Car Tempo for sale in Australia?', a: 'The 2025 Club Car Tempo Lithium is $16,990 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are Club Car golf cart sales supported by Australian parts?', a: 'Yes. We hold genuine Club Car parts in Australia and supply the Tempo from our Yatala QLD depot, so repairs do not mean waiting on an overseas order.' },
      { q: 'Is the Tempo one of the Club Car golf buggies for sale with lithium power?', a: 'Yes. It uses a maintenance-free lithium battery, so there is no acid, no watering and no equalising.' },
      { q: 'Why choose a Club Car golf cart with an aluminium frame?', a: 'Aluminium does not rust, so irrigation, humidity and coastal air cannot corrode the chassis the way they can steel.' },
      { q: 'Is it a 2 seater electric golf cart?', a: 'Yes. It is a traditional two-seat golf buggy, which is the layout most golfers and course members want.' },
      { q: 'Can I trial a Club Car electric cart, pay with crypto or Finance in 4?', a: 'Yes. Vehicles over $15,000 include a complimentary trial, Finance in 4 is available over $3,000, and crypto takes 10% off the vehicle price.' },
    ],
  },

  'ezgo-rxv-elite-lithium': {
    primaryKeyword: 'ezgo rxv elite for sale',
    supportingKeywords: ['ez go golf carts for sale', 'ezgo golf buggies for sale', 'ezgo golf buggy', 'ez go golf carts accessories', '2 seater electric golf cart'],
    h1: 'EZGO RXV ELiTE for Sale: Lithium Golf Buggy',
    seoTitle: 'EZGO RXV ELiTE for Sale: Buy the Auto-Park Lithium',
    seoDescription: 'Shop the EZGO RXV ELiTE for sale. Auto-park electromagnetic brake and Samsung SDI lithium, $15,800 inc GST, from Yatala QLD.',
    short: 'RXV ELiTE',
    closingHeading: 'How is the RXV ELiTE supplied?',
    intro:
      'Want an ezgo rxv elite for sale? The E-Z-GO RXV ELiTE Lithium is defined by what happens when you lift your foot: the automatic electromagnetic brake holds the buggy the moment you step off the throttle. It also has Samsung SDI lithium batteries and a high-efficiency AC drive. It is $15,800 AUD including GST, from Yatala QLD.',
    sections: [
      {
        heading: 'What does the electromagnetic auto-park brake do?',
        body: 'The automatic electromagnetic brake holds the buggy the moment you step off the throttle, so it will not creep or run away on a steep fairway slope or a sloped village driveway. For retirement village residents and anyone parking on an incline, that single behaviour is worth more than any spec on the sheet. It is the headline reason to choose this model over a buggy that relies on the driver remembering the handbrake. That peace of mind is the reason many buyers choose it before looking at any other model.',
      },
      {
        heading: 'Why Samsung SDI lithium and an AC drive?',
        body: 'Samsung SDI lithium batteries supply consistent power through the full charge, rather than fading toward the end like lead-acid, and the high-efficiency AC drive keeps consumption low across a full round. If you are comparing ezgo golf buggies for sale, that combination of steady power and low consumption is what the ELiTE name stands for, and it is why this lithium model suits both golf and village use. A lithium pack also means no watering, no acid and no equalising charge to schedule.',
      },
      {
        heading: 'Who buys the EZGO golf buggy RXV ELiTE?',
        body: 'Golfers, fleet buyers and retirement village residents are the typical owners. Fleet buyers value the reduced servicing burden across many units, because lithium removes watering and acid maintenance. Residents value the brake. Whether you buy one or several, the RXV ELiTE is built around safety and serviceability rather than headline specifications, and it is a two-seat buggy that stays simple to run. Tell us whether it is for one driver or a shared fleet and we will confirm it suits. Our team can answer questions on delivery, parts and warranty before you commit. Questions are welcome before you buy, not just after.',
      },
    ],
    faqs: [
      { q: 'How much is an EZGO RXV ELiTE for sale in Australia?', a: 'The E-Z-GO RXV ELiTE Lithium is $15,800 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What is the auto-park brake on the ELiTE?', a: 'An automatic electromagnetic brake that holds the buggy the moment you lift off the throttle, so it will not creep on a slope.' },
      { q: 'Is this an EZGO golf buggy with lithium batteries?', a: 'Yes. It uses Samsung SDI lithium batteries, which supply consistent power through the full charge and need no watering.' },
      { q: 'Are ez go golf carts for sale here supported with Australian parts?', a: 'Yes. We supply the RXV ELiTE with Australian parts and warranty support from our Yatala QLD depot.' },
      { q: 'Can I buy EZ GO golf carts accessories with it?', a: 'Ask the Yatala desk. We list accessories across our range and can confirm what suits the RXV ELiTE.' },
      { q: 'Can I buy a 2 seater electric golf cart on trial, with crypto or Finance in 4?', a: 'Yes. Vehicles over $15,000 include a complimentary trial, Finance in 4 is available over $3,000, and crypto takes 10% off the vehicle price.' },
    ],
  },

  'yamaha-drive2-ac-lithium': {
    primaryKeyword: 'yamaha drive2 golf cart for sale',
    supportingKeywords: ['yamaha golf carts for sale', 'yamaha electric carts', 'yamaha golf buggies', 'yamaha golf carts australia', 'yamaha golf cart'],
    h1: 'Yamaha Drive2 Golf Buggy for Sale: AC Lithium',
    seoTitle: 'Yamaha Drive2 Golf Cart for Sale: Buy the AC Lithium',
    seoDescription: 'Shop the Yamaha Drive2 golf cart for sale. AC lithium buggy with independent suspension, $16,500 inc GST, from Yatala QLD.',
    short: 'Drive2',
    closingHeading: 'How is the Drive2 supplied?',
    intro:
      'Looking for a yamaha drive2 golf cart for sale? The Yamaha Drive2 AC Lithium is the comfort choice, with independent front and rear suspension, ultra-comfort seats and wide dash storage. It is $16,500 AUD including GST, supplied from our Yatala QLD depot, and aimed at golfers and course fleets who want a smooth ride.',
    sections: [
      {
        heading: 'Why does independent suspension change the ride?',
        body: 'Independent front and rear suspension is rare at this level, and it is the reason the Drive2 rides the way it does. Most buggies transmit every rut and root straight into the seat frame. Independent suspension lets each wheel move on its own, so rough turf, unsealed tracks and cart-path joins arrive as a muted movement rather than a jolt, which is noticeable on every round. That is why owners with sore backs often choose it first.',
      },
      {
        heading: 'Who should buy yamaha golf carts like the Drive2?',
        body: 'Choose it if you or a passenger have a back that objects to rough ground, or if the daily run crosses unmade surfaces rather than manicured fairway. Combined with ultra-comfort seats, that is why yamaha golf carts for sale in this class are popular with golfers who value comfort and with course fleets that want members to enjoy the ride. If your daily run is mostly smooth fairway, a lower-priced model may serve you equally well, and we will say so.',
      },
      {
        heading: 'What about storage and electric power?',
        body: 'Wide dash storage takes phones, scorecards, keys and a drink without anything sliding off through turns. The AC lithium drivetrain makes it one of the quieter yamaha electric carts, with no fumes, no water topping and smooth acceleration. It is a two-seat layout, and each part of the design is aimed at everyday comfort rather than headline numbers, so the buggy suits long days as well as short ones. Quiet running means passengers can talk without raising their voices. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our desk replies to enquiries from all states and territories.',
      },
    ],
    faqs: [
      { q: 'How much is a Yamaha Drive2 golf cart for sale in Australia?', a: 'The Yamaha Drive2 AC Lithium is $16,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are Yamaha golf carts for sale here backed by Australian support?', a: 'Yes. We supply the Drive2 from our Yatala QLD depot with Australian parts and warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is this one of the Yamaha electric carts with lithium power?', a: 'Yes. It uses an AC lithium drivetrain, so there are no fumes, no water topping and smooth acceleration.' },
      { q: 'What makes Yamaha golf buggies ride so smoothly?', a: 'Independent front and rear suspension lets each wheel move on its own, so rough turf and unsealed tracks arrive as a muted movement.' },
      { q: 'Can I buy Yamaha golf carts Australia wide with a trial?', a: 'Yes. Vehicles priced at $15,000 or more include a complimentary on-farm trial demonstration.' },
      { q: 'How do I pay for it?', a: 'Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price.' },
    ],
  },

  'tara-spirit-pro-2-seater': {
    primaryKeyword: 'tara electric golf cart',
    supportingKeywords: ['tara golf carts', 'tara golf cart price', 'tara ev golf cart', '2 seater golf cart', 'tara golf cart accessories'],
    h1: 'Tara Electric Golf Buggy: Spirit Pro 2-Seater',
    seoTitle: 'Tara Electric Golf Cart: Buy the Spirit Pro 2-Seater',
    seoDescription: 'Shop the Tara electric golf cart. Spirit Pro 2-seater lithium buggy with rapid charger, $13,500 inc GST, from Yatala QLD.',
    short: 'Spirit Pro',
    closingHeading: 'How is the Spirit Pro supplied?',
    intro:
      'A tara electric golf cart should make the upgrade from an ageing lead-acid buggy realistic. The Tara Spirit Pro 2-Seater is aimed squarely at private golfers, with a lightweight frame, a rapid charger, a digital speedometer and a sweater basket. It is $13,500 AUD including GST, from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a lightweight frame help range?',
        body: 'A lightweight frame means less mass for the motor to move, which translates directly into usable range from the lithium pack. The rapid charger then shortens turnaround between rounds, so the buggy is ready when you are rather than the next morning. Together those two features are why a lithium buggy like the Spirit Pro suits weekly golfers who play most weekends and do not want to plan around charging. It is a straightforward way to leave a heavy lead-acid buggy behind.',
      },
      {
        heading: 'What does the dashboard add?',
        body: 'The digital speedometer gives you a real read on pace instead of a guess, and a sweater basket handles the layers that Australian mornings demand and afternoons make redundant. They are small features, but they are the ones golfers notice every round, and they come fitted rather than as extras. Both are fitted as standard. The dashboard keeps essential information in view without clutter.',
      },
      {
        heading: 'Is it good value among Tara golf carts?',
        body: 'Cost-conscious buyers get modern lithium reliability, current styling and an end to acid spills and water topping without paying for badge prestige. If you are comparing tara golf cart price against bigger brands, the Spirit Pro is the entry model: a two-seater priced at $13,500 with the features a private golfer actually uses. It is a sensible tara ev golf cart for first-time lithium buyers. First-time lithium buyers can ask us for a side-by-side with the other two-seaters. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our team can answer questions on delivery, parts and warranty before you commit. You can ask us for current availability, because we hold stock at our Yatala QLD depot.',
      },
    ],
    faqs: [
      { q: 'How much is a Tara electric golf cart like the Spirit Pro?', a: 'The Tara Spirit Pro 2-Seater is $13,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are Tara golf carts supported in Australia?', a: 'Yes. We supply them from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top. Keep your tax invoice as proof of purchase.' },
      { q: 'What is the Tara golf cart price compared with other 2-seaters?', a: 'At $13,500 it is among the lower-priced lithium two-seaters in our range. Compare it side by side with the Club Car, E-Z-GO and Yamaha models.' },
      { q: 'Can I add Tara golf cart accessories?', a: 'Ask the Yatala desk. We list accessories across our range and can confirm what suits the Spirit Pro before you order.' },
      { q: 'Is it a 2 seater golf cart with storage?', a: 'Yes. It seats two and includes a sweater basket for layers, plus a digital speedometer on the dash.' },
      { q: 'How do I pay for it?', a: 'Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price.' },
    ],
  },

  'lvtong-2-passenger-golf-buggy': {
    primaryKeyword: 'lvtong golf cart for sale',
    supportingKeywords: ['lvtong golf carts for sale', 'lvtong price', 'lvtong cart', '2 seater golf buggy for sale', 'golf buggy foldable'],
    h1: 'LVTONG Golf Buggy for Sale: 2-Passenger Course-Ready',
    seoTitle: 'LVTONG Golf Cart for Sale: Buy the 2-Passenger Buggy',
    seoDescription: 'Shop the LVTONG golf cart for sale. 2-passenger 48V buggy with windshield and sand bottles fitted, $11,990 inc GST, from Yatala QLD.',
    short: '2-Passenger',
    closingHeading: 'How is the LVTONG 2-Passenger supplied?',
    intro:
      'Looking for an lvtong golf cart for sale that is ready for the course? The LVTONG 2-Passenger Golf Buggy has a 48V system, a split foldable windshield, dual sand bottles and a caddy bag holder, all fitted. It is $11,990 AUD including GST, supplied from our Yatala QLD depot to budget private buyers and local clubs.',
    sections: [
      {
        heading: 'What comes fitted as standard?',
        body: 'The split foldable windshield, dual sand bottles and caddy bag holder are fitted rather than optional. That is where competing budget buggies quietly recover margin, once you start adding the parts you actually need. Here you can roll straight onto your local course without a shopping list of extras, which is the main appeal of a golf buggy foldable windshield package like this one. That keeps the real cost of the buggy close to the price on the page.',
      },
      {
        heading: 'Why a 48V system for club courses?',
        body: 'A 48V system keeps the buggy compact, agile and energy efficient around tight club layouts and shorter suburban courses. The two-seat footprint parks and stores in a standard garage or club bay without difficulty. Those practical points matter more to a small club than headline power figures, and they suit buyers watching the budget who still want an electric buggy that is simple to run. A compact buggy is also easier to store and to move around a club car park.',
      },
      {
        heading: 'Who buys lvtong golf carts for sale like the 2-Passenger?',
        body: 'Budget-focused private buyers and smaller local clubs building a modest fleet are the typical owners. It delivers dependable electric running with no hidden extra costs. If you want to compare lvtong golf carts for sale across the range, this is the lowest-priced model, and it still includes the course features that matter, so the price you see is the real starting point. Clubs ordering several can ask for fleet pricing. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same.',
      },
    ],
    faqs: [
      { q: 'How much is an LVTONG golf cart for sale in Australia?', a: 'The LVTONG 2-Passenger Golf Buggy is $11,990 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What is the LVTONG price including extras?', a: 'The $11,990 price includes the split foldable windshield, dual sand bottles and caddy bag holder, so there are no hidden extra costs.' },
      { q: 'Are LVTONG golf carts for sale suitable for a small club?', a: 'Yes. The two-seat footprint stores in a standard club bay, and the 48V system suits compact layouts and shorter courses.' },
      { q: 'Does this LVTONG cart have a windshield?', a: 'Yes. It has a split foldable windshield fitted as standard, plus two sand bottles and a caddy bag holder.' },
      { q: 'Is it a 2 seater golf buggy for sale with a foldable screen?', a: 'Yes. It seats two and the windshield folds, which suits changing weather and storage.' },
      { q: 'How do I pay and how is it delivered?', a: 'Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, with enclosed freight quoted to your postcode.' },
    ],
  },

  'evolution-700-heavy-commercial-utility': {
    primaryKeyword: 'utility buggy for sale',
    supportingKeywords: ['electric utility buggy', 'golf utility cart', 'evolution golf carts', 'electric golf cart utility vehicle', 'farm buggy for sale'],
    h1: 'Utility Buggy for Sale: Evolution 700 Heavy Commercial',
    seoTitle: 'Utility Buggy for Sale: Buy the Evolution 700 Commercial',
    seoDescription: 'Shop a utility buggy for sale. Evolution 700 Heavy Commercial with drop-side flatbed, lithium-ion power and tow bar, $19,200 inc GST.',
    short: 'Evolution 700',
    closingHeading: 'Can I trial the Evolution 700 utility buggy before I order?',
    intro:
      'Looking for a utility buggy for sale to work a site all day? The Evolution 700 Heavy Commercial Utility has a drop-side flatbed tray, lithium-ion power, high-output headlights and a fitted tow bar. It is specified for facility management and security patrol work, $19,200 AUD including GST, and supported from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a drop-side tray help on a working site?',
        body: 'Dropping a side lets you load and unload from any angle, including with a trolley or by sliding long items on, instead of lifting everything up and over a fixed wall. On a site where the vehicle works continuously, that saves effort on every load. The tray is the practical distinction between this model and a passenger buggy with a bed added, and it is why facility teams choose it for daily cartage. Staff also handle heavy items more safely when they can slide them on at tray height.',
      },
      {
        heading: 'Why is an electric utility buggy suited to patrols?',
        body: 'Lithium-ion power keeps patrol runs quiet enough not to disturb residents, guests or wildlife on night rounds, and it removes refuelling from a shift pattern entirely. High-output automotive headlights make it useful after dark, and the fitted tow bar lets it pull a trailer behind. Security teams and facility managers value a vehicle that starts a shift fully charged and finishes it without a fuel stop, and daily running costs stay predictable across a defined site.',
      },
      {
        heading: 'Who uses the Evolution 700?',
        body: 'It is a straightforward industrial platform for facility management, security patrols and similar work across a defined site rather than open country. If you are comparing it with other utility vehicles or a farm buggy for sale, think about the tray first: the drop-side design and the tow bar are what set it apart. Tell us the loads you carry, the distances you cover and the surfaces you cross, and we will then confirm the 700 is the right size for the job. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is a utility buggy for sale like the Evolution 700?', a: 'The Evolution 700 Heavy Commercial Utility is $19,200 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What makes it an electric utility buggy for patrol work?', a: 'Lithium-ion power keeps it quiet on night rounds and removes refuelling from the shift, and the high-output headlights and tow bar suit security and facility work.' },
      { q: 'Are Evolution golf carts like this supported in Australia?', a: 'Yes. We supply the Evolution 700 from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is this a golf utility cart with a flatbed?', a: 'Yes. It has a drop-side flatbed tray, so you can load and unload from any angle instead of lifting over a fixed wall.' },
      { q: 'Is it an electric golf cart utility vehicle or a farm buggy?', a: 'It is an electric utility vehicle specified for facility management and security patrols. For rural work, compare it with the other models in our commercial and farm range.' },
      { q: 'How do I pay and how is it delivered?', a: 'Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price. Enclosed freight is quoted to your postcode.' },
    ],
  },

  'lvtong-commercial-flatbed-cargo-buggy': {
    primaryKeyword: 'commercial golf carts for sale',
    supportingKeywords: ['electric golf carts for commercial use', 'flatbed golf cart for sale', 'utility golf carts', 'lvtong golf carts', 'cargo buggy for sale'],
    h1: 'Commercial Golf Buggy for Sale: LVTONG Flatbed Cargo',
    seoTitle: 'Commercial Golf Carts for Sale: Buy the LVTONG Flatbed',
    seoDescription: 'Shop commercial golf carts for sale. LVTONG Flatbed Cargo Buggy with low steel mesh deck and regenerative braking, $15,900 inc GST.',
    short: 'LVTONG Flatbed',
    closingHeading: 'How is the LVTONG flatbed cargo buggy supplied?',
    intro:
      'Warehouses, nurseries and groundskeeping teams searching for commercial golf carts for sale want a load carrier, not a passenger buggy with a tray. The LVTONG Commercial Flatbed has a low steel mesh deck, regenerative braking and electric lithium power. It is $15,900 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a low loader height matter for cargo?',
        body: 'Low loader height is the reason this model exists. Every centimetre of deck height is a lift your staff perform on every item, all day, and a low steel mesh deck turns awkward lifts into slides. Across a shift that adds up to less strain and faster handling. It is why warehouses, nurseries and eco-resort groundskeepers choose it as a load-carrying platform rather than a passenger vehicle with a tray attached. In a warehouse, the same item may be handled dozens of times a shift, so a small saving on each lift adds up across the team.',
      },
      {
        heading: 'What does the mesh deck do on electric golf carts for commercial use?',
        body: 'The mesh itself drains, so wet nursery stock, hosed-down bins and rain do not pool in the tray. That keeps loads cleaner and the deck lighter to clean. For electric golf carts used for commercial work, a deck that drains is a practical detail that saves time every week, particularly in nurseries and on sites that are washed down regularly with hoses. Cleaning is also quicker, because water and debris run straight through instead of sitting on a solid floor.',
      },
      {
        heading: 'How does regenerative braking help indoors?',
        body: 'Regenerative braking recovers energy on the descents and, more usefully indoors, gives controlled slowing without riding the brake pedal through a warehouse aisle. The buggy is quiet and low-slung, and specified for repetitive handling work across sealed and semi-sealed surfaces. If you are comparing it with other utility golf carts or a flatbed golf cart for sale, tell us your surfaces and loads and we will confirm it suits. Quiet running also suits indoor aisles and nurseries, where noise and fumes from a petrol vehicle would be unwelcome. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide.',
      },
    ],
    faqs: [
      { q: 'How much are commercial golf carts for sale like the LVTONG Flatbed?', a: 'The LVTONG Commercial Flatbed / Cargo Buggy is $15,900 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are these electric golf carts for commercial use?', a: 'Yes. The LVTONG Flatbed is electric with a low steel mesh deck and regenerative braking, specified for warehouses, nurseries and eco-resort groundskeeping.' },
      { q: 'What is the flatbed golf cart for sale like to load?', a: 'The deck is low, which turns awkward lifts into slides, and the mesh drains so wet stock and rain do not pool in the tray.' },
      { q: 'Are LVTONG golf carts supported in Australia?', a: 'Yes. We supply LVTONG vehicles from our Yatala QLD depot and quote freight per delivery postcode. Australian Consumer Law guarantees apply on top.' },
      { q: 'Is this a cargo buggy for sale or a passenger buggy?', a: 'It is a load-carrying platform first. Warehouses, nurseries and eco-resort groundskeepers choose it for repetitive handling work.' },
      { q: 'How do I pay for it?', a: 'Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price, with enclosed freight quoted to your postcode.' },
    ],
  },

  'club-car-transporter-6-commercial': {
    primaryKeyword: 'shuttle buggy for sale',
    supportingKeywords: ['golf cart club car for sale', '6 seater golf buggy', 'shuttle buggy price', 'electric golf car', 'club car golf cars for sale'],
    h1: 'Shuttle Buggy for Sale: Club Car Transporter 6 Commercial',
    seoTitle: 'Shuttle Buggy for Sale: Buy the Club Car Transporter 6',
    seoDescription: 'Shop a shuttle buggy for sale. Club Car Transporter 6 seats six with ArmorFlex body and heavy-duty axles, $26,400 inc GST.',
    short: 'Transporter 6',
    closingHeading: 'How is the Transporter 6 shuttle supplied?',
    intro:
      'Operators looking for a shuttle buggy for sale at an airport, mine site or large resort want durability first. The Club Car Transporter 6 carries six passengers in forward-facing seats, with ArmorFlex bodywork and heavy-duty axles. It is $26,400 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why are forward-facing seats important on a 6 seater golf buggy?',
        body: 'Six forward-facing seats keep every passenger travelling in the direction of movement, which matters on longer transfers and with luggage. Where the Carryall carries loads, the Transporter 6 carries people, and it is built for shuttle duty at airports, mine sites and large resorts. A 6 seater golf buggy with this layout lets one vehicle move a full group without a second trip. Facing forward also lets passengers see where they are going, which makes longer transfers more comfortable.',
      },
      {
        heading: 'What does ArmorFlex bodywork protect against?',
        body: 'ArmorFlex bodywork resists the dents and scuffs that shared shuttle vehicles collect from trolleys, cases, bollards and inattentive drivers, so the fleet still looks presentable after a season rather than a fortnight. For any operator whose vehicle is the first impression a guest receives, that durability specification pays for itself. Fewer repairs also means fewer days with a vehicle out of service. A shuttle that arrives looking tidy supports your brand, and one that needs panel repairs every few weeks does the opposite.',
      },
      {
        heading: 'Why do heavy-duty axles matter for a full load?',
        body: 'Heavy-duty axles carry a full load of adults and bags without the sag that shortens component life. That is the difference between a shuttle that stays in service and one that needs attention early. If you are comparing a golf cart club car for sale with other commercial options, tell us your passenger numbers, luggage and route and we will confirm the Transporter 6 is the right fit. That reliability matters most where the shuttle runs from first arrival to last departure, with little time between trips for attention. Tell us how you will use it and we will confirm it suits before you order. If you are replacing an older buggy, tell us what you drive now and we will compare it.',
      },
    ],
    faqs: [
      { q: 'How much is a shuttle buggy for sale like the Club Car Transporter 6?', a: 'The Club Car Transporter 6 Commercial is $26,400 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What is the shuttle buggy price if I need several?', a: 'The single-unit price is $26,400. For several units, ask our wholesale and fleet desk, which can quote combined freight and pricing.' },
      { q: 'How many passengers does this 6 seater golf buggy carry?', a: 'Six, all in forward-facing seats, so every passenger travels in the direction of movement.' },
      { q: 'Can I buy a golf cart Club Car for sale for airport or resort use?', a: 'Yes. The Transporter 6 is built for shuttle duty at airports, mine sites and large resorts, with ArmorFlex bodywork and heavy-duty axles.' },
      { q: 'Is it an electric golf car with lithium power?', a: 'Yes. It is an electric lithium-powered vehicle, so there is no fuel handling for the operator.' },
      { q: 'Are Club Car golf cars for sale here supported with parts?', a: 'Yes. We supply them from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
    ],
  },

  'club-car-tempo-efi-petrol': {
    primaryKeyword: 'club car petrol golf buggy',
    supportingKeywords: ['golf carts for sale petrol', 'golf cart petrol for sale', 'gas golf carts for sale', 'golf buggy petrol', 'golf cart club car for sale'],
    h1: 'Club Car Petrol Golf Buggy for Sale: Tempo EFI',
    seoTitle: 'Club Car Petrol Golf Buggy: Buy the Tempo EFI Petrol',
    seoDescription: 'Shop the Club Car petrol golf buggy. Tempo EFI with 14HP overhead-cam engine and 25.4L tank, $14,250 inc GST, from Yatala QLD.',
    short: 'Tempo EFI',
    closingHeading: 'How is the Tempo EFI Petrol supplied?',
    intro:
      'A club car petrol golf buggy suits properties where the nearest bowser is a genuine drive away. The Club Car Tempo EFI Petrol has a 14HP single-cylinder overhead-cam engine and a 25.4-litre fuel tank. It is $14,250 AUD including GST, supplied from our Yatala QLD depot with nationwide enclosed freight quoted per postcode.',
    sections: [
      {
        heading: 'Why does a 25.4-litre tank matter for remote properties?',
        body: 'The 25.4-litre fuel tank is the headline for remote users, and the reason is simple arithmetic: a larger tank means fewer trips to town, fewer jerry cans and longer stretches between refuelling on properties where the nearest bowser is a long way off. For anyone searching golf carts for sale petrol, tank size is the figure that decides how often the buggy is tied up with fuel runs. In practice that can mean far fewer refuelling runs, which is welcome when town is far away or the weather is poor.',
      },
      {
        heading: 'Is a 14HP overhead-cam engine easy to service?',
        body: 'The 14HP overhead-cam single-cylinder engine is a conventional, proven layout that rural mechanics understand and that does not require specialist tooling to service. That makes ownership straightforward a long way from a dealer. Traditional rural users and remote property caretakers tend to prefer exactly this: mechanical simplicity, long range and parts availability over touchscreens and app connectivity. Because it uses a conventional layout, a local mechanic or a capable owner can usually handle routine servicing without special equipment.',
      },
      {
        heading: 'Who buys a golf cart petrol for sale like the Tempo?',
        body: 'Rural users and property caretakers who want a dependable workhorse rather than a gadget. Club Car build quality underpins it, and the whole vehicle is supported from our Yatala QLD depot. If you are weighing petrol against electric, tell us how far you drive each day and whether you have power at the shed, and we will advise which suits your property better. It is not the buggy for someone who wants a touchscreen or an app, and that is exactly why traditional buyers like it. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our team can answer questions on delivery, parts and warranty before you commit.',
      },
    ],
    faqs: [
      { q: 'How much is a Club Car petrol golf buggy like the Tempo EFI?', a: 'The Club Car Tempo EFI Petrol is $14,250 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What fuel tank size do golf carts for sale petrol buyers get here?', a: 'The Tempo EFI has a 25.4-litre tank, which means fewer refuelling trips and longer stretches between fills on remote properties.' },
      { q: 'Is the Tempo a golf cart petrol for sale with a simple engine?', a: 'Yes. It has a 14HP overhead-cam single-cylinder engine, a conventional layout that does not need specialist tooling to service.' },
      { q: 'Are gas golf carts for sale here supported in Australia?', a: 'Yes. We supply the Tempo EFI from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Why choose a golf buggy petrol model over electric?', a: 'Petrol suits long distances and properties without convenient power. Tell us your daily distance and we will advise.' },
      { q: 'Can I buy a golf cart Club Car for sale with Finance in 4?', a: 'Yes. At $14,250 it is over the $3,000 minimum, so you can split it into four interest-free instalments, or pay by PayID, bank transfer or crypto.' },
    ],
  },

  'ezgo-freedom-rxv-gas': {
    primaryKeyword: 'ezgo freedom rxv for sale',
    supportingKeywords: ['gas golf carts for sale', 'golf carts for sale petrol', 'ez go golf cart accessories', 'ezgo golf buggy for sale', 'for sale ezgo golf cart'],
    h1: 'EZGO Freedom RXV for Sale: Low-Maintenance Gas Buggy',
    seoTitle: 'EZGO Freedom RXV for Sale: Buy the Low-Maintenance Gas',
    seoDescription: 'Shop the EZGO Freedom RXV for sale. EX1 closed-loop EFI petrol engine built for fewer oil changes, $13,900 inc GST, from Yatala QLD.',
    short: 'Freedom RXV',
    closingHeading: 'How is the Freedom RXV supplied?',
    intro:
      'Want an ezgo freedom rxv for sale that does not feel like a maintenance commitment? The E-Z-GO Freedom RXV Gas has the EX1 closed-loop EFI petrol engine, designed around a maintenance problem rather than a power target. It is $13,900 AUD including GST, dispatched from our Yatala QLD depot with Australian warranty support.',
    sections: [
      {
        heading: 'What does closed-loop fuel injection do?',
        body: 'Its closed-loop electronic fuel injection continuously adjusts the fuel mixture based on live exhaust readings, which keeps combustion clean, reduces the fuel dilution and carbon build-up that contaminate oil, and lengthens the interval between oil changes. For anyone comparing petrol buggies, that is the feature that cuts the time spent on the workshop bench. Cleaner combustion also means less carbon in the oil, so the engine runs closer to its best for longer between services.',
      },
      {
        heading: 'Why does low maintenance matter on a farm?',
        body: 'For farmers and acreage owners that translates into fewer hours spent servicing and more spent using the vehicle. Closed-loop metering also means the engine adapts automatically to temperature and altitude instead of needing seasonal adjustment. If your previous petrol buggy felt like a maintenance commitment, the Freedom RXV is the direct answer to that experience, and it suits golf carts for sale petrol buyers who want simplicity. Time saved on servicing is time spent mustering, hauling or fencing, which is why working owners value it.',
      },
      {
        heading: 'Who buys ezgo golf buggy for sale models like the Freedom RXV?',
        body: 'Farmers and acreage owners who want petrol range without constant tinkering. It is an E-Z-GO, so it carries the brand reputation for serviceability. Ask the Yatala desk about ez go golf cart accessories if you want to add to it, and tell us your daily distance and terrain so we can confirm petrol is the right choice for your property before you order. It suits buyers who want proven petrol power but have been put off by the upkeep of older carburetted machines. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Enquiries are welcome from every state and territory.',
      },
    ],
    faqs: [
      { q: 'How much is an EZGO Freedom RXV for sale in Australia?', a: 'The E-Z-GO Freedom RXV Gas is $13,900 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Why choose one of the gas golf carts for sale with the EX1 engine?', a: 'The EX1 closed-loop EFI engine reduces fuel dilution and carbon build-up, which lengthens the interval between oil changes.' },
      { q: 'Does it suit golf carts for sale petrol buyers on large properties?', a: 'Yes. It is aimed at farmers and acreage owners who want petrol range with less maintenance.' },
      { q: 'Can I buy EZ GO golf cart accessories for it?', a: 'Ask the Yatala desk. We list accessories across our range and can confirm what suits the Freedom RXV.' },
      { q: 'Is it an ezgo golf buggy for sale with fuel injection?', a: 'Yes. It uses closed-loop electronic fuel injection that adapts to temperature and altitude automatically.' },
      { q: 'Is there a for sale ezgo golf cart warranty in Australia?', a: 'Yes. It is dispatched from Yatala QLD with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
    ],
  },

  'cushman-hauler-1200-gas-utility': {
    primaryKeyword: 'cushman golf cart for sale',
    supportingKeywords: ['utility golf carts', 'cushman carts for sale', 'petrol golf buggies for sale', 'golf buggy petrol', 'farm buggy for sale'],
    h1: 'Cushman Golf Buggy for Sale: Hauler 1200 Gas Utility',
    seoTitle: 'Cushman Golf Cart for Sale: Buy the Hauler 1200 Gas',
    seoDescription: 'Shop the Cushman golf cart for sale. Hauler 1200 with 13.5HP Kawasaki engine and manual dump bed, $16,800 inc GST, from Yatala QLD.',
    short: 'Hauler 1200',
    closingHeading: 'Can I trial the Cushman Hauler 1200 before I order?',
    intro:
      'Looking for a cushman golf cart for sale that carries real loads? The Cushman Hauler 1200 Gas Utility has a 13.5HP Kawasaki engine, a manual dump bed and a 544kg total load capacity. It is built for heavy agricultural property work, $16,800 AUD including GST, and supported from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does the Kawasaki engine matter on utility golf carts?',
        body: 'The 13.5HP Kawasaki engine is the reason this model has the reputation it does. Kawasaki small industrial engines are a known quantity on Australian properties, which means parts, service knowledge and reliability are all readily available rather than dependent on a single importer. For a petrol golf buggy used hard, that familiarity makes servicing quicker and cheaper across the years of ownership. That is a practical advantage on a working property, where a breakdown costs a whole day and a long walk back.',
      },
      {
        heading: 'What can a manual dump bed carry?',
        body: 'A manual dump bed handles 544kg of sand, gravel, feed or spoil and tips it without hydraulics to fail or maintain, which on heavy agricultural work is a feature rather than a compromise. Fewer systems means fewer things to go wrong a long way from the shed, and that is why utility golf carts like this one are popular on working farms. Without hydraulics there are no hoses to split or pumps to fail, and the bed works the same way every time.',
      },
      {
        heading: 'Who should buy the Hauler 1200?',
        body: 'Properties that need a genuinely rugged load carrier and value mechanical simplicity over convenience features. If you are comparing it with a farm buggy for sale or other petrol golf buggies for sale, think about how heavy your loads are and how far from help you work, and the straightforward Hauler 1200 will usually make sense. Tell us your loads and we will confirm it suits. Heavy loads, rough tracks and long days are what it is built for, and it asks little of you in return. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. We would rather you ask first than order the wrong model.',
      },
    ],
    faqs: [
      { q: 'How much is a Cushman golf cart for sale like the Hauler 1200?', a: 'The Cushman Hauler 1200 Gas Utility is $16,800 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What load can the Hauler carry?', a: 'It has a 544kg total load capacity and a manual dump bed that tips sand, gravel, feed or spoil without hydraulics.' },
      { q: 'Are utility golf carts like this available in Australia with support?', a: 'Yes. We supply the Hauler 1200 from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is it one of the Cushman carts for sale with a petrol engine?', a: 'Yes. It has a 13.5HP Kawasaki petrol engine, a known quantity on Australian properties.' },
      { q: 'Is it a good petrol golf buggy for sale for a farm?', a: 'It is specified for heavy agricultural property work, with a rugged load carrier and few systems to go wrong.' },
      { q: 'Is it a golf buggy petrol model with a trial?', a: 'Yes. Vehicles priced at $15,000 AUD or more include a complimentary on-farm trial demonstration.' },
    ],
  },

  'yamaha-umax-one-efi-utility': {
    primaryKeyword: 'yamaha umax golf cart for sale',
    supportingKeywords: ['yamaha efi golf cart for sale', 'yamaha efi golf cart price', 'yamaha fuel injected golf cart', 'yamaha golf buggies', 'golf carts petrol'],
    h1: 'Yamaha UMAX Golf Buggy for Sale: One EFI Utility',
    seoTitle: 'Yamaha UMAX Golf Cart for Sale: Buy the One EFI Utility',
    seoDescription: 'Shop the Yamaha UMAX golf cart for sale. One EFI Utility with one-hand tailgate latch and compact bed, $15,500 inc GST, from Yatala QLD.',
    short: 'UMAX One',
    closingHeading: 'Can I trial the UMAX One before I order?',
    intro:
      'A yamaha umax golf cart for sale in the compact size suits small farms, lifestyle blocks and sport venues. The Yamaha UMAX One EFI Utility has a compact utility bed, a one-hand tailgate latch and high-comfort bucket seats. It is $15,500 AUD including GST, and supported from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why choose a compact utility buggy?',
        body: 'The UMAX One is the compact end of the commercial range, sized for sites where a full-size utility vehicle is more machine than the site needs. The compact utility bed carries a genuine load without the length that makes manoeuvring awkward around sheds, gates and spectator areas. That is why yamaha golf buggies in this size are popular on sport grounds and lifestyle blocks. Compact also means easier turning around buildings, gates and crowds, which is where a larger machine becomes a nuisance.',
      },
      {
        heading: 'What does the one-hand latch change on yamaha golf buggies?',
        body: 'A one-hand tailgate latch sounds minor until you are carrying something in the other arm, which on a working vehicle is most of the time. Wide contoured bucket seats keep the driver comfortable across a long day rather than merely seated. Small details like these are what separate a vehicle people enjoy using from one they simply tolerate each shift. Comfort matters on a vehicle that is used for hours at a time, because tired drivers work less safely and enjoy it less.',
      },
      {
        heading: 'Does Yamaha fuel injection help starting?',
        body: 'Yamaha EFI keeps starting and running reliable across the temperature range Australian sites actually experience. For anyone searching a yamaha efi golf cart for sale, fuel injection is the feature that removes choke and flooding worries. Tell us how heavy your loads are and how often you start it, and we will confirm the UMAX One suits before you order. It is a compact utility buggy with a golf-cart footprint, so it suits places a full-size utility cannot comfortably go. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same.',
      },
    ],
    faqs: [
      { q: 'How much is a Yamaha UMAX golf cart for sale in Australia?', a: 'The Yamaha UMAX One EFI Utility is $15,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What is the Yamaha EFI golf cart price compared with other petrol utilities?', a: 'At $15,500 the UMAX One sits in the middle of our petrol range. Compare it with the Cushman Hauler and Club Car Carryall before you decide.' },
      { q: 'Is this a Yamaha fuel injected golf cart?', a: 'Yes. It uses Yamaha EFI, which keeps starting and running reliable across the temperature range Australian sites experience.' },
      { q: 'What does the compact bed carry?', a: 'The compact utility bed carries a genuine load without the length that makes manoeuvring awkward around sheds and gates.' },
      { q: 'Are Yamaha golf buggies like this supported in Australia?', a: 'Yes. We supply the UMAX One from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Are golf carts petrol models like this available with a trial?', a: 'Yes. Vehicles priced at $15,000 AUD or more include a complimentary on-farm trial demonstration.' },
    ],
  },

  'club-car-carryall-300-petrol': {
    primaryKeyword: 'club car carryall for sale',
    supportingKeywords: ['club car golf cars for sale', 'utility golf cart', 'golf carts petrol', 'golf cart for sale club car', 'petrol golf car'],
    h1: 'Club Car Carryall for Sale: 300 Petrol Utility Buggy',
    seoTitle: 'Club Car Carryall for Sale: Buy the 300 Petrol Utility',
    seoDescription: 'Shop the Club Car Carryall for sale. Carryall 300 petrol utility with tight turning radius and aluminium bed, $16,200 inc GST.',
    short: 'Carryall 300',
    closingHeading: 'Can I trial the Carryall 300 before I order?',
    intro:
      'Schools, grounds teams and light commercial sites asking for a club car carryall for sale want a tight turning circle. The Club Car Carryall 300 Petrol has a 14HP engine, a rustproof aircraft-grade aluminium frame and a compact turning radius. It is $16,200 AUD including GST, supported from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does turning radius decide a utility golf cart?',
        body: 'A tight turning circle is the specification that decides whether a utility vehicle is useful around buildings. Schools, grounds teams and light commercial sites work between structures, walkways, garden beds and parked cars, where a large turning radius means three-point turns all day. The Carryall 300 is built for exactly that environment, and that is why a utility golf cart this agile is popular on campuses. A smaller turning circle also means less damage to lawns and garden beds, because the vehicle does not need extra room to swing.',
      },
      {
        heading: 'Why does an aluminium bed last longer?',
        body: 'The rustproof aircraft-grade aluminium bed is the durability argument: grounds work means wet clippings, fertiliser and sand, all of which corrode a steel tray from the inside out over a few seasons. Aluminium simply does not. For schools and grounds teams that wash down the bed regularly, that means the vehicle looks and works the same after years of use. Wash it down at the end of the day and it is ready for the next shift, with no corrosion to chase.',
      },
      {
        heading: 'What does the 14HP petrol engine suit?',
        body: 'A 14HP engine provides adequate power for the loads this class carries without the running costs of a larger unit. Petrol means no charging schedule for shared vehicles. If you are comparing golf carts petrol models with electric options, tell us the loads, the distances and whether you have power available, and we will advise whether the Carryall 300 is the right choice. Petrol also means no charging routine, so shared vehicles are always ready for whoever needs them. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is a Club Car Carryall for sale in Australia?', a: 'The Club Car Carryall 300 Petrol is $16,200 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are Club Car golf cars for sale here supported with Australian parts?', a: 'Yes. We supply the Carryall 300 from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is it a utility golf cart for schools and grounds teams?', a: 'Yes. The tight turning radius and aluminium bed are aimed at schools, grounds teams and light commercial sites.' },
      { q: 'What does this petrol golf car get with the 14HP engine?', a: 'A 14HP engine with adequate power for the loads this class carries and no charging schedule for shared vehicles.' },
      { q: 'Does it rust like a steel bed?', a: 'No. The bed and frame are rustproof aircraft-grade aluminium, which does not corrode from wet clippings, fertiliser or sand.' },
      { q: 'Can I trial a golf cart for sale club car utility like this?', a: 'Yes. Vehicles priced at $15,000 AUD or more include a complimentary on-farm trial demonstration.' },
    ],
  },

  'mgi-ai-navigator-gps-remote-buggy': {
    primaryKeyword: 'mgi remote golf buggy',
    supportingKeywords: ['remote control electric golf buggy', 'mgi remote control', 'gps golf trolley', 'gps electric golf trolley', 'golf buggy gps'],
    h1: 'MGI Remote Golf Buggy: Ai Navigator GPS Remote Buggy',
    seoTitle: 'MGI Remote Golf Buggy: Buy the Ai Navigator GPS',
    seoDescription: 'Buy the MGI remote golf buggy. Ai Navigator with touchscreen GPS and gyroscope straight tracker, $2,849 inc GST, from Yatala QLD.',
    short: 'Ai Navigator',
    closingHeading: 'Where can I buy the MGI Ai Navigator?',
    intro:
      'Looking for an mgi remote golf buggy? The MGI Ai Navigator GPS Remote Buggy is the flagship of the MGI range for golfers who walk the course, with full directional remote control, an integrated touchscreen GPS and a Patented Gyroscope Straight Tracker. It is $2,849 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does the gyroscope straight tracker matter?',
        body: 'The gyroscope straight tracker is what separates a good remote buggy from a frustrating one. Without it, any motorised buggy drifts off line on a cambered fairway and you spend the walk correcting it. The gyroscope holds the chosen heading across slopes so the buggy tracks where you pointed it, which is why a remote control electric golf buggy with this feature feels effortless to use. It also means the buggy follows the line you intended rather than the slope of the ground, which saves you steering corrections.',
      },
      {
        heading: 'What does full remote control add on the course?',
        body: 'Full directional remote control means you can send it ahead to the next tee or around a bunker while you play. You keep both hands for your clubs and your attention on your shot. For private golfers who walk the course, the MGI remote control makes the buggy one less thing to manage during a round, and that is the model to choose if you want it to require no attention at all. Because you are not pushing or pulling, your energy stays for the round, and you can walk at your own pace.',
      },
      {
        heading: 'Is a GPS golf trolley worth having?',
        body: 'The integrated touchscreen GPS puts distances in front of you without reaching for a phone or a separate rangefinder. If you are comparing a gps golf trolley with a standard remote model, the Ai Navigator builds the GPS into the same buggy, so there is nothing extra to buy or mount. It is the flagship of the MGI range for golfers who want the most complete package. Everything is in one buggy, so there is no phone holder, bracket or extra device to add and keep charged. Tell us how you will use it and we will confirm it suits before you order. Prices are in Australian dollars.',
      },
    ],
    faqs: [
      { q: 'How much is an MGI remote golf buggy like the Ai Navigator?', a: 'The MGI Ai Navigator GPS Remote Buggy is $2,849 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What makes this a remote control electric golf buggy for hilly courses?', a: 'The Patented Gyroscope Straight Tracker holds the chosen heading across slopes, so the buggy tracks where you pointed it.' },
      { q: 'Does the MGI remote control need to be charged?', a: 'Ask the Yatala desk. We hold MGI remotes and batteries in Australian stock and can explain charging for the model you choose.' },
      { q: 'Is this a gps golf trolley with a touchscreen?', a: 'Yes. It has an integrated touchscreen GPS that puts distances in front of you without a phone or separate rangefinder.' },
      { q: 'Is it a gps electric golf trolley I can steer remotely?', a: 'Yes. Full directional remote control lets you send it ahead to the next tee or around a bunker.' },
      { q: 'Can I add a golf buggy GPS later?', a: 'This model has GPS built in. For other MGI models, ask us what suits.' },
    ],
  },

  'mgi-zip-navigator-all-terrain': {
    primaryKeyword: 'mgi navigator all terrain',
    supportingKeywords: ['mgi all terrain', 'mgi zip navigator all terrain best price', 'remote control golf buggy for sale', 'motorised golf buggy for sale', 'mgi electric golf buggies'],
    h1: 'MGI Navigator All Terrain: Zip Navigator Remote Buggy',
    seoTitle: 'MGI Navigator All Terrain: Buy the Zip Navigator Buggy',
    seoDescription: 'Buy the MGI Navigator All Terrain. Zip Navigator with twin 230W motors and anti-tip fifth wheel, $2,209 inc GST, from Yatala QLD.',
    short: 'Zip Navigator All-Terrain',
    closingHeading: 'Where can I buy the MGI Zip Navigator All-Terrain?',
    intro:
      'The MGI Zip Navigator All-Terrain is the stability choice for walk-behind golfers whose home course has real elevation. This mgi navigator all terrain model has twin 230W motors, a 24V 380Wh lithium battery and a rear fold-out fifth wheel. It is $2,209 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'What do twin 230W motors do on an mgi all terrain buggy?',
        body: 'Twin 230W motors drive the wheels independently, which is what gives the Zip Navigator its footing on wet slopes and cambered lies where a single-motor buggy scrabbles and slides sideways. That independence is the main reason golfers choose an mgi all terrain model for hilly or damp courses, where grip matters more than outright speed on a straight fairway. Wet grass, damp clay and sloping fairways are where the difference shows, because each wheel can hold the ground independently. Steeper contours put more load on a buggy, which is where independent drive helps most.',
      },
      {
        heading: 'How does the fifth wheel stop tipping?',
        body: 'The rear fold-out fifth wheel sits behind the main axle and stops the buggy tipping backwards when climbing steep contours, a genuine risk on undulating Australian courses when a full bag sits high on the frame. A 24V 380Wh lithium pack supplies the sustained power both motors need, so the buggy keeps its pace across a full round of climbing. That stability also keeps the bag balanced, which matters when a heavy bag sits high on the frame.',
      },
      {
        heading: 'Is this the best price for a remote motorised buggy?',
        body: 'For walk-behind golfers whose home course has real elevation rather than gentle undulation, this is the stability specification worth paying for. If you are comparing a motorised golf buggy for sale against a standard Zip model, tell us your course and your bag and we will confirm the all-terrain version is the right choice, or whether the standard model will do. Other Zip models suit flatter courses, and we are happy to say honestly when the standard buggy is enough. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our desk is based at Yatala QLD.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Navigator All Terrain in Australia?', a: 'The MGI Zip Navigator All-Terrain is $2,209 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What does MGI all terrain mean for the Zip Navigator?', a: 'Twin 230W motors drive the wheels independently, and a rear fold-out fifth wheel stops the buggy tipping backwards on steep contours.' },
      { q: 'Is the MGI Zip Navigator All Terrain best price better than the standard model?', a: 'It costs more than the standard Zip Navigator, and it is worth it if your course has real elevation. Tell us your course and we will advise.' },
      { q: 'Is it a remote control golf buggy for sale with lithium power?', a: 'Yes. It is a remote Zip-series buggy with a 24V 380Wh lithium battery pack.' },
      { q: 'Is it one of the motorised golf buggies for sale that suit hills?', a: 'Yes. The twin motors and anti-tip fifth wheel are aimed at wet slopes and undulating courses.' },
      { q: 'Are MGI electric golf buggies supported in Australia?', a: 'Yes. MGI batteries, remotes and accessories are held in Australian stock at our Yatala QLD depot.' },
    ],
  },

  'evolution-classic-2-plus': {
    primaryKeyword: 'evolution golf carts for sale',
    supportingKeywords: ['evolution golf carts', 'evolution golf cart', '2 person electric golf carts', '2 seater golf cart', 'electric golf buggy for sale'],
    h1: 'Evolution Golf Buggy for Sale: Classic 2 Plus Lithium',
    seoTitle: 'Evolution Golf Carts for Sale: Buy the Classic 2 Plus',
    seoDescription: 'Shop Evolution golf carts for sale. Classic 2 Plus lithium buggy with 6.3-inch LCD, mirrors and turn signals, $14,200 inc GST, Yatala QLD.',
    short: 'Classic 2 Plus',
    closingHeading: 'How is the Evolution Classic 2 Plus supplied?',
    intro:
      'Buyers moving across from a modern car are often searching for evolution golf carts for sale with real instrumentation. The Evolution Classic 2 Plus is a two-seat lithium buggy with a 6.3-inch LCD screen, side mirrors with integrated turn signals and two-tone seating. It is $14,200 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'What does the 6.3-inch LCD screen add to a 2 seater golf cart?',
        body: 'The Classic 2 Plus brings automotive-level instrumentation to a two-seat buggy, which is exactly what buyers moving across from a modern car expect and rarely find. The 6.3-inch LCD screen has reverse camera compatibility, so the cabin feels closer to a car than a course buggy. For anyone comparing a 2 seater golf cart with older analogue models, the screen is the clearest difference, and it gives you information at a glance.',
      },
      {
        heading: 'Why do mirrors and turn signals matter?',
        body: 'Side mirrors with integrated turn signals make the buggy road-aware in a way that matters on estate roads shared with vehicles, not just on the fairway. Turn signals and mirrors are also the features most often required when a buggy is used around traffic on private roads or a gated community internal network. We do not call any buggy road legal, so check the rules for your area before you drive it on a public road.',
      },
      {
        heading: 'Is lithium-ion power quiet enough for conversation?',
        body: 'Lithium-ion power keeps it quiet enough to hold a conversation at speed and removes the maintenance routine lead-acid demands, with no watering and no acid. Modern, tech-focused golfers and community residents are the typical owners. If you are weighing it against other electric golf buggies for sale, tell us how you drive, who rides with you and where, and we will confirm the Classic 2 Plus suits. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our team can answer questions on delivery, parts and warranty before you commit. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much are Evolution golf carts for sale like the Classic 2 Plus?', a: 'The Evolution Classic 2 Plus is $14,200 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are Evolution golf carts in Australia supported locally?', a: 'Yes. We supply the Classic 2 Plus from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'What does this Evolution golf cart include?', a: 'A 6.3-inch LCD screen with reverse camera compatibility, lithium-ion power, two-tone seats and side mirrors with integrated turn signals.' },
      { q: 'Is it one of the 2 person electric golf carts with mirrors?', a: 'Yes. It seats two and has side mirrors with integrated turn signals. We do not label any buggy road legal, so check your local rules.' },
      { q: 'Is this a 2 seater golf cart with lithium power?', a: 'Yes. It uses lithium-ion power, which is quiet and removes watering and acid maintenance.' },
      { q: 'Is this electric golf buggy for sale available with Finance in 4 or crypto, and how is it delivered?', a: 'Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price. Enclosed freight is quoted to your postcode.' },
    ],
  },

  'atlas-4-seater-heavy-duty-lifted-350a': {
    primaryKeyword: 'atlas golf carts price',
    supportingKeywords: ['heavy duty golf cart', 'atlas golf cart accessories', 'golf buggy tire', 'tires for a golf cart', 'off road golf buggy'],
    h1: 'Atlas Golf Buggy Price: 4-Seater Heavy Duty Lifted 350A',
    seoTitle: 'Atlas Golf Carts Price: Buy the Heavy Duty Lifted 350A',
    seoDescription: 'See Atlas golf carts price and buy the Heavy Duty Lifted 350A. 350-amp controller and hydraulic disc brakes, $21,990 inc GST.',
    short: 'Atlas 350A',
    closingHeading: 'Can I trial the Atlas 350A before I order?',
    intro:
      'Asking about atlas golf carts price for hilly country? The Atlas 4-Seater Heavy Duty Lifted has a 350-amp controller, four-wheel hydraulic brakes, rugged all-terrain tyres and a steel brush guard. It is built for acreage owners and farm tracks, $21,990 AUD including GST, and supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a 350-amp controller matter on a heavy duty golf cart?',
        body: 'Controller amperage governs how much current the motor can draw under load, which is what decides whether a fully laden four-seater walks up a steep farm track or bogs down halfway and overheats. The 350-amp controller is the specification that matters on this buggy, and it is why a heavy duty golf cart like this one is the answer for hilly Australian properties. On a steep track the difference is obvious: a buggy with a weak controller slows and heats up, while this one keeps pulling at a steady pace.',
      },
      {
        heading: 'How do four-wheel hydraulic brakes help on descents?',
        body: 'Paired with four-wheel hydraulic disc brakes, it also means you can come back down that same hill under control rather than riding the brakes to the bottom. Rugged all-terrain tyres and a steel brush guard handle the scrub, stumps and gateposts that acreage driving involves. Any off road golf buggy used on slopes benefits from stopping power that matches its pulling power. Better stopping also protects the brakes and the driver, because a long descent no longer depends on one set of pads working flat out.',
      },
      {
        heading: 'Who should choose the Atlas 350A?',
        body: 'Acreage owners, hilly farm tracks and rural properties where a standard golf buggy has already disappointed you. This is the model built to answer that specific problem. If you need to replace wheels later, ask us about wheel and tyre options, and tell us your slopes and loads so we can confirm it suits before you order. It is a heavy-duty answer for properties with real slopes, not a styling exercise, and it is priced accordingly. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'What is the Atlas golf carts price for the Heavy Duty Lifted 350A?', a: 'The Atlas 4-Seater Heavy Duty Lifted (350A) is $21,990 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is this a heavy duty golf cart for steep hills?', a: 'Yes. The 350-amp controller supports heavy loads on steep farm tracks, and four-wheel hydraulic brakes keep descents under control.' },
      { q: 'Can I buy Atlas golf cart accessories for it?', a: 'Ask the Yatala desk. We list accessories across our range and can confirm what suits the Atlas 350A.' },
      { q: 'What tyres does it use, and what about a golf buggy tire replacement?', a: 'It runs rugged all-terrain tyres. For replacement golf buggy tire options and tires for a golf cart, ask the Yatala desk.' },
      { q: 'Is it an off road golf buggy with a brush guard?', a: 'Yes. It has a steel brush guard and all-terrain tyres for scrub, stumps and gateposts.' },
      { q: 'Can I trial it, and how do I pay?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial. Pay by PayID, bank transfer, Finance in 4 over $3,000 or crypto, which takes 10% off the vehicle price.' },
    ],
  },

  'evolution-d-max-gt4-off-road': {
    primaryKeyword: '4x4 buggy for sale',
    supportingKeywords: ['off road buggies for sale', 'off road buggy for sale australia', 'evolution electric golf cart', '4x4 farm buggy for sale', 'electric farm buggy for sale australia'],
    h1: '4x4 Buggy for Sale: Evolution D-MAX GT4 Off-Road',
    seoTitle: '4x4 Buggy for Sale: Buy the Evolution D-MAX GT4',
    seoDescription: 'Shop a 4x4 buggy for sale. Evolution D-MAX GT4 with roll cage, integrated winch and independent suspension, $23,800 inc GST.',
    short: 'D-MAX GT4',
    closingHeading: 'Can I trial the D-MAX GT4 before I order?',
    intro:
      'Hunters and property managers searching for a 4x4 buggy for sale want recovery capability, not comfort. The Evolution D-MAX GT4 has a heavy-duty roll cage, long-travel independent off-road suspension, an integrated winch and a high-power AC drivetrain. It is $23,800 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why is the GT4 built around recovery?',
        body: 'The D-MAX GT4 is the only buggy in our range built around recovery rather than comfort. A heavy-duty roll cage and long-travel independent off-road suspension let it work genuine trail terrain instead of merely surviving a gravel driveway. The integrated winch means a bogged vehicle, a fallen limb or a stuck gate is a job you finish yourself rather than a call you make. On a bush or trail property a recovery winch can turn a stuck vehicle into a quick job rather than a long wait for help.',
      },
      {
        heading: 'Who buys off road buggies for sale like the GT4?',
        body: 'Hunters and large property managers choose it because the working day happens well away from the shed. The high-power AC drivetrain delivers torque quietly, which matters more than most buyers expect around livestock and wildlife. If you are comparing off road buggies for sale, this is a serious piece of equipment rather than a lifted golf buggy, and it is specified accordingly. Quiet torque also means less disturbance to animals, which matters when the work is done around stock or on hunting land.',
      },
      {
        heading: 'Is it right for a farm or trail property?',
        body: 'For trail enthusiasts and big properties it brings the roll cage, suspension and winch together in one vehicle, which a 4x4 farm buggy for sale at lower prices usually cannot. Tell us your terrain, your typical loads and how far you work from help, and we will confirm the GT4 is the right choice, or suggest a lighter lifted model if it is more than you need. The GT4 is heavier in spirit than a lifted golf buggy, and it is priced as equipment rather than as a convenience. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Ask us anything before you buy.',
      },
    ],
    faqs: [
      { q: 'How much is a 4x4 buggy for sale like the Evolution D-MAX GT4?', a: 'The Evolution D-MAX GT4 Off-Road is $23,800 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is the GT4 one of the off road buggies for sale with a winch?', a: 'Yes. It has an integrated heavy-duty recovery winch, a roll cage and long-travel independent suspension.' },
      { q: 'Are off road buggy for sale Australia buyers supported locally?', a: 'Yes. We supply the GT4 from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is this an Evolution electric golf cart?', a: 'It is an electric Evolution off-road buggy with a high-power AC drivetrain, built for trails rather than fairways.' },
      { q: 'Is it a 4x4 farm buggy for sale suited to livestock?', a: 'Yes. The quiet AC drivetrain is useful around livestock and wildlife, and the winch helps with recovery.' },
      { q: 'Can I trial an electric farm buggy for sale Australia wide?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial demonstration. Ask the Yatala desk to arrange it.' },
    ],
  },

  'ezgo-express-s4-lifted-high-torque': {
    primaryKeyword: 'ezgo express s4 for sale',
    supportingKeywords: ['ez go golf cart sales', 'ezgo golf carts for sale', 'e-z-go golf buggy', 'tires for a golf cart', 'ezgo golf buggies for sale'],
    h1: 'EZGO Express S4 for Sale: Lifted High-Torque Buggy',
    seoTitle: 'EZGO Express S4 for Sale: Buy the Lifted High-Torque',
    seoDescription: 'Shop the EZGO Express S4 for sale. 4-inch lift, all-terrain tyres and a rear seat that converts to a cargo bed, $20,500 inc GST.',
    short: 'Express S4',
    closingHeading: 'Can I trial the Express S4 before I order?',
    intro:
      'Rural families searching for an ezgo express s4 for sale want seats in the morning and a tray in the afternoon. The E-Z-GO Express S4 Lifted has a four-inch factory lift, Desert Eagle all-terrain tyres and a rear seat that flips into a flatbed. It is $20,500 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'How does the rear seat become a cargo bed?',
        body: 'The rear seat flips over into a flatbed utility platform, so the school-run configuration becomes the feed-and-tools configuration in seconds without unbolting anything. That solves the problem every rural family runs into: you need seats in the morning and a tray in the afternoon, and you do not want two vehicles. For farm transport it is the most flexible chassis we stock. Parents and farmers can swap layouts in seconds, so the vehicle fits the job instead of the job being shaped around the vehicle.',
      },
      {
        heading: 'Why does a factory lift beat an aftermarket one?',
        body: 'A four-inch factory lift on Desert Eagle all-terrain tyres gives it the clearance to cross paddock ruts, washouts and unsealed tracks that would ground a standard-height buggy. Because the lift is factory rather than aftermarket, the geometry, braking and warranty are engineered together rather than bolted on afterwards. When tires for a golf cart eventually need replacing, ask us what suits. Factory engineering means the lift, tyres and brakes are designed to work together as one package.',
      },
      {
        heading: 'Who buys an e-z-go golf buggy like the Express S4?',
        body: 'Rural families and farm transport users who want one flexible vehicle rather than two. Whether you are comparing ezgo golf carts for sale or other lifted models, the dual-purpose layout is what sets the S4 apart. Tell us how many passengers you carry, what you haul and what the tracks are like, and we will confirm it suits before you order. It is the sensible pick if one vehicle must cover the school run, the feed run and the paddock check. Tell us how you will use it and we will confirm it suits before you order. If you are replacing an older buggy, tell us what you drive now and we will compare it.',
      },
    ],
    faqs: [
      { q: 'How much is an EZGO Express S4 for sale in Australia?', a: 'The E-Z-GO Express S4 Lifted High-Torque is $20,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What are the EZ GO golf cart sales terms in Australia?', a: 'Prices include GST and freight is quoted to your postcode. The minimum order is $250 AUD, and we supply the S4 from our Yatala QLD depot.' },
      { q: 'Is this one of the ezgo golf carts for sale with a cargo option?', a: 'Yes. The rear seat converts to a flatbed utility platform in seconds.' },
      { q: 'What does an E-Z-GO golf buggy lift do?', a: 'The four-inch factory lift gives clearance to cross paddock ruts and washouts that ground a standard-height buggy.' },
      { q: 'What tyres does it use, and what about tires for a golf cart?', a: 'It runs Desert Eagle all-terrain tyres. Ask us about replacement tires for a golf cart when the time comes.' },
      { q: 'Are ezgo golf buggies for sale like this available with a trial?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial. Finance in 4 is available over $3,000, and crypto takes 10% off.' },
    ],
  },

  'lvtong-rough-terrain-lifted-buggy': {
    primaryKeyword: 'all terrain golf cart for sale',
    supportingKeywords: ['lvtong buggy', 'lvtong golf cart', 'golf buggy clearance', 'off road golf buggy', 'all terrain buggy for sale'],
    h1: 'All Terrain Golf Buggy for Sale: LVTONG Rough-Terrain Lifted',
    seoTitle: 'All Terrain Golf Cart for Sale: Buy the LVTONG Lifted',
    seoDescription: 'Shop an all terrain golf cart for sale. LVTONG Rough-Terrain Lifted Buggy with steel subframe and LED light bar, $17,500 inc GST.',
    short: 'LVTONG Rough-Terrain',
    closingHeading: 'Can I trial the LVTONG Rough-Terrain before I order?',
    intro:
      'Farmers, orchard owners and bush properties asking for an all terrain golf cart for sale want strength, not styling. The LVTONG Rough-Terrain Lifted Buggy has high ground clearance, a reinforced steel subframe, a front bash guard and an LED light bar. It is $17,500 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a reinforced steel subframe matter?',
        body: 'A reinforced steel subframe carries the twisting loads that rough ground puts through a chassis, and the front bash guard takes the low-speed impacts that orchard rows, stumps and undergrowth inevitably deliver. This lvtong buggy is built for farmers, orchard owners and bush properties where the terrain is the job rather than the obstacle, and it is specified for work rather than presentation. That strength is invisible on a good day and valuable on a bad one, which is why working buyers put it first.',
      },
      {
        heading: 'How does golf buggy clearance help on rough ground?',
        body: 'High ground clearance keeps the underbody clear of the ruts and irrigation lines that catch out standard buggies. For anyone comparing golf buggy clearance across models, that extra height is the practical difference on a working property. It is a straightforward lifted electric buggy with reinforced hardware, and it reaches places a standard-height buggy would struggle to cross. A higher body also keeps electrical components further from mud and water crossings.',
      },
      {
        heading: 'Why do owners value the LED light bar?',
        body: 'The front LED light bar is the feature owners end up valuing most: stock work, harvest and property checks do not stop at sunset, and a high-intensity bar turns a dark row into a working one. If you are comparing an all terrain buggy for sale for night work, tell us your tasks and terrain and we will confirm the LVTONG suits, or suggest a more heavily equipped model. Night work is a real part of farming, and a good light bar makes it safer as well as faster. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. If you are replacing an older buggy, tell us what you drive now and we will compare it.',
      },
    ],
    faqs: [
      { q: 'How much is an all terrain golf cart for sale like the LVTONG Rough-Terrain?', a: 'The LVTONG Rough-Terrain Lifted Buggy is $17,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is this an LVTONG buggy suited to orchards and bush?', a: 'Yes. It is built for farmers, orchard owners and bush properties, with a reinforced subframe and front bash guard.' },
      { q: 'Are LVTONG golf cart models supported in Australia?', a: 'Yes. We supply them from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'What golf buggy clearance does it offer?', a: 'High ground clearance keeps the underbody clear of ruts and irrigation lines. Ask the Yatala desk for the figure for your use.' },
      { q: 'Is it an off road golf buggy with lighting?', a: 'Yes. It has a front LED light bar for stock work, harvest and property checks after dark.' },
      { q: 'Can I trial an all terrain buggy for sale before ordering?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial demonstration.' },
    ],
  },

  'club-car-onward-lifted-efi-petrol': {
    primaryKeyword: 'club car onward lifted',
    supportingKeywords: ['petrol golf car', 'club car lifted golf carts', 'lifted golf carts', 'club car golf car', 'club car golf carts'],
    h1: 'Club Car Onward Lifted EFI Petrol Golf Buggy for Sale',
    seoTitle: 'Club Car Onward Lifted: Buy the EFI Petrol Buggy',
    seoDescription: 'Shop the Club Car Onward Lifted. Kohler 14HP EFI petrol engine, lifted suspension and all-terrain tread, $19,800 inc GST, from Yatala QLD.',
    short: 'Onward Lifted EFI',
    closingHeading: 'Can I trial the Onward Lifted before I order?',
    intro:
      'Properties without reliable grid power often look at a club car onward lifted. The Club Car Onward Lifted EFI Petrol carries a Kohler 14HP EFI petrol engine with lifted suspension and all-terrain tread, so range is limited by the jerry can rather than the battery pack. It is $19,800 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does electronic fuel injection change petrol ownership?',
        body: 'Electronic fuel injection means it starts cleanly cold, meters fuel accurately at altitude and across temperature swings, and avoids the carburettor tuning that older petrol buggies demanded every season. For remote properties or runs too long to plan around a charge cycle, that changes the maths, and it is why a modern petrol golf car is still the honest answer for long distances. Cold starts, hot days and altitude are handled by the engine management rather than by you adjusting a choke.',
      },
      {
        heading: 'How quickly can you refuel a petrol golf car?',
        body: 'Refuelling takes a minute rather than a night, so the buggy is ready whenever you are. Range is limited by the jerry can rather than the battery pack, which suits long-distance farm use and anywhere without dependable power. Club Car lifted golf carts like this one pair that practical range with the clearance of a lifted chassis for working ground. The tank can be topped up at a farm drum or a roadside bowser, so a long day is never ended by a flat battery.',
      },
      {
        heading: 'What do lifted suspension and all-terrain tread add?',
        body: 'Lifted suspension and all-terrain tread give it the clearance to work the same ground as our electric lifted models. It suits buyers without grid power access and long-distance farm users who want a refined version of petrol. Tell us your daily distance and terrain and we will confirm the Onward Lifted EFI is the right choice, or compare it with the electric alternatives. For many remote buyers it simply removes the question of where the next charge is coming from. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our desk replies to enquiries from all states and territories.',
      },
    ],
    faqs: [
      { q: 'How much is a Club Car Onward Lifted EFI Petrol?', a: 'The Club Car Onward Lifted EFI Petrol is $19,800 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Why choose a petrol golf car over electric for lifted use?', a: 'Petrol gives range limited only by the jerry can and refuels in a minute, which suits properties without grid power and very long runs.' },
      { q: 'Are Club Car lifted golf carts supported in Australia?', a: 'Yes. We supply the Onward Lifted from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is this one of the lifted golf carts suited to farm tracks?', a: 'Yes. Lifted suspension and all-terrain tread give it clearance on farm tracks and rough ground.' },
      { q: 'Can I see a Club Car golf car before I buy?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial demonstration. Ask the Yatala desk to arrange it.' },
      { q: 'Can I pay for Club Car golf carts with Finance in 4 or crypto?', a: 'Yes. Finance in 4 is available over $3,000, and paying in crypto takes 10% off the vehicle price.' },
    ],
  },

  'tara-roadster-4-off-road': {
    primaryKeyword: 'roadster golf cart for sale',
    supportingKeywords: ['rims for a golf cart', 'golf cart wheels and rims', 'roadster golf carts', 'tara ev golf cart', 'golf cart with rims'],
    h1: 'Roadster Golf Buggy for Sale: Tara Roadster 4 Off-Road',
    seoTitle: 'Roadster Golf Cart for Sale: Buy the Tara Roadster 4',
    seoDescription: 'Shop a roadster golf cart for sale. Tara Roadster 4 Off-Road with high-torque gearing and 12-inch rims, $19,500 inc GST, from Yatala QLD.',
    short: 'Roadster 4',
    closingHeading: 'Can I trial the Tara Roadster 4 before I order?',
    intro:
      'Property owners whose current buggy cannot climb often search for a roadster golf cart for sale. The Tara Roadster 4 Off-Road is built around a high-torque gear reduction ratio, with 12-inch off-road rims and an optional rear cargo tray. It is $19,500 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does gearing matter more than power on hills?',
        body: 'Gearing, not power, is what gets a loaded buggy up a steep incline, and the Roadster 4 is built around a high-torque gear reduction ratio chosen for exactly that. Lower gearing multiplies motor torque at the wheel, so sustained climbs happen at a steady pace instead of a struggle that heats the motor and drains the pack. It is the feature that makes the difference for hill-climbing owners. On a steep run that reduces strain on the motor and the battery, which is why gearing is the first thing to check.',
      },
      {
        heading: 'What do rims for a golf cart need to survive off-road?',
        body: 'Twelve-inch off-road rims put more sidewall and tread between the rim and the rock than a standard golf wheel, which is what prevents pinch damage on rutted acreage trails. Anyone shopping for rims for a golf cart or golf cart wheels and rims will recognise that wheel choice matters as much as motor choice on rough ground, and this model starts with the right wheel. Pinched tyres and bent rims are common repair jobs on rough tracks, and a taller sidewall helps avoid them.',
      },
      {
        heading: 'Is the rear cargo tray worth adding?',
        body: 'An optional rear cargo tray adds working capacity when the buggy is not carrying passengers. For property owners whose main complaint is that their current buggy cannot climb, this is the direct fix. Tell us your slope, your usual load and whether you need the tray, and we will confirm the Roadster 4 suits the way you use the property. The tray is an option, so you can add working capacity only if you need it. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is a roadster golf cart for sale like the Tara Roadster 4?', a: 'The Tara Roadster 4 Off-Road is $19,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What do rims for a golf cart like these offer off-road?', a: 'The 12-inch off-road rims put more sidewall and tread between rim and rock, which prevents pinch damage on rutted trails.' },
      { q: 'Are golf cart wheels and rims replaceable?', a: 'Ask the Yatala desk. We list wheel and tyre products across our range and can confirm what suits the Roadster 4.' },
      { q: 'Is this one of the roadster golf carts for steep hills?', a: 'Yes. A high-torque gear reduction ratio is chosen for heavy incline climbing on acreage trails.' },
      { q: 'Is it a Tara EV golf cart with a cargo option?', a: 'It is an electric Tara buggy with an optional rear cargo tray for working capacity.' },
      { q: 'Can I trial a golf cart with rims suited to rough ground?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial demonstration.' },
    ],
  },

  'club-car-carryall-700-electric-utility': {
    primaryKeyword: 'club car carryall 700 for sale',
    supportingKeywords: ['utility golf cart', 'heavy duty golf cart', 'electric utility buggy', 'electric golf cart utility vehicle', 'club car golf cars for sale'],
    h1: 'Club Car Carryall 700 for Sale: Electric Utility Buggy',
    seoTitle: 'Club Car Carryall 700 for Sale: Buy the Electric Utility',
    seoDescription: 'Shop the Club Car Carryall 700 for sale. 680kg payload, 6-foot aluminium box and tow hitch, $22,900 inc GST, from Yatala QLD.',
    short: 'Carryall 700',
    closingHeading: 'Can I trial the Carryall 700 before I order?',
    intro:
      'Councils, maintenance teams and commercial farms asking for a club car carryall 700 for sale want genuine work-vehicle capacity. The Club Car Carryall 700 Electric Utility has a 6-foot aluminium cargo box, a 680kg payload and an integrated heavy-duty tow hitch. It is $22,900 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a 680kg payload change the vehicle?',
        body: 'A 680kg payload puts the Carryall 700 in genuine work-vehicle territory rather than utility-buggy territory. The six-foot cargo box keeps unladen weight down, so more of the payload rating is available for cargo. For anyone comparing a heavy duty golf cart with lighter models, payload is the figure that separates a real work vehicle from a tray bolted onto a passenger buggy. Payload is also what separates tools you can rely on from toys, because overloading a light chassis shortens its life.',
      },
      {
        heading: 'Why is an aluminium cargo box the right material?',
        body: 'Aluminium will not rust out from wet turf, fertiliser, sand or salt air the way a steel tray does. An integrated heavy-duty tow hitch extends capacity to trailers, spreaders and turf equipment. For maintenance teams that wash down daily, that means a cargo box that looks and works the same after years of use as an electric golf cart utility vehicle. Washing it down after fertiliser or salt exposure is simple, and the box stays corrosion-free.',
      },
      {
        heading: 'Why do councils choose an electric utility buggy?',
        body: 'Councils, maintenance teams and commercial farms specify it because lithium removes fuel handling, engine servicing and exhaust from shared work areas entirely. That is the practical case for lithium on a busy site. Tell us the loads, the trailers and the surfaces and we will confirm the Carryall 700 is the right size, or suggest a lighter model if it is more than you need. Quiet running also means maintenance teams can work early or late without noise complaints. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our desk replies to enquiries from all states and territories.',
      },
    ],
    faqs: [
      { q: 'How much is a Club Car Carryall 700 for sale in Australia?', a: 'The Club Car Carryall 700 Electric Utility is $22,900 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are Club Car golf cars for sale here supported with parts?', a: 'Yes. We supply the Carryall 700 from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is it an electric utility buggy with lithium power?', a: 'Yes. It is a lithium electric utility vehicle with no fuel handling, engine servicing or exhaust.' },
      { q: 'What does this utility golf cart tow?', a: 'It has an integrated heavy-duty tow hitch for trailers, spreaders and turf equipment. Check the figure for your equipment with the Yatala desk.' },
      { q: 'Is it a heavy duty golf cart for councils?', a: 'Yes. A 680kg payload and a 6-foot aluminium cargo box suit councils, maintenance teams and commercial farms.' },
      { q: 'Can I trial an electric utility buggy before ordering?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial demonstration.' },
    ],
  },

  'ezgo-cushman-hauler-pro-lithium': {
    primaryKeyword: 'cushman utility cart for sale',
    supportingKeywords: ['cushman electric utility cart', 'e-z-go golf cart for sale', 'e-z-go golf cart accessories', 'electric utility buggy', 'heavy duty golf cart'],
    h1: 'Cushman Utility Buggy for Sale: E-Z-GO Hauler PRO Lithium',
    seoTitle: 'Cushman Utility Cart for Sale: Buy the Hauler PRO Lithium',
    seoDescription: 'Shop a Cushman utility cart for sale. E-Z-GO Hauler PRO Lithium with 72V AC drive and 544kg towing, $21,500 inc GST, Yatala QLD.',
    short: 'Hauler PRO',
    closingHeading: 'Can I trial the Hauler PRO before I order?',
    intro:
      'Turf managers, schools and campuses searching for a cushman utility cart for sale want capacity with quiet running. The E-Z-GO Cushman Hauler PRO Lithium has a 72V AC drive, a 544kg towing capacity and an optional electric dump bed. It is $21,500 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a 72V AC drive matter?',
        body: 'The Hauler PRO runs a 72V AC drive rather than the 48V systems common elsewhere in the range, and higher system voltage is what lets it move heavy loads at lower current, running cooler and holding performance through a full working shift. A 544kg towing capacity covers turf equipment, trailers and grounds machinery, so this cushman electric utility cart suits a hard working day. Cooler running matters over a long shift, because a drivetrain that is not working hard keeps its performance late in the day.',
      },
      {
        heading: 'What does the optional electric dump bed change?',
        body: 'The optional electric dump bed is the feature that changes the working day: tipping a load of sand, mulch or clippings becomes a button rather than a shovel, which is the difference between one trip and one trip plus twenty minutes. For grounds teams moving material all day, that saves real time and effort across a week of work. That saves time on every trip and spares the operator a repetitive, tiring task.',
      },
      {
        heading: 'Who chooses an electric utility buggy like the Hauler PRO?',
        body: 'Turf managers, schools and university campuses choose it for the combination of capacity and quiet, fume-free operation around students and public areas. It has a commercial drivetrain rather than a passenger-buggy one. Ask the Yatala desk about e-z-go golf cart accessories, and tell us your loads so we can confirm the right configuration. Students, staff and the public share these spaces, and an electric vehicle keeps noise and fumes out of them. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. If you are replacing an older buggy, tell us what you drive now and we will compare it.',
      },
    ],
    faqs: [
      { q: 'How much is a Cushman utility cart for sale like the Hauler PRO?', a: 'The E-Z-GO Cushman Hauler PRO Lithium is $21,500 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is the Hauler PRO a Cushman electric utility cart?', a: 'Yes. It is an electric lithium utility vehicle with a 72V AC drive, built for turf, schools and campuses.' },
      { q: 'Can I buy an E-Z-GO golf cart for sale with Australian support?', a: 'Yes. We supply the Hauler PRO from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Are E-Z-GO golf cart accessories available for it?', a: 'Ask the Yatala desk. We list accessories across our range and can confirm what suits the Hauler PRO.' },
      { q: 'Is this an electric utility buggy that can tow?', a: 'Yes. It has a 544kg towing capacity for turf equipment, trailers and grounds machinery.' },
      { q: 'Can I trial a heavy duty golf cart before buying?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial demonstration.' },
    ],
  },

  'yamaha-umax-rally-efi-petrol': {
    primaryKeyword: 'golf buggy petrol for sale',
    supportingKeywords: ['yamaha golf cart for sale', 'yamaha golf cart australia', 'side by side farm buggy', 'petrol golf carts for sale', 'golf cart petrol for sale'],
    h1: 'Golf Buggy Petrol for Sale: Yamaha UMAX Rally EFI',
    seoTitle: 'Golf Buggy Petrol for Sale: Buy the Yamaha UMAX Rally',
    seoDescription: 'Shop a golf buggy petrol for sale. Yamaha UMAX Rally with 402cc EFI engine and under-hood storage, $18,900 inc GST, from Yatala QLD.',
    short: 'UMAX Rally',
    closingHeading: 'Can I trial the UMAX Rally before I order?',
    intro:
      'Livestock properties and regional venues looking for a golf buggy petrol for sale want a workhorse. The Yamaha UMAX Rally EFI Petrol has a 402cc EFI engine sized for sustained duty, a side-filling fuel tank, bucket seats and under-hood dry storage. It is $18,900 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does a 402cc engine matter for sustained work?',
        body: 'The UMAX Rally is Yamaha commercial workhorse, powered by a 402cc EFI engine sized for sustained duty rather than short bursts. Livestock properties and large regional venues run these hard for long days. Electronic fuel injection keeps starting reliable through cold mornings and hot afternoons alike, which matters when the vehicle is part of the day routine and you do not want to nurse it. Large engines are not stressed by long days, which helps reliability when a vehicle is in use from first light.',
      },
      {
        heading: 'What do the side-filling tank and under-hood storage do?',
        body: 'A side-filling fuel tank means refuelling without climbing over the bed or unloading first, and substantial under-hood dry storage keeps tools, medications, tags and paperwork out of the weather rather than sliding loose in an open tray. Details like these are what separate a petrol golf cart for sale built for farm work from a passenger model with a tray added. Fewer stops to unload and reload means more time on the actual job.',
      },
      {
        heading: 'Is it a good side by side farm buggy alternative?',
        body: 'Bucket seats hold you in place across paddock ground instead of letting you slide with every camber change. If you are comparing a side by side farm buggy with a Yamaha golf cart for sale, remember this model is built for paddock duty with a golf-cart footprint. Tell us your terrain and loads and we will confirm the Rally suits. Paddock ground is rough and uneven, and good seating is part of keeping a driver alert. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our team can answer questions on delivery, parts and warranty before you commit. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is a golf buggy petrol for sale like the Yamaha UMAX Rally?', a: 'The Yamaha UMAX Rally EFI Petrol is $18,900 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is this a Yamaha golf cart for sale with a big engine?', a: 'Yes. It has a 402cc Yamaha EFI engine sized for sustained duty on livestock properties and large venues.' },
      { q: 'Are Yamaha golf cart Australia buyers supported locally?', a: 'Yes. We supply the UMAX Rally from our Yatala QLD depot with Australian warranty support, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is it a side by side farm buggy?', a: 'It is a petrol utility buggy with a golf-cart footprint, bucket seats and under-hood dry storage, built for paddock work.' },
      { q: 'Are petrol golf carts for sale like this available with a trial?', a: 'Yes. Vehicles over $15,000 include a complimentary on-farm trial demonstration.' },
      { q: 'Why choose a golf cart petrol for sale over electric?', a: 'Petrol gives range and quick refuelling for long days away from power. Tell us your use and we will advise.' },
    ],
  },

  'mgi-2024-zip-x5-36-hole-lithium': {
    primaryKeyword: 'mgi x5',
    supportingKeywords: ['mgi accessories', 'mgi spare parts', 'mgi golf buggy sale', 'motorised golf buggy for sale', 'mgi golf buggy for sale'],
    h1: 'MGI X5 Golf Buggy: 2024 Zip X5 36-Hole Lithium',
    seoTitle: 'MGI X5 Golf Buggy: Buy the 2024 Zip X5 36-Hole Lithium',
    seoDescription: 'Buy the MGI X5 golf buggy. 2024 Zip X5 with 36-hole lithium battery, downhill speed control and electronic park brake, $1,875 inc GST.',
    short: 'Zip X5',
    closingHeading: 'Where can I buy the MGI Zip X5 in Australia?',
    intro:
      'The mgi x5 is built for golfers who play long days. The 2024 MGI Zip X5 carries a 36-hole lithium battery, so a second round does not become a range calculation. It adds downhill speed control, an electronic park brake and a distance control function. It is $1,875 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'What does downhill speed control do?',
        body: 'Downhill speed control is the feature that earns its keep on hilly courses. Rather than running away from you and forcing a jog, the buggy holds a steady walking pace on descents automatically. That means you walk at your own speed down a slope, with the bag following calmly behind, instead of chasing it or holding it back by hand. It is one of the main reasons golfers choose a motorised buggy at all.',
      },
      {
        heading: 'How do the park brake and distance control help?',
        body: 'An electronic park brake holds the buggy in place on a slope while you play your shot, instead of chocking a wheel or angling it across the hill. Distance control lets you send it forward a set distance and have it stop on its own. Together they take the small, repeated chores out of a round and let you concentrate on the next shot, which suits mgi accessories buyers who like a tidy setup.',
      },
      {
        heading: 'Who buys an mgi golf buggy for sale like the Zip X5?',
        body: 'It is for golfers who play volume golf rather than occasional rounds, including 36-hole days and weekly competitions. It is straightforward and well-sorted, and the 36-hole battery means you are not planning around a charge between rounds. If you are comparing a motorised golf buggy for sale across the MGI range, tell us how often you play and how hilly the course is, and we will confirm the X5 suits. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. You can ask us for current availability, because we hold stock at our Yatala QLD depot. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI X5 in Australia?', a: 'The MGI 2024 Zip X5 36-Hole Lithium is $1,875 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are MGI spare parts and accessories available?', a: 'Yes. MGI batteries, chargers, remotes and accessories are held in Australian stock at our Yatala QLD depot, so a worn consumable does not mean replacing the buggy.' },
      { q: 'Is this an MGI golf buggy for sale with a 36-hole battery?', a: 'Yes. The Zip X5 carries a 36-hole lithium battery, so a second round is not a range calculation.' },
      { q: 'What do MGI accessories add to the Zip X5?', a: 'We list MGI accessories across our range, such as holders, covers and bags. Tell us your model and we will confirm what suits.' },
      { q: 'Is the Zip X5 one of the motorised golf buggies for sale with a park brake?', a: 'Yes. An electronic park brake holds it on a slope while you play your shot.' },
      { q: 'Is it a good MGI golf buggy sale pick for hilly courses?', a: 'Yes. Downhill speed control holds a steady walking pace on descents automatically.' },
    ],
  },

  'powakaddy-fx7-gps-lithium': {
    primaryKeyword: 'powakaddy electric golf trolley',
    supportingKeywords: ['gps electric golf trolley', 'gps golf trolley', 'golf buggy gps', 'golf gps trolley', 'golf cart gps screen'],
    h1: 'PowaKaddy Electric Golf Trolley: FX7 GPS Lithium',
    seoTitle: 'PowaKaddy Electric Golf Trolley: Buy the FX7 GPS Lithium',
    seoDescription: 'Buy a PowaKaddy electric golf trolley. FX7 GPS Lithium with 3.5-inch colour touchscreen and 30V plug-and-play battery, $2,099 inc GST.',
    short: 'FX7',
    closingHeading: 'Where can I buy the PowaKaddy FX7 in Australia?',
    intro:
      'A powakaddy electric golf trolley brings UK engineering to the walk-behind category. The PowaKaddy FX7 GPS Lithium has a 3.5-inch OCA full colour touchscreen preloaded with over 40,000 courses worldwide and a high-power 30V plug-and-play lithium system. It is $2,099 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does the 3.5-inch OCA screen matter on a gps electric golf trolley?',
        body: 'The screen comes preloaded with over 40,000 courses worldwide, so it works on your home course and on holiday without a subscription hunt or a manual download before every round. OCA bonding is the reason it stays readable in Australian sunlight where cheaper laminated screens wash out. For golfers comparing a gps electric golf trolley, a screen you can read at noon is worth more than extra features you cannot see. Readable data is the whole point of a screen, and a display that fades in the sun is no help on a long afternoon.',
      },
      {
        heading: 'What does the plug-and-play lithium system change?',
        body: 'The high-power 30V plug-and-play lithium system fits and removes without tools. That matters when the buggy lives in a car boot between rounds and the battery comes inside to charge. There is no cabling to fiddle with at the club car park, and no heavy lead-acid block to lift. It keeps the routine simple, which is what most golfers want from a gps golf trolley. It also means one person can set up the buggy quickly at the car, without waiting for a battery to be cabled in.',
      },
      {
        heading: 'Who should choose the FX7?',
        body: 'Tech-focused golfers who want the data on the buggy rather than the wrist. If you already carry a watch or a rangefinder, the FX7 puts distances on a bigger screen where you can read them without stopping. Tell us how you play, whether you travel with your equipment and which courses you use, and we will confirm the FX7 suits you before you order. The FX7 is aimed at players who like numbers on the course and want them in one clear place. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our team can answer questions on delivery, parts and warranty before you commit.',
      },
    ],
    faqs: [
      { q: 'How much is a PowaKaddy electric golf trolley like the FX7?', a: 'The PowaKaddy FX7 GPS Lithium is $2,099 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is the FX7 a GPS electric golf trolley with course maps?', a: 'Yes. Its 3.5-inch colour touchscreen is preloaded with over 40,000 courses worldwide.' },
      { q: 'Does this GPS golf trolley work in bright sunlight?', a: 'OCA bonding keeps the screen readable in Australian sunlight where cheaper laminated screens wash out.' },
      { q: 'Does it include golf buggy GPS without a subscription?', a: 'The courses are preloaded, so there is no download hunt before each round. Ask the Yatala desk about updates.' },
      { q: 'Is it a golf GPS trolley with a removable battery?', a: 'Yes. The 30V plug-and-play lithium system fits and removes without tools.' },
      { q: 'Does the golf cart GPS screen fold away?', a: 'Ask the Yatala desk about the fold and carry details for the FX7. We confirm before you order.' },
    ],
  },

  'robera-pro-follow-remote-golf-buggy': {
    primaryKeyword: 'electric follow golf cart',
    supportingKeywords: ['remote control electric golf buggy', 'golf buggy with remote', 'golf cart with remote', 'remote controlled golf buggy', 'follow electric golf cart'],
    h1: 'Electric Follow Golf Buggy: Robera Pro Follow Remote',
    seoTitle: 'Electric Follow Golf Cart: Buy the Robera Pro Follow Remote',
    seoDescription: 'Buy an electric follow golf cart. Robera Pro with smart follow tag, dual-mode remote and all-terrain dual motors, $2,799 inc GST.',
    short: 'Robera Pro',
    closingHeading: 'Where can I buy the Robera Pro in Australia?',
    intro:
      'An electric follow golf cart removes the last bit of effort from a round. The Robera Pro Follow Remote Golf Buggy is the only buggy in our range that needs no input once you start walking. A smart tracking tag clips to your belt and the buggy follows at a safe distance. It is $2,799 AUD including GST.',
    sections: [
      {
        heading: 'How does the smart follow tag work on a follow electric golf cart?',
        body: 'The tag clips to your belt and the buggy follows your footsteps at a safe distance, so there is no remote to hold, no dial to adjust and nothing to think about between shots. That is the point of a follow buggy: you walk unencumbered. When you do want direct control, dual-mode remote operation is still there, which makes it a flexible golf buggy with remote as well. That freedom is most noticeable on long holes, where a remote in the hand would otherwise be one more thing to carry.',
      },
      {
        heading: 'Why do dual motors matter for following?',
        body: 'All-terrain dual motors supply the independent drive that follow mode needs to hold a line across slopes and around obstacles rather than cutting corners. A follower that drifts or slips is annoying, so the drivetrain matters as much as the tag. If you are comparing a remote controlled golf buggy with a follower, the dual motors are the reason the Robera Pro can do both well. A buggy that follows well also needs to stop and start smoothly, and the drive system has to be capable of both.',
      },
      {
        heading: 'Who is the Robera Pro for?',
        body: 'Premium buyers who have decided the point of walking is to walk unencumbered. Hands-free follow technology is the feature worth the step up from a standard remote model. If you are weighing it against a standard remote model, tell us about your course, your pace and how much you value hands-free play, and we will confirm the Robera Pro is the right choice. The extra cost buys convenience, and only you can judge how much hands-free play is worth. Tell us how you will use it and we will confirm it suits before you order. Our team can answer questions on delivery, parts and warranty before you commit.',
      },
    ],
    faqs: [
      { q: 'How much is an electric follow golf cart like the Robera Pro?', a: 'The Robera Pro Follow Remote Golf Buggy is $2,799 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is it a remote control electric golf buggy as well?', a: 'Yes. Dual-mode remote operation is still available when you want direct control.' },
      { q: 'Is this a golf buggy with remote and follow mode?', a: 'Yes. A smart tracking tag clips to your belt and the buggy follows your footsteps at a safe distance.' },
      { q: 'Can I buy a golf cart with remote that follows me?', a: 'Yes. The Robera Pro follows you automatically and can also be steered by remote.' },
      { q: 'Is it a remote controlled golf buggy for hilly courses?', a: 'All-terrain dual motors give the independent drive needed to hold a line across slopes and around obstacles.' },
      { q: 'Is a follow electric golf cart worth the extra cost?', a: 'It is for buyers who want no input at all. Tell us how you play and we will advise whether a standard remote model is enough.' },
    ],
  },

  'mgi-zip-x1-lithium-buggy': {
    primaryKeyword: 'mgi golf buggy for sale',
    supportingKeywords: ['mgi accessories', 'mgi spare parts', 'motorised golf buggy for sale', 'cheap golf buggy', 'electric golf buggy for sale'],
    h1: 'MGI Golf Buggy for Sale: Zip X1 Lithium Entry Buggy',
    seoTitle: 'MGI Golf Buggy for Sale: Buy the Zip X1 Lithium Buggy',
    seoDescription: 'Shop an MGI golf buggy for sale. Zip X1 Lithium with simple speed dial, Click and Go battery and compact fold, $1,299 inc GST.',
    short: 'Zip X1',
    closingHeading: 'Where can I buy the MGI Zip X1 in Australia?',
    intro:
      'Most Australians who move from pushing to motorised start with an mgi golf buggy for sale like this. The MGI Zip X1 Lithium has a single variable speed dial, a Click and Go lithium battery and a compact fold. It is deliberately uncomplicated, $1,299 AUD including GST, and supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why is a single speed dial an advantage?',
        body: 'A single variable speed dial is the entire control interface, so there is no menu, no pairing and nothing to learn before your first round. For first-time motorised buyers, that is the reassurance they need. The real question is not what the buggy can do but whether it will be simple enough to use every week, and the Zip X1 answers that with one dial. Simplicity also means fewer things to go wrong, and fewer questions for a new owner to ask before the first round.',
      },
      {
        heading: 'How do the Click and Go battery and fold help?',
        body: 'The Click and Go lithium system drops the battery in and out without tools or cables, and the compact fold mechanism collapses the frame quickly for a standard car boot. Measure your boot before ordering and the rest takes care of itself. Spare batteries, chargers and mgi accessories are held in Australian stock, so ownership stays simple. Folding in seconds is helpful after a wet round, when you want the buggy in the boot and out of the rain.',
      },
      {
        heading: 'Who should buy a motorised golf buggy for sale like the Zip X1?',
        body: 'First-time motorised buyers who want an affordable step up from a push buggy. If you are searching for a cheap golf buggy that still uses lithium power and folds for the boot, the Zip X1 is the entry point in the MGI range. Tell us your boot size and how hilly your course is, and we will confirm it suits, or point you to a more capable model. The X1 is deliberately modest, and we will say so honestly if your course or bag needs more. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is an MGI golf buggy for sale like the Zip X1?', a: 'The MGI Zip X1 Lithium Buggy is $1,299 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Are MGI accessories and spare parts available for it?', a: 'Yes. MGI batteries, chargers, remotes and accessories are held in Australian stock at our Yatala QLD depot.' },
      { q: 'Is the Zip X1 a motorised golf buggy for sale with a simple control?', a: 'Yes. A single variable speed dial is the entire control interface.' },
      { q: 'Is it a cheap golf buggy that still uses lithium?', a: 'It is our entry electric model, with a Click and Go lithium battery system and a compact fold.' },
      { q: 'Is this an electric golf buggy for sale that fits a car boot?', a: 'The compact fold collapses the frame for a standard boot. Measure your boot before ordering.' },
      { q: 'Does it have MGI spare parts support?', a: 'Yes. Spare MGI parts are held in Australian stock, so a worn consumable does not mean replacing the buggy.' },
    ],
  },

  'eco-battery-48v-105ah-lithium-conversion-kit': {
    primaryKeyword: 'golf cart electric conversion kit',
    supportingKeywords: ['golf buggy battery replacement', 'golf buggy battery lithium', 'lithium battery for golf buggy', 'battery for golf buggy', 'golf buggy battery'],
    h1: 'Golf Buggy Electric Conversion Kit: Eco Battery 48V 105Ah Lithium',
    seoTitle: 'Golf Cart Electric Conversion Kit: Buy Eco Battery 48V',
    seoDescription: 'Buy a golf cart electric conversion kit. Eco Battery 48V 105Ah lithium with CAN-bus charger, digital gauge and 8-year warranty, $3,850 inc GST.',
    short: 'Eco Battery kit',
    closingHeading: 'Where can I buy the Eco Battery 48V conversion kit?',
    intro:
      'A golf cart electric conversion kit is the single upgrade that most transforms an ageing but sound buggy. The Eco Battery 48V 105Ah Lithium Conversion Kit is a complete drop-in conversion with a CAN-bus charger, digital gauge, mounting bracket and universal harness. It carries an 8-year warranty and is $3,850 AUD including GST.',
    sections: [
      {
        heading: 'What does the kit remove and what do you gain?',
        body: 'It removes roughly 140kg of lead-acid weight from an existing buggy and replaces it with a single lithium pack. That reduction is felt immediately in acceleration, hill climbing and range, because the motor is no longer hauling the battery bank around as dead mass. It also ends acid spills, terminal corrosion and the fortnightly water topping that lead-acid maintenance demands. Less weight also means less strain on the suspension and tyres, which helps an ageing buggy stay comfortable.',
      },
      {
        heading: 'Is it a complete golf buggy battery replacement?',
        body: 'The kit is genuinely complete: CAN-bus charger, digital gauge, mounting bracket and universal harness are all included, so there is no parts-chasing partway through the job. That makes it a straightforward replacement for owners who want one box and one invoice. Check that your buggy is a 48V system before you order, and send us the make, model and year. Having the charger and gauge in the box means the finished conversion works as a system from the first charge.',
      },
      {
        heading: 'Is the 8-year warranty a reason to choose lithium?',
        body: 'An 8-year warranty is a strong statement about confidence in the pack. For owners weighing lithium against another lead-acid replacement, the longer cover helps balance the higher upfront price. The kit suits buyers upgrading from lead-acid to lithium, and we are happy to talk through the job and whether it suits your buggy. Tell us your buggy\'s voltage and battery tray size and we will check the kit before you buy. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Enquiries are welcome from every state and territory.',
      },
    ],
    faqs: [
      { q: 'How much is a golf cart electric conversion kit like the Eco Battery?', a: 'The Eco Battery 48V 105Ah Lithium Conversion Kit is $3,850 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'What comes in the conversion kit?', a: 'A 48V 105Ah lithium pack with a CAN-bus charger, digital gauge, mounting bracket and universal harness.' },
      { q: 'Is it a good golf buggy battery lithium upgrade?', a: 'Yes. It removes roughly 140kg of lead-acid weight and ends acid spills, terminal corrosion and water topping.' },
      { q: 'Does it work as a golf buggy battery replacement for my model?', a: 'Send us the make, model and year of your buggy. We confirm the fit from Yatala before you order.' },
      { q: 'Is it a lithium battery for golf buggy owners with a warranty?', a: 'Yes. The kit carries an 8-year warranty, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Can I pay for this battery for golf buggy upgrades with Finance in 4?', a: 'Yes. At $3,850 it is over the $3,000 minimum, so you can split it into four interest-free instalments.' },
    ],
  },

  'roypow-72v-105ah-commercial-lithium-battery': {
    primaryKeyword: 'golf buggy battery replacement',
    supportingKeywords: ['lithium battery for golf buggy', 'golf buggy battery lithium', 'battery for golf buggy', 'golf buggy battery', 'electric golf buggy lithium battery'],
    h1: 'Golf Buggy Battery Replacement: RoyPow 72V 105Ah Commercial Lithium',
    seoTitle: 'Golf Buggy Battery Replacement: RoyPow 72V Commercial',
    seoDescription: 'Shop a golf buggy battery replacement. RoyPow 72V 105Ah commercial lithium pack with smart BMS and 5-year warranty, $4,700 inc GST.',
    short: 'RoyPow 72V pack',
    closingHeading: 'Where can I buy the RoyPow 72V commercial battery?',
    intro:
      'A golf buggy battery replacement for a 72V fleet needs commercial-duty cells. The RoyPow 72V 105Ah Commercial Lithium Battery Pack is a drop-in pack specified for resort fleets, security patrols and grounds teams. It has a smart BMS, thermal protection and a 5-year warranty, and is $4,700 AUD including GST.',
    sections: [
      {
        heading: 'Why does 72V suit commercial duty?',
        body: 'Higher system voltage moves the same load at lower current, so the pack and cabling run cooler and hold performance through a full working shift instead of fading toward the end of it. That is why resort fleets, security patrols and grounds teams end up on a 72V pack rather than 48V. Check that your vehicles are 72V systems before you order, and tell us the make and model. Fleet managers also benefit from fewer charging interruptions, because a pack that holds up through the shift keeps vehicles on the road.',
      },
      {
        heading: 'What does the smart BMS report on a lithium battery for golf buggy fleets?',
        body: 'Automotive-grade LiFePO4 cells and a smart BMS report state of charge and pack health rather than leaving you to infer them from how the vehicle feels. For a fleet manager, that visibility reduces surprises and unplanned downtime, and helps schedule charging. It is a major reason lithium fleets of this size pay back over time. Knowing the condition of every pack helps plan replacement before a failure ends a shift.',
      },
      {
        heading: 'How is the pack protected in the cold?',
        body: 'Integrated thermal protection guards against charging in freezing conditions, which matters for inland and alpine sites. The pack is a drop-in replacement, with a 5-year warranty and dispatch from our Yatala QLD depot. If you manage several vehicles, ask us about fleet pricing and combined freight, and tell us your duty cycle so we can confirm it suits. A drop-in design keeps installation straightforward, and our team can talk you through the fit. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is a golf buggy battery replacement like the RoyPow 72V pack?', a: 'The RoyPow 72V 105Ah Commercial Lithium Battery Pack is $4,700 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is it a lithium battery for golf buggy fleets?', a: 'Yes. It is specified for resort fleets, security patrols and grounds teams running 72V vehicles.' },
      { q: 'Is this a golf buggy battery lithium pack with a BMS?', a: 'Yes. A smart BMS reports state of charge and pack health.' },
      { q: 'Will this battery for golf buggy use fit my vehicle?', a: 'It is a 72V drop-in pack. Send us the make, model and year and we will confirm the fit before you order.' },
      { q: 'Is this a golf buggy battery with a warranty?', a: 'Yes. It carries a 5-year warranty, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is it an electric golf buggy lithium battery I can pay for with Finance in 4?', a: 'Yes. At $4,700 it is over the $3,000 minimum, so you can split it into four interest-free instalments.' },
    ],
  },

  'invicta-48v-50ah-lithium-drop-in-module': {
    primaryKeyword: 'electric golf trolley lithium battery',
    supportingKeywords: ['golf trolley battery', 'golf trolley battery replacement', 'lithium golf buggy', 'electric lithium golf trolley', 'lithium golf trolley'],
    h1: 'Electric Golf Trolley Lithium Battery: Invicta 48V 50Ah Module',
    seoTitle: 'Electric Golf Trolley Lithium Battery: Invicta 48V 50Ah',
    seoDescription: 'Shop an electric golf trolley lithium battery. Invicta 48V 50Ah drop-in module with parallel expansion and Bluetooth monitoring, $1,850 inc GST.',
    short: 'Invicta module',
    closingHeading: 'Where can I buy the Invicta 48V module?',
    intro:
      'An electric golf trolley lithium battery should fit the job, not oversize it. The Invicta 48V 50Ah Lithium Drop-in Module is a compact module designed to be linked rather than bought oversized, with parallel expansion and integrated Bluetooth monitoring. It is $1,850 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why is parallel expansion useful on a golf trolley battery replacement?',
        body: 'Parallel expansion capability means you can start with the capacity a light vehicle actually needs and add a second module later if the duty changes, instead of paying upfront for range you may never use. That keeps the first purchase modest and leaves a clear upgrade path. For buyers of a golf trolley lithium battery, that flexibility is the main appeal of the Invicta. A modular approach also reduces risk: you can test the system with one module before committing to more.',
      },
      {
        heading: 'Does a compact module help where space is tight?',
        body: 'That modularity also helps where physical space is tight and one large pack simply will not fit the existing battery tray. Two compact modules can be placed where one big pack cannot. Integrated Bluetooth monitoring reports state of charge and pack health to a phone, so you can see how a golf trolley battery is performing without opening anything. Bluetooth data makes it easier to spot an underperforming module early.',
      },
      {
        heading: 'Who should buy the Invicta module?',
        body: 'It suits walk-behind buggies, light utility vehicles and custom builds where a standard 105Ah pack is more battery than the application warrants. It is the sensible building block for compact or light-duty owners. If you are replacing a golf trolley battery or building a lithium golf buggy, tell us the vehicle, the voltage and the duty, and we will confirm the module suits. A modest first purchase can still grow into a larger system later. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. If you are replacing an older buggy, tell us what you drive now and we will compare it. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is an electric golf trolley lithium battery like the Invicta module?', a: 'The Invicta 48V 50Ah Lithium Drop-in Module is $1,850 AUD including GST. Freight is quoted separately against your delivery postcode at checkout, and the cart total is shown excluding freight.' },
      { q: 'Is it a golf trolley lithium battery I can expand later?', a: 'Yes. Parallel expansion capability lets you add a second module if the duty changes.' },
      { q: 'Does this golf trolley battery have monitoring?', a: 'Yes. Integrated Bluetooth monitoring reports state of charge and pack health to a phone.' },
      { q: 'Can it be a golf trolley battery replacement?', a: 'It is a 48V module for light vehicles. Send us the make, model and voltage and we will confirm the fit before you order.' },
      { q: 'Is it suitable for a lithium golf buggy build?', a: 'Yes. It is designed for walk-behind buggies, light utility vehicles and custom builds.' },
      { q: 'Is this an electric lithium golf trolley module with a warranty?', a: 'Australian Consumer Law guarantees apply. Ask the Yatala desk for the warranty details on this module.' },
    ],
  },

  'trojan-t-875-8v-deep-cycle-lead-acid-battery': {
    primaryKeyword: 'trojan golf buggy batteries',
    supportingKeywords: ['golf buggy battery replacement', 'battery for golf buggy', 'ezgo golf cart batteries', 'lead acid battery for golf trolley', 'golf trolley battery'],
    h1: 'Trojan Golf Buggy Batteries: T-875 8V Deep Cycle Lead Acid',
    seoTitle: 'Trojan Golf Buggy Batteries: Buy the T-875 8V Deep Cycle',
    seoDescription: 'Buy Trojan golf buggy batteries. Genuine T-875 8V deep cycle lead acid battery with Alpha Plus paste, $340 inc GST, held in stock at Yatala QLD.',
    short: 'T-875',
    closingHeading: 'Where can I buy the Trojan T-875 in Australia?',
    intro:
      'Fleet operators who have deliberately stayed with lead-acid look for trojan golf buggy batteries. The genuine Trojan T-875 8V Deep Cycle battery has Alpha Plus paste, T2 Technology and a high-capacity grid design. It is $340 AUD including GST and held in stock at our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why do fleets stay with lead-acid for a battery for golf buggy use?',
        body: 'The reasoning is sound: low upfront cost per vehicle, familiar charging infrastructure and batteries that any technician can test and replace individually rather than as a sealed pack. Clubs running larger fleets on established charging banks often find the economics still favour these. For a battery for golf buggy fleets with that setup, the T-875 remains the benchmark. Standardising on one battery type also simplifies spares, because the same replacement fits every vehicle in the fleet. Reliability matters most when vehicles are booked back to back.',
      },
      {
        heading: 'What do Alpha Plus paste and T2 Technology do for a golf trolley battery?',
        body: 'Trojan Alpha Plus paste formulation and T2 Technology target the plate degradation that ends most deep-cycle battery lives, delivering more usable cycles from the same footprint. The high-capacity grid design supports the deep discharge and recharge pattern that golf duty imposes daily. Together they are why a golf buggy battery replacement from Trojan is a familiar choice. More usable cycles from the same battery footprint lowers the cost per round over the life of the fleet.',
      },
      {
        heading: 'Is the T-875 right for my fleet?',
        body: 'It suits standard golf carts and fleets that want to keep lead-acid. Tell us the make, model and year, such as an ezgo golf cart batteries set, and how many batteries your vehicles take, and we will confirm the T-875 fits. If you would rather move to lithium, we can explain the conversion kits and drop-in packs we also supply. A technician can test and replace one battery at a time, which keeps repair costs predictable. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much are Trojan golf buggy batteries like the T-875?', a: 'The Trojan T-875 8V Deep Cycle Lead Acid Battery is $340 AUD including GST each. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Are these genuine Trojan batteries?', a: 'Yes. These are genuine Trojan T-875s, held in stock at our Yatala QLD depot.' },
      { q: 'Is it a golf buggy battery replacement for fleets?', a: 'Yes. Fleet operators who stay with lead-acid use the T-875 as a benchmark replacement battery.' },
      { q: 'Will this battery for golf buggy models fit mine?', a: 'It is an 8V battery. Send us the make, model and year and we will confirm how many you need and that they fit.' },
      { q: 'Does it suit ezgo golf cart batteries replacement?', a: 'Many E-Z-GO vehicles use 8V batteries. Send us your model and we will confirm.' },
      { q: 'Why choose a lead acid battery for golf trolley and buggy fleets?', a: 'Low upfront cost, familiar charging and individual replacement. Ask us if lithium would suit your fleet better.' },
    ],
  },

  'delta-q-quiq-48v-smart-on-board-charger': {
    primaryKeyword: 'on board golf cart charger',
    supportingKeywords: ['golf buggy charger', 'golf cart charger', 'ezgo golf cart charger', 'golf cart charger for sale', 'e-z-go golf cart charger'],
    h1: 'On Board Golf Buggy Charger: Delta-Q QuiQ 48V Smart',
    seoTitle: 'On Board Golf Cart Charger: Buy the Delta-Q QuiQ 48V',
    seoDescription: 'Buy an on board golf cart charger. Delta-Q QuiQ 48V smart charger with IP66 sealed enclosure and multi-profile algorithms, $680 inc GST.',
    short: 'Delta-Q QuiQ',
    closingHeading: 'Where can I buy the Delta-Q QuiQ in Australia?',
    intro:
      'An on board golf cart charger lives on the vehicle, so it has to be tough. The Delta-Q QuiQ 48V Smart On-Board Charger has an IP66 sealed weatherproof enclosure and multiple pre-loaded charging algorithms. It suits E-Z-GO RXV and TXT owners replacing a charger, and is $680 AUD including GST.',
    sections: [
      {
        heading: 'Why does an IP66 sealed enclosure matter?',
        body: 'An IP66 sealed enclosure is the specification that matters for an on-board charger in Australia. On-board means the charger lives on the vehicle, so it endures wash-downs, rain, dust and the vibration of rough ground rather than sitting safe on a shelf. IP66 rates it against powerful water jets and total dust ingress, which is what a working golf buggy charger needs. That durability is what you pay for in an on-board unit, because a charger that fails stops the vehicle completely.',
      },
      {
        heading: 'What do multi-profile algorithms do in an ezgo golf cart charger?',
        body: 'The QuiQ carries multiple pre-loaded charging algorithms, which lets one charger serve lead-acid, AGM and lithium packs correctly as a mixed fleet transitions rather than forcing a matched charger for each chemistry. Selecting the right profile matters: charging a battery on the wrong algorithm is the fastest way to shorten its life. This is useful for any charger bought as a long-term replacement. Fleets in transition can keep one charger type while batteries change, which simplifies stock.',
      },
      {
        heading: 'Who should buy the Delta-Q QuiQ?',
        body: 'E-Z-GO RXV and TXT owners needing a charger replacement, and fleets moving between battery types. If you are searching for a replacement, tell us the model, the battery type and the voltage, and we will confirm the QuiQ suits before you order. It is built for the conditions, not for a shelf. Tell us the battery type, voltage and model and we will confirm before you order. If you are replacing an older buggy, tell us what you drive now and we will compare it. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is an on board golf cart charger like the Delta-Q QuiQ?', a: 'The Delta-Q QuiQ 48V Smart On-Board Charger is $680 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a golf buggy charger for lithium and lead-acid?', a: 'Yes. Multiple pre-loaded algorithms let it charge lead-acid, AGM and lithium packs correctly.' },
      { q: 'Is it a good golf cart charger for wet conditions?', a: 'Yes. An IP66 sealed enclosure rates it against powerful water jets and total dust ingress.' },
      { q: 'Will it work as an ezgo golf cart charger?', a: 'It suits E-Z-GO RXV and TXT owners. Send us your model and we will confirm the fit.' },
      { q: 'Is this a golf cart charger for sale in Australia with support?', a: 'Yes. We supply it from our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Is it an E-Z-GO golf cart charger replacement?', a: 'It is a 48V smart charger for E-Z-GO RXV and TXT owners needing a replacement.' },
    ],
  },

  'club-car-eric-48v-high-frequency-charger': {
    primaryKeyword: 'club car golf cart charger',
    supportingKeywords: ['club car golf cart battery charger', 'golf cart charger', 'golf buggy charger', 'golf cart charger for sale', 'club car golf cart'],
    h1: 'Club Car Golf Buggy Charger: ERIC 48V High-Frequency',
    seoTitle: 'Club Car Golf Cart Charger: Buy the ERIC 48V High-Frequency',
    seoDescription: 'Buy a Club Car golf cart charger. Genuine OEM ERIC 48V high-frequency charger with automatic voltage compensation, $590 inc GST.',
    short: 'ERIC charger',
    closingHeading: 'Where can I buy the Club Car ERIC charger?',
    intro:
      'A club car golf cart charger should speak to the vehicle natively. The genuine Club Car ERIC 48V High-Frequency Charger is built around high-frequency switching rather than the older transformer design. It has automatic voltage compensation and global AC input compatibility, and is $590 AUD including GST.',
    sections: [
      {
        heading: 'Why is a high-frequency design lighter?',
        body: 'High-frequency switching is why it weighs a fraction of a conventional charger of the same output, which matters if it is carried between vehicles or lifted onto a bench regularly. For workshops and clubs that move chargers around, a lighter unit is a practical advantage. It is also why a charger of this type is easy to store. Lighter equipment is also easier on a workshop bench and on the people lifting it.',
      },
      {
        heading: 'What does automatic voltage compensation do on a club car golf cart battery charger?',
        body: 'Automatic voltage compensation adjusts for the supply it is given, so it charges correctly on a long extension lead or a rural supply that sags under load, situations where a fixed-output charger delivers an incomplete charge and slowly ruins the pack. Global AC input compatibility handles varying mains conditions. That reliability suits any charger used outside a tidy workshop. A charge that completes properly protects the battery pack and the money invested in it.',
      },
      {
        heading: 'Who should buy the ERIC?',
        body: 'Club Car Precedent and Tempo owners, as OEM equipment that speaks to Club Car onboard systems natively. If you need a replacement, send us the model and year and we will confirm the ERIC suits before you order. It is stocked at our Yatala QLD depot, so buying here means local stock rather than a long import wait. As an OEM part it matches the vehicle\'s own expectations, which removes guesswork. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is a Club Car golf cart charger like the ERIC?', a: 'The Club Car ERIC 48V High-Frequency Charger is $590 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a genuine Club Car golf cart battery charger?', a: 'Yes. It is the genuine OEM ERIC charger for Club Car Precedent and Tempo owners.' },
      { q: 'Is it a good golf cart charger on a long extension lead?', a: 'Yes. Automatic voltage compensation adjusts for a long lead or a supply that sags under load.' },
      { q: 'Is it a golf buggy charger that works worldwide?', a: 'Global AC input compatibility handles varying mains conditions. Ask us if you need it for a specific supply.' },
      { q: 'Can I find a golf cart charger for sale with local support?', a: 'Yes. We stock it at our Yatala QLD depot, and Australian Consumer Law guarantees apply on top.' },
      { q: 'Will it fit a Club Car golf cart I own?', a: 'It suits Club Car Precedent and Tempo models. Send us your model and year and we will confirm.' },
    ],
  },

  'mgi-24v-lithium-battery-36-hole': {
    primaryKeyword: 'mgi battery',
    supportingKeywords: ['mgi battery replacement', 'mgi zip navigator battery', 'mgi golf cart battery', 'mgi battery charger', 'mgi battery charger replacement'],
    h1: 'MGI Battery: 24V Lithium 36-Hole Replacement',
    seoTitle: 'MGI Battery: Buy the 24V Lithium 36-Hole Replacement',
    seoDescription: 'Buy the genuine MGI battery. 24V 380Wh lithium 36-hole replacement with advanced BMS for Zip Navigator and Ai Series, $450 inc GST.',
    short: 'MGI 24V battery',
    closingHeading: 'Where can I buy the MGI 24V 36-hole battery?',
    intro:
      'An mgi battery is a consumable, and a genuine replacement keeps the buggy working as designed. The MGI 24V Lithium Battery (24-Spindle / 36 Hole) is the factory 24V 380Wh unit for Zip Navigator and Ai Series buggies, with an advanced BMS and a Click and Go design. It is $450 AUD including GST.',
    sections: [
      {
        heading: 'When does a walk-behind battery need replacing?',
        body: 'Walk-behind batteries are consumables. After a few seasons of weekly rounds the pack no longer finishes eighteen holes with margin, and the honest fix is replacement rather than nursing it along. If your buggy is running short, or you are worried about being stranded on the back nine, a mgi battery replacement is the straightforward answer. The factory unit restores the range the buggy was designed to have. Weak range is usually the first sign, followed by a pack that does not hold charge between rounds.',
      },
      {
        heading: 'Why does the advanced BMS matter on an MGI Zip Navigator battery?',
        body: 'This is the factory 24V 380Wh unit with the correct advanced BMS, which matters because the BMS is what protects the cells and communicates correctly with the buggy electronics. A pack with the wrong management can charge badly or cut out unexpectedly. The Click and Go design also makes fitting tool-free, so you can swap the battery in minutes at home or at the club. Using the right battery also keeps the charger and the buggy electronics working together as intended.',
      },
      {
        heading: 'Why buy a genuine mgi golf cart battery?',
        body: 'Buying the genuine pack rather than an unbranded equivalent preserves both the buggy warranty position and its charging behaviour. It also means the pack matches the charger, which protects the cells over years of use. Genuine MGI parts are held in Australian stock at Yatala QLD. Tell us which MGI model you own and we will confirm this is the right pack. A new pack is a modest cost compared with replacing a buggy that is otherwise in good order. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is an MGI battery like the 24V 36-hole lithium?', a: 'The MGI 24V Lithium Battery (24-Spindle / 36 Hole) is $450 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this an MGI battery replacement for my buggy?', a: 'It is the genuine replacement for Zip Navigator and Ai Series buggies. Tell us your model and we will confirm the fit.' },
      { q: 'Is it the right MGI Zip Navigator battery?', a: 'Yes. It is the factory 24V 380Wh 36-hole unit for Zip Navigator and Ai Series buggies.' },
      { q: 'Is this a genuine MGI golf cart battery with BMS?', a: 'Yes. It has the correct advanced BMS to protect the cells and communicate with the buggy.' },
      { q: 'Does it need an MGI battery charger?', a: 'Use the matching MGI 24V lithium charger. We hold it in stock, and can supply both together.' },
      { q: 'Can I get an MGI battery charger replacement too?', a: 'Yes. We hold MGI chargers in Australian stock. Tell us your model and we will confirm which one suits.' },
    ],
  },

  'curtis-1268-400a-programmable-motor-controller': {
    primaryKeyword: 'electric golf cart controller',
    supportingKeywords: ['curtis controller golf cart', 'ezgo golf cart controller', 'club car golf cart controller', 'electric golf cart speed controller', 'golf buggy parts'],
    h1: 'Electric Golf Buggy Controller: Curtis 1268 400A Programmable',
    seoTitle: 'Electric Golf Cart Controller: Buy the Curtis 1268 400A',
    seoDescription: 'Buy an electric golf cart controller. Curtis 1268 400A programmable motor controller with regen braking control, $890 inc GST, Yatala QLD.',
    short: 'Curtis 1268',
    closingHeading: 'Where can I buy the Curtis 1268 controller?',
    intro:
      'An electric golf cart controller decides how much current reaches the motor, which makes it the real limit on a lifted or high-torque conversion. The Curtis 1268 400A Programmable Motor Controller raises that ceiling to 400 amps peak, with programmable curves and regenerative braking control. It is $890 AUD including GST.',
    sections: [
      {
        heading: 'Why does the controller limit a lifted conversion?',
        body: 'Fitting larger tyres and a lift kit increases the load on every hill, and a factory controller current-limits or overheats long before the motor does. Raising the ceiling to 400 amps peak lets the motor do the work it was built for. If your buggy struggles on steep acreage after a conversion, the controller is the first place to look, whatever the badge on the body. That mismatch is common: owners add the hardware they can see, then find the electrical limit they cannot.',
      },
      {
        heading: 'What do programmable curves change on a curtis controller golf cart?',
        body: 'The Curtis 1268 adds programmable acceleration and speed curves, so the buggy can be tuned for torque on steep acreage rather than left with a flat factory map. Tuning is where the hardware pays off: the same motor can feel quite different with a controller map matched to your tyres, your load and your ground. It is a well-known unit with parts and programming knowledge widely available in Australia. Programming lets a technician set smooth take-off, a firm hill response and a sensible top speed for your use.',
      },
      {
        heading: 'What does regenerative braking control add?',
        body: 'Regenerative braking control recovers energy on descents and adds an engine-braking feel, which helps on long downhill runs and takes some strain off the brakes. It suits lifted cart builders and performance tuners who understand the limits of a factory controller. Tell us your motor, voltage and the changes you have made, and we will confirm the 1268 is the right part before you order. It is a serious component, so a clear plan for fitting and tuning is worth having before you buy. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Questions are welcome before you buy, not just after.',
      },
    ],
    faqs: [
      { q: 'How much is an electric golf cart controller like the Curtis 1268?', a: 'The Curtis 1268 400A Programmable Motor Controller is $890 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a Curtis controller for golf cart conversions?', a: 'Yes. It is a heavy-duty 400-amp programmable controller aimed at lifted and high-torque conversions.' },
      { q: 'Will this EZGO golf cart controller upgrade fit my model?', a: 'Fit depends on your motor type and voltage. Send us the make, model and year and we will confirm.' },
      { q: 'Does it suit a Club Car golf cart controller replacement?', a: 'It can, depending on the motor and system voltage. Tell us your model and we will check.' },
      { q: 'Is it an electric golf cart speed controller I can tune?', a: 'Yes. It has programmable acceleration and speed curves and regenerative braking control.' },
      { q: 'Do you stock golf buggy parts for fitting it?', a: 'We list parts and accessories across our range. Ask the Yatala desk what else suits your build.' },
    ],
  },

  'navitas-600a-ac-controller-upgrade-kit': {
    primaryKeyword: 'golf cart controllers for sale',
    supportingKeywords: ['golf cart speed controller', 'electric golf cart speed controller', 'club car golf cart speed controller', 'golf buggy parts australia', 'yamaha golf cart speed controller'],
    h1: 'Golf Buggy Controllers for Sale: Navitas 600A AC Upgrade Kit',
    seoTitle: 'Golf Cart Controllers for Sale: Navitas 600A AC Upgrade',
    seoDescription: 'Shop golf cart controllers for sale. Navitas 600A AC controller upgrade kit with Bluetooth on-the-fly lockout control, $1,450 inc GST.',
    short: 'Navitas 600A kit',
    closingHeading: 'Where can I buy the Navitas 600A upgrade kit?',
    intro:
      'Owners looking at golf cart controllers for sale who want a decisive change often choose the Navitas 600A AC Controller Upgrade Kit. It delivers substantially higher top speed and the hill torque that heavy lifted buggies demand, with Bluetooth on-the-fly lockout control. It is $1,450 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'What does a 600-amp golf cart speed controller change?',
        body: 'A 600-amp AC controller is for owners who want a decisive change rather than a marginal one, delivering both substantially higher top speed and the hill torque that heavy lifted buggies demand. AC drive also brings smoother power delivery and better regenerative braking than a DC system. It suits owners who have already upgraded tyres or suspension and want the drivetrain to match. Choose it when a small tweak will not do, because the controller is the part that sets the ceiling for everything else.',
      },
      {
        heading: 'How does Bluetooth on-the-fly control work?',
        body: 'The feature that sets it apart is Bluetooth on-the-fly control: performance modes can be changed from a dashboard dial or a phone, so the same vehicle can run a restricted profile when guests, children or staff are driving and full output when you are. That lockout is a genuine safety consideration on a family property, and it keeps a fast buggy manageable for any driver. A restricted mode also gives you peace of mind when the buggy is lent out or driven by staff.',
      },
      {
        heading: 'Should I fit it myself?',
        body: 'Fitting is best handled by an experienced technician, because a controller sits at the heart of the electrical system. Check your motor type and system voltage before you order, and remember that higher speeds change braking and handling needs, so a golf cart speed controller upgrade should be matched to the rest of the vehicle. Tell us your model and plans and we will advise. Brakes, tyres and suspension should be checked at the same time, because faster vehicles need more stopping power. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Questions are welcome before you buy, not just after.',
      },
    ],
    faqs: [
      { q: 'How much are golf cart controllers for sale like the Navitas 600A kit?', a: 'The Navitas 600A AC Controller Upgrade Kit is $1,450 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a golf cart speed controller that raises top speed?', a: 'Yes. It delivers substantially higher top speed and hill torque. Check that your braking and tyres suit the extra performance.' },
      { q: 'Is it an electric golf cart speed controller with modes?', a: 'Yes. Bluetooth on-the-fly control changes performance modes from a dashboard dial or a phone.' },
      { q: 'Will it fit a Club Car golf cart speed controller position?', a: 'Fit depends on motor type and system voltage. Send us your model and we will confirm before you order.' },
      { q: 'Where can I get golf buggy parts Australia wide?', a: 'We supply parts and accessories from our Yatala QLD depot, with freight quoted to your postcode.' },
      { q: 'Does it suit a Yamaha golf cart speed controller upgrade?', a: 'It may, depending on your motor and voltage. Tell us your model and we will check.' },
    ],
  },

  'universal-48v-to-12v-30a-voltage-reducer': {
    primaryKeyword: 'golf cart dc converter',
    supportingKeywords: ['golf cart voltage reducer', 'voltage reducer for golf cart', 'electric golf cart voltage', 'golf cart voltage', '48v to 12v golf cart converter'],
    h1: 'Golf Buggy DC Converter: 48V to 12V 30A Voltage Reducer',
    seoTitle: 'Golf Cart DC Converter: Buy the 48V to 12V 30A Reducer',
    seoDescription: 'Buy a golf cart DC converter. Universal 48V/36V to 12V 30A voltage reducer, key-switch triggered, waterproof housing, $85 inc GST.',
    short: '48V to 12V reducer',
    closingHeading: 'Where can I buy the 48V to 12V voltage reducer?',
    intro:
      'Every accessory worth adding to a buggy runs on 12V, and the pack does not, which is why you need a golf cart dc converter. The Universal 48V/36V to 12V 30A Voltage Reducer steps the pack voltage down to a clean, regulated 12V supply. It is key-switch triggered, waterproof, and $85 AUD including GST.',
    sections: [
      {
        heading: 'What can a golf cart voltage reducer run?',
        body: 'It steps 48V down to a clean, regulated 12V supply at up to 30 amps, which is enough headroom for an LED light kit, a soundbar and USB charging together. That makes it the correct way to bridge the gap between a high-voltage pack and everyday accessories, and it suits anyone who searches for a golf cart voltage reducer to add lights, audio or a horn. Check the total current of your accessories against the 30 amp rating before you install.',
      },
      {
        heading: 'Why not tap one battery in the bank?',
        body: 'Tapping a single battery in the bank instead, which is the shortcut people take, unbalances the pack and shortens the life of every cell in it. A proper reducer draws from the whole pack, so the batteries age evenly. That is the reason to use a proper reducer rather than a quick wire to one battery. Even battery wear is the main benefit, and it is invisible until a pack fails early.',
      },
      {
        heading: 'What do key-switch triggering and the housing do?',
        body: 'Key-switch triggering means it powers down with the buggy rather than draining the pack overnight. The waterproof cast aluminium housing handles under-seat heat and moisture, so it can be mounted where wiring is neat and protected. It suits DIY builders adding lights, audio or horns. Check your pack voltage before ordering and tell us what accessories you plan to run. Mounting it under the seat keeps wiring short, tidy and away from the weather. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our team can answer questions on delivery, parts and warranty before you commit. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is a golf cart DC converter like this voltage reducer?', a: 'The Universal 48V/36V to 12V 30A Voltage Reducer is $85 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a golf cart voltage reducer for lights and audio?', a: 'Yes. Up to 30 amps of regulated 12V is enough for an LED light kit, a soundbar and USB charging together.' },
      { q: 'Is it a voltage reducer for golf cart packs of 48V or 36V?', a: 'Yes. It is a universal reducer for 48V or 36V packs. Check your pack voltage before ordering.' },
      { q: 'What is the electric golf cart voltage it can handle?', a: 'It steps a 48V or 36V pack down to 12V. Send us your vehicle details if you are unsure.' },
      { q: 'Will it drain the pack when parked?', a: 'No. It is key-switch triggered, so it powers down with the buggy rather than draining the pack overnight.' },
      { q: 'Can I use it as a 48V to 12V golf cart converter for a soundbar?', a: 'Yes. It is designed to supply 12V accessories such as soundbars, lights and USB chargers.' },
    ],
  },

  'madjax-alpha-lux-street-legal-led-light-kit': {
    primaryKeyword: 'golf cart lights',
    supportingKeywords: ['golf cart street legal kit', 'light kit for club car golf cart', 'yamaha golf cart light kit', 'golf buggy accessories australia', 'electric street legal golf cart'],
    h1: 'Golf Buggy Lights: MadJax Alpha Lux LED Light Kit',
    seoTitle: 'Golf Cart Lights: Buy the MadJax Alpha Lux LED Kit',
    seoDescription: 'Buy golf cart lights. MadJax Alpha Lux LED kit with projector headlights, turn signals, hazards, horn and brake switch, $320 inc GST.',
    short: 'Alpha Lux kit',
    closingHeading: 'Where can I buy the MadJax Alpha Lux light kit?',
    intro:
      'Golf cart lights should be a complete package, not a pair of headlights. The MadJax Alpha Lux LED Light Kit includes LED projector headlights, sequential turn signals, hazard lights, a brake switch and a mechanical horn. It is $320 AUD including GST, supplied with mounting hardware from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why is a complete lighting package better?',
        body: 'A complete lighting package matters if the buggy is used on private estate roads shared with vehicles. It includes automotive LED projector headlights, sequential turn signals, hazard lights, a brake switch and a mechanical horn, which together cover the signalling equipment normally expected for legitimate road use. Buying it as a kit means the parts are designed to work together. Buying a kit also saves chasing separate lamps, switches and relays, and it keeps the wiring consistent.',
      },
      {
        heading: 'What do projector optics do?',
        body: 'Projector optics put light where it is needed with a defined cut-off rather than scattering glare at oncoming drivers. That makes night driving safer for you and more considerate for everyone else. For gated estate drivers who use their buggy after dark, it is a major improvement over a basic lamp, and it works with many club car and yamaha light kit layouts. Better beam control matters most on narrow estate roads, where oncoming drivers are close.',
      },
      {
        heading: 'Is a golf cart street legal kit enough to make a buggy road legal?',
        body: 'No. Conditional registration requirements differ by state, so confirm what your state requires before assuming a kit alone makes a buggy road legal. We do not label any buggy road legal. Read our registration guide, check with your state authority and tell us your buggy so we can confirm the kit fits. Those steps matter more than the hardware. A kit is only part of the picture, because registration, insurance and equipment rules vary by state and council. We would rather you check first than fit parts you cannot use on the roads you drive. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much are golf cart lights like the MadJax Alpha Lux kit?', a: 'The MadJax Alpha Lux LED Light Kit is $320 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a golf cart street legal kit?', a: 'It contains the signalling equipment normally expected, but we do not label any buggy road legal. Check your state rules.' },
      { q: 'Is this a light kit for club car golf cart models?', a: 'Fit depends on your model. Send us the make, model and year and we will confirm before you order.' },
      { q: 'Can it work as a Yamaha golf cart light kit?', a: 'It may, depending on your model. Tell us your buggy and we will check the fit.' },
      { q: 'What golf buggy accessories Australia buyers add with it?', a: 'Many add mirrors and seatbelts. Ask the Yatala desk about our safety accessories.' },
      { q: 'Does it make an electric street legal golf cart?', a: 'No kit alone does. Registration requirements differ by state, so confirm with your authority.' },
    ],
  },

  'heavy-duty-4-wheel-hydraulic-disc-brake-kit': {
    primaryKeyword: 'golf cart brake parts',
    supportingKeywords: ['ezgo golf cart brakes', 'club car golf cart brakes', 'yamaha golf cart brakes', 'golf buggy parts', 'golf buggy parts australia'],
    h1: 'Golf Buggy Brake Parts: Heavy Duty 4-Wheel Hydraulic Disc Kit',
    seoTitle: 'Golf Cart Brake Parts: Heavy Duty 4-Wheel Hydraulic Kit',
    seoDescription: 'Buy golf cart brake parts. Heavy duty 4-wheel hydraulic disc brake kit with dual-piston calipers and stainless lines, $750 inc GST.',
    short: 'disc brake kit',
    closingHeading: 'Where can I buy the 4-wheel disc brake kit?',
    intro:
      'Factory rear drum brakes are the weakest point on most buggies, which is why many owners look for golf cart brake parts. The Heavy Duty 4-Wheel Hydraulic Disc Brake Kit replaces all four corners with dual-piston hydraulic calipers on stainless steel lines. It is a direct bolt-on, $750 AUD including GST.',
    sections: [
      {
        heading: 'Why do drum brakes become inadequate?',
        body: 'Drum brakes become genuinely inadequate once a lift kit, larger tyres, extra seats or a loaded cargo tray increase the mass being stopped. Drums also fade when hot and hold water after wet grass, which is precisely when you need them. If you have modified the vehicle, the original brakes may not match the weight and speed you now have, and upgrading is a safety decision. Heavy loads, steep descents and wet ground are exactly the conditions where drums fade and stopping distances grow.',
      },
      {
        heading: 'What do dual-piston calipers and stainless lines add over ezgo golf cart brakes?',
        body: 'The kit replaces all four corners with dual-piston hydraulic calipers on stainless steel lines, giving consistent, repeatable stopping that does not deteriorate down a long descent. Stainless lines resist the corrosion that causes soft pedal feel over time. Whatever the make of the original system, a hydraulic disc setup is a notable step up in confidence. Consistent pedal feel is what gives a driver confidence on a long hill, and it is the main benefit of a hydraulic disc setup.',
      },
      {
        heading: 'Is it a direct bolt-on?',
        body: 'Direct bolt-on fitment means no fabrication, but brakes are a safety system, so have the work done by an experienced technician. If you have lifted a buggy, this is the upgrade to pair with it. Tell us your make, model and year and we will confirm the kit suits. Brakes are not a part to save money on, so use a competent installer and test carefully after fitting. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. You can ask us for current availability, because we hold stock at our Yatala QLD depot.',
      },
    ],
    faqs: [
      { q: 'How much are golf cart brake parts like this hydraulic disc kit?', a: 'The Heavy Duty 4-Wheel Hydraulic Disc Brake Kit is $750 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does it replace EZGO golf cart brakes?', a: 'It replaces all four corners with hydraulic discs. Send us your model and we will confirm the fit.' },
      { q: 'Will it work on Club Car golf cart brakes?', a: 'Fit depends on the model. Tell us the make, model and year before you order.' },
      { q: 'Is it suitable for Yamaha golf cart brakes?', a: 'It may be, depending on the model. Ask the Yatala desk to confirm.' },
      { q: 'Do you stock other golf buggy parts for a lifted build?', a: 'Yes. We list parts and accessories across our range. Ask us what pairs with the kit.' },
      { q: 'Do you supply golf buggy parts Australia wide?', a: 'Yes. We supply from our Yatala QLD depot and quote freight to your postcode.' },
    ],
  },

  'all-weather-heavy-duty-pvc-enclosure': {
    primaryKeyword: 'golf buggy enclosures for sale',
    supportingKeywords: ['ezgo golf cart enclosure', 'golf buggy rain cover', 'yamaha golf cart enclosure', 'golf buggy accessories australia', 'ez go golf cart enclosure'],
    h1: 'Golf Buggy Enclosures for Sale: All-Weather Heavy-Duty PVC',
    seoTitle: 'Golf Buggy Enclosures for Sale: All-Weather PVC Enclosure',
    seoDescription: 'Shop golf buggy enclosures for sale. All-weather heavy-duty PVC enclosure with roll-up windows and heavy-duty zippers, $290 inc GST.',
    short: 'PVC enclosure',
    closingHeading: 'Where can I buy the all-weather PVC enclosure?',
    intro:
      'Owners searching for golf buggy enclosures for sale want to use the buggy all year. The All-Weather Heavy-Duty PVC Enclosure is a four-sided enclosure with clear marine vinyl roll-up windows, heavy-duty zippers and reinforced brass eyelets. It is $290 AUD including GST, with universal fit options.',
    sections: [
      {
        heading: 'Why does a four-sided enclosure help?',
        body: 'A four-sided enclosure turns a buggy into a usable vehicle through winter mornings, wet season downpours and dusty afternoons, which for most owners is the difference between using it year round and leaving it in the shed. It works as a rain cover and a wind break in one, which matters for older drivers and anyone on a cold early round. On a cold morning round, the difference is obvious within the first few holes. It also protects clothing and clubs from rain, and it keeps wind off the driver, which makes the buggy useful in more weather.',
      },
      {
        heading: 'Why does marine vinyl matter on a golf buggy rain cover?',
        body: 'The clear marine-grade vinyl windows roll up individually, so ventilation can be adjusted rather than being an all-or-nothing choice. Marine vinyl is specified because standard clear PVC yellows and cracks under Australian UV within a season or two. That is why a good golf buggy rain cover or enclosure is judged by its vinyl first. Cheap vinyl hazes and cracks, so material choice shows up in the first year, not the fifth.',
      },
      {
        heading: 'Will it fit my buggy?',
        body: 'Heavy-duty zippers and reinforced brass eyelets are the components that usually fail first on cheap enclosures, which is exactly why they are upgraded here. Universal fit options cover most common two and four-seat models, but fit still depends on your roof and frame. Send us the make and model, for example an ezgo golf cart enclosure query, and we will confirm. A roof and frame that are in good condition give the best result, so tell us if yours has been modified. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. If you are replacing an older buggy, tell us what you drive now and we will compare it.',
      },
    ],
    faqs: [
      { q: 'How much are golf buggy enclosures for sale like this PVC enclosure?', a: 'The All-Weather Heavy-Duty PVC Enclosure is $290 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does it fit an EZGO golf cart enclosure position?', a: 'It has universal fit options for most two and four-seat models. Send us your make and model to confirm.' },
      { q: 'Is it a golf buggy rain cover for all weather?', a: 'Yes. It is a four-sided enclosure with roll-up clear vinyl windows for wind, rain and dust.' },
      { q: 'Will it suit a Yamaha golf cart enclosure need?', a: 'It may. Tell us your Yamaha model and we will confirm the fit.' },
      { q: 'What golf buggy accessories Australia buyers fit with it?', a: 'Many add a windshield or mirrors. Ask the Yatala desk what suits your buggy.' },
      { q: 'Does it work as an EZ GO golf cart enclosure replacement?', a: 'It suits many E-Z-GO models. Send us the year and model and we will confirm.' },
    ],
  },

  'all-terrain-23x10-5-12-wheel-tyre-combo': {
    primaryKeyword: 'golf cart tyres',
    supportingKeywords: ['golf cart wheels and tires', 'golf cart wheel and tire combo', 'tires for golf carts', 'wheels for golf cart', 'golf buggy wheels'],
    h1: 'Golf Buggy Tyres: All-Terrain 23x10.5-12 Wheel and Tyre Combo',
    seoTitle: 'Golf Cart Tyres: Buy the All-Terrain 23x10.5-12 Wheel Combo',
    seoDescription: 'Buy golf cart tyres mounted on 12-inch alloy wheels. All-terrain 23x10.5-12 set of 4 with 6-ply tread and lug nuts, $850 inc GST.',
    short: 'wheel and tyre set',
    closingHeading: 'Where can I buy the 23x10.5-12 wheel and tyre set?',
    intro:
      'Rural owners searching for golf cart tyres usually want puncture resistance and clearance. The All-Terrain 23x10.5-12 Wheel and Tyre Combo is a set of four, supplied mounted on diamond-cut 12-inch alloy rims with 6-ply off-road tread and lug nuts included. It is $850 AUD including GST.',
    sections: [
      {
        heading: 'Why does 6-ply construction matter on rural property?',
        body: 'Standard golf tyres are built for turf and puncture readily on stubble, stones and stick, while a 6-ply carcass resists that. On a rural property that is the difference between a tyre that lasts and one that goes flat at the far paddock. It is the specification that matters most when choosing tires for golf carts that will leave the fairway. Fewer punctures mean fewer trips back to the shed and less time with a vehicle out of service.',
      },
      {
        heading: 'What do the 23-inch diameter and tread add to golf cart wheels and tires?',
        body: 'Twenty-three-inch diameter adds genuine ground clearance under the axle rather than just filling the arch, and the aggressive tread clears mud instead of packing with it. Diamond-cut 12-inch alloy rims handle the side loads of off-camber driving better than pressed steel. A matched golf cart wheels and tires package removes guesswork about whether the parts suit each other. A diamond-cut alloy rim also looks the part, which matters to owners who treat the buggy as a second vehicle. The tread pattern clears mud and loose gravel as the wheel turns.',
      },
      {
        heading: 'Do I need a lift kit?',
        body: 'The set is supplied mounted with lug nuts included, so there is no separate fitting exercise. Pair it with a lift kit for the intended geometry, and check clearance before fitting to an unlifted chassis, because taller tyres can rub. Tell us your buggy, its lift and its use, and we will confirm the combo suits before you order golf buggy wheels. Tell us your lift height and whether you carry heavy loads, so we can say whether this set suits. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. If you are replacing an older buggy, tell us what you drive now and we will compare it.',
      },
    ],
    faqs: [
      { q: 'How much are golf cart tyres like this 23x10.5-12 wheel combo?', a: 'The All-Terrain 23x10.5-12 Wheel and Tyre Combo (Set of 4) is $850 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Are these golf cart wheels and tires mounted?', a: 'Yes. They are supplied mounted on 12-inch alloy rims with lug nuts included.' },
      { q: 'Is it a golf cart wheel and tire combo for lifted buggies?', a: 'Yes. It is aimed at lifted buggies and rural properties. Check clearance before fitting to an unlifted chassis.' },
      { q: 'Are these tires for golf carts puncture resistant?', a: 'The 6-ply construction resists punctures from stubble, stones and sticks better than standard golf tyres.' },
      { q: 'Are these wheels for golf cart fitment suitable for my model?', a: 'Send us the make, model and year and we will confirm the bolt pattern and clearance.' },
      { q: 'Are these golf buggy wheels sold as a set?', a: 'Yes. The combo is a set of four wheels and tyres.' },
    ],
  },

  'foldable-tinted-acrylic-windshield-system': {
    primaryKeyword: 'golf cart windshield parts',
    supportingKeywords: ['golf cart windshield clips', 'ezgo golf cart windshield', 'windshield hinge for golf cart', 'golf buggy accessories australia', 'ez go golf cart windshield'],
    h1: 'Golf Buggy Windshield Parts: Foldable Tinted Acrylic System',
    seoTitle: 'Golf Cart Windshield Parts: Foldable Tinted Acrylic',
    seoDescription: 'Buy golf cart windshield parts. Foldable tinted high-impact acrylic windshield with UV protection and noise-reduction clips, $160 inc GST.',
    short: 'windshield system',
    closingHeading: 'Where can I buy the foldable tinted windshield?',
    intro:
      'A split windshield that folds down is the practical choice for Australian conditions, and these golf cart windshield parts make it easy. The Foldable Tinted Acrylic Windshield System has high-impact acrylic, UV protection and snug noise-reduction clips. It suits Club Car, EZGO and Yamaha owners and is $160 AUD including GST.',
    sections: [
      {
        heading: 'Why does a folding windshield suit Australia?',
        body: 'Up for cold mornings, insects and rain, down for airflow on hot afternoons. Fixed windshields force you to choose once and live with it. A split design lets you change with the weather without tools, which is why many owners prefer it. It is a comfort upgrade that is fitted in minutes. A tinted screen also reduces glare on bright days, which makes driving more comfortable.',
      },
      {
        heading: 'What do acrylic and UV tint protect?',
        body: 'High-impact acrylic resists the stone and stick strikes that shatter glass, and the smoke tint blocks UV, which matters as much for the driver as for the dashboard and seats that would otherwise fade and crack. Together they extend the life of the cabin as well as improving comfort. For many owners that is the main reason to fit an ezgo golf cart windshield style screen. Acrylic is lighter than glass and more shatter-resistant, which is a sensible safety choice on an open vehicle.',
      },
      {
        heading: 'Why do golf cart windshield clips matter?',
        body: 'Snug noise-reduction clips are a small detail that prevents the buzz and rattle that makes cheaper folding windshields irritating at speed. Good clips and a sound hinge decide whether a screen is pleasant or annoying. Tell us your make, model and year and we will confirm the fit before you order. Fitting is straightforward, but we confirm compatibility first so the screen sits properly on your frame. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our team can answer questions on delivery, parts and warranty before you commit. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same.',
      },
    ],
    faqs: [
      { q: 'How much are golf cart windshield parts like this foldable system?', a: 'The Foldable Tinted Acrylic Windshield System is $160 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does it include golf cart windshield clips?', a: 'Yes. Snug noise-reduction clips prevent buzz and rattle at speed.' },
      { q: 'Will it fit an EZGO golf cart windshield frame?', a: 'It suits Club Car, EZGO and Yamaha owners. Send us your model and we will confirm the fit.' },
      { q: 'Is a windshield hinge for golf cart frames included?', a: 'It is a split windshield that folds down. Ask the Yatala desk about hinge and mounting details for your model.' },
      { q: 'What golf buggy accessories Australia owners pair with it?', a: 'Many add an enclosure or mirrors. Ask us what suits your buggy.' },
      { q: 'Will it suit an EZ GO golf cart windshield frame?', a: 'It suits Club Car, EZGO and Yamaha owners. Send us your model and we will confirm the fit.' },
    ],
  },

  'heavy-duty-solenoid-albright-48vdc-200a': {
    primaryKeyword: '48v golf cart solenoid',
    supportingKeywords: ['golf buggy parts', 'golf buggy parts australia', 'yamaha golf cart solenoids', 'golf buggy accessories', 'electric golf cart voltage'],
    h1: '48V Golf Buggy Solenoid: Albright 200A Heavy Duty',
    seoTitle: '48V Golf Cart Solenoid: Buy the Albright 200A Heavy Duty',
    seoDescription: 'Buy a 48V golf cart solenoid. Heavy duty Albright 48VDC 200A continuous duty solenoid with silver alloy contacts, $120 inc GST.',
    short: 'Albright solenoid',
    closingHeading: 'Where can I buy the Albright 200A solenoid?',
    intro:
      'A 48v golf cart solenoid is the high-current switch between the battery pack and the motor. The Heavy Duty Solenoid Albright 48VDC 200A has a continuous duty rating and silver alloy contacts. It is a common replacement when a buggy clicks but will not move, $120 AUD including GST, and stocked at our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why is the solenoid a common failure point?',
        body: 'It is a common failure point on buggies that have been upgraded or worked hard. Every start draws a current spike through its contacts, and a lightweight solenoid pits and welds under that duty until it either sticks closed or stops passing current. Upgraded motors and controllers raise that current, which is why a stronger solenoid is often part of a performance upgrade. Replacing a weak solenoid early can prevent a roadside failure, which is more inconvenient than a planned repair.',
      },
      {
        heading: 'What does continuous duty mean for golf buggy parts?',
        body: 'The Albright unit uses silver alloy contacts with a continuous duty rating, meaning it is built to stay energised for extended periods without overheating, rather than for intermittent switching. That makes it a sturdy choice for vehicles that work all day. It is among the golf buggy parts Australia owners buy most often when diagnosing starting problems. That stability under load is why it suits vehicles with stronger controllers and motors.',
      },
      {
        heading: 'When should I suspect the solenoid?',
        body: 'If your buggy clicks but will not move, or has started intermittently cutting out, this is the part to suspect. Check the wiring and batteries first, because a low pack can mimic the same symptom. Send us the make, model, year and voltage and we will confirm the Albright suits before you order, rather than leaving you to guess at a fault. If the fault persists after replacement, the controller or wiring may need attention, and we can help you narrow it down. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Questions are welcome before you buy, not just after.',
      },
    ],
    faqs: [
      { q: 'How much is a 48v golf cart solenoid like the Albright 200A?', a: 'The Heavy Duty Solenoid Albright 48VDC 200A is $120 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it one of the golf buggy parts that cure a clicking fault?', a: 'It is a common cause when a buggy clicks but will not move. Check the batteries and wiring first and tell us the symptoms.' },
      { q: 'Do you supply golf buggy parts Australia wide?', a: 'Yes. We supply from our Yatala QLD depot and quote freight to your postcode.' },
      { q: 'Will it work as one of the Yamaha golf cart solenoids?', a: 'It may, depending on the model and voltage. Send us the details and we will confirm.' },
      { q: 'Can I add other golf buggy accessories with it?', a: 'Yes. We list accessories across our range. Ask the Yatala desk about your order.' },
      { q: 'What electric golf cart voltage does it handle?', a: 'It is a 48VDC unit rated 200A continuous duty. Check your system voltage before ordering.' },
    ],
  },

  'replacement-mgi-ai-zip-remote-controller': {
    primaryKeyword: 'mgi remote',
    supportingKeywords: ['mgi remote control', 'mgi remote replacement', 'mgi remote control replacement', 'mgi zip navigator accessories', 'mgi spare parts'],
    h1: 'MGI Remote: Replacement Ai and Zip Remote Controller Unit',
    seoTitle: 'MGI Remote: Buy the Replacement Ai and Zip Controller',
    seoDescription: 'Buy a replacement MGI remote. Official handheld controller for Zip Navigator and Ai Series buggies, pre-programmed pairing, USB-C, $190 inc GST.',
    short: 'MGI remote',
    closingHeading: 'Where can I buy a replacement MGI remote?',
    intro:
      'A lost or damaged mgi remote should not mean replacing a healthy buggy. The Replacement MGI Ai and Zip Remote Controller Unit is the official handheld directional remote for Zip Navigator and Ai Series buggies. It has pre-programmed pairing capability and USB-C charging, and is $190 AUD including GST.',
    sections: [
      {
        heading: 'When should you replace an MGI remote control?',
        body: 'Remotes lead a hard life clipped to a bag or a belt through every round. A cracked case, a failed button or a dead internal battery does not justify replacing an otherwise healthy buggy. If your mgi remote control no longer pairs, responds slowly or will not hold a charge, a genuine replacement is the simple and economical answer, and it brings the buggy back to full use. Remotes are also easy to lose or leave in a bag, so a spare is a sensible thing to have on hand.',
      },
      {
        heading: 'How does pre-programmed pairing work?',
        body: 'This is the genuine unit with pre-programmed pairing capability, so it links to your buggy without a service visit. That removes a common frustration: a replacement that needs a technician to set up. You fit it, follow the pairing steps and get back on the course. Check that your buggy is a Zip Navigator or Ai Series model before you order. Keep the original packaging and instructions, because they make pairing straightforward.',
      },
      {
        heading: 'Why choose the official remote?',
        body: 'Using the official remote rather than a generic substitute preserves correct pairing behaviour and directional response. USB-C charging means it takes the same cable as everything else rather than a proprietary lead you will lose. MGI batteries, remotes and mgi zip navigator accessories are held in Australian stock, so you are not waiting on an overseas order. Tell us your model and we will confirm. A genuine part also means you are dealing with an Australian stockist who can answer questions about your buggy. If you are replacing an older buggy, tell us what you drive now and we will compare it. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is a replacement MGI remote?', a: 'The Replacement MGI Ai and Zip Remote Controller Unit is $190 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this the right MGI remote control for my Zip Navigator?', a: 'It is the official replacement for Zip Navigator and Ai Series buggies. Tell us your model and we will confirm.' },
      { q: 'Is it an MGI remote replacement that pairs automatically?', a: 'It has pre-programmed pairing capability, so it links to your buggy without a service visit.' },
      { q: 'Is this an MGI remote control replacement with USB-C?', a: 'Yes. It charges by USB-C, the same cable as most modern devices.' },
      { q: 'What other MGI Zip Navigator accessories do you stock?', a: 'We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk what suits your model.' },
      { q: 'Do you hold MGI spare parts in Australia?', a: 'Yes. MGI spare parts and accessories are held in Australian stock at our Yatala QLD depot.' },
    ],
  },

  'golf-cart-side-mirrors-integrated-led-indicators': {
    primaryKeyword: 'golf cart mirrors',
    supportingKeywords: ['golf cart mirrors near me', 'yamaha golf cart mirrors', 'ezgo golf cart mirrors', 'golf cart mirrors club car', 'golf cart accessories'],
    h1: 'Golf Buggy Mirrors: Side Mirrors with Integrated LED Indicators',
    seoTitle: 'Golf Cart Mirrors: Buy Side Mirrors with LED Indicators',
    seoDescription: 'Buy golf cart mirrors. Wide-angle convex side mirrors with built-in amber LED turn signal indicators, supplied as a pair, $95 inc GST.',
    short: 'side mirrors',
    closingHeading: 'Where can I buy these side mirrors with LED indicators?',
    intro:
      'Golf cart mirrors matter more than most owners expect, because a buggy has no rear window. The Golf Cart Side Mirrors with Integrated LED Indicators have wide-angle convex glass and amber LED turn signals built into the mirror face. They are supplied as a pair with mounting hardware for $95 AUD including GST.',
    sections: [
      {
        heading: 'Why does convex glass matter on a buggy?',
        body: 'Convex glass gives a genuinely wide field of view, which matters more on a buggy than a car because there is no rear window, no pillar geometry to work around and passengers or cargo frequently block the view directly behind. Seeing what is behind you before you turn or reverse is a basic safety habit, and a wide-angle mirror makes it easy. A good mirror lets you check the rear before reversing, which matters around pedestrians and parked cars.',
      },
      {
        heading: 'What do the integrated amber indicators add?',
        body: 'Integrated amber LED indicators built into the mirror face put the turn signal where following drivers already look, rather than requiring separate indicator pods elsewhere on the body. That keeps the wiring and the appearance simple. If you shop for buggy mirrors near me today, check that the product includes the signalling you need, rather than adding it separately later. Combining mirror and signal in one unit also leaves the body panels free of extra fittings.',
      },
      {
        heading: 'Will they fit yamaha golf cart mirrors positions?',
        body: 'They are straightforward to fit to standard strut positions and supplied as a pair with mounting hardware. Fit still depends on your frame, so tell us your make and model, whether an ezgo golf cart mirrors setup or another, and we will confirm. They pair sensibly with a lighting kit if the buggy shares estate roads with vehicles, though we do not label any buggy road legal. A pair of mirrors is a modest cost for better awareness every time you drive. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our desk replies to enquiries from all states and territories.',
      },
    ],
    faqs: [
      { q: 'How much are golf cart mirrors like these LED indicator mirrors?', a: 'The Golf Cart Side Mirrors with Integrated LED Indicators are $95 AUD including GST, supplied as a pair. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Where can I buy golf cart mirrors near me in Australia?', a: 'We supply from our Yatala QLD depot and freight Australia-wide, with the cost quoted to your postcode.' },
      { q: 'Do these work as Yamaha golf cart mirrors?', a: 'They fit standard strut positions. Send us your Yamaha model and we will confirm the fit.' },
      { q: 'Do they suit EZGO golf cart mirrors positions?', a: 'They may, depending on the frame. Tell us your E-Z-GO model and we will check.' },
      { q: 'Do these suit golf cart mirrors club car frames?', a: 'They fit standard strut positions on many Club Car models. Send us your model and year.' },
      { q: 'What other golf cart accessories pair with them?', a: 'Many owners add a light kit and seatbelts. Ask the Yatala desk. We do not label any buggy road legal, so check your state rules.' },
    ],
  },

  'heavy-duty-rear-flip-seat-kit-2-to-4': {
    primaryKeyword: 'golf cart rear flip seat',
    supportingKeywords: ['ezgo golf cart rear seat kit', 'ezgo golf cart rear seat', '4 seater golf buggy for sale', 'rear seat for ezgo golf cart', 'golf buggy accessories'],
    h1: 'Golf Buggy Rear Flip Seat Kit: Converts 2 to 4 Seater',
    seoTitle: 'Golf Cart Rear Flip Seat: Buy the 2 to 4 Seater Kit',
    seoDescription: 'Buy a golf cart rear flip seat. Heavy duty kit converts a 2-seater to 4 passengers or a flatbed cargo tray, powder-coated steel, $650 inc GST.',
    short: 'rear flip seat kit',
    closingHeading: 'Where can I buy the rear flip seat kit?',
    intro:
      'A golf cart rear flip seat is the most cost-effective way to add capacity to a buggy you already own. The Heavy Duty Rear Flip Seat Kit converts a standard two-seater into a four-passenger cruiser or a flatbed cargo hauler. It has a powder-coated steel frame and is $650 AUD including GST.',
    sections: [
      {
        heading: 'Why convert instead of trading up?',
        body: 'Rather than trading a two-seater for a four-seater, this kit converts it: rear-facing seating for two more passengers that folds flat into a cargo tray when you need to carry rather than seat. That is usually cheaper than buying another vehicle, and it keeps a buggy you already know. For owners who searched 4 seater golf buggy for sale and found the price steep, it is a practical alternative. It also keeps the investment in a vehicle you know, with no need to learn a new buggy.',
      },
      {
        heading: 'How does the dual-purpose design work?',
        body: 'That dual purpose is why it suits property owners as much as families, since the same vehicle handles the school gate and the feed run. Folded up it seats passengers; folded flat it becomes a cargo deck. It is a kit that earns its place in different seasons and different weeks, and it saves buying a separate utility vehicle for light loads. Folding it flat in seconds means you can switch between people and cargo as the day demands.',
      },
      {
        heading: 'Will an ezgo golf cart rear seat kit fit my model?',
        body: 'The powder-coated steel frame resists the corrosion that would otherwise start at every weld and bolt hole in coastal or irrigated conditions. Fit depends on your make, model and year, so tell us before you order, whether you need a kit for another style. Consider pairing it with a seatbelt set and upgraded brakes, since added passengers mean added mass to stop. Added passengers need proper restraints and stopping power, so plan the upgrade as a package. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same.',
      },
    ],
    faqs: [
      { q: 'How much is a golf cart rear flip seat like this kit?', a: 'The Heavy Duty Rear Flip Seat Kit (Converts 2 to 4 Seater) is $650 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Will this EZGO golf cart rear seat kit fit my buggy?', a: 'Fit depends on the make, model and year. Send us your details and we will confirm before you order.' },
      { q: 'Is it an EZGO golf cart rear seat that folds flat?', a: 'The kit folds flat into a flatbed cargo tray when you need to carry rather than seat.' },
      { q: 'Can it turn a 2-seater into a 4 seater golf buggy for sale alternative?', a: 'Yes. It adds rear seating for two more passengers on a standard two-seater.' },
      { q: 'Is it a rear seat for EZGO golf cart owners with a steel frame?', a: 'Yes. It has a powder-coated steel frame that resists corrosion at welds and bolt holes.' },
      { q: 'What golf buggy accessories should I add with it?', a: 'Consider a seatbelt set and upgraded brakes, since added passengers mean added mass to stop.' },
    ],
  },

  'heavy-duty-tow-hitch-ball-assembly': {
    primaryKeyword: 'golf cart tow hitch',
    supportingKeywords: ['ezgo golf cart tow bar', 'yamaha golf cart hitch', 'golf buggy trailers for sale', 'golf buggy and trailer for sale', 'electric buggy with trailer'],
    h1: 'Golf Buggy Tow Hitch: Heavy Duty 2-Inch Receiver and Ball',
    seoTitle: 'Golf Cart Tow Hitch: Buy the Heavy Duty 2-Inch Receiver',
    seoDescription: 'Buy a golf cart tow hitch. Heavy duty 2-inch receiver with 50mm chrome tow ball, powder-coated steel, hardware included, $110 inc GST.',
    short: 'tow hitch',
    closingHeading: 'Where can I buy the heavy duty tow hitch?',
    intro:
      'A golf cart tow hitch turns a buggy into a working vehicle for garden trailers and sprayers. The Heavy Duty Tow Hitch and Ball Assembly is a standard 2-inch receiver with a 50mm chrome ball, in powder-coated steel with mounting hardware included. It is $110 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why do the 2-inch receiver and 50mm ball matter for golf buggy trailers for sale?',
        body: 'These are the common Australian sizes, so the hitch accepts the garden trailers, box trailers and sprayers most properties already own rather than requiring anything bespoke. That means you can use equipment you have, instead of buying specific attachments. If you have been looking at golf buggy trailers for sale, a standard hitch also keeps your options open. Standard sizes also mean spare balls and couplings are easy to find if you ever need them.',
      },
      {
        heading: 'What does the receiver format allow?',
        body: 'The receiver format also means the ball mount can be swapped for a different height or a pin-style attachment as needs change. That flexibility matters on a working property, where the same buggy might tow a mower one day and a trailer the next. It is a simple, adaptable part that suits farm owners pulling trailers or mowers. Swapping a mount takes little time, and it keeps a single hitch useful for many tasks.',
      },
      {
        heading: 'Should I check the brakes before towing?',
        body: 'Yes. Towing adds substantially to stopping distance, so it is worth reviewing brake condition before putting a loaded trailer behind a buggy. Powder-coated steel handles the wet grass, fertiliser and mud that would rust bare steel quickly at the rear of a working vehicle. Check the towing capacity for your own buggy, because the hitch does not set the limit. Tell us your model and we will advise. Load the trailer sensibly and drive slowly on slopes, because a buggy is not built to stop like a truck. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Questions are welcome before you buy, not just after.',
      },
    ],
    faqs: [
      { q: 'How much is a golf cart tow hitch like this 2-inch receiver?', a: 'The Heavy Duty Tow Hitch and Ball Assembly is $110 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does it work as an EZGO golf cart tow bar?', a: 'It is a standard 2-inch receiver with a 50mm ball. Fit depends on the rear frame, so send us your model.' },
      { q: 'Will it fit as a Yamaha golf cart hitch?', a: 'It may, depending on the rear structure. Tell us your Yamaha model and we will confirm.' },
      { q: 'Do you sell golf buggy trailers for sale as well?', a: 'We supply the hitch and accessories. Ask the Yatala desk about trailers and what suits your buggy.' },
      { q: 'Can I use it with a golf buggy and trailer for sale package?', a: 'It accepts garden trailers, box trailers and sprayers that use a 50mm ball. Check your trailer coupling.' },
      { q: 'Can I tow with an electric buggy with trailer fitted?', a: 'Yes, within your buggy towing capacity. Check the figure for your model and review the brakes first.' },
    ],
  },

  'golf-cart-solar-charging-panel-expansion-kit': {
    primaryKeyword: 'solar charging golf cart',
    supportingKeywords: ['solar golf cart', 'solar for golf carts', 'solar powered golf buggy', 'solar golf carts for sale', 'solar charge golf cart'],
    h1: 'Solar Charging Golf Buggy Kit: 175W Flexible Rooftop Panel',
    seoTitle: 'Solar Charging Golf Cart: Buy the 175W Rooftop Panel Kit',
    seoDescription: 'Buy a solar charging golf cart kit. 175W flexible rooftop panel with MPPT controller for 36V and 48V systems, $520 inc GST.',
    short: 'solar kit',
    closingHeading: 'Where can I buy the golf cart solar kit?',
    intro:
      'A solar charging golf cart kit trickle charges the battery whenever the buggy is parked in the sun. The Golf Cart Solar Charging Panel Expansion Kit (175W) has a flexible rooftop panel and an MPPT charge controller, and extends daily range by around 20%. It is $520 AUD including GST.',
    sections: [
      {
        heading: 'Why does MPPT matter on a solar golf cart?',
        body: 'MPPT is the important part of that specification: it continuously finds the panel maximum power point rather than passing raw output through, which is what allows a modest rooftop panel to contribute usefully instead of marginally. For anyone considering a solar golf cart conversion, the controller matters as much as the panel, because it decides how much of the available sun reaches the batteries. A modest panel adds up over a week of sunny days, especially when the buggy is used for short trips.',
      },
      {
        heading: 'Who benefits most from solar for golf carts?',
        body: 'The practical benefit is greatest for vehicles that sit outdoors between short trips, which describes most resort, farm and estate duty. Acreage owners parked away from power are the main buyers. If you use solar for golf carts that sit in the sun most of the day, the panel keeps topping up the pack and reduces your reliance on the charger. Resorts and farms often park buggies outdoors for hours, which is when a panel does most of its work.',
      },
      {
        heading: 'Is it compatible with my system?',
        body: 'The flexible panel follows the roof contour and adds negligible weight or wind noise. It is compatible with 36V and 48V systems, so check your pack voltage before ordering. Tell us your make, model and roof type and we will confirm the kit suits. A solar powered golf buggy conversion is simple when the parts are matched to the vehicle. A technician can fit the controller and wiring safely, and we can talk through the parts. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our desk replies to enquiries from all states and territories.',
      },
    ],
    faqs: [
      { q: 'How much is a solar charging golf cart kit like this 175W panel?', a: 'The Golf Cart Solar Charging Panel Expansion Kit (175W) is $520 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does a solar golf cart panel replace the charger?', a: 'No. It trickle charges the pack whenever parked in sun and extends daily range by around 20%, but you will still charge normally when needed.' },
      { q: 'Is it solar for golf carts with 36V or 48V packs?', a: 'Yes. The MPPT controller is compatible with 36V and 48V systems.' },
      { q: 'Does it make a solar powered golf buggy?', a: 'It adds solar charging to an electric buggy. It supports the battery rather than powering the vehicle directly.' },
      { q: 'Can I find solar golf carts for sale with the kit fitted?', a: 'We supply the kit for fitting to your buggy. Ask the Yatala desk about your model.' },
      { q: 'Will the panel help me solar charge golf cart batteries on cloudy days?', a: 'Output falls on cloudy days. The kit is best where the buggy sits in sun between trips.' },
    ],
  },

  'waterproof-marine-grade-bluetooth-soundbar': {
    primaryKeyword: 'golf cart bluetooth speaker',
    supportingKeywords: ['yamaha golf cart speakers', 'yamaha golf cart stereo', 'club car golf cart stereo', 'golf cart with speakers and lights', 'golf cart soundbar'],
    h1: 'Golf Buggy Bluetooth Speaker: Waterproof Marine Grade 26-Inch Soundbar',
    seoTitle: 'Golf Cart Bluetooth Speaker: Waterproof Marine Soundbar',
    seoDescription: 'Buy a golf cart Bluetooth speaker. 26-inch IP67 waterproof marine soundbar with RGB lighting and direct clamp mounting, $420 inc GST.',
    short: 'soundbar',
    closingHeading: 'Where can I buy the marine Bluetooth soundbar?',
    intro:
      'A golf cart bluetooth speaker has to survive weather, washing and vibration. The Waterproof Marine Grade Bluetooth Soundbar (26-inch) has IP67 construction, bass radiators, integrated RGB accent lighting and a direct clamp mount for roll cages and roof struts. It is $420 AUD including GST.',
    sections: [
      {
        heading: 'Why does IP67 suit a golf buggy?',
        body: 'Marine-grade IP67 construction is the right specification for a golf buggy, because the vehicle lives outdoors and gets rained on, hosed down and covered in dust regardless of intent. IP67 means fully protected against dust and capable of surviving temporary immersion, which comfortably covers weather and washing. A household speaker would not last a season in those conditions. That durability means you can wash the buggy down without worrying about the audio.',
      },
      {
        heading: 'How does a soundbar compare with yamaha golf cart speakers?',
        body: 'Bass radiators produce genuine low end from a compact enclosure without the ported bulk that would not survive the vibration of rough ground. Integrated RGB accent lighting is customisable, and the direct clamp mount fits roll cages and roof struts without drilling. That makes it a simple alternative to built-in yamaha golf cart speakers or a club car golf cart stereo. Clamp mounting also means no drilling, so the roll cage stays as the manufacturer left it. RGB lighting is optional atmosphere, and it can be set to suit the moment.',
      },
      {
        heading: 'What should I power it with?',
        body: 'Pair it with a voltage reducer rather than tapping a single battery, which unbalances the pack. A proper 12V supply keeps the batteries wearing evenly and protects the soundbar. Tell us your make and model and how you plan to power it, and we will confirm the soundbar suits your roll cage or roof struts, and suggest the right reducer. A clean 12V supply protects the soundbar electronics as well as the battery pack. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same.',
      },
    ],
    faqs: [
      { q: 'How much is a golf cart bluetooth speaker like this soundbar?', a: 'The Waterproof Marine Grade Bluetooth Soundbar (26-inch) is $420 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a good substitute for Yamaha golf cart speakers?', a: 'It clamps to roll cages and roof struts without drilling, so it suits many buggies. Tell us your model.' },
      { q: 'Does it work as a Yamaha golf cart stereo?', a: 'It is a Bluetooth soundbar, so you play audio from your phone. It does not replace a head unit.' },
      { q: 'Is it a Club Car golf cart stereo alternative?', a: 'It is a self-contained marine soundbar that clamps on. Ask the Yatala desk about your Club Car model.' },
      { q: 'Is it a golf cart with speakers and lights option?', a: 'Yes. It has integrated customisable RGB accent lighting as well as audio.' },
      { q: 'What do I need to power the golf cart soundbar?', a: 'A 12V supply. We suggest a voltage reducer rather than tapping one battery in the bank.' },
    ],
  },

  'retractable-seatbelt-system-set': {
    primaryKeyword: 'golf cart seat belts',
    supportingKeywords: ['golf cart seat belt kit', 'seat belts for golf carts', 'golf carts with seat belts', 'yamaha golf cart seat belts', 'seat belts on golf carts'],
    h1: 'Golf Buggy Seat Belts: Retractable 3-Point Set (Front and Rear)',
    seoTitle: 'Golf Cart Seat Belts: Buy the E-Mark 3-Point Retractable Set',
    seoDescription: 'Buy golf cart seat belts. E-Mark certified retractable 3-point lap and shoulder set, front and rear, steel brackets included, $145 inc GST.',
    short: 'seatbelt set',
    closingHeading: 'Where can I buy the retractable seatbelt set?',
    intro:
      'Families carrying children often ask about golf cart seat belts. The Retractable Seatbelt System Set (Front and Rear) is an E-Mark certified automatic 3-point lap and shoulder harness with heavy-duty steel mounting brackets. It is $145 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'Why does E-Mark certification matter?',
        body: 'E-Mark certification is the meaningful detail: it means the harness has been tested and approved against a recognised international standard rather than simply resembling a seatbelt. For anyone carrying children, elderly passengers or driving on sloped or uneven ground, that distinction is worth insisting on. It is the difference between a real restraint and a decoration. A tested harness gives parents confidence when children ride, and it is a sensible choice for older passengers too.',
      },
      {
        heading: 'Why are seat belts for golf carts better with three points?',
        body: 'The three-point lap and shoulder configuration restrains the torso as well as the hips, which is what prevents the forward pitch that causes most buggy injuries. That is why a proper kit uses three points rather than a simple lap strap. Seat belts on golf carts only help if they are worn, and design details decide whether they are. Torso support matters on slopes, where a sudden stop or a bump can throw passengers forward.',
      },
      {
        heading: 'How does a golf cart seat belt kit stay usable?',
        body: 'Automatic retraction keeps the belts out of the door aperture and off the ground when unused, so they stay clean and actually get worn. Heavy-duty steel mounting brackets are included, and the kit should be anchored to structural frame points, so have it fitted by a competent installer. Tell us your make and model and we will confirm the set suits, including when you are retrofitting. A belt anchored to a weak point is no protection, so mounting quality matters as much as the belt. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much are golf cart seat belts like this retractable set?', a: 'The Retractable Seatbelt System Set (Front and Rear) is $145 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it a complete golf cart seat belt kit?', a: 'Yes. It includes front and rear retractable belts and heavy-duty steel mounting brackets.' },
      { q: 'Are these seat belts for golf carts E-Mark certified?', a: 'Yes. E-Mark certification means the harness has been tested and approved against a recognised international standard.' },
      { q: 'Can I fit them to make golf carts with seat belts of my own?', a: 'Yes. Anchor the kit to structural frame points and use a competent installer.' },
      { q: 'Do these fit as Yamaha golf cart seat belts?', a: 'They may, depending on the frame and seat design. Send us your Yamaha model and we will check.' },
      { q: 'Are seat belts on golf carts a road-legal requirement?', a: 'Rules vary by state. We do not label any buggy road legal, so check with your authority.' },
    ],
  },

  'lockable-dash-glove-box-storage-system': {
    primaryKeyword: 'golf cart glove box',
    supportingKeywords: ['golf cart dash storage', 'golf cart locking storage', 'golf cart accessories', 'golf cart storage compartment', 'golf cart phone storage'],
    h1: 'Golf Buggy Glove Box: Lockable Dash Storage System',
    seoTitle: 'Golf Cart Glove Box: Buy the Lockable Dash Storage',
    seoDescription: 'Buy a golf cart glove box. Lockable dual dash compartments with carbon fibre finish, two keys and custom moulded fit, $185 inc GST.',
    short: 'glove box',
    closingHeading: 'Where can I buy the lockable glove box?',
    intro:
      'A golf cart glove box solves a simple problem: a buggy has no doors and no boot. The Lockable Dash Glove Box Storage System has dual lockable compartments, a carbon fibre textured finish, two keys and custom moulded fitting for popular models. It is $185 AUD including GST.',
    sections: [
      {
        heading: 'Why do you need golf cart locking storage?',
        body: 'A golf buggy has no doors and no boot, so a phone, wallet or keys left on the seat are visible and available to anyone walking past while you play a hole or step into the clubhouse. A lockable compartment turns that from a risk into a non-issue. Golfers leaving valuables at the club or resort are the typical buyers, and they appreciate the peace of mind. Leaving valuables in a shared bay or an open car park invites trouble, and the compartment removes the temptation.',
      },
      {
        heading: 'Why custom moulding and two keys?',
        body: 'The compartments are custom moulded to fit popular models rather than fixed on as a universal box, so they sit neatly into the dash. Two keys are supplied, which is worth noting since single-key accessories become a problem the moment the key is lost. A golf cart dash storage solution that looks factory-fitted also adds to the feel of the buggy. A moulded fit also means no rattles, which matters for a buggy that crosses rough ground.',
      },
      {
        heading: 'Does it do anything besides security?',
        body: 'It also stops loose items sliding off the dash through turns, so scorecards, tees and sunglasses stay put. Check that your model is one of the popular models the moulding suits, and tell us your make and year before you order. If you are choosing golf cart accessories for a club or resort fleet, ask about several units for one order. A tidy dash also helps drivers find what they need quickly, without hunting through a bag. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our team can answer questions on delivery, parts and warranty before you commit. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is a golf cart glove box like this lockable system?', a: 'The Lockable Dash Glove Box Storage System is $185 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is it golf cart dash storage that locks?', a: 'Yes. It has dual lockable compartments, and two keys are supplied.' },
      { q: 'Does it work as golf cart locking storage for a phone?', a: 'Yes. It is designed to keep smartphones, keys and wallets secure while you play.' },
      { q: 'Which golf cart accessories fit my model?', a: 'The glove box is custom moulded for popular models. Send us your make, model and year and we will confirm.' },
      { q: 'Is it a golf cart storage compartment that looks factory-fitted?', a: 'It has a carbon fibre textured finish and a moulded fit, so it sits neatly in the dash.' },
      { q: 'Is it good golf cart phone storage on the course?', a: 'Yes. It keeps a phone secure and stops loose items sliding off the dash through turns.' },
    ],
  },

  'heavy-duty-sand-bottle-assembly-dual-set': {
    primaryKeyword: 'golf cart sand bottle',
    supportingKeywords: ['golf cart divot repair', 'golf cart sand bottles', 'golf buggy sand bottle', 'golf cart accessories', 'sand bottle holder'],
    h1: 'Golf Buggy Sand Bottles: Heavy Duty Dual Set with Rattle-Free Mounts',
    seoTitle: 'Golf Cart Sand Bottle: Buy the Heavy Duty Dual Set',
    seoDescription: 'Buy a golf cart sand bottle set. Dual divot bottles with curved easy-pour necks and rattle-free bracket mounts, $75 inc GST.',
    short: 'sand bottle set',
    closingHeading: 'Where can I buy the dual sand bottle set?',
    intro:
      'Repairing divots is basic course etiquette, and a golf cart sand bottle set makes it easy. The Heavy Duty Sand Bottle Assembly (Dual Set) has curved easy-pour necks and rattle-free bracket mounts. It is supplied as a pair with side-frame mounting hardware for $75 AUD including GST.',
    sections: [
      {
        heading: 'Why does rattle-free mounting matter on golf cart sand bottles?',
        body: 'Factory bottle mounts are notorious for rattling loose over a round until they are removed and left in the shed. The rattle-free bracket design is the entire point of upgrading: mounts that stay quiet and stay put get used, while ones that buzz constantly do not. A buggy that is quiet on the course is pleasant for you and for the players around you. A quiet buggy is a courteous one, and players notice when a buggy rattles through a quiet fairway.',
      },
      {
        heading: 'How does the curved neck help with divot repair?',
        body: 'The curved neck pours accurately into the divot rather than scattering sand across the surrounding turf, which is what makes the repair actually take. Good golf cart divot repair is about putting the right amount of sand in the right place, and an easy-pour bottle makes that simple. Most clubs expect players to repair divots, so it is a small upgrade with a visible result. Less spillage also means less sand wasted, which keeps the bottles useful for longer between refills.',
      },
      {
        heading: 'Who should buy a sand bottle set?',
        body: 'Private owners and course operators who want a tidy, practical setup. It is supplied as a pair with side-frame mounting hardware, so you can fit it yourself in minutes. Tell us your make and model and we will confirm the brackets suit your side frame, and ask us about golf cart accessories for fleet orders if you equip several buggies at once. A matched pair lets you carry two bottles, so a long round does not run out of sand. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Questions are welcome before you buy, not just after.',
      },
    ],
    faqs: [
      { q: 'How much is a golf cart sand bottle set like this dual pair?', a: 'The Heavy Duty Sand Bottle Assembly (Dual Set) is $75 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does it help with golf cart divot repair?', a: 'Yes. The curved neck pours accurately into the divot rather than scattering sand across the turf.' },
      { q: 'Are these golf cart sand bottles rattle-free?', a: 'Yes. The bracket design is rattle-free, so the bottles stay quiet and stay put.' },
      { q: 'Is it a golf buggy sand bottle set for the side frame?', a: 'Yes. It is supplied as a pair with side-frame mounting hardware.' },
      { q: 'What other golf cart accessories suit a course buggy?', a: 'Many owners add a windshield, a rain cover or bag holders. Ask the Yatala desk.' },
      { q: 'Does the sand bottle holder fit my model?', a: 'Send us the make and model of your buggy and we will confirm the brackets suit.' },
    ],
  },

  'mgi-zip-x3': {
    primaryKeyword: 'mgi zip x3',
    supportingKeywords: ['mgi accessories', 'mgi golf buggy sale', 'mgi x3', 'motorised golf caddy', 'mgi zip navigator accessories'],
    h1: 'MGI Zip X3: Motorised Walk-Behind Golf Buggy',
    seoTitle: 'MGI Zip X3: Buy the Motorised Walk-Behind Golf Buggy',
    seoDescription: 'Buy the MGI Zip X3 motorised walk-behind golf buggy. Controlled distance function, lockable swivel front wheel and all-terrain treads, $1,549 inc GST.',
    short: 'Zip X3',
    closingHeading: 'Where can I buy the MGI Zip X3 in Australia?',
    intro:
      'The mgi zip x3 sits in the middle of the MGI Zip range, more capable than the entry X1 without the remote-control price of the Navigator. It has a Controlled Distance Function, a lockable swivel front wheel and all-terrain treads. It is $1,549 AUD including GST, supplied from our Yatala QLD depot.',
    sections: [
      {
        heading: 'What does the mgi x3 add over the entry model?',
        body: 'A Controlled Distance Function, a swivelling front wheel that locks for straight running and a digital readout that tracks stats such as distance walked and longest drive round out the feature list. It is more capable than the X1 and a sensible step for golfers stepping up from a push buggy to a motorised one, without paying for remote control they may not need. A digital readout also adds a little fun, because you can see how far you have walked in a round.',
      },
      {
        heading: 'Are all-terrain treads useful on Australian courses?',
        body: 'The all-terrain treads are made for the mix of fairway, rough and cart path an Australian round throws at a buggy. A matte black finish with a gloss top box gives it a clean look on the course. If you compare a motorised golf caddy of this class with a push buggy, the treads and the controlled distance function are what make walking noticeably easier. Good tread improves grip on damp grass and on slopes, which makes the buggy easier to control.',
      },
      {
        heading: 'Is the Zip X3 remote controlled?',
        body: 'No. It is a non-remote model, so you walk with it rather than steering by remote. The Zip range suits cart bags; stand and carry bags are not all compatible, so check yours before ordering. If you want remote control, look at the Zip Navigator instead. Tell us your bag and your course and we will confirm the X3 suits, and which mgi accessories pair with it. Several Zip models share a battery type, which keeps spares simple. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Zip X3 in Australia?', a: 'The MGI ZIP X3 is $1,549 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'What MGI accessories suit the Zip X3?', a: 'MGI holders, covers, bags and batteries are held in Australian stock. Tell us your model and we will confirm what suits.' },
      { q: 'Is it an MGI golf buggy sale pick for beginners?', a: 'It suits golfers stepping up from a push buggy who want a motorised model without remote control.' },
      { q: 'What does the MGI X3 control distance function do?', a: 'The Controlled Distance Function lets the buggy move a set distance, which makes shot-to-shot moves easier.' },
      { q: 'Is it a motorised golf caddy that suits my bag?', a: 'The Zip range suits cart bags. Stand and carry bags are not all compatible, so check yours before ordering.' },
      { q: 'Are there MGI Zip Navigator accessories that also fit?', a: 'Some accessories are shared across the Zip range. Ask the Yatala desk to confirm for your model.' },
    ],
  },

  'mgi-ai-500-electric-buggy': {
    primaryKeyword: 'mgi ai 500',
    supportingKeywords: ['golf motorised caddy', 'best motorised golf buggy', 'gps golf buggy', 'gps golf trolley', 'mgi golf bag'],
    h1: 'MGI Ai 500 Electric Buggy: 4-Inch GPS Motorised Walk-Behind',
    seoTitle: 'MGI Ai 500: Buy the GPS Electric Buggy in Australia',
    seoDescription: 'Buy the MGI Ai 500 electric buggy. 4-inch colour GPS touchscreen, 40,000+ courses, downhill speed control and park brake, $2,199 inc GST.',
    short: 'MGI Ai 500',
    closingHeading: 'Where can I buy the MGI Ai 500?',
    intro:
      'The MGI Ai 500 puts a GPS on the buggy itself, so there is nothing extra to carry. Its four-inch colour, all-weather touchscreen covers more than 40,000 courses worldwide. It is a non-remote lithium walk-behind model with downhill speed control and an electronic park brake, priced at $2,199 AUD including GST.',
    sections: [
      {
        heading: 'What does the four-inch GPS screen show on the MGI Ai 500?',
        body: 'The colour touchscreen shows accurate distances to every part of the hole, using a library of more than 40,000 courses. That removes the need for a separate rangefinder or a phone app running in your pocket. The screen is all-weather, so a shower does not end the round. Over Bluetooth it can also show phone notifications, and the free MGI App adds interactive maps and scoring. Anyone comparing a gps golf buggy against a rangefinder plus a basic buggy will find the integrated screen simpler on the course.',
      },
      {
        heading: 'How does it stay controlled on slopes?',
        body: 'Downhill speed control stops the buggy running away from you on a descent, and the electronic park brake holds it still when you stop to play a shot. Both matter on hilly Australian courses, where a loose buggy is a nuisance and a hazard. You walk with it and set the pace yourself, because this is a non-remote model. That keeps the experience close to a traditional round, with the motor doing the carrying so your energy goes into the golf.',
      },
      {
        heading: 'Is a golf motorised caddy like this worth $2,199?',
        body: 'It suits golfers who want GPS and a motor in one package, without paying for remote control. A golf motorised caddy replaces the bag carry entirely, and the built-in screen replaces a rangefinder. Compare the cost of both and the Ai 500 is a sensible middle step in the MGI range. If you want remote control as well, the Ai Navigator models sit above it. Tell us how you play and we will say which suits. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Call or message the Yatala desk and we will answer your questions in plain language. Send us your postcode and we will quote freight before you commit to the order.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Ai 500?', a: 'The MGI Ai 500 Electric Buggy is $2,199 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this the best motorised golf buggy for GPS?', a: 'It is a non-remote lithium walk-behind buggy with built-in GPS, aimed at golfers who want a motor and course data in one unit.' },
      { q: 'Is the MGI Ai 500 a gps golf buggy with notifications?', a: 'Yes. The four-inch screen has Bluetooth connectivity and can show phone notifications such as messages, emails and calls.' },
      { q: 'How many courses does the gps golf trolley screen cover?', a: 'The MGI Ai 500 covers more than 40,000 courses worldwide, and the free MGI App adds interactive maps and scoring.' },
      { q: 'Does the MGI Ai 500 have remote control?', a: 'No. It is a non-remote model. You walk with it and control the pace yourself.' },
      { q: 'Can I add an MGI golf bag or accessories?', a: 'Yes. We stock MGI accessories, and you can ask the Yatala desk what suits the Ai 500.' },
    ],
  },

  'mgi-ai-navigator-halo': {
    primaryKeyword: 'mgi navigator halo',
    supportingKeywords: ['mgi ai navigator halo', 'folding golf buggies', 'remote control golf buggy', 'remote electric golf cart', 'follow me golf buggy'],
    h1: 'MGI Navigator Halo: The Ai Navigator Halo Remote GPS Buggy',
    seoTitle: 'MGI Navigator Halo: Buy the Top-Range Remote Buggy',
    seoDescription: 'Buy the MGI Navigator Halo. Top-range remote-control GPS buggy with Geo Protect hazard mapping, in-hub motors and a compact fold, $3,249 inc GST.',
    short: 'MGI Navigator Halo',
    closingHeading: 'Where can I buy the MGI Navigator Halo?',
    intro:
      'The MGI Navigator Halo is the most advanced remote-controlled buggy in the MGI range. It combines GPS, a next-generation remote, Geo Protect hazard mapping, brushless in-hub motors and a new compact fold. The Ai Navigator Halo is $3,249 AUD including GST, with freight quoted to your postcode at checkout.',
    sections: [
      {
        heading: 'What does Geo Protect hazard mapping do?',
        body: 'Geo Protect uses mapped hazards to keep the buggy out of trouble, which matters when you are steering by remote around bunkers and water. GPS and the next-generation remote help you make decisions on every hole, so the buggy supports your game rather than just carrying the bag. Gyroscope Straight Tracker technology holds a line across slopes, and downhill speed control keeps descents in check. Together they make the Halo the most capable remote control golf buggy in the MGI line-up.',
      },
      {
        heading: 'Why do brushless in-hub motors matter?',
        body: 'Brushless in-hub motors drive each wheel independently, which gives smooth, responsive performance and fine control. The improved fifth wheel adds stability on any terrain, so the buggy stays composed on uneven ground. Independent drive also helps it hold a straight line on slopes without constant correction. For golfers who play hilly or soft courses, that combination is a real step up from entry-level motorised buggies, and it is part of what the higher price pays for.',
      },
      {
        heading: 'What do the compact fold and Halo Eye add to folding golf buggies?',
        body: 'The new compact fold makes the Halo easier to store and load than earlier Ai models, which helps if the boot is small. The optional Halo Eye adds follow me, return home, point-to-point and obstacle avoidance, and the buggy can pair with the MGI SureShot SlimPRO laser rangefinder. Folding golf buggies are only useful if they genuinely fit the car, so tell us your vehicle and we will talk it through. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our team can answer questions on delivery, parts and warranty before you commit. Delivery is enclosed, so the buggy arrives protected from weather and road dirt.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Navigator Halo?', a: 'The MGI Ai Navigator Halo is $3,249 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is the MGI Ai Navigator Halo the top MGI model?', a: 'Yes. It is MGI most advanced remote-controlled buggy, with GPS, Geo Protect and independent in-hub motors.' },
      { q: 'Is it a remote control golf buggy?', a: 'Yes. It has a next-generation remote and GPS. The optional Halo Eye adds follow me and obstacle avoidance.' },
      { q: 'Does it work as a follow me golf buggy?', a: 'With the optional Halo Eye it adds follow me, return home, point-to-point and obstacle avoidance.' },
      { q: 'Is it one of the folding golf buggies that fits a small boot?', a: 'The new compact fold is easier to store and load than earlier Ai models. Tell us your vehicle and we will advise.' },
      { q: 'How does it compare with a remote electric golf cart style buggy?', a: 'It is a walk-behind buggy you steer by remote, with GPS and hazard mapping that basic models do not have.' },
    ],
  },

  'mgi-e-boost-black': {
    primaryKeyword: 'mgi e boost golf buggy',
    supportingKeywords: ['best motorized golf push cart', 'push golf buggies for sale', 'golf buggies push', 'motorized golf push cart', 'best push golf buggy australia'],
    h1: 'MGI E Boost Golf Buggy in Black: Push Buggy with Boost Mode',
    seoTitle: 'MGI E Boost Golf Buggy: Buy the Black Push Buggy',
    seoDescription: 'Buy the black MGI E Boost golf buggy. Lightweight pushcart with a hidden motor, Push and Boost modes and a 24V 225Wh lithium battery, $899 inc GST.',
    short: 'black E-Boost',
    closingHeading: 'Where can I buy the black MGI E-Boost?',
    intro:
      'The MGI E Boost golf buggy is a push buggy with a kick. It looks and handles like a classic lightweight pushcart, but a hidden motor gives you an extra boost at the press of a button. This black model is $899 AUD including GST, with a 24V 225Wh lithium battery.',
    sections: [
      {
        heading: 'How do Push and Boost modes work?',
        body: 'Switch between Push and Boost as the round demands. Use Push for the flat holes and normal walking, then press the button for Boost on steep holes or when you are tired late in the round. The motor is hidden in the frame, so the buggy keeps the clean look of a traditional pushcart. That makes it feel familiar from the first hole, which helps golfers who do not want to learn a complicated machine. You push the buggy as you always have, and the motor is there only when you ask for it.',
      },
      {
        heading: 'Who suits a motorized golf push cart?',
        body: 'It suits golfers who like the feel of a traditional pushcart and do not want the weight, size or price of a full motorised buggy. At $899 it sits between a manual push model and the larger MGI walk-behind range. The lithium battery is a 24V 225Wh pack, and the matching E Series charger is made for the E-Boost battery only, so do not substitute a charger from another MGI model. Because the motor is small and the frame is light, the buggy is easier to lift into a boot than a full motorised model, which matters if you load it yourself every week.',
      },
      {
        heading: 'Is this the best push golf buggy australia golfers can pick?',
        body: 'Only you can judge that, but the E-Boost answers a common problem: golfers who want help on hills without giving up a light, simple buggy. If you play a flat course, a manual push buggy costs less. If your course climbs, the boost earns its price quickly. This is the black model, and navy and white are listed separately if you prefer another colour. Colour is the only difference between the three E-Boost models, so choose the finish you like and tell us your delivery postcode for a freight quote. Ask us before you order.',
      },
    ],
    faqs: [
      { q: 'How much is the black MGI E-Boost?', a: 'The MGI E-Boost in black is $899 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this the best motorized golf push cart for hills?', a: 'It is a lightweight pushcart with a hidden boost motor, designed to help on steep holes and late in a round.' },
      { q: 'Do you list push golf buggies for sale in other colours?', a: 'Yes. The E-Boost is also listed in navy and white at the same price.' },
      { q: 'What battery does the MGI E Boost golf buggy use?', a: 'It uses a 24V 225Wh lithium battery, and the E Series charger is for the E-Boost battery only.' },
      { q: 'Is it one of the golf buggies push models that needs charging?', a: 'Yes. The boost motor runs from the lithium battery, so charge it before the round.' },
      { q: 'Is it a good best push golf buggy australia choice for beginners?', a: 'It suits golfers who want a familiar pushcart with a little electric help. Ask the Yatala desk if you are unsure.' },
    ],
  },

  'mgi-e-boost-navy': {
    primaryKeyword: 'golf push buggy australia',
    supportingKeywords: ['push golf buggy for sale', 'best push golf buggy australia', 'push golf buggy', 'golf buggies push', 'push buggies golf'],
    h1: 'Golf Push Buggy Australia: MGI E-Boost in Navy with Boost Mode',
    seoTitle: 'Golf Push Buggy Australia: Shop the Navy MGI E-Boost',
    seoDescription: 'Shop the navy MGI E-Boost, a golf push buggy australia wide: hidden boost motor, Push and Boost modes, 24V lithium battery, $899 inc GST.',
    short: 'navy E-Boost',
    closingHeading: 'Where can I buy the navy MGI E-Boost?',
    intro:
      'Looking for a golf push buggy australia golfers can order online, with a little electric help? The MGI E-Boost in navy is the same lightweight pushcart with a boost motor hidden in the frame. A button press gives extra drive when the course climbs or your legs tire. It is $899 AUD including GST.',
    sections: [
      {
        heading: 'What makes the navy E-Boost different from a normal push buggy?',
        body: 'It handles like a classic push buggy, but the hidden motor adds drive on demand. Use Push mode for normal walking and Boost mode on steep holes, and switch between them as you go. That flexibility is the whole point: you keep the lightness and simplicity of a traditional buggy, and you gain help only when you need it, rather than carrying a heavier machine all round. On a flat course you may never press the button, and on a hilly one you may use it often. It suits older golfers and anyone who wants to keep walking.',
      },
      {
        heading: 'Is it a good golf push buggy australia golfers can rely on?',
        body: 'A buggy for Australian courses should handle hills, fold small and not demand much care. The E-Boost is light and simple to handle, and the battery is a 24V 225Wh lithium pack with a matching E Series charger. Compared with a full motorised buggy it is smaller, easier to lift and less costly. Compared with a manual model it gives real help on climbs. The charger is made for this pack only, so keep it with the buggy. Charge before a round, as you would a phone, and the lithium battery is ready when you are.',
      },
      {
        heading: 'Which colour should push buggies golf players choose?',
        body: 'Navy is a practical colour that sits well with most bags. Black and white versions are listed separately at the same price, so the choice is purely about looks. The mechanics, battery and charger are identical across all three. If you are weighing an electric golf push cart against a standard push model, tell us how hilly your course is and we will give you honest advice. We list all three colours at the same price and ship across Australia from Yatala QLD, with freight quoted to your postcode at checkout. Ask us anything you like.',
      },
    ],
    faqs: [
      { q: 'How much is the navy MGI E-Boost?', a: 'The MGI E-Boost in navy is $899 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this a push golf buggy for sale with a motor?', a: 'Yes. A hidden motor gives a boost at the press of a button, and Push mode works as a classic pushcart.' },
      { q: 'Is it the best push golf buggy australia golfers can buy for hills?', a: 'It is built to help on steep holes and late in the round, with Push and Boost modes you can switch between.' },
      { q: 'Is it an electric golf push cart that needs charging?', a: 'Yes. It runs from a 24V 225Wh lithium battery and uses the E Series charger made for it.' },
      { q: 'Do you have other golf buggies push models in other colours?', a: 'Yes. The E-Boost is also listed in black and white at the same price.' },
      { q: 'Do you deliver this golf push buggy australia wide?', a: 'Yes. We ship across Australia from Yatala QLD, with freight quoted to your postcode at checkout.' },
    ],
  },

  'mgi-e-boost-white': {
    primaryKeyword: 'electric golf push cart',
    supportingKeywords: ['best cheap golf push cart', 'push buggies golf', 'golf buggies push', 'push golf buggies for sale', 'electric push cart golf'],
    h1: 'Electric Golf Push Buggy: MGI E-Boost in White with Boost Mode',
    seoTitle: 'Electric Golf Push Cart: Buy the White MGI E-Boost',
    seoDescription: 'Buy the white MGI E-Boost electric golf push cart. Classic pushcart look with a hidden boost motor, Push and Boost modes, 24V lithium, $899 inc GST.',
    short: 'white E-Boost',
    closingHeading: 'Where can I buy the white MGI E-Boost?',
    intro:
      'An electric golf push cart should feel like a push buggy, not a machine. The white MGI E-Boost gives you the classic pushcart look with a hidden boost motor behind it. Press the button when a hill or a long round calls for it. It is $899 AUD including GST.',
    sections: [
      {
        heading: 'How does the boost help on a long round?',
        body: 'Press the button when a hill or a long round calls for it, and go back to Push mode when the ground flattens out. The hidden motor adds drive without changing how the buggy looks or handles. Late in a round, when legs tire and the last holes climb, that extra drive keeps your pace steady and your energy for the golf. It is a small feature that makes a noticeable difference. There is no need to learn a new routine, because it still folds and lifts like a pushcart.',
      },
      {
        heading: 'Is it a best cheap golf push cart alternative?',
        body: 'It is not the cheapest push buggy, and we would not pretend otherwise. Manual models cost less. The E-Boost costs more because it adds a motor and lithium battery, and it still costs far less than a full motorised buggy. Push buggies golf players choose for flat courses do not need the boost. If your course has climbs, the extra cost buys real help and a lighter day. Many owners buy it for one reason: they want to keep walking the course, but not at the cost of tired legs by the sixteenth hole.',
      },
      {
        heading: 'What battery and charger does it use?',
        body: 'The battery is a 24V 225Wh lithium pack, and the E Series charger is made for it. Do not use a charger from another MGI model with this battery. The white finish looks clean and modern, and black and navy versions are listed separately at the same price if you prefer another colour. Light and simple to handle, it suits golfers who do not want a large motorised buggy but would like help on the climbs. Keep the charger with the buggy and top up the battery before each round, and the boost will be there when the hills arrive. Our team is happy to help. Ask us about stock.',
      },
    ],
    faqs: [
      { q: 'How much is the white MGI E-Boost?', a: 'The MGI E-Boost in white is $899 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this an electric golf push cart with a real motor?', a: 'Yes. A boost motor is hidden in the frame and switches on at the press of a button.' },
      { q: 'Is it a best cheap golf push cart?', a: 'It costs more than a manual push buggy because it adds a motor and lithium battery, and less than a full motorised buggy.' },
      { q: 'Do you have push golf buggies for sale in other colours?', a: 'Yes. The E-Boost is also listed in black and navy at the same price.' },
      { q: 'Are these golf buggies push models heavy?', a: 'It is described as a lightweight pushcart. Ask the Yatala desk about weight and boot fit for your vehicle.' },
      { q: 'What charger does the electric push cart golf model need?', a: 'The E Series charger, which is made for the E-Boost battery only.' },
    ],
  },

  'clicgear-model-4-0-buggy-silver': {
    primaryKeyword: 'push buggy',
    supportingKeywords: ['clicgear 4.0 australia', 'buy clicgear 4.0', 'clicgear 4.0 best price', 'clicgear golf buggy', 'clicgear buggies'],
    h1: 'Silver Clicgear Model 4.0 Push Buggy: Compact Three-Wheel Fold',
    seoTitle: 'Push Buggy: Buy the Silver Clicgear Model 4.0',
    seoDescription: 'Buy the silver Clicgear Model 4.0 push buggy. Compact three-wheel fold, adjustable bag saddle, silicone straps and lockable storage console, $489 inc GST.',
    short: 'silver Clicgear 4.0',
    closingHeading: 'Where can I buy the silver Clicgear 4.0?',
    intro:
      'A good push buggy is stable, folds small and keeps your bag where you put it. The Clicgear Model 4.0 in silver is a compact three-wheel design built around stability and durability. It has no battery and no electronics, and it is $489 AUD including GST.',
    sections: [
      {
        heading: 'How does the clicgear golf buggy saddle keep the bag secure?',
        body: 'An adjustable upper saddle fits your bag properly, and a lower saddle gives the front wheel more clearance. Silicone straps and an umbrella tube strap hold the bag firmly, so it does not shift on slopes or bumps. A bag that sits right makes the buggy easier to push and steer, and it protects both the bag and the clubs. It is a simple design detail, but it makes a push buggy feel solid. The adjustable design also helps if you swap between bags, because you can change the fit in seconds without tools. Straps that grip properly mean you can stop worrying about the bag mid-round.',
      },
      {
        heading: 'What storage does the Clicgear 4.0 include?',
        body: 'A lockable storage console, a silicone scorecard and pencil holder and a drink holder keep the essentials to hand. It comes supplied with an umbrella holder, storage net, drink holder, storage console and several accessory tabs for adding more. That means you can buy clicgear 4.0 as a complete package rather than assembling extras. With nothing to charge, it is ready whenever you are, and there is little to go wrong. Everything is supplied in the box, so there are no extra shopping trips for the basics. The accessory tabs mean you can still personalise the buggy later without any modification.',
      },
      {
        heading: 'Is the Clicgear Model 4.0 the right push buggy for you?',
        body: 'The Model 4.0 is a compact design built around stability and durability. It suits golfers who want a durable buggy at a fair price without a motor. If you are weighing it against a motorised model, tell us how you play. This is the silver finish, and other colours are listed separately at the same specification. We are an Australian stockist in Yatala QLD, so you can ask questions about the clicgear golf buggy range before you order. Prices include GST, and freight is quoted at checkout. Ask us.',
      },
    ],
    faqs: [
      { q: 'How much is the silver Clicgear Model 4.0?', a: 'The Clicgear Model 4.0 in silver is $489 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Where can I buy clicgear 4.0 in Australia?', a: 'We stock it at our Yatala QLD depot and deliver across Australia, with freight quoted at checkout.' },
      { q: 'Is it one of the clicgear buggies that folds for small boots?', a: 'It folds compactly. Tell us your vehicle and we will advise on boot fit.' },
      { q: 'Is this a clicgear 4.0 australia stocked model with a battery?', a: 'We stock it in Australia. It is a manual push buggy with no battery or electronics.' },
      { q: 'What accessories come with the Clicgear golf buggy?', a: 'It comes with an umbrella holder, storage net, drink holder, storage console and accessory tabs.' },
      { q: 'Is it the clicgear 4.0 best price in Australia?', a: 'The silver model is $489 and the teal is $399, both including GST. Freight is quoted at checkout.' },
    ],
  },

  'clicgear-model-4-0-buggy-matte-white': {
    primaryKeyword: 'clicgear model 4.0',
    supportingKeywords: ['clicgear model 4 buggy', 'clicgear 4.0 golf trolley', 'clicgear 4.0 push cart', 'clicgear 4.0 accessories', 'three wheel golf buggies'],
    h1: 'Clicgear Model 4.0 Buggy in Matte White: Compact Push Buggy',
    seoTitle: 'Clicgear Model 4.0: Buy the Matte White Push Buggy',
    seoDescription: 'Buy the Clicgear Model 4.0 in matte white. Compact three-wheel push buggy with adjustable saddle, silicone straps and storage console, $489 inc GST.',
    short: 'matte white Clicgear 4.0',
    closingHeading: 'Where can I buy the matte white Clicgear 4.0?',
    intro:
      'The Clicgear Model 4.0 in matte white is the same stable, compact push buggy in a lighter finish. An adjustable upper saddle fits the bag, a lower saddle clears the front wheel, and silicone straps keep everything in place. It is $489 AUD including GST.',
    sections: [
      {
        heading: 'What makes the Clicgear Model 4.0 stable?',
        body: 'Three-wheel designs are stable because the load sits low and the wheels track predictably. The upper saddle adjusts to fit your bag, the lower saddle gives the front wheel clearance, and silicone straps with an umbrella tube strap hold the bag firmly. A stable buggy follows you without tipping on slopes, which is the main thing a golfer wants from a clicgear 4.0 golf trolley style design. This is a design that keeps things simple. Nothing needs charging, and nothing needs programming.',
      },
      {
        heading: 'What storage and clicgear 4.0 accessories are included?',
        body: 'The storage console locks, there is a silicone scorecard and pencil holder, and the buggy comes with an umbrella holder, storage net, drink holder and multiple accessory tabs. Those tabs let you add clicgear 4.0 accessories later, so the buggy can grow with your needs. It has no battery and no electronics, which means nothing to charge and very little to maintain. Three wheel golf buggies of this kind also suit golfers who like to keep gear to a minimum, because the console holds keys and a phone safely. A buggy that holds your valuables also removes a worry on the course. Prices include GST, and freight is quoted to your postcode at checkout. Ask us about our colours.',
      },
      {
        heading: 'Which colour should you pick?',
        body: 'Matte white is a clean, modern finish that stands out in a car park. Silver, soft pink and teal versions are listed separately, and the specification is the same across all four. The teal is currently the lowest priced at $399. If you are choosing between a push cart and a motorised buggy, tell us how you play and we will advise honestly. It is built around stability and durability, and the lower price than a motorised buggy leaves budget for other accessories. If you are buying for a gift, the finish is a talking point.',
      },
    ],
    faqs: [
      { q: 'How much is the Clicgear Model 4.0 in matte white?', a: 'It is $489 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is the Clicgear Model 4 buggy the same in every colour?', a: 'Yes. The specification is the same across silver, matte white, soft pink and teal. Only the finish differs.' },
      { q: 'Is it a good clicgear 4.0 golf trolley for beginners?', a: 'It is a compact, stable design with no electronics, which suits golfers of all levels.' },
      { q: 'Is the Clicgear 4.0 push cart foldable?', a: 'Yes. It has a compact three-wheel fold for the boot.' },
      { q: 'What clicgear 4.0 accessories can I add?', a: 'Accessory tabs let you add extras. Ask the Yatala desk what we stock.' },
      { q: 'Does the Clicgear Model 4.0 have a battery?', a: 'No. It is a manual push buggy.' },
    ],
  },

  'clicgear-model-4-0-buggy-soft-pink': {
    primaryKeyword: 'golf three wheel trolley',
    supportingKeywords: ['three wheel golf trolley', 'clicgear 4.0 price', '3 wheel golf buggy', 'best three wheel golf push cart', 'clicgear 4.0 golf trolley'],
    h1: 'Golf Three Wheel Trolley: Clicgear Model 4.0 in Soft Pink',
    seoTitle: 'Golf Three Wheel Trolley: Buy the Soft Pink Clicgear',
    seoDescription: 'Buy the soft pink Clicgear Model 4.0 golf three wheel trolley. Compact fold, adjustable saddle, silicone straps and lockable console, $489 inc GST.',
    short: 'soft pink Clicgear 4.0',
    closingHeading: 'Where can I buy the soft pink Clicgear 4.0?',
    intro:
      'A golf three wheel trolley is popular because it is stable, light and simple. The Clicgear Model 4.0 in soft pink adds some colour to a well-regarded compact push buggy. The clicgear 4.0 price is $489 AUD including GST, and there is no battery to charge.',
    sections: [
      {
        heading: 'Why choose a three wheel golf trolley?',
        body: 'This design is easy to steer and light to push, and it folds smaller than many four-wheel designs. The adjustable upper saddle gives a better bag fit, and the lower saddle adds front-wheel clearance. Silicone straps and the umbrella tube strap grip firmly, so the bag stays put on slopes. That combination is why this design is so popular with golfers who walk their rounds every week. A stable base means the buggy rolls straight when you let go, which helps on gentle slopes and when you stop to play shots. A stable base means the buggy rolls straight when you let go, which helps on gentle slopes and when you stop to play a shot.',
      },
      {
        heading: 'What is included at the clicgear 4.0 price?',
        body: 'A lockable storage console, scorecard and pencil holder and drink holder are built in, and the buggy comes with an umbrella holder, storage net and accessory tabs. That means the clicgear 4.0 price of $489 buys a complete setup, not a bare frame. With no battery to charge, it is ready whenever you are, and running costs are close to nothing across the life of the buggy. It costs less than any motorised option, and has no battery to replace. It also costs less than any motorised option, and there is no battery to replace down the track.',
      },
      {
        heading: 'Is soft pink a good choice?',
        body: 'Soft pink makes the buggy easy to spot in a crowded car park or on a busy course. The specification matches the other colours, which are listed separately. If you are comparing a 3 wheel golf buggy against a four-wheel design, tell us what you play and we will give you honest advice. Colour aside, it performs the same as the other versions, so choose the finish that you enjoy. We deliver across Australia from Yatala QLD, with freight quoted at checkout.',
      },
    ],
    faqs: [
      { q: 'What is the clicgear 4.0 price in soft pink?', a: 'The Clicgear Model 4.0 in soft pink is $489 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this a good golf three wheel trolley for walking golfers?', a: 'It is a compact, stable design with a lockable console and adjustable saddle, and it has no battery to look after.' },
      { q: 'What is the best three wheel golf push cart in your range?', a: 'The Clicgear Model 4.0 and the upgraded 4.5 are our three-wheel push models. Ask us which suits your game.' },
      { q: 'Does it have a battery?', a: 'No. It is a manual push buggy with no electronics.' },
      { q: 'Is it the same as the other Clicgear 4.0 golf trolley colours?', a: 'Yes. Silver, matte white and teal share the same specification.' },
      { q: 'What accessories come with the 3 wheel golf buggy?', a: 'It comes with an umbrella holder, storage net, drink holder, storage console and accessory tabs.' },
    ],
  },

  'clicgear-model-4-0-buggy-teal': {
    primaryKeyword: 'clicgear 4.0 for sale',
    supportingKeywords: ['clicgear 4.0 price', 'clicgear 4.0 golf cart', 'best 3 wheel golf push cart', 'three wheel golf buggy', 'clicgear buggies'],
    h1: 'Clicgear 4.0 for Sale: Teal Model 4.0 Push Buggy, $399',
    seoTitle: 'Clicgear 4.0 for Sale: Buy the Teal Push Buggy, $399',
    seoDescription: 'Buy the teal Clicgear 4.0 push buggy for $399 inc GST. Compact three-wheel fold, adjustable saddle, silicone straps and lockable storage console.',
    short: 'teal Clicgear 4.0',
    closingHeading: 'Where can I buy the teal Clicgear 4.0?',
    intro:
      'Looking for a Clicgear 4.0 for sale at the lowest price in the range? The teal Model 4.0 is the same compact three-wheel push buggy in a bolder colour, at $399 AUD including GST. It is the most affordable way into the Model 4.0 line.',
    sections: [
      {
        heading: 'What is the clicgear 4.0 price for the teal model?',
        body: 'The teal model is $399 AUD including GST, which is $90 less than the other colours at $489. The specification is the same: an adjustable upper saddle, a lower saddle for front-wheel clearance, and silicone straps with an umbrella tube strap. We would rather be clear about this than hide it: if colour does not matter to you, teal is the budget route into the Clicgear 4.0 range. That gap is considerable, and it is money you can put towards a bag, balls or a day of golf. The only trade-off is the finish, so check you like teal before you order. Prices include GST. Freight is quoted separately.',
      },
      {
        heading: 'What does the buggy include?',
        body: 'The storage console locks, there is a silicone scorecard and pencil holder, and the buggy comes with an umbrella holder, storage net, drink holder and accessory tabs. There is no battery, so there is nothing to charge and little to go wrong. Clicgear buggies are valued for stability and durability. The adjustable upper saddle and silicone straps matter more than the colour, because they decide how well the bag rides. A secure bag also protects your clubs from knocks on the way round.',
      },
      {
        heading: 'Is it a best 3 wheel golf push cart for the money?',
        body: 'For golfers who walk and want a stable, compact buggy at a sharp price, it is a strong option. Compare it with the 4.5 if you want an aluminium frame and adjustable handle, or with an electric model if you want motor help. Tell us what you play and what you carry, and we will say whether the teal Model 4.0 is the right buy. We are an Australian stockist and answer questions before you order, including delivery postcode quotes. If you would prefer a different colour, the other finishes are listed separately. A buggy with no battery also has no replacement cost down the track.',
      },
    ],
    faqs: [
      { q: 'How much is the teal Clicgear 4.0?', a: 'The teal Clicgear Model 4.0 is $399 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Why is the teal Clicgear 4.0 for sale at a lower price?', a: 'It is priced at $399 while the other colours are $489. The specification is listed as the same.' },
      { q: 'Is the Clicgear 4.0 golf cart style buggy electric?', a: 'No. It is a manual push buggy with no battery.' },
      { q: 'Is it a best 3 wheel golf push cart?', a: 'It is a compact, stable three-wheel design with a lockable console and adjustable saddle.' },
      { q: 'Is this a three wheel golf buggy that folds?', a: 'Yes. It has a compact three-wheel fold for the boot.' },
      { q: 'Do you stock other Clicgear buggies?', a: 'Yes. We also list the Model 4.0 in other colours and the upgraded Model 4.5.' },
    ],
  },

  'clicgear-model-4-5-buggy-black': {
    primaryKeyword: 'clicgear 4.5',
    supportingKeywords: ['clicgear 3.5 cup holder', 'clicgear golf push cart', '3 vs 4 wheel golf push cart', '3 wheel vs 4 wheel golf push cart', 'clicgear golf buggies'],
    h1: 'Clicgear 4.5 Buggy in Black: Upgraded Aluminium Push Buggy',
    seoTitle: 'Clicgear 4.5: Buy the Black Aluminium Push Buggy',
    seoDescription: 'Buy the black Clicgear 4.5 push buggy. Aluminium frame, stable three-wheel platform, adjustable handle height, console and cup holder, $549.99 inc GST.',
    short: 'Clicgear 4.5',
    closingHeading: 'Where can I buy the Clicgear 4.5?',
    intro:
      'The Clicgear 4.5 is the upgraded Clicgear push buggy, with a stronger frame and better storage than earlier models. It has an aluminium frame, a stable three-wheel platform and an adjustable handle. The black model is $549.99 AUD including GST.',
    sections: [
      {
        heading: 'What does the aluminium frame change?',
        body: 'The aluminium frame is built for long life, and it keeps weight down while adding strength. The three-wheel platform keeps the buggy balanced and easy to steer, and it folds compactly for the boot. Those are the qualities to look for if you walk every week and want a buggy that lasts. Because it is aluminium, it resists the rust that can affect cheaper frames, which is useful if you store the buggy in a damp garage or boot. A good push buggy should still look right after a few seasons.',
      },
      {
        heading: 'Why does adjustable handle height matter?',
        body: 'The handle height adjusts so the buggy suits golfers of different heights. A handle at the wrong height strains the back and shoulders on a long round, so this is a comfort feature as well as a convenience. Storage includes a console and a cup holder, with a built-in phone holder, so the essentials are within reach. A phone holder is a modern touch that many golfers use for music, scoring or GPS apps. Keeping the phone mounted also keeps it off the ground and out of pockets that can squash it.',
      },
      {
        heading: '3 vs 4 wheel golf push cart: which suits the Clicgear 4.5?',
        body: 'In the 3 vs 4 wheel golf push cart debate, three wheels give easier steering and a smaller fold, while four wheels can feel more planted on very rough ground. The 4.5 is a three-wheel design, so it suits golfers who value manoeuvrability and a compact boot footprint. As a push buggy it has no battery, motor or electronics, so running costs are close to nothing. If you are weighing the 4.5 against the Model 4.0, the difference is the frame, handle and storage. Tell us your budget and how often you play, and we will say whether the extra cost is worthwhile. We are an Australian stockist and quote freight to your postcode at checkout. Ask us about current stock.',
      },
    ],
    faqs: [
      { q: 'How much is the Clicgear 4.5 in black?', a: 'The Clicgear Model 4.5 Buggy in black is $549.99 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'What is different about the Clicgear 4.5?', a: 'It has an aluminium frame, an adjustable handle height and improved storage with a console, cup holder and phone holder.' },
      { q: 'Does it have a Clicgear 3.5 cup holder style drink holder?', a: 'It has a console and a cup holder, plus a built-in phone holder.' },
      { q: 'Is it a good Clicgear golf push cart for tall golfers?', a: 'Yes. The handle height adjusts, so it suits golfers of different heights.' },
      { q: 'Is a 3 wheel vs 4 wheel golf push cart choice important?', a: 'Three wheels give easier steering and a compact fold. Tell us your course and we will advise.' },
      { q: 'Do you stock other Clicgear golf buggies?', a: 'Yes. We also list the Clicgear Model 4.0 in several colours.' },
    ],
  },

  'rovic-rv1s-swivel-2-0-buggy-light-blue': {
    primaryKeyword: 'rovic rv1s 2.0',
    supportingKeywords: ['rovic golf buggy', 'rovic buggy', 'golf buggy rovic', 'rovic 2.0', 'golf trolley rovic'],
    h1: 'Rovic RV1S 2.0 Swivel Push Buggy in Light Blue',
    seoTitle: 'Rovic RV1S 2.0: Buy the Light Blue Swivel Push Buggy',
    seoDescription: 'Buy the Rovic RV1S 2.0 swivel push buggy in light blue. 360-degree front wheel, swivel lock, dual-action footbrakes and patented fold, $429 inc GST.',
    short: 'Rovic RV1S 2.0',
    closingHeading: 'Where can I buy the Rovic RV1S 2.0?',
    intro:
      'The Rovic RV1S 2.0 is a push buggy for golfers who want easy turning. Its front wheel swivels through 360 degrees for light, tight steering, and a swivel lock fixes it straight when you want to hold a line on a slope. The light blue model is $429 AUD including GST.',
    sections: [
      {
        heading: 'What does the 360-degree swivel wheel do?',
        body: 'A swivelling front wheel lets the buggy follow you around tight corners, bunker edges and crowded tee areas with very little effort. When you reach a slope or a long straight, the swivel lock fixes the wheel in line so the buggy tracks where you point it. Having both options in one buggy is the main attraction of a rovic golf buggy with this design, and it suits golfers who play varied courses. Light steering reduces the effort of a full round and is kinder to wrists and shoulders.',
      },
      {
        heading: 'How do the footbrakes and fold work?',
        body: 'Dual-action footbrakes park the buggy securely, so it stays put on a slope while you play a shot. The patented folding action packs it down for the boot, and a full console and umbrella mount are included. Clicgear accessory tabs let you add more, and the 2.0 update brings silicone bag straps and an external ball clip for a fast reload. There is no battery or electronics to look after. Parking without bending down is a small comfort, and a secure brake gives you peace of mind on a slope. The external ball clip means you can reload quickly after a shot.',
      },
      {
        heading: 'Is a golf trolley rovic style push buggy right for you?',
        body: 'It suits golfers who want a manual buggy that is easy to turn and simple to park. If your course is hilly and you want motor help, look at an electric model instead. If you walk flat ground and value light steering, the swivel design is a strong choice. Colour is the only difference between versions, so choose the finish you prefer and tell us your postcode for a freight quote. We are an Australian stockist in Yatala QLD, so you can ask us about the Rovic range before you buy. Prices include GST, and delivery is quoted against your postcode.',
      },
    ],
    faqs: [
      { q: 'How much is the Rovic RV1S 2.0 in light blue?', a: 'The Rovic RV1S Swivel 2.0 Buggy in light blue is $429 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'What is new on the Rovic RV1S 2.0?', a: 'The 2.0 update brings silicone bag straps and an external ball clip for a fast reload.' },
      { q: 'Is this a Rovic golf buggy with a battery?', a: 'No. It is a manual push buggy with no battery or electronics.' },
      { q: 'Can I add accessories to the Rovic buggy?', a: 'Yes. Clicgear accessory tabs let you add more fittings.' },
      { q: 'Does the swivel wheel lock for slopes?', a: 'Yes. A swivel lock fixes the front wheel straight when you want to hold a line.' },
      { q: 'Is the Rovic 2.0 a good golf buggy rovic option for small boots?', a: 'The patented fold packs it down for the boot. Tell us your vehicle and we will advise.' },
    ],
  },

  'rovic-rv1c-compact-2-0-buggy-silver-black': {
    primaryKeyword: 'rovic rv1c compact',
    supportingKeywords: ['rovic rv1c 2.0', 'rovic compact', 'rovic 1c', 'rovic rv1c golf push cart', 'rv1c rovic'],
    h1: 'Rovic RV1C Compact 2.0 Push Buggy in Silver and Black',
    seoTitle: 'Rovic RV1C Compact: Buy the Silver and Black Buggy',
    seoDescription: 'Buy the Rovic RV1C Compact 2.0 push buggy. Ultra-compact fold, handle-mounted brake and adjustable front-wheel tracking in silver and black, $399 inc GST.',
    short: 'Rovic RV1C Compact',
    closingHeading: 'Where can I buy the Rovic RV1C Compact?',
    intro:
      'The Rovic RV1C Compact is built for golfers short on boot space. Its ultra-compact fold packs the buggy down small, and a patented folding action makes it quick to open and close. The silver and black Rovic RV1C 2.0 is $399 AUD including GST.',
    sections: [
      {
        heading: 'How small does the Rovic RV1C 2.0 fold?',
        body: 'Ultra-compact storage is the headline feature, and it matters if you drive a small car, share the boot with other gear or store the buggy in a tight cupboard. The patented folding action is quick, so setting up at the first tee and packing away after the round takes seconds. A rovic compact design like this one is aimed squarely at golfers who have found larger push buggies awkward to load. Golfers who travel with the buggy in a small hatchback or a crowded boot will appreciate how little space it needs. It is easier to carry up steps or into a clubhouse locker.',
      },
      {
        heading: 'What does the handle-mounted brake add?',
        body: 'A handle-mounted brake is convenient to use because you do not have to bend down to park the buggy. Adjustable front-wheel tracking lets you set the buggy to run straight, which saves effort across a full round. A full console and umbrella mount are included, Clicgear accessory tabs allow add-ons, and the 2.0 version adds silicone bag straps and an external ball clip. Setting the tracking correctly is a one-time job, and then the buggy follows a straight line without pulling to one side. That saves effort and keeps the push light across a full round.',
      },
      {
        heading: 'Is a rovic 1c style buggy right for you?',
        body: 'It suits golfers who want a manual buggy that folds as small as possible, and it is the lowest-priced Rovic push buggy we list at $399. It has no battery or electronics, so there is nothing to charge and little to go wrong. If you need a swivel front wheel instead, the RV1S is listed separately. Tell us your vehicle and we will advise on boot fit. The silver and black finish is understated and matches most bags. We are an Australian stockist, prices include GST and freight is quoted to your delivery postcode at checkout. Questions are welcome.',
      },
    ],
    faqs: [
      { q: 'How much is the Rovic RV1C Compact 2.0?', a: 'The Rovic RV1C Compact 2.0 Buggy in silver and black is $399 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is the Rovic RV1C Compact easy to fit in a small boot?', a: 'It has an ultra-compact fold. Tell us your vehicle and we will advise on boot fit.' },
      { q: 'Is the Rovic RV1C 2.0 an upgrade on the earlier model?', a: 'The 2.0 version adds silicone bag straps and an external ball clip.' },
      { q: 'Does the rovic compact buggy have a battery?', a: 'No. It is a manual push buggy with no battery or electronics.' },
      { q: 'Is rv1c rovic the same as the Rovic 1C?', a: 'Yes. They refer to the same Compact model.' },
      { q: 'Can I add accessories to a Rovic RV1C golf push cart?', a: 'Yes. Clicgear accessory tabs let you add fittings.' },
    ],
  },

  'mgi-lithium-24v-13ah-battery': {
    primaryKeyword: 'mgi lithium battery',
    supportingKeywords: ['mgi golf buggy battery', 'mgi golf cart battery', 'mgi golf buggy lithium battery', 'lithium battery for golf trolley', 'lithium battery golf trolley'],
    h1: 'MGI Lithium Battery: Genuine 24V 13Ah Pack for the Navigator G800',
    seoTitle: 'MGI Lithium Battery: Buy the Genuine 24V 13Ah Pack',
    seoDescription: 'Buy a genuine MGI lithium battery. 24V 13Ah replacement pack for the Navigator G800, supplied with its lead and no bag required, $579 inc GST.',
    short: 'MGI 13Ah battery',
    closingHeading: 'Where can I buy the MGI 24V 13Ah battery?',
    intro:
      'A tired pack should not end a good buggy. This MGI lithium battery is a genuine 24V 13Ah replacement designed specifically for the Navigator G800. It comes with its lead and does not need a bag, so fitting is a matter of connecting and going. The price is $579 AUD including GST.',
    sections: [
      {
        heading: 'When should you replace an MGI golf buggy battery?',
        body: 'If your older MGI Navigator no longer holds a full round, a new battery is usually a far cheaper fix than a new buggy. Capacity falls slowly with age and use, and an mgi golf buggy battery that dies on the back nine is the usual sign. A genuine replacement restores the range the buggy was built to deliver and keeps a reliable walking buggy in service for many more seasons. Do not wait until the buggy fails on the course. A pack that is losing range is better replaced on your schedule than during a competition round.',
      },
      {
        heading: 'Why does the model series matter?',
        body: 'MGI batteries are specific to the model series they were designed for, so check your buggy against the compatibility note before ordering. This 24V 13Ah pack is made for the Navigator G800, and it is not a generic fit for every MGI. Using the correct pack protects the buggy electronics and keeps the charge behaving as intended, which is the main reason to buy a genuine part. If you are unsure of your series, send us a photo of the label or the model name and we will confirm. A wrong pack is an avoidable expense.',
      },
      {
        heading: 'Is a lithium battery for golf trolley use worth it?',
        body: 'A lithium battery golf trolley pack is lighter than the older lead-acid designs, which also makes the buggy easier to lift. The supplied lead means there is nothing extra to buy, and no bag is needed. We are an Australian stockist in Yatala QLD, so you are not waiting on an overseas order. Tell us your model and we will confirm the pack before you buy. Prices include GST, and freight is quoted to your delivery postcode at checkout so you know the full cost beforehand.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI lithium battery 24V 13Ah?', a: 'The MGI Lithium 24v 13Ah Battery is $579 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Which buggy does this MGI lithium battery fit?', a: 'It is designed specifically for the Navigator G800. Check compatibility before ordering.' },
      { q: 'Is this a genuine mgi golf cart battery?', a: 'Yes. It is a genuine MGI replacement battery supplied with its lead.' },
      { q: 'Does it need a bag?', a: 'No. It does not need a bag, so fitting is a matter of connecting and going.' },
      { q: 'Is an mgi golf buggy lithium battery cheaper than a new buggy?', a: 'If your older MGI Navigator no longer holds a full round, a new battery is usually a far cheaper fix.' },
      { q: 'Can I use any MGI battery?', a: 'No. MGI batteries are specific to the model series they were designed for.' },
    ],
  },

  'mgi-2024-zip-24v-250wh-lithium-battery': {
    primaryKeyword: 'mgi zip battery',
    supportingKeywords: ['mgi zip navigator battery', 'mgi zip battery replacement', 'mgi zip navigator battery replacement', 'mgi zip navigator battery life', 'mgi zip navigator battery charging'],
    h1: 'MGI Zip Battery: 2024 24V 250Wh Lithium Pack for Zip X1, X3 and X5',
    seoTitle: 'MGI Zip Battery: Buy the 2024 24V 250Wh Lithium Pack',
    seoDescription: 'Buy the MGI Zip battery. 2024 24V 250Wh lithium pack that fits the Zip X1, X3 and X5, charged with the MGI 24V lithium charger, $499 inc GST.',
    short: 'MGI Zip battery',
    closingHeading: 'Where can I buy this MGI Zip battery?',
    intro:
      'A spare MGI Zip battery means a full charge is always ready. The 2024 24V 250Wh lithium pack is the replacement or spare for the Zip X1, Zip X3 and Zip X5. It is $499 AUD including GST, and the charger is sold separately.',
    sections: [
      {
        heading: 'Why carry a spare mgi zip navigator battery?',
        body: 'A spare matters on a 36-hole day or when the first pack has lost capacity with age. You swap the packs and keep playing, rather than waiting for an overnight charge or cutting the round short. Keeping one pack on charge at home and one in the buggy means there is always a full battery to hand. It is a sensible and inexpensive way to protect a good day. It also gives you a back-up if you ever misplace the charger on a trip, since the second pack can carry the round while you sort it out.',
      },
      {
        heading: 'How does mgi zip battery replacement work?',
        body: 'This is the 2024 pack for the Zip X1, X3 and X5, so a replacement is a quick and simple swap rather than a technical workshop job. It uses a 24V 250Wh lithium design, which is lighter than older lead-acid packs. Because it fits three models, one spare can serve a household that owns more than one Zip buggy, which makes the purchase easy to justify. Fitting is straightforward, but if you are unsure, ask us before you order. We would rather confirm the model than have you buy the wrong part.',
      },
      {
        heading: 'What do you need for mgi zip navigator battery charging?',
        body: 'The battery can only be charged with the MGI Lithium 24V battery charger, model LC2323, which is sold separately and is not included. Do not use a charger from another product. If you do not already own the charger, add it to your order and we will confirm the right model for your buggy. Tell us your Zip model and we will check the fit. Prices include GST, and freight is quoted to your delivery postcode at checkout, so there are no surprises when you order. Our team can answer questions on delivery, parts and warranty before you commit.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Zip battery?', a: 'The MGI 2024 Zip 24V 250Wh Lithium Battery is $499 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Which buggies use this MGI Zip navigator battery?', a: 'It is compatible with the Zip X1, X3 and X5.' },
      { q: 'Is the charger included for mgi zip navigator battery charging?', a: 'No. It can only be charged with the MGI Lithium 24V battery charger, model LC2323, which is sold separately.' },
      { q: 'Is it a good mgi zip navigator battery replacement for an ageing pack?', a: 'Yes. It suits owners whose first pack has lost capacity with age.' },
      { q: 'Does a spare improve mgi zip navigator battery life?', a: 'A spare lets you rotate packs and always have a full charge ready on a long day.' },
      { q: 'Can I use it on another MGI model?', a: 'It is listed for the Zip X1, X3 and X5. Check with us before using it elsewhere.' },
    ],
  },

  'mgi-lithium-24v-250wh-battery': {
    primaryKeyword: 'mgi battery replacement',
    supportingKeywords: ['battery powered golf buggy', 'battery operated golf buggy', 'mgi golf buggy battery', 'golf trolley lithium battery', 'mgi battery charger replacement'],
    h1: 'MGI Battery Replacement: Standard 24V 250Wh Lithium Zip Pack',
    seoTitle: 'MGI Battery Replacement: Buy the 24V 250Wh Zip Pack',
    seoDescription: 'Buy an MGI battery replacement. Standard 24V 250Wh lithium pack for the Zip X-series, lighter than lead-acid and charged with MGI 24V, $499 inc GST.',
    short: 'MGI 250Wh battery',
    closingHeading: 'Where can I buy this MGI battery replacement?',
    intro:
      'This MGI battery replacement is the pack supplied as standard with the Zip X-series buggies. As a lithium battery it is lighter than the lead-acid packs older trolleys used. The MGI Lithium 24V 250Wh battery is $499 AUD including GST.',
    sections: [
      {
        heading: 'What is the standard Zip pack?',
        body: 'The 24V 250Wh lithium battery is the pack fitted as standard to the Zip X-series, so it is the natural choice for a replacement or a spare. A walking buggy depends on one component more than any other, and the pack is that component. Choosing the standard pack means the buggy keeps the performance it was designed to deliver, with no compromise on range or reliability. Reliability is the whole point of a replacement, and the standard pack is the one the buggy was tested with.',
      },
      {
        heading: 'Why is a golf trolley lithium battery better than lead-acid?',
        body: 'Lithium is noticeably lighter than the lead-acid packs older trolleys used, which makes a battery operated golf buggy easier to lift and handle. A lithium pack also holds its performance across the round rather than fading as the charge falls. It can only be charged with the MGI Lithium 24V battery charger, which is sold separately, so make sure you have one before you order. Lighter weight also reduces strain when you lift the buggy in and out of the boot.',
      },
      {
        heading: 'Should you buy it as a spare?',
        body: 'Yes, if you want a flat battery never to end a round early. Use it as a spare so a second full pack is always ready in the car or the garage. We hold MGI batteries and chargers in Australian stock at Yatala QLD, so an order does not mean a long overseas wait. Tell us your model and we will confirm the fit. Prices include GST, and freight is quoted to your delivery postcode at checkout. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is this MGI battery replacement?', a: 'The MGI Lithium 24V 250Wh Battery is $499 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this the standard pack for a battery powered golf buggy like the Zip X-series?', a: 'Yes. It is the pack supplied as standard with the Zip X-series buggies.' },
      { q: 'Does it fit a battery operated golf buggy from another brand?', a: 'No. It is an MGI battery for the Zip series. Check with us before ordering.' },
      { q: 'Is the charger included with the mgi golf buggy battery?', a: 'No. It can only be charged with the MGI Lithium 24V battery charger, which is sold separately.' },
      { q: 'Is this a lithium golf trolley battery that is lighter than lead-acid?', a: 'Yes. As a lithium battery it is lighter than the lead-acid packs older trolleys used.' },
      { q: 'Do I need an mgi battery charger replacement as well?', a: 'Only if your charger is damaged or missing. Ask us which charger suits your buggy.' },
    ],
  },

  'mgi-lithium-24v-smart-charger-ai-and-zip-series': {
    primaryKeyword: 'mgi battery charger',
    supportingKeywords: ['mgi charger', 'mgi battery charger replacement', 'mgi zip navigator battery charger', 'mgi 24v lithium battery charger', 'electric golf trolley battery charger'],
    h1: 'MGI Battery Charger: 24V Smart Digital Lithium Charger for Ai and Zip',
    seoTitle: 'MGI Battery Charger: Buy the 24V Smart Lithium Charger',
    seoDescription: 'Buy the MGI battery charger for Ai and Zip Series buggies. Digital charge indicator, overcharge protection, auto-shutoff and USB-C cable, $169 inc GST.',
    short: 'MGI smart charger',
    closingHeading: 'Where can I buy the MGI smart charger?',
    intro:
      'The MGI battery charger is the smart digital lithium charger made for the Ai and Zip Series. An on-board indicator shows where the battery is up to, and it includes overcharge protection and an auto-shutoff function. It is $169 AUD including GST.',
    sections: [
      {
        heading: 'What does the digital indicator tell you?',
        body: 'The on-board digital charge indicator shows the battery state, so you can see whether it is flat, charging or full without guessing. That is helpful before a morning round when you want to be sure the buggy is ready. Overcharge protection and auto-shutoff add a layer of safety, so the mgi charger can be left to finish its work rather than watched over until the lights change. A clear indicator also helps if the pack has not been used for a while, because you can see at a glance that charging has started properly.',
      },
      {
        heading: 'Is a mgi zip navigator battery charger compatible with your buggy?',
        body: 'It is made for the Ai and Zip Series. A built-in USB-C charging cable suits the Zip Navigator remote and mobile devices, but it is not compatible with the Ai Navigator GPS+ remote, so check your remote before you rely on that feature. If you own a Zip X-series buggy and a lithium pack, this charger is the correct match, and it is the one MGI lithium batteries are designed to use. The charger is lightweight and simple to store, and it replaces the guesswork that comes with a basic unit that offers no feedback.',
      },
      {
        heading: 'Why buy a second electric golf trolley battery charger?',
        body: 'If you want a spare so one can live in the garage and one in the boot, this is the model to order. A charger you can leave in the car means a quick top-up at the course, and it protects against a failed unit on the morning of a round. It is also a sensible replacement if your original charger has been lost or damaged. Tell us your model and we will confirm. Prices include GST, and freight is quoted to your delivery postcode at checkout, so the full cost is clear before you buy. Prices are in Australian dollars.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI battery charger?', a: 'The MGI Lithium 24v Smart Charger for the Ai and Zip Series is $169 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does this MGI charger fit the Ai Navigator GPS+ remote?', a: 'The built-in USB-C cable is not compatible with the Ai Navigator GPS+ remote. It suits the Zip Navigator remote and mobile devices.' },
      { q: 'Is it an mgi battery charger replacement for a lost charger?', a: 'Yes. It is a suitable replacement for Ai and Zip Series owners.' },
      { q: 'Does it work as an mgi 24v lithium battery charger for Zip packs?', a: 'Yes. It is made for the 24V lithium packs used on the Ai and Zip Series.' },
      { q: 'What safety features does it have?', a: 'It has overcharge protection and an auto-shutoff function.' },
      { q: 'Can I buy a spare electric golf trolley battery charger from you?', a: 'Yes. Order a second one so you have a unit for the garage and one for the boot.' },
    ],
  },

  'mgi-fireproof-charging-box': {
    primaryKeyword: 'mgi charging box',
    supportingKeywords: ['mgi battery box', 'mgi zip navigator battery charging', 'mgi battery charging time', 'golf trolley accessories', 'mgi zip navigator battery life'],
    h1: 'MGI Charging Box: Fireproof Storage and Charging for Zip and Ai Batteries',
    seoTitle: 'MGI Charging Box: Buy the Fireproof Battery Safe',
    seoDescription: 'Buy the MGI charging box. Fireproof box to store and charge a Zip or Ai Series lithium battery, designed to contain fire risk, safe indoors, $145 inc GST.',
    short: 'MGI charging box',
    closingHeading: 'Where can I buy the MGI fireproof charging box?',
    intro:
      'The MGI charging box is a safety accessory for storing and charging a Zip or Ai Series lithium battery. It is designed to significantly minimise fire risk and to contain a fire if one did start. It is made for use inside the home, and it costs $145 AUD including GST.',
    sections: [
      {
        heading: 'Why use an mgi battery box?',
        body: 'Lithium batteries are very safe in normal use, and charging them in a purpose-built box simply adds a layer of protection. That is particularly sensible in a garage with a car or stored goods nearby. A fire-containing design means that, in the unlikely event of a fault, the problem stays inside the box. It is a modest cost for a considerable amount of peace of mind. Looking after the pack properly matters for mgi zip navigator battery life, and a tidy charging routine helps.',
      },
      {
        heading: 'What happens during mgi zip navigator battery charging?',
        body: 'The box stores and charges a Zip or Ai Series battery, so you can plug in the charger and leave the pack to finish inside it. Because it is safe for indoor use, the battery can charge where you actually keep your buggy rather than in an outbuilding. Mgi battery charging time depends on the pack and the charger, so use the correct MGI charger and follow its instructions. Place the box on a hard, level surface away from combustibles, and keep the charger and lead tidy.',
      },
      {
        heading: 'Is it one of the golf trolley accessories worth buying?',
        body: 'It is an optional extra, not a required one, and many owners will charge safely without it. It suits households that store the buggy in a garage, owners with more than one battery and anyone who wants extra protection. It does not change how the battery performs, so it is a safety choice rather than a performance upgrade. Tell us your battery model and we will confirm the fit. Prices include GST, and freight is quoted to your delivery postcode at checkout. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. We would rather you ask first than order the wrong model.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI charging box?', a: 'The MGI Fireproof Charging Box is $145 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is the MGI charging box safe for indoor use?', a: 'Yes. It is made for use inside the home.' },
      { q: 'Which batteries fit the mgi battery box?', a: 'It stores and charges a Zip or Ai Series lithium battery.' },
      { q: 'Does it change mgi battery charging time?', a: 'It does not change how the battery performs. Use the correct MGI charger and follow its instructions.' },
      { q: 'Is it a required part of mgi zip navigator battery charging?', a: 'No. Lithium batteries are very safe in normal use, and the box adds a layer of protection.' },
      { q: 'What other golf trolley accessories do you stock?', a: 'We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk what suits your model.' },
    ],
  },

  'mgi-halo-eye': {
    primaryKeyword: 'golf buggy follow me',
    supportingKeywords: ['mgi follow me buggy', 'follow me golf trolley', 'follow me electric golf caddy', 'electric golf cart follow me', 'best follow me golf trolley'],
    h1: 'Golf Buggy Follow Me: MGI Halo Eye 2D LiDAR Sensor',
    seoTitle: 'Golf Buggy Follow Me: Buy the MGI Halo Eye Sensor',
    seoDescription: 'Buy the MGI Halo Eye for golf buggy follow me and return home on the Ai Navigator Halo. 2D LiDAR sensor with obstacle avoidance, $599 inc GST.',
    short: 'Halo Eye',
    closingHeading: 'Where can I buy the MGI Halo Eye?',
    intro:
      'Golf buggy follow me features turn a walking buggy into a hands-free one. The MGI Halo Eye is a 2D LiDAR sensor that adds follow me, return home, point-to-point and obstacle avoidance to the MGI Ai Navigator Halo. It is $599 AUD including GST.',
    sections: [
      {
        heading: 'How does the Halo Eye support a follow me golf trolley?',
        body: 'The Halo Eye captures precise spatial data from the environment to support real-time tracking, navigation and obstacle avoidance. Fitted to the Ai Navigator Halo, it lets the buggy trail you around the course while keeping its distance, which is how a follow me golf trolley behaves at its best. You walk, the buggy follows, and your hands stay free for the clubs. Walking with both hands free is a real change for golfers with sore wrists or shoulders, and it makes a round more relaxed.',
      },
      {
        heading: 'What do return home and point-to-point do?',
        body: 'Return home sends the buggy back to a set position, which is useful at the end of a round or when you want it waiting at the car. Point-to-point moves it between locations without you steering. Obstacle avoidance keeps it clear of obstacles on the way. Together these features reduce the effort of a round, and they are the reason to consider a follow me electric golf caddy. Set-up is part of the experience, so we recommend reading the instructions before your first round and practising in a quiet area.',
      },
      {
        heading: 'Will the Halo Eye fit your buggy?',
        body: 'It works only with the Ai Navigator Halo, and the rain cover is not suitable for use with it. It is not a universal accessory, so confirm that you own the Halo before you order. If you are choosing between this and a standard remote buggy, we can talk through the options. Tell us your model and we will confirm. Prices include GST, and freight is quoted to your delivery postcode at checkout, so the full cost is clear before you buy. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Halo Eye?', a: 'The MGI Halo Eye is $599 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does the Halo Eye give a golf buggy follow me function?', a: 'Yes. It adds follow me, return home, point-to-point and obstacle avoidance to the Ai Navigator Halo.' },
      { q: 'Which buggy does the MGI follow me buggy sensor fit?', a: 'It works only with the MGI Ai Navigator Halo.' },
      { q: 'Can I use the rain cover with it?', a: 'No. The rain cover is not suitable for use with the Halo Eye.' },
      { q: 'Is it a best follow me golf trolley upgrade for other buggies?', a: 'No. It is made for the Ai Navigator Halo only.' },
      { q: 'How is it different from an electric golf cart follow me system?', a: 'It is a LiDAR sensor for a walk-behind buggy, not a vehicle system. Ask us about your needs.' },
    ],
  },

  'mgi-phone-holder': {
    primaryKeyword: 'golf buggy phone holder',
    supportingKeywords: ['mgi phone holder', 'phone holder golf cart', 'golf cart iphone holder', 'phone holders for golf buggies', 'best golf cart phone holder'],
    h1: 'Golf Buggy Phone Holder: MGI Holder for Zip and Ai Top Boxes',
    seoTitle: 'Golf Buggy Phone Holder: Buy the MGI Top Box Mount',
    seoDescription: 'Buy the MGI golf buggy phone holder. Attaches to the top box of Zip and Ai Series buggies and adjusts to fit phones and GPS devices, $65 inc GST.',
    short: 'phone holder',
    closingHeading: 'Where can I buy the MGI phone holder?',
    intro:
      'A golf buggy phone holder keeps the course app where you can see it. The MGI Phone Holder attaches securely to the top box of an MGI buggy and keeps your phone or GPS device safe and in view. It is $65 AUD including GST.',
    sections: [
      {
        heading: 'How does the MGI phone holder attach?',
        body: 'The MGI phone holder fits to the top box of Zip and Ai Series buggies, so the phone sits at a convenient height without fiddling with straps or tape. An adjustable mechanism accommodates smartphones and GPS units, so there is no digging in a bag for the course app. It is a small accessory with a very practical purpose, and it keeps the phone off the ground and out of the rain. Keeping the phone mounted also reduces the chance of dropping it on a wet fairway or leaving it behind at a tee.',
      },
      {
        heading: 'Will a phone holder golf cart style fit your device?',
        body: 'The holder adjusts to suit smartphones and GPS devices. Owners often ask about size, and the adjustable design is the answer. If you use a thick case or a very large phone, tell us the model and we will help you check. A holder only works if the device stays put, and this one is designed to grip securely. Fitting is quick, and it removes the need for a separate stand or a clip on the handle.',
      },
      {
        heading: 'Which MGI buggies suit these phone holders for golf buggies?',
        body: 'It is compatible with both the Zip and Ai series electric buggies, and it is not suitable for the Quad series. That matters because the mounting differs between models, so check yours before ordering. Ordering one with a new buggy means the setup is complete on the first round. We hold stock at Yatala QLD, and prices include GST with freight quoted at checkout. Check your model before you order, and ask if you are unsure. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Enquiries are welcome from every state and territory.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI golf buggy phone holder?', a: 'The MGI Phone Holder is $65 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this the best golf cart phone holder for an MGI?', a: 'It is made for the top box of MGI Zip and Ai Series buggies, which is why it fits securely.' },
      { q: 'Will it hold a large phone?', a: 'The adjustable mechanism accommodates smartphones and GPS units. Tell us your phone model if unsure.' },
      { q: 'Does it fit the Quad series?', a: 'No. It is not suitable for the Quad series.' },
      { q: 'Is this a phone holder golf cart owners can use on any buggy?', a: 'No. It is made for the MGI Zip and Ai top box.' },
      { q: 'Is this a good golf cart iphone holder alternative?', a: 'It holds iPhones and other smartphones, as well as GPS devices.' },
    ],
  },

  'mgi-zip-series-gps-holder': {
    primaryKeyword: 'golf buggy gps holder',
    supportingKeywords: ['mgi zip navigator gps holder', 'mgi zip gps holder', 'golf cart gps holder', 'gps holder for golf cart', 'golf trolley gps holder'],
    h1: 'Golf Buggy GPS Holder: MGI Zip Series Replacement Mount',
    seoTitle: 'Golf Buggy GPS Holder: Buy the MGI Zip Series Mount',
    seoDescription: 'Buy the MGI Zip Series golf buggy GPS holder. Replacement top box mount for Sureshot GPS devices and others up to 7.5cm wide, $36.95 inc GST.',
    short: 'GPS holder',
    closingHeading: 'Where can I buy the MGI Zip GPS holder?',
    intro:
      'A golf buggy gps holder keeps your distances where you can read them. The MGI Zip Series GPS Holder is a replacement mount for the top box of a Zip Series buggy. It is a simple, inexpensive fitting, priced at $36.95 AUD including GST.',
    sections: [
      {
        heading: 'What does the MGI Zip GPS holder fit?',
        body: 'The holder fits the top box of a Zip Series buggy and holds a GPS device securely through the round. It is compatible with all Sureshot GPS devices and with other devices up to 7.5cm wide. That makes the mgi zip gps holder a practical choice for golfers who already own a handheld GPS and want it mounted on the buggy rather than carried in a pocket. A secure mount also protects the device from drops, which matters because a damaged GPS is far more expensive than the holder.',
      },
      {
        heading: 'Why replace a golf cart gps holder?',
        body: 'Mounts get knocked, cracked or lost over time, and a loose gps holder for golf cart style fittings is a nuisance on a bumpy fairway. A replacement is an inexpensive fix that restores the secure fit the buggy was designed with. Because it is a simple part, fitting is quick, and the price is far lower than replacing the device or putting up with a mount that rattles through a round. If you have lost the original mount, a replacement is also a neat way to rebuild a complete top box without buying a new buggy.',
      },
      {
        heading: 'Is a golf trolley gps holder suited to every device?',
        body: 'It suits devices up to 7.5cm wide, which covers most handheld GPS units, including all Sureshot models. If your device is wider, measure it before ordering. A phone is better served by the MGI Phone Holder, which is listed separately and adjusts for larger screens. Tell us your device and your buggy model and we will confirm which holder suits you best. Prices include GST, and freight is quoted to your delivery postcode at checkout, so you can see the full cost before you order. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI Zip Series GPS holder?', a: 'The MGI Zip Series GPS Holder is $36.95 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is this the right golf buggy gps holder for a Zip Series?', a: 'Yes. It is a replacement mount for the top box of a Zip Series buggy.' },
      { q: 'Does it work as an mgi zip navigator gps holder?', a: 'Yes. It fits the Zip Series top box and holds compatible GPS devices up to 7.5cm wide.' },
      { q: 'Does it suit Sureshot devices?', a: 'Yes. It is compatible with all Sureshot GPS devices.' },
      { q: 'Can I use it as a golf cart gps holder for a phone?', a: 'It suits devices up to 7.5cm wide. For phones, see the MGI Phone Holder.' },
      { q: 'Can I use it on a golf trolley gps holder mount from another brand?', a: 'It is made for the Zip Series top box. Ask us about other brands.' },
    ],
  },

  'mgi-umbrella-holder': {
    primaryKeyword: 'mgi umbrella holder',
    supportingKeywords: ['golf buggy umbrella holder', 'umbrella holder for golf buggy', 'mgi zip umbrella holder', 'mgi zip navigator umbrella holder', 'golf cart accessory'],
    h1: 'MGI Umbrella Holder: Two-Way Adjustable, Tool-Free Fitting',
    seoTitle: 'MGI Umbrella Holder: Buy the Two-Way Adjustable Mount',
    seoDescription: 'Buy the MGI umbrella holder. Two-way adjustable fitting for carrying an umbrella on the buggy, handles up to 38mm, tool-free installation, $59.95 inc GST.',
    short: 'umbrella holder',
    closingHeading: 'Where can I buy the MGI umbrella holder?',
    intro:
      'An MGI umbrella holder keeps a brolly on the buggy and out of your hand. This two-way adjustable fitting carries an umbrella on the buggy, and the wide opening takes handles up to 38mm in diameter. It needs no tools to install and is $59.95 AUD including GST.',
    sections: [
      {
        heading: 'What does two-way adjustable mean?',
        body: 'The holder adjusts in two directions, so you can set the umbrella at the angle and position that give the best cover. That matters because a brolly that points the wrong way protects the bag but not the golfer. A well-set golf buggy umbrella holder lets you walk and push in the rain with your hands free for the clubs, and it saves you balancing a wet umbrella under one arm. In a sudden Australian shower, being able to put the umbrella up without stopping is a real convenience.',
      },
      {
        heading: 'Will an umbrella holder for golf buggy use fit my umbrella?',
        body: 'The wide opening takes handles up to 38mm in diameter, which suits most umbrellas. Measure the handle on yours if it is unusually thick. Installation needs no tools, so you can fit it at the car before a round without a workshop. If your umbrella is tall or you are above average height, the separate extender adds extra height so the canopy sits where it covers you. Test the fit with your own umbrella as soon as it arrives, so you know it is secure before a wet round.',
      },
      {
        heading: 'Which MGI buggy is it made for?',
        body: 'Make sure you choose the holder made for your specific buggy series, because fittings differ between Zip, Ai and other MGI models. Tell us your model and we will confirm the correct part before you order. It is a practical, modest purchase that pairs well with the MGI rain cover, which keeps the clubs dry while the holder keeps you dry. It is also a handy shade on a sunny day, and many golfers use it for that as much as for rain. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our desk is based at Yatala QLD.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI umbrella holder?', a: 'The MGI Umbrella Holder is $59.95 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'What size handle fits the MGI umbrella holder?', a: 'It accepts handles up to 38mm in diameter, which suits most umbrellas.' },
      { q: 'Do I need tools to fit a golf buggy umbrella holder like this?', a: 'No. Installation needs no tools.' },
      { q: 'Is this an mgi zip navigator umbrella holder for the Zip series?', a: 'It is made for MGI buggies. Choose the holder made for your series, and ask us if you are unsure.' },
      { q: 'Can a mgi zip umbrella holder be raised for a tall golfer?', a: 'Yes. The MGI Umbrella Holder Extender adds 150mm of height.' },
      { q: 'What other golf cart accessory items do you stock?', a: 'We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk what suits your model.' },
    ],
  },

  'mgi-umbrella-holder-extender': {
    primaryKeyword: 'mgi umbrella holder extender',
    supportingKeywords: ['mgi zip umbrella holder extender', 'umbrella holder extender', 'umbrella holder extension', 'golf buggy umbrella holder', 'golf cart accessories australia'],
    h1: 'MGI Umbrella Holder Extender: Adds 150mm of Height',
    seoTitle: 'MGI Umbrella Holder Extender: Buy the 150mm Riser',
    seoDescription: 'Buy the MGI umbrella holder extender. Adds 150mm of height so the umbrella covers taller golfers, fits all MGI umbrella holders, $41.50 inc GST.',
    short: 'umbrella extender',
    closingHeading: 'Where can I buy the MGI umbrella extender?',
    intro:
      'For the taller golfer, the MGI umbrella holder extender adds 150mm of height to your umbrella so it sits where it actually covers you. It fits into the MGI Umbrella Holder and is compatible with all MGI umbrella holders. The price is $41.50 AUD including GST.',
    sections: [
      {
        heading: 'Why does umbrella height matter?',
        body: 'A brolly mounted too low covers the bag but leaves your head and shoulders exposed, and it can catch your elbow as you swing. Adding 150mm lifts the canopy to a position where it protects the golfer as well as the clubs. Taller players notice this immediately, and it often turns a holder that was almost right into one that genuinely works for them. Because the extension raises the canopy, you can also stand closer to the buggy without brushing the umbrella.',
      },
      {
        heading: 'How does an umbrella holder extension fit?',
        body: 'An umbrella holder extension simply slots into the MGI Umbrella Holder, which means there is nothing to drill or modify. It is compatible with all MGI umbrella holders, so it works whichever model you already own. You get a comfortable, adjustable position for better protection on the course, and you can remove it if you want a lower profile on a dry day. It is a simple part, so there is nothing to maintain and nothing to wear out beyond the normal life of the fitting.',
      },
      {
        heading: 'Do you need the extender or a new umbrella?',
        body: 'If your umbrella is a standard size and you are above average height, the extender is the cheaper answer than buying a larger umbrella. It is an optional accessory and it is only useful with an MGI umbrella holder, so it makes sense to add it to the same order as the holder. Tell us your height and your model and we will say whether it will help. We are an Australian stockist, so you can ask about compatibility before you buy. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Every price on this page includes GST, so the figure you see is the figure you pay for the item.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI umbrella holder extender?', a: 'The MGI Umbrella Holder Extender is $41.50 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'How much height does the extender add?', a: 'It adds 150mm of height to your umbrella.' },
      { q: 'Is an umbrella holder extension compatible with every MGI holder?', a: 'Yes. It is compatible with all MGI umbrella holders.' },
      { q: 'Can I use a mgi zip umbrella holder extender on another brand?', a: 'It is made for MGI umbrella holders. Ask us if you want to use it elsewhere.' },
      { q: 'Does a golf buggy umbrella holder come with the extender?', a: 'No. The holder and the extender are listed separately.' },
      { q: 'Do you stock other golf cart accessories Australia buyers need?', a: 'Yes. We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk what suits your model.' },
    ],
  },

  'mgi-drink-bottle-holder': {
    primaryKeyword: 'mgi drink holder',
    supportingKeywords: ['golf buggy drink holder', 'golf cart drink holder', 'golf trolley bottle holder', 'golf trolley drinks holder', 'golf cart beverage holder'],
    h1: 'MGI Drink Holder: Bottle Holder for Zip and Ai Buggies',
    seoTitle: 'MGI Drink Holder: Buy the Buggy Drink Bottle Holder',
    seoDescription: 'Buy the MGI drink holder. Attaches to the buggy and holds bottles up to 75mm in diameter so you stay hydrated on a hot Australian round, $35 inc GST.',
    short: 'drink holder',
    closingHeading: 'Where can I buy the MGI drink holder?',
    intro:
      'The MGI drink holder attaches to the buggy so your drink is within arm\'s reach and you stay hydrated on a hot Australian round. It holds bottles up to 75mm in diameter and costs $35 AUD including GST.',
    sections: [
      {
        heading: 'Why does a golf buggy drink holder matter?',
        body: 'A hot round demands regular drinks, and a bottle in the bag is a bottle you forget to drink. A holder on the buggy keeps it in sight and in reach, so sipping becomes a habit instead of a chore. It also keeps the bottle upright and out of the dirt when you set the buggy down, which is more hygienic than leaving it on the ground. On a hot Australian day, dehydration is a genuine risk, and regular drinks help keep concentration and energy up through the back nine.',
      },
      {
        heading: 'What size bottle will it hold?',
        body: 'It holds bottles up to 75mm in diameter, which covers most standard drink bottles and many larger sports bottles. If you carry an oversized insulated flask, measure it first. A golf trolley bottle holder only works when the bottle fits snugly, so check the diameter of your favourite bottle against the 75mm limit before you buy. A tight fit also stops the bottle rattling, which keeps the buggy quiet and your playing partners happy.',
      },
      {
        heading: 'Which MGI buggy suits this holder?',
        body: 'Choose the holder made for your respective buggy series, because attachment points differ between models. If you are not sure, tell us your buggy and we will confirm the match. It is an inexpensive accessory, and many golfers add it together with the phone holder and the scorecard holder so the buggy carries everything they need for the round. We are an Australian stockist in Yatala QLD, and prices include GST. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. You can ask us for current availability, because we hold stock at our Yatala QLD depot. We would rather you ask first than order the wrong model.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI drink holder?', a: 'The MGI Drink Bottle Holder is $35 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'What bottle size does it hold?', a: 'It holds bottles up to 75mm in diameter.' },
      { q: 'Is this a golf buggy drink holder for any brand?', a: 'It is made for MGI buggies. Choose the holder made for your series.' },
      { q: 'Can a golf cart drink holder like this carry a can?', a: 'It is designed for bottles up to 75mm in diameter. Ask us about cans.' },
      { q: 'Is it a golf trolley drinks holder for the Quad series?', a: 'Choose the holder made for your respective buggy series. Ask us if you are unsure.' },
      { q: 'Do you stock another golf cart beverage holder for MGI?', a: 'We list the MGI drink bottle holder. Ask the Yatala desk about other options.' },
    ],
  },

  'mgi-multipurpose-hook': {
    primaryKeyword: 'mgi golf buggy accessories',
    supportingKeywords: ['mgi golf buggies accessories', 'golf cart accessory', 'golf carts accessories', 'golf trolley accessories', 'golf cart accessories australia'],
    h1: 'MGI Golf Buggy Accessories: Multipurpose Stainless-Steel Hook',
    seoTitle: 'MGI Golf Buggy Accessories: Buy the Multipurpose Hook',
    seoDescription: 'Buy MGI golf buggy accessories. The multipurpose hook has a stainless-steel spring-loaded closure and attaches to the accessory mount, $20.95 inc GST.',
    short: 'multipurpose hook',
    closingHeading: 'Where can I buy the MGI multipurpose hook?',
    intro:
      'MGI golf buggy accessories do not need to be expensive to be useful. The MGI Multipurpose Hook attaches to the accessory mount on the buggy and keeps a towel, glove or small bag within reach. It costs $20.95 AUD including GST.',
    sections: [
      {
        heading: 'What can you hang on the MGI hook?',
        body: 'It keeps your golfing essentials, such as a towel, glove or small bag, within reach, so they are not buried in the bag or left on a tee. The upper is high-density plastic for durability and the hook is stainless steel with a spring-loaded closure. That means items stay secured while you walk, instead of slipping off when the buggy hits a bump or a slope. A towel on a hook dries between uses and stays out of the dirt, which is better than wadding it into a pocket.',
      },
      {
        heading: 'Why choose mgi golf buggies accessories like this one?',
        body: 'It is a small, cheap fitting that earns its place, and it is a sensible add-on to a larger order of MGI accessories. Because it attaches to the accessory mount, there is nothing to drill or modify. If you already have a phone holder or drink holder fitted, check that the mount has room before you order, and tell us your model if you are unsure. Spring-loaded closure means the hook shuts on what you hang on it, so a glove does not fall off on a bump.',
      },
      {
        heading: 'Is it right for your buggy?',
        body: 'The hook attaches to the accessory mount on MGI buggies, so it suits models that have one. Choose the part made for your buggy series, and ask us if you want to confirm. We stock a range of golf trolley accessories at Yatala QLD, so you can add several fittings to one parcel and pay a single freight quote at checkout. Because the hook is inexpensive, many golfers add it to a larger order rather than buying it alone. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Many buyers confirm the details with us on WhatsApp before ordering, and we are happy to do the same.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI multipurpose hook?', a: 'The MGI Multipurpose Hook is $20.95 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'What is the hook made of?', a: 'It has a stainless-steel hook with a spring-loaded closure and a high-density plastic upper.' },
      { q: 'Is it one of the mgi golf buggy accessories that needs tools?', a: 'It attaches to the accessory mount on the buggy. Ask us if you are unsure about fitting.' },
      { q: 'Is this one of the mgi golf buggies accessories that fits every model?', a: 'Choose the part made for your buggy series. Tell us your model and we will confirm.' },
      { q: 'Can I add a golf cart accessory or two to the same order?', a: 'We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk.' },
      { q: 'Do you stock golf carts accessories and other golf cart accessories Australia wide?', a: 'Yes. We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk.' },
    ],
  },

  'mgi-scorecard-holder': {
    primaryKeyword: 'mgi zip navigator scorecard holder',
    supportingKeywords: ['mgi zip scorecard holder', 'mgi golf buggies accessories', 'golf trolley accessories', 'golf cart accessory', 'golf carts accessories'],
    h1: 'MGI Zip Navigator Scorecard Holder: Water-Resistant Cover and Tray',
    seoTitle: 'MGI Zip Navigator Scorecard Holder: Buy the Tray Holder',
    seoDescription: 'Buy the MGI Zip Navigator scorecard holder. Water-resistant cover, flat writing surface and a tray for a pencil, tees and balls, $44.95 inc GST.',
    short: 'scorecard holder',
    closingHeading: 'Where can I buy the MGI scorecard holder?',
    intro:
      'The MGI Zip Navigator scorecard holder protects your scorecard under a water-resistant cover and gives you a flat surface to write scores on as you walk. A storage tray holds a pencil, spare tees and balls. It costs $44.95 AUD including GST.',
    sections: [
      {
        heading: 'Why use a scorecard holder on the buggy?',
        body: 'A card in a pocket gets crushed, wet or lost, and writing on a soft surface smears the numbers. The water-resistant cover protects the card from rain and splashes, and the flat writing surface makes scores easy to record without stopping. It keeps the round moving, which your playing partners will appreciate, and it saves a lot of crumpled cards. Dry scores are readable scores, and a clean card is easier to hand in at the end of a round.',
      },
      {
        heading: 'What goes in the storage tray?',
        body: 'The tray holds a pencil, spare tees and balls, so the small things stay organised and in one place. That means you are not searching the bag for a tee on the next hole or borrowing a pencil from a partner. It is a modest feature, but it is the kind of detail that makes a buggy feel complete and thoughtfully set up for the way people actually play. Spare tees and balls to hand also mean fewer pauses mid-round, and that helps pace of play.',
      },
      {
        heading: 'How do you choose the right mgi zip scorecard holder?',
        body: 'Choose the holder made for your respective buggy series, because mounting points differ between models. A mgi zip scorecard holder suits Zip owners, and other models have their own versions. Tell us your buggy and we will confirm the correct part. It pairs well with the phone holder and the drink holder if you want to set up the buggy fully in one order. We are an Australian stockist, so you can ask about fit before you order. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Call or message the Yatala desk and we will answer your questions in plain language. Send us your postcode and we will quote freight before you commit to the order.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI scorecard holder?', a: 'The MGI Scorecard Holder is $44.95 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does the mgi zip navigator scorecard holder have a waterproof cover?', a: 'It has a water-resistant cover that protects the scorecard.' },
      { q: 'What does the tray hold?', a: 'It holds a pencil, spare tees and balls.' },
      { q: 'Is this a mgi zip scorecard holder only for Zip buggies?', a: 'Choose the holder made for your respective buggy series. Ask us if you are unsure.' },
      { q: 'Can I add other golf trolley accessories or a golf cart accessory to the same order?', a: 'Yes. We list phone holders, drink holders, hooks and more. Freight is quoted once at checkout.' },
      { q: 'Do you stock other mgi golf buggies accessories and golf carts accessories?', a: 'Yes. Ask the Yatala desk what suits your model.' },
    ],
  },

  'mgi-seat': {
    primaryKeyword: 'mgi seat',
    supportingKeywords: ['golf buggy with seat', 'golf buggy seats', 'seat for golf buggy', 'single seat golf buggy', 'mgi zip seat'],
    h1: 'MGI Seat: Padded Golf Buggy Seat with Lined Storage',
    seoTitle: 'MGI Seat: Buy the Padded Buggy Seat with Storage',
    seoDescription: 'Buy the MGI seat. Padded golf buggy seat with a lined storage compartment and a bracket to attach to the base frame, $187.50 inc GST.',
    short: 'MGI seat',
    closingHeading: 'Where can I buy the MGI seat?',
    intro:
      'The MGI seat is a padded seat for comfort and practicality. A lined storage compartment gives easy access to your golfing essentials, and a bracket is included to attach it to the base frame. It is $187.50 AUD including GST.',
    sections: [
      {
        heading: 'When does a golf buggy with seat make sense?',
        body: 'A seat lets you rest between shots, which matters on a slow round, for golfers with sore knees or backs, and on hot days. A golf buggy with seat support also means you can wait for the group ahead without standing. It is not a ride-on conversion, so you still walk the course, but it gives you somewhere comfortable to pause and recover. Resting between shots can also help with pace of play on a day when you walk a full eighteen holes.',
      },
      {
        heading: 'What does the lined storage add?',
        body: 'The lined storage compartment keeps a few items handy, such as a glove, a towel or snacks, under the seat where they are protected. The padded seat is built for comfort and practicality rather than extended use, so think of it as a place to sit for a few minutes at a time. The included bracket attaches it to the base frame without a separate purchase. Keep heavy loads off the seat, because it is intended for a golfer taking a short rest.',
      },
      {
        heading: 'Is a seat for golf buggy use suited to every MGI?',
        body: 'Choose the seat made for your respective buggy, because fitting differs between models. The Quad seat bracket is sold separately, so Quad owners need to add that part. If you are not sure which version you need, tell us your model and we will confirm before you order. It is a comfort upgrade, and we are happy to talk through the details. We are an Australian stockist at Yatala QLD, so ask us before you order if you are unsure. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Call or message the Yatala desk and we will answer your questions in plain language. Send us your postcode and we will quote freight before you commit to the order.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI seat?', a: 'The MGI Seat is $187.50 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does it include a bracket?', a: 'Yes. It includes a bracket to attach it to the base frame. The Quad seat bracket is sold separately.' },
      { q: 'Is this one of the golf buggy seats that works on any brand?', a: 'No. It is made for MGI buggies. Choose the seat made for your respective buggy.' },
      { q: 'Can I add a single seat golf buggy style seat to my Zip?', a: 'Yes, subject to the model. Tell us your buggy and we will confirm the correct seat.' },
      { q: 'Is the MGI Zip seat the same as this one?', a: 'Choose the seat made for your series. Ask us if you are unsure.' },
      { q: 'Does it have storage?', a: 'Yes. It has a lined storage compartment for your golfing essentials.' },
    ],
  },

  'mgi-rain-cover': {
    primaryKeyword: 'mgi rain cover',
    supportingKeywords: ['golf buggy rain cover', 'mgi zip navigator rain cover', 'mgi zip rain cover', 'mgi golf rain cover', 'mgi rain cover instructions'],
    h1: 'MGI Rain Cover: Water-Resistant Golf Bag Cover with Concertina Opening',
    seoTitle: 'MGI Rain Cover: Buy the Water-Resistant Bag Cover',
    seoDescription: 'Buy the MGI rain cover. Water-resistant golf bag cover with a concertina opening that attaches to the upper bag support of compatible buggies, $189 inc GST.',
    short: 'rain cover',
    closingHeading: 'Where can I buy the MGI rain cover?',
    intro:
      'The MGI rain cover keeps your clubs dry when the weather turns. The water-resistant, durable design has a concertina opening for easy access to your clubs. It costs $189 AUD including GST.',
    sections: [
      {
        heading: 'How does the concertina opening work?',
        body: 'The concertina opening lets you reach a club without taking the cover off, so you can play through a shower with the bag still protected. The cover is water-resistant and durable, designed to shed rain rather than let it soak into the grips and shafts. A golf buggy rain cover that is quick to use will actually stay on the buggy, which is the whole point. A dry bag also means dry grips, and dry grips are safer and more reliable in your hands.',
      },
      {
        heading: 'How does it attach?',
        body: 'It attaches using the existing holes in the upper bag support of compatible MGI buggies, so there is nothing to drill. That makes fitting a short job. Check the compatibility of your buggy before ordering, and follow the mgi rain cover instructions supplied with it. It is not suitable for use with the Halo Eye, so Halo owners with the sensor fitted should not use it. Fitting is quick, so you can leave it in place and fold it back when the weather clears.',
      },
      {
        heading: 'Is a mgi zip navigator rain cover worth the cost?',
        body: 'Wet grips make poor shots, and rain can damage a bag and club heads over time. If you play in all weathers, a cover is an inexpensive way to protect the clubs and keep the round enjoyable. In Australia a sudden shower is common, so it is a sensible item to keep fitted. Tell us your model and we will confirm the correct cover before you order. A cover is a modest cost compared with replacing a soaked bag or damaged grips. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. If you are replacing an older buggy, tell us what you drive now and we will compare it.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI rain cover?', a: 'The MGI Rain Cover is $189 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Is the MGI rain cover waterproof?', a: 'It is water-resistant and durable, designed to keep your clubs dry when the weather turns.' },
      { q: 'Is this a golf buggy rain cover for the Halo?', a: 'No. It is not suitable for use with the Halo Eye.' },
      { q: 'Does it fit a mgi zip rain cover position?', a: 'It attaches using the existing holes in the upper bag support of compatible MGI buggies.' },
      { q: 'Where can I find mgi rain cover instructions?', a: 'Instructions are supplied with the cover. Ask us if you need help with fitting.' },
      { q: 'Can I use it as a mgi golf rain cover on a different brand?', a: 'It is made for compatible MGI buggies. Ask us before using it on another brand.' },
    ],
  },

  'mgi-wheel-covers': {
    primaryKeyword: 'mgi spare parts',
    supportingKeywords: ['golf cart wheels', 'golf trolleys', 'sale golf trolleys', 'electric trolleys golf', 'three wheel golf trolley'],
    h1: 'MGI Spare Parts: Wheel Covers for Storage and Travel',
    seoTitle: 'MGI Spare Parts: Buy Wheel Covers for Your Buggy',
    seoDescription: 'Buy MGI spare parts online. Wheel covers protect the rear wheels and keep mud and grass off your car boot and clothes during storage and travel, $29.95 inc GST.',
    short: 'wheel covers',
    closingHeading: 'Where can I buy MGI wheel covers?',
    intro:
      'MGI spare parts include small items that make a large difference. MGI wheel covers protect the rear wheels of a buggy when it is not in use or when you are travelling with it. They keep mud and grass off your car boot and your clothes, and cost $29.95 AUD including GST.',
    sections: [
      {
        heading: 'What do the wheel covers protect?',
        body: 'They cover the rear wheels, which pick up the most mud and grass during a round. When the buggy goes into the boot, the covers keep that dirt on the wheel and off the carpet, the bag and your clothes. They are simple and inexpensive, and they pay for themselves quickly in cleaning time, especially after a wet round or a muddy course. Muddy wheels are the usual cause of a dirty boot, so a small cover has a disproportionate effect.',
      },
      {
        heading: 'Why do golf trolleys need wheel covers?',
        body: 'Golf trolleys spend time on damp fairways, then get lifted into cars, so wheels carry dirt where it is not wanted. Covers remove that problem. They also protect the wheel surface during storage, which matters if the buggy sits in a garage or shed between rounds. They are a useful accessory for owners of electric trolleys golf courses see every week. Storing the buggy with covers on also keeps cobwebs and garage dust off the tyres.',
      },
      {
        heading: 'Which MGI buggy do they fit?',
        body: 'Choose the covers made for your respective buggy series, because wheel sizes differ between models. If you are not sure, tell us your model and we will confirm the correct size. They are a low-cost way to look after the buggy and your car, and you can add them to an order for a battery, a charger or other accessories and pay one freight quote. If you buy new golf cart wheels later, check that the covers still fit. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Our team can answer questions on delivery, parts and warranty before you commit. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much are the MGI wheel covers?', a: 'MGI Wheel Covers are $29.95 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'What do the covers protect?', a: 'They protect the rear wheels and keep mud and grass off your car boot and your clothes.' },
      { q: 'Are these MGI spare parts for every buggy?', a: 'Choose the covers made for your respective buggy series. Tell us your model if you are unsure.' },
      { q: 'Do they suit other golf trolleys?', a: 'They are made for MGI buggies. Ask us before using them on another brand.' },
      { q: 'Are they a sale golf trolleys accessory worth buying?', a: 'They are a low-cost accessory that keeps the car clean and protects the wheels.' },
      { q: 'Can I add them to a three wheel golf trolley order?', a: 'Yes. Add them to any order and freight is quoted once at checkout.' },
    ],
  },

  'mgi-cooler-bag': {
    primaryKeyword: 'mgi zip navigator cooler bag',
    supportingKeywords: ['golf buggy cooler bag', 'mgi zip cooler bag', 'mgi zip cooler and storage bag', 'golf buggy bag', 'golf trolley bags'],
    h1: 'MGI Zip Navigator Cooler Bag: Insulated Cooler and Storage Bag',
    seoTitle: 'MGI Zip Navigator Cooler Bag: Buy the Insulated Bag',
    seoDescription: 'Buy the MGI Zip Navigator cooler bag. Insulated storage bag with a spacious main compartment, two valuables pockets and a clip-on bracket, $92.95 inc GST.',
    short: 'cooler bag',
    closingHeading: 'Where can I buy the MGI cooler bag?',
    intro:
      'The MGI Zip Navigator cooler bag is a cooler and storage bag with a spacious main compartment and two pockets for valuables. The insulation keeps items hot, cold and dry through the round. It costs $92.95 AUD including GST.',
    sections: [
      {
        heading: 'What does the insulation do in a golf buggy cooler bag?',
        body: 'The insulated main compartment keeps drinks cold and food fresh through a long round, which counts on a warm Australian day. It also keeps items dry, so a sandwich does not turn soggy. A golf buggy cooler bag like this one saves you stopping at the clubhouse mid-round, and it keeps your refreshments with the buggy instead of in the car. Cold water on a hot hole is a small luxury that makes the round more enjoyable.',
      },
      {
        heading: 'Where do you keep valuables?',
        body: 'Two pockets hold valuables such as keys, a wallet or a phone, so they stay secure and out of the dirt. Having a dedicated place for them means you do not leave them in the bag or on a bench. The pockets sit separately from the main compartment, so valuables stay dry even if you open the cooler for a drink. Keep keys and cards in the valuables pockets and drinks in the main compartment.',
      },
      {
        heading: 'How does the clip-on bracket suit a golf buggy bag?',
        body: 'A simple bracket lets the bag clip on and off the buggy, so it moves easily between car and course. You can carry it into the clubhouse after the round and clip it back on next time. Choose the version made for your MGI series, and tell us your model if you are unsure. It is a convenient addition among the mgi zip cooler bag options. Among golf trolley bags, one that clips on and off is easy to take to the clubhouse. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our team can answer questions on delivery, parts and warranty before you commit. Delivery is enclosed, so the buggy arrives protected from weather and road dirt.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI cooler bag?', a: 'The MGI Cooler Bag is $92.95 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does the mgi zip navigator cooler bag keep drinks cold?', a: 'The insulation keeps items hot, cold and dry through the round.' },
      { q: 'Is it a golf buggy cooler bag with valuables pockets?', a: 'Yes. It has two pockets for valuables.' },
      { q: 'How does it attach?', a: 'A simple bracket lets the bag clip on and off the buggy.' },
      { q: 'Is it also called an mgi zip cooler and storage bag?', a: 'Yes. It is the MGI Cooler and Storage Bag.' },
      { q: 'What other golf trolley accessories do you stock?', a: 'We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk.' },
    ],
  },

  'mgi-travel-bag': {
    primaryKeyword: 'mgi travel bag',
    supportingKeywords: ['mgi zip travel bag', 'mgi zip navigator travel bag', 'golf buggy bag', 'golf trolley bags', 'golf cart accessories australia'],
    h1: 'MGI Travel Bag: Protective Buggy Bag for Zip and Ai Series',
    seoTitle: 'MGI Travel Bag: Buy the Protective Buggy Carry Bag',
    seoDescription: 'Buy the MGI travel bag. Durable fabric bag keeps a Zip or Ai Series buggy secure in transit and has an internal pocket for the battery, $132.95 inc GST.',
    short: 'travel bag',
    closingHeading: 'Where can I buy the MGI travel bag?',
    intro:
      'The MGI travel bag keeps your buggy safe and secure in transit and keeps debris, dirt and moisture off your car. It is made from durable fabric and has an internal pocket for the battery. The price is $132.95 AUD including GST.',
    sections: [
      {
        heading: 'What does the MGI travel bag protect?',
        body: 'It protects the buggy from knocks and scuffs in the car and keeps debris, dirt and moisture off your boot and other luggage. After a wet round, the bag contains the mess, so the car stays clean. It also gives the buggy a tidy covering when you travel to a golf trip, a holiday or a competition away from home. A bag also reduces the chance of a scratch on the buggy or on the other things in your car.',
      },
      {
        heading: 'Where does the battery go?',
        body: 'An internal pocket holds the battery, so the buggy and its power pack travel together in one place. Keeping them together means you are less likely to leave the battery behind. Check airline and carrier rules for lithium batteries if you are flying, because they differ, and ask us if you want advice on a particular trip. Pack the battery according to the rules for your trip, and keep it in the pocket provided.',
      },
      {
        heading: 'Which MGI models does the mgi zip travel bag suit?',
        body: 'It is compatible with the Zip and Ai series and is not suitable for the Quad series. Check your model before ordering, and tell us if you are unsure. If you travel with the buggy regularly, it is a sensible purchase that protects an investment and keeps your car in good order, and it is a useful addition to any set of MGI accessories. We are an Australian stockist in Yatala QLD, and prices include GST. Ask the Yatala desk if you would like a side-by-side comparison with another model before you decide. Tell us how you will use it and we will confirm it suits before you order. Our team can answer questions on delivery, parts and warranty before you commit. Call or message the Yatala desk and we will answer your questions in plain language.',
      },
    ],
    faqs: [
      { q: 'How much is the MGI travel bag?', a: 'The MGI Travel Bag is $132.95 AUD including GST. Freight is quoted separately against your delivery postcode at checkout.' },
      { q: 'Does the MGI travel bag fit the Quad series?', a: 'No. It is compatible with the Zip and Ai series and is not suitable for the Quad series.' },
      { q: 'Is it a mgi zip navigator travel bag with a battery pocket?', a: 'Yes. It has an internal pocket for the battery.' },
      { q: 'What is the bag made of?', a: 'It is made from durable fabric.' },
      { q: 'Is a golf buggy bag like this suitable for flying?', a: 'It protects the buggy in transit. Check carrier rules for batteries before flying.' },
      { q: 'What other golf trolley bags and golf cart accessories Australia wide do you stock?', a: 'We stock holders, covers, bags, batteries and chargers. Ask the Yatala desk.' },
    ],
  },
};
