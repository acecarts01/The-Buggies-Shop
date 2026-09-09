import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE } from '@/src/config/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F7F6F2',
};

export const metadata: Metadata = {
  title: "The Buggies Express | Australia's Most Complete Golf Buggy & Cart Specialists",
  description: "Sales, service, warranty, parts, and custom builds. 61+ models from luxury 4-seaters to lifted 4x4 acreage buggies. Yatala QLD depot. ABN 28 668 598 758.",
  metadataBase: new URL(`https://${SITE.domain}`),
  alternates: {
    canonical: `https://${SITE.domain}/`,
  },
  openGraph: {
    title: "The Buggies Express | Australia's Most Complete Golf Buggy & Cart Specialists",
    description: "Sales, service, warranty, parts, and custom builds. 61+ models from luxury 4-seaters to lifted 4x4 acreage buggies. Yatala QLD depot. ABN 28 668 598 758.",
    type: 'website',
    locale: 'en_AU',
    url: `https://${SITE.domain}/`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Buggies Express | Australia's Most Complete Golf Buggy & Cart Specialists",
    description: "Sales, service, warranty, parts, and custom builds. 61+ models in stock at Yatala QLD depot.",
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
        <Script src="/js/webmcp.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
