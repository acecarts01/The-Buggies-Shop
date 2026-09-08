'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import ChatHub from '@/src/components/ChatHub';
import CatalogInterface from '@/src/components/CatalogInterface';
import { SITE, ProductItem } from '@/src/config/site';
import {
  StaggeredHeading,
  StaggeredParagraph
} from '@/src/components/AnimatedText';

export default function ShopPage() {
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="flex flex-col min-h-screen bg-[#0a0f1d]">
        <Header
          cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
          onOpenCart={() => setCartOpen(true)}
        />

        <main id="main" className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 space-y-1">
            <StaggeredHeading
              tag="h1"
              text="Australian Golf Buggies Fleet — All 61 Models for Sale"
              className="text-3xl sm:text-4xl font-serif font-bold text-[#ffffff]"
            />
            <StaggeredParagraph delay={0.15} className="text-xs sm:text-sm text-[#94a3b8] mt-1 max-w-2xl leading-relaxed">
              Inspect our comprehensive lineup of 48V/72V lithium passenger buggies, lifted acreage 4x4 carts, commercial utilities, and motorized walk-behind buggies. Tested in Yatala QLD.
            </StaggeredParagraph>
          </div>

          <CatalogInterface initialCategory="all" onAddToCart={handleAddToCart} />
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
