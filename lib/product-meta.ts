import type { ProductItem } from '@/src/config/site';
import { getProductDetails } from '@/src/config/product-details';
import { isPayIn4Eligible } from '@/lib/pay-in-4';
import { buildTitle, buildDescription, TITLE_MAX } from '@/lib/seo';

// Title and description for a product page, shared by the templated route and
// the bespoke Atlas route so the two cannot drift. The title says what the
// page is for ("... for Sale"); the description leads with the page's declared
// primary keyword (from the cleaned keyword bank) where there is one.

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function productMeta(product: ProductItem): { title: string; description: string } {
  const withSale = buildTitle(`${product.name} for Sale`);
  const title = withSale.length <= TITLE_MAX ? withSale : buildTitle(product.name);

  // Reads as a sentence a buyer would want to click: product, price, what it
  // is, where it ships from. The keyword lives in the title, H1 and body, not as
  // a "keyword: " prefix. Finance in 4 is only mentioned where it applies.
  const lead = `${product.name}, ${product.price_display} inc GST.`;
  const description = buildDescription(lead, product.key_specs, [
    'In stock at our Yatala QLD depot.',
    'Enclosed freight Australia-wide.',
    ...(isPayIn4Eligible(product.price_aud) ? ['Pay in 4 available.'] : []),
  ]);
  return { title, description };
}

/** The sentence that opens the page body, so the primary keyword sits in the first 100 words. */
export function productLead(product: ProductItem): string {
  const { primaryKeyword } = getProductDetails(product.slug);
  const tail = `${product.price_display} inc GST, in stock at our Yatala QLD depot and shipped Australia-wide.`;
  return primaryKeyword ? `${cap(primaryKeyword)}: the ${product.name} is ${tail}` : `The ${product.name} is ${tail}`;
}
