// Drafts the sales desk's reply to an enquiry from the client's own words and
// the catalogue, so the owner reads, edits and sends instead of writing.
//
// This is rule-based on purpose: no model call, no network, nothing that can
// change between preview and send. Every figure and policy in a draft comes from
// src/config/site.ts (price, stock, SHOP, CRYPTO, CONTACT) so the draft cannot
// say something the site does not. Where a fact is not in the config (an exact
// freight figure, a trade-in value, a delivery date) the draft says it will be
// confirmed and lists the gap in `notes` for the owner, rather than inventing it.
import { PRODUCTS, SHOP, CONTACT, CRYPTO, isAccessoryItem, type ProductItem } from '@/src/config/site';
import { productUrl, ORIGIN } from './schema';
import { aud } from './orders-shared';
import { type EnquiryContext } from './enquiry-context';

export type Intent =
  | 'price' | 'stock' | 'delivery' | 'payment' | 'finance' | 'crypto' | 'tradein' | 'fleet'
  | 'registration' | 'warranty' | 'range' | 'trial' | 'parts' | 'spec' | 'custom' | 'invoice';

export interface ReplyDraft {
  subject: string;
  message: string;
  /** The product the draft is built around, if one was recognised. */
  productSlug?: string;
  /** Other models worth offering, nearest in price first. */
  alternatives: { slug: string; name: string; price: number }[];
  quotedPrice?: number;
  intents: Intent[];
  /** For the owner only: what to check or add before sending. Never sent to the client. */
  notes: string[];
}

const TRIAL_MIN = 15000; // brand rule: complimentary on-farm trial demonstration at or above this price

// ---------------------------------------------------------------- product matching
const GENERIC = new Set(['golf', 'buggy', 'buggies', 'cart', 'carts', 'electric', 'lithium', 'petrol', 'the', 'and', 'for', 'with', 'seater', 'passenger', 'model', 'edition', 'pro']);
const norm = (s: string) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9+]+/g, ' ').trim();

function scoreProduct(p: ProductItem, text: string): number {
  const name = norm(p.name);
  if (text.includes(name)) return 100 + name.length;
  const tokens = name.split(' ').filter((t) => t.length >= 2 && !GENERIC.has(t));
  if (tokens.length === 0) return 0;
  const hits = tokens.filter((t) => new RegExp(`(^| )${t.replace(/[+]/g, '\\+')}( |$)`).test(text)).length;
  if (hits < Math.min(2, tokens.length)) return 0;
  return (hits / tokens.length) * 50 + hits;
}

export function findProduct(text: string, preferred?: string): ProductItem | undefined {
  const pool = [norm(preferred ?? ''), norm(text)].filter(Boolean);
  for (const t of pool) {
    let best: { p: ProductItem; s: number } | undefined;
    for (const p of PRODUCTS) {
      const s = scoreProduct(p, t);
      if (s > 0 && (!best || s > best.s)) best = { p, s };
    }
    if (best && best.s >= 30) return best.p;
  }
  return undefined;
}

// ---------------------------------------------------------------- intents
const RULES: [Intent, RegExp][] = [
  ['price', /\b(price|prices|pricing|cost|how much|quote|rrp|cheap|cheapest|afford|budget|\$\d)/],
  ['stock', /\b(in stock|available|availability|stock|lead time|how soon|how long|when can|ready to)\b/],
  ['delivery', /\b(deliver|delivery|freight|ship|shipping|postage|transport|send to|arrive|arrival)\b/],
  ['payment', /\b(pay|payment|payid|osko|bank transfer|eft|deposit|card|invoice|tax invoice)\b/],
  ['finance', /\b(finance|instal?lments?|pay in 4|payment plan|interest free|afterpay)\b/],
  ['crypto', /\b(crypto|bitcoin|btc|usdt|tether|ethereum|eth|solana|sol|litecoin|ltc|doge|dogecoin|xrp|bnb)\b/],
  ['tradein', /\b(trade.?in|sell my|my old|valuation|what is it worth|swap)\b/],
  ['fleet', /\b(fleet|wholesale|bulk|multiple|several|resort|golf clubs?|council|school|tender|commercial|\d+ (buggies|units|carts))\b/],
  ['registration', /\b(regist|rego|road legal|street legal|public road|licen[cs]e|ctp|insur)/],
  ['warranty', /\b(warrant|guarantee|repair|servic|support|after.?sales)/],
  ['range', /\b(range|battery|batteries|charge|charging|km|hill|hills|slope|steep)\b/],
  ['trial', /\b(test drive|trial|demo|demonstrat|try before|see it|inspect|visit|showroom|come (in|to|out))\b/],
  ['parts', /\b(accessor|spare|parts?|canopy|cover|wheels?|tyres?|charger|upgrade|replacement)\b/],
  ['spec', /\b(spec|specs|seats?|seater|passengers?|payload|tow|towing|capacity|speed|weight|dimension|size|fit|boot|torque)\b/],
  ['custom', /\b(custom|colou?r|build|modif|lifted|lift kit|lights?)\b/],
  ['invoice', /\b(abn|gst|business|company|tax)\b/],
];

export function detectIntents(ctx: EnquiryContext): Intent[] {
  const text = norm(`${ctx.subject ?? ''} ${ctx.message} ${ctx.model ?? ''} ${ctx.deliveryPreference ?? ''}`);
  const found = new Set<Intent>();
  for (const [i, re] of RULES) if (re.test(text)) found.add(i);
  if (ctx.kind === 'tradein') found.add('tradein');
  if (ctx.kind === 'wholesale') found.add('fleet');
  if (ctx.kind === 'quote') found.add('price');
  if (ctx.deliveryPreference) found.add('delivery');
  if (ctx.paymentPreference === 'crypto') found.add('crypto');
  if (ctx.paymentPreference === 'finance4') found.add('finance');
  if (ctx.paymentPreference === 'standard') found.add('payment');
  return [...found];
}

// ---------------------------------------------------------------- wording
const firstName = (name: string) => name.trim().split(/\s+/)[0] || 'there';
const specs = (p: ProductItem, n = 3) =>
  p.key_specs
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, n);
const list = (xs: string[]) => (xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

const GUIDES = {
  registration: { title: 'our registration guide', path: '/blog/golf-buggy-registration-australia-conditional-road-access/' },
  tradein: { title: 'our trade-in guide', path: '/blog/trading-in-old-golf-cart-australia/' },
  fleet: { title: 'our fleet guide', path: '/blog/golf-buggy-fleet-purchase-guide-australia/' },
  warranty: { title: 'our warranty guide', path: '/blog/golf-buggy-warranty-australia-explained/' },
  ordering: { title: 'how ordering and delivery work', path: '/blog/how-golf-buggy-ordering-invoicing-delivery-works/' },
  crypto: { title: 'how paying in crypto works', path: '/crypto-payment/' },
} as const;
const link = (g: keyof typeof GUIDES) => `${GUIDES[g].title}: ${ORIGIN}${GUIDES[g].path}`;

function alternativesFor(p: ProductItem): ProductItem[] {
  return PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id && x.inStock !== false)
    .sort((a, b) => Math.abs(a.price_aud - p.price_aud) - Math.abs(b.price_aud - p.price_aud))
    .slice(0, 2);
}

export function draftReply(ctx: EnquiryContext): ReplyDraft {
  const text = `${ctx.subject ?? ''} ${ctx.message} ${ctx.model ?? ''}`;
  const product = findProduct(text, ctx.model);
  const intents = detectIntents(ctx);
  const has = (i: Intent) => intents.includes(i);
  const accessory = product ? isAccessoryItem(product.category, product.id, product.name) : false;
  const notes: string[] = [];
  const paras: string[] = [];

  if (!ctx.email) notes.push('This client left no email address, so this reply cannot be emailed. Call or WhatsApp them instead.');
  if (!ctx.message.trim()) notes.push('The client wrote no message, only the form fields. The draft answers the details they did give.');

  // --- opening
  const topic = product ? `the ${product.name}` : ctx.model ? `the ${ctx.model}` : ctx.kind === 'tradein' ? 'a trade-in' : ctx.kind === 'wholesale' ? 'a fleet purchase' : 'golf buggies';
  paras.push(`Hi ${firstName(ctx.name)},`);
  paras.push(
    intents.length
      ? `Thanks for getting in touch with The Buggies Express about ${topic}. Here are the answers to your questions.`
      : `Thanks for getting in touch with The Buggies Express about ${topic}. We would be glad to help you find the right one.`
  );

  // --- the product
  let quotedPrice: number | undefined;
  if (product) {
    quotedPrice = product.price_aud;
    const s = specs(product);
    const stock = product.inStock === false ? 'It is currently made to order, and we will confirm the lead time with your quote.' : 'It is in stock at our Yatala QLD depot.';
    paras.push(
      `The ${product.name} is ${aud(product.price_aud)} including 10% GST. ${stock}${s.length ? ` Key features: ${list(s)}.` : ''} You can see photos and full details here: ${productUrl(product)}`
    );
  } else if (ctx.kind !== 'tradein') {
    notes.push('No product in the catalogue matched what the client wrote. The draft asks which model they mean; add a recommendation if you can.');
    paras.push('I could not tell which model you have in mind, so it would help to know how you plan to use the buggy, how many people it needs to carry, and what the ground is like. That lets me point you to the right one.');
  }

  // --- what they asked, in a fixed, sensible order
  if (has('price') && product) {
    if (accessory) {
      paras.push(`Accessories ordered with any buggy take ${SHOP.accessoryBundleDiscount}% off. All prices include GST, and freight is quoted separately against your delivery postcode.`);
    } else {
      paras.push(
        `All prices include GST and there is no minimum order. Paying in crypto takes ${SHOP.cryptoDiscount}% off the vehicle price, which brings it to ${aud(Math.round(product.price_aud * (1 - SHOP.cryptoDiscount / 100)))}. Freight is quoted separately against your delivery postcode.`
      );
    }
  }

  if (has('delivery') || ctx.postcode) {
    const where = ctx.postcode ? `postcode ${ctx.postcode}${ctx.state ? ` (${ctx.state})` : ''}` : 'your postcode';
    paras.push(
      `We deliver Australia-wide direct from our Yatala QLD depot, assembled and tested, by enclosed freight. Freight is always quoted against the delivery postcode, so I will confirm the exact figure for ${where}${ctx.postcode ? '' : ' once you send it through'}. For more on each step, see ${link('ordering')}`
    );
    if (ctx.postcode) notes.push(`No freight figure is in the draft. Add the freight to ${ctx.postcode} if you have it; otherwise the client is told you will confirm it.`);
  }

  if (has('stock') && product && !has('price')) {
    paras.push(product.inStock === false ? 'We will confirm the lead time with your quote.' : 'It is in stock now, so it can be invoiced and freighted as soon as payment is confirmed.');
  }

  if (has('range') || has('spec')) {
    if (product) {
      const s = specs(product, 6);
      paras.push(`On the details you asked about, the ${product.name} lists: ${list(s)}. If there is one specific figure you need, such as range on a full charge, tell me and I will confirm it from the maker's specification before you order.`);
      notes.push('The client asked a technical question. The draft quotes the listed key specs only; add any specific figure they asked for.');
    }
  }

  if (has('trial') && !has('tradein')) {
    if (product && !accessory && product.price_aud >= TRIAL_MIN) {
      paras.push(`At ${aud(product.price_aud)} the ${product.name} qualifies for a complimentary on-farm trial demonstration, so you can see it do your job before you commit. We do not host depot visits, so the demonstration comes to you.`);
    } else {
      paras.push('We do not host depot visits, but we can send detailed photos and video of any buggy, and vehicles from $15,000 qualify for a complimentary on-farm trial demonstration.');
    }
  } else if (product && !accessory && product.price_aud >= TRIAL_MIN && (has('price') || ctx.kind === 'quote')) {
    paras.push(`At this price the ${product.name} also qualifies for a complimentary on-farm trial demonstration.`);
  }

  if (has('finance')) {
    const f = SHOP.financeIn4;
    paras.push(`Finance in 4 splits your order into ${f.installments} equal interest-free payments (${f.interestRate} interest), fortnightly or monthly. It covers buggies, parts and accessories.${product ? ` For the ${product.name}, that is four payments of ${aud(Math.round((product.price_aud / 4) * 100) / 100)} before freight.` : ''}`);
  }

  if (has('crypto')) {
    paras.push(
      `You can pay in crypto on our website: Bitcoin, USDT, Ethereum, BNB, Solana, Tron, XRP, Litecoin, Dogecoin or Bitcoin Cash, each with its own address and QR code, and ${CRYPTO.discountPercent}% comes off the vehicle price. If you would prefer a different coin, tell me and I will arrange it. Once you have paid, send the receipt or a screenshot on WhatsApp and we confirm your order. For more, see ${link('crypto')}`
    );
  }

  if (has('payment') && !has('finance') && !has('crypto')) {
    paras.push('We accept PayID / Osko and direct bank transfer, Finance in 4, and crypto with a 10% discount on the vehicle price. Once your order is confirmed we issue an official tax invoice with the payment details, and after paying you send the receipt on WhatsApp.');
  }

  if (has('invoice')) {
    paras.push('We invoice as Golf Buggies Express Pty Ltd (ABN 28 668 598 758) and every invoice is an official Australian tax invoice showing the GST. You can verify our ABN on the Australian Business Register.');
  }

  if (has('registration')) {
    paras.push(`Whether a buggy can be driven on a public road depends on your state, and on the conditions of any conditional registration. I cannot give legal advice, so please check with your state's transport authority. For the official pages for each state, see ${link('registration')}. Insurance is a question for your insurer, and it helps to tell them exactly what you are buying.`);
    notes.push('Registration or insurance was mentioned. The draft points to the official state pages and does not give legal or insurance advice.');
  }

  if (has('warranty')) {
    paras.push(`Every product carries an Australian factory warranty supported from our Yatala QLD depot, and because we hold parts in Australia, claims are handled locally. For how it works alongside your consumer guarantees, see ${link('warranty')}`);
  }

  if (has('parts') && !accessory) {
    paras.push('We stock batteries, chargers and accessories for the buggies we sell. If you let me know your model and year, I can match the right part and quote it with freight. Accessories bought alongside a buggy take 5% off.');
  }

  if (has('custom')) {
    paras.push('We can talk through colour and fitment options for the model you choose. Tell me exactly what you would like and I will confirm what is available and the price before you order.');
    notes.push('The client asked about custom options. Confirm what is actually available before sending.');
  }

  if (has('tradein')) {
    paras.push(
      `For a trade-in, please send photos, the make, model and year, the battery type and its age, and a short description of the condition. I will come back with an assessment. For what affects value, see ${link('tradein')}`
    );
    notes.push('A trade-in was mentioned. No value is offered in the draft; add one only after you have seen the photos.');
  }

  if (has('fleet')) {
    const bits = [ctx.organization, ctx.fleetType, ctx.quantity && `${ctx.quantity} units`].filter(Boolean).join(', ');
    const msg = norm(ctx.message);
    const need: string[] = [];
    if (!ctx.quantity && !/[0-9]/.test(msg)) need.push('how many buggies you need');
    if (!msg.includes('seat')) need.push('the seating and cargo you require');
    if (!ctx.postcode) need.push('where they will be delivered');
    if (!/(^| )(by|before|asap|urgent|january|february|march|april|may|june|july|august|september|october|november|december)( |$)/.test(msg)) need.push('when you need them');
    paras.push(
      `For your fleet purchase${bits ? ` (${bits})` : ''}, I will put together a written quote.${need.length ? ` To do that, it helps to know ${list(need)}.` : ' I have the details you sent and will confirm the quote shortly.'} For what to compare, see ${link('fleet')}`
    );
    notes.push('A fleet or wholesale enquiry. No volume pricing is in the draft; add it if you offer it.');
  }

  // --- gaps we need the client to fill
  const asks: string[] = [];
  if (!ctx.postcode && !has('tradein') && !has('fleet')) asks.push('your delivery postcode (so I can quote freight)');
  if (!product && !has('tradein') && !has('fleet')) asks.push('the model you are interested in');
  if (asks.length) paras.push(`To give you an exact quote, could you send me ${list(asks)}?`);

  // --- alternatives
  const alts = product ? alternativesFor(product) : [];
  if (product && alts.length && (has('price') || ctx.kind === 'quote') && !accessory) {
    paras.push(`If you would like to compare, the ${alts.map((a) => `${a.name} (${aud(a.price_aud)})`).join(' and the ')} sit${alts.length === 1 ? 's' : ''} closest in the range.`);
  }

  // --- close
  paras.push(`If you would rather talk it through, call or WhatsApp us on ${CONTACT.phoneDisplay}. We are happy to help.`);
  paras.push('Kind regards,\nThe Buggies Express sales desk\nGolf Buggies Express Pty Ltd · Yatala QLD');

  const subjectTopic = product ? ` about the ${product.name}` : ctx.kind === 'tradein' ? ' about your trade-in' : '';
  return {
    subject:
      ctx.kind === 'quote'
        ? `Your quote ${ctx.ref}${quotedPrice ? ` for the ${product!.name}` : ''}`
        : ctx.kind === 'wholesale'
          ? 'Re: your fleet enquiry'
          : ctx.kind === 'tradein'
            ? 'Re: your trade-in enquiry'
            : `Re: your enquiry${subjectTopic}`,
    message: paras.join('\n\n'),
    productSlug: product?.slug,
    alternatives: alts.map((a) => ({ slug: a.slug, name: a.name, price: a.price_aud })),
    quotedPrice: product && !accessory ? quotedPrice : undefined,
    intents,
    notes,
  };
}
