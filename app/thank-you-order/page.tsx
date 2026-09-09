import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { ABN_INFO, CONTACT } from '@/src/config/site';

export const metadata = {
  title: 'Order Request Confirmed | The Buggies Express Yatala QLD',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouOrderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121417]">
      <Header />

      <main id="main" className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-8 text-center space-y-6 shadow-sm metal-brushed-dark">
          <div className="w-16 h-16 bg-[#121417] border border-[#E2A17A] rounded-full flex items-center justify-center mx-auto text-[#E2A17A]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#ffffff] tracking-tight">
              Order Manifest Transmitted
            </h1>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              Your vehicle specifications and delivery postcode have been lodged with our Yatala dispatch office. An official Australian Tax Invoice including GST will be generated.
            </p>
          </div>

          <div className="p-4 bg-[#121417] rounded-xl border border-[#1F2226] text-xs text-left space-y-2">
            <div className="flex items-center gap-2 text-[#E2A17A] font-extrabold">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Next Steps:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#E7E5E4] text-[11px] leading-relaxed">
              <li>Our dispatch director verifies exact vehicle stock at Yatala.</li>
              <li>Enclosed freight quote confirmed to your delivery address.</li>
              <li>Official invoice issued with direct EFT PayID or BTC/USDT discount.</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/shop/"
              className="flex-1 py-3 bg-[#121417] text-[#ffffff] text-xs font-bold rounded-lg hover:bg-[#AEB4B8]/20 transition-all flex items-center justify-center gap-1.5 border border-[#2B2F34]"
            >
              <span>Back to Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={`https://wa.me/61480804189?text=${encodeURIComponent(
                'Hello The Buggies Express, I have submitted an order manifest online and would like to confirm invoice details.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-[#25D366] text-[#121417] text-xs font-extrabold rounded-lg hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Confirm on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
