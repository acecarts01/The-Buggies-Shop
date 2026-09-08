'use client';

import React, { useState } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { SITE, CONTACT, ABN_INFO, FORMS } from '@/src/config/site';
import { Building2, ShieldCheck, CheckCircle2, Truck, Wrench, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  StaggeredHeading,
  StaggeredParagraph,
  FadeUpText,
  AnimatedCard,
  StaggerContainer,
  StaggerItem
} from '@/src/components/AnimatedText';

export default function WholesalePage() {
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleWholesaleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg('');

    const form = e.currentTarget;
    const thankYouUrl = '/thank-you-wholesale/';
    const formData = new FormData(form);

    const payload = {
      formType: 'wholesale',
      organization: formData.get('organization')?.toString() || '',
      name: formData.get('contact_name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      state: formData.get('state')?.toString() || '',
      postcode: formData.get('postcode')?.toString() || '',
      fleetType: formData.get('fleet_type')?.toString() || '',
      quantity: formData.get('quantity')?.toString() || '',
      message: formData.get('notes')?.toString() || '',
      subject: `Commercial Fleet Tender: ${formData.get('organization') || 'Fleet Enquiry'}`,
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

      // Also forward to Web3Forms if an active custom key exists
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
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <FadeUpText delay={0.05} className="text-xs uppercase tracking-widest text-[#fbbf24] font-extrabold">
            B2B Commercial Fleet Procurement · Yatala QLD Depot
          </FadeUpText>
          <StaggeredHeading
            tag="h1"
            text="Commercial Fleet & Wholesale Golf Buggy Procurement"
            className="text-3xl sm:text-5xl font-serif font-bold text-[#ffffff] mt-2"
          />
          <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#94a3b8] mt-3 leading-relaxed">
            Supplying Australian PGA golf clubs, 5-star island resorts, council parks, gated communities, and mining industrial facilities with bulk lithium buggy fleets.
          </StaggeredParagraph>
        </div>

        {/* 3 Fleet Tiers */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StaggerItem className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-6 space-y-4 hover:border-[#fbbf24] transition-all shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">
                Tier 1 Fleet
              </span>
              <span className="bg-[#0a0f1d] border border-[#1e2d4d] text-[#ffffff] text-xs font-bold px-2.5 py-1 rounded">
                5 – 9 Units
              </span>
            </div>
            <div className="text-2xl font-serif font-bold text-[#ffffff]">
              12% Volume Discount
            </div>
            <StaggeredParagraph delay={0.1} className="text-xs text-[#94a3b8] leading-relaxed">
              Ideal for boutique 9-hole golf courses, retirement estate shuttle loops, and regional agricultural teams. Includes consolidated freight delivery.
            </StaggeredParagraph>
            <ul className="text-xs text-[#e2e8f0] space-y-2 border-t border-[#152037] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Commercial LiFePO4 battery warranties</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Custom course branding options</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Priority Yatala replacement parts dispatch</span>
              </li>
            </ul>
          </StaggerItem>

          <StaggerItem className="bg-[#101935] border-2 border-[#fbbf24] rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-[#0a0f1d] text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase shadow">
              Most Popular Course Tier
            </div>
            <div className="flex justify-between items-start pt-1">
              <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">
                Tier 2 Fleet
              </span>
              <span className="bg-[#fbbf24] text-[#0a0f1d] text-xs font-extrabold px-2.5 py-1 rounded">
                10 – 19 Units
              </span>
            </div>
            <div className="text-2xl font-serif font-bold text-[#ffffff]">
              18% Volume Discount
            </div>
            <StaggeredParagraph delay={0.1} className="text-xs text-[#94a3b8] leading-relaxed">
              Designed for 18-hole championship courses and major resort complexes upgrading entire legacy lead-acid fleets to zero-maintenance lithium.
            </StaggeredParagraph>
            <ul className="text-xs text-[#e2e8f0] space-y-2 border-t border-[#152037] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Complimentary on-site staff training</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Fleet GPS geofencing integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Scheduled 12-month preventive service checks</span>
              </li>
            </ul>
          </StaggerItem>

          <StaggerItem className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-6 space-y-4 hover:border-[#fbbf24] transition-all shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">
                Tier 3 Enterprise
              </span>
              <span className="bg-[#0a0f1d] border border-[#1e2d4d] text-[#ffffff] text-xs font-bold px-2.5 py-1 rounded">
                20+ Units
              </span>
            </div>
            <div className="text-2xl font-serif font-bold text-[#ffffff]">
              Custom Tender Pricing
            </div>
            <StaggeredParagraph delay={0.1} className="text-xs text-[#94a3b8] leading-relaxed">
              Full enterprise contract for multi-course operations, university campuses, and municipal councils. Includes dedicated Yatala technician SLA.
            </StaggeredParagraph>
            <ul className="text-xs text-[#e2e8f0] space-y-2 border-t border-[#152037] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Dedicated mobile service technician SLA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Custom utility conversions &amp; medical beds</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Direct trade-in credit for decommissioned carts</span>
              </li>
            </ul>
          </StaggerItem>
        </StaggerContainer>

        {/* Wholesale Inquiry Form */}
        <AnimatedCard delay={0.15} className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
          <StaggeredHeading
            tag="h2"
            text="Request Commercial Fleet Specification & Tender Proposal"
            className="text-xl font-serif font-bold text-[#ffffff] mb-2"
          />
          <StaggeredParagraph delay={0.1} className="text-xs text-[#94a3b8] mb-6">
            Our Yatala engineering directors will review your requirement, calculate terrain power demands, and provide an itemized Australian Tax Invoice breakdown.
          </StaggeredParagraph>

          <form onSubmit={handleWholesaleSubmit} className="space-y-4 text-xs">
            <input type="hidden" name="access_key" value={FORMS.web3formsKey || 'PENDING'} />
            <input type="hidden" name="subject" value="Commercial Fleet Tender Request" />
            <input type="hidden" name="from_name" value="Wholesale Portal - The Buggies Express" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="w-org" className="block font-semibold text-[#ffffff] mb-1">
                  Company / Golf Club / Facility Name *
                </label>
                <input
                  type="text"
                  id="w-org"
                  name="organization"
                  required
                  placeholder="e.g. Sanctuary Cove Golf Club"
                  className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <div>
                <label htmlFor="w-abn" className="block font-semibold text-[#ffffff] mb-1">
                  ABN / ACN
                </label>
                <input
                  type="text"
                  id="w-abn"
                  name="abn"
                  placeholder="Australian Business Number"
                  className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="w-name" className="block font-semibold text-[#ffffff] mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  id="w-name"
                  name="name"
                  required
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <div>
                <label htmlFor="w-email" className="block font-semibold text-[#ffffff] mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="w-email"
                  name="email"
                  required
                  placeholder="fleet@domain.com.au"
                  className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <div>
                <label htmlFor="w-phone" className="block font-semibold text-[#ffffff] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="w-phone"
                  name="phone"
                  required
                  placeholder="0400 000 000"
                  className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="w-units" className="block font-semibold text-[#ffffff] mb-1">
                  Estimated Fleet Quantity Required
                </label>
                <select
                  id="w-units"
                  name="quantity"
                  className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                >
                  <option value="5-9">5 – 9 Units (Tier 1 Discount)</option>
                  <option value="10-19">10 – 19 Units (Tier 2 Discount)</option>
                  <option value="20-49">20 – 49 Units (Enterprise Tender)</option>
                  <option value="50+">50+ Units (Major Course Refit)</option>
                </select>
              </div>

              <div>
                <label htmlFor="w-type" className="block font-semibold text-[#ffffff] mb-1">
                  Primary Vehicle Type
                </label>
                <select
                  id="w-type"
                  name="vehicle_type"
                  className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                >
                  <option value="2-seater-golf">2-Passenger Course Buggies (48V Lithium)</option>
                  <option value="4-seater-guest">4-Passenger Guest Shuttles</option>
                  <option value="6-8-seater">6 or 8-Passenger Hospitality Shuttles</option>
                  <option value="commercial-tray">Commercial Cargo Utilities with Dropside Trays</option>
                  <option value="mixed-fleet">Mixed Fleet Combination</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="w-details" className="block font-semibold text-[#ffffff] mb-1">
                Specific Fleet Notes / Site Delivery Requirements
              </label>
              <textarea
                id="w-details"
                name="details"
                rows={3}
                placeholder="Mention delivery location, desired rollout timeframe, trade-in carts to evaluate, or specific charger voltage..."
                className="w-full px-3.5 py-2.5 bg-[#0a0f1d] border border-[#1e2d4d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
              ></textarea>
            </div>

            {statusMsg && (
              <div className="p-3 bg-[#0a0f1d] border border-[#fbbf24] text-[#ffffff] rounded-lg text-xs">
                {statusMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Building2 className="w-4 h-4" />
              <span>{submitting ? 'Transmitting Tender...' : 'Submit Commercial Fleet Enquiry'}</span>
            </button>
          </form>
        </AnimatedCard>
      </main>

      <Footer />
      <ChatHub />
    </div>
  );
}
