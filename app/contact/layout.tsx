import type { Metadata } from 'next';
import { SITE } from '@/src/config/site';

// The page below is a client component and cannot export metadata itself,
// so it lives here. Without it the route inherits the root layout's title,
// description and canonical, which points every page at the homepage.
export const metadata: Metadata = {
  title: 'Contact The Buggies Express | Yatala QLD Depot',
  description: 'Contact the Golf Buggies Express PTY LTD depot at Yatala QLD 4207 for golf buggy sales, service, parts and Australia-wide freight enquiries. ABN 28 668 598 758.',
  alternates: {
    canonical: `https://${SITE.domain}/contact/`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
