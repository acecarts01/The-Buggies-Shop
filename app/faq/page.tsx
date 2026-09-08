'use client';

import React, { useState } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import { FAQ, SITE } from '@/src/config/site';
import { ChevronDown, HelpCircle, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import {
  StaggeredHeading,
  StaggeredParagraph,
  FadeUpText,
  AnimatedCard,
  StaggerContainer,
  StaggerItem
} from '@/src/components/AnimatedText';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${SITE.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: `https://${SITE.domain}/faq/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="flex flex-col min-h-screen bg-[#0a0f1d]">
      <Header />

        <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          {/* Exactly One H1 */}
          <div className="text-center mb-10 space-y-2">
            <FadeUpText delay={0.05} className="text-xs uppercase tracking-widest text-[#fbbf24] font-extrabold">
              Australian Golf Buggy Knowledge Base
            </FadeUpText>
            <StaggeredHeading
              tag="h1"
              text="Frequently Asked Questions — Golf Buggies Australia"
              className="text-3xl sm:text-4xl font-serif font-bold text-[#ffffff] mt-1"
            />
            <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#94a3b8] mt-2">
              Authoritative technical and commercial guidance from our engineering team in Yatala, Queensland.
            </StaggeredParagraph>
          </div>

          <StaggerContainer className="space-y-4">
            {FAQ.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <StaggerItem
                  key={index}
                  className="bg-[#101935] border border-[#1e2d4d] rounded-xl overflow-hidden transition-all shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                      <span className="font-serif font-bold text-sm sm:text-base text-[#ffffff]">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#fbbf24] transition-transform flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#94a3b8] leading-relaxed border-t border-[#152037]">
                      {item.answer}
                    </div>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Further Help Contact Card */}
          <AnimatedCard delay={0.2} className="mt-12 p-6 rounded-2xl bg-[#101935] border border-[#1e2d4d] text-center space-y-4 shadow-xl">
            <StaggeredHeading
              tag="h2"
              text="Have a Specific Technical Question About Your Course or Property?"
              className="text-lg font-serif font-bold text-[#ffffff]"
            />
            <StaggeredParagraph delay={0.1} className="text-xs text-[#94a3b8] max-w-md mx-auto">
              Our Yatala workshop team can calculate battery range for your specific topography or advise on local conditional registration.
            </StaggeredParagraph>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href="tel:0480408189"
                className="px-5 py-2.5 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call 0480 408 189</span>
              </a>
              <Link
                href="/contact/"
                className="px-5 py-2.5 bg-[#0a0f1d] text-[#ffffff] text-xs font-bold rounded-lg hover:bg-[#38bdf8]/20 transition-all border border-[#1e2d4d]"
              >
                Send Message to Depot
              </Link>
            </div>
          </AnimatedCard>
        </main>

        <Footer />
        <ChatHub />
      </div>
    </>
  );
}
