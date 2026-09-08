'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Share2, 
  ShoppingBag,
  ExternalLink,
  Wrench,
  Truck
} from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import { BlogPost, POSTS, SITE, ABN_INFO, CONTACT, PRODUCTS } from '@/src/config/site';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const relatedPosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const relatedProduct = post.relatedProductSlug
    ? PRODUCTS.find((p) => p.slug === post.relatedProductSlug)
    : PRODUCTS[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d] text-[#ffffff]">
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Breadcrumbs */}
      <div className="bg-[#070b16] border-b border-[#152037] px-4 py-2 text-xs">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-[#94a3b8] overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#fbbf24] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog/" className="hover:text-[#fbbf24] transition-colors">
            Blog &amp; Guides
          </Link>
          <span>/</span>
          <span className="text-[#fbbf24] font-medium truncate max-w-xs sm:max-w-md">
            {post.title}
          </span>
        </div>
      </div>

      <main id="main" className="flex-1 py-10 sm:py-14 px-4">
        <article className="max-w-4xl mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/blog/"
              className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:text-[#fbbf24] font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all guides &amp; technical articles</span>
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-4 pb-8 border-b border-[#1e2d4d]">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#94a3b8]">
              <span className="px-3 py-1 rounded bg-[#101935] border border-[#fbbf24]/50 text-[#fbbf24] font-bold">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#fbbf24]" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                {post.readTime}
              </span>
            </div>

            {/* Exactly one H1 for this page */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#ffffff] leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author info row + Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#101935] border border-[#fbbf24]/60 flex items-center justify-center font-bold text-[#fbbf24] text-xs">
                  {post.author.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#ffffff]">{post.author.name}</div>
                  <div className="text-[11px] text-[#94a3b8]">{post.author.role}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101935] border border-[#1e2d4d] hover:border-[#fbbf24] text-xs font-medium text-[#cbd5e1] hover:text-[#ffffff] transition-colors"
                aria-label="Share this guide"
              >
                <Share2 className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>{copied ? 'Link Copied!' : 'Share Guide'}</span>
              </button>
            </div>
          </header>

          {/* Key Takeaways Box (AEO & AI Search Optimized) */}
          <div className="my-8 p-5 sm:p-6 bg-[#101935] border border-[#1e2d4d] rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fbbf24] mb-3">
              <ShieldCheck className="w-4 h-4 text-[#fbbf24]" />
              <span>Core Takeaways &amp; Executive Summary</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#cbd5e1]">
              {post.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Body Content Sections */}
          <div className="space-y-8 text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
            {post.content.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight pt-3">
                  {sec.heading}
                </h2>
                <p className="text-[#94a3b8] leading-relaxed">{sec.body}</p>

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-2">
                    {sec.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#e2e8f0]">
                        <span className="text-[#fbbf24] font-bold text-sm shrink-0">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Relevant Product Recommendation Callout Box */}
          {relatedProduct && (
            <div className="my-10 p-6 bg-gradient-to-r from-[#101935] to-[#070b16] border border-[#fbbf24]/40 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#fbbf24] bg-[#0a0f1d] px-2.5 py-1 rounded border border-[#1e2d4d]">
                  Featured Model Mentioned In Guide
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#ffffff]">
                  {relatedProduct.name}
                </h3>
                <p className="text-xs text-[#94a3b8] max-w-xl">
                  {relatedProduct.key_specs}. Available for immediate dispatch from our Yatala QLD depot with nationwide enclosed delivery.
                </p>
                <div className="text-base font-extrabold text-[#fbbf24]">
                  {relatedProduct.price_display} AUD{' '}
                  <span className="text-xs font-normal text-[#94a3b8]">(GST Included)</span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <Link
                  href={`/shop/${relatedProduct.slug}/`}
                  className="w-full text-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-[#0a0f1d] font-bold text-xs shadow hover:from-[#fbbf24] hover:to-[#fde047] transition-all"
                >
                  View Full Specs
                </Link>
                <Link
                  href="/shop/"
                  className="w-full text-center px-5 py-2 rounded-lg bg-[#0a0f1d] border border-[#1e2d4d] text-xs font-medium text-[#ffffff] hover:border-[#fbbf24] transition-colors"
                >
                  Compare Fleet
                </Link>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="pt-6 border-t border-[#1e2d4d] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#94a3b8] mr-2">Topics:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#101935] border border-[#1e2d4d] text-[#cbd5e1]"
              >
                <Tag className="w-3 h-3 text-[#38bdf8]" />
                {tag}
              </span>
            ))}
          </div>

          {/* Yatala Depot Credential Banner */}
          <div className="mt-10 p-5 bg-[#070b16] border border-[#1e2d4d] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-[#ffffff] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#fbbf24]" />
                <span>{ABN_INFO.companyName} (ABN {ABN_INFO.abn})</span>
              </div>
              <div className="text-[#94a3b8]">
                Depot Location: {ABN_INFO.locality} • Regulated under ASIC Australian commercial laws
              </div>
            </div>
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fbbf24] hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Yatala Hub: {CONTACT.phoneDisplay}</span>
            </a>
          </div>

          {/* Related Articles Carousel / Grid */}
          <div className="mt-14 pt-8 border-t border-[#1e2d4d]">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] mb-6">
              More Australian Golf Buggy Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.slug}
                  className="bg-[#101935] border border-[#1e2d4d] rounded-xl p-4 flex flex-col justify-between hover:border-[#fbbf24]/50 transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-wider block mb-1.5">
                      {rPost.category}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-[#ffffff] group-hover:text-[#fbbf24] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${rPost.slug}/`}>
                        {rPost.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-xs text-[#94a3b8] line-clamp-2">
                      {rPost.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#152037] flex items-center justify-between text-[11px]">
                    <span className="text-[#64748b]">{rPost.readTime}</span>
                    <Link
                      href={`/blog/${rPost.slug}/`}
                      className="text-[#fbbf24] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
      <ChatHub />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={(id, delta) => {
          const updated = cartItems
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0);
          setCartItems(updated);
          localStorage.setItem(SITE.cartKey, JSON.stringify(updated));
        }}
        onRemoveItem={(id) => {
          const updated = cartItems.filter((i) => i.id !== id);
          setCartItems(updated);
          localStorage.setItem(SITE.cartKey, JSON.stringify(updated));
        }}
        onClearCart={() => {
          setCartItems([]);
          localStorage.removeItem(SITE.cartKey);
        }}
      />
    </div>
  );
}
