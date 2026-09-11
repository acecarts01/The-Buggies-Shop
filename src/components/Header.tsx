'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  ExternalLink, 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Truck, 
  MapPin,
  ChevronDown
} from 'lucide-react';
import { ABN_INFO, CONTACT, CATEGORIES, BRAND_PAGES, PRODUCTS } from '@/src/config/site';
import BrandMark from './BrandMark';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export default function Header({ cartCount = 0, onOpenCart, onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E7E5E4] text-[#121417] shadow-xs">
      {/* Top Utility & ABN Verification Bar */}
      <div className="bg-[#F7F6F2] border-b border-[#E7E5E4] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Official ABN Link Bar (Prominently clickable for clients) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E7E5E4] px-2.5 py-1 rounded text-[#121417] font-medium shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A85640]" />
              <span>ABN Verified:</span>
              <a
                href={ABN_INFO.officialAbrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#A85640] inline-flex items-center gap-1 font-semibold text-[#121417] transition-colors relative after:absolute after:content-[''] after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2"
                title="Tap to verify registered entity on Australian Government ABR portal"
                id="header-abn-link"
              >
                {ABN_INFO.abn}
                <ExternalLink className="w-3 h-3 text-[#A85640]" />
              </a>
              {/* Registered entity name, for transparency alongside the ABN */}
              <span className="hidden sm:inline text-[10px] text-[#6B645E] font-normal border-l border-[#E7E5E4] pl-2 ml-0.5">
                {ABN_INFO.companyName}
              </span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[#6B645E]">
              <MapPin className="w-3 h-3 text-[#A85640]" />
              Depot: {ABN_INFO.locality}
            </span>
          </div>

          {/* Contact & Service Signals */}
          <div className="flex items-center gap-4 flex-wrap ml-auto">
            <div className="hidden md:flex items-center gap-1 text-[#A85640]">
              <Truck className="w-3.5 h-3.5" />
              <span className="text-[#6B645E]">Australia-Wide Dedicated Transport</span>
            </div>
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex items-center gap-1.5 font-medium hover:text-[#A85640] transition-colors text-[#121417] relative after:absolute after:content-[''] after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2"
              id="header-phone-link"
            >
              <Phone className="w-3.5 h-3.5 text-[#A85640]" />
              <span>0480 804 189</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center group focus:outline-none" id="header-brand-logo" aria-label="The Buggies Express home">
          <BrandMark height={44} priority />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium" aria-label="Main Navigation">
          <div 
            className="relative"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[#121417] hover:text-[#A85640] transition-colors py-2"
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              aria-expanded={shopDropdownOpen}
              id="header-shop-dropdown-btn"
            >
              <span>Explore Fleet</span>
              <ChevronDown className="w-4 h-4 text-[#6B645E]" />
            </button>

            {/* Dropdown Menu */}
            {shopDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-white border border-[#E7E5E4] rounded-xl shadow-sm py-2 z-50 animate-in fade-in slide-in-from-top-1 surface-card">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A85640] border-b border-[#E7E5E4]">
                  Featured
                </div>
                <Link href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/" onClick={() => setShopDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-[#121417] hover:bg-[#F7EFEA] hover:text-[#A85640] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B45A40]" />
                  Atlas 4-Passenger
                </Link>
                <Link href="/shop/off-road-4x4/" onClick={() => setShopDropdownOpen(false)} className="block px-3 py-2 text-xs text-[#121417] hover:bg-[#F7EFEA] hover:text-[#A85640] transition-colors">
                  Lifted 4x4
                </Link>
                <Link href="/shop/commercial-utility/" onClick={() => setShopDropdownOpen(false)} className="block px-3 py-2 text-xs text-[#121417] hover:bg-[#F7EFEA] hover:text-[#A85640] transition-colors">
                  Commercial Utility
                </Link>

                <div className="px-3 py-1.5 mt-1 text-[10px] font-bold uppercase tracking-wider text-[#A85640] border-y border-[#E7E5E4] mb-1">
                  Buggy Categories ({PRODUCTS.length} Models)
                </div>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug === 'all' ? '/shop/' : `/shop/${cat.slug}/`}
                    className="block px-3 py-2 text-xs text-[#121417] hover:bg-[#F7EFEA] hover:text-[#A85640] transition-colors"
                    onClick={() => setShopDropdownOpen(false)}
                  >
                    {cat.name}
                    {cat.comingSoon && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-[#A85640]">Coming soon</span>
                    )}
                  </Link>
                ))}

                {/* Real crawlable brand pages rather than a search query, so
                    each brand has a URL Google and AI assistants can index. */}
                <Link
                  href="/shop/brand/"
                  onClick={() => setShopDropdownOpen(false)}
                  className="block px-3 py-1.5 mt-1 text-[10px] font-bold uppercase tracking-wider text-[#A85640] border-y border-[#E7E5E4] mb-1 hover:bg-[#F7EFEA]"
                >
                  Shop by Brand
                </Link>
                <div className="grid grid-cols-2 gap-x-1 px-1">
                  {BRAND_PAGES.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/shop/brand/${b.slug}/`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="block px-2 py-1.5 text-xs text-[#121417] hover:bg-[#F7EFEA] hover:text-[#A85640] rounded transition-colors"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>




          <Link
            href="/#customer-reviews"
            className="text-[#121417] hover:text-[#487053] transition-colors flex items-center gap-1.5"
            id="header-nav-reviews"
          >
            <span className="text-[#487053] font-bold text-xs bg-[#5E8C6A]/10 px-1.5 py-0.5 rounded border border-[#5E8C6A]/30">★ 4.5</span>
            <span>Reviews</span>
          </Link>

          {/* Resources: blog plus the buyer-guide cut of it */}
          <div className="relative" onMouseLeave={() => setResourcesOpen(false)}>
            <button
              type="button"
              onClick={() => setResourcesOpen(!resourcesOpen)}
              onMouseEnter={() => setResourcesOpen(true)}
              aria-expanded={resourcesOpen}
              id="header-nav-resources"
              className="text-[#121417] hover:text-[#A85640] transition-colors flex items-center gap-1"
            >
              <span>Resources</span>
              <ChevronDown className="w-4 h-4 text-[#6B645E]" />
            </button>
            {resourcesOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-[#E7E5E4] rounded-xl shadow-sm py-2 z-50">
                <Link href="/blog/" onClick={() => setResourcesOpen(false)} className="block px-3 py-2 text-xs text-[#121417] hover:bg-[#F7EFEA] hover:text-[#A85640] transition-colors">
                  Blog Articles
                </Link>
                <Link href="/blog/?category=Buyer%20Guides" onClick={() => setResourcesOpen(false)} className="block px-3 py-2 text-xs text-[#121417] hover:bg-[#F7EFEA] hover:text-[#A85640] transition-colors">
                  Buyer&apos;s Guides
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/about/"
            className="text-[#121417] hover:text-[#A85640] transition-colors"
          >
            About &amp; ABN
          </Link>

          <Link
            href="/contact/"
            className="text-[#121417] hover:text-[#A85640] transition-colors"
          >
            Order Enquiries
          </Link>
        </nav>

        {/* Action Buttons: Search, Cart, Order Now CTA */}
        <div className="flex items-center gap-3">
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 rounded-lg hover:bg-[#F7EFEA] text-[#6B645E] hover:text-[#A85640] transition-colors focus:outline-none border border-transparent hover:border-[#E7E5E4] surface-card"
              aria-label="Search Buggies Catalog"
              id="header-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 rounded-lg hover:bg-[#F7EFEA] text-[#121417] hover:text-[#A85640] transition-colors focus:outline-none border border-[#E7E5E4] bg-white shadow-2xs surface-card"
            aria-label={`Cart with ${cartCount} items`}
            id="header-cart-btn"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#B45A40] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs hover:-translate-y-px duration-200 transition-all">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            href="/shop/"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#B45A40] hover:bg-[#9A4C36] text-white transition-colors shadow-sm focus:outline-none tracking-wide hover:-translate-y-px duration-200"
            id="header-order-now-btn"
          >
            Order Now
          </Link>

          {/* Mobile menu hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#6B645E] hover:text-[#121417] hover:bg-[#F7EFEA] focus:outline-none"
            aria-label="Toggle navigation menu"
            id="header-mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E7E5E4] px-4 py-5 animate-in slide-in-from-top-2 shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="pb-2 border-b border-[#E7E5E4]">
              <div className="text-xs uppercase tracking-wider text-[#A85640] font-bold mb-2">
                Browse Categories
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={c.slug === 'all' ? '/shop/' : `/shop/${c.slug}/`}
                    className="text-sm text-[#6B645E] py-1 hover:text-[#A85640]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {c.name}
                    {c.comingSoon && (
                      <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A85640]">Coming soon</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/"
              className="text-sm font-semibold text-[#A85640] py-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              ★ Atlas 4-Passenger Lifted Edition ($20,900 AUD)
            </Link>

            <Link
              href="/#customer-reviews"
              className="text-sm text-[#6B645E] py-1.5 hover:text-[#487053] flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
              id="mobile-nav-reviews"
            >
              <span>Customer Reviews</span>
              <span className="text-[10px] font-bold text-[#487053] bg-[#5E8C6A]/10 px-2 py-0.5 rounded border border-[#5E8C6A]/30">
                ★ 4.5 TrustScore
              </span>
            </Link>

            <Link
              href="/blog/"
              className="text-sm text-[#6B645E] py-1.5 hover:text-[#A85640] flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
              id="mobile-nav-blog"
            >
              <span>Blog &amp; Buyer Guides</span>
              <span className="text-[10px] uppercase font-bold text-[#A85640] bg-[#F7EFEA] px-2 py-0.5 rounded border border-[#C86D51]/20">
                Guides
              </span>
            </Link>

            <Link
              href="/about/"
              className="text-sm text-[#6B645E] py-1.5 hover:text-[#A85640]"
              onClick={() => setMobileMenuOpen(false)}
            >
              About & ASIC ABN Verification
            </Link>

            <Link
              href="/faq/"
              className="text-sm text-[#6B645E] py-1.5 hover:text-[#A85640]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Frequently Asked Questions
            </Link>

            <Link
              href="/contact/"
              className="text-sm text-[#6B645E] py-1.5 hover:text-[#A85640]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact & Nationwide Delivery
            </Link>

            <div className="pt-3 border-t border-[#E7E5E4] flex flex-col gap-2">
              <Link
                href="/shop/"
                className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-[#B45A40] hover:bg-[#9A4C36] text-white tracking-wide shadow-xs hover:-translate-y-px duration-200 transition-all"
                id="mobile-order-now-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Order Now
              </Link>
              <a
                href={`tel:${CONTACT.phone}`}
                className="w-full text-center py-2 text-xs font-semibold rounded-lg border border-[#E7E5E4] text-[#121417] hover:bg-[#F7F6F2] surface-card"
              >
                Call Yatala Workshop: 0480 804 189
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
