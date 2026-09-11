import type { Metadata } from 'next';
import { PRODUCTS } from '@/src/config/site';
import { pageMetadata } from '@/lib/seo';

// The page below is a client component and cannot export metadata itself,
// so it lives here (see pageMetadata for why every field is set explicitly).
export const metadata: Metadata = pageMetadata({
  title: 'Search the Golf Buggy Fleet | The Buggies Express',
  description: `Search all ${PRODUCTS.length} golf buggy models, batteries, chargers and parts stocked at the Yatala QLD depot.`,
  path: '/search/',
  // Internal search result pages are kept out of the index (Google advises
  // against indexing site-search results); links on them are still followed.
  robots: { index: false, follow: true },
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
