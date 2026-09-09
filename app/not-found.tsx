'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121417]">
      <Header />

      <main id="main" className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-8 text-center space-y-6 shadow-sm metal-brushed-dark">
          <div className="w-16 h-16 bg-[#121417] border border-[#E2A17A] rounded-full flex items-center justify-center mx-auto text-[#E2A17A]">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#E2A17A] font-extrabold">
              404 Error
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#ffffff] tracking-tight">
              Buggy Model or Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              The page you requested may have moved or the vehicle listing has been updated in our Yatala fleet database.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop/"
              className="px-6 py-3 bg-gradient-to-r from-[#C86D51] to-[#E2A17A] hover:from-[#E2A17A] hover:to-[#EFC7A6] text-[#121417] text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <span>Explore 61 Buggies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-[#121417] text-[#ffffff] text-xs font-bold rounded-lg hover:bg-[#AEB4B8]/20 transition-all border border-[#2B2F34] flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
