import type { ProductItem } from '@/src/config/site';
import { getProductDetails } from '@/src/config/product-details';
import { buildTitle, buildDescription, TITLE_MAX } from '@/lib/seo';

// Title and description for a product page, shared by the templated route and
// the bespoke Atlas route so the two cannot drift. The title says what the
// page is for ("... for Sale"); the description leads with the page's declared
// primary keyword (from the cleaned keyword bank) where there is one.

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function productMeta(product: ProductItem): { title: string; description: string } {
  const withSale = buildTitle(`${product.name} for Sale`);
  const title = withSale.length <= TITLE_MAX ? withSale : buildTitle(product.name);

  const { primaryKeyword } = getProductDetails(product.slug);
  const lead = primaryKeyword
    ? `${cap(primaryKeyword)}: ${product.name}, ${product.price_display} inc GST.`
    : `${product.name}, ${product.price_display} inc GST.`;
  const description = buildDescription(lead, product.key_specs, [
    'Tested at our Yatala QLD depot.',
    'Enclosed freight Australia-wide.',
    'Finance in 4 available.',
  ]);
  return { title, description };
}

/** The sentence that opens the page body, so the primary keyword sits in the first 100 words. */
export function productLead(product: ProductItem): string {
  const { primaryKeyword } = getProductDetails(product.slug);
  const tail = `${product.price_display} inc GST, in stock at our Yatala QLD depot and shipped Australia-wide.`;
  return primaryKeyword ? `${cap(primaryKeyword)}: the ${product.name} is ${tail}` : `The ${product.name} is ${tail}`;
}
