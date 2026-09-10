import React from 'react';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  /** Heading shown above the list. Keep it specific to the page. */
  heading?: string;
  /** Emit FAQPage JSON-LD. Only ONE block per page is valid, so a page that
   *  already emits FAQPage elsewhere must pass false. */
  schema?: boolean;
  /** 'dark' matches the product/blog templates, 'light' the bone canvas. */
  tone?: 'dark' | 'light';
}

/**
 * Renders a question/answer block and, optionally, its FAQPage schema.
 *
 * <details>/<summary> keeps it keyboard-operable with no JavaScript, and the
 * answers stay in the DOM whether open or shut so crawlers and assistants
 * read the full text rather than just the questions.
 */
export default function FaqSection({ items, heading = 'Frequently Asked Questions', schema = true, tone = 'dark' }: FaqSectionProps) {
  if (!items || items.length === 0) return null;

  const dark = tone === 'dark';
  const card = dark
    ? 'bg-[#1A1D21] border-[#2B2F34] metal-brushed-dark'
    : 'bg-white border-[#E7E5E4] surface-card';
  const qText = dark ? 'text-[#ffffff]' : 'text-[#121417]';
  const aText = dark ? 'text-[#A8A29E]' : 'text-[#57534E]';
  const chev = dark ? 'text-[#E2A17A]' : 'text-[#A85640]';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="space-y-4" aria-labelledby="faq-heading">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <h2 id="faq-heading" className={`text-xl sm:text-2xl font-serif font-bold tracking-tight ${qText}`}>
        {heading}
      </h2>

      <div className="space-y-3">
        {items.map((f, i) => (
          <details
            key={f.q}
            open={i === 0}
            className={`group rounded-2xl border p-5 shadow-xs ${card}`}
          >
            <summary
              className={`cursor-pointer list-none flex items-start justify-between gap-3 font-semibold text-sm sm:text-base ${qText}`}
            >
              <span>{f.q}</span>
              <span
                aria-hidden="true"
                className={`shrink-0 mt-0.5 transition-transform group-open:rotate-45 motion-reduce:transition-none ${chev}`}
              >
                +
              </span>
            </summary>
            <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${aText}`}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
