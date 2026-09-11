'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { FORMS } from '@/src/config/site';

interface RegisterInterestProps {
  /** Range name, used in the subject line and the model field so the depot
   *  can tell these apart from ordinary enquiries. */
  rangeName: string;
}

/**
 * Stands in for the catalogue on a coming-soon category. Same submit path as
 * the contact page: the internal /api/contact/ route (Zoho) plus an optional
 * Web3Forms forward - FormData with an Accept header only, never a
 * Content-Type, or the CORS preflight fails.
 */
export default function RegisterInterest({ rangeName }: RegisterInterestProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      formType: 'contact',
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      postcode: formData.get('postcode')?.toString() || '',
      subject: `Register Interest — ${rangeName}`,
      buggyModel: `${rangeName} (coming soon)`,
      message: `Please let me know when the ${rangeName} range is available.`,
    };

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad status');

      const key = FORMS.web3formsKey;
      if (key && !key.startsWith('YOUR-') && key !== 'PENDING') {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        }).catch(() => {});
      }

      window.location.href = '/thank-you-contact/';
    } catch {
      setSubmitting(false);
      setErrorMsg('That did not go through. Please try again, or use the contact details in the footer.');
    }
  };

  const field =
    'w-full px-3.5 py-2.5 bg-[#121417] border border-[#2B2F34] rounded-lg text-[#ffffff] text-sm placeholder-[#6B645E] focus:outline-none focus:border-[#E2A17A]';

  return (
    <section
      aria-labelledby="register-interest-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-gradient-to-r from-[#1A1D21] to-[#0A0B0D] border border-[#E2A17A]/40 rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-2 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#E2A17A] bg-[#121417] px-2.5 py-1 rounded border border-[#2B2F34]">
            <Bell className="w-3 h-3" aria-hidden="true" />
            Stay Connected
          </span>
          <h2
            id="register-interest-heading"
            className="text-2xl sm:text-3xl font-serif font-bold text-[#ffffff] tracking-tight"
          >
            Coming to You Soon
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
            The {rangeName.toLowerCase()} range is being finalised. Nothing is for sale here yet,
            and we will not publish a price or a specification until it is confirmed. Leave your
            details and we will let you know the day it lands.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-3" noValidate={false}>
          <input type="hidden" name="access_key" value={FORMS.web3formsKey || 'PENDING'} />
          <input type="hidden" name="subject" value={`Register Interest — ${rangeName}`} />
          <input type="hidden" name="from_name" value="The Buggies Express Website" />
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="ri-name" className="block text-xs font-semibold text-[#ffffff] mb-1">
                Name *
              </label>
              <input id="ri-name" name="name" type="text" required autoComplete="name" placeholder="e.g. Sam Taylor" className={field} />
            </div>
            <div>
              <label htmlFor="ri-email" className="block text-xs font-semibold text-[#ffffff] mb-1">
                Email *
              </label>
              <input id="ri-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <label htmlFor="ri-postcode" className="block text-xs font-semibold text-[#ffffff] mb-1">
                Postcode <span className="font-normal text-[#A8A29E]">(optional, for freight)</span>
              </label>
              <input id="ri-postcode" name="postcode" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={4} placeholder="4207" className={field} />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#C86D51] to-[#E2A17A] text-[#121417] font-bold text-sm shadow hover:from-[#E2A17A] hover:to-[#EFC7A6] transition-all disabled:opacity-60 disabled:cursor-wait"
            >
              {submitting ? 'Sending…' : 'Keep Me Posted'}
            </button>
          </div>
          {errorMsg && (
            <p role="alert" className="text-xs text-[#E2A17A]">
              {errorMsg}
            </p>
          )}
          <p className="text-[11px] text-[#6B645E]">
            Used only to tell you when this range is available.
          </p>
        </form>
      </div>
    </section>
  );
}
