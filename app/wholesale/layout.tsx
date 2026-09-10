import type { Metadata } from 'next';
import { SITE } from '@/src/config/site';

// The page below is a client component and cannot export metadata itself,
// so it lives here. Without it the route inherits the root layout's title,
// description and canonical, which points every page at the homepage.
export const metadata: Metadata = {
  title: 'Wholesale & Fleet Golf Buggies | The Buggies Express',
  description: 'Fleet procurement and wholesale golf buggy supply for Australian clubs, resorts and commercial operators. Request a fleet quote from Yatala QLD.',
  alternates: {
    canonical: `https://${SITE.domain}/wholesale/`,
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
