'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import ChatHub from '@/src/components/ChatHub';
import CatalogInterface from '@/src/components/CatalogInterface';
import { SITE, CATEGORIES, ProductItem } from '@/src/config/site';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import {
  StaggeredHeading,
  StaggeredParagraph
} from '@/src/components/AnimatedText';

interface CategoryClientProps {
  categorySlug: string;
  categoryName: string;
}

// Stable fallbacks. Returning a fresh [] from the `??` below would hand the
// React Compiler a new reference every render and cost the memoization in
// this component.
const NO_SECTIONS: ReadonlyArray<{ heading: string; body: string }> = [];
const NO_GUIDES: ReadonlyArray<{ slug: string; label: string }> = [];

export default function CategoryClient({ categorySlug, categoryName }: CategoryClientProps) {
  const [cartItems, setCartItems] = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const saveCart = useCallback((newItems: CartItem[]) => {
    setCartItems(newItems);
  }, [setCartItems]);

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
      return updated;
    });
    setCartOpen(true);
  }, [setCartItems]);

  const handleUpdateQty = useCallback((id: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
      return updated;
    });
  }, [setCartItems]);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      return updated;
    });
  }, [setCartItems]);

  // Per-category body copy (see docs/keyword-map.md). Categories without it
  // fall back to the shared line, which is why that line must stay generic -
  // it is shown on more than one page.
  //
  // Keep this lookup BELOW the hooks. Above them the React Compiler bails out
  // with "Existing memoization could not be preserved" and drops this
  // component's memoization entirely.
  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  const intro = cat?.intro;
  const sections = cat?.sections ?? NO_SECTIONS;
  const guides = cat?.guides ?? NO_GUIDES;

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
        name: 'Shop',
        item: `https://${SITE.domain}/shop/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `https://${SITE.domain}/shop/${categorySlug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header
          cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
          onOpenCart={() => setCartOpen(true)}
        />

        <main id="main" className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 space-y-1">
            <StaggeredHeading
              tag="h1"
              text={`${categoryName} Buggies for Sale in Australia`}
              className="text-3xl sm:text-4xl font-serif font-bold text-[#ffffff] tracking-tight"
            />
            <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#A8A29E] mt-1 max-w-2xl leading-relaxed">
              {intro ??
                'Australian tested specifications, verified nationwide enclosed delivery, and factory warranty backup from our Yatala QLD engineering workshop.'}
            </StaggeredParagraph>
          </div>

          <CatalogInterface initialCategory={categorySlug} onAddToCart={handleAddToCart} />

          {sections.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-10 border-t border-[#2B2F34]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((s) => (
                  <div
                    key={s.heading}
                    className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs metal-brushed-dark"
                  >
                    <h2 className="text-base sm:text-lg font-serif font-bold text-[#ffffff] tracking-tight">
                      {s.heading}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>

              {guides.length > 0 && (
                <div className="mt-8 bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 space-y-3 shadow-xs metal-brushed-dark">
                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#ffffff] tracking-tight">
                    Buying Guides for This Range
                  </h2>
                  <ul className="space-y-2">
                    {guides.map((g) => (
                      <li key={g.slug}>
                        <Link
                          href={`/blog/${g.slug}/`}
                          className="text-xs sm:text-sm text-[#E2A17A] hover:underline font-semibold"
                        >
                          {g.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </main>

        <Footer />

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => saveCart([])}
        />

        <ChatHub />
      </div>
    </>
  );
}
