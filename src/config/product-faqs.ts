// SERVER-ONLY (imported by product-details.ts). Never import from a client component.
//
// Product FAQs are built from each product's own data instead of being stored
// per product, so they cannot drift from the catalogue. Every product gets the
// same six questions, and every one is a buying question:
//
//   Transactional (T): price, where to buy and delivery, how to pay
//   Commercial (C):    versus the nearest alternative, versus a second option,
//                      and how the price sits in its own range
//
// Informational questions (specifications, fitting, who it suits, registration)
// are answered in the page body, the guides and the specification panel, not
// here. Delivery, payment and warranty detail also appear once per page in a
// shared block (ProductExtras), so answers here stay short and specific.
//
// A product can still carry hand-written `faqs` in PRODUCT_DETAILS to override.
import { PRODUCTS, SHOP, isBuggyItem, isAccessoryItem, type ProductItem } from './site';

export interface Faq {
  q: string;
  a: string;
}

const aud = (n: number) => `$${n.toLocaleString('en-AU', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const TRIAL_MIN = 15000; // brand rule: complimentary on-farm trial demonstration at or above this price

const specList = (p: ProductItem, n = 99) =>
  p.key_specs
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, n);

const joinList = (xs: string[]) => (xs.length <= 1 ? xs[0] ?? '' : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** Other products in the same category, nearest price first, ties broken by catalogue order. */
function peers(p: ProductItem): ProductItem[] {
  return PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).sort(
    (a, b) => Math.abs(a.price_aud - p.price_aud) - Math.abs(b.price_aud - p.price_aud)
  );
}

/** The range this product competes in, in the words a buyer uses. */
function rangeLabel(p: ProductItem): string {
  return p.category.toLowerCase().replace(' & ', ' and ');
}

function priceFaq(p: ProductItem): Faq {
  const range = PRODUCTS.filter((x) => x.category === p.category);
  const prices = range.map((x) => x.price_aud);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return {
    q: `How much does the ${p.name} cost in Australia?`,
    a: `The ${p.name} is ${aud(p.price_aud)} AUD including GST, with freight quoted against your delivery postcode at checkout. Our ${rangeLabel(p)} range runs from ${aud(lo)} to ${aud(hi)}.`,
  };
}

function buyFaq(p: ProductItem): Faq {
  const trial =
    p.price_aud >= TRIAL_MIN && !isAccessoryItem(p.category, p.id, p.name)
      ? ` At ${aud(p.price_aud)} it also qualifies for a complimentary on-farm trial demonstration.`
      : '';
  return {
    q: `Where can I buy the ${p.name} in Australia, and how is it delivered?`,
    a: `Buy the ${p.name} direct from Golf Buggies Express PTY LTD. Add it to your cart or request a quote on this page. It is listed as in stock at our Yatala QLD depot and ships to every state and territory, with freight quoted to your postcode.${trial}`,
  };
}

function payFaq(p: ProductItem): Faq {
  const accessory = isAccessoryItem(p.category, p.id, p.name);
  const quarter = Math.round((p.price_aud / 4) * 100) / 100;
  const crypto = p.price_aud * (1 - SHOP.cryptoDiscount / 100);
  const extra = accessory
    ? `Bought alongside any buggy, it earns the ${SHOP.accessoryBundleDiscount}% accessory discount; the ${SHOP.cryptoDiscount}% Bitcoin and USDT discount applies to the vehicle price only.`
    : `Paying in Bitcoin or USDT takes ${SHOP.cryptoDiscount}% off the vehicle price, which brings the ${p.name} to ${aud(crypto)}.`;
  return {
    q: `Can I pay for the ${p.name} with Finance in 4, PayID or Bitcoin?`,
    a: `Yes. Finance in 4 splits it into four interest-free payments of ${aud(quarter)}, and PayID / Osko, direct bank transfer and Bitcoin or USDT are also accepted. ${extra} After any payment, send us the receipt or a screenshot on WhatsApp so we can confirm your order.`,
  };
}

function compareFaq(p: ProductItem, s: ProductItem | undefined): Faq | undefined {
  if (!s) return undefined;
  const diff = Math.abs(p.price_aud - s.price_aud);
  const dir = p.price_aud >= s.price_aud ? 'more' : 'less';
  return {
    q: `${p.name} or ${s.name}: which should I buy?`,
    a: `The ${p.name} is ${aud(p.price_aud)} and the ${s.name} is ${aud(s.price_aud)}, so the ${p.name} costs ${aud(diff)} ${dir}. Choose the ${p.name} for ${joinList(specList(p, 2))}; choose the ${s.name} for ${joinList(specList(s, 2))}.`,
  };
}

function betterFaq(p: ProductItem, alt: ProductItem | undefined): Faq | undefined {
  if (!alt) return undefined;
  if (p.price_aud === alt.price_aud) {
    return {
      q: `Is the ${p.name} better value than the ${alt.name}?`,
      a: `Both are ${aud(p.price_aud)}, so price will not decide it. The ${p.name} lists ${joinList(specList(p, 2))}; the ${alt.name} lists ${joinList(specList(alt, 2))}. Pick the one whose features match how you play or what you carry.`,
    };
  }
  const cheaper = p.price_aud <= alt.price_aud ? p : alt;
  const dearer = cheaper === p ? alt : p;
  return {
    q: `Is the ${p.name} better value than the ${alt.name}?`,
    a: `On price alone the ${cheaper.name} (${aud(cheaper.price_aud)}) is ${aud(dearer.price_aud - cheaper.price_aud)} below the ${dearer.name} (${aud(dearer.price_aud)}). The ${p.name} lists ${joinList(specList(p, 2))}; the ${alt.name} lists ${joinList(specList(alt, 2))}. Pick the one whose features match how you play or what you carry.`,
  };
}

function rankFaq(p: ProductItem): Faq {
  const range = PRODUCTS.filter((x) => x.category === p.category).sort((a, b) => a.price_aud - b.price_aud);
  const rank = range.findIndex((x) => x.id === p.id) + 1;
  const n = range.length;
  const where = rank === 1 ? 'the lowest-priced' : rank === n ? 'the highest-priced' : `number ${rank} by price`;
  return {
    q: `Is the ${p.name} good value compared with other ${rangeLabel(p)}?`,
    a: `At ${aud(p.price_aud)} the ${p.name} is ${where} of the ${n} items in our ${rangeLabel(p)} range, which runs from ${aud(range[0].price_aud)} to ${aud(range[n - 1].price_aud)}, all including GST. Compare it side by side in this range before you decide.`,
  };
}

export function buildFaqs(p: ProductItem): Faq[] {
  const list = peers(p);
  const first = list[0];
  // The second comparison prefers a different product of the same kind; for a
  // vehicle with only one peer it falls back to the nearest-priced buggy elsewhere.
  const second =
    list[1] ??
    PRODUCTS.filter((x) => x.id !== p.id && x.id !== first?.id && isBuggyItem(x.category, x.id, x.name) === isBuggyItem(p.category, p.id, p.name)).sort(
      (a, b) => Math.abs(a.price_aud - p.price_aud) - Math.abs(b.price_aud - p.price_aud)
    )[0];
  return [priceFaq(p), buyFaq(p), payFaq(p), compareFaq(p, first), betterFaq(p, second), rankFaq(p)].filter((f): f is Faq => Boolean(f));
}
