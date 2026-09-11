import { getProductDetails } from '@/src/config/product-details';
import AtlasProductClient from './AtlasProductClient';

// Server shell: joins the Atlas FAQs from product-details.ts and hands them
// to the client page. Metadata and JSON-LD for this route live in layout.tsx.
export default function AtlasProductPage() {
  const details = getProductDetails('atlas-4-passenger-lifted-lithium-buggy');
  return <AtlasProductClient faqs={details.faqs ?? []} />;
}
