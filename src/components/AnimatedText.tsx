'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';

const CUBIC_BEZIER: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Word-by-word staggered reveal for headings and hero titles with enhanced kinetic presence
interface StaggeredHeadingProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  delay?: number;
}

export function StaggeredHeading({
  text,
  children,
  className = '',
  tag = 'h2',
  delay = 0,
}: StaggeredHeadingProps) {
  const content = text || (typeof children === 'string' ? children : '');
  const words = content.split(' ').filter(Boolean);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: 'blur(6px)',
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.65,
        ease: CUBIC_BEZIER,
      },
    },
  };

  const Component = motion[tag] as typeof motion.h2;

  if (words.length === 0) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.28em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

// Staggered word-by-word reveal for descriptions and paragraphs across the site with vivid flow
interface StaggeredParagraphProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  wordDelay?: number;
  tag?: 'p' | 'div' | 'span';
}

export function StaggeredParagraph({
  text,
  children,
  className = '',
  delay = 0.08,
  wordDelay = 0.015,
  tag = 'p',
}: StaggeredParagraphProps) {
  const content = text || (typeof children === 'string' ? children : '');
  const words = content.split(' ').filter(Boolean);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: wordDelay,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 14,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: CUBIC_BEZIER,
      },
    },
  };

  const Component = motion[tag] as typeof motion.p;

  if (words.length === 0) {
    return (
      <FadeUpText delay={delay} className={className}>
        {children}
      </FadeUpText>
    );
  }

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

// Fade up text on scroll into view with enhanced kinetic lift
interface FadeUpTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function FadeUpText({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  yOffset = 26,
}: FadeUpTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration, delay, ease: CUBIC_BEZIER }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Card wrapper with subtle lift on hover and initial entrance
export function AnimatedCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: CUBIC_BEZIER }}
      whileHover={{ y: -5, transition: { duration: 0.22, ease: 'easeOut' } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Rotating dynamic text highlight
interface RotatingWordsProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

export function RotatingWords({
  words,
  intervalMs = 2800,
  className = '',
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [words.length, intervalMs]);

  return (
    <span className={`inline-flex items-center overflow-hidden py-0.5 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, y: -20, filter: 'blur(6px)', scale: 0.95 }}
          transition={{ duration: 0.45, ease: CUBIC_BEZIER }}
          className="inline-block font-bold text-[#C86D51]"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Animated counting number for metrics (e.g. 61 models, 100%, 10%)
interface AnimatedCounterProps {
  target?: number;
  value?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  value,
  suffix = '',
  prefix = '',
  duration = 2.0,
  className = '',
}: AnimatedCounterProps) {
  const finalValue = target ?? value ?? 0;
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out quartic curve
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * finalValue));

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [inView, finalValue, duration]);

  return (
    <motion.span
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, margin: '-20px' }}
      className={className}
    >
      {prefix}
      {count}
      {suffix}
    </motion.span>
  );
}

// Staggered list container
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.1,
  delay = 0,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item with enhanced elevation
export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 26, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: CUBIC_BEZIER },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Subtle badge pulse/glow animation
export function AnimatedBadge({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: CUBIC_BEZIER }}
      whileHover={{ scale: 1.04 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

