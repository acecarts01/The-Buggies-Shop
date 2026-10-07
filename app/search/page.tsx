'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { loadSearchIndex } from '@/src/components/SiteSearch';
import { searchIndex, groupHits, KIND_LABEL, type SearchEntry } from '@/lib/site-search';

// /search/?q=... : the full-page version of the header search. The same index
// and ranking (lib/site-search.ts), grouped by type. This is the target of the
// WebSite SearchAction in the site-wide JSON-LD.

function Results() {
  const params = useSearchParams();
  const router = useRouter();
  const urlQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSearchIndex().then((i) => {
      setIndex(i);
      setLoaded(true);
    });
  }, []);
  useEffect(() => setQuery(urlQuery), [urlQuery]);

  const groups = useMemo(() => groupHits(searchIndex(index, query, 60)), [index, query]);
  const total = groups.reduce((n, g) => n + g.hits.length, 0);

  return (
    <>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search/?q=${encodeURIComponent(query.trim())}`);
        }}
        className="mt-6 relative"
      >
        <label htmlFor="site-search-input" className="sr-only">
          Search the site
        </label>
        <input
          id="site-search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by model, brand, 4-seater, lithium, delivery, guide…"
          className="w-full pl-12 pr-4 py-3.5 bg-[#1A1D21] border border-[#2B2F34] rounded-xl text-[#ffffff] placeholder-[#A8A29E]/60 focus:outline-none focus:border-[#E2A17A] text-sm shadow-inner metal-brushed-dark"
          autoFocus
        />
        <SearchIcon className="w-5 h-5 text-[#E2A17A] absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
      </form>

      <div className="mt-8 space-y-8" aria-live="polite">
        {query.trim() && loaded && (
          <p className="text-xs text-[#A8A29E]">
            {total} {total === 1 ? 'result' : 'results'} for &ldquo;{query.trim()}&rdquo;
          </p>
        )}
        {query.trim() && loaded && total === 0 && (
          <p className="text-sm text-[#A8A29E]">
            Nothing matched. Try a brand (Club Car, MGI), a seat count (4 seater), or browse the{' '}
            <Link href="/shop/" className="text-[#E2A17A] font-semibold hover:underline">full range</Link>.
          </p>
        )}
        {groups.map((g) => (
          <section key={g.kind} aria-label={KIND_LABEL[g.kind]}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#E2A17A] mb-3">{KIND_LABEL[g.kind]}</h2>
            <ul className="space-y-2">
              {g.hits.map((h) => (
                <li key={h.t + h.u + h.ti}>
                  <Link href={h.u} className="block bg-[#1A1D21] border border-[#2B2F34] rounded-xl p-4 hover:border-[#E2A17A]/60 transition-colors metal-brushed-dark">
                    <span className="block text-sm font-bold text-white">{h.ti}</span>
                    <span className="block text-xs text-[#A8A29E] mt-0.5">{h.d}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121417]">
      <Header />
      <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Exactly one H1 */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#ffffff] tracking-tight">Search the Site</h1>
          <p className="text-sm text-[#A8A29E] mt-2">Models, brands, delivery areas, buying guides and answers.</p>
        </div>
        <Suspense fallback={null}>
          <Results />
        </Suspense>
      </main>
      <Footer />
      <ChatHub />
    </div>
  );
}
