import type { Metadata } from 'next';
import { PRODUCTS } from '@/src/config/site';
import { pageMetadata } from '@/lib/seo';

// The page below is a client component and cannot export metadata itself,
// so it lives here (see pageMetadata for why every field is set explicitly).
export const metadata: Metadata = pageMetadata({
  title: `Shop Golf Buggies Australia | All ${PRODUCTS.length} Models`,
  description: `Browse all ${PRODUCTS.length} models: luxury 4-seaters, 2-seaters, lifted 4x4, commercial utility, petrol and walk-behind buggies, plus batteries and parts.`,
  path: '/shop/',
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
