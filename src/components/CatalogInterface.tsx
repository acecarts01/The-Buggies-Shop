'use client';

import React, { useState, useMemo, useDeferredValue, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  Zap,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  FileText,
  BadgePercent,
  Battery,
  BatteryCharging,
  SlidersHorizontal,
  X,
  MessageSquare
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, ProductItem, ABN_INFO, CONTACT, SHOP, isAccessoryItem } from '@/src/config/site';
import { AnimatedCounter, FadeUpText } from '@/src/components/AnimatedText';

interface CatalogInterfaceProps {
  initialCategory?: string;
  onAddToCart?: (product: ProductItem) => void;
}

// Powertrain options with focus on modern battery technology
const POWERTRAINS = [
  { id: 'all', label: 'All Powertrains' },
  { id: 'lithium', label: '⚡ LiFePO4 Lithium (Zero-Maint)' },
  { id: 'lead-acid', label: '🔋 Lead-Acid / AGM' },
  { id: 'petrol', label: '⛽ Petrol EFI' },
];

// Helper to determine battery technology details for each product (pure function outside render cycle)
function getBatteryInfo(product: ProductItem) {
  const rawText = `${product.fuel_type} ${product.key_specs} ${product.name}`.toLowerCase();
  
  if (rawText.includes('lithium') || rawText.includes('lifepo4') || rawText.includes('li-ion')) {
    const voltage = rawText.includes('72v') 
      ? '72V' 
      : rawText.includes('48v') 
      ? '48V' 
      : rawText.includes('36v') 
      ? '36V' 
      : rawText.includes('24v') 
      ? '24V' 
      : 'Lithium';
    
    return {
      tech: 'lithium',
      title: `${voltage} LiFePO4 Lithium`,
      badgeText: 'Zero-Maintenance Lithium',
      shortDesc: 'No acid spills • Zero water topping • 2-3h fast charge',
      badgeBg: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E293B]',
      pillBg: 'bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]',
      isZeroMaintenance: true,
    };
  }

  if (rawText.includes('lead-acid') || rawText.includes('agm') || rawText.includes('deep cycle') || rawText.includes('lead acid') || (rawText.includes('electric') && !rawText.includes('lithium'))) {
    const voltage = rawText.includes('48v') ? '48V' : rawText.includes('36v') ? '36V' : 'Electric';
    return {
      tech: 'lead-acid',
      title: `${voltage} Deep-Cycle AGM / Lead-Acid`,
      badgeText: 'Lead-Acid / AGM System',
      shortDesc: 'Traditional cycle • Periodic maintenance required',
      badgeBg: 'bg-[#F8F9FA] border-[#E2E8F0] text-[#64748B]',
      pillBg: 'bg-[#E2E8F0] text-[#475569] border border-[#CBD5E1]',
      isZeroMaintenance: false,
    };
  }

  return {
    tech: 'petrol',
    title: 'EFI Petrol / Mechanical',
    badgeText: 'Combustion Engine',
    shortDesc: 'Electronic fuel injection • Conventional mechanical drive',
    badgeBg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]',
    pillBg: 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]',
    isZeroMaintenance: false,
  };
}

interface ProductCardProps {
  product: ProductItem;
  battery: ReturnType<typeof getBatteryInfo>;
  onAddToCart?: (product: ProductItem) => void;
  onOpenQuote: (product: ProductItem) => void;
  onInspect: (product: ProductItem) => void;
}

const ProductCard = React.memo(function ProductCard({
  product,
  battery,
  onAddToCart,
  onOpenQuote,
  onInspect,
}: ProductCardProps) {
  const isHighTicket = product.price_aud >= 15000;
  const isFlagship = product.slug.includes('atlas');
  const catSlug = CATEGORIES.find((c) => c.rawCategory === product.category)?.slug || 'luxury-4-seater';
  const productUrl = `/shop/${catSlug}/${product.slug}/`;

  return (
    <div
      className={`content-auto flex flex-col justify-between bg-white border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg group shadow-sm ${
        isFlagship
          ? 'border-[#2563EB] ring-1 ring-[#2563EB]/30'
          : 'border-[#E2E8F0] hover:border-[#2563EB]/40'
      }`}
    >
      {/* Card Header & Badges */}
      <div>
        <div className="p-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
            {product.category}
          </span>

          {/* Stock / Tier Status Badge */}
          {isHighTicket ? (
            <span className="inline-flex items-center gap-1 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-2 py-0.5 rounded text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-[#2563EB]" />
              Tour Fleet Flagship
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-white border border-[#E2E8F0] text-[#64748B] px-2 py-0.5 rounded text-[10px] font-medium">
              In Stock Yatala QLD
            </span>
          )}
        </div>

        {/* Product Presentation Canvas */}
        <div className="p-5 space-y-3">
          <div>
            <Link
              href={productUrl}
              className="text-base sm:text-lg font-serif font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
            <div className="text-xs text-[#64748B] mt-0.5 flex items-center gap-2">
              <span className="capitalize">{product.fuel_type}</span>
              <span>•</span>
              <span>{product.target_audience}</span>
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg p-3 text-xs space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] flex items-center justify-between">
              <span>Description &amp; Highlights</span>
              <span className="text-[9px] text-[#64748B]">Australian Specs</span>
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed line-clamp-2">
              {product.shortDescription || product.fullDescription}
            </p>
          </div>

          {/* Price Point & Payment Options */}
          <div className="pt-2 border-t border-[#E2E8F0] space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#1E293B]">
                  {product.price_display}
                </span>
                <span className="text-[10px] font-medium text-[#64748B]">
                  AUD (GST Incl.)
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                Yatala Stock
              </span>
            </div>

            {/* Installments & 5% Bundle Indicators */}
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <div className="text-[#2563EB] font-medium flex items-center gap-1">
                <BadgePercent className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>or 4x ${Math.round(product.price_aud / 4).toLocaleString()} AUD Pay-in-4 (0% int.)</span>
              </div>
              {isAccessoryItem(product.category, product.id, product.name) ? (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  5% Off w/ Buggy
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.5 rounded">
                  5% Acc. Bundle
                </span>
              )}
            </div>
          </div>

          {/* BATTERY TECHNOLOGY BADGE: Lithium vs Lead-Acid Focus */}
          <div className={`p-2.5 rounded-lg border text-xs ${battery.badgeBg} space-y-1`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold">
                {battery.isZeroMaintenance ? (
                  <BatteryCharging className="w-4 h-4 text-[#2563EB] shrink-0" />
                ) : battery.tech === 'lead-acid' ? (
                  <Battery className="w-4 h-4 text-[#64748B] shrink-0" />
                ) : (
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="text-xs">{battery.title}</span>
              </div>

              {/* Zero-Maintenance Status Pill */}
              <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded shrink-0 ${battery.pillBg}`}>
                {battery.isZeroMaintenance ? 'Zero Maint' : 'Standard'}
              </span>
            </div>

            <div className="text-[10px] opacity-90 leading-tight">
              {battery.shortDesc}
            </div>
          </div>

          {/* Key Technical Specs Pill Box */}
          <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg p-3 text-xs space-y-1.5">
            <div className="text-[11px] font-bold text-[#1E293B] flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#2563EB]" />
              <span>Engineering Specifications</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed line-clamp-2">
              {product.key_specs}
            </p>
          </div>

          {/* Warranty and Support Guarantee */}
          <div className="text-[11px] text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] rounded p-2 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span>Includes Yatala 3-5 Year Australian Factory Warranty</span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              if (onAddToCart) onAddToCart(product);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
            id={`add-cart-${product.id}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuote(product)}
            className="w-full flex items-center justify-center gap-1 py-2.5 px-2 bg-white hover:bg-[#EFF6FF] border border-[#2563EB] text-[#2563EB] font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
            id={`quote-btn-${product.id}`}
          >
            <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Fast Quote</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onInspect(product)}
            className="w-full py-1.5 px-2 border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F9FA] text-[11px] font-semibold rounded text-center transition-colors"
          >
            Technical Specs
          </button>
          <Link
            href={productUrl}
            className="w-full py-1.5 px-2 bg-white hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] text-[#2563EB] text-[11px] font-medium rounded text-center flex items-center justify-center gap-1 transition-colors"
          >
            <span>Full Details</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
});

export default function CatalogInterface({ initialCategory = 'all', onAddToCart }: CatalogInterfaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPowertrain, setSelectedPowertrain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceSort, setPriceSort] = useState<'featured' | 'low-high' | 'high-low'>('featured');
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<ProductItem | null>(null);

  // Progressive rendering state: renders 12 items initially for instant paint and silky-smooth INP
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Defer search term to keep keystrokes running at 120 FPS without thread blocking
  const deferredSearch = useDeferredValue(searchQuery);

  // Official Quote and Logistics request state
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    postcode: '',
    deliveryType: 'Door-to-Door Enclosed Freight',
    notes: '',
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Pre-calculate battery info map to avoid re-parsing during search filters
  const batteryInfoMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getBatteryInfo>>();
    for (const p of PRODUCTS) {
      map.set(p.id, getBatteryInfo(p));
    }
    return map;
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (catObj && catObj.rawCategory && p.category !== catObj.rawCategory) {
          return false;
        }
      }

      // Powertrain filter
      if (selectedPowertrain !== 'all') {
        const fuel = `${p.fuel_type} ${p.key_specs} ${p.name}`.toLowerCase();
        if (selectedPowertrain === 'lithium' && !fuel.includes('lithium') && !fuel.includes('lifepo4')) return false;
        if (selectedPowertrain === 'lead-acid' && (fuel.includes('lithium') || fuel.includes('petrol') || fuel.includes('gas'))) return false;
        if (selectedPowertrain === 'petrol' && !fuel.includes('petrol') && !fuel.includes('gas')) return false;
      }

      // Search Query
      if (deferredSearch.trim()) {
        const q = deferredSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSpecs = p.key_specs.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesAudience = p.target_audience.toLowerCase().includes(q);
        if (!matchesName && !matchesSpecs && !matchesCat && !matchesAudience) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (priceSort === 'low-high') return a.price_aud - b.price_aud;
      if (priceSort === 'high-low') return b.price_aud - a.price_aud;
      return 0;
    });
  }, [selectedCategory, selectedPowertrain, deferredSearch, priceSort]);

  // Track filter state to reset pagination when active filters change without extra cascading effects
  const filterKey = `${selectedCategory}-${selectedPowertrain}-${deferredSearch}-${priceSort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(12);
  }

  // Display slice
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleOpenQuote = useCallback((product: ProductItem) => {
    setQuoteProduct(product);
    setQuoteSubmitted(false);
  }, []);

  const handleInspect = useCallback((product: ProductItem) => {
    setInspectProduct(product);
  }, []);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      const text = encodeURIComponent(
        `Hello The Buggies Express, I would like an official quote and freight estimation for: ${quoteProduct?.name} (${quoteProduct?.price_display} AUD).
Customer Name: ${quoteForm.name}
Phone: ${quoteForm.phone}
Postcode: ${quoteForm.postcode}
Delivery Preference: ${quoteForm.deliveryType}
Notes: ${quoteForm.notes || 'None'}`
      );
      window.open(`https://wa.me/61480408189?text=${text}`, '_blank');
    }, 1000);
  };

  return (
    <section className="w-full bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8 text-[#1E293B]" id="catalog-explorer">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="border-b border-[#E2E8F0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Australian Tour Precision Fleet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1E293B] tracking-tight">
              Australian Golf Buggies &amp; Utility Vehicles for Sale
            </h2>
            <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
              Featuring advanced LiFePO4 zero-maintenance lithium battery technology and high-torque AC drivetrains. All 61 models certified and supported from our central Yatala QLD engineering center.
            </p>
          </div>

          {/* Fast Metric Summary */}
          <div className="flex items-center gap-4 bg-white border border-[#E2E8F0] shadow-sm p-3 rounded-xl shrink-0">
            <div className="text-center px-2">
              <div className="text-xl font-serif font-bold text-[#1E293B]">
                <AnimatedCounter value={filteredProducts.length} />
              </div>
              <div className="text-[10px] text-[#64748B]">Models Ready</div>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]" />
            <div className="text-center px-2">
              <div className="text-xl font-serif font-bold text-[#2563EB]">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-[10px] text-[#64748B]">Enclosed Freight</div>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]" />
            <div className="text-center px-2">
              <div className="text-xl font-serif font-bold text-emerald-600">
                <AnimatedCounter value={10} suffix="%" />
              </div>
              <div className="text-[10px] text-[#64748B]">Crypto Rebate</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by model name, 72V lithium, lifted 4x4, 6-seater, chassis specs..."
                className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 px-4 text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] shadow-sm transition-all"
                id="catalog-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#1E293B] bg-[#F8F9FA] px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price / Relevance Sorting */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#64748B] hidden sm:inline">Sort:</span>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                className="bg-white border border-[#E2E8F0] rounded-xl py-3 px-3 text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] shadow-sm"
                id="catalog-sort-select"
              >
                <option value="featured">Featured / Flagship</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`text-xs px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all font-semibold ${
                    active
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB]/40'
                  }`}
                  id={`cat-chip-${category.slug}`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Powertrain / Battery Technology Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3 h-3 text-[#2563EB]" />
              Powertrain:
            </span>
            {POWERTRAINS.map((pt) => {
              const active = selectedPowertrain === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedPowertrain(pt.id)}
                  className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
                    active
                      ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-bold shadow-sm'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {pt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center space-y-4 shadow-sm">
            <Info className="w-10 h-10 text-[#2563EB] mx-auto" />
            <h3 className="text-lg font-bold text-[#1E293B]">No models match your current filter parameters</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Try adjusting your battery technology selection or clearing your search term. You can also consult directly with our Yatala engineers regarding custom lithium conversions.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPowertrain('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded hover:bg-[#1D4ED8] transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  battery={batteryInfoMap.get(product.id) || getBatteryInfo(product)}
                  onAddToCart={onAddToCart}
                  onOpenQuote={handleOpenQuote}
                  onInspect={handleInspect}
                />
              ))}
            </div>

            {/* Progressive Loading Controls */}
            {filteredProducts.length > visibleCount && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-[#E2E8F0] shadow-sm rounded-xl">
                <div className="text-xs text-[#64748B] text-center sm:text-left">
                  Showing <span className="font-bold text-[#1E293B]">{displayedProducts.length}</span> of{' '}
                  <span className="font-bold text-[#1E293B]">{filteredProducts.length}</span> vehicles
                  <span className="ml-2 text-[10px] text-[#2563EB] font-medium">
                    ({filteredProducts.length - displayedProducts.length} additional models available)
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length))}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Load Next 12 Models</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">
                      +{Math.min(12, filteredProducts.length - displayedProducts.length)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleCount(filteredProducts.length)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-white hover:bg-[#F8F9FA] border border-[#E2E8F0] hover:border-[#2563EB] text-[#2563EB] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                  >
                    <span>View All ({filteredProducts.length})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical Specification Inspector Modal */}
        {inspectProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-2xl w-full p-6 text-[#1E293B] shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => setInspectProduct(null)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="border-b border-[#E2E8F0] pb-3 pr-8">
                  <span className="text-[10px] uppercase font-bold text-[#2563EB] tracking-wider">
                    Official Yatala Workshop Specification Sheet
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#1E293B] mt-1">
                    {inspectProduct.name}
                  </h3>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    Category: {inspectProduct.category} • Target Application: {inspectProduct.target_audience}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F9FA] p-3 rounded-lg border border-[#E2E8F0] text-center">
                  <div>
                    <div className="text-[10px] text-[#64748B]">Drive Type</div>
                    <div className="text-xs font-bold text-[#1E293B] capitalize">{inspectProduct.fuel_type}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B]">Standard Price</div>
                    <div className="text-xs font-bold text-[#2563EB]">{inspectProduct.price_display} AUD</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B]">Crypto Settlement</div>
                    <div className="text-xs font-bold text-emerald-600">
                      ${Math.round(inspectProduct.price_aud * 0.9).toLocaleString()} AUD
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B]">Warranty Center</div>
                    <div className="text-xs font-bold text-[#1E293B]">Yatala QLD 4207</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1">
                    Full Engineering &amp; Powertrain Configuration
                  </h4>
                  <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded p-3 text-xs text-[#64748B] leading-relaxed">
                    {inspectProduct.key_specs}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                    Factory Certified Inclusions
                  </h4>
                  <ul className="text-xs space-y-1.5 text-[#64748B]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Zero-Maintenance LiFePO4 or heavy-duty cycle deep discharge power pack</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>On-board smart high-frequency delta-Q or waterproof 240V AC charger</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>High-tensile corrosion resistant chassis built for coastal Australian climates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Regenerative electronic motor braking with automatic electromagnetic park brake</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectProduct(null);
                      setQuoteProduct(inspectProduct);
                    }}
                    className="flex-1 py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Request Quotation for this Model</span>
                  </button>
                  <Link
                    href={`/shop/${inspectProduct.slug}/`}
                    className="py-2.5 px-4 bg-white border border-[#E2E8F0] hover:border-[#2563EB] text-[#2563EB] text-xs font-bold rounded text-center transition-colors"
                  >
                    View Product Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official Quotation & Logistics Request Modal */}
        {quoteProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-lg w-full p-6 text-[#1E293B] shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => setQuoteProduct(null)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="border-b border-[#E2E8F0] pb-3 pr-8">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                    <FileText className="w-3 h-3" />
                    <span>Official Quotation &amp; Freight Schedule</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1E293B] mt-1">
                    {quoteProduct.name}
                  </h3>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    Vehicle Price: <span className="text-[#1E293B] font-bold">{quoteProduct.price_display} AUD</span> (GST Incl.)
                  </div>
                </div>

                {quoteSubmitted ? (
                  <div className="bg-[#F8F9FA] border border-emerald-500/40 rounded-xl p-6 text-center space-y-3 animate-in fade-in">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-base font-bold text-[#1E293B]">Tax Quotation Request Prepared!</h4>
                    <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                      Connecting you to our Yatala commercial dispatch desk via WhatsApp to transmit your itemized invoice and regional freight rates.
                    </p>
                    <button
                      type="button"
                      onClick={() => setQuoteProduct(null)}
                      className="px-4 py-2 bg-white border border-[#E2E8F0] text-xs font-bold rounded text-[#1E293B] hover:bg-[#F8F9FA] shadow-sm"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3 text-xs">
                    <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 rounded text-[11px] text-[#64748B] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#2563EB] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Direct Fulfillment from Yatala QLD 4207</span>
                      </div>
                      <p>
                        We deliver nationwide via specialized enclosed vehicle haulers. Enter your details below for an accurate quote with door-to-door delivery.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#64748B] mb-1">Full Name / Trading Entity</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          placeholder="e.g. John Miller / Oak Valley Golf"
                          className="w-full bg-white border border-[#E2E8F0] rounded p-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#64748B] mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          required
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          placeholder="0400 000 000"
                          className="w-full bg-white border border-[#E2E8F0] rounded p-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#64748B] mb-1">Destination Postcode &amp; Suburb</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.postcode}
                        onChange={(e) => setQuoteForm({ ...quoteForm, postcode: e.target.value })}
                        placeholder="e.g. 4207 Yatala, 2480 Lismore, 3000 Melbourne"
                        className="w-full bg-white border border-[#E2E8F0] rounded p-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#64748B] mb-1">Delivery Preference (We Only Deliver Australia-Wide)</label>
                      <select
                        value={quoteForm.deliveryType}
                        onChange={(e) => setQuoteForm({ ...quoteForm, deliveryType: e.target.value })}
                        className="w-full bg-white border border-[#E2E8F0] rounded p-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                      >
                        <option value="Door-to-Door Enclosed Freight">Door-to-Door Enclosed Transport (Australia-Wide Direct)</option>
                        <option value="Commercial Depot Delivery">Delivery to Nearest Regional Freight Depot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#64748B] mb-1">Additional Options / Accessories (Optional)</label>
                      <input
                        type="text"
                        value={quoteForm.notes}
                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        placeholder="e.g. Weather enclosure, tow ball, high-speed gear package"
                        className="w-full bg-white border border-[#E2E8F0] rounded p-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded transition-all shadow-sm mt-2 flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request Tax Quote via WhatsApp / Sales Desk</span>
                    </button>

                    <div className="text-[10px] text-[#64748B] text-center">
                      Official ABN 28 668 598 758 tax invoice provided with every quotation.
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
