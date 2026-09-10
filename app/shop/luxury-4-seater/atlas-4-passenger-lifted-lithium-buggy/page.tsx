'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import CartDrawer, { CartItem } from '@/src/components/CartDrawer';
import ChatHub from '@/src/components/ChatHub';
import AtlasLandingPage from '@/src/components/AtlasLandingPage';
import { SITE, PRODUCTS } from '@/src/config/site';
import { useCart } from '@/hooks/use-cart';

export default function AtlasProductPage() {
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

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: 'Atlas 4-Passenger Lifted Lithium Buggy',
    description:
      'Luxury 4-passenger lifted electric golf buggy with 72V commercial lithium battery bank, 5kW AC brushless induction motor, 3-inch suspension lift, and diamond-quilted seating. Designed for Australian acreage homesteads and golf estates.',
    sku: 'BE-ATLAS-4P-LIFT',
    mpn: 'ATLAS-4P-72V-AU',
    brand: {
      '@type': 'Brand',
      name: 'The Buggies Express',
    },
    offers: {
      '@type': 'Offer',
      url: `https://${SITE.domain}/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/`,
      priceCurrency: 'AUD',
      price: '20900',
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Golf Buggies Express PTY LTD',
      },
    },
  };

  const breadcrumbSchema = {
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
        name: 'Luxury 4-Seaters',
        item: `https://${SITE.domain}/shop/luxury-4-seater/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Atlas 4-Passenger Lifted Lithium Buggy',
        item: `https://${SITE.domain}/shop/luxury-4-seater/atlas-4-passenger-lifted-lithium-buggy/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="flex flex-col min-h-screen bg-[#121417]">
        <Header
          cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
          onOpenCart={() => setCartOpen(true)}
        />

        <main id="main" className="flex-1">
          <AtlasLandingPage
            onAddToCart={handleAddAtlasToCart}
          />
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
