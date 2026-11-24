// SERVER-ONLY. Extra question-style sections, an answer-first lead and head metadata for tag hubs.
// Phase 5 of the SEO ruleset: each tag hub has 300+ words of editorial copy and its exact primary
// keyword in the title, H1, description and opening copy. Facts come from the catalogue; prices are
// computed on the page, never typed here.
import type { MoreSection } from './brand-more';

export interface TagMeta { title: string; h1: string; lead: string; descLead: string }

export const TAG_META: Record<string, TagMeta> = {
  'lithium-batteries': {
    title: 'Lithium Golf Buggy Battery Australia',
    h1: 'Lithium Golf Buggy Battery Australia: Packs and Conversion Kits',
    lead: 'A lithium golf buggy battery Australia owners can fit without a workshop is what this page is for: four packs and kits, from a 48V conversion kit to a 72V commercial pack, all supplied from our Yatala QLD depot.',
    descLead: 'Buy a lithium golf buggy battery Australia wide:',
  },
  chargers: {
    title: 'Golf Buggy Charger Australia',
    h1: 'Golf Buggy Charger Australia: On-Board and MGI Chargers',
    lead: 'The right golf buggy charger Australia buyers can order is the one that matches the battery: here are four chargers, from 48V on-board units to the MGI walk-behind chargers, supplied from our Yatala QLD depot.',
    descLead: 'Buy a golf buggy charger Australia wide:',
  },
  'lifted-golf-buggies': {
    title: 'Lifted Golf Buggy for Sale in Australia',
    h1: 'Lifted Golf Buggy for Sale in Australia: Six Models',
    lead: 'Looking for a lifted golf buggy for sale? These six models are all sold lifted, with the ground clearance for rutted estate driveways, farm tracks and uneven acreage, and they ship from our Yatala QLD depot.',
    descLead: 'Shop a lifted golf buggy for sale:',
  },
  'remote-control-follow': {
    title: 'Remote Control Golf Buggy Australia',
    h1: 'Remote Control Golf Buggy Australia and Follow-Me Models',
    lead: 'A remote control golf buggy drives itself beside you, so you walk the course with nothing to push. This page groups the MGI remote models, the Robera follow buggy and the add-ons that complete them, all from our Yatala QLD depot.',
    descLead: 'Buy a remote control golf buggy:',
  },
  'tow-hitch-equipped': {
    title: 'Golf Buggy with Tow Hitch for Sale',
    h1: 'Golf Buggy with Tow Hitch: Utility Models and Hitch Kit',
    lead: 'A golf buggy with tow hitch is the answer when your buggy has to pull as well as carry. These four listings cover three utility buggies and a heavy-duty hitch assembly, supplied from our Yatala QLD depot.',
    descLead: 'Buy a golf buggy with tow hitch:',
  },
  'road-access-lighting': {
    title: 'Golf Buggy Lights and Indicators',
    h1: 'Golf Buggy Lights and Indicators, Mirrors and Seatbelts',
    lead: 'Golf buggy lights and indicators are the hardware owners ask about when a buggy will share private roads, estates or council-permitted paths. We list four items, and we do not label any buggy road legal.',
    descLead: 'Buy golf buggy lights and indicators:',
  },
  'weather-protection': {
    title: 'Golf Buggy Rain Cover and Enclosure',
    h1: 'Golf Buggy Rain Cover and Enclosure: Weather Protection',
    lead: 'A golf buggy rain cover and enclosure keep the weather off you and your clubs. The six items here cover ride-on buggies and walk-behind trolleys, and ship from our Yatala QLD depot.',
    descLead: 'Buy a golf buggy rain cover and enclosure:',
  },
  'controllers-electrical': {
    title: 'Golf Buggy Motor Controller Australia',
    h1: 'Golf Buggy Motor Controller and Electrical Parts',
    lead: 'A golf buggy motor controller decides how an electric buggy accelerates, brakes and protects itself. These four controllers, solenoid and voltage-reducer listings are supplied from our Yatala QLD depot.',
    descLead: 'Buy a golf buggy motor controller:',
  },
};

const TAG_MORE: Record<string, MoreSection[]> = {
  'lithium-batteries': [
    { heading: 'Which lithium pack suits your buggy?', body: 'Start with the voltage. The Eco Battery 48V 105Ah kit, the RoyPow 48V 105Ah pack and the Invicta 48V 50Ah module suit 48V buggies, and the RoyPow 72V 105Ah pack suits 72V commercial systems. The conversion kit bundles a charger, gauge, bracket and harness, while the RoyPow packs are drop-in replacements with a built-in BMS and a 5-year warranty.' },
    { heading: 'What should you check before swapping from lead-acid?', body: 'Check the system voltage, the battery tray size and the charger. A lithium pack needs a charger matched to it, and the conversion kit includes one. Send us your make, model and year and we will confirm the fit, then quote freight to your postcode at checkout. Prices include GST, with freight quoted at checkout.' },
  ],
  chargers: [
    { heading: 'Which golf buggy charger do you need?', body: 'Match the charger to the battery. The Delta-Q QuiQ and the Club Car ERIC are 48V chargers. The MGI Lithium 24V Smart Charger is for the Ai and Zip series. The MGI E Series Charger is for the E-Boost 24V 225Wh battery only. Never use a charger from one MGI series on another.' },
    { heading: 'What is the difference between on-board and plug-in chargers?', body: 'An on-board charger is fitted to the buggy, so you plug the buggy itself into a power point. The Delta-Q QuiQ is a smart on-board unit in a weatherproof sealed enclosure. A plug-in unit stays in the garage or the boot. Tell us how you charge and we will recommend one. Prices include GST, with freight quoted at checkout.' },
  ],
  'lifted-golf-buggies': [
    { heading: 'Which lifted golf buggy suits your ground?', body: 'The Atlas 4-Passenger Lifted and the Atlas Heavy Duty (350A) are four-seat lithium buggies. The E-Z-GO Express S4 has a four-inch lift kit and a convertible rear seat. The Tara Roadster 2+2 has hydraulic disc brakes, and the LVTONG Rough-Terrain has a reinforced steel subframe. The Club Car Onward Lifted is the petrol option.' },
    { heading: 'Does a lift change how a buggy drives?', body: 'A lift raises the body for clearance and larger tyres, which helps on ruts and slopes. It can also raise the centre of gravity, so drive sensibly across a slope and check brakes and tyres at the same time. Tell us your terrain and load and we will recommend a model. Prices include GST, with freight quoted at checkout.' },
  ],
  'remote-control-follow': [
    { heading: 'Remote control or follow-me: which should you choose?', body: 'A remote model steers directly, so you can send it ahead or around an obstacle. A follow model tracks a tag on your belt, so there is nothing to hold. The MGI Ai Navigator, Zip Navigator and Halo are remote models. The Robera Pro offers follow and dual-mode remote control. The Halo Eye adds follow me to the Halo.' },
    { heading: 'What does the MGI Halo Eye add?', body: 'It is a 2D LiDAR sensor that adds follow me, return home, point-to-point and obstacle avoidance to the Ai Navigator Halo, and it works only with that model. The replacement remote controller suits Ai and Zip buggies, with pre-programmed pairing and USB-C charging. Check the model before you order.' },
  ],
  'tow-hitch-equipped': [
    { heading: 'Which golf buggy with tow hitch should you buy?', body: 'The Club Car Carryall 700 has a six-foot aluminium cargo box, a 680kg payload and a heavy-duty tow hitch. The Cushman Hauler PRO lists a 544kg towing capacity and a 72V AC drive. The Evolution 700 has a drop-side flatbed tray and a tow bar. Pick the one whose rating matches your heaviest regular load.' },
    { heading: 'Can you add a hitch to a buggy that does not have one?', body: 'Yes. The heavy-duty tow hitch ball assembly has a two-inch receiver in powder-coated steel, with mounting hardware included. Towing capacity is set by the buggy, not the hitch, so check the figure for your model first. We can talk through brakes and loads before you order.' },
  ],
  'road-access-lighting': [
    { heading: 'Do these parts make a buggy road legal?', body: 'No. Rules differ between states and councils, and the registration or permit decision is made by the relevant authority. We supply the hardware that those rules commonly ask about, so you can speak to your authority with the equipment in front of you. Check before you fit.' },
    { heading: 'What does each part do?', body: 'The MadJax Alpha Lux LED kit adds turn signals, hazard lights, a horn and a brake switch. The side mirrors have convex glass and integrated LED amber indicators. The retractable seatbelt set is a three-point lap and shoulder harness with brackets. The Evolution Classic 2 Plus comes with side mirrors and turn signals.' },
  ],
  'weather-protection': [
    { heading: 'Which weather protection suits a ride-on buggy?', body: 'The all-weather PVC enclosure has roll-up clear vinyl windows and heavy-duty zippers, with universal fit options. The foldable tinted acrylic windshield is high-impact acrylic with noise-reduction clips and UV protection. Tell us your make, model and year and we will confirm the fit.' },
    { heading: 'What about walk-behind trolleys?', body: 'The MGI rain cover is water-resistant with a concertina opening, and it attaches to the upper bag support. The telescopic umbrella is anti-flip with UV protection, and it needs the MGI umbrella holder. The extender adds 150mm of height for taller golfers. Prices include GST, with freight quoted to your postcode at checkout. Tell us your buggy make, model and year before you order, and we will confirm the fit.' },
  ],
  'controllers-electrical': [
    { heading: 'Which golf buggy motor controller should you choose?', body: 'The Curtis 1268 is a programmable controller with 400 amp peak output and regenerative braking control. The Navitas 600A AC upgrade kit goes up to 600 amps and adds Bluetooth lockout control. A controller sets the ceiling for acceleration and speed, so plan brakes and tyres at the same time.' },
    { heading: 'What do the solenoid and voltage reducer do?', body: 'The Albright 48VDC 200A solenoid is a continuous-duty replacement part, common when a buggy clicks but will not move. The 48V to 12V 30A reducer is key-switch triggered and powers 12V accessories without drawing from a single battery. Tell us your symptoms and we will help you narrow it down. Prices include GST, with freight quoted to your postcode at checkout. Ask us before you order, and our Yatala desk can check the fit.' },
  ],
};

export const tagMore = (slug: string): MoreSection[] => TAG_MORE[slug] ?? [];
