// Tag hubs: hand-curated "cross-cutting" collections that sit beside categories and
// brands (a buyer's need, not a product class). Every tag lists real catalogue slugs
// and carries its own intro, keywords and FAQs; none is derived from product keyword
// strings. A tag only reaches the sitemap if it passes tagGate() (scripts/site-validate
// and the build both enforce it), so a thin or duplicate tag can never be indexed.
//
// Server-only: it imports nothing from the client bundle, and FAQ/intro prose must not
// be pulled into a 'use client' component.
import { PRODUCTS, CATEGORIES } from './site';
import { categoryContent } from './category-content';

export interface TagFaq {
  q: string;
  a: string;
}

export interface TagHub {
  slug: string;
  name: string;
  primaryKeyword: string;
  supporting: string[];
  /** 150–250 words across all paragraphs. */
  intro: string[];
  productSlugs: string[];
  faqs: TagFaq[];
  guideSlugs: string[];
}

export const TAGS: TagHub[] = [
  {
    slug: 'lithium-batteries',
    name: 'Lithium Golf Buggy Batteries',
    primaryKeyword: 'lithium golf buggy battery australia',
    supporting: ['48v lithium golf buggy battery', 'lithium battery conversion kit golf buggy', '72v lithium battery golf buggy'],
    intro: [
      'Swapping lead-acid for lithium is the upgrade we are asked about most, and the four packs here cover the main routes. The 48V 105Ah conversion kit includes a CAN-bus charger, digital gauge, mounting bracket and universal harness, so it suits a buggy being converted from lead-acid for the first time. The RoyPow 48V 105Ah pack is a drop-in replacement with a built-in BMS, thermal protection and a 5-year warranty.',
      'For heavier work, the RoyPow 72V 105Ah commercial pack follows the same drop-in design for 72V systems. The Invicta 48V 50Ah module is the lower-cost entry point, with parallel expansion and integrated Bluetooth monitoring. Check your buggy\'s system voltage before you order, because a 48V pack will not run a 72V drive. Send us the make, model and year and we will confirm the match from our Yatala QLD depot. Prices include GST, and freight is quoted against your delivery postcode at checkout.',
    ],
    productSlugs: ['eco-battery-48v-105ah-lithium-conversion-kit', 'roypow-48v-105ah-lithium-battery-pack', 'roypow-72v-105ah-commercial-lithium-battery', 'invicta-48v-50ah-lithium-drop-in-module'],
    faqs: [
      { q: 'Which lithium battery fits my golf buggy?', a: 'It depends on your buggy\'s system voltage. A 48V buggy takes a 48V pack and a 72V buggy needs a 72V pack. Send us the make, model and year and we will confirm the fit from Yatala before you order.' },
      { q: 'Is a lithium conversion kit different from a drop-in pack?', a: 'A conversion kit bundles what a lead-acid buggy needs to change over: here, a CAN-bus charger, digital gauge, mounting bracket and universal harness. A drop-in pack is built to replace the existing battery in the same space, with no extra parts to source.' },
      { q: 'Do I need a new charger with a lithium battery?', a: 'Usually yes. Lithium packs are charged by a charger matched to them, and the 48V conversion kit includes a CAN-bus charger. For other packs, tell us your current charger and the pack you are buying, and we will confirm from Yatala whether it suits before you order.' },
    ],
    guideSlugs: ['lithium-vs-lead-acid-golf-buggy-batteries-australia', 'lithium-battery-conversion-guide-cost-australia'],
  },
  {
    slug: 'chargers',
    name: 'Golf Buggy Chargers',
    primaryKeyword: 'golf buggy charger australia',
    supporting: ['48v golf buggy charger', 'on board golf buggy charger', 'mgi lithium charger'],
    intro: [
      'A charger has to match the battery it feeds, so this page groups the four we stock by what they charge. For a 48V buggy, the Delta-Q QuiQ is a smart on-board charger with multi-profile charging algorithms in a weatherproof sealed enclosure, and the Club Car ERIC is a high-frequency charger with automatic voltage compensation and global AC input compatibility.',
      'For walk-behind buggies, the MGI 24V lithium smart charger suits the Ai and Zip series and adds a digital charge indicator, overcharge protection and auto-shutoff. The MGI E-Series charger is the replacement for the E-Boost 24V 225Wh battery only, so do not buy it for a Zip or Ai. If you are unsure which charger your battery needs, send us the battery voltage and the model of your buggy and we will confirm the right one from our Yatala QLD depot before you pay. Every price includes GST, and freight is quoted to your postcode at checkout.',
    ],
    productSlugs: ['delta-q-quiq-48v-smart-on-board-charger', 'club-car-eric-48v-high-frequency-charger', 'mgi-lithium-24v-smart-charger-ai-and-zip-series', 'mgi-e-series-charger'],
    faqs: [
      { q: 'Can I use any 48V charger on my golf buggy?', a: 'No. The charger must suit your battery chemistry and your buggy\'s connector. Lead-acid and lithium use different charging profiles. Send us your buggy model, battery type and battery voltage, and we will confirm the right charger from our Yatala depot before you order and pay.' },
      { q: 'Which MGI charger do I need?', a: 'The MGI 24V lithium smart charger suits the Ai and Zip series. The MGI E-Series charger is only for the E-Boost 24V 225Wh battery. Tell us your model and the battery you own, and we will confirm the right charger from Yatala before you order, so you do not pay for the wrong one.' },
      { q: 'What is an on-board charger?', a: 'An on-board charger is fitted to the buggy, so you plug the buggy into a standard power point to charge instead of carrying a separate unit, which is convenient if you charge at a shed, garage or club. The Delta-Q QuiQ here is sealed in a weatherproof enclosure for that purpose.' },
    ],
    guideSlugs: ['golf-buggy-chargers-explained-australia', 'electric-golf-buggy-maintenance-schedule-australia'],
  },
  {
    slug: 'lifted-golf-buggies',
    name: 'Lifted Golf Buggies',
    primaryKeyword: 'lifted golf buggy for sale',
    supporting: ['lifted golf buggy australia', 'lifted lithium golf buggy', '4 inch lift golf buggy'],
    intro: [
      'A lift raises the body and chassis for ground clearance and larger tyres, and all six buggies here are sold lifted. The Atlas 4-passenger comes with a 3-inch factory lift, 48V lithium and 14-inch alloy wheels, and the Atlas heavy-duty 350A adds four-wheel hydraulic brakes, all-terrain tyres and a brush guard. The EZGO Express S4 has a 4-inch lift kit and Desert Eagle all-terrain tyres, and its rear seat converts to a cargo bed.',
      'The Tara Roadster 2+2 pairs a lifted chassis with hydraulic disc brakes and an LED light package. The LVTONG rough-terrain buggy has a reinforced steel subframe and a front LED light bar, and the Club Car Onward lifted runs a Kohler 14HP EFI petrol engine. Lifting changes how a buggy handles on slopes and corners, so tell us your ground, load and passenger count and we will point you to the right one. Prices include GST, with freight quoted to your postcode.',
    ],
    productSlugs: ['atlas-4-passenger-lifted-lithium-buggy', 'tara-roadster-2-plus-2-lifted', 'atlas-4-seater-heavy-duty-lifted-350a', 'ezgo-express-s4-lifted-high-torque', 'lvtong-rough-terrain-lifted-buggy', 'club-car-onward-lifted-efi-petrol'],
    faqs: [
      { q: 'What does a lift kit change on a golf buggy?', a: 'It raises the body and chassis, which gives more ground clearance and room for larger all-terrain tyres. It also lifts the centre of gravity, so slopes, corners and loaded rear seats need more care than on a standard-height buggy, and passengers should stay seated while it moves.' },
      { q: 'Are the lifted buggies electric or petrol?', a: 'Five of the six are electric lithium. The Club Car Onward lifted is the petrol option, with a Kohler 14HP EFI engine. Tell us how far you drive each day, how many passengers you carry and whether you have power at the shed, and we will suit the fuel to the way you use it.' },
      { q: 'Can I add a lift to a standard buggy?', a: 'Lift kits exist for many buggies, but fit depends on the model and the work should suit the brakes and suspension. Tell us your buggy, your ground and the load you carry, and we will say whether a factory-lifted model is the better route, since it is built and braked for the extra height.' },
    ],
    guideSlugs: ['lifted-4x4-golf-carts-acreage-and-farm-performance', 'heavy-duty-off-road-golf-buggy-rural-acreage-guide'],
  },
  {
    slug: 'remote-control-follow',
    name: 'Remote Control and Follow-Me Golf Buggies',
    primaryKeyword: 'remote control golf buggy',
    supporting: ['follow me golf buggy', 'gps remote golf trolley', 'mgi navigator remote'],
    intro: [
      'A remote or follow-me trolley drives itself beside you, so you walk the course with nothing to push. The MGI Ai Navigator pairs a full directional remote with an integrated touchscreen GPS and a gyroscope straight tracker, and the Ai Navigator Halo adds GPS remote, geo-protect hazard mapping and brushless in-hub motors. The MGI Zip Navigator and Zip Navigator All-Terrain are the lower-cost remote models, the second with twin 230W motors and a rear anti-tip fifth wheel.',
      'The Robera Pro uses a smart follow tracking tag with dual-mode remote control and all-terrain dual motors. Two add-ons complete the range: the MGI Halo Eye is a 2D LiDAR sensor that adds follow me, return home, point to point and obstacle avoidance, and the replacement MGI controller is pre-programmed for pairing and rechargeable by USB-C. Check that an add-on suits your model before you order. We confirm compatibility from Yatala QLD, and every price includes GST.',
    ],
    productSlugs: ['mgi-ai-navigator-gps-remote-buggy', 'mgi-zip-navigator', 'mgi-zip-navigator-all-terrain', 'mgi-ai-navigator-halo', 'robera-pro-follow-remote-golf-buggy', 'mgi-halo-eye', 'replacement-mgi-ai-zip-remote-controller'],
    faqs: [
      { q: 'What is the difference between remote and follow-me?', a: 'A remote trolley is steered by you using a handheld controller. A follow-me trolley tracks you automatically, using a tag or a sensor. The Robera Pro offers a follow tag with remote control, and the MGI Halo Eye adds follow me to compatible MGI models.' },
      { q: 'Can I add follow-me to a trolley I already own?', a: 'The MGI Halo Eye adds follow me, return home, point to point and obstacle avoidance using a 2D LiDAR sensor. It is made for MGI models, so tell us which one you own and the year you bought it, and we will confirm the fit from Yatala before you order.' },
      { q: 'Do remote trolleys suit hilly courses?', a: 'The MGI Zip Navigator range includes downhill speed control and a gyroscope straight tracker, and the All-Terrain adds twin 230W motors. Tell us the courses you play and how much of the round is uphill, and we will recommend a model from the range that suits your fitness, budget and boot space.' },
    ],
    guideSlugs: ['remote-control-golf-buggy-australia-buyers-guide', 'best-golf-trolley-australia-push-motorized-remote-comparison'],
  },
  {
    slug: 'tow-hitch-equipped',
    name: 'Tow Hitch Golf Buggies and Hitches',
    primaryKeyword: 'golf buggy with tow hitch',
    supporting: ['utility buggy with tow bar', 'golf buggy tow hitch ball', 'towing golf buggy australia'],
    intro: [
      'If a buggy has to pull as well as carry, start with a model that is built for it. The Club Car Carryall 700 electric utility has a 6-foot aluminium cargo box, a 680kg payload capacity and a heavy-duty tow hitch. The EZGO Cushman Hauler Pro lithium adds a 72V AC drive, an optional electric cargo bed dump and a 544kg towing capacity, and the Evolution 700 heavy commercial utility has a drop-side flatbed tray and a tow bar.',
      'For a buggy that does not have one, the heavy-duty tow hitch ball assembly is a 2-inch receiver in powder-coated steel with mounting hardware included. Towing capacity is set by the buggy, not the hitch, so check the figure for your model before you hook up. For help moving a buggy itself on a trailer, see our guide on transport and tie-downs. Tell us the load and the ground and we will recommend a model. Prices include GST, and freight is quoted to your postcode.',
    ],
    productSlugs: ['club-car-carryall-700-electric-utility', 'ezgo-cushman-hauler-pro-lithium', 'evolution-700-heavy-commercial-utility', 'heavy-duty-tow-hitch-ball-assembly'],
    faqs: [
      { q: 'How much can a utility buggy tow?', a: 'It varies by model. The EZGO Cushman Hauler Pro lithium lists a 544kg towing capacity, and the Club Car Carryall 700 lists a 680kg payload capacity. Always follow the figure listed for your own buggy, not the hitch, and keep to it for every load, trailer and slope you tow on.' },
      { q: 'Can I fit a tow hitch to any golf buggy?', a: 'The tow hitch ball assembly has a 2-inch receiver and includes mounting hardware, but fit depends on the frame. Towing capacity is set by the buggy. Tell us your model and the frame type and we will confirm the fit from our Yatala depot before you order, so you do not buy a hitch that will not mount.' },
      { q: 'Is an electric or petrol utility buggy better for towing?', a: 'Electric models give strong low-speed torque and quiet running, while petrol suits long days away from a power point. Tell us the load, the distance, the ground and whether you have power at the shed, and we will suit the drive to the work you need done.' },
    ],
    guideSlugs: ['transporting-towing-golf-buggy-australia-trailers-tie-downs', 'commercial-utility-golf-buggies-resorts-and-industrial-parks'],
  },
  {
    slug: 'road-access-lighting',
    name: 'Road Access and Lighting Upgrades',
    primaryKeyword: 'golf buggy lights and indicators',
    supporting: ['golf buggy led light kit', 'golf buggy side mirrors', 'golf buggy seat belts'],
    intro: [
      'Some owners want lights, mirrors and belts for use on private roads, estates or council-permitted paths. We do not label any buggy road legal, because the rules differ between states and councils, and the registration or permit decision is made by the relevant authority. What we can supply is the hardware that those rules commonly ask about, so you can speak to your authority with the equipment in front of you.',
      'The MadJax Alpha Lux LED light kit includes automotive-style turn signals, hazard lights, a horn and a brake switch. The side mirrors have convex glass for a wide-angle view and integrated LED amber indicators. The retractable seatbelt set is a 3-point lap and shoulder harness with a bracket kit, E-Mark certified. The Evolution Classic 2+ comes with side mirrors with turn signals and a 6.3-inch LCD screen. Read our registration and conditional access guide, then check with your state authority before you rely on any kit. Prices include GST, and freight is quoted to your postcode at checkout.',
    ],
    productSlugs: ['madjax-alpha-lux-street-legal-led-light-kit', 'golf-cart-side-mirrors-integrated-led-indicators', 'retractable-seatbelt-system-set', 'evolution-classic-2-plus'],
    faqs: [
      { q: 'Are your golf buggies road legal?', a: 'We do not label any buggy road legal. Rules vary by state and council, and registration or conditional access is decided by the relevant authority. Read our registration guide and check with your state or council authority before you buy any lighting or safety kit, and before you take a buggy onto a public road.' },
      { q: 'What does the light kit include?', a: 'The MadJax Alpha Lux kit includes automotive-style turn signals, hazard lights, a horn and a brake switch. Fit depends on your buggy and its wiring, so send us the make, model and year and we will confirm the kit suits before you order and pay for it.' },
      { q: 'Are the seatbelts certified?', a: 'The retractable seatbelt system is a 3-point lap and shoulder harness with a bracket kit, and it is E-Mark certified. Fitting needs a suitable mounting point on the frame, so tell us your buggy and seat layout and we will confirm that the set suits before you order.' },
    ],
    guideSlugs: ['golf-buggy-registration-australia-conditional-road-access', 'golf-buggy-lighting-street-legal-kits-australia'],
  },
  {
    slug: 'weather-protection',
    name: 'Weather Protection for Golf Buggies',
    primaryKeyword: 'golf buggy rain cover and enclosure',
    supporting: ['golf buggy weather enclosure', 'golf buggy windscreen', 'golf trolley rain cover'],
    intro: [
      'Rain, sun and wind are a bigger part of buggy ownership than most buyers expect, and the six items here cover both ride-on buggies and walk-behind trolleys. For a ride-on, the all-weather heavy-duty PVC enclosure has roll-up clear vinyl windows and heavy-duty zippers, with universal fit options. The foldable tinted acrylic windshield is high-impact acrylic with noise-reduction clips and UV protection.',
      'For a walk-behind trolley, the MGI rain cover is water-resistant with a concertina opening and attaches to the upper bag support. The MGI telescopic umbrella is silver and anti-flip, with UV protection, wind resistance and an auto-extending handle, and it needs an MGI umbrella holder, which is two-way adjustable and tool-free to install. The holder extender adds 150mm of height. Weather gear only helps if it fits, so tell us your model and we will confirm what fits from our Yatala QLD depot. All prices include GST, and freight is quoted to your postcode.',
    ],
    productSlugs: ['all-weather-heavy-duty-pvc-enclosure', 'foldable-tinted-acrylic-windshield-system', 'mgi-rain-cover', 'mgi-telescopic-umbrella', 'mgi-umbrella-holder', 'mgi-umbrella-holder-extender'],
    faqs: [
      { q: 'Will the PVC enclosure fit my golf buggy?', a: 'It is sold with universal fit options and has roll-up clear vinyl windows and heavy-duty zippers. Fit still depends on your roof and frame, so send us the make, model and year and we will confirm before you order and pay for it.' },
      { q: 'Does the MGI umbrella need a holder?', a: 'Yes. The MGI telescopic umbrella is used with an MGI umbrella holder, which is two-way adjustable and tool-free to install. The holder extender adds 150mm of height if you want the umbrella to sit higher, and it fits every MGI umbrella holder.' },
      { q: 'Is the windshield foldable?', a: 'Yes. The foldable tinted acrylic windshield system is high-impact acrylic with noise-reduction clips and UV protection. Tell us your buggy, its make and year, and we will confirm the fit from Yatala before you order, so the windshield sits properly and the clips hold it.' },
    ],
    guideSlugs: ['golf-buggy-windscreens-weather-enclosures-australia', 'mgi-golf-buggy-accessories-guide-australia'],
  },
  {
    slug: 'controllers-electrical',
    name: 'Golf Buggy Controllers and Electrical Parts',
    primaryKeyword: 'golf buggy motor controller',
    supporting: ['curtis controller golf buggy', '600a ac controller upgrade', 'golf buggy solenoid'],
    intro: [
      'Controllers and electrical parts decide how an electric buggy accelerates, brakes and protects itself, and the four here are the upgrades and replacements we are asked about most. The Curtis 1268 is a programmable motor controller with 400 amp peak output and regenerative braking control. The Navitas 600A AC controller upgrade kit goes up to 600 amps and adds Bluetooth on-the-fly lockout control.',
      'The heavy-duty Albright 48VDC 200A solenoid has a continuous duty rating and silver alloy contacts, and it is a common replacement part when a buggy clicks but will not move. The universal 48V to 12V 30A voltage reducer is key-switch triggered in a waterproof cast aluminium housing, and powers 12V accessories from a 48V pack. Electrical parts must match the voltage and the motor type. Send us the make, model and year and we will confirm the fit from Yatala QLD. Prices include GST, with freight quoted to your postcode.',
    ],
    productSlugs: ['curtis-1268-400a-programmable-motor-controller', 'navitas-600a-ac-controller-upgrade-kit', 'heavy-duty-solenoid-albright-48vdc-200a', 'universal-48v-to-12v-30a-voltage-reducer'],
    faqs: [
      { q: 'Which controller suits my golf buggy?', a: 'It depends on your motor type and system voltage. The Curtis 1268 is a 400 amp programmable controller, and the Navitas kit is a 600 amp AC upgrade. Send us the make, model and year and we will confirm the controller suits your motor and voltage from our Yatala depot before you order.' },
      { q: 'What does a solenoid do?', a: 'A solenoid is a heavy-duty switch that connects the battery to the motor when you press the pedal. The Albright 48VDC 200A has a continuous duty rating and silver alloy contacts. Tell us your buggy, its voltage and the symptom you are seeing, and we will confirm the correct solenoid from our Yatala depot before you order.' },
      { q: 'Why would I need a voltage reducer?', a: 'A voltage reducer steps a 48V battery pack down to 12V for accessories such as lights and audio. This one is key-switch triggered and housed in waterproof cast aluminium, so it only draws power when the key is on and does not drain the pack while the buggy is parked.' },
    ],
    guideSlugs: ['electric-golf-buggy-troubleshooting-and-replacement-parts', 'ac-vs-dc-golf-buggy-motors-torque-efficiency-australia'],
  },
];

export const TAG_SLUGS = TAGS.map((t) => t.slug);
export const findTag = (slug: string) => TAGS.find((t) => t.slug === slug);

export function tagProducts(tag: TagHub) {
  return tag.productSlugs
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

/** Tags a product belongs to, for the chips on its page. */
export const tagsForProduct = (slug: string) => TAGS.filter((t) => t.productSlugs.includes(slug));

export const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Anti-thin-content gate: a tag is indexed (sitemap, no noindex) only if it passes. Returns the failures. */
export function tagGate(tag: TagHub, all: TagHub[] = TAGS): string[] {
  const fails: string[] = [];
  const found = tagProducts(tag);
  if (found.length !== tag.productSlugs.length) fails.push('a productSlug is not in the catalogue');
  if (found.length < 4) fails.push(`only ${found.length} products (min 4)`);
  if (new Set(tag.productSlugs).size !== tag.productSlugs.length) fails.push('duplicate productSlug');
  const intro = wordCount(tag.intro.join(' '));
  if (intro < 150 || intro > 250) fails.push(`intro is ${intro} words (150–250)`);
  if (tag.faqs.length < 3) fails.push('fewer than 3 FAQs');
  tag.faqs.forEach((f, i) => {
    const n = wordCount(f.a);
    if (n < 40 || n > 65) fails.push(`FAQ ${i + 1} answer is ${n} words (40–65)`);
  });
  if (CATEGORIES.some((c) => c.slug === tag.slug)) fails.push('slug equals a category slug');
  const kw = tag.primaryKeyword.toLowerCase();
  const catKeywords = CATEGORIES.map((c) => (categoryContent(c.slug).primaryKeyword ?? '').toLowerCase());
  if (catKeywords.includes(kw)) fails.push('primary keyword equals a category keyword');
  if (all.some((o) => o !== tag && o.primaryKeyword.toLowerCase() === kw)) fails.push('primary keyword equals another tag');
  for (const c of CATEGORIES) {
    const set = new Set(PRODUCTS.filter((p) => p.category === c.rawCategory).map((p) => p.slug));
    const inter = tag.productSlugs.filter((s) => set.has(s)).length;
    const union = new Set([...set, ...tag.productSlugs]).size;
    if (union && inter / union >= 0.7) fails.push(`product set overlaps category ${c.slug} (Jaccard ${(inter / union).toFixed(2)})`);
  }
  return fails;
}

export const INDEXABLE_TAGS = TAGS.filter((t) => tagGate(t).length === 0);
