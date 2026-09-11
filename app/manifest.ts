import type { MetadataRoute } from 'next';
import { SITE } from '@/src/config/site';
import { BRAND_ASSETS } from '@/src/config/brand-assets';

// /manifest.webmanifest - Android home-screen icon, Chrome install prompt,
// and the icon some crawlers read for the "site icon". Next links it from
// every page automatically. Icons come from `npm run brand`.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: 'Buggies Express',
    description: SITE.tagline,
    start_url: '/',
    display: 'browser',
    background_color: SITE.boneCanvas,
    theme_color: SITE.boneCanvas,
    lang: 'en-AU',
    icons: [
      { src: BRAND_ASSETS.mark192, sizes: '192x192', type: 'image/png' },
      { src: BRAND_ASSETS.mark512, sizes: '512x512', type: 'image/png' },
      { src: BRAND_ASSETS.mark512, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
