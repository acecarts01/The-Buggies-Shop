'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import SmartImage from '@/src/components/SmartImage';
import { 
  ShieldCheck, 
  Truck, 
  Phone, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Zap,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  Compass,
  Award,
  BookOpen,
  Clock
} from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import ChatHub from '@/src/components/ChatHub';
import CatalogInterface from '@/src/components/CatalogInterface';
import AnnouncementBar from '@/src/components/AnnouncementBar';
import ReviewsCarousel from '@/src/components/ReviewsCarousel';
import { 
  StaggeredHeading, 
  StaggeredParagraph,
  FadeUpText, 
  RotatingWords, 
  AnimatedCounter, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedBadge,
  AnimatedCard
} from '@/src/components/AnimatedText';
import { motion } from 'motion/react';
import { ABN_INFO, CONTACT, SITE, SHOP, FAQ, BRAND, ProductItem, POSTS } from '@/src/config/site';

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SITE.cartKey);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Save cart to localStorage with useCallback
  const saveCart = useCallback((newItems: CartItem[]) => {
    setCartItems(newItems);
    try {
      localStorage.setItem(SITE.cartKey, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  }, []);

  const handleAddToCart = useCallback((product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price_aud: product.price_aud,
            price_display: product.price_display,
            quantity: 1,
            category: product.category,
          },
        ];
      }
      try {
        localStorage.setItem(SITE.cartKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setCartOpen(true);
  }, []);

  const handleUpdateQty = useCallback((id: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
      try {
        localStorage.setItem(SITE.cartKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem(SITE.cartKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.setItem(SITE.cartKey, JSON.stringify([]));
    } catch {
      // ignore
    }
  }, []);

  // Schema LD
  const jsonLdStore = {
    '@context': 'https://schema.org',
    '@type': ['Store', 'Organization'],
    name: SITE.name,
    legalName: ABN_INFO.companyName,
    description: BRAND.description,
    foundingDate: BRAND.foundingYear,
    foundingLocation: { '@type': 'Place', name: BRAND.foundingLocation },
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address,
      addressLocality: 'Yatala',
      addressRegion: 'QLD',
      postalCode: '4207',
      addressCountry: 'AU',
    },
    url: `https://${SITE.domain}/`,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    areaServed: ['AU-QLD', 'AU-NSW', 'AU-VIC', 'AU-SA', 'AU-WA', 'AU-TAS', 'AU-NT', 'AU-ACT'],
    numberOfItems: 61,
    knowsAbout: [
      'Golf Buggies Australia',
      'Electric Golf Carts',
      '4-Seater Lithium Golf Buggies',
      'Lifted 4x4 Acreage Carts',
      'Commercial Utility Vehicles',
      'Lithium Conversion Batteries',
    ],
    priceRange: '$1,299 - $27,900 AUD',
    brand: { '@type': 'Brand', name: SITE.name },
    makesOffer: {
      '@type': 'AggregateOffer',
      priceCurrency: 'AUD',
      lowPrice: 1299,
      highPrice: 27900,
      offerCount: 61,
    },
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.slice(0, 5).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      {/* Structural JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStore) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Skip to Main Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[#B45A40] text-white px-4 py-2 rounded-lg font-extrabold z-50 text-xs shadow-xs hover:-translate-y-px duration-200 transition-all"
      >
        Skip to main content
      </a>

      <div className="flex flex-col min-h-screen bg-[#F7F6F2]">
        {/* Isolated Rotating Announcement Bar (Zero Parent Re-renders) */}
        <AnnouncementBar />

        {/* Global Navigation Header with ABN Direct Verification Link */}
        <Header
          cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
          onOpenCart={() => setCartOpen(true)}
        />

        {/* Main Content Landmark */}
        <main id="main-content" className="flex-1">
          {/* Hero Section with Exactly One H1 */}
          <section className="relative overflow-hidden bg-[#F7F6F2] border-b border-[#E7E5E4] py-14 lg:py-20 lg:min-h-[70vh] lg:flex lg:items-center px-4 sm:px-6 lg:px-8">
            {/* Hero photograph. object-position keeps the buggy clear of the
                copy; the scrim is near-opaque where text sits and thins out
                to the right so the vehicle still reads. */}
            <div className="absolute inset-x-0 top-0 h-[480px] lg:inset-0 lg:h-auto">
              <SmartImage
                src="/images/hero-1920.webp"
                alt="Six-seater lifted lithium golf buggy on an Australian fairway"
                fill
                priority
                className="object-cover object-[58%_center] lg:object-[68%_center] hero-drift"
                sizes="100vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,246,242,0.62)_0%,rgba(247,246,242,0.58)_40%,rgba(247,246,242,0.88)_82%,#F7F6F2_100%)] lg:bg-[linear-gradient(96deg,#F7F6F2_0%,rgba(247,246,242,0.97)_26%,rgba(247,246,242,0.72)_42%,rgba(247,246,242,0.28)_58%,rgba(247,246,242,0.04)_74%,transparent_100%)]"
              />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <AnimatedBadge className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E7E5E4] text-xs font-bold text-[#C86D51] shadow-xs surface-card">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Yatala QLD Depot • ABN 28 668 598 758</span>
                </AnimatedBadge>

                {/* Single H1 Mandated for SEO and Accessibility with Word-by-Word Stagger */}
                <StaggeredHeading
                  tag="h1"
                  text="Australia's Most Complete Golf Buggy Specialists — Sales, Service & Custom Builds"
                  className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#121417] tracking-tight leading-tight"
                />

                <FadeUpText delay={0.15} className="text-base sm:text-lg text-[#C86D51] font-serif font-medium leading-snug flex flex-wrap items-center gap-1.5">
                  <span>Precision engineered for</span>
                  <RotatingWords
                    words={[
                      'private golf estates',
                      'sprawling acreage properties',
                      'rural country clubs',
                      'commercial resort fleets',
                    ]}
                  />
                  <span>nationwide.</span>
                </FadeUpText>

                <StaggeredParagraph delay={0.2} className="text-xs sm:text-sm text-[#78716C] leading-relaxed max-w-2xl">
                  {BRAND.description} Headquartered in our central Yatala QLD engineering center with 61+ models in stock—from 72V lithium 4-passenger buggies to lifted 4x4 acreage transports and walk-behind MGI motorized units.
                </StaggeredParagraph>

                {/* Hero CTAs */}
                <FadeUpText delay={0.35} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href="#catalog-explorer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B45A40] hover:bg-[#9A4C36] text-white text-xs sm:text-sm font-extrabold rounded-lg transition-all shadow-xs active:scale-95 hover:-translate-y-px duration-200"
                    id="hero-explore-catalog-cta"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Explore 61 Models for Sale</span>
                  </a>

                  <Link
                    href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#C86D51] bg-white text-[#C86D51] text-xs sm:text-sm font-bold rounded-lg hover:bg-[#F7EFEA] transition-colors shadow-xs active:scale-95"
                  >
                    <span>View Atlas 4-Passenger ($20,900)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3.5 border border-[#E7E5E4] bg-white text-[#121417] text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#F7F6F2] transition-colors shadow-xs surface-card"
                  >
                    <Phone className="w-4 h-4 text-[#C86D51]" />
                    <span>0480 804 189</span>
                  </a>
                </FadeUpText>

                {/* Live ABN Verification Callout */}
                <FadeUpText delay={0.45} className="p-3.5 bg-white border border-[#E7E5E4] rounded-xl text-xs text-[#78716C] flex flex-wrap items-center justify-between gap-2 shadow-xs surface-card">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C86D51]" />
                    <span>Official ABN Registry: <strong className="text-[#121417]">{ABN_INFO.abn}</strong> ({ABN_INFO.companyName})</span>
                  </div>
                  <a
                    href={ABN_INFO.officialAbrLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C86D51] underline font-bold inline-flex items-center gap-1 hover:text-[#A85640]"
                  >
                    Verify on abr.business.gov.au
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </FadeUpText>
              </div>

            </div>
          </section>

          {/* Trust Bar (4 Core Operational Guarantees) with Staggered Fade-in */}
          <section className="bg-white border-b border-[#E7E5E4] py-6 px-4">
            <StaggerContainer className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-xs">
              <StaggerItem className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-[#F7F6F2]">
                <div className="w-9 h-9 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51] shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-[#121417]">ASIC ABN Verified</div>
                  <div className="text-[11px] text-[#78716C]">ABN 28 668 598 758</div>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-[#F7F6F2]">
                <div className="w-9 h-9 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51] shrink-0 shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-[#121417]">Enclosed Nationwide Freight</div>
                  <div className="text-[11px] text-[#78716C]">Direct to homestead or club</div>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-[#F7F6F2]">
                <div className="w-9 h-9 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51] shrink-0 shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-[#121417]">Direct Orders &amp; Dispatch</div>
                  <div className="text-[11px] text-[#78716C]">Direct delivery Australia-wide</div>
                </div>
              </StaggerItem>

              <StaggerItem className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-[#F7F6F2]">
                <div className="w-9 h-9 rounded-lg bg-[#F7EFEA] border border-[#E8D2C6] flex items-center justify-center text-[#C86D51] shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-[#121417]">10% Crypto Incentive</div>
                  <div className="text-[11px] text-[#78716C]">Save on BTC &amp; USDT payments</div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </section>

          {/* The Complete 61-Product Catalog Component with High-Ticket Rules */}
          <CatalogInterface onAddToCart={handleAddToCart} showcase />

          {/* Trustpilot Standard Customer Reviews Sliding Carousel */}
          <ReviewsCarousel />

          {/* Homepage Authority Section: About Golf Buggies Express PTY LTD */}
          <section className="py-16 bg-[#F7F6F2] border-t border-[#E7E5E4] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <FadeUpText className="text-xs uppercase font-extrabold tracking-wider text-[#C86D51]">
                  Operational Facility &amp; Australian Heritage
                </FadeUpText>
                
                <StaggeredHeading
                  tag="h2"
                  text="About Golf Buggies Express PTY LTD"
                  className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#121417] tracking-tight"
                />

                <StaggeredParagraph delay={0.1} className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                  Founded and registered in 2023 under Australian Securities and Investments Commission (ASIC) oversight, Golf Buggies Express PTY LTD operates from the Yatala Industrial Corridor in South East Queensland. We established our central distribution depot to solve a chronic problem in the Australian market: lack of genuine spare parts backup, poor after-sales warranty support, and fragile carts unfit for rural acreage.
                </StaggeredParagraph>

                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <StaggerItem className="p-3.5 bg-white border border-[#E7E5E4] rounded-xl space-y-1 shadow-xs hover:border-[#C86D51]/40 transition-colors surface-card">
                    <div className="font-bold text-[#121417] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C86D51]" />
                      <span>In-House Engineering Depot</span>
                    </div>
                    <p className="text-[#78716C]">
                      Every vehicle undergoes strict pre-delivery inspection, brake dynamometer testing, and lithium cell balancing in Yatala.
                    </p>
                  </StaggerItem>

                  <StaggerItem className="p-3.5 bg-white border border-[#E7E5E4] rounded-xl space-y-1 shadow-xs hover:border-[#C86D51]/40 transition-colors surface-card">
                    <div className="font-bold text-[#121417] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C86D51]" />
                      <span>True One-Stop Australian Shop</span>
                    </div>
                    <p className="text-[#78716C]">
                      New vehicles, fleet sales, custom lift kits, lithium retrofits, and spare parts under one roof.
                    </p>
                  </StaggerItem>
                </StaggerContainer>

                <FadeUpText delay={0.2} className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                  <Link
                    href="/about/"
                    className="inline-flex items-center gap-1.5 text-[#C86D51] font-bold hover:underline group"
                  >
                    <span>Read our full company story and Yatala workshop details</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </FadeUpText>
              </div>

              {/* Entity Facts Grid (AI Visibility & Authority) */}
              <FadeUpText delay={0.15} className="lg:col-span-5 bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-4 text-xs shadow-xs surface-card">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#C86D51] border-b border-[#E7E5E4] pb-2">
                  Australian Business Register Verification
                </div>

                <div className="space-y-2.5 text-[#121417]">
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Legal Entity Name:</span>
                    <span className="font-bold text-[#121417]">{ABN_INFO.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Australian Company Number (ACN):</span>
                    <span className="font-mono">{ABN_INFO.acn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#78716C]">Australian Business Number (ABN):</span>
                    <a
                      href={ABN_INFO.officialAbrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-[#C86D51] underline inline-flex items-center gap-1"
                    >
                      {ABN_INFO.abn}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Registration Date:</span>
                    <span>{ABN_INFO.registrationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Entity Status:</span>
                    <span className="text-[#C86D51] font-bold">{ABN_INFO.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Registered Office Locality:</span>
                    <span>{ABN_INFO.locality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Governing Regulator:</span>
                    <span>{ABN_INFO.regulator}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E7E5E4] text-[11px] text-[#78716C]">
                  Verification records are publicly accessible via the Australian Government Business Register.
                </div>
              </FadeUpText>
            </div>
          </section>

          {/* Direct Order & Freight Dispatch Section with Animated Callout */}
          <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-[#E7E5E4]" id="order-section">
            <FadeUpText className="max-w-4xl mx-auto bg-[#F7F6F2] border-2 border-[#C86D51] rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7EFEA] border border-[#E8D2C6] text-xs font-bold text-[#C86D51]">
                <Zap className="w-3.5 h-3.5" />
                <span>Ready for Direct Dispatch</span>
              </div>

              <StaggeredHeading
                tag="h2"
                text="Order Direct from Yatala QLD with Nationwide Freight"
                className="text-2xl sm:text-3xl font-serif font-bold text-[#121417] tracking-tight"
              />

              <StaggeredParagraph delay={0.1} className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto leading-relaxed">
                Choose your buggy, battery architecture, and tailored accessories. We coordinate door-to-door enclosed trailer delivery directly to your property or course across regional Queensland, New South Wales, Victoria, and nationwide.
              </StaggeredParagraph>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/shop/"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#B45A40] hover:bg-[#9A4C36] text-white font-extrabold text-xs rounded-lg transition-all shadow-xs tracking-wide active:scale-95 hover:-translate-y-px duration-200"
                  id="home-order-now-cta-btn"
                >
                  Order Now
                </Link>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="w-full sm:w-auto px-5 py-3.5 border border-[#E7E5E4] bg-white text-[#121417] text-xs font-bold rounded-lg hover:bg-[#F7EFEA] transition-colors shadow-xs surface-card"
                >
                  Message Yatala Operations: 0480 804 189
                </a>
              </div>
            </FadeUpText>
          </section>

          {/* Technical Guides & Expert Advice Section */}
          <section className="py-16 bg-[#F7F6F2] border-t border-[#E7E5E4] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <FadeUpText className="text-xs uppercase font-extrabold tracking-wider text-[#C86D51] flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-4 h-4 text-[#C86D51]" />
                    <span>Australian Buyer &amp; Technical Guides</span>
                  </FadeUpText>
                  
                  <StaggeredHeading
                    tag="h2"
                    text="Latest Buggy Guides & Tech Advice"
                    className="text-2xl sm:text-3xl font-serif font-bold text-[#121417] tracking-tight"
                  />

                  <StaggeredParagraph delay={0.1} className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-2xl">
                    In-depth articles from our Yatala QLD technicians covering 48V LiFePO4 battery performance, conditional road registration, and farm acreage specs.
                  </StaggeredParagraph>
                </div>

                <Link
                  href="/blog/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#E7E5E4] hover:border-[#C86D51] text-xs font-bold text-[#121417] hover:text-[#C86D51] transition-all shrink-0 shadow-xs group surface-card"
                >
                  <span>View All Guides ({POSTS.length})</span>
                  <ArrowRight className="w-4 h-4 text-[#C86D51] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {POSTS.slice(0, 3).map((post) => (
                  <StaggerItem
                    key={post.slug}
                    className="bg-white border border-[#E7E5E4] rounded-xl p-6 flex flex-col justify-between hover:border-[#C86D51]/60 hover:shadow-xs transition-all group shadow-xs surface-card"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] mb-3">
                        <span className="px-2.5 py-0.5 rounded bg-[#F7EFEA] border border-[#E8D2C6] text-[#C86D51] font-semibold">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-[#78716C]">
                          <Clock className="w-3 h-3 text-[#C86D51]" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-[#121417] group-hover:text-[#C86D51] transition-colors leading-snug line-clamp-2">
                        <Link href={`/blog/${post.slug}/`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs text-[#78716C] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
                      <span className="text-[11px] text-[#78716C]">{post.author.name}</span>
                      <Link
                        href={`/blog/${post.slug}/`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#C86D51] group-hover:text-[#A85640] transition-colors"
                      >
                        <span>Read Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Frequently Asked Questions (FAQ Section with Direct Answers) */}
          <section className="py-16 bg-white border-t border-[#E7E5E4] px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <FadeUpText className="text-xs uppercase font-extrabold tracking-wider text-[#C86D51]">
                  Clear Answers for Australian Buyers
                </FadeUpText>
                
                <StaggeredHeading
                  tag="h2"
                  text="Frequently Asked Questions"
                  className="text-2xl sm:text-3xl font-serif font-bold text-[#121417] tracking-tight"
                />

                <StaggeredParagraph delay={0.1} className="text-xs text-[#78716C]">
                  Essential guidance on lithium maintenance, enclosed freight delivery, and ABN invoicing.
                </StaggeredParagraph>
              </div>

              <StaggerContainer className="space-y-4">
                {FAQ.map((faq, idx) => (
                  <StaggerItem key={idx}>
                    <details
                      className="group bg-[#F7F6F2] border border-[#E7E5E4] rounded-xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden transition-all hover:border-[#C86D51]/40 surface-card"
                    >
                      <summary className="flex items-center justify-between gap-3 cursor-pointer text-sm font-semibold text-[#121417] group-open:text-[#C86D51]">
                        <span>{faq.question}</span>
                        <span className="text-[#C86D51] shrink-0 text-lg font-bold group-open:rotate-45 transition-transform">
                          +
                        </span>
                      </summary>
                      <p className="text-xs text-[#78716C] mt-3 leading-relaxed pt-2 border-t border-[#E7E5E4]">
                        {faq.answer}
                      </p>
                    </details>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Slide-over Cart Drawer */}
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        {/* Floating Quick Support Hub */}
        <ChatHub />
      </div>
    </>
  );
}
