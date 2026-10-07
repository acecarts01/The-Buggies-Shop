import React from 'react';
import type { Reference } from '@/src/config/references';

// "Official sources" block. Props only (no server config imported), so it works
// from server and client components. Links are editorial (no nofollow) and open
// in a new tab with rel="noopener noreferrer".

export default function ExternalReferences({
  refs,
  heading = 'Official Sources and Further Reading',
  tone = 'dark',
}: {
  refs: Reference[];
  heading?: string;
  tone?: 'dark' | 'light';
}) {
  if (!refs.length) return null;
  const dark = tone === 'dark';
  return (
    <section
      aria-label={heading}
      className={
        dark
          ? 'bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm metal-brushed-dark'
          : 'bg-white border border-[#E7E5E4] rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm'
      }
    >
      <h2 className={`text-base sm:text-lg font-serif font-bold tracking-tight ${dark ? 'text-[#ffffff]' : 'text-[#121417]'}`}>{heading}</h2>
      <ul className="space-y-2">
        {refs.map((r) => (
          <li key={r.url} className={`text-xs sm:text-sm ${dark ? 'text-[#A8A29E]' : 'text-[#57534E]'}`}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold hover:underline ${dark ? 'text-[#E2A17A]' : 'text-[#A85640]'}`}
            >
              {r.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{' '}
            <span>&mdash; {r.publisher}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
