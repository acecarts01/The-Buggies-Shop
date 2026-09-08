'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  ThumbsUp,
  ExternalLink,
  SlidersHorizontal,
  LayoutGrid,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { REVIEWS_DATA, TRUSTPILOT_STATS, ReviewItem } from '@/src/config/reviews';

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [isPaused, setIsPaused] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter reviews by rating or category or search
  const filteredReviews = useMemo(() => {
    return REVIEWS_DATA.filter((review) => {
      let matchesFilter = true;
      if (selectedFilter === '5star') {
        matchesFilter = review.rating === 5;
      } else if (selectedFilter === '4star') {
        matchesFilter = review.rating === 4;
      } else if (selectedFilter === '3star') {
        matchesFilter = review.rating === 3;
      } else if (selectedFilter === '2star') {
        matchesFilter = review.rating === 2;
      } else if (selectedFilter !== 'all') {
        matchesFilter = review.category === selectedFilter;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        review.title.toLowerCase().includes(q) ||
        review.text.toLowerCase().includes(q) ||
        review.author.toLowerCase().includes(q) ||
        review.location.toLowerCase().includes(q) ||
        (review.productMentioned && review.productMentioned.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  // Items visible per view (responsive: 1 on mobile, 2 on tablet, 3 on desktop)
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Max index for sliding
  const maxIndex = Math.max(0, filteredReviews.length - cardsPerView);

  // Auto-play sliding
  useEffect(() => {
    if (viewMode !== 'carousel' || isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5500);

    return () => clearInterval(timer);
  }, [viewMode, isPaused, maxIndex]);

  // Filter change handlers
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentIndex(0);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentIndex(0);
  };

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handleHelpful = (id: string, initialCount = 0) => {
    if (userVoted[id]) return;
    setUserVoted((prev) => ({ ...prev, [id]: true }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Counts for filters
  const count5 = useMemo(() => REVIEWS_DATA.filter((r) => r.rating === 5).length, []);
  const count4 = useMemo(() => REVIEWS_DATA.filter((r) => r.rating === 4).length, []);
  const count3 = useMemo(() => REVIEWS_DATA.filter((r) => r.rating === 3).length, []);
  const count2 = useMemo(() => REVIEWS_DATA.filter((r) => r.rating === 2).length, []);

  return (
    <section
      id="customer-reviews"
      className="py-16 bg-[#F8F9FA] border-t border-b border-[#E2E8F0] relative overflow-hidden"
    >
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00b67a]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Trustpilot Top Header & Overall Rating Hero */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
            {/* Trustpilot Score Block */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Trustpilot Brand Logo & Star Cluster */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#00b67a] rounded flex items-center justify-center text-white font-bold text-base shadow-xs">
                    ★
                  </div>
                  <span className="font-sans font-extrabold text-xl sm:text-2xl text-[#1E293B] tracking-tight">
                    Trustpilot
                  </span>
                </div>
                <div className="text-xs text-[#64748B] flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#00b67a]" />
                  <span>Verified Australian Customer Reviews</span>
                </div>
              </div>

              {/* Live Rating Score Box */}
              <div className="sm:border-l sm:border-[#E2E8F0] sm:pl-5 flex items-center gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-2xs ${
                          star <= 4
                            ? 'bg-[#00b67a]'
                            : star === 5
                            ? 'bg-[#00b67a]/80'
                            : 'bg-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg sm:text-xl font-bold text-[#1E293B]">
                      {TRUSTPILOT_STATS.trustScore}
                    </span>
                    <span className="text-xs text-[#64748B]">out of 5.0</span>
                    <span className="px-2 py-0.5 bg-[#00b67a]/10 border border-[#00b67a]/30 text-[#00b67a] text-[11px] font-extrabold rounded-full">
                      {TRUSTPILOT_STATS.ratingCategory}
                    </span>
                  </div>
                </div>
                <div className="text-right sm:text-left text-xs text-[#64748B]">
                  <div className="font-bold text-[#1E293B] text-sm">
                    {TRUSTPILOT_STATS.totalReviews.toLocaleString()}+ reviews
                  </div>
                  <div>90 Verified Australian Orders (Mixed ratings)</div>
                </div>
              </div>
            </div>

            {/* Overall Rating Breakdown Gauge Bar */}
            <div className="flex-1 max-w-sm bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1.5">
              <div className="text-[11px] text-[#64748B] font-semibold flex justify-between">
                <span>Rating Breakdown</span>
                <span className="text-[#00b67a] font-bold">77% 4 &amp; 5 Stars</span>
              </div>
              <div className="space-y-1">
                {/* 5 Star */}
                <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                  <span className="w-10 font-medium">5-star</span>
                  <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00b67a] rounded-full"
                      style={{ width: `${TRUSTPILOT_STATS.breakdown[5]}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-[#1E293B] font-mono font-medium">
                    {count5}
                  </span>
                </div>
                {/* 4 Star */}
                <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                  <span className="w-10 font-medium">4-star</span>
                  <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00b67a]/80 rounded-full"
                      style={{ width: `${TRUSTPILOT_STATS.breakdown[4]}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-[#1E293B] font-mono font-medium">
                    {count4}
                  </span>
                </div>
                {/* 3 Star */}
                <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                  <span className="w-10 font-medium">3-star</span>
                  <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d97706] rounded-full"
                      style={{ width: `${TRUSTPILOT_STATS.breakdown[3]}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-[#1E293B] font-mono font-medium">
                    {count3}
                  </span>
                </div>
                {/* 2 Star */}
                <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                  <span className="w-10 font-medium">2-star</span>
                  <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ea580c] rounded-full"
                      style={{ width: `${TRUSTPILOT_STATS.breakdown[2]}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-[#1E293B] font-mono font-medium">
                    {count2}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtering & Search Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Filter Badges: All + Star Filters + Categories */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  selectedFilter === 'all'
                    ? 'bg-[#00b67a] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                <span>All Reviews</span>
                <span className="text-[10px] opacity-80">({REVIEWS_DATA.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('5star')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  selectedFilter === '5star'
                    ? 'bg-[#00b67a] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                <span className="text-[#00b67a] bg-[#00b67a]/10 px-1 rounded text-[10px]">5★</span>
                <span>5 Stars ({count5})</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('4star')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  selectedFilter === '4star'
                    ? 'bg-[#00b67a] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                <span className="text-[#00b67a] bg-[#00b67a]/10 px-1 rounded text-[10px]">4★</span>
                <span>4 Stars ({count4})</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('3star')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  selectedFilter === '3star'
                    ? 'bg-[#d97706] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                <span className="text-[#d97706] bg-amber-50 px-1 rounded text-[10px]">3★</span>
                <span>3 Stars ({count3})</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('2star')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  selectedFilter === '2star'
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                <span className="text-[#ea580c] bg-orange-50 px-1 rounded text-[10px]">2★</span>
                <span>2 Stars ({count2})</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('buggies')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedFilter === 'buggies'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                Electric Carts
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('batteries')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedFilter === 'batteries'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                Lithium Batteries
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('accessories')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedFilter === 'accessories'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                Accessories
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('service')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedFilter === 'service'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#1E293B] hover:bg-[#EFF6FF] border border-[#E2E8F0]'
                }`}
              >
                Freight &amp; Service
              </button>
            </div>

            {/* Search Input & View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews or location..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#1E293B] placeholder-[#64748B]/60 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('carousel')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'carousel'
                      ? 'bg-white text-[#1E293B] shadow-2xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                  aria-label="Carousel view"
                  title="Carousel view"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#1E293B] shadow-2xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel / Grid Display Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="space-y-6"
        >
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-2xl p-8">
              <p className="text-[#64748B] text-sm">
                No reviews found matching &quot;{searchQuery}&quot; or this rating filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="mt-3 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'carousel' ? (
            /* Carousel Slider View */
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Previous review slide"
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all flex items-center justify-center shadow-md disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                aria-label="Next review slide"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all flex items-center justify-center shadow-md disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Cards Viewport */}
              <div ref={containerRef} className="overflow-hidden px-1 py-2">
                <div
                  className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / cardsPerView + (cardsPerView > 1 ? 1.5 : 0))}%)`,
                  }}
                >
                  {filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      className="shrink-0 flex"
                      style={{
                        width:
                          cardsPerView === 1
                            ? '100%'
                            : cardsPerView === 2
                            ? 'calc(50% - 12px)'
                            : 'calc(33.333% - 16px)',
                      }}
                    >
                      <ReviewCard
                        review={review}
                        isExpanded={expandedReviewId === review.id}
                        onToggleExpand={() =>
                          setExpandedReviewId((prev) => (prev === review.id ? null : review.id))
                        }
                        onHelpful={handleHelpful}
                        helpfulCount={helpfulVotes[review.id] ?? review.helpfulCount ?? 0}
                        hasVoted={!!userVoted[review.id]}
                        getInitials={getInitials}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicator & Progress Bar */}
              <div className="flex items-center justify-between pt-4 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#1E293B] font-bold">
                    {Math.min(filteredReviews.length, currentIndex + 1)}–
                    {Math.min(filteredReviews.length, currentIndex + cardsPerView)}
                  </span>
                  <span>of {filteredReviews.length} reviews shown</span>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center gap-1">
                  {Array.from({
                    length: Math.min(10, Math.ceil(filteredReviews.length / cardsPerView)),
                  }).map((_, idx) => {
                    const isActive = Math.floor(currentIndex / cardsPerView) === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx * cardsPerView)}
                        className={`h-1.5 rounded-full transition-all ${
                          isActive ? 'w-6 bg-[#00b67a]' : 'w-1.5 bg-[#E2E8F0] hover:bg-[#64748B]'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Grid View (All Reviews) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isExpanded={expandedReviewId === review.id}
                  onToggleExpand={() =>
                    setExpandedReviewId((prev) => (prev === review.id ? null : review.id))
                  }
                  onHelpful={handleHelpful}
                  helpfulCount={helpfulVotes[review.id] ?? review.helpfulCount ?? 0}
                  hasVoted={!!userVoted[review.id]}
                  getInitials={getInitials}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#EFF6FF] border border-[#2563EB]/20 rounded-xl flex items-center justify-center text-[#2563EB] shrink-0 shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-[#1E293B] text-base">
                100% Genuine Australian Customer Feedback
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                Transparent feedback from residential, commercial golf resorts, and fleet maintenance clients across Australia.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.trustpilot.com/review/drummondgolf.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#00b67a] hover:bg-[#009e6a] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>View On Trustpilot</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Subcomponent: Individual Review Card
function ReviewCard({
  review,
  isExpanded,
  onToggleExpand,
  onHelpful,
  helpfulCount,
  hasVoted,
  getInitials,
}: {
  review: ReviewItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onHelpful: (id: string, initialCount?: number) => void;
  helpfulCount: number;
  hasVoted: boolean;
  getInitials: (name: string) => string;
}) {
  const isLong = review.text.length > 180;
  const displayedText =
    isLong && !isExpanded ? `${review.text.slice(0, 180)}...` : review.text;

  // Star color configuration based on Trustpilot standards:
  // 5 & 4: Trustpilot Green (#00b67a)
  // 3: Trustpilot Amber (#d97706)
  // 2: Trustpilot Orange (#ea580c)
  const getStarColor = (starIndex: number, rating: number) => {
    if (starIndex >= rating) return 'bg-[#E2E8F0] text-[#64748B]';
    if (rating >= 4) return 'bg-[#00b67a] text-white';
    if (rating === 3) return 'bg-[#d97706] text-white';
    return 'bg-[#ea580c] text-white';
  };

  return (
    <div className="w-full bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5">
      {/* Top Meta: Stars, Date, Verified Badge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {/* Trustpilot Stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shadow-2xs ${getStarColor(
                  i,
                  review.rating
                )}`}
              >
                ★
              </div>
            ))}
          </div>

          {/* Date */}
          <span className="text-[11px] text-[#64748B] font-mono">{review.date}</span>
        </div>

        {/* Review Title */}
        <h3 className="font-bold text-[#1E293B] text-sm leading-snug line-clamp-2">
          &quot;{review.title}&quot;
        </h3>

        {/* Review Body */}
        <div className="text-xs text-[#64748B] leading-relaxed">
          <p>{displayedText}</p>
          {isLong && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="text-[#2563EB] font-bold text-[11px] hover:underline mt-1 block"
            >
              {isExpanded ? 'Read less' : 'Read full review'}
            </button>
          )}
        </div>

        {/* Product Mentioned Tag */}
        {review.productMentioned && (
          <div className="pt-2 border-t border-[#E2E8F0]">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              <span>{review.productMentioned}</span>
            </span>
          </div>
        )}
      </div>

      {/* Author & Verification Bottom Row */}
      <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
        {/* Author Details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#2563EB]/20 text-[#2563EB] font-extrabold text-[11px] flex items-center justify-center shrink-0">
            {getInitials(review.author)}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[#1E293B] text-xs truncate flex items-center gap-1">
              <span>{review.author}</span>
            </div>
            <div className="text-[10px] text-[#64748B] flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-[#2563EB]" />
              <span className="truncate">{review.location}</span>
            </div>
          </div>
        </div>

        {/* Helpful Thumbs Button */}
        <button
          type="button"
          onClick={() => onHelpful(review.id, review.helpfulCount)}
          disabled={hasVoted}
          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors ${
            hasVoted
              ? 'bg-[#EFF6FF] text-[#2563EB] font-bold'
              : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F9FA]'
          }`}
          aria-label="Vote review as helpful"
          title="Mark this review as helpful"
        >
          <ThumbsUp className="w-3 h-3" />
          <span className="font-mono text-[10px]">{helpfulCount}</span>
        </button>
      </div>
    </div>
  );
}
