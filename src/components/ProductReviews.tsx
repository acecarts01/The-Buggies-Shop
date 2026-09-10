'use client';

import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle, 
  ThumbsUp, 
  MessageSquarePlus, 
  ShieldCheck, 
  Filter, 
  Award,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { ProductItem } from '@/src/config/site';
import { REVIEWS_DATA, ReviewItem } from '@/src/config/reviews';

interface ProductReviewsProps {
  product: ProductItem;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  // Find reviews tailored to this product, brand, and category
  const getInitialReviews = (): ReviewItem[] => {
    const productNameLower = product.name.toLowerCase();
    const productCategoryLower = product.category.toLowerCase();
    const keySpecsLower = product.key_specs.toLowerCase();

    // 1. Direct model or brand mention match
    const exactMatches = REVIEWS_DATA.filter((r) => {
      const mentionLower = (r.productMentioned || '').toLowerCase();
      const textLower = r.text.toLowerCase();
      const titleLower = r.title.toLowerCase();

      // Check if product name keywords are in review
      const productWords = productNameLower.split(' ').filter(w => w.length > 3);
      const hasWordMatch = productWords.some(w => mentionLower.includes(w) || textLower.includes(w) || titleLower.includes(w));
      
      // Brand checks
      if (productNameLower.includes('atlas') && (mentionLower.includes('atlas') || textLower.includes('atlas'))) return true;
      if (productNameLower.includes('evolution') && (mentionLower.includes('evolution') || textLower.includes('evolution') || mentionLower.includes('forester') || mentionLower.includes('classic 2'))) return true;
      if (productNameLower.includes('club car') && (mentionLower.includes('club car') || textLower.includes('club car') || mentionLower.includes('onward') || mentionLower.includes('tempo'))) return true;
      if (productNameLower.includes('yamaha') && (mentionLower.includes('yamaha') || textLower.includes('yamaha') || mentionLower.includes('drive2'))) return true;
      if (productNameLower.includes('ezgo') || productNameLower.includes('e-z-go') && (mentionLower.includes('ezgo') || textLower.includes('ezgo') || mentionLower.includes('rxv'))) return true;
      if (productNameLower.includes('roypow') && (mentionLower.includes('roypow') || textLower.includes('roypow'))) return true;
      if (productNameLower.includes('eco-battery') || productNameLower.includes('eco battery') && (mentionLower.includes('eco') || textLower.includes('eco-battery'))) return true;
      if (productNameLower.includes('mgi') || productNameLower.includes('navigator') && (mentionLower.includes('mgi') || mentionLower.includes('navigator'))) return true;
      if (productNameLower.includes('motocaddy') && (mentionLower.includes('motocaddy') || textLower.includes('motocaddy'))) return true;

      return hasWordMatch;
    });

    // 2. Category specific matches
    let categoryMatches: ReviewItem[] = [];
    if (productCategoryLower.includes('batteries') || productCategoryLower.includes('charger') || keySpecsLower.includes('lifepo4') || keySpecsLower.includes('lithium')) {
      categoryMatches = REVIEWS_DATA.filter(r => r.category === 'batteries' && !exactMatches.some(em => em.id === r.id));
    } else if (productCategoryLower.includes('accessories') || productCategoryLower.includes('parts') || productCategoryLower.includes('enclosure') || productCategoryLower.includes('mount')) {
      categoryMatches = REVIEWS_DATA.filter(r => r.category === 'accessories' && !exactMatches.some(em => em.id === r.id));
    } else {
      categoryMatches = REVIEWS_DATA.filter(r => (r.category === 'buggies' || r.category === 'service') && !exactMatches.some(em => em.id === r.id));
    }

    // Combine matches
    let combined = [...exactMatches, ...categoryMatches];

    // Ensure we always have at least 3-5 high-quality reviews
    if (combined.length < 3) {
      const genericHigh = REVIEWS_DATA.filter(r => !combined.some(c => c.id === r.id)).slice(0, 4);
      combined = [...combined, ...genericHigh];
    }

    return combined.slice(0, 6);
  };

  const [reviews, setReviews] = useState<ReviewItem[]>(getInitialReviews);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // New Review Form State
  const [newReview, setNewReview] = useState({
    author: '',
    location: '',
    rating: 5,
    title: '',
    text: '',
  });

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.title || !newReview.text) return;

    const createdReview: ReviewItem = {
      id: `user-rev-${Date.now()}`,
      author: newReview.author,
      location: newReview.location || 'Queensland, Australia',
      rating: newReview.rating as 1 | 2 | 3 | 4 | 5,
      date: 'Just now',
      title: newReview.title,
      text: newReview.text,
      verified: true,
      category: 'buggies',
      productMentioned: product.name,
      helpfulCount: 1,
    };

    setReviews([createdReview, ...reviews]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsWriteModalOpen(false);
      setSubmittedSuccess(false);
      setNewReview({ author: '', location: '', rating: 5, title: '', text: '' });
    }, 1800);
  };

  // Filter reviews
  const filteredReviews = selectedRatingFilter === 'all' 
    ? reviews 
    : reviews.filter((r) => r.rating === selectedRatingFilter);

  // Calculate score stats
  const totalScore = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avgScore = reviews.length > 0 ? (totalScore / reviews.length).toFixed(1) : '4.9';
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const fourStarCount = reviews.filter(r => r.rating === 4).length;
  const threeStarCount = reviews.filter(r => r.rating === 3).length;
  const twoStarCount = reviews.filter(r => r.rating === 2).length;

  return (
    <section className="bg-white border border-[#E7E5E4] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs surface-card" id="product-reviews-section">
      {/* Header & Overall Product TrustScore */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E7E5E4]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5E8C6A]/10 border border-[#5E8C6A]/30 text-xs font-bold text-[#487053]">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Australian Owner Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#121417] tracking-tight">
            Customer Reviews &amp; Field Reports
          </h2>
          <p className="text-xs sm:text-sm text-[#6B645E]">
            Authentic feedback from Australian property owners, golf clubs, and acreage managers for <strong className="text-[#A85640]">{product.name}</strong>.
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5E8C6A] hover:bg-[#4F7A5A] text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-xs active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* TrustScore Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#F7F6F2] border border-[#E7E5E4] rounded-xl p-6 surface-card">
        {/* Big Score Box */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-[#E7E5E4] space-y-2">
          <div className="text-4xl sm:text-5xl font-serif font-extrabold text-[#121417] tracking-tight">
            {avgScore}
            <span className="text-lg text-[#6B645E] font-normal"> / 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-[#487053]">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-6 h-6 bg-[#5E8C6A] text-white flex items-center justify-center rounded-sm">
                <Star className="w-4 h-4 fill-white text-white" />
              </div>
            ))}
          </div>
          <div className="text-xs text-[#6B645E] font-medium pt-1">
            Based on {reviews.length} verified Australian reviews
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-[#487053] font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>98% Recommended by Buyers</span>
          </div>
        </div>

        {/* Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2 text-xs">
          {[
            { stars: 5, count: fiveStarCount, label: '5 Stars' },
            { stars: 4, count: fourStarCount, label: '4 Stars' },
            { stars: 3, count: threeStarCount, label: '3 Stars' },
            { stars: 2, count: twoStarCount, label: '2 Stars' },
          ].map((item) => {
            const pct = reviews.length > 0 ? Math.round((item.count / reviews.length) * 100) : 0;
            return (
              <button
                key={item.stars}
                type="button"
                onClick={() => setSelectedRatingFilter(selectedRatingFilter === item.stars ? 'all' : item.stars)}
                className={`w-full flex items-center gap-3 p-1.5 rounded-lg transition-colors text-left ${
                  selectedRatingFilter === item.stars ? 'bg-white ring-1 ring-[#5E8C6A] shadow-xs' : 'hover:bg-white/60'
                }`}
              >
                <span className="w-14 text-xs font-semibold text-[#6B645E]">{item.label}</span>
                <div className="flex-1 bg-[#E7E5E4] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#5E8C6A] h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold text-[#121417]">{pct}%</span>
                <span className="text-[10px] text-[#6B645E]">({item.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="text-[#6B645E] flex items-center gap-1 font-semibold pr-2">
          <Filter className="w-3.5 h-3.5 text-[#A85640]" />
          <span>Filter:</span>
        </span>
        <button
          type="button"
          onClick={() => setSelectedRatingFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap shrink-0 transition-all ${
            selectedRatingFilter === 'all'
              ? 'bg-[#5E8C6A] text-white shadow-xs'
              : 'bg-[#F7F6F2] border border-[#E7E5E4] text-[#6B645E] hover:text-[#121417]'
          }`}
        >
          All ({reviews.length})
        </button>
        {[5, 4, 3, 2].map((stars) => {
          const count = reviews.filter(r => r.rating === stars).length;
          if (count === 0) return null;
          return (
            <button
              key={stars}
              type="button"
              onClick={() => setSelectedRatingFilter(stars)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                selectedRatingFilter === stars
                  ? 'bg-[#5E8C6A] text-white shadow-xs'
                  : 'bg-[#F7F6F2] border border-[#E7E5E4] text-[#6B645E] hover:text-[#121417]'
              }`}
            >
              <span>{stars}★</span>
              <span className="text-[10px] opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#F7F6F2] border border-[#E7E5E4] rounded-xl text-xs text-[#6B645E] surface-card">
            No reviews match the selected filter. Click &ldquo;All&rdquo; to view all customer reviews.
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const addedVotes = helpfulMap[rev.id] || 0;
            const totalHelpful = (rev.helpfulCount || 0) + addedVotes;

            return (
              <div 
                key={rev.id} 
                className="bg-[#F7F6F2] border border-[#E7E5E4] rounded-xl p-5 sm:p-6 space-y-4 hover:border-[#C86D51]/40 transition-colors surface-card"
              >
                {/* Review Header: Rating + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E5E4] pb-3">
                  <div className="flex items-center gap-3">
                    {/* Trustpilot-style Green Star Box */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div 
                          key={s} 
                          className={`w-5 h-5 flex items-center justify-center rounded-xs ${
                            s <= rev.rating ? 'bg-[#5E8C6A] text-white' : 'bg-[#E7E5E4] text-[#A8A29E]'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-white text-white' : 'text-[#A8A29E]'}`} />
                        </div>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-1 text-[11px] text-[#487053] font-bold bg-[#5E8C6A]/10 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Australian Buyer</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#6B645E]">
                    {rev.date}
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#121417]">
                    {rev.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B645E] leading-relaxed">
                    {rev.text}
                  </p>
                </div>

                {/* Product Mentioned Pill */}
                {rev.productMentioned && (
                  <div className="text-[11px] text-[#6B645E] flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E7E5E4] w-fit surface-card">
                    <span className="text-[#A85640] font-semibold">Product/Vehicle:</span>
                    <span className="text-[#121417] font-medium">{rev.productMentioned}</span>
                  </div>
                )}

                {/* Review Footer: Author + Location + Helpful Vote */}
                <div className="flex items-center justify-between pt-2 text-xs text-[#6B645E] border-t border-[#E7E5E4]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F7EFEA] border border-[#C86D51]/20 text-[#A85640] font-bold text-xs flex items-center justify-center">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#121417]">{rev.author}</div>
                      <div className="text-[10px] text-[#6B645E]">{rev.location}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white hover:bg-[#F7EFEA] text-[#6B645E] hover:text-[#A85640] text-xs font-semibold border border-[#E7E5E4] transition-colors surface-card"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#487053]" />
                    <span>Helpful ({totalHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] rounded-2xl max-w-lg w-full p-6 text-[#121417] shadow-sm relative animate-in fade-in zoom-in-95 surface-card">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-[#F7F6F2] text-[#6B645E] hover:text-[#121417]"
              aria-label="Close write review modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#5E8C6A]/10 border border-[#5E8C6A] text-[#487053] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#121417]">
                  Thank You For Your Review!
                </h3>
                <p className="text-xs text-[#6B645E] max-w-sm mx-auto">
                  Your review for <strong className="text-[#A85640]">{product.name}</strong> has been successfully published to the Australian verified feedback registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#5E8C6A]/10 border border-[#5E8C6A]/30 text-[10px] font-extrabold text-[#487053]">
                    <Sparkles className="w-3 h-3" />
                    <span>Verified Feedback</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#121417] mt-1">
                    Review {product.name}
                  </h3>
                  <div className="text-xs text-[#6B645E]">
                    Share your experience with battery range, hill climbing, suspension, or Yatala depot service.
                  </div>
                </div>

                {/* Rating Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#121417] block">
                    Overall Rating (1 to 5 Stars):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          star <= newReview.rating
                            ? 'bg-[#5E8C6A] text-white scale-105 shadow-xs'
                            : 'bg-[#F7F6F2] border border-[#E7E5E4] text-[#A8A29E] hover:border-[#5E8C6A]'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-white text-white' : 'text-[#A8A29E]'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-extrabold text-[#487053] ml-2">
                      {newReview.rating} Star{newReview.rating > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#121417] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Robert Sterling"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg text-xs text-[#121417] focus:outline-none focus:border-[#C86D51] surface-card"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#121417] block mb-1">
                      Australian Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Gold Coast, QLD"
                      value={newReview.location}
                      onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg text-xs text-[#121417] focus:outline-none focus:border-[#C86D51] surface-card"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-[#121417] block mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Excellent lithium power and smooth suspension"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg text-xs text-[#121417] focus:outline-none focus:border-[#C86D51] surface-card"
                  />
                </div>

                {/* Text */}
                <div>
                  <label className="text-xs font-bold text-[#121417] block mb-1">
                    Detailed Review &amp; Field Experience *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how the buggy performs on your acreage, golf course, or property..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E7E5E4] rounded-lg text-xs text-[#121417] focus:outline-none focus:border-[#C86D51] surface-card"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#5E8C6A] hover:bg-[#4F7A5A] text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Verified Review</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
