// SERVER-ONLY (imported by product-details.ts). Never import from a client component.
//
// Product FAQs are built from each product's own data instead of being stored
// 62 times. The earlier hand-expanded set repeated the same delivery, warranty,
// stock and finance sentences on every page (35% of sentences were shared) and
// got some answers wrong (a "battery" answer that quoted a speed dial, a tow
// hitch said to travel in a "weather-sealed transporter"). Delivery, payment
// and warranty now appear once per page in a shared block (ProductClient), and
// every answer here uses this product's price, specs, audience or a sibling.
//
// A product can still carry hand-written `faqs` in PRODUCT_DETAILS to override.
import { PRODUCTS, SHOP, CONTACT, isBuggyItem, type ProductItem } from './site';

export interface Faq {
  q: string;
  a: string;
}

const aud = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;
const TRIAL_MIN = 15000; // brand rule: complimentary on-farm trial demonstration at or above this price
const WALK = 'Motorised Walk-Behind Golf Buggies';
const BATT = 'Golf Buggy Batteries & Chargers';

const specList = (p: ProductItem, n = 99) =>
  p.key_specs
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, n);

const joinList = (xs: string[]) => (xs.length <= 1 ? xs[0] ?? '' : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** The nearest-priced other product in the same category, ties broken by catalogue order. */
function sibling(p: ProductItem): ProductItem | undefined {
  return PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).sort(
    (a, b) => Math.abs(a.price_aud - p.price_aud) - Math.abs(b.price_aud - p.price_aud)
  )[0];
}

function priceFaq(p: ProductItem, accessory: boolean): Faq {
  const crypto = p.price_aud * (1 - SHOP.cryptoDiscount / 100);
  const quarter = Math.round((p.price_aud / 4) * 100) / 100;
  const extra = accessory
    ? `Bought alongside any buggy, the ${p.name} earns the ${SHOP.accessoryBundleDiscount}% accessory discount.`
    : `Paying in Bitcoin or Tether takes ${SHOP.cryptoDiscount}% off the vehicle price, which brings it to ${aud(crypto)}.`;
  return {
    q: `How much does the ${p.name} cost in Australia?`,
    a: `The ${p.name} is ${aud(p.price_aud)} AUD including GST. ${extra} Finance in 4 splits it into four interest-free payments of $${quarter.toLocaleString('en-AU')}.`,
  };
}

function specsFaq(p: ProductItem, vehicle: boolean): Faq {
  const specs = specList(p);
  return vehicle
    ? {
        q: `What powers the ${p.name} and what does it include?`,
        a: `The ${p.name} is listed as ${p.fuel_type}. Its specification: ${joinList(specs)}.`,
      }
    : {
        q: `What are the specifications of the ${p.name}?`,
        a: `The ${p.name} is listed with ${joinList(specs)}.`,
      };
}

function compareFaq(p: ProductItem): Faq | undefined {
  const s = sibling(p);
  if (!s) return undefined;
  const diff = Math.abs(p.price_aud - s.price_aud);
  const dir = p.price_aud >= s.price_aud ? 'more' : 'less';
  return {
    q: `How does the ${p.name} compare with the ${s.name}?`,
    a: `The ${p.name} is ${aud(p.price_aud)} and the ${s.name} is ${aud(s.price_aud)}, so the ${p.name} costs ${aud(diff)} ${dir}. The ${p.name} lists ${joinList(specList(p, 2))}; the ${s.name} lists ${joinList(specList(s, 2))}.`,
  };
}

function vehicleFaqs(p: ProductItem): Faq[] {
  const trial =
    p.price_aud >= TRIAL_MIN
      ? `Yes. At ${aud(p.price_aud)} the ${p.name} qualifies for a complimentary on-farm trial demonstration. Call the Yatala desk on ${CONTACT.phoneDisplay} or message us to book a demonstration of the ${p.name}.`
      : `Complimentary on-farm trial demonstrations apply to vehicles priced at ${aud(TRIAL_MIN)} or more, and the ${p.name} is ${aud(p.price_aud)}. Ask the Yatala desk on ${CONTACT.phoneDisplay} how you can see one before you buy.`;
  return [
    priceFaq(p, false),
    specsFaq(p, true),
    {
      q: `Who is the ${p.name} best suited to?`,
      a: `We specify the ${p.name} for ${p.target_audience.toLowerCase()}. If your use differs, tell us the terrain, the passengers and the daily distance and we will say whether the ${p.name} or another model in the range fits better.`,
    },
    compareFaq(p),
    { q: `Can I try the ${p.name} before I buy it?`, a: trial },
    {
      q: `Is the ${p.name} road registrable in Australia?`,
      a: `Whether a ${p.name} can be registered for any road use depends on your state road authority and often your local council, so it differs by address and changes over time. We can supply the ${p.name} and its compliance details; the approval itself is theirs to give, so check with them before buying or fitting a road package.`,
    },
  ].filter((f): f is Faq => Boolean(f));
}

function walkFaqs(p: ProductItem): Faq[] {
  const out: (Faq | undefined)[] = [priceFaq(p, false), specsFaq(p, true)];
  out.push({
    q: `Who is the ${p.name} best suited to?`,
    a: `We specify the ${p.name} for ${p.target_audience.toLowerCase()}. It is a motorised walk-behind model, so you walk beside it rather than ride; if you would rather ride, see our passenger buggy range.`,
  });
  out.push(compareFaq(p));
  if (/^MGI/i.test(p.name)) {
    const batt = PRODUCTS.find((x) => x.slug === 'mgi-24v-lithium-battery-36-hole');
    const remote = PRODUCTS.find((x) => x.slug === 'replacement-mgi-ai-zip-remote-controller');
    if (batt && remote) {
      out.push({
        q: `Can I buy a spare battery or replacement remote for the ${p.name}?`,
        a: `Spares for the MGI range are in stock: the MGI 24V lithium battery is ${aud(batt.price_aud)} and the replacement MGI Ai and Zip remote controller is ${aud(remote.price_aud)}. Confirm which suits your model with us before ordering.`,
      });
    }
  }
  return out.filter((f): f is Faq => Boolean(f));
}

const voltageOf = (p: ProductItem) => p.name.match(/(\d{2,3})\s?V/i)?.[1];

function batteryFaqs(p: ProductItem): Faq[] {
  const v = voltageOf(p);
  const out: (Faq | undefined)[] = [priceFaq(p, true), specsFaq(p, false), compareFaq(p)];
  if (v) {
    out.push({
      q: `What voltage system does the ${p.name} suit?`,
      a: `The ${p.name} is a ${v}V product, so it belongs on a ${v}V system. Confirm your buggy's system voltage, and your existing charger and battery tray, before ordering; send us the make, model and year if you are unsure.`,
    });
  }
  return out.filter((f): f is Faq => Boolean(f));
}

function fitHint(p: ProductItem): string {
  const it = `the ${p.name}`;
  const n = p.name.toLowerCase();
  if (/controller|solenoid|voltage reducer|converter/.test(n))
    return `Controllers, solenoids and other electrical changes should be fitted by a qualified technician, and our Yatala workshop can advise or carry out the work.`;
  if (/brake/.test(n)) return `Brakes are a safety system, so have the kit fitted and checked by a qualified technician; our Yatala workshop can do it.`;
  if (/seatbelt|seat belt/.test(n)) return `Seatbelts must be anchored correctly to be of any use, so have them fitted properly; our Yatala workshop can advise or do the work.`;
  if (/remote/.test(n)) return `It is a pairing job rather than a fitting job: the unit ships with pre-programmed pairing and charges over USB-C.`;
  return `Many owners fit a bolt-on item like ${it} at home, and our Yatala workshop can advise or carry out the work if you would rather not.`;
}

function partFaqs(p: ProductItem): Faq[] {
  const firstSpec = specList(p, 1)[0];
  return [
    priceFaq(p, true),
    specsFaq(p, false),
    {
      q: `Will the ${p.name} fit my golf buggy?`,
      a: `Fitment depends on your make, model and year. The ${p.name} is specified as ${firstSpec}; send us your buggy's details before ordering and we will confirm it from Yatala rather than guess.`,
    },
    {
      q: `Can I fit the ${p.name} myself?`,
      a: `${fitHint(p)}`,
    },
  ];
}

export function buildFaqs(p: ProductItem): Faq[] {
  if (p.category === WALK) return walkFaqs(p);
  if (p.category === BATT) return batteryFaqs(p);
  if (isBuggyItem(p.category, p.id, p.name)) return vehicleFaqs(p);
  return partFaqs(p);
}
