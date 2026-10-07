'use client';

import React, { useEffect, useRef, useState } from 'react';

// Entrance animations, done in CSS rather than with the `motion` library.
//
// The previous version wrapped every WORD of every heading and paragraph in a
// motion component that started at opacity 0 and waited for hydration and an
// IntersectionObserver before showing. On a phone that put thousands of
// animated React nodes through hydration (seconds of main-thread work), and
// because the text started invisible the largest contentful paint could not
// happen until all of it had run. Now each block is one element:
//
//   * it is visible from the first paint (only a small slide-up and a partial
//     fade are animated, never opacity 0), so LCP no longer waits on scripts;
//   * the slide-up runs in CSS, and where the browser supports scroll-driven
//     animation it plays as the block scrolls into view (see globals.css);
//   * `prefers-reduced-motion` turns it off;
//   * the full text is a single text node, so crawlers read it unbroken.
//
// Component names and props are unchanged, so no caller needed editing.

type Vars = React.CSSProperties & { [k: `--${string}`]: string | number | undefined };

const reveal = (delay: number, y = 18): Vars => ({ '--d': `${delay}s`, '--y': `${y}px` });

interface StaggeredHeadingProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  delay?: number;
}

export function StaggeredHeading({ text, children, className = '', tag = 'h2', delay = 0 }: StaggeredHeadingProps) {
  const Tag = tag;
  return (
    <Tag className={`reveal ${className}`} style={reveal(delay, 22)}>
      {text ?? children}
    </Tag>
  );
}

interface StaggeredParagraphProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  /** Kept for compatibility; words are no longer animated one by one. */
  wordDelay?: number;
  tag?: 'p' | 'div' | 'span';
}

export function StaggeredParagraph({ text, children, className = '', delay = 0.08, tag = 'p' }: StaggeredParagraphProps) {
  const Tag = tag;
  return (
    <Tag className={`reveal ${className}`} style={reveal(delay, 14)}>
      {text ?? children}
    </Tag>
  );
}

interface FadeUpTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Kept for compatibility. */
  duration?: number;
  yOffset?: number;
}

export function FadeUpText({ children, className = '', delay = 0, yOffset = 26 }: FadeUpTextProps) {
  return (
    <div className={`reveal ${className}`} style={reveal(delay, yOffset)}>
      {children}
    </div>
  );
}

export function AnimatedCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`reveal transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none ${className}`} style={reveal(delay, 28)}>
      {children}
    </div>
  );
}

interface RotatingWordsProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

export function RotatingWords({ words, intervalMs = 2800, className = '' }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), intervalMs);
    return () => clearInterval(timer);
  }, [words.length, intervalMs]);
  return (
    <span className={`inline-flex items-center overflow-hidden py-0.5 ${className}`}>
      <span key={words[index]} className="word-swap inline-block font-bold text-[#A85640]">
        {words[index]}
      </span>
    </span>
  );
}

interface AnimatedCounterProps {
  target?: number;
  value?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/** Counts up once when scrolled into view. The number is real text from the first render. */
export function AnimatedCounter({ target, value, suffix = '', prefix = '', duration = 2.0, className = '' }: AnimatedCounterProps) {
  const finalValue = target ?? value ?? 0;
  const [count, setCount] = useState(finalValue);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        let start: number | null = null;
        const tick = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / (duration * 1000), 1);
          setCount(Math.round((1 - Math.pow(1 - p, 4)) * finalValue));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        setCount(0);
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: '-20px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [finalValue, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

/** Children get a staggered slide-up (see `.stagger` in globals.css). */
export function StaggerContainer({ children, className = '', stagger = 0.1, delay = 0 }: StaggerContainerProps) {
  return (
    <div className={`stagger ${className}`} style={{ '--step': `${stagger}s`, '--d': `${delay}s` } as Vars}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`stagger-item ${className}`}>{children}</div>;
}

export function AnimatedBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`badge-in transition-transform duration-200 hover:scale-[1.04] motion-reduce:transition-none ${className}`}>
      {children}
    </div>
  );
}
