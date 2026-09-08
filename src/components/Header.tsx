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
import { ABN_INFO, CONTACT, CATEGORIES } from '@/src/config/site';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export default function Header({ cartCount = 0, onOpenCart, onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] text-[#1E293B] shadow-xs">
      {/* Top Utility & ABN Verification Bar */}
      <div className="bg-[#F8F9FA] border-b border-[#E2E8F0] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Official ABN Link Bar (Prominently clickable for clients) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-2.5 py-1 rounded text-[#1E293B] font-medium shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>ABN Verified:</span>
              <a
                href={ABN_INFO.officialAbrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#2563EB] inline-flex items-center gap-1 font-semibold text-[#1E293B] transition-colors"
                title="Tap to verify registered entity on Australian Government ABR portal"
                id="header-abn-link"
              >
                {ABN_INFO.abn}
                <ExternalLink className="w-3 h-3 text-[#2563EB]" />
              </a>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[#64748B]">
              <MapPin className="w-3 h-3 text-[#2563EB]" />
              Depot: {ABN_INFO.locality}
            </span>
          </div>

          {/* Contact & Service Signals */}
          <div className="flex items-center gap-4 flex-wrap ml-auto">
            <div className="hidden md:flex items-center gap-1 text-[#2563EB]">
              <Truck className="w-3.5 h-3.5" />
              <span className="text-[#64748B]">Australia-Wide Dedicated Transport</span>
            </div>
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex items-center gap-1.5 font-medium hover:text-[#2563EB] transition-colors text-[#1E293B]"
              id="header-phone-link"
            >
              <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>0480 408 189</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none" id="header-brand-logo">
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#2563EB]/30 flex items-center justify-center font-serif text-lg font-bold text-[#2563EB] shadow-xs">
            BE
          </div>
          <div>
            <div className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
              The Buggies Express
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#64748B] font-sans font-medium">
              Yatala QLD • Australian Specialists
            </div>
          </div>
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
              className="inline-flex items-center gap-1 text-[#1E293B] hover:text-[#2563EB] transition-colors py-2"
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              aria-expanded={shopDropdownOpen}
              id="header-shop-dropdown-btn"
            >
              <span>Explore Fleet</span>
              <ChevronDown className="w-4 h-4 text-[#64748B]" />
            </button>

            {/* Dropdown Menu */}
            {shopDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] border-b border-[#E2E8F0]">
                  Buggy Categories (61 Models)
                </div>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop/${cat.slug === 'all' ? '' : cat.slug}/`}
                    className="block px-3 py-2 text-xs text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                    onClick={() => setShopDropdownOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/"
            className="text-[#1E293B] hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
            Atlas 4-Passenger
          </Link>

          <Link
            href="/shop/off-road-4x4/"
            className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
          >
            Lifted 4x4
          </Link>

          <Link
            href="/shop/commercial-utility/"
            className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
          >
            Commercial Utility
          </Link>

          <Link
            href="/#customer-reviews"
            className="text-[#1E293B] hover:text-[#00b67a] transition-colors flex items-center gap-1.5"
            id="header-nav-reviews"
          >
            <span className="text-[#00b67a] font-bold text-xs bg-[#00b67a]/10 px-1.5 py-0.5 rounded border border-[#00b67a]/30">★ 4.5</span>
            <span>Reviews</span>
          </Link>

          <Link
            href="/blog/"
            className="text-[#1E293B] hover:text-[#2563EB] transition-colors flex items-center gap-1"
            id="header-nav-blog"
          >
            Blog &amp; Guides
          </Link>

          <Link
            href="/about/"
            className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
          >
            About &amp; ABN
          </Link>

          <Link
            href="/contact/"
            className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
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
              className="p-2 rounded-lg hover:bg-[#EFF6FF] text-[#64748B] hover:text-[#2563EB] transition-colors focus:outline-none border border-transparent hover:border-[#E2E8F0]"
              aria-label="Search Buggies Catalog"
              id="header-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 rounded-lg hover:bg-[#EFF6FF] text-[#1E293B] hover:text-[#2563EB] transition-colors focus:outline-none border border-[#E2E8F0] bg-white shadow-2xs"
            aria-label={`Cart with ${cartCount} items`}
            id="header-cart-btn"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#2563EB] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            href="/shop/"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors shadow-sm focus:outline-none tracking-wide"
            id="header-order-now-btn"
          >
            Order Now
          </Link>

          {/* Mobile menu hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] focus:outline-none"
            aria-label="Toggle navigation menu"
            id="header-mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-5 animate-in slide-in-from-top-2 shadow-lg">
          <div className="flex flex-col gap-3">
            <div className="pb-2 border-b border-[#E2E8F0]">
              <div className="text-xs uppercase tracking-wider text-[#2563EB] font-bold mb-2">
                Browse Categories
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop/${c.slug === 'all' ? '' : c.slug}/`}
                    className="text-sm text-[#64748B] py-1 hover:text-[#2563EB]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/"
              className="text-sm font-semibold text-[#2563EB] py-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              ★ Atlas 4-Passenger Lifted Edition ($20,900 AUD)
            </Link>

            <Link
              href="/#customer-reviews"
              className="text-sm text-[#64748B] py-1.5 hover:text-[#00b67a] flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
              id="mobile-nav-reviews"
            >
              <span>Customer Reviews</span>
              <span className="text-[10px] font-bold text-[#00b67a] bg-[#00b67a]/10 px-2 py-0.5 rounded border border-[#00b67a]/30">
                ★ 4.5 TrustScore
              </span>
            </Link>

            <Link
              href="/blog/"
              className="text-sm text-[#64748B] py-1.5 hover:text-[#2563EB] flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
              id="mobile-nav-blog"
            >
              <span>Blog &amp; Buyer Guides</span>
              <span className="text-[10px] uppercase font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#2563EB]/20">
                Guides
              </span>
            </Link>

            <Link
              href="/about/"
              className="text-sm text-[#64748B] py-1.5 hover:text-[#2563EB]"
              onClick={() => setMobileMenuOpen(false)}
            >
              About & ASIC ABN Verification
            </Link>

            <Link
              href="/faq/"
              className="text-sm text-[#64748B] py-1.5 hover:text-[#2563EB]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Frequently Asked Questions
            </Link>

            <Link
              href="/contact/"
              className="text-sm text-[#64748B] py-1.5 hover:text-[#2563EB]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact & Nationwide Delivery
            </Link>

            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
              <Link
                href="/shop/"
                className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white tracking-wide shadow-xs"
                id="mobile-order-now-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Order Now
              </Link>
              <a
                href={`tel:${CONTACT.phone}`}
                className="w-full text-center py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8F9FA]"
              >
                Call Yatala Workshop: 0480 408 189
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
