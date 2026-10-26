import Link from 'next/link';

interface Props {
  heading: string;
  guides: { slug: string; label: string }[];
  /** 'dark' matches the delivery and product templates, 'light' the bone canvas pages. */
  tone?: 'dark' | 'light';
}

/** A short list of buying guides for a hub page, so every guide has links from the pages a buyer actually reads. */
export default function GuideLinks({ heading, guides, tone = 'light' }: Props) {
  if (!guides.length) return null;
  const dark = tone === 'dark';
  return (
    <section
      aria-label={heading}
      className={`rounded-2xl border p-5 sm:p-6 space-y-3 ${dark ? 'bg-[#1A1D21] border-[#2B2F34] metal-brushed-dark' : 'bg-white border-[#E7E5E4]'}`}
    >
      <h2 className={`text-lg font-serif font-bold ${dark ? 'text-[#ffffff]' : 'text-[#121417]'}`}>{heading}</h2>
      <ul className="space-y-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/blog/${g.slug}/`} className={`text-sm font-semibold hover:underline ${dark ? 'text-[#E2A17A]' : 'text-[#8F4632]'}`}>
              {g.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
