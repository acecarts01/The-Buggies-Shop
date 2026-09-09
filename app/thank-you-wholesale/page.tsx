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
    <div className="flex flex-col min-h-screen bg-[#121417]">
      <Header />

      <main id="main" className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-8 text-center space-y-6 shadow-sm metal-brushed-dark">
          <div className="w-16 h-16 bg-[#121417] border border-[#E2A17A] rounded-full flex items-center justify-center mx-auto text-[#E2A17A]">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#ffffff] tracking-tight">
              Commercial Tender Lodged
            </h1>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Your bulk fleet specification has been allocated to our Commercial Operations team in Yatala QLD. A technical tender proposal will be prepared for your board or management.
            </p>
          </div>

          <div className="p-4 bg-[#121417] rounded-xl border border-[#1F2226] text-xs text-left space-y-2">
            <div className="text-[#E2A17A] font-extrabold">Priority Tender Line:</div>
            <div className="text-[#E7E5E4] text-[11px] leading-relaxed">
              If your club or resort has an urgent committee meeting, contact our director directly at <a href={`tel:${CONTACT.phone}`} className="text-[#E2A17A] font-bold hover:underline">0480 804 189</a>.
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C86D51] to-[#E2A17A] hover:from-[#E2A17A] hover:to-[#EFC7A6] text-[#121417] text-xs font-extrabold rounded-lg transition-all shadow-xs"
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
