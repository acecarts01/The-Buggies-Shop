'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export default function SmartImage({
  src,
  alt,
  className = '',
  priority = false,
  fill = false,
  width,
  height,
  sizes,
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  // Fallback placeholder with tour fairway precision styling
  if (hasError || !src) {
    return (
      <div
        className={`bg-[#1A1D21] border border-[#2B2F34] flex flex-col items-center justify-center text-center p-4 text-xs text-[#A8A29E] ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="font-extrabold text-[#E2A17A] uppercase tracking-wider mb-1">
          Tour Precision
        </span>
        <span className="line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      fill={fill}
      width={!fill ? width || 800 : undefined}
      height={!fill ? height || 600 : undefined}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}
