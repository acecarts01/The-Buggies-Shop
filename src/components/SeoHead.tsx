import React from 'react';
import { jsonLd } from '@/lib/json-ld';

// <SeoHead /> puts a page's SEO tags into the document head.
//
// React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree into
// <head>, so this works from a server or client component with no effect hooks
// (an effect would only run after hydration, which crawlers that do not run
// scripts never see).
//
// Two ways to use it:
//
//  1. Site-wide structured data (app/layout.tsx): pass only `schema`. Next's
//     Metadata API already owns title, description, canonical and Open Graph on
//     every route, and emitting them twice would give crawlers conflicting
//     tags, so this mode renders the JSON-LD alone.
//
//  2. A page with no Metadata export of its own: pass title, description and
//     canonical (and optionally image/type) and it renders the full set. Never
//     combine this with generateMetadata()/metadata on the same route.

export interface SeoHeadProps {
  title?: string;
  description?: string;
  /** Absolute canonical URL. */
  canonical?: string;
  /** Absolute image URL for og:image / twitter:image. */
  image?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
  /** JSON-LD object or @graph, serialised safely (see lib/json-ld.ts). */
  schema?: unknown | unknown[];
}

export default function SeoHead({ title, description, canonical, image, type = 'website', siteName, locale = 'en_AU', schema }: SeoHeadProps) {
  const blocks = schema === undefined ? [] : Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {title && <meta property="og:type" content={type} />}
      {title && siteName && <meta property="og:site_name" content={siteName} />}
      {title && <meta property="og:locale" content={locale} />}
      {image && <meta property="og:image" content={image} />}
      {title && <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(b) }} />
      ))}
    </>
  );
}
