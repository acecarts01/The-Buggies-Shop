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
};
