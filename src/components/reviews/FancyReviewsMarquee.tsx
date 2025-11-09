import { Star, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface FancyReviewsMarqueeProps {
  reviews: google.maps.places.PlaceReview[];
  rating?: number;
  totalReviews?: number;
}

export function FancyReviewsMarquee({ reviews, rating, totalReviews }: FancyReviewsMarqueeProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.05),transparent_50%)]" />
      
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <svg className="h-12 w-12" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                What Families Are Saying
              </h2>
              <p className="text-lg text-slate-600 font-medium mt-1">Real reviews from real families</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-10 w-10 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="text-4xl font-bold text-slate-900">
                {rating?.toFixed(1) || '5.0'}
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {totalReviews?.toLocaleString() || reviews.length} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Infinite Scrolling Review Marquee - First Row */}
        <div className="relative mb-8">
          <div className="flex gap-6 animate-scroll-left hover:pause-animation">
            {[...reviews, ...reviews].map((review, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex-shrink-0 w-[400px] group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-slate-100 h-full hover:shadow-2xl hover:scale-105 hover:border-blue-200 transition-all duration-300 hover:rotate-1">
                  {/* Star Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < (review.rating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <Badge className="bg-blue-600 text-white border-0 gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 leading-relaxed mb-6 line-clamp-4">
                    "{review.text}"
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <Avatar className="h-12 w-12 border-2 border-blue-100 ring-2 ring-blue-50">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                        {review.author_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'R'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        {review.author_name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{review.relative_time_description || 'Recent'}</span>
                        <svg className="h-3 w-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Reverse Direction */}
        {reviews.length > 3 && (
          <div className="relative mb-12">
            <div className="flex gap-6 animate-scroll-right hover:pause-animation">
              {[...reviews.slice().reverse(), ...reviews.slice().reverse()].map((review, idx) => (
                <div
                  key={`row2-${idx}`}
                  className="flex-shrink-0 w-[400px] group"
                >
                  <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 shadow-xl border-2 border-slate-100 h-full hover:shadow-2xl hover:scale-105 hover:border-purple-200 transition-all duration-300 hover:-rotate-1">
                    {/* Star Rating */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < (review.rating || 0)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className="bg-purple-600 text-white border-0 gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>

                    {/* Review Text */}
                    <p className="text-slate-700 leading-relaxed mb-6 line-clamp-4">
                      "{review.text}"
                    </p>

                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                      <Avatar className="h-12 w-12 border-2 border-purple-100 ring-2 ring-purple-50">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                          {review.author_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'R'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {review.author_name || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{review.relative_time_description || 'Recent'}</span>
                          <svg className="h-3 w-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
