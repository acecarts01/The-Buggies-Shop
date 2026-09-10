import type { Metadata } from 'next';
import { SITE } from '@/src/config/site';

// The page below is a client component and cannot export metadata itself,
// so it lives here. Without it the route inherits the root layout's title,
// description and canonical, which points every page at the homepage.
export const metadata: Metadata = {
  title: 'Golf Buggy FAQ Australia | The Buggies Express',
  description: 'Answers on Australia-wide enclosed freight, real lithium range, slope and wet-paddock performance, ordering and warranty from our Yatala QLD depot.',
  alternates: {
    canonical: `https://${SITE.domain}/faq/`,
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
