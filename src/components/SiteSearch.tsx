'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X, CornerDownLeft } from 'lucide-react';
import { searchIndex, groupHits, KIND_LABEL, type SearchEntry, type SearchHit } from '@/lib/site-search';

// Site-wide search: a header button (or "/" or Ctrl/Cmd+K) opens a dialog that
// finds products, ranges, brands, delivery areas, guides, pages and FAQ answers.
// The index (/api/search-index, a static JSON file) is fetched once, the first
// time the dialog opens, and searched in the browser, so results appear as you
// type with no round trip. "See all results" continues on /search/?q=.

let cachedIndex: SearchEntry[] | null = null;
let pending: Promise<SearchEntry[]> | null = null;
export function loadSearchIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  pending ??= fetch('/api/search-index')
    .then((r) => (r.ok ? r.json() : []))
    .then((j: SearchEntry[]) => (cachedIndex = j))
    .catch(() => {
      pending = null;
      return [] as SearchEntry[];
    });
  return pending;
}

export default function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchEntry[]>(cachedIndex ?? []);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const listId = useId();

  const show = useCallback(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
    openerRef.current?.focus?.();
  }, []);

  // Open with "/" (outside inputs) or Ctrl/Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show]);

  // Load the index on first open; lock page scroll while open
  useEffect(() => {
    if (!open) return;
    loadSearchIndex().then(setIndex);
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const hits = useMemo(() => searchIndex(index, query, 24), [index, query]);
  const groups = useMemo(() => groupHits(hits), [hits]);
  const flat: SearchHit[] = useMemo(() => groups.flatMap((g) => g.hits), [groups]);

  useEffect(() => setActive(0), [query]);

  const go = (u: string) => {
    hide();
    router.push(u);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hide();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[active]) go(flat[active].u);
      else if (query.trim()) go(`/search/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    document.getElementById(`${listId}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, listId]);

  let optIndex = -1;
  return (
    <>
      <button
        type="button"
        onClick={show}
        className="p-2 rounded-lg hover:bg-[#F7EFEA] text-[#6B645E] hover:text-[#A85640] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A85640] border border-transparent hover:border-[#E7E5E4] surface-card"
        aria-label="Search the site"
        aria-haspopup="dialog"
        id="header-search-btn"
      >
        <SearchIcon className="w-5 h-5" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-3 pt-[8vh] sm:pt-[12vh]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) hide();
          }}
        >
          <div role="dialog" aria-modal="true" aria-label="Search the site" className="w-full max-w-2xl bg-[#121417] text-[#E7E5E4] border border-[#2B2F34] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 border-b border-[#2B2F34]">
              <SearchIcon className="w-5 h-5 text-[#E2A17A] shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                type="search"
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls={listId}
                aria-activedescendant={flat.length ? `${listId}-opt-${active}` : undefined}
                aria-autocomplete="list"
                placeholder="Search buggies, brands, guides, delivery…"
                className="flex-1 bg-transparent py-4 text-sm sm:text-base placeholder-[#A8A29E]/70 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="button" onClick={hide} className="p-1.5 rounded-lg text-[#A8A29E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A17A]" aria-label="Close search">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div id={listId} role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {!query.trim() && (
                <div className="px-4 py-6 text-xs text-[#A8A29E] space-y-2">
                  <p>Try a model, brand or question:</p>
                  <div className="flex flex-wrap gap-2">
                    {['electric golf buggy', '4 seater', 'Club Car', 'lithium battery', 'delivery Perth', 'remote control'].map((s) => (
                      <button key={s} type="button" onClick={() => setQuery(s)} className="px-2.5 py-1 rounded-full border border-[#2B2F34] hover:border-[#E2A17A] text-[#E7E5E4]">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {query.trim() && flat.length === 0 && (
                <div className="px-4 py-8 text-sm text-[#A8A29E]">
                  {index.length ? <>No results for &ldquo;{query}&rdquo;. Try a brand, a seat count or &ldquo;delivery&rdquo;.</> : 'Loading…'}
                </div>
              )}
              {groups.map((g) => (
                <div key={g.kind} role="group" aria-label={KIND_LABEL[g.kind]}>
                  <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#E2A17A]">{KIND_LABEL[g.kind]}</div>
                  {g.hits.map((h) => {
                    optIndex += 1;
                    const i = optIndex;
                    return (
                      <a
                        key={h.t + h.u + h.ti}
                        id={`${listId}-opt-${i}`}
                        role="option"
                        aria-selected={i === active}
                        href={h.u}
                        onMouseEnter={() => setActive(i)}
                        onClick={(e) => {
                          e.preventDefault();
                          go(h.u);
                        }}
                        className={`block px-4 py-2.5 ${i === active ? 'bg-[#1F2226]' : ''}`}
                      >
                        <span className="block text-sm font-semibold text-white line-clamp-1">{h.ti}</span>
                        <span className="block text-xs text-[#A8A29E] line-clamp-1">{h.d}</span>
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-[#2B2F34] text-[11px] text-[#A8A29E]">
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-[#2B2F34]">↑↓</kbd> move
                <CornerDownLeft className="w-3 h-3 ml-2" aria-hidden="true" /> open
                <kbd className="px-1.5 py-0.5 rounded border border-[#2B2F34] ml-2">Esc</kbd> close
              </span>
              {query.trim() && (
                <a
                  href={`/search/?q=${encodeURIComponent(query.trim())}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(`/search/?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="text-[#E2A17A] font-semibold hover:underline ml-auto"
                >
                  See all results for &ldquo;{query.trim()}&rdquo;
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
