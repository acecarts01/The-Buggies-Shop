import type { Metadata } from 'next';
import { SITE, PRODUCTS } from '@/src/config/site';

// The page below is a client component and cannot export metadata itself,
// so it lives here. Without it the route inherits the root layout's title,
// description and canonical, which points every page at the homepage.
export const metadata: Metadata = {
  title: 'Search the Golf Buggy Fleet | The Buggies Express',
  description:
    `Search all ${PRODUCTS.length} golf buggy models, batteries, chargers and parts stocked at the Yatala QLD depot.`,
  alternates: {
    canonical: `https://${SITE.domain}/search/`,
  },
  // Internal search result pages are kept out of the index (Google advises
  // against indexing site-search results); links on them are still followed.
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
