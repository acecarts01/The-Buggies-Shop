// What we can truthfully say about an order depends on what is in it.
//
// The depot inspects, charge-cycles and road tests rideable vehicles before
// dispatch (src/config: delivery page, FAQ). That is NOT true of parts,
// accessories, batteries, chargers, push buggies or a custom line, and a petrol
// vehicle has no battery to charge-cycle. Every customer-facing step and intro
// that touches dispatch or preparation goes through this module so a parts
// order never claims a road test, and a petrol buggy never claims a charge cycle.
// Browser-safe (no node imports).
import { CONTACT, PRODUCTS, CATEGORIES, isAccessoryItem } from '@/src/config/site';

export type LineKind = 'electric-vehicle' | 'petrol-vehicle' | 'walk-behind' | 'push' | 'parts' | 'custom';

export interface KindLine {
  slug?: string;
  name: string;
}

const WALK_BEHIND = CATEGORIES.find((c) => c.slug === 'walk-behind-buggies')?.rawCategory;
const PUSH = CATEGORIES.find((c) => c.slug === 'push-golf-buggies')?.rawCategory;

export function lineKind(line: KindLine): LineKind {
  const p = line.slug ? PRODUCTS.find((x) => x.slug === line.slug) : undefined;
  if (!p) return 'custom';
  if (isAccessoryItem(p.category, p.id, p.name)) return 'parts';
  if (p.category === WALK_BEHIND) return 'walk-behind';
  if (p.category === PUSH) return 'push';
  if (p.fuel_type.startsWith('Mechanical')) return 'petrol-vehicle';
  return 'electric-vehicle';
}

export interface OrderMix {
  kinds: Set<LineKind>;
  /** Contains a rideable vehicle (electric or petrol). */
  hasVehicle: boolean;
  hasElectric: boolean;
  hasPetrol: boolean;
  /** Contains something that is not a rideable vehicle. */
  hasOther: boolean;
  /** Product lines only (discounts, freight and other custom lines ignored). */
  products: KindLine[];
}

export function orderMix(lines: KindLine[]): OrderMix {
  const products = lines.filter((l) => l.slug && PRODUCTS.some((p) => p.slug === l.slug));
  const kinds = new Set(products.map(lineKind));
  const hasElectric = kinds.has('electric-vehicle');
  const hasPetrol = kinds.has('petrol-vehicle');
  const hasOther = kinds.has('walk-behind') || kinds.has('push') || kinds.has('parts');
  return { kinds, hasVehicle: hasElectric || hasPetrol, hasElectric, hasPetrol, hasOther, products };
}

/** "the Evolution D-MAX GT4 Off-Road" for one product, otherwise a plain noun that fits the mix. */
export function subjectOf(lines: KindLine[]): string {
  const m = orderMix(lines);
  if (m.products.length === 1) return `the ${m.products[0].name}`;
  if (m.hasVehicle && !m.hasOther) return m.products.length === 2 && m.kinds.size === 1 ? 'your two vehicles' : 'your vehicles';
  if (m.hasVehicle) return 'your vehicle and your parts and accessories';
  if (m.kinds.size === 1 && m.kinds.has('parts')) return 'your parts and accessories';
  return 'your items';
}

/** The vehicles only: the preparation claim applies to these and never to parts in the same order. */
function vehicleSubject(lines: KindLine[]): { text: string; plural: boolean } {
  const vehicles = orderMix(lines).products.filter((p) => ['electric-vehicle', 'petrol-vehicle'].includes(lineKind(p)));
  if (vehicles.length === 1) return { text: `the ${vehicles[0].name}`, plural: false };
  return { text: vehicles.length === 2 ? 'your two vehicles' : 'your vehicles', plural: true };
}

/** The preparation claim we can make for this mix, or '' when we can make none. */
function preparationClause(m: OrderMix): string {
  if (!m.hasVehicle) return '';
  if (m.hasElectric && m.hasPetrol) return 'inspected and road tested, and charge-cycled where electric';
  return m.hasElectric ? 'inspected, charge-cycled and road tested' : 'inspected and road tested';
}

/** Steps the client follows after paying (invoice) or accepting (quote). {ref} is replaced on the server. */
export function afterPaymentFor(lines: KindLine[]): string {
  const m = orderMix(lines);
  const subject = subjectOf(lines);
  const prep = preparationClause(m);
  let step3: string;
  if (m.hasVehicle) {
    const v = vehicleSubject(lines);
    step3 = `We quote enclosed freight to your delivery postcode and book dispatch from our Yatala QLD depot once ${v.text} ${v.plural ? 'have' : 'has'} been ${prep}.`;
    if (m.hasOther) step3 += ' Your parts and accessories are packed and dispatched from the same depot.';
  } else if (m.products.length > 0) {
    step3 = `We quote freight to your delivery postcode, then pack and dispatch ${subject} from our Yatala QLD depot.`;
  } else {
    step3 = 'We confirm freight to your delivery postcode and dispatch your order from our Yatala QLD depot.';
  }
  return [
    `Send your payment receipt or a screenshot to us on WhatsApp ${CONTACT.phoneDisplay}, quoting reference {ref}.`,
    'We match the payment and confirm your order in writing.',
    step3,
  ].join('\n');
}

/** The opening note drafted for a request or an order. Says only what is true for what they are buying. */
export function introFor(opts: { first: string; lines: KindLine[]; source: 'order' | 'request'; asked: 'quote' | 'invoice'; postcode?: string }): string {
  const m = orderMix(opts.lines);
  const noun = opts.asked === 'invoice' ? 'tax invoice' : 'quote';
  const subject = subjectOf(opts.lines);
  const vehicleCount = m.products.filter((p) => ['electric-vehicle', 'petrol-vehicle'].includes(lineKind(p))).length;
  const hi = `Hi ${opts.first || 'there'},`;
  const body =
    opts.source === 'order'
      ? `Thank you for your order. Your tax invoice is below, with payment details and the steps that follow.${m.hasVehicle ? ` ${vehicleCount > 1 ? 'Your vehicles stay' : 'Your vehicle stays'} reserved at our Yatala QLD depot while you settle.` : ''}`
      : `Thanks for your ${opts.asked === 'invoice' ? 'invoice' : 'quote'} request${m.products.length > 0 ? ` for ${subject}` : ''}. Your ${noun} is below, with payment details and the steps that follow.`;
  const freight = opts.postcode ? `Freight to postcode ${opts.postcode} is confirmed ${opts.source === 'order' ? 'once your payment is received' : 'against your delivery address once you accept'}.` : '';
  return [hi, body, freight].filter(Boolean).join('\n\n');
}

/** Short status phrase for invoice and confirmation emails. */
export function reservationPhrase(lines: KindLine[]): { badge: string; sentence: string; invoiceLine: string } {
  const m = orderMix(lines);
  if (m.hasVehicle) {
    return { badge: 'Order Logged — Allocation Reserved', sentence: 'is reserved at our Yatala QLD depot', invoiceLine: 'your vehicle is reserved at Yatala. Settle using the details below and we book dispatch.' };
  }
  return { badge: 'Order Logged', sentence: 'is logged at our Yatala QLD depot', invoiceLine: 'your order is logged at Yatala. Settle using the details below and we book dispatch.' };
}
