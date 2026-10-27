// Brand hub copy that is derived from the live catalogue, so it can never drift from
// prices or specs, and the rule that decides whether a brand page is indexable.
import { PRODUCTS, BRAND_PAGES, isBuggyItem, type ProductItem } from '@/src/config/site';

export const BRAND_MIN_PRODUCTS = 3;

type Brand = (typeof BRAND_PAGES)[number];

export const brandRange = (b: Brand): ProductItem[] => PRODUCTS.filter((p) => p.name.toLowerCase().includes(b.match.toLowerCase()));

/** A brand with fewer than BRAND_MIN_PRODUCTS products is thin: noindex and out of the sitemap until it qualifies. */
export const brandIndexable = (b: Brand) => brandRange(b).length >= BRAND_MIN_PRODUCTS;

const specs = (p: ProductItem) => p.key_specs.split(',').slice(0, 3).map((s) => s.trim()).join(', ');

/** One factual paragraph about the current range: entry model, top model, and what else is stocked. */
export function brandRangeParagraph(b: Brand): string {
  const all = brandRange(b);
  const vehicles = all.filter((p) => isBuggyItem(p.category, p.id, p.name));
  const models = (vehicles.length ? vehicles : all).slice().sort((x, y) => x.price_aud - y.price_aud);
  if (!models.length) return '';
  const lo = models[0];
  const hi = models[models.length - 1];
  const extras = all.length - vehicles.length;
  const parts: string[] = [];
  parts.push(`Right now we list ${all.length} ${b.name} ${all.length === 1 ? 'product' : 'products'}, all priced in AUD with GST included.`);
  if (models.length === 1) parts.push(`The ${lo.name} is ${lo.price_display}, with ${specs(lo)}.`);
  else parts.push(`The ${lo.name} is the entry point at ${lo.price_display}, with ${specs(lo)}. The ${hi.name} tops the range at ${hi.price_display}, with ${specs(hi)}.`);
  if (extras > 0 && vehicles.length > 0) parts.push(`${extras} of the ${all.length} ${extras === 1 ? 'is a part or accessory' : 'are parts or accessories'}, so you can complete the set in one order.`);
  parts.push('Tell us how you will use it and we will confirm the right model, the freight to your postcode and the stock position from our Yatala QLD depot before you pay.');
  return parts.join(' ');
}
