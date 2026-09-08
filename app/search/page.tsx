'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import ChatHub from '@/src/components/ChatHub';
import { PRODUCTS, SITE, ProductItem } from '@/src/config/site';
import { Search as SearchIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.key_specs.toLowerCase().includes(query) ||
        p.fuel_type.toLowerCase().includes(query) ||
        p.target_audience.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const handleAddToCart = (product: ProductItem) => {
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
    setCartItems(updated);
    setCartOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1d]">
      <Header
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />

      <main id="main" className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Exactly One H1 */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#ffffff]">
            Search Australian Golf Buggies Fleet
          </h1>
          <p className="text-sm text-[#94a3b8] mt-2">
            Instant search across 61 models of electric, lithium, petrol, and commercial utility buggies.
          </p>

          <div className="mt-6 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by model, 48V, 72V lithium, lifted 4x4, commercial, 4-seater..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#101935] border border-[#1e2d4d] rounded-xl text-[#ffffff] placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#fbbf24] text-sm shadow-inner"
              autoFocus
            />
            <SearchIcon className="w-5 h-5 text-[#fbbf24] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {searchTerm.trim() ? (
          <div>
            <div className="text-xs text-[#94a3b8] mb-4">
              Showing {results.length} results for &ldquo;{searchTerm}&rdquo;
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#101935] border border-[#1e2d4d] rounded-xl p-5 flex flex-col justify-between hover:border-[#fbbf24] transition-all shadow-md"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#fbbf24]">
                        {product.category}
                      </span>
                      <h2 className="text-base font-bold text-[#ffffff] mt-1">
                        {product.name}
                      </h2>
                      <div className="text-xs text-[#94a3b8] mt-1 line-clamp-2">
                        {product.key_specs}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#152037] flex items-center justify-between">
                      <div>
                        <div className="text-lg font-serif font-extrabold text-[#fbbf24]">
                          {product.price_display}
                        </div>
                        <div className="text-[10px] text-[#94a3b8]/70">AUD Inc. GST</div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/shop/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${product.slug}/`}
                          className="px-3 py-1.5 bg-[#0a0f1d] text-[#ffffff] text-xs font-semibold rounded hover:bg-[#38bdf8]/20 transition-all border border-[#1e2d4d]"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#fde047] text-[#0a0f1d] text-xs font-extrabold rounded transition-all shadow"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#101935] border border-[#1e2d4d] rounded-2xl p-8 shadow-md">
                <p className="text-sm text-[#94a3b8]">
                  No exact match found for &ldquo;{searchTerm}&rdquo;. Try &ldquo;lithium&rdquo;, &ldquo;lifted&rdquo;, &ldquo;commercial&rdquo;, or &ldquo;4-seater&rdquo;.
                </p>
                <div className="mt-4">
                  <Link
                    href="/shop/"
                    className="inline-flex items-center gap-1.5 text-xs text-[#fbbf24] font-extrabold hover:underline"
                  >
                    <span>Browse complete 61-buggy catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: '72V Lithium Buggies', term: '72V Lithium' },
              { label: 'Lifted Acreage 4x4', term: 'Lifted' },
              { label: 'Luxury 4-Seaters', term: 'Passenger' },
              { label: 'Commercial Cargo', term: 'Utility' },
            ].map((tag) => (
              <button
                key={tag.term}
                type="button"
                onClick={() => setSearchTerm(tag.term)}
                className="p-4 rounded-xl bg-[#101935] border border-[#1e2d4d] text-center hover:border-[#fbbf24] transition-all shadow-md"
              >
                <div className="text-xs font-bold text-[#ffffff]">{tag.label}</div>
                <div className="text-[10px] text-[#94a3b8] mt-1">Tap to filter</div>
              </button>
            ))}
          </div>
        )}
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
          setCartItems(updated);
        }}
        onRemoveItem={(id) => {
          const updated = cartItems.filter((i) => i.id !== id);
          setCartItems(updated);
        }}
        onClearCart={() => setCartItems([])}
      />

      <ChatHub />
    </div>
  );
}
