'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Tag, 
  Sparkles, 
  BookOpen, 
  Wrench, 
  ShieldCheck, 
  Phone,
  Filter
} from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ChatHub from '@/src/components/ChatHub';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import { POSTS, BlogPost, SITE, ABN_INFO, CONTACT } from '@/src/config/site';
import {
  StaggeredHeading,
  StaggeredParagraph,
  FadeUpText,
  AnimatedCard,
  StaggerContainer,
  StaggerItem
} from '@/src/components/AnimatedText';

export default function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartOpen, setCartOpen] = useState(false);
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

  const categories = useMemo(() => {
    const set = new Set(POSTS.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredPosts = useMemo(() => {
    return POSTS.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return POSTS.find((p) => p.featured) || POSTS[0];
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d] text-[#ffffff]">
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#070b16] border-b border-[#152037] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[#94a3b8]">
          <Link href="/" className="hover:text-[#fbbf24] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#fbbf24] font-medium">Golf Buggy Blog &amp; Guides</span>
        </div>
      </div>

      <main id="main" className="flex-1">
        {/* Hero Section */}
        <section className="relative py-14 sm:py-18 px-4 border-b border-[#1e2d4d] bg-gradient-to-b from-[#0e162e] to-[#0a0f1d]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <FadeUpText delay={0.05} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101935] border border-[#fbbf24]/40 text-[#fbbf24] text-xs font-semibold uppercase tracking-wider mb-4">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Australian Golf Buggy Knowledge Hub</span>
                </FadeUpText>
                {/* Exactly one H1 for this page */}
                <StaggeredHeading
                  tag="h1"
                  text="Golf Buggy Technical Guides, Buying Advice & Fleet Insights"
                  className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#ffffff] leading-tight"
                />
                <StaggeredParagraph delay={0.15} className="mt-4 text-base sm:text-lg text-[#94a3b8] leading-relaxed">
                  Engineered advice directly from our Yatala QLD technical depot. Practical insights into 48V LiFePO4 battery upgrades, Australian road registration compliance, lifted 4x4 acreage performance, and commercial maintenance.
                </StaggeredParagraph>
              </div>

              {/* Yatala Direct Hotline Callout */}
              <AnimatedCard delay={0.2} className="bg-[#101935] border border-[#1e2d4d] rounded-xl p-4 sm:p-5 shrink-0 max-w-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#fbbf24]" />
                  <span>Workshop Enquiries</span>
                </div>
                <div className="text-xs text-[#cbd5e1] mb-2">
                  Need tailored advice for your estate, farm, or golf club? Speak directly with our Yatala engineers.
                </div>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#ffffff] hover:text-[#fbbf24] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#fbbf24]" />
                  <span>{CONTACT.phoneDisplay} (Mon – Sat)</span>
                </a>
              </AnimatedCard>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-10 pt-6 border-t border-[#152037] flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none" role="tablist">
                <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                  <Filter className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Category:</span>
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border ${
                      selectedCategory === cat
                        ? 'bg-[#fbbf24] text-[#0a0f1d] border-[#fbbf24] font-bold shadow-sm'
                        : 'bg-[#101935] text-[#cbd5e1] border-[#1e2d4d] hover:border-[#fbbf24]/60 hover:text-[#ffffff]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px] sm:w-72">
                <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles & tech..."
                  aria-label="Search blog articles"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#070b16] border border-[#1e2d4d] rounded-lg text-[#ffffff] placeholder-[#64748b] focus:outline-none focus:border-[#fbbf24] transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Guide Banner (shown when no specific category is filtered or when featured matches) */}
        {selectedCategory === 'All' && !searchQuery && featuredPost && (
          <section className="py-10 px-4 border-b border-[#1e2d4d] bg-[#070b16]/60">
            <div className="max-w-7xl mx-auto">
              <FadeUpText delay={0.05} className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Technical Article</span>
              </FadeUpText>

              <AnimatedCard delay={0.1} className="bg-[#101935] border border-[#1e2d4d] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl hover:border-[#fbbf24]/50 transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#94a3b8]">
                      <span className="px-2.5 py-1 rounded bg-[#0a0f1d] border border-[#1e2d4d] text-[#fbbf24] font-semibold">
                        {featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#fbbf24]" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                        {featuredPost.readTime}
                      </span>
                      <span className="flex items-center gap-1 text-[#e2e8f0]">
                        <User className="w-3.5 h-3.5 text-[#fbbf24]" />
                        {featuredPost.author.name}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#ffffff] leading-snug">
                      <Link
                        href={`/blog/${featuredPost.slug}/`}
                        className="hover:text-[#fbbf24] transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <StaggeredParagraph delay={0.1} className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
                      {featuredPost.excerpt}
                    </StaggeredParagraph>

                    {/* Key takeaways snippet */}
                    <div className="p-4 bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl text-xs space-y-2">
                      <div className="font-bold text-[#fbbf24] uppercase tracking-wider text-[11px]">
                        Core Technical Takeaways:
                      </div>
                      <ul className="space-y-1 text-[#cbd5e1]">
                        {featuredPost.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#fbbf24] font-bold shrink-0">•</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/blog/${featuredPost.slug}/`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-[#0a0f1d] font-bold text-xs shadow hover:from-[#fbbf24] hover:to-[#fde047] transition-all"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/"
                        className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:text-[#fbbf24] font-medium transition-colors"
                      >
                        <span>Explore Atlas 4-Seater Lithium Buggy</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-[#0a0f1d] border border-[#1e2d4d] rounded-xl p-5 space-y-3">
                    <div className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#152037] pb-2">
                      <Wrench className="w-4 h-4 text-[#fbbf24]" />
                      <span>About Yatala Tech Support</span>
                    </div>
                    <StaggeredParagraph delay={0.15} className="text-xs text-[#94a3b8] leading-relaxed">
                      Every guide published by Golf Buggies Express is written and reviewed by licensed technicians and fleet specialists at our Yatala QLD engineering facility (ABN 28 668 598 758).
                    </StaggeredParagraph>
                    <div className="pt-2 space-y-1.5 text-[11px] text-[#cbd5e1]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                        <span>Genuine OEM Spare Parts &amp; LiFePO4 Cells</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                        <span>Australian Transport Regulations (TMR &amp; TfNSW)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                        <span>Enclosed Direct Freight to All States</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff]">
                {selectedCategory === 'All' ? 'All Published Guides & Articles' : `${selectedCategory} Articles`}
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Showing {filteredPosts.length} comprehensive technical resources
              </p>
            </div>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="text-xs text-[#fbbf24] hover:underline font-semibold"
              >
                Reset to All Guides
              </button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-[#101935] border border-[#1e2d4d] rounded-xl p-12 text-center">
              <BookOpen className="w-8 h-8 text-[#fbbf24] mx-auto mb-3" />
              <div className="text-base font-bold text-[#ffffff]">No articles found</div>
              <p className="text-xs text-[#94a3b8] mt-1 max-w-md mx-auto">
                No guides matched your search query &ldquo;{searchQuery}&rdquo;. Try another term or reset your category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#fbbf24] text-[#0a0f1d] font-bold text-xs hover:bg-[#fde047] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <StaggerItem
                  key={post.slug}
                  className="bg-[#101935] border border-[#1e2d4d] rounded-xl overflow-hidden flex flex-col hover:border-[#fbbf24]/60 transition-all group shadow-md"
                >
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta badge row */}
                      <div className="flex items-center justify-between gap-2 text-[11px] mb-3">
                        <span className="px-2.5 py-0.5 rounded bg-[#070b16] border border-[#1e2d4d] text-[#fbbf24] font-semibold">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-[#94a3b8]">
                          <Clock className="w-3 h-3 text-[#38bdf8]" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-[#ffffff] group-hover:text-[#fbbf24] transition-colors leading-snug line-clamp-2">
                        <Link href={`/blog/${post.slug}/`}>
                          {post.title}
                        </Link>
                      </h3>

                      <StaggeredParagraph delay={0.05} className="mt-2.5 text-xs text-[#94a3b8] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </StaggeredParagraph>

                      {/* Tag badges */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#0a0f1d] border border-[#152037] text-[#cbd5e1]"
                          >
                            <Tag className="w-2.5 h-2.5 text-[#38bdf8]" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#152037] flex items-center justify-between">
                      <div className="text-[11px] text-[#94a3b8]">
                        <span className="block font-medium text-[#e2e8f0]">{post.author.name}</span>
                        <span className="text-[10px] text-[#64748b]">{post.date}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}/`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fbbf24] group-hover:text-[#fde047] transition-colors"
                        aria-label={`Read guide: ${post.title}`}
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>

        {/* Advisory / Consultation Banner */}
        <section className="py-12 px-4 bg-[#070b16] border-t border-[#1e2d4d]">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#ffffff]">
              Have a Question About Battery Conversions or Estate Access?
            </h2>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Our technicians at the Yatala QLD operations hub can inspect your current buggy, recommend the ideal lithium pack, or specify the right 4-seater or utility buggy for your acreage property.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact/"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-[#0a0f1d] font-bold text-xs shadow hover:from-[#fbbf24] hover:to-[#fde047] transition-all"
              >
                Book Technical Consultation
              </Link>
              <Link
                href="/shop/"
                className="px-5 py-2.5 rounded-lg bg-[#101935] border border-[#1e2d4d] text-[#ffffff] hover:border-[#fbbf24] font-bold text-xs transition-colors"
              >
                Browse 61+ Buggies in Stock
              </Link>
            </div>
          </div>
        </section>
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
