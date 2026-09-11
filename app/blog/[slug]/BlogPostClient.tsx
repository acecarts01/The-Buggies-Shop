'use client';

import React, { useState, useEffect } from 'react';
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
import FaqSection from '@/src/components/FaqSection';
import { SITE, ABN_INFO, CONTACT, PRODUCTS, CATEGORIES } from '@/src/config/site';
import type { BlogPost, PostSummary } from '@/src/config/posts';
import { useCart } from '@/hooks/use-cart';

interface BlogPostClientProps {
  post: BlogPost;
  /** Three other posts for the footer strip, passed down so this client
   *  component never imports the full POSTS module. */
  relatedPosts: PostSummary[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cartItems, setCartItems] = useCart();

  // A guide for a range that is not stocked yet points at the coming-soon
  // category instead of a product: the product callout would otherwise fall
  // back to PRODUCTS[0] and label it "mentioned in guide" when it is not.
  const comingSoonCategory = post.relatedProductCategory
    ? CATEGORIES.find(
        (c) =>
          c.comingSoon &&
          (c.slug === post.relatedProductCategory || c.rawCategory === post.relatedProductCategory)
      )
    : undefined;
  const relatedProduct = comingSoonCategory
    ? undefined
    : post.relatedProductSlug
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
    <div className="flex flex-col min-h-screen bg-[#121417] text-[#ffffff]">
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Breadcrumbs */}
      <div className="bg-[#0A0B0D] border-b border-[#1F2226] px-4 py-2 text-xs">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-[#A8A29E] overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#E2A17A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog/" className="hover:text-[#E2A17A] transition-colors">
            Blog &amp; Guides
          </Link>
          <span>/</span>
          <span className="text-[#E2A17A] font-medium truncate max-w-xs sm:max-w-md">
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
              className="inline-flex items-center gap-1.5 text-xs text-[#AEB4B8] hover:text-[#E2A17A] font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all guides &amp; technical articles</span>
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-4 pb-8 border-b border-[#2B2F34]">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#A8A29E]">
              <span className="px-3 py-1 rounded bg-[#1A1D21] border border-[#E2A17A]/50 text-[#E2A17A] font-bold metal-brushed-dark">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#E2A17A]" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#AEB4B8]" />
                {post.readTime}
              </span>
            </div>

            {/* Exactly one H1 for this page */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#ffffff] leading-tight tracking-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author info row + Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A1D21] border border-[#E2A17A]/60 flex items-center justify-center font-bold text-[#E2A17A] text-xs metal-brushed-dark">
                  {post.author.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#ffffff]">{post.author.name}</div>
                  <div className="text-[11px] text-[#A8A29E]">{post.author.role}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1D21] border border-[#2B2F34] hover:border-[#E2A17A] text-xs font-medium text-[#D6D3D1] hover:text-[#ffffff] transition-colors metal-brushed-dark"
                aria-label="Share this guide"
              >
                <Share2 className="w-3.5 h-3.5 text-[#E2A17A]" />
                <span>{copied ? 'Link Copied!' : 'Share Guide'}</span>
              </button>
            </div>
          </header>

          {/* Key Takeaways Box (AEO & AI Search Optimized) */}
          <div className="my-8 p-5 sm:p-6 bg-[#1A1D21] border border-[#2B2F34] rounded-2xl shadow-xs metal-brushed-dark">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E2A17A] mb-3">
              <ShieldCheck className="w-4 h-4 text-[#E2A17A]" />
              <span>Core Takeaways &amp; Executive Summary</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#D6D3D1]">
              {post.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E2A17A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Body Content Sections */}
          <div className="space-y-8 text-sm sm:text-base text-[#D6D3D1] leading-relaxed">
            {post.content.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] tracking-tight pt-3">
                  {sec.heading}
                </h2>
                <p className="text-[#A8A29E] leading-relaxed">{sec.body}</p>

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-2">
                    {sec.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#E7E5E4]">
                        <span className="text-[#E2A17A] font-bold text-sm shrink-0">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Six questions this article is asked most, answered inline.
              Also emits the page's FAQPage schema. */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="my-10">
              <FaqSection items={post.faqs} tone="dark" />
            </div>
          )}

          {/* Coming-soon range: register interest instead of a product */}
          {comingSoonCategory && (
            <div className="my-10 p-6 bg-gradient-to-r from-[#1A1D21] to-[#0A0B0D] border border-[#E2A17A]/40 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2A17A] bg-[#121417] px-2.5 py-1 rounded border border-[#2B2F34]">
                  Coming Soon
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#ffffff]">
                  {comingSoonCategory.name}
                </h3>
                <p className="text-xs text-[#A8A29E] max-w-xl">
                  This range is being finalised and nothing in it is listed for sale yet. Leave your
                  details on the category page and we will email you the day the models, photos and
                  pricing go live.
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <Link
                  href={`/shop/${comingSoonCategory.slug}/`}
                  className="w-full text-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C86D51] to-[#E2A17A] text-[#121417] font-bold text-xs shadow hover:from-[#E2A17A] hover:to-[#EFC7A6] transition-all"
                >
                  Register Interest
                </Link>
                <Link
                  href="/shop/"
                  className="w-full text-center px-5 py-2 rounded-lg bg-[#121417] border border-[#2B2F34] text-xs font-medium text-[#ffffff] hover:border-[#E2A17A] transition-colors"
                >
                  Browse Current Range
                </Link>
              </div>
            </div>
          )}

          {/* Relevant Product Recommendation Callout Box */}
          {relatedProduct && (
            <div className="my-10 p-6 bg-gradient-to-r from-[#1A1D21] to-[#0A0B0D] border border-[#E2A17A]/40 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2A17A] bg-[#121417] px-2.5 py-1 rounded border border-[#2B2F34]">
                  Featured Model Mentioned In Guide
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#ffffff]">
                  {relatedProduct.name}
                </h3>
                <p className="text-xs text-[#A8A29E] max-w-xl">
                  {relatedProduct.key_specs}. Available for immediate dispatch from our Yatala QLD depot with nationwide enclosed delivery.
                </p>
                <div className="text-base font-extrabold text-[#E2A17A]">
                  {relatedProduct.price_display}{' '}
                  <span className="text-xs font-normal text-[#A8A29E]">(GST Included)</span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <Link
                  href={`/shop/${CATEGORIES.find((c) => c.rawCategory === relatedProduct.category)?.slug ?? 'fleet'}/${relatedProduct.slug}/`}
                  className="w-full text-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C86D51] to-[#E2A17A] text-[#121417] font-bold text-xs shadow hover:from-[#E2A17A] hover:to-[#EFC7A6] transition-all"
                >
                  View Full Specs
                </Link>
                <Link
                  href="/shop/"
                  className="w-full text-center px-5 py-2 rounded-lg bg-[#121417] border border-[#2B2F34] text-xs font-medium text-[#ffffff] hover:border-[#E2A17A] transition-colors"
                >
                  Compare Fleet
                </Link>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="pt-6 border-t border-[#2B2F34] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#A8A29E] mr-2">Topics:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#1A1D21] border border-[#2B2F34] text-[#D6D3D1] metal-brushed-dark"
              >
                <Tag className="w-3 h-3 text-[#AEB4B8]" />
                {tag}
              </span>
            ))}
          </div>

          {/* Yatala Depot Credential Banner */}
          <div className="mt-10 p-5 bg-[#0A0B0D] border border-[#2B2F34] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-[#ffffff] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#E2A17A]" />
                <span>{ABN_INFO.companyName} (ABN {ABN_INFO.abn})</span>
              </div>
              <div className="text-[#A8A29E]">
                Depot Location: {ABN_INFO.locality} • Regulated under ASIC Australian commercial laws
              </div>
            </div>
            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E2A17A] hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Yatala Hub: {CONTACT.phoneDisplay}</span>
            </a>
          </div>

          {/* Related Articles Carousel / Grid */}
          <div className="mt-14 pt-8 border-t border-[#2B2F34]">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] mb-6 tracking-tight">
              More Australian Golf Buggy Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.slug}
                  className="bg-[#1A1D21] border border-[#2B2F34] rounded-xl p-4 flex flex-col justify-between hover:border-[#E2A17A]/50 transition-all group metal-brushed-dark"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#E2A17A] uppercase tracking-wider block mb-1.5">
                      {rPost.category}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-[#ffffff] group-hover:text-[#E2A17A] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${rPost.slug}/`}>
                        {rPost.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-xs text-[#A8A29E] line-clamp-2">
                      {rPost.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1F2226] flex items-center justify-between text-[11px]">
                    <span className="text-[#6B645E]">{rPost.readTime}</span>
                    <Link
                      href={`/blog/${rPost.slug}/`}
                      className="text-[#E2A17A] font-bold hover:underline inline-flex items-center gap-1"
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
        }}
        onRemoveItem={(id) => {
          const updated = cartItems.filter((i) => i.id !== id);
          setCartItems(updated);
        }}
        onClearCart={() => {
          setCartItems([]);
        }}
      />
    </div>
  );
}
