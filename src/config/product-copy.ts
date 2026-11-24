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
};
