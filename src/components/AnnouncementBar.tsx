'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnnouncementBarProps {
  announcements?: string[];
}

const defaultAnnouncements = [
  'Enclosed trailer delivery direct to your acreage homestead or golf estate across Australia',
  'Official ASIC Registered Entity: Golf Buggies Express PTY LTD (ABN 28 668 598 758) • Yatala QLD',
  'Save 10% on your total vehicle order when settling with Bitcoin (BTC) or USDT',
  'Modern zero-maintenance LiFePO4 Lithium power systems with 3-5 Year Australian Factory Warranties',
];

export default function AnnouncementBar({ announcements = defaultAnnouncements }: AnnouncementBarProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-[#F7EFEA] border-b border-[#E7E5E4] py-2 px-4 text-center text-xs font-semibold text-[#121417] overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 min-h-[20px]">
        <span className="w-2 h-2 rounded-full bg-[#B45A40] animate-pulse shrink-0 hover:-translate-y-px duration-200 transition-all"></span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeSlide}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="inline-block"
          >
            {announcements[activeSlide]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

