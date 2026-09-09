import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { CONTACT } from '@/src/config/site';

export const metadata = {
  title: 'Enquiry Received | The Buggies Express Yatala QLD',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d]">
      <Header />

      <main id="main" className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#101935] border border-[#1e2d4d] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#0a0f1d] border border-[#38bdf8] rounded-full flex items-center justify-center mx-auto text-[#38bdf8]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#ffffff]">
              Enquiry Received at Yatala Depot
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Thank you for reaching out. A Golf Buggies Express specialist has received your specifications and will respond within 2 to 4 business hours.
            </p>
          </div>

          <div className="p-4 bg-[#0a0f1d] rounded-xl border border-[#152037] text-xs space-y-2">
            <div className="text-[#fbbf24] font-extrabold">Need an immediate answer?</div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
              <a
                href={`tel:${CONTACT.phone}`}
                className="px-3 py-1.5 bg-[#101935] text-[#ffffff] rounded hover:bg-[#38bdf8]/20 transition-all flex items-center justify-center gap-1.5 font-bold border border-[#1e2d4d]"
              >
                <Phone className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>0480 804 189</span>
              </a>
              <a
                href={`https://wa.me/61480804189`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#25D366] text-[#0a0f1d] rounded hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-1.5 font-bold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] text-xs font-extrabold rounded-lg transition-all shadow-lg"
            >
              <span>Return to Buggy Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
