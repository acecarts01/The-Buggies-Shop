import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE, PRODUCTS } from '@/src/config/site';
import SeoHead from '@/src/components/SeoHead';
import { homeGraph } from '@/lib/schema';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F7F6F2',
};

export const metadata: Metadata = {
  title: "Buggies for Sale Australia | Golf Carts | Buggies Express",
  description: `Buggies for sale Australia-wide: ${PRODUCTS.length} golf buggies and carts, from luxury 4-seaters to lifted 4x4 acreage models. Sales, service and parts from Yatala QLD.`,
  metadataBase: new URL(`https://${SITE.domain}`),
  alternates: {
    canonical: `https://${SITE.domain}/`,
  },
  openGraph: {
    title: "Buggies for Sale Australia | Golf Carts | Buggies Express",
    description: `Buggies for sale Australia-wide: ${PRODUCTS.length} golf buggies and carts, from luxury 4-seaters to lifted 4x4 acreage models. Sales, service and parts from Yatala QLD.`,
    type: 'website',
    locale: 'en_AU',
    url: `https://${SITE.domain}/`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: "Buggies for Sale Australia | Golf Carts | Buggies Express",
    description: `Sales, service, warranty, parts, and custom builds. ${PRODUCTS.length} models in stock at Yatala QLD depot.`,
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
    'google-site-verification': SITE.gscVerification,
    'indexnow-key': SITE.indexNowKey,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body suppressHydrationWarning className="bg-[#F7F6F2] text-[#121417] antialiased min-h-screen">
        {/* Site-wide entity graph (Organization + WebSite with SearchAction) on every
            route, so the @id every product, guide and city page points at is defined
            on the same page. Title/description/canonical/OG stay with the Metadata API. */}
        <SeoHead schema={homeGraph()} />
        {children}
        {/* Agent-only (navigator.modelContext); nothing on the page waits on it,
            so it loads after the page is idle rather than competing with the
            hero image and hydration for bandwidth. */}
        <Script src="/js/webmcp.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
