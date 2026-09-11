import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

// The page below is a client component and cannot export metadata itself,
// so it lives here (see pageMetadata for why every field is set explicitly).
export const metadata: Metadata = pageMetadata({
  title: 'Golf Buggy FAQ Australia | The Buggies Express',
  description: 'Answers on Australia-wide enclosed freight, real lithium range, slope and wet-paddock performance, ordering and warranty from our Yatala QLD depot.',
  path: '/faq/',
});

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
