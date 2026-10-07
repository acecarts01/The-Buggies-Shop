import { getProductDetails } from '@/src/config/product-details';
import { resolveCategory } from '@/src/config/category-content';
import AtlasProductClient from './AtlasProductClient';
import { resolveReferences } from '@/src/config/references';

// Server shell: joins the Atlas FAQs from product-details.ts and hands them
// to the client page. Metadata and JSON-LD for this route live in layout.tsx.
export default function AtlasProductPage() {
  const details = getProductDetails('atlas-4-passenger-lifted-lithium-buggy');
  return (
    <AtlasProductClient
      faqs={details.faqs ?? []}
      tags={details.tags}
      references={resolveReferences(['nsw-golf-buggy', 'qld-golf-buggy', 'vic-noncompliant', 'sa-restricted'])}
      guides={(resolveCategory('luxury-4-seater')?.guides ?? []).slice(0, 4)}
    />
  );
}
