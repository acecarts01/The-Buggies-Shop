'use client';

import React, { useState } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { SITE, CONTACT, ABN_INFO, FORMS } from '@/src/config/site';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import {
  StaggeredHeading,
  StaggeredParagraph,
  FadeUpText,
  AnimatedCard
} from '@/src/components/AnimatedText';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const thankYouUrl = '/thank-you-contact/';
    const formData = new FormData(form);

    const payload = {
      formType: 'contact',
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      state: formData.get('state')?.toString() || '',
      postcode: formData.get('postcode')?.toString() || '',
      subject: formData.get('subject')?.toString() || 'General Enquiry',
      buggyModel: formData.get('buggy_model')?.toString() || '',
      message: formData.get('message')?.toString() || '',
    };

    try {
      await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Also forward to Web3Forms if a custom access key has been configured
      const keyInput = form.querySelector<HTMLInputElement>('[name="access_key"]');
      const key = keyInput ? keyInput.value : '';
      if (key && !key.startsWith('YOUR-') && key !== 'PENDING') {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        }).catch(() => {});
      }

      window.location.href = thankYouUrl;
    } catch {
      window.location.href = thankYouUrl;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d]">
      <Header />

      <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Exactly One H1 */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <FadeUpText delay={0.05} className="text-xs uppercase tracking-widest text-[#fbbf24] font-extrabold">
            Direct Queensland Engineering &amp; Sales Support
          </FadeUpText>
          <StaggeredHeading
            tag="h1"
            text="Contact The Buggies Express Yatala QLD Depot"
            className="text-3xl sm:text-4xl font-serif font-bold text-[#ffffff] mt-1"
          />
          <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#94a3b8] mt-2">
            Speak directly with qualified technicians and commercial vehicle specialists. We answer enquiries seven days a week.
          </StaggeredParagraph>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Direct Depot Details */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatedCard delay={0.1} className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <StaggeredHeading
                tag="h2"
                text="Headquarters & Depot"
                className="text-lg font-serif font-bold text-[#ffffff] border-b border-[#152037] pb-3"
              />

              <div className="space-y-4 text-xs sm:text-sm text-[#e2e8f0]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#ffffff]">Yatala Operations Facility</div>
                    <div className="text-xs text-[#94a3b8] mt-0.5">
                      Yatala Light Industrial Precinct, Yatala QLD 4207
                    </div>
                    <div className="text-[11px] text-[#94a3b8]/80 mt-0.5">
                      Conveniently located off the Pacific Motorway (M1) between Brisbane and Gold Coast.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#ffffff]">National Phone Enquiries</div>
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="text-[#fbbf24] font-bold text-sm hover:underline"
                    >
                      0480 408 189
                    </a>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">
                      Direct line to our Yatala workshop and fleet managers.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#ffffff]">Live WhatsApp Specialist</div>
                    <a
                      href={`https://wa.me/61480408189?text=${encodeURIComponent(
                        'Hello The Buggies Express, I would like to enquire about a golf buggy.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] font-bold text-xs hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Chat on WhatsApp (+61 480 408 189)</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#ffffff]">Official Email</div>
                    <a
                      href="mailto:info@golfbuggiesexpress.com.au"
                      className="text-[#e2e8f0] hover:text-[#fbbf24] text-xs font-mono"
                    >
                      info&#64;golfbuggiesexpress.com.au
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#ffffff]">Depot Hours</div>
                    <div className="text-xs text-[#94a3b8]">
                      Monday – Friday: 7:30 AM – 5:30 PM AEST<br />
                      Saturday: 8:30 AM – 3:00 PM AEST (By Appointment)<br />
                      Sunday: Enquiries monitored via WhatsApp
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#152037] text-xs text-[#94a3b8] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                <span>ASIC Registered Company: ACN 668 598 758</span>
              </div>
            </AnimatedCard>
          </div>

          {/* Web3Forms Contact Form */}
          <div className="lg:col-span-7">
            <AnimatedCard delay={0.2} className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-6 sm:p-8 shadow-xl">
              <StaggeredHeading
                tag="h2"
                text="Send an Enquiry to Yatala Depot"
                className="text-lg font-serif font-bold text-[#ffffff] mb-2"
              />
              <StaggeredParagraph delay={0.1} className="text-xs text-[#94a3b8] mb-6">
                Receive pricing breakdowns, freight schedules, trade-in valuations, or lithium upgrade consultations.
              </StaggeredParagraph>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Hidden Fields for Web3Forms */}
                <input
                  type="hidden"
                  name="access_key"
                  value={FORMS.web3formsKey || 'PENDING'}
                />
                <input
                  type="hidden"
                  name="subject"
                  value="New Enquiry — The Buggies Express Yatala QLD"
                />
                <input
                  type="hidden"
                  name="from_name"
                  value="The Buggies Express Website"
                />
                {/* Honeypot */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: 'none' }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-semibold text-[#ffffff] mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="e.g. John Mitchell"
                      className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block font-semibold text-[#ffffff] mb-1"
                    >
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      required
                      placeholder="0400 000 000"
                      className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-semibold text-[#ffffff] mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="john@example.com.au"
                      className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-postcode"
                      className="block font-semibold text-[#ffffff] mb-1"
                    >
                      Delivery Postcode / State
                    </label>
                    <input
                      type="text"
                      id="contact-postcode"
                      name="postcode"
                      placeholder="e.g. 4217 QLD or 2000 NSW"
                      className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-interest"
                    className="block font-semibold text-[#ffffff] mb-1"
                  >
                    Primary Area of Interest
                  </label>
                  <select
                    id="contact-interest"
                    name="interest"
                    className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                  >
                    <option value="buy-buggy">Buying a New Golf Buggy (2, 4, or 6 Seater)</option>
                    <option value="atlas-order">Atlas 4-Passenger Tax Invoice &amp; Freight Quotation</option>
                    <option value="lifted-4x4">Lifted Acreage 4x4 Vehicle</option>
                    <option value="lithium-upgrade">72V / 48V Lithium Battery Retrofit</option>
                    <option value="commercial-fleet">Commercial Resort / Council Fleet Order</option>
                    <option value="parts-service">Spare Parts or Workshop Maintenance</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-semibold text-[#ffffff] mb-1"
                  >
                    Your Message / Requirements
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your property terrain, intended golf club, or custom accessory requirements..."
                    className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-[#0a0f1d] border border-[#fbbf24] text-[#ffffff] rounded-lg text-xs">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  id="contact-submit-button"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Dispatching...' : 'Submit Enquiry to Yatala Depot'}</span>
                </button>
              </form>
            </AnimatedCard>
          </div>
        </div>
      </main>

      <Footer />
      <ChatHub />
    </div>
  );
}
