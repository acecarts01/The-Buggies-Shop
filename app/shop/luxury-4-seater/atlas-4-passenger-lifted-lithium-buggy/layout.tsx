import type { Metadata } from 'next';
import { PRODUCTS, SITE } from '@/src/config/site';
import { buildTitle, buildDescription, socialImages } from '@/lib/seo';
import { jsonLd, productSchema, breadcrumbSchema, absoluteUrl } from '@/lib/schema';

// The page below is a client component and cannot export metadata or emit
// server-rendered JSON-LD itself, so both live here. Everything derives from
// the Atlas entry in PRODUCTS through the same builders the templated product
// route uses; previously this route hand-typed its own title, description and
// Product schema (no image, an invented mpn), which drifted from the catalogue.
const SLUG = 'atlas-4-passenger-lifted-lithium-buggy';
const CATEGORY = 'luxury-4-seater';
const atlas = PRODUCTS.find((p) => p.slug === SLUG);
if (!atlas) throw new Error(`PRODUCTS has no entry for ${SLUG}`);

const canonical = `https://${SITE.domain}/shop/${CATEGORY}/${SLUG}/`;
const title = buildTitle(atlas.name);
const description = buildDescription(
  `${atlas.name}, ${atlas.price_display} inc GST.`,
  atlas.key_specs,
  ['Tested at our Yatala QLD depot.', 'Enclosed freight Australia-wide.', 'Finance in 4 available.']
);
const photo = atlas.images?.[0] ? { url: absoluteUrl(atlas.images[0]), alt: atlas.name } : undefined;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: 'website', siteName: SITE.name, images: socialImages(photo) },
  twitter: { card: 'summary_large_image', title, description, images: socialImages(photo) },
};

export default function AtlasProductLayout({ children }: { children: React.ReactNode }) {
  const schema = productSchema(atlas!);
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop/' },
    { name: 'Luxury 4-Seaters', path: `/shop/${CATEGORY}/` },
    { name: atlas!.name, path: `/shop/${CATEGORY}/${SLUG}/` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      {children}
    </>
  );
}
