import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND_ASSETS } from '@/src/config/brand-assets';
import AdminSignOut from './AdminSignOut';

/**
 * Chrome for every admin screen: navy band, shield mark, section title,
 * sign-out. Design tokens match the transactional emails (navy / gold /
 * white) so the card, the terminal and the invoice read as one system.
 */
export default function AdminShell({ title, subtitle, children, wide = false }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  const mark = BRAND_ASSETS.mark ?? BRAND_ASSETS.logo;
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-[#0B1F3A]">
        <div className={`mx-auto ${wide ? 'max-w-7xl' : 'max-w-4xl'} px-4 sm:px-6 py-3 flex items-center justify-between gap-4`}>
          <Link href="/admin/orders/" className="flex items-center gap-3 min-w-0">
            {mark ? (
              <Image src={mark.path} alt="" width={Math.round((mark.width / mark.height) * 36)} height={36} className="h-9 w-auto shrink-0" priority />
            ) : (
              <span className="w-9 h-9 rounded-lg bg-[#B8973F] text-[#071527] font-serif font-bold flex items-center justify-center">BE</span>
            )}
            <span className="min-w-0">
              <span className="block text-sm font-serif font-bold leading-tight truncate">The Buggies Express</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#D9C27A]">Sales desk admin</span>
            </span>
          </Link>
          <AdminSignOut />
        </div>
      </header>
      <main id="main" className={`flex-1 mx-auto w-full ${wide ? 'max-w-7xl' : 'max-w-4xl'} px-4 sm:px-6 py-8 sm:py-10`}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[#A9B4C6] mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
      <footer className="border-t border-white/10 py-4 text-center text-[11px] text-[#A9B4C6]">
        GOLF BUGGIES EXPRESS PTY LTD · ABN 28 668 598 758 · Internal use. Links in this area carry signed order data; do not forward them outside the business.
      </footer>
    </div>
  );
}
