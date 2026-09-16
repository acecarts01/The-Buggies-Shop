'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { KeyRound, ArrowRight } from 'lucide-react';
import { BRAND_ASSETS } from '@/src/config/brand-assets';

export default function LoginForm({ next }: { next: string }) {
  const [passphrase, setPassphrase] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const mark = BRAND_ASSETS.mark ?? BRAND_ASSETS.logo;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/admin/session/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase }),
    });
    if (res.ok) {
      window.location.href = next;
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.message || 'Sign-in failed.');
    setBusy(false);
  };

  return (
    <main id="main" className="min-h-screen flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm bg-[#0B1F3A] border border-white/10 rounded-2xl p-7 shadow-2xl space-y-5">
        <div className="text-center space-y-3">
          {mark && <Image src={mark.path} alt="" width={Math.round((mark.width / mark.height) * 56)} height={56} className="h-14 w-auto mx-auto" priority />}
          <h1 className="text-xl font-serif font-bold">Sales desk admin</h1>
          <p className="text-xs text-[#A9B4C6]">Enter the admin passphrase to open orders and send invoices.</p>
        </div>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.15em] text-[#D9C27A] font-bold mb-1.5">Passphrase</span>
          <span className="relative block">
            <KeyRound className="w-4 h-4 text-[#A9B4C6] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#071527] border border-white/15 text-white text-sm focus:outline-none focus:border-[#B8973F] transition-colors"
            />
          </span>
        </label>
        {error && (
          <p role="alert" className="text-xs text-[#F3C6B0] bg-[#3A1C14] border border-[#7A3A28] rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#B8973F] hover:bg-[#D9C27A] text-[#071527] font-bold text-sm transition-colors disabled:opacity-60"
        >
          {busy ? 'Checking…' : 'Open admin'}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}
