'use client';

import * as React from 'react';
import { SITE } from '@/src/config/site';
import type { CartItem } from '@/src/components/CartDrawer';

// localStorage is an external store, so the cart is read through
// useSyncExternalStore rather than seeded into useState.
//
// The previous pattern read localStorage inside a useState initialiser. That
// runs during the client's first render, which the server rendered with an
// empty cart - so the two disagreed and hydration failed for every returning
// visitor who still had something in their cart. getServerSnapshot below is
// what makes server and client agree by construction.
//
// It lived in seven separate copies, which is why the same bug existed seven
// times. One hook now owns reading, writing and cross-tab sync.

const EMPTY: CartItem[] = [];

// getSnapshot must be referentially stable between renders or React will
// re-render forever, so the parsed value is cached against the raw string and
// only re-parsed when the stored text actually changes.
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // 'storage' only fires in OTHER tabs, which is exactly what we want here:
  // same-tab updates come through writeCart's emit().
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SITE.cartKey);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

// The server has no cart. Returning the same empty array every time keeps the
// snapshot stable and makes the server's HTML match the client's first render.
function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

/** Persist the cart and notify every subscriber in this tab. */
export function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(SITE.cartKey, JSON.stringify(items));
  } catch {
    // ignore - a full or blocked store must not break checkout
  }
  emit();
}

/**
 * Cart state with useState-compatible ergonomics: returns the current items
 * and a setter that accepts either a value or an updater, and persists.
 */
export function useCart(): [CartItem[], (next: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void] {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setItems = React.useCallback(
    (next: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
      const resolved = typeof next === 'function' ? next(getSnapshot()) : next;
      writeCart(resolved);
    },
    []
  );

  return [items, setItems];
}
