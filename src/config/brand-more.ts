// SERVER-ONLY. Never import from a 'use client' component (site.ts is in the shared chunk).
// Extra question-style sections and head metadata for brand hubs. Phase 5 of the SEO ruleset:
// every brand page carries 300+ words of editorial copy and its exact primary keyword in the
// title, H1, description and opening copy. Facts here come from the catalogue (models, specs);
// prices are computed on the page, never typed here.
export interface MoreSection { heading: string; body: string }
export interface BrandMeta { title: string; h1: string; lead: string }

export const BRAND_META: Record<string, BrandMeta> = {
  'club-car': { title: 'Club Car Golf Carts for Sale Australia', h1: 'Club Car Golf Carts for Sale in Australia', lead: 'Buy club car golf carts' },
  mgi: { title: 'MGI Golf Buggy for Sale Australia', h1: 'MGI Golf Buggy Range: Motorised and Remote Buggies for Sale', lead: 'Buy an MGI golf buggy' },
  clicgear: { title: 'Clicgear Push Buggies for Sale Australia', h1: 'Clicgear Push Golf Buggies for Sale in Australia', lead: 'Buy Clicgear push buggies' },
  rovic: { title: 'Rovic Push Buggies for Sale Australia', h1: 'Rovic Push Golf Buggies for Sale in Australia', lead: 'Buy Rovic push buggies' },
  'e-z-go': { title: 'Ezgo Golf Buggy for Sale: E-Z-GO Australia', h1: 'Ezgo Golf Buggy for Sale in Australia: E-Z-GO Range', lead: 'Buy an ezgo golf buggy' },
  yamaha: { title: 'Yamaha Golf Carts for Sale Australia', h1: 'Yamaha Golf Carts for Sale in Australia', lead: 'Looking for Yamaha golf carts for sale' },
  evolution: { title: 'Buy Evolution Golf Cart in Australia', h1: 'Buy Evolution Golf Cart Models in Australia', lead: 'Buy Evolution golf cart models' },
  lvtong: { title: 'LVTONG Golf Carts for Sale Australia', h1: 'LVTONG Golf Carts for Sale in Australia', lead: 'Buy LVTONG golf carts' },
  tara: { title: 'Tara Golf Buggy for Sale Australia', h1: 'Tara Golf Buggy for Sale in Australia', lead: 'Buy a Tara golf buggy' },
  atlas: { title: 'Atlas Golf Carts for Sale Australia', h1: 'Atlas Golf Carts for Sale in Australia', lead: 'Buy Atlas golf carts' },
  cushman: { title: 'Cushman Electric Cart for Sale Australia', h1: 'Cushman Electric Cart for Sale in Australia', lead: 'Looking for a Cushman electric cart for sale' },
  powakaddy: { title: 'PowaKaddy Golf Buggy for Sale Australia', h1: 'PowaKaddy Golf Buggy in Australia: FX7 GPS Lithium', lead: 'Buy a PowaKaddy golf buggy' },
  robera: { title: 'Robera Golf Buggy for Sale Australia', h1: 'Robera Golf Buggy in Australia: Hands-Free Follow', lead: 'Buy a Robera golf buggy' },
};

const BRAND_MORE: Record<string, MoreSection[]> = {
  'club-car': [
    { heading: 'Which Club Car suits which job?', body: 'The Onward 4-Passenger Lithium and the Tempo Lithium are the passenger models for estates, resorts and private driving. The Carryall 700 Electric and Carryall 300 Petrol are the utility lines, with a cargo box and tow hitch on the 700. The Transporter 6 Commercial carries six passengers with forward-facing seating. If you are unsure, tell us the terrain, the load and the daily distance and we will point you to the right one.' },
    { heading: 'Lithium or petrol: which Club Car should you buy?', body: 'We list both. The Onward Lifted EFI Petrol, Tempo EFI Petrol and Carryall 300 use EFI petrol engines, which suit long days without access to a charger. The lithium models use an AC drive and need a power point. Choose petrol for remote ground and lithium for quiet running and low running cost, and ask us about charging before you order.' },
  ],
  mgi: [
    { heading: 'Which MGI golf buggy should a first-time buyer choose?', body: 'Start with how much help you want. The Zip X1 is the simplest, with a speed dial and a compact fold. The Zip X3 and X5 add distance control and downhill speed control. The Ai 500 adds GPS on a four-inch screen without remote control. For full directional remote control, look at the Zip Navigator, the Ai Navigator GPS and the Ai Navigator Halo at the top of the range.' },
    { heading: 'What else does MGI stock besides buggies?', body: 'Most of the 37 MGI listings are parts and accessories: lithium batteries, chargers, remotes, umbrella and phone holders, covers, seats, bags and wheels. Because batteries and chargers are matched to the series and voltage, tell us your model before you order and we will confirm the match. Everything is held at our Yatala QLD depot and freight is quoted to your postcode at checkout.' },
  ],
  clicgear: [
    { heading: 'What is the difference between the Clicgear 4.0 and 4.5?', body: 'The Model 4.0 is the compact three-wheel buggy in four colours, with an adjustable upper saddle, silicone straps, a lockable console and accessory tabs. The 4.5 steps up with an aluminium frame, adjustable handle height and improved storage with a cup holder. Both are manual push buggies with no battery, so there is nothing to charge and little to maintain.' },
    { heading: 'Why choose a Clicgear push buggy over a motorised one?', body: 'A push buggy suits golfers who want to walk with a light, simple buggy and keep the budget down. There is no motor, battery or charger to manage. If your course is hilly or you want help late in a round, the MGI motorised range is the alternative, and we are happy to compare the two for you.' },
  ],
  rovic: [
    { heading: 'Which Rovic should you pick: the RV1S or the RV1C?', body: 'The RV1S Swivel 2.0 has a front wheel that swivels through 360 degrees with a swivel lock, which makes turning light and holds a line on slopes. The RV1C Compact 2.0 folds smaller and adds a handle-mounted brake and adjustable front-wheel tracking, so it suits golfers short on boot space. Both are manual push buggies.' },
    { heading: 'Do Rovic buggies share accessories with Clicgear?', body: 'Yes. Both Rovic models share the Clicgear accessory tabs, so fittings made for one fit the other. The 2.0 update adds silicone bag straps and an external ball clip, and a seat made for the RV1C and RV1S is available separately. Tell us what you want to add and we will confirm it suits your model.' },
  ],
  'e-z-go': [
    { heading: 'Which E-Z-GO model suits your property?', body: 'The RXV ELiTE Lithium is the two-seat golf and estate model. The Express L6 carries six passengers, and the Express S4 Lifted adds a four-inch lift kit and all-terrain tyres. The Cushman Hauler PRO is the work model. The Freedom RXV Gas is the petrol option with an EFI engine. Match the model to your ground and load, and ask us if you want a second opinion.' },
    { heading: 'Is an ezgo golf buggy for sale electric or petrol?', body: 'Both. Four of the five models we list are electric with ELiTE lithium technology and one, the Freedom RXV Gas, uses an EX1 closed-loop EFI petrol engine. Lithium suits quiet, low-cost running at a site with power. Petrol suits places where charging is awkward. Parts are stocked in Australia either way.' },
  ],
  yamaha: [
    { heading: 'Which Yamaha golf cart should you buy?', body: 'The Drive2 AC Lithium is the electric golf and estate model with independent front and rear suspension. The Drive2 QuietTech EFI Petrol brings a quiet petrol engine with high fuel economy. The UMAX Rally and UMAX One are the utility models, with a 402cc EFI engine on the Rally and a compact utility bed on the One.' },
    { heading: 'Are Yamaha golf carts for sale here petrol or electric?', body: 'Three of the four models we list use EFI petrol engines and one, the Drive2 AC Lithium, is electric. Petrol gives long range and fast refuelling for farms and large venues. Electric suits quiet driving on a golf course or estate. Tell us how you will use the vehicle and we will recommend the right one.' },
  ],
  evolution: [
    { heading: 'Which Evolution golf cart suits you?', body: 'The D5 Ranger 4+2 Plus carries six passengers with a nine-inch touchscreen and a 110Ah lithium pack. The Classic 2 Plus is the two-seat model with a 6.3-inch LCD and side mirrors with turn signals. The D-MAX GT4 is the off-road model with a roll cage and winch, and the 700 Heavy Commercial Utility has a drop-side flatbed tray for facility work.' },
    { heading: 'What should you check before you buy an Evolution?', body: 'Match the seating and load to your needs, then confirm charging. All four Evolution models are lithium, so you need a power point at the place where it will live. Ask us about delivery to your postcode, trial demonstrations on higher-priced vehicles and Finance in 4 for orders above the threshold before you pay.' },
  ],
  lvtong: [
    { heading: 'Which LVTONG golf cart suits an operator?', body: 'The 4-Seater Resort Cruiser has a 4kW AC motor, a maintenance-free lithium pack and an on-board charger, which suits resorts and caravan parks. The 2-Passenger Golf Buggy is the course model. The Rough-Terrain Lifted Buggy adds ground clearance, and the Commercial Flatbed adds a low steel mesh deck for grounds and nursery work.' },
    { heading: 'Why do operators ask about running cost?', body: 'Operators compare cost per year rather than features per brochure. An on-board charger means any standard outlet can charge the vehicle, and a maintenance-free lithium pack removes watering and topping up. Tell us how many vehicles you run and how many hours a day, and we will help you work out which model fits.' },
  ],
  tara: [
    { heading: 'Which Tara golf buggy suits your ground?', body: 'The Roadster 2+2 Lifted has a lifted chassis, hydraulic disc brakes, an LED light package and a rear flip seat. The Roadster 4 Off-Road has a high-torque gear ratio and 12-inch off-road rims for climbing. The Spirit Pro 2-Seater is the lightweight golf model with a rapid charger and a digital speedometer.' },
    { heading: 'Is a Tara golf buggy good value?', body: 'Tara sits at the value end of our lithium range. The hardware is the point: hydraulic disc brakes on the Roadster 2+2 Lifted and a high-torque gear ratio on the Roadster 4 give real control on slopes. As with any buggy, tell us your terrain and load and we will say whether it is the right fit.' },
  ],
  atlas: [
    { heading: 'Which Atlas golf cart suits your acreage?', body: 'The Atlas 4-Passenger Lifted has a three-inch factory lift, custom leather seats, a touchscreen display and 14-inch alloy wheels. The 4-Seater Heavy Duty Lifted (350A) adds a 350-amp controller, four-wheel hydraulic brakes, rugged all-terrain tyres and a brush guard. Both run on 48V lithium and are built for ground clearance.' },
    { heading: 'How do the two Atlas models differ?', body: 'Both are lifted four-seaters on 48V lithium. The 4-Passenger Lifted is the comfort-led model, with leather seats, a touchscreen and 14-inch alloy wheels. The Heavy Duty Lifted (350A) is the work-led model: its 350-amp controller and four-wheel hydraulic brakes are aimed at steep farm tracks and laden climbs. Tell us your gradient and load and we will recommend one.' },
  ],
  cushman: [
    { heading: 'Which Cushman suits grounds and farm work?', body: 'The Hauler PRO Lithium runs a 72V AC drive with an optional electric dump bed and 544kg towing capacity. The Hauler 1200 Gas Utility uses a 13.5HP Kawasaki engine and a manual dump bed, with a 544kg total load capacity. Choose electric for quiet, low-cost running and petrol for remote ground without a charger.' },
    { heading: 'What load can a Cushman Hauler carry?', body: 'The Hauler PRO Lithium lists a 544kg towing capacity, and the Hauler 1200 Gas Utility lists a 544kg total load capacity. Those are different measures, so check which one matches how you will use it. Tell us your heaviest regular load, the distance and the terrain, and we will confirm the right Hauler before you order.' },
  ],
  powakaddy: [
    { heading: 'What does the PowaKaddy FX7 GPS offer?', body: 'The FX7 has a 3.5-inch OCA full-colour touchscreen preloaded with over 40,000 courses and a 30V Plug and Play lithium battery that fits and removes without tools. It is a walk-behind electric trolley with GPS on the buggy itself, so there is no separate rangefinder to carry.' },
    { heading: 'How does the FX7 compare with the MGI Ai 500?', body: 'Both put GPS on the buggy. The FX7 has a 3.5-inch OCA touchscreen and a 30V Plug and Play lithium battery, and the MGI Ai 500 has a four-inch colour screen with downhill speed control and an electronic park brake. Both list over 40,000 courses. Tell us how you play and we will help you choose between them. Prices include GST, with freight quoted to your postcode at checkout. Ask the Yatala desk for help, and we are happy to advise on accessories.' },
  ],
  robera: [
    { heading: 'How does the Robera follow buggy work?', body: 'A smart tracking tag clips to your belt and the buggy follows your footsteps at a safe distance, so there is no remote to hold between shots. Dual-mode remote control remains available when you want to send it ahead, and dual all-terrain motors provide the drive for follow mode.' },
    { heading: 'Is follow mode better than remote control?', body: 'It depends on how you like to walk. Follow mode removes the remote from your hand entirely, because the buggy tracks a tag on your belt. Remote control gives you direct steering, for example to send the buggy ahead. The Robera Pro does both, so you can switch between them. Ask the Yatala desk if you want to compare it with the MGI remote models.' },
  ],
};

export const brandMore = (slug: string): MoreSection[] => BRAND_MORE[slug] ?? [];
