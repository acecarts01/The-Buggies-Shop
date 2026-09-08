'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  Phone, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Award,
  ArrowRight,
  BatteryCharging,
  Battery,
  FileText,
  X,
  Check
} from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import ChatHub from '@/src/components/ChatHub';
import ProductReviews from '@/src/components/ProductReviews';
import { ProductItem, SITE, ABN_INFO, CONTACT, SHOP, CATEGORIES, PRODUCTS, isAccessoryItem } from '@/src/config/site';
import {
  StaggeredHeading,
  StaggeredParagraph,
  FadeUpText,
  AnimatedCard,
  StaggerContainer,
  StaggerItem
} from '@/src/components/AnimatedText';

interface ProductClientProps {
  product: ProductItem;
}

export default function ProductClient({ product }: ProductClientProps) {
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
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    postcode: '',
    deliveryPreference: 'Door-to-Door Enclosed Freight',
    notes: '',
  });

  const saveCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    try {
      localStorage.setItem(SITE.cartKey, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const handleAddToCart = () => {
    const existing = cartItems.find((i) => i.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cartItems.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [
        ...cartItems,
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
    saveCart(updated);
    setCartOpen(true);
  };

  const isHighTicket = product.price_aud >= 15000;

  // Battery Technology Details
  const getBatteryDetails = () => {
    const rawText = `${product.fuel_type} ${product.key_specs} ${product.name}`.toLowerCase();
    
    if (rawText.includes('lithium') || rawText.includes('lifepo4') || rawText.includes('li-ion')) {
      const voltage = rawText.includes('72v') 
        ? '72V' 
        : rawText.includes('48v') 
        ? '48V' 
        : rawText.includes('36v') 
        ? '36V' 
        : 'Commercial Lithium';
      
      return {
        tech: 'lithium',
        title: `${voltage} LiFePO4 Zero-Maintenance Lithium`,
        badgeText: 'Zero-Maintenance Lithium Architecture',
        subtext: 'No acid spills • Zero water replenishment • Rapid 2.5-hour charging • 3,500+ lifecycle rating',
        badgeBg: 'bg-[#0b3327] border-[#22c55e]/40 text-[#86efac]',
        pillBg: 'bg-[#22c55e]/20 text-[#86efac] border border-[#22c55e]/30',
        isZeroMaintenance: true,
      };
    }

    if (rawText.includes('lead-acid') || rawText.includes('agm') || rawText.includes('deep cycle') || rawText.includes('lead acid') || (rawText.includes('electric') && !rawText.includes('lithium'))) {
      const voltage = rawText.includes('48v') ? '48V' : rawText.includes('36v') ? '36V' : 'Electric';
      return {
        tech: 'lead-acid',
        title: `${voltage} Heavy-Duty Deep-Cycle AGM / Lead-Acid`,
        badgeText: 'Traditional Deep-Cycle System',
        subtext: 'Robust proven deep-cycle architecture • Requires standard periodic cell monitoring',
        badgeBg: 'bg-[#152420] border-[#4b5563] text-[#9ca3af]',
        pillBg: 'bg-[#374151]/30 text-[#9ca3af] border border-[#4b5563]',
        isZeroMaintenance: false,
      };
    }

    return {
      tech: 'petrol',
      title: 'Electronic Fuel Injection (EFI) Petrol',
      badgeText: 'Combustion Engine',
      subtext: 'High-torque petrol powertrain • Conventional mechanical maintenance',
      badgeBg: 'bg-[#201815] border-[#854d0e] text-[#fcd34d]',
      pillBg: 'bg-[#854d0e]/20 text-[#fcd34d] border border-[#854d0e]/40',
      isZeroMaintenance: false,
    };
  };

  const battery = getBatteryDetails();

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);

    // Send quote request directly to Yatala Zoho sales desk
    fetch('/api/contact/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        formType: 'quote',
        name: quoteForm.name,
        phone: quoteForm.phone,
        postcode: quoteForm.postcode,
        buggyModel: product.name,
        subject: `Official Quote Request: ${product.name}`,
        message: `Quote Request for ${product.name} (${product.price_display} AUD)\nDelivery Preference: ${quoteForm.deliveryPreference}\nNotes: ${quoteForm.notes || 'None'}`,
      }),
    }).catch(() => {});

    const text = encodeURIComponent(
      `Hello The Buggies Express team, I would like an official Australian Tax Quote & Freight Logistics estimate for:
Model: ${product.name} (${product.price_display} AUD)
Customer: ${quoteForm.name}
Phone: ${quoteForm.phone}
Postcode: ${quoteForm.postcode}
Delivery Preference: ${quoteForm.deliveryPreference}
Notes: ${quoteForm.notes || 'None'}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/61480408189?text=${text}`, '_blank');
    }, 1200);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-[#ffffff]">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[#1e2d4d] bg-[#101935] py-3 px-4 sm:px-6 lg:px-8 text-xs text-[#94a3b8]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#fbbf24]">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop/" className="hover:text-[#fbbf24]">
              Shop
            </Link>
            <span>/</span>
            <span className="text-[#ffffff] font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>

        <Header onOpenCart={() => setCartOpen(true)} />

        <main id="main" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Visual Specs Canvas */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#1e2d4d] pb-3">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#fbbf24]">
                    {product.category}
                  </span>
                  <span className="text-xs text-[#94a3b8]">
                    Model ID: {product.id}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl flex items-center justify-center text-center">
                    <div>
                      <div className="font-serif text-xl font-bold text-[#fbbf24]">
                        {product.name}
                      </div>
                      <div className="text-xs text-[#94a3b8] mt-1 capitalize">
                        Powertrain Architecture: {product.fuel_type}
                      </div>
                    </div>
                  </div>

                  {/* BATTERY TECHNOLOGY BADGE */}
                  <div className={`p-4 rounded-xl border text-xs ${battery.badgeBg} space-y-1.5`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {battery.isZeroMaintenance ? (
                          <BatteryCharging className="w-5 h-5 text-[#22c55e] shrink-0" />
                        ) : battery.tech === 'lead-acid' ? (
                          <Battery className="w-5 h-5 text-[#9ca3af] shrink-0" />
                        ) : (
                          <Zap className="w-5 h-5 text-[#fcd34d] shrink-0" />
                        )}
                        <span>{battery.title}</span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${battery.pillBg}`}>
                        {battery.isZeroMaintenance ? 'Zero Maintenance' : 'Standard Cycle'}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed">
                      {battery.subtext}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
                      <span>Factory Engineering Specifications</span>
                    </div>
                    <div className="p-4 bg-[#0a0f1d] rounded-lg border border-[#1e2d4d] text-[#d8e6df] leading-relaxed">
                      {product.key_specs}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#0a0f1d] p-4 rounded-xl border border-[#1e2d4d]">
                    <div>
                      <span className="text-[#94a3b8]">Intended Application:</span>
                      <div className="font-semibold text-[#ffffff]">{product.target_audience}</div>
                    </div>
                    <div>
                      <span className="text-[#94a3b8]">Depot Warranty:</span>
                      <div className="font-semibold text-[#fbbf24]">Yatala 3-5 Year Australian Factory Backed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Box */}
              <div className="bg-[#101935] border border-[#1e2d4d] rounded-xl p-5 text-xs space-y-3">
                <div className="font-bold text-[#fbbf24] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Australian Business Register Entity</span>
                </div>
                <p className="text-[#94a3b8] leading-relaxed">
                  Sold and warranted directly by {ABN_INFO.companyName} (ABN {ABN_INFO.abn}). Backed by full Australian Consumer Law guarantees, comprehensive Yatala parts inventory, and enclosed specialist transport.
                </p>
                <div className="pt-1 flex items-center gap-2 text-[#d8e6df]">
                  <Truck className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Door-to-door hydraulic tailgate delivery available Australia-wide.</span>
                </div>
              </div>
            </div>

            {/* Product Pricing & Commercial Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <FadeUpText delay={0.05} className="text-xs uppercase tracking-wider text-[#fbbf24] font-bold">
                  {product.category}
                </FadeUpText>
                {/* Exactly One H1 */}
                <StaggeredHeading
                  tag="h1"
                  text={product.name}
                  className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#ffffff] mt-1"
                />
                <FadeUpText delay={0.15} className="text-xs text-[#94a3b8] mt-1">
                  Targeted for: {product.target_audience}
                </FadeUpText>
              </div>

              {/* Pricing Section */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#101935] to-[#0a0f1d] border border-[#1e2d4d] space-y-3 shadow-lg shadow-slate-950/20">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#fbbf24]">
                    {product.price_display}
                  </span>
                  <span className="text-xs font-semibold text-[#94a3b8]">
                    AUD (GST Included)
                  </span>
                </div>

                {/* Finance in 4 Breakdown Badge */}
                <div className="p-3 bg-[#0c1329] border border-[#fbbf24]/40 rounded-xl text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#fbbf24] text-[#0a0f1d] flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
                      4x
                    </div>
                    <div>
                      <div className="font-bold text-[#ffffff]">
                        or 4 interest-free payments of ${(Math.round((product.price_aud / 4) * 100) / 100).toLocaleString()} AUD
                      </div>
                      <div className="text-[11px] text-[#38bdf8] font-medium">
                        Finance in 4 • 0% Interest • Fast approval on invoice
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#fbbf24] text-[#0a0f1d] shrink-0">
                    Pay in 4
                  </span>
                </div>

                {/* 5% Accessory Bundle Banner */}
                {isAccessoryItem(product.category, product.id, product.name) ? (
                  <div className="p-2.5 bg-[#38bdf8]/15 border border-[#38bdf8]/30 rounded-xl text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span className="text-[#e0f2fe]">
                      <strong className="text-[#38bdf8]">5% Bundle Savings:</strong> Purchase this accessory alongside any golf buggy to automatically receive 5% off!
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#38bdf8]/15 border border-[#38bdf8]/30 rounded-xl text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span className="text-[#e0f2fe]">
                      <strong className="text-[#38bdf8]">5% Accessory Discount:</strong> Any accessories or upgrades purchased with this buggy receive 5% off automatically.
                    </span>
                  </div>
                )}

                <div className="text-xs text-[#38bdf8] font-semibold flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>In Stock at Yatala QLD Operations Depot • Ready for Enclosed Freight</span>
                </div>
              </div>

              {/* Express Acquisition & Quotation Actions */}
              <div className="space-y-4">
                <div className="p-4 bg-[#0c1329] border border-[#fbbf24]/40 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-[#fbbf24] flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Itemized Tax Quote &amp; Freight Logistics</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Request an official written tax quotation including exact door-to-door delivery transit schedules, fleet discount options, and verified transit insurance.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuoteOpen(true);
                      setQuoteSubmitted(false);
                    }}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] text-xs font-extrabold rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                    id="product-request-quote-cta"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Formal Tax Quote &amp; Freight Schedule</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-4 bg-[#38bdf8] hover:bg-[#0284c7] text-[#0a0f1d] text-xs sm:text-sm font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-950/30"
                    id="product-add-cart-cta"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order Manifest</span>
                  </button>

                  <a
                    href={`https://wa.me/61480408189?text=${encodeURIComponent(
                      `Hello The Buggies Express, I would like to consult with a specialist on: ${product.name} (${product.price_display} AUD).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 px-4 bg-[#25D366] text-[#0a0f1d] text-xs sm:text-sm font-extrabold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Specialist</span>
                  </a>
                </div>
              </div>

              {/* 10% Crypto Incentive Notice */}
              <div className="p-3 bg-[#101935] border border-[#1e2d4d] rounded-lg text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#fbbf24]">Pay with Bitcoin or USDT:</span>
                  <div className="text-[11px] text-[#94a3b8]">Save 10% on vehicle price (${Math.round(product.price_aud * 0.1).toLocaleString()} AUD off)</div>
                </div>
                <span className="bg-[#fbbf24] text-[#0a0f1d] text-[10px] font-extrabold px-2 py-1 rounded">
                  10% OFF
                </span>
              </div>

              {/* Direct Yatala Desk Phone */}
              <div className="pt-2 text-xs text-[#94a3b8] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#fbbf24]" />
                <span>Speak directly with our Yatala sales engineers:</span>
                <a href={`tel:${CONTACT.phone}`} className="text-[#ffffff] font-bold hover:text-[#fbbf24]">
                  0480 408 189
                </a>
              </div>
            </div>
          </div>

          {/* Comprehensive Product Description & Engineering Breakdown */}
          <div className="mt-12 space-y-8">
            <AnimatedCard delay={0.1} className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-[#1e2d4d] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0a0f1d] border border-[#38bdf8] text-[10px] font-extrabold text-[#38bdf8]">
                    <FileText className="w-3 h-3" />
                    <span>Comprehensive Technical Overview</span>
                  </div>
                  <StaggeredHeading
                    tag="h2"
                    text="Product Description & Build Architecture"
                    className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff]"
                  />
                </div>
                {product.badge && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30 self-start sm:self-auto">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Long Form Description */}
              <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#cbd5e1] leading-relaxed space-y-4">
                <StaggeredParagraph delay={0.1} className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                  {product.fullDescription || product.shortDescription}
                </StaggeredParagraph>
                {product.shortDescription && product.fullDescription && product.shortDescription !== product.fullDescription && (
                  <StaggeredParagraph delay={0.2} className="text-xs text-[#94a3b8] italic">
                    {product.shortDescription}
                  </StaggeredParagraph>
                )}
              </div>

              {/* 4-Pillar Feature Grid */}
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#1e2d4d]">
                <StaggerItem className="p-4 bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#fbbf24] font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>Powertrain &amp; Motor</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    High-efficiency electric AC / EFI powertrain engineered for rapid torque delivery, silent operation, and Australian temperature resiliency.
                  </p>
                </StaggerItem>

                <StaggerItem className="p-4 bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#38bdf8] font-bold text-xs">
                    <BatteryCharging className="w-4 h-4" />
                    <span>Battery Management</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Zero maintenance LiFePO4 / heavy-duty cycle with smart thermal control, onboard digital gauge, and rapid multi-stage charging.
                  </p>
                </StaggerItem>

                <StaggerItem className="p-4 bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#22c55e] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Chassis &amp; Suspension</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    E-coated steel ladder frame, marine-grade fasteners, and independent double A-arm front suspension for rough turf stability.
                  </p>
                </StaggerItem>

                <StaggerItem className="p-4 bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#f59e0b] font-bold text-xs">
                    <Award className="w-4 h-4" />
                    <span>Depot Backing</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Full spare parts inventory at Yatala QLD depot, 3-5 year factory warranties, and dedicated Australian logistics support.
                  </p>
                </StaggerItem>
              </StaggerContainer>
            </AnimatedCard>

            {/* Product Reviews & Field Reports Component */}
            <ProductReviews product={product} />

            {/* Related Products in this Category */}
            <div className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1e2d4d] pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#ffffff]">
                    Related Vehicles &amp; Upgrades
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    Explore similar configurations and compatible accessories from our Yatala depot inventory.
                  </p>
                </div>
                <Link
                  href="/shop/"
                  className="text-xs text-[#fbbf24] font-bold hover:underline flex items-center gap-1"
                >
                  <span>View All 61</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.price_aud < 1000))
                  .slice(0, 3)
                  .map((relProduct) => {
                    const catSlug = CATEGORIES.find((c) => c.rawCategory === relProduct.category)?.slug || 'luxury-4-seater';
                    return (
                      <div
                        key={relProduct.id}
                        className="bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-[#fbbf24]/50 transition-colors"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-[#38bdf8] font-bold">
                            {relProduct.category}
                          </span>
                          <Link
                            href={`/shop/${catSlug}/${relProduct.slug}/`}
                            className="block font-bold text-sm text-[#ffffff] hover:text-[#fbbf24] line-clamp-1"
                          >
                            {relProduct.name}
                          </Link>
                          <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                            {relProduct.shortDescription || relProduct.key_specs}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#1e2d4d] flex items-center justify-between">
                          <div>
                            <div className="text-base font-serif font-extrabold text-[#fbbf24]">
                              {relProduct.price_display}
                            </div>
                            <div className="text-[9px] text-[#94a3b8]">AUD Inc. GST</div>
                          </div>
                          <Link
                            href={`/shop/${catSlug}/${relProduct.slug}/`}
                            className="px-3 py-1.5 bg-[#101935] hover:bg-[#38bdf8] hover:text-[#0a0f1d] text-[#ffffff] text-xs font-bold rounded border border-[#1e2d4d] transition-all"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </main>

        <Footer />

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQty={(id, delta) => {
            const updated = cartItems
              .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
              .filter((i) => i.quantity > 0);
            saveCart(updated);
          }}
          onRemoveItem={(id) => {
            const updated = cartItems.filter((i) => i.id !== id);
            saveCart(updated);
          }}
          onClearCart={() => saveCart([])}
        />

        {/* Official Quote Modal */}
        {quoteOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#101935] border border-[#fbbf24] rounded-xl max-w-lg w-full p-6 text-[#ffffff] shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => setQuoteOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-[#1e2d4d] text-[#94a3b8] hover:text-[#ffffff]"
                aria-label="Close quote modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0a0f1d] border border-[#fbbf24] text-[10px] font-extrabold text-[#fbbf24]">
                    <FileText className="w-3 h-3" />
                    <span>Official Tax Invoice &amp; Freight Schedule</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#ffffff] mt-1">
                    Request Tax Quotation
                  </h3>
                  <div className="text-xs text-[#94a3b8]">
                    Selected Model: <strong className="text-[#fbbf24]">{product.name}</strong> ({product.price_display} AUD)
                  </div>
                </div>

                {quoteSubmitted ? (
                  <div className="py-8 text-center space-y-3 bg-[#0a0f1d] rounded-lg border border-[#1e2d4d] p-4">
                    <div className="w-12 h-12 rounded-full bg-[#101935] border border-[#fbbf24] flex items-center justify-center mx-auto text-[#fbbf24]">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-[#ffffff]">Quotation Request Prepared</div>
                    <p className="text-xs text-[#94a3b8]">
                      Redirecting directly to our Yatala logistics desk on WhatsApp to confirm delivery options for postcode ({quoteForm.postcode}).
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#94a3b8] mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        placeholder="e.g. Robert Henderson"
                        className="w-full bg-[#0a0f1d] border border-[#1e2d4d] rounded p-2 text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#94a3b8] mb-1">Australian Mobile</label>
                        <input
                          type="tel"
                          required
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          placeholder="04XX XXX XXX"
                          className="w-full bg-[#0a0f1d] border border-[#1e2d4d] rounded p-2 text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#94a3b8] mb-1">Destination Postcode</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.postcode}
                          onChange={(e) => setQuoteForm({ ...quoteForm, postcode: e.target.value })}
                          placeholder="e.g. 4207, 2480, 3000"
                          className="w-full bg-[#0a0f1d] border border-[#1e2d4d] rounded p-2 text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#94a3b8] mb-1">Delivery Preference (Direct Delivery Australia-Wide)</label>
                      <select
                        value={quoteForm.deliveryPreference}
                        onChange={(e) => setQuoteForm({ ...quoteForm, deliveryPreference: e.target.value })}
                        className="w-full bg-[#0a0f1d] border border-[#1e2d4d] rounded p-2 text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                      >
                        <option value="Door-to-Door Enclosed Freight">Door-to-Door Enclosed Freight (Australia-Wide Direct)</option>
                        <option value="Regional Transport Depot Delivery">Regional Transport Depot Delivery (Door Delivery)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#94a3b8] mb-1">Special Accessories / Notes</label>
                      <input
                        type="text"
                        value={quoteForm.notes}
                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        placeholder="e.g. Heavy tow bar, sun canopy upgrade, all-weather enclosure"
                        className="w-full bg-[#0a0f1d] border border-[#1e2d4d] rounded p-2 text-[#ffffff] focus:outline-none focus:border-[#fbbf24]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#fbbf24] text-[#0a0f1d] font-extrabold text-xs rounded hover:bg-[#f59e0b] transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Submit &amp; Open WhatsApp Sales Desk</span>
                    </button>

                    <div className="text-[10px] text-[#94a3b8] text-center">
                      Official ABN 28 668 598 758 tax invoice provided for commercial fleet deductions.
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        <ChatHub />
      </div>
    </>
  );
}
