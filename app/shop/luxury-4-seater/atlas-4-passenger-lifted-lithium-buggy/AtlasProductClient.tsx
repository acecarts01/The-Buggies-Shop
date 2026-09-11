'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import ChatHub from '@/src/components/ChatHub';
import AtlasLandingPage from '@/src/components/AtlasLandingPage';
import FaqSection from '@/src/components/FaqSection';
import { PRODUCTS } from '@/src/config/site';
import { useCart } from '@/hooks/use-cart';

interface AtlasProductClientProps {
  /** Joined on the server from product-details.ts; keeps the FAQs out of the client bundle. */
  faqs: { q: string; a: string }[];
}

export default function AtlasProductClient({ faqs }: AtlasProductClientProps) {
  const atlasProduct = PRODUCTS.find((p) => p.slug === 'atlas-4-passenger-lifted-lithium-buggy');
  const [cartItems, setCartItems] = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const saveCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
  };

  const handleAddAtlasToCart = () => {
    const atlasProduct = PRODUCTS.find((p) => p.slug.includes('atlas')) || {
      id: 'atlas-4-passenger-lifted-lithium-buggy',
      name: 'Atlas 4-Passenger Lifted Lithium Buggy',
      price_aud: 20900,
      price_display: '$20,900',
      category: 'Luxury & High-Demand 4-Seater',
    };

    const existing = cartItems.find((i) => i.id === atlasProduct.id);
    let updated: CartItem[];
    if (existing) {
      updated = cartItems.map((i) =>
        i.id === atlasProduct.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [
        ...cartItems,
        {
          id: atlasProduct.id,
          name: atlasProduct.name,
          price_aud: atlasProduct.price_aud,
          price_display: atlasProduct.price_display,
          quantity: 1,
          category: atlasProduct.category,
        },
      ];
    }
    saveCart(updated);
    setCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    const updated = cartItems
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
      .filter((i) => i.quantity > 0);
    saveCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((i) => i.id !== id);
    saveCart(updated);
  };

  // JSON-LD (Product + BreadcrumbList) is emitted by layout.tsx from
  // lib/schema.ts, the same builder every other product page uses.

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header
          cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
          onOpenCart={() => setCartOpen(true)}
        />

        <main id="main" className="flex-1">
          <AtlasLandingPage
            onAddToCart={handleAddAtlasToCart}
          />

          {/* This flagship has a bespoke layout rather than the shared
              ProductClient, so its FAQs are pulled in explicitly. */}
          {atlasProduct && faqs.length > 0 && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
              <div className="bg-[#1A1D21] border border-[#2B2F34] rounded-2xl p-6 sm:p-8 shadow-sm metal-brushed-dark">
                <FaqSection
                  items={faqs}
                  heading={`${atlasProduct.name} — Questions Buyers Ask`}
                  tone="dark"
                />
              </div>
            </div>
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
