import type { Metadata } from 'next';
import { SITE, PRODUCTS } from '@/src/config/site';

// The page below is a client component and cannot export metadata itself,
// so it lives here. Without it the route inherits the root layout's title,
// description and canonical, which points every page at the homepage.
export const metadata: Metadata = {
  title: `Shop Golf Buggies Australia | All ${PRODUCTS.length} Models`,
  description: `Browse all ${PRODUCTS.length} models: luxury 4-seaters, 2-seaters, lifted 4x4, commercial utility, petrol and walk-behind buggies, plus batteries and parts.`,
  alternates: {
    canonical: `https://${SITE.domain}/shop/`,
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
