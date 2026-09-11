import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE, PRODUCTS } from '@/src/config/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F7F6F2',
};

export const metadata: Metadata = {
  title: "Golf Buggies & Golf Carts Australia | The Buggies Express",
  description: `Sales, service, warranty, parts, and custom builds. ${PRODUCTS.length} models from luxury 4-seaters to lifted 4x4 acreage buggies. Yatala QLD depot. ABN 28 668 598 758.`,
  metadataBase: new URL(`https://${SITE.domain}`),
  alternates: {
    canonical: `https://${SITE.domain}/`,
  },
  openGraph: {
    title: "Golf Buggies & Golf Carts Australia | The Buggies Express",
    description: `Sales, service, warranty, parts, and custom builds. ${PRODUCTS.length} models from luxury 4-seaters to lifted 4x4 acreage buggies. Yatala QLD depot. ABN 28 668 598 758.`,
    type: 'website',
    locale: 'en_AU',
    url: `https://${SITE.domain}/`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: "Golf Buggies & Golf Carts Australia | The Buggies Express",
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
        {children}
        {/* Agent-only (navigator.modelContext); nothing on the page waits on it,
            so it loads after the page is idle rather than competing with the
            hero image and hydration for bandwidth. */}
        <Script src="/js/webmcp.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
