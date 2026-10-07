import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';

const BREADCRUMBS = breadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact/' },
]);


// The page below is a client component and cannot export metadata itself,
// so it lives here (see pageMetadata for why every field is set explicitly).
export const metadata: Metadata = pageMetadata({
  title: 'Contact The Buggies Express | Yatala QLD Depot',
  description: 'Contact the Golf Buggies Express depot at Yatala QLD 4207 for buggy sales, service, parts and Australia-wide freight. ABN 28 668 598 758.',
  path: '/contact/',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMBS) }} />
      {children}
    </>
  );
}
