'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

// Catches any rendering/data error under /admin/* (e.g. a transient database
// hiccup) and shows a recoverable screen instead of Next's blank crash page.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[admin]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#071527]">
      <div className="max-w-sm w-full bg-[#0B1F3A] border border-white/10 rounded-2xl p-8 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 mx-auto text-[#D9C27A]" aria-hidden="true" />
        <h1 className="text-lg font-serif font-bold text-white">Something didn&rsquo;t load</h1>
        <p className="text-sm text-[#A9B4C6]">
          Usually a moment&rsquo;s hiccup talking to the database. Try again, or reload the page.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] font-bold text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try again
        </button>
        {error.digest && <p className="text-[10px] text-[#5C6B85]">Ref: {error.digest}</p>}
      </div>
    </div>
  );
}
