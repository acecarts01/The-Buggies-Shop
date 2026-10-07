import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

// The page below is a client component and cannot export metadata itself,
// so it lives here (see pageMetadata for why every field is set explicitly).
export const metadata: Metadata = pageMetadata({
  title: 'Search the Site | The Buggies Express',
  description: 'Search golf buggy models, brands, delivery areas, buying guides and answers on The Buggies Express.',
  path: '/search/',
  // Internal search result pages are kept out of the index (Google advises
  // against indexing site-search results); links on them are still followed.
  robots: { index: false, follow: true },
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
