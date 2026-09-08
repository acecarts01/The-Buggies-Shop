'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d]">
      <Header />

      <main id="main" className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#101935] border border-[#1e2d4d] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#0a0f1d] border border-[#fbbf24] rounded-full flex items-center justify-center mx-auto text-[#fbbf24]">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#fbbf24] font-extrabold">
              404 Error
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#ffffff]">
              Buggy Model or Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              The page you requested may have moved or the vehicle listing has been updated in our Yatala fleet database.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop/"
              className="px-6 py-3 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <span>Explore 61 Buggies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-[#0a0f1d] text-[#ffffff] text-xs font-bold rounded-lg hover:bg-[#38bdf8]/20 transition-all border border-[#1e2d4d] flex items-center justify-center"
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
