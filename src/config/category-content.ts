// SERVER-ONLY. Never import this from a 'use client' component: site.ts is in
// the shared client chunk on every page, and this prose is why it is not here.
// app/shop/[category]/page.tsx and app/shop/page.tsx merge it over CATEGORIES
// and hand the result to the client components as props.
//
// Every price, count and spec below is computed from, or checked against,
// PRODUCTS, so the copy cannot drift from the catalogue. Keyword choices are
// from docs/keyword-research/phase0/keyword-bank-clean.csv: one primary per
// page, supporting terms from other clusters, buggy vocabulary in headings,
// cart vocabulary in metadata and a few body mentions only.
import { CATEGORIES, PRODUCTS, SHOP, isBuggyItem, isElectricBuggy, type ProductItem } from './site';

export interface CategoryContent {
  primaryKeyword?: string;
  supportingKeywords?: string[];
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  sections?: { heading: string; body: string }[];
  guides?: { slug: string; label: string }[];
  faqs?: { q: string; a: string }[];
}

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

function stats(items: ProductItem[]) {
  const prices = items.map((p) => p.price_aud);
  return { n: items.length, lo: Math.min(...prices), hi: Math.max(...prices) };
}
const inCat = (raw: string) => PRODUCTS.filter((p) => p.category === raw);
const price = (slug: string) => {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) throw new Error(`category-content: unknown product slug "${slug}"`);
  return aud(p.price_aud);
};
const word = (n: number) => ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const LUX = 'Luxury & High-Demand 4-Seaters';
const TWO = 'Traditional 2-Seater Electric Golf Buggies';
const OFF = 'Off-Road, Lifted & 4x4 Buggies';
const COM = 'Commercial & Farm Utility Buggies';
const PET = 'Mechanical & Petrol Buggies';
const WALK = 'Motorised Walk-Behind Golf Buggies';

const TRIAL_MIN = 15000; // brand rule: complimentary on-farm trial demonstration at or above this price
const trialCount = (items: ProductItem[]) => items.filter((p) => p.price_aud >= TRIAL_MIN).length;

const isPetrol = (p: ProductItem) => p.fuel_type.startsWith('Mechanical');

function build(): Record<string, CategoryContent> {
  const lux = stats(inCat(LUX));
  const two = stats(inCat(TWO));
  const off = stats(inCat(OFF));
  const com = stats(inCat(COM));
  const pet = stats(inCat(PET));
  const allPetrol = stats(PRODUCTS.filter((p) => isBuggyItem(p.category, p.id, p.name) && isPetrol(p)));
  const petrolCount = PRODUCTS.filter((p) => isBuggyItem(p.category, p.id, p.name) && isPetrol(p)).length;
  const offElectric = inCat(OFF).filter((p) => !isPetrol(p)).length;
  const comElectric = inCat(COM).filter((p) => !isPetrol(p)).length;
  const walk = stats(inCat(WALK));
  const elec = PRODUCTS.filter(isElectricBuggy);
  const elecRiding = elec.filter((p) => p.category !== WALK);
  const elecStats = stats(elec);
  const elecRidingStats = stats(elecRiding);

  return {
    // ------------------------------------------------------------- shop hub
    // Handled separately by hubContent().

    // ---------------------------------------------------------- electric hub
    'electric-golf-buggies': {
      primaryKeyword: 'electric golf buggy',
      supportingKeywords: [
        'electric golf buggy for sale',
        'electric golf buggies australia',
        'best electric golf buggy australia',
        'electric golf buggy with remote',
        'remote control electric golf buggy',
        'electric golf cart',
      ],
      h1: 'Electric Golf Buggies for Sale in Australia',
      metaTitle: 'Electric Golf Buggies for Sale Australia | Buggies Express',
      metaDescription: `Electric golf buggies for sale in Australia: ${elec.length} lithium models from ${aud(elecStats.lo)}, from 4-seaters and 4x4 to remote control golf trolleys. GST included.`,
      intro: `Every electric model we stock, in one place: ${elecRiding.length} lithium passenger and utility buggies from ${aud(elecRidingStats.lo)} to ${aud(elecRidingStats.hi)} AUD, plus ${walk.n} electric walk-behind models from ${aud(walk.lo)}. Prices include GST, and every model ships from our Yatala QLD depot.`,
      sections: [
        {
          heading: 'Electric Golf Buggies in Australia: The Whole Range',
          body: `We stock ${elec.length} electric models in five groups. Passenger buggies cover 2-seater, 4-seater and 6-passenger models; lifted 4x4 buggies handle rough ground; electric utility buggies carry cargo; and the walk-behind range suits golfers who prefer to walk the course. Use the filters above to narrow by category or price, or open any model for its full specification. Every figure on this page is read from the catalogue, so the price you see here is the price on the product page.`,
        },
        {
          heading: 'Lithium, Not Lead Acid',
          body: `Every electric buggy listed here runs a lithium battery. Compared with a lead-acid bank, lithium is sealed, needs no watering and holds its power more evenly as it discharges. We also sell lithium conversion kits and drop-in modules if you own an older buggy, in our batteries and chargers range. If you are still weighing the chemistry, the lithium versus lead acid guide below sets the two side by side.`,
        },
        {
          heading: 'Electric Passenger and Utility Buggies',
          body: `Passenger models start at ${price('lvtong-2-passenger-golf-buggy')} for the LVTONG 2-Passenger and rise to ${price('ezgo-express-l6-lithium')} for the six-passenger E-Z-GO Express L6. For work, the electric utility buggies run from ${aud(stats(inCat(COM).filter((p) => !isPetrol(p))).lo)} for the LVTONG flatbed to ${price('club-car-carryall-700-electric-utility')} for the Club Car Carryall 700, which carries a 680kg payload in a 6-foot aluminium cargo box. Lifted electric 4x4 models are listed under off-road.`,
        },
        {
          heading: 'Remote Control Electric Golf Buggies',
          body: `For remote control, the MGI Ai Navigator at ${price('mgi-ai-navigator-gps-remote-buggy')} adds full directional remote control with an integrated touchscreen GPS, and the Robera Pro at ${price('robera-pro-follow-remote-golf-buggy')} offers dual-mode remote plus a smart-follow tracking tag. The remote control golf buggy guide below explains how each style behaves on a real course.`,
        },
        {
          heading: 'Electric or Petrol?',
          body: `Electric suits most buyers: quieter running and no fuel to carry. Petrol still makes sense on a property with no convenient charging, which is why we stock ${petrolCount} EFI petrol models alongside the electric range. The running costs guide below compares the two honestly, including where petrol comes out ahead.`,
        },
      ],
      guides: [
        { slug: 'how-to-choose-the-right-electric-golf-buggy-in-australia', label: 'How to choose the right electric golf buggy in Australia' },
        { slug: 'electric-golf-buggy-range-test-one-charge-australia', label: 'How far a buggy goes on one charge' },
        { slug: 'lithium-vs-lead-acid-golf-buggy-batteries-australia', label: 'Lithium vs lead acid golf buggy batteries' },
        { slug: 'petrol-vs-electric-golf-buggy-running-costs-australia', label: 'Petrol vs electric: running costs compared' },
        { slug: 'remote-control-golf-buggy-australia-buyers-guide', label: 'Remote control golf buggy buyers guide' },
      ],
      faqs: [
        {
          q: 'How much does an electric golf buggy cost in Australia?',
          a: `Our electric range runs from ${aud(elecStats.lo)} for the MGI Zip X1 walk-behind to ${aud(elecStats.hi)} for the E-Z-GO Express L6, all GST inclusive. Passenger and utility buggies start at ${aud(elecRidingStats.lo)}; walk-behind electric buggies run from ${aud(walk.lo)} to ${aud(walk.hi)}. Freight is quoted separately against your delivery postcode.`,
        },
        {
          q: 'Is every model lithium?',
          a: `Yes. Every electric buggy on this page runs a lithium battery, from the walk-behind models to the 4-seaters and utility buggies. Lead-acid cells such as the Trojan T-875 are sold only as replacement parts for existing buggies.`,
        },
        {
          q: 'Which model has a remote control?',
          a: `Two models: the MGI Ai Navigator GPS Remote Buggy (full directional remote with touchscreen GPS) and the Robera Pro Follow Remote Golf Buggy (dual-mode remote plus smart-follow). Both are walk-behind models, listed with the other motorised walk-behind golf buggies.`,
        },
        {
          q: 'Can I buy an electric golf buggy online and have it delivered?',
          a: `Yes. We ship Australia-wide in enclosed freight from our Yatala QLD depot. Freight is quoted against your delivery postcode at checkout, and the cart total is shown excluding freight. You can pay by PayID / Osko, direct bank transfer, Finance in 4, or Bitcoin or USDT with a ${SHOP.cryptoDiscount}% discount on the vehicle price.`,
        },
        {
          q: 'Can I try one before I buy?',
          a: `For vehicles priced at ${aud(TRIAL_MIN)} or more we offer a complimentary on-farm trial demonstration. ${trialCount(elecRiding)} of our ${elecRiding.length} electric passenger and utility buggies are in that range. Contact us to arrange one.`,
        },
        {
          q: 'What is the best electric golf buggy in Australia?',
          a: `There is no single best; it depends on the job. For carrying people, start with the 4-seater and 6-passenger models. For rough ground, the lifted 4x4 range. For hauling, the electric utility buggies. For walking the course, the remote control walk-behind models. A complimentary on-farm trial demonstration on vehicles at ${aud(TRIAL_MIN)} or more is the fairest way to compare them.`,
        },
      ],
    },

    // ------------------------------------------------------------ 4-seater
    'luxury-4-seater': {
      primaryKeyword: '4 seater golf buggy for sale',
      supportingKeywords: ['6 seater golf buggy', '6 seater golf buggy for sale', '4 seater golf cart', '4 seater electric golf buggy', '4 seat golf buggy for sale', '4 passenger electric golf cart'],
      h1: '4 Seater Golf Buggies for Sale in Australia',
      metaTitle: '4 Seater Golf Buggies for Sale Australia | Buggies Express',
      metaDescription: `${cap(word(lux.n))} 4 seater golf buggies for sale in Australia, including 4+2 six-passenger models, from ${aud(lux.lo)}. Lithium power, GST included, shipped from Yatala QLD.`,
      intro: `${cap(word(lux.n))} lithium 4-seater and six-passenger golf buggies from ${aud(lux.lo)} to ${aud(lux.hi)} AUD, built for estates, acreage and resorts. Each is tested at our Yatala QLD depot and ships Australia-wide in enclosed freight.`,
      sections: [
        {
          heading: '4 Seater Golf Buggies for Sale: What We Stock',
          body: `The range spans ${aud(lux.lo)} to ${aud(lux.hi)} AUD, every price including GST. All ${word(lux.n)} are lithium electric buggies, so there is no fuel and no watering, and all are sized for four or more passengers. Prices move with seating, drivetrain and finish: the LVTONG 4-Seater Resort Cruiser at ${price('lvtong-4-seater-resort-cruiser')} is the entry point, and the E-Z-GO Express L6 at ${price('ezgo-express-l6-lithium')} is the top of the range.`,
        },
        {
          heading: '4+2 and 6 Seater Golf Buggies',
          body: `Two models carry six: the Evolution D5 Ranger 4+2 Plus at ${price('evolution-d5-ranger-4-plus-2')}, with a 110Ah lithium battery, a Bluetooth soundbar and a 9-inch touchscreen, and the E-Z-GO Express L6 at ${price('ezgo-express-l6-lithium')} with six-passenger seating and heavy-duty suspension. The Tara Roadster 2+2 Lifted at ${price('tara-roadster-2-plus-2-lifted')} seats four and adds a rear flip seat that doubles as a flatbed. The 4 versus 6 seater guide below helps you pick.`,
        },
        {
          heading: 'Premium Builds: Club Car Onward and Atlas',
          body: `The Club Car Onward 4-Passenger Lithium at ${price('club-car-onward-4-passenger-lithium')} uses an AC drive motor and a rust-proof aircraft-grade aluminium frame. The Atlas 4-Passenger Lifted Lithium Buggy at ${price('atlas-4-passenger-lifted-lithium-buggy')} adds a 3-inch factory lift, a 48V lithium battery, leather seats and a touchscreen on 14-inch alloy wheels. Choose the Club Car for the engineering pedigree and the Atlas for ground clearance and cabin finish.`,
        },
        {
          heading: 'Value 4 Seaters and Trial Before You Buy',
          body: `If budget leads, the LVTONG at ${price('lvtong-4-seater-resort-cruiser')} pairs a 4kW AC motor and on-board charger with a heavy-duty bumper, and the Tara Roadster at ${price('tara-roadster-2-plus-2-lifted')} brings hydraulic disc brakes and a full LED package. All ${word(trialCount(inCat(LUX)))} models here are at ${aud(TRIAL_MIN)} or more, so each qualifies for a complimentary on-farm trial demonstration. Registration and road-use rules differ by state, so read the buyers guide below before you rely on road access.`,
        },
        {
          heading: "Where a 4 Seater Golf Buggy Earns Its Place",
          body: "Our four-seaters are bought for gated estates, large family properties, resort transport and golf villages, and the difference between them shows up in daily use. A 4-seater with forward-facing seating suits school runs and visitors; a 4+2 or six-passenger model suits a resort shuttle or a big family. If the buggy will work as hard as it carries people, the commercial utility range may fit better, and the estates guide below covers what community rules usually allow.",
        },
      ],
      guides: [
        { slug: 'buying-a-4-seater-golf-buggy-in-australia-rules-and-guide', label: 'Buying a 4-seater golf buggy in Australia: rules and guide' },
        { slug: '4-seater-vs-6-seater-golf-buggies-australia', label: '4 seater vs 6 seater golf buggies' },
        { slug: 'golf-buggies-for-gated-communities-residential-estates', label: 'Golf buggies for gated communities and estates' },
        { slug: 'golf-buggy-registration-australia-conditional-road-access', label: 'Golf buggy registration and road access' },
      ],
      faqs: [
        {
          q: 'How much does a 4 seater golf buggy cost in Australia?',
          a: `Our ${word(lux.n)} 4-seater and six-passenger buggies range from ${aud(lux.lo)} to ${aud(lux.hi)} AUD including GST. Freight is quoted separately against your delivery postcode.`,
        },
        {
          q: 'Do you sell 6 seater golf buggies?',
          a: `Yes. The Evolution D5 Ranger 4+2 Plus (${price('evolution-d5-ranger-4-plus-2')}) and the E-Z-GO Express L6 Lithium (${price('ezgo-express-l6-lithium')}) both carry six passengers.`,
        },
        {
          q: 'Are these 4 seater golf buggies electric?',
          a: `Yes, all ${word(lux.n)} are lithium electric. If you need petrol, see our petrol golf buggy range instead.`,
        },
        {
          q: 'Can I drive a 4 seater golf buggy on the road?',
          a: `Registration and road-use rules differ in every state and territory, and we do not give legal advice. Our registration guide explains how conditional road access generally works; check your own requirements with the relevant authority before you rely on it.`,
        },
        {
          q: 'Can I trial a 4 seater golf buggy before buying?',
          a: `Yes. Every vehicle at ${aud(TRIAL_MIN)} or more, which includes all ${word(lux.n)} here, comes with a complimentary on-farm trial demonstration. Contact us to arrange it.`,
        },
      ],
    },

    // ------------------------------------------------------------ 2-seater
    'traditional-2-seater': {
      primaryKeyword: '2 seater golf buggy for sale',
      supportingKeywords: ['2 seater golf buggy', 'electric golf buggy 2 seater', 'two seater golf buggy', '2 seat golf buggy', '2 seater golf cart', '2 person golf carts for sale'],
      h1: '2 Seater Golf Buggies for Sale in Australia',
      metaTitle: '2 Seater Golf Buggies for Sale Australia | Buggies Express',
      metaDescription: `${cap(word(two.n))} 2 seater golf buggies for sale in Australia, from ${aud(two.lo)}: electric lithium models from Club Car, E-Z-GO, Yamaha and more. GST included.`,
      intro: `${cap(word(two.n))} traditional 2-seater lithium golf buggies from ${aud(two.lo)} to ${aud(two.hi)} AUD, including Club Car, E-Z-GO and Yamaha, tested at our Yatala QLD depot and shipped Australia-wide in enclosed freight.`,
      sections: [
        {
          heading: '2 Seater Golf Buggies for Sale: The Range',
          body: `This is the classic format: two seats, a bag rack at the rear and a lithium battery under the seat. The ${word(two.n)} models run from ${aud(two.lo)} to ${aud(two.hi)} AUD including GST, and every one is electric. If you want more seats later, the heavy-duty rear flip seat kit in our accessories range converts a 2-seater to a 4-seater for ${price('heavy-duty-rear-flip-seat-kit-2-to-4')}, provided it suits your model.`,
        },
        {
          heading: 'Name-Brand 2 Seaters: Club Car, E-Z-GO and Yamaha',
          body: `The Club Car Tempo Lithium (2025 model) at ${price('club-car-tempo-lithium-2025')} uses the Monaco drive system on a rust-proof aluminium frame with an automotive-style dashboard. The E-Z-GO RXV ELiTE Lithium at ${price('ezgo-rxv-elite-lithium')} carries Samsung SDI lithium batteries with an automatic electromagnetic brake. The Yamaha Drive2 AC Lithium at ${price('yamaha-drive2-ac-lithium')} has independent front and rear suspension and a wide dash storage tray.`,
        },
        {
          heading: 'Value 2 Seaters from $11,990',
          body: `The LVTONG 2-Passenger at ${price('lvtong-2-passenger-golf-buggy')} runs a 48V system and includes a split foldable windshield, dual sand bottles and a caddy bag holder. The Tara Spirit Pro at ${price('tara-spirit-pro-2-seater')} is lightweight with a rapid charger, digital speedometer and sweater basket, and the Evolution Classic 2 Plus at ${price('evolution-classic-2-plus')} adds a 6.3-inch LCD screen and side mirrors with turn signals.`,
        },
        {
          heading: 'Choosing Between Them, and Trying One First',
          body: `Match the two seater golf buggy to the use. For the course, the sand bottles and caddy holder on the LVTONG suit a golfer. For a property, the independent suspension on the Yamaha or the drive system on the Club Car matter more. ${cap(word(trialCount(inCat(TWO))))} of these models are at ${aud(TRIAL_MIN)} or more and qualify for a complimentary on-farm trial demonstration. The how to choose guide below walks through the decision.`,
        },
        {
          heading: "Who Buys a 2 Seater Golf Buggy",
          body: "A 2-seater is the right size for a golfer and a playing partner, for a retiree getting around a village, and for a smaller property where a 4-seater is more than needed. It is also the easiest to store and the cheapest to run. If you only occasionally carry more than two people, you can step up to a 4-seater later with the flip seat kit rather than buying again, and the motors guide below explains why AC drive models such as the E-Z-GO RXV and Yamaha Drive2 feel stronger on hills.",
        },
      ],
      guides: [
        { slug: 'how-to-choose-the-right-electric-golf-buggy-in-australia', label: 'How to choose the right electric golf buggy' },
        { slug: 'ac-vs-dc-golf-buggy-motors-torque-efficiency-australia', label: 'AC vs DC golf buggy motors' },
        { slug: 'lithium-vs-lead-acid-golf-buggy-batteries-australia', label: 'Lithium vs lead acid golf buggy batteries' },
        { slug: 'golf-buggy-maintenance-checklist-australian-climates', label: 'Golf buggy maintenance checklist for Australian climates' },
      ],
      faqs: [
        {
          q: 'How much is a 2 seater golf buggy in Australia?',
          a: `Our ${word(two.n)} 2-seater electric golf buggies cost between ${aud(two.lo)} and ${aud(two.hi)} AUD including GST, with freight quoted separately against your postcode.`,
        },
        {
          q: 'Which 2 seater golf buggy is the cheapest?',
          a: `The LVTONG 2-Passenger Golf Buggy at ${price('lvtong-2-passenger-golf-buggy')}, which includes a split foldable windshield, dual sand bottles and a caddy bag holder.`,
        },
        {
          q: 'Are your 2 seater golf buggies lithium or lead acid?',
          a: `All ${word(two.n)} 2-seaters here are lithium. They are sold as complete electric buggies, not conversion kits.`,
        },
        {
          q: 'Can a 2 seater golf buggy be made into a 4 seater?',
          a: `Our heavy-duty rear flip seat kit (${price('heavy-duty-rear-flip-seat-kit-2-to-4')}) is designed to convert a 2-seater into a 4-seater and folds flat into a cargo tray. Ask us to confirm fitment for the specific model before ordering.`,
        },
        {
          q: 'Do you deliver 2 seater golf buggies Australia-wide?',
          a: `Yes. Every buggy ships in enclosed freight from Yatala QLD, with the freight cost quoted against your delivery postcode at checkout.`,
        },
      ],
    },

    // ------------------------------------------------------------ off-road
    'off-road-4x4': {
      primaryKeyword: 'off road golf buggy',
      supportingKeywords: ['off road golf cart', '4x4 golf cart for sale', '4x4 electric golf cart', 'lifted golf cart', 'lifted golf buggy'],
      h1: 'Off Road Golf Buggies for Sale in Australia',
      metaTitle: 'Off Road Golf Buggies for Sale Australia | Lifted 4x4',
      metaDescription: `${cap(word(off.n))} lifted 4x4 off road golf buggies for sale in Australia, from ${aud(off.lo)}. Built for acreage and rough ground, GST included, from Yatala QLD.`,
      intro: `${cap(word(off.n))} lifted and 4x4 off road buggies from ${aud(off.lo)} to ${aud(off.hi)} AUD for acreage, farms and rough ground. ${cap(word(offElectric))} are lithium electric and one is EFI petrol, all tested at our Yatala QLD depot.`,
      sections: [
        {
          heading: 'Off Road Golf Buggies for Sale: What to Expect',
          body: `An off road golf buggy trades a little ride comfort for ground clearance, grip and braking. These ${word(off.n)} models run from ${aud(off.lo)} to ${aud(off.hi)} AUD including GST. ${cap(word(offElectric))} are lithium electric, and the Club Car Onward Lifted EFI Petrol (${price('club-car-onward-lifted-efi-petrol')}) is the one petrol option, with a Kohler 14HP EFI engine, for properties without charging.`,
        },
        {
          heading: 'Lifted Golf Buggies: Atlas, E-Z-GO and Tara',
          body: `The Atlas 4-Seater Heavy Duty Lifted at ${price('atlas-4-seater-heavy-duty-lifted-350a')} pairs a 350A controller with 4-wheel hydraulic brakes, rugged all-terrain tyres and a brush guard. The E-Z-GO Express S4 Lifted High-Torque at ${price('ezgo-express-s4-lifted-high-torque')} has a 4-inch lift kit, Desert Eagle all-terrain tyres and a rear seat that converts to a cargo bed. The Tara Roadster 4 Off-Road at ${price('tara-roadster-4-off-road')} adds a high-torque gear ratio and 12-inch off-road rims.`,
        },
        {
          heading: '4x4 Builds: Evolution D-MAX and LVTONG',
          body: `The Evolution D-MAX GT4 Off-Road at ${price('evolution-d-max-gt4-off-road')} is the most heavily equipped: a heavy-duty roll cage, independent off-road suspension, an integrated winch and a high-power AC engine. The LVTONG Rough-Terrain Lifted Buggy at ${price('lvtong-rough-terrain-lifted-buggy')} is the value pick, with high ground clearance, a reinforced steel subframe and a front LED light bar.`,
        },
        {
          heading: 'Brakes, Tyres and Upgrades',
          body: `More lift and more power are worth little without more brake. If you own a buggy already, our accessories range includes a heavy-duty 4-wheel hydraulic disc brake kit at ${price('heavy-duty-4-wheel-hydraulic-disc-brake-kit')} and an all-terrain 23x10.5-12 wheel and tyre combo at ${price('all-terrain-23x10-5-12-wheel-tyre-combo')}. Every model here is at ${aud(TRIAL_MIN)} or more, so each qualifies for a complimentary on-farm trial demonstration on your own ground.`,
        },
        {
          heading: "Choosing an Off Road Golf Buggy for Your Ground",
          body: "Match the buggy to the terrain rather than the spec sheet. Soft or steep ground rewards the high-torque gearing and larger tyres of the Tara Roadster 4 and the Atlas 350A. Rocky or overgrown ground suits the roll cage and winch of the Evolution D-MAX GT4. For long days on large acreage with no charging, the petrol Club Car Onward Lifted EFI removes the range question altogether. Our rural acreage guide below covers slope, load and braking in more detail.",
        },
      ],
      guides: [
        { slug: 'heavy-duty-off-road-golf-buggy-rural-acreage-guide', label: 'Heavy-duty off road golf buggy guide for rural acreage' },
        { slug: 'lifted-4x4-golf-carts-acreage-and-farm-performance', label: 'Lifted 4x4 buggies: acreage and farm performance' },
        { slug: 'golf-buggy-tyres-explained-australia', label: 'Golf buggy tyres explained' },
        { slug: 'golf-buggy-brakes-explained-australia', label: 'Golf buggy brakes explained' },
      ],
      faqs: [
        {
          q: 'How much does an off road golf buggy cost in Australia?',
          a: `Our ${word(off.n)} lifted and 4x4 off road buggies range from ${aud(off.lo)} to ${aud(off.hi)} AUD including GST. Freight is quoted separately against your postcode.`,
        },
        {
          q: 'Are your off road golf buggies electric or petrol?',
          a: `${cap(word(offElectric))} are lithium electric and one, the Club Car Onward Lifted EFI Petrol, runs a Kohler 14HP EFI petrol engine. More petrol models are listed in our petrol range.`,
        },
        {
          q: 'Which off road golf buggy has a winch?',
          a: `The Evolution D-MAX GT4 Off-Road (${price('evolution-d-max-gt4-off-road')}) carries an integrated winch, along with a heavy-duty roll cage and independent off-road suspension.`,
        },
        {
          q: 'Can I trial an off road golf buggy on my own property?',
          a: `Yes. Vehicles at ${aud(TRIAL_MIN)} or more include a complimentary on-farm trial demonstration, and every off road model here qualifies. Contact us to arrange a time.`,
        },
        {
          q: 'Is a lifted golf buggy suitable for the road?',
          a: `Off road buggies are built for rough private ground. Road registration rules differ in each state and territory, so check with your local authority; our registration guide explains the general position.`,
        },
      ],
    },

    // ------------------------------------------------------------ utility
    'commercial-utility': {
      primaryKeyword: 'farm buggies for sale',
      supportingKeywords: ['utility buggy for sale', 'electric utility buggy', 'utility golf buggy', 'farm buggy for sale australia', 'utility golf cart'],
      h1: 'Farm Buggies for Sale in Australia',
      metaTitle: 'Farm Buggies for Sale | Utility Buggies | Buggies Express',
      metaDescription: `${cap(word(com.n))} farm buggies for sale in Australia, from ${aud(com.lo)}: flatbed, cargo and utility models plus a 6-passenger transporter. Electric and petrol, GST included.`,
      intro: `${cap(word(com.n))} commercial and farm utility buggies from ${aud(com.lo)} to ${aud(com.hi)} AUD: flatbed and cargo-box workhorses plus a 6-passenger transporter. ${cap(word(comElectric))} are electric and one is EFI petrol, tested at our Yatala QLD depot.`,
      sections: [
        {
          heading: 'Farm Buggies for Sale: Flatbed and Cargo Models',
          body: `Four models are built around a load bed. The Club Car Carryall 700 Electric Utility at ${price('club-car-carryall-700-electric-utility')} has a 6-foot aluminium cargo box, a 680kg payload and a heavy-duty tow hitch. The Evolution 700 at ${price('evolution-700-heavy-commercial-utility')} has a drop-side flatbed tray and tow bar. The LVTONG Flatbed at ${price('lvtong-commercial-flatbed-cargo-buggy')} offers a steel mesh flatbed on a low loader height with regenerative braking, and the E-Z-GO Cushman Hauler PRO at ${price('ezgo-cushman-hauler-pro-lithium')} runs a 72V AC drive with an electric cargo bed dump option.`,
        },
        {
          heading: 'Utility Buggies for Farms, Resorts and Industrial Sites',
          body: `Every utility buggy for sale here is priced from ${aud(com.lo)} to ${aud(com.hi)} AUD including GST. ${cap(word(comElectric))} are electric utility buggies; the Yamaha UMAX Rally EFI Petrol at ${price('yamaha-umax-rally-efi-petrol')} adds a 402cc Yamaha EFI engine for sites with no charging. Compare payload and towing figures on each product page rather than between categories, because the Carryall's 680kg payload and the Cushman's 544kg towing capacity are measured differently.`,
        },
        {
          heading: 'Moving People: The Club Car Transporter 6',
          body: `The Club Car Transporter 6 Commercial at ${price('club-car-transporter-6-commercial')} is the people mover: six forward-facing seats, an Armor-Flex body and heavy-duty axles, aimed at resorts, caravan parks and large venues. If you move people more than goods, start here and read the resort guide below.`,
        },
        {
          heading: 'Fleet Orders, Trial and Delivery',
          body: `Buying several? Our wholesale page covers fleet enquiries. Every utility buggy here is at ${aud(TRIAL_MIN)} or more, so each qualifies for a complimentary on-farm trial demonstration, which is the best way to test a load on your own ground. Delivery is enclosed freight Australia-wide, quoted against your postcode.`,
        },
        {
          heading: "Matching a Utility Buggy to the Job",
          body: "Work out the load first. A cargo box with a tow hitch suits a farm hauling feed and tools; a drop-side flatbed suits a nursery, winery or maintenance crew; a low loader height makes loading by hand easier. Electric models run quietly around guests, which is why they are common at resorts and caravan parks, while the petrol UMAX Rally suits remote sites with no power. The electric utility price guide below sets out what each type costs to buy and run.",
        },
      ],
      guides: [
        { slug: 'commercial-utility-golf-buggies-resorts-and-industrial-parks', label: 'Commercial utility buggies for resorts and industrial parks' },
        { slug: 'electric-utility-buggy-price-guide-australia', label: 'Electric utility buggy price guide' },
        { slug: 'golf-buggies-for-wineries-vineyards-australia', label: 'Buggies for wineries and vineyards' },
        { slug: 'golf-buggies-for-caravan-parks-holiday-resorts-australia', label: 'Buggies for caravan parks and holiday resorts' },
        { slug: 'transporting-towing-golf-buggy-australia-trailers-tie-downs', label: 'Transporting and towing a buggy' },
      ],
      faqs: [
        {
          q: 'How much does a farm utility buggy cost in Australia?',
          a: `Our ${word(com.n)} commercial and farm utility buggies range from ${aud(com.lo)} to ${aud(com.hi)} AUD including GST. Freight is quoted separately against your delivery postcode.`,
        },
        {
          q: 'Which utility buggy has the biggest payload?',
          a: `The Club Car Carryall 700 Electric Utility lists a 680kg payload with a 6-foot aluminium cargo box. The E-Z-GO Cushman Hauler PRO lists a 544kg towing capacity, so check each product page for how its figure is stated.`,
        },
        {
          q: 'Are the utility buggies electric or petrol?',
          a: `${cap(word(comElectric))} are electric and one, the Yamaha UMAX Rally EFI Petrol, runs a 402cc Yamaha EFI engine. More petrol utility models are in our petrol range.`,
        },
        {
          q: 'Can a utility buggy carry passengers?',
          a: `The Club Car Transporter 6 Commercial seats six forward-facing passengers. The flatbed and cargo models are built primarily for loads, so check the seating on each product page.`,
        },
        {
          q: 'Do you offer fleet pricing on utility buggies?',
          a: `Fleet and wholesale enquiries are handled through our wholesale page. Contact us with the number and type of buggies you need and we will quote you directly.`,
        },
      ],
    },

    // ------------------------------------------------------------- petrol
    'mechanical-petrol': {
      primaryKeyword: 'petrol golf buggy for sale',
      supportingKeywords: ['petrol golf buggy', 'petrol golf carts for sale', 'petrol golf cart', 'gas golf carts for sale', 'petrol powered golf cart'],
      h1: 'Petrol Golf Buggies for Sale in Australia',
      metaTitle: 'Petrol Golf Buggies for Sale Australia | Buggies Express',
      metaDescription: `Petrol golf buggy for sale in Australia: ${word(pet.n)} EFI models from ${aud(pet.lo)}, plus petrol golf carts for sale. Club Car, Yamaha, E-Z-GO. GST included.`,
      intro: `${cap(word(pet.n))} petrol and EFI golf buggies from ${aud(pet.lo)} to ${aud(pet.hi)} AUD for properties without charging, plus ${word(petrolCount - pet.n)} more petrol models in our off-road and utility ranges. Tested at our Yatala QLD depot and shipped Australia-wide.`,
      sections: [
        {
          heading: 'Petrol Golf Buggies for Sale: When Petrol Makes Sense',
          body: `A petrol golf buggy suits a property with no convenient charging point, long continuous use, or heavy loads. We stock ${word(petrolCount)} petrol models across three ranges, from ${aud(allPetrol.lo)} to ${aud(allPetrol.hi)} AUD including GST. The ${word(pet.n)} on this page are Club Car, Yamaha, E-Z-GO and Cushman models; the Onward Lifted EFI is in off-road and the UMAX Rally EFI is in utility.`,
        },
        {
          heading: 'EFI Petrol Golf Buggies: Yamaha, Club Car and E-Z-GO',
          body: `The Yamaha Drive2 QuietTech EFI Petrol at ${price('yamaha-drive2-quiettech-efi-petrol')} pairs a quiet EFI engine with fully independent rear suspension. The Club Car Tempo EFI Petrol at ${price('club-car-tempo-efi-petrol')} has a 14HP single-cylinder overhead-cam engine and a 25.4L tank. The E-Z-GO Freedom RXV Gas at ${price('ezgo-freedom-rxv-gas')} uses the EX1 closed-loop EFI engine and is the lowest-priced model in the range.`,
        },
        {
          heading: 'Petrol Utility Buggies',
          body: `For work, the Cushman Hauler 1200 Gas Utility at ${price('cushman-hauler-1200-gas-utility')} has a 13.5HP Kawasaki engine, a manual dump bed and a 544kg total load capacity. The Yamaha UMAX One EFI Utility at ${price('yamaha-umax-one-efi-utility')} has a compact utility bed with a one-hand latch, and the Club Car Carryall 300 at ${price('club-car-carryall-300-petrol')} offers a 14HP engine on a rustproof aluminium frame with a compact turning radius.`,
        },
        {
          heading: 'Petrol or Electric?',
          body: `Electric is quieter and has nothing to refuel; petrol keeps working where charging is awkward. If you are undecided, the petrol versus electric running costs guide below compares them on real numbers, and our electric range is one click away. ${cap(word(trialCount(inCat(PET))))} of the ${word(pet.n)} petrol buggies here are at ${aud(TRIAL_MIN)} or more and include a complimentary on-farm trial demonstration.`,
        },
        {
          heading: "Looking After a Petrol Golf Buggy",
          body: "A petrol buggy asks for different care from an electric one: engine oil and filter changes, fresh fuel and a spark plug now and then in place of battery care. EFI engines keep that routine light, and the Club Car Tempo EFI's overhead-cam design and the E-Z-GO Freedom RXV's closed-loop injection are both aimed at low maintenance. Our maintenance checklist below is written for Australian climates, and we can talk you through the service schedule for any model before you buy.",
        },
      ],
      guides: [
        { slug: 'petrol-vs-electric-golf-buggy-running-costs-australia', label: 'Petrol vs electric golf buggy: running costs' },
        { slug: 'golf-buggy-maintenance-checklist-australian-climates', label: 'Golf buggy maintenance checklist' },
        { slug: 'commercial-utility-golf-buggies-resorts-and-industrial-parks', label: 'Commercial utility buggies for resorts and industrial parks' },
        { slug: 'how-to-choose-the-right-electric-golf-buggy-in-australia', label: 'How to choose the right electric golf buggy' },
      ],
      faqs: [
        {
          q: 'How much is a petrol golf buggy in Australia?',
          a: `Our ${word(petrolCount)} petrol and EFI buggies range from ${aud(allPetrol.lo)} to ${aud(allPetrol.hi)} AUD including GST. The ${word(pet.n)} on this page run from ${aud(pet.lo)} to ${aud(pet.hi)}.`,
        },
        {
          q: 'What does EFI mean on a petrol golf buggy?',
          a: `EFI is electronic fuel injection. It meters fuel electronically rather than through a carburettor, which generally gives easier starting and steadier running. Most of our petrol models are EFI.`,
        },
        {
          q: 'Which petrol golf buggy is the quietest?',
          a: `Yamaha designs the engine in the Drive2 QuietTech EFI Petrol for low noise, so that is the model to start with. A trial demonstration is the best way to judge noise for yourself.`,
        },
        {
          q: 'Do you stock petrol utility buggies?',
          a: `Yes: the Cushman Hauler 1200 Gas, Yamaha UMAX One EFI and Club Car Carryall 300 are on this page, and the Yamaha UMAX Rally EFI is in our utility range.`,
        },
        {
          q: 'Are there petrol golf carts for sale with a lift kit?',
          a: `The Club Car Onward Lifted EFI Petrol (${price('club-car-onward-lifted-efi-petrol')}) is a lifted petrol golf cart with a Kohler 14HP EFI engine and all-terrain tread. It is listed under off-road.`,
        },
      ],
    },

    // ------------------------------------------------------- walk-behind
    'walk-behind-buggies': {
      primaryKeyword: 'golf trolley',
      supportingKeywords: ['remote control golf buggy', 'golf push buggy', 'electric golf trolley', 'motorised golf buggy', 'electric golf caddy', 'golf trolley for sale'],
      h1: 'Golf Trolleys & Remote Control Golf Buggies for Sale',
      metaTitle: 'Golf Trolleys & Remote Control Buggies | Buggies Express',
      metaDescription: `Electric golf trolleys and remote control golf buggies for sale in Australia: ${walk.n} motorised models from ${aud(walk.lo)}, a lithium alternative to a golf push buggy.`,
      faqs: [
        {
          q: 'What is the difference between a golf push buggy and a motorised golf buggy?',
          a: `A golf push buggy is moved by hand. A motorised golf buggy drives itself under lithium power while you walk beside it. Everything in this range is motorised; we do not stock manual push trolleys.`,
        },
        {
          q: 'How much does an electric golf trolley cost in Australia?',
          a: `Our ${word(walk.n)} motorised walk-behind models range from ${aud(walk.lo)} for the MGI Zip X1 to ${aud(walk.hi)} for the MGI Ai Navigator GPS Remote, including GST.`,
        },
        {
          q: 'Which golf trolley has a remote control?',
          a: `The MGI Ai Navigator GPS Remote Buggy (${price('mgi-ai-navigator-gps-remote-buggy')}) offers full directional remote control, and the Robera Pro (${price('robera-pro-follow-remote-golf-buggy')}) combines dual-mode remote with smart follow.`,
        },
        {
          q: 'Are the walk-behind golf buggies lithium?',
          a: `Yes. Every model in this range runs a lithium battery, and spare MGI lithium batteries and replacement remotes are available in our batteries and accessories ranges.`,
        },
        {
          q: 'Will a motorised golf buggy fit in my car boot?',
          a: `Folding is standard across the range, but boots differ. Measure your boot against the folded dimensions on the product page; the foldable buggy guide explains how.`,
        },
      ],
    },

    // --------------------------------------------------------- batteries
    'batteries-chargers': {
      primaryKeyword: 'golf buggy battery',
      supportingKeywords: ['golf buggy battery lithium', 'golf buggy battery replacement', 'golf buggy charger', 'golf cart batteries'],
      faqs: [
        {
          q: 'How much does a lithium golf buggy battery cost?',
          a: `Prices in our range start at ${price('invicta-48v-50ah-lithium-drop-in-module')} for the Invicta 48V 50Ah drop-in module and run to ${price('roypow-72v-105ah-commercial-lithium-battery')} for the RoyPow 72V 105Ah commercial pack, GST included.`,
        },
        {
          q: 'Can I do a golf buggy battery replacement with lithium?',
          a: `Yes, that is the most common upgrade we ship. The Eco Battery 48V 105Ah conversion kit and the RoyPow 48V 105Ah pack both replace a full lead-acid bank. Check your charger and battery tray before ordering; our conversion guide covers the details.`,
        },
        {
          q: 'Do you sell lead acid golf buggy batteries?',
          a: `Yes. The Trojan T-875 8V deep cycle battery is ${price('trojan-t-875-8v-deep-cycle-lead-acid-battery')} per cell.`,
        },
        {
          q: 'Which golf buggy charger do I need?',
          a: `The charger must match the pack. We stock the Delta-Q QuiQ 48V smart on-board charger and the Club Car ERIC 48V high-frequency charger; contact us with your battery model if you are unsure.`,
        },
        {
          q: 'Do you have batteries for walk-behind golf trolleys?',
          a: `Yes. The MGI 24V Lithium Battery (${price('mgi-24v-lithium-battery-36-hole')}) is the replacement pack for the MGI walk-behind range.`,
        },
      ],
    },

    // ------------------------------------------------------- accessories
    'accessories-spare-parts': {
      primaryKeyword: 'golf buggy accessories',
      supportingKeywords: ['golf buggy accessories australia', 'golf buggy wheels', 'golf buggy tyres', 'golf cart accessories'],
      faqs: [
        {
          q: 'What golf buggy accessories do you sell?',
          a: `Our accessories range covers lighting, mirrors and seatbelts, wheels and tyres, weather protection such as the PVC enclosure and acrylic windshield, storage and audio, plus controllers, brake kits and a solenoid. Every item is on this page with its price.`,
        },
        {
          q: 'Do you sell golf buggy wheels and tyres?',
          a: `Yes: the all-terrain 23x10.5-12 wheel and tyre combo is ${price('all-terrain-23x10-5-12-wheel-tyre-combo')} for a set of four, with 12-inch machined alloy rims and a 6-ply off-road tread.`,
        },
        {
          q: 'Will these accessories fit my golf buggy?',
          a: `Many are universal, but fitment varies by make and model. Check the product page and contact us with your buggy's make and model if you are unsure before ordering.`,
        },
        {
          q: 'Is there a discount on accessories bought with a buggy?',
          a: `Yes. Accessories bought alongside any buggy qualify for a ${SHOP.accessoryBundleDiscount}% discount. Bitcoin and USDT payments take ${SHOP.cryptoDiscount}% off the vehicle price only; accessories and freight are charged at full rate on top.`,
        },
        {
          q: 'Do you sell replacement remotes for walk-behind buggies?',
          a: `Yes. The replacement MGI Ai and Zip remote controller is ${price('replacement-mgi-ai-zip-remote-controller')}, with pre-programmed pairing and USB-C charging.`,
        },
      ],
    },

    // ------------------------------------------------------------ junior
    // Density trim only (10 uses of the head term on the page was 4.14%).
    // Nothing here may state a model, price or date.
  };
}

let cache: Record<string, CategoryContent> | undefined;

/** Content for one category slug (without the hub). */
export function categoryContent(slug: string): CategoryContent {
  cache ??= build();
  return cache[slug] ?? {};
}

/** CATEGORIES entry merged with the server-only content: fields here win. */
export function resolveCategory(slug: string) {
  const base = CATEGORIES.find((c) => c.slug === slug);
  if (!base) return undefined;
  return { ...base, ...categoryContent(slug) } as (typeof CATEGORIES)[number] & CategoryContent;
}

// ------------------------------------------------------------------ the hub
export interface HubContent {
  title: string;
  description: string;
  h1: string;
  intro: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export function hubContent(): HubContent {
  const vehicles = PRODUCTS.filter((p) => isBuggyItem(p.category, p.id, p.name));
  const v = stats(vehicles);
  const parts = PRODUCTS.length - vehicles.length;
  const riding = vehicles.filter((p) => p.category !== WALK);
  const petrol = vehicles.filter(isPetrol).length;
  const elec = PRODUCTS.filter(isElectricBuggy);
  const walk = stats(inCat(WALK));
  const lux = stats(inCat(LUX));
  const two = stats(inCat(TWO));
  const com = stats(inCat(COM));
  return {
    title: 'Golf Buggy for Sale in Australia | Buggies Express',
    description: `Golf buggy for sale in Australia: ${vehicles.length} buggies from ${aud(v.lo)}, 4-seater, 2-seater, 4x4, utility, petrol and walk-behind. GST included, shipped from Yatala QLD.`,
    h1: `Golf Buggy for Sale in Australia: All ${vehicles.length} Buggies`,
    intro: `Our full range of golf buggies for sale in Australia: ${riding.length} passenger and utility buggies, ${walk.n} motorised walk-behind models, plus ${parts} batteries, chargers and accessories. Everything is tested at our Yatala QLD depot and priced with GST included.`,
    primaryKeyword: 'golf buggy for sale',
    supportingKeywords: ['golf buggies for sale australia', 'buy golf buggy', 'best golf buggy australia', 'golf buggy sales', 'golf buggy price'],
    sections: [
      {
        heading: 'Golf Buggy Sales: Browse by Type',
        body: `Choose the category that matches the job. 4-seater and 6-passenger buggies start at ${aud(lux.lo)}, 2-seaters at ${aud(two.lo)}, farm and utility buggies at ${aud(com.lo)} and walk-behind golf trolleys at ${aud(walk.lo)}. Lifted 4x4 off road buggies and petrol models each have their own range. If you already know you want battery power, our electric golf buggies page lists all ${elec.length} electric models together.`,
      },
      {
        heading: 'How Much Does a Golf Buggy Cost in Australia?',
        body: `Our vehicles run from ${aud(v.lo)} for the MGI Zip X1 walk-behind to ${aud(v.hi)} for the E-Z-GO Express L6. All prices include 10% GST. There is no minimum order and no free-freight threshold: freight is quoted against your delivery postcode at checkout, and the cart total is shown excluding freight. Payment is by PayID / Osko, direct bank transfer, Finance in 4, or Bitcoin or USDT with a ${SHOP.cryptoDiscount}% discount on the vehicle price.`,
      },
      {
        heading: 'Buy a Golf Buggy With Confidence',
        body: `We are an Australian company, Golf Buggies Express Pty Ltd (ABN 28 668 598 758), based at Yatala QLD. Every buggy is inspected at our depot before dispatch and ships Australia-wide in enclosed freight from one location. Vehicles at ${aud(TRIAL_MIN)} or more come with a complimentary on-farm trial demonstration, and the buyers guides below explain ordering, delivery and warranty before you commit.`,
      },
      {
        heading: 'Which Golf Buggy Is Best for Me?',
        body: `The best golf buggy in Australia depends on where it runs. For a golf course, a motorised walk-behind trolley or a 2-seater fits. For a gated estate, a 4-seater. For rough acreage, a lifted 4x4 buggy. For hauling, a utility buggy. ${petrol} models are petrol for properties without charging; the rest are lithium electric. The how to choose guide walks through the decision step by step.`,
      },
    ],
    faqs: [
      {
        q: 'Where can I buy a golf buggy in Australia?',
        a: `You can buy from us online: choose a buggy, add it to your cart and place your order, and we ship Australia-wide in enclosed freight from our Yatala QLD depot. Call or message us if you would like help choosing.`,
      },
      {
        q: 'How much does a golf buggy cost?',
        a: `Our golf buggies range from ${aud(v.lo)} to ${aud(v.hi)} AUD including GST. Walk-behind models start at ${aud(walk.lo)}, 2-seaters at ${aud(two.lo)} and 4-seaters at ${aud(lux.lo)}. Freight is quoted separately against your delivery postcode.`,
      },
      {
        q: 'Do you sell electric or petrol golf buggies?',
        a: `Both. ${elec.length} of our ${vehicles.length} buggies are lithium electric and ${petrol} are EFI or petrol. Electric suits most buyers; petrol suits properties without convenient charging.`,
      },
      {
        q: 'Do you deliver golf buggies Australia-wide?',
        a: `Yes, to every state and territory from our single Yatala QLD depot, in enclosed freight. Freight is calculated by location and pallet requirements and quoted against your postcode.`,
      },
      {
        q: 'Can I try a golf buggy before I buy?',
        a: `Vehicles priced at ${aud(TRIAL_MIN)} or more include a complimentary on-farm trial demonstration. Contact us to arrange one.`,
      },
      {
        q: 'What payment methods do you accept?',
        a: `PayID / Osko, direct bank transfer (EFT), Finance in 4 (four equal interest-free payments) and Bitcoin or USDT with a ${SHOP.cryptoDiscount}% discount on the vehicle price. After any payment we ask you to send the receipt or a screenshot on WhatsApp.`,
      },
    ],
  };
}
