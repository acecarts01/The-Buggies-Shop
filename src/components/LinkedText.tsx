import React from 'react';
import Link from 'next/link';

/** Text broken into plain runs and links, produced on the server by lib/autolink.ts. */
export type Seg = string | { text: string; href: string };

export default function LinkedText({ segs, linkClassName = 'text-[#E2A17A] font-semibold hover:underline' }: { segs: Seg[]; linkClassName?: string }) {
  return (
    <>
      {segs.map((s, i) =>
        typeof s === 'string' ? (
          <React.Fragment key={i}>{s}</React.Fragment>
        ) : (
          <Link key={i} href={s.href} className={linkClassName}>
            {s.text}
          </Link>
        )
      )}
    </>
  );
}
