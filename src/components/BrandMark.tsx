import React from 'react';
import Image from 'next/image';
import { SITE } from '@/src/config/site';
import { BRAND_ASSETS } from '@/src/config/brand-assets';

interface BrandMarkProps {
  /** Rendered height of the logo in px (width follows the file's ratio). */
  height?: number;
  /** Show the name/tagline text beside the mark. */
  withText?: boolean;
  /** 'mark' = the shield alone (header, compact); 'full' = wordmark + shield lockup (footer). */
  variant?: 'mark' | 'full';
  /** Text colour treatment for the surface it sits on. */
  tone?: 'light' | 'dark';
  /** Above-the-fold instances (the header) preload the file. */
  priority?: boolean;
  className?: string;
}

/**
 * The site logo, everywhere it appears. Renders the files `npm run brand` has
 * recorded in brand-assets.ts (the shield for compact placements, the full
 * lockup for the footer), otherwise the "BE" monogram badge - so a missing
 * file never produces a broken image or a 404. To replace the logo: put the
 * new public/brand/logo.png (and optionally logo-mark.png), run
 * `npm run brand`; nothing else needs editing.
 */
export default function BrandMark({ height = 40, withText = true, variant = 'mark', tone = 'light', priority = false, className = '' }: BrandMarkProps) {
  // The shield for compact placements when one exists, else the full logo.
  const logo = variant === 'mark' ? (BRAND_ASSETS.mark ?? BRAND_ASSETS.logo) : BRAND_ASSETS.logo;
  const dark = tone === 'dark';
  const width = logo ? Math.round((logo.width / logo.height) * height) : height;

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      {logo ? (
        <Image
          src={logo.path}
          alt={SITE.name}
          width={width}
          height={height}
          priority={priority}
          className="shrink-0 object-contain"
          style={{ height, width: 'auto' }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="shrink-0 rounded-lg bg-[#F7EFEA] border border-[#C86D51]/30 flex items-center justify-center font-serif font-bold text-[#A85640] shadow-xs"
          style={{ width: height, height, fontSize: Math.round(height * 0.45) }}
        >
          BE
        </span>
      )}
      {withText && (
        <span className="min-w-0">
          <span className={`block text-lg sm:text-xl font-serif font-bold tracking-tight transition-colors ${dark ? 'text-[#ffffff]' : 'text-[#121417] group-hover:text-[#A85640]'}`}>
            {SITE.name}
          </span>
          <span className={`block text-[10px] tracking-widest uppercase font-sans font-medium ${dark ? 'text-[#A8A29E]' : 'text-[#6B645E]'}`}>
            Yatala QLD • Australian Specialists
          </span>
        </span>
      )}
    </span>
  );
}
