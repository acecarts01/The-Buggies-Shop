import type { Metadata } from 'next';
import { SITE } from '@/src/config/site';

// The page below is a client component and cannot export metadata itself, so
// it lives here. This static route also needs its own canonical, otherwise it
// inherits the /shop/ layout's.
export const metadata: Metadata = {
  // Kept in the same band as the templated product pages (title <= 60,
  // description 120-158) - see lib/seo.ts. This page has its own layout, so
  // it does not inherit that builder.
  title: 'Atlas 4-Passenger Lifted Lithium Buggy | Buggies Express',
  description:
    'Atlas 4-Passenger Lifted Lithium Buggy, $20,900 AUD inc GST. 48V lithium, 3-inch factory lift, custom leather seats. Enclosed freight Australia-wide.',
  alternates: {
    canonical: `https://${SITE.domain}/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/`,
  },
};

export default function AtlasProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
