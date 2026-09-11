import type {NextConfig} from 'next';
import {PRODUCTS, CATEGORIES} from './src/config/site';

// Product URLs are built as /shop/<category-slug>/<product-slug>/, so renaming
// or splitting a category moves every product underneath it. Each old URL gets
// a 301 instead of a 404. Derived from PRODUCTS rather than hand-listed, so the
// map cannot drift from the catalogue.
const LEGACY_CATEGORIES = [
  {
    from: 'batteries-chargers-parts',
    // Split in two so the battery cluster and the accessories cluster each get
    // a canonical target (docs/keyword-map.md, gap G3).
    absorbedBy: ['batteries-chargers', 'accessories-spare-parts'],
    // Where the old category page itself lands. The accessories half inherited
    // the old page's title ("Golf Buggy Spare Parts & Accessories") and 16 of
    // its 26 products, so it is the closest match for the old ranking signal.
    categoryTo: 'accessories-spare-parts',
  },
];

function legacyRedirects() {
  const out: {source: string; destination: string; permanent: boolean}[] = [];
  for (const legacy of LEGACY_CATEGORIES) {
    out.push({
      source: `/shop/${legacy.from}`,
      destination: `/shop/${legacy.categoryTo}/`,
      permanent: true,
    });
    for (const slug of legacy.absorbedBy) {
      const cat = CATEGORIES.find((c) => c.slug === slug);
      if (!cat) continue;
      for (const p of PRODUCTS.filter((x) => x.category === cat.rawCategory)) {
        out.push({
          source: `/shop/${legacy.from}/${p.slug}`,
          destination: `/shop/${slug}/${p.slug}/`,
          permanent: true,
        });
      }
    }
  }
  return out;
}

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects();
  },
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
