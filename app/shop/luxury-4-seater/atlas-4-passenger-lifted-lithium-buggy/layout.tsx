import type { Metadata } from 'next';
import { SITE } from '@/src/config/site';

// The page below is a client component and cannot export metadata itself, so
// it lives here. This static route also needs its own canonical, otherwise it
// inherits the /shop/ layout's.
export const metadata: Metadata = {
  title: 'Atlas 4-Passenger Lifted Lithium Buggy | $20,900 AUD | The Buggies Express',
  description:
    'Atlas 4-Passenger Lifted Lithium Buggy ($20,900 AUD). 48V lithium, 3-inch factory lift, custom leather seats, touchscreen display, 14-inch alloy wheels. Yatala QLD depot warranty with enclosed Australia-wide freight.',
  alternates: {
    canonical: `https://${SITE.domain}/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/`,
  },
};

export default function AtlasProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
