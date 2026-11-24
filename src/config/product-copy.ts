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
  faqs: { q: string; a: string }[];
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
};
