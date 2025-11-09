import { useState, useEffect } from "react";
import { Star, TrendingUp, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SpotlightReviewCarouselProps {
  reviews: google.maps.places.PlaceReview[];
  rating?: number;
  totalReviews?: number;
  intervalMs?: number; // Time between review transitions
}

export function SpotlightReviewCarousel({ 
  reviews, 
  rating, 
  totalReviews,
  intervalMs = 6000 
}: SpotlightReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCount, setDisplayCount] = useState(1);

  const total = totalReviews || reviews.length;

  // Sort reviews to prioritize those with profile photos
  const sortedReviews = [...reviews].sort((a, b) => {
    const aHasPhoto = !!a.profile_photo_url;
    const bHasPhoto = !!b.profile_photo_url;
    if (aHasPhoto && !bHasPhoto) return -1;
    if (!aHasPhoto && bHasPhoto) return 1;
    return 0;
  });

  // Positive keywords to highlight
  const positiveKeywords = {
    // Emotional/Relationship words
    'amazing': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    'wonderful': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    'fantastic': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    'excellent': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    'outstanding': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    'exceptional': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    'incredible': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    'brilliant': 'bg-amber-100 text-amber-800 px-1 rounded font-semibold',
    
    // Trust/Comfort words
    'caring': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'compassionate': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'understanding': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'patient': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'kind': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'supportive': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'dedicated': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'professional': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'knowledgeable': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    'experienced': 'bg-blue-100 text-blue-800 px-1 rounded font-semibold',
    
    // Results/Impact words
    'helped': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    'helping': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    'improved': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    'progress': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    'healing': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    'transformative': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    'life-changing': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    'breakthrough': 'bg-green-100 text-green-800 px-1 rounded font-semibold',
    
    // Recommendation words
    'recommend': 'bg-purple-100 text-purple-800 px-1 rounded font-semibold',
    'highly': 'bg-purple-100 text-purple-800 px-1 rounded font-semibold',
    'grateful': 'bg-purple-100 text-purple-800 px-1 rounded font-semibold',
    'thankful': 'bg-purple-100 text-purple-800 px-1 rounded font-semibold',
    'blessed': 'bg-purple-100 text-purple-800 px-1 rounded font-semibold',
  };

  // Function to highlight positive keywords in text
  const highlightText = (text: string) => {
    const words = text.split(/(\s+|[.,!?;:])/);
    
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
      const punctuation = word.match(/[.,!?;:]$/)?.[0] || '';
      
      if (positiveKeywords[cleanWord]) {
        return (
          <span key={index} className={positiveKeywords[cleanWord]}>
            {word.replace(/[.,!?;:]$/g, '')}
          </span>
        );
      }
      
      return word;
    });
  };

  useEffect(() => {
    if (!sortedReviews || sortedReviews.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      // After fade out, change review
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedReviews.length);
        setDisplayCount((prev) => (prev % total) + 1);
        setIsAnimating(false);
      }, 400); // Smoother, quicker transition
      
    }, intervalMs);

    return () => clearInterval(interval);
  }, [sortedReviews, intervalMs, total]);

  if (!sortedReviews || sortedReviews.length === 0) return null;

  const currentReview = sortedReviews[currentIndex];
  
  // Calculate "heat" level based on total reviews
  const getHeatLevel = () => {
    if (total >= 100) return { level: 'fire', color: 'from-orange-600 to-red-600', icon: Flame };
    if (total >= 50) return { level: 'hot', color: 'from-amber-600 to-orange-600', icon: TrendingUp };
    return { level: 'warm', color: 'from-blue-600 to-purple-600', icon: Star };
  };

  const heat = getHeatLevel();
  const HeatIcon = heat.icon;

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Simplified Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          What Families Are Saying
        </h2>
        <p className="text-base text-slate-500">Real reviews from real families</p>
      </div>

      {/* Spotlight Review Card */}
      <div 
        className={`transition-all duration-700 ease-in-out ${
          isAnimating 
            ? 'opacity-0 translate-y-4' 
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="relative bg-white rounded-2xl p-8 sm:p-12 shadow-xl">
          {/* Review Text - THE STAR OF THE SHOW */}
          <blockquote className="mb-10">
            <p className="text-base sm:text-lg font-normal text-slate-600 leading-relaxed italic">
              "{highlightText(currentReview.text)}"
            </p>
          </blockquote>

          {/* Reviewer Info - Prominent Avatar */}
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 border-3 border-blue-100 shadow-lg">
              {currentReview.profile_photo_url && (
                <AvatarImage src={currentReview.profile_photo_url} alt={currentReview.author_name || 'Reviewer'} />
              )}
              <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl">
                {currentReview.author_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'R'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold text-lg text-slate-900 mb-1">
                {currentReview.author_name || 'Anonymous'}
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>{currentReview.relative_time_description || 'Recent'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dots - Compact */}
      <div className="flex justify-center gap-2 mt-8">
        {sortedReviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setDisplayCount(idx + 1);
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-8 h-2.5 bg-gradient-to-r from-blue-600 to-purple-600'
                : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`View review ${idx + 1}`}
          />
        ))}
      </div>

      {/* Social Proof Footer - Minimal */}
      <div className="text-center mt-8">
        <p className="text-slate-500 text-sm">
          Join <span className="font-semibold text-slate-700">{total.toLocaleString()}</span> families who shared their experience
        </p>
      </div>
    </div>
  );
}
