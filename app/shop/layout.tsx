import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { hubContent } from '@/src/config/category-content';

const hub = hubContent();

// The page is a server wrapper around a client component; its metadata
// lives here (see pageMetadata for why every field is set explicitly).
export const metadata: Metadata = {
  ...pageMetadata({
    title: hub.title,
    description: hub.description,
    path: '/shop/',
  }),
  keywords: [hub.primaryKeyword, ...hub.supportingKeywords],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
