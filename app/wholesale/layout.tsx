import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

// The page below is a client component and cannot export metadata itself,
// so it lives here (see pageMetadata for why every field is set explicitly).
export const metadata: Metadata = pageMetadata({
  title: 'Wholesale & Fleet Golf Buggies | The Buggies Express',
  description: 'Fleet procurement and wholesale golf buggy supply for Australian clubs, resorts and commercial operators. Request a fleet quote from Yatala QLD.',
  path: '/wholesale/',
});

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
