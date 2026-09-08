import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { CONTACT } from '@/src/config/site';

export const metadata = {
  title: 'Commercial Fleet Request Lodged | The Buggies Express Yatala QLD',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouWholesalePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d]">
      <Header />

      <main id="main" className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#101935] border border-[#1e2d4d] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#0a0f1d] border border-[#fbbf24] rounded-full flex items-center justify-center mx-auto text-[#fbbf24]">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#ffffff]">
              Commercial Tender Lodged
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Your bulk fleet specification has been allocated to our Commercial Operations team in Yatala QLD. A technical tender proposal will be prepared for your board or management.
            </p>
          </div>

          <div className="p-4 bg-[#0a0f1d] rounded-xl border border-[#152037] text-xs text-left space-y-2">
            <div className="text-[#fbbf24] font-extrabold">Priority Tender Line:</div>
            <div className="text-[#e2e8f0] text-[11px] leading-relaxed">
              If your club or resort has an urgent committee meeting, contact our director directly at <a href={`tel:${CONTACT.phone}`} className="text-[#fbbf24] font-bold hover:underline">0480 408 189</a>.
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] text-xs font-extrabold rounded-lg transition-all shadow-lg"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
