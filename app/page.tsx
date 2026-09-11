import React from 'react';
import { POSTS, toPostSummary } from '@/src/config/posts';
import { jsonLd, homeGraph } from '@/lib/schema';
import HomeClient from './HomeClient';

// Server shell for the homepage. The interactive page is HomeClient; keeping
// this wrapper on the server does two things: the Organization + WebSite
// graph is emitted from lib/schema.ts rather than a client bundle, and the
// blog teaser receives three post summaries instead of importing every
// article body (which shipped ~390 KB of prose in the shared JS chunk).
//
// No FAQPage schema here on purpose: /faq/ owns the FAQPage markup for the
// same question set, and two URLs claiming it is a duplicate signal.
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeGraph()) }} />
      <HomeClient posts={POSTS.slice(0, 3).map(toPostSummary)} postCount={POSTS.length} />
    </>
  );
}
